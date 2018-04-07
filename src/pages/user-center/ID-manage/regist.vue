<template>
	<form id='cp-regist' ref='cp-regist'>
		<group ref='group'>
			<x-input title="" ref='mobile' v-model='mobile' placeholder="请输入手机号码"  keyboard="number" required is-type="china-mobile" :max='11':show-clear="true"   @input="activate" >
				<img class="icon" slot="label" src="../../../static/imgs/common/user-mobile.png"/>
			</x-input>
			<x-input title="" ref='vcode' v-model='vcode' placeholder="验证码" class="weui-vcode"  required :show-clear="false" >
	        	<img class="icon" slot="label" src="../../../static/imgs/common/user-vcode.png"/>
	        	<x-button slot="right" action-type='button' ref='btnVcode' :disabled='disabled' type="primary"  mini @click.native='getVcode'>
	        		<span >
	        			<countdown v-model="cdTime" :start="cdStart" @on-finish="timeFinish" v-if='cdStart'></countdown>{{btnVcodeText}}
	        		</span>
	        	</x-button>
	      	</x-input>
			<x-input title='' ref='password' v-model='password' type='password'   placeholder='请输入至少6位数密码'  :min='6' required :show-clear='true' >
				<img class="icon" slot="label" src="../../../static/imgs/common/user-password.png"/>
			</x-input>
		</group>
		<div class="item" >
			<label :class='{agree:agreeProtocol}' class="protocol">
				<span class="checkboxIcon"></span>
				<input type="checkbox"  value='false' v-model='agreeProtocol' /> 
				<span>同意<router-link to='/protocol' class='protocol-link'>《用户服务协议》</router-link></span>
			</label>
		</div>
		<div class="submit">
			<x-button type='primary'  action-type='button' @click.native='submit($event)' >提交</x-button>
		</div>
	</form>
</template>
<script>
import { XInput, Group, XButton, Cell,XTextarea ,Radio,Countdown} from 'vux'
import ajax from '../../../server/api.js'
export default {
	components: {XInput,XButton, Group, Cell, XTextarea, Radio, Countdown  },
  data () {
    return {
      	mobile:'',
      	vcode:'',
      	password:'',
      	btnVcodeText:'获取验证码',
      	cdTime:59 ,//倒计时 
      	cdStart:false,//倒计时状态
      	disabled:true,//按钮激活状态
        agreeProtocol:false//同意协议
    }
  }, 
 
  methods: {
    
    /*激活验证码按钮*/
  	activate:function(){
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
  		let the=this
  		this.btnVcodeText='s后重获验证码';
  		this.cdStart=true;
  		this.disabled=true;
  		/*ajax请求验证码...*/
  		let submitData={userName:this.mobile}
    	ajax.getVcode(submitData)
    	.catch(function(err){
    		the.$vux.toast.show({type:'cancel',text:err.msg})
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
    	var the=this;
    	if(this.validator()){
    		let submitData={
    			mobile:this.mobile,  
    			password:this.password,  
    			code:this.vcode
    		}
			ajax.regist(submitData)
			.then(function(res){
				the.$router.push('/login')
			}).catch(function(err){
				the.$vux.toast.show({type:"text",text:"网络错误"})
				console.log('err:',err)
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
    	//判断是否同意协议
    	else if(!this.agreeProtocol){
    		this.$vux.toast.show({type:'text',text:'请同意协议'})
    		return false
    	}
    	
    	return true 
    },
    
    setTabbar:function(){
    	this.$store.commit('setTabbar',false)
    },
    
    setHeader:function(){
		let header={
		  title:'注册',
		  left:{showBack:true,backText:''},
		  right:{rightHtml:'首页'}
		 }
		this.$store.commit('setHeader',header)
	}
   
  },
  activated:function(){
  	this.setTabbar()
  	this.setHeader()
  },
  
 
  
  
  
}




</script>
<style scoped lang='scss'>
/deep/ .vux-x-input{
		border-bottom: 1px solid #ececec;
	}
/deep/ .weui-cells:after{
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
/deep/  .weui-cell{
	padding-top: 20px;
	
}

/deep/ .weui-btn:after{
	border: none;
}
	
	
/deep/ .icon{
	width: 1.3em;
    margin-right: 15px;
    vertical-align: middle;
    height: 1.5em;
	
}		
	.item{
		padding: 0px 15px;
		margin-bottom: -10px;
		font-size: 17px;
		display: flex;
		.label-title{
			flex-basis: 80px;
		}
	}
	.label-title{
		width: 80px;
		
	}
	
	.submit{
		padding: 30px 15px 0px 15px;
	}
	
	.protocol{
		line-height: 50px;
		margin-left: 40px;
	}
	.protocol input{
		display: none;
	}
	.protocol span{
		vertical-align: middle;
	}
	.protocol .checkboxIcon{
		width: 18px;
		height: 18px;
		display: inline-block;
		border-radius: 50%;
		border: 1px solid #ccc;
		vertical-align: middle;
		margin-right: 10px;
		
	}
	.agree .checkboxIcon{
		border: 1px solid #00acee;
		text-align:center;
		position: relative;
		
	}
	.agree .checkboxIcon:after{
		content: '';
		display: inline-block;
		border-radius: 50%;
		width: 50%;
		height: 50%;
		background-color: #00ACEE;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -25%;
		margin-left: -25%;
	}
	
	
	.protocol-link{
		color: orangered;
		text-decoration: underline;
	}
	

</style>
<style type="text/css">
	
</style>