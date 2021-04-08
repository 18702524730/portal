<template>
	<div>

		<!-- 全部企业 -->
		<el-dialog title="法律状态更新" :visible.sync="msgVisible" custom-class="message_dialog" >
			<div class="dialog_cotent">
				<div class="msg_item clearfix">
					<div class="tm_img"></div>
					<div class="tm_info clearfix">
						<div class="text_line text_line_one">
		        	<span class="key">商标名称：</span>
		        	<span class="value">杭州拾贝</span>
		        </div>
		        <div class="text_line ">
		        	<span class="key">注册号：</span>
		        	<span class="value">54564564</span>
		        </div>
		        <div class="text_line ">
		        	<span class="key">申请时间：</span>
		        	<span class="value">2017.07.07</span>
		        </div>
		        <div class="text_line ">
		        	<span class="key">商标类别：</span>
		        	<span class="value">45类-法律</span>
		        </div>
		        <div class="text_line ">
		        	<span class="key">申请人：</span>
		        	<span class="value">锤子科技受打击佛设计费</span>
		        </div>
					</div>
					<ul class="msg_info clearfix" v-if="msgType == 1">
						<li class="active">2008.5.18商标注册申请受理通知书发文</li>
						<li>2008.5.18商标注册申请受理通知书发文</li>
					</ul>
					<ul class="msg_info clearfix" v-if="msgType == 2">
						<li class="warm">
							<span class="o_text">此商标工商信息有变更，商标著录项目信息未同步</span>
							<button class="btn_blue_o">商标变更</button>
						</li>
						<li class="warm">
							<span class="o_text">此商标处于初审公告期，可能有第三方异议风险</span>
							<button class="btn_blue_o">咨询专家</button>
						</li>
						<li class="warm">
							<span class="o_text">此商标y已满3年，可能有第三方撤三风险</span>
							<button class="btn_blue_o">咨询专家</button>
						</li>
						<li class="warm">
							<span class="o_text">此商标即将到期，请尽快办理续展</span>
							<button class="btn_blue_o">商标续展</button>
						</li>
					</ul>
					<ul class="msg_info clearfix" v-if="msgType == 3">
						<li class="warm">
							<span class="o_text">此商标正处于初审公告期，您可提出</span>
							<button class="btn_blue_o">异议申请</button>
						</li>
						<li class="warm">
							<span class="o_text">此商标注册已满三年，您可提出</span>
							<button class="btn_blue_o">撤三申请</button>
						</li>
						<li class="warm">
							<span class="o_text">此商标未续展注销已满一年，您可以</span>
							<button class="btn_blue_o">立即注册</button>
						</li>
					</ul>
				</div>

			</div>
		</el-dialog>

	</div>



</template>
<script>
	import Vue from 'vue'
	import Util from 'src/common/js/util.js'
	import Filters from 'api/filters.js'

	export default {
		props: {
			msgType: {
				type: Number,
				default: 1,   //消息类型 1.法律状态 2.风险预警 3.情报 4.近似商标
			},
			msgVisible: {
				type: Boolean,
				default: false
			}
		},
		data(){
			return{

			}
		},
		methods:{

		},
		mounted(){
			
		},
		watch: {
			// 如果路由有变化，会再次执行该方法
			'$route': 'search'
		}
	}
</script>

<style lang="scss">
	.message_dialog {
		width:600px;
		.el-dialog__header {text-align:left;}
		.dialog_cotent {
			width:560px; margin:20px; border: 1px solid #E6E6E6; max-height:500px; overflow-y:auto;
			.msg_item {
				width: 520px; margin:20px; border-bottom: 1px dashed #E6E6E6; 
				.tm_img {width:80px; height:80px; float:left; background: #D8D8D8; display:inline-block; margin:0 15px 0 0;}
				.tm_info {
					max-width:400px; float:left; padding-top:5px;
					.text_line {
						font-size:13px; margin-bottom: 10px; width:200px; overflow:hidden; float:left; margin-bottom:6px;
						.key {color:#666}
						.value {color:#151515;}
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
						.btn_blue_o {height:26px; line-height:25px; float:right; padding:0 10px;}
					}
				}
			}
		}
	}
</style>
