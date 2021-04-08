<template>
	<div class="head-tab-gj clearfix">
		<span :class="tabIndex == 1 ? 'selected': '' " @click="selectChange(1)">搜企业</span><span :class="tabIndex == 2 ? 'selected': '' " @click="selectChange(2)">搜商标</span>
	</div>
</template>
<script>
	import Vue from 'vue'
	export default {
		props: ['tabIndex'],
		data(){
			return{
			}
		},
		methods:{
			//返回上一页
			selectChange (index) {
				this.$emit('tabChange', index);
			},
		},
		mounted(){
			this.centerType = this.$route.params.type;
		}

	}
</script>

<style lang="scss">
	.head-tab-gj {
		text-align: center;width: 100%;padding-bottom: 20px;
		span{
			display: inline-block;width: 140px;height: 30px;line-height: 28px;text-align: center;border-radius:3px 0 0 3px;background-color: #fff;border:1px solid #DDDDDD;z-index: 1;position: relative;cursor: pointer;
		}
		span:last-child{border-radius:0 3px 3px 0;margin-left: -1px;z-index: 0;}
		span.selected{border: 1px solid #3DB1FA;color: #fff;background-color: #3DB1FA;}
	}
</style>
