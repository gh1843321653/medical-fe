<template>
	<div id="doctor-view">
		<div class="banner">
			<div class="photo">
				<img :src="'http://192.168.1.26:8080/foodShop/'+doctorData.headpictpath" @error="imgOnError($event)"/>
			</div>
			<p class="name">{{doctorData.name}}</p>
			<p class="title">{{doctorData.jobTitle}}</p>
		</div>
		<div class="main">
			<group class="strong">
				<cell title='擅长' class="title" is-link :arrow-direction="strong ? 'up' : 'down'" @click.native="strong = !strong" ></cell>
				<div :class='{expand:strong}' class="con">{{doctorData.goodField}}</div>
				<cell title='出诊时间' is-link  class="title" ></cell>
				<div class="paiban con ">
					<div @click="guahao({date:'2018-02-12',time:'AM'})">
						<img src="../../../../static/imgs/QQ图片20171229141910.png"/>
					</div>	
					
				</div>
				<cell  title='简历' is-link   class="title" ></cell>
				<div  class="con" v-html='doctorData.introduce'></div>
				
			</group>
		</div>
	</div>
	
</template>
<script>
/*医生简介=擅长|简历*/
import { Blur,Cell,CellBox, Group} from 'vux'
import ajax from '../../../../server/api.js'

	export default{
		components:{ Blur,Cell,CellBox, Group},
		data:function(){
			return{
				strong:true,
				resume:true,
				doctorData:{
					name:'',
					title:'',//头衔
					photo:'',
					strong:'',//擅长
					resume:'',//简历
					paiban:''//排班
				},
				
			}
		},
		
		methods:{
			imgOnError:function(ev){
				let src=require("../../../../static/imgs/common/photo-doctor-md.png")
				ev.target.src=src?src:"";
				
			},
			getInitData:function(){
				let the=this
				//let doctorId=this.$store.getters.guahaoData.doctorId
				let doctorId=this.$store.state.guahaoData.doctorId
				let submitData={doctorId}	
				ajax.doctorView(submitData)
	    		.then(function(res){
	    			the.doctorData=res.data.doctor
	    			console.log('医生详情数据：',res.data)
	    		})
	    		.catch(function(err){
	    			throw('医生详情出错',err)
	    		})
			},
			
			guahao:function(dateTime){
				var guahaoData=this.$store.getters.guahaoData;
				var newData=Object.assign(guahaoData,dateTime);
				this.$store.commit('setGuahao',newData)
				this.$router.push('/appointment-guahao-edit')
			},
			setHeader:function(){
				  let header={
					  title:'医生主页',
					  left:{showBack:true,backText:''},
					  right:{rightHtml:'首页'}
				 }
				 this.$store.commit('setHeader',header)
			},
			
			
			
			
		},
		
		activated:function(){
			this.setHeader();
			this.getInitData()
			
		},
		
		
		
		
	}
	
</script>
<style scoped="scoped" lang='scss'>
	.banner{
		height: 200px;
		background: url(../../../../static/imgs/QQ图片20171229133919.png) no-repeat ;
		background-size: cover;
		text-align:center;
		.photo{
			padding-top: 30px;
			img{
				width: 70px;
				height: 70px;
				border-radius: 50%;
				
			}
		}
		.name{
			padding-top:10px ;
		}
	}
	
	.main{
		padding: 0px 15px;
		.title{
			margin-top: 0px;
			border-bottom: 1px solid #eee;
			margin-bottom: 10px;
		}
		.con{
			margin-bottom: 30px;
		}
	}
	.main .expand{
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		height: 47px;
		
	}
	
	.paiban img{
		width: 98%;
	}
</style>
<style >
	#doctor-view .weui-cells:before{
		    border-top: none !important;
		
	}
	#doctor-view .weui-cells:after{
		    border-bottom:none !important;
		
	}
	#doctor-view .weui-cell:before{
		border-top: none !important;
	}
</style>