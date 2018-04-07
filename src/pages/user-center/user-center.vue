<template>
	<div id="user-center">
		<div class="userBanner">
			<div class="userPhoto">
				<img class='user-photo' src="http://huf.png" alt="" @error="imgOnError($event)"/>
				<div class="user-name">
					<p >您好，{{userId}}</p>
					<p>欢迎使用心电云平台app</p>
				</div>
			</div>
			
		</div>
		<!--菜单	-->
		<group  class="content">
			<div class="" v-if="userRole==='0'">
				<cell title="就诊人管理" is-link link="/patients-list" >
					<div slot='icon'><img  src="../../static/imgs/my-patientList.png"/></div>
				</cell>
				<cell title="挂号记录" is-link :link="{path:'/guahao-list',query:{action:'guahaoView'}}" >
					<div slot='icon'><img   src="../../static/imgs/my-guahaoList.png"/></div>
				</cell>
				<cell title="预约心电记录" is-link link="/appointment-ecg-list" >
					<div slot='icon'><img   src="../../static/imgs/my-appointmentEcgList.png"/></div>
				</cell>
				<cell title="心电申请记录" is-link link="/appl-ecg-list" >
					<div slot='icon'><img   src="../../static/imgs/my-appointmentEcgList.png"/></div>
				</cell>
				<cell title="检查报告" is-link link="/report-list" >
					<div slot='icon'><img   src="../../static/imgs/my-report.png"/></div>
				</cell>
			</div>
			
			
			
			<div class=""  v-if="userRole==='1'">
				<cell title="我的挂号" is-link link="/guahao-list-doctor" >
					<div slot='icon'><img   src="../../static/imgs/my-guahaoList.png"/></div>
				</cell>
				<cell title="我的病人" is-link link="/patient-list-doctor">
					<div slot='icon'><img   src="../../static/imgs/my-patient-doctor.png"/></div>
				</cell>
			</div>
			<cell title="设置" is-link link="/user-config" >
				<div slot='icon'><img   src="../../static/imgs/my-config.png"/></div>
			</cell>
			
		</group>
	</div>
</template>
<script>
import {Group,Cell} from 'vux'
	export default{
		components:{Group,Cell},
		data:function(){
			return{
				userRole:'',//用户角色，0医生|1用户
				userId:'',//用户账号
			}
		},
		methods:{
			imgOnError:function(ev){
				if(this.userRole==='0'){
					let src=require("../../static/imgs/common/photo-user-md.png")
					ev.target.src=src?src:"";
				}else{
					let src=require("../../static/imgs/common/photo-doctor-md.png")
					ev.target.src=src?src:"";
				}
				
			},
			
			setHeader:function(){
				let header={
				  title:'个人中心',
				  left:{showBack:false,backText:''},
				  right:{rightHtml:''}
				 }
				 this.$store.commit('setHeader',header)
			},
			
			//隐藏底部tabbar
			setTabbar:function(){
		    	this.$store.commit('setTabbar',true)
		    },
		    
		    
		    //获取用户账号角色
		    getUser:function(){
		    	let userId=this.$store.state.common.user.userId
		    	let userRole=this.$store.state.common.user.userType
		    	this.userId=userId
		    	this.userRole=userRole
		    },
		    
		    setStyle:function(){
		    	let box=document.querySelector("#content")
		    	let banner=document.querySelector("#user-center")
			  	let boxH=box.style.minHeight
			  	banner.style.minHeight=boxH
		    	
		    }
			
		},
		mounted:function(){
			this.setStyle()
			
		},
		activated:function(){
			this.setHeader()
			this.setTabbar()
			this.getUser()
			
		},
		
		
		
	}
	
</script>
<style scoped="scoped" lang="scss">
#user-center{
	background-color: #f8f8f8;
	padding-bottom: 30%;
	box-sizing: border-box;
}
	.userBanner{
		background-image: linear-gradient(to right, #1b85ee, #2cb5ed);
		
		.userPhoto{
			height: 100px;
			padding:8% 5%;
			display: flex;
			align-items: center;
			color:#fff;
			.user-photo{
				flex-basis: 15%;
				max-width: 25%;
				margin: 0px 10px;
				border:none;
				
			}
			.user-name{
				flex: 1;
				
			}
		}
	}
	.content{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		width: 100%;
		
		a{
			width: 130px;
			height: 110px;
			margin: 20px 20px;
			display: inline-block;
			background-color: deepskyblue;
		}
		a:last-of-type{
			/*background-color: transparent;*/
		}
		.weui-cell__hd img{
			width: 1.7em;
			height: 1.7em;
		    padding-right:10px;
		    vertical-align: middle;
		}
	}
	
	
</style>
<style>
	.content .weui-cells{
		margin-top: 0px;
		width: 100%;
	}
</style>