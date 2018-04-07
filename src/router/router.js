import Vue from 'vue'
import Router from 'vue-router'
import store from '../store-vuex/store'

Vue.use(Router)

const router=new Router({
	mode:'hash',
    routes:[ 
    
    
/*--------------------首页所属 -------------------------   */
    {
    	name:'index',
    	path:'/',
    	alias:'/index',
    	component:resolve => require(['../pages/index/index.vue'], resolve),
    },
   
    
    {
    	name:'hospital-list',
    	path:'/hospital-list',
    	component:resolve => require(['../pages/index/hospital-center/hospital/hospital-list.vue'], resolve)
    },
    {
    	name:'hospital-view',
    	path:'/hospital-view',
    	component:resolve => require(['../pages/index/hospital-center/hospital/hospital-view.vue'], resolve)
    },
    {
    	name:'office-list',
    	path:'/office-list',
    	component:resolve => require(['../pages/index/hospital-center/keshi/keshi-list.vue'], resolve)
    },
    {
    	name:'office-view',
    	path:'/office-view',
    	component:resolve => require(['../pages/index/hospital-center/keshi/keshi-view.vue'], resolve)
    },
    {
    	name:'doctor-list',
    	path:'/doctor-list',
    	component:resolve => require(['../pages/index/hospital-center/doctor/doctor-list.vue'], resolve)
    },
    {
    	name:'doctor-view',
    	path:'/doctor-view',
    	component:resolve => require(['../pages/index/hospital-center/doctor/doctor-view.vue'], resolve)
    },
    
    {
    	name:'baidu-nav',
    	path:'/baidu-nav',
    	component:resolve => require(['../pages/index/hospital-center/map-nav/baidu-nav.vue'], resolve)
    },
    
    {
    	name:'keshi-nav',
    	path:'/keshi-nav',
    	component:resolve => require(['../pages/index/hospital-center/map-nav/keshi-nav.vue'], resolve)
    },
    
  	{
    	name:'simple-way',
    	path:'/simple-way',
    	component:resolve => require(['../pages/index/hospital-center/map-nav/simple-way.vue'], resolve)
    },
    
    
    
    
    
    
    
 /*-----------------------------信息所属-----------------------   */
    {
    	name:'message-type',
    	path:'/message-type',
    	component:resolve => require(['../pages/message/message-type.vue'], resolve),
    	
    },
    
    {
    	name:'message-view',
    	path:'/message-view',
    	component:resolve => require(['../pages/message/message-view.vue'], resolve),
    	
    },
    
    {
    	name:'message-list',
    	path:'/message-list',
    	component:resolve => require(['../pages/message/message-list.vue'], resolve),
    	
    },
    
    {
    	name:'myMessage-list',
    	path:'/myMessage-list',
    	component:resolve => require(['../pages/message/myMessage-list.vue'], resolve),
    	
    },
    
    
/* -------------------------------用户中心所属 -----------------  */
    {
    	name:'my',
    	path:'/my',
    	component:resolve => require(['../pages/user-center/user-center.vue'], resolve),
    	meta:{
        	requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        }
    },
    {
    	name: 'ecg-list',
        path: '/ecg-list',
        component:resolve => require(['../pages/user-center/appointment-ecg/appointment-ecg-list.vue'], resolve),
        meta:{
        	requireAuth: true, 
        }
    },
    {
    	name: 'user-config',
        path: '/user-config',
        component:resolve => require(['../pages/user-center/ID-manage/user-config.vue'], resolve),
        meta:{
        	requireAuth: true,  
        }
    },
    
    {
    	name: 'regist',
        path: '/regist',
        component:resolve => require(['../pages/user-center/ID-manage/regist.vue'], resolve),
    },
    {
    	name:'login',
    	path:'/login',
    	component:resolve => require(['../pages/user-center/ID-manage/login.vue'], resolve)
    },
    {
    	name:'forget-psw',
    	path:'/forget-psw',
    	component:resolve => require(['../pages/user-center/ID-manage/forget-psw.vue'], resolve)
    },
    {
    	name:'clear-account',
    	path:'/clear-account',
    	component:resolve => require(['../pages/user-center/ID-manage/clear-account.vue'], resolve),
    	meta:{
    		requireAuth: true, 
    	}
    },
    {
    	name:'change-account',
    	path:'/change-account',
    	component:resolve => require(['../pages/user-center/ID-manage/change-account.vue'], resolve),
    	meta:{
    		requireAuth: true, 
    	}
    },
    {
    	name:'change-psw',
    	path:'/change-psw',
    	component:resolve => require(['../pages/user-center/ID-manage/change-psw.vue'], resolve),
    	meta:{
    		requireAuth: true, 
    	}
    },
    
    {
    	name:'change-mb',
    	path:'/change-mb',
    	component:resolve => require(['../pages/user-center/patients-manage/change-mb.vue'], resolve),
    	meta:{
    		requireAuth: true, 
    	}
    },
    
    {//就诊人列表(用户)
    	name:'patients-list',
    	path:'/patients-list',
    	component:resolve => require(['../pages/user-center/patients-manage/patients-list.vue'], resolve),
    	meta:{
    		requireAuth: true, 
    	}
    },
    {//我的病人(医生)
    	name:'patient-list-doctor',
    	path:'/patient-list-doctor',
    	component:resolve => require(['../pages/user-center/patients-manage/patient-list-doctor.vue'], resolve),
    	meta:{
    		requireAuth: true, 
    	}
    },
    {
    	name:'patient-edit',
    	path:'/patient-edit',
    	component:resolve => require(['../pages/user-center/patients-manage/patient-edit.vue'], resolve),
    	meta:{
    		requireAuth: true, 
    	}
    },
     {
    	name:'patient-view',
    	path:'/patient-view',
    	component:resolve => require(['../pages/user-center/patients-manage/patient-view.vue'], resolve),
    	meta:{
    		requireAuth: true, 
    	}
    },
    
    
    {
    	name:'appointment-ecg-list',
    	path:'/appointment-ecg-list',
    	component:resolve => require(['../pages/user-center/appointment-ecg/appointment-ecg-list.vue'], resolve),
    	meta:{
    		requireAuth: true, 
    	}
    },
    {
    	name:'appointment-ecg-edit',
    	path:'/appointment-ecg-edit',
    	component:resolve => require(['../pages/user-center/appointment-ecg/appointment-ecg-edit.vue'], resolve),
    	meta:{
    		requireAuth: true, 
    	}
    },
    {
    	name:'appointment-ecg-view',
    	path:'/appointment-ecg-view',
    	component:resolve => require(['../pages/user-center/appointment-ecg/appointment-ecg-view.vue'], resolve),
    	meta:{
    		requireAuth: true, 
    	}
    },
    
    {
    	name:'appointment-guahao-edit',
    	path:'/appointment-guahao-edit',
    	component:resolve => require(['../pages/user-center/guahao/appointment-guahao-edit.vue'], resolve),
    	meta:{
    		requireAuth: true, 
    	}
    },
    {//挂号列表(用户)
    	name:'guahao-list',
    	path:'/guahao-list',
    	component:resolve => require(['../pages/user-center/guahao/guahao-list.vue'], resolve),
    	meta:{
    		requireAuth: true, 
    	}
    },
    
    {//挂号列表(医生)
    	name:'guahao-list-doctor',
    	path:'/guahao-list-doctor',
    	component:resolve => require(['../pages/user-center/guahao/guahao-list-doctor.vue'], resolve),
    	meta:{
    		requireAuth: true, 
    	}
    },
   
    {
    	name:'appointment-guahao-view',
    	path:'/appointment-guahao-view',
    	component:resolve => require(['../pages/user-center/guahao/appointment-guahao-view.vue'], resolve),
    	meta:{
    		requireAuth: true, 
    	}
    },
    
    
    {
    	name:'appl-ecg-edit',
    	path:'/appl-ecg-edit',
    	component:resolve => require(['../pages/user-center/appl-ecg/appl-edit.vue'], resolve),
    	meta:{
    		requireAuth: true, 
    	}
    },
    {
    	name:'appl-ecg-view',
    	path:'/appl-ecg-view',
    	component:resolve => require(['../pages/user-center/appl-ecg/appl-view.vue'], resolve),
    	meta:{
    		requireAuth: true, 
    	}
    },
    {//病人进入的心电申请列表
    	name:'appl-ecg-list',
    	path:'/appl-ecg-list',
    	component:resolve => require(['../pages/user-center/appl-ecg/appl-list.vue'], resolve),
    	meta:{
    		requireAuth: true, 
    	}
    },
    {//医生进入的心电申请列表
    	name:'appl-ecg-list-doctor',
    	path:'/appl-ecg-list-doctor',
    	component:resolve => require(['../pages/user-center/appl-ecg/appl-list-doctor.vue'], resolve),
    	meta:{
    		requireAuth: true, 
    	}
    },
    
     {
    	name:'report-list',
    	path:'/report-list',
    	component:resolve => require(['../pages/user-center/report/report-list.vue'], resolve),
    	meta:{
    		requireAuth: true, 
    	}
    },
    
    {
    	name:'report-view',
    	path:'/report-view',
    	component:resolve => require(['../pages/user-center/report/report-view.vue'], resolve),
    	meta:{
    		requireAuth: true, 
    	}
    },
    
   
    
    
    
    
    
/* -------------------------------其他 -------------------------------  */
    {
    	name: 'about-us',
        path: '/about-us',
        component:resolve => require(['../pages/user-center/ID-manage/about-us.vue'], resolve),
    },
    {
    	name: 'rule-guahao',
        path: '/rule-guahao',
        component:resolve => require(['../pages/user-center/guahao/rule-guahao.vue'], resolve),
    },
     
    
    {
    	name: 'page404',
        path: '/page404',
        component:resolve => require(['../pages/page404.vue'], resolve),
    },
    {
        path: '*',
        redirect: { path: '/page404' }
    },
      {
    	path:'/test',
    	component:resolve => require(['../test.vue'], resolve)
    },
     
    
    ]
})


//没登陆则直接跳转登陆界面
router.beforeEach((to, from, next) => {
	
	if (to.meta.requireAuth){  // 判断该路由是否需要登录权限
		let userFdId = store.state.common.user.userFdId
	    if (userFdId) {  // 通过vuex state获取当前的token是否存在
	        next();
	    }else{
	    	//next()
	        next({path: '/login',query: {redirect: to.fullPath}  })
	    }
	}else{
	    next();
	}

})

router.afterEach(function(to,from){
 	Vue.$vux.loading.hide()
	Vue.$vux.toast.hide()
	
})





export default router
