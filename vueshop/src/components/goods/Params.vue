<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
       <el-alert
          title="注意：只允许第三级分类设置相关参数"
          type="warning"
          :closable="false"
          show-icon>
        </el-alert>
      <!-- 选择区域 -->
      <el-row :gutter="10" class="cat_opt">
        
        <el-col :span="6">
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择器 -->
           <el-cascader
                v-model="selecteCatedKeys"
                :options="cateList"
                :props="cateProps "
                clearable
                @change="handleChanged ">
              </el-cascader>
        </el-col>
      </el-row>

      <!-- tabs标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many"> 
          <el-button :disabled="isBtnDisabled" type="primary" size ="mini" class="addBtn" @click="addDialogVisible=true">添加参数</el-button>
          <el-table
            :data="manyTableData"
            style="width: 100%"
            border stripe
            >
            <!-- 展开行 -->
            <el-table-column type="expand"  >
              <template slot-scope="scope">
                  <el-tag type="success" v-for="(item, index) in scope.row.attr_vals" :key="index" closable 
                  @close="handleClose(index,scope.row)"
                  >{{item}}</el-tag>
                  <!-- 输入文本框 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#">
            </el-table-column>

            <el-table-column label="参数名称" prop="attr_name" >
            </el-table-column>

            
            <el-table-column label="操作"  >
              <template slot-scope="scope" >
                <div>
                   <el-button size="mini" type="primary" icon="el-icon-edit"  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                   <el-button size="mini" type="danger" icon="el-icon-delete"  @click="removeParams(scope.row.attr_id)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          </el-tab-pane> 

        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only"> 
          <el-button :disabled="isBtnDisabled" type="primary" size ="mini" class="addBtn"  @click="addDialogVisible=true">添加参数</el-button>
          <el-table
            :data="onlyTableData"
            style="width: 100%"
            border stripe
            >
            <!-- 展开行 -->
            <el-table-column type="expand"  >
              <template slot-scope="scope">
                  <el-tag type="success" v-for="(item, index) in scope.row.attr_vals" :key="index" closable 
                  @close="handleClose(index,scope.row)"
                  >{{item}}</el-tag>
                  <!-- 输入文本框 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#">
            </el-table-column>

            <el-table-column label="属性名称" prop="attr_name" >
            </el-table-column>

            
            <el-table-column label="操作"  >
              <template slot-scope="scope" >
                <div>
                   <el-button size="mini" type="primary" icon="el-icon-edit"  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                   <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          </el-tab-pane> 
      </el-tabs>
          
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <!-- 添加参数的对话框的表单 -->
       <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="150px" class="demo-ruleForm" >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name "></el-input>
        </el-form-item>
       </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="eidtDialogClosed">
      <!--参数的对话框的表单 -->
       <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="150px" class="demo-ruleForm" >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name "></el-input>
        </el-form-item>
       </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click=" editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品分类列表
      cateList:[],
      // 添加级联选择器
      cateProps:{
      expandTrigger:"hover",
      value:'cat_id',
      label:'cat_name',
      children:'children',
      checkStrictly:true
     },
      // 选中的父级分类数组，级联选择框双向绑定到的数据
      selecteCatedKeys:[],
      // tabs 活跃标签
      activeName:'many',
      // 动态参数的数据
      manyTableData:[],
      // 静态属性的数据
      onlyTableData:[],
      // 控制添加对话框的显示与隐藏
      addDialogVisible:false,
      // 添加参数的表单数据对象
      addForm:{
        attr_name:''
      },
      // 添加表单的验证规则对象s
      addFormRules:{
        attr_name:[{required: true, message:'请输入参数名称', trigger: 'blur'}]
      },
      // 控制修改对话框的显示与隐藏
      editDialogVisible:false,
      // 修改的表单数据验证对象
      editForm:{
         attr_name:''
      },
      // 添加表单的验证规则对象s
      editFormRules:{
        attr_name:[{required: true, message:'请输入参数名称', trigger: 'blur'}]
      },
      // 控制按钮与文本框的切换显示 
      inputVisible:false,
      // 文本框中输入的内容
      inputValue:''



      
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList(){
      const {data: res} = await this.$http.get(`categories` )
      if(res.meta.status !==200){
      return this.$message.error('获取商品分类失败')
      }
      //  console.log(res.data);
      // 把数据列表，赋值给cateList
      this.cateList = res.data 
      // 为总数据赋值条数
      
      console.log(this.cateList);

    },
    // 级联选择框选中项变化，会触及这个函数
     handleChanged(){
      //  解决切换tabs id的自动变换
      this.getParamsData()

    },
    // tabs 页签点击事件的处理函数
    handleTabClick(){
      this.getParamsData()
      console.log(this.activeName);
    },
    // 获取参数的类表数据
    async getParamsData() {
       // 证明选中的不是三级分类
      if(this.selecteCatedKeys.length !=3){
        this.selecteCatedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return 
      }
      // 证明选中的是三级分类
      console.log(this.selecteCatedKeys);
      // 根据所选分类的ID 和当前所处的面案，获取对应的参数
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
      if(res.meta.status !=200){
      return this.$message.error('获取参数失败')
      }

      res.data.forEach( item => {
        item.attr_vals=item.attr_vals? item.attr_vals.split(' '):[]
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inpuValue = ''
        })
     

      console.log(res.data);
      if(this.activeName == 'many'){
        this.manyTableData = res.data
      } else{
        this.onlyTableData = res.data
      }

      

    },
    // 监听添加对话框的关闭事件
    addDialogClosed (){
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加参数
    addParams(){
      this.$refs.addFormRef.validate( async valid => {
        if(!valid) return
        const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
          attr_name:this.addForm.attr_name,
          attr_sel:this.activeName

        }) 
        // console.log("获得的数据"+res.data);
        if(res.meta.status !==201){
          return this.$message.error('添加参数失败')
        }
          this.$message.success('添加参数成功')
          this.addDialogVisible = false
          this.getParamsData()

      })

    },
    // 点击按钮 展示修改的对话框
    async showEditDialog(attrId) {
      // 查询当前参数的信息
      const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`,{
        params:{
          attr_sel:this.activeName}
      })
      console.log("修改的信息"+res.data);
       if(res.meta.status !==200){
          return this.$message.error('获取参数信息失败')
        }
          this.$message.success('获取参数信息成功')
          this.editForm = res.data
          this.getParamsData()

      this.editDialogVisible = true

    },
    // 重置修改的表单
    eidtDialogClosed(){
            this.$refs.editFormRef.resetFields()

    },
    // 点击按钮 修改参数信息
    editParams(){
      this.$refs.editFormRef.validate( async valid => {
        if(!valid) return
        const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
          attr_name:this.editForm.attr_name,
          attr_sel:this.activeName

        }) 
        // console.log("获得的数据"+res.data);
        if(res.meta.status !==200){
          return this.$message.error('修改参数失败')
        }
          this.$message.success('修改参数成功')
          this.editDialogVisible = false  
          this.getParamsData()

      })

    },
    async removeParams(attr_id){
       const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error)

        // 用户取消了删除操作
        if(confirmResult !=='confirm') {
          return  this.$message.info('已取消删除')
        }
        // 删除逻辑
        const{data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
        console.log("删除的信息"+res.data);
        if(res.meta.status !==200){
            return this.$message.error('删除参数信息失败')
          }
            this.$message.success('删除参数信息成功')
            // this.editForm = res.data
            this.getParamsData()

        // this.editDialogVisible = true

    },
    // 文本框失去焦点 或摁下enter键都会触发
    async handleInputConfirm(S_row) {
      console.log('ok');
      if(S_row.inputValue.trim().length === 0){
        S_row.inputValue = ''
        S_row.inputVisible = false
        return

      }
      //如果没有return 则证明输入的内容需要实现以下的业务逻辑
      S_row.attr_vals.push(S_row.inputValue.trim())
        S_row.inputValue = ''
        S_row.inputVisible = false
      // 需要发送请求，保存这次操作
      this.saveAtteVals(S_row)

        
       

    },
    // 将对 attr_vals 的操作 保存到数据库
    async saveAtteVals(S_row) {
      // 需要发送请求，保存这次操作
       const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${S_row.attr_id}`,{
          attr_vals: S_row.attr_vals.join(' '),
          attr_sel:S_row.attr_sel,
          attr_name:S_row.attr_name
        })
        if(res.meta.status !==200){
            return this.$message.error('修改参数项失败')
          }
            this.$message.success('删除参数项成功')
            // this.editForm = res.data
            this.getParamsData()
    },
    // 点击按钮，展示文本输入框
    showInput(S_row){
      S_row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick 就是当页面元素被重新渲染之后,才会执行回调函数中的代码
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    handleClose(i,row){
      // 删除对应的参数可选项
      row.attr_vals.splice(i,1)
      this.saveAtteVals(row)
    }
  },
  computed:{
    // 如果按钮需要被禁用，则返回true 否则返回false
    isBtnDisabled() {
      return this.selecteCatedKeys.length !==3?true:false
      },
    // 当前选中的三级分类Id
    cateId() {
      return this.selecteCatedKeys.length ==3?this.selecteCatedKeys[2]:null
      

    },
    // 动态绑定添加对话框
    titleText() {
         return this.activeName ==='many'?"动态参数":"静态属性" 
    },
    
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
  .el-tag{
    margin: 10px;
  }
  .cat_opt {
    margin:15px ;

  }
  .addBtn {
    margin-bottom: 15px;
  }
  .input-new-tag {
    width:150px
  }
</style>