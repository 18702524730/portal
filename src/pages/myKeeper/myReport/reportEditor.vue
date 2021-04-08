<template>
	<div id="reportEditor">
		<div class="addressdetail">
			<div class="addressTitle">
						<p class="addressTxt">拾贝管家</p>
						<p class="addressHref"><router-link :to="'/myReport?status='+status+'&page=1'">我的报告&nbsp;</router-link>>申请{{reportdata.type | typename}}</p>
			 </div>
		<div v-if="!errorResult" class="orderAddAddress" v-loading="loading">
			<el-form :model="reportdata" :rules="rules" ref="ruleForm" :inline="true" auto-complete="off" label-width="110px">
				<el-form-item class="addAddress" label="企业名称：" prop="companyName">
						<el-input v-model="reportdata.companyName" placeholder="请填写企业名称" ></el-input>
				</el-form-item>
				<el-form-item class="addAddress" label="申请人姓名：" prop="contactName">
						<el-input v-model="reportdata.contactName" placeholder="请填写申请人姓名" ></el-input>
				</el-form-item>
				<el-form-item class="addAddress" label="申请人号码：" prop="contactPhone">
						<el-input v-model="reportdata.contactPhone" placeholder="请填写联申请人号码" ></el-input>
				</el-form-item>
				<el-form-item class="addAddress memo" label="备注信息：" prop="memo" style="width:80%">
						<el-input type="textarea" v-model="reportdata.memo" placeholder="请填写备注信息" ></el-input>
				</el-form-item>
				<div class="prompt">
					<p>提示：</p>
					<p v-if="reportdata.type==1">1、请填写企业的相关信息，建议填写组织机构代码、所要重点分析的商标，专利或版权的名称。</p>
					<p v-if="reportdata.type==2">1、请描述您想监测的品牌的相关信息，如品牌名称、品牌系列、价格范围、电商平台类型及销售产地等信息。</p>
					<p v-if="reportdata.type==3">1、请描述您想监测的品牌的相关信息，如品牌名称、品牌系列、价格范围、电商平台类型及销售产地等信息。</p>
					<p>2、备注信息将作为报告的参考，我们的专员将与您再次核对。</p>
				</div>
				<el-form-item class="addAddress btn-report" style="width:53%">
						<el-button type="primary" @click="applyBg('ruleForm')">提交</el-button>
					</el-form-item>
			 </el-form>
		 </div>
		 <div v-if="errorResult" class="noResult">
					<img src="~assets/img/order/noorder_bg.png">
					<p>系统繁忙，<br>请点击<a href="" @click.prevent="refresh">刷新</a>或稍后再试。</p>
		</div>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import $ from 'jquery'
	const indexUrl = CONFIG.indexUrl;
	import Util from 'src/common/js/util.js'
	import Filters from 'api/filters.js'
	import qs from 'qs'

	export default {
		data(){
			let checkPhone = (rule, value, callback) => {
					let reg = /^1\d{10}$/;
					if (!value) {
						return callback(new Error('请填写申请人手机号'));
					}
					setTimeout(() => {
						if (!reg.test(value)) {
							callback(new Error('手机号格式错误'));
						} else {
							callback();
						}
					}, 200);
				};
				return{
					status:'',//报告状态
					userName:'',//cookie用户名
					phone:'',//cookie手机号
					errorResult: false,//错误页面
					loading:true,
					reportdata:{},
					rules:{
						companyName:[
							{ min: 1, max: 30, message: '企业名称不超过30个字', trigger: 'blur' }
						],
						contactName:[
							{ required: true, message: '请填写申请人姓名', trigger: 'blur' },
							{ min: 1, max: 20, message: '申请人姓名不超过20个字', trigger: 'blur' }
						],
						memo:[
							{ required: true, message: '请填写备注信息', trigger: 'blur' },
							{ type: "string",min: 1, max: 500, message: '备注信息不超过500个字', trigger: 'blur' }
						],
						contactPhone: [
							{ type: "string",validator:checkPhone, required: true,trigger: 'blur' }
						]
					}
				 }
		},
		methods:{
			search(){
				var self = this;
				self.loading = true;
				self.errorResult = false;
				self.$http.post('./api/findReportDetails', qs.stringify({
					reportId: this.$route.params.report_id
				}))
				.then((response) => {
					self.loading = false;
					self.reportdata = response.data;
					self.reportdata.contactName = self.userName;
					self.reportdata.contactPhone = self.phone;
				})
				.catch((error) => {
					self.loading = false;
					self.errorResult = true;
					self.$message.warning('网络繁忙，请稍后再试');
				});
			},
			//申请报告
			applyBg(formName){
				var self = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
							self.$http.post('./api/applyReport', qs.stringify({
								id:self.reportdata.id,
								contactName:self.reportdata.contactName,
								contactPhone:self.reportdata.contactPhone,
								companyName:self.reportdata.companyName,
								memo:self.reportdata.memo
							}))
							.then((response) => {
								if(response.data.state==2){
									this.$message({
										title: '成功',
										message: '报告申请成功，服务专员将尽快与您联系',
										type: 'success'
									});
									self.$router.go(-1);
								}
							})
							.catch((error) => {
								 this.$message({
										title: '申请失败',
										message: '网络繁忙，请稍后再试',
										type: 'warning'
									});
							});
					} else {
						return false;
					}
				})
			}
		},
		mounted(){
			this.search();
			this.userName = this.$cookie.get('truename');
			this.phone = this.$cookie.get('phone');
			this.status = this.$route.query.status || '0';//报告种类，默认值
		},
		watch: {
			// 如果路由有变化，会再次执行该方法
			'$route': 'search'
		},
		filters: {
			dateFormat: Filters.formatDate.dateFormat,
			 //我的报告状态显示
			typename (val) {
				var name = ''
					switch (val+''){
						case '1':
							name = "企业知识产权分析报告";
							break;
						case '2':
							name = "近似商标监测报告";
							break;
						case '3':
							name = "电商监测及销售报告";
							break;
					}
					return name;
			}
		}
	}
</script>

<style lang="scss">
#reportEditor{
	.orderAddAddress label{line-height: 20px;}
	.orderAddAddress{height: 534px;width: 945px;background: #fff;position: relative;top: 0px;padding-left: 84px;padding-top: 25px}
	.addressdetail{width: 945px;height: 620px;background: #fff;float: right;position: relative;}
	.addressTitle{padding: 20px 20px 0;border-bottom: 1px solid #e6e6e6;box-sizing: border-box;}
	.addressTxt{font-size: 16px;line-height: 100%;color: #333}
	.addressHref{font-size: 14px;line-height: 100%;color: #666;margin-top: 19px;margin-bottom: 15px}
	.addressHref a{color: #63bdfb;text-decoration: none;}
	.memo{height:200px;
		div{height:200px;}
	}
	.btn-report{margin-left:110px;margin-top:20px;}
	.addAddress{
			input{width:300px;}
			textarea{width:500px;height:200px;resize: none;}
	}
	.prompt{
		margin-left:110px;width:500px;padding-right:40px;
		p{color:#999;}
	}
	.noResult{
			padding:100px 0;
			img{margin-left:210px;float:left;}
			a{color: #3db1fa;}
			p{float:left;font-size:24px; color: #666;width: 310px;margin-left:90px;line-height: 40px;padding:15px 0;}
			.shopping{float:left;width: 120px;margin-left:90px;margin-top:5px;height: 40px;line-height: 38px;background-color: #f64744;font-size:18px;border-radius: 5px;color: #fff;text-align: center;}
			.shopping:hover{text-decoration:none;}
		}
}
</style>
