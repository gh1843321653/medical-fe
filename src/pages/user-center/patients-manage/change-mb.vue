<template>
	<form id='cp-regist' ref='cp-changeMb' action='' method="post">
		<group ref='group'>
			<x-input title='' ref='newMb' v-model='newMb' type='tel'   placeholder='请输入新手机号码' @input='activate'  is-type="china-mobile" :max='11' required :show-clear="true" >
				<img class="icon" slot="label" src="../../../static/imgs/common/user-mobile.png"/>
			</x-input>
			<x-input title="" ref='vcode' v-model='vcode' class="weui-vcode" type="number" required :show-clear="false">
				<img class="icon" slot="label" src="../../../static/imgs/common/user-vcode.png"/>
	        	<x-button slot="right" action-type='button' ref='btnVcode' :disabled='disabled' type="primary"  mini @click.native='getVcode'>
	        		<span >
	        			<countdown v-model="cdTime" :start="cdStart" @on-finish="timeFinish" v-if='cdStart'></countdown>{{btnVcodeText}}
	        		</span>
	        	</x-button>
	      	</x-input>
			<div class="submit">
				<x-button type='primary'  action-type='button' @click.native='submit($event)' >提交</x-button>
			</div>
		</group>
	</form>
	
	
</template>
<script>
import { XInput, Group, XButton, Cell,XTextarea ,Radio,Countdown} from 'vux'
export default {
	components: {    XInput,    XButton,    Group,    Cell,    XTextarea,    Radio,    Countdown },
  data () {
    return {
      	newMb:'',
      	vcode:'',
      	btnVcodeText:'获取验证码',
      	cdTime:59 ,//倒计时 
      	cdStart:false,//倒计时状态
      	disabled:true//按钮激活状态
      	
      	
    }
  }, 
  methods: {
  	/*激活验证码按钮*/
  	activate:function(){
  		if(this.newMb.length==11){
  			if(this.$refs.newMb.valid){
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
  		
  		
  	},
  	/*倒计时完成*/
  	timeFinish:function(){
  		this.disabled=false;
  		this.btnVcodeText='重获验证码';
  		this.cdTime=59;//倒计时 
  		this.cdStart=false;
  	},
  	/*表单提交*/
    submit:function(ev){
    	if(this.validator()){
    		
    	}
    	
    },
    
    validator:function(){
    	var refs=this.$refs;
    	/*全局验证*/
    	refs.newMb.focus();refs.newMb.blur();
    	refs.vcode.focus();refs.vcode.blur();
    	
    	/*验证新号码*/
    	if(!refs.newMb.valid){
    		if(this.newMb==''){
	    			this.$vux.toast.show({type:'cancel',text:"请填写手机号码"})
	    		}else{
	    			this.$vux.toast.show({type:'cancel',text:'手机号码格式有误'})
	    			return false
	    		}
	    	this.disabled=true;
    		return false
    	}
    	/*验证验证码*/
    	else if(!refs.vcode.valid){
    		/*ajax验证验证码...*/
    		if(this.vcode==''){
    			this.$vux.toast.show({type:'cancel',text:'请填写验证码'})
    		}else{
    			/*ajax请求确认验证码...*/
    			this.$vux.toast.show({type:'cancel',text:'验证码有误'})
    		}
    		return false
    	}
    	return true
    	
    },
    
    setHeader:function(){
		let header={
			  title:'修改手机',
			  left:{showBack:true,backText:''},
			  right:{rightHtml:'首页'}
			 }
		this.$store.commit('setHeader',header)
	},
	
	//隐藏底部tabbar
	setTabbar:function(){
    	this.$store.commit('setTabbar',false)
    }
   
  },
  
  activated:function(){
  	this.setHeader()
  	this.setTabbar()
  	
  }
  
  
}




</script>
<style scoped lang='scss'>
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
/deep/ .weui-cells:after{
		border-bottom: 0px;
	}
.submit{
		padding: 30px 15px 0px 15px;
	}
	
	
/deep/ .weui-cell:before{
		border-top: 0px;
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
</style>