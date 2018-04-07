<template>
	<div>
		<group>
		    <cell title="我的消息" value="" is-link   link="/myMessage-list">
		    	<div slot="icon"><span class="icon-img" ></span></div>
		    	<badge text="1"></badge>
		    </cell>
		    <cell v-for="type in typeList" :key="type.fdId"  :title="type.name" is-link  :link="{path:'/message-list',query:{fdId:type.fdId,msgType:type.name}}">
		    	<div slot="icon"><span class="icon-img" ></span></div>
		    </cell>
		</group>
		
	</div>
</template>
<script>
import pullRefresh from '../../components/pullRefresh.vue';
import ajax from '../../server/api.js'
import {Group ,Cell,Badge} from 'vux'
export default{
	components:{Group,Cell,Badge},
	data:function(){
		return{
			typeList:[],//消息类别列表
		}
	},
	
	methods:{
		getTypeList:function(){
			var the=this
			ajax.messageType()
			.then(function(res){
				console.log("消息类别",res.data)
				the.typeList=res.data.templateList
			})
			.catch(function(err){
				the.$vux.toast.show({type:'text',text:'网络异常'}) 
			})
		},
		
		//设置icon颜色
		setIcon:function(){
			var the=this
			var colorArr=["#6a77d7","#4b91cf","#4ad0d1","#4ad498","#6edb4c","#addd4b","#e0cb4b","#e2884a","#e74b4c","#b76ad0"];
			var num=function(min,max){
					var x=Math.random()*(max-min)+min
				    return parseInt(x);
				}
			
			var interval=setInterval(function(){
				var icons=document.querySelectorAll(".weui-cell__hd .icon-img");
				
				if(the.typeList.length>0&&icons.length>1){
					clearInterval(interval)
					icons.forEach(function(item,index){
						var randomNum=num(0,colorArr.length-1);
						item.style.backgroundColor=colorArr[randomNum]
					})
				}
				
			},100)
			
			
		},
		
		setHeader:function(){
			let header={
				  title:'消息中心',
				  left:{showBack:true,backText:''},
				  right:{rightHtml:''}
				 }
				 this.$store.commit('setHeader',header)
		},
		
		//隐藏底部tabbar
		setTabbar:function(){
	    	this.$store.commit('setTabbar',true)
	   },
		
		
	},
	
	created:function(){
		this.getTypeList()
	},
	mounted:function(){
		this.setIcon()
	},
	activated:function(){
		this.setHeader()
		this.setTabbar()		
		
	}
	
	
}
	
</script>
<style scoped="scoped">
/deep/ .weui-cell__hd .icon-img{
	display: inline-block;
    width: 1em;
    height: 1em;
    vertical-align: middle;
    border-radius: 50%;
    border: none;
    margin-right: 1em;
	background-color:#6a77d7 ;
}	

/deep/ .weui-cell{
	padding:15px ;
	line-height: 2em;
}	


</style>