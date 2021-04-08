<template>
	<div class="listCommonality service_detail" v-loading="loading">
		<h4 class="navTitle">
			服务详情
  		<span class="back_box" @click="backFn">
  			<i class="fa fa-angle-left" aria-hidden="true"></i>
  			<span class="text">返回</span>
  		</span>
		</h4>
		<!-- 服务单号 -->
		<div class="order_info clearfix">
			<span class="o_num">服务单号：{{ $route.params.workOrderSn }}</span>
			<div class="pay_box">
				<span class="text" v-if="infoDetail.status==2">待付款: <span class="red" >¥{{ infoDetail.orderInformation.premium || 0 }}</span></span>
			  <el-button type="primary" size="small" @click="gopay" v-if="infoDetail.status==2">付款</el-button>
			  <!-- <el-button type="primary" size="small" @click="toBeUpload" v-if="infoDetail.status==6">上传申请材料</el-button> -->
			  <el-button type="primary" size="small" v-if="infoDetail.orderInformation && infoDetail.order_check_accept==1"  @click="checkOrderFn(infoDetail)">服务验收</el-button>
				<p class="red" v-if="infoDetail.order_check_accept_time">
					<count-down class="countdown" @end_callback="countDownE_cb(infoDetail)" :leftTime="infoDetail.order_check_accept_time - new Date().getTime()" :dayTxt="'天'" :hourTxt="'时'" :minutesTxt="'分'" :secondsTxt="'秒'" :secondsFixed="true"></count-down>
					后自动确认验收</p>
				<span v-if="infoDetail.orderInformation && infoDetail.order_check_accept==2">服务已验收</span>
				<span v-if="infoDetail.orderInformation && infoDetail.order_check_accept==3">验收拒绝</span>
			</div>
		</div>
		<!-- 订单当前所在状态 -->
		<div class="status_box clearfix">
			<div class="curent_box">
				<p class="text">当前状态</p>
				<p class="s_name">{{ infoDetail.order_feedback_state }}</p>
				<p class="time">{{ infoDetail.feedback_time | formatDate }}</p>
			</div>
			<!-- <div class="status_list" id="status_box">
				<div class="s_item" :class="{'active': item.active}" v-for="(item,index) in statusList">
					<span class="name">{{ item.name }}</span>
					<span class="time">{{ item.time }}</span>
					<span class="info">{{ item.info }}</span>
				</div>
			</div> -->
			<div class="service_preview" ref="box">
				<service-state @previewClick="previewClick" :type="infoDetail.workOrderType" :previewImg='previewImg' :recordData='recordData' :acceptMaterials='acceptMaterials'></service-state>
			</div>

		</div>

		<!-- 订单信息 -->
		<div class="listHead">
			<table class="table table-bordered table_service" >
        <thead>
          <tr>
            <th colspan="4">
              <div class="title">
                <span>服务单号：{{ $route.params.workOrderSn }}</span>
                <span>订单号：{{ infoDetail.order_fictitious_sn }}</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="name">
            	<div class="fl img">
                <img :src="infoDetail.information.blackWhitePicUrl">
              </div>
              <div class="content">
              	<p class="s_name">{{ infoDetail.information.trademarkName }}</p>
              	<span class="label_base label_blue" v-if="infoDetail.orderInformation.intCls">{{ infoDetail.orderInformation.intCls }}-{{ cateIdData[infoDetail.orderInformation.intCls-1].goodsname }}</span>
              </div>
              <div class="detail">
              	<p class="d_content">{{ infoDetail.orderInformation.min }}</p>
              	<p class="money">共{{ infoDetail.orderInformation.minNumber }}项，需补费用：￥{{ infoDetail.orderInformation.premium }}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
		</div>

		<div class="info_wrap">
			<!-- 商标注册信息 -->
			<div class="detail_list clearfix" v-if="infoDetail.information">
				<p class="mb10">商标注册信息</p>
				<ul class="list_left fl">
					<li class="mb10 clearfix" v-if="infoDetail.information.contractUrl">
						<p class="left_txt fl">合同书</p>
						<p class="right_txt fl"><a class="text_blue" target= '_blank' :href="infoDetail.information.contractUrl"><i class="el-icon-download"></i>下载合同书</a></p>
					</li>
					<li class="mb10 clearfix" v-if="infoDetail.information.confirmUrl">
						<p class="left_txt fl">确认书</p>
						<p class="right_txt fl"><a class="text_blue" target= '_blank' :href="infoDetail.information.confirmUrl"><i class="el-icon-download"></i>下载确认书</a></p>
					</li>
					<li class="mb10 clearfix" v-if="infoDetail.information.proxyUrl">
						<p class="left_txt fl">委托书</p>
						<p class="right_txt fl"><a class="text_blue" target= '_blank' :href="infoDetail.information.proxyUrl"><i class="el-icon-download"></i>下载委托书</a></p>
					</li>
					<li class="mb10 clearfix">
						<p class="left_txt fl">商标名称</p>
						<p class="right_txt fl">{{infoDetail.information.trademarkName}}</p>
					</li>
					<li class="mb10 clearfix">
						<p class="left_txt fl">图样类型</p>
						<p class="right_txt fl">{{infoDetail.information.picType | imgstate}}</p>
					</li>
					<li class="mb10 clearfix">
						<p class="left_txt fl">商标描述</p>
						<p class="right_txt fl">{{infoDetail.information.trademarkDesc}}</p>
					</li>
				</ul>
				<div class="list_right fl clearfix">
					<div class="fr" v-if="infoDetail.information.blackWhitePicUrl" @click="preview(infoDetail.information.blackWhitePicUrl)">
						<img :src="infoDetail.information.blackWhitePicUrl" alt="">
						<p title="黑白色">黑白色</p>
					</div>
					<div class="fr mr20" v-if="infoDetail.information.specifyPicUrl" @click="preview(infoDetail.information.specifyPicUrl)">
						<img :src="infoDetail.information.specifyPicUrl" alt="">
						<p title="指定色">指定色</p>
					</div>
					<div class="fr mr20" v-if="infoDetail.information.proxyUrl" @click="preview(infoDetail.information.proxyUrl)">
						<img :src="infoDetail.information.proxyUrl" alt="">
						<p title="委托书">委托书</p>
					</div>
				</div>
			</div>
			<!-- 申报主体 -->
			<div class="detail_list clearfix" v-if="infoDetail.subject">
				<p class="mb10 mt15">主体信息</p>
				<ul class="list_left fl">
					<li class="mb10 clearfix">
						<p class="left_txt fl">主体类型</p>
						<p class="right_txt fl">{{infoDetail.subject.applyType | format}}</p>
					</li>
					<li class="mb10 clearfix">
						<p class="left_txt fl">{{infoDetail.subject.applyType | mainBodeSbj}}名称</p>
						<p class="right_txt fl">{{infoDetail.subject.applyName}}</p>
					</li>
					<li class="mb10 clearfix" v-if="infoDetail.subject.applyType != 4">
						<p class="left_txt fl">{{infoDetail.subject.applyType | mainBodeNumber}}</p>
						<p class="right_txt fl">{{infoDetail.subject.applyNumber}}</p>
					</li>
					<li class="mb10 clearfix">
						<p class="left_txt fl">{{infoDetail.subject.applyType | mainBodeSbj}}联系电话</p>
						<p class="right_txt fl">{{infoDetail.subject.applyPhone}}</p>
					</li>
					<li class="mb10 clearfix">
						<p class="left_txt fl">{{infoDetail.subject.applyType | mainBodeSbj}}注册地址</p>
						<p class="right_txt fl">{{infoDetail.subject.applyAreaInfo}}{{infoDetail.subject.applyAddress}}</p>
					</li>
				</ul>
				<div class="list_right fl">
					<div class="fr" v-if="usinessLicense[0]&&infoDetail.subject.applyType != 2" @click="certificatePreview(usinessLicense)">
						<img :src="usinessLicense[0]" alt="">
						<p :title="infoDetail.subject.applyType | licenseName">{{infoDetail.subject.applyType | licenseName}}</p>
					</div>
					<div class="fr mr20" v-if="cardImg[0]" @click="certificatePreview(cardImg)">
						<img :src="cardImg[0]" alt="">
						<p :title="infoDetail.subject.applyType | fileName">{{infoDetail.subject.applyType | fileName}}</p>
					</div>
				</div>
			</div>
			<!-- 开票信息 -->
			<div class="detail_list clearfix">
				<p class="mb10 mt15">发票信息</p>
				<ul class="list_left fl" v-if="!infoDetail.invoice || !infoDetail.invoice.invoiceType">
					<li class="mb10 clearfix">
						<p class="left_txt fl">未申请发票</p>
					</li>
				</ul>
				<ul class="list_left fl" v-if="infoDetail.invoice && infoDetail.invoice.invoiceType">
					<li class="mb10 clearfix" >
						<p class="left_txt fl">发票抬头</p>
						<p class="right_txt fl">{{infoDetail.invoice.invoiceTitle || '--'}}</p>
					</li>
					<li class="mb10 clearfix" v-if="infoDetail.invoice.invoiceType == 2">
						<p class="left_txt fl">注册电话</p>
						<p class="right_txt fl">{{infoDetail.invoice.registPhone || '--'}}</p>
					</li>
					<li class="mb10 clearfix" v-if="infoDetail.invoice.invoiceType == 2 && infoDetail.subject.applyType == 2">
						<p class="left_txt fl">银行账号</p>
						<p class="right_txt fl">{{infoDetail.invoice.accountBank || '--'}}</p>
					</li>
					<li class="mb10 clearfix" v-if="infoDetail.invoice.invoiceType == 2">
						<p class="left_txt fl">企业地址</p>
						<p class="right_txt fl">{{infoDetail.invoice.address || '--'}}</p>
					</li>
				</ul>
				<div class="list_right fl" v-if="infoDetail.invoice && infoDetail.invoice.invoiceType">
					<ul class="right_list">
						<li class="mb10 clearfix" >
							<p class="left_txt fl">纳税人识别号</p>
							<p class="right_txt fl">{{infoDetail.invoice.invoiceCode || '--'}}</p>
						</li>
						<li class="mb10 clearfix" v-if="infoDetail.invoice.invoiceType == 2 && infoDetail.subject.applyType == 2">
							<p class="left_txt fl">开户行名称</p>
							<p class="right_txt fl">{{infoDetail.invoice.registPhone || '--'}}</p>
						</li>
					</ul>
				</div>
			</div>
			<!-- 收件地址 -->
			<div class="detail_list clearfix" v-if="infoDetail.address">
				<p class="mb10 mt15">收件地址</p>
				<ul class="list_left fl" >
					<li class="mb10 clearfix">
						<p class="left_txt fl">寄送地址</p>
						<p class="right_txt fl">{{ infoDetail.address.address_area_info }}</p>
					</li>
				</ul>
				<div class="list_right fl" >
					<ul class="right_list">
						<li class="mb10 clearfix">
							<p class="left_txt fl">收件人</p>
							<p class="right_txt fl">{{ infoDetail.address.address_true_name }} {{ infoDetail.address.address_mob_phone }}</p>
						</li>
					</ul>
				</div>
			</div>
			<!-- 店铺信息 -->
			<div class="detail_list clearfix" v-if="infoDetail.store">
				<p class="mb10 mt15">店铺信息</p>
				<ul class="list_left fl" >
					<li class="mb10 clearfix">
						<p class="left_txt fl">店铺</p>
						<p class="right_txt fl" style="width:300px; cursor:pointer;" :title="infoDetail.store.store_name"><a :href="`${indexUrl}/store/${infoDetail.store.store_code}.htm`" target="_blank">{{ infoDetail.store.store_name | ellipsis(30) }}</a>
							<a href="http://pct.zoosnet.net/LR/Chatpre.aspx?id=PCT70172520&lng=cn&p=http%3a%2f%2fwww.ipsebe.com" class="link_seller" target="_blank" v-if="infoDetail.order_distribute_from==1" >联系商家</a>
							<a :href="'http://wpa.qq.com/msgrd?v=3&uin='+infoDetail.store.store_qq+'&site=qq&menu=yes'" target="_blank" class="link_seller" v-if="infoDetail.order_distribute_from==2">联系商家</a>
						</p>
					</li>
					<li class="mb10 clearfix">
						<p class="left_txt fl">城市</p>
						<p class="right_txt fl">{{ infoDetail.store.address && infoDetail.store.address.split(' ')[1] }}</p>
					</li>
				</ul>
				<div class="list_right fl" >
					<ul class="right_list">
						<li class="mb10 clearfix">
							<p class="left_txt fl">真实主体</p>
							<p class="right_txt fl">{{ infoDetail.store.name }}</p>
						</li>
					</ul>
				</div>
			</div>
		</div>


		<!-- 商标分类 -->
		<!-- <trademark-event  v-on:viewRecord="viewRecord" :orderInformation="infoDetail.orderInformation" :status="infoDetail.status"></trademark-event> -->
		<!-- 操作记录 -->
		<!-- <operation-record :operationRecord="infoDetail.operationRecord" :code="code"></operation-record> -->

		<!-- 图片预览 -->
		<el-dialog
			:visible.sync="dialogVisible"
			size="tiny" class="img_preview" :modal-append-to-body="true">
			<img :src="imgSrc" alt="" style="max-width:100%;">
		</el-dialog>
		<!-- 证书预览 -->
		<el-dialog
			:visible.sync="dialogImg"
			size="tiny" class="img_preview" :modal-append-to-body="true">
			<div style="position:relative">
				<el-carousel indicator-position="none" :interval="5000" arrow="always" :autoplay='false' trigger="click">
					<el-carousel-item v-for="(item,$index) in certificateImg" :key="$index">
						<img :src="item" alt="">
					</el-carousel-item>
				</el-carousel>
			</div>
		</el-dialog>
		<!-- 服务记录 -->
		<!-- <el-dialog
			:visible.sync="dialogService" title="服务记录"
			size="tiny" class="service_preview" :modal-append-to-body="true" :lock-scroll="false" :close-on-click-modal="false">
			<service-state @previewClick="previewClick" :type="infoDetail.workOrderType" :previewImg='previewImg' :recordData='recordData' :acceptMaterials='acceptMaterials'></service-state>
		</el-dialog> -->

		<!-- 服务验收 -->
		<el-dialog title="服务验收" width="400px" :visible.sync="checkVisible">
		  <span>确认服务验收后，交易款项将打至商家账户，是否确认验收？</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleClickServiceCheck(0)" size="small">拒接验收</el-button>
				<el-button type="primary" @click="handleClickServiceCheck(1)" size="small">确认验收</el-button>
			</span>
		</el-dialog>
		<!-- <el-dialog title="" :visible.sync="imgPreViewState" width="810px">
			<img style="width: 100%" :src="preViewImgUrl" />
		</el-dialog> -->

		<dragDialog :value.sync="agreementVisible" title="拾贝商标注册服务协议" class="dragDialog" @closeTop="closeTop">
			<div class="img_lists" :class="{heigher:hasConfirmed}" @scroll="scrollHandle">
				<!-- <img v-for="(item, idx) in urlsData" :src="item"> -->
				<agreement :workOrderSn="workOrderSn" v-if="agreementVisible"></agreement>
			</div>
			<div class="bt_btn" v-if="!hasConfirmed">
				<p>提示：请完整阅读本协议，经同意后即产生法律效力</p>
				<a href="#" @click.prevent="agreementVisible=false">取消</a><a href="#" class="confirm" :class="{disabled: !isScrollToBottom}" @click.prevent="agree">同意协议</a>
			</div>
			<div class="bt_btn" v-else>
				<p>提示：当前国内商标注册服务，受本协议的法律保护</p>
			</div>
		</dragDialog>
		<uploadMaterial :uploadVisible="uploadVisible" :curItem="curItem" @close="uploadVisible=false"  @fresh="search(true)"></uploadMaterial>
		<!-- 评分模块 -->
		<!-- <rate-score v-if="isToPay" :isToPay.sync="isToPay" :orderSn="orderSn" @refresh="search(true)"></rate-score> -->
	</div>
</template>
<script>
	import Vue from 'vue'
	import $ from 'jquery'
	import TrademarkEvent from './components/trademarkEvents.vue'
	import OperationRecord from './components/operation.vue'
	import RateScore from './components/RateScore.vue'
	import serviceState from './components/serviceState.vue'
	import dragDialog from 'components/dialog/dialog.vue'
	import agreement from './components/agreement.vue'
		import CountDown from 'components/countdown.vue';
	import uploadMaterial from './components/uploadMaterial.vue'
	import Filters from 'api/filters.js'
	import qs from 'qs';
	import intClsData from '../../common/js/intClsData.js';

	const cartUrl = CONFIG.cartUrl;
	const userUrl = CONFIG.userUrl;
	const rootUrl = CONFIG.rootUrl;
	const indexUrl = CONFIG.indexUrl;
	const orderDetailUrl = rootUrl + '/api/findServiceOrderDetail';

	const statusList = [
		{name:'待支付加项费用', info: '客户确认订单（需补小项）', time: '2018-06-26 02:27:58', active: true, id:1},
		{name:'待用户确认信息', info: '服务商提交商标信息小项）', time: '2018-06-26 02:27:58', active: true, id:2},
		{name:'待服务完善', info: '商家完善商标信息）', time: '2018-06-26 02:27:58', active: true, id:3},
		{name:'商家已接单', info: '商家接单', time: '2018-06-26 02:27:58', active: true, id:4},
		{name:'待用户确认信息', info: '客户确认订单（需补小项）', time: '2018-06-26 02:27:58', active: true, id:5},
		{name:'待支付加项费用', info: '客户确认订单（需补小项）', time: '2018-06-26 02:27:58', active: false, id:6},
		{name:'待用户确认信息', info: '服务商提交商标信息小项）', time: '2018-06-26 02:27:58', active: false, id:7},
		{name:'待服务完善', info: '商家完善商标信息）', time: '2018-06-26 02:27:58', active: false, id:8},
		{name:'商家已接单', info: '商家接单', time: '2018-06-26 02:27:58', active: false, id:9},
		{name:'待用户确认信息', info: '客户确认订单（需补小项）', time: '2018-06-26 02:27:58', active: false, id:10},
	]

	export default {
		components: {
			TrademarkEvent,OperationRecord,RateScore,dragDialog,serviceState,agreement,uploadMaterial, CountDown
		},
		data() {
			return {
				indexUrl: indexUrl,
				statusList: statusList,  //服务单状态列表
				uploadVisible: false,
				curItem: {},

				hasConfirmed: false,
				agreementVisible:false,//合同是否显示
				userUrl:userUrl,
				loading:false,
				// 确认按钮防止多次点击
				disabledBool:false,
				cartUrl:cartUrl,
				isToPay: false,
				orderSn:'',
				checked:false,
				preViewImgUrl: '',
				// imgPreViewState: false,
				dialogVisible:false,
				dialogService:false,
				workOrderSn:'',
				infoDetail:{
					subject:{},
					invoice:{},
					information:{},
					orderInformation: {}
				},
				recordData:{},
				imgSrc:'',
				// 营业执照
				usinessLicense:[],
				// 委托书
				powerAttorney:[],
				//身份证
				cardImg:[],
				dialogImg:false,
				certificateImg:[],
				// 申请号
				acceptMaterials:'',
				index:'',
				code:'',
				// 弹框 - 证书 - 预览
				previewImg:false,
				previewSrc:'',
				token:'',
				isScrollToBottom: false,
				urlsData:[],
				cateIdData: intClsData.cateIdData,  //所有商标分类
				checkVisible: false,  //服务验收弹窗
			}
		},
		methods: {
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
				}).catch((err) => {
					if (err.response.status != 500) {
						this.$message({
							message: '操作成功!',
							type: 'success'
						});
					}
				})
			},
			//  返回
			backFn () {
				this.$router.go(-1);
			},
			toBeUpload(){
    		this.curItem = {
    			workOrderSn: this.workOrderSn,
    			applyType: this.infoDetail.subject.applyType
    		};
    		this.uploadVisible = true;
    	},
			previewClick(url){
				this.certificateImg = url
				this.dialogImg = true
				// this.previewImg=!this.previewImg;
			},
			// 去支付
			gopay(){
				this.$router.push({name: 'orderDetail', params: {payment_sn: this.infoDetail.orderInformation.ownedOrderSn }, query:{key: 'orderSn'}})
			},
			certificatePreview(url){
				this.certificateImg = url;
				this.dialogImg = true;
			},
			viewRecord(recordData){
				var self = this;
				// 申请号
				self.acceptMaterials = recordData.acceptMaterials;
				this.$http.get('./api/findBsFeedbackCode?orderSn='+recordData.orderSn).then((response) => {
					self.recordData = response.data;
				})
				.catch((error) => {
					console.log(error)
				});
				this.dialogService = true;
			},
			preview(src){
				this.imgSrc = src;
				this.dialogVisible = true;
			},
			search(isSilent){
				console.log(this.$route.params);
				var self = this;
				if (!isSilent) {
					self.loading = true;
				}
				self.disabledBool = false;
				let params = {
					// workOrderId: self.$route.params.workOrderId,   //工单ID
					orderSn: self.$route.params.workOrderSn  //服务单号
				}
				this.$http.get(orderDetailUrl, {params: params}).then((response) => {
					self.loading = false;
					self.infoDetail = response.data;
					self.recordData = response.data.order_feedback;  //已经完成的流程
					console.log(self.recordData);
					if(self.infoDetail.subject.standby1){
						self.cardUrl(self.infoDetail.subject.standby1);
					}
					if(self.infoDetail.subject.standby2){
						self.imgUrl(self.infoDetail.subject.standby2);
					}
					if(self.infoDetail.information.proxyUrl){
						self.certificateImgUrl(self.infoDetail.information.proxyUrl);
					}
					if (self.infoDetail.status==1) {
						//self.getAgreement();
						self.hasConfirmed = false;
					}else{
						self.hasConfirmed = true;
					}
					this.$nextTick(() => {
						this.$refs.box.scrollTo(0, this.$refs.box.scrollHeight)
					})
				})
				.catch((error) => {
					self.loading = false;
					var err = error.response && error.response.data;
					if (err) {
						self.$message({
							message: err.msg,
							type: 'error'
						});
					}
					// 未生成工单
					if (error.response.data.status == 414) {
						self.$router.go(-1);  //回到列表页
					}
				});
			},
			// 身份证
			cardUrl(url){
				this.$http.get('./api/preview?pdf_url='+url)
				.then((response) => {
					this.cardImg = response.data.urls;
				})
				.catch((error) => {
					console.log(error)
				});
			},
			// 营业执照
			imgUrl(url){
				this.$http.get('./api/preview?pdf_url='+url)
				.then((response) => {
					this.usinessLicense = response.data.urls;
				})
				.catch((error) => {
					console.log(error)
				});
			},
			// 委托书
			certificateImgUrl(url){
				var self = this;
				this.$http.get('./api/preview?pdf_url='+url)
				.then((response) => {
					self.powerAttorney = response.data.urls;
				})
				.catch((error) => {
					console.log(error)
				});
			},
			scrollHandle(e){
				var element = e.target;
				if (this.isScrollToBottom) {return;}
				this.isScrollToBottom = element.clientHeight+1 >= (element.scrollHeight - element.scrollTop);
			},
			closeTop(){
				$('.img_lists').scrollTop(0);
			},
			agree(){
				if (!this.isScrollToBottom) {return;}
				this.agreementVisible = false;
				this.$confirm('商标注册信息一经确认将提交至商标局，且不允许修改。确定提交当前信息吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.confirm();
				}).catch(() => {
				});
			},
			//获取合同协议
			getAgreement(){
				this.$http.get('./api/preview_contract?work_order_sn=' + this.workOrderSn)
				.then((response) => {
					this.urlsData = response.data.urls || [];
				})
				.catch((error) => {
					var err = error.response && error.response.data;
					if (err) {
						this.$message({
							message: err.msg,
							type: 'error'
						});
					}
				});
			},
			beforeConfirm(){
				this.agreementVisible = true;
				this.isScrollToBottom = false;
			},
			confirm(){
				var self = this;
				self.disabledBool = true;
				this.$http.post('./api/confirm',qs.stringify({workOrderSn:this.workOrderSn}))
				.then((response) => {
					self.disabledBool = false;
					this.search(true);
				})
				.catch((error) => {
					self.disabledBool = false;
					var err = error.response && error.response.data;
					if (err) {
						self.$message.error(err.msg);
					}
				});
			}
		},
		mounted() {
			this.workOrderSn = this.$route.params.workOrderSn;
			this.token = this.$cookie.get("user_token");
			this.search();
			// let top = $('#status_box .s_item').eq(3).offset().top - $('#status_box .s_item').eq(0).offset().top;
			// console.log(top);
			// $('#status_box').scrollTop(top);
		},
		filters: {

			format:Filters.formatApplySbj.format,
			priceformat:Filters.priceformat,
			formatDate:Filters.formatDate.dateFormat,
			Formatdate: Filters.formatDate.Formatdate,
			mainBodeSbj:Filters.mainBodeSbj,
			mainBodeNumber:Filters.mainBodeNumber,
			invoiceTypeFormat: Filters.invoiceTypeFormat,
			numToStar: Filters.numToStar,
			ellipsis: Filters.ellipsis,
			imgstate: function (index) {
				var ret = ''
				switch (index+''){
					case '1':
						ret = "黑白色图样";
						break;
					case '2':
						ret = "指定色图样";
						break;
				}
				return ret;
			},
			fileName: function(data){
				var ret = ''
				switch (data+''){
					case '1':
						ret = "申请人身份证";
						break;
					case '2':
						ret = "企业营业执照副本复印件";
						break;
					case '3':
						ret = "申请人护照";
						break;
					case '4':
						ret = "企业登记证件";
						break;
				}
				return ret;
			},
			licenseName: function(data){
				var ret = ''
				switch (data+''){
					case '1':
						ret = "营业执照";
						break;
					case '2':
						ret = "";
						break;
					case '3':
						ret = "中文护照译本";
						break;
					case '4':
						ret = "企业登记证件译本";
						break;
				}
				return ret;
			},
			downFileName: function(data){
				var ret = ''
				switch (data+''){
					case '1':
						ret = "申请回执";
						break;
					case '2':
						ret = "受理通知书";
						break;
					case '3':
						ret = "不予受理通知书";
						break;
					case '4':
						ret = "注册公告";
						break;
					case '5':
						ret = "注册证";
						break;
				}
				return ret;
			}
		},
		watch:{
			dialogService: function(now,val){
				if(!now){
					this.previewImg = false;
				}
			}
		}
	}
</script>
<style lang="scss">
.service_detail {
	.red {color: #f10;}
	padding: 20px;
	.order_info {
		width: 100%; margin-top: 20px;
		.o_num {float: left; font-size: 14px; color: #333;}
		.pay_box {
			float: right;
			.text {
				font-size: 14px; color: #333; margin-right: 10px; vertical-align: middle;
				.red {color: #FF3939;}
			}
		}
	}
	.listHead {min-height: 0;}
	.status_box {
		margin: 20px 0; border: 1px solid #eee; height: 280px;
		.curent_box {
			width: 280px; height: 280px; float: left; border-right: 1px solid #eee; padding-top: 100px;
			.text {font-size: 14px; color: #666; text-align: center;}
			.s_name {color: #3DB1FA; text-align: center; margin-top: 10px; font-size: 18px;}
			.time {font-size: 13px; color: #666; text-align: center; margin-top: 10px;}
		}
		.status_list {
			width: 650px; height: 280px; overflow-y: auto; padding-left: 50px; padding-top: 20px; position: relative;
			&::-webkit-scrollbar { width: 4px; }
			&::-webkit-scrollbar-track {
			  background-color: #eee;
			} /* 滚动条的滑轨背景颜色 */
			&::-webkit-scrollbar-thumb {
			    background-color: #ddd;
			} /* 滑块颜色 */
			&::-webkit-scrollbar-button {
			    background-color: #eee; display:none;
			} /* 滑轨两头的监听按钮颜色 */
			&::-webkit-scrollbar-corner {
			    background-color: black;
			}
			.s_item {
				width: 370px; float: left; font-size: 13px; color: #333; border-left: 1px dashed #ddd; padding: 10px 0 10px 20px; position: relative;
				.name {float: left; width: 200px;}
				.time {float: right;}
				.info {float: left; color: #999; margin-top: 5px;}
				&:before {
					content:''; width: 10px; height: 10px; background: #ddd; border-radius: 50%; position: absolute; left: -5px; top:14px;
				}
				&.active:before {background: #36AF47;}
			}
		}
	}
	.table_service {

  	td.name {
  		padding: 20px; width: 100% !important;
  		.img {
  			width: 90px; height:90px; border: 1px solid #eee; overflow: hidden;
  			img {width: 100%;}
  		}
  		.content {
  			width: 130px; height: 90px; margin-left: 30px; float: left;
  			.s_name {width:100%; overflow: hidden; text-overflow:ellipsis; white-space:nowrap; font-size: 13px; color: #333;}
  			.label_blue {float: left; margin-top:5px;}
  		}
  		.detail {
  			width: 620px; float: left; margin-left: 20px;
  			.d_content {font-size: 13px; color: #333; float: left; width:100%;}
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
  	}
  }
  .info_wrap {
  	margin: 10px 0; border:1px solid #eee; padding: 20px;
		.detail_list{
			border-bottom: 1px dashed #E6E6E6; padding-bottom:10px;
			>p{font-size: 14px;color: #333333;}
			&:last-child {border-bottom: none;}
			.detail_right,.detail_left{width:50%;
				li{
					.left_txt{width:120px;font-size: 13px;color: #666666;text-align:left;}
					.right_txt{width:236px;font-size: 13px;color: #333333;text-align:left;word-break:break-all;}
				}
			}
			.list_left{width:450px;
				li{
					.left_txt{width:120px;font-size: 13px;color: #666666;text-align:left;}
					.right_txt{width:236px;font-size: 13px;color: #333333;text-align:left;word-break:break-all;}
					.text_blue {
						color: #3db1fa; cursor: pointer;
						i {color: #3db1fa;}
					}
				}
			}
			.agreement_info{s
				li{
					width:340px;
					.left_txt{width:120px;font-size: 13px;color: #666666;text-align:left;}
					.right_txt{width:220px;font-size: 13px;color: #333333;text-align:left;word-break:break-all;}
				}
				li.action{
					width:220px;padding-left: 3px;
					a{display:inline-block;margin-right:20px;color:#3db1fa;}
				}
			}
			.list_right{width:410px;text-align:left;padding-left: 60px;
				div{position: relative;width:100px;height:120px;border:1px solid #E6E6E6;border-radius:2px;cursor:pointer;
					img{width:98px;height:118px;}
					p{width:100px;text-align:center;background: rgba(0,0,0,0.6);color:#fff;line-height:26px;font-size:13px;position: absolute;bottom:0;cursor:pointer;left:-1px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
				}
				.right_list{width:340px;
					li{
						.left_txt{width:104px;font-size: 13px;color: #666666;text-align:left;}
						.right_txt{width:236px;font-size: 13px;color: #333333;text-align:left;word-break:break-all;}
					}
				}
			}
		}
  }
  .img_preview{
		.el-carousel{margin:0 auto;padding:45px;
	      .el-carousel__container{margin:0 auto;height:650px;
	        .el-carousel__arrow--right{right:-40px;}
			.el-carousel__arrow--left{left:-40px;}
	        .el-carousel__item{text-align:center;overflow-y: auto;}
	      }
	    }
	}
}

</style>
