<template>
	<div class="myCompany_page">
		<h4>商标管家</h4>
		<div class="tm_num">
			<span class="num text">可托管商标数量: <span class="red" v-if="statisticsData.trademark">{{ statisticsData.trademark.depositeTotal || 0 }}</span></span>
			<span class="line">|</span>
			<span class="num text">已托管商标数量: <span class="red" v-if="statisticsData.trademark">{{ statisticsData.trademark.trademarkNum || 0 }}</span></span>
		</div>
		<div class="orderStatus">
			<ul>
				<li :class="{active: companyType==1}" @click="toggle(1)">我的企业<span v-if="myStatisticsData.mySubject">({{myStatisticsData.mySubject}})</span></li>
				<li :class="{active: companyType==2}" @click="toggle(2)">竞品企业<span v-if="myStatisticsData.otherSubject">({{myStatisticsData.otherSubject}})</span></li>
			</ul>
		</div>

		<!-- 还没有任何商标页面  -->
		<div class="empaty_tm clearfix" v-if="!companyList.length && !dialogLoading && !allCompanyVisible" >
			<p class="title-f">还未{{companyType==1 ? '托管' : '监测'}}任何企业和商标</p>
			<button class="trustShipBtn" @click="goToTrustShipFn">{{companyType==1 ? '添加托管' : '添加监测'}}</button>
			<div class="text_box">
				<p class="title-s">为什么要托管商标？</p>
				<p class="content-f"><span class='icon_black'></span>权威数据，快速托管</p>
				<p class="text-f">对接权威数据库为您提取精确的商标数据，并及时提供完整的检索信息，快速托管。</p>
				<p class="content-f"><span class='icon_black'></span>灵活匹配，集中管理</p>
				<p class="text-f">多维度数据查询，自由搭配托管数据，自身及竞争对手的数据尽在掌握。</p>
				<p class="content-f"><span class='icon_black'></span>风险预警，及时获取</p>
				<p class="text-f">第一时间获得风险预警信息，短信、邮件等多种渠道触达。</p>
			</div>
			<div class="page_img" @mouseenter="checkIcon=true" @mouseleave="checkIcon=false">
				<div class="hover_bg" v-show="checkIcon" @click="showBigImg=true; bodyHidden(true)">
					<img class="check" src="~assets/img/guanjia/icon/search_white.png" alt="">
					<p class="text">查看大图</p>
				</div>
			</div>
		</div>
		<!-- 大图 -->
		<transition name="fade">
			<div class="big_box" @click="showBigImg=false; bodyHidden(false)" v-show="showBigImg==true">
				<div class="big_img">
					<img class="" src="~assets/img/guanjia/company/big_img.png" alt="">
					<i class="el-icon-close close"></i>
				</div>
			</div>
		</transition>

		<template v-if="companyList.length || allCompanyVisible" v-loading="loading">
		<div class="message_lab" v-if="stasticMsg.length">
			您托管的商标
			<span v-for="item in stasticMsg">
				<span v-if="item.newsType==1" @click="goNewsListFn(1, 0)"  >有<span class="orange">{{ item.statistics }}</span>个商标有法律状态更新</span>
				<span v-if="item.newsType==2 && companyType==1" @click="goNewsListFn(2, 0)" >有<span class="orange">{{ item.statistics }}</span>条风险预警</span>
				<span v-if="item.newsType==3 && companyType==2" @click="goNewsListFn(3, 0)" >有<span class="orange">{{ item.statistics }}</span>条重要情报</span>
				<span v-if="item.newsType==4" @click="goNewsListFn(4, 0)" >有<span class="orange">{{ item.statistics }}</span>条近似商标的更新</span>
				<span v-if="item.newsType==5" @click="goNewsListFn(5, 0)" >有<span class="orange">{{ item.statistics }}</span>条新消息</span>
			</span>
		</div>
		<div class="tm_num">
			<p class="text">当前企业商标总数<span class="red">{{ selectCompany.trademarkNumber || 0 }}</span>个  |  已托管<span class="red">{{ selectCompany.depositeNumber }}</span>个<template v-if="companyType==1">（其中核心商标<span class="red">{{ coreTmList.length }}</span>个）</template>  |  未托管<span class="red">{{ (selectCompany.trademarkNumber-selectCompany.depositeNumber)>=0 ? (selectCompany.trademarkNumber-selectCompany.depositeNumber) : 0 }}</span>个</p>
		</div>
		<!-- 企业列表 -->
		<div class="company_lsit clearfix">
			<div class="company_item " v-for="(item, index) in companyList" v-if="index < 3" :class="{'active': item.isSelect}" @click="selectCompanyFn(item)">
				<p class="com_name" :title="item.applicationName">{{ item.applicationName }}</p>
				<p class="detail"><a class="b_link" @click.prevent="goCompanyDetailFn(item.applicationName)">查看详情</a></p>
				<i class="delete" @click.stop="deleteCompanyFn(item)" ></i>
			</div>
			<div class="add_company" @click="addPageFn"></div>
		</div>
		<div class="check_all" v-if="companyListLength>3">
			<span class="b_link" @click="allCompanyVisible=true">查看全部</span>
		</div>

		<!-- 全部企业 -->
		<el-dialog :title="companyType==1 ? '我的企业' : '竞品企业'" :visible.sync="allCompanyVisible" top="50%" custom-class="company_dialog" :lock-scroll="false" :close-on-click-modal="false">
			<div class="search_box search_wrap clearfix">
				<div class="search_line">
					<span class="s_icon"></span>
					<input class="input_text" v-model="companyContent" @keyup.enter="searchCompanyFn(true)" @ placeholder="搜索托管中的企业"></input>
					<i class="el-dialog__close el-icon el-icon-close clear" v-if="companyContent != ''" @click="companyContent = ''"></i>
				</div>
				<button class="btn_item btn_blue" @click="searchCompanyFn(true)">搜索</button>
				<button class="btn_item btn_blue_o_m" @click="reseatCompanyListFn">重置</button>
				<span class="total">共托管了<span class="b_link">{{ companyListLength }}家</span>{{ companyType==1 ? '我的企业' : '竞品企业'}}</span>
			</div>
			<div class="dialog_cotent" v-loading="dialogLoading">
				<div class="com_list clearfix" v-if="companyList.length">
					<div class="com_item" v-for="(item, index) in companyList" :class="{'active': item.id==selectCompanyId}" @click="selectCompanyListFn(item)">
						<p class="title">{{ item.applicationName }}</p>
						<p class="num">企业商标<span class="orange">{{ item.trademarkNumber }}</span>个，已托管<span class="orange">{{ item.depositeNumber }}</span>个</p>
						<p class="owner"><a href="" class="b_link" @click.prevent="goCompanyDetailFn(item.applicationName)">查看详情</a></p>
						<span class="top" v-if="index < 3">顶</span>
						<i class="delete" @click="deleteCompanyFn(item)" ></i>
					</div>
				</div>
				<div class="empty_data" v-if="!companyList.length">
					<img src="~assets/img/order/noorder_bg.png" alt="">
	    		<p class="mt10">您尚未托管该企业</p>
				</div>
			</div>
		  <div slot="footer" class="dialog-footer">
		    <el-button size="small" @click="allCompanyVisible = false">取 消</el-button>
		    <el-button size="small" type="primary" @click="setIndexFn">确 定</el-button>
		  </div>
		</el-dialog>

		<!-- 添加企业或商标 -->
		<el-dialog
		  title="操作"
		  :visible.sync="addVisible"
		  size="tiny"
		  custom-class="add_dialog">
		  <span class="select">请选择:</span>
		  <el-radio class="radio" v-model="addRadio" label="1">添加企业</el-radio>
		  <el-radio class="radio" v-model="addRadio" label="2">添加商标</el-radio>
		  <span slot="footer" class="dialog-footer">
		    <el-button size="small" @click="addVisible = false">取 消</el-button>
		    <el-button size="small" type="primary" @click="addPageFn()">确 定</el-button>
		  </span>
		</el-dialog>

		<div class="type_name" v-show="companyType==1">
			<p class="text">核心商标({{ coreTmList.length || 0 }}/5)</p>
		</div>
		<!-- 核心商标为空 -->
		<div class="empaty_list" v-show="companyType==1 && !coreTmList.length && tmResultList.length">
			<p class="title">你尚未设置企业的核心商标</p>
			<button class="btn_blue_o" @click="goToSetCoreFn">去设置核心商标</button>
		</div>
		<!-- 核心商标列表 -->
		<div class="core_list clearfix" v-if="companyType==1 && coreTmList.length > 0">
			<div class="core_item" v-for="(item, index) in coreTmList" :class="{'active': selectCoreId==item.id}" @click="selectCoreFn(item)"> <img :src="item.tmImg" alt=""> </div>
			<div class="add_core_item" @click="addCoreJump" v-if="coreTmList.length < 5"></div>
		</div>
		<!-- 核心商标详情 -->
		<div class="core_detail clearfix" v-if="companyType==1 && coreTmList.length > 0">
			<div class="tm_info_box clearfix">
				<div class="tm_img">
					<router-link :to="'/tradeDetail?trademarkId='+coreDetail.id" class="b_link" target="_blank">
						<img :src="coreDetail.tmImg" alt="">
						<span class="core">核心商标</span>
					</router-link>
				</div>
				<div class="tm_info clearfix">
					<div class="text_line " style="cursor:pointer;">
						<router-link :to="'/tradeDetail?trademarkId='+coreDetail.id" class="b_link" target="_blank">
		        	<span class="key">商标名称：</span>
		        	<span class="value" :title="coreDetail.tmName">{{ coreDetail.tmName || '图形' }}</span>
		        	<span class="tag">{{ coreDetail.currentStatus }}</span>
	        	</router-link>
	        </div>
	        <div class="text_line ">
	        	<span class="key">申请时间：</span>
	        	<span class="value">{{ coreDetail.appDate }}</span>
	        </div>
	        <div class="text_line ">
	        	<span class="key">注册号：</span>
	        	<span class="value">{{ coreDetail.regNo }}</span>
	        </div>
	        <div class="text_line ">
	        	<span class="key">注册时间：</span>
	        	<span class="value">{{ coreDetail.regDate }}</span>
	        </div>
	        <div class="text_line ">
	        	<span class="key">商标类别：</span>
	        	<span class="value">{{ coreDetail.intCls }}类-{{ coreDetail.intCls ? intClsData[coreDetail.intCls-1].goodsname : '' }}</span>
	        </div>
	        <div class="text_line" style="width:270px;">
	        	<span class="key">最新进度：</span>
	        	<span class="value" :title="coreDetail.currentFlow">{{ coreDetail.currentFlow }}</span>
	        </div>
				</div>
        <div class="link_box">
        	<router-link :to="'/tradeDetail?trademarkId='+coreDetail.id" class="b_link" target="_blank">查看商标详情</router-link>
        	<el-popover placement="top" width="170" trigger="click" popper-class="user-popover">
            <p class="tip_p">{{`确定将"${coreDetail.tmName || '图形'}"从核心商标中移除？`}}</p>
            <div class="btn_out">
              <button class="btn cancel-btn" @click="removeTmFn(coreDetail)">确定</button><button class="btn confirm-btn" @click="hidePop">暂不</button>
            </div>
            <a class="b_link r" href="javascript:;" slot="reference">移除该商标</a>
          </el-popover>
        	<!-- <span class="b_link r" @click="removeTmFn(coreDetail)">移除该商标</span> -->
        </div>
			</div>
			<div class="detail_info clearfix" v-show="coreDetail.report">
				<p class="title">已注册“{{ coreDetail.tmName }}”商标的法律状态分布图</p>
				<div class="pie_box" id="myChart" ></div>
				<div class="num_info" v-if="coreDetail.report">
					<p class="line">已注册“{{ coreDetail.tmName }}”商标的企业<span class="red">{{ coreDetail.report.companyNumber }}个</span></p>
					<p class="line">已注册类别<span class="red">{{ coreDetail.report.registered }}个</span></p>
					<p class="line">未注册类别<span class="red">{{ coreDetail.report.unregistered }}个</span></p>
					<button class="btn_blue" @click="goReportPage">查看报告详情</button>
				</div>
				<div class="news_tag">
					<span class="item" v-if="coreDetail.approximateNumber"  @click="goSimilarFn(coreDetail)" >检测到{{ coreDetail.approximateNumber }}个近似商标</span>
					<span class="item" v-if="coreDetail.law" @click="goNewsListFn(1)" >检测到法律状态更新</span>
					<span class="item" v-if="coreDetail.risk" @click="goNewsListFn(2)">检测到有风险预警</span>
					<span class="item" v-if="coreDetail.intelligence" @click="goNewsListFn(3)">检测到有重要情报</span>
				</div>
			</div>
		</div>

		<!-- 搜索 -->
		<div id="search_box" class="search_box clearfix" :class="{'mt20':companyType==2}">
			<div class="search_line">
				<span class="s_icon"></span>
				<input class="input_text" v-model="searchContent" @keyup.enter="searchTmFn" @input="searchTmNameFn" placeholder="搜索托管中的商标"></input>
				<i class="el-dialog__close el-icon el-icon-close clear" v-if="searchContent != ''" @click="searchContent = ''"></i>
				<!-- <ul class="search_ul" v-show="showSearchList" >
					<li v-show="tmSearchList.length" v-for="item in tmSearchList" @click="selectSearchFn(item.tmName)">{{ item.tmName }}</li>
					<li v-show="!tmSearchList.length">暂无匹配商标</li>
				</ul> -->
			</div>
			<el-button class="ml10" size="small" type="primary" @click="searchTmFn">搜索</el-button><el-button size="small" @click="reseatSearchFn">重置</el-button>
		</div>
		<div class="type_list" id="toSetCore"><!-- v-if="showTypeList " -->
			<ul>
				<li :class="{'active': info.typeID===selectStatus}" v-for="(info, index) in conditionList" v-if="index < 6" @click="selectTypeDataFn(info)"> {{ info.name }}商标 <span class="num">{{ info.num }}</span></li>
			</ul>
		</div>

		<!-- 托管商标为空 -->
		<div class="empaty_list" v-if="tmResultList.length == 0">
			<p class="title">暂无托管信息</p>
			<button class="btn_blue_o" @click="goCompanyDetailFn(selectCompany.applicationName)">去托管企业旗下商标</button>
		</div>

		<!-- 已托管列表 -->
		<brand-list :showGlint="showGlint" :companyType="companyType" :resultList="tmResultList" :editType="editType" :showList="showList" @removeFn="removeTmFn" @addFn="addCoreTmFn" @submitFn="submitTmFn" :loading="loading" @showCheckBox="showCheckBoxFn"></brand-list>

		<!-- 分页 -->
		<div class="pagination-wrap" v-show="tmResultList.length">
			<el-pagination layout="total, prev, pager, next" :total="tmTotal" :page-size="tmSize" :current-page.sync="tmCurrentPage" class="sebe-pagination" @current-change="currentChange"></el-pagination>
		</div>

		<!-- 消息列表 -->
		<el-dialog :title.sync="msgTitle" :visible.sync="messageVisible" custom-class="message_dialog" >
			<div class="dialog_cotent">
				<div class="msg_item clearfix" v-for="item in msgList" v-if="msgList.length">
					<div class="tm_img">
						<img :src="item.tradeMark.tmImg" alt="">
					</div>
					<div class="tm_info clearfix">
						<div class="text_line text_line_one">
		        	<span class="key">商标名称：</span>
		        	<span class="value">{{ item.tradeMark.tmName  || '图形' }}</span>
		        </div>
		        <div class="text_line ">
		        	<span class="key">注册号：</span>
		        	<span class="value">{{ item.tradeMark.regNo }}</span>
		        </div>
		        <div class="text_line ">
		        	<span class="key">申请时间：</span>
		        	<span class="value">{{ item.tradeMark.appDate }}</span>
		        </div>
		        <div class="text_line ">
		        	<span class="key">商标类别：</span>
		        	<span class="value">{{ item.tradeMark.intCls }}类-{{ item.tradeMark.intCls ? intClsData[item.tradeMark.intCls-1].goodsname : '--' }}</span>
		        </div>
		        <div class="text_line ">
		        	<span class="key">申请人：</span>
		        	<span class="value">{{ item.tradeMark.applicantCn }}</span>
		        </div>
					</div>
					<ul class="msg_info clearfix" v-if="messageType == 1">
						<li :class="{'active': item.newsState==0}">{{ item.newsContent.newCurrentFlow }}</li>
						<li :class="{'active': item.newsState==0}">{{ item.newsContent.oldCurrentFlow }}</li>
					</ul>
					<ul class="msg_info clearfix" v-if="messageType == 2">
						<li class="warm" v-if="item.typeClassification == 1">
							<span :class="{'o_text':!item.newsState, 'gray_text':item.newsState}" >此商标工商信息有变更，商标著录项目信息未同步</span>
							<button class="btn_blue_o" @click="goDetailPageFn(3, item.id)">商标变更</button>
						</li>
						<li class="warm" v-if="item.typeClassification == 2">
							<span :class="{'o_text':!item.newsState, 'gray_text':item.newsState}">此商标处于初审公告期，可能有第三方异议风险</span>
							<button class="btn_blue_o" @click="goDetailPageFn('kefu', item.id)">咨询专家</button>
						</li>
						<li class="warm" v-if="item.typeClassification == 3">
							<span :class="{'o_text':!item.newsState, 'gray_text':item.newsState}">此商标已满3年，可能有第三方撤三风险</span>
							<button class="btn_blue_o" @click="goDetailPageFn('kefu', item.id)">咨询专家</button>
						</li>
						<li class="warm" v-if="item.typeClassification == 4">
							<span :class="{'o_text':!item.newsState, 'gray_text':item.newsState}">此商标即将到期，请尽快办理续展</span>
							<button class="btn_blue_o" @click="goDetailPageFn(2, item.id)">商标续展</button>
						</li>
						<li class="warm" v-if="item.typeClassification == 5">
							<span class="gray_text">{{item.newsContent}}</span>
							<button class="btn_blue_o" @click="goSimilarFn(item)">查看近似</button>
						</li>
					</ul>
					<ul class="msg_info clearfix" v-if="messageType == 3">
						<li class="warm" v-if="item.typeClassification == 1">
							<span :class="{'o_text':!item.newsState, 'gray_text':item.newsState}">此商标正处于初审公告期，您可提出</span>
							<button class="btn_blue_o" @click="goDetailPageFn(2, item.id)">异议申请</button>
						</li>
						<li class="warm" v-if="item.typeClassification == 2">
							<span :class="{'o_text':!item.newsState, 'gray_text':item.newsState}">此商标注册已满三年，您可提出</span>
							<button class="btn_blue_o" @click="goDetailPageFn(14, item.id)">撤三申请</button>
						</li>
						<li class="warm" v-if="item.typeClassification == 3">
							<span :class="{'o_text':!item.newsState, 'gray_text':item.newsState}">此商标未续展注销已满一年，您可以</span>
							<button class="btn_blue_o" @click="goDetailPageFn(1, item.id)">立即注册</button>
						</li>
					</ul>
				</div>

			</div>
		</el-dialog>
		</template>



	</div>
</template>
<script>
	import Vue from 'vue'
	import $ from 'jquery'
	import Util from '../../../../common/js/util.js'
	import Filters from 'api/filters.js'
	import brandList from '../../../../components/guanjia/brandList';
	import messageList from '../../../../components/guanjia/message';
	import intClsData from '../../../../common/js/intClsData.js'

	const stewardUrl = CONFIG.stewardUrl;
	const rootUrl = CONFIG.rootUrl;
	const getCompanyList = stewardUrl + '/smallStewardTadeMark/findStewardSubject';   //企业列表
	const getCoreList = stewardUrl + '/smallStewardTadeMark/findCoreTrademark';  //查询核心商标列表
	const getCoreDetail = stewardUrl + '/smallStewardTadeMark/findCoreTrademarkDetails';  //查询核心商标详情
	const findStewardTrademark = stewardUrl + '/smallStewardTadeMark/findStewardTrademark';  //查询已托管商标列表
	const statisticsTrademark = stewardUrl + '/smallStewardTadeMark/statisticsTrademark';  //查询所有分类及其数量
	const deleteCoreStewardTrademarkinfo = stewardUrl + '/smallStewardTadeMark/deleteCoreStewardTrademarkinfo';  //删除核心商标
	const addCoreStewardTrademarkinfo = stewardUrl + '/smallStewardTadeMark/addCoreStewardTrademarkinfo';  //添加核心商标
	const deleteStewardTrademarkinfo = stewardUrl + '/smallStewardTadeMark/deleteStewardTrademarkinfo';  //删除托管商标
	const firstHomePage = stewardUrl + '/smallStewardTadeMark/firstHomePage';  //置顶展示企业
	const findNews = stewardUrl + '/smallStewardTadeMark/findNews';  //查询消息列表
	const statisticsNews = stewardUrl + '/smallStewardTadeMark/statisticsNews';  //查询总的消息数量
	const deleteStewardSubject = stewardUrl + '/smallStewardTadeMark/deleteStewardSubject'; //删除企业
	const sebeStatistics = rootUrl + '/api/sebeStatistics';
	const readNews = stewardUrl + '/smallStewardTadeMark/readNews';  //消息列表页设为已读状态
	const getStatisticsUrl = stewardUrl + '/smallStewardTadeMark/statisticsStewardSubject';  //消息列表页设为已读状态

	export default {
		components: {
			brandList
		},
		data(){
			return{
				myStatisticsData:{}, //统计企业数量
				showGlint: false, //闪烁
				dialogLoading: false,
				loading: false,  //加载
				checkIcon: false,  //查看全部
				showBigImg: false, //展示大图
				showList: true,  //是都展示已托管商标页
				addVisible: false, //新增企业或者商标弹窗
				messageVisible: false,  //消息弹窗显示与否
				showTypeList: true,  //分类列表
				idDeleteCompany: false,  //是否是删除企业
				showCheck: false,  //是否展示列表复选框
				messageType: 1,
				addRadio: '1',  // 1.添加企业  2.添加商标
				selectStatus: '',  //全部
				searchContent: '',  //商标搜索内容
				companyContent: '', //企业名搜索内容
				selectCompanyId: '',  //选择拍讯的企业ID
				companyType: 1, //企业类型
				// 所有企业列表弹窗
				allCompanyVisible: false,
				// 所有商标类型
				typeList: [
					{name: '全部商标', num:100},
					{name: '待审中商标', num:100},
				],
				// 企業列表
				companyList: [],
				// 选择查看的企业信息
				selectCompany: {},
				// 核心商标列表
				coreTmList: [],
				// 选择的核心商标ID
				selectCoreId: '',
				// 核心商标详情
				coreDetail: {},
				// 已托管商标列表
				tmResultList: [],
				editType: 1,
				conditionList: [
	        {name:'全部', typeID: '', num:0},
	        {name:'待审中', typeID:1, num:0},
	        {name:'已初审', typeID:4, num:0},
	        {name:'已驳回', typeID:3, num:0},
	        {name:'已注册', typeID:2, num:0},
	        {name:'已销亡', typeID:0, num:0},
	        {name:'注册满3年', typeID:6, num:0},
	        {name:'注册满5年', typeID:7, num:0},
	        {name:'注册满10年', typeID:8, num:0}
	      ],
				tmTotal: 1,
				tmSize: 10,
				tmCurrentPage: 1,
				intClsData: intClsData.cateIdData,  //所有分类信息
				msgTitle: '',  //消息标题
				msgList: [],  //消息列表
				stasticMsg: [],  //消息中心
				statisticsData: {},
				centerType:1, //企业类别，默认我的企业
				showSearchList: false,  //是否显示商标模糊搜索结果
				tmSearchList: [],  //商标模糊搜索列表
			}
		},
		methods:{
			//隐藏浮框
      hidePop(){
        document.getElementById('app').click();
      },
			// 模糊搜索商标
			searchTmNameFn () {
				this.showSearchList =true;  //展示搜索哦结果列表
				let params = {
          stewardSubjectId: this.selectCompany.id,
          currentStatus: this.selectStatus,
          trademarkName: this.searchContent,
          page: this.tmCurrentPage,
          size: this.tmSize
        }
        this.loading = true;
        this.$http.get(findStewardTrademark, {params: params})
        .then( (resp) => {
        	this.tmSearchList = resp.data.data || [];
        	this.loading = false;
        })
        .catch( (error) => {
        	this.loading = false;
        })
			},
			// 选择模糊搜索结果搜索
			selectSearchFn (name) {
				this.searchContent = name;
				this.showSearchList =false;  //展示搜索哦结果列表
				if (!this.searchContent) {
      		this.showTypeList = true;  //分类列表
      	}
      	else{
      		this.showTypeList = false;  //分类列表
      	}
				this.findStewardTrademarkFn();  //查询已托管
			},
			// 是否隐藏body滚动条
			bodyHidden (type) {
				if (type) {
					document.body.style.overflow = 'hidden';
				}
				else{
					document.body.style.overflow = 'visible';
				}
			},
			//  近似商标
			goSimilarFn (item) {
				this.$router.push({path: '/steward/approximateTrademark', query:{keyword: item.tmName}})
			},
			// 消息详情页按钮跳转相应服务
			goDetailPageFn (type, id) {
				let params = {id: id};
				var newPage = window.open();
				this.$http.post(readNews, params)
				.then ( (resp) => {
					if (type == 'kefu') {
						newPage.location.href = `https://pct.zoosnet.net/LR/Chatpre.aspx?id=PCT70172520&lng=cn&p=http%3a%2f%2fwww.ipsebe.com`
					}
					else{
						newPage.location.href = `https://www.ipsebe.com/products/${type}.htm`
					}
				})
			},
			// 查询个人总体数据
			sebeStatisticsFn () {
				this.$http.get(sebeStatistics)
				.then( (resp) => {
					this.statisticsData = resp.data;
				})
			},
			custormAnchor(anchorName, cb) {
	      // 找到锚点
	      let anchorElement = document.getElementById(anchorName);
	      // 如果对应id的锚点存在，就跳转到锚点
	      if(anchorElement) {
	      	anchorElement.scrollIntoView();
	      	cb && cb();
	      }
	    },
			addCoreJump(){
				this.custormAnchor('search_box');
				this.goToSetCoreFn();
			},
			// 去设置核心商标
			goToSetCoreFn () {
				//let top_ = document.documentElement.scrollTop;
				//document.documentElement.scrollTop = 650;
				this.showGlint = true;
				setTimeout(() => {
					this.showGlint = false;
				}, 2000)
			},
			// 去商标详情页
			goDetailFn (obj) {
				this.$router.push({path: '/tradeDetail', query:{trademarkId: obj.id}})
			},
			// 删除企业
			deleteCompanyFn (item) {
				let params = {
					stewardSubjectId: item.id,
          applicationType: parseInt(this.companyType)
				}
				this.$confirm('确认删除该企业?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '暂不',
          type: 'warning'
        }).then(() => {
        	this.dialogLoading = true;
        	this.idDeleteCompany = true;  //是否是删除企业
        	this.$http.post(deleteStewardSubject, params)
	        .then ( (resp) => {
	        	this.dialogLoading = false;
	        	this.$message({
	            type: 'success',
	            message: '删除成功!'
	          });
	          this.getStatistics();
	          this.getCompanyListFn(true);  //默认查询企业列表
	          this.sebeStatisticsFn(); //查询个人整体数据
	        })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
			},
			// 添加托管
			goToTrustShipFn () {
				this.$router.push({path: '/steward/hostEnterprise/1'})
			},
			// 去企业详情页
			goCompanyDetailFn (name) {
				this.$router.push({path: `/steward/enterpriseDetail/${name}`})
			},
			// 查看消息列表
			goNewsListFn (type, sType) {
				if (type == 1) {
					this.msgTitle = '法律状态更新';
				}
				else if (type == 2) {
					this.msgTitle = '风险预警';
				}
				else if (type == 3) {
					this.msgTitle = '重要情报';
				}
				else if (type == 4) {
					this.msgTitle = '近似商标';
				}
				else if (type == 5) {
					this.msgTitle = '申请驰名商标提醒';
				}
				this.messageType = type;
				let id = '';
				if (sType==0) {
					id = '';
				}
				else {
					id = this.coreDetail.id;
				}
				this.getNewsListFn(type, id);  //查询消息列表
			},
			// 查询总的消息数量
			statisticsNews () {
				let params = {
          stewardSubjectId: this.selectCompany.id,
          applicationType: this.companyType - 0,
        }
        this.$http.get(statisticsNews, {params: params})
        .then ( (resp) => {
        	let msgData = resp.data.data;
        	let lsit_ = [];
        	if (msgData.length) {
        		msgData.forEach( (item) => {
	        		if (item.newsType == 1) {
	              item.title = '条法律状态更新'
	            }
	            else if (item.newsType == 2) {
	              item.title = '条风险预警(异议、撤三、到期)'
	            }
	            else if (item.newsType == 3) {
	              item.title = '条重要情报(异议、撤三、未续展撤销)'
	            }
	            else if (item.newsType == 4) {
	              item.title = '条近似商标更新'
	            }
	            else if (item.newsType == 5 || item.newsType == 6) {
	              item.title = '条新消息'
	            }
	            if (item.statistics > 0) {
	            	lsit_.push(item)
	            }
	        	})
        	}
        	this.stasticMsg = lsit_;
        })
			},
			//  查询消息列表
			getNewsListFn (type, id) {
				let params = {
          stewardSubjectId: this.selectCompany.id,
          trademarkName: '',
          trademarkId: id,
          newsType: type,
          page: 1,
          size: 1000
        }
        this.$http.get(findNews, {params: params})
        .then( (resp) => {
        	this.msgList = resp.data.data;
        	if (this.msgList.length) {
        		this.messageVisible = true;
        		this.msgList.forEach( (item) => {
	        		item.tmName = item.tmName ? item.tmNamed : '图形';
	        		if (item.newsType == 1) {
	        			item.newsContent = JSON.parse(item.newsContent);
	        		}
	        	})
        	}
        	else{
        		this.$message({
	            type: 'error',
	            message: '此类消息为空!'
	          });
        	}
        })
			},
			//  查看报告详情
			goReportPage () {
				let tmName = this.coreDetail.tmName;
				let tmImg = this.coreDetail.tmImg;
				let tmId = this.coreDetail.id;
				let applicantCn = this.coreDetail.applicantCn; //申请人
				// this.$router.push({path: '/report', query: {trademarkName: tmName, intCls: this.coreDetail.intCls, tmImg: tmImg, tmId: tmId}})
				let routeData = this.$router.resolve({path: '/report', query: {trademarkName: tmName, intCls: this.coreDetail.intCls, tmImg: tmImg, tmId: tmId, applicantCn: applicantCn}});
				window.open(routeData.href, '_blank');
			},
			// 设为置顶展示
			setIndexFn () {
				let params = {
					stewardSubjectId: this.selectCompanyId
				}
				this.$http.post(firstHomePage, params)
				.then( (resp) => {
					this.$message({
            type: 'success',
            message: '设为首页展示成功!'
          });
          this.getCompanyListFn();  //默认查询企业列表
          this.allCompanyVisible = false;
				})
			},
			//  选择企业置顶
			selectCompanyListFn (item) {
				this.selectCompanyId = item.id;
			},
			// 添加企业或商标
			addPageFn () {
				this.$router.push({path: 'hostEnterprise/1'});
			},
			//切换快捷订单筛选
			toggle(status){
				this.centerType = status;
				this.$router.push({path: 'myCompany', query: {type: status}});
			},
			// 默认查询企业列表
			getCompanyListFn (isSilent) {
				this.companyType = this.$route.query.type || 1;
				this.companyType = this.companyType -0;
				let params = {
					applicationType: this.companyType,
					applicationName: this.companyContent,
					page:1,
					size: 100
				}
				this.dialogLoading = true;
				this.$http.get(getCompanyList, {params: params})
				.then( (resp) => {
					this.companyList = resp.data.data;
					if (!this.allCompanyVisible || this.idDeleteCompany) {
						this.companyListLength = this.companyList.length;
					}
					this.dialogLoading = false;
					this.idDeleteCompany = false;  //是否是删除企业
					//默认非静默加载
					if (isSilent !== true) {
						if (this.companyList.length>0) {
							this.selectCompany = this.companyList[0];
							this.selectCompanyFn(this.selectCompany);  //选择当前展示企业
						}
						else{
							this.coreTmList = [];
							this.tmResultList = [];
						}
					}
				})
			},
			// 选择当前展示企业
			selectCompanyFn (item) {
				this.companyList.forEach( (info) => {
					info.isSelect = false;
				})
				item.isSelect = true;
				this.selectCompany = item;
				this.selectStatus = '';  //商标类别默认选择全部
				this.tmCurrentPage = 1;  //默认选择第一页
				this.getCoreTrademarkFn();  //查询核心商标列表
				this.statisticsTrademarkFn();  //查询所有分类
				this.findStewardTrademarkFn();  //查询已托管
				this.statisticsNews();  //statisticsNews
			},
			// 查询核心商标列表
			getCoreTrademarkFn () {
				let params = {
          stewardSubjectId: this.selectCompany.id
        }
        this.$http.get(getCoreList, {params: params})
				.then( (resp) => {
					this.coreTmList = resp.data.data;
					if (this.coreTmList.length > 0) {
						this.coreTmList[0].isSelect = true;
						this.selectCoreId = this.coreTmList[0].id;
						this.selectCoreFn(this.coreTmList[0]);  //选择核心商标
					}
					else{
						this.coreDetail = {};
					}
				})
			},
			// 选择核心商标
			selectCoreFn (item) {
				this.selectCoreId = item.id;
				this.getCoreDetailFn();  //查询核心商标详情
			},
			// 查询核心商标详情
			getCoreDetailFn () {
				let params = {
          trademarkId: this.selectCoreId
        }
        this.$http.get(getCoreDetail, {params: params})
				.then( (resp) => {
					this.coreDetail = resp.data;
					if (this.coreDetail.report) {
						this.drawPieFn(this.coreDetail.report.stateStatistics);
					}
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
		        bottom: '5',
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
	            center: ['38%', '60%'],
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
	    // 编辑，进入可多选状态
	    showCheckBoxFn (data) {
	    	this.showCheck = data;
	    },
	    // 查询已托管商标列表
	    findStewardTrademarkFn () {
	    	let params = {
          stewardSubjectId: this.selectCompany.id,
          currentStatus: this.selectStatus,
          trademarkName: this.searchContent,
          page: this.tmCurrentPage,
          size: this.tmSize
        }
        this.loading = true;
        this.$http.get(findStewardTrademark, {params: params})
        .then( (resp) => {
        	this.tmResultList = resp.data.data || [];
        	this.loading = false;
        	if (this.tmResultList && this.tmResultList.length>0) {
        		this.tmTotal = resp.data.total;
        		this.showList = true;
        		let selectList = JSON.parse(sessionStorage.getItem('selectList')) || [];
        		this.tmResultList.forEach( (item) => {
        			item.isSelect = false;  //默认都没选中
        			item.showCheckbox = false;  //默认都不展示复选框
        			if (selectList.length || this.showCheck) {
        				item.showCheckbox = true;  //默认展示复选框
        				selectList.forEach( (info) => {
        					if (item.id == info.id) {
        						item.isSelect = true;
        					}
        				})
        			}
        		})
        	}
        	else{
        		this.tmResultList = [];
        		this.showList = false;
        	}
        })
        .catch( (error) => {
        	this.loading = false;
        })
	    },
	    // 查询所有分类
	    statisticsTrademarkFn () {
	    	let params = {
          stewardSubjectId: this.selectCompany.id,
        }
        this.$http.get(statisticsTrademark, {params: params})
        .then ( (resp) => {
        	let typeList = resp.data;
        	this.conditionList.forEach(function(item){
            item.num = typeList[item.name]
            if (item.name == '全部' ) {
              if (item.num > 999){
                item.num = '999+'
              }
            }
            else{
              if (item.num > 99) {
                item.num = '99+'
              }
            }
          })
        })
	    },
	    // 选择分类
	    selectTypeDataFn (data) {
        this.selectStatus = data.typeID;
        this.tmCurrentPage = 1;
        this.findStewardTrademarkFn();  //已托管
        // this.getCoreDetailFn();  // 查询核心商标详情
      },
      // 模糊搜索哟托管商标列表
      searchTmFn () {
      	if (!this.searchContent) {
      		this.showTypeList = true;  //分类列表
      	}
      	else{
      		this.showTypeList = false;  //分类列表
      	}
      	// this.statisticsTrademarkFn();  //查询所有分类
      	this.findStewardTrademarkFn();  //已托管
      },
      // 重置
      reseatSearchFn () {
      	this.searchContent = '';
      	this.showTypeList = true;  //分类列表
      	this.findStewardTrademarkFn();  //已托管
      },
      // 模糊搜索企业列表
      searchCompanyFn (isSilent) {
      	//this.allCompanyVisible = true;
      	this.getCompanyListFn(isSilent);  //所有企业列表
      },
      // 重置企业列表
      reseatCompanyListFn () {
      	this.companyContent = '';
      	//this.getCompanyListFn();  //所有企业列表
      },
      // 移除核心商标
      removeTmFn (data) {
    		let list = [].concat(data.id);
      	let params = {
          stewardSubjectId: this.selectCompany.id,
					trademarkIds: list
        }
      	this.loading = true;
      	this.$http.post(deleteCoreStewardTrademarkinfo, params)
        .then ( (resp) => {
        	this.loading = false;
        	this.$message({
            type: 'success',
            message: '移除成功!'
          });
          this.getCoreTrademarkFn();  //查询核心商标列表
        	this.findStewardTrademarkFn();  //已托管
        	this.hidePop();
        }).catch((err) => {
        	this.loading = false;
        });
      },
      // 添加核心商标
      addCoreTmFn (data) {
      	let list = [].concat(data.id);
				let params = {
          stewardSubjectId: this.selectCompany.id,
					trademarkIds: list
        }
        if (this.coreTmList.length<5) {
        	this.loading = true;
        	this.$http.post(addCoreStewardTrademarkinfo, params)
	        .then ( (resp) => {
	        	this.loading = false;
	        	this.$message({
	            type: 'success',
	            message: '设置成功!'
	          });
	          this.getCoreTrademarkFn();  //查询核心商标列表
	        	this.findStewardTrademarkFn();  //已托管
	        })
	        .catch( (err) => {
	        	let errData = err.response.data;
        		this.loading = false;
        		if (errData && errData.msg) {
        			this.$message({
		            type: 'error',
		            message: errData.msg
		          });
        		}
        		else {
        			this.$message({
		            type: 'error',
		            message: '最多设置5个核心商标'
		          });
        		}
        	})
        }
        else{
        	// this.$confirm(`该企业的核心商标已满，是否需要移除已有核心商标？`, '温馨提示', {
	        //   confirmButtonText: '确定',
	        //   type: 'warning'
	        // })
        	this.$message.error('每个企业只能设置5个核心商标，当前已设置5个');
        }
      },
      // 确认取消托管
      submitTmFn (data) {
      	let params = {
          stewardSubjectId: this.selectCompany.id,
					trademarkIds: data
        }
        this.loading = true;
      	this.$http.post(deleteStewardTrademarkinfo, params)
        .then ( (resp) => {
        	this.loading = false;
        	this.$message({
            type: 'success',
            message: '取消托管成功!'
          });
          this.showCheck = false; //列表复选框
          this.statisticsTrademarkFn();  //查询所有分类
          this.getCoreTrademarkFn();  //查询核心商标列表
          this.findStewardTrademarkFn();  //已托管
          this.sebeStatisticsFn(); //查询个人整体数据
        })
      },
      // 已托管商标翻页
			currentChange() {
				this.findStewardTrademarkFn();  //已托管
			},
			// 已托管商标翻页
			getStatistics() {
				this.$http.get(getStatisticsUrl)
        .then ( (resp) => {
        	this.myStatisticsData = resp.data;
        	console.log(this.myStatisticsData)
        }).catch((err) => {});
			}
		},
		mounted(){
			this.getStatistics();
			this.getCompanyListFn();  //默认查询企业列表
			this.sebeStatisticsFn(); //查询个人整体数据
		},
		watch: {
			// 如果路由有变化，会再次执行该方法
			'$route': 'getCompanyListFn',
			// 当显示所有企业的弹窗显示状态变化时重新查询所有企业列表
			allCompanyVisible (v) {
				if (!this.allCompanyVisible) {
					this.companyContent = '';
					this.getCompanyListFn();  //默认查询企业列表
				}
			}
		},
		filters: {
			dateFormat: Filters.formatDate.dateFormat,
			orderStatusformat: Filters.orderStatusformat,
			payStatusformat: Filters.payStatusformat,
			priceformat:Filters.priceformat,
			titleLengthFormat:Filters.titleLengthFormat
		}
	}
</script>

<style scoped lang="scss">
	.myCompany_page{
		font-size: 13px;
		padding: 15px 20px 20px;
		h4{height: 26px;line-height: 26px;font-weight: normal;font-size: 16px; font-weight: bold; color: #333;}
		.fade-enter-active, .fade-leave-active {
		  transition: opacity 0.8s;
		}
		.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
		  opacity: 0;
		}
		.b_link, a.b_link {
			font-size: 13px; color: #3DB1FA; cursor:pointer;
		}
		a.b_link:hover {text-decoration:none;}
		.orderStatus{;
			font-size: 14px;
			ul{
				box-sizing: content-box; height: 39px; border-bottom: 1px solid #e6e6e6;
				li{
					box-sizing: content-box; padding: 0 15px; float:left;height: 38px; line-height: 38px;color: #666;cursor: pointer;
				}
				li.active{
					border-bottom: 2px solid #3db1fa; color: #3db1fa;
				}
			}
		}
		.message_lab {
			width:940px; height:30px; line-height:30px; background: #FFF9ED;border: 1px solid #FFEBD6; border-radius: 100px; text-align:center; margin-top:15px; font-size:12px; color: #333;
			span {cursor:pointer;}
			.orange {color: #FF9A2F;}
		}
		.tm_num {
			width:940px; padding: 16px 20px; background: #F8F8F8; margin: 15px 0 10px 0;
			.text { font-size: 13px; color:#333;
				.red { color: #F64744;}
			}
			.line {
				margin: 0 10px;
			}
		}
		.company_lsit {
			.company_item {
				width: 250px; height: 106px; box-sizing: border-box; background: #F8F8F8; margin-right: 10px; float:left; position:relative; cursor:pointer;border: 1px solid #F8F8F8;
				.com_name {font-size: 14px; color:#333; margin: 30px auto 10px auto; text-align: center; width:100%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
				.detail {text-align: center;}
				.delete {position:absolute; right:10px; top:10px; cursor:pointer; color:#ccc; width:16px; height:16px; background:url(~assets/img/guanjia/icon/delete.png) no-repeat; display:none;}
				&:hover {
					background: #FFFFFF; border: 1px solid #3DB1FA;
					.delete {display: block;}
				}
			}
			.active {
				background: #FFFFFF; border: 1px solid #3DB1FA;
			}
			.add_company {
				width:125px; height:106px; text-align:center; box-sizing: border-box; background: #fff; border: 1px solid #E6E6E6; position: relative; float: left; cursor: pointer; background:url(../../../../assets/img/guanjia/icon/add.png) no-repeat center center;
				&:hover {border: 1px solid #3DB1FA; background:url(../../../../assets/img/guanjia/icon/add_hover.png) no-repeat center center; }
				.add_icon {
					width:30px;
					height:30px;
					margin-top:38px;
				}
			}
		}
		.check_all {
			width: 100%; height:20px; margin: 10px 0 20px 0; text-align: left;
		}
		.empaty_list {
			background: #FFFFFF; border: 1px solid #E6E6E6; width: 940px; height: 120px; margin-bottom:20px; margin-top:-2px;
			.title {
				font-size: 14px; color: #999999; width: 100%; text-align: center; margin: 30px 0 10px 0;
			}
			.btn_blue_o {
				display: block; margin: 0 auto;
			}
		}
		.type_name {
			width:100%; height:20px; margin-bottom:15px; text-align:left;margin-top: 15px;
			.text {font-size:14px; color:#333;}
		}
		.search_box {
			width:100%;
			.search_line {
				width:300px; height:30px; border:1px solid #e6e6e6; position:relative; float:left;
				.s_icon { width:36px; height:28px; float:left; display:inline-block; box-sizing: border-box; border-radius:0px 3px 3px 0px; background: url(../../../../assets/img/guanjia/icon/icon_search.png) no-repeat center center #F8F8F8; border-right: 1px solid #E6E6E6;}
				.input_text {width:242px; height:28px; padding-left: 10px; padding-right:12px; float:left; box-sizing:border-box; background: #FFFFFF; border: none; border-radius: 3px; display:inline-block; vertical-align:middle; }
				.clear {position: absolute; right:10px; top:8px; height:10px; height:10px; color:#BBBBBB; font-size:10px; cursor:pointer;}
				ul::-webkit-scrollbar{width:4px;background-color:#dfe2e5;}
				ul::-webkit-scrollbar-thumb{background-color:#a8afb5;}
				.search_ul {width:300px;height:144px;border: 1px solid #E6E6E6;border-radius: 3px;position: absolute;left:0; top:32px;padding:6px 0;box-sizing:border-box;overflow-y: auto;overflow-x: hidden;background-color:#fff; z-index:99;
					li{height:30px;width:298px;font-size:13px;text-align:left;padding-left:10px;line-height:30px;color:#999;padding-right: 40px;position: relative;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;box-sizing:border-box;
						.i_lists{position: absolute;right:20px;top:8px;}
					}
					li:hover{background-color:#f8f8f8;cursor:pointer;}
				}
			}
			.btn_item {margin-left:10px; float:left;}
		}
		.type_list {
			font-size:13px; color:#333; margin-top:5px;
			ul{
				height: 40px; border-bottom: 1px solid #e6e6e6;
				li{
					padding: 0 5px; float:left; height: 39px; line-height: 39px;color: #333; cursor: pointer; margin-right:20px;
					.num {color: #F64744;}
				}
				li.active{
					border-bottom: 2px solid #3DB1FA;
				}
			}
		}
		.core_list {
			width:100%; margin-bottom:14px;
			.core_item {
				width:60px; height:60px; background: #D8D8D8; border: 1px solid #E6E6E6; margin-right:10px; float:left; cursor:pointer;
				img {width:100%; height:100%;}
			}
			.active {background: #FFFFFF; border: 1px solid #3DB1FA; position:relative;}
			.active:after {position:absolute; bottom:-16px; left:23px; z-index:99; content:''; width:0; height:0; border: 6px solid transparent; border-top-width:10px; border-bottom-width:10px; border-bottom-color:#E6E6E6; }
			.active:before {position:absolute; bottom:-16px; left:25px; z-index:100; content:''; width:0; height:0; border: 4px solid transparent; border-top-width:8px; border-bottom-width:8px;border-bottom-color:#fff; }
			.add_core_item {
				width:60px; height:60px; text-align:center; box-sizing: border-box; background: #fff; border: 1px solid #E6E6E6; position: relative; float: left; cursor: pointer; background:url(../../../../assets/img/guanjia/icon/add.png) no-repeat center center;
				&:hover {border: 1px solid #3DB1FA; background:url(../../../../assets/img/guanjia/icon/add_hover.png) no-repeat center center; }
				.add_icon {
					width:30px;
					height:30px;
					margin-top:38px;
				}
			}
		}
		.core_detail {
			width:100%; height:auto; background: #FFFFFF; border: 1px solid #E6E6E6; margin-bottom:20px;
			.tm_info_box {
				padding: 20px 0 20px 0; margin-left:20px; position:relative;
				.tm_img {
					width:80px; height:80px; overflow:hidden; float:left; background: #D8D8D8; border:1px solid #eee; display:inline-block; margin:0 15px 0 0; position:relative; cursor:pointer;
					img {width:100%; height:100%;}
					.core {position:absolute; bottom:0; left:0; z-index:10; color:#FF9A2F;width:100%; height:25px;line-height: 25px; background:#FFF7E9;text-align: center;font-size: 13px;}
				}
				.tm_info {
					max-width:550px; float:left; padding-top:5px;
					.text_line {
						font-size:13px; margin-bottom: 10px; margin-left:10px; width:260px; overflow:hidden; float:left; margin-bottom:6px;
						.key {width:65px;color:#666; display:inline-block; vertical-align:middle;}
						.value {color:#151515; max-width:200px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; display:inline-block; vertical-align:middle;}
						.tag {background:#fff; color:#3DB1FA;height: 19px;line-height: 17px;border: 1px solid #3DB1FA; display:inline-block; border-radius:100px; padding:0 6px; vertical-align:middle;}
					}
				}
				.link_box {
					position: absolute; right:15px; bottom:20px;
					.b_link {
						margin-left:20px;
					}
					.r{
						color: #999;
						&:hover{color:#3DB1FA;}
					}
				}
			}
			.detail_info {
				padding: 20px 0 20px 20px; position:relative; border-top: 1px solid #E6E6E6;
				.title {width:100%; text-align:left; font-size: 12px; color: #999999; float:left;}
				.pie_box {width:300px; height:130px; text-align:left; float:left;}
				.num_info {
					float:left; margin-left:50px; max-width:280px;
					.line {
						width:100%; color:#333; font-size:13px; margin-bottom:10px;
						.red {color:#F64744;}
					}
					.btn_blue {margin-top: 10px;}
				}
				.news_tag {
					position:absolute; right:0px; top:30px; max-width:200px; overflow:hidden;
					.item { height:26px; line-height:26px; float:right; margin-right:-5px; background: #FFF5F5; font-size: 12px; color: #F64744; margin-bottom:5px; border-radius:13px;border-top-right-radius:0; border-bottom-right-radius:0;padding:0 20px; cursor:pointer;}
				}
			}
		}
		.empaty_tm {
			font-size: 14px;
			.title-f {
				margin: 40px 0 20px 405px;
				width: 150px;
				height: 100px;
				line-height: 186px;
				font-size: 13px;
				color: #333;
				background: url(~assets/img/trustee/wait_null.jpg) no-repeat top center;
				background-size: 55px;
			}
			.trustShipBtn {
				margin-left: 417px;
				width: 120px;
				height: 35px;
				color: #fff;
				border-radius: 3px;
				border-color:#3DB1FA;
				background: #3DB1FA;
				margin-bottom: 30px;
			}
			.text_box {
				width:450px; float:left; padding-top:30px;
				.title-s {
					margin: 0 0 20px 22px;
					font-weight: bolder;
					color: #333;
				}
				.content-f {
					margin: 0 0 8px 24px;
					color: #333 ;
					.icon_black {
						display: inline-block ;
						margin-right: 5px;
						width: 4px ;
						height: 4px ;
						border-radius: 50%;
						vertical-align: middle;
						background: #000;
					}
				}
				.text-f {
					margin: 0 0 20px 22px;
					color: #666;
				}
			}
			.page_img {
				float: right; width:270px; height:280px; margin-right: 50px; background: url(~assets/img/guanjia/company/page_bg1.png); cursor:pointer; box-shadow: 8px 8px 0 #eee; position:relative;
				.hover_bg {
					position: absolute; width:100%; height:100%; background:rgba(0,0,0,.4); text-align:center;
					.check {margin-top:110px; width:34px; height:26px;}
					.text {color: #fff; font-size:14px;}
				}
			}
		}
		.big_box {
			position:fixed; width:100%; height:100%; overflow:auto; background:rgba(0,0,0,.5); left:0; top:0; z-index:999; transition:all 0.5s;
			.big_img {
				position:absolute; width:1200px; height:auto; left:50%; top:10px; margin-left:-600px;
				img {width:100%; height:100%;}
				.close {position:absolute; right:-30px; top:5px; color:#fff; cursor: pointer; font-size:16px;}
			}

		}

	}

</style>

<style lang="scss">
	.company_dialog {
		width:900px;transform:translate(-50%, -50%);
		.el-button--default {border:1px solid #ddd; color:#666;}
		.el-dialog__header {text-align:left;}
		.search_wrap {
			padding: 20px 20px 10px 20px; background:#fff;
			.total {float:right; margin-top:10px;}
		}
		.dialog_cotent {
			&::-webkit-scrollbar{width:5px;background-color:#F5F5F5;}
      &::-webkit-scrollbar-thumb{background-color:#ddd;}
			padding:0 20px 0 20px; margin-bottom:10px; max-height:450px; overflow:auto;
			.com_list {
				width:860px; margin-top:15px; height:auto;
				.com_item {
					width:276px; height:137px; float:left; margin-right:10px; margin-bottom:10px; background: #F8F8F8; position:relative; cursor:pointer;border: 1px solid #F8F8F8;
					.title {height: 21px;font-size:14px; color:#333; width:100%; padding: 0 10px;text-align:center; margin-top:25px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}
					.owner {font-size:12px; color:#666; width:100%; text-align:center; margin-top:10px;}
					.num {
						font-size:13px; color:#666; width:100%; text-align:center; margin-top:15px;
						.orange {color:#FF9A2F;}
					}
					.top {position:absolute; right:10px; bottom:10px; width:26px; height:26px; line-height:26px; border-radius:50%; background: #3DB1FA; color:#fff; font-size:12px; text-align:center; display:inline-block;}
					.delete {position:absolute; right:10px; top:10px; cursor:pointer; color:#ccc; width:16px; height:16px; background:url(~assets/img/guanjia/icon/delete.png) no-repeat; display:none;}
					&:hover {
						border: 1px solid #3DB1FA;
						.delete {display: block;}
					}
				}
				.active {border: 1px solid #3DB1FA};
			}
			.empty_data {
				text-align:center; padding:30px 0;
				.mt10 {text-align:center;}
			}
		}
		.el-dialog__footer {text-align:center;}
	}
	.add_dialog {
		.el-dialog__header {
			text-align:left;
			.el-dialog__title {font-size:14px; color:#333;}
		}
		.el-dialog__body {
			padding: 10px 20px 10px 20px;
			.el-radio {color:#666;}
		}
		.el-dialog__headerbtn {display:none;}
		.select {margin-right:10px;}
		.el-button {padding:8px 15px;}
		.el-button--default {border:1px solid #ddd; color:#666;}
	}
	.message_dialog {
		width:600px;
		.el-dialog__header {text-align:left;}
		.dialog_cotent {
			width:560px; margin:20px; border: 1px solid #E6E6E6; max-height:500px; overflow-y:auto;
			.msg_item {
				width: 520px; margin:20px; border-bottom: 1px dashed #E6E6E6; padding-bottom:15px;
				.tm_img {
					width:80px; height:80px; overflow:hidden; float:left; background: #D8D8D8; display:inline-block; margin:0 15px 0 0;
					img {width:100%; height:100%;}
				}
				.tm_info {
					max-width:400px; float:left; padding-top:5px;
					.text_line {
						font-size:13px; margin-bottom: 10px; width:200px; overflow:hidden; float:left; margin-bottom:6px;
						.key {color:#666}
						.value {color:#151515; }
					}
					.text_line_one {width:400px;}
				}
				.msg_info {
					padding:15px 0;
					li { font-size: 12px; color: #666666; height:16px; line-height:16px; margin-top:10px; width:100%; float:left; list-style:disc inside;}
					li:first-child {margin-top:15px;}
					.active {color: #3DB1FA;}
					.warm {
						height:26px; line-height:26px; list-style:none;
						.o_text {font-size:12px; color:#FF9A2F; float: left; max-width:450px; display:inline-block; overflow:hidden;}
						.gray_text {color: #666;}
						.btn_blue_o {height:26px; line-height:25px; float:right; padding:0 10px;}
					}
				}
			}
		}
	}
</style>
