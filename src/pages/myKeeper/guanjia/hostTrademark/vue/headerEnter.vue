<template>
	<div class="trade-mark-gj">
		<h4><router-link :to="{path:'/steward/myCompany?type=1'}">商标管家</router-link> &gt; 添加托管</h4>
		<headerTab :tabIndex="tabIndex" @tabChange="tabChange" v-if="step == 1"></headerTab>
		<div class="mt20">
			<div class="trade-mark-head">
				<button @click="goPrev">返回</button>
				<ul v-if="!trademark" class="clearfix">
					<li class="fl" :class= " step == 1 ? 'selected': '' "><i :class=" step == 1 ? 'bg-selected': '' ">1</i>搜索企业</li>
					<li class="fl" :class= " step == 2 ? 'selected': '' "><i :class=" step == 2 ? 'bg-selected': '' ">2</i>选择企业</li>
					<li class="fl" :class= " step == 3 ? 'selected': '' "><i :class=" step == 3 ? 'bg-selected': '' ">3</i>托管商标</li>
				</ul>
				<ul v-else class="trademark clearfix">
					<li class="fl" :class= " step == 1 ? 'selected': '' "><i :class=" step == 1 ? 'bg-selected': '' ">1</i>搜索商标</li>
					<li class="fl" :class= " step == 2 ? 'selected': '' "><i :class=" step == 2 ? 'bg-selected': '' ">2</i>托管商标</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import Util from 'src/common/js/util.js'
	import Filters from 'api/filters.js'
	import headerTab from './headerTab.vue'
	import qs from 'qs'
	const indexUrl = CONFIG.indexUrl;
	const rootUrl = CONFIG.rootUrl;
	const czUrl = CONFIG.czUrl;
	export default {
		props: ['step','trademark'],
		components: {
			headerTab,
		},
		data(){
			return{
				tabIndex: 1,
				centerType:1
			}
		},
		methods:{
			tabChange(index){
				this.tabIndex = index;
				this.$router.replace({path: index == 1 ? `/steward/hostEnterprise/1` : `/steward/addHost/1`})
			},
			//返回上一页
			goPrev () {
				if(this.step == 2){
					if(!this.trademark){
						this.$router.replace({path:`/steward/hostEnterprise/1`})
					}else{
						this.$router.replace({ name:'addHost',params: { step: 1}})
					}
				}
				if(this.step == 3){
					this.companyName = this.$route.query.companyName;
					this.$router.replace({path:`/steward/hostEnterprise/2?companyName=${this.$route.query.keyword}&page=1&size:10`})
				}
				if(this.step == 1){
					this.$router.replace({path:`/steward/myCompany`})
				}
			},
			goBack() {
				this.$router.push({path:'/steward/myCompany'})
			}
		},
		mounted(){
			this.centerType = this.$route.params.type;
			this.tabIndex = this.trademark ? 2 : 1;
		}

	}
</script>

<style lang="scss">
	.trade-mark-gj {
		background: #fff;
		h4 {
			height: 50px;
			font-size: 15px;
			font-weight: normal;
			padding: 20px 0 0 20px;

			a {
				color: #3db1fa;
			}
		}

		.trade-mark-head {
			clear:  both;
			height: 35px;
			border-bottom: 1px solid #e6e6e6;
			padding-left: 20px;

			button {
				float: left;
				width: 55px;
				height: 22px;
				line-height: 0;
				font-size: 14px;
				text-align: left;
				color: #666;
				border: 0;
				outline: 0;
				padding-left: 19px;
				background: url(~assets/img/trustee/back_btn.png) no-repeat left center;
				background-size: 16px 16px;
				&:hover {
					background-image: url(~assets/img/trustee/back_btn_h.png);
					color: #3db1fa;
				}
			}
			.trademark{margin-left: 300px;
				li{width:150px;text-align:center;}
			}
			ul {
				display: block;
				margin-left: 220px;
				li {
					margin-right: 25px;
					padding-left: 7px;
					width: 130px;
					height: 35px;
					font-size: 14px;
					color: #999;
					text-align:center;

					i {
						display: inline-block;
						margin-right: 6px;
						width: 20px;
						height: 20px;
						font-style: normal;
						font-size: 12px;
						text-align: center;
						color: #fff;
						background: #cacaca;
						border-radius: 50%;


					}
				}

				.selected {
					border-bottom: 2px solid #3db1fa;
					color: #3db1fa;
				}

				.bg-selected {
					background: #3db1fa;
				}
			}

			.trustee-num {
				float: left;
				margin: 0 25px 0 60px;
				font-size: 14px;
				color: #666;


				.icon_red {
					color: #f64744;
				}
			}

			.trustee-btn {
				float: left;
				transform: translateY(-6px);
				width: 82px;
				height: 35px;
				text-align: center;
				font-size: 14px;
				color: #fff;
				border-radius: 5px;
				background: #f64744;
			}
		}
	}
	.dialog-applyCer{
		width:300px;min-height:200px;padding:20px 30px 20px;
	.pop_window{padding-top:15px;}
	}
</style>
