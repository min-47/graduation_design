<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 提示区 -->
        <el-alert
          title="添加商品信息"
          type="warning"
          effect="dark"
          center>
        </el-alert>

       <!-- 步骤条 -->
        <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
          <el-step title="基本信息" icon="el-icon-s-comment"></el-step>
          <el-step title="商品参数" icon="el-icon-menu"></el-step>
          <el-step title="商品属性" icon="el-icon-s-operation"></el-step>
          <el-step title="商品图片"  icon="el-icon-picture"></el-step>
          <el-step title="商品内容"  icon="el-icon-folder-opened"></el-step>
          <el-step title="完成"   icon="el-icon-finished"></el-step>
      </el-steps>
    <el-form :model="addForm" :rules="addFormRules"  label-width="100px" label-position='top' >
      <!-- 左侧tabs区域 -->
      <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTableLeave" @tab-click="tabClicked">
        <el-tab-pane label="基本信息" name="0">基本信息 
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>

            <el-form-item label="商品价格" prop="goods_prcie">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>

            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品分类"  prop="goods_cat">
              <!-- 选择商品分类的级联选择器 -->
              <el-cascader
                    v-model="addForm.goods_cat"
                    :options="cateList"
                    :props="cateProps "
                    clearable
                    @change="handleChanged ">
                  </el-cascader>
            </el-form-item>

      </el-tab-pane>

      <el-tab-pane label="商品参数" name="1">商品参数 
        <!-- 渲染表单Item项 -->
        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals" >

              <el-checkbox :label="cb" v-for="(cb, index) in item.attr_vals" :key="index" border></el-checkbox>
               
            </el-checkbox-group>
        </el-form-item>
            
      </el-tab-pane>

      <el-tab-pane label="商品属性" name="2">商品属性
        
        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
          <el-input v-model="item.attr_vals"></el-input>
        </el-form-item> 
 
      </el-tab-pane>

      <el-tab-pane label="商品图片" name="3">商品图片
        <!-- action 表示图片上传到后台的API地址 -->
        <el-upload
          class="upload-demo"
          :action="uploadURL"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          list-type="picture"
          :headers ="headerObj"
          :on-success="handleSuccess">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
 
      </el-tab-pane>

      <el-tab-pane label="商品内容" name="4">商品内容 
        <!-- 富文本编辑组件 -->
          <quill-editor
   
            v-model="addForm.goods_introduce"
          
          />
        
      </el-tab-pane>

      <el-tab-pane label="商品完成" name="5">  
          <el-button type="primary" class="addBtn" @click="add">确认添加商品</el-button>
      </el-tab-pane>

      </el-tabs>
    </el-form>
  </el-card>

  <!-- 预览图片对话框 -->
  <el-dialog
  title="图片预览"
  :visible.sync="previewVisible"
  width="80%"
   >
  <img :src="previewPath" class="previewImg"> 
   
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 步骤条激活区
      activeIndex: '0',
      // 添加商品表单的数据
      addForm:{
        goods_name:'',
        goods_price:0,
        goods_weight:0,
        goods_number:0,
        // 商品所属的分类数组
        goods_cat:[],
        // 商品所属的分类数组
        pics:[],
        // 商品的详细介绍
        goods_introduce:''
      },
      
      // 表单的校验规则
      addFormRules:{
        goods_name:[
          {required: true, message:'请输入商品名称', trigger: 'blur'}
        ],
         goods_price:[
          {required: true, message:'请输入商品价格', trigger: 'blur'}
        ],
         goods_weight:[
          {required: true, message:'请输入商品重量', trigger: 'blur'}
        ],
         goods_number:[
          {required: true, message:'请输入商品数量', trigger: 'blur'}
        ],
        goods_cat:[
          {required: true, message:'请选择商品分类', trigger: 'blur'}
        ],
        
      },
      
      // 获取的数据
      cateList:[],
      // 添加级联选择器
      cateProps:{
      expandTrigger:"hover",
      value:'cat_id',
      label:'cat_name',
      children:'children',
      checkStrictly:true
     },
     // 动态参数的数据
      manyTableData:[],
      // 静态属性的数据s
      onlyTableData:[],
      // 上传图片地址
      uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求对象
      headerObj:{
        Authorization:
        window.sessionStorage.getItem('token')
      },
      // 图片预览的路径
      previewPath:' ',
      // 图片预览对话框 的显示与隐藏
      previewVisible:false

      
    }
  },

  created() {
    // 获取所有商品列表数据
    this.getCateList()
  },

  methods: {
    //获取所有商品列表数据
    async getCateList(){
     const {data: res} = await this.$http.get('categories')
     if(res.meta.status !==200){
       return this.$message.error('获取商品分类失败')
     }
    //  console.log(res.data);
    // 把数据列表，赋值给cateList
    this.cateList = res.data
    // 为总数据赋值条数
    // this.total = res.data.total
    console.log(this.cateList);

    },
    // 级联选择框选中项变化，会触及这个函数
     handleChanged(){
      //  解决切换tabs id的自动变换
      // this.getParamsData()
      console.log(this.cateList)
      if(this.addForm.goods_cat.length !==3){
        this.addForm.goods_cat = []
      }

    },
    // tab切换之前的预校验
    beforeTableLeave(activeName,oldActiveName){
      if(oldActiveName ==='0'&&this.addForm.goods_cat.length !==3){
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 跳转后校验
      async tabClicked(){
      if(this.activeIndex ==='1') {
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}})
      if(res.meta.status !=200){
      return this.$message.error('获取动态参数失败')
      }
      res.data.forEach( item => {
        item.attr_vals=item.attr_vals.length ==0?[]:item.attr_vals.split(',') 
        })
      this.manyTableData = res.data
      console.log(res.data)

      } else if(this.activeIndex ==='2'){
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}})
      if(res.meta.status !=200){
      return this.$message.error('获取静态属性失败')
      }
      // res.data.forEach( item => {
      //   item.attr_vals = item.attr_vals
      //   })
      this.onlyTableData = res.data
      console.log(res.data)


      }
    },
    // 处理图片预览效果
    handlePreview(file){
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
      
    },
    //处理移除图片效果
    handleRemove(file) {
      /**
       * 获取将要删除的图片的临时路径
       *从pics 数组中 找到这个图片骗 对应的索引值
       *调用 数组splice方法 把图片信息对象 从pics数组中移除
       */
      // 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 从pics 数组中 找到这个图片 对应的索引值
      const i = this.addForm.pics.findIndex( x => x.pic ===filePath )
      // 调用 数组splice方法 把图片信息对象 从pics数组中移除
      this.addForm.pics.splice(i,1)
      console.log(this.addForm);

    },
    // 监听图片上传成功的事件
    handleSuccess(response){
      console.log(response)
      // 1 拼接得到一个图片信息对象
      const picInfo = {
        pic: response.data.tmp_path
      }
      // 2. 将图片信息对象 push到 pics 数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm);

    },
    // 添加商品成功按钮
    add(){
      this.$message.success('添加商品成功')
    }


    
  },
  computed :{
     cateId() {
      return this.addForm.goods_cat.length ===3? this.addForm.goods_cat[2]:null
      

    },
  }
}
</script>

<style lang="less" scoped>
  .el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
  }
  .el-table {
    margin-top: 15px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
  }
  .el-tag{
    margin: 10px;
  }

  .el-checkbox{
    margin :0 10px 0 0!important;
  }
  .previewImg{
    width: 100%;
  }
  .addBtn{
    text-align: center;
  }
</style>