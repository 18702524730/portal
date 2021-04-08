<template>
<div class="reg_success">
  <div class="reg_success_in commWidth">
    <a class="jump" :href="jumpUrl">跳过此步骤</a>
    <div class="reg_success_box">
      <div class="til">
        <h3>注册成功！</h3>
        <p>请完善基础信息以获得更佳的服务体验</p>
      </div>

      <form autocomplete="off">
        <span class="reminder">
          <label>{{ver_tip}}</label>
        </span>
        <div class="ipt-wrap">
          <input type="text" class="ipt" id="1" v-model="postData.truename" placeholder="请输入姓名" maxlength="10">
        </div>
        <div class="radio-wrap">
          <el-radio class="radio" v-model="postData.sex" label="1">先生</el-radio>
          <el-radio class="radio" v-model="postData.sex" label="2">女士</el-radio></div>
        <button type="submit" class="btn btn-primary submit-btn" @click.prevent="save">
          提交
        </button>
        <div class="goto">
          去<a :href="userUrl+'/iprp'">我的账号</a>查看！
        </div>
      </form>
    </div>
  </div>
</div>
</template>
<script>
  import Vue from 'vue'
  import $ from 'jquery'
  const rootUrl = CONFIG.rootUrl;
  const userUrl = CONFIG.userUrl;
  const indexUrl = CONFIG.indexUrl;
  import qs from 'qs'
  export default {
    components: {
    },
    data(){
        return{
          ver_tip:'',
          indexUrl: indexUrl,
          userUrl: userUrl,
          jumpUrl: '',
          submitDisabled: false,
          postData:{
            phone: '',
            sex:'2',
            truename:''
          }
        }
    },
    methods:{
      checkValid(){
        if (!this.postData.truename) {
          this.ver_tip = '请输入姓名';
          return false;
        }else if(this.postData.truename.trim().length<2){
          this.ver_tip = '姓名长度在2-10个字符之间';
          return false;
        }
        if (!this.postData.sex) {
          this.ver_tip = '请选择性别';
          return false;
        }
        return true;
      },
      save(){
        var self = this;
        if (self.submitDisabled || !self.checkValid()) {
          return;
        }
        this.ver_tip = '';
        self.submitDisabled = true;
        self.$http.post('./api/memberupdate', self.postData)
        .then((response) => {
          console.log(response.data)
          self.$alert('提交成功');
          location.href = self.jumpUrl;
        })
        .catch((error) => {
          var data = error.response.data;
          self.ver_tip = data.msg;
          self.submitDisabled = false;
        });
      }
    },
    mounted(){
      this.postData.phone = this.$route.query.phone;
      var return_url = this.$route.query.return_url;
      this.jumpUrl = decodeURIComponent(return_url || this.indexUrl);
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

<style scoped lang="scss">
.reg_success{
  width:100%;
  overflow: hidden;
  font-size:14px;
  background-color: #f5f5f5;
  .reg_success_in{margin-top:15px;background-color: #FFF;overflow:hidden;}
  .jump{position: absolute;top:67px;right:95px;font-size: 14px;color: #63bdfb;}
  .reg_success_box{
    width: 314px;
    margin: 78px auto 60px;
    text-align: center;
    .til{
      h3{height: 40px;line-height: 1; padding-left: 48px;font-size:36px;color:#7fd5b2;background: #FFF url(~assets/img/reg_login/success.png) 0 0 no-repeat;display: inline-block;font-weight: normal;}
      p{font-size:16px;color:#666;margin-top: 12px;}
    }
    form{
      padding-top: 22px;
      .reminder{text-align: left;}
      .ipt-wrap{position: relative;}
      .ipt-wrap input{width:100%;height:48px;border:1px solid #e5e5e5;padding-left:10px;}
      .radio-wrap{
        padding:20px 0 35px;
        text-align:left;
        label{margin-right: 28px;}
      }
      .submit-btn{clear: both;width:100%;height:48px;font-size:16px;background-color:#63bdfb;color:#fff;}
      .goto{
        color:#666;
        margin-top:28px;
        a{color:#3db1fa;}
      }
    }
  }
}


</style>
