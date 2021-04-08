<template>
	<div class="hostEnterGj" v-loading="loading">

    <enter-header :step="step" :trademark="trademark"></enter-header>

    <!-- 第一步 -->
    <div class="enter_search mt40" v-if="step == 1">
    	<input type="text" placeholder="请输入商标名称" v-model="tradName" @focus="showSuggest=true" @blur="blurHandle" @keyup.enter="search" v-focus>
    	<el-button type="primary" class="ml10" @click="search()">搜索</el-button>
    	<i class="el-icon-circle-close input_i" v-if="tradName" @click="tradName = ''"></i>

			<!-- 商标搜索目前仅做按商标名搜索 -->
    	<!-- <suggest :show="showSuggest" :enterName="tradName" :wordLenth="4" @search="searchName"></suggest> -->

    	<historyList :recordType="recordType" @search="searchName"></historyList>
    </div>

    <!-- 第二步 -->
    <div class="setup_enter" v-if="step == 2">
    	<searchCondition :showResult="true" :total="total" :keyword="tradName" :isReset="isConditionReset" @search="changeRoute" ref="editUser"></searchCondition>

    	<lists class="mt10" :showSubject="showSubject" :resultList="tmBrandList" :moveBtn="moveBtn" :isSubmitSuccess="isSubmitSuccess" @search.user="search" @submit="submitFn" @addHost.user="addHost" @editFn="editFn"></lists>

    	<div class="pagination-wrap" v-if="tmBrandList.length">
				<el-pagination layout="total, prev, pager, next" :total="total" :page-size="size" :current-page.sync="page" class="sebe-pagination" @current-change="currentChange"></el-pagination>
				<!-- <button>完成</button> -->
			</div>
    </div>


		<el-dialog
		  title="温馨提示"
		  :visible.sync="dialogHostAll"
		  custom-class="center_dialog" :show-close="false" :close-on-click-modal="false">
		  您的商标托管数量不足<br>已托管<span style="font-weight:normal;color:#F64744;">{{used}}</span>个，托管上限<span style="font-weight:normal;color:#F64744;">{{usable}}</span>个
		  <div class="btn_dialog mt20">
		  	<!-- <el-button @click="dialogHostAll = false">取 消</el-button> -->
		    <el-button size="small" type="primary" @click="dialogHostAll = false">确 定</el-button>
		  </div>
		</el-dialog>

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
  import searchCondition from 'components/guanjia/searchCondition.vue'
  // 列表
  import lists from 'components/guanjia/HostAndDetailLists.vue'

	const stewardUrl = CONFIG.stewardUrl;
	const addStewardTrademarkinfo = stewardUrl + 'smallStewardTadeMark/addStewardTrademarkinfo';  //添加托管
	const selectCompanyInfoName = stewardUrl + 'companyInfo/selectCompanyInfoName';  //模糊查询企业名称

	import Util from 'src/common/js/util.js'
	import Filters from 'api/filters.js'
	import qs from 'qs'

	export default {
		components: {
			enterHeader,
			suggest,
			historyList,
			searchCondition,
			lists
			//sebeFooter
		},
		data(){
			return{
				isConditionReset: false, //重置所有筛选条件
				showSuggest: false, //显示搜索建议
				recordType: 1,
				loading:false,

				dialogHostAll:false,
        used:0,
        usable:0,

				stewardUrl:stewardUrl,
				tmBrandList: [],
				trademark:true,//显示几步状态
				showSubject:true,//是否显示商标主体
				searchTypeFm:true,//是否存在查询状态切换
				step:1,
				tradName:'',//商标名称

				//翻页参数
				page: 1,
        tempPage: 1,
        size: 10,
        total:100,

        searchData:{},
        oldListData:[],
        oldState:false,
        moveBtn:true,//是否是商标托管列表
        searchType:1,
       	showCheckbox:false,
       	isSubmitSuccess: false,  //是否提交成功
			}
		},
		methods:{
			blurHandle(){
				setTimeout(() => {
					this.showSuggest = false;
				}, 300);
			},
			editFn(){
				this.showCheckbox = true;
			},
			shutDown(){
				let step = this.$route.params.step;
				if(step == 2){
					this.$refs.editUser.getUser();//点击空白页面关闭选项框
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
    			this.showCheckbox = false;
      		sessionStorage.removeItem('selectList');
      		this.queryList();  //查询近似商标列表
      		this.isSubmitSuccess = true;
      	})
	      .catch((err) => {
	      	this.loading = false;
					if(err.response.data.status == 409){
						this.isSubmitSuccess = false;
	      		this.dialogHostAll = true;
						this.used = err.response.data.msg.used;
						this.usable = err.response.data.msg.usable;
					}
	        console.log(err.response.data);
	      });
			},
			searchName(name){
				this.tradName = name;
				this.oldState = false;
				this.search();
				console.log(name)
			},
			again(){
				this.$router.push({ name:'addHost',params: { step: 1}})
			},
			//翻页
      currentChange(currentPage){
        var route = this.$route;
        var path = route.path;
        var newQuery = $.extend({}, route.query, {page: currentPage || 1});
        this.$router.replace({path: path, query: newQuery});
      },
      //查询订单列表
      search(info){//info从组件获取
        let self = this;
        let v = self.tradName;
		    /*if (v.length > 4 && /\d{4,}/.test(v.slice(1))) { //6个字及以上，且第2位开始都是数字
    			self.searchType = 2;
    		} else if(v.length > 4 && /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/.test(v)) { //5个字及以上，且包含中文
    			self.searchType = 3;
    		} else{
    			self.searchType = 1;
    		};*/

        if(!v){
        	self.$message({
	          message: '请输入您需要搜索的商标名称',
	          type: 'warning'
	        });
	        return;
        }
        let data = {
    			keyword: this.tradName,//商标名称,
	      	searchType: 1,//查询类别1-商标名, 2-注册号 3-申请人名称
	      	status: this.status,
	      	intCls: this.intCls,
	      	page: this.page,
	      	size: 10
    		}
        self.$router.push({ name:'addHost',params: { step: 2}, query: data});
        self.step = 2;
      },
      //路由改变
      changeRoute(d = {}){
      	this.intCls = d.intCls === undefined ? this.intCls : d.intCls;
      	this.status = d.status === undefined ? this.status : d.status;
      	this.untrusteeship = d.untrusteeship === undefined ? this.untrusteeship : d.untrusteeship;
      	this.page = d.page || this.page;
      	this.total = 0;
      	let data = {
    			keyword: this.tradName,//商标名称,
	      	searchType: 1,//查询类别1-商标名, 2-注册号 3-申请人名称
	      	status: this.status,
	      	intCls: this.intCls,
	      	untrusteeship: this.untrusteeship,
	      	page: this.page,
	      	size: 10
    		}
    		this.step = 2;
    		this.$router.replace({path: this.$route.path, query: data, params: {step: 2}});
      },
      queryList(){
				let route = this.$route;
				let path = route.path;
				let self = this;
    		if(!route.query.keyword){
    			this.$router.replace({ name:'addHost',params: { step: 1}, query: this.searchData})
    			this.step = 1;
    			return;
    		}
        self.loading = true;
    		let info = route.query;
    		info.isCompany = 0;  //记录搜索记录
      	self.$http.get(this.stewardUrl + '/smallStewardTadeMark/findTrademark?'+qs.stringify(info))
        .then((response) => {
          self.loading = false;
          // this.page = response.data.page;
          self.tmBrandList = response.data.data;
          let selectList = JSON.parse(sessionStorage.getItem('selectList')) || [];
          self.tmBrandList.forEach( (item) => {
          	item.showCheckbox = false;
          	item.isSelect = false;
          	if (selectList.length || this.showCheckbox) {
      				item.showCheckbox = true;  //显示
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
      },
      addHost(item){//添加托管
      	let data = {
      		trademarkKey:item.applicantOther2,
      		intCls:item.intCls + ''
      	}
      	let self = this;
      	self.loading = true;
      	self.$http.post(self.stewardUrl + '/smallStewardTadeMark/addStewardTrademarkinfo',data)
      	.then((resp) => {
          self.loading = false;
      		if(resp.data.status == 201){ //既不是我的也不是竞品企业
      			self.addHost(item);
      		}else{
      			self.queryList();
      		}

      	})
      	.catch((err) => {
      		self.loading = false;
					if(err.response.data.status == 409){
						self.used = err.response.data.msg.used;
						self.usable = err.response.data.msg.usable;
	      		self.dialogHostAll = true;
					}
      	})
      }
		},
		mounted(){
			this.step = this.$route.params.step;
			this.tradName = this.$route.query.keyword;
			if(this.step == 2){
				this.search();
			}
			sessionStorage.removeItem('selectList');
		},
		watch: {
			// 如果路由有变化，会再次执行该方法
			$route(to, from) {
				this.step = this.$route.params.step;
				if(this.step == 2){
					console.log('第2步')
					this.queryList();
				}
			}
		},
		filters: {
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

<style lang="scss">
.hostEnterGj{min-height:500px;
	.pagination-wrap{position: relative;
			// button{position: absolute;top:0;right:0;background-color:#3db1fa;border-radius:3px;color:#fff;font-size:12px;width:80px;height:30px;}
		}
	.enter_search{font-size:0;text-align:center;position: relative;
		input{width:300px;height:34px;line-height:34px;border: 1px solid #E6E6E6;border-radius: 3px;font-size: 13px;padding-left:10px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;box-sizing:border-box;padding-right: 20px;}
		button{padding:8px 20px;}
		.input_i{position: absolute;left:50%;margin-left:90px;top:10px;cursor: pointer;}
		i{display: block;font-size: 14px;margin-bottom: 15px;color: #ddd;}
		ul::-webkit-scrollbar{width:4px;background-color:#dfe2e5;}
		ul::-webkit-scrollbar-thumb{background-color:#a8afb5}
	}
	// 第二页
	.setup_enter{padding:0 20px 20px;
		.search_condition{margin-top: 5px;}
		.setup_end{
			p{font-size:12px;color:#999;line-height:16px;}
			button{color:#3db1fa;border:1px solid #3db1fa;text-align:center;line-height:30px;width:80px;border-radius:3px;}
		}

	}
	.setup_null{text-align:center;padding-top:80px;
		img{width:274px;height:196px;}
		p{font-size:13px;color:#999;}
		button{width:140px;height:30px;line-height:30px;font-size:12px;color:#fff;background-color:#3DB1FA;border-radius:3px;}
		.skip{background-color:#fff;color:#3db1fa;border:1px solid #3db1fa;width:86px;}
		.oldto{width:100px;}
	}
}
</style>

