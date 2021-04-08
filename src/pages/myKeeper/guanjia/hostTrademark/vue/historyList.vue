<template>
	<div class="history_list">
		<h4>历史记录</h4>
		<transition name="fade">
		<div v-if="historyData.length">
			<span v-for="(item, idx) in historyData" @click="search(item.name)">{{item.name}}<i class="el-icon-circle-close" @click.stop="del(item)"></i></span>
		</div>
		</transition>
		<div class="empty" v-if="!loading && !historyData.length">暂无</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import qs from 'qs'
	const stewardUrl = CONFIG.stewardUrl;
	export default {
		props: ['recordType'],
		data(){
			return{
				loading: false,
				historyData:[],
			}
		},
		methods:{
			search(name){
				this.$emit('search', name);
			},
			del(item){
      	let info = {
      		recordType: this.recordType,
      		name:item.name,
      		id:item.id
      	}
      	this.$http.get(stewardUrl + '/smallStewardTadeMark/deleteRecord?'+qs.stringify(info))
				.then((resp) => {
					this.$message.success('删除成功');
					this.getHistoryList();
				})
	      .catch((err) => {
	        console.log(err);
	      });
      },
      getHistoryList(){
      	this.loading = true;
      	this.$http.get(stewardUrl + '/smallStewardTadeMark/selectRecordList?recordType='+ this.recordType +'&page=1&size=10&isCompany=0')
				.then((resp) => {
					this.loading = false;
					this.historyData = resp.data.data || [];
				})
	      .catch((err) => {
	      	this.loading = false;
	        console.log(err);
	      });
      },
		},
		mounted(){
			this.getHistoryList()
		}

	}
</script>

<style lang="scss">
	.history_list {
		width: 100%;text-align: left;font-size: 13px;padding-left: 20px;padding-top: 60px;
		h4{font-size: 14px;margin-bottom: 20px;}
		span{
			position: relative;display: inline-block;margin-right: 20px;margin-bottom: 10px;height: 30px;line-height: 30px;padding:0 34px 0 10px;background-color: #F7F7F7;color: #999999;cursor: pointer;
			i{position: absolute;right: 10px;top: 8px;color: #ddd;cursor: pointer;}
		}
		.empty{color: #999999;}
	}
</style>
