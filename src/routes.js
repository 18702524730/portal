//注册登录入口 简化头部
import Access from './pages/regLogin/access.vue'
import Login from './pages/regLogin/component/login.vue'
import Register from './pages/regLogin/register.vue';
import sms from './pages/regLogin/component/sms.vue'

// 平台化
// 评价管理
import appraiseList from './pages/appraiseCms/appraiseList.vue'
import appraiseDetail from './pages/appraiseCms/appraiseDetail.vue'

// 退款管理
import refundList from './pages/refundManage/refundList.vue'

// 新增登陆页面
import regLogin from './pages/login/binLogin.vue'
//注册完成入口 完整头部
import Enter from './pages/regLogin/enter.vue'
import regSuccess from './pages/regLogin/component/regSuccess.vue'

//找回密码入口 简化头部
import findPwd from './pages/regLogin/findPwd.vue'
import BindAccount from './pages/regLogin/bindAccount.vue'


import NotFound from './pages/404.vue'
import Home from './pages/Home.vue'
//首页
import Main from './pages/main/Main.vue'

//规范列表
import buttonList from './pages/main/buttonList.vue'

//基本信息
import basicData from './pages/basicData/basicData.vue'

// 企业托管
import hostEnterprise from './pages/myKeeper/guanjia/hostTrademark/hostEnterprise.vue'
// 商标托管
import addHost from './pages/myKeeper/guanjia/hostTrademark/addHost.vue'
// 企业详情
import enterpriseDetail from './pages/myKeeper/guanjia/details/enterpriseDetail.vue'
// 商标详情
import tradeDetail from './pages/myKeeper/guanjia/details/trademarkDetail.vue'
// 近似商标
import approximateTrademark from './pages/myKeeper/guanjia/approximateTrademark/approximateTrademark.vue'

//我的订单
import orderLists from './pages/myOrders/orderLists.vue'
import orderDetail from './pages/myOrders/orderDetail.vue'
//import refundProgress from './pages/myOrders/refundProgress.vue'

//我的存证
import myczList from './pages/myCunz/myczList.vue'
import czDetail from './pages/myCunz/czDetail.vue'

//我的保护投诉
import mycomplaint from './pages/mycomplaint/mycomplaint.vue'
import complaintDetail from './pages/mycomplaint/complaintDetail.vue'
// 我的报告
import reportLists from './pages/myKeeper/myReport/reportList.vue'
import reportEditor from './pages/myKeeper/myReport/reportEditor.vue'

//资料管理 主体信息
import subjectList from './pages/materialManager/subjectList.vue'
import subjectDetail from './pages/materialManager/subjectDetail.vue'
// 开票信息
import invoice from './pages/invoice/invoice.vue'
// 增加开票
import invoiceEdit from './pages/invoice/invoiceEdit.vue'
//import modifyConsignee from './pages/materialManager/modifyConsignee.vue'
//import addressComponent from './pages/materialManager/addressComponent.vue'

//资料管理 地址管理
import addressList from './pages/addressList/addressList.vue'
import addressDetail from './pages/addressList/addressDetail.vue'

//退款
// import refundLists from './pages/refund/refundLists.vue'
import applyRefund from './pages/refund/applyRefund.vue'

//修改密码
import modifyPwd from './pages/accountSafe/modifyPwd.vue'

import Steward from './pages/myKeeper/guanjia/steward';
/* 我的企业 */
import myCompany from './pages/myKeeper/guanjia/company/myCompany'
/* 查询报告 */
import report from './pages/myKeeper/guanjia/report/report'




//二维码
import wechat from './pages/regLogin/component/wechat.vue'
// 解绑
import removeBind from './pages/moveBind/moveBind.vue'

// 资料反馈
import feedback from './pages/feedback/feedback.vue'

// 我的服务
import serviceList from './pages/service/servicelist.vue'
import serviceCXBDetail from './pages/service/serviceCXBDetail.vue'
import serviceDetail from './pages/service/serviceDetail.vue'
// 专利服务
import otherService from './pages/service/otherService.vue'

// 尼斯推荐链接
import recommendNiceLink from './pages/niceClass/recommendNiceLink.vue'
import TmallRecommendNiceLink from './pages/niceClass/TmallRecommendNiceLink.vue'



let routes = [
	{
		path: '/regLogin',
		component: regLogin,
		name: 'regLogin'
	},
	//重定向到首页
	{
		path: '/',
		redirect: '/main',
		name: 'index', //首页默认
		hidden: true
	},
	{
		path: '/access',
		component: Access,
		name: 'Access', //注册登录头尾
		children: [
			{ path: '/', component: wechat },
			{ path: 'login', component: Login },
			{ path: 'wechat', component: wechat },
			{ path: 'sms', component: sms }
		]
	},
	{
		path: '/register',
		component: Register,
		name: 'register', //注册
	},
	{
		path: '/enter',
		component: Enter,
		name: 'Enter', //注册完成头尾
		children: [
			{ path: 'regSuccess', component: regSuccess }
		]
	},
	{
		path: '/findPwd',
		component: findPwd,
		name: 'findPwd', //找回密码头尾
	},
	//账户安全：修改密码
	{ 
		path: '/modifyPwd', 
		component: modifyPwd, 
		name: 'modifyPwd' },
	{
		path: '/bindAccount',
		component: BindAccount,
		name: 'BindAccount'
	},
	{
		path: '/404',
		component: NotFound,
		name: '',
		hidden: true
	},
	{
		path: '/feedback',
		component: feedback,
		name: '',  //资料反馈
		hidden: true
	},
	{
		path: '/tradeDetail',
		component: tradeDetail,
		name: 'tradeDetail',  //商标详情
		hidden: true
	},
	{
		path: '/report',
		component: report,
		name: 'report',  //查询报告
		hidden: true
	},
    {
        path: '/recommendNiceLink',
        component: recommendNiceLink,
        name: 'recommendNiceLink',  //尼斯推荐
        hidden: true
	},
	{
        path: '/TmallRecommendNiceLink',
        component: TmallRecommendNiceLink,
        name: 'TmallRecommendNiceLink',  //天猫尼斯推荐
        hidden: true
	},
	
    {
        path: '/appraiseDetail/:order',
        component: appraiseDetail,
        name: 'appraiseDetail',  //尼斯推荐
        hidden: true
    },

	{
		path: '/',
		component: Home,
		children: [
			//样式规范
			{ path: 'button', component: buttonList, name: 'button' },
			//用户中心首页
			{ path: 'main', component: Main, name: 'main' },

			//订单管理：我的订单、待付款(在左侧导航中配置)
			{ path: 'orders', component: orderLists, name: 'orderLists' },
			//订单详情
			{ path: 'orders/:payment_sn', component: orderDetail, name: 'orderDetail' },
			// 我的存证在侧导航栏的配置
			{ path: 'myczlist', component: myczList, name: 'myczList' },
			{ path: 'myczlist/:web_id', component: czDetail, name: 'czDetail' },
			// 我的保护投诉在侧导航栏的配置
			{ path: 'mycomplaint', component: mycomplaint, name: 'mycomplaint' },
			{ path: 'mycomplaint/:web_id', component: complaintDetail, name: 'complaintDetail' },
			//资料管理：我的报告在左侧导航中配置)
			{ path: 'myReport', component: reportLists, name: 'reportLists' },
			{ path: 'myReport/:report_id', component: reportEditor, name: 'reportEditor' },

			//客户服务：退款
			// { path: 'refunds', component: refundLists, name: 'refundLists' },
			//申请退款
			{ path: 'refunds/:order_sn', component: applyRefund, name: 'applyRefund' },

			//资料管理：基本信息、主体信息、收件地址
			{ path: 'basicData', component: basicData, name: 'basicData' },
			//地址管理
			{ path: 'addressList', component: addressList, name: 'addressList' },
			//地址添加
			{ path: 'addressList/:address_id', component: addressDetail, name: 'addressDetail' },
			//开票信息
			{ path: 'invoiceList', component: invoice, name: 'invoice' },
			{ path: 'invoiceList/:aId', component: invoiceEdit, name: 'invoiceDetail' },

			//主体地址列表
			{ path: 'subjectList', component: subjectList, name: 'subjectList' },
			//主体地址增加
			{ path: 'subjectList/:applyId', component: subjectDetail, name: 'subjectDetail' },

			{
			  path: 'steward',
			  component: Steward,
			  name: 'steward',
			  redirect: '/steward/myCompany',   //商标管家
			  children: [
				/*我的企业*/
				{ path: 'myCompany', component: myCompany, name: 'myCompany' },
				/*企业托管*/
				{ path: 'hostEnterprise/:step', component: hostEnterprise, name: 'hostEnterprise' },
				/*商标托管*/
				{ path: 'addHost/:step', component: addHost, name: 'addHost' },
				/*企业详情*/
				{ path: 'enterpriseDetail/:companyName', component: enterpriseDetail, name: 'enterpriseDetail' },
				/*近似商标*/
				{ path: 'approximateTrademark', component: approximateTrademark, name: 'approximateTrademark' },
			  ]
			},
			//账户安全：解除绑定
			{ path: 'removeBind', component: removeBind, name: 'removeBind' },

			// 其他服务
			{ path: 'otherService/:serviceType', component: otherService, name: 'otherService' },


			// 我的服务
			{ path: 'serviceList', component: serviceList, name: 'serviceList' },
			// 服务详情
			{ path: 'serviceList/:workOrderSn', component: serviceDetail, name: 'serviceDetail' },
			//创新保服务详情
			// { path: 'serviceList/:workOrderSn/:workOrderId', component: serviceCXBDetail, name: 'serviceCXBDetail' },
			// 评价管理
			// appraiseList
			{ path: 'appraiseList', component: appraiseList, name: 'appraiseList' },

			// 退款管理
			{ path: 'refundList', component: refundList, name: 'refundList' },

		]
	}

];
export { routes };
