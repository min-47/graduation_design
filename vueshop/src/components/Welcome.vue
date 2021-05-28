<template>
  <div>
    <h3>您好，欢迎使用该电商平台</h3>
    <h1>用户指南</h1>
    <el-card>
      <el-tabs :tab-position="'left'" style="height: 800px;"  >
        <el-tab-pane label="用户管理">用户管理
          <el-row :gutter="15">
            <el-col :span="8" >
              <el-card :body-style="{ padding: '0px' }">
                <img src="../assets/5p.jpg" alt="" class="image"/>
                <div style="padding: 14px;">
                  <h1><router-link to="/users">用户列表</router-link></h1>
                  <article name="" id="" cols="30" rows="10">
                    <h3>查询用户的姓名 电话 邮箱</h3>
                    <h3>搜索用户的姓名  </h3>
                    <h3>编辑和删除用户</h3> 
                    <h3>添加新用户</h3>
                     
                  </article>
                </div>
              </el-card>
            </el-col>

          </el-row>
        </el-tab-pane>
        <el-tab-pane label="权限管理">权限管理
          <el-row :gutter="15">
            <el-col :span="8" >
              <el-card :body-style="{ padding: '0px' }">
                <img src="../assets/2p.jpg" alt="" class="image"/>
                <div style="padding: 14px;">
                  <h1> <router-link to="roles">角色列表</router-link></h1>
                  <article name="" id="" cols="30" rows="10">
                    <h3>修改用户所属角色下的权限</h3>
                    <h3>分配用户所属角色下的权限</h3>
                     
                     
                  </article>
                </div>
              </el-card>
            </el-col>

            <el-col :span="8" >
              <el-card :body-style="{ padding: '0px' }">
                <img src="../assets/4p.jpg" class="image">
                <div style="padding: 14px;">
                  <h1><router-link to='/rights'>权限列表</router-link></h1>
                  <h3>查询权限等级</h3>
                  <h3>查询权限名称</h3>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="商品管理">商品管理
          <el-row :gutter="15">
            <el-col :span="8" >
              <el-card :body-style="{ padding: '0px' }">
                <img src="../assets/3p.jpg" alt="" class="image"/>
                <div style="padding: 14px;">
                  <h1>
                    <router-link to="/goods" >商品列表</router-link>                   
                  </h1>
                  <article name="" id="" cols="30" rows="10">
                    <h3>查询商品信息</h3>
                    <h3>搜索商品信息</h3>
                    <h3>添加商品信息</h3>
                  </article>
                </div>
              </el-card>
            </el-col>

            <el-col :span="8" >
              <el-card :body-style="{ padding: '0px' }">
                <img src="../assets/6p.jpg" class="image">
                <div style="padding: 14px;">
                  <h1><router-link to='params'>参数列表</router-link></h1>
                  <h3>查询商品动态参数，静态属性</h3>
                  <h3>添加商品动态参数，静态属性</h3>
                  <h3>删除商品动态参数，静态属性</h3>
                </div>
              </el-card>
            </el-col>

            <el-col :span="8" >
              <el-card :body-style="{ padding: '0px' }">
                <img src="../assets/4p.jpg" class="image">
                <div style="padding: 14px;">
                  <h1><router-link to='/categories'>商品分类</router-link></h1>
                  <h3>查询商品三级分类</h3>
                  <h3>添加商品三级分类</h3>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="订单管理">订单管理
          <el-row :gutter="15">
            <el-col :span="8" >
              <el-card :body-style="{ padding: '0px' }">
                <img src="../assets/7p.jpg" alt="" class="image"/>
                <div style="padding: 14px;">
                  <h1><router-link to='/orders'>订单列表</router-link></h1>
                    <h3>查询订单编号</h3>
                    <h3>查询用户是否付款</h3>
                    <h3>查询是否发货</h3> 
                    <h3>查询订单创建时间</h3>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8" >
              <el-card :body-style="{ padding: '0px' }">
                <img src="../assets/4p.jpg" alt="" class="image"/>
                <div style="padding: 14px;">
                  <h1><router-link to='/reports'>订单数据可视化</router-link></h1>
                    <h3>折线图</h3>
                    <h3>南丁格尔图</h3>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="less" scoped>
h3{
  color: #5F9EA0;
  text-align: center;
  font: 20px 200;
  line-height: 18px;
  text-decoration:underline;
}
</style>