<template>
	<!-- 商标列表 -->
	<div class="list_table_box" v-loading.fullscreen="loading" :element-loading-text="loadingText">
		<table class="list_table" v-if="resultList && resultList.length">
			<thead>
				<tr class="t_head">
					<th>商标基本信息</th>
					<th :width="showSubject ? '200' : '360'">商标类别</th>
					<!-- <th>法律状态</th> -->
					<th v-if="showSubject" width="260">申请人</th>
					<!-- <th v-if="!showSubject || approximateBol">托管状态</th> -->
					<!-- <th>设置核心商标</th> -->
					<th width="130">操作</th>
				</tr>
			</thead>
			<tbody>
				<tr class="t_item" v-for="(item, index) in resultList" >
					<td>
						<el-checkbox v-model="item.isSelect" v-show="item.showCheckbox" class="checkbox" :disabled="item.state === 1" @change="addLists(item, index)"></el-checkbox>

						<div class="tm_img">
							<a class="tm_img_a" target="_blank" :href="`${userUrl}/iprp/#/tradeDetail?regNo=${item.applicantOther2}&intCls=${item.intCls}`" :title="item.tmName">
								<!-- <img v-if="item.core" src="~assets/img/guanjia/icon/core.png" class="core" height="20" width="16" alt=""> -->
								<img class="trade_img" :src="item.tmImg" alt="">
								<span v-if="item.core" class="core">核心商标</span>
							</a>
						</div>
		        <div class="text_line top_line">
		        	<span class="key">商标名称：</span>
		        	<a v-if="item.state==1" class="value" target="_blank" :href="userUrl +'/iprp/#/tradeDetail?trademarkId='+ item.id" :title="item.tmName">{{ item.tmName }}</a>
							<a v-if="item.state!=1" class="value" target="_blank" :href="`${userUrl}/iprp/#/tradeDetail?regNo=${item.applicantOther2}&intCls=${item.intCls}`" :title="item.tmName">{{ item.tmName }}</a>
		        </div>
		        <div class="text_line ">
		        	<span class="key">申请时间：</span>
		        	<span class="value">{{ item.appDate || '--'}}</span>
		        </div>
		        <!-- <div class="text_line">
		        	<span class="key">注册时间：</span>
		        	<span class="value">{{ item.regDate || '--'}}</span>
		        </div> -->
		        <div class="text_line">
		        	<span class="qiye_tag" v-if="item.applicationType">{{ item.applicationType == 1 ? '我的商标' : '竞品商标' }}</span>
		        	<span class="already">{{ item.currentStatus }}</span>
		        	<span class="already" v-if="item.state==1">已托管</span>
		        </div>
					</td>
					<td>{{item.intCls>9 ? item.intCls : '0'+item.intCls}}类-{{ cateIdData[item.intCls-1].goodsname }}</td>
					<!-- <td>{{ item.currentStatus }}</td> -->
					<td v-if="showSubject" @click="toCenterTrademark(item)"><div class="max_200" :title="item.applicantCn">{{item.applicantCn}}</div></td>
					<!-- <td v-if="!showSubject || approximateBol" ><span class="no_tg_status" :class="{'tg_status': item.state==1}">{{ item.state==1 ? '已托管' : '未托管' }}</span></td> -->
					<td>
						<span v-if="item.applicationType == 1 && item.state == 1" class="b_link gray" @click="moveHost(item)">取消托管</span>
						<span v-else-if="item.applicationType == 2 && item.state == 1" class="b_link gray" @click="moveHost(item)">取消监测</span>
						<span v-else-if="!item.applicationType" class="b_link" @click="showSetDialog(item)">添加</span>
						<span v-else-if="item.applicationType == 1 && !item.state" class="b_link" @click="showSetDialog(item)">托管</span>
						<span v-else-if="item.applicationType == 2 && !item.state" class="b_link" @click="showSetDialog(item)">监测</span>
						<a v-if="item.state==1 && item.id" class="b_link gray" target="_blank" :href="userUrl +'/iprp/#/tradeDetail?trademarkId='+ item.id">查看详情</a>
						<a v-else class="b_link gray" target="_blank" :href="`${userUrl}/iprp/#/tradeDetail?regNo=${item.applicantOther2}&intCls=${item.intCls}`">查看详情</a>
					</td>
				</tr>
				<!-- <tr class="t_item t_option" v-if="resultList.length && !batchBol">
					<td>
						<el-checkbox v-model="checkedAll" v-show="showCheckAll" @change="selectAllFn">全选</el-checkbox>
					</td>
					<td colspan="2" v-if="showSubject"></td>
					<td v-if="!showSubject"></td>
					<td>
						<button class="btn_blue_o" v-if="!showSubmit" @click="editListFn">批量托管</button>
						<button class="btn_gray" style="margin-right:8px;" v-if="showSubmit" @click="cancelFn">取消</button>
						<button class="btn_blue_o" v-if="showSubmit" @click="submitFn">确认托管</button>
					</td>
				</tr> -->
			</tbody>
		</table>
		<div class="setup_null" v-if="(!resultList.length || !resultList) && !loading">
    	<div>
    		<img src="~assets/img/guanjia/notm.png" alt="">
    		<p class="mt10">未查询到该企业旗下商标</p>
    		<!-- <button class="skip mt15" @click="ToHomePage">跳过这一步</button>
    		<button class="oldto mt15 ml10" @click="againName">返回设置企业</button> -->
    	</div>
    </div>

    <el-dialog
		  title="添加"
		  :visible.sync="setDialogVisible"
		  custom-class="list_center_dialog" :show-close="false" :close-on-click-modal="false" :lock-scroll="false">
		  <div class="radio_dialog">
		  	<span>将当前商标添加为：</span>
		  	<el-radio class="radio" v-model="applicationType" :label="1">我的商标</el-radio>
  			<el-radio class="radio" v-model="applicationType" :label="2">竞品商标</el-radio>
		  </div>
		  <div class="btn_dialog mt20">
		  	<el-button size="small" @click="cancelSet">取 消</el-button>
		    <el-button size="small" type="primary" @click="addHost">确 定</el-button>
		  </div>
		</el-dialog>

		<el-dialog
		  title="温馨提示"
		  :visible.sync="dialogHostAll"
		  custom-class="center_dialog" :show-close="false" :close-on-click-modal="false" :lock-scroll="false">
		  您的商标托管数量不足<br>已托管<span style="font-weight:normal;color:#F64744;">{{used}}</span>个，托管上限<span style="font-weight:normal;color:#F64744;">{{usable}}</span>个
		  <div class="btn_dialog mt20">
		  	<el-button size="small" @click="dialogHostAll = false">取 消</el-button>
		    <el-button size="small" type="primary" @click="dialogHostAll = false">确 定</el-button>
		  </div>
		</el-dialog>
	</div>
</template>
<script>
	import Vue from 'vue';
	import intClsData from 'src/common/js/intClsData.js'
	import qs from 'qs';
	const stewardUrl = CONFIG.stewardUrl;
	const userUrl = CONFIG.userUrl;
	const LoadingText = '加载中...';
	export default {
		props:{
			resultList: { //列表数据
				type: Array,
				default: []
			},
			showSubject:{
				type: Boolean,
				default: false,
			},
			enterpriseType: { //是否为企业引用
				type: Boolean,
				default: false
			},
			batchBol: { //是否为企业引用
				type: Boolean,
				default: false
			},
			approximateBol: { //申请人和托管状态是否同时存在
				type: Boolean,
				default: false
			},
			isSubmitSuccess: { //是否提交成功
				type: Boolean,
				default: false
			},
		},
		data () {
			return {
				used:0,
				usable:0,
				dialogHostAll: false,

				userUrl: userUrl,
				loading: false,
				loadingText: LoadingText,
				curItem: {},
				applicationType: '', // 1我的2竞品
				setDialogVisible: false,
				checkedAll: false,
				showCheckAll: false, //是否显示全选
				showSubmit: false,  //是否显示确认取消按钮
				cateIdData: intClsData.cateIdData,
				checkList:[],
				listCheck:[]
			}
		},
		mounted(){

		},
		methods: {
			// 取消
			/*cancelFn () {
				this.showCheckAll = false;
				this.showSubmit = false;
				this.checkedAll = false;
				this.resultList.forEach( (item) => {
					item.isSelect = false;
					item.showCheckbox = false;
				})
    		this.$emit('showCheckBox', false);
    		sessionStorage.removeItem('selectList');
			},*/
			// 去企业详情
			toCenterTrademark(item){
				this.$router.push({path: `/steward/enterpriseDetail/${item.applicantCn}`});
			},
			// 判断是否需要全选
			isSelectAllFn () {
				for (var i = 0; i < this.resultList.length; i++) {
					let info = this.resultList[i];
					if (!info.isSelect) {
						this.checkedAll = false;
						break
					}
					else{
						this.checkedAll = true;
					}
				}
			},
			addLists(item, index){
				Vue.set(this.resultList, index, item);  //刷新视图
				this.isSelectAllFn();   //判断是否需要全选
				let selectList = JSON.parse(sessionStorage.getItem('selectList')) || [];
				if (item.isSelect) {
					selectList.push(item);
				}
				else{
					let index_ = selectList.indexOf(item);
					selectList.splice(index_, 1);
				}
				sessionStorage.setItem('selectList', JSON.stringify(selectList));
				console.log(selectList)
			},
			// 显示设置弹窗
			showSetDialog(item){
				this.curItem = item;
				if (item.applicationType) {
					this.addHost(true);
				}else{
					this.setDialogVisible = true;
				}
			},
			// 取消设置弹窗
			cancelSet(){
				this.curItem = {};
				this.setDialogVisible = false;
			},
			//取消托管
      moveHost(item){
				let str = item.applicationType == 1 ? '托管' : '监测';
      	let data = {
      		trademarkIds:[item.id]
      	}
      	this.startLoading('取消中，请稍候...')
      	this.$http.post(stewardUrl + '/smallStewardTadeMark/deleteStewardTrademarkinfo',data)
      	.then((resp) => {
      		this.initLoadingStatus();
      		item.state = 0;
      		item.core = null;
      		this.$message.success('取消'+str+'成功');
      	})
      	.catch((err) => {
      		this.initLoadingStatus();
      	})
      },
			startLoading(loadingText){
				this.loading = true;
      	this.loadingText = loadingText || LoadingText;
			},
			initLoadingStatus(){
				this.loading = false;
      	this.loadingText = LoadingText;
			},
			//添加托管
			addHost(isDirect){
				//this.$emit('addHost',item);
				let item = this.curItem;
				let str = '';
				if (isDirect === true) {
					str = item.applicationType == 1 ? '托管' : '监测'
				}else{
					str = '添加'
				}
				let applicationType = isDirect === true ? item.applicationType : this.applicationType;
				if (!applicationType) {
					this.$message.warning('请选择要添加的商标类型');
					return;
				}
      	let data = {
      		applicationName: item.applicantCn,
      		trademarkKey:item.applicantOther2,
      		intCls:item.intCls + '',
      		applicationType: applicationType
      	}
      	this.startLoading('请稍候...')
      	this.setDialogVisible = false;
      	this.$http.post(stewardUrl + '/smallStewardTadeMark/addStewardTrademarkinfo',data)
      	.then((resp) => {
      		let data = resp.data;
      		this.initLoadingStatus();
      		if (data.status == 201) {
	      		this.updateOtherItems(item, applicationType);
	      		item.applicationType = applicationType;
	      		item.state = 1;
	      		this.$message.success(str + '成功');
      		}
      	})
      	.catch((err) => {
      		this.initLoadingStatus();
      		if(err.response.data.status == 409){
						this.used = err.response.data.msg.used;
						this.usable = err.response.data.msg.usable;
	      		this.dialogHostAll = true;
					}else{
						if (isDirect !== true) {
	      			this.setDialogVisible = true;
	      		}
	      		this.$message.error(str + '失败');
					}
      	})
			},
			// 更新列表中其它同名企业的商标的企业属性，从而避免托管时的弹框选择
			updateOtherItems(item, applicationType){
				this.resultList.forEach((it) => {
					if (it.applicantCn === item.applicantCn) {
						it.applicationType = applicationType;
					}
				});
			},
			// 批量托管
			editListFn () {
				this.showCheckAll = true;
				this.showSubmit = true;
				this.resultList.forEach( (item) => {
					item.showCheckbox = true;
					if(item.state){
						item.isSelect = true;
					}
				})
				this.$emit('editFn');
			},
			// 全选
			selectAllFn () {
				this.resultList.forEach( (item) => {
					if(!item.state){
						item.isSelect = this.checkedAll;
					}
				})
				let selectList = JSON.parse(sessionStorage.getItem('selectList')) || [];
				if (this.checkedAll) {
					selectList = selectList.concat(this.resultList);
				}
				else{
					this.resultList.forEach( (item) => {
						let i = selectList.indexOf(item);
						selectList.splice(i, 1);
					})
				}
				sessionStorage.setItem('selectList', JSON.stringify(selectList));
			},
			// 确认托管 提交
			submitFn () {
				let selectList = JSON.parse(sessionStorage.getItem('selectList')) || [];
				let list_ = [];
				if (!selectList.length) {   //如果没选择数据
					list_ = [];
				}
				else{
					selectList.forEach( (item) => {
						if (item.isSelect && item.state != 1) {
							list_.push({key: item.applicantOther2, intCls:item.intCls})
						}
					})
				}

      	if (list_.length==0) {
      		if(this.enterpriseType){
      			this.$emit('goHomePage');
      		}else{
      			this.$message({
	            type: 'error',
	            message: '请选择需要托管的商标!'
	          });
      		}
      	}
      	else{
      		this.showCheckAll = false;
					this.showSubmit = false;
      		this.$emit('submit', list_);
      	}
			},
			//翻页
			/*currentChange() {
				var route = this.$route;
        var path = route.path;
        var newQuery = $.extend({}, route.query, {page: currentPage || 1});
        this.$router.replace({path: path, query: newQuery});
			}*/
		},
		watch: {
			/*resultList () {
				this.isSelectAllFn();   //判断是否需要全选
			},
			isSubmitSuccess (v) {
				if (v) {
					this.showCheckAll = false;
					this.showSubmit = false;
				}
				else{
					this.showCheckAll = true;
					this.showSubmit = true;
				}
			}*/
		}
	}

</script>

<style lang="scss">
	.list_table_box {
		width: 100%; height:auto;padding:0;
		.list_table {
			width:100%;
			th, td {
				text-align:center;
			}
			.t_head {
				background: #eee; height:39px;border-right:1px solid #eee;width:940px;
				th { color:#333; font-size:13px; font-weight:normal;}
				th:first-child {text-align:left; padding-left:20px;}
			}
			.t_item {
				border: 1px solid #E6E6E6; border-top:none; background:#fff;
				td:first-child {
					padding:18px 0 20px 20px; text-align:left; width:350px;
					.checkbox {float:left; margin:30px 10px 0 0; }
					.tm_img {
						width:80px; height:80px; float:left; background: #fff; display:inline-block; margin:0 15px 0 0; position:relative;cursor: pointer; border:1px solid #eee; overflow:hidden;
						.core {position:absolute; bottom:0; left:0; z-index:10; color:#FF9A2F;width:100%; height:25px;line-height: 25px; background:#FFF7E9;text-align: center;font-size: 13px;}
						.trade_img{width:80px;height:80px;}
					}
					.text_line {
						font-size:13px; margin-bottom: 10px; width:200px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; float:left; margin-bottom:6px;
						.key {color:#999}
						.value {color:#151515;}
						.qiye_tag{width:66px;height:20px;border-radius:20px;border:1px solid #44B74B;font-size:13px;color: #44B74B;display: inline-block;text-align: center;line-height: 18px;margin-right: 10px;}
						.already{width:53px;height:20px;border-radius:20px;border:1px solid #3DB1FA;font-size:13px;color: #3DB1FA;display: inline-block;text-align: center;line-height: 18px;margin-right: 10px;}
					}
					.top_line {margin-top:5px;cursor: pointer;}
				}
				td { font-size: 13px; color: #666666;}
				td{
					.b_link{
						color:#3db1fa;cursor: pointer;display: block;margin: 20px 0;
						&:hover{color:#3db1fa;}
					}
					.gray {color: #999;}
					.no_tg_status{display: inline-block;width:60px;height:24px;line-height: 24px;text-align: center;background-color: rgba(255,154,47,0.1);border-radius:12px;color:#FF9A2F;font-size: 13px;}
					.tg_status{color: #999999;background-color: rgba(163,152,142,0.1);}
					//.max_200 {width:200px; *width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; padding:0 5px;}
				}
			}
			.t_option {
				td {padding:15px 0;}
			}
		}

		.setup_null{text-align:center;padding-top:40px;padding-bottom: 60px;
			img{width:176px;height:164px;}
			p{font-size:13px;color:#999;}
			button{width:140px;height:30px;line-height:30px;font-size:12px;color:#fff;background-color:#3DB1FA;border-radius:3px;}
			.skip{background-color:#fff;color:#3db1fa;border:1px solid #3db1fa;line-height:28px;}
			.oldto{width:100px;}
		}
	}
	.list_center_dialog{width:400px;top: 50% !important;margin-top:-74px;
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
