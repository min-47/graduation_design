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
      <h1>折线图统计</h1>
    <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>

    <el-card>
      <h1>南丁格尔图统计</h1>
    <div id="main2" style="width: 600px;height:400px;"></div>
      <div></div>
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
   
      
    var myChart2 = echarts.init(document.getElementById('main2'))

    //  4 准备数据和配置项
     var option = {
    backgroundColor: '#2c343c',
    visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
            colorLightness: [0, 1]
        }
    },
    series : [
        {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            data:[
                {value:235, name:'其他'},
                {value:274, name:'西部'},
                {value:310, name:'华北'},
                {value:335, name:'华南'},
                {value:400, name:'华东'}
            ],
            roseType: 'angle',
            label: {
                normal: {
                    textStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    }
                }
            },
            labelLine: {
                normal: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: '#698B69',
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

       

    // 5 展示数据
    myChart.setOption(res.data)
    myChart2.setOption(option)

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