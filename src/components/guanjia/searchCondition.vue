<template>
	<div class="search_condition clearfix">
		<!-- <div v-if="searchTypeFm" class="operation_type fl clearfix">
			<p class="fl mr40" :class="{'clickType':clickType==1}" @click="searchType(1)">商标名</p>
			<p class="fl mr40" :class="{'clickType':clickType==2}" @click="searchType(2)">注册号</p>
			<p class="fl" :class="{'clickType':clickType==3}" @click="searchType(3)">申请人</p>
		</div> -->
		<div class="result clearfix" v-if="showResult">
			<div class="fl tip" v-if="keyword">搜索到“<span>{{keyword}}</span>”的相关商标结果</div>
			<p class="fr">共找到{{total}}个结果</p>
		</div>
		<ul class="filter_con">
			<li>
				<label>商标分类：</label>
				<div class="v" :class="{'maxH': categoryMore}">
					<span v-for="(item, idx) in cateIdData" :class="{'cur': item.checked}" @click="bigSelect(item)">{{(item.id < 10 ? '0' + item.id : item.id) + ' ' + item['goodsname']}}</span>
				</div>
				<div class="more" @click="categoryMore=!categoryMore">
					<template v-if="!categoryMore">更多 <i class="fa fa-angle-down" aria-hidden="true"></i></template>
					<template v-else>收起 <i class="fa fa-angle-up" aria-hidden="true"></i></template>
				</div>
			</li>
			<li>
				<label>商标状态：</label>
				<div class="v maxH">
					<span v-for="(item, idx) in statusFilterData" :class="{'cur': status===item.id}" @click="status= status===item.id ? '' : item.id">{{item['name']}}</span>
				</div>
			</li>
			<li>
				<label>托管状态：</label>
				<div class="v maxH">
					<span v-for="(item, idx) in hosting" :class="{'cur': untrusteeship===item.id}" @click="untrusteeship= untrusteeship===item.id ? 0 : item.id">{{item['name']}}</span>
				</div>
			</li>
			<!-- <li>
				<label>申请年份：</label>
				<div class="v maxH">
					<span>2018</span><span>2017</span><span>2016</span><span>2015</span><span>2014</span><span>2013</span>
				</div>
			</li> -->
		</ul>
	</div>
</template>
<script>
	import Vue from 'vue'
	import Util from 'src/common/js/util.js'
	import Filters from 'api/filters.js'
	import intClsData from 'src/common/js/intClsData.js'
	import qs from 'qs'
	const indexUrl = CONFIG.indexUrl;
	const rootUrl = CONFIG.rootUrl;
	const czUrl = CONFIG.czUrl;
	const statusFilterData = [
		{
			id: 0,
			name: '已销亡',
			selected:false
		},
		{
			id: 1,
			name: '待审中',
			selected:false
		},
		{
			id: 2,
			name: '已注册',
			selected:false
		},
		{
			id: 3,
			name: '已驳回',
			selected:false
		},
		{
			id: 4,
			name: '已初审',
			selected:false
		}
	]
	const hosting = [
		{
			id: 1,
			name: '未托管',
			selected:false
		},
		{
			id: 2,
			name: '已托管',
			selected:false
		}
	]
	export default {
		props: ['showResult', 'keyword', 'total', 'isReset'],
		data(){
			return{
				untrusteeship: 0,
				status:'',//法律状态
				categoryMore: false,
				statusFilterData:statusFilterData,
				hosting:hosting,
        cateIdData: intClsData.cateIdData,
        selectedBigItem:[],//选中的大类
			}
		},
		methods:{
			bigSelect(item){
	  		item.checked = !item.checked;
	  		this.search();
	  	},
	  	getIntCls(){
	  		return this.cateIdData.filter((item) => {
		 			return item.checked
		 		}).map((item) => {
		 			return item.id<10 ? '0'+item.id : item.id
		 		})
	  	},
	  	search(){
	  		this.selectedBigItem = this.getIntCls();
	  		console.log({
					intCls:this.selectedBigItem.join(),
    			status:this.status,
    			untrusteeship: this.untrusteeship
				})
	  		this.$emit('search', {
					intCls:this.selectedBigItem.join(),
    			status:this.status,
    			untrusteeship: this.untrusteeship
				});
	  	},
			resetAll(){//重置大类
				this.cateIdData.forEach((item) => {
		 			item.checked = false;
		 		});
		 		this.status = '';
		 		this.search();
			},
		},
		mounted(){
			let query = this.$route.query;
			let idsArr = query.intCls ? query.intCls.split(',') : [];
			idsArr = idsArr.map((id) => {
				return id-0;
			});
	 		this.cateIdData.forEach((item) => {
	 			item.checked = idsArr.indexOf(item.id) !== -1
	 		});
	 		this.status = query.status ? query.status-0 : '';
	 		if (this.status === '') {
	 			this.search();
	 		}
		},
		watch: {
			isReset(){
				if (this.isReset) {
					this.resetAll();
				}
			},
			status(){
				this.search();
			},
			untrusteeship(){
				this.search();
			},
		},
	}
</script>

<style lang="scss">
.search_condition{
	position: relative;background-color: #fff;text-align: left;
	/* .operation_type{
		p{font-size:12px;color:#666;line-height: 26px;cursor: pointer;}
		p:hover{color:#3db1fa;}
		.clickType{color:#3db1fa;}
	} */
	.result{
		font-size:13px;height: 46px;padding-top: 15px;line-height: 16px;color: #999999;
		.tip{
			span{color: #3DB1FA;}
		}
		p{}
	}
	.filter_con{
		li{
			font-size:13px;line-height: 26px;padding:12px 20px;border: 1px solid #DDDDDD;margin-top: -1px;vertical-align: top;
			label{display: inline-block;color:#999;vertical-align: top;}
			.v{
				padding-left: 30px;display: inline-block;width: 740px;vertical-align: top;max-height: 26px;overflow: hidden;transition: max-height 0.3s ease;
				span{
					display: inline-block;width: 100px;cursor: pointer;
					&.cur{color:#3DB1FA;}
				}
			}
			.maxH{max-height: 500px;}
			.more{
				float: right;color:#999;cursor: pointer;
				&:hover{color: #3DB1FA;}
				.fa{font-size: 18px;}
			}
		}
	}
}
</style>
