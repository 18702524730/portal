<template>
	<!-- 上传申请材料 -->
  <dragDialog :value.sync="uploadInVisible" title="拾贝商标注册服务协议" class="dragDialogM" :class="{'narrowM': curItem.applyType == 2}" @closeTop="closeTop()">
    <div class="upload_m_in clearfix">
    	<div class="up">
    		<div class="upload_list">
    			<p v-if="curItem.applyType==1">上传身份证复印件</p>
    			<p v-if="curItem.applyType==2">上传营业执照复印件</p>
    			<p v-if="curItem.applyType==3">上传护照复印件</p>
    			<p v-if="curItem.applyType==4">上传企业登记证件复印件</p>
					<div class="upload_component">
            <uploader @complete="setUploadedData" @resetUploader="resetUploader" :canPreview="true" :valueName="'standby1'" :url="standby1" :fileName="standby1_name" :size="2" :extensions="'pdf'" :name="'fileData'" :isDialog="true" :postAction="rootUrl+'/api/file/uploadStandby'"></uploader>
            <div class="upload_tip">
              <p v-if="curItem.applyType==1">请上传申请人身份证正反面复印件，并签署申请人签名</p>
              <p v-if="curItem.applyType==2">请上传企业营业执照副本复印件，并加盖企业公章</p>
              <p v-if="curItem.applyType==3">请上传申请人护照复印件，并签署申请人签名</p>
              <p v-if="curItem.applyType==4">请上传企业登记证件复印件，并加盖企业公章</p>
              <p class="format">支持PDF，文件大小限2MB以内</p>
            </div>
          </div>
    		</div>
    		<div class="case">
      		<p v-if="curItem.applyType==1">身份证示例</p>
      		<p v-if="curItem.applyType==2">营业执照示例</p>
      		<p v-if="curItem.applyType==3">护照示例</p>
      		<p v-if="curItem.applyType==4">企业登记证件示例</p>
      		<div class="case_in" v-if="imgData[curItem.applyType]">
      			<img :src="imgData[curItem.applyType][0]">
      			<span class="mask"></span>
      			<div class="action">
							<i class="el-icon-view" @click="zoomView(curItem.applyType, 0)"></i>
							<a class="down" :href="imgData[curItem.applyType][0]" target="_blank"></a>
						</div>
      		</div>
      	</div>
    	</div>
    	<div class="up" v-if="curItem.applyType==1 || curItem.applyType==3 || curItem.applyType==4">
    		<div class="upload_list">
    			<p v-if="curItem.applyType==1">上传营业执照复印件</p>
    			<p v-if="curItem.applyType==3">上传中文护照译本复印件</p>
    			<p v-if="curItem.applyType==4">上传企业登记证件译本复印件</p>
					<div class="upload_component">
            <uploader @complete="setUploadedData" @resetUploader="resetUploader" :canPreview="true" :valueName="'standby2'" :url="standby2" :fileName="standby2_name" :size="2" :extensions="'pdf'" :name="'fileData'" :isDialog="true" :postAction="rootUrl+'/api/file/uploadStandby'"></uploader>
            <div class="upload_tip">
              <p v-if="curItem.applyType==1">请上传个体工商户营业执照副本复印件，并签署申请人签名</p>
              <p v-if="curItem.applyType==3">请上传中文护照译本复印件，并签署申请人签名</p>
              <p v-if="curItem.applyType==4">请上传企业登记证件译本复印件，并加盖企业公章</p>
              <p class="format">支持PDF，文件大小限2MB以内</p>
            </div>
          </div>
    		</div>
    		<div class="case">
      		<p v-if="curItem.applyType==1">营业执照示例</p>
      		<p v-if="curItem.applyType==3">中文护照译本示例</p>
      		<p v-if="curItem.applyType==4">企业登记证件译本示例</p>
      		<div class="case_in" v-if="imgData[curItem.applyType]">
      			<img :src="imgData[curItem.applyType][1]">
      			<span class="mask"></span>
      			<div class="action">
							<i class="el-icon-view" @click="zoomView(curItem.applyType, 1)"></i>
							<a class="down" :href="imgData[curItem.applyType][1]" target="_blank"></a>
						</div>
      		</div>
      	</div>
    	</div>
    	<div class="up">
    		<div class="upload_list">
    			<p>上传委托书</p>
					<div class="upload_component">
            <uploader @complete="setUploadedData" @resetUploader="resetUploader" :canPreview="true" :valueName="'standby3'" :url="standby3" :fileName="standby3_name" :size="2" :extensions="'jpg,jpeg'" :name="'fileData'" :isDialog="true" :postAction="rootUrl+'/api/file/uploadProxy'"></uploader>
            <div class="upload_tip">
              <p>格式说明：委托书格式应为jpg，图形应清晰，图片大小应小于2M且图形像素介于“600×600”－“4000×4000”之间。<a href="#" @click.prevent="download">下载委托书</a></p>
            </div>
          </div>
    		</div>
    		<div class="case">
      		<p>委托书示例</p>
      		<div class="case_in">
      			<img src="https://hzsebetest.oss-cn-hangzhou.aliyuncs.com/2DDF9637FF83E1EF633D8E72F8FAEC09.png">
      			<span class="mask"></span>
      			<div class="action">
							<i class="el-icon-view" @click="zoomView(null, null, 'https://hzsebetest.oss-cn-hangzhou.aliyuncs.com/2DDF9637FF83E1EF633D8E72F8FAEC09.png')"></i>
							<a class="down" href="https://hzsebetest.oss-cn-hangzhou.aliyuncs.com/2DDF9637FF83E1EF633D8E72F8FAEC09.png" target="_blank"></a>
						</div>
      		</div>
      	</div>
    	</div>
    </div>
    <button class="btn btn-primary confirm_btn" @click.prevent="beforeSubmit">确认上传</button>
    <p class="tip">请确认申请材料是否正确，提交之后将直接申报至商标局，届时将无法办理退款。</p>
    <!-- 提交前确认 -->
    <el-dialog title="提示" :visible.sync="againVisible" :close-on-click-modal="false" :append-to-body="true" :close-on-press-escape="false" class="state_preview state_preview_upload" top="0" width="390px">
		  <div class="confirm_tip">
		  	<p>请确认申请材料是否正确，提交之后将直接申报至商标局，届时将无法办理退款。</p>
		  	<a href="" class="button yes" @click.prevent="confirmSubmit()">确定</a>
		  </div>
		</el-dialog>
    <el-dialog :visible.sync="dialogImgVisible" custom-class="previewDialog previewDialog_trans" :modal-append-to-body="true" :lock-scroll="true" :append-to-body="true" top="50%" :modal="false" ref="previewDialog">
		  <div style="height: 725px;overflow: auto;">
		  	<img width="100%" :src="dialogImageUrl" alt="">
		  </div>
    </el-dialog>
  </dragDialog>
</template>
<script>
	import Vue from 'vue'
	import Filters from 'api/filters.js'
	import dragDialog from 'components/dialog/dialog.vue'
	import uploader from 'components/uploader/uploader.vue'
	const rootUrl = CONFIG.rootUrl;
	const downProxyTemplateUrl ='./api/downProxyTemplate';
	const imgData = {
		1: ['https://sebe360test.oss-cn-beijing.aliyuncs.com/1830F12E5E78DBE6443A23C46E9EAF46.png','https://sebe360test.oss-cn-beijing.aliyuncs.com/8B0EA51C5DFD7DE18261FD20EEF65BF1.png'],
		2: ['https://sebe360test.oss-cn-beijing.aliyuncs.com/31A2E702BFEC48B39151BB9829670172.png'],
		3: ['https://sebe360test.oss-cn-beijing.aliyuncs.com/BC10CFBC74E6AA124C58ED286D6CC133.png','https://sebe360test.oss-cn-beijing.aliyuncs.com/874EF9DA8465E8C1D7E1C544FEBFD7B5.png'],
		4: ['https://sebe360test.oss-cn-beijing.aliyuncs.com/12918F2C0AED4A6F35D82D43B9B111A7.png','https://sebe360test.oss-cn-beijing.aliyuncs.com/CD61F8AA14F99771B44F32A0245E1F29.png'],
	}
	export default {
  	components: {
  		uploader,dragDialog
    },
    props:['uploadVisible', 'curItem'],
    data() {
      return {
      	imgData:imgData,
      	dialogImgVisible:false,
      	dialogImageUrl:'',

      	isSubmited: false,
      	standby1:'',
      	standby2:'',
      	standby3:'',
      	standby1_name:'',
      	standby2_name:'',
      	standby3_name:'',
      	uploadInVisible:false,
      	rootUrl:rootUrl,
      	againVisible: false,
      }
    },
    methods: {
    	//下载委托书模板
      download(){
      	this.$http.post(downProxyTemplateUrl, {
      		work_order_sn: this.curItem.workOrderSn,
      	})
      	.then((resp) => {
      		var data = resp.data;
      		if (data.url) {
      			location.href = rootUrl + '/api/downProxyTemplateFile?url=' + data.url;
      		}
      	})
      	.catch((err) => {
      		this.$message.error(err.msg);
      	});
      },
    	zoomView(type, index, imgUrl){
    		this.dialogImgVisible = true;
    		this.dialogImageUrl = imgUrl ? imgUrl : imgData[type][index];
    	},
    	uploaderErrCallback(data){
				if (data.status == '602') {
					this.$alert(data.msg);
				}else{
					this.$alert(data.msg);
				}
			},
    	setUploadedData(data){
    		var d = data.data;
				if (d.url) {
					this[data.valueName]= d.url;
					this[data.valueName+'_name']= d.fileName
				}else{
					this.uploaderErrCallback(d);
				}
			},
    	resetUploader(valueName){
				this[valueName] = '';
				this[valueName+'_name'] = '';
			},
      closeTop(fresh){
      	this.$emit('close');
      	if (fresh===true) {
      		this.$emit('fresh');
      	}
      },
      beforeSubmit(){
      	if (!this.standby1) {
      		this.$message.warning('请先上传证件复印件');
      		return;
      	}
      	if (this.curItem.applyType != 2 && !this.standby2) {
      		this.$message.warning('请先上传证件复印件');
      		return;
      	}
      	if (!this.standby3) {
      		this.$message.warning('请先上传委托书');
      		return;
      	}
      	this.againVisible = true;
      },
      confirmSubmit(){
      	if (this.isSubmited) {
      		return;
      	}
      	this.againVisible = false;
      	this.isSubmited = true;
      	this.$http.post('./api/uploadApplyMaterial', {
      		standby1: this.standby1,
      		standby1FileName: this.standby1_name,
      		standby2: this.standby2,
      		standby2FileName: this.standby2_name,
      		proxy: this.standby3,
      		workOrderSn: this.curItem.workOrderSn,
      	})
        .then((resp) => {
        	this.isSubmited = false;
        	this.closeTop(true);
        	this.$message.success('提交成功，我们将第一时间为您申报。');
          var data = resp.data;
        })
        .catch((error) => {
        	this.isSubmited = false;
        });
      }
    },
    mounted() {
    },
    filters:{
    	dateFormat: Filters.formatDate.dateFormat
    },
    watch: {
    	uploadVisible(){
				this.uploadInVisible = this.uploadVisible;
				if (!this.uploadInVisible) {
					this.standby1 = '';
	      	this.standby2 = '';
	      	this.standby3 = '';
	      	this.standby1_name = '';
	      	this.standby2_name = '';
	      	this.standby3_name = '';
				}
    	}
    }
  }
</script>
<style lang="scss">
.dragDialogM{
	.popup{
		width: 700px;height: 650px;text-align: center;overflow: visible!important;//用于弹框内再弹框的显示
		.upload_m_in{
			padding: 0 20px;
			.up{
				float:left;width: 190px;margin-right: 40px;text-align: center;padding-top: 10px;font-size: 14px;
				&:last-child{margin-right: 0;}
				.upload_list{
					>p{color: #666;}
					.upload_component{
						height: 250px;margin-top: 12px;
						.upload_wrap{
							margin: 0 auto;
							.tipt{margin-top:8px;}
						}
						.upload_tip{
							margin-top: 12px;color: #999;font-size:13px;line-height: 20px;text-align: left;word-break: break-all;padding:0 10px;
							a{color:#3db1fa ;padding: 0 5px;font-weight: bold;text-decoration: underline;}
						}
					}
				}
				.case{
					>p{font-size: 13px;color: #666;}
					.case_in{
						position: relative;margin: 20px auto 0;width: 120px;height: 120px;
						img{max-width: 120px;max-height: 120px;}
						.mask{position: absolute;left: 0;top: 0;width: 120px;height: 120px;background-color: rgba(0, 0, 0, 0.5);z-index: 2;}
						.action{
							position: absolute;left: 0;top: 0;width: 120px;height: 120px;z-index: 3;
							a,i{
								font-size: 20px;
						    margin: 0 10px;
						    opacity: 1;
						    color: #ddd;
						    cursor: pointer;
						    margin-top: 50px;
						    vertical-align: top;
							}
							.el-icon-view{
								&:before{
							    content: "\E641";
							  }
						  }
							.down{
								background: transparent url(~assets/img/service/down.png) 0 0 no-repeat;width: 20px;height:20px;display: inline-block;background-size: 100%;
							}
						}
					}
				}
			}
		}
		.confirm_btn{width: 150px;height: 36px;margin-top: 40px;}
		.tip{color: #999;margin-top: 20px;}
		.previewDialog_trans{
			width: 900px;padding-left: 20px;max-height: 700px;overflow: hidden;
			transform: translate(-50%, -50%) !important;-ms-transform: translate(-50%, -50%) !important;
			margin-left: 0;
		}
	}
}
.narrowM{
	.popup{
		width: 464px;
	}
}
.el-dialog .el-dialog__body a.button {
  display: inline-block;
  width: 88px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: #479CFF;
  color: #fff;
  font-size: 14px;
  border: 1px solid #479CFF;
  border-radius: 2px;
  cursor: pointer;
}
.el-dialog .el-dialog__body a:hover{text-decoration: none;}
.state_preview_upload .el-dialog{top:50%!important;}
</style>
