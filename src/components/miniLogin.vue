<template>
  <div id="miniloginwrap" v-show="showMini">
  	<div id="loginmark"></div>
  	<div class="minilogin">
      <div class="close"><div class="el-dialog__headerbtn" @click="closeMini"><i class="el-dialog__close el-icon el-icon-close"></i></div></div>
      <div class="title" v-show="wechatcode">
        <a v-if="loginVisible" href="javascript:;" class="fl"  @click="chgTab(true)">登录拾贝网</a>
        <a v-if="!loginVisible" href="javascript:;" class="fl"  @click="chgTab(false)">注册账号</a>
        <p v-if="loginVisible" class="fr">无法登录？<a href="javascript:;" @click="chgTab(false)">立即注册</a></p>
        <p v-if="!loginVisible" class="fr">已有账号？<a href="javascript:;" @click="chgTab(true)">立即登录</a></p>
      </div>
      <!--登录-->
      <div v-show="loginVisible&&wechatcode">
        <form autocomplete="off">
          <span class="reminder"><label>{{ver_tip}}</label></span>
          <div class="ipt-wrap">
            <input type="text" class="ipt" v-model="postData.phone" maxlength="11">
            <label class="name">请输入手机号</label>
          </div>
          <div class="ipt-wrap password-wrap">
            <input type="password" class="ipt" v-model="passwordOrigin"  maxlength="30">
            <label class="name">请输入密码</label>
          </div>
          <div class="ipt-wrap captcha-wrap" v-if="showCode">
            <input type="text" class="ipt" v-model="postData.captcha"  maxlength="4">
            <label class="name">请输入校验码</label>
            <span>
              <img class="ver-code" :src="userUrl + '/servlet/captchaCode?t='+ random" alt="校验码" width="80" height="25" />
              <img src="~assets/img/reg_login/gx.png" class="refresh" @click="capRefresh()">
            </span>
          </div>
        <button type="submit" class="btn btn-primary register-btn" :class="{disabled: submitDisabled}" @click.prevent="preLogin">{{logText}}</button>
        <div class="forget-pwd">
          <a :href="userUrl + '/iprp/#/findPwd'" target="_blank">忘记密码？</a>
        </div>
       </form>
      </div>
      <!--注册-->
      <div v-show="regVisible&&wechatcode">
        <form autocomplete="off">
          <span class="reminder"><label>{{ver_tip}}</label></span>
          <div class="ipt-wrap">
            <input type="text" class="ipt" v-model="regData.phone" maxlength="11">
            <label class="name">请输入手机号</label>
          </div>
          <div class="ipt-wrap code-wrap">
            <input type="text" class="ipt" v-model="regData.token" maxlength="6">
            <label class="name">短信验证码</label>
            <button class="btn getcode" :class="{disabled: preventCode}" @click.prevent="getCode">{{codeText}}</button>
          </div>
          <div class="ipt-wrap password-wrap">
            <input type="password" class="ipt" v-model="passwordOrigin" maxlength="16" v-if="isPasswordType">
            <input type="text" class="ipt" v-model="passwordOrigin" maxlength="16" v-else>
            <label class="name">请设置密码</label>
            <span class="passwordEyes" @click="togglePasswordType"><i class="fa fa-eye-slash" aria-hidden="true" v-if="isPasswordType"></i><i class="fa fa-eye" aria-hidden="true" v-else></i></span>
          </div>
          <div class="iread">
            <label @click="isRead=!isRead"><span :class="{active:isRead}"></span>我已阅读并同意<a :href="cartUrl+'/shop/pages/regAgreement.html'" target="_blank">《拾贝网用户注册协议》</a></label>
          </div>
          <button type="submit" class="btn btn-primary register-btn" :class="{disabled: submitDisabled}" @click.prevent="register">{{regText}}</button>
        </form>
      </div>
      <!--二维码按钮-->
      <div class="wechat" v-show="wechatcode">
        <a href="javascript:;" @click="chatcode">
          <span class="clre">————</span>
          <img src="~assets/img/reg_login/WeChat.png" alt="">
          <span>微信登录</span>
          <span class="clre">————</span>
        </a>
      </div>
      <!-- 二维码页面 -->
      <div class="webchat"  v-if="!wechatcode">
        <div class="wechat-title">
          <span class="fl">登录拾贝网</span>
          <a class="fr" @click="wechatcode=true">返回账号登录</a>
        </div>
        <div class="wechat-code">
          <img width="190px" height="190px" v-if="weixinurl" :src="weixinurl" alt="">
          <p v-else><img style="margin-top:45px;" width="100px" height="100px" src="~assets/img/reg_login/Spinner.gif" alt=""></p>
        </div>
        <p v-if="refresh">
          <span>请使用微信扫描上方二维码登录</span>
        </p>
        <p v-else>
          二维码失效<br/>请点击<a @click="refreshbtn">刷新二维码</a>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import $ from 'jquery'
import md5 from 'md5'
import qs from 'qs'
const cartUrl = CONFIG.cartUrl;
const userUrl = CONFIG.userUrl;
const indexUrl = CONFIG.indexUrl;
const wxUrl = CONFIG.wxUrl;
// 检查标签是否支持该属性
function ElementSupportAttribute(elm, attr) {
  var test = document.createElement(elm);
  return attr in test;
}
// 粗略判断，因为只要兼容ie9+
const isIE9 = !ElementSupportAttribute('input','placeholder');


export default {
	props:['showMini'],
  data() {
	  var validatePass2 = (rule, value, callback) => {
	    if (this.passwordAgain === '') {
	      callback(new Error('请再次输入密码'));
	    } else if (this.passwordAgain !== this.ruleForm.password) {
	      callback(new Error('两次输入密码不一致!'));
	    } else {
	      callback();
	    }
	  };
    return {
      wxUrl:wxUrl,//二维码url
      weixinurl:'',//二维码
      refresh:true,//二维码失效刷新
      wechatcode:true,//扫码登录
      loginVisible:true,
      regVisible:false,
      //登录
      logText:'立即登录',
      indexUrl: indexUrl,
      cartUrl: cartUrl,
      userUrl: CONFIG.userUrl,
      random: Math.random(),
      ver_tip:'',//校验提示
      showCode: false,//是否显示验证码
      passwordOrigin:'',
      postData:{
        phone:'',
        password:'',
        beforeLoginCode:'',
        captcha:''
      },
      submitDisabled:false,//禁止重复提交
      //注册
      regText:'立即注册',
      codeText:'获取验证码',
      isRead: true,
      isPasswordType: true,
      ver_tip:'',//校验提示
      regData: {
        phone: '',
        password:'',
        token: ''
      },
      preventCode: false,//控制重发验证码
      submitDisabled:false//禁止重复提交

    }
  },
  methods: {
    refreshbtn(){//点击刷新二维码
      this.wechat();
      this.refresh = true;
    },
    // 二维码登录
    chatcode(){
      this.wechatcode = false;
      this.wechat();
    },
    wechat(){
        var self = this;
        self.$http.post(wxUrl+'/wechat/getWxQRUrl')
        .then((response) => {
          self.weixinurl = response.data.wxQRUrl;
          self.sbid = response.data.sbid;
          if(self.weixinurl){
            self.getPaystatus();
          }
        })
        .catch((error) => {
        });
    },
    //轮询获取扫描状态
    getPaystatus(){
      var self = this;
      var i=0;
      var timer = setInterval(function(){
        self.$http.post('/api/wxLogin',qs.stringify({sbid: self.sbid}))
        .then((response) => {
          i++;
          if (i > 300) {
            self.refresh = false;
            clearInterval(timer);
            return;
          }
          if(response.data.code>0 || !self.$route.query.type){
            clearInterval(timer);
            if(response.data.code==1){
              var regdata = response.data.data;
              location.href = userUrl+"/iprp/#/regLogin?headimgurl="+regdata.headimgurl+"&nickname="+regdata.nickname+"&openid="+regdata.openid+"&return_url="+ encodeURIComponent(location.href);
            }else if(response.data.code==2){
              self.closeMini();
              self.$emit('callbackDo');
            }

          }
        })
        .catch((error) => {
        });
      }, 1000);
      },
    //切换登录注册
    chgTab(isLogin){
      if(isLogin === true){
        this.loginVisible = true;
        this.regVisible = false;
      }else{
        this.loginVisible = false;
        this.regVisible = true;
      }
    },
    closeMini(){
      this.$emit('closeMini');
    },

    //登录模块
    capRefresh(){
      this.random = Math.random();
    },
    // 预登录 参数isDirect用于注册成功后直接登录
    preLogin(isDirect){
      var self = this;
      if (isDirect !== true && (self.submitDisabled || !self.checkValid())) {
        return;
      }
      self.logText = '登录中...';
      self.ver_tip = '';
      self.submitDisabled = true;
      var data = {
        account: self.postData.phone
      };
      if(isIE9) {
        data = $.extend(data, {
          isIENine: true
        });
      }
      self.$http.post(userUrl + '/api/beforeLogin', data)
      .then((response) => {
        var data = response.data;
        self.postData.beforeLoginCode = data.code;
        self.postData.password = md5(self.passwordOrigin);
        self.login(isDirect);
      })
      .catch((error) => {
        self.submitDisabled = false;
        self.ver_tip = '系统繁忙，请稍候再试';
        self.logText = '立即登录';
        console.log('preLogin:'+ error);
      });
    },
    login(isDirect){
      var self = this;
      var postData = self.postData,
      data = {};
      if (!isDirect && self.showCode) {
        data = postData;
      }else{
        data = {
          phone: postData.phone,
          password: postData.password,
          beforeLoginCode: postData.beforeLoginCode
        }
      }
      if(isIE9) {
        data = $.extend(data, {
          isIENine: true
        });
      }
      self.$http.post(userUrl + '/api/minilogin', data)
      .then((response) => {
        self.submitDisabled = false;
        var data = response.data;
        //针对ie9跨域情况下，不支持RESTful的异常处理
        if (data.status && isIE9) {
          self.logText = '立即登录';
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
          self.capRefresh();
        }else{
          self.logText = '登录成功';
          self.userName = data.truename;
          //设置cookie
          self.$cookie.set('channelName', decodeURIComponent(data.channelName), {domain:data.domains});
          if (data.old_login_time) {
            self.$cookie.set('old_login_time', data.old_login_time, {domain:data.domains});
          }
          self.$cookie.set('phone', data.phone, {domain:data.domains});
          if (data.truename) {
            self.$cookie.set('truename', decodeURIComponent(data.truename), {domain:data.domains});
          }else{
            self.$cookie.delete('truename');
          }
          self.$cookie.set('user_token', data.key, {domain:data.domains, expires: data.expires || '1Y'});
          self.$cookie.set('pid', data.pid, {domain:data.domains});
          self.$cookie.set('type', data.type, {domain:data.domains});
          self.$cookie.set('login_time', data.login_time, {domain:data.domains});
          self.$cookie.set('nickname', decodeURIComponent(data.nickname), {domain:data.domains});
          //self.loginSuccessHandle();
          //发起登录成功回调
          self.closeMini();
          self.$emit('callbackDo');
        }
      })
      .catch((error) => {
        self.logText = '立即登录';
        self.submitDisabled = false;
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
        self.capRefresh();
      });
    },
    /*loginSuccessHandle(){
    },*/
    checkValid(){
      var postData = this.postData;
      var phone = postData.phone;
      var passwordOrigin = this.passwordOrigin;
      var captcha = postData.captcha;
      if (!phone.trim()) {
        this.ver_tip = '请输入手机号';
        return false;
      }else if(!/^1\d{10}$/.test(phone)){
        this.ver_tip = '请输入正确的手机号';
        return false;
      }

      if (!passwordOrigin.trim()) {
        this.ver_tip = '请输入密码';
        return false;
      }/*else if(!/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/.test(passwordOrigin)){
        this.ver_tip = '密码由8-16位字符组成,且须包含两种字符';
        return false;
      }*/

      if (this.showCode) {
        if (!captcha.trim()) {
          this.ver_tip = '请输入验证码';
          return false;
        }else if(captcha.length !== 4){
          this.ver_tip = '校验码为4位数';
          return false;
        }
      }

       return true;
    },
    //注册成功后处理: 直接登录
    regSuccessHandle(){
      this.postData.phone = this.regData.phone;
      this.preLogin(true);
    },
    //获取手机验证码
    getCode(){
      var self = this;
      if (self.preventCode || !this.checkPhone()) {
        return;
      }
      self.ver_tip = '';
      var data = {account: self.regData.phone};
      if(isIE9) {
        data = $.extend(data, {
          isIENine: true
        });
      }
      self.$http.post(userUrl + '/api/member/register/capcha', qs.stringify(data))
      .then((response) => {
        console.log(response.data)
        var data = response.data;
        //针对ie9跨域情况下，不支持RESTful的异常处理
        if (data.status && isIE9) {
          self.ver_tip = data.msg;
        }else{
          self.$message('验证码已发送');
          self.timeout();
        }
      })
      .catch((error) => {
        var data = error.response.data;
        self.ver_tip = data.msg;
        //self.submitDisabled = false;
        //self.$message(data.msg)
      });
    },
    register(){
      var self = this;
      if (self.submitDisabled || !self.regCheckValid()) {
        return;
      }
      self.regText = '注册中...';
      self.ver_tip = '';
      self.submitDisabled = true;
      self.regData.password = md5(self.passwordOrigin);
      self.regData.registFrom = 1;
      var data = this.regData;

      if(isIE9) {
        data = $.extend(data, {
          isIENine: true
        });
      }
      self.$http.post(userUrl + '/api/member/register', data)
      .then((response) => {
        self.submitDisabled = false;
        var data = response.data;
        //针对ie9跨域情况下，不支持RESTful的异常处理
        if (data.status && isIE9) {
          self.regText = '立即注册';
          self.ver_tip = data.msg;
        }else{
          self.regText = '注册成功';
          self.regSuccessHandle();
        }
      })
      .catch((error) => {
        self.submitDisabled = false;
        self.regText = '立即注册';
        var data = error.response.data;
        self.ver_tip = data.msg;
      });
    },
    togglePasswordType(){
      this.isPasswordType = !this.isPasswordType;
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
    checkPhone(){
      var regData = this.regData;
      var phone = regData.phone;
      // if (this.preventCode) {return;}
      if (!phone.trim()) {
        this.ver_tip = '请输入手机号';
        return false;
      }else if(!/^1\d{10}$/.test(phone)){
        this.ver_tip = '请输入正确的手机号';
        return false;
      }
      return true;
    },
    regCheckValid(){
      var regData = this.regData;
      var password = this.passwordOrigin;
      var token = regData.token;
      if (!this.checkPhone()) {
        return false;
      }

      if (!password.trim()) {
        this.ver_tip = '请设置密码';
        return false;
        // '^(?![a-zA-Z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$'
      }else if(!/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)\S{8,16}$/.test(password)){
        this.ver_tip = '密码长度8-16位，含数字、大写字母、小写字母中至少两类';
        return false;
      }

      if (!token.trim()) {
        this.ver_tip = '请输入手机验证码';
        return false;
      }else if(!/^\d{6}/.test(token)){
        this.ver_tip = '验证码为6位数字';
        return false;
      }

      if (!this.isRead) {
        this.ver_tip = '请阅读并同意《拾贝网用户注册协议》';
        return false;
      }
      return true;
    }
  },
  mounted(){
     $(".ipt-wrap").click(function(){
        $(this).children(".ipt").focus();
      });
      //登陆交互
      $(".ipt").focus(function(){
        $(this).parent(".ipt-wrap").addClass("inputfocus");
        $(this).siblings(".name").addClass("label-name").css("color","#3db1fa");
          return false;
      });
      $(".ipt").blur(function(){
        if(!$(this).val()){
          $(this).siblings(".name").removeClass("label-name").css("color","#999");
          $(this).parent("div.ipt-wrap").removeClass("inputfocus");
        }else{
          $(this).siblings(".name").css("color","#999");
        }
      });
       //修复表单插件自动填充的bug
      setTimeout(function(){
          var els = $('.ipt');
          $.each(els, function(i,item){
              $(item).focus();
              if (!$(item).val()) {
                  return false;
              }
          });
      }, 600);





    this.userName = this.$cookie.get('truename');
    var FauxPlaceholder = function(){
      if(!ElementSupportAttribute('input','placeholder')) {
        $("[placeholder]")
          .focus(function() {
            var input = $(this);
            input.next().hide();
          })
          .blur(function() {
            var input = $(this);
            if (input.val() == "") {
              input.next().show();
            }
          }).after('<span class="placeholder"></span>');
          $(".placeholder").click(function(){
            var input = $(this).prev().focus();
          }).html(function(){
            return $(this).prev().attr('placeholder');
          });
      }
    };
    setTimeout(function(){
      FauxPlaceholder();
    },300);
  }
}
</script>


<style scoped lang="scss">
/*二维码页面*/
.webchat{
  text-align:center;
 .wechat-title{overflow:hidden}
 .wechat-title span{font-size:20px;}
 .wechat-title a{font-size:14px;margin-top:10px;color:#333;text-decoration:none;cursor:pointer;}
 .wechat-title a:hover{color:#3db1fa}
  .wechat-code{
    border:1px solid #ddd;
    padding:10px;
    width:210px;
    height:210px;
    margin:30px auto 0;
    p{margin:auto;}
  }
  p{
    color:#999;
    font-size:14px;
    margin-top:25px;
    a{
      color:#f54845;
      text-decoration:none;
      cursor:pointer;
      background:url(~assets/img/reg_login/RestartIcon.png) no-repeat right;
      padding-right: 14px;
    }
  }
}
/*迷你login交互*/
/*二维码*/
.wechat{text-align:center;margin-top:22px;}
.wechat a{font-size: 16px;color:#666;text-decoration:none;margin:0 auto;text-align:center;}
.wechat a span , .wechat a img{vertical-align:middle;}
.wechat a .clre{color:#eee;}
/*记住密码输入框背景不变黄*/
input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
    background-color: #fff !important;;
    -webkit-box-shadow: 0 0 0px 1000px transparent  inset !important;
    background-color:transparent;
    background-image: none;
    transition: background-color 50000s ease-in-out 0s;
}
.name{font-size:14px;color:#999;position:absolute;top:0px;left:3px;transition: top 0.2s ease;cursor: text;font-weight: normal;}
.label-name{top:-20px;}
form{overflow: hidden;}
form .inputfocus::after{-webkit-transform: translate3d(0, 0, 0);transform: translate3d(0, 0, 0);}
.ipt-wrap::after{position: absolute;top:18px;right: 0;bottom: 0;left: 0;overflow: hidden;height: 10px;content: '';-webkit-transition: -webkit-transform 0.3s ease;transition: transform 0.3s ease;-webkit-transform: translate3d(-101%, 0, 0);transform: translate3d(-101%, 0, 0);border-bottom: 1px solid #3db1fa;}

#miniloginwrap{position: fixed;top: 0;left:0;z-index:1002;width: 100%;height: 100%;}
#loginmark{position: absolute;top: 0;left:0;width: 100%;height: 100%;background-color: #000;opacity: 0.5;}
.minilogin{position: relative;top: 200px;margin:0 auto;z-index:1001;background-color: #fff;width: 400px;height: 475px;border: 1px solid #ccc;border-radius: 6px;padding:40px;}
.close{height: 15px;position: relative;top: -20px;right: -15px;}
.title{text-align: center;height: 40px;line-height: 40px;overflow: hidden;width:318px;}
.title a{font-size: 22px;color: #666;text-decoration: none;}
.title p{font-size: 14px;line-height: 100%;margin-top: 18px;}
.title p a{color: #f64744;font-size: 14px}

.title a.cur{color: #3db1fa;}
.title span{width: 1px;height: 20px;background-color: #e5e5e5;margin: 0 25px;display: inline-block;}
.reminder {height: 39px;line-height: 39px;display: block;}
.reminder label {color: red;}
.ipt-wrap{position: relative;border-bottom: 1px solid #e5e5e5;}
.ipt-wrap input{width: 100%;height: 28px;line-height: 28px;border: 1px solid #fff;padding-left: 3px;font-size: 14px;}
.password-wrap {margin-top: 26px;}
.register-btn {margin-top: 30px;width: 100%;height: 48px;font-size: 16px;}
.forget-pwd a {float: right;margin-top: 20px;color: #666;}
.code-wrap,.captcha-wrap  {margin-top: 33px;}
.captcha-wrap span,.code-wrap span {position: absolute;right: 0;top: 25px;}
.captcha-wrap span img {margin-top: 3px;}
.getcode {position: absolute;top: -10px;right: 0;width: 85px;height: 32px;color: #3db1fa;border-color: #e5e5e5;padding: 0;}
.getcode:hover {background-color: #3db1fa;color: #fff;border-color: #3db1fa;}
.passwordEyes{position: absolute;top: 0px;right: 3px;cursor: pointer;font-size: 16px;color: #666;}
.getcode.disabled{cursor: not-allowed;color: #eee;border-color: #ccc;background-color: #ccc;}
.iread {position: relative;padding-left: 18px;width: 100%;padding-top: 14px;font-size: 14px;height: 35px;color: #666;}
.iread span{position: absolute;top:20px;left:0;width: 13px;height: 13px;background: #fff url(~assets/img/reg_login/check_bg.png) 0 0 no-repeat;display: inline-block;}
.iread span.active{background-position: 0 -20px;}
.iread a{ color: #3db1fa;}
.ipt-wrap .placeholder{position: absolute;bottom:13px;left: 5px;color: #999;font-size: 14px }
</style>
<style>
.ipt-wrap .placeholder{position: absolute;bottom:13px;left: 5px;color: #999;font-size: 14px }
</style>
