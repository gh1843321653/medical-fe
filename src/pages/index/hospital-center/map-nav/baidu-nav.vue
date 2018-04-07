<template>
	<div id="baidu-nav">
		<div class="optBar">
			<div class="search-box" v-if=true>
				<div class="left">
					<label class="label" >
						<img class="limg" src="../../../../static/imgs/common/baidu-start.png"/>
						<input type="text" value=""  id="suggestId"   placeholder="请输入起点" />
					</label>
					
					<label  class="label" >
						<img class="limg" src="../../../../static/imgs/common/baidu-end.png"/>
						<input type="text" placeholder='终点' v-model="endPos" class='setEnd' disabled="disabled"/>
					</label>
				</div>
				<button class="btn-search" type="button" @click="keyWordSearch"></button>
				<div id="searchResultPanel" ></div>
			</div>
		    
		    <div v-if='false' class='showXl' style="z-index:11">
		    	<div class="ways" v-for="(item,index) in xl" @click='setXl($event,index)'>{{item}}</div>
		    </div>
		</div>
		<!--地图容器-->
		<baidu-map id="l-map" class="baidu-map" ak="KWsxqUsL2TGfa62jlbF6phTRKjiEnlrm" :center="center" :zoom="zoom" @ready="readyOpt" >
			<bm-view class="BMview" style="width: 100%; min-height:300px; flex: 1" ></bm-view>
			<!--比例尺-->
			<bm-scale anchor="BMAP_ANCHOR__RIGHT" :offset="bmScale" @ready="scaleComplete"></bm-scale>
			<!--定位控件-->
			 <bm-geolocation anchor="BMAP_ANCHOR_TOP_RIGHT" :offset="bmGeolocation" :showAddressBar="true" :autoLocation="true" @locationSuccess="dingweiSuccess"></bm-geolocation>
			<!-- 缩放-->
			 <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" :offset="bmNavigation" ></bm-navigation>
			
			<!--自定义控件-路线面板-->
  			<bm-control class="panelWay" anchor="BMAP_ANCHOR_TOP_Left"  @click.native="showPopup"></bm-control>	
				
			<!--自定义控件-简要公交路线-->
  			<bm-control class="sampleWay" anchor="BMAP_ANCHOR_TOP_Left"  @click.native="sampleWay"></bm-control>
		    
			<!--点覆盖物-->
			<bm-marker :position="center" :dragging="false" animation="BMAP_ANIMATION_BOUNCE">
		      <bm-label content="南山区蛇口医院" :labelStyle="{color: 'red', fontSize : '12px'}" :offset="{width: -35, height: 30}"/>
		    </bm-marker>
		</baidu-map>
		<!--路线展示面板-->
		<div  class='popup'  @click="hidePopup($event)">
			<div class="main">
				<!--公交路线规划-->
			   <bm-transit class="xxc" v-if='gongjiaoLx' :start="startPos" :end="endPos" :auto-viewport="true" location="深圳"  @markersset='biaozhuCom1' @infohtmlset='qipaoComplete' @resultshtmlset='jieguoCom1' @searchcomplete="jiansuoCom1"></bm-transit>
				<!--  驾车路线规划-->
			    <bm-driving v-if='false' :start="startPos" :end="endPos" :auto-viewport="true" location="深圳"></bm-driving>
			    <!-- 步行路线规划-->
			    <bm-walking v-if="false" :start="startPos" :end="endPos" :auto-viewport="true" location="深圳" @markersset="walkComplete" @infohtmlset="bqCom" @resultshtmlset="addResult" @searchcomplete="jiansuoComplete" @polylinesset="zhexianComplete"></bm-walking>
				<div id="panel-way"><!--路线文字展示面板--></div>
			</div>
		</div>
	</div>
</template>

<script>
import {BaiduMap,BmlMarkerClusterer,BmView,BmNavigation,BmScale,BmMapType,BmGeolocation,BmPanorama,
	BmControl,BmMarker,BmLabel,BmInfoWindow,BmTransit,BmLocalSearch,BmDriving,BmWalking, BmAutoComplete,BmOverlay } from 'vue-baidu-map'

export default {
  components: {
    BaiduMap,BmlMarkerClusterer,BmView,BmNavigation,BmScale,BmMapType,BmGeolocation,BmPanorama,
    BmControl,BmMarker,BmLabel,BmInfoWindow ,BmTransit,BmLocalSearch,BmDriving,BmWalking,BmAutoComplete,BmOverlay },
  data(){
    return {
    	map:undefined,
    	BMap:undefined,
    	
      	center: {lng: 113.928, lat: 22.502},
     		 	startZb:{lng: 113.928, lat: 22.502},
	 	startPos:'',
	    endPos:'南山区蛇口医院',
        zoom: 16,
        infoWindow: {
	        show: true,
	        contents: '这是信息窗体这是信息窗是信息窗体'
        },
     	bmScale:{
		  width: 10,
		  height: 10
		},
		bmGeolocation:{
		  width: 10,
		  height: 40
		},
		bmNavigation:{
			width:10,
			height:80
		},
		
		keyword:'',
		keyword1:'',
		
		klocation:'',
		
		xl:["公交","驾车","步行"],
		gongjiaoLx:false,
		jiacheLx:false,
		buxingLx:false,
		
		panel:undefined,
		
		
	
    }
  },
  
  methods: {
  	
  	//获取h5当前地理位置
  	getGeo:function(){
  		let showPosition=function(position){
  			console.log("Latitude: " + position.coords.latitude + "<br />Longitude: " + position.coords.longitude);
  		}
  		let errorCallback=function(error){
  			console.log(error);
  		}
  		if (navigator.geolocation){
	    	navigator.geolocation.getCurrentPosition(this.showPosition,this.errorCallback);
	    }else{
	   		console.log("该浏览器不支持地图定位功能");
	    }
  	},
  	
  	
    readyOpt:function(item){
    	this.BMap=item.BMap
    	this.map=item.map
	  	this.keyWordHint()
	  	this.touchPoint()
	  	this.setMapStyle()
	  	
    },
    
    //关键字输入提示
    keyWordHint:function(item){
	  	var _this=this
    	function G(id) {
			return document.getElementById(id);
		}
	  	var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
			{"input" : "suggestId","location" : _this.map, "hide": function (data) { console.log(data) }}
			);
		ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
			var str = "";
			var _value = e.fromitem.value;
			var value = "";
			if (e.fromitem.index > -1) {
				value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
			}    
			str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
			value = "";
			if (e.toitem.index > -1) {
				_value = e.toitem.value;
				value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
			}    
			str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
			G("searchResultPanel").innerHTML = str;
		});
		var myValue;
		ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
			_this.startPos = e.item.value.business;
			var _value = e.item.value;
			myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
			
			G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
			setPlace();
		});
		function setPlace(){
			_this.map.clearOverlays();    //清除地图上所有覆盖物
			function myFun(){
				if(local.getResults().getPoi(0)==undefined){
					_this.$vux.toast.show({type:"text",text:"无法查询，请调整起点关键字"})
					return false
				}
				var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
				_this.map.centerAndZoom(pp, 18);
				_this.map.addOverlay(new BMap.Marker(pp));    //添加标注
				
			}
			var local = new BMap.LocalSearch(_this.map, { //智能搜索
			  onSearchComplete: myFun
			});
			local.search(myValue);
			_this.gongjiaoLx = true;
			_this.showPopup()
		}
    },
    
    
    //关键字搜索
    keyWordSearch:function(){
    	let _this=this     
    	let startInput=document.querySelector("#suggestId").value
    	this.startPos=startInput
    	if(this.startPos==''){
    		this.$vux.toast.show({type:"text",text:"请输入起点",time:700})
    		return false
    	}
	
		let local = new BMap.LocalSearch(this.map, {
			renderOptions:{map: _this.map},
			onSearchComplete: myFun
		});
		local.search(this.startPos);
		function myFun(){
			if(local.getResults().getPoi(0)==undefined){
				_this.$vux.toast.show({type:"text",text:"无法查询，请调整起点关键字"})
				return false
			}
			var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
			_this.map.centerAndZoom(pp, 18);
			_this.map.addOverlay(new BMap.Marker(pp));    //添加标注
			_this.gongjiaoLx = true;//公交查询
			_this.showPopup()//公交面板展示
		}
    	
    },
    
    
    //注册地图点击事件
    touchPoint:function(){
    	let _this=this
		this.map.addEventListener("click", function(ev){
			let point=ev.point
			_this.startPos=point
			
			/*let marker = new BMap.Marker(point); // 创建点
			_this.map.clearOverlays();
			_this.map.addOverlay(marker);    //增加点
			marker.addEventListener("click",function(){
				var p = marker.getPosition();  //获取marker的位置
			});*/
	
	
		});
    },
    
    //定位当前位置
    dingweiSuccess:function(item){
    	let addressComponent=item.addressComponent
    	console.log(addressComponent)
    	let startInput=document.querySelector("#suggestId")
    	if(addressComponent.district==''){
    		this.$vux.toast.show({type:"text",text:"该手机定位不准确，请手动输入"})
    		startInput.focus()
    	}else{
			this.startPos = item.point
			startInput.placeholder="我的位置"
			startInput.value=addressComponent.city+addressComponent.district+addressComponent.street+addressComponent.streetNumber
			this.gongjiaoLx = true;
			this.showPopup()
    	}
		
    },
    
  	
   //出行方式选择
    setXl:function(event,index){
    	let _this=this
    	let cur=event.target
    	let list=cur.parentNode.children
    	for(var i in list){
    		if(list[i].classList){
    			list[i].classList.remove("curWay")
    		}
    	}
    	cur.classList.add("curWay")
    	
    	if(this.startPos==''){
    		this.$vux.toast.show({type:'text',text:"请输入起点",time:700})
    		document.querySelector("#suggestId").focus()
    		return false
    	}else if(this.startPos==''){
    		this.$vux.toast.show({type:'text',text:"请输入终点"})
    		document.querySelector(".setEnd").focus()
    		return false
    	}
    	
		if(index===0){
    		this.jiacheLx = false;
    		this.buxingLx = false;
    		this.gongjiaoLx = true;
    		use_transit()//由于Bmap-vue组件稳定性差，这里调用BM地图jsAPI
    		
    	}else if(index===1){
    		this.gongjiaoLx = false;
    		this.buxingLx = false;
    		this.jiacheLx = true;
    		use_driving()
    		
    	}else if(index===2){
    		this.jiacheLx = false;
    		this.gongjiaoLx = false;
    		this.buxingLx = true;
    		
    		use_walking()
    	}
    	_this.map.centerAndZoom(new BMap.Point(_this.center), 13);
    	_this.map.clearOverlays(); 
    	
    	function use_transit(){
    		let transit = new BMap.TransitRoute(_this.map, {renderOptions: {map: _this.map,autoViewport: true,panel: "panel-way"},policy: 0});
    		transit.search(_this.startPos,_this.endPos);
    		
    	}
    	function use_driving(){
    		let driving = new BMap.DrivingRoute(_this.map, {renderOptions:{map: _this.map, autoViewport: true,panel: "panel-way"},policy: 0});
			driving.search(_this.startPos,_this.endPos);
    	}
    	function use_walking(){
    		let walking = new BMap.WalkingRoute(_this.map, {renderOptions:{map: _this.map, autoViewport: true,panel: "panel-way"}});
			walking.search(_this.startPos,_this.endPos);
    	}
    },
    
    //自定义控件点击
    sampleWay:function(ev){
    	this.$router.push("/simple-way")
    	
    },
    
    //展开路线面板
    showPopup:function(){
    	let startInput=document.querySelector("#suggestId").value
    	this.startPos=startInput
    	if(this.startPos==''){
    		this.$vux.toast.show({type:"text",text:"请输入起点",time:700})
    		return false
    	}
    	document.querySelector(".popup").style.opacity="1"
    	document.querySelector(".popup").style.zIndex="10"
    	
    },
    
    hidePopup:function(ev){
    	ev.stopPropagation()
    	let popup=document.querySelector(".popup")
    	if(ev.target!==popup){return false}
    	popup.style.opacity="0"
    	setTimeout(function(){
    		popup.style.zIndex="-1"
    	},1000)
    },

	setMapStyle:function(){
		let map=document.querySelector(".baidu-map")
		let content=document.querySelector("#content")
		let menu=document.querySelector(".optBar")
		let conH=content.offsetHeight
		let menuH=menu.offsetHeight
		map.style.height=conH-menuH+"px"
		
	},


    scaleComplete:function(item){    },
    
    //步行路线检索
    walkComplete:function(item){//标注添加完成后的回调函数
    	//console.log(item);
    },
    bqCom:function(item){//标注气泡内容创建后的回调函数
    	//console.log(item);
    },
    addResult:function(item){//结果列表添加完成后的回调函数
    	//console.log(item);
    },
    jiansuoComplete:function(item){//检索完成后的回调函数
    	//console.log(item);
    },
    zhexianComplete:function(item){//折线添加完成后的回调函数
    	//console.log(item);
    },
    
     /*公交车完成事件*/
    biaozhuCom1:function(item){
    },
    qipaoComplete:function(item){
    	//console.log(item);
    },
    jieguoCom1:function(item){
    	
    	
    },
    jiansuoCom1:function(item){
    	//console.log(item);
    },
    changeZoom:function(num){
    	this.zoom = num
    },
    infoWindowClose (e) {
      this.infoWindow.show = false
    },
    infoWindowOpen (e) {
      this.infoWindow.show = true
    },
    clear () {
      this.infoWindow.contents = ''
    },
    

  
    
    setHeader:function(){
		let header={
			  title:'公交导航',
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
  
  
   mounted:function(){
	  this.$nextTick(function(){  })
   },
  
   activated:function(){
	   	this.setHeader()
	  	this.setTabbar()
   	
   }
}
</script>

<style scoped lang='scss'>
#baidu-nav{
	position: relative;
	
}

input::-webkit-input-placeholder{ 
    color: rgb(170,170,170);
}

.baidu-map {
	min-height:300px;
  	z-index:0;
  	
  .BMview{
  	width:100%;
  	height:100%;
  }
  
  
}

.optBar{
	background-color: #fff;
	box-shadow: 1px 1px 4px 0px #1a5e79;
}


.search-box{
	display: flex;
	padding:10px 15px;
	.left{
		display: flex;
		flex-direction:column;
		flex: 1;
	}
	.btn-search{
		background:url(../../../../static/imgs/common/search-on.png) no-repeat center;
		border: none;
	    color: #303030;
	    border-radius: 4px;
	    margin: 5px 0px;
	    margin-left: 10px;
	    flex-basis: 13%;
	    min-width: 13%;
	}
	.label{
		font-size: 16rem;
		line-height: 2em;
		padding: 5px 5px;
		display:flex;
		align-items: center;
		.limg{
			width: 13px;
			height: 13px;
			
		}
		/deep/ input{
			flex: 1;
			border: none;
			background-color: transparent;
			margin-left: 5px;
			color: #303030;
			font-size: 16rem;
			line-height: 2em;
		}
		
	}
	
	.label:first-of-type{
		border-bottom: 1px solid #d6d6db;
	}
	#searchResultPanel{
		border:1px solid #C0C0C0;
		width:150px;
		height:auto; 
		display:none;
	}
	
}

  
  .showXl{
	display: flex;
	flex-direction: row;
	justify-content:space-around;
	color: #bed6e5;
	padding-bottom: 2px;
	.ways{
		flex: 1;
		line-height:40px;
		text-align: center;
		
	}
	.curWay{
		color: #fff;
		border-bottom: 2px solid rgba(243,243,240,0.6);
	}
  }
 
  .keyW{
  	position: absolute;
	bottom:-360px;
	left:5%;
	width:90%;
	height:40px;
	z-index:13;
	display: flex;
  }
  .tangram-suggestion-main{
  	z-index:1111!important;
  }

.panelWay{
	top: 20px !important;
	left: 10px !important;
	width: 35px;
	height: 35px;
	overflow: hidden;
	background: url(../../../../static/imgs/common/baidu-routeList.png) no-repeat center;
	background-size: 100% 100%;
}

.sampleWay{
	top: 60px !important;
	left: 10px !important;
	width: 35px; 
	height: 35px;
	overflow: hidden;
    background:url(../../../../static/imgs/common/baidu-routeSimple.png) no-repeat center;
    background-size: 100% 100%;
    
}


#baidu-nav .popup{
	position: fixed;
	width: 100%;
	height: 100%;
	left: 0px;
	top: 0px;
	background-color: rgba(0,0,0,0.5);
	transition: opacity 1s;
	z-index: -1;
	opacity: 0;
	
	.main{
		max-height: 75%;
		min-height: 20%;
		overflow: auto;
		position: absolute;
		width: 100%;
		bottom: 0px;
		left: 0px;
		background-color: #fff;
	}
}



</style>