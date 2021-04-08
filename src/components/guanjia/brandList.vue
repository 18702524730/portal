<template>
	<!-- 商标列表 -->
	<div class="list_table_box" v-if="showList" v-loading="loading">
		<table class="list_table">
			<thead>
				<tr class="t_head">
					<th>商标基本信息</th>
					<th>商标类别</th>
					<!-- <th>法律状态</th> -->
					<!-- <th>托管状态</th> -->
					<th width="160" v-if="companyType==1">设置核心商标</th>
					<th width="120">操作</th>
				</tr>
			</thead>
			<tbody>
				<tr class="t_item" v-for="(item, index) in resultList">
					<td>
						<el-checkbox v-model="item.isSelect" v-show="item.showCheckbox" @change="selectTmFn(item, index)" class="checkbox"></el-checkbox>
						<div class="tm_img">
							<a class="tm_img_a" target="_blank" :href="`${userUrl}/iprp/#/tradeDetail?regNo=${item.applicantOther2}&intCls=${item.intCls}`" :title="item.tmName">
								<span v-show="item.core == 1" class="core">核心商标</span>
								<img :src="item.tmImg" class="tm_img_in" alt="">
							</a>
						</div>
		        <div class="text_line top_line">
		        	<span class="key">商标名称：</span>
		        	<a v-if="item.state==1" class="value" target="_blank" :href="userUrl +'/iprp/#/tradeDetail?trademarkId='+ item.id" :title="item.tmName">{{ item.tmName || '图形' }}</a>
							<a v-if="item.state!=1" class="value" target="_blank" :href="`${userUrl}/iprp/#/tradeDetail?regNo=${item.applicantOther2}&intCls=${item.intCls}`" :title="item.tmName">{{ item.tmName || '图形'}}</a>
		        </div>
		        <div class="text_line" @click="goDetailFn(item)">
		        	<span class="key">申请时间：</span>
		        	<span class="value">{{ item.appDate }}</span>
		        </div>
		        <div class="text_line" @click="goDetailFn(item)">
		        	<span class="qiye_tag">{{ item.applicationType == 1 ? '我的商标' : '竞品商标' }}</span><span class="already">{{ item.currentStatus }}</span><span class="already">已托管</span>
		        </div>
					</td>
					<td>{{ item.intCls }}类-{{ intClsData[item.intCls-1].goodsname }}</td>
					<!-- <td>{{ item.currentStatus }}</td> -->
					<!-- <td><span v-if="item.core==1">核心商标</span>  <span v-else>已托管</span></td> -->
					<td v-if="companyType==1">
						<el-popover placement="bottom" width="170" trigger="click" popper-class="user-popover" v-if="item.core==1">
              <p class="tip_p">{{`确定将"${item.tmName || '图形'}"从核心商标中移除？`}}</p>
              <div class="btn_out lc mt10">
                <el-button size="mini" @click="removeCoreFn(item)">确定</el-button><el-button size="mini" type="primary" @click="hidePop">暂不</el-button>
              </div>
              <a class="b_link" href="javascript:;" slot="reference">移除</a>
            </el-popover>
            <el-popover placement="bottom" width="170" trigger="click" popper-class="user-popover" v-if="item.core!=1">
              <p class="tip_p">{{`将商标"${item.tmName || '图形'}"设置为核心商标？`}}</p>
              <div class="btn_out lc mt10">
                <el-button size="mini" @click="hidePop">取消</el-button><el-button size="mini" type="primary" @click="addCoreFn(item)">确定</el-button>
              </div>
              <a class="b_link" href="javascript:;" slot="reference">设置</a>
            </el-popover>
						<!-- <span class="b_link" v-if="item.core==1" @click="removeCoreFn(item)">移除</span>
						<span class="b_link" v-if="item.core!=1" @click="addCoreFn(item)">设置</span> -->
					</td>
					<td>
						<a class="b_link" target="_blank" :href="`${userUrl}/iprp/#/tradeDetail?regNo=${item.applicantOther2}&intCls=${item.intCls}`">查看详情</a>
						<span class="b_link" @click="goSimilarFn(item)">查看近似商标</span>
					</td>
				</tr>
				<!-- <tr class="t_item t_option">
					<td>
						<el-checkbox v-model="checkedAll" v-show="showCheckAll" @change="selectAllFn">全选</el-checkbox>
					</td>
					<td colspan="2"></td>
					<td colspan="3" style="text-align:right; padding-right:10px;">
						<button class="btn_blue_o" v-if="!showSubmit" @click="editListFn">取消托管</button>
						<button class="btn_gray" style="margin-right:8px;" v-if="showSubmit" @click="cancelFn">取消</button>
						<button class="btn_blue_o" v-if="showSubmit" @click="submitFn">确认取消托管</button>
					</td>
				</tr> -->
			</tbody>
		</table>
		<div class="glint" v-if="showGlint"></div>
	</div>
</template>

<script>
	import Vue from 'vue';
	import intClsData from '../../../src/common/js/intClsData.js'
	const userUrl = CONFIG.userUrl;
	export default {
		props:{
			companyType: {
				type: Number,
				default: 1,
			},
			showGlint: {
				type: Boolean,
				default: false
			},
			resultList: {
				type: Array,
				default: []
			},
			editType: {
				type: Number,
				default: 1,    //1.取消托管
			},
			showList: {
				type: Boolean,
				default: true
			},
			loading: {
				type: Boolean,
				default: false
			}
		},
		data () {
			return {
				userUrl: userUrl,
				checkedAll: false,
				showCheckAll: false, //是否显示全选
				showSubmit: false,  //是否显示确认取消按钮
				intClsData: intClsData.cateIdData,  //所有分类信息
			}
		},
		methods: {
			//隐藏浮框
      hidePop(){
        document.getElementById('app').click();
      },
			// 查看商标性情
			goDetailFn (item) {
				this.$router.push({path: '/tradeDetail', query:{trademarkId: item.id}})
			},
			//  近似商标
			goSimilarFn (item) {
				this.$router.push({path: '/steward/approximateTrademark', query:{keyword: item.tmName}})
			},
			// 编辑列表
			editListFn () {
				this.showCheckAll = true;
				this.showSubmit = true;
				this.resultList.forEach( (item) => {
					item.showCheckbox = true;
				})
				this.$emit('showCheckBox', true);
			},
			// 全选
			selectAllFn () {
				this.resultList.forEach( (item) => {
					item.isSelect = this.checkedAll;
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
				console.log(selectList)
				sessionStorage.setItem('selectList', JSON.stringify(selectList));
			},
			// 取消
			cancelFn () {
				this.showCheckAll = false;
				this.showSubmit = false;
				this.checkedAll = false;
				this.resultList.forEach( (item) => {
					item.isSelect = false;
					item.showCheckbox = false;
				})
    		this.$emit('showCheckBox', false);
    		sessionStorage.removeItem('selectList');
			},
			// 提交
			submitFn () {
				let selectList = JSON.parse(sessionStorage.getItem('selectList')) || [];
				let list_ = [];
				if (!selectList.length) {   //如果没选择数据
					list_ = [];
				}
				else{
					selectList.forEach( (item) => {
						item.showCheckbox = false;
						if (item.isSelect) {
							list_.push(item.id)
						}
					})
				}
      	if (list_.length==0) {
      		this.$message({
            type: 'error',
            message: '请选择需要取消托管的商标!'
          });
      	}
      	else{
					this.showCheckAll = false;
					this.showSubmit = false;
      		this.$emit('submitFn', list_);
      		sessionStorage.removeItem('selectList');
      	}
			},
			// 移除核心商标
			removeCoreFn (item) {
				this.$emit('removeFn', item);
				this.hidePop();
			},
			// 设置核心商标
			addCoreFn (item) {
				this.$emit('addFn', item)
				this.hidePop();
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
			// 选择商标
			selectTmFn (item, index) {
				Vue.set(this.resultList, index, item);  //刷新视图
				this.isSelectAllFn();   //判断是否需要全选
				let selectList = JSON.parse(sessionStorage.getItem('selectList')) || [];
				if (item.isSelect) {
					selectList.push(item);
				}
				else{
					selectList.forEach( (info, i) => {
						if (info.id == item.id) {
							selectList.splice(i, 1);
							return;
						}
					})
				}
				sessionStorage.setItem('selectList', JSON.stringify(selectList));
			},
		},
		watch: {
			resultList () {
				let selectList = JSON.parse(sessionStorage.getItem('selectList')) || [];
				if (selectList.length) {
					this.showSubmit = true;
				}
				this.isSelectAllFn();   //判断是否需要全选
			}
		}
	}

</script>

<style scoped lang="scss">
	.list_table_box {
		width: 100%; height:auto; margin-top:15px;position: relative;
		.list_table {
			width:100%;
			th, td {
				text-align:center;
			}
			.t_head {
				background: #eee; height:39px;
				th { color:#333; font-size:13px; font-weight:normal;}
				th:first-child {text-align:left; padding-left:20px;}
				th:last-child {border-right: 1px solid #eee;}
			}
			.t_item {
				background:#fff;border: 1px solid #E6E6E6;border-top: 0;
				td:first-child {
					padding:22px 0 20px 20px; text-align:left; width:350px;
					.checkbox {float:left; margin:30px 10px 0 0; }
					.tm_img {
						width:80px; height:80px; overflow:hidden; float:left; background: #fff; border:1px solid #eee; display:inline-block; margin:0 15px 0 0; position:relative; cursor:pointer;
						.core {position:absolute; bottom:0; left:0; z-index:10; color:#FF9A2F;width:100%; height:25px;line-height: 25px; background:#FFF7E9;text-align: center;font-size: 13px;}
						.tm_img_in {width:100%; height:100%;}
					}
					.text_line {
						font-size:13px; margin-bottom: 10px; width:200px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; float:left; margin-bottom:6px; cursor:pointer;
						.key {color:#999}
						.value {color:#151515;}
						.qiye_tag{width:66px;height:20px;border-radius:20px;border:1px solid #44B74B;font-size:13px;color: #44B74B;display: inline-block;text-align: center;line-height: 18px;margin-right: 10px;}
						.already{width:53px;height:20px;border-radius:20px;border:1px solid #3DB1FA;font-size:13px;color: #3DB1FA;display: inline-block;text-align: center;line-height: 18px;margin-right: 10px;}
					}
					.top_line {margin-top:5px;}
				}
				td:last-child{border-right: 1px solid #E6E6E6;}
				td {
					font-size: 13px; color: #666666;
					.b_link:hover{text-decoration: none;}
				}
			}
			.t_option {
				td {padding:15px 0;}
			}
		}
		.glint{position: absolute;top: 0;right: 150px;height: 100%;width: 100px;border: 3px solid #F5A623;animation: 2s opacity 0s infinite;}
    @keyframes opacity{
      0%{opacity:1}
      50%{opacity:.2;}
      100%{opacity:1;}
  	}
	}
</style>
