<template>
  <div>
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!--  2 为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1 导入
 import *as echarts from 'echarts'
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
      
    }
  },
  async mounted() {
    // 3  基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

     const { data: res } = await this.$http.get(`reports/type/1`)
      console.log(res.data);
      if (res.meta.status !== 200) {
        return this.$message.error("获取折线图失败")
      }
   
      
    


    //  4 准备数据和配置项
      //  var option = {
      //       title: {
      //           text: 'ECharts 入门示例'
      //       },
      //       tooltip: {},
      //       legend: {
      //           data:['销量']
      //       },
      //       xAxis: {
      //           data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
      //       },
      //       yAxis: {},
      //       series: [{
      //           name: '销量',
      //           type: 'bar',
      //           data: [5, 20, 36, 10, 10, 20]
      //       }]
      //   }

       

    // 5 展示数据
    myChart.setOption(res.data)
  },
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
</style>