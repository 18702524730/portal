<template>
	<div class="enter_operation clearfix mt10">
		<div class="operation_search fl">
			<h3><router-link class="til" :to="`/steward/enterpriseDetail/${$route.query.keyword}`">{{$route.query.keyword}}</router-link> <span>{{$route.query.companyStatus|lawStatus}}</span><a href="#" @click.prevent="goBack">更换</a></h3>
			<el-input class="c_type_1" placeholder="搜索该企业旗下的商标" v-model.lazy="centerTrademark" @keyup.enter.native="searchTrademark" @focus="showSuggest=true"  @blur="blurHandle">
		    <div slot="append" @click="searchTrademark"><i class="el-icon-search"></i></div>
		  </el-input>
			<!-- <tmSuggest :show="showSuggest" :keyword="centerTrademark" :companyName="$route.query.keyword" @search="bySuggestSearch"></tmSuggest> -->
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import Filters from 'api/filters.js'
	import qs from 'qs'
	import tmSuggest from 'components/guanjia/tmSuggest.vue'

	export default {
		components: {
			tmSuggest
		},
		props: [],
		data(){
			return{
				showSuggest: false,
				centerTrademark: '',
			}
		},
		methods:{
			//
			bySuggestSearch(name){
				this.centerTrademark = name;
				this.searchTrademark();
			},
			//失去焦点 隐藏搜索建议框
			blurHandle(){
				setTimeout(() => {
					this.showSuggest = false;
				}, 300);
			},
			searchTrademark(){
				let data = {
	    		filterKeyword: this.centerTrademark || '',
    		}
    		this.$emit('search',data);
			},
			//返回上一页
			goPrev () {
				history.back(-1);
			},
			goBack() {
				this.$router.replace({path:'/steward/hostEnterprise/1'})
			}
		},
		mounted(){
		},
		watch: {
		},
		filters: {
			lawStatus:Filters.lawStatus
		},

	}
</script>

<style lang="scss">
.enter_operation{
	.operation_type{
		p{font-size:12px;color:#666;line-height: 26px;cursor: pointer;}
		p:hover{color:#3db1fa;}
		.clickType{color:#3db1fa;}
	}
	// 宽度算上边框
	.operation_search{text-align: left;position: relative;width: 100%;
		h3{
			height: 26px;line-height: 26px;font-size: 18px;font-weight: normal;margin-top: 8px;vertical-align: middle;
			.til{
				height: 26px;line-height: 26px;font-size: 18px;color: #333;text-decoration: none;display: inline-block;max-width:380px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;vertical-align: top;
				&:hover{color:#3db1fa;}
			}
			span{margin-left: 10px;display: inline-block;font-size:13px;height:22px;line-height: 20px;border-radius:22px;padding: 0 12px;border:1px solid #4272FF;color: #4272FF;vertical-align: middle;}
			a{font-style: normal;font-size:13px;color:#3db1fa;margin-left: 12px;text-decoration: underline;display: inline-block;vertical-align: middle;}
		}
		.c_type_1{
			position: absolute;right: 0;top: 0;width:375px;box-sizing:border-box;margin-bottom: 20px;
			.el-input__inner{width:375px;border-radius: 3px 0 0 3px;height:40px;line-height:40px;border-color:#e6e6e6;}
			.el-input-group__append{
				border-color:#e6e6e6;box-sizing:border-box;left: -40px;position: relative;cursor: pointer;
				.el-icon-search{font-size:20px;box-sizing:border-box;margin-top: 2px;}
			}
		}
		.c_type_2{
			width:300px;box-sizing:border-box;
			.el-input__inner{width:266px;border-radius:0 3px 3px 0;height:30px;line-height:30px;border-color:#e6e6e6;}
			.el-input-group__prepend{border-color:#e6e6e6;box-sizing:border-box;}
			.el-input-group__prepend button.el-button{height:30px;width:36px;box-sizing:border-box;
				.el-icon-search{margin-left:-8px;font-size:20px;margin-top:-4px;box-sizing:border-box;}
			}
		}
		>button{width:50px;height:30px;border-radius:3px;color:#3db1fa;border:1px solid #3db1fa;}
		.btn_search{background-color:#3db1fa;color:#fff;}
	}
}
</style>
