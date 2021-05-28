<template>
   
    <el-container class="home_container">
      <!-- 头部区域 -->
  <el-header height="100px">
    <div ><img src="../assets/header1.jpg" alt=""><span>基于web的电商设计开发平台</span></div>
  </el-header>
      <!-- 页面主题区域 -->
  <el-container>
    <!-- 侧边栏区域 -->
    <el-aside width="100px">
       <div class="toggle-botton" @click="toggleCollapse">|||</div>
     
       <el-menu
      background-color="#698B69"
      text-color="#fff"
      active-text-color="#B4EEB4"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition='false' 
      :router="true"
      :default-active= "activePath">
     
       <!-- 一级菜单区域 -->
       <!-- index 只能接收字符串，最简单的方法是字符串拼接 -->
      <el-submenu :index="item.id + ''" v-for="item in menuList " :key="item.id">
        <template slot="title">
          <!-- 图标 -->
          <i :class=" iconsObj[item.id]" ></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>

         <!-- 二级菜单区域 -->
        <el-menu-item :index="'/'+subItem.path" 
        v-for="subItem in item.children" :key="subItem.id"
        @click="saveNavState('/'+subItem.path)">
        <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{subItem.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
      
    </el-menu>
      <el-button type="info"   circle><router-link to='/welcome'>首页</router-link></el-button>
      <el-button type="info" @click ="logout" circle>退出</el-button>
 

    </el-aside>
    <!-- 内容区域 -->
    <el-main>
      <router-view>

      </router-view>
    </el-main>
  </el-container>
</el-container>


</template>

<script>
export default {
  data(){
    return{
      // 左侧菜单数据
      menuList:[],
      // 侧边栏图片
      iconsObj:{
        125:'iconfont icon-user',
        103:'iconfont icon-tijikongjian',
        101:'iconfont icon-shangpin',
        102:'iconfont icon-danju',
        145:'iconfont icon-baobiao',

      },
      // 是否折叠
      isCollapse:false,
      // 被激活的链接地址
      activePath:''
    }

  },
  created() {
    // 获取左侧菜单数据
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    
    logout(){
      //清空token
      window.sessionStorage.clear();
      // 编程式导航定位在 login登录页
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList(){
      const {data:res } = await this.$http.get('menus')
      if(res.meta.status !==200) return this.$message.error(res)
      this.menuList = res.data
      // console.log(res)
    },
    toggleCollapse(){
      this.isCollapse = ! this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activepath',activePath)
      this.activePath = activePath
    }

  },
  
}
</script>

<style lang="less" scoped>
  .home_container{
    width: 100%;
    height: 100%;
  }
  .el-header{
    overflow: hidden;
    background-color: #698B69;
    display: flex;
    justify-content:center;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    >div{
      height: 100px;
      display: flex;
      align-items: center;
      span{
        margin-left: 15px;
        color: #fff;
        font-size: 50px;
      }
    }

  }
  .el-aside{
    background-color: #698B69;
    .el-menu{
      border-right: none; 
      background-color: #B4EEB4;

    }
  }
  .el-main{
    background-color: #eaedf1;
  }
  .iconfont{
    margin-right:10px;
  }

  .toggle-botton{
    background-color: #218868;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    
  }
  img {
      height: 80px;
      width: 80px;
      border-radius: 50%;
      background-color: #eee;
    }
  .el-button{
     margin: 15px;
     background-color: #218868;
  }
  .el-submenu{
    display: none;
  }

</style>