<template>
  <div class="guahao-list">
	  	<tab>
	      <tab-item selected @on-item-click="tabClick('',0)">全部</tab-item>
	      <tab-item v-for="(patient,index) in patientList"  @on-item-click="tabClick(patient.fdId,++index)"  :key="patient.fdId">{{patient.name}}</tab-item>
	      <div class="vux-tab-itemv moreSearch"  @click="moreSearch"></div>
	    </tab>
		  <v-scroll ref="scroll" :on-refresh="onRefresh" :on-loadmore="onLoadmore" :onFirstLoad='firstLoad'  >
		       <ul  class='list'>
		         <li  class="list-item" v-for="(item,index) in listData" >
		         	<router-link :to="{path:action,query:{guahaoId:item.guahaoId,patientName:item.patientName,patientId:item.patientId}}">
		         		<div class='th'>
	         		  	<p class='name' v-if="searchData.patientId==''">{{item.patientName}}</p>
	         		  	<p><label class="label">挂号单号:</label>646156845</p>
	         		  </div>
		         		<p class="tr"><label class="label" >科室</label>{{item.keshiName}}</p>
		         		<p class="tr" ><label class="label" >预约时间</label>{{item.date+" "+item.time}}</p>
		         		<p class="tr" ><label class="label" >挂号状态</label>{{item.guahaoState}}</p>
		         		<p class="tr" ><label class="label" >挂号类型</label>{{item.guahaoType}}</p>
		         		<p class="tr" v-if=false><label class="label" >是否预约过</label>{{item.hasAppoientment}}</p>
		         		<p class="tr" v-if=false><label class="label" >挂号时间</label>{{item.createTime}}</p>
		         	</router-link>
		         </li>
		       </ul>
			</v-scroll>
			<popup v-model="showPopup"  class="search-box" @on-hide="" @on-show="" >
        <group class="search-box">
          <div class="title">挂号搜索</div>
          <ul class="main">
          	<li class='search-item'>
          		<h1 class='item-title'>挂号状态</h1>
	      			<checker v-model="searchData.guahaoState" class=" item-checker "default-item-class="default-style" selected-item-class="selected-style">
						      <checker-item value="">全部</checker-item>
						      <checker-item v-for="item in initData.guahaoStateList" :value="item.code" :key="item.code">{{item.name}}</checker-item>
					     </checker>
          	</li>
          	<li class='search-item'>
          		<h1 class='item-title'>挂号状态</h1>
	      			<checker v-model="searchData.guahaoType" class=" item-checker "default-item-class="default-style" selected-item-class="selected-style">
						      <checker-item value="">全部</checker-item>
						      <checker-item v-for="item in initData.guahaoType" :value="item.code" :key="item.code">{{item.name}}</checker-item>
					     </checker>
          	</li>
          	
          	<li class='search-item'>
          		<h1 class='item-title'>预约日期</h1>
          		<div class="item-checker  date-range">
          			<datetime-view v-model="searchData.appiontmentDate.startDate" ref="datetime" class="datepicker" format="YYYY-MM-DD" :start-date="datePicker.startDate" :end-date="datePicker.endDate"></datetime-view>
				  			<span class="dao">到</span>
				  			<datetime-view v-model="searchData.appiontmentDate.endDate" ref="datetime"  class="datepicker" format="YYYY-MM-DD" :start-date="datePicker.startDate" :end-date="datePicker.endDate"></datetime-view>
          		</div>
          	</li>
          </ul>
          <div class="button-bar">
          	<button type="button" class="btn  confirm" @click="confirm" >确定</button>
          	<button type="reset" class="btn reset" @click="reset">复位</button>
          </div>
        </group>
      </popup>
  </div>
</template> 
<script>
import { Group,Tab, TabItem,Popup,Checker, CheckerItem,DatetimeView ,dateFormat  } from "vux"
import pullRefresh from '../../../components/pullRefresh.vue';
import ajax from '../../../server/api.js'
export default{
	components : {'v-scroll': pullRefresh,Group ,Tab, TabItem,Popup,Checker, CheckerItem,DatetimeView ,dateFormat},
 data () {
    return {
      listData: [], // 列表数据存放数组
      pageIndex : 1, //默认已经显示出15条数据 count等于1是让从16条开始加载
      pageListNum : 5,  // 一次显示多少条
      
      showPopup:false,//是否显示pop弹框
      patientList:["","",""],//就诊人列表
      initData:[],//选项类数据
      searchData:{//查询条件
      	patientId:'',//就诊人id
      	guahaoState:'',//挂号状态
      	guahaoType:'',//挂号类型(预约挂号|门诊挂号)
      	appiontmentDate:{startDate:"",endDate:''},//预约挂号日期
      	
      },
      datePicker:{
      	startDate:'',//开始日期
      	endDate:'',//结束日期
      },
      
      action:'',//路由跳转方向
      
    }
  },
  
  methods: {
  	tabClick:function(patientId,index){
  		this.setTabStyle(index)
  		this.$set(this.searchData,"patientId",patientId)
  		let refreshDone=this.$refs.scroll.refreshDone
  		this.getList(1,refreshDone)
  		
  	},
  	
  	moreSearch:function(){
  		this.showPopup=true
  		this.setSearchStyle()
  		
  	},
  	
  	confirm:function(){
  		this.showPopup=false
  		let startDate=this.$refs.datetime.startDate
  		let endDate=this.$refs.datetime.endDate
  	
  		if(!this.searchData.appiontmentDate.startDate){
  			this.$set(this.searchData.appiontmentDate,"startDate",startDate)
  		}
  		if(!this.searchData.appiontmentDate.endDate){
  			this.$set(this.searchData.appiontmentDate,"endDate",endDate)
  		}
  		
  		let refreshDone=this.$refs.scroll.refreshDone
  		this.getList(1,refreshDone)
  		
  	},
  	
  	reset:function(){
  		this.showPopup=false
  		
  		for(var key in this.searchData){
  			if(this.searchData[key] instanceof Object){
  				for(var prop in this.searchData[key]){
  					this.searchData[key][prop]=""
  				}
  			}else{
  				this.searchData[key]=""
  			}
  		}
  		
  		let refreshDone=this.$refs.scroll.refreshDone
  		this.getList(1,refreshDone)
  	},
  	
  	
  	
    getList(pageIndex,callback){
        let vm = this
        let timestart=Date.now()/1000
        this.pageIndex=pageIndex
        let submiteData0={
	        	pageIndex:pageIndex,
	        	pageListNum:this.pageListNum,
        }
        let submiteData=Object.assign({},submiteData0,this.searchData)
        ajax.guahaoList(submiteData)
        .then(function(res){
        	console.log("挂号列表",res.data)
        	var listData=res.data.guahaoListData?res.data.guahaoListData :[]
        	var listData=vm.transData(listData)
        	if(vm.pageIndex===1){//刷新
        		vm.listData = listData

        	}else if(vm.pageIndex>1){//加载更多
        		vm.listData = vm.listData.concat(listData)
        	}
        	callback(listData,timestart)
        }).catch(function(err){
        	vm.$vux.toast.show({type:"text",text:"网络错误"})
        	callback(vm.listData,timestart)
        	console.log("列表加载出错:",err)
        })
                
    },
    //首次加载
    firstLoad(done){
    	this.getList(1,done)
    },
    
    //下拉刷新
    onRefresh(done) {
      this.getList(1,done);
    },
    //上滑加载更多
    onLoadmore(done) {
      this.getList(++this.pageIndex,done);
    },
    
    
    setHeader:function(){
			let header={
				  title:'挂号记录',
				  left:{showBack:true,backText:''},
				  right:{rightHtml:'首页'}
				 }
				 this.$store.commit('setHeader',header)
		},
		
		//隐藏底部tabbar
		setTabbar:function(){
	    	this.$store.commit('setTabbar',false)
	   },
	   
	     //获取就诊人列表
	  getPatientList:function(){
	  	let the=this
	  	ajax.patientList()
	  	.then(function(res){
	  		the.patientList=res.data.patientList
	  		setTimeout(function(){
	  			the.setTabStyle(0)
	  		},30)
	  		
	  	})
	  },
	  
	  //设置searchBox样式
	  setSearchStyle:function(){
	  	let popupDialog=document.querySelector('.vux-popup-dialog')
	  	let title=document.querySelector('.search-box .title')
    	let buttonBar=document.querySelector('.search-box  .button-bar')
    	let main=document.querySelector('.search-box .main')
    	
    	popupDialog.style.maxHeight="70%"
      setTimeout(function(){
      	let winH=window.innerHeight
      	let popupDialogH=popupDialog.offsetHeight
      	let titleH=title.offsetHeight
      	let buttonBarH=buttonBar.offsetHeight
      	if(popupDialogH>=winH*0.69){
      		//console.log(popupDialogH,titleH,buttonBarH,popupDialogH-titleH-buttonBarH)
      		main.style.maxHeight=(popupDialogH-titleH-buttonBarH)+"px"
      	}
      	
      },300)
	  	
	  },
	  
	  //计算当前时间
	  getTimeNow :function(){
			  var now= new Date();
			  var prevYear=Date.parse(now)-12*30*24*60*60*1000
			  var timeNow=dateFormat(now, 'YYYY-MM-DD')//'YYYY-MM-DD HH:mm:ss'
			  var timePrevYear=dateFormat(prevYear, 'YYYY-MM-DD')//'YYYY-MM-DD HH:mm:ss'

				this.$set(this.datePicker,'startDate',timePrevYear);
				this.$set(this.datePicker,'endDate',timeNow);
		},
		
		//获取挂号初始选项数据
	  getiInitData:function(){
	    	var the=this
	    	ajax.initData_guahao()
	    	.then(function(res){
	    		console.log("initdata",res.data)
	    		the.initData=res.data
	    	
	    	})
	  },
	  
	  //数据转换
		transData:function(originData){
			if(originData.length==0){return originData}
			var the=this
			originData.forEach(function(item,index){
        
				//转换预约状态
	      the.initData.guahaoStateList.forEach(function(item1,index){
	      	if(item.guahaoState==item1.code){
	      		item.guahaoState=item1.name;
	      		//break;
	      	}
	      })
	      
	      //转换挂号type
	      the.initData.guahaoType.forEach(function(item1,index){
	      	if(item.guahaoType==item1.code){
	      		item.guahaoType=item1.name;
	      		//break;
	      	}
	       })
			})
			
			return originData
		},
		
		//设置tab样式
	  setTabStyle:function(index){
	  	var tab=document.querySelector(".vux-tab")
			var tabItems=document.querySelectorAll(".vux-tab-item")
			var tabLinBbar=document.querySelector(".vux-tab-ink-bar")
			var tabScrollW=tab.scrollWidth
			var curItemWindth=tabItems[index].offsetWidth
			
			var left=0
			tabItems.forEach(function(item,index1){
				var itemWindth=item.offsetWidth
				if(index>index1){
					left+=itemWindth
				}else if(index===0){
					left=0
				}
			})
			tabLinBbar.style.left=left+"px"
			tabLinBbar.style.width=curItemWindth+"px"
	  },
	  
	  
	  //判断路由跳转方向
	  getAction:function(){
	  	let action=this.$router.currentRoute.query.action
	  	switch(action){
	  		case "ecgAppl" : this.action="/appl-ecg-edit";break;
	  		case "guahaoView" : this.action="/appointment-guahao-view";break;
	  		default :this.action="/appointment-guahao-view";break;
	  	}
	  	
	  }
	  
	  
	  
  },
  
  created:function(){
  	this.getTimeNow()	
  	this.getiInitData()
  	
  },
  
 
  
  activated:function(){
  	this.setHeader()
  	this.setTabbar()
  	this.getPatientList()
  	this.getAction()
  }
 
  
}
</script>
<style scoped="scoped" lang="scss">
.vux-tab {
	overflow-x: auto;
	
}
.vux-tab .vux-tab-item{
	text-overflow: ellipsis;
	white-space: nowrap;
	
}

.vux-tab .moreSearch{
	flex-basis: 30px;
	background:url(../../../static/imgs/common/search-filter.png) no-repeat center;
	background-size: 1.3em 1.3em;
	
}


#pullRefresh{
	background-color: #efeff4;
	padding:0px 10px;
	
}

	#pullRefresh .list-item>a{
		display:block;
	}
	#pullRefresh .list-item{
		padding-bottom:7px;
		border-radius: 20px;
		box-shadow: 1px 1px 5px 0px #E4E4E4;
		margin-top:10px;
		margin-bottom:20px;
		background-color:#fff;
		overflow: hidden;
	}
	
	#pullRefresh .list-item p{
		font-size:16rem;
		
		.label{
			display:inline-block;
			min-width:70px;
			margin-right:10px;
			
		}
	}
	
	
	
	#pullRefresh .list-item .th .name{
		flex-basis: 23%;
    max-width: 23%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
		
	}

	#pullRefresh .list-item .th{
		background-color: #5aadfb;
		display: flex;
		align-items:flex-start;
		padding: 0px 15px; 
		color: #fff;
		line-height: 2.5em;
	}
	
		
	
	#pullRefresh .list-item .tr{
		padding:0px 15px;
		color: #202020;
		line-height: 2em;
	}
	
	
.datepicker /deep/  .scroller-component{
		height: 60px;
		
	}
	
.datepicker /deep/ .dp-container{
		background-color: transparent;
	}	

	.datepicker /deep/  .dp-content{
		padding:0px;
	}
	.datepicker /deep/  .scroller-item{
		font-size: 16px;
		line-height: 20px;
		height: 20px;
		
	}
	.datepicker /deep/  .scroller-indicator{
		height: 20px;
		top:20px;
		background-image:none;
		border-top: 1px solid #e3e3e3;
		border-bottom: 1px solid #e3e3e3;
	}
	.datepicker /deep/  .scroller-mask{
		background-image:linear-gradient(to bottom, rgba(255, 255, 255, 0.90) 10%, rgba(255, 255, 255,0) 30%, rgba(255, 255, 255, 0.90) 50%);
		
		
	}

	
	
</style>
<style lang="scss">
.guahao-list .search-box{
		background-color:#f8f8f8;
		border-radius: 8px 8px 0px 0px;
		.weui-cells{
			background-color:transparent;
			margin-top:0px;
			}
		.title{
			font-size:20rem;
			line-height:2.5em;
			color:#1b86ee ;
			padding:0px 13px;
			border-bottom: 1px solid #dadadd;
			margin:0px 10px;
			
		}
		.main{
			margin: 0px 10px;
			min-height:100px;
			/*max-height: 200px;*/
			padding:0px 13px;
			overflow-y:auto ;
			overflow-x:hidden ;
			padding-bottom:10px;
			box-sizing:border-box;
			
		}
		.button-bar{
			width: 100%;
			display: flex;
			.btn{
				flex: 1;
				font-size: 18px;
				text-align: center;
				line-height: 2.5em;
				border: none;
    	 -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    	 overflow: hidden;
			}
			.confirm{
				background-color: rgb(90,173,251);
				color: #fff;
			}
			.reset{
				background-color: #fff;
				color: #555;
				
			}
		}
	}
	
.guahao-list .search-box .search-item{
		margin-top:10px;
		.item-title{
			font-size: 16rem;
			line-height: 2em;
			color: #555;
			font-weight: normal;
		}
		
		.date-range{
			display: flex;
			align-items: center;
			.datepicker{
				width:50%;
				height:60px;
				line-height: 60px;
			}
			.dao{
				padding:0px 15px;
			}
		}
		
		.item-checker{
			font-size: 14rem;
			line-height: 1em;
			display: flex;
			flex-direction:row;
			justify-content:space-between;
			align-content:flex-start;
			flex-wrap:nowrap;
			overflow-x: auto;
			padding: 10px 0px;
      /*box-shadow: 0px 0px 3px 0px #dadada inset;
      border-radius: 10px;*/
		}
		
		.default-style{
			padding: 5px 10px;
			margin: 0px 7px;
			border:1px solid #00acee;
			color: #00acee;
			border-radius: 5px;
			text-align: center;
			text-overflow: ellipsis;
			white-space: nowrap;
			
		}
		
		.selected-style{
			color: #fff;
			background-color: #00acee;
		}
		
		
	}
	
			
</style>

