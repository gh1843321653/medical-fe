<!--这是心电类型选项组件，比如动态心电，静态心电等-->
<template>
	<div id='ecgChecker'>
		<group>
			<div v-for='(type,index) in ecgTypeList' :id='type.fdid' :key='type.fdid' @click='checkers($event)'>
				<cell :title='type.ecgTitle' value=''  is-link :arrow-direction="expand[index] ? 'down' : ''"  @click.native="expandTo(index)" >
					<span v-if='type.radio==0'>不能与动态同选</span>
					<badge :text="type.checkedNum" v-if='type.checkedNum&&type.checkedNum!==0'></badge>
				</cell>
				<checklist  :options='type.options'  v-show='expand[index]'   @on-change='checker' ></checklist> 
			</div>
		</group>
	</div>
</template>
<script>
import {  Group,, Cell,Checklist ,Badge } from 'vux'	
import ajax from '../server/api.js'
export default{
	components:{Group,Cell ,Checklist,Badge	},
	data:function(){
		return {
			ecgTypeList:[
				/*{fdid:'1', ecgTitle:'静态心电检查',radio:'0',options:[{key:'1',value:'检查项目1',inlineDesc:'￥25.5'}]},
				{fdid:'2', ecgTitle:'动态心电检查',radio:'1',options:[{key:'2',value:'检查项目2',inlineDesc:'￥25.5'}]},
				{fdid:'3', ecgTitle:'动态血压检查',radio:'1',options:[{key:'3',value:'检查项目3',inlineDesc:'￥25.5'}]}*/
			],
			expand:[],//选项展开状态状态集合
			selectedType:[],//已选择的项目
			checkedNum:0
		}
	},
	
	props: {
	  	optType:String,//组件操作类型add||edit||view(未实现)
	    appointmentEcgId:{
	      type: String,
	      default: undefined,
	      required: false
	    },
	    checkedData:{
	    	type :Function,
	    	default:undefined,
	    	required:true
	    },
	    touchSubmit:{
	    	type:Boolean,
	    	default:false,
	    	required:true
	    },
	    
	   appointmentEcgId:String,//心电预约id
	    	
	    
	   
    },
	
	watch:{
		ecgTypeList:function(cc){
			//console.log('watch-ecgTypeList' ,this.ecgTypeList)
		},
		expand:function(){
			//console.log("watch:expand")
		},
		selectedType:function(){
			//console.log('selectedType',this.selectedType)
		},
		//监听是否触发父组件的提交按钮
		touchSubmit:function(){
			let selectedType=this.formatData_submit(this.selectedType)
			let validater=this.validater()
			if(!validater){
				this.checkedData([])
			}else{
				this.checkedData(selectedType)//向父组件传递已选数据
			}
			
		}
		
	},
	methods:{
		
		expandTo:function(index){ 
			this.$set(this.expand,index,!this.expand[index])
		},
		
		
		//选择心电项目
		checker:function(value,label){
			this.checkedNum=value.length//已选数目
			let the=this
			this.ecgTypeList.forEach(function(item,index){
				the.$set(item,'checked',value)
				item.options.forEach(function(item1,index1){
					let match_val=value.some(function(item){return item===item1.key})
					if(match_val){
						the.$set(item,'checkedNum',the.checkedNum)
						the.$set(the.selectedType,index,{projectId:item.fdid,checkedOptionsIds:value,projectType:item.radio}) 
						//projectType为静态||动态
					}
				})
			})
		},
		
		checkers:function(ev){
			ev.stopPropagation()
			let the=this
			let ctarget=ev.currentTarget
			let ctargetId=ctarget.id
			setTimeout(function(){
				if(the.checkedNum==0){
					the.ecgTypeList.forEach(function(item,index){
						if(item.fdid==ctargetId){
							the.$set(item,'checkedNum',the.checkedNum) 
							the.$set(the.selectedType,index,{projectId:item.fdid,checkedOptionsIds:[],projectType:null}) 
						}
					})
				}
				//console.log("selectedType",the.selectedType)
			},300)
		},
		
		
		//请求心电类型数据
		getEcgTypeList:function(){
			let the=this
			if(this.optType=='add'){
				ajax.appointmentEcgType()
				.then(function(res){
					the.ecgTypeList=the.formatData_add(res.data.checkTypeList)
				})
				.catch(function(err){
					console.log("请求ecg项目数据错误：",err)
				})
			}else if(this.optType=='edit'){
				ajax.appointmentEcgType()
				.then(function(res){
					the.ecgTypeList=the.formatData_add(res.data.checkTypeList)
					the.getAppointmentEcgData()
				})
				.catch(function(err){
					console.log("请求ecg项目数据错误：",err)
				})
				
			}else if(this.optType=='view'){
				
			}else{
				throw('给ecgType-checker组件传的optType值必须为add||edit||view之一')
			}
			
		},
		
		//获取预约心电数据
		getAppointmentEcgData:function(){
			if(!this.appointmentEcgId){return false	}
			let submitData={appointmentEcgId:this.appointmentEcgId}
			ajax.appointmentEcgView(submitData)
			.then(function(res){
				console.log('预约心电数据',res.data)
			})
			.catch(function(err){
				
				
			})
			
		},
		
		
		//组件内部验证规则，父组件可以对其再次验证
		validater:function(){
	    	if(this.selectedType.length==0){
	    		this.$vux.toast.show({type:'text',text:"请选择要检查的项目",position:''})
	    		return false
	    	}else if(this.selectedType.length!=0){
	    		let the=this
	    		//判断静态动态选其一
	    		let xx=this.selectedType.every(function(item,index){
	    			if(item.projectType===null){return true}
	    			let isSame=the.selectedType.every(function(item1,index1){
	    				if(item1.projectType===null){
	    					return true
	    				}else if(item1.projectType!==null&&item.projectType===item1.projectType){
	    					return true
	    				}else{
	    					return false
	    				}
	    			})
	    			
	    			return isSame
	    		})
	    		if(!xx){
	    			this.$vux.alert.show({title:'提交失败',content:"静态检查和动态检查只能选其一"})
	    			return false
	    		}
	    		return true
	    	}else{
	    		return true
	    	}
		},
		
		
		//格式化请求的add数据
		formatData_add:function(initData){
			
			let newEcgTypes=[]
			for(let key in initData){
				let ecgOptions=initData[key]
				let ecgType={}
				let options=[]
				ecgOptions.forEach(function(item,index){
					let option={}
					ecgType.fdid=item.projectId
					ecgType.ecgTitle=item.typeName
					ecgType.radio=item.projectType
					option.key=item.fdId
					option.value=item.content
					option.inlineDesc=item.price
					options.push(option)
					
				})
				ecgType.options=options
				newEcgTypes.push(ecgType)
			}
			
			return newEcgTypes
		},
		
		
		//格式化请求的edit数据
		formatData_edit:function(initData){
			let newEcgTypes=[]
			for(let key in initData){
				let ecgOptions=initData[key]
				let ecgType={}
				let options=[]
				ecgOptions.forEach(function(item,index){
					let option={}
					ecgType.fdid=item.projectId
					ecgType.ecgTitle=item.typeName
					ecgType.radio=item.projectType
					option.key=item.fdId
					option.value=item.content
					option.inlineDesc=item.price
					options.push(option)
					
				})
				ecgType.options=options
				newEcgTypes.push(ecgType)
			}
			return newEcgTypes
		},
		
		
		//格式化返回的view数据
		formatData_view:function(initData){
			let newEcgTypes=[]
			initData.forEach(function(item,index){
				let option={key:item.fdId,value:item.content,inlineDesc:item.price}
				let has=newEcgTypes.some(function(item1,index1){
						return item.typeName==item1.ecgTitle
					})
				
				if(!has){
					let newEcgType={
						fdid:item.projectId,
						ecgTitle:item.typeName,
						options:[option]
					}
					newEcgTypes.push(newEcgType)
				}else{
					newEcgTypes.forEach(function(item1,index1){
						if(item1.fdid===item.projectId){
							item1.options.push(option)
						}
					})
				}
				
			})
			return newEcgTypes
		},
		
		//格式化要提交的数据
		formatData_submit:function(initData){
			//过滤掉空的值
			let newSelectedType= initData.filter(function(item,index){
				if(item.projectType!==null){
					return true
				}
			})
			return newSelectedType
		},
		
		
		
		foldOption:function(){
			
			
		}
		
		
	},
	
	
	
	created:function(){ 
		let len=this.ecgTypeList.length
		let arr=[]
		for(var i=0;i<len;i++){
			arr[i]=false
		}
		this.expand=Object.assign({},arr)
		this.getEcgTypeList()
		
	},
	
	activated:function(){
		this.getEcgTypeList()
		
	}
	
	
	
	
}
	
	
	
</script>
<style>
	
	
</style>