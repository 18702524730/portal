<template>
	<div>
		<sebe-header></sebe-header>
		<div class="tradeDetail" v-loading="loading">
			<h4>商标详情</h4>
			<table class="list_table mt15">
				<tbody>
					<tr class="list_txt bor_btm">
						<td colspan="6">商标名称：{{detailsData.tmName}}
						<span class="host ml10" v-if="!isAlone">{{detailsData.state ? '已托管' : '未托管'}}</span>
						<span class="core ml10" v-if="detailsData.core">核心商标</span>
						</td>
					</tr>
					<tr class="list_txt bor_btm">
						<td class="bor_btr name">注册号</td>
						<td class="bor_btr">{{detailsData.regNo || '--'}}</td>
						<td class="bor_btr name">类别</td>
						<td class="bor_btr">{{getTmInfo(detailsData.intCls) }}</td>
						<td class="bor_btr name">申请日期</td>
						<td class="info">{{detailsData.appDate || '--'}}</td>
					</tr>
					<tr class="list_txt bor_btm">
						<td class="bor_btr name">申请人名称（中文）</td>
						<td colspan="5">{{detailsData.applicantCn || '--'}}</td>
					</tr>
					<tr class="list_txt bor_btm">
						<td class="bor_btr name">申请人地址（中文）</td>
						<td colspan="5">{{detailsData.addressCn || '--'}}</td>
					</tr>
					<tr class="list_txt bor_btm">
						<td class="bor_btr name">申请人名称（英文）</td>
						<td colspan="5">{{detailsData.applicantEn || '--'}}</td>
					</tr>
					<tr class="list_txt bor_btm">
						<td class="bor_btr name">申请人地址（英文）</td>
						<td colspan="5">{{detailsData.addressEn || '--'}}</td>
					</tr>
					<tr class="list_img bor_btm">
						<td class="bor_btr name">
							商标图片
						</td>
						<td class="bor_btr" colspan="2">
							<img :src="detailsData.tmImg" alt="">
						</td>
						<td class="bor_btr name">
							商品/服务列表
						</td>
						<td class="bor_btr" colspan="2">
							<p class="mt10" v-for="item in detailsData.goodsList">{{item.goodsCode ? item.goodsCode+"-"+item.goodsName : item.goodsName}}</p>
						</td>
					</tr>
					<tr class="list_txt bor_btm">
						<td class="bor_btr name">初审公告期号</td>
						<td class="bor_btr" colspan="2">{{detailsData.announcementIssue || '--'}}</td>
						<td class="bor_btr name">注册公告期号</td>
						<td colspan="2">{{detailsData.regIssue || '--'}}</td>
					</tr>
					<tr class="list_txt bor_btm">
						<td class="bor_btr name">初审公告日期</td>
						<td class="bor_btr" colspan="2">{{detailsData.announcementDate || '--'}}</td>
						<td class="bor_btr name">注册公告日期</td>
						<td colspan="2">{{detailsData.regDate || '--'}}</td>
					</tr>
					<tr class="list_txt">
						<td class="bor_btr name">专用权期限</td>
						<td class="bor_btr" colspan="2">{{detailsData.privateDate || '--'}}</td>
						<td class="bor_btr name">商标类型</td>
						<td colspan="2">{{detailsData.category || '--'}}</td>
					</tr>
				</tbody>
			</table>
			<h4 class="mt30">商标流程</h4>
			<div class="process mt15">
				<ul>
					<li class="clearfix" :class="{'now':index== (detailsData.flowList.length-1)}" v-for="(item,index) in detailsData.flowList">
						<i class="fl"></i>
						<p class="fl ml15">{{item.flowDate || '目前'}}</p>
						<!-- <p class="fl ml15">23:23:13</p> -->
						<p class="fl ml40">{{item.flowname || '--'}}</p>
					</li>
				</ul>
			</div>
	  </div>
		<div class="approximate" v-if="!isAlone">
			<button class="mt20" @click="toApp()">查看近似商标</button>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import $ from 'jquery'
	const stewardUrl = CONFIG.stewardUrl;
	const userUrl = CONFIG.userUrl;
	import Util from 'src/common/js/util.js'
	import Filters from 'api/filters.js'
	import qs from 'qs'
	import sebeHeader from 'components/Header.vue'
	import sebeFooter from 'components/FooterSm.vue'
	import intClsData from 'src/common/js/intClsData.js'
	export default {
		components: {
			sebeHeader,
			sebeFooter
		},
		data(){
			return{
				isAlone: false, //独立的，表示共用，去除托管和查看近似功能
				stewardUrl:stewardUrl,
				loading:false,
				detailsData:{},
				cateIdData: intClsData.cateIdData,
			}
		},
		methods:{
			getTmInfo(item){
    		if(item){
    			if(item > 9){
    				var str = '第'+ item + '类-' + this.cateIdData[item-1]['goodsname'];
    			}else{
    				var str = '第0'+ item + '类-' + this.cateIdData[item-1]['goodsname'];
    			}
    			return str;
    		}else{
    			var str = '--';
    			return str;
    		}
      },
			toApp(){
				this.$router.push({path: '/steward/approximateTrademark', query:{keyword: this.detailsData.tmName}})
				// this.$router.push({path: 'approximateTrademark', query: {keyword: this.detailsData.tmName, page: this.detailsData.state}});
			},
			query(data){
				this.loading = true;
				let url = stewardUrl + '/smallStewardTadeMark/findTrademarkDetails?';
				// 用于自助注册项目-尼斯查询的商标详情
				if (!data.intCls && !data.trademarkId) {
					url = userUrl + '/tmselfregist/trademark/findTrademarkDetailsByRegNo.htm?';
				}
				this.$http.get(url + qs.stringify(data))
				.then((resp) => {
	      	console.log(resp)
	      	this.loading = false;
	      	this.detailsData = resp.data.data;
	      })
	      .catch((err) => {
	      	this.loading = false;
	        console.log(err);
	      });
			}
		},
		mounted(){
			let q = this.$route.query
			this.isAlone = q.isAlone;
			this.query(q);
		},
		watch: {
		},
		filters: {
		}
	}
</script>

<style scoped lang="scss">
.tradeDetail{width:1200px;background-color:#fff;padding:90px;margin:20px auto 84px;text-align:left;
	h4{font-size:16px;color:#333;}
	.bor_btm{border-bottom:1px solid #eee;}
	.bor_btr{border-right:1px solid #eee;}
	.name{color:#999;}
	.info{color:#333;}
	.list_table{width:990px;border:1px solid #eee;
		tr{
			td{padding-left:20px;font-size:14px;
				img{width:200px;height:200px;}
			}
		}
		.list_txt{
			td{height:50px;
				span{width:58px;height:24px;font-size:12px;border-radius:3px;display:inline-block;text-align:center;line-height:24px;}
				.host{background-color:#eef8ff;color:#3db1fa;}
				.core{color:#f5a623;background-color:#FFF8EE;width:70px;}
			}
		}
		.list_img{
			td{padding:20px;
				p{color:#333;font-size:14px;line-height:20px;}
			}
		}
	}
	.process{border:1px solid #eee;width:990px;
		ul{
			.now{background-color:#FAFDFF;
				i{width:10px;height:10px;background-color:#3db1fa;}
				p{color:#3db1fa;}
			}
			li{height:50px;padding-left:20px;border-top:1px solid #eee;
				i{width:8px;height:8px;background-color:#eee;border-radius:8px;display:block;margin-top:21px;}
				p{line-height:50px;font-size:14px;color:#333;}
			}
			li:first-child{border-top:0;}
		}
	}
}
.approximate{background:rgba(255,255,255,1);box-shadow: 0px -4px 10px 0px rgba(0,0,0,0.03);width:100%;background-color:#fff;height:84px;position: fixed;bottom:0;left:0;text-align:center;
	button{width:300px;height:44px;text-align:center;background-color:#20a0ff;color:#fff;border-radius:3px;}
}
</style>
