import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Registe from '@/views/Registe'
import AppMain from '@/views/AppMain'
import center from '@/views/center'

import MuLu from '@/views/ren/MuLu'
import MingXi from '@/views/ren/MingXi'
import QuanXian from '@/views/ren/QuanXian'
import JueSe from '@/views/ren/JueSe'

import DengLu from '@/views/ren/DengLu'


import YongHu from '@/views/zou/YongHu'
import Jie from '@/views/zou/Jie'
import JieKuan from '@/views/zou/JieKuan'

import YuanGong from '@/views/zou/YuanGong'
import ZhangHu from '@/views/zou/ZhangHu'
// import AddYuanGong from '@/views/zou/AddYuanGong'

import ShiMing from '@/views/yao/ShiMing'
import ChonZhi from '@/views/yao/ChonZhi'
import CaiLiao from '@/views/yao/CaiLiao'
import TiXian from '@/views/yao/TiXian'
import one from '@/views/yao/one'
import two from '@/views/yao/two'
import FaBiao from '@/views/yao/FaBiao'
import ShiPin from '@/views/yao/ShiPin'


import ZhiLing from '@/views/yao/ZhiLing'


Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Login',
    component: Login
  },
    {
      path: '/Registe',
      name: 'Registe',
      component: Registe
    }, {
      path: '/AppMain',
      name: 'AppMain',
      component: AppMain,
      children: [{
        path: '/center',
        name: 'center',
        component: center
      },
        {
          path: '/ren/MuLu',
          name: 'MuLu',
          component: MuLu
        },
        {
          path: '/ren/MingXi',
          name: 'MingXi',
          component: MingXi
        },
        {
          path: '/ren/QuanXian',
          name: 'QuanXian',
          component: QuanXian
        },
        {
          path: '/ren/JueSe',
          name: 'JueSe',
          component: JueSe
        },
        {
          path: '/ren/DengLu',
          name: 'DengLu',
          component: DengLu
        },
        {
          path: '/zou/YongHu',
          name: 'YongHu',
          component: YongHu
        },
        {
          path: '/zou/Jie',
          name: 'Jie',
          component: Jie
        },
        {
          path: '/zou/JieKuan',
          name: 'JieKuan',
          component: JieKuan
        },
        {
          path: '/zou/YuanGong',
          name: 'YuanGong',
          component: YuanGong
        },
        {
          path: '/zou/ZhangHu',
          name: 'ZhangHu',
          component: ZhangHu
        }
        ,
        {
          path: '/yao/ShiMing',
          name: 'ShiMing',
          component: ShiMing
        },
        {
          path: '/yao/ChonZhi',
          name: 'ChonZhi',
          component: ChonZhi
        },
        {
          path: '/yao/CaiLiao',
          name: 'CaiLiao',
          component: CaiLiao
        },
        {
          path: '/yao/TiXian',
          name: 'TiXian',
          component: TiXian
        }
        ,
        {
          path: '/yao/two',
          name: 'two',
          component: two
        }
        ,
        {
          path: '/yao/one',
          name: 'one',
          component: one
        }
        ,
        {
          path: '/yao/FaBiao',
          name: 'FaBiao',
          component: FaBiao
        }
        ,
        {
          path: '/yao/ShiPin',
          name: 'ShiPin',
          component: ShiPin
        }
        ,
        {
          path: '/yao/ZhiLing',
          name: 'ZhiLing',
          component: ZhiLing
        }
      ]
    }
  ]
});
// 验证token，存在才跳转
// router.beforeEach((to, from, next) => {
//   let token = sessionStorage.getItem('token')
//   if(to.path === '/') {
//     if(!token) {
//       next({
//         path: '/Login',
//         query: { redirect: to.fullPath }
//       })
//       return
//     }
//   }
//
//   if(to.meta.requiresAuth) {
//     if(token) {
//       next()
//     } else {
//       next({
//         path: '/Login',
//         query: { redirect: to.fullPath }
//       })
//     }
//   } else {
//     next()
//   }
// });
