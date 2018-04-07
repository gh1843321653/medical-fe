<template>
	<div id='appointment-ecg-view'>
		<group>
		    <cell title="预约编号" :value="ecgData.appointmentNum"></cell>
		    <cell title="预约状态" :value="ecgData.appointmentStatus"></cell>
		    <cell title="就诊人" :value="ecgData.patientData.name" ></cell>
		    <cell title="手机号" :value="ecgData.patientData.phone"></cell>
		    <cell title="预约时间" :value="ecgData.appointmentTime"></cell>
		    <cell title="预约提交时间" :value="ecgData.appointmentCreateTime"></cell>
		    <div v-for='(type,index) in ecgTypes'  :key='type.fdid'>
				<cell title='检查项目' :value='type.ecgTitle' is-link :arrow-direction="expand[index] ? 'down' : ''"  @click.native="expandTo(index)" >
					<span class="vertical-middle">{{ type.ecgTitle }} &nbsp;</span>
					<badge :text="type.options.length" v-if='type.options&&type.options!==[]'></badge>
				</cell>
				<cell-box v-for='option in type.options' :key='option.fdid'  v-if='expand[index]'>{{option.value}}</cell-box> 
			</div>
			<x-button type="primary" v-if="ecgData.appointmentStatus=='已提交'"  action-type="button" @click.native="cancel">取消申请</x-button>
		 </group>
		
	</div>
	
</template>
<script>
import {  Group, XButton, Cell,CellBox ,Badge } from 'vux'	
import ajax from '../../../server/api.js'
export default{
	components:{Cell,Group,Badge,CellBox,XButton},
	data:function(){
		return{
			ecgData:{//请求的数据
				appointmentNum:'',//预约编号
				patientData:{name:'',phone:''},
				appointmentTime:'',//预约时间
				appointmentCreateTime:'',//预约提交时间
				checkTypeList:[],
			},
			ecgTypes:[
				/*{fdid:'', ecgTitle:'静态心电检查',type:'static',options:[{key:'656',value:'检查项目1',inlineDesc:'￥25.5'}]},
				{fdid:'', ecgTitle:'动态心电检查',type:'dynamic',options:[{key:'65516',value:'检查项目1',inlineDesc:'￥25.5'}]},
				{fdid:'', ecgTitle:'动态血压检查',type:'dynamic',options:[{key:'6516',value:'检查项目1',inlineDesc:'￥25.5'}]}*/
			],
			expand:{},
			appointmentEcgId:'',
			
		}
	},
	
	
	methods:{
		expandTo:function(index){ 
			let ee=this.expand[index]=!this.expand[index];
			//console.log(this.$refs);
			
		},
		//获取心电预约数据
		getInitData:function(){
			let the=this
			let submitData={appointmentEcgId:this.appointmentEcgId}
			ajax.appointmentEcgView(submitData)
			.then(function(res){
				console.log('预约心电view',res.data)
				the.ecgData=res.data
				the.ecgTypes=the.formatData(res.data.checkTypeList)//格式化checkTypeList
			})
			.catch(function(err){
				the.$vux.toast.show({type:'warn',text:"请求数据失败"})
				
			})
			
		},
		
		cancel:function(){
			let the=this
			let submitData={appointmentEcgId:this.appointmentEcgId}
			ajax.appointmentEcgCancel(submitData)
			.then(function(){
				let time=1500
				the.$vux.toast.show({type:"text",text:"取消成功",time:time})
				setTimeout(function(){
					the.$router.push("/appointment-ecg-list")
				},time)
				
			})
			.catch(function(){
				the.$vux.toast.show({type:"text",text:"取消失败"})
			})
			
			
		},
		
		formatData:function(ecgData){
			let newEcgTypes=[]
			ecgData.forEach(function(item,index){
				let option={key:item.fdId,value:item.content,inlineDesc:item.price}
				let has=newEcgTypes.some(function(item1,index1){
						return item.typeName==item1.ecgTitle
					})
				
				if(!has){
					let newEcgType={
						fdid:item.projectId,
						ecgTitle:item.typeName,
						options:[option]
					}
					newEcgTypes.push(newEcgType)
				}else{
					newEcgTypes.forEach(function(item1,index1){
						if(item1.fdid===item.projectId){
							item1.options.push(option)
						}
					})
				}
				
			})
			return newEcgTypes
		},
		
		
		
		initExpand:function(){
			let the=this
			//循环查询ecgTypes
			let interval=setInterval(function(){
				let len=the.ecgTypes.length
				if(len>0){
					let arr={}
					for(var i=0;i<len;i++){
						arr[i]=false
						
					}
					the.expand=arr
					clearInterval(interval)
				}
				
			},100)
			
		},
		
		
		setHeader:function(){
			let header={
				  title:'心电预约详情',
				  left:{showBack:true,backText:''},
				  right:{rightHtml:'首页'}
				 }
			this.$store.commit('setHeader',header)
		},
		
		//隐藏底部tabbar
		setTabbar:function(){
	    	this.$store.commit('setTabbar',false)
	   },
	   
	   //获取预约心电id
	   getAppointmentEcgId:function(){
	   		let ecgId=this.$router.currentRoute.query.appointmentEcgId
	   		this.appointmentEcgId=ecgId//初始化预约心电Id
	   	
	   },
	   
	   
		
		
		
	},
	
	
	activated:function(){
		this.getAppointmentEcgId()
		this.getInitData()//请求数据
		this.initExpand()
		this.setHeader()
		this.setTabbar()
	},
	
	
	
}	
</script>
<style scoped>
	
	
</style>