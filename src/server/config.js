/*本文件对axios设置全局默认配置，以及其他配置*/
import axios from 'axios'
import Vue from 'vue'
//import qs from 'qs'
import store from '../store-vuex/store'
/*-------------------------axios 全局配置----------------------------*/
//axios.defaults.timeout = 1000;
// axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//axios.defaults.headers.post['Content-Type'] = "application/json; charset=UTF-8";
axios.defaults.headers.post['Cache-Control'] = "no-cache";
axios.defaults.baseURL = '/foodShop';//    /foodShop ||  /ecg  ||  
//axios.defaults.proxy={host: '192.168.1.15', port: 8080  }//设置代理服务器
//axios.default.paramsSerializer=function(params){return Qs.stringify(params, {arrayFormat: 'brackets'})}
axios.defaults.withCredentials=true//设置cookie,表示跨域请求时是否需要使用凭证



/*-----------------------axios拦截器---------------*/ 

//请求拦截器-POST传参序列化
axios.interceptors.request.use((config) => {
	Vue.$vux.loading.show({ text: 'loading'})
	if(config.method==='get'){
		config.params.userId=store.state.common.user.userFdId
		config.params.userRole=store.state.common.user.userType
		config.params.userHospital=store.state.common.user.userHospital
		config.params.hospitalId=store.state.hospitalId
	}else if(config.method==='post'){
		config.data.userId=store.state.common.user.userFdId
		config.data.userRole=store.state.common.user.userType
		config.data.userHospital=store.state.common.user.userHospital
		config.data.hospitalId=store.state.hospitalId
	}
    //console.log('请求拦截：',config)
    return config;
},(error) =>{
    // console.log("错误的传参");
    return Promise.reject(error);
});

//响应拦截器-返回状态判断
axios.interceptors.response.use((res) =>{
	Vue.$vux.loading.hide()
    if(res.data.code&&res.data.code!=='0000'){
    	Vue.$vux.toast.show({type:'cancel',text:res.data.msg})
        return Promise.reject(res);
    }
    if(res.data.code=='10000'){
    	the.$vux.toast.show({type:'cancel',text:res.data.msg})
    	 return Promise.reject(res);
    }
    
    return res;
}, (error) => {
	//console.log(error)
	Vue.$vux.loading.hide()
	Vue.$vux.toast.show({type:'cancel',text:'网络异常'})
    return Promise.reject(error);
});









