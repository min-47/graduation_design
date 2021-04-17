import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components/user/User'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },

  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
      { path:'/welcome', component:Welcome },
      { path:'/users', component:User, },
      { path:'/rights',component:Rights},
      { path:'/roles',component:Roles},
      ]
  },
 


  
   
]
 

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
/**
 *这里发生一个错误，当把导航守卫放在 const router上方时
 出现beforeEach 未定义。
 
 */

 // 挂载路由导航守卫
 router.beforeEach((to,from,next)=>{
  /**beforeEach
   * to将要访问的路径
   * from代表从哪个路径跳转而来
   * next 是一个函数 表示放行
   * next()放行，next('/login ')强制跳转
   */
  if(to.path ==='/login')return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next();
  })

export default router
