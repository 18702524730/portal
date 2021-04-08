<template>
	<div>
		<!-- 操作记录 -->
		<div class="operation" v-if="operationRecord && operationRecord.length">
			<p class="mb10 mt15">操作记录</p>
			<table class="table table-bordered">
		    <thead>
		      <tr>
		        <th class="td01" style="padding-left:30px;">
		        	<p>操作时间</p>
		        </th>
		        <th class="td02">
		        	<p>操作状态</p>
		        </th>
		        <th class="td03">
		        </th>
		      </tr>
		    </thead>
		    <tbody>
		      <tr class="state_list">
		        <td class="td01" style="padding-left:10px;">
		        	<div class="state_time" v-for="(item,$index) in operationRecord">
		        		<p><span class="mr10 sc">●</span>{{item.operatorTime | dateFormat}}</p>
		        		<i v-if="$index+1 != operationRecord.length"></i>
		        	</div>
		        	<div class="state_time" style="height:40px;" v-if="!operationRecord">
		        		<p style="padding-left:20px;">--</p>
		        	</div>
		        </td>
		        <td class="td02">
		        	<div class="state_time" :class="{'lh40':$txtindex+1 != operationRecord.length}" v-for="(item,$txtindex) in operationRecord">
		        		<p>{{item.recordContentService}}</p>
		        	</div>
		        	<div class="state_time" style="height:40px;" v-if="!operationRecord">
		        		<p>--</p>
		        	</div>
		        </td>
		        <td class="td03">
		        	<!-- <div class="change_providers clearfix">
		        		<img src="~assets/img/portrait.png" class="fl" alt="">
		        		<div class="fl change_txt ml20">
		        			<span>您好，我是拾贝网{{code}}号服务商</span>
		        			<p class="mt5 mb5"><img class="mr5" src="~assets/img/happy.png" alt="">如果对我的服务满意，请把我推荐给更多人</p>
		        			<p><img class="mr5" src="~assets/img/cry.png" alt="">我不满意，我要<a @click="dialogVisible = true">切换服务商</a></p>
		        		</div>
		        	</div> -->
		        </td>
		      </tr>
		      <!-- <tr class="state_list">
		      	<td colspan="3" style="padding-left: 30px;">暂无</td>
		      </tr> -->
		    </tbody>
		  </table>
		</div>
		<el-dialog title="客户服务"
		  :visible.sync="dialogVisible" class="state_preview" :modal-append-to-body="true">
			<p class="mt10">很抱歉，我们的服务未能让您满意，请致电官方服务电话，平台客户顾问将立即为您服务。</p>
			<p>服务电话：<a>4000-315-426</a></p>
			<div class="set_btn clearfix mt15">
				<p class="right_btn fr" @click="dialogVisible = false">确定</p>
				<p class="left_btn fr mr10" @click="dialogVisible = false">取消</p>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import Vue from 'vue'
	import Filters from 'api/filters.js'
	export default {
  	components: {
    },
    props:['operationRecord','code'],
    data() {
      return {
      	dialogVisible:false,
      }
    },
    methods: {
      preview(){
      	this.dialogVisible = true;
      }
    },
    mounted() {
    	// this.status = this.$router.query.status;
    },
    filters:{
    	dateFormat: Filters.formatDate.dateFormat
    }
  }
</script>
<style lang="scss">
.operation{
	table{width:905px;}
}
.state_list{
	.td02{padding-top:10px;
		p{line-height:24px;}
	}
	.lh40{height:39px;vertical-align: top;
	}
}
// 切换服务商弹框
.state_preview{
	.el-dialog__title{font-size: 14px;color: #223344;font-weight: normal;}
	.el-dialog__body{padding:10px 20px 20px;
		p{
			a{text-decoration:none;color:#3db1fa;}
		}
	}
	.el-dialog{width:400px;}
	.el-dialog__header{text-align:left;}
	.set_btn{
		p{width:88px;height:30px;line-height:30px;text-align:center;border-radius: 2px;cursor:pointer;}
		.right_btn{background: #479CFF;color:#fff;}
		.left_btn{background: #FFFFFF;border: 1px solid #ddd;color:#666}
	}
	.service_limit{position: absolute;bottom:85px;right: 30px;color:#999;font-size:13px;}
}
// 商标小项表格
.__myOrders .operation table tr td,.__myOrders .operation table tr th{border:0;}
.__myOrders .operation table tr.state_list,{border: 1px solid #E6E6E6;border-top:0;box-sizing:border-box;width:905px;}
.__myOrders .operation table tr th{line-height:40px;padding-left:0;background: #EEEEEE;border: 1px solid #EEEEEE;
	p{font-size: 13px;color: #333333;font-weight: normal;}
}
.__myOrders .operation table tr td{padding:10px 0;}
.__myOrders .operation table tr td.td05{
	p{color: #f64744;}
}
.__myOrders .operation{padding:0;}
</style>
