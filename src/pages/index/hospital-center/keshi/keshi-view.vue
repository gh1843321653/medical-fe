<template>
	<div id='office-view'>
		<div class="banner">
			<h1 class="title">{{keshiDataAll.name}}</h1>
			<p class="pre">所属:外科</p>
			<p class="nav">外科门诊4楼</p>
		</div>
		<div class="doctors">
			<p class="title">科室医生</p>
			<ul class="main" >
				<li v-for='item in keshiDataAll.doctors'  @click="selectDoctor({doctorId:item.fdid,doctorName:item.name})"  >
					<img :src="item.photo"/>
					<p class="name">{{item.name}}</p>
					<p class="dtitle">{{item.title}}</p>
				</li>
			</ul>
		</div>
		<div class="detail">
			<p class="title">科室简介</p>
			<div class="main" v-html="keshiDataAll.introduction"></div>
			
		</div>
	</div>
	
</template>
<script>
let doctors=[
	{name:'王医生',id:1681,title:'主任医师',photo:'http://www.wj-hospital.com/images/content/2015-03/20150312152513147196.jpg'},
	{name:'王医生',id:1681,title:'主任医师',photo:'http://www.wj-hospital.com/images/content/2015-03/20150312152513147196.jpg'},
	{name:'王医生',id:1681,title:'主任医师',photo:'http://www.wj-hospital.com/images/content/2015-03/20150312152513147196.jpg'},
	{name:'王医生',id:1681,title:'主任医师',photo:'http://www.wj-hospital.com/images/content/2015-03/20150312152513147196.jpg'},
	{name:'王医生',id:1681,title:'主任医师',photo:'http://www.wj-hospital.com/images/content/2015-03/20150312152513147196.jpg'},
	{name:'王医生',id:1681,title:'主任医师',photo:'http://www.wj-hospital.com/images/content/2015-03/20150312152513147196.jpg'},
	{name:'王医生',id:1681,title:'主任医师',photo:'http://www.wj-hospital.com/images/content/2015-03/20150312152513147196.jpg'},
	{name:'王医生',id:1681,title:'主任医师',photo:'http://www.wj-hospital.com/images/content/2015-03/20150312152513147196.jpg'}
]
import { Blur,Cell,CellBox, Group} from 'vux'	
import ajax from '../../../../server/api.js'
	export default{
		components:{},
		data:function(){
			return{
				doctors:doctors,
				keshiData:'',
				keshiDataAll:{}
			}
		},
		
		methods:{
			getKeshiDataAll:function(){
				let the=this
				var interval=setInterval(function(){
					if(the.keshiData){
						let keshiId=the.keshiData.keshiId
						let submitData={keshiId:keshiId}
						
						ajax.keshiView(submitData)
						.then(function(res){
							console.log("科室详情",res.data)
							the.keshiDataAll=res.data.keshiData
							
						})
						.catch(function(err){
							the.$vux.toast.show({type:"text",text:"网络出错"})
							console.log('请求科室详情出错')
						})
						clearInterval(interval)
					}
				},20)
			},
			
			selectDoctor:function(doctorData){
		  		var guahaoData=Object.assign(doctorData,this.keshiData);
		  		this.$store.commit('setGuahao',guahaoData)//存储挂号信息
		  		this.$router.push({path:'/doctor-view'})
		  	},
			
			setHeader:function(){
				  let header={
				  title:'科室介绍',
				  left:{showBack:true,backText:''},
				  right:{rightHtml:'首页'}
				 }
				 this.$store.commit('setHeader',header)
			},
			
			//隐藏底部tabbar
			setTabbar:function(){
		    	this.$store.commit('setTabbar',false)
		   },
			
			getKeshiData:function(){
				this.keshiData=this.$router.currentRoute.query
			
			},
			
		},
		
		
		created:function(){
			this.getKeshiDataAll()
			this.setHeader()
			this.setTabbar()
		},
		
		
		activated:function(){
			this.getKeshiData()
		},
		
		
	}
	
</script>
<style scoped="scoped" lang='scss'>
	.banner{
		height: 200px;
		background: url(../../../../static/imgs/common/login-bg.png) no-repeat ;
		background-size: cover;
		position: relative;
		.title{
			font-weight: normal;
		    text-align: center;
		    color: #302f2f;
		    font-size: 25px;
		    text-shadow: 2px 2px 1px #d7d7d7;
		    padding-top: 50px;
		}
		.pre{
			position: absolute;
			bottom: 0px;
			left: 0;
			padding-left: 20px;
			line-height: 2em;
			
		}
		.nav{
			position: absolute;
			bottom: 0px;
			right: 0;
			padding-right: 20px;
			line-height: 2em;
			
		}
		
	}
	
	.doctors{
		.title{
			padding-left: 15px;
			line-height: 2em;
			border-bottom:1px solid #eee;
			margin-bottom: 10px;
			margin-top: 20px;
			display: flex;
			align-items: center;
		}
		.title:before{
			content: ' ';
			display: inline-block;
			width: 5px;
			height: 2em;
			background-color: #00ACEE;
			margin-right: 10px;
		}
		.main{
			display: flex;
			flex-wrap: nowrap;
			flex-direction: row;
			overflow-x: auto;
			overflow-y: hidden;
			margin: 0px 10px;
			li{
				width: 70px;
				margin-right:10px;
				flex-shrink: 0;
			}
			
			img{
				width: 70px;
				height: 80px;
				margin: 0px auto;
			}
			.name{
				text-align: center;
				font-size: 16px;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space:nowrap;
			}
			.dtitle{
				text-align: center;
				font-size: 14px;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space:nowrap;
			}
			
		}
		
	}
	.detail{
		.title{
			padding-left: 15px;
			line-height: 2em;
			border-bottom:1px solid #eee;
			margin-bottom: 10px;
			margin-top: 20px;
			display: flex;
			align-items: center;
		}
		.title:before{
			content: ' ';
			display: inline-block;
			width: 5px;
			height: 2em;
			background-color: #00ACEE;
			margin-right: 10px;
		}
		.main{
			padding: 0px 10px;
			
		}
	}
	
</style>