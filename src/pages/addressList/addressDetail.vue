<template>
	<div class="addressEdit clearfix">
		<div class="formWrap">
			<el-form label-position="left" :model="postData" :rules="rules" ref="ruleForm" auto-complete="off" label-width="130px" class="ruleForm">
				<el-form-item class="addAddress" label="收件人" prop="true_name">
					<el-input v-model="postData.true_name" placeholder="请填写收件人姓名" :maxlength="60" ></el-input>
				</el-form-item>
				<el-form-item class="addAddress" label="收件人电话" prop="tel_phone">
					<el-input v-model="postData.tel_phone" placeholder="请填写收件人电话" :maxlength="13"></el-input>
				</el-form-item>

				<el-form-item class="addAddress" label="收件人邮箱" prop="email">
					<el-input v-model="postData.email" placeholder="请填写收件人邮箱" :maxlength="50" ></el-input>
				</el-form-item>

				<el-form-item label="收件地址" class="form-group" required>
					<el-form-item class="address_option form-ipt-sm" prop="province_id" style="display:inline-block;width:140px;margin-right: 6px;">
						<el-select v-model="postData.province_id" placeholder="请选择省" @change="changeProvince('postData', postData.province_id)">
							<el-option
								v-for="item in provinceData"
								:label="item.name"
								:value="item.area_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item class="address_option form-ipt-sm" prop="city_id" style="display:inline-block;width:140px;margin-right: 5px;">
						<el-select v-model="postData.city_id" placeholder="请选择市" @change="changeCity('postData', postData.city_id)">
							<el-option
								v-for="item in cityData"
								:label="item.name"
								:value="item.area_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item class="address_option form-ipt-sm" prop="area_id" style="display:inline-block;width:140px;">
						<el-select v-model="postData.area_id" placeholder="请选择区">
							<el-option
								v-for="item in areaData"
								:label="item.name"
								:value="item.area_id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form-item>
				<el-form-item class="addAddress" label="详细地址" prop="address">
					<el-input v-model="postData.address" placeholder="具体到街道、门牌号等" :maxlength="80"></el-input>
				</el-form-item>

				<el-form-item class="addAddress" label="收件人邮编" prop="zip_code" :maxlength="6">
					<el-input v-model="postData.zip_code" :maxlength="6" placeholder="请填写收件人邮编" ></el-input>
				</el-form-item>
				<el-form-item label="" style="margin-top: -15px;">
					<el-checkbox v-model="isDefault">设为默认</el-checkbox>
				</el-form-item>
				<el-form-item class="btn">
					<el-button type="primary" @click="addSbj('ruleForm')" :disabled="submitDisabled">保存</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import qs from 'qs'
	const addressUrl = './api/areas';
	const DefaultPostData = {
		email:'',
		province_id:'',
		city_id:'',
		area_id:'',
		address:'',
		zip_code:''
	}
	export default {
		validator: null,
		props: {
			itemData: Object,
		},
		data () {
			//手机号码验证
			let checkPhone = (rule, value, callback) => {
				let reg = /(^1\d{10}$)|(^\d{3,4}-\d{7,8}$)|(^\d{7,8}$)/;
				if (!value) {
					return callback(new Error('请填写收件人电话'));
				}
				setTimeout(() => {
					if (!reg.test(value)) {
						callback(new Error('联系电话格式错误，固话若加区号请用-分隔'));
					} else {
						callback();
					}
				}, 200);
			};
			let code = (rule, value, callback) => {
				let reg = /^\d{6}/;
				if (!value) {
					return callback(new Error('请填写邮政编码'));
				}
				if (value.length < 6) {
						return callback(new Error('邮政编码仅限6位数字'));
				}
				setTimeout(() => {
					if (!reg.test(value)) {
						callback(new Error('请填写6位数字'));
					} else {
						callback();
					}
				}, 200);
			};
			let email = (rule, value, callback) =>{
				let mail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				if (!value) {
						return callback(new Error('请填写收件人邮箱'));
				}
				if (value.length > 50) {
						return callback(new Error('收件人邮箱输入过长'));
				}
				setTimeout(() => {
					if (!mail.test(value)) {
						callback(new Error('收件人邮箱格式错误'));
					} else {
						callback();
					}
				}, 200);
			}
			return{
				submitDisabled: false,
				postshow:true,
				formData:{},
				cityName:{},
				postData: {...DefaultPostData},
				provinceData:[],
				cityData:[],
				areaData:[],
				catename:'',
				showEmpty:false,
				editForm:'',
				isDefault:false,
				// 表单验证规则
				rules: {
					// address:[
					//   { type: "string",required: true, message: '请填写收件人地址', trigger: 'blur' }
					// ],
					true_name:[
						{ type: "string",required: true, message: '请填写收件人姓名', trigger: 'blur' },
						{ min: 1, max: 60, message: '收件人姓名不能超过60个字', trigger: 'blur' }
					],
					tel_phone: [
						{ type: "string",validator:checkPhone, required: true,trigger: 'blur' }
					],
					province_id: [
						{type: 'integer', required: true, message: '请选择省份', trigger: 'change' }
					],
					city_id: [
						{type: 'integer', required: true, message: '请选择城市', trigger: 'change' }
					],
					area_id: [
						{type: 'integer', required: true, message: '请选择区', trigger: 'change' }
					],
					address: [
						{type: "string", required: true, message: '请填写收件人地址', trigger: 'blur' },
						{ min: 1, max: 80, message: '详细地址输入过长', trigger: 'blur' }
					],
					email:[
						{ type: "string",validator:email, required: true,trigger: 'blur' }
					],
					zip_code:[
						{ type: "string",validator:code, required: true,trigger: 'blur' }
					]
				}
			}
		},
		mounted(){
			this.address_id = this.postData.address_id || 0;
			this.initProvince();
		},
		methods:{
			// 初始化省份
			initProvince(){
				var self = this;
				this.$http.get(addressUrl+'?pId=0')
				.then(function(resp){
					resp = resp.data;
					if(resp.elements){
						self.provinceData = resp.elements;
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
				var self = this;
				self[dataName] = [];
				if(!code){
					return;
				}
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
					console.log(error);
				});
			},
			//更改省
			changeProvince(formName, provinceCode, prevfix){
				this[formName].area_id = '';
				this[formName].city_id = '';
				this._triggerChange(provinceCode,  (prevfix ? prevfix : '') + 'cityData');
			},
			//更改市
			changeCity(formName, cityCode, prevfix){
				this[formName].area_id = '';
				this._triggerChange(cityCode, (prevfix ? prevfix : '') + 'areaData');
			},
			//获取选中的省市区对应的中文名称
			getSelectName (code, dataName){
				var data = this[dataName];
				var ret = '';
				data.forEach((item, i) => {
					if (item.area_id == code) {
						ret = item.name;
						return false;
					}
				});
				return ret;
			},
			//地址拼接area_info
			getAreaInfo(data, prevfix){
				var apply_type = this.apply_type;
				var area_id = data.area_id;
				var province_id = data.province_id;
				var city_id = data.city_id;
				return [this.getSelectName(province_id, 'provinceData'), this.getSelectName(city_id, (prevfix ? prevfix : '') + 'cityData'), this.getSelectName(area_id, (prevfix ? prevfix : '') + 'areaData')].join(' ');
			},
			// 提交前验证
			validateBeforeSubmit(formName){
				var self = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						self.submit();
					} else {
						//self.$message.error('标红的为必填项，请检查并正确填写。');
						return false;
					}
				});
			},
			//保存
			addSbj(formName){
				this.address_id = this.postData.address_id || 0;
				var self = this;
				if (self.submitDisabled) {
					return;
				}
				self.submitDisabled = true;
				self.catename = this.address_id == 0 ? '添加' : '修改'
				for(var i=0;i<self.cityName.length;i++){
					if(self.cityName[i].area_id == self.postData.area_id){
						self.postData.area = self.cityName[i].name;
					}
				};
				var data = {};
				var area = '';
				if(!self.postData.city){
					area = self.formData.area_info;
				}else{
					area = self.postData.province+" "+self.postData.city+" "+self.postData.area;
				}
				// data.area_info = area;
				//调取接口
				data = {
					"province_id":this.postData.province_id,
					"city_id":this.postData.city_id,
					"area_id":this.postData.area_id,
					"address":this.postData.address,
					"true_name":this.postData.true_name,
					"tel_phone":this.postData.tel_phone,
					"area_info":this.getAreaInfo(this.postData),
					"zip_code":this.postData.zip_code,
					"email":this.postData.email
				};
				self.$refs[formName].validate((valid) => {
					if(valid){
						this.$confirm('确认'+this.catename+'该地址吗?', '提示', {
							type: 'warning',
							closeOnClickModal: false,
							lockScroll: false,
						}).then(() => {
							if(!self.isDefault){
								data.is_default = '0';
							}else{
								data.is_default = '1';
							};
							if(self.address_id==0){
								this.$http.post('./api/address',data).then(function(response) {
									self.submitDisabled = false;
									var data = response.data;
									if (data) {
										self.postData = {...DefaultPostData};
										self.$nextTick(() => {
											self.$refs.ruleForm.resetFields();
										});
										self.$emit('addSuccess');
										self.$message({
											title: '成功',
											message: '保存成功',
											type: 'success'
										});
									}
								}, function(error) {
									self.$message.error(error.response.data.msg);
									self.submitDisabled = false;
								});
							}else{
								data.address_id = this.address_id;
								this.$http.put('./api/address?access_token'+'accessToken',data).then(function(response) {
									self.submitDisabled = false;
									var data = response.data;
									if (data) {
										self.postData = {...DefaultPostData};
										self.$nextTick(() => {
											self.$refs.ruleForm.resetFields();
										});
										self.$emit('addSuccess');
										self.$message({
											title: '成功',
											message: '修改成功',
											type: 'success'
										});
									}
								}, function(error) {
									self.$message.error(error.response.data.msg);
									self.submitDisabled = false;
								});
							}
						}).catch(() => {
							self.submitDisabled = false;
						});
					} else {
						self.submitDisabled = false;
						//self.$message.error('标红的为必填项，请检查并正确填写。');
						return false;
					}
				})
			}
		},
		watch: {
			itemData(){
				this.postData = Object.assign({...DefaultPostData}, this.itemData);
				if (!this.postData.address_id) {
					this.isDefault = false;
					this.$nextTick(() => {
						this.$refs.ruleForm.resetFields();
					});
					return;
				}
				this.isDefault = this.postData.is_default == 1 ? true: false;
				this._triggerChange(this.postData.province_id, 'cityData');
				this._triggerChange(this.postData.city_id, 'areaData');
				this.$nextTick(() => {
					this.$refs.ruleForm.validate();
				});
			}
		}
	}
</script>

<style lang="scss">
.addressEdit{
	background: #fff;position: relative;
	.formWrap{
		background: #fff;padding-left: 30px;padding-top: 30px;
		.ruleForm{width: 600px;}
		label{line-height: 20px;margin-top: 10px;}
		.addAddress{
			width: 570px;
			.el-form-item__content{}
		}
		.check{color:#666;margin-left: 130px;margin-top: -10px;}
		.address_option{width: 135px;}
	}
}
</style>
