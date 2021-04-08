<template>
		<section class="user-home">
			<!-- 头部信息 -->
			<div class="head_wrap">
				<div class="head_img">
					<div class="portrait" @click="goInfoFn">
						<img v-if="!statisticData.member.avatar" src="../../assets/img/sebe.png" alt="">
						<img v-else :src="statisticData.member.avatar" alt="">
					</div>
					<!-- <p class="user_name">HI, <span v-if="statisticData.member.nickname">{{ statisticData.member.nickname }}</span> <span v-if="!statisticData.member.nickname">{{ statisticData.member.phone }}</span></p> -->
				</div>
				<div class="head_info">
					<div class="company_info">
						<span class="c_name" @click="goInfoFn">Hi,<span v-if="statisticData.member.nickname"> {{ statisticData.member.nickname | ellipsis(24) }}</span> <span v-if="!statisticData.member.nickname">{{ statisticData.member.phone }}</span></span>
						<img class="icon" src="~assets/img/index/icon_1.png" v-if="loginStatusObj.weixin"></img>
						<img class="icon" src="~assets/img/index/icon_2.png" v-if="loginStatusObj.taobao"></img>
						<img class="icon" src="~assets/img/index/icon_3.png" v-if="loginStatusObj.chuangxinbao"></img>
					</div>
					<p class="warm">{{ welcomeText }}</p>
					<div class="tm_info">
						<div class="tm_item" @click="goStewardFn">
							<p class="num">{{ vipData.depositeTotal || 0 }}</p>
							<p class="type_name">可托管商标数量</p>
						</div>
						<div class="tm_item" @click="goStewardFn">
							<p class="num">{{ vipData.trademarkNum || 0 }}</p>
							<p class="type_name">已托管商标数量</p>
						</div>
					</div>
				</div>

			</div>
			<!-- 各类型数据 -->
			<div class="order_wrap">
				<div class="item" v-for="item in orderTypeList" @click="goPageFn(item)">
					<span class="num">{{ item.num }}</span>
					<span class="type">{{ item.name }}</span>
				</div>
			</div>
			<!-- 我的服务 -->
			<div class="my_service">
				<div class="tit_box">
					<span class="name">我的服务</span>
					<span class="more" @click="goServicePageFn" v-if="myServiceList.length">查看更多</span>
				</div>
				<table class="s_table pub_table_base" v-loading="loading">
					<thead>
						<tr>
							<th class="first">服务</th>
							<th>进度</th>
							<th>操作</th>
						</tr>
					</thead>
					<tbody>
					 <!-- @click="goOrderDetailFn(item)" -->
						<tr class="line" v-for="(item, index) in myServiceList" v-if="myServiceList.length && index<=4" :class="{'line_active': item.orderInformation}">
							<td class="first">
								<div class="frist_box">
									<p class="t_name">{{ item.orderName }}</p>
									<p class="u_name" v-if="item.orderInformation">{{ item.orderInformation.trademarkName | ellipsis(30) }}</p>
								</div>
								<span class="label_base label_blue" v-if="item.orderInformation&&item.orderInformation.intCls">{{ item.orderInformation.intCls }}-{{ cateIdData[item.orderInformation.intCls-1].goodsname }}</span>
							</td>
							<td v-if="item.order_state==1 || item.order_state==-1"><span v-if="item.order_feedback_state">{{ item.order_feedback_state }}</span> <span v-if="item.orderServiceState && !item.order_feedback_state">{{ item.orderServiceState }}</span><span class="time">{{ item.feedback_time | dateFormat }}</span></td>
							<td v-if="item.order_state==0">待支付</td>
							<td class="item_link" >
								<router-link :to="'serviceList/'+item.order_sn" v-if="item.stage>=4 && item.haveDetail==1 && item.order_state==1">查看详情</router-link>
								<router-link :to="'orders/'+item.order_sn+'?key=orderSn'" v-if="item.order_state==0">立即支付</router-link>
							</td>
						</tr>
						<tr v-if="!myServiceList.length && !loading">
							<td colspan="3" class="null">
								<div class="noResult" >
									<img src="~assets/img/listNull.png">
									<p class="tip">暂无服务信息</p>
									<a :href="CONFIG.indexUrl" target="_blank"><el-button size="mini" >去首页逛逛</el-button></a>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<!-- 我的工具 -->
			<div class="my_service">
				<div class="tit_box">
					<span class="name">我的工具</span>
				</div>
				<div class="tool_box">
					<div class="item" v-for="(item, index) in toolList">
						<a :href="item.url" target="_black">
							<img src="~assets/img/index/tool_1.png" v-if="item.type==1" class="icon" alt="" />
							<img src="~assets/img/index/tool_2.png" v-if="item.type==2" class="icon" alt="" />
							<img src="~assets/img/index/tool_3.png" v-if="item.type==3" class="icon" alt="" />
							<img src="~assets/img/index/tool_4.png" v-if="item.type==4" class="icon" alt="" />
							<img src="~assets/img/index/tool_5.png" v-if="item.type==5" class="icon" alt="" />
							<img src="~assets/img/index/tool_2.png" v-if="item.type==6" class="icon" alt="" />
							<img src="~assets/img/index/tool_3.png" v-if="item.type==7" class="icon" alt="" />
							<p class="name">{{ item.name }}</p>
							<p class="info">使用工具</p>
						</a>
					</div>
				</div>
			</div>

		</section>
</template>

<script>
	import Vue from 'vue';
	import intClsData from '../../common/js/intClsData.js';
	import Filters from '../../api/filters';
	const rootUrl = CONFIG.rootUrl;
	const statisticsUrl = './api/sebeStatistics';
	const vipGradeUrl = './api/findVip';
	const orderStatisticsUrl = rootUrl + '/api/orderStatistics';  //首页统计接口
	const findServceOrderListUrl = rootUrl + '/api/findServceOrderList';  //查询服务列表
	const findLoginNumberUrl = rootUrl + '/api/findLoginNumber';  //查询三个绑定

	const toolList = [
		{name: '商标查询', type: 1, url: ''},
		// {name: '专利查询', type: 2, url: ''},  //暂时先隐藏
		// {name: '国内商标自助注册', type: 3, url: ''},
		{name: '商标管家', type: 4, url: ''},
		{name: '尼斯查询', type: 5, url: ''},
		{name: '商标起名', type: 6, url: ''},
		{name: '商标打分', type: 7, url: ''},
	];
	let curentHost = '';  //环境
	if (location.host.indexOf('localhost')===0) {
		curentHost = 'test';
	}
	else if (location.host.indexOf('test')===0) {
		curentHost = 'test';
	}
	else if (location.host.indexOf('pre')===0) {
		curentHost = 'pre';
	}
	else {
		curentHost = '';
	}
	toolList.forEach( (item) => {
		switch (item.type) {
			case 1: item.url = `https://${curentHost}tools.ipsebe.com/tools/pages/search.html`; break;  //商标查询
			case 2: item.url = `https://${curentHost}ps.ipsebe.com/#/search`; break;  //专利查询
			case 3: item.url = `https://${curentHost}www.ipsebe.com/sebe/pages/selfRegister.html#/one?ids=&keyword=`; break;  //国内商标自助注册
			case 4: item.url = (location.host.indexOf('localhost')===0) ? 'http://localhost:8082/#/steward/myCompany?type=1' : `https://${curentHost}user.ipsebe.com/iprp/#/steward/myCompany?type=1`; break;  //商标管家
			case 5: item.url = `https://${curentHost}www.ipsebe.com//sebe/pages/productClassify.html#/query`; break;   //尼斯查询
			case 6: item.url = `https://${curentHost}tools.ipsebe.com/tools/pages/oneTouchName.html`; break;  //商标起名
			case 7: item.url = `https://${curentHost}tools.ipsebe.com/tools/pages/score.html`; break;  //商标打分
		}
	})

	export default {
		props:["statisticData"],
		data(){
			return{
				CONFIG: CONFIG,
				welcomeText: '',
				activeIndex: '',  //当前点击的服务单
				cxbIsAllowed: false,
				vipData:'',
				loading:false,  //加载条
				// 订单类型列表
				orderTypeList: [
					{name: '待付款', num:0, typeKey:'unpaid', path: 'orders?status=0&page=1'},
					{name: '待服务', num:0, typeKey: 'serviceState_1', path: 'serviceList?waitstate=1&page=1'},
					{name: '服务中', num:0, typeKey:'serviceState_2', path: 'serviceList?waitstate=2&page=1'},
					// {name: '服务完成', num:0, typeKey:'serviceState_3', path: 'serviceList?waitstate=3&page=1'},
					{name: '已关闭', num:0, typeKey:'serviceState_4', path: 'serviceList?waitstate=4&page=1'},
					{name: '已退款', num:0, typeKey:'refunded', path: 'refundList'},
				],
				toolList: toolList,  //我的工具列表
				statisticsData: {
					cz:{},
					report:{},
					trademark:{}
				},
				stewardData: {
					mySubject: {
						stewardSubject: 0,
						depositeNumber: 0
					},
					otherSubject: {}
				},
				myServiceList: [],  //我的服务列表
				cateIdData: intClsData.cateIdData,  //所有商标分类
				loginStatusObj: {},  //3个绑定数据
			}
		},
		methods:{
			// 去账户信息
			goInfoFn () {
				this.$router.push({path: 'basicData'});
			},
			// 跳转到商标管家
			goStewardFn () {
				this.$router.push({path: 'steward/myCompany?type=1'})
			},
			// 跳转到具体页面
			goPageFn (item) {
				// this.$store.commit('UPDATE_MENU_INDEX', index+':0');   //vuex控制高亮
				this.$router.push({path: item.path});
			},
			// 我的服务查看更多
			goServicePageFn () {
				this.$router.push({name: 'serviceList'});
			},
			// 订单管理
			goOrderPageFn (type) {
				this.$router.push({path: `orders?status=${type}&page=1`});
			},
			getVipGrade(){
				var self = this;
				this.$http.get(vipGradeUrl)
				.then(function(response) {
					var data = response.data;
					self.vipData = data.data;
				})
				.catch(function(error) {
				});
			},
			// 查询首页订单统计
			getStatisticsData(){
				var self = this;
				this.$http.get(orderStatisticsUrl)
				.then(function(response) {
					var data = response.data;
					function getBigThanZero (list, obj, key){
						var temp = '';
						for (var i = 0; i < list.length; i++) {
							let item = list[i];
							if (obj[key][item] > 0) {
								temp = item;
								break;
							}
						}
						return temp;
					}
					self.orderTypeList.forEach( (item) => {
						item.num = data[item.typeKey];
						if (data[item.typeKey+'_map']) {
							let type_ = getBigThanZero(Object.keys(data[item.typeKey+'_map']).sort((a, b) => {
								return a.split('_')[0]-b.split('_')[0]
							}), data, item.typeKey+'_map')
							let status_ = '';
							if (item.typeKey == 'serviceState_1') {   //待服务
								status_ = 1;
							}
							else if (item.typeKey == 'serviceState_2') {  //服务中
								status_ = 2;
							}
							else if (item.typeKey == 'serviceState_3') {  //服务完成
								status_ = 3;
							}
							else if (item.typeKey == 'serviceState_4') {  //服务关闭
								status_ = 4;
							}
							if (type_ == '1_codeId') {
								item.path = 'serviceList?page=1&waitstate=' + status_;  //商标服务
							}
							else if (type_ == '5_codeId') {
								item.path = 'otherService/5?page=1&waitstate=' + status_;  //专利服务
							}
							else if (type_ == '10_codeId') {
								item.path = 'otherService/10?page=1&waitstate=' + status_;  //版权服务
							}
							else if (type_ == '17_codeId') {
								item.path = 'myczlist?page=1&waitstate=' + status_;  //存证服务
							}
							else if (type_ == '20_codeId') {
								item.path = 'otherService/20?page=1&waitstate=' + status_;  //维权服务
							}
						}

					})
				})
				.catch(function(error) {
					self.loading = false;
				});
			},
			// 查询我的服务列表
			getMyServiceListFn () {
				this.loading = true;
				this.$http.get(findServceOrderListUrl, {params: {orderServiceState: ''}})
				.then( (resp) => {
					let data = resp.data.elements;
					this.myServiceList = data;
					this.loading = false;
				})
			},
			// 根据时间判断欢迎用语
			getWelcomeTextFn () {
				let hour = parseInt(new Date().getHours()) + 1;
				if (hour>5 && hour<=8) {
					this.welcomeText = '早上好，每天给自己一个希望，只为明天更美好！';
				}
				else if (hour>8 && hour<=11){
					this.welcomeText = '上午好，努力让自己更出色，从能力到容貌！';
				}
				else if (hour>11 && hour<=13){
					this.welcomeText = '中午好，任何值得去的地方，都没有捷径！';
				}
				else if (hour>13 && hour<=17){
					this.welcomeText = '下午好，决定明天的不是明天，而是今天对事业的作为！';
				}
				else if (hour>17 && hour<=22){
					this.welcomeText = '晚上好，一天工作辛苦了！';
				}
				else if (hour>22 && hour<=5){
					this.welcomeText = '一天工作辛苦了，好好休息！';
				}
			},
			// 查询3个绑定
			getLoginNumberFn () {
				this.$http.get(findLoginNumberUrl)
				.then( (resp) => {
					this.loginStatusObj = resp.data;
				})
			}
		},
		mounted(){
			this.getLoginNumberFn();  //查询三个绑定
			this.getStatisticsData();  //查询首页订单统计
			this.getMyServiceListFn();  //查询我的服务列表
			this.getWelcomeTextFn();  //根据时间判断欢迎用语
			this.getVipGrade();   //查询托管数量
			var channel_code = this.$cookie.get('channel_code');
    	this.cxbIsAllowed = channel_code === 'ali';
		},
		filters: {
			dateFormat: Filters.formatDate.dateFormat,
			ellipsis: Filters.ellipsis
		},
	}

</script>

<style lang="scss">
	.user-home{
		width:100%;background-color: #f5f5f5; font-family: 'PingFangSC'; min-height: 800px;
		.pub_table_base {
			.first {text-align: left; padding-left: 20px;}
		}
		.head_wrap{
			height: 170px; background-color: #FFF;font-size:14px; box-shadow:0px 1px 4px 0px rgba(221,221,221,0.5);
			.head_img {
				width: 170px; height: 100%; text-align: center; float: left; border-right: 1px dashed #E6E6E6;
				.portrait{
					width: 100px; cursor: pointer; height: 100px;border-radius: 50%;overflow: hidden; margin: 35px auto 10px auto; margin-bottom: 10px; border: 1px solid #eee; position: relative;
					img {height:100%; position: absolute; left: 50%; transform: translateX(-50%);}
				}
				.user_name {font-size: 14px; color: #333; text-align: center;}
			}
			.head_info {
				padding-left: 30px; padding-top: 30px; float: left; width: calc(100% - 189px);
				.company_info {
					float: left; width: 100%;
					.c_name {
						font-size: 16px; color: #333; float: left; margin-right: 20px; cursor: pointer;
						&:hover {color: #3DB1FA;}
					}
					.icon {width: 24px; height: 24px; overflow: hidden;float: left; margin-right: 5px;}
				}
				.warm {float: left; width: 100%; font-size: 14px; color: #999; margin-top: 5px;}
				.tm_info {
					float: left; margin-top: 16px; font-family: 'PingFangSC';
					.tm_item {
						height: 50px; float: left; text-align: center; cursor: pointer;
						&:first-child {padding-right: 40px; border-right: 1px solid #eee;}
						&:last-child {padding-left: 40px;}
						.num {font-size: 20px; color: #333; width: 100%; text-align: center;}
						.type_name {width: 100%; text-align: center; color: #666; font-size: 13px; margin-top: 4px;}
						&:hover {
							p {color: #3DB1FA; }
						}
					}
				}
			}
		}
		.order_wrap {
			width: 100%; height: 60px; background: #fff; margin-top: 10px; padding: 0 5px; box-sizing:border-box; box-shadow:0px 1px 4px 0px rgba(221,221,221,0.5);
			.item {
				width: 190px; height: 60px; line-height: 60px; float: left; text-align: center; cursor: pointer;
				.num {color: #3DB1FA; font-size: 20px; vertical-align: middle;}
				.type {color: #333; font-size: 14px; margin-left: 10px; vertical-align: middle;}
			}
		}
		.my_service {
			width: 100%; height: auto; background: #fff; box-sizing:border-box; padding: 20px; margin-top: 10px; box-shadow:0px 1px 4px 0px rgba(221,221,221,0.5);
			.tit_box {
				width: 100%; height: 22px; overflow: hidden;
				.name {font-size: 16px; color: #333; float: left;}
				.more {
					font-size: 14px; color: #999; float: right; cursor: pointer;
					&:hover {color: #3DB1FA;}
				}
			}
			.s_table {
				width: 100%; height: auto; margin-top: 20px;
				.al_lef {text-align: left;}
				.al_cen {text-align: center;}
				.line {
					cursor: auto;
					td, th {
						height: 40px; line-height: 40px; color: #333; font-size: 13px; text-align: center;
						.time {color: #999; margin-left: 10px;}
					}
					.first {
						padding: 0 0 0 20px; text-align: left;
						.frist_box {
							max-width:300px; line-height: 20px;
							.t_name {color: #333; width:100%; padding: 5px 0;}
							.u_name {display: none;}
						}
						.label_blue {display: none;}
					}
					.item_link {
						cursor: pointer;
						&:hover {color: #3DB1FA;}
					}
				}
				.line_active {
					background: #F8F8F8; height: 66px; line-height: 66px;
					.first {
						width: 300px;
						.frist_box {
							width: 110px; min-height: 66px; float: left; padding-top: 10px;
							.t_name {color: #999; width: 100%; float: left; line-height: 1.5; overflow: hidden; text-overflow:ellipsis; white-space: nowrap; }
							.u_name {display: block; width:100%; float: left; line-height: 1.5; margin-top: 5px; margin-bottom: 10px;}
						}
						.label_blue {display: inline-block; float: left; margin-left: 20px; margin-top: 20px; text-align: center; font-size: 12px;}
					}
				}
				.null {
					&:hover {background: #fff; }
				}
				.noResult {
					padding: 50px 0;
					img {height: 72px;}
					.tip {font-size: 12px; line-height: 12px; color: #999;}
				}
			}
			.tool_box {
				width: 100%; height: auto; margin-top: 20px; overflow: hidden;
				.item {
					float: left; width: 110px; height: auto; text-align: center; cursor: pointer;
					.icon {width: 50px; height: 50px; display: inline-block;}
					.name {
						font-size: 12px; color: #333; margin-top: 8px;
						&:hover {color: #3DB1FA;}
					}
					.info {font-size: 12px; color: #999; margin-top: 8px;}
					&:first-child {width:100px; text-align: left; padding-left:20px;}
				}
				a:hover {text-decoration: none;}
			}
		}
}
</style>
