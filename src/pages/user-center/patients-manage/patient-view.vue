<template>
	<div id='appointment-ecg-view'>
		<group>
		    <cell title="就诊人" :value="patientData.name"></cell>
		    <cell title="关系" :value="patientData.relation" v-if="userRole==='0'"></cell> 
		    <cell title="性别" :value="patientData.sex"></cell>
		    <cell title="手机" :value="patientData.phone" is-link link="/change-mb" ></cell>
		    <cell title="证件类型" :value="patientData.idType"></cell>
		    <cell title="证件号码" :value="patientData.idNumber"></cell>
		    <cell title="出生日期" :value="patientData.birthday"></cell>
		    <cell title="年龄" :value="patientData.age"></cell>
		    <cell title="保险类型" :value="patientData.siType"></cell>
		    <cell title="社保号" :value="patientData.siNumber"></cell>
		    <cell title="紧急联系人姓名" :value="patientData.emergName"></cell>
		    <cell title="紧急联系人电话" :value="patientData.emergTel"></cell>
		 </group>
		<x-button type="primary" action-type="button" @click.native="_delete">删除</x-button>
	</div>
	
</template>
<script>
import { Group, XButton, Cell,CellBox  ,dateFormat } from 'vux'	
import ajax from '../../../server/api.js'
export default{
	components:{XButton,Cell,Group,CellBox,dateFormat},
	data:function(){
		return{
			patientData:{},
			patientId:'',//就诊人fdid
			userRole:'',
		} 
	},
	
	
	
	methods:{
		
		_delete:function(){
			let the=this
			let submitData={patientId:this.patientId}
			ajax.patientDelete(submitData)
    		.then(function(res){
    			the.$router.go(-1)
    		})
    		.catch(function(){
    			throw('删除就诊人失败')
    		})
    		
		},
		
		//获取就诊人数据
		getPatientData:function(){
			let the=this
			let submitData={patientId:this.patientId}
			
			ajax.patientView(submitData)
			.then(function(res){
				let patientData=res.data.bindingUser
				console.log("就诊人详情",res.data)
				let transData=the.transData(patientData)
				the.patientData=Object.assign(patientData,transData)
				
			})
			.catch(function(err){
				the.$vux.toast.show({type:"text",text:"数据请求出错"})
				console.log('请求就诊人详情数据出错：',err)
			})
			
		},
		
		
		
		//数据转换
		transData:function(originData){
			let newData={}
    		switch(originData.relation){
    			case '0':newData.relation='本人';break;
    			case '1':newData.relation='父母';break;
    			case '2':newData.relation='夫妻';break;
    			case '3':newData.relation='子女';break;
    			case '4':newData.relation='亲戚';break;
    			case '5':newData.relation='其他';break;
    			default :newData.relation='本人';
    		}
			switch(originData.sex){
    			case '0':newData.sex='男';break;
    			case '1':newData.sex='女';break;
    			default :newData.sex='男';
    		}
    		switch(originData.idType){
    			case '0':newData.idType='身份证';break;
    			case '1':newData.idType='港澳台证';break;
    			case '2':newData.idType='护照';break;
    			default :newData.idType='身份证';
    		}
    		switch(originData.siType){
    			case '0':newData.siType='社保';break;
    			case '1':newData.siType='自费';break;
    			default :newData.siType='社保';
    		}
    		switch(originData.ifAudit){
    			case '0':newData.ifAudit='未认证';break;
    			case '1':newData.ifAudit='已认证';break;
    			default :newData.ifAudit='未认证';
    		}
    		
    		newData.birthday=dateFormat(originData.birthday, 'YYYY-MM-DD') 
    		
    		return newData
		},
		
		
		
		getPatientId:function(){
			this.patientId=this.$router.currentRoute.query.patientId
			
		},
		
		setHeader:function(){
			let header={
				  title:'就诊人信息',
				  left:{showBack:true,backText:''},
				  right:{rightHtml:'首页'}
				 }
			this.$store.commit('setHeader',header)
		},
		
		//隐藏底部tabbar
		setTabbar:function(){
	    	this.$store.commit('setTabbar',false)
	    },
	    
	    getUserRole:function(){
			let userType=this.$store.state.common.user.userType
			this.userRole= userType
		}
		
		
		
		
		
		
	},
	
	
	
	activated:function(){
		this.getPatientId()
		this.getPatientData()//请求数据
		this.setHeader()
		this.getUserRole()
	},
	
	
	
}	
</script>
<style scoped>
	
	
</style>