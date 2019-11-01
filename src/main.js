import Vue from 'vue'

import ElementUI from 'element-ui' //新添加1
import 'element-ui/lib/theme-chalk/index.css' //新添加2，避免后期打包样式不同，要放在import App from './App';之前

import App from './App'
import router from './router'
import store from './store'
// process.env.MOCK && require('@/mock')

import axios from '@/api/http'
import VueAxios from 'vue-axios'


Vue.use(VueAxios, axios)
Vue.use(ElementUI) //新添加3
Vue.config.productionTip = false

// import VideoPlayer from 'vue-video-player'
// Vue.use(VideoPlayer)

// import VideoPlayer from 'vue-video-player'
// require('video.js/dist/video-js.css')
// require('vue-video-player/src/custom-theme.css')
// Vue.use(VideoPlayer)

import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import 'videojs-contrib-hls'
import VideoPlayer from 'vue-video-player'
Vue.use(VideoPlayer);

window.vm = new Vue({

	el: '#app',
	router,
	store, //导入store实例
	components: {
		App
	},
	template: '<App/>'
})
