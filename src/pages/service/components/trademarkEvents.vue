<template>
	<div>
		<!-- 商标分类与小项，未确认信息 ,上下两个可以共用，06,07需要v-if ，class需要判断-->
		<div class="eventsLists" v-if="status<3">
			<p class="mb10 mt15">商标分类与小项信息</p>
			<table class="table table-bordered">
		    <thead>
		      <tr>
		        <th class="td01">
		        	<p>服务单号</p>
		        </th>
		        <th class="td02">
		        	<p>商标类别</p>
		        </th>
		        <th class="td03">
		        	<p>小项数</p>
		        </th>
		        <th class="td04">
		        	<p>商品/服务</p>
		        </th>
		        <th class="td05">
		        	<p>小项补费用</p>
		        </th>
		      </tr>
		    </thead>
		    <tbody>
		      <tr class="state_list" v-for="item in orderInformation">
		        <td class="td01">
		        	<p>{{item.orderSn}}</p>
		        </td>
		        <td class="td02">
		        	<p>{{getTmInfo(item.intCls)}}</p>
		        </td>
		        <td class="td03">
		        	<p>{{item.minNumber}}</p>
		        </td>
		        <td class="td04">
		        	<p>{{item.min}}</p>
		        </td>
		        <td class="td05">
		        	<p>{{item.premium | priceformat}}</p>
		        </td>
		      </tr>
		    </tbody>
		  </table>
		</div>
		<!-- 商标分类与小项，已确认信息 -->
		<div class="eventsConfirm" v-if="status>=3">
			<p class="mb10 mt15">商标分类与小项确认</p>
			<table class="table table-bordered">
		    <thead>
		      <tr>
		        <th class="td01">
		        	<p>服务单号</p>
		        </th>
		        <th class="td02">
		        	<p>商标类别</p>
		        </th>
		        <th class="td03">
		        	<p>小项数</p>
		        </th>
		        <th class="td04">
		        	<p>商品/服务</p>
		        </th>
		        <th class="td05">
		        	<p>小项补费用</p>
		        </th>
		        <th class="td06">
		        	<p>办理状态</p>
		        </th>
		        <!-- <th class="td07">
		        	<p>操作</p>
		        </th> -->
		      </tr>
		    </thead>
		    <tbody>
		      <tr class="state_list" v-for="item in orderInformation" >
		        <td class="td01">
		        	<p>{{item.orderSn}}</p>
		        </td>
		        <td class="td02">
		        	<p>{{getTmInfo(item.intCls)}}</p>
		        </td>
		        <td class="td03">
		        	<p>{{item.minNumber}}</p>
		        </td>
		        <td class="td04">
		        	<p>{{item.min}}</p>
		        </td>
		        <td class="td05">
		        	<p>{{item.premium | priceformat}}</p>
		        </td>
		        <td class="td06">
		        	<p>{{item.order_feedback_state}}</p>
		        	<p style="cursor:pointer;color:#408ce6" @click="viewRecord(item)">查看服务记录</p>
		        </td>
		        <!-- <td class="td07">
		        	<p style="cursor:pointer;" @click="viewRecord(item)">查看服务记录</p>
		        </td> -->
		      </tr>
		    </tbody>
		  </table>
		</div>
		<!-- 创新保 -->
		<div class="eventsLists" v-if="cxbStatus == 6 || cxbStatus == 8">
			<p class="mb10 mt15">商标分类与小项确认</p>
			<table class="table table-bordered">
		    <thead>
		      <tr>
		        <th class="td01">
		        	<p>服务单号</p>
		        </th>
		        <th class="td02">
		        	<p>商标类别</p>
		        </th>
		        <th class="td03">
		        	<p>小项数</p>
		        </th>
		        <th class="td04">
		        	<p>商品/服务</p>
		        </th>
		        <th class="td05">
		        	<p>办理状态</p>
		        </th>
		      </tr>
		    </thead>
		    <tbody>
		      <tr class="state_list" v-for="item in orderInformation">
		        <td class="td01">
		        	<p>{{item.orderSn}}</p>
		        </td>
		        <td class="td02">
		        	<p>{{item.niceClassInfo}}</p>
		        </td>
		        <td class="td03">
		        	<p>{{item.niceNum}}</p>
		        </td>
		        <td class="td04">
		        	<p>{{item.niceMinInfo || '--'}}</p>
		        </td>
		        <td class="td05">
		        	<p style="color:#333">{{item.bsFeedbackCodeName || '--'}}</p>
		        	<p style="cursor:pointer;color:#408ce6" @click="viewRecord(item)">查看服务记录</p>
		        </td>
		      </tr>
		    </tbody>
		  </table>
		</div>
	</div>
</template>
<script>
import intClsData from 'src/common/js/intClsData.js'
import Filters from 'api/filters.js'
	export default {
  	components: {

    },
    props:['orderInformation','status','cxbStatus'],
    data() {
      return {
      	cateIdData: intClsData.cateIdData,
      }
    },
    methods: {
    	getTmInfo(item){
    		if(item){
    			var str = '第'+ item + '类-' + this.cateIdData[item-1]['goodsname'];
    			return str;
    		}else{
    			var str = '--';
    			return str;
    		}
      },
    	viewRecord(recordData){
    		this.$emit('viewRecord', recordData);
    	}
    },
    mounted() {
    	console.log(this.orderInformation)
    },
    filters: {
    	priceformat:Filters.priceformat
    }
  }
</script>
<style lang="scss">
	// 商标小项表格
.__myOrders .eventsLists table tr td,.__myOrders .eventsLists table tr th{border:0;}
.__myOrders .eventsLists table tr.state_list,.__myOrders .eventsConfirm table tr.state_list{border: 1px solid #E6E6E6;border-top:0;box-sizing:border-box;width:905px;}
.__myOrders .eventsLists table tr th,.__myOrders .eventsConfirm table tr th{line-height:40px;padding-left:0;background: #EEEEEE;border: 1px solid #EEEEEE;
	p{font-size: 13px;color: #333333;font-weight: normal;}
}
.__myOrders .eventsLists table tr td,.__myOrders .eventsConfirm table tr td{padding:10px 0;}
.__myOrders .eventsLists table tr td.td05,.__myOrders .eventsConfirm table tr td.td05{
	p{color: #f64744;}
}
.__myOrders .eventsLists,.__myOrders .eventsConfirm{padding:0;}
</style>
