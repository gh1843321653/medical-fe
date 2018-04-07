import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


import store1 from './modules/store1'
import store2 from './modules/store2'



export default new Vuex.Store({
    /*modules: {
        store1,
        store2
    },*/
    state:{
    	//系统通用状态
    	common:{
    		header:{
    			title:'四川华西医院',
    			left:{showBack:true,backText:''},
    			right:{rightHtml:'',showMore:false}
    		},
    		//是否显示底部tabbar
    		showTabbar:true,
    		//用户ID
    		user:{
    			userFdId:localStorage.userFdId,
    			userId:localStorage.userId,//账号或手机号
    			userType:localStorage.userType,//0就诊人  1医生
    			userHospital:localStorage.hoipital,//医院 fdId(和医生角色有关)
    		} 
    	},
    	//挂号数据
    	//guahaoData:''  
    	guahaoData:sessionStorage.guahaoData==null ? {} : JSON.parse(sessionStorage.guahaoData),
    	hospitalId:""//医院id
    },
    getters:{
    	
    	//guahaoData不会随state.guahaoData响应？？？？？？？？？？？？？？？？？
    	guahaoData:function(state){
    		console.log('getters-guahaoData')
    		if(sessionStorage.guahaoData){
    			return JSON  .parse(sessionStorage.guahaoData)
    		}else{
    			return state.guahaoData 
    		}
    	},
    	
    	xx:function(state){
    		console.log('响应getter')
    		return state.guahaoData
    	}
    },
    mutations:{
    	setHeader:function(state,headerOptions){
    		state.common.header=Object.assign({},state.common.header,headerOptions)
    	    //Vue.set(state.common,'header',headerOptions)
    	},
    	setTabbar:function(state,pram){
    		state.common.showTabbar=pram
    	},
    	setUser:function(state,user){
    		localStorage.userFdId=user.userFdId 
    		localStorage.userId=user.userId 
    		localStorage.userType=user.userType 
    		state.common.user=Object.assign({},state.common.user,user)
    	},
    	
    	setGuahao:function(state,guahaoData){
    		//console.log('执行mutations',guahaoData)
    		sessionStorage.setItem('guahaoData',JSON.stringify(guahaoData))
    		//state.guahaoData=Object.assign({},state.guahaoData,guahaoData)
    		//Vue.set(state,'guahaoData',guahaoData)
    		state.guahaoData=guahaoData
    		//console.log('state-guahaoData',state.guahaoData)
    	},
    	
    	setHospital:function(state,hospitalId){
    		state.hospitalId=hospitalId
    		
    	}
    
    }
    
})













