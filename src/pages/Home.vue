<template>
	<div>
		<sebe-header :userName="userName"></sebe-header>
		<div class="user-main">
			<div class="commWidth">
				<aside>
					<div class="nav-wrap">
						<div class="aside-nav" v-for="(item, index) in $store.state.curMenuData">
							<template v-if="item.children && item.children.length">
								<h3>{{item.title}}</h3>
								<ul class="nav-list">
									<li :class="{active: $store.state.activeIndex===(index+':'+idx)}" v-for="(it, idx) in item.children" @click="pathTo(it, index, idx)"><a href="javascript:;" v-html="it.title"></a></li>
								</ul>
							</template>
							<template v-else>
								<ul class="nav-list">
									<li :class="{active: $store.state.activeIndex===(index+':0')}" @click="pathTo(item, index, 0)"><a href="javascript:;" v-html="item.title"></a></li>
								</ul>
							</template>
						</div>
					</div>
				</aside>
				<section class="content-container">
					<div class="grid-content bg-purple-light">
						<transition>
							<!--statisticData 用于首页的统计数据 -->
							<router-view :statisticData = "statisticData"></router-view>
						</transition>
					</div>
				</section>
			</div>
		</div>
		<!-- 有未上传材料的提示 24小时只提醒一次 -->
		<el-dialog title="提示" :visible.sync="noUploadVisible" class="common_dialog no_upload_dialog" :close-on-click-modal="false" :append-to-body="true" top="50%" @close="closeUploadD">
			<div class="no_upload_in">
				<p>您还有未上传申请材料的订单，请及时上传。收到材料后我们将会第一时间为您申报！</p>
				<button class="btn btn-primary" @click="toUpload">立即前往</button>
			</div>
		</el-dialog>

		<customer-service :cartNum="cartNum"></customer-service>
		<sebe-footer></sebe-footer>
	</div>
</template>

<script>
	import sebeHeader from 'components/Header.vue'
	import sebeFooter from 'components/Footer.vue'
	import customerService from 'components/CustomerService.vue'
	import $ from 'jquery'
	export default {
		components: {
			sebeHeader,
			customerService,
			sebeFooter
		},
		data() {
			return {
				noUploadVisible: false,
				tradeArr: [],
				filter_save_arr: [],
				checkedArr: [],
				cartNum:"",
				userName:'',
				statisticData:{
					member:{}
				},
			}
		},
		methods: {
			closeUploadD(){
				this.$cookie.set("uploadVisible", "false", { expires: '1D' });
			},
			toUpload(noUploadVisible){
				this.noUploadVisible = false;
				// default expire time: 1 day
				this.$cookie.set("uploadVisible", "false", { expires: '1D' });
				this.$router.push('/serviceList');
			},
			pathTo(item, index, idx){
				this.$store.commit('UPDATE_MENU_INDEX', index+':'+idx);
				this.$router.push(item.path);
			},
			//统计订单状态对应数量
			statistic(){
				var self = this;
				self.$http.post('./api/statistics')
				.then((response) => {
					var data = response.data;
					if (data.code === '0') {
						self.statisticData = data;
						self.statisticData.member.phone = self.statisticData.member.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');
						if ((data['0']+'') !== '0') {
							$('#noPayNum').html('(<b>'+data['0']+'</b>)')
						} else {
							$('#noPayNum').html('');
						}

						if (data.workOrder && data.workOrder !== '0') {
							$('#noConfirm').html('(<b>'+data.workOrder+'</b>)')
						} else {
							$('#noConfirm').html('');
						}

						if (data.toBeUpload && data.toBeUpload !== '0') {
							self.noUploadVisible = self.$cookie.get("uploadVisible") !== "false";
							$('#toBeUpload').html('(<b>'+data.toBeUpload+'</b>)')
						} else {
							$('#toBeUpload').html('');
						}
					}
				})
				.catch((error) => {
					//var data = error.response.data;
				});
			},

			getTradeMarkCount () {
				var self = this;
				self.$http.post('./api/queryTradeMarkCount')
				.then((response) => {
					 var data = response.data.data;
						var notrustCount = data.notrustCount;
						if ( notrustCount != 0 ) {
							$('#tradeMarkNum').html('(<b>'+notrustCount+'</b>)');
						} else {
							$('#tradeMarkNum').html('')
						}

				})
				.catch((error) => {
					//var data = error.response.data;
				});

			},

			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
					_this.$router.push('/login');
				}).catch(() => {

				});
			},
			// 检查是否有未上传资料--自助注册
			checkNonUpload(){
				this.$http.get('./api/checkNonUploadMaterial')
				.then((resp) => {
					var data = resp.data;
					this.noUploadVisible = data.state == 1
				})
				.catch((error) => {
					//var data = error.response.data;
				});
			},
			init(){
				this.statistic();
				this.checkNonUpload();
				this.getTradeMarkCount();
			},
			setScrollTop(scroll_top) {
				document.documentElement.scrollTop = scroll_top;
				document.body.scrollTop = scroll_top;
			}
		},
		mounted() {
			this.init();
			this.cartNum = this.$cookie.get("cart_num") || '0';
		},
		watch: {
			$route(){
				this.setScrollTop(0);
			},
		}
	}

</script>

<style lang="scss">
	.user-main{
		background: #f5f5f5;
		padding: 20px 0;
		width: 100%;
		height: 100%;
		position:relative;
		clear: both;
		min-height: 700px;
		min-width: 1200px;
		aside{
			position: absolute;
			left: 0px;
			top: 0;
			width: 200px;
			height: 100%;
			min-height: 700px;
			background-color: #fff;
			.nav-wrap{
				position: absolute;width: 100%;top: -20px;left: 0;bottom: -20px;background-color: #fff;padding-top: 10px;
				.aside-nav{
					h3{font-size: 14px;font-weight: normal;height: 40px;line-height: 40px;color: #999;padding-left: 30px;}
					.nav-list{
						li{
							font-size:14px;
							height: 40px;
							line-height:40px;padding-left: 30px;
							a{
								color: #666;
								b{color: #3db1fa;font-weight:normal;}
							}
							a:hover{text-decoration: none;}
						}
						li.active{background-color: #3DB1FA!important;
							a{color: #fff;}
						}
						li:hover{background-color: #EEF9FF;cursor: pointer;}
					}
					h3+.nav-list{
						li{padding-left: 50px;}
					}
				}
			}
		}
		.content-container{
			background-color: #fff;
			min-height: 800px;
			margin-top:0;
			margin-left: 220px;
		}
	}
	.no_upload_dialog{
		.el-dialog{width: 390px;height: 188px;
			.no_upload_in{
				text-align: right;
				p{color:#333;padding-top: 10px;line-height: 28px;text-align: left;}
				button{width: 115px;height: 36px;margin-top: 10px;}
			}
		}
	}
</style>
