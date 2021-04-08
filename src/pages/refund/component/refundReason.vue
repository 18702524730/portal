<template>
	<!-- 退款原因 -->
	<el-dialog title="退款原因" v-model="visible" custom-class="dialog-refundreason">
		<div class="pop_window">
			<div class="reason_detail">
				<p><label>退款原因：</label><span>服务单号服务订单</span></p>
				<p><label>申请时间：</label><span>2016-11-02 12:35</span></p>
				<p><label>退款描述：</label><span>服务单号服务单号服务单号服务单号服务单号</span></p>
			</div>
		</div>
	</el-dialog>
</template>

<script>
	export default {
		props:['visible'],
		data() {
			return {
			}
		},
		mounted () {
		},
		methods: {
		}
	}
</script>


<style lang="scss">
.dialog-refundreason{
	width:650px;min-height:300px;padding:20px 30px 35px;
	.el-dialog__body{padding:0;}
	.el-dialog__header{padding: 6px 0 16px;}
}
.pop_window{
	position: relative;
	font-size:14px;
	color: #333;
	.reason_detail{
		p{
			line-height:27px;
			color: #666;
			span{
				margin-right: 20px;
			}
			i.highlight{color: #f64744;font-style: normal;}
		}
	}
}
</style>
