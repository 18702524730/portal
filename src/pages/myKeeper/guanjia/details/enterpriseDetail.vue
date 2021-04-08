<template>
	<div class="enterDetail">
		<h4><router-link :to="{path:'/steward/myCompany?type=1'}">商标管家</router-link> &gt; <span>{{companyName}}</span>--企业详情</h4>
		<div class="mt20">
			<div class="trade-mark-head clearfix">
				<button class="return" @click="goPrev">返回</button>
				<!-- <button class="all_host fr mr25" @click="allHost">一键托管</button> -->
			</div>
		</div>
		<!-- 头部详情 -->
		<div class="enter_detail clearfix">
			<p class="enter_name">{{companyName}}</p>
			<p class="enter_info mt15">企业信息</p>
			<template v-if="enterDetails">
				<div class="info_lists clearfix mt10">
					<p class="lists_l fl"><label>企业法人：</label>{{enterDetails.frname}}</p>
					<p class="lists_m fl"><label>登记状态：</label>{{enterDetails.entstatus}}</p>
					<p class="lists_r fl"><label>所属行业：</label>{{enterDetails.industryphyname}}</p>
				</div>
				<div class="info_lists clearfix mt10">
					<p class="lists_l fl"><label>企业类型：</label><span>{{enterDetails.enttype}}</span></p>
					<p class="lists_m fl"><label>联系电话：</label>{{enterDetails.tel}}</p>
					<p class="lists_r fl"><label>联系地址：</label><span style="width: 240px;">{{enterDetails.dom}}</span></p>
				</div>
				<div class="info_lists clearfix mt10">
					<p class="lists_l fl"><label>成立日期：</label>{{enterDetails.esdate}}</p>
					<p class="lists_m fl"><label>注册资本：</label><span>{{enterDetails.regcap || '--'}}万人民币</span></p>
					<p class="lists_r fl"><label>实缴资本：</label><span>{{enterDetails.regcap || '--'}}万人民币</span></p>
				</div>
				<div class="info_lists clearfix mt10" v-if="allDetail">
					<p class="lists_l fl"><label>组织机构代码：</label>{{enterDetails.regno}}</p>
					<p class="lists_num fl"><label>统一社会信用代码：</label>{{enterDetails.creditcode}}</p>
				</div>
				<p class="enter_info mt15" v-if="allDetail">经营范围</p>
				<div class="info_txts mt10" v-if="allDetail">{{enterDetails.opscope}} </div>
				<p class="all_info fr mt10" @click="allDetail = !allDetail">{{allDetail ? '收起全部' : '展开全部'}}</p>
			</template>
			<div v-else class="detail_null mt10">
				暂无企业信息
			</div>
		</div>
		<!-- 列表部分 -->
    <div class="setup_enter">
    	<div class="setup_tit clearfix">
    		<p class="fl">旗下商标<span>{{total}}</span></p>
    	</div>
    	<searchBox @search="changeRoute" @reset="resetCondition" :keyword="$route.query.filterKeyword" ref="editUser" @keywordChange="keywordChange"></searchBox>
    	<searchCondition class="mt15" :isReset="isConditionReset" @search="changeRoute" ref="editUser"></searchCondition>
    	<div class="mt15" v-loading="loading">
	    	<lists :batchBol="batchBol" :resultList="tmBrandList" @submit="submitFn"></lists>
	    </div>
    	<div class="pagination-wrap" v-if="tmBrandList.length">
				<el-pagination layout="total, prev, pager, next" :total="total" :page-size="size" :current-page.sync="page" class="sebe-pagination" @current-change="currentChange"></el-pagination>
			</div>
    </div>
    <!-- <div class="setup_null" v-if="!loading && !tmBrandList.length">
    	<img src="~assets/img/order/noorder_bg.png" alt="">
    	<div>
    		<p class="mt10">该企业旗下暂无商标</p>
    	</div>
    </div> -->
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
		  	<el-button size="small" @click="dialogCenter = false">取 消</el-button>
		    <el-button size="small" type="primary" @click="dialogCenter = false">确 定</el-button>
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
		<el-dialog
		  title="温馨提示"
		  :visible.sync="numHostAll"
		  custom-class="center_dialog" :show-close="false" :close-on-click-modal="false">
		  即将为您托管该企业旗下{{total}}个商标，<span style="font-weight:normal;color:#F64744;">大约需要{{timeTxt}}</span>，您可以进行其他操作，后台自动为您继续托管。
		  <div class="btn_dialog mt20">
		  	<el-button size="small" @click="numHostAll = false">取 消</el-button>
		    <el-button size="small" type="primary" @click="hostAll">确 定</el-button>
		  </div>
		</el-dialog>
  </div>
</template>
<script>
	import Vue from 'vue'
	import $ from 'jquery'
  import searchBox from 'components/guanjia/searchBox.vue'
  import searchCondition from 'components/guanjia/searchCondition.vue'
  // 列表
  import lists from 'components/guanjia/HostAndDetailLists.vue'
	const stewardUrl = CONFIG.stewardUrl;
	const addStewardTrademarkinfo = stewardUrl + 'smallStewardTadeMark/addStewardTrademarkinfo';  //添加托管
	import Util from 'src/common/js/util.js'
	import Filters from 'api/filters.js'
	import qs from 'qs'

	export default {
		components: {
			searchBox,
			searchCondition,
			lists
			//sebeFooter
		},
		data(){
			return{
				isConditionReset: false,
				batchBol:true,//是否显示批量托管
				loading:false,
				stewardUrl:stewardUrl,
				tmBrandList: [],
				trademark:true,//显示几步状态
				step:2,
				tradName:'',//商标名称
				//翻页参数
				total: 1,
				size: 10,
				page: 1,
				filterKeyword: '',
				intCls: '',
				status: '',
				untrusteeship: 0,

        allDetail:false,//是否展开详情
        dialogCenter:false,
        centerRadio:'',
        // 企业详情展示
        companyName:'',
        stewardSubjectId:'',
        enterDetails:{},//企业信息
        searchData:{
        	filterKeyword:'',
        	untrusteeship:'',
        	intCls:''
        },//商标请求数据
        searchInfo:'',//组件传值
        applicationType:'',
        dialogHostAll:false,
        numHostAll:false,
        timeTxt:0,
        used:0,
        usable:0
			}
		},
		methods:{
			keywordChange(v){
				this.filterKeyword = v;
			},
			resetCondition(){
				this.isConditionReset = false;
				setTimeout(() => {
					this.filterKeyword = '';
					this.isConditionReset = true;
				}, 100);
			},
			goPrev () {
				history.back(-1);
			},
			hostAll(){//直接调取一键托管
				let route = this.$route;
				this.numHostAll = false;
				this.dialogHostAll = false;
				this.loading = true;
				let info = {
					applicationName:this.companyName,
					applicationType:this.applicationType
				}
				this.$http.post(this.stewardUrl + '/smallStewardTadeMark/oneBondAllTrademarkinfo',info)
				.then((resp) => {
					this.loading = false;
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
			allHost(){
				let route = this.$route;
				let info = {
					applicationName:this.companyName,
					applicationType:this.applicationType
				}
				if(this.total > 200){
					if(this.total < 60){
						this.timeTxt =  Math.ceil(this.total/100) + '秒';
					}else{
						this.timeTxt =  Math.ceil(this.total/100/60) + '分钟';
					}
					this.numHostAll = true;
				}else{
					let info = {
						applicationName:this.companyName,
						applicationType:this.applicationType
					}
					this.$http.post(this.stewardUrl + '/smallStewardTadeMark/oneBondAllTrademarkinfo',info)
					.then((resp) => {
						this.loading = false;
						this.search();
					})
		      .catch((err) => {
		      	this.loading = false;
						if(err.response.data.status == 409){
							this.used = err.response.data.msg.used;
							this.usable = err.response.data.msg.usable;
		      		this.dialogHostAll = true;
						}
		        console.log(err.response.data);
		      });
				}
			},
			submitFn (list) {// 批量托管
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
      	this.$http.post(addStewardTrademarkinfo, data)
      	.then((resp) => {
      		// item.state = 1;  //局部刷新视图状态
      		this.$message({
            type: 'success',
            message: '托管成功!'
          });
      		this.queryList();
      	})
      	.catch((err) => {
      		this.loading = false;
					if(err.response.data.status == 409){
						this.used = err.response.data.msg.used;
						this.usable = err.response.data.msg.usable;
	      		this.dialogHostAll = true;
					}
      	})
			},
			//翻页
      currentChange(){
        var route = this.$route;
        var path = route.path;
        var newQuery = $.extend({}, route.query, {page: this.page});
        console.log(this.page)
        this.$router.push({path: path, query: newQuery});
      },
      //路由改变
      changeRoute(d = {}){
      	this.filterKeyword = d.filterKeyword === undefined ? this.filterKeyword : d.filterKeyword;
      	this.intCls = d.intCls === undefined ? this.intCls : d.intCls;
      	this.status = d.status === undefined ? this.status : d.status;
      	this.untrusteeship = d.untrusteeship === undefined ? this.untrusteeship : d.untrusteeship;
      	this.page = d.page || this.page;
      	let data = {
    			keyword: this.companyName,//企业名称,
    			filterKeyword: this.filterKeyword,
    			untrusteeship: this.untrusteeship,
	      	searchType: 1,//查询类别1-商标名, 2-注册号 3-申请人名称
	      	status: this.status,
	      	intCls: this.intCls,
	      	page: this.page,
	      	size: 10
    		}
    		this.$router.replace({path: this.$route.path, query: data});
      },
      queryList(){
				let route = this.$route;
				let self = this;
				self.loading = true;
				let info = {
    			keyword:self.companyName,//企业名称
	      	searchType: 3,//查询类别1-商标名
	      	status: this.status,
	      	intCls: this.intCls,
	      	untrusteeship: this.untrusteeship,
	      	page: this.page,
	      	size:10
    		}
    		if(this.filterKeyword){//旗下商标
    			info.searchType = 1;
    			info.filterKeyword = this.filterKeyword
        	self.$http.get(this.stewardUrl + '/smallStewardTadeMark/findFilterTrademark?'+qs.stringify(info))
	        .then((response) => {
	          self.loading = false;
	          // this.page = response.data.page;
	          self.tmBrandList = response.data.data;
	          let selectList = JSON.parse(sessionStorage.getItem('selectList')) || [];
	          self.tmBrandList.forEach( (item) => {
	          	item.showCheckbox = false;
	          	item.isSelect = false;
	          	if (selectList.length) {
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
	          this.total = 0;
	        });
        }else{//商标筛选
        	self.$http.get(this.stewardUrl + '/smallStewardTadeMark/findTrademark?'+qs.stringify(info))
	        .then((response) => {
	          self.loading = false;
	          // this.page = response.data.page;
	          self.tmBrandList = response.data.data;
	          let selectList = JSON.parse(sessionStorage.getItem('selectList')) || [];
	          self.tmBrandList.forEach( (item) => {
	          	item.showCheckbox = false;
	          	item.isSelect = false;
	          	if (selectList.length) {
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
	          this.total = 0;
	        });
      	}
      },
		},
		mounted(){
			this.companyName = this.$route.params.companyName;
			this.filterKeyword = this.$route.query.filterKeyword;
			this.status = this.$route.query.status;
			this.page = this.$route.query.page ? this.$route.query.page -0 : 1;
			this.intCls = this.$route.query.intCls;
			this.$http.get(this.stewardUrl + '/companyInfo/selectCompanyDetails?companyName=' + encodeURI(this.companyName))
			.then((resp) => {
      	console.log(resp)
      	this.enterDetails = resp.data.data;
      	this.stewardSubjectId = resp.data.stewardSubjectId;
      	this.applicationType = resp.data.applicationType;
      })
      .catch((err) => {
        console.log(err);
      });
      this.queryList();
			sessionStorage.removeItem('selectList');
		},
		watch: {
			// 如果路由有变化，会再次执行该方法
			$route(to, from) {
				this.queryList();
			}
		},
		filters: {
		}
	}
</script>
<style scoped lang="scss">
.enterDetail{background: #fff;	// 第二页
	.setup_enter{padding:0px 20px 20px;
		.pagination-wrap{position: relative;
			button{position: absolute;top:0;right:0;background-color:#3db1fa;border-radius:3px;color:#fff;font-size:12px;width:80px;height:30px;}
		}
		.setup_tit{
			p{font-size:14px;color:#333;line-height:32px;
				span{color:#3db1fa;}
			}
			button{color:#3db1fa;border:1px solid #3db1fa;text-align:center;line-height:30px;width:80px;border-radius:3px;}
		}
	}
	.enter_detail{width:940px;padding:20px;background-color:#f8f8f8;margin:10px auto 20px;
		.all_info{color:#3db1fa;font-size:12px;line-height:16px;cursor: pointer;}
		.enter_name{font-size:14px;color:#333;line-height:20px;}
		.enter_info{font-size:12px;line-height:16px;color:#333;}
		.info_lists{
			p{font-size:12px;color:#333;line-height:16px;
				label{vertical-align: top;color: #999;}
				span{display:inline-block;}
			}
		}
		.lists_num{width:510px;}
		.lists_l{width:250px;margin-right: 70px;
			span{width:190px;vertical-align: top;}
		}
		.lists_m{width:200px;margin-right: 70px;
			span{width:140px;vertical-align: top;}
		}
		.lists_r{
			span{width:170px;vertical-align: top;}
		}
		.info_txts{width:865px;font-size:12px;color:#666;line-height:16px;}
		.detail_null{font-size:12px;color:#666;line-height:16px;}
	}
	// 头部
	h4 {
		height: 40px;
		font-size: 15px;
		font-weight: normal;
		padding: 20px 0 0 20px;
		a {
			color: #3db1fa;
		}
	}
	.trade-mark-head {
		clear:  both;
		padding-left: 20px;
		button {
			float: left;
			width: 55px;
			height: 22px;
			line-height: 0;
			font-size: 14px;
			text-align: left;
			color: #666;
			border: 0;
			outline: 0;
			padding-left: 19px;
			background: url(~assets/img/trustee/back_btn.png) no-repeat left center;
			background-size: 16px 16px;
			&:hover {
				background-image: url(~assets/img/trustee/back_btn_h.png);
				color: #3db1fa;
			}
		}
		.all_host{background-color:#3db1fa;width:80px;height:30px;line-height:30px;color:#fff;border-radius:3px;font-size:12px;}
	}
}
</style>
<style lang="scss">
	.setup_enter{
		.el-loading-spinner{top: 25%;}
	}
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
