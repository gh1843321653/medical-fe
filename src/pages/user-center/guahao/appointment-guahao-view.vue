<template>
	<div id="guahao-view" >
		<group>
	    	<cell title="就诊人" :value="guahaoData.patientName" is-link :link="{path:'/patient-view',query:{patientId:guahaoData.patientId}}" ></cell>
	    	<cell title="就诊科室" :value="guahaoData.keshiName"  is-link :link="{path:'/office-view',query:{keshiId:guahaoData.keshiId}}"></cell>
	        <cell title="就诊医生" :value="guahaoData.doctorName"  is-link :link="{path:'/doctor-view',query:{doctorId:guahaoData.doctorId}}"></cell>
	        <cell title="就诊时间" :value="guahaoData.date+' '+ guahaoData.time"></cell> 
	        <cell title="申请时间" :value="guahaoData.createTime"></cell> 
	        <cell title="挂号状态" :value="guahaoData.guahaoState"></cell> 
	    </group>
	    <box gap="40px 10px">
	     	<x-button action-type="button" @click.native="cancel">取消</x-button>
	    </box>
	</div>
</template>

<script>
import { Group,Datetime,Cell,Toast,Box,XButton,PopupRadio } from 'vux'
import ajax from '../../../server/api.js'
export default{
	components: {Group,Datetime,Cell,Toast,Box,XButton,PopupRadio},
	data(){
		return{
			guahaoData:{
				patientName:'',
				patientId:'',
				keshiId:'',
				keshiName:'',
				doctorId:'',
				doctorName:'',
				date:'',
				time:'',
				createTime:'',//挂号申请时间
				guahaoState:'',//挂号状态
			},
			guahaoId:''
		}
	},
	
	
	methods:{
		getGuahaoData:function(){
			let submitData={guahaoId:this.guahaoId}
			let the=this
			ajax.appointmentGuahaoView(submitData)
    		.then(function(res){
    			console.log("挂号详情",res.data)
    			the.guahaoData=res.data.guahaoViewData
    		})
    		
		},
		
		
		cancel:function(){
			let submitData={guahaoId:this.guahaoId}
			var the=this
			ajax.appointmentGuahaoCancel(submitData)
			.then(function(){
				let time=1500
				the.$vux.toast.show({type:'text',text:'取消成功',time:time})
				setTimeout(function(){
					the.$router.go(-1)
				},time)
			})
			.catch(function(){
				the.$vux.toast.show({type:'text',text:'取消失败'})
			})
		},
		
		
		
		setHeader:function(){
			let header={
				  title:'挂号详情',
				  left:{showBack:true,backText:''},
				  right:{rightHtml:'首页'}
				 }
				 this.$store.commit('setHeader',header)
		},
		
		//隐藏底部tabbar
		setTabbar:function(){
	    	this.$store.commit('setTabbar',false)
	   },
		
		//获取挂号id
		getGuahaoId:function(){
			this.guahaoId=this.$router.currentRoute.query.guahaoId
		},
		
		
	},
	
	
	activated:function(){
		this.getGuahaoId()
		this.getGuahaoData();
		this.setHeader();
		this.setTabbar()
	}
	
}
</script>

<style lang='scss' scoped>

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
	color: #999;
}
#guahao-view{
	font-size: 16px;
	
}
</style>
