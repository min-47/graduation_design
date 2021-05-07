<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrdersList">
              <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
            </el-input>
          </el-col>
        </el-row>

        <!-- table 表格区 -->
        <el-table
          :data="orderlist"
          style="width: 100%"
          border stripe>
          <el-table-column type ="index" label="#">
          </el-table-column>

          <el-table-column label="订单编号" prop="order_number" >
          </el-table-column>

          <el-table-column label="是否付款" prop="order_pay" width="95px">
            <template slot-scope="scope">
              <el-tag type="worning" v-if="scope.row.order_pay==='1'">未付款</el-tag>
              <el-tag type="success"  v-if="scope.row.order_pay==='0'">已付款</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="订单价格" prop="order_price"  width="80px">
          </el-table-column>

          <el-table-column label="是否发货" prop="is_send" width="145px" >
            <template slot-scope="scope">
               <el-tag type="success" v-if="scope.row.is_send==='是'">是</el-tag>
               <el-tag type="worning" v-if="scope.row.is_send==='否'">否</el-tag>

            </template>
          </el-table-column>

          <el-table-column label="下单时间" prop="create_time"  width="200px">
            <template slot-scope="scope">
              <div>
              {{scope.row.add_item|date}}
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
      orderlist:[],
      //总数据条数
      total:0
      
    }
  },

  created() {
    this.getOrdersList()
  },

  methods: {
    // 根据分页获得商品列表数据列表
    async getOrdersList() {
        const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      console.log(res.data)
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单列表失败");
      }
      
       return this.$message.success("获取获取列表成功"),
      this.orderlist = res.data.goods,
      this.total = res.data.total
        
       
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize;
      this.getOrdersList();
    },

    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage;

      this.getOrdersList();
      /**
       * 解决bug 翻页后无法搜索商品
       * 重置pagenum = 1
       */
      this.queryInfo.pagenum = 1;
    },
    
  },
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

</style>