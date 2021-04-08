<template>
	<div class="operation_search_box clearfix">
		<el-input class="fl c_type_2" placeholder="搜索该企业旗下的商标" v-model="centerTrademark" @keyup.enter.native="searchTrademark">
	    <el-button slot="prepend" icon="el-icon-search"></el-button>
	  </el-input>
	  <el-button size="small" type="primary" class="btn_search fl ml10" @click="searchTrademark">搜索</el-button><el-button size="small" @click="reset">重置</el-button>
	</div>
</template>
<script>
	import Vue from 'vue'
	import Util from 'src/common/js/util.js'
	import qs from 'qs'

	export default {
		props: ['keyword'],
		data(){
			return{
        centerTrademark:'',
			}
		},
		methods:{
			reset(){
				this.$emit('reset')
			},
			searchTrademark(){
				/*if(!this.centerTrademark){
      		this.$message({
	          message: '请输入您需要搜索的商标名',
	          type: 'warning'
	        });
	        return;
	      }*/
    		let data = {
    			filterKeyword:this.centerTrademark,
    		}
    		this.$emit('search',data)
			},
		},
		mounted(){
		},
		watch: {
			keyword(){
				this.centerTrademark = this.keyword;
			},
			centerTrademark(){
				this.$emit('keywordChange', this.centerTrademark)
			}
		}
	}
</script>

<style lang="scss">
	.operation_search_box{text-align: left;
		.c_type_2{
			width:300px;box-sizing:border-box;
			.el-input__inner{width:263px;border-radius:0 3px 3px 0;height:30px;line-height:30px;border-color:#e6e6e6;}
			.el-input-group__prepend{border-color:#e6e6e6;box-sizing:border-box;}
			.el-input-group__prepend button.el-button{padding:6px 10px;box-sizing:border-box;
				.el-icon-search{font-size:18px;margin-top:-3px;box-sizing:border-box;}
			}
		}
		>button{}
		.btn_search{background-color:#3db1fa;color:#fff;}
	}
</style>
