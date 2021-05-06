<template>
  <div>
      
      <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    
    <!-- 添加商品按钮 -->
    <el-row :gutter="10">
         <el-col :span="6">
           <el-button type="primary" @click="showAddCateDialog">添加商品分类</el-button>
         </el-col>
    </el-row>

    <!-- 卡片区域 -->
      <el-card>
       <!-- 表格 -->
          <!--  selection-type 复选框属性    
       expand-type全展开属性  show-index是否显示数据索引
        index-text自定义项目索引名称 
        border 是否显示边框-->
       <tree-table :data="cateList" :columns ="columns" 
       :selection-type="false"
        :expand-type='false' 
        show-index  index-text="#" border>

          <!-- 排序 -->
          <template slot="isok" slot-scope="scope">
            <div>
              <!-- {{scope.row}} -->
              <i v-if="!scope.row.cat_deleted" class="el-icon-success" style="color:lightblue"></i>
              <i  v-else class="el-icon-error" style="color:red"></i>
            </div>
          </template>

          <!-- 排序 -->
          <template slot-scope="scope" slot="order">
            <div>
              <el-tag size="mini" type="primary" v-if="scope.row.cat_level===0">一级</el-tag>
              <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
              <el-tag size="mini" type="warning" v-else>三级</el-tag>
            </div>
          </template>

          <!-- 操作 -->
        <template  slot-scope="scope" slot="opt">
              <!-- {{scope.row}} -->
              <el-button type="primary" icon="el-icon-search">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete">删除</el-button>
          </template>
       </tree-table>
       
        <!-- 分页区域 -->
         <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
        title="添加商品分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="addCateDialogClosed"
         >
       
          <!-- 添加分类的表单 -->
          <el-form :rules="addCateFormRules" :model="addCateForm" ref="addCateFormRef" label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model=" addCateForm.cat_name" prop="cat_name"></el-input>
            </el-form-item>

            <el-form-item label="父级分类" prop="cat_name">
              <!-- options是用来指定数据源的 -->
              <!-- props 是用来指定对象的 -->
              <el-cascader
                v-model="selectedKeys"
                :options="parentCateList"
                :props="cascaderProps "
                clearable
                @change="parentCateChanged ">
              </el-cascader>
            </el-form-item>
            </el-form>
          <span slot="footer" class="dialog_footer">

            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
          </span>
        
    </el-dialog>
 
    
    

  </div>

  
</template>

<script>
export default {
  data() {
    return {
      queryInfo:{
        type:3,
        pagenum: 1,
        pagesize: 10
      },
      // 商品分类的数据列表，默认为空
      cateList:[],
      // 默认商品总条数 为0
      total:0,
      // 为table 指定列的定义
      columns:[
        {
          label:'分类名称',
          prop:'cat_name'
        },{
          label:'是否有效',
           
          // 表示将当前定义为模板列
          type:'template',
          // 表示当前这一列使用模板名称
          template:'isok'
        },{
          label:'排序',
          // 表示将当前定义为模板列
          type:'template',
          // 表示当前这一列使用模板名称
          template:'order'
        },{
          label:'操作',
          // 表示将当前定义为模板列
          type:'template',
          // 表示当前这一列使用模板名称
          template:'opt'
        }
      ],
      // 控制添加商品用户的显示与隐藏
      addCateDialogVisible:false,
      // 添加分类的表单数据对象
      addCateForm:{
        // 将要添加的分类名称
        cat_name:'',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认要添加到是一级分类
        cat_level: 0

      },
      // 添加表单的校验规则
      addCateFormRules:{
        cat_name:[
          {required: true, message:'请输入分类的名称', trigger: 'blur'}
        ]
      },
      // 添加父级分类的列表
      parentCateList:[],
      // 指定级联选择器
      cascaderProps:{
        expandTrigger:"hover",
        value:'cat_id',
        label:'cat_name',
        children:'children',
        checkStrictly:true
      },
      // 选中的父级分类数组
      selectedKeys:[]
      
    }
  },

  created() {
    // 定义获取所有商品分类的函数
    this.getCateList()

    
  },

  methods: {
    // 获取商品分类数据
    async getCateList(){
     const {data: res} = await this.$http.get('categories',{params:this.queryInfo})
     if(res.meta.status !==200){
       return this.$message.error('获取商品分类失败')
     }
    //  console.log(res.data);
    // 把数据列表，赋值给cateList
    this.cateList = res.data.result
    // 为总数据赋值条数
    this.total = res.data.total
    // console.log(this.cateList);

    },
    // 监听pagesize变化
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      // 发起数据请求
      this.getCateList()

    },
    // 监听pageNum变化
    handleCurrentChange(newNum){
      this.queryInfo.pagenum = newNum
      // 发起数据请求
      this.getCateList()
    },
    // 控制显示添加分类对话框
    showAddCateDialog(){
        // 先获取父级对话框
        this.getParentCateList()
        // 在展示对话框
        this.addCateDialogVisible = true
        // 
    },
    // 获取父级分类的数据列表
    async getParentCateList(){
     const {data:res} = await this.$http.get(`categories`,{params:{type:2}})
      if(res.meta.status !==200){
       return this.$message.error('获取父级分类失败')
     }
    //  console.log(res.data);
    this.parentCateList = res.data

    },
    // 选择项发生变化触发这个函数
    parentCateChanged(){
        console.log(this.selectedKeys);
        // 如果selectedKeys 数组中的length 大于0  证明选中了父级分类
        //  反之，就证明没有选中任何父级分类
        if(this.selectedKeys.length >0){
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
           // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
        }else{
          // 父级分类的id
           this.addCateForm.cat_pid = 0
          //  为当前分类的等级赋值
           this.addCateForm.cat_level = 0

        }
       

    },
    //点击按钮添加新的分类
    addCate(){
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async  valid =>{
        if(!valid)return
        const {data:res} = await this.$http.post(`categories`,this.addCateForm)
        if(res.meta.status !==201){
          return this.$message.error("添加分类失败")
        }
        this.$message.success("添加分类成功")
        this.getCateList()
        this.addCateDialogVisible = false

      })
    },
    // 监听对话框关闭事件 重置表单数据
    addCateDialogClosed(){
      this.$refs.addCateFormRef.resetFields()
      // 将父级名称清空
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
    
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.el-card {
  margin-top: 15px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 20px;
  font-size: 12px;
}
.el-tag {
  margin: 8px;
}
.el-pagination{
  margin-top: 15px;
}
.el-cascader{
  //级联选择器宽度百分之百
  width: 100%;
}
</style>