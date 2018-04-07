<template>
  <div>
       <v-scroll :on-refresh="onRefresh" :on-loadmore="onLoadmore" :onFirstLoad='firstLoad' >
	       <ul class="list">
	         <li v-for="(item,index) in listData" class="list-item">
	         	<p class="ctime">{{item.createTime}}</p>
	         	<p class="msg">{{item.msg}}</p>
	         </li>
	       </ul>
    	</v-scroll>
  </div>
</template>
<script>
import pullRefresh from '../../components/pullRefresh.vue';
import ajax from '../../server/api.js'
import mymessage from '../../static/json/myMessage-list.json'
export default{
	components : {'v-scroll': pullRefresh},
 data () {
    return {
      listData: mymessage, // 列表数据存放数组
      pageIndex : 1, //默认已经显示出15条数据 count等于1是让从16条开始加载
      pageListNum : 15,  // 一次显示多少条
      
      
    }
  },
  
  methods: {
  	
  	
    getList(pageIndex,callback){
        let vm = this
        let timestart=Date.now()/1000
        this.pageIndex=pageIndex
        let submiteData={
        	pageIndex:pageIndex,
        	pageListNum:this.pageListNum,
        	typeFdId:this.$router.currentRoute.query.fdId
        }
        ajax.myMessageList(submiteData)
        .then(function(res){
        	console.log("消息列表",res.data)
        	var listData=res.data.messageMainList?res.data.messageMainList :[]
        	if(vm.pageIndex===1){//刷新
        		vm.listData = listData

        	}else if(vm.pageIndex>1){//加载更多
        		vm.listData = vm.listData.concat(listData)
        	}
        	callback(listData,timestart)
        }).catch(function(err){
        	callback(vm.listData,timestart)
        	console.log("列表加载出错:",err)
        })
                
    },
    //首次加载
    firstLoad(done){
    	this.getList(1,done)
    },
    
    //下拉刷新
    onRefresh(done) {
      this.getList(1,done);
    },
    //上滑加载更多
    onLoadmore(done) {
      this.getList(++this.pageIndex,done);
    },
    
    
    setHeader:function(){
			let header={
				  title:'消息中心',
				  left:{showBack:true,backText:''},
				  right:{rightHtml:'首页'}
				 }
				 this.$store.commit('setHeader',header)
		},
		
		//隐藏底部tabbar
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

<style scoped="scoped" lang="scss">
.list{
	padding-bottom: 50px;
	min-height: 100vh;
}
	.ctime{
		text-align:center;
		line-height: 2em;
		font-size: 14px;
		color: #555555;
		margin-top: 20px;
	}
	.msg{
		margin: 0px 15px;
		padding: 10px 20px;
		background-color: #fff;
		font-size: 16rem;
		line-height: 1.7em;
		border-radius: 10px;
	}
</style>

