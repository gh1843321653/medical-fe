<template>
	<group id="user-config">
		<cell title="账号更改" is-link link="/change-account" v-if="userType==='0'">
			<div slot='icon'><img   src=""/></div>
		</cell>
		<cell title="账号注销" is-link link="/clear-account"  v-if="userType==='0'">
			<div slot='icon'><img   src=""/></div>
		</cell>
		<cell title="修改密码" is-link link="/change-psw" v-if="userType==='0'">
			<div slot='icon'><img   src=""/></div>
		</cell>
		<cell title="关于我们" is-link link="/about-us" >
			<div slot='icon'><img   src=""/></div>
		</cell>
		<cell title="退出登录" is-link link="/login" @click.native='loginOut'>
			<div slot='icon'><img   src=""/></div>
		</cell>
	</group>
</template>
<script>
import {Group,Cell} from 'vux'
export default{
	components:{Group,Cell},
	data:function(){
		return{
			userType:''
			
		}
		
	},
	
	methods:{
		loginOut:function(){
			let user={
    				userFdId:'',
    				userId:'',
    				userType:''
				}
			this.$store.commit('setUser',user)
		},
		
		setHeader:function(){
			let header={
			  title:'设置',
			  left:{showBack:true,backText:''},
			  right:{rightHtml:'首页'}
			 }
			 this.$store.commit('setHeader',header)
		},
		
		//隐藏底部tabbar
		setTabbar:function(){
	    	this.$store.commit('setTabbar',false)
	    },
		
		getUserType:function(){
			let userRole=this.$store.state.common.user.userType
			this.userType=userRole
		}
	},
	
	
	activated:function(){
		this.setHeader()
		this.setTabbar()
		this.getUserType()
	},
		
	
	
}
	
</script>