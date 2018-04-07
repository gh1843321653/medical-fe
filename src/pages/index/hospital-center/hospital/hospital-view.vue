<template>
	<div id="hos-intro">
		<div class="top">
			<div class="logoBox">
				<div class="imgBox" >
					<img class="bgwall" src="../../../../../dist/static/img/2cb2205c5685842a7b859676f35f38e4.11be570.jpg" />
					<img class="img" src="https://gss0.bdstatic.com/94o3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike272%2C5%2C5%2C272%2C90/sign=86ba01c4fa1f4134f43a0d2c4476feaf/9345d688d43f87948466d409d51b0ef41bd53a7f.jpg" alt="logo" />
					<div class="intro">
						<p class="hos-name">{{hospitalData.name}} <strong>{{hospitalData.rade}}</strong></p>
						<p>{{hospitalData.phone}}</p>
						<p><a :href="hospitalData.url">{{hospitalData.url}}</a></p>
						<p>{{hospitalData.province+hospitalData.city+hospitalData.district+hospitalData.address}}</p>
					</div>
				</div>
			</div>
		</div>
		<div class="content">
			<group class="nav">
				<cell title='医院导航' value=''  is-link :arrow-direction="nav ? 'down' : ''"  @click.native="nav = !nav" ></cell>
				<transition name="slide">
					<div v-if='nav'>
						<cell-box link='/baidu-nav' is-link>交通导航</cell-box>
						<cell-box  link='/keshi-nav'  is-link>科室导航</cell-box>
						<cell-box  link='/nav'  is-link>院区地图总览</cell-box>
					</div>
				</transition>
				<cell title='科室介绍' value=''  is-link  @click.native='setAction' ></cell>
			</group>
			
			
			<h1 class="title">医院简介</h1>
			<div class="hos-detail" v-html="hospitalData.content">
				
				
			</div>
		</div>
	</div>
	
</template>

<script>
import { Cell,CellBox, Group} from 'vux'	
import ajax from '../../../../server/api.js'
	export default{
		components:{Cell,Group,CellBox},
		data:function(){
			return{
				hospitalData:{name:"",rade:"",phone:"",url:"",},
				nav:false,
				
			}
		},
		
		methods:{
			getHospitalInfo:function(){
				let the=this
				ajax.hospitalInfo()
				.then(function(res){
					console.log("医院信息",res.data)
					the.hospitalData=res.data.hospitalData
					
				})
				
				
			},
			
			setAction:function(){
				this.$router.push({path:'/office-list',query:{action:'intro'}})
			},
			
			setHeader:function(){
				let header={
				  title:'医院介绍',
				  left:{showBack:true,backText:''},
				  right:{rightHtml:'首页'}
				 }
				 this.$store.commit('setHeader',header)
			},
			//隐藏底部tabbar
			setTabbar:function(){
		    	this.$store.commit('setTabbar',false)
		   },
		   
		   
			
			
		},
		created:function(){
			this.getHospitalInfo()
			
		},
		activated:function(){
			this.setHeader()
			this.setTabbar()
		},
		
		
	}
	
</script>
<style scoped="scoped" lang="scss">
	.top{
		/*background-color: #00BFFF;*/
		overflow: hidden;
	}
	.logoBox{
		.imgBox{
			text-align: center;
			padding-top: 20px;
		    color: #555;
			font-size:18px;
			position: relative;
			.bgwall{
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				filter: blur(20px);
			}
			.img{
				position: relative;
				width: 100px;
				  height: 100px;
				  border-radius: 50%;
				  border: 4px solid #ececec;
			}
			.intro{
				padding-bottom: 30px;
				p{
					text-align: center;
					line-height: 1.5em;
					font-size: 14px;
				}
				.hos-name{
					font-size: 16px;
				}
				
				
			}
		}
	}
	
	
	.content{
		padding: 0px 15px;
		.title{
			font-size: 16px;
			margin-top: 10px;
			line-height: 2em;
			text-align: center;
		}
		
		 .weui-cell{
			font-size: 16rem;
		}
		.weui-cell_access.vux-cell-box{
			padding-left: 50px;
			
		}
		.hos-detail{
			color: #565454;
			font-size: 14rem;
		}
	}
	
	
.slide-enter,.slide-leave-to{
	height: 0px;
}	
	
.slide-enter-active,.slide-leave-active{
	overflow: hidden;
	transition:all 0.4s;
	
}	
	
.slide-enter-to,.slide-leave{
	height: 126px;
}	
	
	
	
	
	
	
	
	
	
</style>