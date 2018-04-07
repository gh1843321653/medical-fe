<template>
  <div>
       <v-scroll :on-refresh="onRefresh" :on-loadmore="onLoadmore" :onFirstLoad='firstLoad' >
	       <ul>
	         <li class='item' v-for="(item,index) in listData" >
	         	<div class='create-time'>{{item.docCreateTime}}</div>
	         	<router-link class='anchor'  :to="{path:'/message-view',query:{messageId:item.fdId,msgTitle:item.title}}">
	         		<p class='title'>{{item.title}}</p>
	         		<p class='desc'>{{item.fdDescription}}</p>
	         		<p class='title-img'><img :src="item.image" alt="" /></p>
	         	</router-link>
	         </li>
	       </ul>
    	</v-scroll>
  </div>
</template>
<script>
import pullRefresh from '../../components/pullRefresh.vue';
import ajax from '../../server/api.js'
export default{
	components : {'v-scroll': pullRefresh},
 data () {
    return {
      listData: [], // 列表数据存放数组
      pageIndex : 1, //默认已经显示出15条数据 count等于1是让从16条开始加载
      pageListNum : 5,  // 一次显示多少条
      firstLoadState:''
      
    }
  },
  
  methods: {
    getList(pageIndex,callback){
        let vm = this
        let timestart=Date.now()/1000
        this.pageIndex=pageIndex
        let submiteData={
        	pageNo:pageIndex,
        	pageSize:this.pageListNum,
        	templateId:this.$router.currentRoute.query.fdId,//消息类别id
        }
        ajax.messageList(submiteData)
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
        	//callback(vm.listData,timestart)
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
				  title:this.$router.currentRoute.query.msgType,
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

<style lang="scss">
	
	#pullRefresh ul{
		padding: 10px;
	}
	
	#pullRefresh ul .item{
		line-height: 1.5em;
		padding: 0px 10px;
		color: #454444;
		margin-bottom: 30px;
		.create-time{
			text-align: center;
	    background-color: #cbcbcb;
	    border-radius: 10px;
	    margin: 10px auto;
	    font-size: 14px;
	    color: #fff;
	    width: 60%;
			
		}
	}
	#pullRefresh ul .anchor{
		background-color: #fff;
    border: 1px solid #E1E4E6;
    display: block;
    overflow: hidden;
    padding: 10px 10px;
    border-radius: 10px;
    box-shadow: 1px 1px 5px 0px #cbcbcb;
    .desc{
    	text-overflow: ellipsis;
    	white-space: nowrap;
    	overflow: hidden;
    	padding-bottom: 10px;
    	font-size: 14px;
    	color: #555;
    }
		.title-img{
			overflow: hidden;
			line-height: 0px;
			font-size: 0px;
			img{
				width: 100%;
			}
		}
	}
</style>

