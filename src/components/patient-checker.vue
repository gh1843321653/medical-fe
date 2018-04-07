<template>
	<div id='patientChecker'>
		<group>
			<popup-radio title="就诊人"   :options="patientNameList"   v-model="checkedPatientName" placeholder='请选择就诊人'></popup-radio>
			
	    </group>
	</div>
</template>

<script>
import { Group,PopupRadio } from 'vux'
import ajax from '../server/api.js'
export default{
	components: {Group,PopupRadio},
	data(){
		return{
			patientNameList:[''],//就诊人姓名列表
			patientList:[],//就诊人列表
			checkedPatientName:'',//已选就诊人姓名
		}
	},
	
	props: {
		//将已选就诊人发送到父组件
	    checkedData:{
	    	type :Function,
	    	default:undefined,
	    	required:true
	    },
	    //父组件按钮触发时响应
	    touchSubmit:{
	    	type:Boolean,
	    	default:false,
	    	required:true
	    },
	    
	    //编辑页面的默认就诊人
	    initPatientName:{
	    	type:String,
	    	default:'',
	    	required:false
	    	
	    }
	   
    },
	
	
	watch:{
		//监听是否触发父组件的提交按钮
		touchSubmit:function(){
			let checkedPatient=this.formatData_submit(this.checkedPatientName)//已选就诊人信息name|id
			let validater=this.validater()
			if(!validater){
				this.checkedData({})
			}else{
				this.checkedData(checkedPatient)//向父组件传递已选数据
			}
			
		},
		
		
	},
	methods:{
		//请求就诊人列表
		getPatientList:function(){
			var the=this;
			ajax.patientList()
    		.then(function(res){
    			the.patientList=res.data.patientList;
    			the.patientList.forEach(function(item,index){
    				the.$set(the.patientNameList,index,item.name)
    			})
    		})
			
		},
		
		validater:function(){
			//验证是否选择了就诊人
			if(!this.checkedPatientName){
				this.$vux.toast.show({type:'text',text:"请选择就诊人",position:''})
				return false
			}else{
				return true
			}
			
		},
		
		formatData_submit:function(initData){
			let checkedData=this.patientList.filter(function(item,index){
				if(item.name==initData){
					return true
				}
			})
			
			return checkedData[0]
			
		}
		
		
	},
	
	
	activated:function(){
		this.getPatientList();
		
		
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