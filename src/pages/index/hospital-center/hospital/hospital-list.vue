<template> 
  <div id='hospital-list'>
	   <ul class="list">
	     <li   class="list-item"  v-for="(item,index) in hospitalList" @click="select(item.id)">
     		<img class="photo" :src="'http://192.168.1.26:8080/foodShop/'+item.photo" @error='altPhoto($event)'>
     		<div class="info-box">
     			<p class='name'>{{item.name}}</p>
     			<p claas=''>{{item.class}}</p>
     			<p>{{item.type}}</p>
     			<p>{{item.distance}}</p>
     			<p>{{item.tel}}</p>
     		</div>
	     </li>
	   </ul>
  </div>
</template>
<script>
import pullRefresh from '../../../../components/pullRefresh.vue';
import ajax from '../../../../server/api.js'
import altPhoto from '../../../../static/imgs/doctor-photo.png'
import hospitalList from '../../../../static/json/hospital-list.json'
export default{
	 components : {'v-scroll': pullRefresh},
	 data () {
	    return {
	    	keshiData:'',//router的科室数据
	        hospitalList: hospitalList, // 列表数据存放数组
	        pageIndex : 1, //默认已经显示出15条数据 count等于1是让从16条开始加载
	        pageListNum : 15,  // 一次显示多少条
	     	
	     	path:"",//跳转路径
	       // firstLoadState:'',
	     
	    }
	  },
	  methods: {
	  	
	  	//请求医院列表
	    getHospitalList(pageIndex,callback){
	    	let vm=this
	    	ajax.hospitalList()
	        .then(function(res){
	        	vm.hospitalList = res.data.hospitalList
	        })
	        .catch(function(err){
	        	vm.$vux.toast.show({type:"text",text:"网络错误"})
		        throw("医院列表加载出错",err)
	        })
	        
	    },
	    
	    
	    select:function(hospitalId){
	    	this.$store.commit('setHospital',hospitalId)//存储医院id
	    	this.$router.push(this.path)
	    	
	    },
	    
	    
	    setHeader:function(){
				let header={
					  title:'医院',
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
		
		//图像加载失败则加载默认图像
		altPhoto:function(ev){
			let target=ev.target
			//target.src=altPhoto
			target.src=require("../../../../static/imgs/doctor-photo.png")
			
		},
		
		//判断访问目标
		getPath:function(){
			let action=this.$router.currentRoute.query.action
			switch(action){
				case "hospitalView":this.path="/hospital-view";break;
				case "appointmentGuahao":this.path="/keshi-list";break;
				case "appointmentEcg":this.path="/guahao-list";break;
				default:this.path="/hospital-view";break;
			}
		}
				
				
	  },
	  
	  created:function(){
	  	this.getHospitalList()
	  	
	  },
	  activated:function(){
	  	this.getKeshiData()
	  	this.setHeader()
	  	this.setTabbar()
	  	
	  	this.getPath()
	  },
 
}
</script>
<style  scoped="scoped" lang='scss'>
		
	.list-item{
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
