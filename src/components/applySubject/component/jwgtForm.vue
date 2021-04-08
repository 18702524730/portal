<template>
	<div class="jwgtForm">
		<el-form label-position="left" ref="ruleForm" :rules="rules" :model="conForm" label-width="160px">
			<!--境外个体-->
			<div>
				<el-form-item label="申请人姓名(英文)" prop="name_en">
					<el-input v-model ="conForm.name_en" :maxlength="60" placeholder="请填写申请人英文姓名，应与有效证件保持一致"></el-input>
				</el-form-item>
				<el-form-item label="申请人姓名(中文)" prop="apply_name">
					<el-input v-model ="conForm.apply_name":maxlength="60" placeholder="请填写申请人中文姓名，应与有效证件保持一致"></el-input>
				</el-form-item>
				<el-form-item label="申请人护照号" prop="apply_number">
					<el-input v-model="conForm.apply_number" :maxlength="30" placeholder="请填写申请人护照号"></el-input>
				</el-form-item>
				<el-form-item label="申请人联系电话" prop="apply_phone">
					<el-input v-model="conForm.apply_phone" :maxlength="30" placeholder="请填写申请人联系电话，电话前请加国家代码"></el-input>
				</el-form-item>
				<el-form-item label="申请人邮箱" prop="apply_email">
					<el-input v-model="conForm.apply_email" :maxlength="30" placeholder="请填写申请人邮箱"></el-input>
				</el-form-item>
				<el-form-item label="申请人传真" prop="apply_fax">
					<el-input v-model="conForm.apply_fax" :maxlength="20" placeholder="请填写申请人传真"></el-input>
				</el-form-item>
				<el-form-item label="申请人地址" prop="area_id">
					<el-select v-model="conForm.area_id" placeholder="请选择国家/地区" style="width:100%;">
						<el-option v-for="item in areaData" :label="item.zh_name" :value="item.country_id+''">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="address" style="margin-top:22px;">
					<el-input v-model="conForm.address" auto-complete="off" class="form-ipt" :maxlength="80" placeholder="请填写申请人详细地址"></el-input>
				</el-form-item>
				<el-form-item label="申请人邮编" prop="zip_code">
					<el-input v-model="conForm.zip_code" :maxlength="6" placeholder="请填写6位邮政编码"></el-input>
				</el-form-item>
				<el-form-item label="申请人护照" prop="standby1">
					<div class="upload_component">
						<uploader @complete="setUploadedData" @resetUploader="resetUploader" :canPreview="true" :valueName="'standby1'" :url="standby1" :fileName="standby1_name" :size="2" :extensions="'pdf,jpg,jpeg,png'"></uploader>
						<div class="upload_tip">
							<p>请上传申请人护照复印件，并签署申请人签名</p>
							<p class="format">格式说明：格式为PDF/JPG/JPEG/PNG，大小限2M以内</p>
						</div>
					</div>
					<el-input type="hidden" v-model="conForm.standby1" style="display: none;"></el-input>
				</el-form-item>
				<el-form-item label="中文护照译本" prop="standby2">
					<div class="upload_component">
						<uploader @complete="setUploadedData" @resetUploader="resetUploader" :canPreview="true" :valueName="'standby2'" :url="standby2" :fileName="standby2_name" :size="2" :extensions="'pdf,jpg,jpeg,png'"></uploader>
						<div class="upload_tip">
							<p>请上传中文护照译本复印件，并签署申请人签名</p>
							<p class="format">格式说明：格式为PDF/JPG/JPEG/PNG，大小限2M以内</p>
						</div>
					</div>
					<el-input type="hidden" v-model="conForm.standby2" style="display: none;"></el-input>
				</el-form-item>
				<el-form-item label="">
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
		//境外个体邮箱验证
		let jwgt_checkEmail = (rule, value, callback) =>{
			let emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (!value) {
					return callback(new Error('申请人邮箱不能为空'));
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
		//固定电话验证
		let gatgr_checkPhone = (rule, value, callback) => {
			let reg = /^[0-9]*[\+\-]?[0-9]+$/;
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
				standby1:'',
				standby2:'',
				standby1_name:'',
				standby2_name:'',
			},
			rules:{
				//境外个体
				name_en:[
					{ required: true, message: '请填写申请人英文姓名', trigger: 'blur' },
					//{ min: 2, max: 20, message: '姓名长度 2到 20个字符', trigger: 'blur' }
				],
				apply_name:[
					{ required: true, message: '请填写申请人中文姓名', trigger: 'blur' },
					//{ min: 2, max: 20, message: '姓名长度 2到 20个字符', trigger: 'blur' }
				],
				apply_number: [
					{ required: true, message: '请输入申请人护照号', trigger: 'blur' },
					//{ min: 2, max: 30, message: '护照号长度 2到 30个字符', trigger: 'blur' }
				],
				apply_phone: [
					{ required: true, validator:gatgr_checkPhone, trigger: 'blur' }
				],
				apply_email:[
					{ required: true, validator:jwgt_checkEmail, trigger: 'blur' }
				],
				apply_fax:[
					/*{ required: true, message: '请输入申请人传真', trigger: 'blur' },*/
					{ min: 2, max: 20, message: '传真长度 2到 20个字符', trigger: 'blur' }
				],
				area_id:[
					{ required: true, message: '请选择国家/地区', trigger: 'change' }
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
					{ required: true, message: '请上传申请人护照复印件，并签署申请人签名', trigger: 'change' }
				],
				standby2:[
					{ required: true, message: '请上传中文护照译本复印件，并签署申请人签名', trigger: 'change' }
				],
			}
		}
	},
	mounted () {
		this.initCountry();
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
		//初始化国家
		initCountry(){
			var self = this;
			this.$http.get(countryUrl).then(function(resp){
				self.areaData = resp.data;
				self.initData();
			})
			.catch((error) => {
				console.error(error);
			});
		},
		getSelectName (code, dataName){
			var self = this;
			var data = self[dataName];
			var ret = '';
			$.each(data, function(i, item){
				if (item.country_id == code) {
					ret = item.zh_name;
					return false;
				}
			});
			return ret;
		},
		//国家拼接
		getAreaInfo(){
			var data = this.conForm;
			var area_id = data.area_id;
			return [this.getSelectName(area_id, 'areaData')].join(' ');
		},
		//添加主体请求
		add(formName){
			var self = this;
			if (self.submitDisabled) {
				return;
			}
			self.submitDisabled = true;
			self.$refs[formName].validate((valid) => {
				if (valid) {
					var tip = self.isEdit ? '修改': '增加';
					self.$confirm('确认'+tip+'该主体吗?', '提示', {
						type: 'warning',
						closeOnClickModal: false
					}).then(() => {
						self.conForm.area_info = self.getAreaInfo();
						self.conForm.is_default = self.isDefault ? 1 : 0;
						self.conForm.apply_type = self.applyType || 1;
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
			self.conForm.area_id = self.conForm.area_id ? (self.conForm.area_id+'') : '';
			self.standby1 = self.conForm.standby1;
			self.standby2 = self.conForm.standby1;
			self.standby1_name = self.conForm.standby1_name;
			self.standby2_name = self.conForm.standby2_name;
			self.isDefault = self.conForm.is_default == 1 ? true : false;
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
.jwgtForm{
	width: 590px;
}
</style>
