<template>
	<div class="approximate">
	<h4><span>商标管家</span>> <span>{{ keyword }}</span>>近似商标</h4>
		<div class="mt20">
			<div class="trade-mark-head clearfix">
				<button class="return" @click.stop="goPrev">返回</button>
			</div>
		</div>
    <div class="app_enter">
    	<div class="app_end clearfix">
    		<p class="fl">为您检测到{{tmTotal}}个近似商标</p>
    	</div>
    	<searchCondition class="mt15" :showResult="false" :isReset="isConditionReset" @search="changeRoute" ref="editUser"></searchCondition>
    	<div class="mt15" v-loading="loading">
    		<lists :showSubject="true" :resultList="tmBrandList" @submit="submitFn" @editFn="editFn"></lists>
    	</div>
    </div>

		<!-- 分页 -->
		<div class="pagination-wrap" v-if="tmBrandList.length">
			<el-pagination layout="total, prev, pager, next" :total="tmTotal" :page-size="tmSize" :current-page.sync="page" class="sebe-pagination" @current-change="currentChange"></el-pagination>
		</div>


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

  </div>
</template>
<script>
	import Vue from 'vue'
	import $ from 'jquery'
  // 搜索头部
  import searchCondition from 'components/guanjia/searchCondition.vue'
  // 列表
  import lists from 'components/guanjia/HostAndDetailLists.vue'
	import Util from 'src/common/js/util.js'
	import Filters from 'api/filters.js'
	import qs from 'qs';

	const stewardUrl = CONFIG.stewardUrl;
	const approximatetwo = stewardUrl + 'smallStewardTadeMark/approximatetwo';  //查询近似商标
	const addStewardTrademarkinfo = stewardUrl + 'smallStewardTadeMark/addStewardTrademarkinfo';  //添加托管
	const deleteStewardTrademarkinfo = stewardUrl + 'smallStewardTadeMark/deleteStewardTrademarkinfo';  //取消托管

	export default {
		components: {
			searchCondition,
			lists
			//sebeFooter
		},
		data(){
				return{
					isConditionReset: false,
					tmBrandList: [],
					keyword: '',  //查询近似商标关键词
					status:'',
					intCls:'',
					untrusteeship: 0,
					approximateBol:true,//申请人和托管状态是否同时存在
					searchInput:true,//是否存在搜索栏
					searchType:true,//是否存在查询状态切换
					step:2,
					tradName:'',//商标名称
					//翻页参数
	        page: 1,
	        tmSize: 10,
	        tmTotal:0,
	        searchData: {},
	        loading: false,  //加载状态
	        showCheckbox: false,
	        dialogHostAll: false,
	        used:0,
	        usable:0
				}
		},
		methods:{
			editFn () {
				this.showCheckbox = true;
			},
			goPrev(){
				this.$router.push({path:'/steward/myCompany'})
			},
			shutDown(){
				this.$refs.editUser.getUser();//点击空白页面关闭选项框
			},
			searchListFn (info) {
        var self = this;
        var tempPage = (self.$route.query.page-0) || 1;
      	this.searchData = {
        	keyword: this.keyword,
          untrusteeship: info.untrusteeship || '',//托管状态
          status: info.status,
          intCls: info.intCls ? info.intCls.join() : '',//45大类
          page: this.page,
          size: this.tmSize
      	}
      	if (this.searchData.status == null) {
      		this.searchData.status = '';
      	}
        var route = this.$route;
        var path = route.path;
        this.$router.push({path: path, query: this.searchData});
			},
			// 批量托管
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
      		this.loading = false;
      		// item.state = 1;  //局部刷新视图状态
      		this.$message({
            type: 'success',
            message: '托管成功!'
          });
          sessionStorage.removeItem('selectList');
          this.showCheckbox = false;
      		this.getApproximatetwoFn();  //查询近似商标列表
      	})
      	.catch((err) => {
	      	this.loading = false;
					if(err.response.data.status == 409){
						this.used = err.response.data.msg.used;
						this.usable = err.response.data.msg.usable;
	      		this.dialogHostAll = true;
					}
	      });
			},
			//第3步中，路由改变
      changeRoute(d = {}){
      	this.keyword = this.$route.query.keyword || '';
      	this.intCls = d.intCls === undefined ? this.intCls : d.intCls;
      	this.status = d.status === undefined ? this.status : d.status;
      	this.untrusteeship = d.untrusteeship === undefined ? this.untrusteeship : d.untrusteeship;
      	this.page = d.page || this.page;
      	this.total = 0;
      	let data = {
    			keyword: this.keyword, //企业名称,
	      	untrusteeship: this.untrusteeship, //商标托管状态
	      	status: this.status,
	      	intCls: this.intCls,
	      	page: this.page,
	      	size: this.tmSize
    		}
    		this.$router.replace({path: this.$route.path, query: data});
      },
			// 查询近似商标
			getApproximatetwoFn () {
				this.keyword = this.$route.query.keyword || '';
				if (this.keyword == '') {
					this.tmBrandList = [];
					return
				}
				let data = {
          keyword: this.keyword,
          untrusteeship: this.untrusteeship,//商标托管状态
          status: this.status,
          intCls: this.intCls,
          page: this.page,
          size: this.tmSize
        }
        this.loading = true;
        this.$http.get(approximatetwo, {params: data})
        .then( (resp) =>{
        	this.loading = false;
        	let list = resp.data.data;
        	this.tmTotal = resp.data.total;
        	//this.page = data.page;
        	if (list.length) {
        		this.tmBrandList = list;
        		let selectList = JSON.parse(sessionStorage.getItem('selectList')) || [];
        		this.tmBrandList.forEach( (item) => {
	          	item.showCheckbox = false;
	          	item.isSelect = false;
	          	if (selectList.length || this.showCheckbox) {
	      				item.showCheckbox = true;  //显示)
	      				selectList.forEach( (info) => {
	      					if (item.regNo == info.regNo && item.intCls == info.intCls) {
	      						item.isSelect = true;
	      					}
	      				})
	      			}
	          })
        	}else{
        		this.tmBrandList = [];
        	}
        })
        .catch((err) => {
        	this.loading = false;
        	this.tmBrandList = [];
        })
			},
			//翻页
      currentChange(v){
      	let queryData = this.$route.query;
      	// queryData.page = this.page;
      	// this.$router.push({path: 'approximateTrademark', query: queryData});
      	this.$router.replace({path: 'approximateTrademark', query: Object.assign({}, this.$route.query, {page: v})});
      },
      searchTrademark(){
      	if(this.tradName.length < 5 || this.tradName.length > 10){
      		this.$message({
	          message: '注册长度限制5-10位',
	          type: 'warning'
	        });
      	}
      }
		},
		mounted(){
			this.keyword = this.$route.query.keyword || '';
			this.page = this.$route.query.page || 1;
			this.page = this.page -0;
			this.untrusteeship = this.$route.query.untrusteeship || '';
			this.status = this.$route.query.status || '';
			this.intCls = this.$route.query.intCls || '';
			if (this.page != 1) {
				return;
			}
			this.getApproximatetwoFn();  //查询近似商标列表
		},
		watch: {
			// 如果路由有变化，会再次执行该方法
			'$route': 'getApproximatetwoFn'
		},
		filters: {
		}
	}
</script>

<style lang="scss">
.approximate{
	padding-bottom: 20px;
	.app_enter{padding:20px 20px 0;position: relative;
		.app_end{
			p{font-size:12px;color:#999;line-height:16px;}
			button{color:#3db1fa;border:1px solid #3db1fa;text-align:center;line-height:30px;width:80px;border-radius:3px;}
		}
	}
	// 头部
	h4 {
		height: 40px;
		font-size: 15px;
		font-weight: normal;
		padding: 20px 0 0 20px;
		span {
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
	}
	.el-loading-spinner{top: 25%;}
}
</style>
