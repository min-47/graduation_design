<template>
  <div>
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
       <el-row :gutter="10">
         <el-col :span="8">
           <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
              <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
            </el-input>

        </el-col>
         <el-col :span="4">
           <el-button type="primary" @click="goodsAddpage">添加商品</el-button>
         </el-col>
       </el-row>

       <!-- table 表格区 -->
        <el-table
          :data="goodslist"
          style="width: 100%"
          border stripe>
          <el-table-column type ="index" label="#">
          </el-table-column>

          <el-table-column label="商品名称" prop="goods_name" >
          </el-table-column>

          <el-table-column label="商品价格（元）" prop="goods_price" width="95px">
          </el-table-column>

          <el-table-column label="商品重量" prop="goods_weight"  width="80px">
          </el-table-column>

          <el-table-column label="创建时间" prop="add_time" width="145px" >
            <template slot-scope="scope">
              {{scope.row.add_item|date}}
              <div>
                
              </div>
            </template>
            
          </el-table-column>

          <el-table-column label="操作" width="130px" >
            <template slot-scope="scope">
              <div>
                <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo:{
        query:'',
        pagenum :1,
        pagesize:10
      },
      // 商品列表
      goodslist:[],
      //总数据条数
      total:0

      
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 根据分页获得商品列表数据列表
    async getGoodsList() {
        const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      console.log(res.data);
      if (res.meta.status !== 200) {
        return this.$message.error("获取列表失败");
      }
      
       return this.$message.success("获取列表成功"),
      this.goodslist = res.data.goods,
      this.total = res.data.total
       
       
    },

    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },

    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage;

      this.getGoodsList();
      /**
       * 解决bug 翻页后无法搜索商品
       * 重置pagenum = 1
       */
      this.queryInfo.pagenum = 1;
    },
    // 删除商品
    async removeById(goods_id){
       const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error)

        // 用户取消了删除操作
        if(confirmResult !=='confirm') {
          return  this.$message.info('已取消删除')
        }
        // 删除逻辑
        const{data:res} = await this.$http.delete(`goods/${goods_id}`)
        console.log("删除的信息"+res.data);
        if(res.meta.status !==200){
            return this.$message.error('删除参数信息失败')
          }
            this.$message.success('删除参数信息成功')
            // this.editForm = res.data
            this.getGoodsList()

        // this.editDialogVisible = true

    },
    // 编程式导航
    goodsAddpage() {
      this.$router.push('/goods/add')
    }
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

</style>