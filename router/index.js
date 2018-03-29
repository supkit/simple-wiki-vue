import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register'
import NotFound from '@/components/NotFound'
import CollectionIndex from '@/components/collection/Index'
import CollectionDebug from '@/components/collection/Debug'
import CollectionWiki from '@/components/collection/Wiki'
import CollectionSetting from '@/components/collection/Setting'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: 'wiki',
  routes: [
    {
      path: '*',
      component: NotFound
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/',
      name: 'CollectionIndex',
      component: CollectionIndex
    },
    {
      path: '/collection/index',
      name: 'CollectionIndex1',
      component: CollectionIndex
    },
    {
      path: '/collection/debug/:id',
      name: 'CollectionDebug',
      component: CollectionDebug
    },
    {
      path: '/collection/wiki/:id',
      name: 'CollectionWiki',
      component: CollectionWiki
    },
    {
      path: '/collection/setting/:id',
      name: 'CollectionSetting',
      component: CollectionSetting
    }
  ]
})
