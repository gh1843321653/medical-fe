<template>
  <div id='doctor-list'>
	   <ul class="list">
	     <li class='list-item' v-for="(item,index) in doctorList" @click='selectDoctor({doctorId:item.doctorId,doctorName:item.Name})'>
	     		<img class="photo" :src="'http://192.168.1.26:8080/foodShop/'+item.photo" @error='altPhoto($event)'>
	     		<div class="info-box">
	     			<p class='info-meta'>
	     				<span class='name'>{{item.Name}}</span>
	     				<span class='title'>{{item.title}}</span>
	     				<span class='hasTime'>{{item.doctorHaveNum==0 ? '有号' : '无号'}}</span>
	     			</p>
	     			<p class='strong'>{{item.strong}}</p>
	     		</div>
	     </li>
	   </ul>
  </div>
</template>
<script>
import pullRefresh from '../../../../components/pullRefresh.vue';
import ajax from '../../../../server/api.js'
import altPhoto from '../../../../static/imgs/doctor-photo.png'
export default{
	 components : {'v-scroll': pullRefresh},
	 data () {
	    return {
	    	keshiData:'',//router的科室数据
	      doctorList: [], // 列表数据存放数组
	      pageIndex : 1, //默认已经显示出15条数据 count等于1是让从16条开始加载
	      pageListNum : 15,  // 一次显示多少条
	     
	       // firstLoadState:'',
	     
	    }
	  },
	 
	  methods: {
	  	selectDoctor:function(doctorData){
	  		var guahaoData=Object.assign(doctorData,this.keshiData);
	  		this.$store.commit('setGuahao',guahaoData)//存储挂号信息
	  		this.$router.push({path:'/doctor-view'})
	  	},
	  	
	  	//请求医生列表
	    getDoctorList(pageIndex,callback){
	    	let vm=this
	    	if(vm.keshiData.keshiId){
    				let submiteData={
				        	keshiId:vm.keshiData.keshiId,
				        	pageIndex:pageIndex,
				        	pageListNum:vm.pageListNum
			        }
			       
		        ajax.doctorList(submiteData)
		        .then(function(res){
		        	vm.doctorList = res.data.doctorDate
		        })
		        .catch(function(err){
		        	vm.$vux.toast.show({type:"text",text:"网络错误"})
			        	throw("医生列表加载出错",err)
		        })
			        
    		}
	        
	    },
	    
	    
	    setHeader:function(){
					let header={
					  title:this.keshiData.keshiName,
					  left:{showBack:true,backText:''},
					  right:{rightHtml:'首页'}
					 }
					 this.$store.commit('setHeader',header)
				},
				
				getKeshiData:function(){
					this.keshiData=this.$router.currentRoute.query
					
				},
				
				//图像加载失败则加载默认图像
				altPhoto:function(ev){
					let target=ev.target
					//target.src=altPhoto
					target.src=require("../../../../static/imgs/doctor-photo.png")
					
				}
				
				
	  },
	  
	  
	  activated:function(){
	  	this.getKeshiData()
	  	this.setHeader()
	  	this.getDoctorList()
	  	
	  },
 
}
</script>
<style  scoped="scoped" lang='scss'>
		
	#doctor-list .list-item{
		display: flex;
		overflow: hidden;
		font-size: 14px;
		line-height: 1.5em;
		padding: 4.8%;
		height: auto;
		outline: 1px solid #eee;
		.photo{
			width: 60px;
			height: 60px;
			outline: 1px solid #eee;
		}
		
		.info-box{
			flex: auto;
			height: 70px;
			padding-left: 10px;
			.info-meta{
				.name{font-size: 16px;}
				.title{font-size: 14px;}
				.hasTime{
					float: right;
					color: #fff;
    			background: #5acf83;
					width: 30px;
			    height: 18px;
			    text-align: center;
			    border-radius: 0;
					}
			}
			.strong{
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap; 
				color: #9B9B9B;
				line-height: 21px;
			}
			
		}
		
		
	}
</style>
