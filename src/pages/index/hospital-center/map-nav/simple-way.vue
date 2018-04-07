<template>
	<div id="simple-way">
		<div class="hospital">
			<h1 class="name">东院乘车路线</h1>
			<ul class="ways">
				<li>68到辟才胡同东口</li>              
				<li>22，46，102，105，109，603，604，626，690，808，826，到西单商场</li>
				<li>1，10，37，52，70，728，802，到西单路口东    </li>
				<li>地铁1号线或4号线到西单站，F1或G出口向北 </li>
				<li>总机电话：69156114  </li>
   
			</ul>
		</div>
		<div class="hospital">
			<h1 class="name">西院乘车路线</h1>
			<ul class="ways">
				<li>68到辟才胡同东口</li>              
				<li>22，46，102，105，109，603，604，626，690，808，826，到西单商场</li>
				<li>1，10，37，52，70，728，802，到西单路口东    </li>
				<li>地铁1号线或4号线到西单站，F1或G出口向北 </li>
				<li>总机电话：69156114  </li>
   
			</ul>
		</div>
		
	</div>
	
</template>

<script>
export default{
	data:function(){
		return{
			
		}
	}
}
	
</script>
<style scoped="scoped" lang="scss">
	#simple-way{
		padding: 10px 15px;
		margin-left: 15px;
		font-size: 16px;
		line-height: 2em;
		color: #555;
		font-weight: normal;
	
		.name{
			font-size: 16px;
		}
		.ways{
			list-style-type: decimal;
		}
		li{
			padding-left: 7px;
		}
	}
	
	
</style>