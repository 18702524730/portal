<template>
	<div>
		<!-- 待评价 -->
		<template>
			<table class="table table-bordered listHeadExplain">
				<thead>
					<tr>
						<th style="width:484px;text-align:left;padding-left:20px;">
							<span>商品</span>
							<span style="margin-left:300px;" class="mr15">单价</span>
							<span class="ml40">数量</span>
						</th>
						<th style="width:160px;"><span>实付款</span></th>
						<th style="width:140px;"><span>状态</span></th>
						<th><span>操作</span></th>
					</tr>
				</thead>
			</table>
			<!-- </div> -->
			<div class="listHead mt20" v-if="!loading">
				<table class="table table-bordered mb10" v-for="(item, index) in dataList" v-if="dataList&&dataList.length">
					<thead>
						<tr>
							<th colspan="4">
								<div class="title">
									<span>{{item.create_time|dateFormat}}</span>
									<span style="width:140px;">订单号：{{item.order_fictitious_sn}}</span>
									<span class="shop_name" @click="shopDetail(item)">{{item.order_store_name | storeName}}</span>
									<contactQQ :type="item.order_distribute_from" :qqCode="item.order_store_code" :qqOrder="item.order_bs_number"></contactQQ>
								</div>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="name">
								<tr v-for="(info,index) in item.fictitiousList" :class="{'pt20':index>0,'pb20':(item.fictitiousList.length>0&&index+1!=item.fictitiousList.length)}" :key="info.order_id">
									<td :class="{'bor_bottom':(item.fictitiousList.length>0&&index+1!=item.fictitiousList.length)}">

										<div class="fl img" style="width: 90px;height: 90px;border: 1px solid #eee;">
											<!-- <img src="~assets/img/wxgzh.jpg"> -->
											<img :src="info.orderBsImage" style="width: 88px;height: 88px;" alt="" @click="toDetaild(info)">
										</div>
										<div class="servicr_r ml15">
											<div class="clearfix order_info" style="width:340px">
												<p class="fl name" @click="toDetaild(info)">{{info.orderInformation?info.orderInformation.trademarkName:info.orderName}}</p>
												<p class="fl ml30">{{info.amount|priceformat}}</p>
												<p class="fr">X{{info.paymentNumber}}</p>
											</div>
										</div>
									</td>
								</tr>

							</td>
							<td class="info">
								<div><span>{{item.amount|priceformat}}</span></div>
							</td>
							<td class="money">
								<div><span>{{item.order_state|orderStatusformat}}</span></div>
							</td>
							<td class="action">
								<div>
									<el-button size="small" @click="toAppraise(item.order_fictitious_sn)">评价</el-button>
									<!-- 上传申请材料 -->
									<router-link :to="'orders/'+item.order_fictitious_sn">查看详情</router-link>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
				<noResult v-if="!dataList.length"></noResult>

				<div class="pagination-wrap mt20" v-if="!loading&&dataList.length">

					<el-pagination
						@current-change="currentChange"
						:page-size="size"
						:current-page="page"
						layout="total, prev, pager, next, jumper"
						:total="total"
						background>
					</el-pagination>
				</div>
			</div>
		</template>
	</div>
</template>
<script>
	import Vue from 'vue'
	import $ from 'jquery'
	import noResult from 'components/noResult/noResult.vue'
	import contactQQ from 'components/contactQQ.vue'
	import Filters from '../../../api/filters';
	const trademarkUrl = CONFIG.trademarkUrl;
	const indexUrl = CONFIG.indexUrl;

	export default {
		components: {
			noResult,contactQQ
		},
		data(){
			return{
				size:5,
				page:1,
				total:0,
				loading:false,
				appraiseState:1,
				dataList:[]
			}
		},
		methods:{
			shopDetail(item){
				window.open(indexUrl+'/store/'+item.order_store_code+'.htm')
			},
			toDetaild(item){
				if(item.orderBussinessType == 4){//交易订单
					window.open(trademarkUrl+'/trademark/'+item.order_bs_number+'.htm')
				}else{
					window.open(item.orderBsCode === 'sbfw_gnsb_zzzc' ? `${indexUrl}/sebe/pages/selfRegister.html#/one` : indexUrl+'/store/service/'+item.order_bs_number+'.htm')
				}
			},
			currentChange(page){
				console.log(page)
				var path = this.$router.path;
				this.page = page;
				this.$router.push({path: path, query: {'page':this.page}});
				this.search();
			},
			toAppraise(index){
				this.$router.push({ path: '/appraiseDetail/'+index})
			},
			search(){
				this.loading=true;
				this.$http.get('./api/findPlatformOrderList', {
						params: {
							isEvaluate:0,
							orderState: 1,
							page: this.page,
							size: this.size
						}
					})
				.then((response) => {
					var data = response.data;
					this.loading = false;
					this.total = data.total_elements;
					// this.page = data.total_elements ;
					this.dataList = data.elements;

				})
				.catch((error) => {

				});
			}
		},
		mounted(){
			console.log(this.$route.query.page)
			var page = Number(this.$route.query.page);
			this.page = page?page:1;
			console.log(this.page)
			this.search();
		},
		watch: {
		},
		filters: {
			orderStatusformat:Filters.orderStatusformat,
			dateFormat:Filters.formatDate.dateFormat,
			priceformat:Filters.priceformat,
			storeName:Filters.storeName,
		}
	}
</script>
