import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'welcome-view',
      component: require('@/components/PluginInfo').default
    },
    {
      path: '/props',
      name: 'info',
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
      path: '*',
      redirect: '/'
    }
  ]
})
