<template>
  <form autocomplete="off">
    <div class="ipt-wrap" :class="{inputfocus:postData.phone ||　iptphone}" @click="phoneclick()">
      <input type="text" class="ipt" v-model="postData.phone" placeholder="请输入注册手机号" ref="phone" maxlength="11" @focus="iptphone=true" @blur="iptphone=false">
    </div>
    <div class="ipt-wrap" :class="{inputfocus:passwordOrigin ||　iptpass}" @click="passclick()">
      <input type="password" class="ipt" ref="pass" v-model="passwordOrigin" placeholder="请输入密码" maxlength="30" @focus="iptpass=true" @blur="iptpass=false" @keyup.enter="preLogin" >
    </div>
    <div class="ipt-wrap captcha-wrap" v-if="showCode" :class="{inputfocus:!!postData.captcha ||　iptcap}" @click="iptcap=true">
      <input type="text" class="ipt" v-model="postData.captcha"  maxlength="4" @focus="iptcap=true" @blur="iptcap=false" @keyup.enter="preLogin" >
      <label class="name label-name">请输入校验码</label>
      <span>
        <img class="ver-code" :src="codeUrl + '/servlet/captchaCode?t='+ random" alt="校验码" width="80" height="25" />
        <img src="~assets/img/reg_login/gx.png" class="refresh" @click="capRefresh()">
      </span>
    </div>
    <span class="reminder">
      <label>{{ver_tip}}</label>
    </span>
    <el-button size="medium" type="primary" class="submit_btn" :class="{disabled: submitDisabled}" @click.prevent="preLogin">{{buttonText}}</el-button>

    <!-- <el-dialog
      title=""
      custom-class="login_doalog"
      :visible.sync="isShowDialog"
      width="360px"
      center>
      <i class="el-icon-warning status_icon" ></i>
      <p class="content">尊敬的拾贝会员，您尚未加入拾贝商家平台</p>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="loginSuccessHandle">关闭</el-button>
        <el-button size="small" type="primary" @click="goBusinessPageFn">立即入驻商家平台</el-button>
      </span>
    </el-dialog> -->


  </form>
</template>
<script>
  import Vue from 'vue'
  import $ from 'jquery'
  const rootUrl = CONFIG.rootUrl;
  import Util from 'src/common/js/util.js';
  import qs from 'qs'
  import md5 from 'md5';
  import VueCookie from 'vue-cookie'

  export default {
    components: {
      
    },
    data(){
        return {
          iptphone:false,
          iptpass:false,
          iptcap:false,
          buttonText: '登录',
          codeUrl: rootUrl,
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
          submitDisabled:false, //禁止重复提交
          isBusinessBox: false,  //确认是否加入拾贝网商家平台弹窗
        }
    },
    watch: {
      postData: {
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
      // 去商家平台入驻页面
      goBusinessPageFn () {
        this.isShowDialog = false; //隐藏弹窗
        location.href = 'https://testwww.ipsebe.com/sebe/pages/channel.html#';
      },
      phoneclick(){
        this.iptphone = true;
        this.$refs['phone'].focus();
      },
      passclick(){
        this.iptpass = true;
        this.$refs['pass'].focus();
      },
      capRefresh(){
        this.random = Math.random();
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
          account: self.postData.phone
        })
        .then((response) => {
          var data = response.data;
          self.postData.beforeLoginCode = data.code;
          self.postData.password = md5(self.passwordOrigin);
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
        var postData = self.postData,
          data = {};
        if (self.showCode) {
          data = postData;
        }else{
          data = {
            phone: postData.phone,
            password: postData.password,
            beforeLoginCode: postData.beforeLoginCode
          }
        }
        self.$http.post('./api/login', data)
        .then((response) => {
          self.submitDisabled = false;
          self.buttonText = '登录成功';
          var resData = response.data;
          console.log(resData)
          self.userName = resData.truename;
          self.loginSuccessHandle();
        })
        .catch((error) => {
          console.log(error.response);
          self.buttonText = '立即登录';
          var errData = error.response.data;
          if (errData.status === 10003) {
            self.showCode = true;
          }
          if (errData.body) {
            if (errData.body[0]) {
              self.showCode = true;
            } else {
              self.showCode = false;
            }
          }
          self.ver_tip = errData.msg;
          self.submitDisabled = false;
          self.capRefresh();
        });
      },
      loginSuccessHandle(){
        var hash = location.hash;
        if (hash.indexOf('return_url') !== -1) {
          location.href = decodeURIComponent(Util.getHashString('return_url'));
        }else{
          this.$router.push('/')
        }
      },
      checkValid(){
        var postData = this.postData;
        var phone = postData.phone;
        var passwordOrigin = this.passwordOrigin;
        var captcha = postData.captcha;
        if (!phone.trim()) {
          this.ver_tip = '请输入手机号或账号';
          return false;
        }
        // else if(!/^1\d{10}$/.test(phone)){
        //   this.ver_tip = '请输入正确的手机号';
        //   return false;
        // }

        if (!passwordOrigin.trim()) {
          this.ver_tip = '请输入密码';
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

        return true;
      },
      toRegister(){
      	var query = this.$route.query;
        this.$router.push({path: '/access/register', query: query});
      },
      forgetPwd(){
      	var query = this.$route.query;
        this.$router.push({path: '/pass/findPwd', query: query});
      }
    },
    mounted(){
      if (sessionStorage.getItem('phoneNum')) {
        this.postData.phone = sessionStorage.getItem('phoneNum')
      }
      var self = this;
      var msg = this.$route.query.msg;
      if (msg) {
        this.$message.error(decodeURIComponent(msg));
      }
      //修复表单插件自动填充的bug
      setTimeout(function(){
        if(self.passwordOrigin){
          self.iptpass = true;
        }
      },600);
      this.userName = this.$cookie.get('truename');
      var FauxPlaceholder = function(){
        // 检查标签是否支持该属性
        function ElementSupportAttribute(elm, attr) {
          var test = document.createElement(elm);
          return attr in test;
        }
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
    },
    filters: {
      //IPRFormat : filters.formatIPRClassify.format
    }
  }
</script>

<style lang="scss">
  .login_doalog {
    .el-dialog__body {padding-bottom: 10px;}
    .status_icon {color: #FFC839; font-size: 40px; margin: 0 auto; display:block; text-align:center;}
    .content {width:100%; text-align:center; margin-top:15px; font-size:14px; color:#666;}
  }
</style>

