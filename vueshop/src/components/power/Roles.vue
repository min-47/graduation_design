<template>
  <div>
      <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>

    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色 -->
        <el-row :gutter="10">
          <el-col :span="6">
            <el-button type="primary">添加角色</el-button>
          </el-col>
        </el-row>

        <!-- 角色列表区域 -->
        <el-table
          :data="rolesList"
          style="width: 100%" stripe>
          <!-- 展开列 -->
          <el-table-column type="expand" >
            <template slot-scope="scope">
              <div>
               
                <el-row :class="['bdbottom',i1!==0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                  
                   <!-- 渲染一级权限 -->
                  <el-col :span="5"><el-tag closable  @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 渲染二级权限 -->

                  <el-col :span="19">

                    <!-- 通过for循环 嵌套渲染二级权限 -->
                     <el-row   :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                        <el-col :span="6" >
                         <el-tag closable  @close="removeRightById(scope.row,item2.id)" type="success">{{item2.authName}}</el-tag>
                         <i class="el-icon-caret-right"></i>
                        </el-col> 
                        <!-- 三级权限 -->
                        <el-col :span="18">
                          <el-tag type="warning"
                           v-for="(item3) in item2.children" :key="item3.id" 
                           closable
                           @close="removeRightById(scope.row,item3.id)"
                          >{{item3.authName}}</el-tag>
                        </el-col>
                     </el-row> 

                  </el-col>

                </el-row>                
              </div>
            </template>
          </el-table-column >
          <!-- 索引列 -->
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="400px">

            <template slot-scope="scope" >
              <div>
                <el-button size="mini" type="primary" icon="el-icon-search">搜索</el-button>
                <el-button size="mini" type="danger" icon="el-icon-search"> 编辑</el-button>
                <el-button size="mini" type="warning" icon="el-icon-search"
                @click="showSetRightDilog(scope.row)"
                >分配权限</el-button>
              </div>

            </template>

          </el-table-column>
           
        </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" >
      <!-- 树形控件 -->
      <!-- 只需要获取三级权限的id，默认勾选所在的父级 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色的列表数据
      rolesList:[],
      confirmResult:'',
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible:false,
      // 所有权限的数据
      rightsList:[],
      // 树形控件的绑定对象
      treeProps:{
        label:'authName',
        children:'children'
      },
      // 默认选中节点的id值数组
      defKeys:[],
      // 当前即将分配权限的角色id
      roleId:'',
      
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList(){
      const {data:res} =await  this.$http.get('roles')

      if(res.meta.status !==200){
        return this.$message.error('获取角色列表失败')
      }

      this.rolesList = res.data
      console.log(this.rolesList)
    },
    // 弹框是否要删除权限
       async removeRightById(role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )

      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败！')
      }

      // this.getRolesList()
      // 该函数会直接刷新整个页面。所以直接保存新的权限
      role.children = res.data
    },

    // 展示分配权限的对话框
    async showSetRightDilog(role){
      this.roleId = role.id
      // 获取所有权限的数据
      const {data:res} = await 
      this.$http.get('rights/tree')
      if(res.meta.status !==200){
        return this.$message.error('获取权限数据失败!')
      }
      // 把获取到的数据保存到data中
      this.rightsList = res.data
      console.log(this.rightsList)

      // 每次递归之前清空数组
      this.defKeys=[],

      // 递归获三级节点的id
      this.getLeafKeys(role,this.defKeys)

      this.setRightDialogVisible = true


    },

    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defkeys数组中
    getLeafKeys(node,arr){
      // 如果当前node节点不包含children树形，则是三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item,arr)
        
      });
    },

    //点击树形控件为角色分配权限
    async allotRights(){
      const keys = [
        // 扩展运算符，进行数组拼接
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      // console.log(keys);
      // 使用join函数进行字符串拼接
        const idStr = keys.join(',')
        console.log(idStr);
        const {data:res} = await  this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})

     if(res.meta.status !==200) {
       return this.$message.error('分配权限失败')
     }

     this.$message.success('分配权限成功！')
    //  刷新权限列表
     this.getRolesList()
    //  隐藏对话框
    this.setRightDialogVisible= false

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
.el-tag {
  margin: 8px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>


 