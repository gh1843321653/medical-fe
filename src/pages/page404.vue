<template>
	<div class="page404">
		<div class="center"></div>
	</div>
</template>
<script>
export default{
		data:function(){
			return{
						
			}
		},
		methods:{
			
			setHeader:function(){
				let header={
				  title:'错误',
				  left:{showBack:true,backText:''},
				  right:{rightHtml:'首页'}
				 }
				 this.$store.commit('setHeader',header)
			},
			
			//隐藏底部tabbar
			setTabbar:function(){
		    	this.$store.commit('setTabbar',true)
		    },
		    
			
		},
		
		activated:function(){
			this.setHeader()
			this.setTabbar()
			
		},
		
}	
	
</script>
<style scoped="scoped" lang="scss">
.page404{
	height: 100vh;
	display: flex;
	justify-content: center;
	align-content: center;
	align-items: center;
	margin-top: -50px;
	.center{
		flex: 75%;
		max-width: 75%;
		height: 300px;
		background:#fff url(../static/imgs/common/page404.png) no-repeat center 25%;
		background-size:contain;
		
	}
}	
</style>