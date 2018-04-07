<template>
	<form action="" id="appointment-ecg-edit" >
		
			<patient-checker :checkedData='getPatientData' :touchSubmit='touchSubmit'></patient-checker>
			<group>
				<datetime title="预约日期"   v-model="formParams.appointmentTime"  format="YYYY-MM-DD HH:mm" :hour-list="datePicker.hourList" :minute-list="datePicker.minuteList" placeholder="请选择预约日期" :start-date="datePicker.startDate" :end-date="datePicker.endDate"  @on-change=""></datetime>
			</group>
			<ecg-checker :checkedData='getCheckedData' :touchSubmit='touchSubmit' optType='add'></ecg-checker>
		
		<x-button action-type='button' type='primary' @click.native="submit">提交</x-button>
	</form>
	
</template>
<script>
import { Group, XButton, Cell  ,Datetime,dateFormat} from 'vux'	
import ecgChecker from '../../../components/ecgType-checker'
import patientChecker from '../../../components/patient-checker'
import ajax from '../../../server/api.js'
export default{
	components:{Group,Cell ,XButton,ecgChecker,patientChecker,Datetime,dateFormat	},
	data:function(){
		return {
			formParams:{
				patientId:'',//就诊人id
				checkedEcgType:[],//选择的项目
				appointmentTime:'',//预约时间
			},
			patientData:[],//已选就诊人所有信息
			touchSubmit:false,//是否点击了提交按钮
			
			datePicker:{
				startDate:"",
				endDate:"",
				hourList:['09', '10', '11', '12', '13', '14', '15', '16'],
				minuteList:['00', '15', '30', '45']
			},
		}
	},
	
	methods:{
		
		//获取patient-Checker（就诊人）组件已选数据
		getPatientData:function(checkedData){
			this.patientData=checkedData 
			this.$set(this.formParams,'patientId',checkedData.fdId)
			
		},
		
		//获取ecgType-Checker组件已选数据
		getCheckedData:function(checkedData){
			this.formParams.checkedEcgType=checkedData
		},
		
		
		
		
		//提交表单数据
		submit:function(){ 
			this.touchSubmit=!this.touchSubmit
			if(!this.validater()){return false}
			
			let the=this
			//必须循环查询patientId是否已经赋值了
			let interval=setInterval(function(){
					//如果patientId已经赋值了，才会进行表单提交
					if(the.formParams.patientId!=''){
						clearInterval(interval)
						let submitData={
							patientId:the.formParams.patientId,
							inspectionItem:the.formParams.checkedEcgType,
							appointmentTime:the.formParams.appointmentTime,
						}
						ajax.appointmentEcgSubmit(submitData)
						.then(function(res){
							if(res.data.code==='0000'){
								let time=2000
								the.$vux.toast.show({type:'success',text:"提交成功",time:time})
								setTimeout(function(){
									the.$router.push({ path:'/appointment-ecg-view',query:{appointmentEcgId:res.data.addCheckItemFiId}})
								},time)
								
							}
						})
						.catch(function(err){
							console.log("提交心电预约错误：",err)
						})
						
					}
			},50)
		},
		
		
		
		validater:function(){
			let patientId=this.formParams.patientId
			let inspectionItem=this.formParams.checkedEcgType
			let appointmentTime=this.formParams.appointmentTime
			if(!appointmentTime){
				this.$vux.toast.show({type:'text',text:'请选择预约日期'})
				return false
			}
			
			return true
	    
		},
		
		setHeader:function(){
			  let header={
				  title:'预约心电',
				  left:{showBack:true,backText:''},
				  right:{rightHtml:'首页'}
			  }
			  this.$store.commit('setHeader',header)
		},
		
		
		//隐藏底部tabbar
		setTabbar:function(){
	    	this.$store.commit('setTabbar',false)
	    },
	   
	   getTimeNow :function(){
			var now= new Date();
			var nextTime=Date.parse(now)+7*2*24*60*60*1000//两周
		    var timeNow=dateFormat(now, 'YYYY-MM-DD')//'YYYY-MM-DD HH:mm:ss'
			var timeNext=dateFormat(nextTime, 'YYYY-MM-DD')//'YYYY-MM-DD HH:mm:ss'
			
			this.$set(this.datePicker,'startDate',timeNow);
			this.$set(this.datePicker,'endDate',timeNext);
			
		},
		
		
	},
	
	created:function(){
		this.getTimeNow()
	},
	
	
	activated:function(){
		this.setHeader()
		this.setTabbar()
		
	},
	
	
	
	
	
	
}
	
	
	
</script>
<style scoped="scoped" lang="scss">
/deep/ .weui-btn{
	width: 85%;
	margin:30px auto 10px;
}	
	
</style>