<template>
	<div class="step1_fill_wraps">
		<img class="top_logo" src="~assets/img/nice/sebeLogo.png" alt="">
		<img class="top_img" src="~assets/img/nice/topBgi.png" alt="">
		<div class="step1_fill">
			<!-- 商标类别 -->
            <ul class="basemessage">
                <li><strong>订单编号：</strong><span>{{orderbaseinfo.orderSn}}</span></li>
                <li><strong>旺旺号：</strong><span>{{orderbaseinfo.wangwangSn}}</span></li>
                <li><strong>商标名称：</strong><span>{{orderbaseinfo.trademarkName}}</span></li>
                <li><strong>下单时间：</strong><span>{{orderbaseinfo.orderTime|dateFormat}}</span></li>
                <li v-if="orderbaseinfo.trademarkUrl"><strong>商标图样：</strong><span class="imgbox"><img :src="tradeurl" alt=""></span></li>
            </ul>
			<div class="tmCategory" v-if="!loading">
                
				<div class="recommend" v-if="urlBol">
					<button class="btn btn-primary btn-primary-p" @click="bigClassVisible=true">添加商标类别</button>
				</div>
				<template v-if="draftInfo && draftInfo.length">
					<transition-group name="fade" tag="div">
						<div class="state" :class="{'mt20': $draftIndex==0}" v-for="(info,$draftIndex) in draftInfo" :key="info.class_id" :id="'info_box_'+$draftIndex">
							<div class="state_list" :class="{'bgc':$draftIndex === draftIndex}"  @click="openCurOrder($draftIndex,info)">
								<!-- 点击收缩时候先保存入allEvents，然后初始化 -->
								<!-- 展开 -->
								<a href="#" class="del" v-if="draftInfo && draftInfo.length > 1" @click.prevent.stop="askDelete($draftIndex)"><i class="el-icon-delete"></i></a>
								<img class="unwrap" src="~assets/img/selfRegister/release.png" alt="" v-if="info.PackUp" @click="openCurOrder($draftIndex,info)">
								<!-- 收缩 -->
								<img src="~assets/img/selfRegister/shrinkage.png" alt="" v-if="!info.PackUp" @click.stop="closeCurOrder(info)">
								<div class="list_tit clearfix">
									<p class="fl serial">{{$draftIndex+1>9 ? $draftIndex+1 : '0'+($draftIndex+1)}}</p>
									<p class="fl order">商标类别</p>
									<p class="fl">
										{{info.class_id < 10 ? '0' + info.class_id : info.class_id}}类-{{bigState[info.class_id - 1]['goodsname']}}
										<el-popover placement="top" width="400" trigger="hover" class="remark_icon_wrap" popper-class="popper_remark_icon" v-if="info.isAsistantremarks" @show="getRemark(info)">
											<p>{{remark}}</p>
											<a href="javascript:;" slot="reference" class="remark_icon">&nbsp;&nbsp;</a>
										</el-popover>
									</p>
								</div>
								<p class="mt10" v-if="info.class_id && info.PackUp && !info.service_nice_min.length" @click="openCurOrder($draftIndex,info)">请选择小项</p>

								<!-- 收缩后显示的内容 -->
								<ul class="mt10 clearfix"  v-if="info.PackUp && info.class_id && info.service_nice_min.length">
									<li class="clearfix mb10">
										<p class="state_name fl" :class="{'msgColor':!info.class_id}">小项信息</p>
										<p class="state_txt fl" :class="{'msgColor':!info.service_nice_min || !info.service_nice_min.length}">
											共{{info.service_nice_min && info.service_nice_min.length || 0}}个小项
											<template v-if="info.service_nice_min && info.service_nice_min.length">
											（<span v-for="item in info.service_nice_min">{{item.min_name + '；'}}</span>）
											</template>
										</p>
									</li>
								</ul>
								<vueSlideUpDown :active="$draftIndex === draftIndex&&!info.PackUp" >
								<div class="add mt20 clearfix" @click.stop="">
									<p>请选择分类及小项：</p>
									<!-- 45大类 -->
									<ul class="clearfix mt15">
										<li v-for="(item,$index) in bigState" :class="{'click_li':$index+1 == index, 'notChoose': allSelectedBigData.indexOf($index+1) != -1 && $index+1 != index, 'mr9': ($index+1)%9 != 0}" class="fl mb10" @click="selected(item, info)">{{item.id < 10 ? '0' + item.id : item.id}}类 {{item.goodsname}}</li>
									</ul>
									<div class="events clearfix mt10" v-show="selectedBigItem.goodsname">
										<div class="events_left fl">
											<div class="head clearfix">
											<!-- 选中名称 -->
												<p>{{selectedBigItem.goodsname}}</p>
												<!-- <button class="fr" @click="DataFuzzyQuery(searchEvents)">搜索</button> -->
												<input type="text" v-model="searchEvents" class="fr" placeholder="请输入小项名称、编号或关键词" @keyup="DataFuzzyQuery(searchEvents)" @focus="DataFuzzyQuery(searchEvents)" @blur="blurclick">
												<ul class="fuzzyqueryList" v-if="FuzzyQueryData.length">
													<li v-for="item in FuzzyQueryData" @click="FuzzyQueryClick(item.min_id)" v-html="item.min_name"></li>
												</ul>
												<img src="~assets/img/selfRegister/searchicon.png" alt="">
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
												<p class="right_txt fl">最多选择{{info.min_number<10? 10 : info.min_number}}项，已选<span class="cy">{{curSelectedSmallList.length}}</span>项</p>
												<p class="right_btn fr" @click="resetEvent">重置</p>
											</div>
											<div class="right_list">
												<ul>
													<li v-for="events in curSelectedSmallList" style="text-align:left" class="mb10">
														<i class="el-icon-circle-close" @click="moveSmall(events.min_id)"></i>
														{{events.min_name}}
													</li>
												</ul>
												<!-- <div class="add_cost" v-if="!info.PackUp">
													<p>加项费用(元）
														<el-tooltip placement="top-end" width="140" trigger="hover" popper-class="smallFeePopover" :disabled="curSelectedSmallList.length<11" v-model="showMoreSmallTip">
															<p slot="content" class="smallFee">已超出{{curSelectedSmallList.length-10}}个小项<br>追加费用{{niceMinPrice}}x{{curSelectedSmallList.length-10}}元</p>
															<span class="cy">￥{{curSelectedSmallList.length && curSelectedSmallList.length>10 ? (curSelectedSmallList.length-10)*niceMinPrice : '0'}}.00</span>
														</el-tooltip>
													</p>
												</div> -->
											</div>
										</div>
									</div>
								</div>
								<div class="confirm clearfix" @click.stop="">
									<button class="btn btn-primary" @click.prevent="closeCurOrder(info)">确定</button>
								</div>
								</vueSlideUpDown>
							</div>
						</div>
					</transition-group>
				</template>
				<!-- <template v-if="draftInfo && draftInfo.length">
					<div class="state_init">
						<span @click="bigClassVisible=true">请完善商标注册信息</span>
					</div>
				</template> -->
			</div>
			<div class="confirm_btn clearfix" v-if="draftInfo && draftInfo.length&&!loading">
				<button class="btn_bg" @click="submitFn">提交</button>
			</div>
		</div>
		<!-- <div class="step1_fill" v-if="draftInfoSuccess">
			<p class="select_tit">已选择商标小项：</p>
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
				<button class="btn_blue">前往拾贝网首页</button>
			</div>
		</div> -->
		<img class="footer_img" src="~assets/img/nice/botFoot.png" alt="">
		<p class="footer_txt">© 2015-现在 拾贝 All rights reserved 浙ICP备15042618号 | 浙公网安备 33010402001523号<br>杭州拾贝知识产权服务有限公司</p>

		<!-- 删除前确认 -->
    <el-dialog title="提示" :visible.sync="confirmVisible" :close-on-click-modal="false" :append-to-body="true" :close-on-press-escape="false" class="state_preview" top="50%">
		  <div class="confirm_tip">
		  	<p>确定删除该商标类别？</p>
		  	<a href="" class="button no" @click.prevent="confirmVisible=false">取消</a><a href="" class="button yes" @click.prevent="deleteBig()">确定</a>
		  </div>
		</el-dialog>

		<!-- 请选择商标类别 -->
    <el-dialog title="请选择商标类别" v-if="bigClassVisible" :visible.sync="bigClassVisible" :close-on-click-modal="false" :close-on-press-escape="false" class="common_dialog bigClassSelect" top="50%">
			<div class="bigClasses">
				<el-checkbox-group v-model="checkedBigList">
					<ul>
						<li v-for="(item, idx) in bigState" :key="item.id"><el-checkbox :label="item.id" :disabled="allSelectedBigData.indexOf(idx+1) != -1">{{idx+1 < 10 ? '0' + (idx+1) : (idx+1)}}{{item.goodsname}}</el-checkbox></li>
					</ul>
				</el-checkbox-group>
			</div>
		  <div class="confirm_tip">
		  	<a href="" class="button no" @click.prevent="bigClassVisible=false">取消</a><a href="" class="button yes" @click.prevent="addBig()">确定</a>
		  </div>
		</el-dialog>

		<el-dialog title="提示"
			:visible.sync="dialogVisible" class="state_preview confirmD" :modal-append-to-body="true" :lock-scroll="false" top="50%">
			<div class="confirm_tip padding_no">
				<p>更换商标类别将重置已选小项，确定更换？</p>
				<a href="" class="button no" @click.prevent="dialogVisible = false">取消</a><a href="" class="button yes" @click.prevent="changeBig()">确定</a>
			</div>
		</el-dialog>
		<el-dialog title="提示" :visible.sync="confirmNiceInfo" :close-on-click-modal="false" :close-on-press-escape="false" class="confirmD" top="40%">
		  <div class="confirm_tip">
		  	<p>确定提交尼斯分类信息吗？</p>
		  	<a href="" class="button no" @click.prevent="confirmNiceInfo=false">取消</a>
		  	<a href="" class="button yes" @click.prevent="saveDraft()">确定</a>
		  </div>
		</el-dialog>

	</div>
</template>
<script>
	import Vue from 'vue'
	import vueSlideUpDown from 'vue-slide-up-down'
	import uploader from 'components/uploader/uploader.vue'
	import intClsData from 'src/common/js/intClsData.js'
    import FauxPlaceholder from 'src/common/js/ie9Placeholder.js'
    import Filters from 'api/filters.js'
	const spUrl = CONFIG.spUrl;
	const niceUrl= './api/getNiceClass';
	const niceEventsUrl = CONFIG.spUrl+'/iprp_servicer/api/getNiceGroupByClassIdForRec';

	const downProxyTemplateUrl = './api/downProxyTemplate';
	const findAsistantRemarkUrl = './api/findAsistantRemark';
	export default {
		components: {
			uploader,
			vueSlideUpDown
		},
		data() {
			return {
                orderbaseinfo:{
                    orderSn:'',
                    wangwangSn:'',
                    trademarkName:'',
                    trademarkUrl:'',
                    orderTime:''
                },
				tradeurl:'',
                checkedBigList:[],
                confirmNiceInfo:false,
                bigClassVisible: false,
                confirmVisible: false,
				showMoreSmallTip: false,
				loading:false,
				// 查询的草稿信息 work_order_service
				draftInfo:[],
				// 当前展开的服务单的索引
				draftIndex:'',
				dialogVisible:false,
				// 当前选中的小项id列表
				curSelectedSmallIdList:[],
				// 当前选中的小项列表[{}]
				curSelectedSmallList: [],
				// 搜索小项
				searchEvents:'',
				//当前选中的大项的索引，index这儿是个极差的命名，
				index:'',
				// 查询到的小项
				niceEventsData:{},
				// 小项加载loading
				smallLoading: false,
				// 查询出的大类
				bigState:intClsData.cateIdData,
				// 当前选中的大类
				selectedBigItem:{},
				// 当前临时选中的大类,用于二次确认
				tempSelectedBigItem:{},
				// 模糊查询的结果
				FuzzyQueryData:[],
				// 各服务单已选中的大类
				allSelectedBigData:[],
				// 当前选中的服务单数据
				curOrderInfo:{},
				spUrl:spUrl,
				tableData:[],
				niceMinPrice:60,//小项超出时候价格
				draftInfoSuccess:false,//是否提交成功
				urlBol:true
			}
		},
		methods: {
			// 提交
			submitFn () {
				let self = this;
				let data = this.draftInfo;
				let isok = true;
				if(data&&data.length){
					data.forEach(item=>{
						if(!item['service_nice_min'].length){
							isok = false
						}
					})
				}
				if(isok){
					this.confirmNiceInfo = true;
				}else{
					this.$message.error('请选择小项信息');
				}
				// if (this.curSelectedSmallList.length) {
				// 	this.confirmNiceInfo = true;
				// }
				// else{
				// 	this.$message.error('请选择小项信息');
				// }
			},
			transformPdf(url){
				var self = this;
				self.$http.get(spUrl + '/iprp_servicer/api/preview?pdf_url='+url)
					.then((response) => {
					self.tradeurl = response.data.urls[0];
					if (!self.tradeurl) {
						self.$message.error('pdf预览失败');
						}
					})
					.catch((error) => {
					self.$message.error('pdf预览失败');
					});
			},
			saveDraft(){
				console.log(this.draftInfo)
				let self = this;
				let data = this.draftInfo;
				if(data && data.length){
					data.forEach((item)=>{
						// delete item.PackUp;
						delete item.min_info;
						delete item.number;
						delete item.recommend;
						item.class_name = (item.class_id < 10 ? '0' + item.class_id : item.class_id)+'类-'+this.bigState[item.class_id - 1]['goodsname'];
					})
				}
				console.log(data)
				let info = {
					key:this.$route.query.key,
					work_order_service:data
                }
                // 
				this.$http.post(spUrl+'/iprp_servicer/api/commitChannelNiceRec',info)
				.then((resp)=>{
					this.confirmNiceInfo = false;
					// self.draftInfo.forEach(function(item, num){//因为后台没有返回值，提交成功后的数据需要前端自己来排列
					// 	self.tableData.push({
					// 		index: num+1,
					// 		type: item.class_name,
					// 		listAfter: item.service_nice_min,
					// 		list:[]
					// 	})
					// })
					// self.tableData.forEach((item)=>{//因为后台没有返回值，提交成功后的数据需要前端自己来排列
					// 	if(item.listAfter&&item.listAfter.length){
					// 		item.listAfter.forEach((info)=>{
					// 			console.log(info.min_name)
					// 			if(info.min_name){
					// 				item.list += info.min_name+';';
					// 			}
					// 		})
					// 	}
					// })
					self.draftInfoSuccess = true;
					self.$message({
                    message: '提交成功',
                    type: 'success'
                });

                    })
                    .catch((err)=>{

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
                //添加大类
            addBig(unqiue){
                    var arr = [];
                    this.checkedBigList.forEach((item, index) => {
                        var data = {
                            PackUp: true,
                        class_id: '',
                        service_nice_min: []
                        };
                        data.class_id = item;
                        this.allSelectedBigData.push(item);
                        // 如果在原有的大类数据中，则不打推荐标志
                        if(this.orignBigsData && this.orignBigsData.length){
                            this.orignBigsData.forEach((it, idx) => {
                                if (it.class_id == item) {
                                    data.recommend = false;
                                    data.id = it.id;
                                    data.isAsistantremarks = it.isAsistantremarks;
                                    data.order_sn = it.order_sn;
                                }
                            });
                        }

                        if (unqiue) {
                            if (!this.draftInfo.some((it) => {
                                return it.class_id == item;
                            })) {
                                arr.push(data);
                            }
                    }else{
                        arr.push(data);
                    }
                    });
                this.draftInfo = this.draftInfo.concat(arr);
                this.checkedBigList = [];
                this.bigClassVisible = false;
                return arr;
                //重新生成url
                //this.creatUrl();
            },
            //删除二次确认
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
            deleteBig(){
                // 删除黑名单中的大类id
                var curItem = this.draftInfo[this.draftIndex];
                var allSelectedBigData = this.allSelectedBigData;
                var idx = allSelectedBigData.indexOf(curItem.class_id);
                if (idx !== -1) {
                    allSelectedBigData.splice(idx, 1);
                }
                this.draftInfo.splice(this.draftIndex, 1);
                this.confirmVisible = false;
                this.$message.success('删除成功！');
                //重新生成url
                //this.creatUrl();
            },
			getRemark(item){
				this.remark = '';
				this.$http.get(findAsistantRemarkUrl + '?orderSn=' + item.order_sn)
				.then((resp) => {
					var data = resp.data;
					this.remark = data.remarks;
				})
				.catch((err) => {
					console.log(err);
				});
			},
			// 搜索框初始化
			blurclick(){
				setTimeout(()=>{
					this.FuzzyQueryData = [];
					this.searchEvents = '';
				},200);
			},
			// 获取尼斯分类
			obtainNice(){
				var self = this;
				self.$http.get(niceUrl+"?pg_count=45").then(function(resp){
					self.bigState = resp.data.elements;
				})
				.catch((error) => {
				});
			},
			// 获取草稿信息
			queryDetail(){
				let key = this.$route.query.key;
                console.log(key)
                // 
				this.$http.get(spUrl+'/iprp_servicer/api/findChannelNiceRec?key='+key)
				.then((resp)=>{
					console.log(resp.data.work_order_service,'监测')
					this.draftInfo = resp.data.work_order_service;
                    this.niceMinPrice = resp.data.niceMinPrice;
                    this.orderbaseinfo = resp.data
					if(this.orderbaseinfo.trademarkUrl){
						this.transformPdf(this.orderbaseinfo.trademarkUrl)
					}
					if(this.draftInfo){
						for(let r in this.draftInfo){
							this.draftInfo[r].PackUp = true;
							this.draftInfo[r].class_name = '';
							this.allSelectedBigData.push(this.draftInfo[r].class_id);
						}
					}
				})
				.catch((err)=>{
					if(err.request.status == 400){
						let response = JSON.parse(err.request.response)
						if(response.status == 300016){
							this.urlBol = false;
							this.$message({
				        message: '该链接已失效，请获取新的链接。',
				        type: 'warning'
				      });
						}
					}
				})
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
				self.selectedBigItem = info.class_id ? self.bigState[info.class_id-1] : {}
				self.index = info.class_id || '';

				self.curOrderInfo = info;

				//右侧选中的小项
				self.curSelectedSmallList = info.service_nice_min || [];
				self.curSelectedSmallIdList = self.getSmallIdList();

				//如果有大类，则查询小项
				if (info.class_id) {
					self.niceEvents(info.class_id);
				}
				setTimeout(() => {
					self.custormAnchor('info_box_' + orderindex);
				}, 600);
			},
			// 保存，初始化
			closeCurOrder(item){
				this.draftIndex = '';
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
				this.showMoreSmallTip = curSelectedSmallList.length>10;
				this.hideMoreSmallTip();
			},
			// 重置选中的小项
			resetEvent(data){
				this.curSelectedSmallList = [];
				this.curSelectedSmallIdList = [];
				this.curOrderInfo.service_nice_min = [];
			},
			// 点击选中查询的内容
			FuzzyQueryClick(id){
				var curSelectedSmallIdList = this.curSelectedSmallIdList;
				if (curSelectedSmallIdList.indexOf(id) === -1) {
					curSelectedSmallIdList.push(id);
				}else{
					this.$message.warning('该小项已添加');
				}
				this.selectSmallChange(curSelectedSmallIdList);
				this.FuzzyQueryData = [];
				this.searchEvents = '';
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
			// 根据小项id,从大类下所有小项数据中取得单条小项数据
			getSmallItem(id){
				var niceEventsData = this.niceEventsData;
				var ret = {
					// class_id:'',
					group_id:'',
					min_id:'',
					min_name:''
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
				// this.hideMoreSmallTip();
			},
			//点击45大类选中
			selected(item){
				var self = this;
				// 如果是当前的或禁用的，则直接返回
				if (self.index == item.id || self.isInAllSelectedBigData(item.id)) {
					return;
				}
				// 如果有小项数据，给出提示
				if (self.curSelectedSmallList.length) {
					self.tempSelectedBigItem = item;
					self.dialogVisible = true;
					return;
				}else{
					// 没有小项数据则直接切换
					// 先更新选中的大类Id LIST
					self.updateAllSelectedBigData(self.index, item.id);
					self.index = item.id;
					self.selectedBigItem = item;
					self.setSelectedInfo(item);
					//查询小项数据
					self.niceEvents(item.id)
				}
			},
			//设置当前展开订单的大类名和id
			setSelectedInfo(item){
				this.curOrderInfo.class_name = this.bigState[item.id-1]['goodsname'];
				this.curOrderInfo.class_id = item.id;
			},
			//是否在已选中的大类集合中，用于判断是否禁用大类
			isInAllSelectedBigData(bigNum){
				return this.allSelectedBigData.indexOf(bigNum) === -1 ? false : true;
			},
			//切换大类后更新已选中的大类集合
			updateAllSelectedBigData(oldBigNum, bigNum){
				var allSelectedBigData = this.allSelectedBigData;
				var idx = allSelectedBigData.indexOf(oldBigNum);
				if (idx !== -1) {
					allSelectedBigData.splice(idx, 1);
				}
				allSelectedBigData.push(bigNum);
			},
			// 查询小项
			niceEvents(class_id){
				var self = this;
				self.smallLoading = true;
				let key = this.$route.query.key;
				self.$http.get(niceEventsUrl+'/'+class_id+'?key='+key)
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
			// 确认后变更大类
			changeBig(){
				// 选中的小项初始化
				this.resetEvent();
				this.dialogVisible = false;
				this.selected(this.tempSelectedBigItem);
			},
			// 小项展开收缩切换
			toggleSmallNav(item){
				item.shrinkage = !item.shrinkage
			},
			setScrollTop(scroll_top) {
            document.documentElement.scrollTop = scroll_top;
            document.body.scrollTop = scroll_top;
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
		},
		mounted() {
			this.queryDetail()
        },
        filters:{
            dateFormat: Filters.formatDate.Formatdate
        },
		watch: {
		}
	}
</script>
<style lang='scss'>
	.step1_fill_wraps{background:url(~assets/img/nice/niceBgi.png) center top;padding-top:84px;padding-bottom: 65px;font-size:0;min-height: 100%;
		.top_img,.top_logo,.footer_img{margin:0 auto;display:block;}
		.top_logo{margin-bottom: 56px;}
		.footer_txt{font-size:13px;line-height:17px;color:#fff;margin-top:35px;text-align:center;}
		.step1_fill{
			padding:30px 30px 0px;background-color:#fff;min-height: 500px;width:1200px;margin:0 auto;
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
            .basemessage{
                margin-bottom: 20px;
                font-size: 14px;
                overflow: hidden;
				font-weight: normal;
				color: #567;
                >li{
                    float: left;
                    width: 40%;
                    margin-bottom: 8px;
					strong{font-weight: normal}
                    .imgbox{
                        display: inline-block;
                        width: 120px;
                        height: 120px;
                        background-color: #379dea;
                        vertical-align: top;
                        >img{
                            width: 100%;
                            height: 100%;
                            vertical-align: top;
                        }
                    }
                }
            }
			.select_tit {
				font-size: 14px;margin: 30px 0 10px 0;
				.note {
					color: #999;
				}
			}
			// 字体淡黄色
			.cy{color: #F5A623;}
			// msg color
			.msgColor{color: #F64744 !important;}
			// 上传图片
			.upload_component{position: relative;
				.upload_tip{
					position: absolute;left: 140px;top:0;width:360px;font-size: 14px;color: #333;line-height: 16px;
					p.format{color: #999;padding-top: 5px;font-size: 13px; }
				}
			}

			.top_tips{width: 611px;height: 39px;margin:0 auto;line-height: 39px;background-color: #FFF7E2;color:#E39E2B;font-size:14px;text-align: center;border-radius: 39px;}
			.suject{
				// 标题
				>p{font-size: 18px;color: #333;}
				// 基本信息部分样式
				.basic_info{
					.el-form-item{margin-bottom:20px;}
					.el-form-item__label{text-align: left;height:36px;line-height: 36px;padding:0;}
					.el-form-item__content{
						line-height: 36px;
						.el-input{width: 500px;
							input{height: 36px;line-height: 36px;}
						}
						.el-textarea{width: 500px;}
						.el-input__inner{padding-left: 10px;}
						.el-textarea__inner{padding-left: 10px;}
					}
					.upload_component_wrap{
						.el-form-item__content{padding-top: 12px;}
						.tips{font-size: 12px;color: #bbb;line-height: 18px;width: 500px;}
					}
					.query{display: inline-block;height: 129px;height: 30px;line-height: 30px;text-align: center;color: #3DB1FA;border-radius: 3px; vertical-align: middle;margin-left: 20px;text-decoration: none;}
					.smart{height: 160px;height: 30px;border-radius: 3px;}
					.how{margin-left: 30px;color:#3DB1FA;text-decoration: underline;cursor: pointer;}
				}
			}
			.tmCategory{
				position: relative;
				>p{
					font-size: 18px;color: #333;
					span{color:#999;font-size: 13px;}
					.how{margin-left: 30px;color:#3DB1FA;text-decoration: underline;cursor: pointer;}
				}
				.recommend{
					.btn{width: 120px;height: 30px;line-height: 30px;border-radius: 3px;background-color:#fff;color:#3db1fa;}
					// .ai{background-color: #fff;border-color:#FFAC5E;}
				}
				.field{
					.el-form-item__label{float: none;display: block;text-align: left;}
					.el-form-item__content{margin-left: 0!important;}
				}
				.state{border: 1px solid #DFE2E5;padding:0px;margin-top: -1px;}
				.state.mt20{margin-top: 20px;}
				.shadow{box-shadow: 0 1px 4px 0 rgba(0,0,0,0.08);background: #F9F9F9;}
				div.state_list{
					padding:22px 0 20px;position: relative;transition: all 0.5s ease-out 0.2s;
					.del{position: absolute;top:19px;right:55px;width:26px;
						i{font-size: 24px;color: #ddd;}
					}
					>p{font-size: 14px;color: #3DB1FA;cursor:pointer;margin-left: 58px;width:126px;}
					>img{
						position: absolute;top:20px;right:20px;width:23px;
						&:hover{cursor: pointer;}
					}
					.list_tit{padding:0 22px;
						>p{font-size: 14px;color: #556677;line-height:20px;text-align:left;}
						.serial{width:38px;}
						.order{width:128px;}
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
					.add{border-top:1px solid #DFE2E5;padding-top:20px;padding-right: 50px;margin-left: 50px;height:718px;
						>p{font-size: 14px;color: #556677;font-weight: 600;}
						ul{padding-left:0;padding-right:0;
							.mr9{margin-right: 9px;}
							li{border: 1px solid #DFE2E5;border-radius: 2px;width:104px;height:30px;line-height:30px;text-align:center;font-size: 13px;color: #556677;cursor:pointer;background-color:#fff;}
							.click_li{border: 1px solid #3DB1FA;color: #3DB1FA;background: #F8FCFF;}
							.notChoose{background: #F5F5F5;color: #A8AFB5;cursor:text;}
						}
						// 小项选择
						.events{
							>div{border: 1px solid #DFE2E5;}
							.events_left{height:445px;width:72%;background-color:#fff;padding:20px;
								.head{position: relative;
									p{width:116px;height:30px;line-height:30px;border: 1px solid #3DB1FA;border-radius: 2px;font-size: 13px;color: #3DB1FA;text-align:center;display:inline-block;background: #F8FCFF;}
								}
								input{width:300px;height:30px;border: 1px solid #DFE2E5;border-radius: 2px;padding-left:30px;font-size:14px;}
								.fuzzyqueryList{position: absolute;top:35px;right:0;max-height: 300px;overflow-y: auto;z-index: 10;width:300px;border-radius:3px;border:1px solid #DFE2E5;background-color: #fff;
									li{width:100%;border: 0;text-align:left;padding-left:10px;line-height:30px;font-size:13px;color:#556677;box-sizing: border-box;
										b{font-weight: normal;color:#F5A623;}
									}
									li:hover{background-color: #f5f5f5;}
								}
								button{background: #3DB1FA;border-radius: 2px;font-size: 14px;color: #FFFFFF;height:30px;line-height:30px;display:inline-block;width:60px;vertical-align: top;}
								img{width:14px;height:14px;position: absolute;right:278px;top:8px;}
								.list_over{overflow: auto;height:340px;margin-top: 18px;overflow-x: hidden;}
								// 小项部分
								.events_list{
									.list_state{height:30px;opacity: 0.9;background: #F5F5F5;padding-left:27px;padding-right: 10px;position: relative;cursor: pointer;
										p{font-size: 13px;color: #556677;line-height:30px;}
										i{position: absolute;top:9px;width:14px;height:14px;left:8px;}
									}
								}
							}
							.events_right{width:28%;border-left:0;background-color:#f6f6f6;
								.right_tit{font-size: 16px;color: #556677;padding:20px 30px 0;}
								.right_num{margin-top:10px;margin-bottom: 10px;padding:0px 30px;
									.right_txt{font-size: 13px;color: #7F8FA4;line-height:24px;}
									.right_btn{border: 1px solid #3DB1FA;border-radius: 2px;font-size: 12px;color: #3DB1FA;width:60px;height:24px;line-height: 22px;text-align:center;cursor:pointer;}
								}
								.right_list{
									ul{height:325px;box-sizing: border-box;padding:0px 30px;overflow-y: auto;
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
								span{font-size: 14px;color: #999;font-weight: normal;}
							}
						}
					}
					.confirm{
						text-align: right;padding-right: 50px;padding-top: 10px;padding-bottom: 20px;
						button{width: 100px;height:33px;line-height: 31px;}
					}
				}
				.bgc{background-color:#F9F9F9;}
				div.state_list:hover{background: #F9F9F9;box-shadow: 0 1px 4px 0 rgba(0,0,0,0.08);}
			}
			.confirm_btn{margin-top:50px;text-align: center;
				button{display: inline-block;padding:0 30px;border: 1px solid #3DB1FA;border-radius: 2px;color:#3DB1FA;line-height:30px;text-align:center;cursor:pointer;}
				button:hover{border-color: #408CE6;color: #408CE6;}
				.btn_bg{background-color:#3DB1FA;color:#fff;width: 140px;height: 42px;font-size:14px;}
				.btn_bg:hover{border-color: #408CE6;background-color: #408CE6;color:#fff;}
			}
			.pl10{padding-left:10px;}
			// 对插件样式的修改
			.percentage_txt{position: relative;
				input{width:120px;height:30px;padding: 3px 25px 3px 10px;transition: border-color .2s cubic-bezier(.645,.045,.355,1);border-radius:2px;border: 1px solid #bfcbd9;line-height:30px;text-align: left;}
				.percentage{position: absolute;left:100px;top:2px;font-size: 14px;color: #556677;line-height:30px;}
				.prompt{font-size: 13px;color: #7F8FA4;line-height:14px;display:inline-block;vertical-align: middle;margin-left: 5px;}
			}
			.el-form-item__content{width:65%;}
			.el-checkbox{vertical-align: top;margin-right:30px;margin-top: 10px;}
			.el-checkbox .el-checkbox__label{font-size: 12px;color: #556677;width:156px;display:inline-block;word-wrap:break-word;word-break:break-all; white-space:pre-wrap;vertical-align: top;padding-left: 10px;margin-top: 2px;}
			.el-checkbox+.el-checkbox{margin-left: 0;}
			.el-input__inner,.el-textarea__inner{font-size: 13px;border-radius:2px;}
			// 小项选中时候的字体颜色
			.ptc{
				.el-checkbox__label{color: #3DB1FA;}
			}


			.el-form-item.is-required .el-form-item__label:before{content:'';}

		}
	}
	.my-autocomplete{
		li{line-height:30px;height:30px;font-size: 13px;color: #556677;}
		.el-autocomplete-suggestion__wrap{padding:0;}
	}
	.events_list .el-checkbox__input.is-checked .el-checkbox__inner {
		background-color: #20a0ff !important;
		border-color: #0190fe !important;
	}
	.smallFeePopover{
		background: #F5A623!important;border-color: #F5A623!important;padding: 10px!important;
	 .smallFee{margin-bottom: 0;color: #fff;text-align: left;line-height: 18px;font-size: 13px;}
	 .popper__arrow, .popper__arrow::after{border-top-color: #F5A623!important;}
	}

	.self_pop{
		@keyframes fadein {
      0% {
      	opacity: 0;
      }
      100% {
        opacity: 100%;
      }
    }
    @keyframes fadeout {
      0% {
      	opacity: 100%;
      }
      100% {
        opacity: 0;
      }
    }
		position: absolute;top:0;left:515px;background-color: #fff;z-index: 20;animation: fadein 0.3s linear;
		box-shadow: 0px 0px 9px 0px rgba(193,193,193,1);border-radius: 3px;
		h3{
			position: relative;height: 38px;line-height: 38px;font-size:15px;color: #fff;text-align: center;background-color: #3DB1FA;font-weight: normal;border-radius: 3px;border-bottom-left-radius: 0;border-bottom-right-radius: 0;
			.arrow{position: absolute;top:10px;left: -10px;border-right:12px solid #3DB1FA;border-top:9px solid transparent;border-bottom:9px solid transparent;border-left: 0;height: 0;width: 0;}
			.el-icon-close{position: absolute;top:10px;right: 8px;font-size: 18px;text-align: right;cursor: pointer;}
		}
		.pop_con{
			padding:10px;font-size:13px;
		}
	}
	.fadeout{
		animation: fadeout 0.3s linear;
	}
	.howSelect{
		height: 510px;width: 362px;left: 540px;
		.pop_con{
			text-align: center;padding:12px 21px;
			h4{color: #333;line-height:18px;margin-top: 0;font-weight: normal;}
			.imgwrap{
				margin-top: 10px;width:320px;height:106px;background-color: #F7F7F7;margin-bottom: 20px;padding-top: 20px;
				.imgs{
					height: 40px;overflow: hidden;
					img{position: relative;display: inline-block;width: 100px;height: 40px;background-color: #fff;}
					img:first-child{margin-right: 65px;}
				}
				span{
					position: relative;display: inline-block;width: 50%;text-align: center;color:#999999;line-height:18px;margin-top:9px;
					span{color:#3DB1FA;}
				}
				span.one{width: 100%;}
			}
		}
	}
	.howName{
		width: 362px;
		.pop_con{
			text-align: center;padding:12px 21px 0;
			h4{color: #333;line-height:18px;margin-top: 0;font-weight: normal;}
			.imgwrap{
				margin-top: 10px;width:320px;background-color: #F7F7F7;margin-bottom: 20px;padding-bottom: 10px;
				.imgs{
					height: 40px;overflow: hidden;margin-top: 4px;
					img{position: relative;display: inline-block;width: 100px;height: 40px;background-color: #fff;}
					img:first-child{margin-right: 65px;}
				}
				p{
					position: relative;display: inline-block;text-align: left;color:#999999;line-height:18px;margin-top:9px;padding:0 15px;word-break: break-all;
					span{color:#3DB1FA;}
				}
				span{
					position: relative;display: inline-block;width: 50%;text-align: center;color:#999999;line-height:18px;margin-top:10px;
					span{color:#3DB1FA;}
				}
				span.til{color:#333;}
				span.one{width: 100%;}
			}
		}
	}
	.blackWhite{
		height: 314px;width: 320px;left:370px;
		.pop_con{
			text-align: center;padding:4px 14px;
			h4{color: #333;line-height:18px;margin-top: 12px;font-weight: normal;font-size: 13px;}
			p{
				color:#999999;line-height:18px;margin-top: 9px;
				span{color:#3DB1FA;}
			}
			.imgwrap{margin: 10px auto 20px;width:167px;height:44px;background-color: #F7F7F7;padding-top: 10px;}
		}
	}
	.attention{
		height: 186px;width: 323px;left: 502px;
		.pop_con{
			p{
				background-color: #F7F7F7;font-size:13px;color:#333333;line-height:22px;padding:20px;
				span{color:#3DB1FA;}
				a{color:#3DB1FA;}
			}
		}
	}
	.bigClassSelect{
		.el-dialog{
			width: 650px;height: 494px;position: absolute;left: 50%;top:50%;transform: translate(-50%, -50%) !important;
			.el-dialog__body{
				padding-top: 15px;
				.bigClasses{
					width: 610px;height: 354px;padding: 20px;background: #F9F9F9;
					ul{
						width: 100%;height: 314px;
						li{
							float: left;width: 20%;height: 18px;line-height: 18px;margin-bottom: 19px;padding:0 5px;
							.el-checkbox{
								margin-top: 0;margin-right: 0;
								.el-checkbox__label{width: auto;font-size: 13px;color: #556677;}
							}
						}
					}
				}
				.confirm_tip{
					text-align: center;padding-top: 20px;
					p{text-align: left;font-size: 14px;color: #556677;padding-bottom: 20px;line-height: 20px;}
                    a.no{
                        margin-right: 20px;
                    }
				}
			}
		}
	}
	.confirmD{
			// 弹框公用样式继承自common.css
			.el-dialog__header{text-align:left;}
			.el-dialog{
				width: 300px;
				.el-dialog__body{
					.confirm_tip{
						text-align: right; padding:0 20px;
						p{text-align: left;font-size: 14px;color: #556677;padding-bottom: 20px;line-height: 21px;}
						a{padding:5px 10px;border-radius: 2px;text-decoration:none;}
						a.no{border: 1px solid #dcdfe6;margin-right: 20px;line-height: 18px;background-color: #fff;color: #666}
						a.yes{background: #3db1fa;color: #fff;border: 1px solid #3db1fa; line-height: 18px;}
					}
					.padding_no {padding: 0;}
				}
			}
	}
	// 弹框公用样式继承自common.css
	.state_preview{
		.el-dialog{
			width:310px;top:50%;position: absolute;left: 50%;transform: translate(-50%, -50%);
			.confirm_tip{
				text-align: right; padding: 0;
				p{text-align: left;font-size: 14px;color: #556677;padding-bottom: 20px;line-height: 20px;}
				a.no{
					border: 1px solid #dcdfe6;margin-right: 20px;background-color: #fff;color: #666
				}
			}
		}
	}
	.state_init{
		border: 1px solid #DFE2E5;padding:0px;margin-top: 25px;font-size: 14px;
		span{padding:25px 40px;color:#3DB1FA;display: inline-block;cursor: pointer;}
	}
</style>
