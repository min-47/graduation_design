<template>
  <div class="login_container">
    <!-- 头像区域 -->
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/header.jpg" alt="" />
      </div>
        
    <!-- 表单区域 -->
   <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
     <!-- 用户名 -->
     <el-form-item label="" prop="username">
       <el-input  v-model="loginForm.username"  prefix-icon="iconfont icon-user"></el-input>
     </el-form-item>

    <!-- 密码 -->
     <el-form-item prop="password">
      <el-input  type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
     </el-form-item>

     <!-- 按钮区域 -->
    <el-form-item class="btns">
      <el-button type="primary" @click="login">登录</el-button>
      <el-button type="info" @click="resetLoginForm">重置</el-button>
    </el-form-item>

  </el-form>
   </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
       
          // 这是登录表单的数据绑定对象
          loginForm:{
            username:'admin',
            password:'123456',
          },
          // 这是表单验证规则对象
          loginFormRules:{
            // 验证用户名是否合法
            username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          // 验证密码是否合法
           password: [
            { required: true, message: '请输入用户密码', trigger: 'blur' },
            { min: 5, max: 10, message: '长度在 5到 10 个字符', trigger: 'blur' }
          ],

          }
      
    }
  },
  methods: {
    //点击重置按钮，重新登录表单
    resetLoginForm(){
        //  console.log(this)
        this.$refs.loginFormRef.resetFields();
    },
    login(){
      // 匿名函数和箭头函数
      this.$refs.loginFormRef.validate( async valid =>{
        // console.log(valid)
        if(!valid)return;
        // 解构
        const {data:res} = await this.$http.post("login",this.loginForm)
        if(res.meta.status !==200)return  this.$message.error('登陆失败')
        this.$message.success('登陆成功');
        /**
         * 1、将登录成功后的token，保存到客户端的sessionStorge中
         *  1.1 项目中除了登录之外的其他API接口，必须在登陆之后才能访问
         *  1.2 token 只应当在当前网站打开生效，所以进token保存在sessionStorge中
         * 2、通过编程式导航跳转到后台主页，路由地址是/home
         * 
         */
        console.log(res);
        window.sessionStorage.setItem("token",res.data.token);
        this.$router.push('/home');
         /**
          * 在这里解决一个报错问题
          * GET http://192.168.43.185:8080/sockjs-node/info?t=1617552011305
          *  net::ERR_CONNECTION_TIMED_OUT
          * 解决方法：
          * 1）找到/node_modules/sockjs-client/dist/sockjs.js文件
          * 2）在1606行，注释掉self.xhr.send(payload);这一行，然后就可以解决了
          * 原因：
          * sockjs-node是一个JavaScript库，提供跨浏览器JavaScript的API，
          * 创建了一个低延迟、全双工的浏览器和web服务器之间通信通道。
          * 在项目运行以后，network会一直调用这个接口。如果没有使用，
          * 那么就一直会报这个异常。


          */
      });
      /**
       * 实现退出功能
       * 原理：基于token的方式实现退出比较简单，只要销毁本地的token即可
       * 后续的请求不会携带token 
       * 必须重新登录生成一个新的token之后才可以访问页面
       * 
       */
      // 
    }
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  background-image:url(../assets/bgc.jpg) ;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color:#218868;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px, solid, #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    


    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;

}

.btns{
  display: flex;
  justify-content: flex-end;

}
</style>