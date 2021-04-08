<template>
	<section style="position:relative;">
		<div class="basicData">
			<h4 class="navTitle">基本信息</h4>
			<div v-loading="loading" style="min-height: 300px">
			<el-form class="basicData_list" ref="ruleForm" label-position="left" :rules="basicRules" :model="form" label-width="86px">
				<el-upload v-if="hasFormData" class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" name="Filedata" accept="image/jpg,image/jpeg,image/gif,image/bmp,image/png">
					<div class="basicData_img fl">
						<img v-if="!imageUrl" src="../../assets/img/sebe.png" alt="">
						<img v-if="imageUrl" :src="imageUrl">
						<div class="lc">修改头像</div>
					</div>
				</el-upload>
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
					<div class="basicData_img">
						<img v-if="!imageUrl" src="../../assets/img/sebe.png" alt="">
						<img v-if="imageUrl" :src="imageUrl">
						<p>修改头像</p>
					</div>
				</file-upload>

				<el-form-item label="昵称" class="myWid" prop="nickname">
					<el-input v-model="form.nickname" :maxlength="20" placeholder="请输入昵称"></el-input>
				</el-form-item>
				<el-form-item label="姓名" class="myWid" prop="truename">
					<el-input v-model="form.truename" :maxlength="20" placeholder="请输入姓名"></el-input>
				</el-form-item>
				<el-form-item label="性别" class="myWid" prop="sex">
					<el-radio-group v-model="form.sex">
							<el-radio :label="1">男</el-radio>
							<el-radio :label="2">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="所属行业" class="myWid" prop="member_industry">
					<el-select v-model="form.member_industry" placeholder="选择所属行业">
						<el-option v-for="item in industrys" :label="item.value" :value="item.code"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="手机号" class="myWid truephone" prop="phone">
					<el-input v-model="form.phone" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="微信" class="myWid" prop="member_wechat">
					<el-input v-model="form.member_wechat" placeholder="请输入微信号"></el-input>
				</el-form-item>
				<el-form-item label="QQ号" class="myWid" prop="member_qq">
					<el-input v-model="form.member_qq" placeholder="请输入QQ号"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" class="myWid" prop="email">
					<el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
				</el-form-item>
				<el-form-item label=" " class="myWid mt30">
					<el-button type="primary" @click="saveBasicInfo('ruleForm')">保存</el-button>
				</el-form-item>
			</el-form>
			</div>
		</div>
	</section>
</template>

<script>
 	import Vue from 'vue'
 	import $ from 'jquery'
 	import fileUpload from 'vue-upload-component'
 	const Extensions = 'jpg,jpeg,gif,bmp,png'
 	const userUrl = CONFIG.userUrl;
 	const uploadUrl = userUrl + '/api/file/upload';
 	export default {
		components: {
			fileUpload
		},
		data(){
			//手机号码验证
			// let checkPhone = (rule, value, callback) => {
			//   let reg = /^1\d{10}$/;
			//   // if (!value) {
			//   //   return callback(new Error('手机号不能为空'));
			//   // }
			//   setTimeout(() => {
			//     if (!reg.test(value)) {
			//       callback(new Error('手机号格式错误'));
			//     } else {
			//       callback();
			//     }
			//   }, 1000);
			// };
			let checkEmail = (rule, value, callback) =>{
				let emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

				// if (!value) {
				//   return callback(new Error('邮箱不能为空'));
				// }
				setTimeout(() => {
					if (!emailReg.test(value)) {
						callback(new Error('邮箱格式错误'));
					} else {
						callback();
					}
				}, 1000);
			};
			let checkIqcq = (rule, value, callback) =>{
				let iqcqReg = /[1-9][0-9]{4,15}/;
				setTimeout(() => {
					if(value){
						if (!iqcqReg.test(value)) {
							callback(new Error('QQ格式错误'));
						}else {
							callback();
						}
					}else {
						callback();
					}
				}, 1000);
			};
			let check = (rule, value, callback) =>{
				if (!value) {
					return callback(new Error('性别不能为空'));
				}
			};
			return {
				userUrl: userUrl,
				uploadUrl: uploadUrl,
				etc:{
					accept: 'image/*',
					extensions: Extensions,
					multiple: false,
					postAction: uploadUrl,
					name: 'Filedata',
					files: [],
					size: 1024 * 1024 * 10,
					drop: true,
					title: '图片',
					events: {
						add(file, component) {
							var fileName, nameInfo, fileSize;
							console.log(this.mode);
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
							/*fileName = nameInfo[0];
							var fileSizeFilter = function(v){
								// ie9
								if (v === -1) {
									return '';
								}
								var ret = v;
								if (v > 1024*1024) {
									ret = (ret/1024/1024).toFixed(1) + 'M';
								}else{
									ret = (ret/1024).toFixed(1) + 'KB';
								}
								return ret;
							}*/
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
				hasFormData: window.FormData, //区分ie9
				loading: false,
				imageUrl: '',
				form:{
					nickname:"",
					truename:"",
					sex:1,
					member_industry:"",
					phone:"",
					wechat:"",
					iqcq:"",
					email:""
				},
				industrys: [{
					// value: '1',
					// label: '农、林、牧、渔业'
				}],
				basicRules:{
					sex:[
						{type:'integer',required: true, message: '性别不能为空', trigger: 'change'}
					],
					member_industry:[
						{required: true, message: '所属行业不能为空', trigger: 'change'}
					],
					nickname:[
						{ required: true, message: '昵称不能为空', trigger: 'blur' },
						{ min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
					],
					truename:[
						{ required: true, message: '姓名不能为空', trigger: 'blur' },
						{ min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
					],
					// phone: [
					//   { required: true, message: '手机号不能为空', trigger: 'blur' },
					//   { validator:checkPhone, trigger: 'blur' }
					// ],
					member_qq:[
						{ min:0, max: 15, message: 'QQ长度在15个字符以内', trigger: 'blur' },
						{ validator:checkIqcq, trigger: 'blur' }
					],
					member_wechat:[
						{ min:0, max: 30, message: '微信号长度在30个字符以内', trigger: 'blur' }
					],
					email:[
						{ required: true, message: '邮箱不能为空', trigger: 'blur' },
						{ validator:checkEmail, trigger: 'blur' },
						{ max: 30, message: '邮箱格式错误', trigger: 'blur' }
					]

				}
			};
		},
		mounted(){
			this.getCartList();
		},
		methods: {
			// 查询预订单数据
			getCartList(){
				var self = this;
				self.loading = true;
				this.$http.get('./api/findMember').then(function(response) {
					var data = response.data;
					self.loading = false;
					if(data){
						self.form = data;
						var phone = data.phone;
						if (phone) {
							self.form.phone = phone.slice(0, 3) + '****' + phone.slice(-4);
						}
						self.imageUrl = data.avatar;
					};
				}).catch(function(response) {
					self.loading = false;
					console.log(response)
				});
				this.$http.get('./api/industry?fthCode=01').then(function(response) {
					var data = response.data;
					if(data){
						self.industrys = data;
					};
				}).catch(function(response) {
					console.log(response)
				});
			},
			handleAvatarSuccess(res, file) {
				// this.imageUrl = URL.createObjectURL(file.raw);
				this.imageUrl = res.url;
			},
			beforeAvatarUpload(file) {
				const isImage = 'jpg,jpeg,png,gif,bmp'.indexOf(file.type.replace('image/', '')) !== -1;
				const isLt2M = file.size / 1024 / 1024 < 10;

				if (!isImage) {
					this.$message.error('上传图片格式不正确，只支持jpg,jpeg,png,gif,bmp');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 10MB!');
				}
				return isImage && isLt2M;
			},
			saveBasicInfo(formName) {
				var self = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$confirm('确认修改用户基本信息吗?', '提示', {
							type: 'warning'
						}).then(() => {
							let para = {
								'avatar':this.imageUrl,
								// 'phone':this.form.phone,
								'email':this.form.email,
								'nickname':this.form.nickname,
								'truename':this.form.truename,
								'sex':this.form.sex,
								'member_wechat':this.form.member_wechat,
								"member_qq":this.form.member_qq,
								"member_industry":this.form.member_industry
							};
							self.$http.post('./api/member',para).then(function(response) {
								var data = response.data;
								self.$message({
									title: '成功',
									message: '保存成功',
									type: 'success'
								});
								self.$emit('updateBaseInfo', data);
								// setTimeout(self.$router.push({ path: '/main'}),3000);
							}, function(response) {
								// 这里是处理错误的回调
								// console.log(response)
								self.$alert(response.response.data.msg, '提示', {
									confirmButtonText: '确定',
									callback: function(){
										self.getCartList();
									}
								});
							});
						}).catch(() => {
						});
					}
				})
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
				this.imageUrl = data.data.url;
			}
		}
	}
</script>

<style lang="scss">
.basicData{
	padding-top: 20px;
	.navTitle{padding-left: 20px;}
	.avatar-uploader{margin-bottom: 24px}
	.basicData_list{
		position: relative;padding-left: 30px;padding-top: 24px;padding-bottom: 40px;
		.file-uploads{
			display: block;padding-bottom:24px;position:static;width:166px;overflow: hidden;
			.file-uploads-title,.file-uploads-input{display: none;}
		}
	}
	.basicData_img{
		width: 90px;height: 90px;overflow: hidden;position: relative;
		img{width: 100%;height: 100%;vertical-align:middle;border-radius: 50%;border: 1px solid #eee;}
		div{opacity: 0;width: 90px;height: 90px;position: absolute;left: 0;top:0;font-size: 14px;line-height: 90px;color: #fff;border-radius: 50%;cursor: pointer;}
	}
	.basicData_img:hover{
		div{background-color: rgba(0, 0, 0, 0.5);opacity: 1;}
	}
	.basicData_list .myWid{
		width: 310px;
		.el-select{width: 100%;}
	}
}
</style>
