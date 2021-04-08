<template>
	<div class="hostEnter">
    <enter-header :step="step"></enter-header>
    <!-- 第一步 -->
    <div class="enter_search mt40" v-if="step == 1" style="position: relative;">
    	<input type="text" placeholder="请输入企业名称" @focus="showSuggest=true" v-model="companyName" @keyup.enter="searchEnter" @blur="blurHandle" v-focus>
    	<el-button type="primary" class="ml10" @click="searchEnter">搜索</el-button>
    	<i class="el-icon-circle-close input_i" v-if="companyName" @click="moveName"></i>
    	<suggest :show="showSuggest" :companyName="companyName" :wordLenth="4" @search="bySuggestSearch"></suggest>
	    <historyList :recordType="recordType" @search="bySuggestSearch"></historyList>
    </div>
    <!-- 第二步 -->
    <div class="enter_setup mt20" v-if="step == 2" v-loading="loading">
	    <div class="setup_lists" v-if="centerLists.length">
				<p class="data_num mb15 ml20">搜索到{{total}}个结果</p>
				<ul>
					<!--  -->
					<li class="clearfix" :class="{'top_bor' : index > 0}" v-for="(item,index) in centerLists" @click.stop="toThird(item)">
						<!-- 左边 -->
						<div class="name fl">
							<p class="enter_name" :title="item.name">{{item.name}}</p>
							<p class="enter_person">法定代表人：<span>{{item.faren}}</span></p>
						</div>
						<!-- 中间 -->
						<div class="status fl clearfix ml20">
							<div class="clearfix mb15">
								<p class="enter_status fl">{{item.status|lawStatus}}</p>
								<p class="enter_type fl ml10" v-if="item.type == 1 || item.type == 2">{{item.type == 1 ? '我的企业' : item.type == 2 ? '竞品企业' : '--'}}</p>
							</div>
							<p class="ml25">注册时间：<span>{{item.esdate}}</span></p>
							<p class="capital">注册资本：<span>{{item.regcap || '--'}}万人民币</span></p>
						</div>
						<!-- 右01 -->
						<div class="set_up fr">
							<p class="mt40" @click.stop="ToEnterDetail(item)">查看详情</p>
						</div>
						<!-- <div class="set_up fr">
							<img src="">
							<span></span>
							<p class="mt40">查看详情</p>
						</div> -->
					</li>
				</ul>
	    	<el-pagination layout="total, prev, pager, next" :total="total" :page-size="size" :current-page.sync="page" class="sebe-pagination" @current-change="currentChange"></el-pagination>
	    </div>
	    <div class="setup_null" v-if="!centerLists.length && !loading">
	    	<img src="~assets/img/guanjia/nodata.png" alt="">
	    	<p class="mt10">未查询到相关数据</p>
	    	<button class="mt15 skip" @click="goBack">重新搜索企业名称</button>
	    </div>
    </div>
    <!-- 第三步 -->
    <div class="setup_enter" v-if="step == 3">
    	<searchTop @search="changeRoute" ref="editUser"></searchTop>
    	<searchCondition class="mt10" :showResult="true" :total="total" :keyword="filterKeyword" :isReset="isConditionReset" @search="changeRoute" ref="editUser"></searchCondition>
    	<div class="mt15" v-loading="loading">
    		<lists :resultList="tmBrandList" :enterpriseType="enterpriseType" @moveHost.user="moveHost" @addHost.user="addHost" @submit="submitFn" @goHomePage="goHomePage" @editFn="editFn"></lists>
    	</div>
	    <el-pagination v-if="tmBrandList && tmBrandList.length" layout="total, prev, pager, next" :total="total" :page-size="size" :current-page.sync="page" class="sebe-pagination" @current-change="currentChange"></el-pagination>
    </div>

    <el-dialog
		  title="操作"
		  :visible.sync="dialogCenter"
		  custom-class="center_dialog" :show-close="false" :close-on-click-modal="false">
		  <div class="radio_dialog">
		  	<span>你想将企业设置为：</span>
		  	<el-radio class="radio" v-model="centerRadio" label="1">我的企业</el-radio>
  			<el-radio class="radio" v-model="centerRadio" label="2">竞品企业</el-radio>
		  </div>
		  <div class="btn_dialog mt20">
		  	<el-button size="small" @click="cancelSet">取 消</el-button>
		    <el-button size="small" type="primary" @click="setType">确 定</el-button>
		  </div>
		</el-dialog>
		<el-dialog
		  title="温馨提示"
		  :visible.sync="dialogHostAll"
		  custom-class="center_dialog" :show-close="false" :close-on-click-modal="false">
		  您的商标托管数量不足<br>已托管<span style="font-weight:normal;color:#F64744;">{{used}}</span>个，托管上限<span style="font-weight:normal;color:#F64744;">{{usable}}</span>个
		  <div class="btn_dialog mt20">
		  	<el-button size="small" @click="dialogHostAll = false">取 消</el-button>
		    <el-button size="small" type="primary" @click="dialogHostAll = false">确 定</el-button>
		  </div>
		</el-dialog>
		<!-- <el-dialog
		  title="温馨提示"
		  :visible.sync="numHostAll"
		  custom-class="center_dialog" :show-close="false" :close-on-click-modal="false">
		  即将为您托管该企业旗下{{total}}个商标，<span style="font-weight:normal;color:#F64744;">大约需要{{timeTxt}}</span>，您可以进行其他操作，后台自动为您继续托管。
		  <div class="btn_dialog mt20">
		  	<el-button size="small" @click="numHostAll = false">取 消</el-button>
		    <el-button size="small" type="primary" @click="hostAll">确 定</el-button>
		  </div>
		</el-dialog> -->

  </div>
</template>
<script>
	import Vue from 'vue'
	import $ from 'jquery'
	//表示的是头部
  import enterHeader from './vue/headerEnter.vue'
  import historyList from './vue/historyList.vue'
  import suggest from './vue/suggest.vue'
  // 搜索头部
  import searchTop from './vue/searchTop.vue'
  import searchCondition from 'components/guanjia/searchCondition.vue'
  // 列表
  import lists from 'components/guanjia/HostAndDetailLists.vue'
	const stewardUrl = CONFIG.stewardUrl;
	const addStewardTrademarkinfo = stewardUrl + 'smallStewardTadeMark/addStewardTrademarkinfo';  //添加托管
	const firstHomePage = stewardUrl + '/smallStewardTadeMark/firstHomePage';  //置顶展示企业
	const selectCompanyInfoName = stewardUrl + 'companyInfo/selectCompanyInfoName';  //模糊查询企业名称

	import Util from 'src/common/js/util.js'
	import Filters from 'api/filters.js'
	import qs from 'qs'

	export default {
		components: {
			enterHeader,
			suggest,
			historyList,
			searchTop,
			searchCondition,
			lists
			//sebeFooter
		},
		data(){
			return{
				untrusteeship: 0,
				status: '', //第3步企业下商标状态筛选
				intCls:'',  //第3步企业下商标大类筛选
				filterKeyword: '', //第3步企业下商标筛选关键字
				isConditionReset: false, //是否需要重置
				showSuggest: false, //显示搜索建议
				recordType: 2, //1 搜索商标 2搜索企业
				enterpriseType:true,

				tmBrandList: [], //商标列表
				step: 1,
				companyName:'',//输入的企业名称
				//翻页参数
				page: 1,
        tempPage: 1,
        size: 10,
        total:0,

        dialogHostAll: false,
        dialogCenter: false,
        centerRadio: '',
        stewardUrl: stewardUrl,

        centerLists: [], //企业列表数据
        centerData: {},

        loading: false,
        applicationType: "",//企业类型
        used: 0,//已经托管
        usable: 0,//托管上限
        timeTxt: '',//托管需要的时间
        stewardSubjectId: '',

       	showCheckbox:false, //多选框
			}
		},
		methods:{
			//失去焦点 隐藏搜索建议框
			blurHandle(){
				setTimeout(() => {
					this.showSuggest = false;
				}, 300);
			},
			//批量托管，多选框显示
			editFn(){
				this.showCheckbox = true;
			},
			//回到商标管家首页
			goHomePage(){
				let info = {
					stewardSubjectId:this.stewardSubjectId ? this.stewardSubjectId : parseInt(this.$route.query.stewardSubjectId)
				}
				this.loading = true;
				this.$http.post(firstHomePage,info)
				.then((resp) => {
	      	this.loading = false;
					this.$router.push({path:`/steward/myCompany?type=${this.centerRadio}`})
				})
	      .catch((err) => {
	      	this.loading = false;
	        console.log(err);
	      });
			},
			//去企业详情页面
			ToEnterDetail(item){
				this.$router.push({path: `/steward/enterpriseDetail/${item.name}`})
				// this.$router.push({ name:'enterpriseDetail',params:item.name})
			},
			//添加托管
			addHost(item){
      	let data = {
      		trademarkKey:item.applicantOther2,
      		intCls:item.intCls + ''
      	}
      	this.loading = true;
      	this.$http.post(this.stewardUrl + '/smallStewardTadeMark/addStewardTrademarkinfo',data)
      	.then((resp) => {
      		this.loading = false;
      		console.log(resp)
      		this.queryList();
      	})
      	.catch((err) => {
      		this.loading = false;
					if(err.response.data.status == 409){
      			this.dialogHostAll = true;
						this.used = err.response.data.msg.used;
						this.usable = err.response.data.msg.usable;
					}
      	})
      },
      //取消托管
      moveHost(item){
      	let data = {
      		stewardSubjectId:this.stewardSubjectId ? this.stewardSubjectId : this.$route.query.stewardSubjectId,
      		trademarkIds:[item.id]
      	}
      	this.$http.post(this.stewardUrl + '/smallStewardTadeMark/deleteStewardTrademarkinfo',data)
      	.then((resp) => {
      		console.log(resp)
      		this.queryList();
      	})
      	.catch((err) => {

      	})
      },
      // 批量托管提交
			submitFn (list) {
				let key_ = [];
				let cls_ = [];
				console.log(list)
				list.forEach( (item) => {
					key_.push(item.key);
					cls_.push(item.intCls)
				})
				let data = {
      		trademarkKey: key_.join(','),
      		intCls: cls_.join(',')
      	}
      	this.loading = true;
      	this.$http.post(addStewardTrademarkinfo, data)
      	.then((resp) => {
      		// item.state = 1;  //局部刷新视图状态
      		this.$message({
            type: 'success',
            message: '托管成功!'
          });
          sessionStorage.removeItem('selectList');
          this.showCheckbox = false;
      		this.queryList();  //查询近似商标列表
      	})
	      .catch((err) => {
	      	this.loading = false;
					if(err.response.data.status == 409){
	      		this.dialogHostAll = true;
						this.used = err.response.data.msg.used;
						this.usable = err.response.data.msg.usable;
					}
	        console.log(err.response.data);
	      });
			},
			//直接调取一键托管
			hostAll(){
				let route = this.$route;
				this.dialogHostAll = false;
				let info = {
					applicationName:this.companyName ? this.companyName : route.query.companyName,
					applicationType:this.applicationType ? this.applicationType : parseInt(route.query.applicationType)
				}
				this.$http.post(this.stewardUrl + '/smallStewardTadeMark/oneBondAllTrademarkinfo',info)
				.then((resp) => {
					this.loading = false;
					this.queryList();
				})
	      .catch((err) => {
	      	this.loading = false;
	      	this.dialogHostAll = true;
					if(err.response.data.status == 409){
						this.used = err.response.data.msg.used;
						this.usable = err.response.data.msg.usable;
					}
	        console.log(err.response.data);
	      });
			},
			//第1步输入框清空
			moveName(){
				this.companyName = '';
			},
			//返回
			goBack(){
				this.$router.back(-1);
			},
			//取消设置
			cancelSet(){
				this.dialogCenter = false;
				this.centerRadio = '';
			},
			//设置
			setType(){
				let self = this;
				if(!this.centerRadio){
					this.$message({
	          message: `请选择“我的企业”或是“竞品企业”`,
	          type: 'warning'
	        });
	        return;
				}
				if(this.centerData.type == this.centerRadio){
					this.$message({
	          message: `请不要重复设置“${this.centerData.type == 1 ? '我的企业' : '竞品企业'}”`,
	          type: 'warning'
	        });
	        return;
				}else{
					this.loading = true;
					let applicationType;
					if(this.centerRadio == 1){
						applicationType = 1;
					}else if(this.centerRadio == 2){
						applicationType = 2
					}
					let data = {
						applicationType:applicationType,
						stewardSubjectKey:this.centerData.name
					}
					this.applicationType = applicationType;
					if(this.centerData.type){
						this.$http.post(this.stewardUrl + '/smallStewardTadeMark/shiftApplicationType',data)
						.then((resp) => {
							this.loading = false;
							self.stewardSubjectId = resp.data.data.id;
							console.log(resp)
							let data = {
								companyName:self.centerData.name,
								stewardSubjectId:self.stewardSubjectId,
								page:1,
								size:10,
								applicationType:this.applicationType
							}
							self.page = 1;
							self.$router.push({ name:'hostEnterprise',params: { step: 3}, query: data})
						})
			      .catch((err) => {
			      	self.loading = false;
			        console.log(err);
			      });
					}else{
						this.$http.post(this.stewardUrl + '/smallStewardTadeMark/addStewardSubject',data)
						.then((resp) => {
							self.loading = false;
							console.log(resp)
							self.stewardSubjectId = resp.data.data.id;
							let data = {
								companyName:self.centerData.name,
								stewardSubjectId:self.stewardSubjectId,
								page:1,
								size:10
							}
							self.page = 1;
							self.$router.push({ name:'hostEnterprise',params: { step: 3}, query: data})
						})
			      .catch((err) => {
			      	this.loading = false;
			        console.log(err);
			      });
					}
					this.centerRadio = '';
					this.dialogCenter = false;
				}
			},
			//查看详情到第3步
			toThird(item){
				this.$router.push({
					name:'hostEnterprise',
					params: {
						step: 3,
					},
					query: {
						keyword: item.name,
						companyStatus: item.status,
						filterKeyword: '',
		      	searchType:3,//查询类别1-商标名
		      	intCls: '',
		      	page: 1,
		      	size:10
					}
				})
			},
			//根据企业名称 搜索企业列表
			bySuggestSearch(name){
				this.companyName = name;
				this.searchEnter();
			},
			//根据企业名称关键字 搜索企业列表
			searchEnter(){
				if(this.companyName){
					let tempPage = (this.$route.query.page-0) || 1;
					let info = {
						companyName:this.companyName ? this.companyName : this.companyName,
						page:tempPage,
						size:10,
					}
					this.$router.push({ name:'hostEnterprise', params: {step: 2}, query: info})
				}else{
					this.$message({
	          message: '请输入您需要搜索的商标名称',
	          type: 'warning'
	        });
	        return;
				}
			},
			searchLists(){//调取查询企业接口
				let tempPage = (this.$route.query.page-0) || 1;
				let info = {
					companyName:this.companyName ? this.companyName : this.companyName,
					page:tempPage,
					size:10,
				}
				this.loading = true;
				this.$http.get(this.stewardUrl + '/companyInfo/selectVagueCompanyInfo?'+qs.stringify(info))
				.then((resp) => {
	      	this.loading = false;
					this.centerLists = resp.data.data || [];
					this.page = resp.data.page || 1;
					this.total = resp.data.total;
				})
	      .catch((err) => {
	      	this.loading = false;
	        console.log(err);
	      });
			},
			//翻页
      currentChange(currentPage){
        var route = this.$route;
        var path = route.path;
        var newQuery = $.extend({}, route.query, {page: currentPage || 1});
        this.$router.push({path: path, query: newQuery});
      },
      //第3步中，路由改变
      changeRoute(d = {}){
      	this.filterKeyword = d.filterKeyword === undefined ? this.filterKeyword : d.filterKeyword;
      	this.intCls = d.intCls === undefined ? this.intCls : d.intCls;
      	this.status = d.status === undefined ? this.status : d.status;
      	this.untrusteeship = d.untrusteeship === undefined ? this.untrusteeship : d.untrusteeship;
      	this.page = d.page || this.page;
      	this.total = 0;
      	let data = {
    			keyword: this.companyName,//企业名称,
    			companyStatus: this.$route.query.companyStatus,
    			untrusteeship: this.untrusteeship,
    			filterKeyword: this.filterKeyword,
	      	searchType: 3,//查询类别1-商标名, 2-注册号 3-申请人名称
	      	status: this.status,
	      	intCls: this.intCls,
	      	page: this.page,
	      	size: 10
    		}
    		this.$router.replace({path: this.$route.path, query: data, params: {step: 3}});
      },
      //第3步中，搜索列表
      queryList(){
				let route = this.$route;
				let self = this;
				self.loading = true;
				let info = {
    			keyword: self.companyName,//企业名称,
    			companyStatus: route.query.companyStatus,
    			untrusteeship: this.untrusteeship,
    			filterKeyword: this.filterKeyword,
	      	searchType: 3,//查询类别1-商标名, 2-注册号 3-申请人名称
	      	status: this.status,
	      	intCls: this.intCls,
	      	page: this.page,
	      	size: 10
    		}
    		if(info.filterKeyword){//旗下商标
        	self.$http.get(self.stewardUrl + '/smallStewardTadeMark/findFilterTrademark?'+qs.stringify(info))
	        .then((response) => {
	          self.loading = false;
	          // self.page = response.data.page;
	          self.tmBrandList = response.data.data;
	          let selectList = JSON.parse(sessionStorage.getItem('selectList')) || [];
	          self.tmBrandList.forEach( (item) => {
	          	item.showCheckbox = false;
	          	item.isSelect = false;
	          	if (selectList.length || self.showCheckbox) {
	      				item.showCheckbox = true;  //显示)
	      				selectList.forEach( (info) => {
	      					if (item.regNo == info.regNo && item.intCls == info.intCls) {
	      						item.isSelect = true;
	      					}
	      				})
	      			}
	          })
	          self.total = response.data.total;
	        })
	        .catch((error) => {
	        	self.loading = false;
	        	self.tmBrandList = [];
	        	let res = error.response
	        	if (res && res.data && res.data.msg) {
	        		this.$message.error(res.data.msg);
	        	}
	        });
        }else{//商标筛选
        	self.$http.get(self.stewardUrl + '/smallStewardTadeMark/findTrademark?'+qs.stringify(info))
	        .then((response) => {
	          self.loading = false;
	          // self.page = response.data.page;
	          self.tmBrandList = response.data.data;
	          let selectList = JSON.parse(sessionStorage.getItem('selectList')) || [];
	          self.tmBrandList.forEach( (item) => {
	          	item.showCheckbox = false;
	          	item.isSelect = false;
	          	if (selectList.length || self.showCheckbox) {
	      				item.showCheckbox = true;  //显示)
	      				selectList.forEach( (info) => {
	      					if (item.regNo == info.regNo && item.intCls == info.intCls) {
	      						item.isSelect = true;
	      					}
	      				})
	      			}
	          })
	          self.total = response.data.total;
	        })
	        .catch((error) => {
	          self.loading = false;
	        });
      	}
      }
		},
		mounted(){
			this.step = this.$route.params.step || 1;
			this.companyName = this.$route.query.companyName || this.$route.query.keyword;
			this.status = this.$route.params.status;
			this.intCls = this.$route.query.intCls;
			this.filterKeyword = this.$route.query.filterKeyword;
			if(this.step == 2){
				this.searchEnter();
			}else if(this.step == 3){
				this.queryList();
			}
			sessionStorage.removeItem('selectList');
		},
		watch: {
			// 如果路由有变化，会再次执行该方法
			$route(to, from) {
				this.step = this.$route.params.step || 1;
				this.companyName = this.$route.query.companyName || this.$route.query.keyword;
				if(this.step == 2){
					this.status = '';
					this.intCls = '';
					this.filterKeyword = '';
					this.searchLists();
				}else if(this.step == 3){
					this.queryList();
				}
			},
		},
		filters: {
			lawStatus:Filters.lawStatus
		},
		directives: {
			focus: {
				inserted: function (el) {
			    el.focus();
			    console.log(el.selectionStart)
			    if (el.createTextRange) {
			    	let range = el.createTextRange();        //创建一个文本选区对象。
			    	console.log(range.moveStart)
				    range.move("character",3);
			    }
			  }
			}
		}
	}
</script>

<style scoped lang="scss">
.hostEnter{min-height:800px;
	.enter_search{font-size:0;text-align:center;position: relative;
		input{width:300px;height:34px;line-height:34px;border: 1px solid #E6E6E6;border-radius: 3px;font-size: 13px;padding-left:10px;}
		button{padding:8px 20px;}
		.input_i{position: absolute;left:50%;margin-left:90px;top:10px;}
		i{display: block;font-size: 14px;margin-bottom: 15px;color: #ddd;}
		ul::-webkit-scrollbar{width:4px;background-color:#dfe2e5;}
		ul::-webkit-scrollbar-thumb{background-color:#a8afb5;}
	}
	// 第二页
	.enter_setup{text-align:center;min-height: 200px;padding-bottom: 20px;
		.setup_lists{text-align:center;
			.data_num{font-size:12px;color:#999;line-height:16px;text-align:right;padding-right: 20px;}
			ul{width:940px;border:1px solid #e6e6e6;margin:0 auto;
				.top_bor{border-top:1px solid #e6e6e6;}
				li{padding:20px 20px;cursor: pointer;
					.name{width:182px;
						.enter_name{font-size:13px;color:#333;width:182px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;text-align:left;}
						.enter_person{font-size:12px;color:#666;margin-top:18px;text-align:left;
							span{color:#333}
						}
					}
					.status{
						div{
							p{font-size:12px;padding:4px 11px;border-radius:3px;}
							.enter_status{height:20px;line-height: 18px;border-radius:20px;padding: 0 7px;border:1px solid #4272FF;color: #4272FF;}
							.enter_type{width:66px;height:20px;border-radius:20px;border:1px solid #44B74B;padding: 0;text-align: center;color:#44B74B; }
						}
						p{color:#666;font-size:12px;display:inline-block;
							span{color:#333;}
						}
						.capital{margin-left: 88px;}
					}
					.set_up{
						p{font-size:12px;color:#2db1fa;cursor: pointer;}
					}
				}
			}
		}
	}
	//第三页
	.setup_enter{padding:25px 20px 20px;text-align:center;min-height: 200px;
		.setup_tit{
			p{font-size:14px;color:#333;line-height:32px;
				span{color:#3db1fa;}
			}
			button{color:#3db1fa;border:1px solid #3db1fa;text-align:center;line-height:30px;width:80px;border-radius:3px;}
		}

	}
	.setup_null{text-align:center;padding-top:80px;
		img{width:185px;height:163px;}
		p{font-size:13px;color:#999;}
		button{width:140px;height:30px;line-height:30px;font-size:12px;color:#fff;background-color:#3DB1FA;border-radius:3px;}
		.skip{background-color:#fff;color:#3db1fa;border:1px solid #3db1fa;line-height:28px;}
		.oldto{width:100px;}
	}
}
</style>
<style lang="scss">
	.center_dialog{width:400px;top: 50% !important;margin-top:-74px;
		.el-dialog__header{text-align:left;}
		.el-dialog__body{padding: 15px 20px 20px;}
		.btn_dialog{text-align:right;
		}
		.radio_dialog{
			span{font-size:14px;color:#666;}
			.el-radio__label{color:#333;}
		}
	}
</style>
