<template>
  <section>
    <sebe-header></sebe-header>

    <div class="register_box">
      <div class="reg_tit">
        <span class="back_box fl" @click="backFn">
          <i class="fa fa-angle-left" aria-hidden="true"></i>
          <span class="text">返回</span>
        </span>
        <span class="title">会员注册</span>
      </div>
      <el-form :model="regData" :rules="regRules" autocomplete="off" ref="regData" class="demo-ruleForm" >
        <div class="reg_content">
          <el-form-item label="" prop="phone" autocomplete="off" class="input">
            <el-input placeholder="请输入注册手机号" autocomplete="off" type="text" maxlength="11" v-model="regData.phone" size="medium" clearable></el-input>
          </el-form-item>
          <el-form-item label="" prop="token" autocomplete="off" class="input_code">
            <el-input placeholder="请输入验证码" type="text" autocomplete="off" v-model="regData.token" size="medium" ></el-input>
            <span class="getCode" :class="{disabled: preventCode}" @click.prevent="getCode">{{codeText}}</span>
          </el-form-item>
          <el-form-item label="" prop="password" autocomplete="off" class="input_code">
            <el-input placeholder="请输入密码"  autocomplete="off" :type="is_pass" v-if="isPasswordType" @focus="is_pass='password'" v-model="regData.password" size="medium" ></el-input>
            <el-input placeholder="请输入密码"  autocomplete="off" type="text" v-if="!isPasswordType" v-model="regData.password" size="medium" ></el-input>
            <span class="passwordEyes" @click="togglePasswordType"><i class="fa fa-eye-slash" aria-hidden="true" v-if="isPasswordType"></i><i class="fa fa-eye" aria-hidden="true" v-else></i></span>
          </el-form-item>
          <div class="agree">
            <el-checkbox label="我已阅读并同意" @click="isRead=!isRead" v-model="isRead"></el-checkbox>
            <a :href="cartUrl+'/shop/pages/regAgreement.html'" target="_blank">《拾贝网用户注册协议》</a>
          </div>
          <el-button size="medium" type="primary" class="submit_btn" @click.prevent="registerFn">{{ buttonText }}</el-button>
          <span class="fl login_link" @click="goLoginFn">已有账号，立即登录</span>
        </div>
      </el-form>
    </div>

    <sebe-footer></sebe-footer>
  </section>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import sebeHeader from 'components/HeaderSimple.vue'
  import sebeFooter from 'components/FooterSimple.vue'
  import Util from 'src/common/js/util.js'
  const rootUrl = CONFIG.rootUrl;
  const cartUrl = CONFIG.cartUrl;

  import qs from 'qs'
  import md5 from 'md5'

  export default {
    components: {
      sebeHeader,
      sebeFooter
    },
    data(){
      let validatePhone = (rule, value, callback) => {
        if (!/^1[0-9]{10}$/.test(value)) {
          callback(new Error('请输入正确的手机号'));
        } else {
          callback();
        };
      }
      let validateCode = (rule, value, callback) => {
        if (!/^\d{6}$/.test(value)) {
          callback(new Error('请输入6位数字的验证码'));
        } else {
          callback();
        };
      }
      let validatePwd = (rule, value, callback) => {
        if(!/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)\S{8,16}$/.test(value)){
          callback(new Error('密码长度8-16位，含数字、大写字母、小写字母中至少两类'));
        }else {
          callback();
        }
      }
      return{
        is_pass:'text',
        iptphone:false,
        ipttoken:false,
        iptpass:false,
        buttonText: '注册',
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
        submitDisabled:false, //禁止重复提交
        regRules: {
          phone:  [
            { required: true, message: '手机号不能为空', trigger: 'change' },
            { validator: validatePhone, trigger: 'blur'}
          ],
          token: [
            { required: true, message: '验证码不能为空', trigger: 'change' },
            { validator: validateCode, trigger: 'blur'}
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'change' },
            { validator: validatePwd, trigger: 'blur'}
          ]
        },
      }
    },
    methods:{
      // 返回
      backFn () {
        this.$router.go(-1);
      },
      // 去登录
      goLoginFn () {
        var query = this.$route.query;
        this.$router.push({path: '/access/login', query: query});
      },
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
        if (self.preventCode) {
          return;
        }
        if (!this.checkPhone()) {
          self.$message('请输入正确的手机号');
          return;
        }
        self.ver_tip = '';
        self.$http.post('./api/member/register/capcha', qs.stringify({account: self.regData.phone}))
        .then((response) => {
          console.log(response.data)
          var data = response.data;
          if(data.status == 10004){
            self.$message(data.msg);
            return;
          }
          self.$message('验证码已发送');
          self.timeout();
        })
        .catch((error) => {
          var data = error.response.data;
          self.$message(data.msg);
          //self.submitDisabled = false;
          //self.$message(data.msg)
        });
      },
      registerFn (){
        var self = this;
        self.$refs.regData.validate((valid) => {
          if (!self.isRead) {
            self.$message('请阅读并同意《拾贝网用户注册协议》');
            return
          }
          if (self.submitDisabled) {
            return
          }
          self.submitDisabled = true;
          if (valid) {
            self.buttonText = '注册中...';
            self.ver_tip = '';
            self.regData.password = md5(self.regData.password);
            self.regData.registFrom = 1;
            if(self.$cookie.get('resourceType')==6){
              self.regData.resourceType = 6;
            }else{
              self.regData.resourceType = '';
            }
            console.log(self.regData);
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
              self.$message(data.msg)
              self.submitDisabled = false;
            });
          }
        })
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
        console.log(111)
        self.$http.post('./api/beforeLogin', {
          account: self.regData.phone
        })
        .then((response) => {
          var data = response.data;
          self.$http.post('./api/login', {
            phone: self.regData.phone,
            password: self.regData.password,
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
      console.log("z")
      this.userName = this.$cookie.get('truename');
      // var FauxPlaceholder = function(){
      //   // 检查标签是否支持该属性
      //   function ElementSupportAttribute(elm, attr) {
      //     var test = document.createElement(elm);
      //     return attr in test;
      //   }
      //   if(!ElementSupportAttribute('input','placeholder')) {
      //     $("[placeholder]")
      //       .focus(function() {
      //         var input = $(this);
      //         input.next().hide();
      //       })
      //       .blur(function() {
      //         var input = $(this);
      //         if (input.val() == "") {
      //           input.next().show();
      //         }
      //       }).after('<span class="placeholder"></span>');
      //       $(".placeholder").click(function(){
      //         var input = $(this).prev().focus();
      //       }).html(function(){
      //         return $(this).prev().attr('placeholder');
      //       });
      //   }
      // };
      // setTimeout(function(){
      //   FauxPlaceholder();
      // },300);
      // this.regData = {
      //   phone: '',
      //   password:'',
      //   token: ''
      // }
    },
    filters: {
    },
    watch:{

    }
  }
</script>

<style lang="scss">
  /*注册页面*/ 
  .register_box {
    width: 1200px; background: #fff; margin: 20px auto; padding: 60px 100px; height:600px;
    .reg_tit {
      width: 1000px; text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee; font-size: 18px; color: #333; font-weight: bold;
      .title {margin-left: -56px;}
    }
    .reg_content {
      width: 300px; margin: 30px auto;
      .line {
        width: 100%; height: 40px; line-height: 38px; box-sizing: border-box; border: 1px solid #E6E6E6; margin-bottom: 20px;overflow: hidden;
        .el-input__inner {width: 100%; height: 38px; margin-top: -2px; border:none;}
        .input_code {
          width: 200px; display: inline-block;
        }
        .getCode {
          color: #3DB1FA; padding: 0 10px; cursor: pointer;
        }
      }
      .input_code {
        position: relative;
        .getCode {
          color: #3DB1FA; padding: 0 10px; cursor: pointer; position: absolute; top: 0; right:10px;
        }
        .disabled {color: #999; cursor: default;}
        .passwordEyes {position: absolute; top:0; right:10px;}
      }
      .el-checkbox__label {color: #333;}
      .agree {
        margin-top: 20px;
        a {color: #3DB1FA;}
      }
      .submit_btn {width: 100%; margin-top: 30px; font-size: 16px; height: 42px; line-height: 42px; padding: 0; border-radius: 2px;}
      .login_link {
        color: #999; margin-top: 10px; font-size: 13px; cursor: pointer;
        &:hover {color:#3DB1FA;}
      }
    }
  }
</style>
