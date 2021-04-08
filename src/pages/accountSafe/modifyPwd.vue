<template>
  <section>
    <sebe-header></sebe-header>
    <div class="find_passward">
      <div class="find_passward_in commWidth register_box">
        <div class="reg_tit" @click="backFn">
          <span class="back_box fl">
            <i class="fa fa-angle-left" aria-hidden="true"></i>
            <span class="text" >返回</span>
          </span>
          <span class="title">修改密码</span>
        </div>
        <div class="find_passward_box">
          <ul class="steps slearfix" v-if="step != 3">
            <li v-for="(item, index) in stepsData" :class="{cur: step === (index+1), 'done': (index+1)<step}">
              <p class="num_box"><span class="num">{{ index+1 }}</span></p>
              <p class="step_name">{{ item }}</p>
            </li>
          </ul>

          <!-- 第1步 验证身份 -->
          <el-form :model="postData" :rules="rules2" ref="postData" class="demo-ruleForm" v-if="step === 1">
            <div class="reg_content" >
              <el-form-item class="input" prop="account">
                <el-input placeholder="请输入注册手机号" v-model="phone" class="input" disabled size="medium" clearable></el-input>
              </el-form-item>
              <el-form-item class="input input_code" prop="code">
                <el-input placeholder="请输入验证码" v-model="postData.code" maxlength="6" size="medium" ></el-input>
                <span class="getCode" :class="{disabled: preventCode}" @click.prevent="getCode">{{codeText}}</span>
              </el-form-item>
              <el-button size="medium" type="primary" class="submit_btn" @click.prevent="saveSecond('postData')">下一步</el-button>
            </div>
          </el-form>

          <!-- 第2步 设置新密码 -->
          <el-form :model="pwdObj" :rules="rules3" ref="pwdObj" class="demo-ruleForm" v-if="step === 2">
            <div class="reg_content" >
              <el-form-item label="" prop="newPassword" class="input">
                <el-input placeholder="请输入新密码" v-model="pwdObj.newPassword" type="password" class="input" size="medium" clearable></el-input>
              </el-form-item>
              <el-form-item label="" prop="againPassword" class="input">
                <el-input placeholder="请再次输入密码" v-model="pwdObj.againPassword" type="password" class="input" size="medium" clearable></el-input>
              </el-form-item>
              <el-button size="medium" type="primary" class="submit_btn" @click.prevent="saveThird('pwdObj')">下一步</el-button>
            </div>
          </el-form>

          <!-- 第3步 完成 -->
          <div class="over" v-if="step === 3">
            <img src="~assets/img/reg_login/find_success.png">
            <p>恭喜你，密码修改成功!</p>
            <el-button size="medium" type="primary" class="submit_btn" @click.prevent="gotoLogin">立即登录</el-button>
          </div>
        </div>
      </div>
    </div>
    <sebe-footer></sebe-footer>
  </section>
</template>

<script>
  import Vue from 'vue'
  import sebeHeader from 'components/HeaderSimple.vue'
  import sebeFooter from 'components/FooterSimple.vue'
  import NProgress from 'nprogress'
  import 'nprogress/nprogress.css'
  import { getHomePageInfo } from '../../api/api'
  import filters from '../../api/filters';
  import qs from 'qs';
  import md5 from 'md5'
  const rootUrl = CONFIG.rootUrl;

  export default {
    components: {
      sebeHeader,
      sebeFooter
    },
    data(){
      var validateYzm = (rule, value, callback) => {
        if (!/^(\d){6}$/.test(value)) {
          callback(new Error('验证码为6位数字'));
        } else {
          callback();
        };
      }
      var validatePwd = (rule, value, callback) => {
        if (value != this.pwdObj.newPassword) {
          callback(new Error('请输入相同的密码'));
        } else {
          callback();
        };
      }
      var validatePwdForm = (rule, value, callback) => {
        if (!/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)\S{8,16}$/.test(value)) {
          callback(new Error('密码长度8-16位，含数字、大写字母、小写字母中至少两类'));
        } else {
          callback();
        };
      }
      return{
        stepsData:['验证身份', '设置新密码', '完成'],
        step: 1,
        codeUrl: rootUrl,
        random: Math.random(),
        ver_tip:'',
        codeText:'获取验证码',
        preventCode: false,
        phone:'',
        postData:{
          captcha:'',
          account:'',
          code:''
        },
        // 密码
        pwdObj: {
          newPassword:'',
          againPassword:'',
        },
        rules1: {
          account:  [
            { required: true, message: '手机号不能为空', trigger: 'change' },
          ],
          captcha: [
            { required: true, message: '验证码不能为空', trigger: 'blur' },
          ]
        },
        rules2: {
          code: [
            { required: true, message: '短信验证码不能为空', trigger: 'blur' },  
            { validator: validateYzm, trigger: 'blur'}
          ]
        },
        rules3: {
          newPassword: [
            { required: true, message: '密码不能为空', trigger: ['change', 'blur'] },
            { validator: validatePwdForm, trigger: ['blur','change']}
          ],
          againPassword: [
            { required: true, message: '确认密码不能为空', trigger: 'blur' },
            { validator: validatePwd, trigger: 'blur' },
            { validator: validatePwdForm, trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      // 返回
      backFn () {
        this.$router.go(-1);
      },
      seeDetail(row) {
          if(row.assetType == 0){
              this.$router.push({ name: 'trademarkDetail', params:{intCls:row.intCls,regNo:row.regNo} });
          }else if(row.assetType == 1){
              this.$router.push({ name: 'patentDetail', params:{id:row.id} });
          }
      },
      capRefresh(){
        this.random = Math.random();
      },
      checkValid(){
        var postData = this.postData;
        var phone = postData.account;
        var captcha = postData.captcha;
        if (!phone.trim()) {
          this.ver_tip = '请输入手机号';
          return false;
        }else if(!/^1\d{10}$/.test(phone)){
          this.ver_tip = '请输入正确的手机号';
          return false;
        }

        if (!captcha.trim()) {
          this.ver_tip = '请输入校验码';
          return false;
        }else if(captcha.length !== 4){
          this.ver_tip = '校验码为4位数';
          return false;
        }
        return true;
      },
      saveFirst(formName){
        var self = this;
        self.$refs[formName].validate((valid) => {
          if (self.submitDisabled) {
            return
          }
          self.submitDisabled = true;
          if (valid) {
            self.ver_tip = '';
            self.$http.post('./api/member/findpwd/verifyAndSendCode', qs.stringify(self.postData))
            .then((response) => {
              console.log(response.data)
              self.getCode();
              self.step = 2;
              self.submitDisabled = false;
            })
            .catch((error) => {
              var data = error.response.data;
              self.ver_tip = data.msg;
              self.$message(data.msg);
              self.submitDisabled = false;
              self.capRefresh();
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      //获取手机验证码
      getCode(){
        var self = this;
        if (self.preventCode) {
          return;
        }
        self.ver_tip = '';
        self.preventCode = true;
        self.$http.post('./api/member/findpwd/capcha', qs.stringify({account: self.postData.account}))
        .then((response) => {
          console.log(response.data)
          var data = response.data;
          self.$message('验证码已发送，30分钟内有效。');
          self.timeout();
        })
        .catch((error) => {
          var data = error.response.data;
          self.ver_tip = data.msg;
          self.$message(data.msg);

          //self.submitDisabled = false;
          //self.$message(data.msg)
        });
      },
      saveSecond(formName){
        var self = this;
        self.$refs[formName].validate((valid) => {
          if (self.submitDisabled) {
            return
          }
          if (valid) {
            self.$http.post('./api/member/findpwd/verify', qs.stringify({
              account: this.postData.account,
              code: this.postData.code
            }))
            .then((response) => {
             self.submitDisabled = true;
              self.step = 2;
              //self.$message('提交成功');
              self.submitDisabled = false;
            })
            .catch((error) => {
              var data = error.response.data;
              self.$message(data.msg);
              self.ver_tip = data.msg;
              self.submitDisabled = false;
            });
          }
        })
      },
      saveThird(formName){
        var self = this;
        self.$refs[formName].validate((valid) => {
          if (self.submitDisabled ) {
            return;
          }
          self.submitDisabled = true;
          if (valid) {
            self.$http.post('./api/member/updatepassword', {
              phone: self.postData.account,
              new_password: md5(self.pwdObj.newPassword)
            })
            .then((response) => {
              console.log(response.data)
              self.step = 3;
              self.submitDisabled = false;
            })
            .catch((error) => {
              var data = error.response.data;
              self.ver_tip = data.msg;
              self.$message(data.msg);
              self.submitDisabled = false;
            });
          }
        })
      },
      gotoLogin(){
        var query = this.$route.query;
        this.$router.push({path: '/access/login', query: query})
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
      }
    },
    mounted(){
      var phone = this.$cookie.get('phone');
      if (!phone) {
        this.$router.push({path: 'access/login', query: { return_url: location.href }});
        return;
      }else{
        this.postData.account = phone;
        this.phone = phone.slice(0, 3) + '****' + phone.slice(-4);
      }
    },
    filters: {
        IPRFormat : filters.formatIPRClassify.format
    }
  }
</script>

<style lang="scss">
.find_passward{
  width:100%;
  overflow: hidden;
  font-size:14px;
  color:#666;
  background-color: #f5f5f5;
  .el-input__inner {border: 1px solid #e6e6e6; height: 40px; line-height: 40px;}
  .find_passward_in{
    min-height: 530px;
    margin-top:15px;background-color: #FFF;overflow:hidden;
    h3{position: absolute;top:44px;left:55px;font-size: 22px;line-height: 1;color: #666;}
  }
  .find_passward_box{
    width: 100%;
    margin-top: 60px;
    text-align: center;
    /* 步骤条 */
    .steps{
      width:540px;
      margin:0 auto;
      height:60px;
      font-size:16px;

      li{
        box-sizing: content-box;
        width:115px;
        height:58px;
        line-height: 58px;
        padding-left:20px;
        position: relative;
        margin-bottom: -1px;
        display: inline-block;
        .num_box {
          width: 100%; text-align:center; height: 30px; line-height: 30px; margin-bottom: 10px;
          .num {
            width: 30px; height: 30px; line-height: 30px; display: inline-block; background: #eee; text-align: center; font-size: 14px; color: #999; border-radius:50%; position: relative;
            &:before {content:''; position:absolute; right:30px; top:15px; width: 60px; height:1px; background: #E6E6E6; }
            &:after {content:''; position:absolute; left:30px; top:15px; width: 60px; height:1px; background: #E6E6E6; }
          }
        }
        .step_name {width: 100%; text-align: center; font-size: 14px; color: #999; line-height: 20px;}
        &:first-child {
          .num_box {
            .num {
              &:before {width:0;}
            }
          }
        }
        &:last-child {
          .num_box {
            .num {
              &:after {width:0;}
            }
          }
        }
      }
      li.cur{
        .step_name {color:#3db1fa; }
        .num_box {
          .num {
            background-color: #3db1fa; color:#fff;
            &:before {background-color: #3db1fa;}
            &:after {background-color: #3db1fa;}
          }
        }
      }
      li.done {
        .step_name {color:#333; }
        .num_box {
          .num {
            background-color: #3db1fa; color:#fff;
            &:before {background-color: #3db1fa;}
            &:after {background-color: #3db1fa;}
          }
        }
      }
      li:last-child{
        width:95px;
        padding-left:40px;
      }

    }
    /* 第1、2步 */
    form{
      width:540px;
      margin:45px auto 0;
      .reminder{text-align: left;}
      .ipt-wrap{
        padding-bottom: 16px;
        text-align:left;
        position: relative;
        label{
          display: inline-block;
          margin-right: 10px;
          height:48px;
          line-height:48px;
          color:#999;
          sup{color:red;margin-right: 4px;vertical-align: middle;}
        }
        .captcha-span{
          position: relative;
          height: 25px;display: inline-block;padding-left:10px;
          top:6px;
        }
        span.phone{display: inline-block;height:48px;line-height:48px;}
        input{display: inline-block;width:313px;height:48px;border:1px solid #e5e5e5;padding-left:10px;}
        input.code{width:193px;}
      }
      .code-wrap{
        padding-top:0;
        position: relative;
        .ipt{width:223px;}
        .getcode{width: 85px;height: 32px;color:#3db1fa;border-color: #e5e5e5;padding:0;}
        .getcode:hover{background-color: #3db1fa;color: #fff;border-color: #3db1fa;}
        .getcode.disabled{background-color: #ccc;border-color:#ccc;color: #eee;cursor:not-allowed;}
      }

      .radio-wrap{
        padding:20px 0 35px;
        text-align:left;
        label{margin-right: 28px;}
      }
      .btn-wrap{
        padding-top:30px;
        padding-left: 66px;
        .submit-btn{display: block;clear: both;width:313px;height:48px;font-size:16px;}
        p{
          padding-top: 28px;line-height: 27px;text-align:left;
          span{color:#3db1fa;}
        }
      }
      .btn-wrap1{
        padding-top:15px;
      }
      .goto{
        color:#666;
        margin-top:28px;
        a{color:#3db1fa;}
      }
    }
    /* 第3步设置密码 */
    .setPwd{
      .ipt-wrap{
        label{
          width:85px;text-align:right;
          sup{color:red;margin-right: 4px;vertical-align: middle;}
        }
        .passwordEyes{position: relative;left:-27px;}
      }
      .btn-wrap{padding-left: 99px;}
    }
    /* 第4步完成 */
    .over{
      width:300px;
      margin:0 auto;
      padding-top: 43px;
      img {width:40px; height:40px;}
      p{;font-size:16px; margin: 10px auto 20px auto; color: #333; font-size: 18px;}
      .submit_btn{ width:100%;  }
    }
  }
  .reg_content {
    margin-top: 60px; 
    .input {width: 300px;}
    .input_code {
      width: 300px; position: relative; box-sizing:border-box; 
      .text {width: 150px;}
      .captcha-span {
        position:absolute; right:10px; top:7px;
      }
      .getCode {position: absolute; right:15px; top:0; color: #3DB1FA; cursor: pointer; padding: 0;}
      .disabled {color: #E6E6E6;}
    }
    .w_300 {width: 300px;}
    .w_160 {width: 160px;}
    .submit_btn {
      margin-top: 10px; height: 42px; line-height: 42px; background: #3DB1FA; border-radius:2px; padding: 0; position: relative;
      span {height: 42px; line-height: 42px; display: inline-block;}
      &:before {position:absolute; content:''; width: 100%; height: 100%; left: 0; top: 0; display: none; background: rgba(255,255,255,.2);}
      &:hover {
        &:before {display:inline-block;}
      }
    }
  }
  
}
</style>
