import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'start',
      component: require('@/components/Index').default
    },
    {
      path: '/info',
      name: 'info',
      component: require('@/components/PluginInfo').default
    },
    {
      path: '/props',
      name: 'props',
      component: require('@/components/PluginProps').default
    },
    {
      path: '/reload',
      name: 'reload',
      component: require('@/components/Reload').default
    },
    {
      path: '/global',
      name: 'global',
      component: require('@/components/GlobalVars').default
    },
    {
      path: '/functions',
      name: 'functions',
      component: require('@/components/Functions').default
    },
    {
      path: '/aces',
      name: 'aces',
      component: require('@/components/ACES').default
    },
    {
      path: '/export',
      name: 'export',
      component: require('@/components/Export').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
