<template>
	<div class="moveBind" v-loading="loading">
		<h4 class="navTitle">账户绑定</h4>
  	<!-- 微信解除绑定 -->
  	<div class="add_wachat mt30 oh" v-if="wxInBind===1">
  		<div class="fl clearfix">
  			<p class="fl"><img src="~assets/img/bind/wechat.png" alt="">微信登录</p>
  			<p class="fl nicename">昵称：{{chatdata.nickname}}</p>
  		</div>
  		<div class="fr ope_wechat">
  			<p class="fl"><a @click="changewechat()"><img src="~assets/img/bind/cge.png" alt=""><span>修改</span></a></p>
  			<p class="fl"><a @click="moveAccount()"><img src="~assets/img/bind/move.png" alt=""><span>解除绑定</span></a></p>
  		</div>
  	</div>
  	<!-- 微信添加绑定 -->
  	<div class="add_wachat mt30 oh" v-if="wxInBind===0">
  		<div class="fl oh">
  			<p class="fl"><img src="~assets/img/bind/wechat.png" alt="">微信登录</p>
  		</div>
  		<div class="fr ope_wechat">
  			<a href="#" @click="wechat"><el-button size="small">添加绑定</el-button></a>
  		</div>
  	</div>

  	<!-- 淘宝解除绑定 -->
  	<div class="add_wachat oh" v-if="tbInBind===1">
  		<div class="fl clearfix">
  			<p class="fl"><img src="~assets/img/bind/taobao.png" alt="">淘宝登录</p>
  			<p class="fl nicename"><span class="ni">昵称：{{taobaodata.taobaoUserNick}}</span><span class="tip" v-if="taobaodata.channelCode=='ali'">（已同步阿里巴巴知识产权保护平台的订单信息）</span></p>
  		</div>
  		<div class="fr ope_wechat">
  			<p class="fl"><a :href="userUrl + '/api/jump_taobao_auth?operate_type=2'"><img src="~assets/img/bind/cge.png" alt=""><span>修改</span></a></p>
  			<p class="fl"><a @click="moveAccount('taobao')"><img src="~assets/img/bind/move.png" alt=""><span>解除绑定</span></a></p>
  		</div>
  	</div>
  	<!-- 淘宝添加绑定 -->
  	<div class="add_wachat oh" v-if="tbInBind===0">
  		<div class="fl oh">
  			<p class="fl"><img src="~assets/img/bind/taobao.png" alt="">淘宝登录<span class="tip">（可同步阿里巴巴知识产权保护平台的订单信息）</span></p>
  		</div>
  		<div class="fr ope_wechat">
  			<a :href="userUrl + '/api/jump_taobao_auth?operate_type=1'"><el-button size="small">添加绑定</el-button></a>
  		</div>
  	</div>

  	<!-- 微信扫码绑定 -->
  	<el-dialog :visible.sync="dialogVisible" size="tiny" custom-class="dialog-movebind">
  		<div class="code">
  			<p class="chat_code" v-if="!weixinurl">
  				<img width="100px" class="mt" src="~assets/img/reg_login/Spinner.gif" alt="">
  			</p>
  			<p class="chat_code" v-else>
  				<img :src="weixinurl" width="190px" height="190px" alt="">
  			</p>
  			<p class="chat_txt" v-if="refresh">
				<span>请使用微信扫描上方二维码绑定</span>
			</p>
			<p class="chat_txt" v-else>
				二维码失效<br/>请点击<a @click="refreshbtn">刷新二维码</a>
			</p>
  		</div>
		</el-dialog>
  </div>
</template>
<script>
	import Vue from 'vue'
	import qs from 'qs'
	const userUrl = CONFIG.userUrl;
	const wxUrl = CONFIG.wxUrl;

	export default {
    data() {
      	return {
      		dialogVisible:false,//弹框
      		loading:true,
      		wechatBind:'',//是否有绑定
      		userUrl:userUrl,
      		wxUrl:wxUrl,
      		wxInBind:0,
      		return_url:'',//当前页面地址
      		refresh:true,//微信提示
      		weixinurl:'',
      		sbid:'',
      		chatdata:'', //微信数据
      		taobaodata:'', //淘宝数据
      		tbInBind:0//是否淘宝绑定
    	}
    },
    methods: {
    	changewechat(){
			var self = this;
    		self.dialogVisible = true;
        	self.$http.post(this.wxUrl+'/weixin/wechat/getWxQRUrl',{bindType:'2'})
		    .then((response) => {
		    	self.weixinurl = response.data.wxQRUrl;
		    	self.sbid = response.data.sbid;
		    	if(self.weixinurl){
		    		self.getPaystatus(2);
		    	}
		    })
		    .catch((error) => {
		    });
    	},
    	refreshbtn(){//点击刷新二维码
			this.wechat();
			this.refresh = true;
		},
    	wechat(){
    		var self = this;
    		self.dialogVisible = true;
        	self.$http.post(self.wxUrl+'/weixin/wechat/getWxQRUrl')
		    .then((response) => {
		    	self.weixinurl = response.data.wxQRUrl;
		    	self.sbid = response.data.sbid;
		    	if(self.weixinurl){
		    		self.getPaystatus(1);
		    	}
		    })
		    .catch((error) => {
		    });
		},
		//轮询获取扫描状态
		getPaystatus(type){
			var self = this;
			console.log(self.sbid)
			var i=0;
            var timer = setInterval(function(){
				self.$http.post('api/bindWxAccount',qs.stringify({sbid: self.sbid,bindType:type}))
				.then((response) => {
					i++;
		            if (i > 300) {
		            	self.refresh = false;
		                clearInterval(timer);
		                return;
		            }else if(!self.dialogVisible){
		            	clearInterval(timer);
		                return;
		            }
			    	if(response.data.code == 200){
			    		clearInterval(timer);
			    		self.dialogVisible = false;
			    		self.bindState();
			    		self.$message({
		              		title: '成功',
		              		message: response.data.data,
		              		type: 'success'
		            	});
			    	}
			    })
			    .catch((error) => {
			    	clearInterval(timer);
		    		self.dialogVisible = false;
		    		self.bindState();
		    		var data = error.response.data;
		    		if(data.status == 300015){
			    		self.$message({
				          title: '温馨提示',
				          message: data.msg,
				          type: 'warning'
				        });
			    	}else if(data.status == 300017){
			    		self.$message({
				          title: '温馨提示',
				          message: data.msg,
				          type: 'warning'
				        });
			    	}else if(data.status == 300019){
			    		self.$message({
				          title: '温馨提示',
				          message: data.msg,
				          type: 'warning'
				        });
			    	}
			    });
            }, 1000);
        },
    	bindState(){
    		var self = this;
    		self.loading = true;
    		self.$http.get('/api/findMember?t='+ new Date().getTime())
    		.then((response) =>{
    			self.loading = false;
    			self.wxInBind = response.data.isBindWxAccount || 0;
    			self.tbInBind = response.data.isBindTbAccount || 0;
    			self.chatdata = response.data.wxAccount;
    			self.taobaodata = response.data.taobaoAccount;
    		})
    		.catch((error) => {
    			self.loading = false;
        	});
    	},
    	movebind(type){
			var self = this;
			var url = '';
			if (type == 'taobao') {
    			url = './api/unbind_taobao_account';
    		}else{
    			url = './api/unbindWxAccount';
    		}
    		self.$http.post(url)
    		.then((response) =>{
    			if(response.data.code == 200){
    				self.bindState();
    				this.$message({
	              		title: '成功',
	              		message: response.data.data,
	              		type: 'success'
	            	});
    			}
    		})
    		.catch((error) => {
    			self.bindState();
        });
    	},
    	moveAccount(type){
    		const h = this.$createElement;
    		var nickname, title, tipEl;
    		if (type == 'taobao') {
    			nickname = this.taobaodata.taobaoUserNick;
    			title = '淘宝账号';
    			if (this.taobaodata.channelCode=='ali') {
    				tipEl = h('span', null, '解绑后，您将无法查看阿里巴巴知识产权保护平台的订单信息，您确定要解绑'+title+'： ');
    			}else{
    				tipEl = h('span', null, '您确定要解绑'+title+'： ');
    			}
    		}else{
    			nickname = this.chatdata.nickname;
    			title = '微信号';
    			tipEl = h('span', null, '您确定要解绑'+title+'： ');
    		}
    		// 解绑提示
    		this.$msgbox({
          title: '解除绑定',
          message: h('p', null, [
            tipEl,
            h('i', { style: 'color: #3db1fa;font-style: inherit;' }, nickname),
            h('span', null, ' 吗？'),
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
					cancelButtonText: '再想想'
				}).then(() => {
					this.movebind(type);
				}).catch(() => {
				})
    	}
    },
    mounted() {
    	var msg = this.$route.query.msg;
      if (msg) {
        this.$message.error(decodeURIComponent(msg));
        this.$router.replace({query: {}});
      }
    	this.bindState();
    	this.return_url = location.href;
    }
  }
</script>
<style lang="scss">
	.dialog-movebind{width:330px;}
	.moveBind{
		height:700px; padding-top: 20px;
		.navTitle{padding-left: 20px;}
		.clearfix{overflow: hidden;}
		.mt{margin-top:45px;}
		.wachat_tit{
			border-bottom:1px solid #eee;padding:20px;
			p{font-size:16px}
		}
		.add_wachat{
			width: 905px;
			height:80px;
			padding:20px 20px;
			margin-bottom: 10px;
			margin-left: 20px;
			border:1px solid #EEEEEE;
			div{
				p{
					vertical-align:middle;font-size:14px;height:40px;
					img{vertical-align:middle;margin-right: 20px;}
					span.tip{color: #999;}
				}
				.nicename{
					line-height:40px;margin-left: 20px;
					span{display: inline-block;float: left;}
					span.ni{max-width:170px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}

				}
			}
			.ope_wechat{
				>a{
					display: inline-block;margin-top: 4px;
					&:hover{text-decoration:none;}
				}
				p{
					margin-left: 30px;vertical-align:middle;font-size:14px;height:40px;line-height: 40px;
					a{text-decoration:none;cursor:pointer;}
					img,span{vertical-align:middle;line-height:22px;}
					img{margin-right: 8px;}
				}
			}
		}
		.code{
			text-align:center;padding-top:40px;padding-bottom: 60px;
			.chat_code{
				text-align:center;width:210px;height:210px;margin:0 auto;padding-top:45px;border:1px solid #ddd;box-sizing:border-box;padding:10px;
				img{vertical-align:middle;}
			}
			.chat_txt{
				margin-top:25px;font-size:14px;
				a{
					color:#f54845;
					text-decoration:none;
					cursor:pointer;
					background:url(~assets/img/reg_login/RestartIcon.png) no-repeat right;
					padding-right: 14px;
				}
			}
		}

	}
</style>
