<template>
	<div id="patient-edit" >
		<group>
			<popup-radio title="关系" :options="relationList"   v-model="formParams.relation" ></popup-radio>
	        <cell title="姓名" class="apGroup">
	        	<div class='cell-right'>
	        		<input class='cell-input'  type="text" v-model="formParams.name" placeholder="请输入真实姓名" />
	        	</div>
	        </cell>
	        <popup-radio title="性别" :options="sexList"   v-model="formParams.sex"></popup-radio>
	        <cell title="手机号码" class="apGroup">
	        	<div class='cell-right'>
	        		<input class='cell-input'   type="number" v-model="formParams.phone" placeholder="请输入有效手机号码" />
	        	</div>
	        </cell>
	        <popup-radio title="证件类型" :options="idTypeList" ref='idType'   v-model="formParams.idType"></popup-radio>
	        <cell title="证件号码" class="apGroup">
	        	<div class='cell-right'>
	        		<input ref="creType" class='cell-input'   type="number" v-model="formParams.idNumber" placeholder="请输入证件号码" />
	        	</div>
	        </cell>
	    	<datetime class="apGroup" v-model="formParams.birthday" ref='birthday'   placeholder="请选择出生日期" :start-date="datePicker.startDate" :end-date="datePicker.endDate" title="出生日期" @on-change=""></datetime>
	    </group>
	    <group>
	        <popup-radio title="保险类型" :options="siTypeList"  ref='siType'   v-model="formParams.siType"></popup-radio>
	        <cell v-if="formParams.siType=='社保'" title="保险号" class="apGroup">
	        	<div class='cell-right'>
	        		<input class='cell-input'  type="number" v-model="formParams.siNumber" placeholder="请输入保险号" />
	        	</div>
	        </cell>
		</group>
		
		<group>
			<cell title="紧急联系人姓名" class="apGroup pdi-special">
	        	<div class='cell-right'>
	        		<input class='cell-input'   type="text" v-model="formParams.emergName" placeholder="请输入姓名" />
	        	</div>
	        </cell>
	        <cell title="紧急联系人手机号" class="apGroup pdi-special">
	        	<div class='cell-right'>
	        		<input class='cell-input'  type="number" v-model="formParams.emergTel" placeholder="请输入手机号" />
	        	</div>
	        </cell>
		</group>
	    
	    
	    <box  gap="40px 10px">
	     	<x-button type="primary" action-type="button" @click.native="submit">提交</x-button>
	     	<x-button type="primary" action-type="button" @click.native="cancel">取消</x-button>
	    </box>
		
	</div>
</template>

<script>
import { Cell, Group,XButton,Box,Toast,Card,Datetime ,PopupRadio  } from "vux"
import ajax from '../../../server/api.js'
export default{
	components:{ Cell, Group,XButton,Box,Toast,Card,Datetime ,PopupRadio },
	data(){
		return{
			formParams:{
				relation:'本人',
				name:"",
				sex:"男",
				phone:"",
				idType:"身份证",
				idNumber:"",//身份证号
				birthday:"",
				siType:"社保",
				siNumber:"",
				emergName:"",//紧急联系人姓名
				emergTel:"",
				ifAudit:'未认证',//是否认证
			},
			relationList:['本人','父母','夫妻','子女','亲戚','其他'],
			sexList:['男','女'],
			idTypeList:['身份证','港澳台证','护照'],
			siTypeList:['社保','自费'],
			datePicker:{
				startDate:"1900-01-01",
				endDate:""
			},
			pageType:''//页面类型edit||view
			
			
			
			
		}
	},
	
	methods:{
		
		submit:function(){
			//this.validater();
			let the=this
    		let newData=this.transData(this.formParams)
    		let submitData=Object.assign({},this.formParams,newData)
    		ajax.patientEdit(submitData)
    		.then(function(res){
    			the.$router.push('/patients-list')
    		})
    		.catch(function(err){
    			console.log('提交就诊人失败')
    		})
		},
		cancel :function(){
			this.$router.push('/patients-list')
		},
		
		
		
		validater :function(){
			//验证姓名 
			if(!this.formParams.name){ 
				this.$vux.toast.show({type:'text',text:'请填写姓名',position:''})
				return false
			}
			var nameReg=/^[\u4e00-\u9fa5]{2,7}$/;       
        	if(!nameReg.test(this.formParams.name.trim())){  
        		this.ifShowToast = true;
				this.errorText="请输入正确的姓名格式";
				this.toastWidth="8.8rem";
				return false
        	}
        	//验证证件号
        	if(this.formParams.idType==="请选择证件类型" || !this.formParams.idType){
			}else{
				if(!this.formParams.idNumber){
	        	}else{
	        		var idReg;
		        	switch(this.idType)
					{
						case 0:
							idReg=/^[1-9](\d{5})(18|19|20)(\d{2})((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)(\d{3})[0-9Xx]$/; 
						    break;
						case 1:
							idReg=/^[a-zA-Z0-9]{5,17}$/;
							this.$refs.creType.type="text";
						    break;
						case 2:
							idReg=/^[0-9]{10}$/;
						    break;
						case 3:
							idReg=/^南字第(\d{8})号|北字第(\d{8})号|沈字第(\d{8})号|兰字第(\d{8})号|成字第(\d{8})号|济字第(\d{8})号|广字第(\d{8})号|海字第(\d{8})号|空字第(\d{8})号|参字第(\d{8})号|政字第(\d{8})号|后字第(\d{8})号|装字第(\d{8})号$/;
						    this.$refs.creType.type="text";
						    break;
						case 4:
							idReg=/^[HMhm]{1}([0-9]{10}|[0-9]{8})|[0-9]{8}|[0-9]{10}$/;
						    this.$refs.creType.type="text";
						    break;
						default:
						    break;
					};
					if(!idReg.test(this.formParams.idNumber.trim())){
						console.log(1);
						this.ifShowToast = true;
						this.errorText="请输入正确的证件格式";
						this.toastWidth="8.8rem";
						return false
					}
	        	}
			}
			//验证手机号 
			if(!this.formParams.phone){
				this.ifShowToast = true;
				this.errorText="请输入手机号码";
				this.toastWidth="7.6rem";
				return false
			}
			var teleReg=/^((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))(\d+)$/;   
        	if(!teleReg.test(this.formParams.phone.trim())){   
				this.ifShowToast = true;
				this.errorText="请输入有效的手机号码";
				this.toastWidth="8.4rem";
				return false
        	}
        	//验证性别
        	if(this.formParams.sex==="请选择性别" || !this.formParams.sex){
				this.ifShowToast = true;
				this.errorText="请选择性别";
				this.toastWidth="7.6rem";
				return false
			}
        	//验证出生日期
        	if(!this.formParams.birthday){
				this.ifShowToast = true;
				this.errorText="请选择出生日期";
				this.toastWidth="7.6rem";
				return false
			}
			//验证完成，提交信息，要添加提交时间
					
			
			
		},
		//数据转换
		transData:function(originData){
			let newData={}
    		switch(originData.relation){
    			case '本人':newData.relation='0';break;
    			case '父母':newData.relation='1';break;
    			case '夫妻':newData.relation='2';break;
    			case '子女':newData.relation='3';break;
    			case '亲戚':newData.relation='4';break;
    			case '其他':newData.relation='5';break;
    			default :newData.relation='0';
    		}
			switch(originData.sex){
    			case '男':newData.sex='0';break;
    			case '女':newData.sex='1';break;
    			default :newData.sex='0';
    		}
    		switch(originData.idType){
    			case '身份证':newData.idType='0';break;
    			case '港澳台证':newData.idType='1';break;
    			case '护照':newData.idType='2';break;
    			default :newData.idType='0';
    		}
    		switch(originData.siType){
    			case '社保':newData.siType='0';break;
    			case '自费':newData.siType='1';break;
    			default :newData.siType='0';
    		}
    		switch(originData.ifAudit){
    			case '未认证':newData.ifAudit='0';break;
    			case '已认证':newData.ifAudit='1';break;
    			default :newData.ifAudit='0';
    		}
    		
    		return newData
		},
		getTimeNow :function(){
			var now= new Date();
		  	var time = {
		  		year:now.getFullYear(),
		  		month:now.getMonth()+1,
		  		date:now.getDate(),
		  		hour:now.getHours(),
		  		minute:now.getMinutes(),
		  		second:now.getSeconds()
		  	}
		  	var month=time.month<10 ? "0"+time.month : time.month;
		  	var date=time.date<10 ? "0"+time.date : time.date;
		  	this.$set(this.datePicker,'endDate',time.year + "-" + month + "-" + date);
			
		},
		
		
		
		
		
		setHeader:function(){
			let header={
				  title:'新增就诊人',
				  left:{showBack:true,backText:''},
				  right:{rightHtml:'首页'}
				 }
			this.$store.commit('setHeader',header)
		},
		
		//隐藏底部tabbar
		setTabbar:function(){
	    	this.$store.commit('setTabbar',false)
	    }
		
	},
	
	
	activated:function(){
		this.getTimeNow()
		this.setHeader()
		this.setTabbar() 
	}
}
</script>

<style lang="scss" scoped>
#patient-edit{
	background: #f2f2f2;
}

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder{
	color: #999;
}


#patient-edit input{
	border:none;
	text-align: right;
	font-size: 17px;
	
}

#patient-edit input:focus{
	outline: none;
	caret-color: #29aded;
}
input::-webkit-input-placeholder{
	text-align: right;
	}
</style>
