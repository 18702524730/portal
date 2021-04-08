<template>
	<div>
	<header>
		<!-- 吊顶 -->
		<top-bar :cartNum="cartNum" :name="userName"></top-bar>
		<!-- logo 主导航 -->
		<div class="attachment" :class="{'attachment_animation':topIndex}">
			<div class="header commWidth clearfix">
				<h1 class="logo fl">
					<!-- 回个人中心首页 -->
					<router-link class="sebelogo" to="/main"><img src="~assets/img/header_footer/my_sebe.png" alt="拾贝" width="120" height="28" /></router-link>
				</h1>
				<!-- 主菜单导航 -->
				<ul class="navBar fr">
					<li :class="{ 'cur': curIndex === index }" @click="pathTo(item, index)" v-for="(item, index) in NavData" :key="index"><span>{{item.title}}</span></li>
				</ul>
				<div class="cut_attachment" @click="serviceClick">
					<p>切换商家中心</p>
				</div>
			</div>
		</div>
	</header>
	<!-- 入驻状态 -->
	<el-dialog
	  title=""
	  :visible.sync="tipsShow"
	  width="30%"
	  center>
	  <span>{{ content }}</span>
	  <span slot="footer" class="dialog-footer">
	    <el-button type="primary" @click="confirmFn" >{{ btnText }}</el-button>
	  </span>
	</el-dialog>
	</div>
</template>

<script>
	import TopBar from 'components/headerFComponents/TopBar.vue';
	import VueCookie from 'vue-cookie';
	const indexUrl = CONFIG.indexUrl;
	const rootUrl = CONFIG.rootUrl;
	const spUrl = CONFIG.spUrl;
	//import {indexUrl} from 'src/config'
	const NavData = [
		{
			title: '首页',
			path: '/main',
			children: [
				{
					title:'概况',
					path:'/main'
				},
				{
					title:'已购买的服务',
					path:'/orders'
				},
				{
					title:'查看服务进度',
					children: [
						{
							title:'商标服务',
							path:'/serviceList'
						},
						{
							title:'专利服务',
							path:'/otherService/5'
						},
						{
							title:'版权服务',
							path:'/otherService/10'
						},
						{
							title:'政府项目',
							path:'/otherService/15'
						},
						{
							title:'维权诉讼',
							path:'/otherService/20'
						},
						/*{
							title:'商标交易',
							path:'/otherService/38'
						},*/
						{
							title:'企业服务',
							path:'/otherService/26'
						},
					],
				},
				{
					title:'评价管理',
					path:'/appraiseList'
				},
				{
					title:'我的存证',
					path:'/myczlist'
				},
				{
					title:'保护投诉',
					path:'/mycomplaint'
				},
			]
		},
		{
			title: '账户信息',
			path: '/basicData',
			children: [
				{
					title:'基本信息',
					path:'/basicData'
				},
				{
					title:'主体信息',
					path:'/subjectList'
				},
				{
					title:'收件地址',
					path:'/addressList'
				},
				{
					title:'开票信息',
					path:'/invoiceList'
				},
				{
					title:'修改密码',
					path:'/modifyPwd'
				},
				{
					title:'账户绑定',
					path:'/removeBind'
				},
			]
		}
	]
	export default {
		props:['cartNum', 'userName'],
		components: {
			TopBar
		},
		data() {
			return {
				curIndex: 0,
				NavData: NavData,
				indexUrl: indexUrl,
				spUrl: spUrl,
				topIndex:false,
				tipsShow: false,  // 入驻状态弹窗
				content: '',  //弹窗内容
				btnText: '',  //按钮内容
				enterStatus: 1,  //1.未入驻 2.正在审核
			}
		},
		methods: {
			// 切换商家服务中心
			serviceClick(){
				this.topIndex = true;
				let phone = VueCookie.get('phone');
				if (location.host.indexOf('localhost') === 0) {
					location.href = 'http://localhost:9002/#/index/general';
				}
				else{
					location.href = decodeURIComponent(this.spUrl + '/#/index/general');
				}
				// this.$http.get(`${rootUrl}/api/member/phone/${phone}/exists`)
				// .then( (resp) => {
				// 	let data = resp.data;
				// 	// 已经成功入驻，直接跳转商家中心首页
				// 	if (data.spExists && data.applyExist) {
				// 		console.log('跳转商家中心首页')
				// 		this.enterStatus = 3;
				// 		setTimeout(()=>{
				// 			this.topIndex = false;
				// 			if (location.host.indexOf('localhost') === 0) {
				// 				location.href = 'http://localhost:9002/#/index/general?isBusinessUser=true';
				// 			}
				// 			else{
				// 				location.href = decodeURIComponent(this.spUrl + '/#/index/general') + '?isBusinessUser=true';
				// 			}
				// 		},600);
				// 		return
				// 	}
				// 	if (data.applyExist && !data.spExists) {
				// 		console.log('您提交的商家入驻申请正在审核中，请耐心等待。')
				// 		this.enterStatus = 2;
				// 		this.tipsShow = true;
				// 		this.content = '您提交的商家入驻申请正在审核中，请耐心等待。如有疑问请咨询平台客服电话：0571-28253721。';
				// 		this.btnText = '确定';
				// 		return
				// 	}
				// 	if (!data.applyExist && !data.spExists) {
				// 		console.log('您还未入驻成为拾贝商家！')
				// 		this.enterStatus = 1;
				// 		this.tipsShow = true;
				// 		this.content = '您还未入驻成为拾贝商家！';
				// 		this.btnText = '申请入驻';
				// 		return
				// 	}
				// })
			},
			// 弹窗确认
			confirmFn () {
				// 待审核
				if (this.enterStatus == 2) {
					this.tipsShow = false;
				}
				else if (this.enterStatus == 1){  //还未加入
					if (location.host.indexOf('localhost') === 0) {
						location.href = 'http://localhost:9002/sebe/pages/facilitator.html#/';
					}
					else{
						location.href = decodeURIComponent(this.indexUrl + '/sebe/pages/facilitator.html#/');
					}
				}
			},
			//匹配路由，高亮左侧导航菜单
			matchRoute(){
				let route = this.$route;
				let path = route.path;
				let len = NavData.length;
				let activeIndex = '0:0';
				let temp = false;
				for (let i = 0; i <= len - 1; i++) {
					let item = NavData[i];
					if (
						item.children.some((it, idx) => {
							if (path.indexOf(it.path)!=-1) {
								activeIndex = idx+':0';
								return true;
							}
							if (it.children && it.children.length) {
								return it.children.some((q, index) => {
									if (path.indexOf(q.path)!=-1) {
										activeIndex = idx+':'+index;
										return true;
									}
								})
							}
						})
					) {
						temp = true;
						this.curIndex = i;
						this.$store.dispatch('updateMenu', NavData[i].children);
						break;
					}
				}
				if (!temp) {
					this.curIndex = 0;
					this.$store.dispatch('updateMenu', NavData[0].children);
				}
				this.$store.commit('UPDATE_MENU_INDEX', activeIndex);
			},
			pathTo(item, index) {
				this.$router.push(item.path || item.children[0].path);
			}
		},
		mounted(){
			this.matchRoute();
		},
		watch: {
			'$route': 'matchRoute',
		}
	}
</script>

<style lang="scss">
header{
	text-align: left;box-shadow:0px 1px 4px 0px rgba(221,221,221,0.5);position: relative;z-index: 1999;height:102px;background-color: #fff;
	.attachment{position: absolute;width: 100%;background-color: #fff;}
	.attachment_animation{animation: myfirst 0.6s ease-out;}
	@keyframes myfirst{
		0%   {top: 36px;} //36px 为顶通的高度 强耦合
		60%  {top: 56px;}
		100% {top: 36px;}
	}
	.header{
		height: 66px;position: relative;z-index: 100;
		.logo{width: 200px;height: 66px;padding-top: 19px;}
		.navBar{
			float: left; padding-left:40px;
			li{
				float: left; margin-right: 50px;
				span{font-size:16px;display: inline-block;height:66px;line-height: 64px;border-bottom:2px solid #fff;cursor: pointer;}
			}
			li.cur{
				span{color: #3DB1FA;border-color:#3DB1FA;}
			}
		}
	}
	.cut_attachment{
		width:34px;height:139px;background-color:#10AEFF;background-image:linear-gradient(135deg,#10AEFF,#4DA0FF);position: absolute;top:81px;left:-54px;text-align:center;cursor: pointer;
		p{font-size:14px;line-height:16px;color:#fff;width:14px;padding:20px 10px;position: relative;}
		p:after{position: absolute;bottom:-3px;left:0;content:'';background-color:transparent;width:0;height:0;border-right:17px solid transparent;border-left:17px solid transparent;border-bottom:10px solid #f5f5f5;}
	}
	.cut_attachment:before{width:1px;height:15px;background-color:#3db1fa;position: absolute;content:'';top:-15px;right:17px;}
	.cut_attachment:after{position: absolute;content:'';top:10px;right:14px;width:6px;height:6px;border-radius:100%;background-color:#fff;}
}
</style>
