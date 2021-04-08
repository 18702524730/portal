<template>
  <form autocomplete="off">
    <div class="ipt-wrap" :class="{inputfocus:!!regData.phone ||　iptphone}" @click="phoneclick()">
      <input type="text" class="ipt" @focus="iptphone=true" ref="phone" @blur="iptphone=false" v-model="regData.phone" maxlength="11">
      <label class="name label-name">请输入手机号</label>
    </div>
    <div class="ipt-wrap code-wrap" :class="{inputfocus:!!regData.token ||　ipttoken}" @click="tokenclick()">
      <input type="text" class="ipt" v-model="regData.token" ref="token" maxlength="6" @focus="ipttoken=true" @blur="ipttoken=false">
      <label class="name label-name">短信验证码</label>
      <button class="btn getcode" :class="{disabled: preventCode}" @click.prevent="getCode">{{codeText}}</button>
    </div>
    <div class="ipt-wrap password-wrap" :class="{inputfocus:!!passwordOrigin ||　iptpass}" @click="passclick()">
      <input type="password" class="ipt" v-model="passwordOrigin" maxlength="16" ref="pass" v-if="isPasswordType" @focus="iptpass=true" @blur="iptpass=false">
      <input type="text" class="ipt" v-model="passwordOrigin" maxlength="16" ref="pass" v-else>
      <label class="name label-name">请设置密码</label>
      <span class="passwordEyes" @click="togglePasswordType"><i class="fa fa-eye-slash" aria-hidden="true" v-if="isPasswordType"></i><i class="fa fa-eye" aria-hidden="true" v-else></i></span>
    </div>
    <span class="reminder">
      <label>{{ver_tip}}</label>
    </span>
    <div class="iread">
      <label @click="isRead=!isRead"><span :class="{active:isRead}"></span>我已阅读并同意<a :href="cartUrl+'/shop/pages/regAgreement.html'" target="_blank">《拾贝网用户注册协议》</a></label>
    </div>
    <button type="submit" class="btn btn-primary register-btn" :class="{disabled: submitDisabled}" @click.prevent="register">{{buttonText}}</button>
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
          iptphone:false,
          ipttoken:false,
          iptpass:false,
          buttonText: '立即注册',
          cartUrl: cartUrl,
          codeText:'获取验证码',
          isRead: true,
          isPasswordType: true,
          ver_tip:'',//校验提示
          passwordOrigin:'',
          regData: {
            phone: '',
            password:'',
            token: ''
          },
          preventCode: false,//控制重发验证码
          submitDisabled:false//禁止重复提交
        }
    },
    methods:{
      phoneclick(){
        this.iptphone = true;
        this.$refs['phone'].focus();
      },
      tokenclick(){
        this.ipttoken = true;
        this.$refs['token'].focus();
      },
      passclick(){
        this.iptpass = true;
        this.$refs['pass'].focus();
      },
      iptFocus(e){//聚焦事件
        var el = e.target;
        $(el).parent(".ipt-wrap").addClass("inputfocus");
        $(el).siblings(".name").addClass("label-name").css("color","#3db1fa");
      },
      iptClick(e){//点击div即绑定input
        e.children(".ipt").focus();
      },
      regSuccessHandle(){
        var query = this.$route.query;
        this.autoLogin();
        this.$router.push({
        	path: '/enter/regSuccess',
        	query: Object.assign({}, query, {phone: this.regData.phone})
        });
      },
      //获取手机验证码
      getCode(){
        var self = this;
        if (self.preventCode || !this.checkPhone()) {
          return;
        }
        self.ver_tip = '';
        self.$http.post('./api/member/register/capcha', qs.stringify({account: self.regData.phone}))
        .then((response) => {
          console.log(response.data)
          var data = response.data;
          self.$message('验证码已发送');
          self.timeout();
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
        self.buttonText = '注册中...';
        self.ver_tip = '';
        self.submitDisabled = true;
        self.regData.password = md5(self.passwordOrigin);
        self.regData.registFrom = 1;
        self.$http.post('./api/member/register', this.regData)
        .then((response) => {
          self.buttonText = '注册成功';
          self.submitDisabled = false;
          var data = response.data;
          self.regSuccessHandle();
        })
        .catch((error) => {
          self.buttonText = '立即注册';
          self.submitDisabled = false;
          var data = error.response.data;
          self.ver_tip = data.msg;
          self.submitDisabled = false;
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
      },
      autoLogin(){
        var self = this;
        self.$http.post('./api/beforeLogin', {
          account: self.regData.phone
        })
        .then((response) => {
          var data = response.data;
          self.$http.post('./api/login', {
            phone: self.regData.phone,
            password: md5(self.passwordOrigin),
            beforeLoginCode: data.code
          })
          .then((response) => {
            console.log(response.data)
          })
          .catch((error) => {
            console.log(error.response);
          });
        })
        .catch((error) => {
          console.log('preLogin:'+ error);
        });
      }
    },
    mounted(){
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
    }
  }
</script>

<style scoped>
.passwordEyes{position: absolute;top: 0px;right: 3px;cursor: pointer;font-size: 16px;color: #666;}
.getcode.disabled{cursor: not-allowed;color: #eee;border-color: #ccc;}
</style>
