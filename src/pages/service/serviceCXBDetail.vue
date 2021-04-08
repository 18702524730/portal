<template>
	<div class="serviceDetail __myOrders" v-loading="loading">
		<h4>服务中心</h4>
		<div class="nav"><router-link :to="'/serviceList'">信息确认</router-link> > 信息详情</div>
		<!-- 基本信息 -->
		<div class="detail_list clearfix" v-if="infoDetail.basicInfo">
			<p class="mb10 mt15">基本信息</p>
			<ul class="list_left fl">
				<li class="mb10 clearfix">
					<p class="left_txt fl">服务名称</p>
					<p class="right_txt fl">{{infoDetail.basicInfo.bsName || ''}}</p>
				</li>
				<li class="mb10 clearfix">
					<p class="left_txt fl">工单状态</p>
					<p class="right_txt fl">{{infoDetail.basicInfo.cxbStatus | cxbStatusF}}</p>
				</li>
				<li class="mb10 clearfix">
					<p class="left_txt fl">下单时间</p>
					<p class="right_txt fl">{{infoDetail.basicInfo.createTime | formatDate}}</p>
				</li>
				<li class="mb10 clearfix">
					<p class="left_txt fl">编号</p>
					<p class="right_txt fl">{{infoDetail.basicInfo.serviceId || '--'}}</p>
				</li>
				<li class="mb10 clearfix">
					<p class="left_txt fl">金额</p>
					<p class="right_txt fl">{{infoDetail.basicInfo.orderAmount | priceformat}}</p>
				</li>
				<li class="mb10 clearfix">
					<p class="left_txt fl">支付时间</p>
					<p class="right_txt fl">{{infoDetail.basicInfo.payTime | formatDate}}</p>
				</li>
			</ul>
		</div>
		<!-- 申报主体 -->
		<div class="detail_list clearfix" v-if="infoDetail.applySubject">
			<p class="mb10 mt15">申请主体</p>
			<ul class="list_left fl">
				<li class="mb10 clearfix">
					<p class="left_txt fl">主体类型</p>
					<p class="right_txt fl">{{infoDetail.applySubject.applyType | format}}</p>
				</li>
				<li class="mb10 clearfix">
					<p class="left_txt fl">{{infoDetail.applySubject.applyType | mainBodeSbj}}名称</p>
					<p class="right_txt fl">{{infoDetail.applySubject.applyName || '--'}}</p>
				</li>
				<li class="mb10 clearfix">
					<p class="left_txt fl">{{infoDetail.applySubject.applyType | mainBodeSbj}}联系电话</p>
					<p class="right_txt fl">{{infoDetail.applySubject.applyPhone || '--'}}</p>
				</li>
				<li class="mb10 clearfix">
					<p class="left_txt fl">{{infoDetail.applySubject.applyType | mainBodeSbj}}邮箱</p>
					<p class="right_txt fl">{{infoDetail.applySubject.applyEmail || '--'}}</p>
				</li>
				<li class="mb10 clearfix">
					<p class="left_txt fl">{{infoDetail.applySubject.applyType | mainBodeSbj}}传真</p>
					<p class="right_txt fl">{{infoDetail.applySubject.applyFax || '--'}}</p>
				</li>
				<li class="mb10 clearfix">
					<p class="left_txt fl">{{infoDetail.applySubject.applyType | mainBodeSbj}}邮编</p>
					<p class="right_txt fl">{{infoDetail.applySubject.applyZipCode || '--'}}</p>
				</li>
				<li class="mb10 clearfix">
					<p class="left_txt fl">{{infoDetail.applySubject.applyType | mainBodeSbj}}注册地址</p>
					<p class="right_txt fl">{{infoDetail.applySubject.applyAddress || '--'}}</p>
				</li>
			</ul>
			<div class="list_right fl">
				<div class="fr" v-if="usinessLicense[0]&&infoDetail.applySubject.applyType != 2" @click="certificatePreview(usinessLicense)">
					<img :src="usinessLicense[0]" alt="">
					<p :title="infoDetail.applySubject.applyType | licenseName">{{infoDetail.applySubject.applyType | licenseName}}</p>
				</div>
				<div class="fr mr20" v-if="cardImg[0]" @click="certificatePreview(cardImg)">
					<img :src="cardImg[0]" alt="">
					<p :title="infoDetail.applySubject.applyType | fileName">{{infoDetail.applySubject.applyType | fileName}}</p>
				</div>
			</div>
		</div>
		<!-- 联系人信息 -->
		<div class="detail_list clearfix" v-if="infoDetail.contactInfo">
			<p class="mb10 mt15">联系人信息</p>
			<ul class="list_left fl">
				<li class="mb10 clearfix">
					<p class="left_txt fl">联系人姓名</p>
					<p class="right_txt fl">{{infoDetail.contactInfo.contactName || "--"}}</p>
				</li>
				<li class="mb10 clearfix">
					<p class="left_txt fl">联系人邮箱</p>
					<p class="right_txt fl">{{infoDetail.contactInfo.contactEmail || '--'}}</p>
				</li>
				<li class="mb10 clearfix">
					<p class="left_txt fl">联系人地址</p>
					<p class="right_txt fl">{{infoDetail.contactInfo.contactAddress || '--'}}</p>
				</li>
			</ul>
			<ul class="list_left fl">
				<li class="mb10 clearfix">
					<p class="left_txt fl">联系人电话</p>
					<p class="right_txt fl">{{infoDetail.contactInfo.contactPhone}}</p>
				</li>
				<li class="mb10 clearfix">
					<p class="left_txt fl">联系人邮编</p>
					<p class="right_txt fl">{{infoDetail.contactInfo.contactZipCode || '--'}}</p>
				</li>
			</ul>
		</div>
		<!-- 开票信息 -->
		<!-- <div class="detail_list clearfix">
			<p class="mb10 mt15">开票信息</p>
			<ul class="list_left fl" v-if="infoDetail.invoiceInfo">
				<li class="mb10 clearfix" v-if="infoDetail.invoiceInfo.invoiceType">
					<p class="left_txt fl">发票类型</p>
					<p class="right_txt fl">{{infoDetail.invoiceInfo.invoiceType | invoiceTypeFormat}}</p>
				</li>
				<li class="mb10 clearfix">
					<p class="left_txt fl">发票抬头</p>
					<p class="right_txt fl">{{infoDetail.invoiceInfo.invoiceTitle || '--'}}</p>
				</li>
				<li class="mb10 clearfix">
					<p class="left_txt fl">收件人地址</p>
					<p class="right_txt fl">{{infoDetail.invoiceInfo.address || '--'}}</p>
				</li>
				<li class="mb10 clearfix" v-if="infoDetail.invoiceInfo.invoiceType == 2 && infoDetail.applySubject.applyType == 2">
					<p class="left_txt fl">开户银行</p>
					<p class="right_txt fl">{{infoDetail.invoiceInfo.accountBank || '--'}}</p>
				</li>
			</ul>
			<ul class="list_left fl" v-else>
				<li class="mb10 clearfix">
					<p class="left_txt fl">未申请发票</p>
				</li>
			</ul>
			<div class="list_right fl" v-if="infoDetail.invoiceInfo && infoDetail.invoiceInfo.invoiceType">
				<ul class="right_list">
					<li class="mb10 clearfix" v-if="infoDetail.applySubject.applyType == 2">
						<p class="left_txt fl">纳税人识别号</p>
						<p class="right_txt fl">{{infoDetail.invoiceInfo.invoiceCode || '--'}}</p>
					</li>
					<li class="mb10 clearfix" v-if="infoDetail.invoiceInfo.invoiceType == 2 && infoDetail.applySubject.applyType == 2">
						<p class="left_txt fl">{{infoDetail.applySubject.applyType | mainBodeSbj}}联系电话</p>
						<p class="right_txt fl">{{infoDetail.invoiceInfo.registPhone || '--'}}</p>
					</li>
					<li class="mb10 clearfix" v-if="infoDetail.invoiceInfo.invoiceType == 2 && infoDetail.applySubject.applyType == 2">
						<p class="left_txt fl">银行账号</p>
						<p class="right_txt fl">{{infoDetail.invoiceInfo.accountNumber || '--'}}</p>
					</li>
					<li class="mb10 clearfix" v-if="infoDetail.invoiceInfo.invoiceType == 2 && infoDetail.applySubject.applyType == 2">
						<p class="left_txt fl">是否寄送</p>
						<p class="right_txt fl">{{infoDetail.invoiceInfo.sendState == 1 ? '寄送' : infoDetail.invoiceInfo.sendState == 2 ? '不寄送' : ''}}</p>
					</li>
				</ul>
			</div>
		</div> -->
		<!-- 合同信息 -->
		<!-- <div class="detail_list clearfix" v-if="infoDetail.contract && infoDetail.contract.confirm_time">
			<p class="mb10 mt15">合同信息</p>
			<ul class="agreement_info">
				<li class="fl mb10 clearfix">
					<p class="left_txt fl">合同编号</p>
					<p class="right_txt fl">{{infoDetail.contract.work_order_sn}}</p>
				</li>
				<li class="fl mb10 clearfix">
					<p class="left_txt fl">确认时间</p>
					<p class="right_txt fl">{{infoDetail.contract.confirm_time | formatDate}}</p>
				</li>
				<li class="fl mb10 clearfix action">
					<a href="#" @click.prevent="agreementVisible=true">查看</a><a v-if="infoDetail.contract.contract_url" :href="userUrl + '/api/download_contract?contract_url=' + infoDetail.contract.contract_url" target="_blank">下载</a>
				</li>
			</ul>
		</div> -->
		<!-- 商标注册信息 -->
		<div class="detail_list clearfix" v-if="infoDetail.trademarkInfo">
			<p class="mb10 mt15">注册商标信息</p>
			<ul class="list_left fl">
				<li class="mb10 clearfix">
					<p class="left_txt fl">商标名称</p>
					<p class="right_txt fl">{{infoDetail.trademarkInfo.trademarkName}}</p>
				</li>
				<li class="mb10 clearfix">
					<p class="left_txt fl">图样类别</p>
					<p class="right_txt fl">{{infoDetail.trademarkInfo.picType | imgstate}}</p>
				</li>
				<li class="mb10 clearfix">
					<p class="left_txt fl">商标描述</p>
					<p class="right_txt fl">{{infoDetail.trademarkInfo.trademarkDesc}}</p>
				</li>
				<li class="mb10 clearfix">
					<p class="left_txt fl">合同书</p>
					<a class="right_txt fl" v-if="infoDetail.trademarkInfo.contract" :href="infoDetail.trademarkInfo.contractUrl" target="_blank">下载</a>
					<p class="right_txt fl" v-else>未上传</p>
				</li>
				<li class="mb10 clearfix">
					<p class="left_txt fl">确认书</p>
					<a class="right_txt fl" v-if="infoDetail.trademarkInfo.confirm" :href="infoDetail.trademarkInfo.confirmUrl" target="_blank">下载</a>
					<p class="right_txt fl" v-else>未上传</p>
				</li>
				<li class="mb10 clearfix">
					<p class="left_txt fl">委托书</p>
					<a class="right_txt fl" v-if="infoDetail.trademarkInfo.proxy" :href="infoDetail.trademarkInfo.proxyUrl" target="_blank">下载</a>
					<p class="right_txt fl" v-else>未上传</p>
				</li>
			</ul>
			<div class="list_right fl clearfix">
				<div class="fr" v-if="infoDetail.trademarkInfo.blackWhitePicUrl" @click="preview(infoDetail.trademarkInfo.blackWhitePicUrl)">
					<img :src="infoDetail.trademarkInfo.blackWhitePicUrl" alt="">
					<p title="黑白色">黑白色</p>
				</div>
				<div class="fr mr20" v-if="infoDetail.trademarkInfo.specifyPicUrl" @click="preview(infoDetail.trademarkInfo.specifyPicUrl)">
					<img :src="infoDetail.trademarkInfo.specifyPicUrl" alt="">
					<p title="指定色">指定色</p>
				</div>
			</div>
		</div>
		<!-- 商标分类 -->
		<trademark-event  v-on:viewRecord="viewRecord" :orderInformation="infoDetail.trademarkInfo.trademarkCategories" :cxbStatus="cxbStatus"></trademark-event>

		<div class="btn_footer mt15">
			<button class="btn_left" @click="$router.go(-1)">返回</button>
			<!-- <button class="btn_right ml10" @click="beforeConfirm" :disabled="disabledBool">确认</button> -->
			<button class="btn_right ml10" @click="beforeConfirm" :disabled="disabledBool" v-if="infoDetail.status==1">确认</button> <!--   -->
			<button class="btn_right ml10" @click="gopay" v-if="infoDetail.status==2">去付款</button> <!--  -->
		</div>
		<!-- 图片预览 -->
		<el-dialog
			:visible.sync="dialogVisible"
			size="tiny" class="img_preview" :modal-append-to-body="true">
			<img :src="imgSrc" alt="">
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
		<el-dialog
			:visible.sync="dialogService" title="服务记录"
			size="tiny" class="service_preview_cxb" :modal-append-to-body="true">
			<service-state v-if="dialogService" @previewClick="previewClick" :previewImg='previewImg' :recordData='recordData' :order_id="order_id"></service-state>
		</el-dialog>

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
		<!-- 评分模块 -->
		<rate-score v-if="isToPay" :isToPay.sync="isToPay" :orderSn="orderSn" @refresh="search(true)"></rate-score>
	</div>
</template>
<script>
	import Vue from 'vue'
	import $ from 'jquery'
	import TrademarkEvent from './components/trademarkEvents.vue'
	import OperationRecord from './components/operation.vue'
	import RateScore from './components/RateScore.vue'
	import serviceState from './components/serviceStateCxb.vue'
	import dragDialog from 'components/dialog/dialog.vue'
	import agreement from './components/agreement.vue'
	import Filters from 'api/filters.js'
	import qs from 'qs'
	const cartUrl = CONFIG.cartUrl;
	const userUrl = CONFIG.userUrl;
	export default {
		components: {
			TrademarkEvent,OperationRecord,RateScore,dragDialog,serviceState,agreement
		},
		data() {
			return {
				cxbStatus: '',
				workOrderSn:'',
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

				dialogVisible:false,
				dialogService:false,
				infoDetail:{
					applySubject:{},
					invoiceInfo:{},
					trademarkInfo:{},
					contactInfo:{},
					basicInfo:{}
				},
				recordData:{},
				imgSrc:'',
				// 营业执照
				usinessLicense:[],
				//身份证
				cardImg:[],
				dialogImg:false,
				certificateImg:[],
				index:'',
				code:'',
				// 弹框 - 证书 - 预览
				previewImg:false,
				previewSrc:'',
				token:'',
				isScrollToBottom: false,
				urlsData:[],
				order_id:''
			}
		},
		methods: {
			previewClick(){
				this.previewImg=!this.previewImg;
			},
			// 去支付
			gopay(){
				this.isToPay = true;
				this.orderSn = this.infoDetail.order_fictitious_sn;
			},
			certificatePreview(url){
				this.certificateImg = url;
				this.dialogImg = true;
			},
			viewRecord(recordData){
				var self = this;
				this.order_id = recordData.orderId;
				this.$http.get('./api/findBsFeedbackCode?orderSn='+recordData.orderSn).then((response) => {
					self.recordData = response.data;
					this.dialogService = true;
				})
				.catch((error) => {
					console.log(error)
				});
			},
			preview(src){
				this.imgSrc = src;
				this.dialogVisible = true;
			},
			search(isSilent){
				var self = this;
				if (!isSilent) {
					self.loading = true;
				}
				self.disabledBool = false;
				this.$http.get('./api/findCxbWorkOrderDetail?workOrderSn='+this.workOrderSn).then((response) => {
					self.loading = false;
					self.infoDetail = response.data;
					if(self.infoDetail.applySubject.standby1){
						self.cardUrl(self.infoDetail.applySubject.standby1);
					}
					if(self.infoDetail.applySubject.standby2){
						self.imgUrl(self.infoDetail.applySubject.standby2);
					}
					if (self.infoDetail.operState==1) {
						//self.getAgreement();
						self.hasConfirmed = false;
					}else{
						self.hasConfirmed = true;
					}
					self.cxbStatus = self.infoDetail.cxbStatus;
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
			scrollHandle(e){
				var element = e.target;
				if (this.isScrollToBottom) {return;}
				this.isScrollToBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
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
			//this.agreementVisible = true;
		},
		filters: {
			format:Filters.formatApplySbj.format,
			priceformat:Filters.priceformat,
			formatDate:Filters.formatDate.dateFormat,
			mainBodeSbj:Filters.mainBodeSbj,
			mainBodeNumber:Filters.mainBodeNumber,
			invoiceTypeFormat:Filters.invoiceTypeFormat,
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
						ret = "个体工商户营业执照";
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
			},
			cxbStatusF: Filters.cxbStatus
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
.serviceDetail{font-size:13px;padding: 15px 20px 20px;
	h4{height: 26px;line-height: 26px;font-weight: normal;font-size: 16px;padding-left:0;}
	.nav{margin-top:8px;border-bottom: 1px solid #E6E6E6;padding-bottom: 10px;
		a{color: #3db1fa;}
	}
	.detail_list{border-bottom: 1px solid #E6E6E6;padding-bottom:10px;
		>p{font-size: 14px;color: #333333;}
		.list_left{width:495px;
			li{
				.left_txt{width:120px;font-size: 13px;color: #666666;text-align:left;}
				.right_txt{width:375px;font-size: 13px;color: #333333;text-align:left;word-break:break-all;}
				a.right_txt{color:#3db1fa;text-decoration:none;width:30px;}
			}
		}
		.agreement_info{
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
		.list_right{width:410px;text-align:left;padding-left: 70px;
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
	// 商标分类
	.eventsLists{
		>p{font-size: 14px;color: #333333;}
		.td01{width:170px;padding-left:20px;vertical-align: middle;text-align:left;}
		.td02{width:133px;text-align:left;}
		.td03{width:90px;padding-right: 45px;text-align:right;}
		.td04{width:386px;text-align:left;}
		.td05{width:124px;padding-right: 20px;text-align:right;}
	}
	.eventsConfirm{
		>p{font-size: 14px;color: #333333;}
		.td01{width:145px;padding-left:20px;vertical-align: middle;text-align:left;}
		.td02{width:117px;text-align:left;}
		.td03{width:75px;padding-right:20px;text-align:right;}
		.td04{width:280px;text-align:left;}
		.td05{width:90px;text-align:right;padding-left:20px;}
		.td06{width:210px;text-align:right;
			p{padding-right: 20px;}
		}
		.td07{width:120px;text-align:left;padding-left:20px;}
	}
	// 弹框
	.state_list{
		.state_time{margin-top: -10px;
			p{
				span{font-size:16px;color:#D8D8D8;}
			}
			a{text-decoration:none;font-size: 13px;color: #999999;cursor:pointer;}
			a:hover{color: #3DB1FA;}
			i{border-left:1px dashed #ddd;height:23px;display:block;margin-top: -8px;margin-left: 4px;}
		}
		.state_time:first-child{margin-top: 0}
		.change_providers{
			img{width:70px;}
			.change_txt{
				span{font-size: 14px;color: #333333;}
				p{font-size: 13px;color: #666666;line-height:19px;
					img{width:18px;vertical-align: top;}
					a{text-decoration:none;cursor:pointer;color:#3db1fa;}
				}
			}
		}
	}
	.preview_tit{
		p{cursor:pointer;
			img{vertical-align: top;margin-right:7px;}
		}
	}
	.img_preview{text-align:center;
		img{width:700px;}
	}
	// 操作记录
	.operation{
		>p{font-size: 14px;color: #333333;}
		.td01{width:202px;text-align:left;}
		.td02{width:323px;text-align:left;}
		.td03{width:380px;text-align:left;}
	}
	.events_beyond{border: 1px solid #E6E6E6;border-radius: 2px;
		p{font-size: 13px;color: #333333;line-height:40px;}
		.right{
			span{color: #f64744;}
		}
	}
	.agreement{text-align:center;
		label{color:#666;
			a{text-decoration:none;}
		}
	}
	.btn_footer{text-align:center;
		button{width:100px;height:40px;}
		.btn_left{border: 1px solid #E6E6E6;border-radius: 3px;font-size: 14px;color: #666666;}
		.btn_right{background: #3DB1FA;border-radius: 3px;color:#fff;font-size: 14px;}
	}
	// 预览
	.img_preview{
		.el-dialog--tiny{width:940px;
			img{width:900px;}
		}
		.el-dialog__body{
			padding: 0px 20px;
		}
	}
	.el-dialog__wrapper{overflow: auto;}

	.img_preview{

		.el-carousel{margin:0 auto;width:810px;padding:45px;
	      .el-carousel__container{margin:0 auto;height:650px;
	        .el-carousel__arrow--right{right:-40px;}
			.el-carousel__arrow--left{left:-40px;}
	        .el-carousel__item{text-align:center;width:720px;overflow-y: auto;
	          img{width:720px;}
	        }
	      }
	    }
	}

	.dragDialog{
		.popup{
			width: 900px;height: 678px;
			.img_lists{
				width: 880px;height: 500px;margin-left:20px;overflow-y: scroll;border:1px solid #eee;border-radius:3px;
			}
			.heigher{height: 550px;}
			.bt_btn{
				text-align:center;font-size: 14px;color: #666666;
				p{padding:20px 0;}
				a{width: 80px;height: 34px;line-height:34px;background: #FFFFFF;border:1px solid #ddd;display: inline-block;color:#666;border-radius:3px;}
				a:hover{text-decoration:none;}
				a.confirm{width: 104px;background: #20A0FF;border:1px solid #20A0FF;margin-left: 15px;color:#fff;}
				a.disabled{background-color: #ccc;border:1px solid #ccc;cursor:not-allowed}
			}
		}
	}
	.el-dialog{-ms-transform: translateX(0%) !important;transform: translateX(0%) !important;margin-left: -470px;}
}
</style>
