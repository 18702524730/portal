<template>
  <section>
    <sebe-header></sebe-header>

    <div class="register_box bindAccount">
      <div class="reg_tit">
        <h2 style="background:url(https://www.baidu.com/img/bd_logo1.png?qua=high) no-repeat 0 0">
        <img style="height: 48px;width: 48px;vertical-align:middle;" src="http://thirdwx.qlogo.cn/mmopen/ajNVdqHZLLCB1U4RlWgxfhvETtPq7vjDXibwL6qIrIicVVG8KQS3bsBzLfp89OChe3ImJfczoqef4ufFgZ2z8fyQ/132" />
        您好，某某某</h2>
         <el-tabs v-model="activeTab" @tab-click="handleClickTab" class="reg_tab">
          <el-tab-pane label="绑定新账号" name="new"></el-tab-pane>

          <el-tab-pane label="绑定已有账号" name="old"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="reg_content">

        <el-form :model="bindForm" :rules="bindFormRules" ref="bindForm">
          <el-form-item prop="phone">
            <el-input placeholder="请输入手机号" clearable  v-model="bindForm.phone"></el-input>
          </el-form-item>
          <el-form-item prop="picCode">
            <el-input placeholder="请输入图片中的内容" clearable v-model="bindForm.picCode"></el-input>
          </el-form-item>
          <el-form-item v-if="activeTab == 'new'" prop="msgCode" style="position:relative;">
            <el-input placeholder="请输入验证码" clearable v-model="bindForm.msgCode"></el-input>
            <a href="javascript:void(0)" class="getCode" @click.prevent="getCode">{{codeText}}</a>
          </el-form-item>
          <el-form-item prop="pwd" v-if="activeTab=='new'">
            <el-input placeholder="请输入密码" clearable v-model="bindForm.pwd"></el-input>
          </el-form-item>
        </el-form>
        <el-button size="medium" type="primary" class="submit_btn">绑定并登录</el-button>
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
  import qs from 'qs'
  const userUrl = CONFIG.userUrl;
  export default {
    components: {
      sebeHeader,
      sebeFooter
    },
    data(){
      return {
        userUrl:userUrl,
        taobaoUrl: '',
        activeTab: 'new',
        pathName:'login',
        codeText: '获取验证码',
        isWechat: false,
        preventCode: false,
        bindForm: {
          phone: '',
          picCode: '',
          msgCode: '',
          pwd: ''
        },
       bindFormRules: {
          phone: [
            {
							validator: (rule, value, callback) => {
								let myreg=/^[1][3-9][0-9]{9}$/;
								if (value === '') {
									callback(new Error('请填写手机号'));
								} else if (!myreg.test(value)) {
									callback(new Error('您输入的手机号格式不正确'))
								} else {
									callback()
								}
							},required: true, trigger: ['change', 'blur'] }
          ],
          picCode: [
            { required: true, message: '请输入图片中的内容', trigger: 'blur' }
          ],
          msgCode: [
            { required: true, message: '请填写验证码', trigger: 'blur' }
          ],
          pwd: [
            { required: true, message: '请填写验证码', trigger: 'blur' }
          ]
       }
      }
    },
    methods:{
      handleClickTab (tab) {
        console.log(tab.name)
      },
      checkPhone(){
        var bindForm = this.bindForm;
        var phone = bindForm.phone;
        if (!phone.trim()) {
          this.ver_tip = '请输入手机号';
          return false;
        }else if(!/^1\d{10}$/.test(phone)){
          this.ver_tip = '请输入正确的手机号';
          return false;
        }
        return true;
      },
      //获取手机验证码
      getCode () {
        if (!this.bindForm.phone) {
          this.$message({
            message: '请先输入手机号',
            type: 'warning'
          })
          return
        }
        var self = this;
        if (self.preventCode) {
          return;
        }
        // self.ver_tip = '';
        self.$http.post('./api/member/register/capcha', qs.stringify({account: self.bindForm.phone}))
        .then((response) => {
          console.log(response.data)
          var data = response.data;
          self.$message('验证码已发送');
          self.timeout();
        })
        .catch((error) => {
          var data = error.response.data;
          // self.ver_tip = data.msg;
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

    },
    mounted(){

    },
    filters: {
    },
    watch:{

    }
  }
</script>

<style lang="scss">
.bindAccount{
  padding: 60px;
  .getCode{position: absolute;right: 15px;top: 0;text-decoration: none;color: #3DB1FA;}
  .reg_tit{border: none;width: 100%;
    h2{font-size: 18px;color: #333;line-height: 48px;}
  }
  .submit_btn{margin-top: 10px!important;}
} 
.reg_tab{
  margin-top: 20px;
  .el-tabs__nav{margin-left: 365px;}
  .el-tabs__item{
    font-size: 16px;width: 180px;
  }
}

</style>
