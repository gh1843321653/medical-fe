<template>
	<form id='cp-login' ref='cp-login' >
		<img class="banner" src="../../../static/imgs/common/login-bg.png" @error="loadError($event)"/>
		<group ref='group'>
			<x-input class="userType" title="" ref='userType' v-model='userRole' placeholder="登陆身份"  required  :show-clear="false" :readonly='true' @click.native="slideDown">
				<img class="icon" slot="label" src="../../../static/imgs/common/user-role.png"/>
				<span class="arrow" slot="right" src=""></span>
			</x-input>
			<div class="role-box" >
				<radio v-model="userRole" :options="['我是用户','我是医生']" @on-change="change"></radio>
			</div>
			<x-input title="" ref='mobile' v-model='mobile' :placeholder="userType==='0'?'请输入手机号码':'请输入账号'" keyboard="number" required :is-type="userType=='0'?'china-mobile':''" :max="userType==='0'?11:111":show-clear="true" @on-focus="onFocus">
				<img class="icon" slot="label" src="../../../static/imgs/common/user-account.png"/>
			</x-input>
		
			<x-input title='' ref='password' v-model='password' type='password'   :placeholder="userType==='0'?'请输入至少6位数密码':'请输入密码'"  :min="userType==='0'?6:1" required :show-clear='false' >
				<img class="icon" slot="label" src="../../../static/imgs/common/user-password.png"/>
			</x-input>
		</group>
		<div class='submit'>
			<x-button type='primary' action-type='button' @click.native='submit($event)'>登录</x-button>
		</div>
		<div class="others">
			<router-link class='toRegist' to='/regist' v-show="userType=='0'||userType==''">用户注册</router-link>
			<a class='forgetPsw' ref='forgetPsw'  @click='forgetPsw($event)'>忘记密码</a>
		</div>
	</form>
	
	
</template>
<script>
import { XInput, Group, XButton,  Swiper, SwiperItem,Radio} from 'vux'
import ajax from '../../../server/api.js'
export default {
	components: {XInput,XButton,Group,Swiper, SwiperItem ,Radio},
  data () {
    return {
      	userType:'',//0患者，1医生
      	mobile:'',
      	password:'',
      	userRole:'',
      
    }
  }, 


  methods: {
    slideDown:function(){
    	let arrow=document.querySelector(".arrow")
    	let roleBox=document.querySelector(".role-box")
    	arrow.classList.toggle("arrowDown")
    	roleBox.classList.toggle("slideDown")
    	
    },
    
    loadError:function(ev){
    	let target=ev.target
    	target.style.display="none"
    },
    
  	change:function(){
  		let _this=this
  		setTimeout(function(){
  			let userRole=_this.userRole
	  		switch(userRole){
	  			case "我是用户":_this.userType='0';break;
	  			case "我是医生":_this.userType='1';break;
	  			default :_this.userType='';break;
	  		}
	  		
	  		},30)
  		this.slideDown()
  	},
    
   
    submit:function(ev){
    	let the=this;
    	
    	if(this.validator()){
    		let submitData={
    			type:this.userType,
    			mobile:this.mobile,
    			password:this.password
    		}
    		
    		//登录
    		ajax.login(submitData)
    		.then(function(res){
    			let user={
	    				userFdId:res.data.uid? res.data.uid:'',
	    				userId:the.mobile?the.mobile:'',
	    				userType:the.userType?the.userType:''
    				}
    			the.$store.commit('setUser',user)
    			let redirectPath=the.$router.currentRoute.query.redirect
    			if(redirectPath){
    				the.$router.push(redirectPath)
    			}else{
    				the.$router.push("/index")
    			}
    			
    		})
    		.catch(function(err){
    			the.$vux.toast.show({type:"text",text:err.data.msg})
    		})
    		
    	}
    	
    },
    
    
    forgetPsw:function(ev){
    	ev.preventDefault()
    	if(this.userType===''){
    		this.$vux.toast.show({type:'text',text:'请选择用户类型'})
    	}
    	else if(this.userType==='1'){
    		this.$vux.toast.show({type:'text',text:'请联系管理员找回密码'})
    	}else{
    		//寄存usertype和账号
    		this.$root.userType=this.userType
    		this.$root.mobile=this.mobile
    		this.$router.push('/forget-psw')
    		
    	}
    },
    
    validator:function(){
    	let refs=this.$refs;
    	
    	/*验证用户类型*/
    	if(this.userType===''){
    		this.$vux.toast.show({type:'text',text:"请选择用户类型"})
    		return false
    	}
    	
    	/*验证用户手机*/
    	else if(this.userType==='0'&&!refs.mobile.valid){
    		if(this.mobile==''){
	    		this.$vux.toast.show({type:'text',text:"请输入手机号码"})
	    	}else if(this.mobile!=''){
	    		this.$vux.toast.show({type:'text',text:'手机号码格式有误'})
	    	}
	    	return false
    	}
    	//验证医生账号
    	else if(this.userType=='1'&&this.mobile==''){
    		this.$vux.toast.show({type:'text',text:"请输入账号"})
	    	return false
    		
    	}
    	
    	/*验证用户密码*/
    	else if(this.userType==='0'&&!refs.password.valid){
    		if(this.password==''){
    			this.$vux.toast.show({type:'text',text:'请输入密码'})
    		}else{
    			
    			this.$vux.toast.show({type:'text',text:'密码不能少于6位数'})
    		}
    		return false
    	}
    	//验证医生密码
    	else if(this.userType=='1'&&this.password==''){
    		this.$vux.toast.show({type:'text',text:"请输入密码"})
	    	return false
    	}
    	
    	return true
    	
    },
    
    setHeader:function(){
		let header={
		  title:'登陆',
		  left:{showBack:true,backText:''},
		  right:{rightHtml:'首页'}
		 }
		 this.$store.commit('setHeader',header)
	},
	
	setTabbar:function(){
    	this.$store.commit('setTabbar',false)
    },
    
   
    
    
    getInitData:function(){
    	let userType=this.$store.state.common.user.userType ? this.$store.state.common.user.userType : ''//0患者，1医生
    	let mobile=this.$store.state.common.user.userId ? this.$store.state.common.user.userId : ''
    	this.userType=userType
    	this.mobile=mobile
    },
    
    getSessionId:function(){
    	//请求后台sessionId
	  	/*ajax.getSessionId()
	  	.then(function(res){
	  		localStorage.setItem('sessionId',res.data.sessionId)
	  	})
	  	.catch(function(err){
	  		
	  	})*/
    	
    },
    
    
    //启动输入法
    openKeyboard:function(){
    	setTimeout(function(){
    		document.querySelector("input[type=text]").focus()
    	},800)
    	
    },
    
    //监听焦点事件
    onFocus:function(val,ev){
    	let content=document.querySelector("#content")
    	let banner=document.querySelector(".banner")
    	let _this=this
    	if(ev){
    		var input=ev.target
    		setTimeout(function(){
    			input.scrollIntoView(false);
				input.scrollIntoViewIfNeeded();
				//content.scrollTop=banner.offsetHeight
			
    		},200)
    	}
    	
    	
    },
    
    //填充默认usertype
    fillUserRole:function(){
    	let userRole=this.userRole
    	switch(userRole){
  			case "我是用户":this.userType='0';break;
  			case "我是医生":this.userType='1';break;
  			default :this.userType='';break;
  		}
    },
    
   
  },
  
  
  activated:function(){
  	this.setTabbar()
  	this.setHeader()
  	this.getInitData()
  	this.fillUserRole()
  },
  
  mounted:function(){
  	this.getSessionId()
  	this.onFocus()
  
  
  },
  
  
  
}




</script>
<style scoped lang='scss'>
@import '../../../static/styles/common.scss';

#cp-login{
	position: relative;
	min-height: 350px;
	padding-bottom: 300px;
}

.userType /deep/ .weui-cell__ft{
	order: 100;
	margin-right:15px;
	max-width: 30px;
}

.banner{
	width: 100%;
}

.arrow{
	display: inline-block;
	width:12px;
	height: 12px;
	border-right:1px solid #555;
	border-bottom:1px solid #555;
	transform: rotate(-45deg);
	transition: transform 0.5s;
}	
.arrowDown{
	transform: rotate(45deg);
}
	
.role-box{
	transition: height 0.5s;
	height: 0px;
	overflow: hidden;
	background-color: #f5f5f5;
}	
.slideDown{
	height:100px;
}	
	
/deep/ .icon{
	width: 1.3em;
    margin-right: 15px;
    vertical-align: middle;
    height: 1.5em;
	
}	

/deep/ .weui-check__label{
	padding-left: 54px;
}
	

/deep/ .weui-cell{
	padding-top:20px
}
	
.others{
	display: flex;
	margin-top: 30px;
	a{
		flex: 1;
		text-align: center;
		line-height: 2em;
	}
	a:after{
		content: '';
		float: right;
		height: 100%;
		border-right: 1px solid #e2e2e2;
	}
	a:last-of-type:after{
		border-right: 0px;
	}
	
} 
.submit{
	padding: 30px 15px 0px 15px;
}
	
	
/deep/	.weui-cells:before,
/deep/ .weui-cells:after{
		border:none
	}
	
/deep/ .vux-x-input:last-of-type:after{
	content: " ";
    position: absolute;
    left: 15px;
    bottom: 0;
    right: 15px;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
}	
	
/deep/ .weui-cell:before{
	right: 15px;
}	
</style>
