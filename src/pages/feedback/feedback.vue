<template>
	<div class="feedbackDetail" >
		<!-- v-loading="loading" -->
		<img class="logo_title" src="../../assets/img/logo_title.png" alt="">
		<!-- 中间资料反馈内容部分 -->
		<div class="center_content">
			<p class="wel_text">{{ companyInfo.apply_name }}，您好！</p>
			<p class="info_tit">商标顾问邀请您为<a :href="indexUrl" target="_blank" class="blue">拾贝</a>选择商标小项：</p>
			<div class="goods_box">
				<div class="goods_info">
					<img class="img" :src="companyInfo.black_white_pic_url " alt="">
					<p class="name">商标名称：{{ companyInfo.trademark_name }}</p>
					<p class="num">服务号：{{ companyInfo.service_id }}</p>
					<p class="num" v-if="isSubmit">确认时间：{{ companyInfo.confirm_time | dateFormat }}</p>
				</div>
				<div class="wechat_ewm">
					<img src="../../assets/img/wxgzh.jpg" alt="">
					<p class="info">关注拾贝服务号</p>
					<p class="info">查看商标办理进度</p>
				</div>
			</div>

			<div v-if="!isSubmit">
				<p class="select_tit">请选择商标小项：<span class="note">（请在商标顾问的帮助下选择商标小项）</span></p>
				<!-- 已选专利列表 -->
				<div class="state" v-for="(info,$draftIndex) in draftInfo">
					<div class="state_list" :class="{'bgc':$draftIndex === draftIndex}">
						<!-- 点击收缩时候先保存入allEvents，然后初始化 -->
						<!-- 展开 -->
						<img class="unwrap" src="~assets/img/release.png" alt="" v-if="info.PackUp" @click="openCurOrder($draftIndex,info)">
						<!-- 收缩 -->
						<img src="~assets/img/shrinkage.png" alt="" v-if="!info.PackUp" @click="closeCurOrder(info)">
						<div class="list_tit clearfix">
							<el-checkbox class="fl" v-model="info.isSelect" @change="selectBigClassFn(info, $draftIndex)"></el-checkbox>
							<!-- @change="selectBigClassFn(info, $draftIndex)" -->
							<p class="fl serial">{{$draftIndex+1>9 ? $draftIndex+1 : '0'+($draftIndex+1)}}</p>
							<p class="fl order">商标类别</p>
							<p class="fl big_name" :class="{isRecommend: info.recommend}">{{info.class_name}}</p>
						</div>
						<p class="mt10" v-if="!hasSomething(info)&&info.PackUp" @click="openCurOrder($draftIndex,info)">请完善商标注册信息</p>

						<!-- 收缩后显示的内容 -->
						<ul class="mt10 clearfix"  v-if="info.PackUp && hasSomething(info)">
							<li class="clearfix mb10">
								<p class="state_name fl" :class="{'msgColor':!info.service_nice_min || !info.service_nice_min.length}">小项信息</p>
								<p class="state_txt fl" :class="{'msgColor':!info.service_nice_min || !info.service_nice_min.length}">
									共{{info.service_nice_min && info.service_nice_min.length || 0}}个小项
									<template v-if="info.service_nice_min && info.service_nice_min.length">
									（<span v-for="item in info.service_nice_min">{{ item.min_name + '；'}}</span>）
									</template>
								</p>
							</li>
						</ul>

						<div class="add mt20" v-if="$draftIndex === draftIndex&&!info.PackUp">
							<p>请选择商标小项：<span>（阿里巴巴创新保平台当前使用的尼斯分类为2017年3月版，上传申报材料时请使用最新版）</span></p>
							<!-- 45大类 -->
							<!-- <ul class="clearfix mt15">
								<li v-for="(item,$index) in bigState" :class="{'click_li':$index+1 == index, 'notChoose': allSelectedBigData.indexOf($index+1) != -1 && $index+1 != index}" class="fl mr10 mb10" @click="selected(item, info)">{{$index+1 < 10 ? '0' + ($index+1) : ($index+1)}}{{item.class_govern_name}}</li>
							</ul> -->
							<div class="events clearfix mt10" style="padding-right:10px;" v-show="selectedBigItem.class_name">
								<div class="events_left fl">
									<div class="head clearfix">
									<!-- 选中名称 -->
										<p>{{selectedBigItem.class_name}}</p>
										<button class="fr" @click="DataFuzzyQuery(searchEvents)" @blur="blurclick">搜索</button>
										<input type="text" v-model="searchEvents" class="fr" placeholder="请输入小项名称、编号或关键词" @keyup="DataFuzzyQuery(searchEvents)" @focus="DataFuzzyQuery(searchEvents)"  >
										<ul class="fuzzyqueryList" v-if="FuzzyQueryData.length">
											<li v-for="item in FuzzyQueryData" @click="FuzzyQueryClick(item.min_id)" v-html="item.min_name"></li>
										</ul>
										<img src="~assets/img/Searchicon.png" alt="">
									</div>
									<!-- {{curSelectedSmallIdList}} -->
									<div class="list_over" v-loading="smallLoading">
										<div class="events_list" v-for="(item,$index) in niceEventsData">
											<!-- 小项头部 -->
											<div class="list_state clearfix" :class="{'mt20':$index !=0}" @click="toggleSmallNav(item)">
												<p class="list_name fl">
													<i class="el-icon-caret-bottom" v-show="!item.shrinkage" style="background-color:#f5f5f5"></i>
													<i class="el-icon-caret-right" v-show="item.shrinkage" style="background-color:#f5f5f5"></i>
													{{item.group_name}}
												</p>
												<p class="state_num fr">{{item.min_data.length}}项</p>
											</div>
											<!-- 小项 -->
											<div class="mt15 pl10" v-if="item.shrinkage">
												<template>
													<el-checkbox-group @change="selectSmallChange(curSelectedSmallIdList,info)" v-model="curSelectedSmallIdList">
														<el-checkbox v-for="(eventsName,eventsindex) in item.min_data" :label="eventsName.min_id" :key="eventsindex">{{eventsName.min_name}}</el-checkbox>
													</el-checkbox-group>
												</template>
											</div>
										</div>
									</div>
									</div>
									<div class="events_right fl">
									<p class="right_tit">小项确认</p>
									<div class="right_num clearfix">
										<p class="right_txt fl">10项内免费，已选<span class="cy">{{curSelectedSmallList.length}}</span>项</p>
										<p class="right_btn fr" @click="resetEvent">重置</p>
									</div>
									<div class="right_list">
										<ul>
											<li v-for="events in curSelectedSmallList" style="text-align:left" class="mb10">
												<i class="el-icon-circle-cross" @click="moveSmall(events.min_id)"></i>
												{{events.min_name}}
											</li>
										</ul>
									</div>
								</div>
							</div>

						</div>

					</div>
				</div>
				<el-dialog
					title="提示"
					:visible.sync="dialogVisible"
					size="tiny"
					>
					<span class="note_info">您选择的商标信息如下，确定提交？</span>
					<div class="info_box">
						<p class="note_lef not_tit">商标类数</p>
						<p class="note_rig not_tit">小项总数</p>
						<p class="note_lef">{{ selectListLen}}</p>
						<p class="note_rig">{{ allNum }}</p>
					</div>
					<span slot="footer" class="dialog-footer">
						<el-button @click="dialogVisible = false">取 消</el-button>
						<el-button type="primary" @click="submitFn">确 定</el-button>
					</span>
				</el-dialog>
				<div class="submit_box">
					<button class="btn_blue" @click="confirmFn()" >提交</button>
				</div>
			</div>

			<div v-if="isSubmit">
				<p class="select_tit">已选择商标小项：</p>
				<!-- 已选商品小项 -->
				<el-table
					:data="tableData"
					style="width: 100%">
					<el-table-column
						prop="index"
						label="序号"
						width="180">
					</el-table-column>
					<el-table-column
						prop="type"
						label="商标类别"
						width="180">
					</el-table-column>
					<el-table-column
						prop="list"
						label="已选小项">
					</el-table-column>
				</el-table>
				<div class="submit_box">
					<button class="btn_blue" @click="goIndexFn">前往拾贝网首页</button>
				</div>
			</div>

		</div>

		<!-- 公司信息 -->
		<div class="conpany_info">
			<p class="text">© 2015-现在 拾贝 All rights reserved 浙ICP备15042618号 | 浙公网安备 33010402001523号</p>
			<p class="text">杭州拾贝知识产权服务有限公司</p>
		</div>

	</div>
</template>
<script>
	import Vue from 'vue'
	import qs from 'qs'
	import uploader from '../../components/uploader/uploader.vue'
	import util from '../../common/js/util.js';
	import Filters from '../../api/filters';
	const userUrl = CONFIG.userUrl;
	const wxUrl = CONFIG.wxUrl;
	const indexUrl = CONFIG.indexUrl;
	const spUrl = CONFIG.spUrl;
	const userQueryUrl = spUrl + '/iprp_servicer/api/findWorkOrderNice';   //客户打开链接时查询接口
	const niceUrl= spUrl + '/api/getNiceClass';  //查询所有商标分类
	const niceEventsUrl = spUrl + '/iprp_servicer/api/getNiceGroupByClassIdForCus';   //查询小项
	const saveUserUrl = spUrl + '/iprp_servicer/api/commitWorkOrderNice';  //客户提交商标类别



	export default {
		components: {
			uploader
		},
		filters: {
			dateFormat: Filters.formatDate.dateFormat,
		},
		data() {
			return {
				indexUrl: indexUrl,
				tableData: [], //已选商标数据
				isSubmit: false, //是否提交
				dialogVisible: false,  //弹窗
				gridData: [{
					date: '2016-05-02',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}],
				loading: true,
				// 查询的草稿信息 work_order_service
				draftInfo: [],
				// 总体输入内容
				proxy_info:{
					"service_name": '杭州拾贝知识产权服务有限公司',
					"contact_name": '',
					"contact_phone": '0571-28253800',
					"proxy_address": null,
					"zip_code": '310000',
					"proxy":null
				},
				// 当前选中的小项id列表
				curSelectedSmallIdList:[],
				// 当前展开的服务单的索引
				draftIndex:'',
				//当前选中的大项的索引，index这儿是个极差的命名，
				index:'',
				audit_material_report_name:'',
				// 当前选中的大类
				selectedBigItem:{},
				// 搜索小项
				searchEvents:'',
				// 模糊查询的结果
				FuzzyQueryData:[],
				// 小项加载loading
				smallLoading: false,
				// 查询到的小项
				niceEventsData:{},
				// 查询出的大类
				bigState:[],
				// 当前选中的小项列表[{}]
				curSelectedSmallList: [],
				showMoreSmallTip: false,
				checked: true,
				companyInfo: {},  //公司信息
				allNum: 0,  //所有小项数量
				selectListLen: 0,  //选择的大项数量
			}
		},
		methods: {
			goIndexFn () {
				location.href = indexUrl;
			},
			confirmFn () {  //确认提交
				let self = this;
				let canSubmit = true;
				self.allNum = 0;
				console.log(self.draftInfo)
				self.selectListLen = 0;
				console.log(self.draftInfo)
				self.draftInfo.forEach(function(item){
					if ( (item.isSelect && !item.service_nice_min) || (item.isSelect && item.service_nice_min && !item.service_nice_min.length)) {
						canSubmit = false;
						self.$alert('请选择商标小项才能提交大类信息', '请完善商标注册信息再提交', {
							confirmButtonText: '确定',
						});
					}
					if (item.service_nice_min && item.service_nice_min.length) {
						self.allNum += item.service_nice_min.length;
					}
					if (item.isSelect) {
						self.selectListLen ++
					}
				})
				if (canSubmit) {
					self.dialogVisible = true;  //弹窗
				}
			},
			bindState(){
				var self = this;
				self.loading = true;
				self.$http.get('/api/findMember?t='+ new Date().getTime())
				.then((response) =>{
					self.loading = false;
					self.wxInBind = response.data.isBindWxAccount || 0;
					self.tbInBind = response.data.isBindTbAccount || 0;
					self.chatdata = response.data.wxAccount;
					self.taobaodata = response.data.taobaoAccount;
				})
				.catch((error) => {
					self.loading = false;
					});
			},
			hasSomething(info){
				return info.service_nice_min && info.service_nice_min.length || info.similar_trademark || info.register_pass_rate || info.risk_desc_register_advice || info.audit_material_report
			},
			//上传材料评审报告
			setUploadedDataMaterialReport(data){
				this.draftIndex = data.indexkey;
				var d = data.data;
				if (d.url) {
					// this.draftInfo[index][data.valueName]= d.url;
					// this.draftInfo[this.draftIndex][data.valueName+'_name']= d.fileName;
					this.draftInfo[this.draftIndex].audit_material_report = d.url;
				}else{
					this.uploaderErrCallback(d);
				}
			},
			resetMaterialReportUploader(valueName, index){
				this.draftIndex = index;
				this.draftInfo[this.draftIndex][valueName] = '';
				this.draftInfo[this.draftIndex][valueName+'_name'] = '';
			},
			// 重置选中的小项
			resetEvent(data){
				this.curSelectedSmallList = [];
				this.curSelectedSmallIdList = [];
				this.curOrderInfo.service_nice_min = [];
			},
			// 保存，初始化
			closeCurOrder(item){
				// this.draftIndex = '';
				item.PackUp = true;
			},
			// 删除选中的小项
			moveSmall(min_id){
				var self = this;
				var curSelectedSmallList = self.curSelectedSmallList;
				var curSelectedSmallIdList = self.curSelectedSmallIdList;
				var copy = [].concat(curSelectedSmallList);
				var copy1 = [].concat(curSelectedSmallIdList);
				for(var i=0; i<copy.length; i++) {
					var small = copy[i];
					if(small.min_id == min_id) {
						// 右侧选中的小项
						curSelectedSmallList.splice(i,1);
						break;
					}
				}
				for(var j=0; j<copy1.length; j++) {
					var id = copy1[j];
					if(id == min_id) {
						// 左侧选中的小项
						curSelectedSmallIdList.splice(j,1);
						break;
					}
				}
				console.log(self.curSelectedSmallIdList)

				self.showMoreSmallTip = curSelectedSmallList.length>10;
				self.hideMoreSmallTip();
			},
			askDelete(index){
				if (this.draftInfo.length === 1) {
					return;
				}
				//收缩展开的大类
				if (this.draftInfo[index].PackUp) {
					this.draftInfo.forEach((item) => {
						item.PackUp = true;
					})
				}
				this.confirmVisible = true;
				this.draftIndex = index;
			},
			// 小项展开收缩切换
			toggleSmallNav(item){
				item.shrinkage = !item.shrinkage
			},
			// 点击左侧小项触发
			selectSmallChange(idList){
				var self = this;
				var niceEventsData = this.niceEventsData;
				this.curSelectedSmallList = (function(){
					var arr = [];
					idList.forEach((id, i) => {
						var smallItem = self.getSmallItem(id);
						if (smallItem) {
							arr.push(smallItem);
						}
					});
					return arr;
				})();
				this.curOrderInfo.service_nice_min = this.curSelectedSmallList;
				this.showMoreSmallTip = this.curSelectedSmallList.length>10;
				this.hideMoreSmallTip();
				self.bigClassIsSelectFn();  //大选项选中状态更新
			},
			hideMoreSmallTip(){
				if (this.showMoreSmallTip) {
					var timer = this.timer;
					timer && clearTimeout(timer);
					this.timer = setTimeout(() => {
						this.showMoreSmallTip = false;
					}, 3000)
				}
			},
			// 根据小项id,从大类下所有小项数据中取得单条小项数据
			getSmallItem(id){
				var niceEventsData = this.niceEventsData;
				var ret = {
					class_id:'',
					group_id:'',
					min_id:'',
					min_name:'',
					ali_id:''
				};
				niceEventsData.some((item, i) => {
					var min_data = item.min_data;
					min_data.some((it, j) => {
						if (it.min_id == id) {
							Object.keys(ret).forEach((name) => {
								ret[name] = it[name];
							});
							return true;
						}
					});
					if (ret.min_id) {return true;}
				});
				if (!ret.min_id) {
					ret = ''
				}
				return ret;
			},
			// 查询小项
			niceEvents(class_id){
				var self = this;
				self.smallLoading = true;
				self.$http.get(niceEventsUrl+"/"+ class_id, {
					params: {
						work_order_id: util.getHashString('work_order_id'),
						key: util.getHashString('key'),
					}
				})
				.then((resp) => {
					self.smallLoading = false;
					for(var i=0;i<resp.data.elements.length;i++){
						// 添加用来识别小项收缩和展开
						resp.data.elements[i].shrinkage = false;
					}
					self.niceEventsData = resp.data.elements;
				})
				.catch((error) => {
					self.smallLoading = false;
				});
			},
			// 大选项选中状态更新
			bigClassIsSelectFn () {
				let self = this;
				// 如果有选择的小项，大项就默认选中,否则未选中
				self.draftInfo.forEach(function(item){
					item.isSelect = true;
					// 暂时全部小摩登选中，等以后后台提供小项的选择信息后再对大项做选中筛选
					// if (item.service_nice_min && item.service_nice_min.length) {
					// 	item.isSelect = true;
					// }
					// else {
					// 	item.isSelect = false;
					// }
				})
			},
			// 是否选择此大类
			selectBigClassFn (info, index) {
				let self = this;
				if (!info.isSelect) {
					info.service_nice_min = [];
				}
				else if (info.isSelect) {
					self.$alert('请选择商标小项才能提交大类信息', '请完善商标注册信息', {
						confirmButtonText: '确定',
					});
				}
				Vue.set(self.draftInfo, index, info);  //刷新视图
			},
			infoFn (){
				var self = this;
				var data = {
					work_order_id:16,
					confirm_step:3
				}
				console.log(util.getHashString('work_order_id'))
				self.loading = true;
				this.$http.get(userQueryUrl, {
					params: {
						work_order_id: util.getHashString('work_order_id'),
						key: util.getHashString('key'),
					}
				})
				.then(function(resp){
					self.loading = false;
					for(var i=0;i<resp.data.work_order_service.length;i++){
						resp.data.work_order_service[i].PackUp = true;
					}
					//  判断是否提交
					if (resp.data.confirm_time) {
						self.isSubmit = true;
					}
					else {
						self.isSubmit = false;
					}

					resp.data.work_order_service.forEach((item, idx) => {
						item.audit_material_report = '';
					});
					// 公司信息
					self.companyInfo = resp.data;
					//服务单部分
					self.draftInfo = resp.data.work_order_service;
					self.draftInfo.forEach(function(item, num){
						self.tableData.push({
							index: num+1,
							type: item.class_name,
							list: item.min_info
						})
					})
					self.bigClassIsSelectFn();  //大选项选中状态更新
					//存储原有的大类
					self.orignBigsData = JSON.parse(JSON.stringify(resp.data.work_order_service));

					self.proxy_info.contact_name = resp.data.trademark_contact && resp.data.trademark_contact.contact_name;

					//选中的大类id list
					self.allSelectedBigData = (function(){
						var arr = [];
						self.draftInfo.forEach((item, index) => {
							arr.push(item.class_id);
						});
						return arr;
					})();
				})
				.catch((err) => {
					self.loading = false;
					if (err && err.msg) {
						this.$message.error(err.msg);
					}
				});
			},
			// 搜索框初始化
			blurclick(){
				setTimeout(()=>{
					this.FuzzyQueryData = [];
					this.searchEvents = '';
				},200);
			},
			// 根据右侧小项的数据，获得左侧选中的数据
			getSmallIdList(){
				var curSelectedSmallList = this.curSelectedSmallList;
				var arr = [];
				curSelectedSmallList.forEach((item, i) => {
					if (item.min_id) {
						arr.push(item.min_id);
					}
				});
				return arr;
			},
			// 点击选中查询的内容
			FuzzyQueryClick(id){
				var curSelectedSmallIdList = this.curSelectedSmallIdList;
				if (curSelectedSmallIdList.indexOf(id) === -1) {
					curSelectedSmallIdList.push(id);
				}else{
					this.$message('该小项已添加');
				}
				this.selectSmallChange(curSelectedSmallIdList);
				this.FuzzyQueryData = [];
				this.searchEvents = '';
			},
			// 模糊查询
			DataFuzzyQuery(data){
				var self = this;
				data = data.toUpperCase();
				self.FuzzyQueryData = [];
				if (!data) {return;}
				for(var i=0;i<self.niceEventsData.length;i++){
					for(var h=0;h<self.niceEventsData[i].min_data.length;h++){
						var min_name = self.niceEventsData[i].min_data[h].min_name
						var idx1 = min_name.indexOf(data);
      			var idx2 = min_name.indexOf(data.toLowerCase());
      			var index = idx1 != -1 ? idx1 : idx2 != -1 ? idx2 : -1;
      			if(index != -1){
      				var ret = Object.assign({}, self.niceEventsData[i].min_data[h]);
      				ret.min_name = min_name.slice(0, index) + '<b>'+ data + '</b>' + min_name.slice(index+data.length);
      				self.FuzzyQueryData.push(ret);
      				//console.log(self.FuzzyQueryData)
      				if(self.FuzzyQueryData.length>=30){
      					return false;
      				}
      			}
					}
				}
			},
			// 打开当前列表
			openCurOrder(orderindex, info){
				var self = this;
				self.draftIndex = orderindex;

				//展开当前的
				var draftInfo = self.draftInfo;
				draftInfo.forEach((it, index) => {
					it.PackUp = true;//true为折叠
				})
				info.PackUp = false;

				// 设置当前选中的大类
				// self.selectedBigItem = info.class_id ? self.bigState[info.class_id-1] : {}
				self.selectedBigItem = info;

				self.index = info.class_id || '';

				self.curOrderInfo = info;

				//右侧选中的小项
				self.curSelectedSmallList = info.service_nice_min || [];
				self.curSelectedSmallIdList = self.getSmallIdList();

				//如果有大类，则查询小项
				if (info.class_id) {
					self.niceEvents(info.class_id);
				}
			},
			// 提交审核修改
			submitFn () {
				let self = this, postArr=[];
				self.draftInfo.forEach(function(item){
					if (item.isSelect && item.service_nice_min && item.service_nice_min.length) {
						postArr.push(item);
					}
				})
				postArr = postArr.map(function(info){
					return {class_id: info.class_id, service_nice_min: info.service_nice_min}
				})
				let postData = {
					work_order_id: util.getHashString('work_order_id'),
					key: util.getHashString('key'),
					work_order_service: postArr
				}
				console.log(postData)
				let newUrl = 'feedback?work_order_id=' + util.getHashString('work_order_id') + '&key=' + util.getHashString('key');
				self.$http.post(saveUserUrl, postData).then(function(resp){
					if(resp.data.code == "success") {
						window.location.reload()
					}
				})
				// .catch((error) => {
				// 	this.$message.error(err.msg);
				// });
			}
		},
		mounted() {
			// this.bindState();
			this.infoFn(); //获取原始数据
			document.title = '拾贝知识产权-小项确认';
		}
	}
</script>
<style lang="scss">
.feedbackDetail {
	background-image: linear-gradient(105deg, #10AEFF 0%, #00A9FF 95%);
	min-height: 100%;
	width: 100%;
	color: #333;
	position: absolute;
	.logo_title {
		width: 129px;
		height: 21px;
		margin: 84px auto 50px auto;
		display: block;
	}
	.center_content {
		position: relative;
		width: 1200px;
		height: auto;
		min-height: 560px;
		margin: 0 auto;
		background: #fff;
		box-sizing: border-box;
		padding: 40px 60px;
		.wel_text {
			color: #333;
			font-size: 16px;
			text-align: left;
			margin: 0 0 30px 0;
		}
		.info_tit {
			font-size: 14px;
			margin-bottom: 15px;
			.blue {
				color: #3DB1FA;
			}
		}
		.goods_box{
			width: 100%;
			height:90px;
			position: relative;
			.goods_info {
				position: absolute;
				left: 0;
				top: 0;
				width: 70%;
				.img {
					width: 90px;
					height: 90px;
					float: left;
					background: #D8D8D8;
				}
				.name {
					float: left;
					width: 70%;
					margin: 8px 0 0 15px;
					font-size: 13px;
					text-align: left;
				}
				.num {
					float: left;
					width: 70%;
					text-align: left;
					margin: 10px 0 0 15px;
				}
			}
			.wechat_ewm {
				position: absolute;
				right: 0;
				top: -50px;
				width: 30%;
				img {
					width: 100px;
					height: 100px;
					float: right;
					margin-bottom: 5px;
					background: #ccc;
					display: block;
				}
				.info {
					width: 100%;
					font-size: 12px;
					color: #999;
					float: right;
					text-align: right;
					padding-right: 7px;
				}
			}
		}
		.select_tit {
			font-size: 14px;
			margin: 30px 0 10px 0;
			.note {
				color: #999;
			}
		}
		.submit_box {
			width: 100%;
			text-align:center;
			margin: 50px auto 0;
			.btn_blue {
				width: 140px;
				height:42px;
				font-size: 14px;
				color:#fff;
				background: #3DB1FA;
				border-radius: 3px;
			}
		}
		button.add_big{height:30px;padding:0 15px;line-height:28px;border-radius: 2px;border: 1px solid #479CFF;color:#479CFF;font-size:13px;margin: 14px 0 15px;
			span{color:#479CFF;}
		}
		.state{border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding:0px;margin-top: -1px;}
		.shadow{box-shadow: 0 1px 4px 0 rgba(0,0,0,0.08);background: #F9F9F9;}
		div.state_list{padding:22px 0 20px;position: relative;
			.cy { color: #F5A623;}
			>p{font-size: 14px;color: #479CFF;cursor:pointer;margin-left: 58px;width:126px;}
			>img{
				position: absolute;top:22px;right:22px;width:26px;
				&:hover{cursor: pointer;}
			}
			.list_tit{padding:0 22px;
				>p{font-size: 14px;color: #556677;line-height:20px;text-align:left;}
				.serial{width:38px;}
				.order{width:128px;}
				.big_name{padding-left: 22px;}
				.isRecommend{background: transparent url(~assets/img/jian.png) 0 0 no-repeat;}
			}
			// 详情
			ul{padding-left:58px;padding-right: 50px;
				li{
					// 数据为空，高亮
					.errNull{color: #F64744;}
					p{font-size: 13px;color: #7F8FA4;line-height:18px;}
					.state_name{width:128px;}
					.state_txt{width:82%;word-break: break-all;}
				}
			}
			// 小项
			.add{border-top:1px solid #DFE2E5;padding-top:20px;padding-right: 44px;margin-left: 58px;
				>p{
					font-size: 14px;color: #556677;font-weight: 600;
					span{font-size: 12px;color: #A8AFB5;font-weight: 400;}
				}
				ul{padding-left:0;padding-right:0;
					li{border: 1px solid #DFE2E5;border-radius: 2px;width:116px;height:30px;line-height:30px;text-align:center;font-size: 13px;color: #556677;cursor:pointer;background-color:#fff;}
					.click_li{border: 1px solid #479CFF;color: #479CFF;background: #F8FCFF;}
					.notChoose{background: #F5F5F5;color: #A8AFB5;cursor:text;}
				}
				// 小项选择
				.events{
					>div{border: 1px solid #DFE2E5;}
					.events_left{height:450px;width:72%;background-color:#fff;padding:20px;
						.head{position: relative; overflow: visible;
							p{width:116px;height:30px;line-height:30px;border: 1px solid #3DB1FA;border-radius: 2px;font-size: 13px;color: #3DB1FA;text-align:center;display:inline-block;background: #F8FCFF;}
						}
						input{width:246px;height:30px;border: 1px solid #DFE2E5;border-radius: 2px;padding-left:30px;}
						.fuzzyqueryList{position: absolute;top:35px;right:0;max-height: 300px;overflow-y: auto;z-index: 10;width:306px;border-radius:3px;border:1px solid #DFE2E5;background-color: #fff;
							li{width:100%;border: 0;text-align:left;padding-left:10px;line-height:30px;font-size:13px;color:#556677;box-sizing: border-box;
								b{font-weight: normal;color:#F5A623;}
							}
							li:hover{background-color: #f5f5f5;}
						}
						button{background: #3DB1FA;border-radius: 2px;font-size: 14px;color: #FFFFFF;height:30px;line-height:30px;display:inline-block;width:60px;vertical-align: top;}
						img{width:14px;height:14px;position: absolute;right:282px;top:8px;}
						.list_over{overflow: auto;height:380px;margin-top: 18px;}
						// 小项部分
						.events_list{
							.list_state{width:100%;height:30px;opacity: 0.9;background: #F5F5F5;padding-left:27px;padding-right: 10px;position: relative;cursor: pointer;
								p{font-size: 13px;color: #556677;line-height:30px;}
								i{position: absolute;top:9px;width:14px;height:14px;left:8px;}
							}
						}
					}
					.events_right{width:28%;border-left:0;background-color:#f6f6f6;
						.right_tit{font-size: 16px;color: #556677;padding:20px 30px 0;}
						.right_num{margin-top:10px;margin-bottom: 10px;padding:0px 30px;
							.right_txt{font-size: 13px;color: #7F8FA4;line-height:24px;}
							.right_btn{border: 1px solid #F5A623;border-radius: 2px;font-size: 12px;color: #F5A623;width:60px;height:24px;line-height: 22px;text-align:center;cursor:pointer;}
						}
						.right_list{
							ul{height:360px;box-sizing: border-box;padding:0px 30px;overflow-y: auto;
								li{border:0;width:100%;text-overflow: ellipsis;white-space: normal;white-space: nowrap;overflow: hidden;position: relative;line-height:16px;height:16px;cursor:default;background: rgba(0,0,0,0);
									i{background:rgba(0,0,0,0);color:#DFE2E5;font-size: 1.1em;vertical-align:top;margin-right:5px;margin-top:1px;cursor:pointer;margin-left: 1px;}
								}
								li:hover{
									i{color: #F5A623;}
								}
							}
							.add_cost{background: #FFFFFF;border-top: 1px solid #DFE2E5;height:30px;
								p{
									font-size: 13px;color: #556677;line-height:30px;text-align:right;padding-right: 10px;
									.cy{padding-right: 20px;cursor: default;}
								}
							}
						}
					}
				}
				.footer_inform{
					>p{font-size: 14px;color: #556677;padding:20px 0;font-weight: 600;
						span{font-size: 12px;color: #A8AFB5;font-weight: normal;}
					}
				}
			}
			.del{
				position: absolute;right: 20px;bottom: 10px;font-size: 13px;color: #7F8FA4;
				&:hover{color: #479CFF;}
			}
			a.disabled{
				color: #ccc;
				&:hover{text-decoration: none;color: #ccc;cursor: default;}
			}
		}
		.bgc{background-color:#F9F9F9;}
		div.state_list:hover{background: #F9F9F9;box-shadow: 0 1px 4px 0 rgba(0,0,0,0.08);}

	}
	.conpany_info {
		width: 1200px;
		height: auto;
		text-align: center;
		margin: 140px auto 60px auto;
		.text {
			opacity: 0.5;
			font-family: MicrosoftYaHei;
			font-size: 13px;
			color: #FFFFFF;
			letter-spacing: 0.28px;
			text-align: center;
		}
	}
	// 对插件样式的修改
	.percentage_txt{position: relative;
		input{width:120px;height:30px;padding: 3px 25px 3px 10px;transition: border-color .2s cubic-bezier(.645,.045,.355,1);border-radius:2px;border: 1px solid #bfcbd9;line-height:30px;text-align: left;}
		.percentage{position: absolute;left:100px;top:2px;font-size: 14px;color: #556677;line-height:30px;}
		.prompt{font-size: 13px;color: #7F8FA4;line-height:14px;display:inline-block;vertical-align: middle;margin-left: 5px;}
	}
	.el-form-item__content{width:65%;}
	.el-checkbox{vertical-align: middle;margin-right:10px; margin-bottom: 10px;}
	.el-checkbox .el-checkbox__label{font-size: 12px;color: #556677;width:130px;display:inline-block;word-wrap:break-word;word-break:break-all; white-space:pre-wrap;vertical-align: top;padding-left: 10px;}
	.el-checkbox+.el-checkbox{margin-left: 0;}
	.el-input__inner,.el-textarea__inner{font-size: 13px;border-radius:2px;}
	// 弹框公用样式继承自common.css
	.state_preview{
		.el-dialog{
			width:310px;
			.confirm_tip{
				text-align: right;
				p{text-align: left;font-size: 14px;color: #556677;padding-bottom: 20px;line-height: 20px;}
			}
		}
	}
	// 小项选中时候的字体颜色
	.ptc{
		.el-checkbox__label{color: #479CFF;}
	}

	.note_lef, .note_rig {
		float: left;
		width: calc(50% - 20px);
		height: 40px;
		line-height: 40px;
		text-align:center;
		border-bottom: 1px solid #dfe6ec;
	}
	.not_tit {
		background: #eef1f6;
		margin-top: 12px;
	}
	.note_info {
		margin-left: 20px;
	}
	.el-dialog__header {
		text-align: left;
	}
	.el-dialog__footer {
		text-align:center;
	}
	.info_box {
		width: 100%;
		margin-left: 20px;
		overflow: hidden;
	}
	.smallFeePopover{
		background: #F5A623!important;border-color: #F5A623!important;padding: 10px!important;
	 .smallFee{margin-bottom: 0;color: #fff;text-align: left;line-height: 18px;font-size: 13px;}
	 .popper__arrow, .popper__arrow::after{border-top-color: #F5A623!important;}
	}
	.center_content:after {
		content: '';
		position:absolute;
		bottom: -102px;
		left:0;
		width: 100%;
		height: 102px;
		background: url(~assets/img/bottom_bg.png) no-repeat;
	}
}
</style>
