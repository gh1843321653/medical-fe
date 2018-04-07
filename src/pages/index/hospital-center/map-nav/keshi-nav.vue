<template>
	<div id="keshi-nav">
		<form class="search"   refs="form" action="" method="post" @submit="search($event)">
			<button class="searchBtn" type="submit" >
				<img slot="label" class="search-icon" src="../../../../static/imgs/common/search-off.png" />
			</button>
			<input  class="input-search" type="search" v-model="searchValue" placeholder="请输入科室"/>
		</form>
		
		<ul class="list">
			<li class="list-item">
				<dt class="title">
					<p>血液内科一病房</p>
				</dt>
				<dd class="address">内科楼F10</dd>
			</li>
			<li class="list-item">
				<dt class="title">
					<p>消防中心</p>
				</dt>
				<dd class="address">内科楼B1</dd>
			</li>
			<li class="list-item">
				<dt class="title">
					<p>麻醉科手术室</p>
				</dt>
				<dd class="address">外科楼F1F2F3</dd>
			</li>
			<li class="list-item">
				<dt class="title">
					<p>住院处</p>
				</dt>
				<dd class="address">内科楼F1、外科楼F1</dd>
			</li>
			<li class="list-item">
				<dt class="title">
					<p>CT室</p>
					<p>心脏导管二室</p>
					<p>CCU病房</p>
					<p>放射科介入室</p>
					<p>心脏导管一室</p>
				</dt>
				<dd class="address">内科楼F2</dd>
			</li>
			<li class="list-item">
				<dt class="title">
					<p>接诊室</p>
					<p>药剂科</p>
				</dt>
				<dd class="address">内科楼F1、外科楼F1</dd>
			</li>
			<li class="list-item">
				<dt class="title">
					<p>内科</p>
					<p>icu病房</p>
				</dt>
				<dd class="address">内科楼F1、外科楼F1</dd>
			</li>
		</ul>
	</div>
	
</template>
<script>
import {Group,Cell,XInput} from 'vux'	
import ajax from '../../../../server/api.js'	
export default{
	components:{Group,Cell,XInput},
	data:function(){
		return{
			searchValue:''
		}
	},
	
	watch:{
		searchValue:function(v){
			if(v==''){
				let listItem=document.querySelectorAll(".list-item")
				if(listItem){
					listItem.forEach(function(item){
						item.style.display="flex"
					})
					
					document.activeElement.blur()
				}
				
			}
		}
		
	},
	methods:{
		setListStyle:function(){
			let search=document.querySelector(".search")
			let list=document.querySelector(".list")
			let content=document.querySelector("#content")
			
			let contentH=parseInt(content.style.minHeight)
			let searchH=search.offsetHeight
			let listH=contentH-searchH-10
			
			list.style.height=listH+"px"
			
		},
		
		setHeader:function(){
			let header={
			  title:'科室导航',
			  left:{showBack:true,backText:''},
			  right:{rightHtml:'首页'}
			 }
			 this.$store.commit('setHeader',header)
		},
		//隐藏底部tabbar
		setTabbar:function(){
	    	this.$store.commit('setTabbar',false)
	    },
	    
	   
	    
	    search:function(ev){
	    	ev.preventDefault()
	    	document.activeElement.blur()
	    	let listItem=document.querySelectorAll(".list-item")
	    	let keyWord=this.searchValue
	    	let regexp=new RegExp(keyWord,"i")
	    	
	    	listItem.forEach(function(item,index){
	    		let has=regexp.exec(item.innerText)
	    		//console.log(index+","+has)
	    		if(!has){
	    			item.style.display="none"
	    		}
	    	})
	    	
	    	
	    }
	    
		   
		
	},
	mounted:function(){
		this.setListStyle()
		
	},
	activated:function(){
		this.setHeader()
		this.setTabbar()
		
		
	}
	
	
}	
</script>
<style scoped="scoped" lang='scss'>
#keshi-nav{
	position: relative;
}

.list-item{
	padding:0px 15px;
	display: flex;
	font-size: 16px;
	line-height: 1.8em;
	color: #555;
	border-bottom: 1px solid #eee;
	
}
.list-item:last-of-type{
	border-bottom: none;
}

.title{
	flex: 1;
	border-right: 1px solid #eee;
	padding: 3px 0px;
}
.address{
	flex: 1;
	padding: 3px 0px;
	padding-left: 10px;
}

.search{
	margin-bottom: 10px;
    box-shadow: 1px 1px 3px 0px #e2e2e2;
    padding:7px 15px;
    display: flex;
	/deep/ 	.weui-cells{
		font-size: 16px;
	}
	.searchBtn{
		background-color: transparent;
		border: none;
		
		
	}
	.search-icon{
		width: 1.1em;
		height: 1.1em;
		vertical-align: middle;
		margin-right: 5px;
		
	},
	.input-search{
		flex: 1;
		border: none;
		font-size: 16rem;
		line-height: 2em;
	}
}	
	
.list{
	overflow: auto;
}
</style>