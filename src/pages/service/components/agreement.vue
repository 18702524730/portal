<template>
	<div class="service_agreement">
		<div class="loading" v-loading="agreementLoading" v-show="agreementLoading"></div>
		<div class="agree_header" v-if="!agreementLoading">
			<img class="fl" src="~assets/img/service/logo.png" width="99" height="16">
			<p class="fr">杭州拾贝知识产权服务有限公司</p>
		</div>
		<div class="agree_body" v-if="!agreementLoading">
			<h1>国内商标注册申请委托代理协议</h1>
			<p class="mt10 alignr" style="font-size: 14px;">协议号：【{{agreeData.workOrderSn}}】</p>
			<p class="mt20"><b>委托方（甲方）：</b>  {{agreeData.applyName}}<br>委托人地址： {{agreeData.address}}   </p>
			<p class="mt20"><b>受托方（乙方）：</b>杭州拾贝知识产权服务有限公司<br>受托方地址：浙江省杭州市江干区红普路788号创智绿谷发展中心6号楼1202室</p>
			<p class="mt30">甲乙双方经友好平等协商，甲方确认委托乙方办理下述商标有关代理事宜：</p>
			<h3>一、委托事项及费用</h3>
			<p>1.1甲方委托乙方办理下列表中商标注册申请事宜，商标具体信息以甲方最终确认的《商标代理委托书》为准。</p>
			<table class="tmInfo mt10 border">
				<thead>
					<tr>
						<th class="title" width="160">商标信息</th>
						<th class="title" width="240"> </th>
						<th class="title" width="160"> </th>
						<th class="title" width="240"> </th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="title">商标信息</td>
						<td>{{agreeData.trademarkName}}</td>
						<td class="title">商标图样</td>
						<td class="img">
								<img :src="agreeData.picUrl">
						</td>
					</tr>
					<tr>
						<td class="title minsTitle">小项信息</td>
						<td class="alignl mins" colspan="3">
							<p v-for="(item, i) in niceData" v-if="!!item" :class="{'mt15': i>0}">{{item}}。</p>
						</td>
					</tr>
				</tbody>
			</table>
			<table class="feeInfo border">
				<thead>
					<tr>
						<th class="title" width="160">费用信息</th>
						<th class="title" width="240"> </th>
						<th class="title" width="160"> </th>
						<th class="title" width="240"> </th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="title">含税单价</td>
						<td>{{agreeData.goodPrice | priceformat}}</td>
						<td class="title">件数</td>
						<td>共{{agreeData.item}}件</td>
					</tr>
					<tr>
						<td class="title">增项含税单价</td>
						<td>{{agreeData.nicePrice | priceformat}}</td>
						<td class="title">增项个数</td>
						<td>共{{agreeData.additionItem}}个</td>
					</tr>
					<tr>
						<td class="title">总金额</td>
						<td class="alignl" colspan="3">{{agreeData.totalPrice | priceformat}}（大写： {{agreeData.capitalTotalPrice}}圆整）</td>
					</tr>
				</tbody>
			</table>
			<p class="mt15">1.2本协议约定的费用仅为商标注册代理事宜的总费用，如商标在注册过程中产生其他程序，甲乙双方需另行签订委托协议，所需费用另行计算。</p>
			<h3>二、甲方的权利与义务</h3>
			<p>2.1甲方应及时向乙方提供真实、准确、有效的申请商标所需信息资料及相关证明，并全力配合乙方工作，全部文档格式及内容以乙方认定的为准，甲方不得私自改动，因此造成的时间及相关损失由甲方承担，并可视为本协议无效。<br><b>2.2甲方承诺申请注册的商标不得损害国家利益、公众利益、社会主义道德风尚或有其他不良影响的规定，同时也提示了甲方知识产权应当具备独创性、显著性的特征；若甲方委托事项存在故意抢注或者故意侵犯他人在先权利的情况，相应的责任由甲方自行承担。</b><br>2.3甲方应按本协议约定及时足额支付费用，否则乙方有权中止或终止履行义务。<br>2.4若在乙方收到商标注册申请受理通知书后商标局再次下发补正通知书，甲方未配合乙方进行补正（包括但不限于未能按时提交证照或未能按要求签章或提供说明等），因此导致的后果由甲方承担。<br><b>2.5甲方的联系人、联系电话、联系地址、邮箱等发生变化时应及时通知乙方,若甲方未及时通知导致乙方无法或未及时将相应通知、公告等官方文件送达的，因此产生的损失由甲方承担。</b></p>
			<h3>三、乙方的权利与义务</h3>
			<p><b>3.1乙方应当就委托事项向甲方提供可行性建议，包括提供相关查询及分析报告、业务基本流程、时限、风险等。与此同时，乙方是基于中国商标网等公开的数据进行检索（不含图形要素），因检索受客观技术因素影响，对于数据盲期内（即乙方出具检索结果日前六个月之内他人的商标申请信息无法检索）出现的相同检索结果导致甲方事务办理不成功的，乙方不承担责任。</b><br>3.2为保障甲方委托上报的及时性，甲方同意乙方也可以其关联公司名义上报相应的委托事务，但无论乙方以任何关联公司名义上报，均由乙方独立向甲方承担本协议的权利义务。<br>3.3乙方应在收到甲方全额款项后的7个工作日内开具发票。<br>3.4乙方对因本协议项下交易所知悉的甲方相关商标注册申请信息负有保密义务。<br>3.5乙方递交商标注册申请后如发生商标补正事宜，应在收到补正通知后的3个工作日内向甲方反馈并跟进。<br>3.6代理期限结束后，乙方在收到商标局下发有关本协议商标的官方法律文书时应及时通知或邮寄给甲方。</p>
			<h3>四、代理期限</h3>
			<p>4.1本协议自双方盖章或签字之日起生效，至乙方将本协议代理事项最终官方文书交付甲方或者将最终结果告知甲方之日终止。</p>
			<h3>五、其他</h3>
			<p>5.1商标官方法律文书的下发时间以商标局实际发文为准；若因不可抗力或商标局自身原因以及非乙方原因造成的拖延与损失，乙方不承担责任。<br>5.2如因本协议发生纠纷，双方应及时协商解决，协商不成的，任何一方可向乙方住所地人民法院提起诉讼。<br>5.3甲乙双方共同认可，在本协议生效后，甲方有其他知识产权业务需求时，双方也可以通过确认单的方式明确该业务的具体信息，但双方的权利义务约定仍以本协议为准。<br>5.4本协议内容如与协议生效前甲乙双方的口头或书面约定相抵触的，以本协议为准。本协议的传真件、扫描件、电子版形式具有同等法律效力。<br>5.5本协议一式两份，甲乙双方各执一份，自双方签字或盖章之日起生效。</p>
			<p class="mt30">（以下无协议正文）</p>
		</div>
		<div class="agree_footer" v-if="!agreementLoading">
			<div class="jia">
				<p>甲方（签章）：</p>
				<p class="mt10" v-if="agreeData.firstPartyConfirmTime">日期： &nbsp;&nbsp;{{agreeData.firstPartyConfirmTime}}</p>
				<p class="mt10" v-else>日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</p>
			</div>
			<div class="yi">
				<p>乙方（签章）：</p>
				<p class="mt10" v-if="agreeData.confirmTime">日期： &nbsp;&nbsp;{{agreeData.confirmTime}}</p>
				<p class="mt10" v-else>日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</p>
			</div>
			<img src="~assets/img/service/z.png" width="179" height="179">
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import Filters from 'api/filters.js'
	export default {
  	components: {
    },
    props:['workOrderSn'],
    data() {
      return {
      	agreementLoading:false,
      	agreeData:{},
      	niceData:[]
      }
    },
    methods: {
      getDetail(){
      	this.agreementLoading = true;
      	this.$http.get('./api/read_contract?workOrderSn='+this.workOrderSn)
      	.then((response) => {
      		this.agreementLoading = false;
					this.agreeData = response.data;
					this.niceData = this.agreeData.nice.split('。');
        })
        .catch((error) => {
        	//this.agreementLoading = false;
        	var err = error.response && error.response.data;
          if (err) {
            this.$message.error(err.msg);
          }
        });
      }
    },
    mounted() {
    	this.getDetail()
    },
    filters:{
    	dateFormat: Filters.formatDate.dateFormat,
    	priceformat:Filters.priceformat
    }
  }
</script>
<style lang="scss">
	.service_agreement{
		width:860px;padding: 0 20px;
		.loading{height: 500px;width:100%;}
		.agree_header{
			height: 48px;border-bottom: 1px solid #EEEEEE;padding-top: 20px;
			img{width:99px!important;}
			p{font-size: 14px;color: #999999;line-height: 16px;}
		}
		.agree_body{
			padding: 0 10px 20px;margin-top: 20px;font-size: 13px;color: #151515;line-height: 28px;background: transparent url(~assets/img/service/bg.png) center 0 repeat-y;
			h1{text-align: center;font-size: 18px;color: #333333;}
			h3{font-size: 13px;color: #333333;line-height:17px;padding: 15px 0;}
			p{
				color:#333;
				b{color:#151515;}
			}
			.alignr{text-align: right;}
			table.border{
				border: 1px solid #EEEEEE;width:800px;
				th.title{background-color: #EEEEEE;height: 40px;text-align: left;font-size: 13px;color: #333333;padding-left: 10px;}
				td{width:160px;height: 160px;text-align: center;border: 1px solid #EEEEEE;padding: 10px;}
				td.title{padding-left: 10px;width:160px;text-align: left;border: 1px solid #EEEEEE;}
				td.alignl{text-align: left;padding-left: 10px;}
				td.img{
					img{display: block;margin:0 auto;max-width: 220px;max-height: 140px;}
				}
			}
			table.tmInfo{
				td.minsTitle{height:auto; }
				td.mins{
					height:auto;
					p{font-size: 12px;color: #333333;line-height: 18px;}
				}
			}
			table.feeInfo{
				margin-top: 10px;
				td{height: 40px;text-align: left;padding-left: 10px;line-height: 20px;}
			}
		}
		.agree_footer{
			height: 220px;width:100%;line-height: 28px;margin-top: -60px;padding:80px 10px 0;position: relative;
			.jia{float: left;width:500px;}
			.yi{float: left;width:200px;}
			img{position: absolute;top: 0;right:0;width:179px!important}
		}
	}
</style>
