<template>
	<div class="orderDetail listCommonality">
		<h4 class="navTitle">订单详情
			<span class="back_box">
  			<router-link to="/orders" class="text"><i class="fa fa-angle-left" aria-hidden="true"></i>返回</router-link>
  		</span>
		</h4>
		<div v-loading="loading" v-if="!noResult" style="min-height: 142px">
			<div class="nav">
				<span>订单号：{{allDetailData.order_fictitious_sn}}</span>
				<el-button class="fr orderListBtn" v-if="allDetailData.order_state == '0' && allDetailData.channel_code != 'ali'" @click="handleClickPay(allDetailData.order_sn)" type="primary" size="small">付款</el-button>
				<el-button class="fr orderListBtn" v-if="allDetailData.order_state == '1' && allDetailData.isEvaluate == '0'" @click="goEvaluate(allDetailData.order_fictitious_sn)" type="primary" size="small">评价</el-button>
				<el-button class="fr orderListBtn" v-if="allDetailData.isEvaluate == '1'" @click="$router.push('/appraiseList?status=2')" type="primary" size="small">查看评价</el-button>
				<span class="fr price" v-if="allDetailData.order_state == '0'">待付款：<span>{{allDetailData.amount | priceformat}}</span></span>
				<span class="countdown-wrap fr" v-if="allDetailData.order_state == '0'">
					<count-down class="countdown" @end_callback="countDownE_cb(item)" :leftTime="allDetailData.leftTime" :dayTxt="'天'" :hourTxt="'小时'" :minutesTxt="'分钟'" :secondsTxt="'秒'"></count-down>
				</span>

			</div>

			<div class="detailOrderLists">
				<div style="min-height: 142px">
					<table class="table table-bordered" >
						<thead>
							<tr class="" style="height: 40px;line-height:40px;background:rgba(245,245,245,1);">
								<th>
									<div class="title">
										<span>商品</span>
										<span class="goods_price">单价</span>
										<span>数量</span>
									</div>
								</th>
								<th>服务单号</th>
								<th>售后</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in allDetailData.fictitiousList" :key="item.order_sn">
								<td class="name">
									<div class="fl img">
										<img :src="item.orderBsImage" :onerror="imgLoadError">
									</div>
									<div class="fl content">
										<a v-if="item.orderBussinessType!=2" :href="item.orderBussinessType == 4 ? `${trademarkUrl}/trademark/${item.order_bs_number}.htm` : item.orderBsCode === 'sbfw_gnsb_zzzc' ? `${indexUrl}/sebe/pages/selfRegister.html#/one` : `${indexUrl}/store/service/${item.order_bs_number}.htm`">{{item.orderName}}</a>
										<a v-if="item.orderBussinessType==2" :href="`${indexUrl}/cms/service/rightoriginal.htm`">{{item.orderName}}</a>
										<span class="price" v-if="item.order_goods_amount != undefined || item.order_goods_amount != null">{{item.order_goods_amount | priceformat}}</span>
										<span class="num">X1</span>
									</div>
								</td>
								<!--  -->
								<td valign="top" class="order_num">
										{{item.order_sn}}
										<router-link v-if="item.stage >= 4 && item.order_state == 1 && item.haveDetail == 1" :to="'/serviceList/'+item.order_sn">查看详情</router-link>
								</td>
								<td valign="top" class="customer_service">
									<router-link v-if="item.isRefund == '1' && !item.refund_state && item.refund_state != 0 && item.order_state == 1" :to="'/refunds/' + item.order_sn">申请退款</router-link>
									<a v-if="item.refund && item.refund.audit_state == 2" 	class="ss"
										href="http://pct.zoosnet.net/LR/Chatpre.aspx?id=PCT70172520&lng=cn&p=http%3a%2f%2fwww.ipsebe.com" target="_blank">申诉</a>
									<p class="accept" v-if="allDetailData.order_check_accept == 2">服务已验收</p>
									<p class="refuse" v-if="allDetailData.order_check_accept == 3">验收拒绝</p>

									<el-popover placement="bottom" width="215" trigger="hover" class="sebe-popover order-popover" @show="showRefundProgress(item.order_sn)">
										<div v-if="refundProgressData.length == 1">
											<div class="progress progress-over" v-for="refItem in refundProgressData" :key="refItem.data_id">
												<span>{{refItem.create_time|dateFormat}}</span>
												<span>{{refItem.audit_state | refundStateFilter}}</span>
											</div>
										</div>
										<div v-if="refundProgressData.length >= 2">
											<div class="progress progress-over" v-for="refItem in refundProgressData" :key="refItem.data_id">
												<span>{{refItem.create_time|dateFormat}}</span>
												<span>{{refItem.audit_state | refundStateFilter}}</span>
											</div>
										</div>
										<i class="div-pipe"></i>
										<a href="javascript:;" v-if="item.refund_state === 0 || item.refund_state > 0" style="display:block;" slot="reference">退款进度</a>
									</el-popover>
								</td>

							</tr>

						</tbody>
					</table>
				</div>
			</div>

			<div class="order_detail_content" v-if="allDetailData">
				<div>
					<table class="order_invoice" v-if="allDetailData.invoice">
						<thead>
							<tr class="table_head">
								<th colspan="4" align="left">发票信息</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td class="col1 color_6">发票抬头</td>
								<td class="col2 "><p>{{allDetailData.invoice.title || '--'}}</p></td>
								<td class="col3 color_6">纳税人识别号</td>
								<td>{{allDetailData.invoice.code || '--'}}</td>
							</tr>
							<tr v-if="allDetailData.invoice.type === 2">
								<td class="col1 color_6">开户行</td>
								<td class="col2 "><p>{{allDetailData.invoice.reg_bname || '--'}}</p></td>
								<td class="col3 color_6">银行账号</td>
								<td>{{allDetailData.invoice.reg_baccount || '--'}}</td>
							</tr>
							<tr v-if="allDetailData.invoice.type === 2">
								<td class="col1 color_6">注册电话</td>
								<td class="col2 "><p>{{allDetailData.invoice.reg_phone || '--'}}</p></td>
								<td class="col3 color_6">注册地址</td>
								<td>{{allDetailData.invoice.reg_addr || '--'}}</td>
							</tr>
						</tbody>

					</table>
					<table class="order_address"  v-if="allDetailData.address">
						<thead>
							<tr class="table_head">
								<th colspan="4" align="left">收件地址</th>
							</tr>
						</thead>
						<tbody >
							<tr>
								<td class="col1 color_6">寄送地址</td>
								<td class="col2 " :title="(allDetailData.address.area_info + allDetailData.address.address) || '--'">
									<p>{{(allDetailData.address.area_info + allDetailData.address.address) || '--'}}</p>
								</td>
								<td class="col3 color_6" style="padding-left: 9px;">收件人</td>
								<td class="col4" :title="`${allDetailData.address.true_name} ${allDetailData.address.tel_phone}`"><p>{{allDetailData.address.true_name || '--'}} {{allDetailData.address.tel_phone | numToStar}}</p></td>
							</tr>
						</tbody>
					</table>
					<table class="order_shop_info">
						<thead>
							<tr class="table_head">
								<th colspan="4" align="left">店铺信息</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td class="col1 color_6">店铺</td>
								<td class="col2">
									<a :href="`${indexUrl}/store/${allDetailData.order_store_code}.htm?classId=0`">{{allDetailData.store.store_name | ellipsis(30)}}</a>
									<contactQQ  :type="allDetailData.order_distribute_from" :qqCode="allDetailData.order_store_code" :qqOrder="allDetailData.order_bs_number"></contactQQ>

									<!-- <a target="_blank" class="link_seller" href="http://wpa.qq.com/msgrd?v=3&uin=271652610&site=qq&menu=yes">联系商家</a> -->
								</td>
								<td class="col3 color_6">真实主体</td>
								<td class="col4"><p>{{allDetailData.store.name || '--'}}</p></td>
							</tr>
							<tr>
								<td class="col1 color_6">城市</td>
								<td class="col2">{{allDetailData.store.address ? allDetailData.store.address.split(' ')[1] : '--'}}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div style="margin: 10px 0;">
					<table class="order_shop_info" style="padding:15px 20px;">
						<tbody>
							<tr>
								<td class="col1 color_6">下单时间</td>
								<td class="col2 ">{{allDetailData.create_time | dateFormat}}</td>
							</tr>
							<tr>
								<td class="col1 color_6">商户订单号</td>
								<td class="col2 ">{{allDetailData.payment_sn}}</td>
							</tr>
							<tr v-if="allDetailData.order_state == '1'">
								<td class="col1 color_6">支付方式</td>
								<td class="col2 ">{{allDetailData.payment_name || '--'}}</td>
							</tr>
							<tr v-if="allDetailData.order_state == '1'">
								<td class="col1 color_6">支付时间</td>
								<td class="col2 ">{{allDetailData.payment_time | dateFormat}}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="order_detail_pay clearfix">
				<div class="fr">
					<ul>
						<li><span class="order_des">{{allDetailData.paymentNumber}}件商品，店铺合计：</span><span class="order_con">{{allDetailData.order_goods_amount | priceformat}}</span></li>
						<li><span class="order_des">优惠费用：</span><span class="order_con">{{allDetailData.order_goods_amount - allDetailData.amount | priceformat}}</span></li>
						<li><span class="order_des">实付款：</span><span class="order_con real_pay">{{allDetailData.amount | priceformat}}</span></li>
					</ul>
				</div>
			</div>
		</div>

    <noResult v-if="noResult"></noResult>

	</div>
</template>
<script>
	import Vue from 'vue'
	import Util from 'src/common/js/util.js'
	import Filters from 'api/filters.js'
	import intClsData from 'src/common/js/intClsData.js'
	import CountDown from 'components/countdown.vue'
	import contactQQ from 'components/contactQQ.vue'
	import qs from 'qs'
	import * as orderDatas from './orderList'
	import noResult from 'components/noResult/noResult.vue'
	const indexUrl = CONFIG.indexUrl;
	const cartUrl = CONFIG.cartUrl;
	const rootUrl = CONFIG.rootUrl;
	const czUrl = CONFIG.czUrl;
	const trademarkUrl = CONFIG.trademarkUrl;
	export default {
		components: {
			CountDown, noResult,contactQQ
		},
		data(){
				return{
					cateIdData: intClsData.cateIdData,
					// type:'',//查看拾贝或者是交易平台的订单详情
					detailAsistant:{},
					imgLoadError: 'this.src="' + require('../../assets/img/imgLoadError.png') + '"',
					allDetailData: '',
					mybody:'',
					bodyList:[],
					giveUp:false,
					loading: false,
					progressVisible: false, //服务进度
					applyCerVisible: false, //申请出证
					dialogImgVisible: false,
					dialogImageUrl: '',
					indexUrl: indexUrl,
					trademarkUrl: trademarkUrl,
					cartUrl: cartUrl,
					rootUrl: rootUrl,
					czUrl: czUrl,
					payment_sn:'',
					business: '0', // 0默认为普通订单  1存证订单
					payData:{},
					loading: true,
					noResult: false,
					detailData:[],
					refundProgressData:[]
				}
		},
		methods:{
			handleClickPay (order_sn) {
				// shop/pages/pay.html?order_sn=10201404805
				window.location.href = cartUrl + "/shop/pages/pay.html?order_sn=" + order_sn
			},
			goEvaluate (id) {
        this.$router.push({ path: '/appraiseDetail/' + id})
      },
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
			//获取主体列表
			getConsigneeData(){
				var self = this;
				this.$http.get('./api/subject?t='+new Date().getTime()).then(function(resp){
					resp = resp.data;
					//console.log(resp);
					if(resp.elements){
						self.bodyList = resp.elements;
					}else {
						console.error(resp.msg);
					}
				})
				.catch((error) => {
					self.consignee = [];
					console.error(error);
				});
			},
			//新增主体
			addBody(){
				if (this.bodyList.length === 10) {
					return;
				}
				this.$router.push({path:'/subjectList/0', query:{order_sn: this.payment_sn}});
			},
			//确认主体
			confirmBody(item){
				var self = this;
				if (self.submitDisabled || !item.mybody) {
					return;
				}
				self.submitDisabled = true;
				var confirm = function(){
					self.$http.post('./api/confirmApplySubject', qs.stringify({
						order_sn: item.order_sn,
						apply_subject_id: item.mybody
					}))
					.then((response) => {
						var data = response.data;
						if (data === true) {
							self.search();
						}
					})
					.catch((error) => {
						var data = error.response.data;
						self.$message.error({
							title: '错误',
							message: data.msg
						});
						self.search();
					});
				}

				if (item.mybody) {
					self.$confirm('为了您的服务能尽快完成申报，主体信息仅允许修改1次/服务单~', '确认主体', {
						type: 'warning',
						lockScroll:false,
						closeOnClickModal: false
					}).then(() => {
						self.submitDisabled = false;
						confirm()
					}).catch(() => {
						self.submitDisabled = false;
					});
				}
			},
			//查询订单详情
			search(){
				// findOrderDetails
				this.loading = true;
				this.noResult = false;
				let data = {};
				if (this.$route.query.key && this.$route.query.key=='orderSn') {
					data.orderSn = this.payment_sn;
				}
				else{
					data.orderFictitiousSn = this.payment_sn;
				}
				this.$http.post('./api/findOrderDetails', qs.stringify(data))
				.then((response) => {
					this.loading = false;
					console.log(this.loading)
					var data = response.data.data;
					if (data.address) {
						let isPhone = data.address.tel_phone.length == 11;
						data.address.tel_phone = data.address.tel_phone.replace(isPhone ? /^(\d{3})\d{4}(\d{4})$/ : /^(\d{3,4})(-\d{3,4})?\d{4}$/, isPhone ? '$1****$2' : '$1$2****');
					}
					this.allDetailData = data;
					// console.log('data', data)
					// this.allDetailData = orderDatas.orderDetail.data
					if (!Object.keys(this.allDetailData).length) {
						this.noResult = true
					}
					if (data.code === '0') {
						var arr = data.data || [];
						arr.forEach(function(item, i){
							item.mybody = '';
						});
						this.detailData = arr;
						this.business = this.detailData[0]['orderBussinessType'] || '1';
						this.payData = data.fictitious || {};
					}
				})
				.catch((error) => {
					this.loading = false;
					var data = error.response.data;
				});
			},
			refund(order_sn){
				this.$router.push('/refunds/'+order_sn);
			},
			viewProgress(){
				this.progressVisible = true;
			},
			showRefundProgress(order_sn){
				// alert()
				this.$http.post('./api/refundsDetailsByOrderSn/'+order_sn)
				.then((response) => {
					var data = response.data;
					this.refundProgressData = (data.refunds.dataDTOs || []).reverse();
				})
				.catch((error) => {
					var data = error.response.data;
					this.refundProgressData = [];
				});
			},
			viewCertificate(item){
				//this.dialogImageUrl = '';
				this.dialogImgVisible = true;
			},
			downloadCertificate(item){
				var url;
				var notarizationType = item.notarizationType;
				var fileId = item.fileId;
				if (notarizationType == 1) {
					url = czUrl + '/cunnar/downSaveFile.do?fileId=' + fileId;
				}else if(notarizationType == 2){
					url = czUrl + '/EvidenceController/downEvidence.do?ano=' + fileId;
				}
				if (!url) {
					console.log('存证类型不匹配');
					return;
				}
				location.href = url;
			},
			// 申请出证，暂不生成订单，直接联系客服
			applyCertificate(item){
				var self = this;
				var url, data={};
				var notarizationType = item.notarizationType;
				var fileId = item.fileId;
				if (notarizationType == 1) {
					url = './cunnar/applyCunnar.do';
					data = {fileId: fileId};
				}else if(notarizationType == 2){
					url = './EvidenceController/comeToTestify.do';
					data = {fileIdList: fileId ? [fileId] : []};
				}
				if (!url) {
					console.log('存证类型不匹配');
					return;
				}

				self.$http.post(url, data)
				.then((response) => {
					var data = response.data;
					if (data.code === '0') {
						self.$alert('申请成功，稍后会有专业顾问联系您。');
					}else if(data.code === '4010008'){
						//
					}else{
						self.$alert('申请失败，请重试');
					}
				})
				.catch((error) => {
					var data = error.response.data;
					self.$alert('申请失败');
				});
			}
		},
		mounted(){
			// this.type = this.$route.query.type;
			// console.log(this.type)
			this.payment_sn = this.$route.params.payment_sn;
			this.search();
			this.getConsigneeData();
		},
		filters: {
			dateFormat: Filters.formatDate.dateFormat,
			orderStatusformat: Filters.orderStatusformat,
			notarizationStatus: Filters.notarizationStatusformat,
			numToStar: Filters.numToStar,
			notarizationUses: Filters.notarizationUsesformat,
			fileSizeFilter: Filters.fileSizeFilter,
			refundStateFilter:Filters.refundStateFilter,
			ellipsis: Filters.ellipsis,
			priceformat:Filters.priceformat,
			serviceState:Filters.serviceState
		}
	}
</script>

<style lang="scss">
		.ss > a{
			background: none;padding-left: 0;
		}
		.progress{font-size: 12px;position: relative;height: 42px;padding:5px 0;line-height: 32px;color: #666;
			span:first-child{width: 84px;display: inline-block;padding-left:5px;}
			span:last-child{display: inline-block;padding-left: 20px;width:98px!important;}
		}
		.progress-over {font-size: 12px;color: #333;
			span:first-child{line-height: 16px;}
			span:last-child{position: relative;top:-8px;}
		}
		.div-pipe{position: absolute;top: 0;left: 45%;background-color: #e6e6e6;width: 1px;height: 100%;}
  .detailOrderLists{

		/* 浮出框样式 */

		p{
			&.accept{color: #36AF47;font-size: 13px;line-height: 20px;}
			&.refuse{color: #FF3939;font-size: 13px;line-height: 20px;}
		}
		a{text-decoration: none;}
		margin-top: 10px;
    table{
      width: 100%;
      tr{

        th{
					background:rgba(245,245,245,1);
					border:1px solid #eee;
					font-weight: normal;
          .title{
            padding-left:20px;text-align: left;height: 40px;line-height:40px;
            span{
							&.goods_price{margin: 0 130px 0 295px}
						}
          }
        }
        td{border:1px solid #eee;box-sizing: border-box;height: 144px;padding: 20px 0 34px 0;}
        td.name{
          width: 617px;
          >div{
          &.img{width: 90px;margin: 0 20px;height: 90px;border:1px solid rgba(238,238,238,1);
            img{width: 100%;height: 100%;}
            }
          &.content{font-size: 13px;line-height: 18px;word-wrap:break-word;word-break:break-all;
						>a{width: 130px;display: block;float: left;margin-right: 20px;
						}
            >.price{margin: -18px 70px 0 0;width: 160px;display: inline-block;text-align: center;}
						>.num{width: 80px;}
            }
          }
          .num-btn{width: 54px;height: 26px;border-color: #e6e6e6;color: #666;margin-top:5px;font-size:13px;line-height: 24px;cursor: default}
        }
        td.order_num{
          width: 170px;
          text-align: center;
					line-height: 18px;
					a{display: inline-block;padding-top: 5px;}
          span{color: #666;}
        }
        td.customer_service{
					text-align: center;
          // width: 160px;text-align: center;font-size:13px;color: #fe2200;
        }
        td.action{
          text-align: center;color: #666;
          .topay-btn{display: inline-block;width: 60px;height: 26px;background-color: #fe2200;margin:5px 0;border-color:#fe2200; color: #fff;font-size:13px;line-height: 24px;}
          .topay-btn:hover{background-color: #fa1b00;border-color:#fa1b00;}
          a, .close_order{color: #666;line-height:18px;display: block;padding-top: 8px;
            &.cancel_order{padding-top: 5px;color:#999999}
          }
          a:hover{color: #3db1fa;}
          .topay-btn:hover{text-decoration: none;color: #fff;}
          &.hasCount{height: 100%;padding-top: 15px;}
        }
        td.watch_more{
          height: 30px;
          padding: 0;
        }
      }
    }
    .noResult{
      padding:100px 0;
      img{margin-left:210px;float:left;}
      a{color: #3db1fa;}
      p{float:left;font-size:24px; color: #666;width: 310px;margin-left:90px;line-height: 40px;padding:15px 0;}
      .shopping{float:left;width: 120px;margin-left:90px;margin-top:5px;height: 40px;line-height: 38px;background-color: #fe2200;font-size:18px;border-radius: 5px;color: #fff;text-align: center;}
      .shopping:hover{text-decoration:none;}
    }
    .pagination-wrap{
      text-align: center;
      padding: 30px 0;
      /* .sebe-pagination{margin-top:20px;} */
    }
  }
.order_detail_content{
	a{text-decoration: none;
		&:hover{text-decoration: none!important;}
	}
	.link_seller{padding-left: 34px;color: #3DB1FA;background: url(~assets/img/link.png) no-repeat 12px 1px;
            background-size: 16px 16px;}
	font-size: 13px;
	color: #333;
	margin: 10px 0 0 0px;
	.color_6{color: #666;}
	>div{
		box-sizing: border-box;border: 1px solid #eee;border-bottom: none;
		table{width: 100%;display: block;padding: 20px;
		padding-bottom: 15px;border-bottom: 1px solid rgba(230,230,230,1);
			tr{height: 30px;line-height: 30px;
				th{font-weight: 500;}
				&.table_head{height: 20px;line-height: 20px;font-size: 14px;padding-bottom: 5px;}
				.col1{width: 83px;}
				.col2{width: 444px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;
					p{width: 444px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
				}
				.col3{width: 109px;}
				.col4{width: 278px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;
					p{width: 278px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
				}
			}
		}
	}

}
.order_detail_pay{
	font-size: 14px;
	background: #f5f5f5;
	box-sizing: border-box;
	padding: 23px 20px 21px;
	border:1px solid rgba(238,238,238,1);
	>div{
		li{height: 20px;line-height: 20px;margin-bottom: 10px;
			&:last-child{margin-bottom: 0;}
			span{
				display: inline-block;
				text-align: right;
				&.order_des{width: 500px;}
				&.order_con{width: 117px;}
				&.real_pay{font-size: 20px;height: 28px;line-height: 28px;color:#FF3939;}
			}
		}
	}
}

.orderDetail{
	font-size:13px;
	padding: 20px 20px ;

	// h4{padding-left: 0;
	// 	>a {float:right;font-size: 14px;font-weight: normal;color: #999;
	// 		i{margin-right:5px;padding: 3px;font-size: 10px;border:1px solid #999;border-radius: 50%;}
	// 		&:hover{color: #3db1fa;
	// 			i{border-color: #3db1fa;}
	// 		}
	// 	}
	// }
	.nav{
		margin-top: 20px;
		height: 30px;
		line-height: 30px;
		font-size: 14px;
		.price{
			padding: 0 20px;
			span{color: #FF3939;}
		}
		a{color: #3db1fa;}
	}
	.order-info-wrap{
		border:1px solid #e6e6e6;
		margin-top:10px;
		.order-sn{
			height: 38px;
			line-height: 38px;
			border-bottom: 1px solid #e6e6e6;
			padding-left:25px;
			span{margin-right:15px;}
		}
		.order-info{
			padding:12px 25px;
			label{
				color: #666;
				line-height: 26px;
				width: 270px;display: inline-block;
				b{
					color: #f64744;font-size:13px;font-weight:normal;
				}
				.topay-btn{display: inline-block;width: 60px;height: 26px;line-height:26px;text-align: center;background-color: #f64744;border-color:#f64744; color: #fff;margin-left: 10px;font-size:13px;line-height: 24px;}
				.topay-btn:hover{text-decoration: none;}
			}
			label.darker{color: #333;}
		}
	}
	.goodsLists{
		margin-top:15px;
		table{
			width: 100%;
			margin-top: 16px;
			font-size:13px;
			border:1px solid #eee;
			th{
				height: 39px;line-height:39px;background-color: #eee;
				font-weight:normal;
				span{margin-right: 20px;}
			}
			th:first-child{text-align: left;padding-left:25px;}
			th.til{text-align: left; padding:0 20px;}
			tr{
				height: 38px;border-bottom: 1px solid #eee;
				td{
					text-align: center;padding:9px 10px;line-height: 22px;word-break:break-all;
					.order_sn{color: #3DB1FA;}
					img{width:50px;height:50px;border:1px solid #eee;}
				}
				td.feedback{
					span{display:inline-block;line-height: 20px;height: 20px;}
					.ser_name{color:#999;}
				}
				td:first-child{text-align: left;padding-left:25px;}
				td.info{
					text-align: left;
					padding:9px 0 9px 20px;
					div{max-width: 160px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}
					span{color: #666;}
				}
				td.money{text-align: center;font-size:13px;color: #f64744;font-weight:normal;}
				td.action{
					text-align: center;color: #666;
					a{color: #666;line-height:22px;}
					a:hover{color: #3DB1FA;text-decoration:none;}
				}
				td.cz-action{
					padding:5px 0;
					a{color: #3db1fa;display: block;margin:0 10px;height: 24px;line-height: 24px;}
				}
				td.info-confirm{
					a{color:#666}
					a:hover{text-decoration:none;color:#3DB1FA}
					.mybody{
						width:128px;
						.el-input__inner{height: 26px;border-radius: 3px;color: #666;border-color:#ddd;}
					}
					.mybody_action{
						line-height: 16px;margin-top:5px;color: #ddd;
						a{margin:0 5px;}
						.disabled{color:#ccc;cursor: not-allowed;}
						.disabled:hover{text-decoration:none;}
						.hight{color:#3DB1FA;}
					}
					.memberApply{
						color: #666;display: inline-block;width: 180px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;vertical-align: middle;
					}
				}
			}
		}
		.memo{
			p{display:inline-block;}
			.tit{width:40px;vertical-align: top;}
			.txt{width:860px;vertical-align: bottom;word-break:break-all;}
		}
	}
	.bottom-wrap{padding-top:28px;text-align: center;padding-left:0;}
	.back-btn{width: 100px;height: 40px;line-height:40px;color:#666;border-color: #e6e6e6;}

}
.el-popover{width: 170px;min-height: 100px;}
.confirm-btn{width: 60px;height: 26px;background-color: #3db1fa;border-color:#3db1fa;margin:5px 0; margin-right:6px;}
.cancel-btn{width: 60px;height: 26px;margin:5px 0;color: #666;border-color:#e6e6e6 }
.pagination-wrap{text-align: center;}
.sebe-pagination{margin-top:20px;}

/* 查看进度 */
.dialog-progress{
	width:500px;min-height:260px;padding:20px 30px 35px;
	.el-dialog__body{padding:0;}
	.el-dialog__header{padding: 6px 0 16px;}
	.pop_window{
		position: relative;
		font-size:12px;
		color: #333;
		.progress_detail{
			p{
				line-height:27px;
				color: #333;
				vertical-align: top;
			}
			p.tip{
				color: #666;
				font-size:12px;
			}
			.btn-close{width: 100px;height: 40px;line-height: 40px;color: #666;border-color: #e6e6e6;margin:20px auto;display: block;}
		}
	}
}
.dialog-applyCer{
	width:300px;min-height:200px;padding:20px 30px 20px;
	.pop_window{padding-top:15px;}
}

// .el-select-dropdown__item{padding: 5px 10px;height: 30px;}
// .el-select-dropdown{margin-top: 2px;}

.countdown-wrap{
  color:#999;
  font-size: 14px;
  .countdown{
    line-height: 17px;
    padding-bottom: 8px;
    .el-icon-time{color: #333;margin-right: 3px;}
    display: inline-block;color:#FF3939;
    i{font-style: normal;}
    span{margin-right:0;}
  }
}
.orderDetail{
	a:hover{text-decoration: none!important;}
	.orderListBtn{padding: 7px 0;width: 88px;}
}
</style>
