export default {
	setHelloNameByAsync: function(context, payload) {
		console.info("setHelloNameByAsync。。。。。。。。。。。");

		setTimeout(() => {
			console.info("111111111111111111111111111");
			context.commit('setHelloName', payload); //Action提交的是mutation
		}, 6000);
		
		 /* let _this=payload._this;
		 let url=_this.axios.urls.XXXXX;
		 axios.post(url, {
			 helloName:payload.helloName
		 }).then(function(response) {
		 	context.commit('setHelloName', {
				helloName:resp.data.result
			}); //Action提交的是mutation
			
		 }).catch(function(error) {
		 	console.log(error); 
		 }); */
		 
		console.info("22222222222222222");
	}
	
	
};
