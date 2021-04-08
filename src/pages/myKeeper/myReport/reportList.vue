<template>
	<div class="myOrders">
		<h4>我的报告</h4>
		<div class="orderStatus">
			<ul>
				<li :class="{active: orderState === '0'}" @click="toggle('0')">全部</li>
				<li :class="{active: orderState === '4'}" @click="toggle('4')">已报告</li>
				<li :class="{active: orderState === '23'}" @click="toggle('23')">报告中</li>
				<li :class="{active: orderState === '1'}" @click="toggle('1')">未报告</li>
			</ul>
		</div>
		<div class="orderLists">
			<div v-loading="loading" style="min-height: 300px">
				<ul class="report_list clearfix"  v-if="!noResult || !errorResult">
					<li v-for="(item, index) in ordersData">
							<i :class="{com:item.state==1,ongo:item.state==2,on_go:item.state==3,unfin:item.state==4}">
								<p>{{item.state|imgname}}</p>
								<span class="img-type"></span>
							</i>
							<img width="260px" height="170px" v-if="item.type==3" src="~assets/img/report/com.jpg" alt="">
							<img width="260px" height="170px" v-if="item.type==1" src="~assets/img/report/ongo.jpg" alt="">
							<img width="260px" height="170px" v-if="item.type==2" src="~assets/img/report/unfin.jpg" alt="">
							<p class="tit">{{item.reportName}}</p>
							<p class="txt">服务单号：{{item.orderSn}}</p>
							<p class="txt">购买时间：{{item.buyTime|dateFormat}}</p>
							<a v-if="item.state==4&&item.url" :href="userUrl+'/api/downFile?access_token='+token+'&url='+item.url" target="_blank" >下载</a>
							<a v-if="item.state==4&&!item.url" class="btn-later" href="javascript:;">下载</a>
							<router-link class="btn-sqbg" v-else-if="item.state==1" :to="'myReport/'+item.id+'?status='+orderState" >申请报告</router-link>
							<a class="btn-sqbg" v-else-if="item.state==2" href="javascript:;" @click="waiting(item)">请等待</a>
							<a class="btn-later" v-else-if="item.state==3" href="javascript:;" @click="waiting(item)">报告中</a>
					</li>
				</ul>
				<div v-if="noResult" class="noResult">
					<img src="~assets/img/order/noorder_bg.png">
					<p>{{noDataTip}}</p>
				</div>
				<div v-if="errorResult" class="noResult">
					<img src="~assets/img/order/noorder_bg.png">
					<p>系统繁忙，<br>请点击<a href="" @click.prevent="refresh">刷新</a>或稍后再试。</p>
				</div>
			</div>
			
			<div class="pagination-wrap" v-if="ordersData.length">
				<el-pagination layout="total, prev, pager, next" :total="total" :page-size="size" :current-page.sync="page" class="sebe-pagination" @current-change="currentChange"></el-pagination>
			</div>
		</div>
		<!-- 未报告中（状态2） -->
		<el-dialog title="报告提示" v-model="warningcancel" custom-class="dialog-renewal warning">
				<div class="pop_window" >
					<div class="renewal_detail">
							<p class="renewal-time">1、申请报告后，报告专员将尽快与您联系，并与您核实报告的具体信息。</p>
							<p class="renewal-number">2、取消报告后，可重新申请报告。</p>
							<p class="renewal-number">3、如有疑问，请致电官方热线：4000-315-426。</p>
						<a class="renewal-pay btn-move" @click="cancelclick()">取消报告</a>
						<a class="renewal-pay" @click="warningcancel=false">确认</a>
					</div>
				</div>
		</el-dialog>
		<!-- 未报告（状态3） -->
		<el-dialog title="报告提示" v-model="warning" custom-class="dialog-renewal">
				<div class="pop_window" >
					<div class="renewal_detail">
							<p class="renewal-time">1、报告专员正在加紧处理您的报告申请，请耐心等待。</p>
							<p class="renewal-number">2、如有疑问，请致电官方热线：4000-315-426。</p>
						<a class="renewal-pay btn-renewal btn-warning" @click="warning=false">确认</a>
					</div>
				</div>
		</el-dialog>
	</div>
</template>
<script>
	import Vue from 'vue'
	import $ from 'jquery'
	const indexUrl = CONFIG.indexUrl;
	const userUrl = CONFIG.userUrl;
	import Util from 'src/common/js/util.js'
	import Filters from 'api/filters.js'
	import qs from 'qs'

	export default {
		data(){
				return{
					token:'',
					userUrl:userUrl,
					warning:false,//状态3
					currentid:'',
					warningcancel:false,//状态2
					noDataTip: '',
					noResult: false,//无查询结果时显示
					errorResult: false,
					loading: false, //加载提示
					indexUrl: indexUrl, //网站首页根域名
					orderState: '0',//订单状态，默认0查询全部订单
					page: 1,
					tempPage: 1,
					size: 6,
					total:10,
					status:'0',
					ordersData:[] //订单列表数据
				}
		},
		methods:{
			//待报告
			waiting(item){
					this.currentid = item.id;
					if(item.state==2){
						//取消报告
						this.warningcancel = true;
					}else if (item.state==3) {
						//提示弹框
						this.warning = true;
					}
			},

			//刷新页面数据
			nowsearch(){
				var self = this;
				self.noResult = false;
				self.errorResult = false;
				self.orderState = self.$route.query.status || '0';//报告状态，默认值
				var tempPage = (self.$route.query.page-0) || 1;
				self.$http.post('./api/findAllReport', qs.stringify({
					page: tempPage,
					size: self.size,
					state: self.orderState
				}))
				.then((response) => {
					var data = response.data;
					if (data) {
						self.total = data.total;
						self.page = data.page + 1;
						self.ordersData = data.data;
						if (!data.data || !data.data.length) {
							self.noResult = true;
							self.noDataTipHandle(self.orderState);
						}
					}
				})
				.catch((error) => {
					self.errorResult = true;
					self.ordersData = [];
					var data = error.response.data;
				});
				this.$emit('renderNoPay');
			},

			//取消申请
			cancelclick(){
					var self = this;
					this.$http.post('./api/removeapply', qs.stringify({
						id:self.currentid
					}))
					.then((response) => {
						if(response.data.state==1){
							self.warningcancel = false;
							this.$message({
								title: '成功',
								message: '报告已取消',
								type: 'success'
							});
							self.nowsearch();
						}
					})
					.catch((error) => {
						self.warningcancel = false;
						this.$message({
								title: '申请失败',
								message: '网络繁忙，请稍后再试',
								type: 'warning'
						});
					});
			},

			//切换快捷订单筛选
			toggle(status){
				this.$router.push({path: 'myReport', query: {status: status, page: 1}});
			},

			//查询订单列表
			search(){
				var self = this;
				self.loading = true;
				self.noResult = false;
				self.errorResult = false;
				self.orderState = self.$route.query.status || '0';//报告种类，默认值
				var tempPage = (self.$route.query.page-0) || 1;
				self.$http.post('./api/findAllReport', qs.stringify({
					page: tempPage,
					size: self.size,
					state: self.orderState
				}))
				.then((response) => {
					self.loading = false;
					var data = response.data;
					if (data) {
						self.total = data.total;
						self.page = data.page + 1;
						self.ordersData = data.data;
						if (!data.data || !data.data.length) {
							self.noResult = true;
							self.noDataTipHandle(self.orderState);
						}
					}
				})
				.catch((error) => {
					self.loading = false;
					self.errorResult = true;
					self.ordersData = [];
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
				var ret = '暂无报告数据'
				this.noDataTip = ret;
			},

			//刷新
			refresh(){
				this.search();
			}
		},
		mounted(){
			this.search();
			this.token = this.$cookie.get("user_token");
		},
		watch: {
			// 如果路由有变化，会再次执行该方法
			'$route': 'search'
		},
		filters: {
			dateFormat: Filters.formatDate.dateFormat,
			 //我的报告状态显示
			imgname (val) {
				var name = ''
					switch (val+''){
						case '1':
							name = "未报告";
							break;
						case '2':
							name = "报告中";
							break;
						case '3':
							name = "报告中";
							break;
						case '4':
							name = "已报告";
							break;
					}
					return name;
			}
		}
	}
</script>

<style scoped lang="scss">
.myOrders{
	font-size: 13px;
	padding: 15px 0 20px;
	h4{height: 26px;line-height: 26px;font-weight: normal;font-size: 16px;padding-left: 20px;}
	.orderStatus{
		padding-left:20px;
		margin-left: -15px;
		font-size: 14px;
		ul{
			box-sizing: content-box;
			height: 39px;
			border-bottom: 1px solid #e6e6e6;
			li{
				box-sizing: content-box;
				padding: 0 15px;
				float:left;height: 38px; line-height: 38px;color: #666;cursor: pointer;
			}
			li.active{
				border-bottom: 2px solid #3db1fa;
				color: #3db1fa;
			}
		}
	}
	.orderLists{
		min-height: 500px;
		.clearfix:after{
				display:block;
				content:'';
				clear:both;
		}
		.report_list{
			li{float: left;width: 289px;height: 345px;border:1px solid #e6e6e6;margin-left:20px;margin-top:20px;text-align:center;padding-top:16px;font-size:0;position: relative;
				i{
					width:75px;height:37px;display:block;position: absolute;top:26px;left:9px;opacity: 0.9;
					p{color:#fff;font-size:14px;line-height:37px;font-style:normal;}
					.img-type{position: absolute;top:34px;left:1px;transform:rotate(135deg);width:0px;height:0px;overflow:auto;
					}
				}
				.com{
					background-color:#f1331a;
					.img-type{border-top:8px solid rgba(255,255,255,0);border-right:8px solid #f1331a;}
				}
				.ongo{
					background-color:#666;
					.img-type{border-top:8px solid rgba(255,255,255,0);border-right:8px solid #666;}
				}
				.on_go{
					background-color:#666;
					.img-type{border-top:8px solid rgba(255,255,255,0);border-right:8px solid #666;}
				}
				.unfin{
					background-color:#3db1fa;
					.img-type{border-top:8px solid rgba(255,255,255,0);border-right:8px solid #3db1fa;}
				}
				p{text-align:left;padding:0 14px;}
				.img-type{position: absolute;top: 25px;left: 9px;}
				.tit{font-size: 17px;color: #333;line-height: 17px;margin-top:16px;}
				.txt{font-size: 13px;color: #666;margin-top:15px;line-height: 13px;}
				a{width: 90px;height: 35px;display: block;background-color: #3db1fa;color: #fff;font-size: 14px;text-align: center;line-height: 35px;border-radius: 2px;float: right;margin-right: 14px;margin-top: 21px;text-decoration: none;}
				.btn-later{background-color:#ccc;color:#eee;}
				.btn-sqbg{background-color:#ee3627;}
			}
		}
		.noResult{
			padding:100px 0;
			img{margin-left:210px;float:left;}
			a{color: #3db1fa;}
			p{float:left;font-size:24px; color: #666;width: 310px;margin-left:90px;line-height: 40px;padding:15px 0;}
			.shopping{float:left;width: 120px;margin-left:90px;margin-top:5px;height: 40px;line-height: 38px;background-color: #f64744;font-size:18px;border-radius: 5px;color: #fff;text-align: center;}
			.shopping:hover{text-decoration:none;}
		}
		.pagination-wrap{
			text-align: center;
			padding: 30px 0;
		}
	}
}
</style>
<style lang="scss">
	.dialog-renewal{
		.btn-warning{
			margin-left:93px;
		}
	}
	.renewal_detail{
			a{
				margin-top:12px;
			}
		}
</style>