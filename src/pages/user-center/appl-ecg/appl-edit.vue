<template>
	<div id="patient-edit" >
		<group>
	        <!--<patient-checker :checkedData='getPatientData' :touchSubmit='touchSubmit'></patient-checker>-->
	        <cell title="就诊人" is-link :link="{path:'/patient-view',query:{patientId:formParams.patientId}}" :value="patientName"></cell>
	        <popup-radio title="就诊类型" :options="patientTypeNameList" ref='patientType'   v-model="formParams.patientType" placeholder='请选择就诊类型'></popup-radio>
	    	<popup-radio title="申请类型" :options="applTypeNameList" ref='applType'   v-model="formParams.applType" placeholder='请选择申请类型'></popup-radio>
			<datetime title="预约日期"   v-if="formParams.applType=='预约申请'"  v-model="formParams.appointmentTime" ref='appointmentTime'  format="YYYY-MM-DD HH:mm" :hour-list="datePicker.hourList" :minute-list="datePicker.minuteList" placeholder="请选择预约日期" :start-date="datePicker.startDate" :end-date="datePicker.endDate"  @on-change=""></datetime>
		</group>
	    <group>
	      <ecg-checker :checkedData='getCheckedData' :touchSubmit='touchSubmit' optType='add' :appointmentEcgId='appointmentEcgId'></ecg-checker>
		</group>
		
	    <div class="btns">
	    	<x-button type="primary" action-type="button" @click.native="submit">提交</x-button>
	     	<x-button type="primary" action-type="button" @click.native="cancel">取消</x-button>
	    </div>
	</div>
</template>

<script>
import { Cell, Group,XButton,PopupRadio ,Box ,Datetime,dateFormat} from "vux"
import ecgChecker from '../../../components/ecgType-checker'
import patientChecker from '../../../components/patient-checker'
import ajax from '../../../server/api.js'
export default{
	components:{ Cell, Group,XButton ,PopupRadio,Box,Datetime,  ecgChecker,patientChecker ,dateFormat},
	data(){
		return{
			formParams:{
				guahaoId:'',//挂号id
				patientType:'',
				applType:'',
				patientId:'',//就诊人id
				checkedEcgType:[],//已选心电项目
				appointmentTime:'',//如果applType==预约申请时的预约时间
				
			},
			patientName:"",
			
			patientTypeList:[],
			patientTypeNameList:[],
			applTypeList:[],
			applTypeNameList:[],
			patientData:{},//已选就诊人所有信息
			touchSubmit:false,
			appointmentEcgId:'',//预约心电id
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
			this.formParams.patientId=checkedData.fdId
		},
		
		//获取ecgType-Checker(心电)组件已选数据
		getCheckedData:function(checkedData){
			this.formParams.checkedEcgType=checkedData
		},
		
		
		
		//获取挂号id 
		getGuahaoId:function(){
			let guahaoId=this.$router.currentRoute.query.guahaoId
			let patientId=this.$router.currentRoute.query.patientId
			let patientName=this.$router.currentRoute.query.patientName
			this.$set(this.formParams,'guahaoId',guahaoId)
			this.$set(this.formParams,'patientId',guahaoId)
			this.patientName=patientName
		},
		
		//获取心电预约数据
		getAppointmentEcgData:function(){
			//该心电预约id为当前申请前的  有效期内的  最新的  预约Id
			let appointmentEcgId=this.$router.currentRoute.query.appointmentEcgId
			this.appointmentEcgId=appointmentEcgId
			//如果有过心电预约，则加载预约数据作为默认数据的一部分
			if(appointmentEcgId){
				
				 
			}
			
		},
		
		submit:function(){
			this.touchSubmit=!this.touchSubmit
			this.validater();
			let the=this
    		let newData=this.transData(this.formParams)
    		let interval=setInterval(function(){
    			if(the.formParams.checkedEcgType.length>0){
    				clearInterval(interval)
    				let submitData=Object.assign(the.formParams,newData)
		    		ajax.applEcgAdd(submitData)
		    		.then(function(res){
		    			the.$router.push({path:'/appl-ecg-view',query:{applEcgId:res.data.fdId}})
		    		})
		    		.catch(function(err){
		    			console.log('提交申请失败')
		    		})
		    		
    			}
    			
    			
    		},20)
    		
		},
		
		cancel :function(){
			this.$router.go(-1)
		},
		
		
		validater :function(){
			 
		},
		
		//数据转换
		transData:function(originData){
			//转换心电申请类型
			this.applTypeList.forEach(function(item,index){
				if(item.name==originData.applType){
					originData.applType=item.code
				}
			})
			
			//转换就诊类型
			this.patientTypeList.forEach(function(item,index){
				if(item.name==originData.patientType){
					originData.patientType=item.code
				}
			})
			
			//转换预约时间
			if(originData.applType!=='1'){
				originData.appointmentTime=''
			}
			
			
			
			return originData
		},
		
		getTimeNow :function(){
			var now= new Date();
			var nextTime=Date.parse(now)+7*2*24*60*60*1000//两周
		    var timeNow=dateFormat(now, 'YYYY-MM-DD')//'YYYY-MM-DD HH:mm:ss'
			var timeNext=dateFormat(nextTime, 'YYYY-MM-DD')//'YYYY-MM-DD HH:mm:ss'
			
			this.$set(this.datePicker,'startDate',timeNow);
			this.$set(this.datePicker,'endDate',timeNext);
			
		},
		
		setHeader:function(){
			let header={
				  title:'新建心电申请',
				  left:{showBack:true,backText:''},
				  right:{rightHtml:'首页'}
				 }
			this.$store.commit('setHeader',header)
		},
		//隐藏底部tabbar
		setTabbar:function(){
	    	this.$store.commit('setTabbar',false)
	    },
	    
	    //获取心电初始选项数据
	    getiInitData:function(){
	    	var the=this
	    	ajax.initData()
	    	.then(function(res){
	    		the.applTypeList=res.data.applTypeList
	    		the.patientTypeList=res.data.patientTypeList
	    		the.applTypeNameList=res.data.applTypeList.map(function(item,index){
	    			return item.name
	    		})
	    		the.patientTypeNameList=res.data.patientTypeList.map(function(item,index){
	    			return item.name
	    		})
	    		
	    		
	    		
	    	})
	    	
	    }
	},
	
	created:function(){
		this.getTimeNow()
		this.getiInitData()
	},
	
	activated:function(){
		this.getGuahaoId()
		this.getAppointmentEcgData()
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
