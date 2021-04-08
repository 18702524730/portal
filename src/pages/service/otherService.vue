<template>
  <div class="listCommonality __myService">
  	<h4 class="navTitle">{{serviceName}}</h4>
    <template >
    	<div class="listHeaderTab">
	      <ul>
	        <li :class="{active: confirmStatus === ''}" @click="toggle(null)">全部服务</li>
	        <li :class="{active: confirmStatus === '1'}" @click="toggle('1')">待服务</li>
	        <li :class="{active: confirmStatus === '2'}" @click="toggle('2')">服务中</li>
	        <li :class="{active: confirmStatus === '3'}" @click="toggle('3')">服务完成</li>
	        <li :class="{active: confirmStatus === '4'}" @click="toggle('4')">服务关闭</li>
	      </ul>
	    </div>
	    <div class="listHeadExplain other_service">
	    	<span class="name">服务</span>
	    	<span class="info">状态</span>
	    	<span class="action">操作</span>
	    </div>
	    <div class="listHead" v-loading="loading">
	      <div class="mt-20">
	      	<table class="table table-bordered table_service" v-for="item in ordersData" :key="item.order_sn" v-if="!loading && (!noResult || !errorResult)" >
	          <thead>
	            <tr>
	              <th colspan="4">
	                <div class="title">
	                  <span>服务单号：{{item.order_sn}}</span>
	                  <span>订单号：{{item.order_fictitious_sn}}</span>
										<a :href="`${indexUrl}/store/${item.order_store_code}.htm`" class="shop_name">{{item.order_store_name | ellipsis(30)}}</a>
	                  <!-- <span class="shop_name"></span> -->
                    <!-- <a target="_blank" class="link_seller" href="http://wpa.qq.com/msgrd?v=3&uin=271652610&site=qq&menu=yes">联系商家</a> -->
										<contactQQ :type="item.order_distribute_from" :qqCode="item.order_store_code" :qqOrder="item.order_bs_number"></contactQQ>
										<!-- <a v-if="item.order_distribute_from == 1" key="sell" href="http://pct.zoosnet.net/LR/Chatpre.aspx?id=PCT70172520&lng=cn&p=http%3a%2f%2fwww.ipsebe.com" class="link_seller" target="_blank">联系商家</a>

										<a v-else target="_blank" key="sell" class="link_seller" href="http://wpa.qq.com/msgrd?v=3&uin=271652610&site=qq&menu=yes">联系商家</a> -->

	                </div>
	              </th>
	            </tr>
	          </thead>
	          <tbody>
	            <tr>
	              <td class="name">
	              	<div class="fl img">
	                  <img :src="item.orderBsImage"  :onerror="imgLoadError">
	                </div>
	                <div class="content">
	                	<p class="s_name"><a :href="item.orderBussinessType == 4 ? `${trademarkUrl}/trademark/${item.order_bs_number}.htm` : `${indexUrl}/store/service/${item.order_bs_number}.htm`">{{item.orderName | ellipsis(75)}}</a></p>
	                </div>
	              </td>
	              <td class="info" valign="top">
	                <p class="text">{{item.orderServiceState | serviceState}}</p>
	                <p class="time">{{item.create_time | dateFormat}}</p>
	              </td>
	              <td class="actions" valign="top" align="center">
	                <!-- <el-button type="primary" size="small" v-if="item.order_check_accept == 1">服务验收</el-button> -->
	                <el-button type="primary" class="orderListBtn" v-if="item.order_check_accept == 1" @click="openDialog(item.order_sn)" size="small">服务验收</el-button>
									<span class="countdown-wrap countdown_list" v-if="item.order_check_accept === 1 && item.order_check_accept_time">
										<count-down class="countdown" @end_callback="countDownE_cb(item)" :iconState="false" :leftTime="(item.order_check_accept_time - new Date().getTime())" :dayTxt="'天'" :hourTxt="'时'" :minutesTxt="'分'" :secondsTxt="'秒'"></count-down>后自动确认验收
									</span>
									<!-- order_check_accept -->
									<p class="accept" v-if="item.order_check_accept == 2">服务已验收</p>
									<p class="refuse" v-if="item.order_check_accept == 3">验收拒绝</p>
	              </td>
	            </tr>
	          </tbody>
	        </table>
        	<noResult v-if="noResult || errorResult"></noResult>

	        <!-- <div v-loading="loading" v-if="loading" style="min-height: 200px;"></div> -->
	        <!-- <div v-if="noResult" class="noResult">
	          <img src="~assets/img/order/noorder_bg.png">
	          <p>{{noDataTip}}</p>
	          <a class="btn shopping" :href="indexUrl">去首页>></a>
	        </div>
	        <div v-if="errorResult" class="noResult">
	          <img src="~assets/img/order/noorder_bg.png">
	          <p>系统繁忙，<br>请点击<a href="" @click.prevent="refresh">刷新</a>或稍后再试。</p>
	        </div> -->
	      </div>

	      <div class="pagination-wrap" v-if="ordersData.length && !loading">
					<el-pagination
						@current-change="currentChange"
						:current-page.sync="page"
						:page-size="5"
						layout="total, prev, pager, next, jumper"
						:total="total"
						background>
					</el-pagination>

	      </div>
	    </div>
			<el-dialog title="服务验收" :visible.sync="dialogVisible" width="400px">
				  <span>确认服务验收后，交易款项将打至商家账户，是否确认验收？</span>
					<span slot="footer" class="dialog-footer">
						<el-button @click="handleClickServiceCheck(0)" class="orderListBtn" size="small">拒接验收</el-button>
						<el-button type="primary" @click="handleClickServiceCheck(1)" class="orderListBtn"  size="small">确认验收</el-button>
					</span>
			</el-dialog>
    </template>
  </div>
</template>
<script>
  import $ from 'jquery'
  const rootUrl = CONFIG.rootUrl;
  const indexUrl = CONFIG.indexUrl;
	const cartUrl = CONFIG.cartUrl;
	const trademarkUrl = CONFIG.trademarkUrl;
	import contactQQ from 'components/contactQQ.vue'
  import Filters from 'api/filters.js'
  import qs from 'qs'
	import CountDown from 'components/countdown.vue'
	import noResult from 'components/noResult/noResult.vue'
	import * as serviceDatas from '../myOrders/orderList.js'
  const cxbUrl = 'http://123.56.191.155:8080/cxb/index.html'
	const cxbUrlO = '//ipr.taobao.com'
	// const serviceName = ['', '专利服务', '企业服务', '维权诉讼', '政府项目', '版权服务', '商标交易'];
	const serviceName = {
		patentService: '专利服务', // 5
		companyService: '企业服务', // 39
		safeguardingRights: '维权诉讼', // 20 
		govService: '政府项目', // 26
		copyrightService: '版权服务', // 10
		trademarkService: '商标交易' // 38
	}
  export default {
    components: {
      CountDown, noResult, contactQQ
    },
    data(){
        return{
        	token: '',
					rootUrl: rootUrl,
					imgLoadError: 'this.src="' + require('../../assets/img/imgLoadError.png') + '"',
					dialogVisible: false,
					cxbUrl: cxbUrl,
					trademarkUrl: trademarkUrl,
					serviceType: '5',
					serviceName: '专利服务',
					type: '',
					bsType: '5',
          noDataTip: '',
          noResult: false,//无查询结果时显示
          errorResult: false,
          loading: false, //加载提示
          indexUrl: indexUrl, //网站首页根域名
					cartUrl: cartUrl,
          confirmStatus: '',//订单状态，默认0查询全部订单
          page: 1,
          tempPage: 1,
          size: 5,
					total:10,
					currentOrderSn: '', // 验收时选中服务单号
          ordersData:[] //订单列表数据
        }
    },
    methods:{
			openNewWin() {
				// window.open("http://www.cnblogs.com/liumengdie/"，“_blank”);   
				let height = document.documentElement.clientHeight;
				let width = document.documentElement.clientWidth;
				console.log(height, width, 'width=600,height=500,left='+ (width - 600) +'px,top=' + (height - 550) + 'px')
				window.open(
					'https://pct.zoosnet.net/LR/Chatpre.aspx?id=PCT70172520&lng=cn&p=http%3a%2f%2fwww.ipsebe.com','',
				// 'width=600,height=500,left='+ (width - 600) +'px,top=' + (height - 550) + 'px,toolbar=no,status=no,menubar=no,resizable=yes,scrollbars=yes');
				'width=600,height=500,left='+ (width - 600) +'px,top=' + (height - 550) + 'px');
				return false;
			},
			openDialog (id) {
				this.dialogVisible = true
				this.currentOrderSn = id
			},
			//切换快捷订单筛选
      toggle(status){
        this.$router.push({path: '/otherService/' + this.serviceType, query: {waitstate: status, page: 1}});
			},
			countDownE_cb(item){
				item.leftTime = 0;
        // this.search();
			},
			handleClickServiceCheck (val) {
				this.dialogVisible = false
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
      //查询订单列表
      search (changeType) {
        this.loading = true;
        this.noResult = false;
        this.errorResult = false;
				this.$http.get('./api/findServceOrderList', {
					params: {
						orderServiceState: this.confirmStatus,
						// orderServiceState: '',
						bsType: this.bsType, // 1商标服务2专利服务3版权服务4政府项目5维权诉讼6商标交易7企业服务
						page: this.page,
						size: this.size
					}
				})
				.then((response) => {
					let data = response.data;
					console.log('data', data)
					this.loading = false;
					this.total = data.total_elements;
					this.ordersData = data.elements;
					// this.ordersData = serviceDatas.otherDatas.data.fictitiousList
					if (!this.ordersData || !this.ordersData.length) {
						this.noResult = true;
						this.noDataTipHandle(this.confirmStatus);
					}
				})
				.catch((error) => {
					this.loading = false;
					this.errorResult = true;
					this.ordersData = [];
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
        if (status == '0') {
          ret = '最近没有下过订单哦~';
        }else if(status == '1'){
          ret = '没有待确认订单~';
        }else if(status == '2'){
          ret = '没有已确认订单~';
        }
        this.noDataTip = ret;
      },
      // refresh(){
      //   this.search();
			// },
			changeRoute () {
				this.page = (this.$route.query.page-0) || 1
				this.confirmStatus = this.$route.query.waitstate || ''
				this.serviceType = this.$route.params.serviceType
				this.bsType = this.$route.params.serviceType
				switch(this.serviceType){
					case '5':
						this.serviceName = '专利服务';
						break;
					case '26':
						this.serviceName = '企业服务';
						break;
					case '20':
						this.serviceName = '维权诉讼';
						break;
					case '15':
						this.serviceName = '政府项目';
						break;
					case '10':
						this.serviceName = '版权服务';
						break;
					case '38':
						this.serviceName = '商标交易';
						break;
				}
				this.search();
				this.type = this.$route.query.type || '1';
			}
    },
    mounted(){
			this.changeRoute()
    	this.type = this.$route.query.type || '1';
    	if (location.host.indexOf('user') === 0) {
      	this.cxbUrl = cxbUrlO;
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      $route(to, from) {
				this.changeRoute()
			}
    },
    filters: {
			dateFormat: Filters.formatDate.dateFormat,
			serviceState: Filters.serviceState,
			ellipsis: Filters.ellipsis
    }
  }
</script>
<style lang="scss">
	// 和我的订单列表页面共用样式
  .__myService{
		.orderListBtn{padding: 7px 0;width: 88px;}
		.el-dialog{
			width: 450px;
		}
		padding: 20px;
		.pagination-wrap{padding: 20px 0 10px;}
  	.other_service {
  		padding-left: 0;
  		.name {width: 546px; display: inline-block; padding-left: 20px;}
  		.info {width: 170px;  display: inline-block; text-align: center;}
			.action{display: inline-block;text-align: center;width: 210px;}
  	}
    .table_service {
			margin-bottom: 10px;
      tr{
        td{padding-bottom: 20px!important;}
      }
    	td.name {
    		padding-left: 20px; width: 546px !important;
    		.img {
    			width: 90px; height:90px; border: 1px solid #eee; overflow: hidden;
    			img {width: 100%;}
    		}
    		.content {
    			width: 130px; height: 90px; margin-left: 15px; float: left;
    			.s_name {width:100%;line-height: 18px; font-size: 13px; word-break:break-all; word-wrap:break-word; color: #333;
						a:hover{text-decoration: none;}
					}
    			.label_blue {float: left; margin-top:5px;}
    		}
    		.detail {
    			width: 290px; float: left; margin-left: 10px;
    			.d_content {font-size: 13px; color: #333; float: left;}
    			.money {font-size: 13px; color: #3DB1FA; text-align: left; margin-top: 5px; float: left;}
    		}
    	}
    	td.info {
    		width: 170px;
    		.text {width: 100%; text-align: center; display: inline-block;}
    		.time {color: #999; text-align: center; width: 100%; margin: 3px 0;}
    	}
    	td.actions {
				.countdown_list{color:#FF3939;display: block;}
				.el-button{
					margin-bottom: 5px;
				}
				p{
					&.accept{color: #36AF47;font-size: 14px;line-height: 20px;}
					&.refuse{color: #FF3939;font-size: 14px;line-height: 20px;}
				}
    	}
    }

  }

</style>
