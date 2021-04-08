<template>
	<div id="address">
		<div class="cz_detail">
			<!-- <div class="addressTitle"> -->
				<h4 class="navTitle">存证详情
					<span class="back_box">
		  			<i @click="toOld" class="fa fa-angle-left" aria-hidden="true"></i>
		  			<span class="text" @click="toOld">返回</span>
		  		</span>
	  		</h4>
				<!-- <p v-if="czType=='2'" class="addressHref"><router-link :to="'/myczlist?cztype=2'">文件存证&nbsp;</router-link>>存证详情</p> -->
				<!-- <p v-if="czType=='1'" class="addressHref"><router-link :to="'/myczlist?cztype=1'">网页存证&nbsp;</router-link>>存证详情</p> -->
		 	<!-- </div> -->
		 	<div v-loading="loading">
			 	<div v-if="!errorResult">
				 	<div class="weblist clearfix">
						<div class="czInfo" v-if="czdetail.issueDTO && czdetail.issueDTO.issueStatusName">
							<div class="title">
								<span>申请出证订单号：{{czdetail.issueDTO.orderNum}}</span><span>申请出证时间：{{czdetail.issueDTO.createTime|dateFormat}}</span>
							</div>
							<!-- 撤销中或已撤销 -->
							<div v-if="czdetail.issueDTO.issueStatus==6 || czdetail.issueDTO.issueStatus==8 || czdetail.issueDTO.issueStatus==9" class="body_cx">
								<span>出证机构：<b>{{czdetail.issueDTO.orgName}}</b></span>
								<p><span>您本次的申办<b>已终止</b></span><span>原因为：<b>申请撤销</b></span></p>
							</div>
							<template v-else>
								<div class="body" :class="{noRightBorder: czdetail.issueDTO.issueStatus>3}">
									<span>出证机构：<b>{{czdetail.issueDTO.orgName}}</b></span>
									<span>出证状态：<b>{{czdetail.issueDTO.issueStatusName}}</b></span>
									<span>联系电话：<b>{{czdetail.issueDTO.phone}}</b>（请保持电话畅通）</span>
								</div>
								<a href="#" class="cancelCz" @click.prevent="giveUp=true" v-if="czdetail.issueDTO.issueStatus<4">撤销出证</a>
							</template>
						</div>
						<!-- 司法，公正云显示内容限制未确认 -->
						<ul class="fl">
							<li><span v-if="czType=='1'" class="czname">存证网址：</span><span v-if="czType=='2'" class="czname">存证文件：</span><span class="cztxt">{{czdetail.fileName}}</span></li>
							<li><span class="czname">存证渠道：</span><span class="cztxt">{{czdetail.czChannel|czChannelFormat}}</span></li>
							<li v-if="czType=='2'&&czdetail.czChannel!=1&&czdetail.czChannel!=5"><span class="czname">作品名称：</span><span class="cztxt">{{czdetail.productionName}}</span></li>
							<li v-if="czType=='1'"><span class="czname">存证种类：</span><span class="cztxt">{{czdetail.notarizationPurpose|notarizationUsesformat}}</span></li>
							<li v-if="czType=='1'&&czdetail.czChannel=='6'"><span class="czname">取证名称：</span><span class="cztxt">{{czdetail.productionName}}</span></li>
							<li v-if="czType=='2'"><span class="czname">作品种类：</span><span class="cztxt">{{czdetail.notarizationPurpose|notarizationPurposeFilter}}</span></li>
							<li v-if="czType=='2'&&czdetail.czChannel!=1&&czdetail.czChannel!=5"><span class="czname">作品署名：</span><span class="cztxt">{{czdetail.productionSign}}</span></li>
							<li v-if="czType=='2'&&czdetail.czChannel!=1&&czdetail.czChannel!=5&&czdetail.clientType == 2"><span class="czname">作品类型：</span><span class="cztxt">{{czdetail.productionLeixin|productQy}}</span></li>
							<li v-if="czType=='2'&&czdetail.czChannel!=1&&czdetail.czChannel!=5&&czdetail.clientType == 5"><span class="czname">作品类型：</span><span class="cztxt">{{czdetail.productionLeixin|product}}</span></li>
							<li v-if="czType=='2'"><span class="czname">权利取得：</span><span class="cztxt">原始取得</span></li>
							<li v-if="czType=='2'&&czdetail.czChannel!=1&&czdetail.czChannel!=5"><span class="czname">创作时间：</span><span class="cztxt">{{czdetail.productionTime|format}}</span></li>
							<!-- <li v-if="czdetail.czChannel!=1&&czdetail.czChannel!=5"><span class="czname">修改次数：</span><span class="cztxt">{{czdetail.updateCishu || '0'}}次</span></li> -->
							<li v-if="czType=='2'&&czdetail.czChannel!=1&&czdetail.czChannel!=5"><span class="czname">发表状态：</span><span class="cztxt">{{czdetail.publishState|publishQy}}</span></li>
							<li v-if="czType=='2'"><span class="czname">存证申请时间：</span><span class="cztxt">{{czdetail.createTime|dateFormat}}</span></li>
							<li><span class="czname">存证完成时间：</span><span class="cztxt">{{czdetail.updateTime|dateFormat}}</span></li>
							<li><span class="czname">存证到期时间：</span><span class="mr20">{{czdetail.validTime|dateFormat}}</span>
							<!-- 所有和续费相关的都取消 -->
								<!-- <a v-if="!czdetail.usedCzb" href="javascript:;" @click="renewalclick(czdetail)">续费</a> -->
								<!-- <span v-if="czdetail.usedCzb" style="color:#999">续费</span> -->
							</li>
							<template v-if="czdetail.clientType == 2">
								<li><span class="czname">企业名称：</span><span class="cztxt">{{czdetail.name}}</span></li>
								<li><span class="czname">社会统一信用代码：</span><span class="cztxt">{{czdetail.identificationCard}}</span></li>
							</template>
							<template v-else>
								<li><span class="czname">申请人：</span><span class="cztxt">{{czdetail.name}}</span></li>
								<li><span class="czname">申请人身份证：</span><span class="cztxt">{{czdetail.identificationCard}}</span></li>
							</template>
						</ul>
						<div class="imgSrc fr mr40 mt30">
							<a v-if="czdetail.czChannel==6" :href="czUrl+'/cunnar/managerDownCunnarFile.do?fileId='+czdetail.fileId+'&preview=1&downType=3'" target="_blank">
								<p>
									<img width="140px" height="180px" src="~assets/img/groupGzs.png" alt="">
								</p>
								<span>互联网公证存证函</span>
							</a>
							<a v-if="czdetail.czChannel==3||czdetail.czChannel==4" :href="czUrl+'/cunnar/managerDownCunnarFile.do?fileId='+czdetail.fileId+'&preview=1&downType=3'" target="_blank">
								<p>
									<img width="140px" height="180px" src="~assets/img/GroupGz.png" alt="">
								</p>
								<span>公证电子数据存证函</span>
							</a>
							<a v-if="czdetail.czChannel==1||czdetail.czChannel==5" :href="czUrl+'/cunnar/managerDownCunnarFile.do?fileId='+czdetail.fileId+'&preview=1&downType=1'" target="_blank">
								<p>
									<img width="140px" height="180px" src="~assets/img/GroupSf.png" alt="">
								</p>
								<span>司法电子数据存证函</span>
							</a>
							<a class="mt20" v-if="czdetail.czChannel==2||czdetail.czChannel==4||czdetail.czChannel==5" :href="czUrl+'/cunnar/managerDownCunnarFile.do?fileId='+czdetail.fileId+'&preview=1&downType=2'" target="_blank">
								<p>
									<img width="140px" height="180px" src="~assets/img/GroupQkl.png" alt="">
								</p>
								<span>区块链电子数据存证函</span>
							</a>
						</div>
						<div class="webhref" v-if="!czdetail.validTime || czdetail.validTime>newdate">
							<a class="web_other" :href="czUrl + '/cunnar/downSaveFile.do?fileId=' + czdetail.fileId" target="_blank"><el-button size="small">{{czdetail.notarizationType==2 ? "下载文件" : "下载截图"}}</el-button></a>
							<a v-if="czdetail.czChannel==1||czdetail.czChannel==5" class="web_other" :href="czUrl + '/cunnar/downCunnarFile.do?fileId=' + czdetail.fileId +'&preview=0&downType=1'" target="_blank"><el-button size="small">下载司法保管函</el-button></a>
							<a v-if="czdetail.czChannel==3||czdetail.czChannel==4||czdetail.czChannel==6" class="web_other" :href="czUrl + '/cunnar/downCunnarFile.do?fileId=' + czdetail.fileId +'&preview=0&downType=3'" target="_blank"><el-button size="small">下载公证保管函</el-button></a>
							<a class="web_other" v-if="czdetail.czChannel==2||czdetail.czChannel==4||czdetail.czChannel==5" :href="czUrl + '/cunnar/downCunnarFile.do?fileId=' + czdetail.fileId +'&preview=0&downType=2'" target="_blank"><el-button size="small">下载区块链保管函</el-button></a>
							<!-- <a v-if="(czType=='2'&&czdetail.czChannel==3 && !czdetail.issueDTO) || (czType=='2'&&czdetail.czChannel==4 && !czdetail.issueDTO)" class="web_other" href="#" @click.prevent="czApply"><el-button size="small">申请出证</el-button></a> -->
							<a v-if="(czdetail.czChannel==3 && !czdetail.issueDTO) || (czdetail.czChannel==4 && !czdetail.issueDTO)" class="web_other" href="#" @click.prevent="czApply"><el-button size="small">申请出证</el-button></a>
							<a v-if="(czdetail.czChannel==6 && !czdetail.issueDTO)" class="web_other" href="#" @click.prevent="internetczApply"><el-button size="small">申请出证</el-button></a>
							<span class="spctips" v-if="isDownload">注：由于相关存证数据需要进行区块链上链，如果公证保管函下载失败请稍后重试</span>
						</div>
					</div>

					<div class="webhref" v-if="czdetail.validTime && czdetail.validTime<=newdate">
						<a class="downnot" href="javascript:;">已过期</a>
					</div>
			 </div>
			 <noResult v-if="errorResult || czdetail.status"></noResult>
			 </div>
		</div>
		<!-- 撤消出证 -->
		<el-dialog title="提示" width="400px" :visible.sync="giveUp" custom-class="dialog_giveUpCer" :close-on-click-modal="false">
			<div class="progress_detail">
				<p>您确定要撤销出证吗？</p>
				<div class="bt_btn">
					<el-button size="small" @click="giveUp=false">取消</el-button>
					<el-button size="small" type="primary" @click="giveUpCz">确认</el-button>
				</div>
			</div>
		</el-dialog>
		<el-dialog :visible.sync="internetVisible" width="520px" title="申请出征">
			<div class="internetwindow">
				<p>您好，现阶段通过线下方式进行出证，杭州互联网公证处知识产权服务平台</p>
				<!-- <p></p> -->
				<p>联系人：沈女士</p>
				<p>联系电话：0571-87831923</p>
				<div class="bt_btn">
					<button @click.prevent="internetVisible = false">确定</button>
				</div>
			</div>
		</el-dialog>

		<!-- 申请出证 -->
		<el-dialog :title="czTitle" width="560px" :visible.sync="applyCerVisible" :custom-class="czStep == 3 ? 'dialog_applyCer dialog_applyCer_success' : 'dialog_applyCer'" :close-on-click-modal="false">
			<div class="pop_window">
				<div class="_detail" v-if="czStep == 1">
					<img src="~assets/img/cz/steps.png">
					<p class="mt15">当事人向公证处申办公证，应如实告知所申请办理公证事项的有关情况，提供真实、合法、充分的证明材料。当事人在网上上传的相关证明材料的原件需要在领取公证书之日向公证处公证人员出示并核对。根据《中华人民共和国公证法》、《公证程序规则》等有关规定，当事人提供虚假证明材料骗取公证书的，将可能依法被追究民事责任、行政责任，甚至刑事责任。如当事人虚构、隐瞒事实，或者提供虚假证明材料；提供的证明材料不充分或者拒绝补充证明材料；申请公证的事项不真实、不合法或是拒绝按照规定支付公证费等，本处将不予办理公证。不予办理公证的，公证处将根据不予办理的原因及责任，酌情退还部分或者全部收取的公证费。</p>
					<h4 class="mt20"><span>●</span>审核时长（公证处审核申办是否符合公证要求）</h4>
					<p class="time">约3个工作日</p>
					<h4 class="mt15"><span>●</span>受理时长（审核通过后受理公证申请）</h4>
					<p class="time">约2个工作日</p>
					<h4 class="mt15"><span>●</span>其它</h4>
					<p class="other">您申请办理的公证事项在通过公证处的审核后，公证处会与您及时取得电话联系。与您确定出证的其他事宜，请您保持电话畅通。</p>
					<p class="other"><b>注：出证申请仅允许申请一次。</b></p>
					<div class="contact">
						<span>办证点：厦门市后埭溪路28号皇达大厦16层</span>
						<span>电话：0592-5185188</span>
					</div>
					<div class="agree mb15"><el-checkbox v-model="isChecked">我已阅读并同意<a :href="czUrl + '/notarization/pages/czAgreement.html'" target="_blank">《拾贝网用户存证服务协议》</a>和《出证须知》</el-checkbox></div>
					<a class="renewal-pay" @click="next(1)"><el-button size="small" type="primary">下一步</el-button></a>
				</div>
				<div class="_confirmInfo" v-if="czStep == 2">
					<el-form :model="confirmForm" :rules="rules" ref="confirmForm" label-width="110px" label-position="left" class="confirmForm">
						<h3>申请出证文件信息</h3>
						<p>
							<label>存证文件</label><span>{{czdetail.fileName}}</span>
						</p>
						<p>
							<label>存证渠道</label><span>{{czdetail.czChannel|czChannelFormat}}</span>
						</p>
						<p>
							<label>作品名称</label><span>{{czdetail.productionName}}</span>
						</p>
						<p v-if="czType=='1'">
							<label>作品种类</label><span>{{czdetail.notarizationPurpose|notarizationUsesformat}}</span>
						</p>
						<p v-if="czType=='2'">
							<label>作品种类</label><span>{{czdetail.notarizationPurpose|notarizationPurposeFilter}}</span>
						</p>
						<p>
							<label>作品署名</label><span>{{czdetail.productionSign}}</span>
						</p>
						<p v-if="czdetail.clientType == 2">
							<label>作品类型</label><span>{{czdetail.productionLeixin|productQy}}</span>
						</p>
						<p v-if="czdetail.clientType == 5">
							<label>作品类型</label><span>{{czdetail.productionLeixin|product}}</span>
						</p>
						<p>
							<label>权利取得</label><span>原始取得</span>
						</p>
						<p>
							<label>创作时间</label><span>{{czdetail.productionTime|format}}</span>
						</p>
						<!-- <p>
							<label>修改次数</label><span>{{czdetail.updateCishu || '0'}}次</span>
						</p> -->
						<p>
							<label>发表状态</label><span>{{czdetail.publishState|publishQy}}</span>
						</p>
						<p>
							<label>存证申请时间</label><span>{{czdetail.createTime|dateFormat}}</span>
						</p>
						<p>
							<label>存证完成时间</label><span>{{czdetail.updateTime|dateFormat}}</span>
						</p>
						<p>
							<label>存证到期时间</label><span>{{czdetail.validTime|dateFormat}}</span>
						</p>
						<template v-if="czdetail.clientType == 2">
							<h3 style="margin-top:15px;">申请主体信息</h3>
							<p>
								<label>申请主体</label><span>{{czdetail.name}}</span>
							</p>
							<p>
								<label>统一社会信用代码</label><span>{{czdetail.identificationCard}}</span>
							</p>
						</template>
						<template v-if="czdetail.clientType == 5">
							<h3 style="margin-top:15px;">申请人信息</h3>
							<p>
								<label>申请人</label><span>{{czdetail.name}}</span>
							</p>
							<p>
								<label>申请人身份证</label><span>{{czdetail.identificationCard}}</span>
							</p>
						</template>
						<!--
						<el-form-item label="申请人联系电话" class="phone_form_item" prop="phone" required >
							<el-input v-model="confirmForm.phone" placeholder="请输入申请人联系电话"></el-input>
						</el-form-item>
						 -->
						<div class="bt_btn">
							<el-button size="small" @click.prevent="czStep = 1" class="mt10">上一步</el-button>
							<el-button size="small" type="primary" @click.prevent="czSubmit" class="mt10">提交</el-button>
							<!-- <button class="prev" @click.prevent="czStep = 1">上一步</button>
							<button class="sub" @click.prevent="czSubmit">提交</button> -->
						</div>
					</el-form>
				</div>
				<div class="_success" v-if="czStep == 3">
					<div class="info"><img src="~assets/img/cz/ok.png">提交成功</div>
					<p style="text-align:left;">尊敬的"{{czdetail.name}}"：<br>您的出证已申请成功，在线申办订单号为：<b>{{czdetail.issueDTO.orderNum}}</b></p>
					<p style="text-align:left;" class="tip">公证处将在3个工作日内完成对本次申办的审核并通知您结果。如有疑问，可拨打电话 0592-5185188取得帮助。</p>
					<div class="bt_btn">
						<button @click.prevent="applyCerVisible = false">确定</button>
					</div>
				</div>
			</div>
		</el-dialog>
		<!-- 续费 -->
		<el-dialog title="存证续费" width="400px" :visible.sync="renewal" custom-class="dialog-renewal">
			<div class="pop_window" v-if="czdata">
				<div class="renewal_detail">
					<div class="renewal-list">
						<p class="renewal-time">续费年限：<span>1年</span></p>
						<p class="renewal-number" v-if="czDatanum>0">剩余存证可抵扣次数：{{czDatanum}}次</p>
						<p v-if="czDatanum==0" class="renewal-number">存证续费金额：2.00元</p>
					</div>
					<div class="renewal_txt mb10">
						<p>注意：</p>
						<p>1、存证过期后将失去法律效力，请及时续费。</p>
						<p>2、推荐使用存证包抵扣，更划算便捷。</p>
					</div>
					<a @click="renewal=false"><el-button size="small" type="primary">取消</el-button></a>
					<!-- <a class="renewal-pay" @click="czOtherPay"><el-button :disabled="isDisabled" size="small" type="primary">{{czDatanum == 0?"确认支付":"在线支付"}}</el-button></a> -->
					<a v-if="czDatanum>0" @click="czPay" class="ml10 mr10"><el-button size="small" type="primary">确认支付</el-button></a>
				</div>
			</div>
			<div class="renewal-success" v-if="czbDetail.notarizationRef">
				<!-- <img src="~assets/img/reg_login/success.png"> -->
				<p class="renew">
					<span>续费成功</span>
					<i class="el-icon-check"></i>
				</p>
				<p class="renew_info mt20" v-if="czType=='2'">存证文件：{{czbDetail.notarizationRef.fileName}}</p>
				<p class="renew_info" v-if="czType=='1'">存证网址：{{czbDetail.notarizationRef.fileName}}</p>
				<p class="renew_info">有效期限：{{czbDetail.notarizationRef.validTime|dateFormat}}</p>
				<el-button size="small" type="primary" @click="renewal=false">确认</el-button>
			</div>
			<!-- 续费失败 -->
			<div class="renewal-success" v-if="czbDetail.status">
				<img src="~assets/img/reg_login/Group-error.png">
				<p>续费失败，请稍后再试</p>
				<el-button size="small" type="primary" @click="czerror=false">确认</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import Vue from 'vue'
	import $ from 'jquery'
	import Filters from 'api/filters.js'
	import noResult from 'components/noResult/noResult.vue'

	import qs from 'qs'
	const czUrl = CONFIG.czUrl;
	const indexUrl = CONFIG.indexUrl;
	const cartUrl = CONFIG.cartUrl;
	const rootUrl = CONFIG.rootUrl;
	export default {
		components: {
			noResult
			//sebeHeader,
			//sebeFooter
		},
		data(){
			return{
				isChecked: false,
				rootUrl:rootUrl,
				imgsrc:'',
				czdata:false,//续费弹框
				giveUp:false,
				czbDetail:[],
				renewal:false,//续费s
				applyCerVisible: false, //申请出证
				czUrl: czUrl,
				indexUrl: indexUrl,
				cartUrl: cartUrl,
				czType:'',//存证类型
				loading: false,
				errorResult: false,
				status:'',//存证id
				czdetail:[],
				czDatanum:'',
				isDisabled:false,
				newdate:'',//当前时间
				czTitle:'出证须知',
				czStep: 1,
				rules:{
					phone: [
						{ required: true, trigger: 'blur' }
					],
				},
				confirmForm:{},
				isDownload:false,
				internetVisible: false
			}
		},
		methods:{
			getMinTime(num){
				let nowtime = new Date().getTime();
				if(nowtime-num>120000){
					return false
				}
				return true
			},
			toOld(){
				this.$router.back(-1);
			},
			//判断弹框显示内容
			applyClick(item){
				if(item.issueStatus==1){
					this.giveUp=true;
				}else if(!item.issueStatus){
					this.applyCerVisible=true;
				}
			},
			czApply(){
				this.applyCerVisible = true;
				this.czStep = 1;
				this.isChecked = false;
			},
			internetczApply(){
				this.internetVisible = true;
			},
			next(czStep){
				if (czStep == 1) {
					if (this.isChecked) {
						this.czStep = 2;
					}else{
						this.$message.warning('请阅读并同意《拾贝网用户存证服务协议》和《出证须知》');
					}
				}
			},
			//出证提交
			czSubmit(){
				var self = this;
				if(this.isDisabled){
					return;
				}
				this.isDisabled = true;
				self.$http.post('./cz/EvidenceController/evidTestify.do', qs.stringify({
					fileId: this.czdetail.fileId
				}))
				.then((response) => {
					this.isDisabled = false;
					if (response.data.code==200) {
						this.czStep = 3;
						self.search(true);
					}else{
						this.$message({
							title: '提交失败',
							message: response.data.msg || '系统繁忙，请稍后再试',
							type: 'error'
						});
					}
				})
				.catch((error) => {
					this.isDisabled = false;
					self.applyCerVisible=false;
					this.$message({
						title: '申请失败',
						message: '系统繁忙，请稍后再试',
						type: 'warning'
					});
				});
			},
			//撤消出证
			giveUpCz(){
				var self = this;
				self.$http.post('./cz/EvidenceController/orderTestifyCancel.do', qs.stringify({
					orderNum:this.czdetail.issueDTO.orderNum,
					//cancelReason: item.issueId
				}))
				.then((response) => {
					self.giveUp=false;
					if(response.data.code==200){
						self.search(true);
					}else{
						this.$message({
							title: '撤销出证申请失败',
							message: '系统繁忙，请稍后再试',
							type: 'warning'
						});
					}
				})
				.catch((error) => {
					self.giveUp=false;
					this.$message({
						title: '撤销出证申请失败',
						message: '系统繁忙，请稍后再试',
						type: 'warning'
					});
				});
			},
			search(noLoading){
				var self = this;
				self.errorResult = false;
				if (!noLoading) {
					self.loading = true;
				}
				this.czType = this.$route.query.cztype || '1';
				self.$http.post('./api/findNotarizationDetails', qs.stringify({
					order_sn: self.status
				}))
				.then((response) => {
					self.loading = false;
					var data = response.data;
					self.czdetail = data;
					self.isDownload =(this.czType==1 &&this.getMinTime(data.updateTime) && data.czChannel==6)
				})
				.catch((error) => {
					self.loading = false;
					self.errorResult = true;
					self.czdetail = [];
					var data = error.response.data;
				});
			},
			//页面数据刷新
			refreshpage(){
				var self = this;
				this.czType = this.$route.query.cztype || '1';
				self.$http.post('./api/findNotarizationDetails', qs.stringify({
					order_sn: self.status
				}))
				.then((response) => {
					var data = response.data;
					self.czdetail = data;
				})
				.catch((error) => {
					self.czdetail = [];
					var data = error.response.data;
				});
			},
			// 续费
			renewalclick(item){
				var self = this;
				if(this.isDisabled){
					return;
				}
				self.czdata = true;
				this.isDisabled = true;
				this.refId = item.refId;
				//查询存证包数量
				self.$http.post('./api/queryleftcznum', qs.stringify({
					refId: self.refId
				}))
				.then((response) => {
					self.loading = false;
					self.czDatanum = response.data.leftCzNum;
					self.renewal = true;
					self.isDisabled = false;
				})
				.catch((error) => {
					self.loading = false;
					self.renewal = true;
					self.isDisabled = false;
				});
			},
			//存证包支付
			czPay(item){
				var self = this;
				if(this.isDisabled){
					return;
				}
				this.isDisabled = true;
					self.$http.post('./api/payWithCzb', qs.stringify({
						refId: self.refId
					}))
					.then((response) => {
						self.isDisabled = false;
						self.czdata = false;
						self.refreshpage();
						self.czbDetail = response.data;
					})
					.catch((error) => {
						self.isDisabled = false;
					});
			},
			czOtherPay(){//其他支付
				var self = this;
				if(this.isDisabled){
					return;
				}
				this.isDisabled = true;
				self.$http.post('./api/confirmczpay', qs.stringify({
					refId: self.refId
				}))
				.then((response) => {
					self.loading = false;
					if(response.data.code == "0"){
						self.isDisabled = false;
						var url = cartUrl+'/shop/pages/pay.html?order_sn='+response.data.data.orderFictitiousSn;
						location.href = url;
					}
				})
				.catch((error) => {
					self.loading = false;
					self.isDisabled = false;
				});
			},
			refresh(){//刷新
				this.search();
			}
		},
		mounted(){
			this.status = this.$route.params.web_id;
			this.search();
			this.newdate = Date.parse( new Date());
		},
		watch: {
			// 如果路由有变化，会再次执行该方法
			'$route': 'search',
			czStep(){
				if (this.czStep == 1) {
					this.czTitle = '出证须知'
				}else if (this.czStep == 2){
					this.czTitle = '确认出证信息'
				}else if (this.czStep == 3){
					this.czTitle = ''
				}
			}
		},
		filters: {
			dateFormat: Filters.formatDate.dateFormat,
			orderStatusformat: Filters.orderStatusformat,
			payStatusformat: Filters.payStatusformat,
			priceformat:Filters.priceformat,
			titleLengthFormat:Filters.titleLengthFormat,
			czChannelFormat:Filters.czChannelFormat,
			notarizationPurposeFilter:Filters.notarizationPurposeFilter,
			notarizationUsesformat:Filters.notarizationUsesformat,
			format: Filters.formatDate.Formatdate,
			publishQy:function (input) {
				switch (input){
					case 0:
						return "创作完成，未上线";
					case 1:
						return "网络发表";
					case 2:
						return "已出版";
					case 3:
						return "已上线";
				}
			},
			product:function (input) {
				switch (input){
					case 0:
						return "个人作品";
					case 1:
						return "职务作品";
					case 2:
						return "合作作品";
					case 3:
						return "委托作品";
				}
			},
			productQy:function (input) {
				switch (input){
					case 4:
						return "法人作品";
					case 2:
						return "合作作品";
					case 3:
						return "委托作品";
				}
			}
		}
	}
</script>
<style lang="scss">
.cz_detail{width: 100%;min-height: 620px;background: #fff;position: relative;padding:20px;
	// h4.navTitle .back_box{margin-right:0;}
}
.addressTitle{padding: 20px 20px 0;border-bottom: 1px solid #e6e6e6;box-sizing: border-box;}
.addressTxt{font-size: 16px;line-height: 100%;color: #333}
.addressHref{font-size: 14px;line-height: 100%;color: #666;margin-top: 19px;margin-bottom: 15px}
.addressHref a{color: #63bdfb;text-decoration: none;}
.weblist{
	.czInfo{
		position: relative;width:940px;border:1px solid #E6E6E6;margin: 15px auto 0;
		.title{
			height: 39px;line-height: 39px;background-color: #eee;padding-left: 20px;font-size: 13px;color: #666666;
			span{display: inline-block;margin-right:20px;}
		}
		.body{
			padding: 15px 20px;font-size: 13px;color: #666666;width: 740px;border-right:1px solid #E6E6E6;
			span{
				display: inline-block;height: 17px;line-height: 17px;margin: 5px 0;width: 430px;
				b{color:#151515;font-weight: normal;}
			}
			span:nth-child(2){width: 265px;}
			span:last-child{
				b{color: #09bb07;}
			}
		}
		.noRightBorder{border-right: 0;}
		.cancelCz{position: absolute; right: 55px;font-size: 13px;color: #3DB1FA; top:73px;}
		.cancelCz:hover{text-decoration:none;}
		.body_cx{
			padding: 15px 20px;font-size: 13px;color: #666666;
			span{
				display: inline-block;height: 17px;line-height: 17px;margin: 5px 0;
				b{color:#151515;font-weight: normal;}
			}
			p{
				span{
					margin-right: 55px;
					b{color:#f64744;}
				}
			}
		}
	}
	ul{width:550px;
		li{margin-top: 19px;padding-left: 10px;
			a{font-size: 14px;line-height: 14px;text-decoration:none;cursor:pointer;color:#3db1fa;vertical-align: top;}
			span{font-size: 14px;line-height: 14px;vertical-align: top;}
			.czname{color: #666;vertical-align: top;}
			.cztxt{color: #333;width:400px;word-break: break-all;display: inline-block;vertical-align: top;}
		}
	}
	.imgSrc{width:140px;text-align:center;font-size:0;
		a{position: relative;display:block}
		img{cursor:pointer;}
		span{font-size:13px;line-height:20px;color:#fff;display:block;width:140px;height:26px;background: rgba(0,0,0,0.60);text-decoration:none;line-height:26px;position: absolute;bottom:0px;}
	}
}
.webhref{width:700px;overflow:hidden;padding-left: 10px;padding-top:30px;}
.dialog_applyCer{
	.pop_window{text-align:center;
		._success{
				.info{
					height: 40px;line-height: 40px;font-size: 20px;color: #09BB07;margin-bottom:30px;text-align:center;
					img{margin-right:10px;vertical-align: top;}
				}
				p{
					line-height: 25px;font-size: 14px;color: #000000;
					b{
						font-weight:normal;color:#3DB1FA;
					}
				}
				p.tip{font-size: 13px;color: #666666;line-height: 17px;margin-top:12px;margin-bottom:20px;}
				.bt_btn{
					text-align: center;
					button{display: inline-block;margin-right: 10px;height: 42px;text-align: center;line-height: 42px;font-size: 14px;padding:0 49px;border-radius: 3px;border: 1px solid #3db1fa;background: #3DB1FA;color:#fff;}
				}
			}
		._detail{
			p,h4,.contact,.agree{text-align:left;}
			h4{font-weight:normal;
				span{color:#999;}
			}
			p{font-size:12px;}
			p.time {font-size: 13px;color: #3db1fa;line-height: 17px;margin-top: 10px;padding-left: 10px;}
			p.other {font-size: 12px;color: #333;line-height: 18px;margin-top: 10px;padding-left: 10px;
			  b {color: #f64744;font-weight: 400;}
			}
			.agree {font-size: 13px;color: #666;line-height: 17px;text-align: center;margin-top: 20px;
				.el-checkbox__label {padding-left: 6px;font-size: 13px;color: #666;line-height: 17px;height: 17px;display: inline-block;}
				a{color:#3db1fa;}
			}
			.contact { width: 500px;height: 38px;line-height: 38px;background: #f5f5f5;margin:10px auto 0;padding-left: 10px;font-size: 12px;color: #333;}
		}
	}
	._confirmInfo{
		text-align:left;
		.confirmForm {
			h3 {height: 20px;line-height: 20px;font-weight: 400;font-size: 14px;color: #333;}
			p {padding-left: 20px;margin-top: 10px;font-size: 13px;color: #666;
				label {width: 110px;display: inline-block;vertical-align: middle;}
				span {display: inline-block;vertical-align: middle;}
			}
			.bt_btn{text-align:center;}
		}
	}
}
.dialog-renewal{
	.pop_window{
		margin:0 auto;width:314px;
		.renewal_detail{
	    font-size:14px;text-align:center;
	    .renewal_txt{
	      padding-bottom: 20px;padding-top:10px;text-align:left;
	      p{color:#999;font-size:12px;
	        a{color:#3db1fa;}
	      }
	    }
	    .renewal-list{
	      padding-bottom: 5px;border-bottom:1px dashed #ddd;text-align:left;
	      p{line-height:14px;margin-bottom: 12px;font-size:14px;
	        span{color:#ff3333;font-size:14px;}
	      }
	    }
	  }
	}
	.el-dialog__body{
		p.renew{
			  margin: 10px auto 0;
		    width: 268px;
		    height: 40px;
		    border-radius: 20px;
		    border: 1px solid #09BB07;
		    line-height: 40px;
		    padding-left: 20px;
		    color: #09BB07;
		    span{
		      width: 207px;
    			display: inline-block;
		    }
		}
		p.renew_info{text-align:center;}
	}
}
.dialog_giveUpCer{
	.progress_detail{
		p{line-height: 30px;}
	}
	.bt_btn {text-align: right;margin-top: 20px;}
}


.spctips{
	font-size: 12px;
	padding-left: 5px;
	color: #f70e0e;
}
.internetwindow{
	.bt_btn{
		text-align: center;
		margin-top: 10px;
		button{display: inline-block;height: 36px;text-align: center;line-height: 36px;font-size: 14px;padding:0 49px;border-radius: 3px;border: 1px solid #3db1fa;background: #3DB1FA;color:#fff;}
	}
}
</style>
