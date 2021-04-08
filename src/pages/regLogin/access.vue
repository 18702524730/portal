<template>
  <section class="login_page">
    <sebe-header></sebe-header>
    <div class="register_login">
      <div class="commWidth ">
        <div class="login_bg">
          <img src="~assets/img/reg_login/title.png" class="title" alt="">
          <img src="~assets/img/reg_login/login_bg.png" class="bg" alt="">
          <img src="~assets/img/reg_login/three_point.png" class="three_point" alt="">
          <img src="~assets/img/reg_login/ball.png" class="ball" alt="">
        </div>
        <div class="fr reg_login_box" :class="{'login_mt':pathName=='login','sms_mt':pathName=='sms','register_mt':pathName=='register','wechat_mt':pathName=='wechat'}">
          <div class="type_tab" v-if="pathName != 'wechat'">
            <span class="item" :class="{'active': pathName=='login'}" @click="goto('login')">账号密码登录</span>
            <span class="item" :class="{'active': pathName=='sms'||pathName=='register'}" @click="goto('sms')">短信快捷登录</span>
            <span class="under_line"></span>
          </div>
<!--           <el-tabs v-model="pathName" @tab-click="handleClick" class="type_tab" v-if="pathName != 'wechat'">
            <el-tab-pane label="账号密码登录" name="login"  @click="goto('login')">账号密码登录</el-tab-pane>
            <el-tab-pane label="短信快捷登录" name="sms" @click="goto('sms')">短信快捷登录</el-tab-pane>
          </el-tabs> -->
        <!-- 右边提示 -->
          <!-- <div class="tooltip_txt" v-if="pathName!='wechat'">
            <span v-if="pathName=='sms'||pathName=='register'">账号密码登录</span>
            <span v-if="pathName=='login'">短信快捷登录</span>
          </div> -->
          <!-- <div class="fr go_old" @click="goto('login')" v-if="pathName=='wechat'">返回账号登录</div> -->
          <!-- 右边icon -->
          <!-- <img class="tooltip" v-if="pathName=='sms'||pathName=='register'" src="~assets/img/reg_login/PCicon.png" alt="" @click="goto('login')"> -->
          <!-- <img class="tooltip" v-if="pathName=='login'" src="~assets/img/reg_login/SMSicon.png" alt="" @click="goto('sms')"> -->
          <!-- 左边显示标题 -->
          <div class="til" v-if="pathName=='wechat'">
            <a href="javascript:;" class="fl">登录拾贝网</a>
          </div>
          <!-- 短信登录提示 -->
          <!-- <p class="sms_tit" v-if="pathName=='sms'">验证即登录，未注册将自动创建拾贝帐号</p> -->
          <!-- 微信二维码 -->
          <router-view :isWechat="isWechat"></router-view>
          <!-- 底部logo -->
          <div v-if="pathName!='wechat'" class="other">
            <a href="javascript:;" @click="goto('wechat')">
              <img src="~assets/img/reg_login/WeChat.png" alt="">
              <span>微信登录</span>
            </a>
            <a :href="taobaoUrl">
              <img src="~assets/img/reg_login/taobao.png" alt="">
              <span>淘宝登录(创新保)</span>
            </a>
            <a v-if="pathName=='register'" href="javascript:;" @click="goto('sms')">
              <img src="~assets/img/reg_login/SMS.png" alt="">
              <span>短信登录</span>
            </a>
          </div>
          <div class="forget-pwd clearfix fr" v-if="pathName=='login'||pathName=='sms'">
            <a href="JavaScript:void(0);" class="fl" @click.prevent="forgetPwd">忘记密码</a>
            <a href="#/access/register"  @click.prevent="toRegister" class="fl">免费注册</a>
          </div>
        </div>
      </div>
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
  const userUrl = CONFIG.userUrl;
  export default {
    components: {
      sebeHeader,
      sebeFooter
    },
    data(){
      return{
        userUrl:userUrl,
        taobaoUrl: '',
        pathName:'login',
        isWechat: false
      }
    },
    methods:{
      forgetPwd(){
        var query = this.$route.query;
        this.$router.push({path: '/findPwd', query: query});
      },
      toRegister(){
        var query = this.$route.query;
        this.$router.push({path: '/register', query: query});
      },
      goto(pathName){
        var self = this;
        var query = this.$route.query;
        this.isWechat = false;
        if (pathName === 'login') {
          setTimeout(function(){
            self.pathName = pathName;
            self.$router.push({path:'/access/login',query: query});
          }, 100);
        }else if(pathName === 'register'){
          this.pathName = pathName;
          this.$router.push({path:'/access/register',query: query});
        }else if(pathName === 'wechat'){
          this.pathName = pathName;
          this.$router.push({path:'/access/wechat',query: query});
          this.isWechat = true;
        }else if(pathName === 'sms'){
          this.pathName = pathName;
          this.$router.push({path:'/access/sms',query: query});
        }
      },
      wechat(){
        var hash = location.hash;
        this.pathName = hash.indexOf('register') !== -1?'register' : hash.indexOf('login') !== -1?'login': hash.indexOf('wechat') !== -1?'wechat':'sms';
      }
    },
    mounted(){
      this.wechat();
      let hash = location.hash;
      let return_url = '';
      if (hash.indexOf('return_url') !== -1) {
        return_url = decodeURIComponent(Util.getHashString('return_url'));
      }
      this.taobaoUrl = userUrl + '/api/jump_taobao_auth?operate_type=1' + (return_url ? '&succ_url='+return_url : '');
    },
    filters: {
    },
    watch:{
      '$route':'wechat'
    }
  }
</script>

<style lang="scss">
.login_page {position: absolute; height: 100%; background: #fff; width: 100%;}
body {background-color: #fff }
/*登录 注册 界面 CSS */
@keyframes moveDownUp {
  0% {
    top: 155px;
  }
  25% {
    top: 165px;
  }
  50% {
    top: 180px;
  }
  75% {
    top: 165px;
  }
  100% {
    top: 155px;
  }
}
@keyframes moveAround {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.reg-content{min-height: 550px;}
// 登录部分定位
.login_mt{margin-top: -195px;}
.sms_mt{margin-top: -202px;}
.register_mt{margin-top: -228px;}
.wechat_mt{margin-top: -198px;}
.commWidth {
  position: relative;
  .reg_login_box{background-color: #fff;width: 360px;margin-right:34px;padding:40px 30px 30px 30px; position: absolute;top:50%;right:0; margin-top:-186px; border-radius:3px;
    .submit_btn {width: 100%; font-size: 16px; height:42px; line-height:42px; padding:0; font-size:16px; border-radius: 2px;}
    a{color: #3db1fa;}
    .type_tab {
      text-align: left; height: 30px; position:relative;
      .item {
        color: #333; font-size: 16px; float: left; margin-right: 30px; padding-bottom: 8px; display: inline-block; cursor: pointer;
        &.active {border-bottom: 2px solid #3DB1FA; font-weight: bold;}
        &:hover {text-decoration: none;};
      } 
    }
    .tooltip{position: absolute;right:0px;top:0px;cursor: pointer;}
    .tooltip_txt{background:transparent url(~assets/img/reg_login/Shape.png) left bottom no-repeat;position: absolute;right:60px;top:20px;width:100px;height:25px;line-height:25px;padding-left: 10px;color:#3db1fa;}
    .go_old{font-size: 14px;color: #333333;line-height:100%; cursor: pointer;}
    .til{text-align: center;height: 30px;
      >a{font-size: 18px;color: #333;font-weight:bold;}
      >p{line-height:100%;font-size:14px;
        a{color:#f64744;}
      }
      a:hover{text-decoration: none;}
      span{width: 1px; height: 17px; background-color: #e5e5e5;margin: 0 25px;display: inline-block;}
    }
    .sms_tit{font-size: 12px;color: #666666;margin-bottom:-10px;}
    .ipt-wrap{position: relative;border-bottom: 1px solid #e5e5e5;margin-top:30px;width:100%;
      input{width:100%;height: 28px;line-height: 28px;border:1px solid #fff; padding-left: 3px;font-size: 14px; padding-bottom: 5px;}
      input:focus{outline: 0;}
    }
    .password-wrap{margin-top: 30px;}
    .getcode{position: absolute;top: -10px;right:0;width: 90px;height: 30px;color:#3db1fa;border:1px solid #3db1fa;padding:0;font-size:12px; border-radius: 2px;}
    .getcode:hover{background-color: #3db1fa;color: #fff;}
    .getcode.disabled{
      background-color: #f5f5f5; border:1px solid #eee; color:#999;
      &:hover {background-color: #f5f5f5; border:1px solid #eee; color:#999;}
    }
    .iread{position: relative;padding-left: 18px;width: 100%;font-size: 13px;height: 35px;color: #666;padding-top:0;
      label{padding-left:0}
      span{position: absolute;top:6px;left:0;width: 13px;height: 13px;background: #fff url(~assets/img/reg_login/check_bg.png) 0 0 no-repeat;display: inline-block;}
    }
    .register-btn{width: 100%;height:48px;font-size: 16px;}
    .forget-pwd{
      a{color: #999;font-size:13px;line-height:100%;text-decoration:none; margin-left: 20px;}
    }
    .other{text-align:left; margin-top:20px;margin-bottom: 20px;
      a{font-size: 13px;color:#666;text-decoration:none; margin-right: 20px; text-align:center;display: inline-block;min-width: 90px;
        img{display:inline-block;vertical-align: middle; width: 24px; height: 24px;}
        span{vertical-align:middle;display:inline-block;margin-right:7px;}
        .clre{color:#eee;}
      }
      a:first-child{
        img{margin-left:8px;}
        span{margin-right:0;}
      }
    }
    .other_login{text-align:center;
      span{vertical-align:middle;display:inline-block;font-size: 14px;color: #999999;}
      .clre{color:#eee;}
    }
    .wechat-title{overflow:hidden;
      span{font-size:20px;}
      a{font-size:14px;margin-top:10px;color:#333;text-decoration:none;cursor:pointer;}
      a:hover{color:#3db1fa}
    }

  }
  .login_bg {
    width: 800px; height: 600px; position: relative; float: left; 
    .title {position: absolute; left: 0; top: 50px;width: 460px;}
    .bg {position: absolute; left: 0; top:100px; width: 800px;}
    .three_point {position: absolute; width:270px; left: 260px; top: 90px; animation: moveDownUp 1.75s linear infinite;}
    .ball {position: absolute; left: 490px; top:265px; animation: moveAround 2s linear infinite;}
  }
}
.reminder{height: 30px;display: block;line-height:30px;}


.register_login{
  height:600px;background: linear-gradient(180deg, #74c5f8, #3173d2) center 0 no-repeat;position: relative;
  .commWidth {height: 600px;}
	.captcha-wrap,.code-wrap{margin-top: 25px;}
	.code-wrap span{position: absolute;right: 0;top:25px;}
	form .captcha-wrap span{position: absolute;right: 0;top:-4px;}
	.captcha-wrap span img{margin-top:3px;}
	.reminder label{color: red;}

	.ipt-wrap .placeholder{position: absolute;bottom:13px;left: 5px;color: #999;font-size: 14px }

  input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
      background-color: #fff !important;;
      -webkit-box-shadow: 0 0 0px 1000px transparent  inset !important;
      background-color:transparent;
      background-image: none;
      transition: background-color 50000s ease-in-out 0s;
  }
  .name{font-size:14px;color:#999;position:absolute;top:0px;left:3px;transition: top 0.2s ease;cursor: text;font-weight: normal;}
  .inputfocus{
    .label-name{top:-20px;}
  }
  form .inputfocus::after{-webkit-transform: translate3d(0, 0, 0);transform: translate3d(0, 0, 0);}
  .ipt-wrap::after{position: absolute;top:18px;right: 0;bottom: 0;left: 0;overflow: hidden;height: 10px;-webkit-transition: -webkit-transform 0.3s ease;transition: transform 0.3s ease;-webkit-transform: translate3d(-101%, 0, 0);transform: translate3d(-101%, 0, 0);border-bottom: 1px solid #3db1fa;}
  form{overflow: hidden;width: 100%;}
}
</style>
