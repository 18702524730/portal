<template>
  <div class="find_passward">
    <div class="find_passward_in commWidth">
      <h3>找回密码(未完成)</h3>
      <div class="find_passward_box">
        <ul class="steps">
          <li v-for="(item, index) in stepsData" :class="{cur: step === (index+1)}">
            <span>{{index+1}}</span><i>{{item}}</i>
          </li>
        </ul>

        <!-- 第1步 填写账户名 -->
        <form autocomplete="off" v-if="step === 1">
          <span class="reminder">
            <label>{{ver_tip}}</label>
          </span>
          <div class="ipt-wrap">
            <label for=""><sup>*</sup>手机号</label>
            <input type="text" class="ipt" id="1" v-model="postData.account" placeholder="请输入手机号" maxlength="11">
          </div>
          <div class="ipt-wrap">
            <label for=""><sup>*</sup>校验码</label>
            <input type="text" class="ipt code" id="1" v-model="postData.captcha" placeholder="请输入校验码" maxlength="4">
            <span class="captcha-span">
              <img class="ver-code" :src="codeUrl + '/servlet/captchaCode?t='+ random" alt="校验码" width="80" height="25"/>
              <img src="~assets/img/reg_login/gx.png" class="refresh" @click="capRefresh()">
            </span>
          </div>
          <div class="btn-wrap">
            <button type="submit" class="btn btn-primary submit-btn" @click.prevent="saveFirst">提交</button>
          </div>
        </form>

        <!-- 第2步 验证身份 -->
        <form autocomplete="off" v-if="step === 2">
          <span class="reminder">
            <label>{{ver_tip}}</label>
          </span>
          <div class="ipt-wrap">
            <label for=""><sup>*</sup>手机号</label>
            <span class="phone">{{postData.account}}</span>
          </div>
          <div class="ipt-wrap code-wrap">
            <label for=""><sup>*</sup>验证码</label>
            <input type="text" class="ipt" id="1" v-model="postData.code" maxlength="6">
            <button class="btn getcode" :class="{disabled: preventCode}" @click.prevent="getCode">{{codeText}}</button>
          </div>
          <div class="btn-wrap btn-wrap1">
            <button type="submit" class="btn btn-primary submit-btn" @click.prevent="saveSecond">验证</button>
            <!-- <p>验证码已发送，30分钟内有效。<br>如果您在1分钟之内没有收到验证码，请<span :class="{disabled: preventCode}">{{codeText}}</span></p> -->
          </div>
        </form>

        <!-- 第3步 设置新密码 -->
        <form autocomplete="off" class="setPwd" v-if="step === 3">
          <span class="reminder">
            <label>{{ver_tip}}</label>
          </span>
          <div class="ipt-wrap">
            <label for=""><sup>*</sup>新密码</label>
            <input type="password" class="ipt" id="1" v-model="newPassword" placeholder="请设置新密码" maxlength="16">
          </div>
          <div class="ipt-wrap">
            <label for=""><sup>*</sup>确认新密码</label>
            <input type="password" class="ipt" id="1" v-model="againPassword" placeholder="请再次输入密码" maxlength="16">
          </div>
          <div class="btn-wrap">
            <button type="submit" class="btn btn-primary submit-btn" @click.prevent="saveThird">提交</button>
          </div>
        </form>

        <!-- 第4步 完成 -->
        <div class="over" v-if="step === 4">
          <img src="~assets/img/reg_login/find_success.png">
          <p>恭喜，登录密码重置成功！</p>
          <button type="submit" class="btn btn-primary submit-btn" @click.prevent="gotoLogin">
            去登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  const rootUrl = CONFIG.rootUrl;
  import qs from 'qs'
  import md5 from 'md5'
  export default {
    components: {
      //sebeHeader,
      //sebeFooter
    },
    data(){
        return{
          //isPasswordType:true,
          //isPasswordType2:true,
          stepsData:['填写账户名', '验证身份', '设置新密码', '完成'],
          step: 1,
          codeUrl: rootUrl,
          random: Math.random(),
          ver_tip:'',
          codeText:'获取验证码',
          preventCode: false,
          postData:{
            captcha:'',
            account:'',
            code:''
          },
          newPassword:'',
          againPassword:'',
        }
    },
    methods:{
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
      saveFirst(){
        var self = this;
        if (self.submitDisabled || !self.checkValid()) {
          return;
        }
        self.ver_tip = '';
        self.submitDisabled = true;
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
          self.submitDisabled = false;
          self.capRefresh();
        });
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
          //self.submitDisabled = false;
          //self.$message(data.msg)
        });
      },
      saveSecond(){
        var self = this;
        var checkValid = function(){
          var code = self.postData.code;
          if (!code.trim()) {
            self.ver_tip = '请输入验证码';
            return false;
          }else if(code.length !== 6){
            self.ver_tip = '验证码为6位数';
            return false;
          }
          return true;
        }
        if (self.submitDisabled || !checkValid()) {
          return;
        }
        self.ver_tip = '';
        self.submitDisabled = true;
        self.$http.post('./api/member/findpwd/verify', qs.stringify({
          account: this.postData.account,
          code: this.postData.code
        }))
        .then((response) => {
          console.log(response.data)
          self.step = 3;
          //self.$message('提交成功');
          self.submitDisabled = false;
        })
        .catch((error) => {
          var data = error.response.data;
          self.ver_tip = data.msg;
          self.submitDisabled = false;
        });
      },
      saveThird(){
        var self = this;
        var checkValid = function(){
          var pwd = self.newPassword;
          var pwdAgain = self.againPassword;
          if (!pwd.trim()) {
            self.ver_tip = '请设置密码';
            return false;
          }else if(!/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)\S{8,16}$/.test(pwd)){
            self.ver_tip = '密码长度8-16位，含数字、大写字母、小写字母中至少两类';
            return false;
          }
          if (!pwdAgain.trim()) {
            self.ver_tip = '请再次输入密码';
            return false;
          }else if(!/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)\S{8,16}$/.test(pwdAgain)){
            self.ver_tip = '密码长度8-16位，含数字、大写字母、小写字母中至少两类';
            return false;
          }

          if (pwdAgain !== pwd) {
            self.ver_tip = '前后两次输入的密码不一致';
            return false;
          }
          return true;
        }
        if (self.submitDisabled || !checkValid()) {
          return;
        }
        self.ver_tip = '';
        self.submitDisabled = true;
        self.$http.post('./api/member/updateFindPassword', {
          phone: this.postData.account,
          new_password: md5(this.newPassword)
        })
        .then((response) => {
          console.log(response.data)
          self.step = 4;
          self.submitDisabled = false;
        })
        .catch((error) => {
          var data = error.response.data;
          self.ver_tip = data.msg;
          self.submitDisabled = false;
        });
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
      //this.getHomeData();
    },
    filters: {
      //IPRFormat : filters.formatIPRClassify.format
    }
  }
</script>

<style scoped lang="scss">
.find_passward{
  width:100%;
  overflow: hidden;
  font-size:14px;
  color:#666;
  background-color: #f5f5f5;
  .find_passward_in{
    min-height: 530px;
    margin-top:15px;background-color: #FFF;overflow:hidden;
    h3{position: absolute;top:44px;left:55px;font-size: 22px;line-height: 1;color: #666;}
  }
  .find_passward_box{
    width: 100%;
    margin-top: 130px;
    text-align: center;
    border-top: 1px solid #eee;
    /* 步骤条 */
    .steps{
      width:540px;
      margin:-60px auto 0;
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
        i{float: left;font-style: normal;}
        span{float: left;display: block;margin-top: 20px;margin-right: 3px;width:20px;height:20px;line-height:20px;text-align:center;color:#fff;background-color: #cacaca;border-radius: 10px;font-size:12px;}
      }
      li.cur{
        border-bottom: 2px solid #3db1fa;
        color:#3db1fa;
        span{background-color: #3db1fa;}
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
      width:540px;
      margin:0 auto;
      padding-top: 43px;
      p{padding-top: 32px;font-size:16px;color:#3db1fa;}
      .submit-btn{clear: both;width:313px;height:48px;font-size:16px;margin-top: 24px;}
    }
  }
}
.footer-sm-wrap{background-color: #f2f2f2;}


</style>
