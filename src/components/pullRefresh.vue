<template lang="html">
  <div id="pullRefresh" ref='pullRefresh' @touchstart="touchStart($event)"  @touchmove="touchMove($event)"  @touchend="touchEnd($event)"
  @scroll="onScroll($event)"   >
	  <header class="pull-down" ref='pullDown'>
	      <slot name="pull-refresh">
	         <span class="load-tip" v-if="state=='downTip1'">下拉刷新</span>
	         <span class="load-tip" v-if="state=='downTip2'">松手开始刷新</span>
	         <load-more class='load-tip' tip="正在刷新"  v-if="state=='downTip3'"></load-more>
	         <span class="load-tip" v-if="state=='downTip4'">刷新完成</span>
	         <divider  class='load-tip' v-if="state=='downTip5'">暂无数据</divider>
	      </slot>
	  </header>
	  <slot></slot>
	  <footer class="load-more" ref='loadMore'>
	      <slot name="load-more">
	        <span class="load-tip" v-if="state=='upTip1'">上拉更新</span>
	        <span class="load-tip" v-if="state=='upTip2'">松手开始加载更多</span>
	        <load-more class='load-tip' tip="正在加载"  v-if="state=='upTip3'"></load-more>
	        <span class="load-tip" v-if="state=='upTip4'">加载完成</span>
	        <divider  class='load-tip' v-if="state=='upTip5'">没有更多数据</divider>
	      </slot>
	   </footer>
  </div>
</template>

<script>
import { LoadMore,Divider } from 'vux'
export default {
	components:{LoadMore,Divider},
  props: {
  	onFirstLoad:{
      type: Function,
      default: undefined,
      required: false
    },
    onRefresh:{
      type: Function,
      default: undefined,
      required: false
    },
    onLoadmore: {
      type: Function,
      default: undefined,
      require: false
    },
    onSearch:{
    	type: Function,
      default: undefined,
      require: false
    },
    searchActive:
    {
    	type: Boolean,
      default: false,
      require: false	
    },
  
  },
  data() {
    return {
      state: '',
      touchStaY: 0,
      scrollHeight:0,
      scrollTop:0,
      scrollBottom:0
      
    }
  },
  
  watch:{
  	searchActive:function(){
  		this.onSearch(this.refreshDone)
  	}
  	
  },
  methods: {
  	
    touchStart(ev) { 
      this.touchStaY = ev.targetTouches[0].pageY
      this.refreshEl.classList.add('noTrans');
			this.loadMoreEl.classList.add('noTrans');
      this.scrollHeight=this.$refs.pullRefresh.scrollHeight;//因为页面滑到底部时scrollHeight将发生未知变化，所以此处需要保存该值
    },
    touchMove(ev) {
      let touchEndY=ev.targetTouches[0].pageY
      let dist=(touchEndY-this.touchStaY)*0.35//弹性系数0.35
      
      this.scrollTop=this.$refs.pullRefresh.scrollTop
      this.scrollBottom=this.scrollHeight-this.scrollTop-this.$refs.pullRefresh.clientHeight
      
     	if(this.scrollBottom<=0){//解决页面滑到底部后的上滑scrollTop不变的问题
     		this.$refs.pullRefresh.scrollTop=this.$refs.pullRefresh.scrollTop-dist//关键
     		this.scrollBottom=this.scrollHeight-this.scrollTop-this.$refs.pullRefresh.clientHeight
     	}
     
     	//console.log("top",this.scrollTop);
     	//console.log("scrollBottom",this.scrollBottom)
     if(this.scrollTop<=0&&dist>0){
      	/*下拉*/
	      	if(dist<80){
						this.refreshEl.style.height=dist+'px'
						this.state='downTip1'
						
					}else if(dist<130){
						this.refreshEl.style.height=dist+'px'
						this.state='downTip2'
					}
      	
      }else if(this.scrollBottom<=0&&dist<0){
      	/*上拉*/
      		if(this.$refs.pullRefresh.clientHeight>=this.$refs.pullRefresh.scrollHeight){
		      	return false
		      }
	      	if(dist>-80){
						this.loadMoreEl.style.height=-dist+'px'
						this.state='upTip1'
					}else if(dist>-130){ 
						this.loadMoreEl.style.height=-dist+'px'
						this.state='upTip2'
					}
						
      }
      
    },
    touchEnd(ev) {
      let touchEndY=ev.changedTouches[0].pageY
			let dist=(touchEndY-this.touchStaY)*0.35
			
      this.scrollTop=this.$refs.pullRefresh.scrollTop
      this.scrollBottom=this.scrollHeight-this.scrollTop-this.$refs.pullRefresh.clientHeight
			if(this.scrollTop<=0&&dist>0){
				//console.log("正在刷新")
				if(dist>80){
					this.state='downTip3'
					this.refreshEl.classList.remove('noTrans')
					this.refreshEl.style.height='40px'
					this.loadMoreEl.style.height='0px'
					this.onRefresh(this.refreshDone)
				}else{
					this.refreshEl.classList.remove('noTrans')
					this.refreshEl.style.height='0px'
					this.loadMoreEl.style.height='0px'
				}
					
					
					
			}else if(this.scrollBottom<=0&&dist<0){
					//console.log("正在加载更多")
					if(this.$refs.pullRefresh.clientHeight>=this.scrollHeight){
			      	return false
		      }
					if(dist<-80){
						this.state='upTip3'
						this.loadMoreEl.classList.remove('noTrans')
						this.loadMoreEl.style.height='40px'
						this.refreshEl.style.height='0px'
						this.onLoadmore(this.loadMoreDone)
					}else{
						this.loadMoreEl.classList.remove('noTrans')
						this.loadMoreEl.style.height='0px'
						this.refreshEl.style.height='0px'
					}
					
					
			}
    },
    
     /*首次加载完成回调*/
    firstLoadDone(listData,timestart) {
    	let the=this
    	let timeend=Date.now()/1000
    	let timeInterval=timeend-timestart
    	
    	if(timeInterval>0&&timeInterval<2000){
    		//the.$vux.loading.show({ text: 'loading'})
      	setTimeout(function(){
      		(!listData||listData.length===0) ? the.state='downTip5' : '';
      		//the.$vux.loading.hide()
      	},2000-timeInterval)
      	 
      }else{
      	(!listData||listData.length===0) ? the.state='downTip5' : '';
      }
    }, 
    
     /*刷新完成回调*/
    refreshDone(listData) {
      this.state ='downTip4'
      let the=this
      setTimeout(function(){
      	if(listData&&listData.length==0){
      		the.state ='downTip5'
      		
      	}else{
      		the.refreshEl.style.height='0px'
      	}
      },1000)
    }, 
    
		/*加载更多完成回调*/
    loadMoreDone(listData) {
      this.state ='upTip4'
      let the=this
      setTimeout(function(){
      	if(listData&&listData.length==0){
      		the.state ='upTip5'
      	}else{
      		the.loadMoreEl.style.height='0px'
      	}
      },1000)
    },

    onScroll(e) {
      
    },
    
    setListStyle(){
    	this.refreshEl=this.$refs.pullDown
	    this.loadMoreEl=this.$refs.loadMore
    	let header=document.querySelector(".vux-header")
    	let headerH=header.offsetHeight
	  	let winH=window.innerHeight
	  	this.$refs.pullRefresh.style.height=(winH-headerH)+'px'
	  	
    }
  },
  created:function(){
  	this.onFirstLoad(this.firstLoadDone)
  },
  activated:function(){
  	//this.onFirstLoad(this.firstLoadDone)
  },
  mounted:function(){
  	this.setListStyle()
  	
  },
  
  
}
</script>
<style scoped="scoped">
#pullRefresh {
	
	/* height:默认高度js设为屏幕高度;*/
  /*-webkit-overflow-scrolling: touch;*/
 	background-color: #f1f1f1;
  overflow: auto;
  border-top: 1px solid transparent;
}

#pullRefresh  .pull-down,
#pullRefresh  .load-more{
    display:flex;
    align-items: center;
    justify-content: center;
    transition: all 0.5s;
    overflow: hidden;
   
}


#pullRefresh .noTrans{
	transition: all 0s;
}

#pullRefresh .load-tip{
	line-height: 1.6em;
  font-size: 14px;
	color: #555;
}



</style>
