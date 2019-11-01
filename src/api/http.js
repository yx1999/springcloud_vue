/**
 * vue项目对axios的全局配置
 */
import axios from 'axios'
import qs from 'qs'

//引入action模块，并添加至axios的类属性urls上
import action from '@/api/action'
axios.urls = action

// axios默认配置
axios.defaults.timeout = 10000; // 超时时间
// axios.defaults.baseURL = 'http://localhost:8080/j2ee15'; // 默认地址
axios.defaults.baseURL = action.SERVER;

//整理数据
// 只适用于 POST,PUT,PATCH，transformRequest` 允许在向服务器发送前，修改请求数据
axios.defaults.transformRequest = function(data) {
	data = qs.stringify(data);
	return data;
};


// 请求拦截器
axios.interceptors.request.use(function(config) {
	let jwt=window.vm.$store.getters.jwt;
	if(jwt){
		console.log("interceptors:jwt:"+jwt);
	
		config.headers.jwt=jwt;
	}
	return config;
}, function(error) {
	return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use(function(response) {
		let jwt=response.headers.jwt;
		if(jwt){
			console.log("response："+jwt);
			window.vm.$store.commit('setJwt',{
				jwt:jwt
			});
		}
		return response;
}, function(error) {
	return Promise.reject(error);
});




export default axios;
