<template>
	<div>
		<div class="webchat">
			<div class="fr go_old" @click="gotoLoginFn('login')" >返回账号登录</div>
			<div class="content_box">
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

</template>
<script>
import qs from 'qs'
import Util from 'src/common/js/util.js'
const wxUrl = CONFIG.wxUrl;
export default {
	props: ['isWechat'],
    components: {
    },
	data(){
		return{
    	tabIsLogin: true,
    	wxUrl:wxUrl,
    	weixinurl:'',
    	sbid:'',
    	type:'',
    	refresh:true,//二维码刷新
    	return_url:'',
    	timer: '',
		}
	},
	methods:{
		// 去商家平台入驻页面
    goBusinessPageFn () {
      this.isShowDialog = false; //隐藏弹窗
      location.href = 'https://testwww.ipsebe.com/sebe/pages/channel.html#';
    },
		// 返回账号登录
		gotoLoginFn (pathName) {
			clearInterval(this.timer);
			var query = this.$route.query;
		  this.pathName = pathName;
      this.$router.push({path:'/access/login',query: query});
		},
		refreshbtn(){//点击刷新二维码
			this.wechat();
			this.refresh = true;
		},
		loginSuccessHandle(){//登陆成功跳转
				var hash = location.hash;
				if (hash.indexOf('return_url') !== -1) {
					location.href = decodeURIComponent(Util.getHashString('return_url'));
				}else{
					this.$router.push('/')
				}
			},
		wechat(){
			var self = this;
				self.$http.post(wxUrl+'/weixin/wechat/getWxQRUrl')
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
      self.timer = setInterval(function(){
				self.$http.post('api/wxLogin',qs.stringify({sbid: self.sbid,bindType:1}))
				.then((response) => {
					i++;
          if (i > 300) {
          	self.refresh = false;
              clearInterval(self.timer);
              return;
          }
		    	if(response.data.code>0){
		    		clearInterval(self.timer);
		    		if(response.data.code==1){
		    			var regdata = response.data.data;
		    			self.$router.push({path: '/regLogin', query: {headimgurl: regdata.headimgurl,nickname:regdata.nickname,openid:regdata.openid,return_url:self.return_url}});
		    		}else if(response.data.code==2){
		    			self.loginSuccessHandle();
		    		}
		    	}
			  })
		    .catch((error) => {
		    	console.log(error)
		    	clearInterval(self.timer);
	    		self.refresh = false;
	    		self.$message({
	          message: error.response.data.msg,
	          type: 'warning'
	        });
		    });
	    }, 1000);
	  }
	},
	mounted(){
		this.wechat();
		this.return_url = this.$route.query.return_url;
	},
    filters: {
    },
    watch: {
    	isWechat(){
    		if (!this.isWechat) {
    			 (this.timer);
    		}
    	}
    }
}
</script>
<style lang="scss">
	.webchat{
		text-align:center;
		margin-bottom: 10px;
		.go_old {margin-top: -50px;}
		.content_box {
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
			margin-top:20px;
			a{
				color: #3DB1FA;
				text-decoration:none;
				cursor:pointer;
				background:url(~assets/img/reg_login/refresh_blue.png) no-repeat right;
				padding-right: 14px;
			}
		}
	}
</style>
<style lang="scss">
  .login_doalog {
    .el-dialog__body {padding-bottom: 10px;}
    .status_icon {color: #FFC839; font-size: 40px; margin: 0 auto; display:block; text-align:center;}
    .content {width:100%; text-align:center; margin-top:15px; font-size:14px; color:#666;}
  }
</style>
