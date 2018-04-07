<template>
	<div>
		<ul class='meta'>
			<li class='title'>{{messageView.title}}</li>
			<li class='create-time'>{{messageView.docCreateTime}}</li>
			<li>
				<div class="content" v-html="messageView.content"></div>
			</li>
			
		</ul>
		
	</div>
	
</template>
<script>
import pullRefresh from '../../components/pullRefresh.vue';
import ajax from '../../server/api.js'
export default{
	data:function(){
		return{
			messageView:{},//消息详情 
		}
	},
	
	methods:{
		getMessageView:function(){
			var the=this
			var submitData={
				fdId:this.$router.currentRoute.query.messageId
			}
			ajax.messageView(submitData)
			.then(function(res){
				//console.log("消息详情",res.data)
				the.messageView=res.data
			})
			.catch(function(err){
				the.$vux.toast.show({type:'text',text:'网络异常'})
			})
		},
		setHeader:function(){
			let header={
				  title:this.$router.currentRoute.query.msgTitle,
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
		
	},
	activated:function(){
		this.setHeader()
		this.setTabbar()
		this.getMessageView()
		
	}
	
	
}
	
</script>
<style scoped="scoped">

.content{
	margin: 15px;
	margin-top: 20px;
	overflow: hidden;
	padding-bottom: 100px;
}
.title{
	font-size: 18px;
	text-align: center;
	font-weight: normal;
	line-height: 2em;
	width: 80%;
	margin: 0px auto;
	margin-top: 20px;
}	
.create-time{
	font-size: 14px;
	text-align: center;
}
	

</style>