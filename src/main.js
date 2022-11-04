import Vue from 'vue'
import App from '@/App'
import uView from 'uview-ui'
import store from '@/store'
import NavLayout from '@/components/layout/nav-layout'

Vue.use(uView)
Vue.component('nav-layout', NavLayout)

Vue.config.productionTip = false
App.mpType = 'app'

// 用于启动屏加载完毕后 执行首页异步方法
// #ifdef APP-PLUS
Vue.prototype.$onLaunched = new Promise(resolve => {
  Vue.prototype.$isResolve = resolve
})
// #endif

const app = new Vue({
  ...App,
  store
})
app.$mount()
