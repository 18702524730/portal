<template>
	<div class="dlqyForm">
		<el-form label-position="left" ref="ruleForm" :rules="rules" :model="conForm" label-width="140px">
			<!--大陆企业-->
			<div>
				<!-- <h4 v-if="applyType == 2">主体信息</h4> -->
				<el-form-item label="申请人企业名称" prop="apply_name">
					<el-input v-model ="conForm.apply_name" :maxlength="60" placeholder="请填写申请人企业名称，与企业营业执照信息保持一致" :disabled="isEdit && conForm.is_checked && conForm.is_checked != 4 ? true : false"></el-input>
				</el-form-item>
				<el-form-item label="统一社会信用代码" prop="apply_number">
					<el-input v-model ="conForm.apply_number" :maxlength="18" placeholder="请填写统一社会信用代码" :disabled="isEdit && conForm.is_checked && conForm.is_checked != 4 ? true : false"></el-input>
				</el-form-item>
				<el-form-item label="企业联系电话" prop="apply_phone">
					<el-input v-model ="conForm.apply_phone" :maxlength="13" placeholder="请填写企业联系电话，固话前请加区号"></el-input>
				</el-form-item>
				<el-form-item label="企业邮箱" prop="apply_email">
					<el-input v-model="conForm.apply_email" :maxlength="30" placeholder="请填写企业邮箱"></el-input>
				</el-form-item>
				<el-form-item label="企业地址" required>
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
						<el-input v-model="conForm.address" :maxlength="80" placeholder="请填写申请企业地址" auto-complete="off" class="form-ipt"></el-input>
					</el-form-item>
				</el-form-item>
				<el-form-item label="邮编" prop="zip_code">
					<el-input v-model="conForm.zip_code" :maxlength="6" placeholder="请填写申请企业地址的邮政编码"></el-input>
				</el-form-item>
				<el-form-item label="企业营业执照副本复印件（加盖公章）" prop="standby1">
					<div class="upload_component">
						<uploader @complete="setUploadedData" @resetUploader="resetUploader" :canPreview="true" :valueName="'standby1'" :url="standby1" :fileName="standby1_name" :size="2" :extensions="'pdf,jpg,jpeg,png'" :disabled="isEdit && conForm.is_checked && conForm.is_checked != 4 ? true : false"></uploader>
						<div class="upload_tip">
							<p>请上传企业营业执照副本复印件，并加盖企业公章</p>
							<p class="format">格式说明：格式为PDF/JPG/JPEG/PNG，大小限2M以内</p>
						</div>
					</div>
					<el-input type="hidden" v-model="conForm.standby1" style="display: none;"></el-input>
				</el-form-item>
				<div v-if="applyType == 2 && conForm.is_checked" class="truethInfo">
					<h4>
						实名认证信息
						<span v-if="conForm.is_checked" :class="{label_base: true, label_success: conForm.is_checked == 1, label_warning: conForm.is_checked == 2, label_fail: conForm.is_checked == 3}">{{conForm.is_checked == 1 ? '已实名认证' : (conForm.is_checked == 2 || conForm.is_checked == 3) ? '实名认证中' : conForm.is_checked == 4 ? '认证失败' : ''}}</span>
					</h4>
					<el-form-item label="企业名称">
						<p class="readP">{{conForm.apply_name}}</p>
					</el-form-item>
					<el-form-item label="统一社会信用代码">
						<p class="readP">{{conForm.apply_number}}</p>
					</el-form-item>
					<el-form-item label="企业对公账户">
						<p class="readP">{{conForm.inAcctNo}}</p>
					</el-form-item>
					<el-form-item label="对公账户开户行">
						<p class="readP">{{conForm.bankName}}</p>
					</el-form-item>
					<el-form-item label="企业营业执照副本复印件（加盖公章）">
						<uploader @complete="setUploadedData" @resetUploader="resetUploader" :canPreview="true" :valueName="'standby1'" :url="standby1" :fileName="standby1_name" :size="2" :extensions="'pdf'" :disabled="isEdit && conForm.is_checked && conForm.is_checked != 4 ? true : false"></uploader>
					</el-form-item>
				</div>
				<el-form-item label="" :style="applyType == 2 && conForm.is_checked ? '' : 'margin-top: -10px;'">
					<el-checkbox v-model="isDefault">设为默认</el-checkbox>
				</el-form-item>
			</div>
			<el-form-item>
				<el-button type="primary" @click="add('ruleForm')" :disabled="submitDisabled">保存</el-button>
			</el-form-item>
		</el-form>
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
		//大陆企业营业执照
		let dlqy_checkNumber = (rule, value, callback) =>{
			let reg = /(^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$)|([0-9A-Za-z]{15})/;
			if (!value) {
					return callback(new Error('请填写统一社会信用代码'));
			}
			setTimeout(() => {
					if (!reg.test(value)) {
						callback(new Error('统一社会信用代码格式错误'));
					} else {
						callback();
					}
			}, 50);
		};
		//大陆个体固定电话验证
		let dlqy_checkPhone = (rule, value, callback) => {
			let reg = /(^1\d{10}$)|(^\d{3,4}-\d{7,8}$)|(^\d{7,8}$)/;
			if (!value) {
					return callback(new Error('请填写申请人联系电话'));
			}
			setTimeout(() => {
					if (!reg.test(value)) {
						callback(new Error('请填写正确的联系电话，固话前请加区号和-'));
					} else {
						callback();
					}
			}, 50);
		};
		//大陆企业邮箱验证
		let dlqy_checkEmail = (rule, value, callback) =>{
			let emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (!value) {
					return callback(new Error('请填写企业邮箱'));
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
		return {
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
				standby1:null,
				standby2:null,
				standby1_name:null,
				standby2_name:null,
				is_checked: '', //1表示已实名认证过
				inAcctNo:'',
				bankName:''
			},
			rules:{
				//大陆企业
				apply_name:[
					{ required: true, message: '请填写企业名称', trigger: 'blur' },
				],
				apply_number: [
					{ required: true, validator:dlqy_checkNumber, trigger: 'blur' }
				],
				apply_phone: [
					{ required: true, validator:dlqy_checkPhone, trigger: 'blur' }
				],
				apply_email:[
					{ required: true, validator:dlqy_checkEmail, trigger: 'blur' }
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
					/*{ required: true, message: '请输入邮政编码', trigger: 'blur' },
					{ max: 12, message: '邮编最长12个字符', trigger: 'blur' }*/
				],
				standby1:[
					{ required: true, message: '请上传企业营业执照副本复印件，并加盖企业公章', trigger: 'change' }
				],
			}
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
				var city_id = self.conForm.city_id;
				var area_id = self.conForm.area_id;
				self._triggerChange(self.conForm.province_id, 'cityData');
				self._triggerChange(self.conForm.city_id, 'areaData');
				/*setTimeout(function(){
					self.conForm.city_id = city_id+'';
					setTimeout(function(){
						self.conForm.area_id = area_id+'';
					}, 200);
				}, 200);*/
			}else{
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
	}
}
</script>


<style lang="scss">
.dlqyForm{
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
		.el-form-item{margin-bottom: 10px;}
	}
	.change{color:#3db1fa;cursor: pointer;}
}
</style>
