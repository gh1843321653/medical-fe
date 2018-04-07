<template>
	<div ref="btn">
		<button type="button" >button</button>
	   <input type="checkbox"  readonly/>
	</div>
	
	
</template>
<script>
import { Swiper, SwiperItem,  PopupPicker, Group, Cell, Picker, XButton,XSwitch ,Popup,DatetimeView, Tab, TabItem,Checker, CheckerItem,Blur} from 'vux'
export default{
	components:{Swiper,SwiperItem,PopupPicker, Group, Cell, Picker, XButton,XSwitch ,Popup,DatetimeView, Tab, TabItem,Checker, CheckerItem,Blur},
	data:function(){
		return{
			start:'',
			end:'',
			checker:'',
			arr:[1,2,5,4,6,2,5,8],
		}
	},
	
	
	methods:{
		setArr:function(){
			
		},
		getRef:function(){
			var x=document.querySelector("div")
			console.log(x)	

		}

		
	},
	
	created:function(){
		

	},
	mounted:function(){
		this.getRef()
			
	}
	
	
	
}
	
</script>
<style scoped="scoped">
	
	

	
	
</style>
























