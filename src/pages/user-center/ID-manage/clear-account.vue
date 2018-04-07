<template>
	<form  id="clearAccount" action='' method="post">
		<group ref='group'>
			<x-input  ref='password' v-model='password' type='password'   placeholder='请输入密码'  :min='6' required  >
				<img class="icon" slot="label" src="../../../static/imgs/common/user-password.png"/>
			</x-input>
			<div class="submit">
				<x-button type='primary'  action-type='button' @click.native='submit($event)' >确定</x-button>
			</div>
		</group>
	</form>
	
	
</template>
<script>
import { XInput, Group, XButton } from 'vux'
import ajax from '../../../server/api.js'
export default {
	components: {    XInput,    XButton,    Group,   },
  data () {
    return {
      	password:'',
    }
  }, 
  methods: {
    submit:function(ev){
    	if(this.validator()){
    		let the=this
    		let submitData={
    			password:this.password,
    			
    		}
    		ajax.clearAccount(submitData)
    		.then(function(){
    			let time=1500
				the.$vux.toast.show({type:'text',text:'账号已注销',time:time})
				the.loginOut()
				setTimeout(function(){
					the.$router.push("/index")
				},time)
    		})
    		.catch(function(err){
    			the.$vux.toast.show({type:'text',text:err.data.msg,time:2000})
    		})
    	}
    	
    },
    
    loginOut:function(){
		let user={
				userFdId:'',
				userId:'',
				userType:''
			}
		this.$store.commit('setUser',user)
	},
	
    validator:function(){
  		var refs=this.$refs;
    	
    	/*全局验证*/
    	refs.password.focus();refs.password.blur();
    	
    	/*验证旧密码*/
    	if(!refs.password.valid){
    		if(this.password==''){
	    			this.$vux.toast.show({type:'text',text:"请填写密码"})
	    	}else{
	    			this.$vux.toast.show({type:'text',text:'密码至少6位数'})
	    	}
    		return false
    	}
    
    	return true
  	
  	},
  	
  	setHeader:function(){
  		let header={
  			  title:'注销账号',
			  left:{showBack:true,backText:''},
			  right:{rightHtml:'首页'}
  		}
  		this.$store.commit('setHeader',header)
  	},
  	
  	setTabbar:function(){
    	this.$store.commit('setTabbar',false)
    },
  
   
  },
  
  activated:function(){
  	this.setHeader()
  	this.setTabbar()
  	
  }
  
  
  
  
}




</script>
<style scoped lang='scss'>
#clearAccount{
	padding-top: 1px;
}

	/deep/ .icon{
	width: 1.3em;
    margin-right: 15px;
    vertical-align: middle;
    height: 1.5em;
	
}	
/deep/  .weui-cell{
	padding-top: 20px;
	
}	

.submit{
		padding: 30px 15px 0px 15px;
	}
	
/deep/ .weui-cells:before{
	border: none;
}	

/deep/ .weui-cell:after{
	content: " ";
    position: absolute;
    left: 15px;
    bottom: 0;
    right: 15px;
    height: 1px;
    border-top: 1px solid #D9D9D9; 
    color: #D9D9D9;
    
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
}
</style>