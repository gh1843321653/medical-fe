<template>
	<form id='cp-regist' ref='cp-changePsw' action='' method="post">
		<group ref='group'>
			<x-input  ref='oldPsw' v-model='oldPsw' type='password'   placeholder='请输入旧密码'  :min='6' required  ></x-input>
			<x-input  ref='newPsw1' v-model='newPsw1' type='password'   placeholder='请输入至少6位数新密码'  :min='6' required  ></x-input>
			<x-input  ref='newPsw2' v-model='newPsw2' :equal-with="newPsw1" type='password'   placeholder='请再次输入新密码'  :min='6' required ></x-input>
			<div class="submit">
				<x-button type='primary'  action-type='button' @click.native='submit($event)' >确定</x-button>
			</div>
		</group>
	</form>
	
	
</template>
<script>
import { XInput, Group, XButton, Cell,XTextarea ,Radio} from 'vux'
import ajax from '../../../server/api.js'
export default {
	components: {    XInput,    XButton,    Group,    Cell,    XTextarea,    Radio  },
  data () {
    return {
      	oldPsw:'',
      	newPsw1:'',
      	newPsw2:''
    }
  }, 
  methods: {
    submit:function(ev){
    	if(this.validator()){
    		let the=this
    		let submitData={
    			oldUserPwd:this.oldPsw,
    			newPwd:this.newPsw2
    			
    		}
    		ajax.changePsw(submitData)
    		.then(function(){
    			let time=1500
				the.$vux.toast.show({type:'text',text:'密码修改成功',time:time})
				the.loginOut()
				setTimeout(function(){
					the.$router.go(-1)
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
    	refs.oldPsw.focus();refs.oldPsw.blur();
    	refs.newPsw1.focus();refs.newPsw1.blur();
    	refs.newPsw2.focus();refs.newPsw2.blur();
    	
    	/*验证旧密码*/
    	if(!refs.oldPsw.valid){
    		if(this.oldPsw==''){
	    			this.$vux.toast.show({type:'text',text:"请填写旧密码"})
	    	}else{
	    			this.$vux.toast.show({type:'text',text:'旧密码至少6位数'})
	    	}
    		return false
    	}
    	/*验证新密码1*/
    	else if(!refs.newPsw1.valid){
    		if(this.newPsw1==''){
    			this.$vux.toast.show({type:'text',text:'请填写新密码'})
    		}else{
    			this.$vux.toast.show({type:'text',text:'新密码不能少于6位数'})
    		}
    		return false
    	}
    	/*验证新密码2*/
    	else if(!refs.newPsw2.valid){
    		if(this.newPsw2==''){
    			this.$vux.toast.show({type:'text',text:'请再次输入新密码'})
    		}else{
    			this.$vux.toast.show({type:'text',text:'两次输入的新密码不一致'})
    		}
    		return false
    	}
    	return true
  	
  	},
  	
  	setHeader:function(){
  		let header={
  			  title:'修改密码',
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
#cp-regist{
	padding-top:2px;
	
	
}

/deep/ .weui-cells:before{
	border-top:none;
}

/deep/ .weui-cell:before{
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
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
   
}
.submit{
	padding: 30px 15px 0px 15px;
}
	
</style>