<template>
	<div id='index' @touchmove.prevent='touch'>
		<div class="main">
			<swiper  loop auto  :interval=2000 :duration=500  :list="bannerList" v-model="listIndex"   @on-index-change="indexChange" 
				  :aspect-ratio="5/9" :show-dots=true dots-position="center"  dots-class="custom-bottom" :show-desc-mask=false></swiper>
			<div class="menusBox" v-if="userType==='0'">
				<div class='menuItem'>
					<router-link  :to="{path:'/office-list',query:{action:'appointmentGuahao'}}">
						<div class="icon">
							<img src='../../static/imgs/index-guahao.png'>
						</div>
						<p class="text">预约挂号</p>
						<!--选择科室》选择医生》选择排班》进入预约挂号详情单(选择就诊人)》点击立即预约
						预约详情（同时发短信提示和消息中心提示），点击返回直接进入预约列表》预约可以编辑（改变就诊人，提前一天）可以取消-->
					</router-link>
				</div>
				<div class='menuItem'>
					<router-link :to="{path:'/appointment-ecg-edit',query:{action:'appointmentEcg'}}">
						<div class="icon">
							<img src="../../static/imgs/index-appointmentEcg.png" />
						</div>
						<p class="text">预约心电</p>
						<!--预约心电新建(选择就诊人)-->
					</router-link> 
				</div>
				<div class='menuItem'>
					<router-link :to="{path:'/guahao-list',query:{action:'ecgAppl'}}"> 
						<div class="icon">
							<img src="../../static/imgs/index-ecgAppl.png" />
						</div>
						<p class="text">心电申请</p>
						<!--申请心电必须提前门诊挂号，然后进入挂号列表，挂号状态(已就诊)+是否有心电预约》决定申请默认字段-->
					</router-link>
				</div>
				<div class='menuItem'>
					<router-link to='/report-list'>
						<div class="icon">
							<img src="../../static/imgs/index-report.png" />
						</div>
						<p class="text">查看报告</p>
						<!--查看报告进入就诊人列表》查看该就诊人报告列表（时间排序）》报告详情-->
					</router-link>
				</div>
				<div class='menuItem'>
					<router-link :to="{path:'/hospital-list',query:{action:'hospitalView'}}">
						<div class="icon">
							<img src="../../static/imgs/index-hospital.png" />
						</div>
						<p class="text">医院介绍</p>
					</router-link>
				</div>
			</div>
			<div class="menusBox" v-else>
				<div class='menuItem'>
					<router-link to='/guahao-list-doctor'>
						<div class="icon">
							<img src='../../static/imgs/index-guahao.png'>
						</div>
						<p class="text">我的挂号</p>
						<!--进入挂号列表,tab切换全部挂号|预约挂号|门诊挂号-->
					</router-link>
				</div>
				<div class='menuItem'>
					<router-link to='/patient-list-doctor'>
						<div class="icon">
							<img src='../../static/imgs/index-patient.png'>
						</div>
						<p class="text">我的病人</p>
						<!--所有门诊挂号的病人（基本信息|检查报告）-->
					</router-link>
				</div>
				
				<div class='menuItem'>
					<router-link :to="{path:'/hospital-list',query:{action:'hospitalView'}}">
						<div class="icon">
							<img src="../../static/imgs/index-hospital.png" />
						</div>
						<p class="text">医院介绍</p>
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { Swiper, SwiperItem,  } from 'vux'
const bannerList = [{
	  url: 'javascript:',
	  img: require('../../static/imgs/index-banner1.png'),
	  title: '送你一朵fua',
	  fallbackImg: require('../../static/imgs/index-banner0.png')
	}, {
	  url: 'javascript:',
	  img: require('../../static/imgs/index-banner2.jpg'),
	  title: '送你一辆车',
	  fallbackImg: require('../../static/imgs/index-banner0.png')
	}, {
	  url: 'javascript:',
	  img: require('../../static/imgs/index-banner3.jpg'),
	  title: '送你一次旅行',
	  fallbackImg: require('../../static/imgs/index-banner0.png')
}]
export default{
	components: {  Swiper,  SwiperItem  },
	data:function(){
		return {
			bannerList:bannerList,
			listIndex:0,
			userType:0
			
		} 
	},
	
	methods:{
		indexChange:function(){},
		//修改header
		setHeader:function(){
			let header={
				title:'四川华西医院',
				left:{showBack:false},
				right:{rightHtml:''}
			}
			this.$store.commit("setHeader",header)
		},
		
		setTabbar:function(){
	    	this.$store.commit('setTabbar',true)
	    },
	    touch:function(){},
	    
	    getUserRole:function(){
			this.userType=this.$store.state.common.user.userType
			console.log("userType",this.userType)
		}
	},
	
	activated :function(){
		this.setHeader()
		this.setTabbar()
		this.getUserRole()
		
	},
	beforeRouteEnter:function(to,from,next){
		next()
	},
	
	
}

</script>
<style scoped="scoped" lang='scss'>
	#index{
		background: #fff;
	}
	.main{
		position: relative;
		padding-bottom: 50px;
	}
	
	.menusBox{
		display: flex;
		justify-content:flex-start;
		flex-wrap:wrap;
		align-content:flex-start;
		padding: 10px 0px;
		min-height:300px;
		
	}
	
	.menuItem{
		flex: 30%;
		max-width: 33%;
		text-align: center;
		margin-bottom: 20px;
		.icon{
			background-color: rgba(255,255,255,0.5);
			border-radius: 50%;
			width: 50px;
			height: 50px;
			display: inline-block;
			img{
				width: 100%;
				height: 100%;
			}
		}
		.text{
			font-size: 14rem;
			line-height: 2em;
		}
		
	}
	
</style>