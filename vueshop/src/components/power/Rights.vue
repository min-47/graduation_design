<template>
  <div>
     <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
       <el-table
         :data="rightList" border stripe
         style="width: 100%">
          <el-table-column type="index" label="#" >  </el-table-column>
          <el-table-column  label="权限名称" prop="authName">  </el-table-column>
          <el-table-column  label="路径" prop="path">  </el-table-column>
          <el-table-column  label="权限等级" prop="level">
            <template slot-scope="scope">
              <div>
                <el-tag  v-if="scope.row.level === '0'">一级</el-tag>
                <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag> 
                <el-tag type="warning" v-else>三级</el-tag>
              </div>
            </template>  
          </el-table-column>

       </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表
      rightList:[]

      
    }
  },

  created() {
    // 获取所有的权限
    this.getRightsList()
  },

  methods: {
    // 获取权限列表
    // get 方法返回promise

    async getRightsList(){
       const{data:res} = await  this.$http.get('rights/list')
       if(res.meta.status !=200){
         return this.$message.error('获取权限列表失败')
       }
       this. rightList = res.data
       console.log(this.rightList )
    }
    
    },

}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 20px;
  font-size: 12px;
}
</style>