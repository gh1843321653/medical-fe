/*该文件提供了promise的服务器请求接口*/

import axios from 'axios'
import './config'
import desEncrypt from '../static/js/security/security'




//get传params参数,post传data参数
export default{
	
/*--------------------------------------用户账号--------------------------------------*/

     //获取验证码
    getVcode:(data) => {
    	var data= Object.assign({userName:''},data) 
    	return axios.post('guser/userDetailInfo.do?method=getSmsCode', data)
    },	
	
    //用户注册
    regist:(data) => { 
    	var data= Object.assign({mobile:'',password:'',code:''},data) 
    	return axios.post('guser/userDetailInfo.do?method=register', data)
    	
    },
    
    //用户登录
	login:(data) => { //guser/userDetailInfo.do?method=login1  //j_acegi_security_check
		var data= Object.assign({type:'',mobile:'',password:''},data) 
		//let j_password=desEncrypt(data.password)//密码加密
		//var data={j_username:data.mobile,j_password:j_password,j_lang:'zh-CN',j_redirection:'http://192.168.1.11:8080/foodShop/index.jsp'}
		//var data=`?j_username=${data.mobile}&j_password=${j_password}&j_lang=zh-CN&j_redirection=http://192.168.1.11:8080/foodShop/index.jsp`
		return axios.post('guser/userDetailInfo.do?method=login', data)
	},
    
    
    //获取用户登录信息(主要用于自动登录)
	getUser:(data)=>{
		var data=Object.assign({},data)
		return axios.get('guser/userDetailInfo.do?method=getUser',{params:data})
	},
	
	 //修改密码
    changePsw:(data) => { 
    	var data= Object.assign({oldUserPwd:'',newPwd:''},data) 
    	return axios.post('guser/userDetailInfo.do?method=updateNewPwd', data)
    	
    },
    
     //忘记密码
    forgetPsw:(data) => { 
    	var data= Object.assign({mobile:'',password:'',code:''},data) 
    	return axios.post('guser/userDetailInfo.do?method=forgotPassWord', data)
    	
    },
    
    //修改登陆账号
    changeAccount:(data) => { 
    	var data= Object.assign({newMobile:'',vcode:"",password:''},data) 
    	return axios.post('guser/userDetailInfo.do?method=changeAccount', data)
    	
    },
    
    //注销登陆账号
    clearAccount:(data) => { 
    	var data= Object.assign({password:""},data) 
    	return axios.post('guser/userDetailInfo.do?method=clearAccount', data)
    	
    },
    
    
    
    
    
    
/*-----------------------------------医院信息&科室&医生----------------------------------*/  
	//医院列表
	hospitalList:(data)=>{
		var data=Object.assign({},data)
		return axios.get('ecg/ghospital/detailInfo.do?method=hospitalList',{params:data})
	},
	
	//医院介绍
	hospitalInfo:(data)=>{
		var data=Object.assign({},data)
		return axios.get('ecg/ghospital/detailInfo.do?method=hospitalInfo',{params:data})
	},


    //科室列表
	keshiList:(data)=>{ 
		var data=Object.assign({},data)
		return axios.get('ecg/gback/sysOrgDept.do?method=choosingDepartList',{params:data})
	},
	
	//科室详情介绍
	keshiView:(data)=>{
		var data=Object.assign({keshiId:''},data)
		return axios.get('ecg/gback/sysOrgDept.do?method=choosingDepart',{params:data})
	},
    
     //医生列表
	doctorList:(data)=>{
		var data=Object.assign({keshiId:''},data)
		return axios.get('ecg/gdoctor/detailInfo.do?method=gdoctorList',{params:data})
	},
	
	//医生详情介绍
	doctorView:(data)=>{
		var data=Object.assign({doctorId:''},data)
		return axios.get('ecg/gdoctor/detailInfo.do?method=gdoctorView',{params:data})
	},
    
    
    
    
/*-----------------------------------消息中心----------------------------------*/    

	//消息类别
	messageType:(data)=>{
		var data=Object.assign({},data)
		return axios.get('ecg/gback/messageMain.do?method=messageTempView',{params:data})
	},
	
	//公共消息列表
	messageList:(data)=>{
		var data=Object.assign({pageNo:'',pageSize:''},data)
		return axios.get('ecg/gback/messageMain.do?method=messageList',{params:data})
	},
	
	//我的消息列表
	myMessageList:(data)=>{
		var data=Object.assign({pageIndex:'',pageListNum:''},data)
		return axios.get('ecg/gback/messageMain.do?method=myMessageList',{params:data})
	},
	
	//消息详情
	messageView:(data)=>{
		var data=Object.assign({},data)
		return axios.get('ecg/gback/messageMain.do?method=messageView',{params:data})
	},




    
    
/*-----------------------------------心电预约&心电申请----------------------------------*/


	//心电预约-检查类型&项目明细//gdoctor/CheckItem.do?method=ecgDate
	appointmentEcgType:(data)=>{//sys/ecg/gdoctor/CheckItem.do?method=ecgDate
		var data=Object.assign({},data)
		return axios.get('ecg/gdoctor/CheckItem.do?method=ecgDate',{params:data})
	},
	
	//心电预约-提交
	appointmentEcgSubmit:(data)=>{
		var data= Object.assign({patientId:'',inspectionItem:[{itemId:'',itemDetailId:['','']}]},data) 
		return axios.post('ecg/gdoctor/CheckItem.do?method=ecgAppointment',data)
	},
	
	//心电预约-预约详情
	appointmentEcgView:(data)=>{
		var data= Object.assign({appointmentEcgId:''},data)
		return axios.get('ecg/gdoctor/CheckItem.do?method=ecgView',{params:data})
	},
	
	//心电预约-取消
	appointmentEcgCancel:(data)=>{
		var data= Object.assign({appointmentEcgId:''},data)
		return axios.get('ecg/gdoctor/CheckItem.do?method=ecgCancel',{params:data})
	},
	
	//心电预约-列表
	appointmentEcgList:(data)=>{
		//输入参数可用于搜索查询
		var data= Object.assign({patientId:'',ecgType:'',appointmentDate:'',appointmentEcgCreateTime:'',appointmentState:'',pageIndex:'',pageListNum:''},data)
		return axios.get('ecg/gdoctor/CheckItem.do?method=appointmentEcgList',{params:data})
	},
	
	//心电申请-提交
	applEcgAdd:(data)=>{
		var data= Object.assign({guahaoId:'',patientType:'',applType:'',patientId:'',checkedEcgType:[]},data) 
		return axios.post('/ecg/guser/userApplyInfo.do?method=applEcgAdd',data)
	},
	
	
	
	
	//心电申请-详情
	applEcgView:(data)=>{
		var data= Object.assign({applEcgId:''},data) 
		return axios.get('/ecg/guser/userApplyInfo.do?method=applEcgView',{params:data})
	},
	
	
	//心电申请-取消
	applEcgCancel:(data)=>{
		var data= Object.assign({appEcgId:'',applType:'',patientType:'',},data) 
		return axios.post('/ecg/guser/userApplyInfo.do?method=applEcgCancel',data)
	},
	
	//心电申请-列表
	applEcgList:(data)=>{
		//输入参数都是用来搜索查询的
		var data= Object.assign({patientId :'',applType:'',patientType:'',ecgType:'',applEcgState:'',applEcgDate:'',pageIndex:'',pageListNum:'' },data)
		return axios.get('/ecg/guser/userApplyInfo.do?method=applEcgList',{params:data})
	},

	//心电-选项数据
	initData:(data)=>{
		var data= Object.assign({},data) 
		return axios.get('/ecg/guser/userApplyInfo.do?method=initData',{params:data})
	},
	



/*-----------------------------------挂号管理----------------------------------*/
	
	//挂号预约-提交
	appointmentGuahaoAdd:(data)=>{
		var data= Object.assign({keshiId:'',doctorId:'',patientId:'',date:'',time:''},data)
		return axios.post('ecg/guser/userGuahaoInfo.do?method=appointmentGuahaoAdd',data)
	},
	
	//挂号预约-详情
	appointmentGuahaoView:(data)=>{
		var data= Object.assign({pageIndex:'',perPageListNum:''},data)
		return axios.get('ecg/guser/userGuahaoInfo.do?method=appointmentGuahaoView',{params:data})
	},
	
	//挂号-列表（包括预约挂号和门诊挂号）
	guahaoList:(data)=>{
		var data= Object.assign({patientId:'',guahaoType:'',guahaoState:'',keyWord:"",pageIndex:'',pageListNum:''},data)
		return axios.get('ecg/guser/userGuahaoInfo.do?method=appointmentGuahaoList',{params:data})
	},

	//挂号预约-取消
	appointmentGuahaoCancel:(data)=>{
		var data= Object.assign({guahaoId:''},data) 
		return axios.get('ecg/guser/userGuahaoInfo.do?method=appointmentGuahaoCancel',{params:data})
	},
	
	//挂号-选项数据
	initData_guahao:(data)=>{
		var data= Object.assign({},data) 
		return axios.get('/ecg/guser/userGuahaoInfo.do?method=initData',{params:data})
	},


/*-----------------------------------检查报告----------------------------------*/
	//报告-列表
	reportList:(data)=>{
		var data= Object.assign({patientId:'',pageIndex:'',pageListNum:''},data)
		return axios.get('ecg/guser/userGuahaoInfo.do?method=reportList',{params:data})
	},







/*-----------------------------------就诊人管理----------------------------------*/
	//加载就诊人列表
	patientList:(data)=>{
		var data= Object.assign({},data)
		return axios.get('guser/userDetailInfo.do?method=patientList',{params:data})
	},
	
	//就诊人-提交
	patientEdit:(data)=>{
		var api_param={
				name:"",sex:"男",phone:"",idType:"身份证",idNumber:"",birthday:"",
				siType:"社保",	siNumber:"",emergName:"",emergTel:""
			}
		var data= Object.assign(api_param,data)
		return axios.post('guser/userDetailInfo.do?method=patientEdit',data)
	},
	
	
	//就诊人-详情
	patientView:(data)=>{
		var data= Object.assign({patientId:''},data)
		return axios.get('guser/userDetailInfo.do?method=patientView',{params:data})
	},
	

	//就诊人-删除
	patientDelete:(data)=>{
		var data= Object.assign({patientId:''},data)
		return axios.get('guser/userDetailInfo.do?method=patientDelete',{params:data})
	},





/*------------------------------------------其他接口---------------------------------------*/
	
	//获取后台sessionId
	getSessionId:(data)=>{
		var data= Object.assign({},data)
		return axios.get('guser/userDetailInfo.do?method=getSessionId',{params:data})
		
	}
	
}









