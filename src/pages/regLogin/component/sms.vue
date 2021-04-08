<template>
	<form autocomplete="off" class="sms_login_box">
		<div class="ipt-wrap" :class="{inputfocus:!!regData.phone ||　iptphone}" @click="phoneclick()">
			<input type="text" class="ipt" @focus="iptphone=true" placeholder="请输入手机号" ref="phone" @blur="iptphone=false" v-model="regData.phone" maxlength="11">
		</div>
		<div class="ipt-wrap code-wrap" :class="{inputfocus:!!regData.token || ipttoken}" @click="tokenclick()">
			<input type="text" class="ipt" v-model="regData.token" placeholder="请输入验证码" ref="token" maxlength="6" @focus="ipttoken=true" @blur="ipttoken=false">
			<button class="btn getcode" :class="{disabled: preventCode}" @click.prevent="getCode">{{codeText}}</button>
		</div>
		<div class="ipt-wrap captcha-wrap" v-if="showCode" :class="{inputfocus:!!regData.captcha ||　iptcap}" @click="iptcap=true">
			<input type="text" class="ipt" v-model="regData.captcha"  maxlength="4" @focus="iptcap=true" @blur="iptcap=false">
			<label class="name label-name">请输入校验码</label>
			<span>
				<img class="ver-code" :src="codeUrl + '/servlet/captchaCode?t='+ random" alt="校验码" width="80" height="25" />
				<img src="~assets/img/reg_login/gx.png" class="refresh" @click="capRefresh()">
			</span>
		</div>
		<span class="reminder">
			<label>{{ver_tip}}</label>
		</span>
		<!-- <div class="iread">
			<label @click="isRead=!isRead"><span :class="{active:isRead}"></span>我已阅读并同意<a :href="cartUrl+'/shop/pages/regAgreement.html'" target="_blank">《拾贝网用户注册协议》</a></label>
		</div> -->
		<el-button size="medium" type="primary" class="submit_btn" :class="{disabled: submitDisabled}" @click.prevent="preLogin">{{buttonText}}</el-button>
	</form>
</template>
<script>
	import Vue from 'vue'
	import $ from 'jquery'
	import Util from 'src/common/js/util.js'
	const rootUrl = CONFIG.rootUrl;
	const cartUrl = CONFIG.cartUrl;

	import qs from 'qs'
	import md5 from 'md5'

	export default {
		components: {
			//sebeHeader,
			//sebeFooter
		},
		data(){
			return{
				isRead:true,
				showCode:false,
				codeUrl: rootUrl,
				random: Math.random(),
				iptcap:false,
				iptphone:false,
				ipttoken:false,
				iptpass:false, 
				buttonText: '登录',
				cartUrl: cartUrl,
				codeText:'获取验证码',
				isRead: true,
				isPasswordType: true,
				ver_tip:'',//校验提示
				passwordOrigin:'',
				regData: {
					phone: '',
					token: ''
				},
				preventCode: false,//控制重发验证码
				submitDisabled:false//禁止重复提交
			}
		},
		watch: {
      regData: {
        handler: function (val, oldVal) {
          if (val.phone || oldVal.phone) {
            sessionStorage.setItem('phoneNum', val.phone)
          } else {
            sessionStorage.removeItem('phoneNum')
          }
        },
        deep: true
      }
    },
		methods:{
			capRefresh(){
				this.random = Math.random();
			},
			phoneclick(){
				this.iptphone = true;
				this.$refs['phone'].focus();
			},
			tokenclick(){
				this.ipttoken = true;
				this.$refs['token'].focus();
			},
			//获取手机验证码
			getCode(){
				var self = this;
				if (self.preventCode || !this.checkPhone()) {
					return;
				}
				self.preventCode=true;
				self.ver_tip = '';
				self.$http.post('./api/login/sendPhoneCode', {phone: self.regData.phone})
				.then((response) => {
					console.log(response.data)
					var data = response.data;
					self.$message('验证码已发送');
					self.timeout();
				})
				.catch((error) => {
					var data = error.response.data;
					self.ver_tip = data.msg;
				});
			},
			preLogin(){
				var self = this;
				if (self.submitDisabled || !self.checkValid()) {
					return;
				}
				self.buttonText = '登录中...';
				self.ver_tip = '';
				self.submitDisabled = true;
				self.$http.post('./api/beforeLogin', {
					account: self.regData.phone
				})
				.then((response) => {
					var data = response.data;
					self.regData.beforeLoginCode = data.code;
					self.login();
				})
				.catch((error) => {
					self.submitDisabled = false;
					self.ver_tip = '系统繁忙，请稍候再试';
					self.buttonText = '立即登录';
					console.log('preLogin:'+ error);
				});
			},
			login(){
				var self = this;
				var postData = self.regData,
					data = {};
				if (self.showCode) {
					if(self.$cookie.get('resourceType')==6){
						data = {
							phone: postData.phone,
							phoneCode: postData.token,
							beforeLoginCode: postData.beforeLoginCode,
							captcha: postData.captcha,
							loginType:2,
							resourceType:6
						}
					}else{
						data = {
							phone: postData.phone,
							phoneCode: postData.token,
							beforeLoginCode: postData.beforeLoginCode,
							captcha: postData.captcha,
							loginType:2
						}
					}
				}else{
					if(self.$cookie.get('resourceType')==6){
						data = {
							phone: postData.phone,
							phoneCode: postData.token,
							beforeLoginCode: postData.beforeLoginCode,
							loginType:2,
              resourceType:6
						}
					}else{
						data = {
							phone: postData.phone,
							phoneCode: postData.token,
							beforeLoginCode: postData.beforeLoginCode,
							loginType:2
						}
					}
				}
				self.$http.post('./api/login', data)
				.then((response) => {
					self.submitDisabled = false;
					self.buttonText = '登录成功';
					var data = response.data;
					self.userName = data.truename;
					self.loginSuccessHandle();
				})
				.catch((error) => {
					console.log(error.response);
					self.buttonText = '立即登录';
					var data = error.response.data;
					if (data.status === 10003) {
						self.showCode = true;
					}
					if (data.body) {
						if (data.body[0]) {
							self.showCode = true;
						} else {
							self.showCode = false;
						}
					}
					self.ver_tip = data.msg;
					self.submitDisabled = false;
					self.capRefresh();
				});
			},
			timeout(){
				var self = this;
				var second = 60, timer;
				self.preventCode = true;
				timer = setInterval(function(){
					if(second<=0){
						clearInterval(timer);
						second = 60;
						self.codeText = "重发动态码";
						self.preventCode = false;
					}else{
						self.codeText = second + "s";
						self.preventCode = true;
						second--;
					}
				}, 1000);
			},
			// 登录成功
			loginSuccessHandle(){
				var hash = location.hash;
				if (hash.indexOf('return_url') !== -1) {
          location.href = decodeURIComponent(Util.getHashString('return_url'));
				}else{
					this.$router.push('/')
				}
			},
			checkPhone(){
				var regData = this.regData;
				var phone = regData.phone;
				if (!phone.trim()) {
					this.ver_tip = '请输入手机号';
					return false;
				}else if(!/^1\d{10}$/.test(phone)){
					this.ver_tip = '请输入正确的手机号';
					return false;
				}
				return true;
			},
			checkValid(){
				var regData = this.regData;
				var phone = regData.phone;
				var captcha = regData.captcha;
				var token = regData.token;
				if (!phone.trim()) {
					this.ver_tip = '请输入手机号';
					return false;
				}else if(!/^1\d{10}$/.test(phone)){
					this.ver_tip = '请输入正确的手机号';
					return false;
				}
				if(!token){
					this.ver_tip = '请输入动态密码';
					return false;
				}
				if (this.showCode) {
					if (!captcha.trim()) {
						this.ver_tip = '请输入验证码';
						return false;
					}else if(captcha.length !== 4){
						this.ver_tip = '校验码为4位数';
						return false;
					}
				}
				if (!this.isRead) {
					this.ver_tip = '请阅读并同意《拾贝网用户注册协议》';
					return false;
				}
				return true;
			}
		},
		mounted(){
			if (sessionStorage.getItem('phoneNum')) {
				this.regData.phone = sessionStorage.getItem('phoneNum')
			}
			this.userName = this.$cookie.get('truename');
		},
		filters: {
		}
	}
</script>

<style scoped>
.sms_login_box {
	.passwordEyes{position: absolute;top: 0px;right: 3px;cursor: pointer;font-size: 16px;color: #666;}
	.getcode {color: #3DB1FA; width: 90px; height: 30px; line-height: 28px; border:1px solid #3DB1FA; border-radius:2px; font-size: 14px; text-align: center; box-sizing: border-box;}
	.getcode.disabled{border: 1px solid #EEEEEE; background-color: #F5F5F5; color: #999;}
}

</style>
