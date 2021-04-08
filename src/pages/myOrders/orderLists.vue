<template>
	<div class="__myOrders listCommonality">
		<h4 class="navTitle content_title">服务订单</h4>
		<div class="orderStatus">
			<ul>
				<li :class="[orderState === '99' ? 'active' : '', 'li_fr']" @click="toggle('99')">
					<el-select v-model="bsId" @change="handleSelectChange" class="no_border_select"
					@visible-change="toggle('99')"
					:style="{width: selectWidth + 'px'}"
					>
						<el-option
							class="orderItemType"
							v-for="item in options"
							:key="item.bsType"
							:label="item.name"
							:value="item.bsType">
						</el-option>
					</el-select>
				</li>
				<li :class="{active: orderState === '0'}" @click="toggle('0')">待付款</li>
				<li :class="{active: orderState === '1'}" @click="toggle('1')">已付款</li>
				<li :class="{active: orderState === '-1'}" @click="toggle('-1')">已关闭</li>
			</ul>
		</div>
		<div class="orderLists listHead">
			<div v-loading="loading" style="min-height: 142px">
				<table class="table table-bordered order_list_head">
					<thead>
						<tr>
							<th class="col1">商品</th>
							<th class="col2">单价</th>
							<th class="col3">数量</th>
							<th class="col4">实付款</th>
							<th class="col5">状态</th>
							<th class="col6">操作</th>
						</tr>
					</thead>
				</table>
				<div v-if="!noResult && !errorResult">
					<table class="table table-bordered" v-for="item in ordersData" :key="item.order_fictitious_sn" v-if="item.fictitiousList && item.fictitiousList.length > 0">
						<thead>
							<tr>
								<th colspan="4">
									<div class="title">
										<span style="width: 135px;display: inline-block;">{{item.create_time|dateFormat}}</span>
										<span style="width: 140px;display: inline-block;">订单号：{{item.order_fictitious_sn}}</span>
										<a :href="`${indexUrl}/store/${item.order_store_code}.htm`" class="shop_name">{{item.order_store_name | ellipsis(30)}}</a>
                  	<contactQQ :type="item.order_distribute_from" :qqCode="item.order_store_code" :qqOrder="item.order_bs_number"></contactQQ>
										<!-- <span>2018-07-03 15:20:24</span>
										<span>订单号：10009109813</span>
										<span class="shop_name">拾贝旗舰店1店</span>
										<span class="link_seller">联系商家</span> -->
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(orderItem, index) in item.fictitiousList.slice(0, 5)" :key="orderItem.order_sn">
								<td class="name" valign="top">
									<div class="fl img">
										<!-- <img src="~assets/img/wxgzh.jpg"> -->
										<img :src="orderItem.orderBsImage" :onerror="imgLoadError">
									</div>
									<div class="fl content">
										<!-- <router-link :to="'orders/'+orderItem.order_sn" :title="orderItem.orderName">{{orderItem.orderName|titleLengthFormat}}</router-link> -->

										<a v-if="orderItem.orderBussinessType!=2" :href="orderItem.orderBussinessType == 4 ? `${trademarkUrl}/trademark/${orderItem.order_bs_number}.htm` : orderItem.orderBsCode === 'sbfw_gnsb_zzzc' ? `${indexUrl}/sebe/pages/selfRegister.html#/one` : `${indexUrl}/store/service/${orderItem.order_bs_number}.htm`">{{orderItem.orderName|titleLengthFormat}}</a>
										<a v-if="orderItem.orderBussinessType==2" :href="`${indexUrl}/cms/service/rightoriginal.htm`">{{orderItem.orderName|titleLengthFormat}}</a>
                    <span class="price">{{orderItem.order_goods_amount | priceformat}}</span>
										<span class="num">X{{orderItem.paymentNumber}}</span>
									</div>
								</td>
								<!--  -->
								<td valign="top" class="money" v-if="index === 0" :rowspan="item.fictitiousList.length + 1">
										<p>{{item.amount|priceformat}}</p>
										<p v-if="item.saleAmount" style="color: #999;margin-top: 5px;font-size: 12px;line-height: 17px;">优惠金额：{{item.saleAmount | priceformat}}</p>
								</td>
								<td valign="top" class="info" v-if="index === 0" :rowspan="item.fictitiousList.length + 1">
										{{item.order_state|payStatusformat}}
								</td>
								<td valign="top" :class="[orderItem.order_state === -1 ? '' : 'hasCount', 'action']" v-if="index === 0" :rowspan="item.fictitiousList.length + 1">

										<span class="countdown-wrap countdown_list" v-if="(item.order_state == 0 && item.channel_code!='ali') || (item.order_state==0 && !item.channel_code)">
											<count-down class="countdown" @end_callback="countDownE_cb(item)" :leftTime="item.leftTime" :dayTxt="'天'" :hourTxt="'时'" :minutesTxt="'分'" :secondsTxt="'秒'"></count-down>
										</span>
										<!-- <a class="btn topay-btn" v-if="item.order_state==0" :href="cartUrl + '/shop/pages/pay.html?order_sn='+item.order_sn + (item.orderBsCode == 'sbfw_gnsb_zzzc' ? '&source=1' : '')" target="_blank">去付款</a> -->
										<el-button size="small" class="orderListBtn" v-if="(item.order_state == 0 && item.channel_code!='ali') || (item.order_state==0 && !item.channel_code)" @click="handleClickPay(item.order_sn)" type="primary">付款</el-button>
										<el-button size="small" class="orderListBtn" @click="goEvaluate(item.order_fictitious_sn)" v-if="item.order_state==1 && item.isEvaluate == 0">评价</el-button>
										<el-button size="small" class="orderListBtn" @click="$router.push('/appraiseList?status=2')" v-if="item.order_state==1 && item.isEvaluate == 1">查看评价</el-button>
										<!-- <span class="close_order" href="javascript:void(0)" v-if="orderItem.order_state==-1" style="color: #333">交易关闭</span> -->
										<router-link v-if="item.order_state != -1" style="color: #333" :to="'orders/'+item.order_fictitious_sn">查看详情</router-link>
										<el-popover placement="bottom" width="160" trigger="click" class="sebe-popover" v-if="item.order_state==0">
											<p class="lc">是否取消该订单？</p>
											<div class="lc mt10">
												<el-button size="mini" type="primary" @click="cancelOrder(item.order_fictitious_sn)">是</el-button><el-button size="mini" type="primary" @click="hidePop">否</el-button>
											</div>
											<a href="javascript:;" style="color:#999;padding-top: 5px;" slot="reference">取消订单</a>
										</el-popover>

								</td>
							</tr>
							<tr v-if="item.fictitiousList.length > 5">
								<td class="watch_more" @click="$router.push('/orders/' + item.order_fictitious_sn)" align="center">查看更多</td>
							</tr>
						</tbody>
					</table>
				</div>
				<noResult v-if="noResult || errorResult"></noResult>
			</div>
			<div class="pagination-wrap" v-if="ordersData.length">
					<el-pagination
						@current-change="currentChange"
						:current-page.sync="page"
						:page-size="size"
						layout="total, prev, pager, next, jumper"
						:total="total"
						background>
					</el-pagination>
			</div>

			<!-- <div class="pagination-wrap" v-if="ordersData.length">
				<el-pagination layout="total, prev, pager, next" :total="total" :page-size="size" :current-page.sync="page" class="sebe-pagination" @current-change="currentChange"></el-pagination>
			</div> -->
		</div>
	</div>
</template>
<script>
	import $ from 'jquery'
	const indexUrl = CONFIG.indexUrl;
	const cartUrl = CONFIG.cartUrl;
	const trademarkUrl = CONFIG.trademarkUrl;
	import Filters from 'api/filters.js'
	import qs from 'qs'
	import CountDown from 'components/countdown.vue'
	import * as orderDatas from './orderList'
	import noResult from 'components/noResult/noResult.vue'
  import contactQQ from 'components/contactQQ.vue'
	const serviceList = [
		{name: '全部订单', bsType: ''},
		{name: '商标服务', bsType: '1'},
		{name: '专利服务', bsType: '5'},
		{name: '版权服务', bsType: '10'},
		{name: '政府项目', bsType: '15'},
		{name: '维权诉讼', bsType: '20'},
		{name: '商标交易', bsType: '38'},
		{name: '企业服务', bsType: '26'},
		{name: '存证订单', bsType: '17'}
	]
	export default {
		components: {
			CountDown, noResult,contactQQ
		},
		data(){
				return{
					options: serviceList,
					bsId: '',
					imgLoadError: 'this.src="' + require('../../assets/img/imgLoadError.png') + '"',
					noDataTip: '',
					selectWidth: 106,
					noResult: false,//无查询结果时显示
					errorResult: false,
					loading: false, //加载提示
					indexUrl: indexUrl, //网站首页根域名
					trademarkUrl: trademarkUrl,
					cartUrl: cartUrl,
					orderState: '99',//订单状态，默认99查询全部订单
					page: 1,
					tempPage: 1,
					size: 5,
					total:10,
					ordersData:[] //订单列表数据
				}
		},
		methods:{
			handleClickPay (order_sn) {
				// shop/pages/pay.html?order_sn=10201404805
				window.location.href = cartUrl + "/shop/pages/pay.html?order_sn=" + order_sn
			},
			openNewWin() {
				let height = document.documentElement.clientHeight;
				let width = document.documentElement.clientWidth;
				console.log(height, width, 'width=600,height=500,left='+ (width - 600) +'px,top=' + (height - 550) + 'px')
				window.open(
					'https://pct.zoosnet.net/LR/Chatpre.aspx?id=PCT70172520&lng=cn&p=http%3a%2f%2fwww.ipsebe.com','',
				// 'width=600,height=500,left='+ (width - 600) +'px,top=' + (height - 550) + 'px,toolbar=no,status=no,menubar=no,resizable=yes,scrollbars=yes');
				'width=600,height=500,left='+ (width - 600) +'px,top=' + (height - 550) + 'px');
				return false;
			},
      goEvaluate (id) {
        this.$router.push({ path: '/appraiseDetail/' + id})
      },
			getOptions(){
				this.$http.get('./api/findBusinessServiceOrdered')
				.then((resp) => {
					var data = resp.data;
					data.unshift({bs_id: '', name: '全部订单'})
					this.options = data || [];
				})
				.catch((error) => {
				});
			},
			countDownE_cb(item){
				item.leftTime = 0;
				this.search();
			},
			//切换快捷订单筛选
			toggle(status){
				this.$router.push({path: 'orders', query: {status: status, page: 1}});
				// .el-scrollbar{height: 285px;}
				// .el-popper[x-placement^="bottom"]{margin-top: 0;}
				// .el-select-dropdown__wrap{max-height: 315px;}
				// .el-scrollbar__wrap{overflow: hidden;}
				$('.orderItemType').parents('.el-scrollbar').height(320)
				$('.orderItemType').parents('.el-select-dropdown__wrap').css({maxHeight: 350 + 'px'})
				$('.orderItemType').parents('.el-popper').css({marginTop: 0})
				$('.orderItemType').parents('.el-scrollbar__wrap').css('overflow', 'hidden')
			},
			//查询订单列表
			search(){
				this.loading = true;
				this.noResult = false;
				this.errorResult = false;
				this.orderState = this.$route.query.status || '99';
				this.page = (this.$route.query.page-0) || 1;
				this.$http.get('./api/findPlatformOrderList', {
					params: {
						bsType: this.bsId,
						orderState: this.orderState,
						page: this.page,
						size: this.size
					}
				})
				.then((response) => {
					var data = response.data;
					this.loading = false;
					this.total = data.total_elements;
					for (let item of data.elements) {
						if (item.order_goods_amount) {
							item.saleAmount = item.order_goods_amount - item.amount
						}
					}
          this.ordersData = data.elements;
					if (this.ordersData.length == 0) {
            this.noResult = true;
					}

				})
				.catch((error) => {
					this.loading = false;
					this.errorResult = true;
					this.ordersData = [];
					var data = error.response.data;
				});
				this.$emit('renderNoPay');
			},
			//翻页
			currentChange(currentPage){
				var route = this.$route;
				var path = route.path;
				var newQuery = $.extend({}, route.query, {page: currentPage || 1});
				this.$router.push({path: path, query: newQuery});
			},
			//异常提示处理
			noDataTipHandle(status){
				var ret = '暂无订单数据'
				if (status == '99') {
					ret = '最近没有下过订单哦~';
				}else if(status == '0'){
					ret = '没有待付款订单~';
				}else if(status == '1'){
					ret = '没有已付款订单~';
				}else if(status == '-1'){
					ret = '没有已关闭订单~';
				}
				this.noDataTip = ret;
			},
			refresh(){
				this.search();
			},
			//统计订单状态对应数量
			/*statistic(){
				var self = this;
				self.$http.post('./api/statistics')
				.then((response) => {
					var data = response.data;
					if (data.code === '0') {
						self.statisticData = data;
					}
				})
				.catch((error) => {
					var data = error.response.data;
				});
			},*/
			//取消订单
			cancelOrder(order_sn){
				var self = this;
				self.$http.post('./api/editState', qs.stringify({
					order_sn: order_sn
				}))
				.then((response) => {
					var data = response.data;
					if (data.code === '0') {
						this.$message({
							title: '成功',
							message: '订单已关闭',
							type: 'success'
						});
						self.search();
						self.hidePop();
					}
				})
				.catch((error) => {
					var data = error.response.data;
				});
			},
			//隐藏浮框
			hidePop(){
				document.getElementById('app').click();
			},
			handleSelectChange () {
				let bd;
				for (let item of this.options) {
					if (item.bsType == this.bsId) {
						bd = item
						break
					}
				}
				this.selectWidth = bd.name.length * 15 + 46 || 106
				this.search()
			}
		},
		mounted(){
			// this.getOptions();
			this.search();
		},
		watch: {
			// 如果路由有变化，会再次执行该方法
			'$route': 'search'
		},
		filters: {
			dateFormat: Filters.formatDate.dateFormat,
			orderStatusformat: Filters.orderStatusformat,
			payStatusformat: Filters.payStatusformat,
      priceformat:Filters.priceformat,
      ellipsis: Filters.ellipsis,
			titleLengthFormat:Filters.titleLengthFormat
		}
	}
</script>

<style lang="scss">
// 我的服务列表页面共用此样式
.__myOrders{

	a{text-decoration: none;}

	// font-size: 13px;
	padding: 20px 20px 20px;
	// h4{height: 21px;line-height: 21px;font-weight: bold;font-size: 16px;padding-left: 20px;color:#333;}
	.orderStatus{
		font-size: 14px;
		margin: 21px 0 10px 0;
		>ul{
			box-sizing: content-box;
			height: 40px;
			>li{
				&.li_fr{padding: 0px;position: relative;
				}
				&::after{content: '';height: 15px;width: 1px;background: #E6E6E6;position: absolute;top: 12px;right: 0px}
				box-sizing: content-box;
				padding: 0 30px;
				float:left;height: 40px; line-height: 40px;color: #666;cursor: pointer;position: relative;
				&:last-child::after{height: 0;}
			}
			li.active{
				color: #3db1fa;
			}
		}
	}
	.orderLists{
		// min-height: 500px;
		// padding:0 20px;
		table{
			.el-button--small{border-radius: 2px;}
			.orderListBtn{padding: 7px 0;width: 88px;}
			margin-bottom: 10px;
			&.order_list_head{display: block;width: 100%;margin-bottom: 20px;border: 1px solid #eee;
				tr{text-align: left;height: 40px;line-height:40px;background:rgba(245,245,245,1);
					th{font-weight:normal;border: none;
						&.col1{width: 347px;padding-left: 20px;}
						&.col2{width: 96px;}
						&.col3{width: 102px;}
						&.col4{width: 158px;}
						&.col5{width: 147px;}
						&.col6{width: 89px;}
					}
				}
			}
			// width: 100%;
			tr{
				td.name{
					width: 484px;
					>div{
					&.img{width: 90px;margin: 0 20px;height: 90px;border:1px solid rgba(238,238,238,1);
						img{width: 100%;height: 100%;}
						}
					&.content{font-size: 13px;line-height: 18px;word-wrap:break-word;word-break:break-all;
            >a{width: 130px;display: block;float: left;
              &:hover{color:#333;cursor: pointer;}
            }
						>.price{margin-top: -18px;width: 180px;padding-left: 16px;display: inline-block;text-align: center;}
						}
					}
					.num-btn{width: 54px;height: 26px;border-color: #e6e6e6;color: #666;margin-top:5px;font-size:13px;line-height: 24px;cursor: default}
				}
				td.info{
					width: 140px;
					text-align: center;
					line-height: 18px;
					span{color: #666;}
				}
				td.money{
					width: 160px;text-align: center;font-size:13px;color: #333;
				}
				td.action{
					// text-align: center;color: #666;
					// .topay-btn{display: inline-block;width: 60px;height: 26px;background-color: #fe2200;margin:5px 0;border-color:#fe2200; color: #fff;font-size:13px;line-height: 24px;}
					// .topay-btn:hover{background-color: #fa1b00;border-color:#fa1b00;}
					a, .close_order{color: #666;line-height:18px;display: block;padding-top: 8px;
						&.cancel_order{padding-top: 5px;color:#999999}
					}
					a:hover{color: #3db1fa;}
					// .topay-btn:hover{text-decoration: none;color: #fff;}
					&.hasCount{height: 100%;}
				}
				td.watch_more{
					height: 30px;
					color: #999999;
					padding: 0;
					cursor: pointer;
				}
			}
		}
		.pagination-wrap{
			text-align: center;
			padding: 20px 0 10px;
			/* .sebe-pagination{margin-top:20px;} */
		}
	}
}
.el-popover{
	.confirm-btn{width: 60px;height: 26px;background-color: #3db1fa;border-color:#3db1fa;margin:5px 0; margin-right:6px;}
	.confirm-btn:hover{background-color: #259ce7;border-color:#259ce7;}
	.cancel-btn{width: 60px;height: 26px;margin:5px 0;color: #666;border-color:#e6e6e6 }
	.cancel-btn:hover{background-color: #f5f5f5;}
}
</style>
<style lang="scss">
	// .el-scrollbar{height: 285px;}
	// .el-popper[x-placement^="bottom"]{margin-top: 0;}
	// .el-select-dropdown__wrap{max-height: 315px;}
	// .el-scrollbar__wrap{overflow: hidden;}
	// .el-select:hover{
	// 	.el-input__inner{color: #3db1fa;}
	// 	.el-input__icon{color: #3db1fa;}
	// }
.el-popover{
	.confirm-btn{width: 60px;height: 26px;background-color: #3db1fa;border-color:#3db1fa;margin:5px 0; margin-right:6px;}
	.confirm-btn:hover{background-color: #259ce7;border-color:#259ce7;}
	.cancel-btn{width: 60px;height: 26px;margin:5px 0;color: #666;border-color:#e6e6e6 }
	.cancel-btn:hover{background-color: #f5f5f5;}
}
.active{
	.el-input__inner{
		.el-input__icon{color: #3db1fa;}
	}

}
.no_border_select{

	transform: translateX(-5px);
	.el-input{
		.el-input__inner{
			border: none;
		}
		.el-select__caret{
			font-size: 8px;
		}
	}
}
.active .el-select .el-input .el-input__inner{color: #3DB1FA;}
.active .el-select .el-input .el-input__suffix .el-input__suffix-inner .el-input__icon{color: #3DB1FA;}
// .el-button--small, .el-button--small.is-round{
//   padding: 5px 30px;
//   font-size: 14px;
//   line-height: 18px;
// }
.countdown-wrap{
	&.countdown_list{
		font-size: 12px;
	}

}
</style>
