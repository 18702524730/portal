<template>
	<div>
		<sebe-header :userName="userName"></sebe-header>

		<div class="report_page" v-loading="loading">
			<div class="r_head">
				<p class="info">拾贝管家为您快速解析，大数据分析助力品牌起航</p>
			</div>
			<div class="r_content">
				<div class="clearfix">
					<div class="tm_info_box ">
						<p class="title">商标信息</p>
						<div class="tm_img">
							<img :src="tmImg" class="tm_img" alt="">
						</div>
						<div class="tm_info clearfix">
							<div class="text_line ">
			        	<span class="key">商标名称：</span>
			        	<span class="value" :title="trademarkName">{{ trademarkName }}</span>
			        </div>
			        <div class="text_line ">
			        	<span class="key">申请类别：</span>
			        	<span class="value">{{ intCls }}类-{{ intClsData[intCls-1].goodsname }}</span>
			        </div>
			        <div class="text_line ">
			        	<span class="key">申请人：</span>
			        	<span class="value" :title="$route.query.applicantCn">{{ $route.query.applicantCn }}</span>
			        </div>
			      </div>
			    </div>
			    <div class="pie_box" >
			    	<div id="myChart" class="myChart"></div>
			    	<p class="title">已注册“{{ trademarkName }}”商标总数为{{ reportData.tadeMarkTotals}}个</p>
			    	<div class="num_box" v-if="reportData.stateStatistics">
			    		<p class="num">{{ reportData.stateStatistics['待审中'] }}</p>
			    		<p class="num">{{ reportData.stateStatistics['已初审'] }}</p>
			    		<p class="num">{{ reportData.stateStatistics['已驳回'] }}</p>
			    		<p class="num">{{ reportData.stateStatistics['已注册'] }}</p>
			    		<p class="num">{{ reportData.stateStatistics['已销亡'] }}</p>
			    	</div>
			    </div>
				</div>
				<!-- 未注册类别 -->
				<div class="type_wrap">
					<p class="title">未注册类别<span class="b_link">{{ reportData.unIntCls ? reportData.unIntCls.length : 0 }}个</span></p>
					<div class="item_box" :class="{'max_height': unIntCls}">
						<span class="item" v-for="item in reportData.unIntCls">{{ item }}类-{{ intClsData[item-1].goodsname }}</span>
					</div>
					<p class="ckeck_all" v-if="!unIntCls && reportData.unIntCls && reportData.unIntCls.length>12"><span class="b_link" @click="checkAllFn('unIntCls')">展开全部</span></p>
					<p class="ckeck_all" v-if="unIntCls"><span class="b_link" @click="checkAllFn('unIntCls')">收起全部</span></p>
				</div>
				<!-- 已注册类别 -->
				<div class="type_wrap clearfix">
					<p class="title">已注册类别<span class="b_link">{{ reportData.intCls ? reportData.intCls.length : 0 }}个</span></p>
					<div class="item_box" :class="{'max_height': showIntCls}">
						<span class="item" v-for="item in reportData.intCls">{{ item }}类-{{ intClsData[item-1].goodsname }}</span>
					</div>
					<p class="ckeck_all" v-if="!showIntCls && reportData.intCls && reportData.intCls.length>12"><span class="b_link" @click="checkAllFn('showIntCls')">展开全部</span></p>
					<p class="ckeck_all" v-if="showIntCls"><span class="b_link" @click="checkAllFn('showIntCls')">收起全部</span></p>
				</div>
				<!-- 已注册申请人 -->
				<div class="type_wrap clearfix">
					<p class="title">已注册"{{ trademarkName }}"商标的申请人<span class="b_link">{{ reportData.companyNumber }}个</span></p>
					<div class="item_box" :class="{'max_height': showCompanyList}">
						<span class="item item_half" v-for="item in reportData.companyList">{{ item }}</span>
					</div>
					<p class="ckeck_all" v-if="!showCompanyList && reportData.companyList && reportData.companyList.length>4 && reportData.companyNumber<=200"><span class="b_link" @click="checkAllFn('showCompanyList')">展开全部</span></p>
					<p class="ckeck_all" v-if="!showCompanyList && reportData.companyList && reportData.companyList.length>4 && reportData.companyNumber>200"><span class="b_link" @click="checkAllFn('showCompanyList')">展开前200条</span></p>
					<p class="ckeck_all" v-if="showCompanyList"><span class="b_link" @click="checkAllFn('showCompanyList')">收起全部</span></p>
				</div>
				<div class="download_bxo" v-if="!scrollPage">
					<button class="btn_blue" @click="downloadFn">下载商标注册查询报告 </button>
				</div>
			</div>
		</div>

		<div class="fixed_bottom" v-if="scrollPage">
			<div class="download_bxo">
				<button class="btn_blue" @click="downloadFn">下载商标注册查询报告 </button>
			</div>
		</div>

	</div>



</template>
<script>
	import Vue from 'vue'
	import Util from '../../../../common/js/util.js'
	import Filters from 'api/filters.js'
	import sebeHeader from '../../../../components/Header';
	import intClsData from '../../../../common/js/intClsData.js'

	const stewardUrl = CONFIG.stewardUrl;
	const makeTadeMarkReport = stewardUrl + '/smallStewardTadeMark/makeTadeMarkReport';   //生成专业分析报告
	const downloadReport = stewardUrl + '/smallStewardTadeMark/downTadeMarkReport';   //下载报告

	export default {
		components: {
			sebeHeader
		},
		data(){
			return{
				userName: '',
				scrollPage: false,
				trademarkName:'',
				tmId: '',
				intCls: 1,
				tmImg: '',
				reportData: {},
				intClsData: intClsData.cateIdData,  //所有分类信息
				unIntCls: false,
				showIntCls: false,
				showCompanyList: false,
				loading: false,
			}
		},
		methods:{
			// 下载报告
			downloadFn () {
				let params = {
					trademarkName: this.trademarkName,
					trademarkId: this.tmId
				}
				location.href = downloadReport + '?trademarkName=' + encodeURI(this.trademarkName) + '&trademarkId=' + this.tmId;
			},
			checkAllFn (type) {
				this[type] = !this[type];
			},
			getReportFn () {
				let params = {
					trademarkName: this.trademarkName,
					intCls: this.intCls,
				}
				this.loading = true;
				this.$http.get(makeTadeMarkReport, {params: params})
				.then( (resp) => {
					this.loading = false;
					this.reportData = resp.data;
					this.drawPieFn(this.reportData.stateStatistics);  //绘制宾图
				})
			},
			drawPieFn (list){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'));
        let options = {
        	title: { text: '' },
          tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
		        orient: 'vertical',
		        right: 'right',
		        align: 'left',
		        top: '40',
		        right: '50',
		        data: ['待审中','已初审','已驳回', '已注册', '已销亡'],
		        itemWidth: 10,
		        itemHeight: 10,
			    },
			    color: ['#FFD55C', '#FFB747', '#75D998', '#4294FF', '#FF7C7C'],
          series: [
		        {
	            name: '商标数量',
	            type: 'pie',
	            radius : '60%',
	            center: ['40%', '60%'],
	            label: {
                normal: {
                  show: true,
                  formatter: '{d}%',
                  fontSize: '12'
                }
	            },
	            data:[
                {value:335, name:'待审中'},
                {value:310, name:'已初审'},
                {value:234, name:'已驳回'},
                {value:135, name:'已注册'},
                {value:135, name:'已销亡'}
	            ]
		        }
			    ]
        }
        options.series[0].data.forEach( (item) => {
          item.value = list[item.name];
        })
        // 绘制图表
        myChart.setOption(options);
	    },
		},
		mounted(){
			let self = this;

			let searchObj = Util.urlToObj(location.href);
			self.trademarkName = decodeURIComponent(searchObj.trademarkName) || '图形';
			self.tmId =  searchObj.tmId;
			self.intCls = parseInt(searchObj.intCls) || '';
			self.tmImg = decodeURIComponent(searchObj.tmImg) || ''
			self.getReportFn();  //查询报告

			let hei_ = document.documentElement.clientHeight;
			window.addEventListener('scroll', function(){
				let top_ = document.documentElement.scrollTop || document.body.scrollTop;
				if (top_>0) {
					self.scrollPage = true;
				}
				else{
					self.scrollPage = false;
				}
			})

		},
		watch: {
			// 如果路由有变化，会再次执行该方法
			'$route': 'search'
		}
	}
</script>

<style scoped lang="scss">
	.report_page {
		width: 1200px; margin:20px auto;
		.r_head {
			width:100%; height:160px; background:url(../../../../assets/img/guanjia/report/head.png) no-repeat;  padding-top:90px;
			.info {width:100%; text-align:center; font-size:16px; color:#fff;}
		}
		.r_content {
			height:auto; background:#fff; padding: 50px 90px; margin-bottom:90px;
			.b_link {color: #3DB1FA !important; font-size:13px;};
			.tm_info_box {
				width:495px; height:200px; float:left; box-sizing:border-box; padding:30px; border: 1px solid #eee;
				.title { width:100%;  float:left; text-align:left; color:#666; font-size:14px; margin-bottom:10px;}
				.tm_img {width:100px; height:100px; float:left; background: #D8D8D8; display:inline-block; margin:0 15px 0 0;}
				.tm_info {
					width: 300px; float:left; padding-top:10px;
					.text_line {
						font-size:13px; margin-bottom: 10px; width:270px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; float:left; margin-bottom:10px;
						.key {color:#666}
						.value {color:#333;}
					}
				}
			}
			.pie_box {
				border: 1px solid #eee; border-left:none; width:495px; height:200px; box-sizing:border-box; float:left; position:relative;
				.myChart {width:495px; height:170px;}
				.title {font-size:12px; color:#666; width:100; text-align:center;}
				.num_box {
					position:absolute; right:-5px; top:42px; width:50px; height:80px;
					.num {width:100%; float:left; height:22px;}
				}
			}
			.type_wrap {
				width:100%; padding-bottom: 15px; border-bottom: 1px dashed #E6E6E6; margin-top:30px;
				.title {font-size:14px; color:#666; margin-bottom:15px; height:20px; width:100%;}
				.item_box {
					display:flex; justify-content:flex-start; flex-wrap:wrap; width:1010px; max-height: 90px; overflow:hidden;
					.item { width:148px; height:30px; display:inline-block; line-height:30px; border-radius:30px; background: #F5F5F5; color:#666; font-size:14px; text-align:center; margin:0 20px 15px 0; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;}
					.item_half {width: 484px;}
				}
				.max_height {max-height: 5000px;}
				.ckeck_all {
					width:100%; text-align:center;
					.b_link {cursor:pointer;}
				}
			}
			.download_bxo {
				width:100%; margin-top:40px; text-align:center;
				.btn_blue {width:300px; height:44px; line-height:44px; font-size:16px;}
			}
		}
	}
	.fixed_bottom {
		width:100%; height: 84px; line-height:84px; background:#fff; text-align:center; position:fixed; left:0; bottom:0; box-shadow: 0 -4px 10px 0 rgba(0,0,0,0.03);
		.btn_blue {width:300px; height:44px; line-height:44px; font-size:16px;}
	}
</style>
