<template>
	<div class="dlgtForm">
		<el-form label-position="left" ref="ruleForm" :rules="rules" :model="conForm" label-width="140px">
			<!--大陆个体-->
			<div>
				<!-- <h4 v-if="applyType == 5">主体信息</h4> -->
				<el-form-item label="申请人姓名" prop="apply_name">
					<el-input v-model ="conForm.apply_name" :maxlength="20" placeholder="请填写申请人姓名，与身份证信息保持一致" :disabled="conForm.is_checked==1 && isEdit"></el-input>
				</el-form-item>
				<el-form-item label="申请人身份证号" prop="apply_number">
					<el-input v-model="conForm.apply_number" :maxlength="18" placeholder="请填写申请人身份证号码，与身份证信息保持一致" :disabled="conForm.is_checked==1 && isEdit"></el-input>
				</el-form-item>
				<el-form-item label="申请人联系电话" prop="apply_phone">
					<el-input v-model="conForm.apply_phone" :maxlength="13" placeholder="请填写申请人手机或固话，固话前请加区号"></el-input>
				</el-form-item>
				<el-form-item label="申请人邮箱" prop="apply_email">
					<el-input v-model="conForm.apply_email" :maxlength="30" placeholder="请填写申请人邮箱"></el-input>
				</el-form-item>
				<el-form-item label="申请人地址" required>
					<el-form-item class="form-ipt-sm" prop="province_id" style="display:inline-block;width:140px;margin-right: 6px;">
						<el-select v-model="conForm.province_id" placeholder="请选择省" @change="changeProvince(conForm.province_id)" class="">
							<el-option v-for="item in provinceData" :label="item.name" :value="item.area_id+''" :key="item.area_id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item class="form-ipt-sm" prop="city_id" style="display:inline-block;width:140px;margin-right: 5px;">
						<el-select v-model="conForm.city_id" placeholder="请选择市" @change="changeCity(conForm.city_id)" class="">
							<el-option v-for="item in cityData" :label="item.name" :value="item.area_id+''" :key="item.area_id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item class="form-ipt-sm" prop="area_id" style="display:inline-block;width:140px;">
						<el-select v-model="conForm.area_id" placeholder="请选择区" class="">
							<el-option v-for="item in areaData" :label="item.name" :value="item.area_id+''" :key="item.area_id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="address" style="margin-top:20px;width: 440px;">
						<el-input v-model="conForm.address" :maxlength="80" placeholder="请填写具体地址" auto-complete="off" class="form-ipt"></el-input>
					</el-form-item>
				</el-form-item>
				<el-form-item label="申请人邮编" prop="zip_code">
					<el-input v-model="conForm.zip_code" :maxlength="6" placeholder="请填写具体地址的邮政编码"></el-input>
				</el-form-item>
				<el-form-item v-if="applyType == 1" label="申请人身份证正反面复印件（需签名）" prop="standby1">
					<div class="upload_component">
						<uploader @complete="setUploadedData" @resetUploader="resetUploader" :canPreview="true" :valueName="'standby1'" :url="standby1" :fileName="standby1_name" :size="2" :extensions="'pdf,jpg,jpeg,png'"></uploader>
						<div class="upload_tip">
							<p>请上传申请人身份证正反面复印件，并签署申请人签名</p>
							<p class="format">格式说明：格式为PDF/JPG/JPEG/PNG，大小限2M以内</p>
						</div>
					</div>
					<el-input type="hidden" v-model="conForm.standby1" style="display: none;"></el-input>
				</el-form-item>
				<el-form-item v-if="applyType == 1" label="个体工商户营业执照副本复印件（需签名）" prop="standby2">
					<div class="upload_component">
						<uploader @complete="setUploadedData" @resetUploader="resetUploader" :canPreview="true" :valueName="'standby2'" :url="standby2" :fileName="standby2_name" :size="2" :extensions="'pdf,jpg,jpeg,png'"></uploader>
						<div class="upload_tip">
							<p>请上传个体工商户营业执照副本复印件，并签署申请人签名</p>
							<p class="format">格式说明：格式为PDF/JPG/JPEG/PNG，大小限2M以内</p>
						</div>
					</div>
					<el-input type="hidden" v-model="conForm.standby2" style="display: none;"></el-input>
				</el-form-item>
				<div v-if="applyType == 5 && conForm.is_checked" class="truethInfo">
					<h4>
						实名认证信息
						<span v-if="conForm.is_checked" :class="{label_base: true, label_success: conForm.is_checked == 1, label_warning: conForm.is_checked == 2, label_fail: conForm.is_checked == 3}">{{conForm.is_checked == 1 ? '已实名认证' : (conForm.is_checked == 2 || conForm.is_checked == 3) ? '实名认证中' : conForm.is_checked == 4 ? '认证失败' : ''}}</span>
					</h4>
					<el-form-item label="姓名">
						<p class="readP">{{conForm.apply_name}}</p>
					</el-form-item>
					<el-form-item label="身份证号">
						<p class="readP">{{conForm.apply_number}}</p>
					</el-form-item>
					<el-form-item label="银行卡预留手机号">
						<span class="readP">{{conForm.bankPhone}}</span>
						<span class="change ml15" @click="myauthVisible=true">修改</span>
					</el-form-item>
					<el-form-item label="申请人银行卡号">
						<p class="readP">{{conForm.bankCard}}</p>
					</el-form-item>
				</div>
				<el-form-item label="" :style="applyType == 5 && conForm.is_checked==1 ? '' : 'margin-top: -10px;'">
					<el-checkbox v-model="isDefault">设为默认</el-checkbox>
				</el-form-item>
			</div>
			<el-form-item>
				<el-button type="primary" @click="add('ruleForm')" :disabled="submitDisabled">保存</el-button>
			</el-form-item>
		</el-form>

		<el-dialog
		title="实名认证"
		:visible.sync="myauthVisible"
		size="tiny" :close-on-click-modal="false" :close-on-press-escape="false" :lock-scroll="false"
		:class="{'real':stepsIndex!=3,'end':stepsIndex==3}" @close="close">
			<div class="prompt" v-if="stepsIndex!=3">
				<p>为了您的信息安全及存证的合法性，请填写您的个人信息，进行银联四要素实名验证。实名认证后，信息不可修改。</p>
			</div>
			<div v-loading="dialogLoading" v-if="dialogLoading" element-loading-text="验证中" style="min-height: 280px;"></div>
			<!-- 步骤条 -->
			<div class="steps_list mt20 mb20" v-if="!dialogLoading && stepsIndex!=3">
				<i class="bdp"></i>
				<div class="list_steaps clearfix">
					<p class="fl">
						<span :class="{'bgc_list':stepsIndex==1}" class="list_num">1</span>
						<span class="txt mt10">填写实名资料</span>
					</p>
					<p class="fl" style="margin:0 65px;">
						<span :class="{'bgc_list':stepsIndex==2}" class="list_num">2</span>
						<span class="txt mt10">手机验证</span>
					</p>
					<p class="fl">
						<span :class="{'bgc_list':stepsIndex==3}" class="list_num">3</span>
						<span class="txt mt10">完成</span>
					</p>
				</div>
			</div>
			<!-- 第一步 -->
			<div class="list_one" v-if="!dialogLoading && stepsIndex==1">
				<el-form ref="first" :rules="rules02" :model="first" label-width="70px">
					<el-form-item label="姓名" style="margin-bottom:0">
						<span>{{conForm.apply_name}}</span>
					</el-form-item>
					<el-form-item label="身份证号" style="margin-bottom:10px;">
						<span>{{conForm.apply_number}}</span>
					</el-form-item>
					<el-form-item label="银行卡号" prop="number">
						<el-input v-model="first.number" placeholder="请输入银行卡号" :maxlength="19"></el-input>
					</el-form-item>
					<el-form-item label="手机号" prop="phone">
						<el-input v-model="first.phone" placeholder="请输入手机号" :maxlength="11"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<!-- 第二步 -->
			<div class="list_second" v-if="!dialogLoading && stepsIndex==2">
				<el-form ref="second" :rules="rules2" :model="second" label-width="70px">
					<el-form-item label="手机号" style="margin-bottom:0">
						<span>{{first.phone}}</span>
					</el-form-item>
					<el-form-item label="验证码" prop="codenum">
						<el-input v-model="second.codenum" placeholder="请输入验证码"></el-input>
					</el-form-item>
				</el-form>
				<button class="btn getcode" :class="{disabled: preventCode}" @click.prevent="getCode">{{codeText}}</button>
			</div>
			<!-- 第三步 -->
			<div class="list_end" v-if="!dialogLoading && stepsIndex==3">
				<img src="~assets/img/success.png" alt="">
				<p class="mt10 mb20">实名认证成功</p>
				<button @click.prevent="authSuccess">确定</button>
			</div>
			<div class="btn_list" v-if="!dialogLoading && stepsIndex!=3">
				<button class="back mr20" v-if="stepsIndex==2" @click.prevent="stepsIndex=1">上一步</button>
				<button @click.prevent="nextClick">下一步</button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import Vue from 'vue'
import $ from 'jquery'
import qs from 'qs'
import uploader from 'components/uploader/uploader.vue'
const indexUrl = CONFIG.indexUrl;
const userUrl = CONFIG.userUrl;
const addressUrl = userUrl + '/api/areas';
const countryUrl = userUrl + '/api/country';
import VueCookie from 'vue-cookie'
const addSebjectUrl = userUrl + '/api/subject';
const editSebjectUrl = userUrl + '/api/subjectModify';

export default {
	//formData:表单数据  applyType:当前选中的类型  dataIsNeedInit:判断是否需要置空表单数据
	props:['formData',  'applyType', 'dataIsNeedInit'],
	components: {
		uploader
	},
	data () {
		//大陆个体身份证验证
		let dlgt_checkId = (rule, value, callback) => {
			let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			if (!value) {
					return callback(new Error('请填写身份证号码'));
			}
			setTimeout(() => {
					if (!reg.test(value)) {
						callback(new Error('身份证格式错误'));
					} else {
						callback();
					}
			}, 50);
		};
		//大陆个体手机号码\固定电话验证
		let dlgt_checkPhone = (rule, value, callback) => {
			let reg = /(^1\d{10}$)|(^\d{3,4}-\d{7,8}$)|(^\d{7,8}$)/;
			if (!value) {
					return callback(new Error('请填写申请人联系电话'));
			}
			setTimeout(() => {
					if (!reg.test(value)) {
						callback(new Error('请填写正确的手机号码，固话前请加区号和-'));
					} else {
						callback();
					}
			}, 50);
		};
		//大陆个体邮箱验证
		let dlgt_checkEmail = (rule, value, callback) =>{
			let emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (!value) {
					return callback(new Error('请填写申请人邮箱'));
			}
			if (value.length > 30) {
					return callback(new Error('邮箱不能超过30个字符'));
			}
			setTimeout(() => {
					if (!emailReg.test(value)) {
						callback(new Error('邮箱格式错误'));
					} else {
						callback();
					}
			}, 50);
		};

		//统一邮编验证
		let checkZipCode = (rule, value, callback) =>{
			let zipCodeReg = /^\d{6}$/;
			if (!value) {
					return callback(new Error('请填写邮政编码'));
			}
			setTimeout(() => {
					if (!zipCodeReg.test(value)) {
						callback(new Error('邮政编码仅限6位数字'));
					} else {
						callback();
					}
			}, 50);
		};
		let checkPhone = (rule, value, callback) => {
			let reg = /^1\d{10}$/;
			if (!value) {
				return callback(new Error('请填写联系人手机号'));
			}
			setTimeout(() => {
				if (!reg.test(value)) {
					callback(new Error('手机号格式错误'));
				} else {
					callback();
				}
			}, 200);
		};
		let bankNumber = (rule, value, callback) => {
			let reg = /^[1-9]{1}\d{8,19}$/;
			if (!value) {
				return callback(new Error('请填写银行卡号'));
			}
			setTimeout(() => {
				if (!reg.test(value)) {
					callback(new Error('银行卡号格式错误'));
				} else {
					callback();
				}
			}, 200);
		};
		return {
			myauthVisible:false,
			standby1:'',
			standby2:'',
			standby1_name:'',
			standby2_name:'',
			submitDisabled: false,
			//是否为修改
			isEdit: false,
			//省市区数据集
			provinceData:[],
			cityData:[],
			areaData:[],

			///境外个体
			jwgt_areaData:[],

			///境外企业
			jwqy_areaData:[],

			isDefault: false,
			conForm:{
				apply_id:'',
				apply_type:2,//主体类型
				is_default:'', //是否默认主体
				apply_name:'',//姓名
				name_en:'',//英文名
				apply_number:'',//身份证号或证件号
				apply_phone:'',//手机号或电话
				apply_email:'',//邮箱
				province_id:'',//省id
				city_id:'',//市id
				area_id:'',//区id
				area_info:'', //省市县名称拼接以空格隔开，境外则国家名称以空格隔开
				address:'',//详细地址
				zip_code:'',//邮编
				apply_fax:'',
				standby1:'',
				standby2:'',
				standby1_name:'',
				standby2_name:'',
				is_checked:0, //是否已实名认证
				bankCard:'', //银行卡
				bankPhone:'', //预留手机
			},
			rules:{
				//大陆个体
				apply_name:[
					{ required: true, message: '请填写申请人姓名', trigger: 'blur' },
					{ pattern: /^[\u4e00-\u9fa5]{2,20}$/, message: '请填写2-20个汉字', trigger: 'blur' }
				],
				apply_number: [
					{ required: true, validator:dlgt_checkId, trigger: 'blur' }
				],
				apply_phone: [
					{ required: true, validator:dlgt_checkPhone, trigger: 'blur' }
				],
				apply_email:[
					{ required: true, validator:dlgt_checkEmail, trigger: 'blur' }
				],
				province_id:[
					{ required: true, message: '请选择省份', trigger: 'change' }
				],
				city_id:[
					{ required: true, message: '请选择城市', trigger: 'change' }
				],
				area_id:[
					{ required: true, message: '请选择区', trigger: 'change' }
				],
				address:[
					{ required: true, message: '请填写详细地址', trigger: 'blur' },
					//{ min: 2, max: 30, message: '详细地址长度 2到 30个字符', trigger: 'blur' }
				],
				zip_code:[
					{ required: true, validator:checkZipCode, trigger: 'blur' }
					/*{ required: true, message: '请填写申请人邮编', trigger: 'blur' },
					{ max: 12, message: '邮编最长12个字符', trigger: 'blur' }*/
				],
				standby1:[
					{ required: true, message: '请上传申请人身份证正反面复印件', trigger: 'change' }
				],
				standby2:[
					{ required: true, message: '请上传个体工商户营业执照副本复印件', trigger: 'change' }
				],
			},
			rules02:{
				phone:[{ type: "string",validator:checkPhone,trigger: 'blur' }],
				number:[{ type: "string",validator:bankNumber,trigger: 'blur' }]
			},
			dialogLoading:false,
			codeText:'获取验证码',
			timer:'',
			preventCode: false,
			first:{},
			second:{},
			stepsIndex:1,
		}
	},
	mounted () {
		this.initProvince();
	},
	methods: {
		//reset上传组件
		resetUploader(valueName){
			this[valueName] = '';
			this[valueName+'_name'] = '';
		},
		authSuccess(){
			this.myauthVisible=false;
			this.$refs['first'].resetFields();
			this.$refs['second'].resetFields();
		},
		timeout(){
			var self = this;
			var second = 60;
			self.preventCode = true;
			if (self.timer) {
				return;
			}
			self.timer = setInterval(function(){
				if(second<=0){
					clearInterval(self.timer);
					second = 60;
					self.codeText = "重发验证码";
					self.preventCode = false;
				}else{
					self.codeText = second + "s后可重发";
					self.preventCode = true;
					second--;
				}
			}, 1000);
		},
		//实名认证下一步
		nextClick(){
			var self = this;
			var item = self.tempSelectedApplySubject;
			if(self.stepsIndex == 1){
				self.$refs['first'].validate((valid) => {
					if (valid) {
						self.authentication();
					}
				});
			}else if(self.stepsIndex == 2){
				self.$refs['second'].validate((valid) => {
					if (valid) {
						self.verifyMobCode();
					}
				});
			}
		},
		close(){//关闭认证框，数据初始化
			this.first.number = '';
			this.first.phone = '';
			this.initProvince();
		},
		//获取手机验证码
		getCode(){
			var self = this;
			if (self.preventCode) {
				return;
			}
			self.authentication(true);
		},
		authentication(noloading){
			var self = this;
			var item = self.conForm;
			if (!noloading) {
				this.dialogLoading = true;
			}
			self.preventCode = true;
			self.$http.post('./api/subject/authentication', qs.stringify({
				apply_subject_id: item.apply_id,
				bank_card: this.first.number,
				bank_phone:this.first.phone
			}))
			.then((response) => {
				this.dialogLoading = false;
				var data = response.data;
				if (data.code == 200) {
					self.$message.success('验证码已发送');
					self.stepsIndex = 2;
					self.timeout();
					self.second.mobile_code = '';
				}else{
					self.$message({
						message: data.desc,
						type: 'error'
					});
				}
			})
			.catch((error) => {
				this.dialogLoading = false;
				if (error.response && error.response.data) {
					this.$message({
						message: error.response.data.desc,
						type: 'error'
					});
				}
			});
		},
		verifyMobCode(){
			var self = this;
			var item = self.conForm;
			this.dialogLoading = true;
			self.$http.post('./api/subject/verifyMobCode', qs.stringify({
				apply_subject_id: item.apply_id,
				mobile_code: this.second.codenum
			}))
			.then((response) => {
				this.dialogLoading = false;
				var data = response.data;
				if (data.code == 200) {
					self.stepsIndex = 3;
				}else{
					self.$message({
						message: data.desc,
						type: 'error'
					});
				}
			})
			.catch((error) => {
				this.dialogLoading = false;
				if (error.response && error.response.data) {
					this.$message({
						message: error.response.data.desc,
						type: 'error'
					});
				}
			});
		},
		setUploadedData(data){
			this[data.valueName]= data.data.url
			this[data.valueName+'_name']= data.data.fileName;
		},
		// 初始化省份
		initProvince(){
			var self = this;
			this.$http.get(addressUrl+'?pId=0')
			.then(function(resp){
				resp = resp.data;
				if(resp.elements){
					self.provinceData = resp.elements;
					self.initData();
				}else {
					console.error(resp.msg);
				}
			})
			.catch((error) => {
				console.error(error);
			});
		},
		// 省份切换渲染城市 城市切换渲染区
		_triggerChange (code, dataName, callback){
			if(!code){
				return;
			}
			var self = this;
			this.$http.get(addressUrl+'?pId='+ code)
			.then(function(resp){
				resp = resp.data;
				if(resp.elements){
					self[dataName] = resp.elements;
					callback && callback();
				}else {
					console.error(resp.msg);
				}
			})
			.catch((error) => {
				console.error(error);
			});
		},
		changeProvince(provinceCode){
			this.conForm.area_id = '';
			this.conForm.city_id = '';
			this.areaData = [];
			this._triggerChange(provinceCode, 'cityData');
		},
		changeCity(cityCode){
			this.conForm.area_id = '';
			this._triggerChange(cityCode, 'areaData');
		},
		getSelectName (code, dataName){
			var self = this;
			var data = self[dataName];
			var ret = '';
			$.each(data, function(i, item){
				if (item.area_id == code) {
					ret = item.name;
					return false;
				}
			});
			return ret;
		},
		//地址拼接
		getAreaInfo(){
			var data = this.conForm;
			var province_id = data.province_id;
			var city_id = data.city_id;
			var area_id = data.area_id;
			return [this.getSelectName(province_id, 'provinceData'), this.getSelectName(city_id, 'cityData'), this.getSelectName(area_id, 'areaData')].join(' ');
		},
		//添加主体请求
		add(formName){
			var self = this;
			if (self.submitDisabled) {
				return;
			}
			self.submitDisabled = true;
			self.conForm.area_info = self.getAreaInfo();
			self.conForm.is_default = self.isDefault ? 1 : 0;
			self.conForm.apply_type = self.applyType || 1;

			self.$refs[formName].validate((valid) => {
				if (valid) {
					var tip = self.isEdit ? '修改': '增加';
					self.$confirm('确认'+tip+'该主体吗?', '提示', {
						type: 'warning',
						closeOnClickModal: false
					}).then(() => {
						//var method = self.isEdit ? 'put' : 'post';
						var url = self.isEdit ? editSebjectUrl : addSebjectUrl;
						// put 修改接口 post 新增
						// put ie9下跨域不支持，改用post
						self.$http.post(url+'?access_token='+ VueCookie.get('user_token'), self.conForm)
						.then(function(resp){
							self.submitDisabled = false;
							//console.log(resp.data);
							var data = resp.data;
							if(data.code=="fail"){
								self.$message({
									title: '失败',
									message: data.msg,
									type: 'error'
								});
							}else{
								self.$message({
									title: '成功',
									message: '保存成功',
									type: 'success'
								});
								self.$emit('addSuccess')
							}
						}).catch((error) => {
							self.submitDisabled = false;
							var data = error.response.data;
							if(data.status == 10034){//最大上限
								self.$message({
									title: '失败',
									message: data.msg,
									type: 'error'
								});
							}
						});
					}).catch(() => {
						self.submitDisabled = false;
					});
				}else{
					self.submitDisabled = false;
				}
			});
		},
		//初始化表单数据
		initData(){
			var self = this;
			if (this.formData.apply_type) {
				this.isEdit = true;
			}else{
				this.isEdit = false;
			}
			var conForm = this.conForm;
			var formData = self.formData;
			var applyId = formData.apply_id;
			if (self.dataIsNeedInit && applyId) {
				$.each(conForm, function(key, val){
					Vue.set(conForm, key, formData[key]);
				});
				this.$nextTick(() => {
  				this.$refs.ruleForm.validate();
  			});
			}else{
				$.each(conForm, function(key, val){
					Vue.set(conForm, key, null);
				});
				if (applyId) {
					Vue.set(conForm, 'apply_id', applyId);
				}
				this.$nextTick(() => {
  				this.$refs.ruleForm.clearValidate();
  			});
			}
			self.conForm.province_id = self.conForm.province_id ? (self.conForm.province_id+'') : '';
			self.conForm.city_id = self.conForm.city_id ? (self.conForm.city_id+'') : '';
			self.conForm.area_id = self.conForm.area_id ? (self.conForm.area_id+'') : '';
			self.standby1 = self.conForm.standby1;
			self.standby2 = self.conForm.standby1;
			self.standby1_name = self.conForm.standby1_name;
			self.standby2_name = self.conForm.standby2_name;
			self.isDefault = self.conForm.is_default == 1 ? true : false;
			// city_id和area_id数据会丢失，暂用这个方法处理
			if (self.isEdit) {
				self._triggerChange(self.conForm.province_id, 'cityData');
				self._triggerChange(self.conForm.city_id, 'areaData');
				/*var city_id = self.conForm.city_id;
				var area_id = self.conForm.area_id;
				setTimeout(function(){

					setTimeout(function(){

					}, 200);
				}, 200);*/
			} else {
				this.$nextTick(() => {
  				this.$refs.ruleForm.resetFields();
  			});
			}
		}
	},
	watch:{
		formData(){
			this.initData();
		},
		standby1(){
			var self = this;
			self.conForm.standby1 = self.standby1;
			self.conForm.standby1_name = self.standby1_name;
		},
		standby2(){
			var self = this;
			self.conForm.standby2 = self.standby2;
			self.conForm.standby2_name = self.standby2_name;
		}
	}
}
</script>


<style lang="scss">
.dlgtForm{
	width: 100%;
	.el-form{
		width: 100%;
		>div{
			width: 100%;
			.el-form-item{width: 580px;}
		}
	}
	h4{
		font-size: 14px;color: #333333;padding: 20px 0;border-top:1px solid #E6E6E6;margin-right: 20px;padding-left: 10px;margin-left: -10px;
		span{margin-left: 10px;font-weight: normal;}
	}
	.truethInfo{
		.el-form-item{margin-bottom: 0;}
	}
	.change{color:#3db1fa;cursor: pointer;}
}
.real{
		.prompt{background: #FFF7E4;padding:10px;
			p{font-size:13px;color: #D8A045;line-height:18px;}
		}
		.steps_list{text-align:center;height:64px;position: relative;
			.bdp{border: 1px dashed #DDDDDD;width:320px;height:1px;display:inline-block;vertical-align: top;margin-top: 17px;}
			.list_steaps{width:382px;position: absolute;top:0;left:64px;
				p{width:84px;text-align:center;
					span{display:block;font-size:14px;}
					.list_num{width:34px;height:34px;text-align:center;line-height:34px;border-radius:50%;border:1px solid #3db1fa;margin:0 auto;color:#3db1fa;background-color:#fff;}
					span.bgc_list{background-color:#3db1fa;color:#fff;}
					.txt{color: #666666;line-height:20px;}
				}
			}
		}

		.list_one{width:430px;margin:0 auto;
			.el-form-item{
				.el-form-item__label{height:34px;}
				.el-form-item__content{width:360px;height:34px;
					.el-input{height:34px;
						.el-input__inner{height:34px;}
					}
				}
			}
		}
		.list_second{width:430px;margin:0 auto;position: relative;
			/* button{width:100px;height:34px;background: #FFFFFF;border: 1px solid #3DB1FA;border-radius: 3px;font-size: 14px;color: #3DB1FA;text-align:center;line-height:34px;position: absolute;bottom:0;right:0;} */
			.el-form-item{
				.el-form-item__label{height:34px;}
				.el-form-item__content{width:250px;height:34px;
					.el-input{height:34px;
						.el-input__inner{height:34px;}
					}
				}
			}
			.getcode{width:100px;height:34px;background: #FFFFFF;border: 1px solid #3DB1FA;border-radius: 3px;font-size: 14px;color: #3DB1FA;text-align:center;line-height:34px;position: absolute;bottom:0;right:0;}
			.getcode:hover{background-color: #3db1fa;color: #fff;border-color: #3db1fa;}
			.getcode.disabled{background-color: #ccc;border-color:#ccc;color: #eee;cursor:not-allowed;}
		}
		.btn_list{height:34px;text-align:center;font-size:0px;padding-bottom:20px;
			button{width:100px;height:34px;background: #3db1fa;border-radius: 3px;font-size: 14px;color: #fff;text-align:center;line-height:34px;}
			button.back{background: #fff;color:#3db1fa;border:1px solid #3db1fa;}
		}
		// 弹框尺寸
		.el-dialog{width:560px;
			.el-dialog__header{
				span{font-size:14px;color: #333333;line-height:16px;}
			}
			.el-dialog__body{padding:20px 20px 40px;}
		}
	}
	.end{
		.el-dialog{width:440px;transition:all 0.2s ease;}
		.list_end{width:245px;margin:0 auto 30px;text-align:center;
			p{text-align:center;font-size: 16px;color: #3DB1FA;line-height:100%;}
			button{width:100px;height:34px;background: #3db1fa;border-radius: 3px;font-size: 14px;color: #fff;text-align:center;line-height:34px;}
		}
	}
</style>
