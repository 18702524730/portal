<template>
	<div class="applyRefund listCommonality">
		<h4 class="navTitle">申请退款</h4>
		<!-- <div class="nav"><a href="#refunds">退款</a> > 申请退款</div> -->
		<div class="goodsLists">
			<div style="min-height: 142px">
        <table class="table table-bordered" >
          <thead>
            <tr class="" style="height: 40px;line-height:40px;background:rgba(245,245,245,1);">
              <th>
                <div class="title">
                  <span>商品</span>
                  <span class="goods_price">单价</span>
                </div>
							</th>
              <th>实付款</th>
              <th>服务单号</th>
							<th>申请退款金额</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="name">
                <div class="fl img">
                  <img :src="orderData.order_bs_image">
                </div>
                <div class="fl content">
                  <a v-if="orderData.orderBsCode === 'sbfw_gnsb_zzzc'" :href="`${indexUrl}/sebe/pages/selfRegister.html#/one`">{{orderData.orderName}}</a>
                  <router-link v-else :to="'orders/'+'1'">{{orderData.orderName}}</router-link>
                  <span class="price">{{orderData.payment_amount|priceformat}}</span>
                </div>
              </td>
							<td valign="top" class="real_pay">
								{{orderData.amount|priceformat}}
              </td>
              <td valign="top" class="order_num">
									{{orderData.order_sn}}<br>
									<router-link :to="'/serviceList/'+orderData.order_sn">查看详情</router-link>
              </td>
              <td valign="top" class="customer_service">
								<!-- <router-link :to="'/refunds/' + orderData.order_sn">申请退款</router-link> -->
								<span>{{orderData.amount|priceformat}}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
			<el-form :model="postData" :rules="rules" ref="ruleForm" :inline="true" auto-complete="off" class="ruleForm">
				<div class="form-in">
					<el-form-item label="退款原因：" prop="refund_reason_type_id" class="form-group">
						<el-select v-model="postData.refund_reason_type_id" placeholder="请选择原因">
							<el-option
								v-for="item in reasonData"
								:label="item.refund_name"
								:key="item.refund_reason_type_id"
								:value="item.refund_reason_type_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="退款说明：" prop="message" class="form-group">
						<el-input type="textarea" v-model="postData.message" auto-complete="off" class="form-textarea"></el-input>
					</el-form-item>
					<!-- 上传图片： -->
					<div class="form-group upimages clearfix">
						<label class="form-label">上传图片：</label>
						<el-upload v-if="hasFormData"
							:action="rootUrl+'/api/file/upload'"
							accept="image/jpg,image/jpeg,image/gif,image/bmp,image/png"
							list-type="picture-card"
							name="Filedata"
							:before-upload="beforeUpload"
							:on-change="uploadChange"
							:on-success="uploadSuccess"
							:on-preview="handlePictureCardPreview"
							:on-remove="handleRemove" class="picup">
							<i class="el-icon-plus"></i>
						</el-upload>
						<ul v-if="!hasFormData" class="imagesListIE9">
							<li v-for="item in imagesList" @mouseenter="dialogImageUrl=item.url">
								<img :src="item.url">
								<div class="mask"></div>
								<div class="hoveraction"><i class="el-icon-view" @click="dialogImgVisible=true"></i><i class="el-icon-delete2" @click="handleRemove(item)"></i></div>
							</li>
						</ul>
						<file-upload v-if="!hasFormData"
							:title="etc.title"
							:events="etc.events"
							:name="etc.name"
							:post-action="etc.postAction"
							:extensions="etc.extensions"
							:accept="etc.accept"
							:multiple="etc.multiple"
							:size="etc.size"
							:drop="etc.drop"
							:files="etc.files"
							@fileUploadAdd="fileUploadAdd"
							@complete="setFileData"
							ref="etc">
						</file-upload>
						<div class="pic-tips">
							1、请上传业务相关的图片或聊天截图；<br>
							2、图片支持jpg、jpeg、gif、bmp或png格式，上限3张
						</div>
					</div>
				</div>
				<div class="bottom-wrap">

					<button type="submit" class="btn submit-btn" @click.prevent="validateBeforeSubmit('ruleForm')">提交</button>
					<button class="btn back-btn" @click="$router.go(-1)">返回</button>
				</div>
			</el-form>
			<el-dialog
				title=""
				:show-close="false"
				:visible.sync="sucVisible"
				size="tiny" class="sucDialog">
				<span class="tip">提交成功！</span>
				<span class="tip2">您的退款申请已提交，请尽快联系拾贝客服为您办理，咨询热线4000315426。</span>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="confirmAfter">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog :visible.sync="dialogImgVisible" size="small">
				<img width="100%" :src="dialogImageUrl" alt="">
			</el-dialog>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import $ from 'jquery'
	const rootUrl = CONFIG.rootUrl;
	const indexUrl = CONFIG.indexUrl;
	import Util from 'src/common/js/util.js'
	import Filters from 'api/filters.js'
	import qs from 'qs'
	import fileUpload from 'vue-upload-component'

	const Extensions = 'jpg,jpeg,gif,bmp,png'
	export default {
		components: {
			fileUpload
		},
		data(){
				return{
					etc:{
						accept: '*/*',
						extensions: Extensions,
						multiple: false,
						postAction: rootUrl + '/api/file/upload',
						//postAction:CONFIG.czUrl + '/EvidenceController/uploadData.do',
						name: 'Filedata',
						files: [],
						size: 1024 * 1024 * 10,
						drop: true,
						title: '图片',
						events: {
							add(file, component) {
								var fileName, nameInfo, fileSize;
								if (this.mode === 'html4') {
									fileName = file.name;
									fileSize = file.size;
									nameInfo = fileName.split('.');
								}else{
									fileName = file.file.name;
									fileSize = file.file.size;
									nameInfo = fileName.split('.');
								}
								var extension = nameInfo[nameInfo.length - 1];
								if ($.inArray(extension, Extensions.split(',')) === -1) {
									this.$alert('上传文件的格式不支持');
									return;
								}
								if (fileSize && fileSize/1024/1024 > 10) {
									this.$alert('上传文件大小不能超过10M');
									return;
								}
								component.active = true;
								this.$emit('fileUploadAdd',file);
							},
							after(file, component) {
								component.active= false;
								var data = {};
								if (this.mode === 'html4') {
									data = file.data;
								}else{
									data = file.response;
								}
								// 用title来辅助传入 index索引，见html上的绑定
								this.$emit('complete', {data:data, file:file});
							}
						},
						isValid: true //单独配置，用于验证
					},
					hasFormData: window.FormData,
					submitDisabled: false,
					rootUrl: rootUrl,
					indexUrl: indexUrl,
					order_sn:'',
					orderData:{},
					postData:{
						order_sn:'',
						refund_reason_type_id:'',
						message:'',
						refund_images:[]
					},
					reasonData:[],
					// 表单验证规则
					rules: {
						refund_reason_type_id: [
							{type: 'integer', required: true, message: '请选择原因描述', trigger: 'change' }
						],
						message: [
							{type: "string", required: true, message: '请输入退款说明', trigger: 'blur' },
							{ min: 5, max: 200, message: '原因描述文字长度在 5到 200个字符', trigger: 'blur' }
						]
					},
					dialogImgVisible: false,
					dialogImageUrl:'',
					imagesList: [],//接口定义的上传图片list
					sucVisible: false
				}
		},
		methods:{
			// 获取退款原因
			initRefundReason(){
				var self = this;
				self.$http.post('./api/listRefundsReasonType', qs.stringify({
					types: 0
				}))
				.then((response) => {
					var data = response.data;
					self.reasonData = data.elements;
				})
				.catch((error) => {
					var data = error.response.data;
				});
			},
			// 拼合组装图片list
			getImagesArr(arr){
				var ret = [];
				$.each(arr, function(i, item){
					ret.push(item.url);
				});
				return ret;
			},
			// 提交
			submit(){
				var self = this;
				if (this.submitDisabled) {
					return;
				}
				this.submitDisabled = true;
				this.postData.refund_images = this.getImagesArr(this.imagesList);
				self.$http.put('./api/createRefunds', this.postData)
				.then((resp) => {
					var data = resp.data;
					this.submitDisabled = false;
					if (data.codes == 'success') {
						self.sucVisible = true;
						//self.$alert('提交成功');
					}else{
						self.$alert(data.msg);
					}
				})
				.catch((error) => {
					console.log(error);
					self.$alert('申请退款失败，请重试');
					this.submitDisabled = false;
				});
			},
			// 提交申请前验证
			validateBeforeSubmit(formName){
				var self = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						self.submit();
					} else {
						self.$message.error('标红的为必填项，请检查并正确填写。');
						return false;
					}
				});
			},
			//查询订单信息
			search(){
				var self = this;
				self.$http.post('./api/findOneFictitious', qs.stringify({
					order_sn: self.order_sn
				}))
				.then((response) => {
					var data = response.data;
					if (data.code === '0') {
						self.orderData = data.data;
					}
				})
				.catch((error) => {
					var data = error.response.data;
				});
			},
			//上传前验证格式和大小
			beforeUpload(file){
				if (!file.type || file.type.indexOf('image') === -1) {
					this.$alert('图片格式不正确，支持png,jpg,jpeg,gif,bmp等图片格式');
					return false;
				}
				if (file.size > 10*1024*1024) {
					this.$alert('图片最大支持10M');
					return false;
				}
				if (file.size <= 0) {
					this.$alert('图片大小不能为0');
					return false;
				}
				if (this.imagesList.length === 3) {
					this.$alert('最多上传3张图片');
					return false;
				}
				return true;
			},
			//移除图片
			handleRemove(file, fileList) {
				var imagesList = this.imagesList;
				var idx = -1;
				$.each(imagesList, function(i, item){
					if (item.uid == file.uid) {
						idx = i;
						return false;
					}
				})
				if (idx !== -1) {
					imagesList.splice(idx, 1);
				}
				if (this.imagesList.length < 3) {
					$('.el-upload--picture-card').show();
					//ie9
					$('.file-uploads-html4').show();
				}
			},
			//查看放大图
			handlePictureCardPreview(file) {
				console.log(file)
				this.dialogImageUrl = file.url;
				this.dialogImgVisible = true;
			},
			uploadChange(file, fileList) {
				if (fileList.length < 3) {
					$('.el-upload--picture-card').show();
				}else{
					$('.el-upload--picture-card').hide();
				}
			},
			//上传成功处理
			uploadSuccess(data, file) {
				if (data.status == '601') {
					this.$alert('图片大小不能为0');
					return;
				}
				var ret = {};
				ret.uid = file.uid;
				ret.url = data.url;
				this.imagesList.push(ret);
			},
			//提交成功后确认，跳转到退款列表页
			confirmAfter(){
				this.sucVisible = false;
				this.$router.push('/refundList');
			},
			// ie9上传前回调
			fileUploadAdd(data){
				//this.uploadedFileData = {};
				//console.log(data)
			},
			// ie9上传成功处理
			setFileData(data){
				if (data.data.status == '601') {
					this.$alert('图片大小不能为0');
					return;
				}
				var ret = {};
				ret.uid = data.file.id;
				ret.url = data.data.url;
				this.imagesList.push(ret);
				if (this.imagesList.length === 3) {
					//ie9
					$('.file-uploads-html4').hide();
				}
			}
		},
		mounted(){
			this.order_sn = this.$route.params.order_sn;
			this.postData.order_sn = this.order_sn;
			this.search();
			this.initRefundReason();
		},
		filters: {
			dateFormat: Filters.formatDate.dateFormat,
			orderStatusformat: Filters.orderStatusformat,
			priceformat:Filters.priceformat
		}
	}
</script>

<style lang="scss">
.applyRefund{
	font-size:13px;
	padding: 20px 20px 360px;
	h4{padding-left: 0px;}
	.nav{
		margin-top:8px;
		a{color: #3db1fa;}
	}
	.goodsLists{
		margin-top:30px;
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
							&.goods_price{margin: 0 130px 0 290px}
						}
          }
        }
        td{border:1px solid #eee;box-sizing: border-box;height: 130px;padding: 20px 0 20px 0;}
        td.name{
          width: 446px;
          >div{
          &.img{width: 130px;padding: 0 20px;height: 90px;
            img{width: 90px;height: 90px;}
            }
          &.content{font-size: 13px;line-height: 18px;
            >a{width: 130px;display: block;float: left;word-break:break-all;}
            >.price{padding-left:70px;margin-top: -18px;}
            }
          }
          .num-btn{width: 54px;height: 26px;border-color: #e6e6e6;color: #666;margin-top:5px;font-size:13px;line-height: 24px;cursor: default}
				}
				td.real_pay{
					width: 170px;
					text-align: center;
					line-height: 18px;
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
		.ruleForm{
			.upimages>div{
				float: left;width:665px;
			}
			.upimages label.form-label{float: left;width:94px;display: inline-block; text-align: left;padding-right: 12px;color: #666;}

		}
	}
}


.form-in{
	padding-right: 100px;
	.el-input__inner{width: 300px;}
	font-size:13px;
	padding-top:27px;
	// .el-select{margin-right: 200px;}
	.el-form-item{
		margin-bottom: 20px;
		label{width: 94px;text-align: left;color: #666;font-size:13px;}
	}
	.form-group{
		.form-textarea{
			textarea{
				width: 420px;height: 170px;border-radius: 4px;border: 1px solid #e5e5e5;padding:5px;font-size: 13px;
			}
		}
	}
	.el-upload--picture-card{border: 1px dashed #e5e5e5;}
	.el-icon-upload-success{position: relative;top:-43px;right: 0;}
	.el-progress-circle{width: 80px!important;height: 80px!important;}
	.el-upload-list--picture-card .el-progress{width: 80px;}
	.el-upload-list--picture-card .el-upload-list__item, .el-upload--picture-card{width:120px;height: 120px;line-height:118px;}
	.picup{height: 120px;}
	.pic-tips{padding-left:94px;color: #999999;padding-top: 10px;line-height: 17px;}
	/* 因element-ui对ie9上传不支持，针对ie9上传单独处理 */
	.imagesListIE9{
		li{
			position: relative;float: left;width: 100px;height: 100px;border:1px solid #c0ccda;border-radius:5px;overflow: hidden;text-align: center;vertical-align: middle;line-height: 98px;margin-right:8px;
			img{width: 100%;height: 100%;}
			.mask{display: none;position: absolute;top: 0;left: 0;width: 100%;height: 100%;opacity: 0.5;background-color: #000;}
			.hoveraction{display: none;position: absolute;top: 0;left: 0;width: 100%;height: 100%;
				i{font-size:20px;margin-right:20px;opacity: 1;color: #fff;cursor: pointer}
				i:last-child{margin-right:0;}
			}
		}
		li:hover{
			.mask,.hoveraction{display:block;}
		}
	}
	.file-uploads.file-uploads-html5 input,.file-uploads.file-uploads-html4 input{position: static;-ms-filter: 'progid: DXImageTransform.Microsoft.Alpha(Opacity=0)';top: auto;left: auto;bottom: auto;left: auto;width: 100%!important;height: 100%!important;cursor: pointer;}
	.file-uploads-html5,.file-uploads-html4{
		width: 100px;height: 100px;border:1px dashed #ccc;border-radius:5px;background: #fbfdff url(~assets/img/refund/add_bg.png) center center no-repeat;
		.file-uploads-title{display: none;}
		.file-uploads-input{
			width: 100%;height: 100%;display: block;
		}
	}
}
.bottom-wrap{
	padding-top:30px;
	padding-left:105px;
	button{margin-right: 6px;}
	.back-btn{width: 100px;height: 40px;line-height:40px;color:#666;border:1px solid #3DB1FA;color: #3DB1FA;}
	.submit-btn{width: 100px;height: 40px;line-height:40px;background-color: #3db1fa;border-color: #3db1fa;color: #fff;}
}
.sucDialog{
	.el-dialog{width: 380px;}
	.el-dialog__body{padding-left: 40px;padding-right: 35px;padding-top: 15px;}
	.tip{font-size:26px;display: block;padding-left:50px;background: #FFF url(~assets/img/order/success.png) 0 0 no-repeat}
	.tip2{padding-top:12px;display: block;}
}




</style>
