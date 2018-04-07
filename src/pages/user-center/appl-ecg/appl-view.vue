<template>
	<div id='appointment-ecg-view'>
		<group>
		    <cell title="心电申请编号" :value="applEcgData.applyNo"></cell>
		    <cell title="申请状态" :value="applEcgData.applyStatus"></cell>
		    <cell title="就诊人" :value="applEcgData.name" is-link :link="{path:'/patient-view',query:{patientId:applEcgData.patientId}}"></cell>
		    <cell title="就诊类型" :value="applEcgData.patientType"></cell>
		    <cell title="申请类型" :value="applEcgData.applyType"></cell> 
		    <cell title="申请时间" :value="applEcgData.createTime"></cell>
		    <cell title="检查费用" :value="applEcgData.inspectionFee"></cell>
		    <cell title="预约时间" v-if="applEcgData.applyType=='预约申请'"  :value="applEcgData.appointmentTime"></cell>
		    <div v-for='(type,index) in ecgTypes'  :key='type.fdid'>
				<cell :title="'检查项目'+index" :value='type.ecgTitle' is-link :arrow-direction="expand[index] ? 'down' : ''"  @click.native="expandTo(index)" >
					<span class="vertical-middle">{{ type.ecgTitle }} &nbsp;</span>
					<badge :text="type.options.length" v-if='type.options&&type.options!==[]'></badge>
				</cell>
				<cell-box v-for='option in type.options' :key='option.fdid'  v-if='expand[index]'>{{option.value}}</cell-box> 
			</div>
		 </group>
		
	     <x-button type="primary" v-if="applEcgData.applyStatus=='申请成功'"  action-type="button" @click.native="cancel">取消申请</x-button>
	     <x-button type="primary" action-type="button" link="/appl-ecg-list">申请记录</x-button>
	</div>
	
</template>
<script>
/*ecgTypes格式*/
var ecgTypes=[
			{fdid:'', ecgTitle:'静态心电检查',type:'static',options:[{key:'656',value:'检查项目1',inlineDesc:'￥25.5'}]},
			{fdid:'', ecgTitle:'动态心电检查',type:'dynamic',options:[{key:'65516',value:'检查项目1',inlineDesc:'￥25.5'}]},
			{fdid:'', ecgTitle:'动态血压检查',type:'dynamic',options:[{key:'6516',value:'检查项目1',inlineDesc:'￥25.5'}]}
		];
import {  Group, XButton, Cell ,Badge,dateFormat } from 'vux'	
import ajax from '../../../server/api.js'
export default{
	components:{Cell,Group,Badge,XButton,dateFormat},
	data:function(){
		return{
			applEcgData:{},
			ecgTypes:[],
			expand:{},
			applEcgId:'',//心电申请fdid
			initData:{},
		} 
	},
	
	methods:{
		expandTo:function(index){ 
			let ee=this.expand[index]=!this.expand[index];
			
		},
		//获取心电申请数据
		getApplEcgData:function(){
			let the=this
			let submitData={applEcgId:this.applEcgId}
			ajax.applEcgView(submitData)
			.then(function(res){
				console.log('心电申请详情数据',res.data)
				let data=res.data.applEcgViewData
				let transData=the.transData(data)
				the.applEcgData=Object.assign(data,transData)
				the.ecgTypes=the.formatData(data.checkProject)
			})
			.catch(function(err){
				the.$vux.toast.show({type:"text",text:"网络出错"})
				console.log('请求心电申请详情数据出错：',err)
			})
			
		},
		
		formatData:function(initData){
			let newEcgTypes=[]
			var xx=JSON.parse(initData)
			xx.forEach(function(item,index){
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
		
		
		//数据转换
		transData:function(originData){
			 //转换预约状态
		      this.initData.applState.forEach(function(item1,index){
		      	if(originData.applyStatus==item1.code){
		      		originData.applyStatus=item1.name;
		      		//break;
		      	}
		      })
		      
		      //转换申请类型
		      this.initData.applTypeList.forEach(function(item1,index){
		      	if(originData.applyType==item1.code){
		      		originData.applyType=item1.name;
		      		
		      		//break;
		      	}
		      })
		      
		      //转换就诊类型
		      this.initData.patientTypeList.forEach(function(item1,index){
		      	if(originData.patientType==item1.code){
		      		originData.patientType=item1.name;
		      		//break;
		      	}
		      })
			
			//转换日期格式
			originData.createTime=dateFormat(originData.createTime, 'YYYY-MM-DD HH:mm:ss')
		
			
    		return originData
		},
		
		
		
		
		
		//获取心电申请id
		getApplEcgId:function(){
			this.applEcgId=this.$router.currentRoute.query.applEcgId
			
		},
		
		//设置展开默认状态
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
				  title:'心电申请详情',
				  left:{showBack:true,backText:''},
				  right:{rightHtml:'首页'}
				 }
			this.$store.commit('setHeader',header)
		},
		//隐藏底部tabbar
		setTabbar:function(){
	    	this.$store.commit('setTabbar',false)
	    },
	    
	    
	    //获取心电就诊类型等选项数据
	    getiInitData:function(){
	    	var the=this
	    	ajax.initData()
	    	.then(function(res){
	    		the.initData=res.data
	    		
	    	})
	    },
	    
	    
		
		
	},
	
	
	created:function(){
		this.initExpand()
		this.getiInitData()
		
	},
	activated:function(){
		this.getApplEcgId()
		this.getApplEcgData()//请求数据
		this.setHeader()
		this.setTabbar()
	},
	
	
	
}	
</script>
<style scoped>
	
	
</style>