// 整个文件暂时没用


import axios from 'axios';

let base = '';

//mock测试数据获取
export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };
export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };
export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };
export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };
export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };
export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };
export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

//mock商标管理测试数据获取
export const getTrademarkListPage = params => { return axios.get(`${base}/user/trademarkListPage`, { params: params }); };

//接口统一配置
let baseUrl_kjh = 'http://192.168.1.123:8181';
let baseUrl_sgj = 'http://192.168.1.117:8080';
let baseUrl_lsf = 'http://192.168.1.150:8080';
//let baseUrl = 'http://192.168.1.123:8181/cnsebe-steward-web';
//let baseUrl = 'http://steward.ipsebe.com/cnsebe-steward-web';

//生产环境
//axios.defaults.baseURL = baseUrl;
//let baseUrl = 'http://192.168.1.123:8181/';
//let baseUrl = 'http://steward.ipsebe.com';
let baseUrl = './';
let codeUrl = 'http://user.ipsebe.com/iprp_portal';

//开发环境反向代理(项目名称)ie9跨域问题！
//let projName = '/cnsebe-steward-web';
let projName = 'cnsebe-steward-web';
//let projName = '';

export {baseUrl_kjh,baseUrl_sgj,codeUrl};

//用户信息获取
export const getUserInfo = params => {
	//return axios.get(`${baseUrl_sgj}/stewardUserInfo/getUserInfo.do`,params).then(res => res.data);
	return axios.get(baseUrl + projName +  `/stewardUserInfo/getUserInfo.do`,params).then(res => res.data);
	//return axios.get(`${baseUrl_kjh}/stewardUserInfo/getUserInfo.do`,params).then(res => res.data);
};
//查询用户的商标、专利个数，公司信息（首页）
export const getHomePageInfo = params => {
	//return axios.get(`${baseUrl_kjh}/StewardTradeMarkInfo/statisticForUser.do`,params).then(res => res.data);
	return axios.get(baseUrl + projName +  `/StewardTradeMarkInfo/statisticForUser.do`,params).then(res => res.data);
};




//基本信息获取(查看会员信息)
export const getBasicInfo = params => {
	//return axios.get(`${baseUrl_sgj}/UserController/getMember.do`,params).then(res => res.data);
	return axios.get(baseUrl + projName +  `/UserController/getMember.do`,params).then(res => res.data);
};
//所在区域省市区三级联动数据获取
export const getLocation = params =>{
	return axios({
		//headers: {'Content-Type': 'application/json;charset=UTF-8'},
	  //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		url: baseUrl + projName +  `/UserController/areas.do`,
  		//url: `${baseUrl_sgj}/UserController/areas.do`,
  		data:params,
	}).then(res => res.data);
};
//基本信息修改
export const updateBasicInfo = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_sgj}/UserController/updateMember.do`,
  		url: baseUrl + projName +  `/UserController/updateMember.do`,
  		data:params,
	}).then(res => res.data);
};

//上传图片
export const uploadPic = params =>{//`${baseUrl_sgj}/FileController/uploadData.do`
	return axios.post(baseUrl + projName +  `/FileController/uploadData.do`,{ params: params }).then(res => res.data);
};




//公司信息获取
/*export const getCompanyInfo = params =>{
	return axios.get(`${baseUrl_sgj}/UserApplicationController/findApplication.do`,{ params: params }).then(res => res.data);
};*/

//查询所有公司和商标信息
export const getAllCompTmInfo = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_sgj}/UserApplicationController/organizationList.do`,
  		url: baseUrl + projName +  `/UserApplicationController/organizationList.do`,
  		data:params,
	}).then(res => res.data);
};
//查询所有公司信息
export const getAllCompanyInfo = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'get',
  		//url: `${baseUrl_sgj}/UserApplicationController/organizations.do`,
  		url: baseUrl + projName +  `/UserApplicationController/organizations.do`,
  		data:params,
	}).then(res => res.data);
};

//添加公司信息
export const addCompanyInfo = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_sgj}/UserApplicationController/addApplication.do`,
  		url: baseUrl + projName +  `/UserApplicationController/addApplication.do`,
  		data:params,
	}).then(res => res.data);
};
//修改公司信息
export const editCompanyInfo = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_sgj}/UserApplicationController/editApplication.do`,
  		url: baseUrl + projName +  `/UserApplicationController/editApplication.do`,
  		data:params,
	}).then(res => res.data);
};
//查询公司与商标的依赖
export const queryCompTmRely = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_sgj}/ApplicationRelationController/findApplicationTradeMark.do`,
  		url: baseUrl + projName +  `/ApplicationRelationController/findApplicationTradeMark.do`,
  		data:params,
	}).then(res => res.data);
};
//添加公司与商标的依赖
export const addCompTmRely = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_sgj}/ApplicationRelationController/addApplicationTradeMark.do`,
  		url: baseUrl + projName +  `/ApplicationRelationController/addApplicationTradeMark.do`,
  		data:params,
	}).then(res => res.data);
};
//删除公司与商标的依赖
export const deleteCompTmRely = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_sgj}/ApplicationRelationController/deleteApplicationTradeMark.do`,
  		url: baseUrl + projName +  `/ApplicationRelationController/deleteApplicationTradeMark.do`,
  		data:params,
	}).then(res => res.data);
};



//查询所有用户(子账号)信息
export const getAllUsersInfo = params =>{
  return axios({
      //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      method: 'post',
      //url: `${baseUrl_sgj}/UserController/findChildAll.do`,
      url: baseUrl + projName +  `/UserController/findChildAll.do`,
      data:params,
  }).then(res => res.data);
};
//查询单个用户(子账号)信息,详情
export const getUserInfoDetail = params =>{//`${baseUrl_sgj}/UserController/findChilOne.do`
	return axios.get(baseUrl + projName +  `/UserController/findChilOne.do`,{ params: params }).then(res => res.data);
};
//添加用户(子账号)
export const addUserInfo = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/json;charset=UTF-8'},
  		method: 'post',
  		//url: `${baseUrl_sgj}/UserController/addChild.do`,
  		url: baseUrl + projName +  `/UserController/addChild.do`,
  		data:params,
	}).then(res => res.data);
};
//修改用户(子账号)信息
export const editUserInfo = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_sgj}/UserController/editChild.do`,
  		url: baseUrl + projName +  `/UserController/editChild.do`,
  		data:params,
	}).then(res => res.data);
};
//发送手机验证码
export const getPhoneCode = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_sgj}/UserController/phoneValidate.do`,
  		url: baseUrl + projName +  `/UserController/phoneValidate.do`,
  		data:params,
	}).then(res => res.data);
};
//验证手机验证码
export const validatePhoneCode = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_sgj}/UserController/validate.do`,
  		url: baseUrl + projName +  `/UserController/validate.do`,
  		data:params,
	}).then(res => res.data);
};
//设置会员状态
export const chgUserState = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_sgj}/UserController/setStatus.do`,
  		url: baseUrl + projName +  `/UserController/setStatus.do`,
  		data:params,
	}).then(res => res.data);
};
//查询用户会员等级
export const getMemberLevel = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_sgj}/UserController/findGrade.do`,
  		url: baseUrl + projName +  `/UserController/findGrade.do`,
  		data:params,
	}).then(res => res.data);
};
//会员升级
export const memberUpdate = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_sgj}/UserController/promote.do`,
  		url: baseUrl + projName +  `/UserController/promote.do`,
  		data:params,
	}).then(res => res.data);
};




//45大类获取
export const getIntCls = params =>{//`${baseUrl_sgj}/UserController/findAllIndustryWord.do`
	return axios.get(baseUrl + projName +  `/UserController/findAllIndustryWord.do`,{ params: params }).then(res => res.data);
};
//根据查询条件获取商标信息
export const getTrademarkLists = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      //headers: {'Content-Type': 'application/json;charset=UTF-8'},
  		method: 'post',
  		//url: `${baseUrl_kjh}/StewardTradeMarkInfo/queryStewardTradeMarkInfoListByParams.do`,
  		url: baseUrl + projName +  `/StewardTradeMarkInfo/queryStewardTradeMarkInfoListByParams.do`,
  		data:params,
	}).then(res => res.data);
};
//商标查询
export const getTrademarks = params =>{//`${baseUrl_kjh}/StewardTradeMarkInfo/queryStewardTradeMarkInfoListByParams.do`
	return axios.get(baseUrl + projName +  `/StewardTradeMarkInfo/queryStewardTradeMarkInfoListByParams.do`,{ params: params }).then(res => res.data);
};

//添加商标管理商标查询
export const getAddTrademarks = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_kjh}/StewardTradeMarkInfo/queryStewardTrademarkByCondition.do`,
  		url: baseUrl + projName +  `/StewardTradeMarkInfo/queryStewardTrademarkByCondition.do`,
  		data:params,
	}).then(res => res.data);
};

/*export const getAddTrademarks = params =>{
  return VueResource({
    //this.$http({
      method:'post',
      url:`${baseUrl}/StewardTradeMarkInfo/queryStewardTrademarkByCondition.do`,
      data:params,
      emulateJSON: true
    //})
  }).then(res => res.data);
};*/

//添加商标信息(批量添加管理)
export const addTrademark = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/json;charset=UTF-8'},
  		method: 'post',
  		//url: `${baseUrl_kjh}/StewardTradeMarkInfo/addStewardTrademarkByUserid.do`,
  		url: baseUrl + projName +  `/StewardTradeMarkInfo/addStewardTrademarkByUserid.do`,
  		data:params,
	}).then(res => res.data);
};
//批量或单个删除商标信息
export const deleteTrademark = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_kjh}/StewardTradeMarkInfo/BatchDelStewardTrademark.do`,
  		url: baseUrl + projName +  `/StewardTradeMarkInfo/BatchDelStewardTrademark.do`,
  		data:params,
	}).then(res => res.data);
};
//批量或单个导出商标信息
/*export const exportTrademarks = params =>{
	return axios({
	    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		url: `${baseUrl_kjh}/StewardTradeMarkInfo/reportStewardTrademark.do`,
  		data:params,
	}).then(res => res.data);
};*/
export const exportTrademarks = baseUrl + projName +  `/StewardTradeMarkInfo/reportStewardTrademark.do?`;//`${baseUrl_kjh}/StewardTradeMarkInfo/reportStewardTrademark.do?`

//查看单个商标信息
export const seeTrademarkDetail = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_kjh}/StewardTradeMarkInfo/queryTrademarkInfoDetails.do`,
  		url: baseUrl + projName +  `/StewardTradeMarkInfo/queryTrademarkInfoDetails.do`,
  		data:params,
	}).then(res => res.data);
};
//统计商标个数
export const getTrademarkNum = params =>{//`${baseUrl_kjh}/StewardTradeMarkInfo/statisticStewardTradeMarkInfo.do`
	return axios.get(baseUrl + projName +  `/StewardTradeMarkInfo/statisticStewardTradeMarkInfo.do`,{ params: params }).then(res => res.data);
};




//根据条件查询专利列表信息
export const getPatentLists = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_kjh}/StewardPatentInfo/queryStewardPatentInfoListByParams.do`,
  		url: baseUrl + projName +  `/StewardPatentInfo/queryStewardPatentInfoListByParams.do`,
  		data:params,
	}).then(res => res.data);
};
//根据条件查询专利(添加专利信息页)
export const getAddPatentLists = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_kjh}/StewardPatentInfo/queryStewardPatentByCondition.do`,
  		url: baseUrl + projName +  `/StewardPatentInfo/queryStewardPatentByCondition.do`,
  		data:params,
	}).then(res => res.data);
};
//根据公告号获取专利法律状态
export const getLegalStatus = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_kjh}/StewardPatentInfo/queryStewardPatentState.do`,
  		url: baseUrl + projName +  `/StewardPatentInfo/queryStewardPatentState.do`,
  		data:params,
	}).then(res => res.data);
};
//添加专利信息
export const addPatent = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/json;charset=UTF-8'},
  		method: 'post',
  		//url: `${baseUrl_kjh}/StewardPatentInfo/addStewardPatentByUserid.do`,
  		url: baseUrl + projName +  `/StewardPatentInfo/addStewardPatentByUserid.do`,
  		data:params,
	}).then(res => res.data);
};
//查看单个商标信息
export const seePatentDetail = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_kjh}/StewardTradeMarkInfo/queryTrademarkInfoDetails.do`,
  		url: baseUrl + projName +  `/StewardPatentInfo/queryStewardPatentInfoDetails.do`,
  		data:params,
	}).then(res => res.data);
};
//批量或单个删除专利信息
export const deletePatent = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_kjh}/StewardPatentInfo/BatchDelStewardPatent.do`,
  		url: baseUrl + projName +  `/StewardPatentInfo/BatchDelStewardPatent.do`,
  		data:params,
	}).then(res => res.data);
};
//批量或单个导出专利信息
/*export const exportPatents = params =>{
	return axios({
	    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		url: `${baseUrl_kjh}/StewardPatentInfo/reportStewardPatent.do`,
  		data:params,
	}).then(res => res.data);
};*/
export const exportPatents = baseUrl + projName +  `/StewardPatentInfo/reportStewardPatent.do?`;//`${baseUrl_kjh}/StewardPatentInfo/reportStewardPatent.do?`
//统计专利个数
export const getPatentsNum = params =>{//`${baseUrl_kjh}/StewardPatentInfo/statisticStewardPatentInfo.do`
	return axios.get(baseUrl + projName +  `/StewardPatentInfo/statisticStewardPatentInfo.do`,{ params: params }).then(res => res.data);
};




//查询消息列表
export const getMsgList = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_kjh}/stewardMessage/queryStewardMessage.do`,
  		url: baseUrl + projName + `/stewardMessage/queryStewardMessage.do`,
  		data:params,
	}).then(res => res.data);
};
//删除消息
export const deleteMsg = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_kjh}/stewardMessage/deleteMessage.do`,
  		url: baseUrl + projName + `/stewardMessage/deleteMessage.do`,
  		data:params,
	}).then(res => res.data);
};
//设置消息已读
export const setMsgRead = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_kjh}/stewardMessage/setMessageRead.do`,
  		url: baseUrl + projName + `/stewardMessage/setMessageRead.do`,
  		data:params,
	}).then(res => res.data);
};
//消息详情
export const getMsgDetail = params =>{
	return axios({
	    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  		method: 'post',
  		//url: `${baseUrl_kjh}/stewardMessage/queryMessageDetail.do`,
  		url: baseUrl + projName + `/stewardMessage/queryMessageDetail.do`,
  		data:params,
	}).then(res => res.data);
};

