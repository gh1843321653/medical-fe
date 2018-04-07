<template>
  <div id="app" @touchstart='getTouchStartY($event)' @touchmove='toggleTabbar($event)'>
  	
  	<x-header  class='header' ref='header' :title='header.title' :left-options="{showBack:header.left.showBack,backText:header.left.backText,preventGoBack:true}"   :right-options="{showMore: false}" @on-click-back="back" @on-click-more="commonMenu" >
  		<div slot='right' v-html='header.right.rightHtml' @click='toIndex'></div>
  	</x-header>
  	
    <tabbar  class='tabbar' ref='tabbar' v-show='showTabbar'>
		 	<tabbar-item selected  link="/index" >
		 		<img class="on" slot="icon" src="./static/imgs/tab-index-on.png">
		 		<img class="off" slot="icon" src="./static/imgs/tab-index-off.png">
        <span slot="label">首页</span>
		 	</tabbar-item>
		 	<tabbar-item  link="/message-type" badge='2'>
		 		<img class="on" slot="icon" src="./static/imgs/tab-msg-on.png">
		 		<img class="off" slot="icon" src="./static/imgs/tab-msg-off.png">
        <span slot="label">消息</span>
		 	</tabbar-item>
		 	<tabbar-item  link="/my" >
		 		<img class="on" slot="icon" src="./static/imgs/tab-my-on.png">
		 		<img class="off" slot="icon" src="./static/imgs/tab-my-off.png">
        <span slot="label">我</span>
		 	</tabbar-item>
		</tabbar>
		 
		 <div id='content' >
		 	<transition :name="slideDerection" v-on:after-enter="afterEnter">
		 		<keep-alive>
			 		<router-view/>
			 	</keep-alive>
		 	</transition>
		 </div>
  </div>
</template>

<script>
import ajax from "./server/api.js";
import { XHeader, Tabbar, TabbarItem } from "vux";
export default {
	components: { XHeader, Tabbar, TabbarItem },
  data: function() {
    return {
      moveStartY: 0,
      moveStartX: 0,
      slideDerection:'toLeft',//页面切换方向
    };
  },
  name: "app",
  computed: {
    header: function() {
      return this.$store.state.common.header;
    },
    showTabbar: function() {
      return this.$store.state.common.showTabbar;
    }
  },
  
  methods: {
  	back:function(){
  		this.$router.go(-1)
  		this.slideDerection="toRight"
  		
  	},
  	
  	afterEnter:function(){
  		this.slideDerection="toLeft"
  		
  	},
  	
    toIndex: function() {
      this.$router.push("/index");
    },
   
   commonMenu: function() {
     // alert(651);
    },
   
    getTouchStartY: function(ev) {
      this.moveStartY = ev.targetTouches[0].clientY; 
      this.moveStartX = ev.targetTouches[0].clientX;
    },
    //控制tabbar滑动显现,向下划显示tabbar,向上划隐藏tabbar
    toggleTabbar: function(ev) {
      let moveEndY = ev.targetTouches[0].clientY;
      let moveEndX = ev.targetTouches[0].clientX;
      let distY = moveEndY - this.moveStartY;
      let distX = moveEndX - this.moveStartX;
      let tabbar = document.querySelector(".tabbar");
      let computedStyle = tabbar.currentStyle
        ? tabbar.currentStyle
        : document.defaultView.getComputedStyle(tabbar, null);
      let tabbar_h = tabbar.offsetHeight;
      if (Math.abs(distY) > Math.abs(distX)) {
        if (distY > 0) {
          tabbar.style.bottom = 0;
        } else {
          tabbar.style.bottom = -tabbar_h + "px";
        }
      }
    },

    autoLogin: function() {
      let the = this;
      let userFdId = this.$store.state.common.user.userFdid;
      let submitData = { userFdId: userFdId };
      ajax
        .getUser(submitData)
        .then(function(res) {
          let submitData = {
            type: res.data.userType,
            mobile: res.data.userId,
            password: res.data.userPsw
          };
          ajax
            .regist(submitData)
            .then(function(res) {
              let user = {
                userFdId: "",
                userId: the.mobile,
                userType: the.userType
              };
              the.$store.commit("setUser", user);
            })
            .catch(function(err) {
              console.log("err:", err);
            });
        })
        .catch(function(err) {});
    },
    
    //设置#content初始样式
    setContentInitStyle:function(){
    	let header=document.querySelector('.header')
    	let footer=document.querySelector('.tabbar')
    	let content=document.querySelector('#content')
    	if(header.currentStyle){
         var headerStyles=header.currentStyle;
         var footerStyles=footer.currentStyle;
         var contentStyles=content.currentStyle;
      }else{
      	var headerStyles=window.getComputedStyle(header,null)
        var footerStyles=window.getComputedStyle(footer,null)
        var contentStyles=window.getComputedStyle(content,null)
      }
    	let headerH=parseInt(headerStyles["height"])
    	let footerH=parseInt(footerStyles["height"])
    	let contentH=parseInt(contentStyles["height"])
    	let winH=window.innerHeight
			
			content.style.marginTop=headerH+"px";
    	//content.style.paddingBottom=footerH+"px";
    	content.style.minHeight=(winH-headerH)+"px"
    },
    
   
  },
  activated:function(){
  	console.log(111,this.$router)
  },
  mounted: function() {
    //this.autoLogin()
    this.setContentInitStyle()
   
  },

  
};
</script> 
<style lang="less">
@import "./static/styles/theme-vux.less";
</style>
<style lang='scss'>
@import "./static/styles/common.scss";
@import "./static/styles/common.css";
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#app  .header {
  position: fixed !important;
  top: 0;
  width: 100%;
  z-index: 1000;
  height:48px;
  line-height: 48px;
  background: linear-gradient(to right,#1b85ee, #2cb5ed);
  color: #fff;
  .vux-header-title{
		margin: 0 48px !important;
		
	}
	
	.left-arrow:before{
		border-top: 1px solid #fff;
		border-left: 1px solid #fff;
	}
   .vux-header-right{
   	color: #fff;
   }
}




 
.tabbar.weui-tabbar {
  position: fixed !important;
  transition: all 0.2s;
  background-color: #fff;
  box-shadow: 0px -1px 3px 0px #e6e4e4;
}
.weui-tabbar:before {
  border-top: none !important;
}

.tabbar .weui-tabbar__label{
	color: #7f8389;
}

.tabbar  .weui-tabbar__item{
	padding:9px 0px 0px;
}

.tabbar .weui-tabbar__item.weui-bar__item_on  .weui-tabbar__label {
 	color: #0677e2;
}



.weui-tabbar__item .on{
	display: none;
}
.weui-bar__item_on .on{
	display:inline-block;
}
.weui-bar__item_on .off{
	display:none;
	
}
#content{
	background-color: #fff;
	position: relative;
	}

/*页面切换过渡效果*/
/*向左*/
.toLeft-enter{
	transform: translateX(100vw);
	
}
.toLeft-leave-to{
	transform: translateX(-100vw);
	
}
.toLeft-enter-to,.toLeft-leave{
	transform: translateX(0px);

}

/*向右*/
.toRight-enter{
	transform: translateX(-100vw);
	
}
.toRight-leave-to{
	transform: translateX(100vw);
	
}
.toRight-enter-to,.toRight-leave{
	transform: translateX(0px);

}


.toLeft-enter-active,
.toLeft-leave-active,
.toRight-enter-active,
.toRight-leave-active{
	transition:all 0.4s;
	width:100vw;
	position: absolute;
	top: 0px;
	left: 0px;
}



</style>

