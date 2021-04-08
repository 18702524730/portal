<template>
	<div class="bin-login">
		<sebe-header></sebe-header>
		<div class="bin-data">
			<div class="login-data">
				<p>
					<img width="48px" height="48px" :src="headimgurl" alt="">
					<span>您好，{{nickname}}</span>
				</p>
				<div class="login-table">
					<a class="" :class="{activeimg:bindaccount}" href="javascript:;" @click="bindaccount=true">绑定新账号</a>
					<a class="" :class="{activeimg:!bindaccount}" href="javascript:;" @click="bindaccount=false">绑定已有账号</a>
				</div>
				<div v-if="!bindaccount" class="login-input login" key="old">
					<div class="wrap-data">
						<div>
							<input type="text" class="ipt" v-model="regData.phone" placeholder="请输入手机号" maxlength="11">
							<p>{{old_phone}}</p>
						</div>
				    <div class="ipt-wrap code-wrap" :class="{inputfocus:!!regData.token || ipttoken}" @click="tokenclick()">
              <input type="text" class="ipt" v-model="regData.token" placeholder="请输入验证码" ref="token" maxlength="6" @focus="ipttoken=true" @blur="ipttoken=false">
              <button class="btn getcode" :class="{disabled: preventCode}" @click.prevent="getCode1">{{codeText}}</button>
              <p>{{ver_code}}</p>
            </div>
				    <div class="ipt-wrap captcha-wrap" v-if="showCode">
							<input type="text" class="ipt" v-model="regData.captcha" placeholder="请输入校验码"  maxlength="4">
							<span>
								<img class="ver-code" :src="codeUrl + '/servlet/captchaCode?t='+ random" alt="校验码" width="80" height="25" />
								<img src="~assets/img/reg_login/gx.png" class="refresh" @click="capRefresh()">
							</span>
							<p>{{ver_tip}}</p>
				    </div>
				    <p v-if="ver_tip_old">{{ver_tip_old}}</p>
				    <button :class="{disabled:oldDisabled}" class="format" @click="oldaccout(regData)">绑定并登录</button>
					</div>
				</div>
				<div v-if="bindaccount" class="login-input reg" key="new">
					<div class="wrap-data">
						<div>
							<input type="text" class="ipt" v-model="postData.phone" placeholder="请输入手机号" maxlength="11">
							<p>{{ver_phone}}</p>
						</div>
						<div class="code-wrap">
					      <input type="text" class="ipt-code" v-model="postData.token" placeholder="短信验证码" maxlength="6" ref="token">
					      <button class="btn getcode" :class="{disabled: preventCode}" @click.prevent="getCode">{{codeText}}</button>
					      <p>{{ver_token}}</p>
					    </div>
					    <div class="newexist" v-show="password">
					    	<input v-if="!newimg" type="password" class="ipt" v-model="postData.password" placeholder="请设置登录密码" maxlength="18">
					    	<input autocomplete="off" v-else type="text" class="ipt" v-model="postData.password" placeholder="请设置登录密码" maxlength="18">
					    	<i @click="newpass()" :class="{activebool:newimg}">
					    	</i>
					    	<p>{{ver_regpassword}}</p>
					    </div>
					    <div class="iread">
					      <label @click="isRead=!isRead"><span :class="{active:isRead}"></span>我已阅读并同意<a :href="cartUrl+'/shop/pages/regAgreement.html'" target="_blank">《拾贝网用户注册协议》</a></label>
					      <p>{{ver_tip_agree}}</p>
					    </div>
					    <button :class="{disabled:newDisabled}" class="format" @click="newaccout(postData)">绑定并登录</button>
					    <p v-if="channelCode=='ali'" style="padding-top: 10px;">绑定成功后，您可查看在阿里巴巴知识产权保护平台的订单信息</p>
					</div>
					<div></div>
				</div>
			</div>
		</div>
		<!-- 页尾 -->
		<footer class="footer-sm-wrap">
			<!-- 页尾下半部分 -->
			<div class="footer-sm">
			  © 2015-现在 拾贝  All rights reserved  <a target="_blank" href="http://www.miitbeian.gov.cn/state/outPortal/loginPortal.action">浙ICP备15042618号</a> | <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010402003197">浙公网安备 33010402003197号</a><br>杭州拾贝知识产权服务有限公司
			</div>
		</footer>
	</div>
</template>
<script>
import Vue from 'vue'
import $ from 'jquery'
import sebeHeader from 'components/HeaderSimple.vue'
import sebeFooter from 'components/FooterSimple.vue'
import toabaoHead from 'assets/img/reg_login/toabaoHead.png'
import Util from 'src/common/js/util.js'
import FauxPlaceholder from 'src/common/js/ie9Placeholder.js'
import qs from 'qs'
import md5 from 'md5'
const indexUrl = CONFIG.indexUrl;
const cartUrl = CONFIG.cartUrl;
const rootUrl = CONFIG.rootUrl;
export default {
    components: {
      sebeHeader,
      sebeFooter
    },
	data(){
		return{
			channelCode:'',  // 为'ali'时表示该淘宝账号有创新保订单
			indexUrl:indexUrl,
			cartUrl: cartUrl,
			codeUrl:rootUrl,//验证码
			random: Math.random(),
			showCode:false,//校验码
			ver_tip:'',
			newDisabled:false,//禁止重复提交
			oldDisabled:false,
			newimg:false,//账户密码图标
			password:false,
    	postData:{
    		token:'',
    		phone: '',
    		regpassword:''
    	},
    	regData:{
    		phone: '',
    		token:''
    	},
      ipttoken:false,
    	preventCode: false,//控制重发验证码
    	codeText:'获取验证码',
    	bindaccount:true,//默认显示新账户
    	ver_phone:'',
    	ver_token:'',
    	ver_regpassword:'',
    	old_phone:'',
    	old_password:'',
      ver_code: '',
    	sbid:'',
    	headimgurl:'',
    	openid:'',
    	nickname:'',
    	isRead: true,
    	ver_tip_old:'',
    	ver_tip_agree:'',
    	beforeLoginCode:'',
    	return_url:'',
    	type_code:'' //taobao表示淘宝登录
		}
	},
	methods:{
    tokenclick(){
      this.ipttoken = true;
      this.$refs['token'].focus();
    },
    checkPhone(){
      var regData = this.regData;
      var phone = regData.phone;
      if (!phone || !phone.trim()) {
        this.old_phone = '请输入手机号';
        return false;
      }else if(!/^1\d{10}$/.test(phone)){
        this.old_phone = '请输入正确的手机号';
        return false;
      }
      return true;
    },
    //获取手机验证码
    getCode1(){
      var self = this;
      if (self.preventCode || !this.checkPhone()) {
        return;
      }
      self.preventCode=true;
      self.ver_tip_old = '';
      self.$http.post('./api/login/sendPhoneCode', {phone: self.regData.phone})
      .then((response) => {
        console.log(response.data)
        var data = response.data;
        self.$message('验证码已发送');
        self.timeout();
      })
      .catch((error) => {
        var data = error.response.data;
        self.ver_tip_old = data.msg;
      });
    },
		ie9init(){
			setTimeout(function(){
				FauxPlaceholder();
			},300)
		},
		capRefresh(){
      this.random = Math.random();
    },
		loginSuccessHandle(){//登陆成功跳转
      var hash = location.hash;
      var return_url = '';
      if (hash.indexOf('return_url') !== -1) {
      	return_url = Util.getHashString('return_url');
      }
      return_url = decodeURIComponent(this.$cookie.get('succ_url') || return_url);
      if (return_url.indexOf('literatureNew')!==-1) {
      	this.$cookie.delete('succ_url', {domain: '.ipsebe.com'});
      	location.href = return_url;
      } else if (this.channelCode === 'ali') {
      	this.$router.push({name: 'serviceList', query: {type: 2, page: 1, firstLoad: 1}});
      } else {
        this.$router.push('/')
      }
    },
		//绑定已有账号
		oldaccout(data){
			var self = this;
			if (this.oldDisabled || !this.regCheck()) {
			  return;
			}
			this.oldDisabled=true;
			this.beforlogin(false,data);
		},
		login(type,data){
			console.log(data)
			var self = this;
      var d = {};
      if(type) {
        d = {
          phone: data.phone,
          password:md5(data.password),
          beforeLoginCode:self.beforeLoginCode,
          openid:self.openid,
          type_code:self.type_code,
          captcha:data.captcha
        };
      }else{
        d = {
          phone: data.phone,
          phoneCode:data.token,
          loginType: 2,
          beforeLoginCode:self.beforeLoginCode,
          openid:self.openid,
          type_code:self.type_code,
          captcha:data.captcha
        };
      }
			this.$http.post('./api/login', d)
			.then((response) => {
				self.loginSuccessHandle();
			})
			.catch((error) => {
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
				if(type){
					self.newDisabled=false;
					self.ver_regpassword = error.response.data.msg;
				}else{
					this.oldDisabled=false;
					this.ver_tip_old = error.response.data.msg;
				}

			});
		},
		beforlogin(type,data){
			var self = this;
			self.newDisabled = false;
			this.$http.post('./api/beforeLogin', {
	          account: data.phone
	        })
			.then((response) => {
				self.beforeLoginCode = response.data.code;
        console.log(data);
				self.login(type,data);
			})
			.catch((error) => {

			});
		},
		//绑定新账户
		newaccout(data){
			var self = this;
			self.ver_regpassword = '';//错误提示重置
			if (self.newDisabled || !this.regCheckValid()) {
			  return;
			}
			self.newDisabled = true;
			this.$http.post('./api/member/register',{
				phone:self.postData.phone,
				password:md5(self.postData.password),
				token:self.postData.token,
				type_code:self.type_code,
				openid:self.openid
			})
			.then((response) => {
				self.newDisabled = false;
				this.beforlogin(true,data);
			})
			.catch((error) => {
				self.newDisabled = false;
				self.ver_regpassword = error.response.data.msg;
			});
		},
		//获取用户信息
		search(){
			var self = this;
			this.$http.post('api/wxLogin',qs.stringify({sbid: self.sbid}))
		},
		//新账号密码是否显示
		newpass(){
			if(this.newimg){
				this.newimg = false;
			}else{
				this.newimg = true;
			}
		},
		//获取手机验证码
		getCode(){
			var self = this;
			self.$http.post('./api/member/register/capcha', qs.stringify({account: self.postData.phone}))
			.then((response) => {
			  var data = response.data;
			  self.ver_token='';
			  self.$message('验证码已发送');
			  self.timeout();
			})
			.catch((error) => {
				var data = error.response.data;
          		self.ver_token = data.msg;
			  //self.submitDisabled = false;
			  //self.$message(data.msg)
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
          self.codeText = "重发验证码";
          self.preventCode = false;
        }else{
          self.codeText = second + "s后可重发";
          self.preventCode = true;
          second--;
        }
      }, 1000);
    },
		regCheck(){//已有账号绑定
			var regData = this.regData;
      var phone = regData.phone;
      var captcha = regData.captcha;
      var token = regData.token;
      this.old_phone = '';
      this.ver_code = '';
      this.ver_tip = '';
      if (!phone || !phone.trim()) {
        this.old_phone = '请输入手机号';
        return false;
      }else if(!/^1\d{10}$/.test(phone)){
        this.old_phone = '请输入正确的手机号';
        return false;
      }
      if(!token){
        this.ver_code = '请输入验证码';
        return false;
      }
      if (this.showCode) {
        if (!captcha.trim()) {
          this.ver_tip = '请输入校验码';
          return false;
        }else if(captcha.length !== 4){
          this.ver_tip = '校验码为4位数';
          return false;
        }
      }
      return true;
    },
    regCheckValid(){//新账号绑定验证
      var postData = this.postData;
      var password = postData.password;
      var token = postData.token;
      var phone = postData.phone;
      if (!phone || !phone.trim()) {
        this.ver_phone = '请输入手机号';
        return false;
      }else if(!/^1\d{10}$/.test(phone)){
        this.ver_phone = '请输入正确的手机号';
        return false;
      }else{
      	this.ver_phone = '';
      };

      if (!token.trim()) {
        this.ver_token = '请输入手机验证码';
        return false;
      }else if(!/^\d{6}/.test(token)){
        this.ver_token = '验证码为6位数字';
        return false;
      }else{
      	this.ver_token = '';
      };

      if (!password || !password.trim()) {
        this.ver_regpassword = '请设置密码';
        return false;
      }else if(!/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)\S{8,16}$/.test(password)){
        this.ver_regpassword = '密码长度8-16位，含数字、大写字母、小写字母中至少两类';
        return false;
      }else{
      	this.ver_regpassword = '';
      }

      if (!this.isRead) {
        this.ver_tip_agree = '请阅读并同意《拾贝网用户注册协议》';
        return false;
      }

      return true;
    }
	},
	mounted(){
		this.return_url = this.$route.query.return_url;
		this.openid = this.$route.query.openid;
		this.nickname = this.$route.query.nickname;
		this.headimgurl = this.$route.query.headimgurl;
		this.type_code = this.$route.query.type_code || '';
		this.channelCode = this.$route.query.channelCode || '';
		if (this.type_code == 'taobao') {
			this.headimgurl = this.headimgurl || toabaoHead;
		}
		this.ie9init();
	},
    filters: {
    },
    watch:{
	   postData:{
	    handler:function(val,oldval){
	        if(this.$refs.token.value.length == 6){
	        	this.password = true;
	        }
	    },
	    deep:true
	  },
	  bindaccount(){
	  	this.ie9init();
	  },
	  password(){
	  	this.ie9init();
	  }
	}
}
</script>
<style lang="scss">
html,body,body #app{height:100%;}
html{min-height:768px;}
.wrap-data >div .placeholder{position: absolute;bottom:13px;left: 20px;color: #999;font-size: 14px;top:10px;text-align:left; }
.passwordEyes{position: absolute;top: 28px;right: 3px;cursor: pointer;font-size: 16px;color: #666;}
.getcode.disabled{cursor: not-allowed;color: #eee;border-color: #ccc;}
.iread{position: relative;width: 360px;padding-top: 14px;font-size: 14px;height: 35px;color: #666;margin:0 auto;text-align:left;}
.iread span{position: absolute;top:20px;left:0;width: 13px;height: 13px;background: #fff url(~assets/img/reg_login/check_bg.png) 0 0 no-repeat;display: inline-block;}
.iread label{padding-left:18px;}
.iread span.active{background-position: 0 -20px;}
.iread a {color: #3db1fa;}
.captcha-wrap{padding:0}
.captcha-wrap span{position: absolute;right: 4px;top:4px;}
.bin-login{
	background-color: #efeff4;
	height:100%;
	position: relative;
	header{
		position:absolute;
		top:0;
		width:100%;
		min-width:1200px;
		z-index: 1;
	}
	footer{
		position: absolute;
		bottom:0;
		width:100%;
		min-width:1200px;
	}
	.disabled{cursor: not-allowed;color: #eee;border-color: #ccc;}
	.bin-data{
		width:1200px;
		height:100%;
		margin:0px auto 0;
		min-height: 768px;
		position: relative;
		padding:142px 0 0 0;
		.login-data{
			padding-top:40px;
			height:100%;
			background-color:#fff;
			p{
				text-align:center;
				font-size:18px;
				color:#333;
				margin-bottom: 30px;
				img{
					border-radius:50%;
					vertical-align:middle;
				}
				span{
					vertical-align:middle;
				}
			}
			.login-table{
				text-align:center;
				overflow:hidden;
				border-bottom:1px solid #eee;
				.activeimg{
					border-color:#3db1fa;
				}
				a:hover{
					border-color:#3db1fa;
				}
				a{
					font-size:18px;
					width:180px;
					line-height:18px;
					display:inline-block;
					text-decoration:none;
					border-bottom:3px solid #fff;
					padding-bottom: 10px;
					margin: 0 28px;
				}
			}
			.login-input{
				.wrap-data{
					text-align:center;
					margin-top:50px;
					.newexist{
						position: relative;
						margin:0 auto;
						width:360px;
					}
					>div{
						width:360px;
						margin:0 auto;
						position: relative;
					}
					.activebool{
						background:url(~assets/img/reg_login/yes.png) no-repeat;
						top:14px;
					}
					i{
						background:url(~assets/img/reg_login/no.png) no-repeat;
						position:absolute;
						width:20px;
						height:16px;
						right:15px;
						top:12px;
					}
					p{
						font-size: 12px;
						height:20px;
						line-height:20px;
						color:#f54845;
						text-align:left;
						width:360px;
						margin:0 auto;
					}
					input{
						border:1px solid #eee;
						padding:0 20px;
						position: relative;
					}
					.ipt{
						width:360px;
						height:40px;
						font-size: 14px;
					}
					.code-wrap{
						margin-top:0;
						padding:0;
						.ipt-code{
							height:40px;
							width:360px;
							font-size: 14px;
							position: relative;
						}
						.getcode{
							border: none !important;
							width:96px;
							height:40px;
							margin-left:10px;
							border:1px solid #3db1fa;
							border-radius:3px;
							color:#3db1fa;
							position: absolute;
							top: 0;
							right: 0px;
						}
						// .getcode:hover{
						// 	background-color:#3db1fa;
						// 	color:#fff;
						// }
					}
					.format{
						width:360px;
						height:40px;
						background-color:#3db1fa;
						color:#fff;
						border-radius:3px;
						font-size:16px;
						margin-top:30px;
					}
				}
			}
		}
	}
}
</style>
