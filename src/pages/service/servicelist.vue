<template>
	<div class="listCommonality service_list">
		<h4 class="navTitle">商标服务</h4>
		<template >
			<div class="listHeaderTab">
				<ul>
					<li :class="{active: confirmStatus == null}" @click="toggle(null)">全部服务</li>
					<li :class="{active: confirmStatus == 1}" @click="toggle(1)">待服务</li>
					<li :class="{active: confirmStatus == 2}" @click="toggle(2)">服务中</li>
					<li :class="{active: confirmStatus == 3}" @click="toggle(3)">服务完成</li>
					<li :class="{active: confirmStatus == 4}" @click="toggle(4)">服务关闭</li>
				</ul>
			</div>
			<div class="listHeadExplain">
				<span class="name">服务</span>
				<span class="info">状态</span>
				<span class="action">操作</span>
			</div>
			<div class="listHead">
				<div class="mt-20">
					<table class="table table-bordered table_service" v-for="(item, index) in ordersData" :key="index" v-if="!loading && (!noResult || !errorResult) ">
						<thead>
							<tr>
								<th colspan="4">
									<div class="title">
										<span>服务单号：{{ item.order_sn }}</span>
										<span>订单号：{{ item.order_fictitious_sn }}</span>
										<a :href="`${indexUrl}/store/${item.order_store_code}.htm`" class="shop_name">{{item.order_store_name | ellipsis(30)}}</a>
                    <!-- 联系卖家 -->
                    <contact-seller :type="item.order_distribute_from" :qqCode="item.order_store_code" :qqOrder="item.order_bs_number" ></contact-seller>
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td class="name">
									<div class="fl img">
										<img :src="item.orderBsImage" v-if="item.orderBsImage && !item.orderInformation" :onerror="imgLoadError">
										<img v-if="item.orderInformation" :src="item.orderInformation.blackWhitePicUrl"  :onerror="imgLoadError">
									</div>
									<div class="content">
										<p class="s_name" >
											<span v-if="item.orderInformation" @click="goServiceDetailFn(item)">{{ item.orderInformation.trademarkName }}</span>
											<span v-if="!item.orderInformation" @click="goServiceDetailFn(item)">{{ item.orderName | ellipsis(75) }}</span>
										</p>
										<span class="label_base label_blue" v-if="item.orderInformation && item.orderInformation.intCls">{{ item.orderInformation.intCls<10 ? '0'+item.orderInformation.intCls : item.orderInformation.intCls }}-{{ cateIdData[item.orderInformation.intCls-1].goodsname }}</span>
									</div>
									<div class="detail" v-if="item.orderInformation">
										<p class="d_content">{{ item.orderInformation.min }}</p>
										<p class="money">共{{ item.orderInformation.minNumber }}项，需补费用：￥{{ item.orderInformation.premium }}</p>
									</div>
								</td>
								<td class="info" valign="top">
									<p class="text" >{{ item.order_feedback_state }}</p>
									<p class="time">{{ item.feedback_time | dateFormat }}</p>
									<!-- <router-link :to="'serviceList/'+item.order_id" class="text" v-if="item.stage>4 && item.haveDetail==1">查看服务记录</router-link> -->
								</td>
								<td class="action">

									<router-link :to="'serviceList/'+item.order_sn" v-if="item.orderInformation && item.orderInformation.status==2">
										<el-button type="primary" size="small" >付款</el-button>
									</router-link>
									<el-button type="primary" size="small" class="orderListBtn" v-if="item.order_check_accept==1"  @click="checkOrderFn(item)" style="margin-bottom:10px;">服务验收</el-button>
									<p class="red" v-if="item.order_check_accept==1"><count-down class="countdown" @end_callback="countDownE_cb(item)" :iconState="false" :leftTime="item.leaveTime" :dayTxt="'天'" :hourTxt="'小时'" :minutesTxt="'分钟'" :secondsTxt="'秒'" ></count-down>后自动确认验收</p>
									<span v-if="item.order_check_accept==2">服务已验收</span>
									<span v-if="item.order_check_accept==3">验收拒绝</span>
									<!-- <span v-if="item.status<6 && item.status>2">已确认</span> -->
	                <span v-if="item.status==7">已上传</span>
	                <!-- 上传申请材料 item.orderServiceState == 4 订单关闭 -->
	                <a href="#" v-else-if="item.order_state == 1 && item.orderServiceState != 4 && item.status==6" class="btn topay-btn" @click.prevent="toBeUpload(item)">上传申请材料</a>
									<router-link :to="'serviceList/'+item.order_sn" v-if="item.status==7 || (item.stage>=4 && item.haveDetail==1 && item.order_state==1)">查看详情</router-link>
								</td>
							</tr>
						</tbody>
					</table>
					<div v-loading="loading" v-if="loading" style="min-height: 200px;"></div>
					<!-- <div v-if="noResult" class="noResult">
						<img src="~assets/img/order/noorder_bg.png">
						<p>{{noDataTip}}</p>
						<a class="btn shopping" :href="indexUrl">去首页>></a>
					</div> -->
					<!-- <div v-if="errorResult" class="noResult">
						<img src="~assets/img/order/noorder_bg.png">
						<p>系统繁忙，<br>请点击<a href="" @click.prevent="refresh">刷新</a>或稍后再试。</p>
					</div> -->
					<noResult v-if="noResult || errorResult"></noResult>
				</div>

				<div class="pagination-wrap" style="padding: 20px 0 10px;" v-if="ordersData.length && !loading">
					<!-- <el-pagination layout="total, prev, pager, next" :total="total" :page-size="size" :current-page.sync="page" class="sebe-pagination" @current-change="currentChange"></el-pagination> -->
					<el-pagination
						@current-change="currentChange"
						:current-page="currentPage"
						:page-size="10"
						layout="total, prev, pager, next, jumper"
						:total="total"
						background>
					</el-pagination>
				</div>
			</div>
		</template>

		<!-- 确认收货 -->
		<el-dialog title="提示" width="400px" :visible.sync="giveUp" :close-on-click-modal="false" :append-to-body="true">
			<p class="lc">您确定要撤销出证吗？</p>
			<div class="lc mt20">
				<el-button size="small" type="primary" @click="giveUp=false">取消</el-button><el-button size="small" type="primary" class="sub" @click="giveUp=false">确定</el-button>
			</div>
		</el-dialog>

		<!-- 服务验收 -->
		<el-dialog title="服务验收" :visible.sync="checkVisible" width="400px">
		  <span>确认服务验收后，交易款项将打至商家账户，是否确认验收？</span>
			<span slot="footer" class="dialog-footer">
				<el-button class="orderListBtn" @click="handleClickServiceCheck(0)" size="small">拒接验收</el-button>
				<el-button class="orderListBtn" type="primary" @click="handleClickServiceCheck(1)" size="small">确认验收</el-button>
			</span>
		</el-dialog>

		<uploadMaterial :uploadVisible="uploadVisible" :curItem="curItem" @close="uploadVisible=false"  @fresh="refresh"></uploadMaterial>
	</div>
</template>
<script>
	import Vue from 'vue'
	import $ from 'jquery'
	import uploader from 'components/uploader/uploader.vue'
	import uploadMaterial from './components/uploadMaterial.vue'
	import Util from 'src/common/js/util.js'
	import Filters from 'api/filters.js'
	import qs from 'qs'
	import CountDown from 'components/countdown.vue';
	import intClsData from '../../common/js/intClsData.js';
	import contactSeller from '../../components/contactQQ.vue';
	import noResult from 'components/noResult/noResult.vue'
	const rootUrl = CONFIG.rootUrl;
	const indexUrl = CONFIG.indexUrl;
	const cartUrl = CONFIG.cartUrl;
	const trademarkUrl = CONFIG.trademarkUrl;
	const cxbUrl = 'http://123.56.191.155:8080/cxb/index.html'
	const cxbUrlO = '//ipr.taobao.com';
	const findServceOrderListUrl = rootUrl + '/api/findServceOrderList';  //查询服务列表


	export default {
		components: {
			CountDown,uploader,uploadMaterial, contactSeller, noResult
		},
		data(){
				return{
					giveUp: false,  //确认收货
					uploadVisible:false,
					imgLoadError: 'this.src="' + require('../../assets/img/imgLoadError.png') + '"',
					curItem: {},
					trademarkUrl: trademarkUrl,
					token: '',
					rootUrl: rootUrl,
					cxbUrl: cxbUrl,
					feedbackData:{}, // 通过/不通过弹框数据
					feedbackLoading: false,
					confirmVisible:false,
					throughVisible:false,

					cxbVisible: false, // 创新保数据同步动画弹窗
					cxbIsAllowed: false, // 是否有创新保
					type: '',
					cateIdData: intClsData.cateIdData,  //所有商标分类
					noDataTip: '',
					noResult: false,//无查询结果时显示
					errorResult: false,
					loading: false, //加载提示
					indexUrl: indexUrl, //网站首页根域名
					cartUrl: cartUrl,
					confirmStatus: null,//订单状态，默认0查询全部订单
					currentPage: 1,
					tempPage: 1,
					size: 10,
					total:10,
					ordersData:[], //订单列表数据
					checkVisible: false,  //服务验收弹窗
					currentOrderSn: '',  //当前操作的服务单号
					intervalId: 0,
				}
		},
		methods:{
			// 去服务详情
			goServiceDetailFn (item) {
				if (!item.order_bs_number) {return}
				if (item.orderBsCode === 'sbfw_gnsb_zzzc') {
					location.href = `${indexUrl}/sebe/pages/selfRegister.html#/one`;
				} else {
					location.href = indexUrl + '/store/service/'+ item.order_bs_number + '.htm';
				}
			},
			countDownE_cb(item){
        item.leftTime = 0;
        this.search();
			},
			// 服务验收
			checkOrderFn (item) {
				this.currentOrderSn = item.order_sn;  //服务单号
				this.checkVisible = true; //展示弹窗
			},
			// 确认验收
			handleClickServiceCheck (val) {
				this.checkVisible = false
				this.$http.post('./api/orderCheckAccept', {orderSn: this.currentOrderSn, isAcceptance: val}).then((res) => {
					this.$message({
						message: '操作成功!',
						type: 'success'
					});
					this.search()
				}).catch((err) => {
					if (err.response.status != 500) {
						this.$message({
							message: '操作成功!',
							type: 'success'
						});
					}
				})
			},
			toBeUpload(item){
				this.curItem = item;
				this.uploadVisible = true;
			},
			throughClick(state){//材料评审
				console.log(state.throughState)
				if(state.throughState==1){
					return;
				}
				if(state.throughState==2){
					this.throughVisible = true;
				}else if(state.throughState==3){
					this.confirmVisible = true;
				}
				this.feedbackData = {};
				this.feedbackLoading = true;
				this.$http.get('./api/findCxbMaterialReview?workOrderSn='+state.workOrderSn)
				.then((resp) => {
					this.feedbackLoading = false;
					this.feedbackData = resp.data;
				})
				.catch((err) => {
					this.feedbackLoading = false;
					console.log(err);
				});
			},
			getTmInfo(item){
				var regInfoList = item.regInfoList;
				if (!regInfoList) {return;}
				var str = item.trademarkName + '(';
				regInfoList.forEach((it, i) => {
					str += it + this.cateIdData[it-1]['goodsname'] + (i == regInfoList.length - 1 ? '' : '、')
				});
				return str + ')';
			},
			countDownE_cb(item){
				item.leftTime = 0;
				this.search();
			},
			//切换快捷订单筛选
			toggle(status){
				this.$router.push({path: 'serviceList', query: {waitstate: status, page: 1}});
			},
			//查询订单列表
			search(){
				var self = this;
				self.loading = true;
				self.noResult = false;
				self.errorResult = false;
				self.currentPage = (self.$route.query.page-0) || 1;
				self.confirmStatus = self.$route.query.waitstate || null;
				self.$http.get(findServceOrderListUrl, {params: {
					bsType: 1,  //商标服务
					orderServiceState: self.confirmStatus,
					page: self.currentPage,
					isHomePage: 2,  //服务列表
					size: self.size
				}})
				.then((response) => {
					var data = response.data;
					//if (data.code === '0') {
						self.loading = false;
						self.total = data.total_elements;
						self.ordersData = data.elements;
						if (!data.elements || !data.elements.length) {
							self.noResult = true;
							self.noDataTipHandle(self.confirmStatus);
						}
						// let timeRange = 7*24*60*60*1000;
						self.ordersData.forEach( (item) => {
							if (item.order_check_accept_time) {
								let leaveTime = item.order_check_accept_time - new Date().getTime();  //剩余验收时间，只有这个时间大于0的时候才需要传入倒计时组件
								if (leaveTime >= 0) {
									item.leaveTime = leaveTime;
								}
							}
						})
				})
				.catch((error) => {
					self.loading = false;
					self.errorResult = true;
					self.ordersData = [];
				});
				this.$emit('renderNoPay');
			},
			//翻页
			currentChange(currentPage){
				var route = this.$route;
				var path = route.path;
				this.page = currentPage;
				var newQuery = $.extend({}, route.query, {page: currentPage || 1});
				this.$router.push({path: path, query: newQuery});
			},
			//异常提示处理
			noDataTipHandle(status){
				var ret = '暂无订单数据'
				if (status == '0') {
					ret = '最近没有下过订单哦~';
				}else if(status == '1'){
					ret = '没有待确认订单~';
				}else if(status == '2'){
					ret = '没有已确认订单~';
				}
				this.noDataTip = ret;
			},
			refresh(){
				this.search();
			},
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
			}
		},
		mounted(){
			this.search();

			// this.confirmStatus = this.$route.query.waitstate || '0';
			// var channel_code = this.$cookie.get('channel_code');
			// this.cxbIsAllowed = channel_code === 'ali';
			// this.token = this.$cookie.get('user_token');

			// var firstLoad = this.$route.query.firstLoad;
			// if (this.cxbIsAllowed && firstLoad == '1') {
			// 	this.cxbVisible = true;
			// 	this.$router.replace({path: 'serviceList', query: { page: 1}});
			// }
			// if (location.host.indexOf('user') === 0) {
		 //  	this.cxbUrl = cxbUrlO;
		 //  }
		 //  this.list.forEach( (item) => {
		 //    item.name = item.name.replace(/([\u0391-\uFFE5]{19})([\u0391-\uFFE5]{1,})/g, '$1...');
		 //    console.log(item.name)
		 //    // item.len = item.name.replace(/[\u0391-\uFFE5]/g,"aa").length;
		 //    // if (item.len >= 40) {
		 //    //   item.hasMore = true;
		 //    // }
		 //    // else{
		 //    //   item.hasMore = false;
		 //    // }
		 //  })
		},
		watch: {
			// 如果路由有变化，会再次执行该方法
			$route(to, from) {
				this.search();
			}
		},
		filters: {
			dateFormat: Filters.formatDate.dateFormat,
			orderStatusformat: Filters.orderStatusformat,
			payStatusformat: Filters.payStatusformat,
			priceformat:Filters.priceformat,
			titleLengthFormat:Filters.titleLengthFormat,
			ellipsis: Filters.ellipsis,
			statusName:function(input) {
				var ret = ''
				switch (input+''){
					case '1':
						ret = "去确认";
						break;
					case '2':
						ret = "去付款";
						break;
				}
				return ret;
			},
			ApplyStatus:function(input) {
				var ret = ''
				switch (input+''){
					case 'null':
						ret = "--";
						break;
					case '1':
						ret = "待材料评审";
						break;
					case '2':
						ret = "评审不通过";
						break;
					case '3':
						ret = "已评审待确认";
						break;
					case '4':
						ret = "已确认待上报";
						break;
					case '5':
						ret = "已上报待审核";
						break;
					case '6':
						ret = "申报中";
						break;
					case '7':
						ret = "审核不通过";
						break;
					case '8':
						ret = "申报结束";
						break;
				}
				return ret;
			},
		}
	}
</script>
<style lang="scss">
	// 和我的订单列表页面共用样式
	.service_list{
		.orderListBtn{padding: 7px 0;width: 88px;}
		padding: 20px;
		.listHeadExplain {
			padding-left: 0;
			.name {width: 600px; display: inline-block; padding-left: 20px;}
			.info {width: 20%;  display: inline-block; text-align: center;}
			.action {
				width: 15%;  display: inline-block; text-align: center;
			}
		}
		.table_service {
			margin-bottom: 10px;
			td.name {
				padding-left: 20px; width: 600px !important;
				.img {
					width: 90px; height:90px; border: 1px solid #eee; overflow: hidden; cursor:pointer;
					img {width: 100%;}
				}
				.content {
					width: 130px; height: 90px; margin-left: 15px; float: left;
					.s_name {width:100%; max-height:40px; overflow: hidden; text-overflow:ellipsis; font-size: 13px; color: #333; cursor:pointer;}
					.label_blue {float: left; margin-top:5px;}
				}
				.detail {
					width: 290px; float: left; margin-left: 10px;
					.d_content {font-size: 13px; color: #333; float: left;}
					.money {font-size: 13px; color: #3DB1FA; text-align: left; margin-top: 5px; float: left;}
				}
			}
			td.info {
				width: 20%;
				.text {width: 100%; text-align: center; display: inline-block;}
				.time {color: #999; text-align: center; width: 100%; margin: 3px 0;}
			}
			td.action {
				width: 15%;
				.red {color: #f10;}
				.topay-btn{background-color: #3DB1FA;border-color:#3DB1FA;display:inline-block;margin:5px auto;width: auto;padding: 0 10px;}
        .topay-btn:hover{background-color: #3DB1FA;border-color:#3DB1FA;}
			}
		}
		/* 弹出对话框 当前页面公用 */
		.el-dialog{-ms-transform: translateX(-50%) !important;}
		.el-dialog .el-dialog__header{text-align: left;}
		.el-dialog .el-dialog__title{font-size: 14px;color: #223344;font-weight: normal;}
		.el-dialog .el-dialog__headerbtn{font-size: 12px;line-height: 12px;}
		.el-dialog .el-dialog__body{padding-top: 10px;padding-bottom: 20px;}
		.el-dialog .el-dialog__body a.button{display: inline-block;width: 88px;height: 30px;line-height: 30px;text-align: center;background-color: #479CFF;color: #fff;font-size: 14px;border:1px solid #479CFF;border-radius: 2px;cursor: pointer;}
		.el-dialog .el-dialog__body a.button:hover{text-decoration:none;background-color: #387CCC;border-color: #387CCC}
		.el-dialog .el-dialog__body a.no{color: #479CFF; background-color: #fff;margin-right: 10px;}
		.el-dialog .el-dialog__body a.no:hover{background-color: #fff;color: #387CCC;}
		.el-dialog .el-dialog__body a.yes{}

		.dialog-cxb{
			width:400px; height: 340px;
			.pop_window{text-align: center;}
		}
		.confirmD{
			// 弹框公用样式继承自common.css
			.el-dialog{
				width: 500px;transform: translate(-50%, -50%)!important;
				.el-dialog__body{padding:10px 20px 20px;}
				.confirm_data{border: 1px solid #dfe2e5;
					>div{padding: 10px;
						.tit{width:66px;font-size: 13px;color: #223344;}
						.txt{width:345px;font-size: 13px;color: #556677;}
					}
					.confirm_bottom{
						border-top: 1px solid #dfe2e5;
						.txt{word-wrap: break-word;}
					}
				}
				p{font-size: 13px;color: #A8AFB5;
					a{color:#479CFF;}
				}
			}
		}
		.confirmC{
			.el-dialog{width: 900px;transform: translate(-50%, -50%)!important;
				.el-dialog__body{padding:10px 20px 20px;}
				.confirm_through{min-height: 150px;max-height:536px;overflow: auto;
					.tit{background: #F5F5F5;border: 1px solid #DFE2E5;height:40px;overflow: hidden;box-sizing: border-box;
						>div{float: left;line-height: 40px;padding-left: 10px;}
					}
					.txt_lists{
						width: 100%;
						tr{border:1px solid #DFE2E5;border-top:0;
							td{padding:10px;font-size: 13px;color: #556677;box-sizing: border-box;}
						}
					}
					td{word-break: break-all;}
					.td01{
						width:115px;
						.tding{width:95px;}
					}
					.td02{
						width:100px;
						.tding{width:80px;}
					}
					.td03{
						width:120px;text-align: center;
						.tding{width:10px;}
						span{display:inline-block;word-wrap: break-word;width:115px;vertical-align: middle;}
						a{display:inline-block;vertical-align: middle;color: #3DB1FA;}
					}
					.td04{
						width:150px;
						.tding{width:130px;}
					}
					.td05{
						width:100px;text-align:center;
						.tding{width:80px;}
					}
					.td06{
						min-width:250px;
						.tding{min-width:230px;}
					}
				}
			}
		}
		.el-pager{ text-align: left;}
	}

</style>
