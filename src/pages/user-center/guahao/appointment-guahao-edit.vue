<template>
	<div id="guahao-view" >
		<group>
			<popup-radio title="就诊人"   :options="patientNameList"   v-model="patientName" placeholder='请选择就诊人' ></popup-radio>
			<cell title="手机号" :value="patientPhone.phone"  ></cell>
	    	<cell title="就诊科室" :value="guahaoData.keshiName"></cell>
	        <cell title="就诊医生" :value="guahaoData.doctorName"></cell>
	        <cell title="就诊时间" :value="guahaoData.date+'  '+ guahaoData.time"></cell> 
	    </group>
	    <box gap="40px 10px">
	     	<x-button action-type="button" @click.native="submit">确定</x-button>
	    </box>
	</div>
</template>

<script>
import { Group,Datetime,Cell,Toast,Box,XButton,PopupRadio } from 'vux'
import ajax from '../../../server/api.js'
export default{
	components: {Group,Datetime,Cell,Toast,Box,XButton,PopupRadio},
	data(){
		return{
			patientName:'',//就诊人
			patientId:'',//就诊人id
			patientPhone:'',//就诊人电话
			guahaoData:{
				keshiId:'',
				keshiName:'',
				doctorId:'',
				doctorName:'',
				date:'',
				time:''
			},
			patientList:[],
			patientNameList:[''],//就诊人列表
			showContent:'',
			userRole:'',
			
		}
	},
	
	watch:{
		patientName:function(name){
			let _this=this
			_this.patientList.forEach(function(item,index){
				if(item.name===name){
					_this.patientPhone=item.phone
				}
				
			})
		}
	},
	methods:{
		getPatientId:function(){
			let the=this  
			this.patientList.forEach(function(item,index){
				if(item.name===the.patientName){
					the.patientId=item.fdId
				}
				
			})
			
		},
		
	
		getGuahaoData:function(){
			//var guahaoData=this.$store.getters.guahaoData;
			this.guahaoData=this.$store.state.guahaoData;
			console.log("挂号data",this.guahaoData)
		},
		
		//获取就诊人列表
		getPatientList:function(){
			var the=this;
			ajax.patientList()
    		.then(function(res){
    			the.patientList=res.data.patientList
    			console.log(the.patientList)
    			the.patientList.forEach(function(item,index){
    				the.$set(the.patientNameList,index,item.name)
    			})
    		})
			
		},
		
		submit:function(){
			var the=this
			this.validator();
			this.getPatientId();
			var submitData={
					keshiId:this.guahaoData.keshiId,
					doctorId:this.guahaoData.doctorId,
					patientId:this.patientId,
					date:this.guahaoData.date,
					time:this.guahaoData.time,
					
			};
    		ajax.appointmentGuahaoAdd(submitData)
    		.then(function(res){
    			let time=2000
				the.$vux.toast.show({type:'text',text:'挂号成功',time:time})
				the.$store.commit('setGuahao','')//提交完成清空挂号信息
				setTimeout(function(){
    				the.$router.push('/guahao-list')
					
				},time)
    			
    		})
    		.catch(function(err){
    			console.log('挂号失败')
    			the.$router.push('/guahao-list')
    		})
			
			
		},
		
		
		validator:function(){
			//验证是否选择了就诊人
		},
		
		setHeader:function(){
			let header={
				  title:'挂号信息',
				  left:{showBack:true,backText:''},
				  right:{rightHtml:'首页'}
				 }
				 this.$store.commit('setHeader',header)
		},
		
		//隐藏底部tabbar
		setTabbar:function(){
	    	this.$store.commit('setTabbar',false)
	    },
	    
	    getUserRole:function(){
			let userType=this.$store.state.common.user.userType
			this.userRole=userType
		}
		
		
	},
	
	
	activated:function(){
		this.getGuahaoData();
		this.getPatientList();
		this.setHeader();
		this.setTabbar()
		this.getUserRole()
	}
	
}
</script>

<style lang='scss' scoped>

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
	color: #999;
}
#guahao-view{
	font-size: 16px;
	
}
</style>
<style lang='scss'>
#guahao-view{
	.weui-cells,.vux-no-group-title{
		.weui-cell,.apGroup,.vux-tap-active,.weui-cell_access{
			display: flex;
			.vux-cell-bd,.vux-cell-primary{
				padding: 0!important;
				height: 44px!important;
				line-height: 44px!important;
				width: 0;
				flex: 3;
				
				p{
					margin: 0!important;
				}
			}
			.weui-cell__ft{
				width: 0;
				flex: 2;
				color: #000;
				
				.cell-right{
					margin-top: 8px;
					margin-bottom: 8px;
					
					.cell-input{
						width: 100%;
					}
				}
			}
		}
		.vux-cell-disabled{
			.vux-cell-bd,.vux-cell-primary{
				color:#000!important;
				
				p{
					color:#000!important;
					.vux-label{
						color:#000!important;
					}
				}
			}
		}
		.vux-datetime{
			.weui-cell__ft,.vux-cell-primary,.vux-datetime-value{
				.vux-cell-value,.vux-cell-placeholder{
					position: relative;
					right: 10px;
				}
			}
		}
	}
}
</style>