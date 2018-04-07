<template>
	<form id="cp-forgetPsw">
		<group ref='group'>
			<x-input title="" ref='mobile' v-model='mobile' :placeholder="userType==='1'?'请输入手机号码':'请输入账号'"  keyboard="number" required :is-type="userType=='1'?'china-mobile':''" :max='11':show-clear="true"   @input="activate" >
				<img class="icon" slot="label" src="../../../static/imgs/common/user-mobile.png"/>
			</x-input>
			<x-input title="" ref='vcode' v-model='vcode' class="weui-vcode"  required :show-clear="false">
				<img class="icon" slot="label" src="../../../static/imgs/common/user-vcode.png"/>
	        	<x-button slot="right" action-type='button' ref='btnVcode' :disabled='disabled' type="primary"  mini @click.native='getVcode'>
	        		<span >
	        			<countdown v-model="cdTime" :start="cdStart" @on-finish="timeFinish" v-if='cdStart'></countdown>{{btnVcodeText}}
	        		</span>
	        	</x-button>
	      	</x-input>
			<x-input title='' ref='password' v-model='password' type='password'   placeholder='请输入新密码，至少6位数'  :min='6' required :show-clear='true' >
				<img class="icon" slot="label" src="../../../static/imgs/common/user-password.png"/>
			</x-input>
		</group>
		<div class="submit">
			<x-button type='primary' action-type='button'  @click.native='submit($event)' >提交</x-button>
		</div>
		<div class="others">
			<router-link class='toRegist' to='/login'>去登陆</router-link>
			<router-link class='toRegist' to='/regist'>重新注册</router-link>
		</div>
		
		
	</form>
</template>
<script>
import { XInput, Group, XButton, Cell,XTextarea ,Radio,Countdown} from 'vux'
import ajax from '../../../server/api.js'
	export default{
		 data () {
		    return {
		      	userType:'1',
		      	mobile:'',
		      	vcode:'',
		      	password:'',
		      	btnVcodeText:'获取验证码',
		      	cdTime:59 ,//倒计时 
		      	cdStart:false,//倒计时状态
		      	disabled:true,//按钮激活状态
		      
		    }
		  }, 
		  
		  methods:{
		  	
		  	/*激活验证码按钮*/
		  	activate:function(){
		  		console.log(this.mobile)
		  		if(this.mobile.length==11){
		  			if(this.$refs.mobile.valid){
		  				this.disabled=false;
		  			}else{
		  				this.disabled=true;
		  			}
		  		}else{
		  			this.disabled=true;
		  		}
		  	},
		  	
		  	/*获取验证码*/
		  	getVcode:function(){
		  		this.btnVcodeText='s后重获验证码';
		  		this.cdStart=true;
		  		this.disabled=true;
		  		/*ajax请求验证码...*/
		  		let submitData={userName:this.mobile}
		  		let str=JSON.stringify(submitData)
		  		let str1='data'+str
		    	ajax.getVcode(submitData)
		    	.catch(function(err){
		    		this.$vux.toast.show({type:'cancel',text:err.msg})
		    	})
		  	},
		  	
		  	/*倒计时完成*/
		  	timeFinish:function(){
		  		this.disabled=false;
		  		this.btnVcodeText='重获验证码';
		  		this.cdTime=59;//倒计时 
		  		this.cdStart=false;
		  	},
		  	
		  	submit:function(ev){
		    	if(this.validator()){
		    		let the=this
		    		let submitData={
		    			mobile:this.mobile,
		    			password:this.password,
		    			code:this.vcode
		    		}
		    		ajax.forgetPsw(submitData)
		    		.then(function(res){
		    			let time=1500
						the.$router.go(-1)
		    		}).catch(function(err){
		    			the.$vux.toast.show({type:'text',text:err.data.msg,time:time})
		    		})
		    	}
		    	
		    },
		    
		    validator:function(){
		    	var refs=this.$refs;
		    	/*全局验证*/
		    	refs.mobile.focus();refs.mobile.blur();
		    	refs.vcode.focus();refs.vcode.blur();
		    	refs.password.focus();refs.password.blur();
		    	
		    	/*验证手机*/
		    	if(!refs.mobile.valid){
		    		if(this.mobile==''){
			    		this.$vux.toast.show({type:'text',text:"请输入手机号码"})
		    		}else if(this.mobile!=''){
		    			this.$vux.toast.show({type:'text',text:'手机号码格式有误'})
		    		}
		    		this.disabled=true;
		    		return false
		    	}
		    	/*验证验证码*/
		    	else if(!refs.vcode.valid){
		    		if(this.vcode==''){
		    			this.$vux.toast.show({type:'text',text:'请输入验证码'})
		    		}else{
		    			/*ajax验证验证码...*/
		    			this.$vux.toast.show({type:'text',text:'验证码错误'})
		    		}
		    		return false
		    	}
		    	/*验证密码*/
		    	else if(!refs.password.valid){
		    		if(this.password==''){
		    			this.$vux.toast.show({type:'text',text:'请输入密码'})
		    		}else{
		    			this.$vux.toast.show({type:'text',text:'密码不能少于6位数'})
		    		}
		    		return false
		    	}
		    	
		    	return true 
		    },
  	
		  	getInitData:function(){
		  		this.mobile=this.$root.mobile ? this.$root.mobile :'';
		  		this.userType=this.$root.userType ? this.$root.userType :'';
		  		delete this.$root.mobile
		  		delete this.$root.userType
		  	},
		  	
		  	setHeader:function(){
		  		let header={
		  			  title:'忘记密码',
					  left:{showBack:true,backText:''},
					  right:{rightHtml:'首页'}
		  		}
		  		this.$store.commit('setHeader',header)
		  	},
		  	
		  	setTabbar:function(){
		    	this.$store.commit('setTabbar',false)
		    },
		  	
		  },
		  
		  mounted:function(){
		  	this.getInitData()
		  },
		  
		  activated:function(){
		  	this.getInitData()
		  	this.setHeader()
		  	this.setTabbar()
		  },
		  
		  components: {XInput, XButton, Group, Cell, XTextarea, Radio, Countdown }
		
		
	}
	
</script>
<style lang="scss" scoped="scoped">
/deep/ .icon{
	width: 1.3em;
    margin-right: 15px;
    vertical-align: middle;
    height: 1.5em;
	
}

.others{
	display: flex;
	margin-top: 30px;
	a{
		flex: 1;
		text-align: center;
		line-height: 2em;
	}
	a:first-of-type:after{
		content: '';
		float: right;
		height: 100%;
		border-right: 1px solid #aaa;
	}
	
}
.submit{
	padding: 30px 15px 0px 15px;
}

	
/deep/  .weui-cell{
	padding-top: 20px;
	
}	
/deep/ .vux-x-input{
	border-bottom: 1px solid #ececec;
}
/deep/  .weui-cells:after{
	border-bottom: 0px;
}

/deep/ .weui-cells:before{
	border-top: 0px;
}
/deep/ .weui-cell:before{
	border-top: 0px;
}
/deep/ .weui-label{
    width: 80px !important;
    
}	
/deep/ .weui-btn:after{
	border: none;
}
	
</style>
<style type="text/css">
	
</style>