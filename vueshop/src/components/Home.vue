<template>
  <div>
    home组件
    <el-button type="info" @click="logout">
      退出
    </el-button>
  </div>
</template>

<script>
export default {
  methods: {
    
    logout(){
      //清空token
      window.sessionStorage.clear();
      // 编程式导航定位在 login登录页
      this.$router.push('/login')
    }
  },
  
}
</script>

<style lang="less" scoped>

</style>