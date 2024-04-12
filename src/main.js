import Vue from 'vue'
import App from '@/main.vue'
import router from '@/router'
import store from '@/store'

// 设置 Vue.config.productionTip = false 来关闭生产模式下给出的提示
Vue.config.productionTip = false

// 引入AMap
// import VueAMap from 'vue-amap'
// Vue.use(VueAMap)

// 引入DataV
// import DataV from '@jiaminghi/data-view'
// Vue.use(DataV)

// import '@/assets/fonts/font.css'

// 引入ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-theme-dark'
Vue.use(ElementUI)

// import echarts from 'echarts' //引入echarts
// Vue.prototype.$echarts = echarts //引入组件

const $message = (options) => {
  return ElementUI.Message({
    ...options,
    showClose: true,
  })
}

//重写方法,将offset写入options
;['success', 'warning', 'info', 'error'].forEach((type) => {
  $message[type] = (options) => {
    if (typeof options === 'string') {
      options = {
        message: options,
        showClose: true,
        offset: 65,
      }
    }
    options.type = type
    return ElementUI.Message(options)
  }
})
//将$message挂载到this上
Vue.prototype.$message = $message

// 引入FilePreview
import FilePreview from 'the-file-preview'
Vue.component('file-preview', FilePreview)

// 全局注册通用组件
import titleCmpt from '@/components/titleCmpt.vue'
Vue.component('title-cmpt', titleCmpt)

import tableCmpt from '@/components/tableCmpt.vue'
Vue.component('table-cmpt', tableCmpt)

import formCmpt from '@/components/formCmpt.vue'
Vue.component('form-cmpt', formCmpt)

import pageCmpt from '@/components/pageCmpt.vue'
Vue.component('page-cmpt', pageCmpt)

import dialogCmpt from '@/components/dialogCmpt.vue'
Vue.component('dialog-cmpt', dialogCmpt)

import formDialog from '@/components/formDialog.vue'
Vue.component('form-dialog', formDialog)

import previewCmpt from '@/components/previewCmpt.vue'
Vue.component('preview-cmpt', previewCmpt)

import layoutCmpt from '@/components/layoutCmpt'
Vue.component('layout-cmpt', layoutCmpt)

import drawerCmpt from '@/components/drawerCmpt'
Vue.component('drawer-cmpt', drawerCmpt)
// export const bus = new Vue();

import VideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'

Vue.use(VideoPlayer)

// 引入moment
import moment from 'moment'
Vue.prototype.$moment = moment

// 引入Tdesign
// import TDesign from 'tdesign-vue';
// 引入组件库的少量全局样式变量
// import 'tdesign-vue/es/style/index.css';
// document.documentElement.setAttribute('theme-mode', 'dark');//暗黑模式
// Vue.use(TDesign);

Vue.prototype.$auth = function (param) {
  const userInfo = store.getters.getUserInfo
  if (userInfo && userInfo.permission_list) {
    const hasPermission = userInfo.permission_list.includes(param)
    return hasPermission ? true : false
  } else {
    return false
  }
}

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
