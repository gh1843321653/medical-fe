<template>
	<div id="patients-list">
		<group>
      		<cell title="添加就诊人" @click.native="addPatient" is-link >
      			<img slot="icon" class="img" src="../../../static/imgs/patients-add.jpg">
        		<div slot='default'>还可添加<span style="color: red">{{maxPatientNum-nowPatientNum}}</span>人</div>
      		</cell>
	    </group>
	    <group class="groupBox">
	        <cell  v-for="(item,index) in patientList" :key="index" :title='item.name' :value='item.ifAudit' class="cellBox" is-link  @click.native="select(item)"   ></cell>                                                         
	    </group>
	    <div class="prompt">
	    	<div class="title">
	    		<img class="img" src="/src/assets/imgs/sign1.gif" alt="" />
	    		<span>温馨提示</span>
	    	</div>
	    	<div class="content">
				<p>1.最多能添加4个就诊人，请慎重添加，一年只允许变更（删除）一次</p>
				<p>1.未认证的就诊人无法预约挂号</p>
				<p>1.未审核的就诊人允许挂一个号</p>
	    	</div>
	    </div>
	    
	</div>
</template>

<script>
import { Cell, Group} from 'vux'
import patientList from '../../../static/json/patients-list'
import ajax from '../../../server/api.js'
export default{
	components:{Cell, Group},
	data(){
		return{
			maxPatientNum:4,//最多只能添加4人
			nowPatientNum:0,
			patientList:[],
			
		}
	},
	methods:{
		addPatient:function(){
			if(this.nowPatientNum>=this.maxPatientNum){
				this.$vux.toast.show({type:'warn',text:'当前就诊人数已达最大限制',position:''})
			}else{
				this.$router.push({path:'/patient-edit',query:{pageType:'edit'}});
			}
			
		},
		//加载就诊人列表
		getpatientData:function(){
			let the=this
			ajax.patientList()
	    	.then(function(res){
	    		console.log('就诊人列表',res)
	    		the.patientList=res.data.patientList
	    		the.nowPatientNum=res.data.patientList.length
	    	})
			
			
			
		},
		
		select:function(item){
			this.$router.push({path:'/patient-view',query:{patientId:item.fdId}})
			
		},
		
		setHeader:function(){
			let header={
				  title:'就诊人',
				  left:{showBack:true,backText:''},
				  right:{rightHtml:'首页'}
				 }
				 this.$store.commit('setHeader',header)
		},
		
		//隐藏底部tabbar
		setTabbar:function(){
	    	this.$store.commit('setTabbar',false)
	    },
	   
	   setListStyle:function(){
	   		let wapper=document.querySelector("#patients-list")
	   		let content=document.querySelector("#content")
	   		let conH=content.offsetHeight
	   		wapper.style.minHeight=conH+"px"
	   		
	   		
	   	
	   }
	   
		
	},
	mounted:function(){
		this.setListStyle()
	},
	activated:function(){
		this.setHeader()
		this.setTabbar()
		this.getpatientData()
		
	}
}
</script>

<style lang='scss' scoped>

#patients-list{
	background-color: #f8f8f8;
	
	.img{
		display: block;
		 max-width: 20px; 
		 margin-right: 5px;
		 position: relative;
		 top: 1px;
		 &:hover{
		 	
		 }
	}
	
	
	
	.prompt{
		margin: 40px 10px;
		
		.content{
			font-size: 12px;
		}
	}
}
</style>