<template>
	<div id="office-list">
		<group class='group'>
			<cell title='预约挂号' value='预约规则' is-link link='/rule-guahao'  class='rule' v-if="action!=='intro'"></cell>
		</group>
		<div class="office-list">
			<ul  class="level1">
				<li v-for='(list,index) in keshiList' :key='list.level1.id' class="left"  :class='{curActive:index===curIndex}' @click='getL2(list,index)'>{{list.level1.name}}</li>
			</ul>
			<ul  class="level2">
				<li  v-for='item in level2' key='item.id'>
					<router-link  :to="{path:path,query:{keshiId:item.id,keshiName:item.name}}">{{item.name}}</router-link>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
/*点击科室根据direction决定是进入科室详情还是进入医生列表进行挂号*/
import list from '../../../../static/json/office-list.json'
import ajax from '../../../../server/api.js'
import { Cell,CellBox, Group} from 'vux'
	export default{
		components:{Cell,Group,CellBox},
		data:function(){
			return{
				keshiList:[],
				curIndex:0,
				level2:'',
				path:"",//请求目标路径
				action:"",//请求目的
			}
			
		},
		
		
		methods:{  
			//请求列表数据
			getKeshiList:function(){
				let the=this
				ajax.keshiList()
				.then(function(res){
					the.keshiList=res.data.keshiList
					the.level2=the.keshiList[0].level2
					
				})
				.catch(function(err){
					throw('请求科室list失败')
				})
				
			},
			getL2:function(list,index){
				this.level2=list.level2
				this.curIndex=index
				
			},
			setHeader:function(){
				  let header={
				  title:'科室查询',
				  left:{showBack:true,backText:''},
				  right:{rightHtml:'首页'}
				 }
				 this.$store.commit('setHeader',header)
			},
			
			//隐藏底部tabbar
			setTabbar:function(){
		    	this.$store.commit('setTabbar',false)
		   },
		   
		   
			getPath:function(){
				let action=this.$router.currentRoute.query.action
				this.action=action
				switch(action){
					case "intro":this.path="/office-view";break;//
					default:this.path="/doctor-list";break;//基于挂号情况
				}
				
			}
			
			
		},
		created:function(){
			this.getKeshiList()
		},
		
		activated:function(){
			this.setHeader()
			this.setTabbar()
			this.getPath()
		},
		
		
	}
	
</script>
<style  lang='scss' scoped="scoped">
	
	 .rule:before{
		content: '' ;
		display: inline-block ;
		width: 5px;
		height: 100%;
		background-color: #00ACEE;
		margin-top: 9px;
    	margin-left: -10px;
	}
	
	.office-list{
		display: flex;
		.level1{
			flex-basis: 40%;
			background-color: #eee;
			border-right: 1px solid #eee;
			li{
				font-size: 16px;
				line-height: 3em;
				padding: 0px 15px;
			}
		}
		.curActive{
			background-color: #fff;
		}
		.level2{
			flex-basis: 60%;
			li{
				font-size: 16px;
				line-height: 3em;
				padding: 0px 15px;
				border-bottom: 1px solid #eee;
			}
			
			li:last-of-type{
				border-bottom: none;
			}
			a{
				display: block;
			}
		}
	}
</style>
<style>

	
</style>