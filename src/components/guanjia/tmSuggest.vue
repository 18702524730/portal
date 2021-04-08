<template>
	<div class="suggest_list_sec" v-if="show && suggestData.length">
    <ul>
      <li v-for="item in suggestData" @click.stop="searchName(item.tmName)" v-html="item.tempName"></li>
  	</ul>
	</div>
</template>
<script>
	import Vue from 'vue'
	import qs from 'qs'
	const stewardUrl = CONFIG.stewardUrl;
	export default {
		props: ['show', 'keyword', 'companyName'],
		data(){
			return{
				suggestData:[],
			}
		},
		methods:{
			searchName(name){
      	this.$emit('search', name);
      },
      getSuggestData(){
      	this.$http.get(stewardUrl + '/smallStewardTadeMark/findFilterTrademark', {
      		params: {
      			keyword: this.companyName,
      			filterKeyword: this.keyword,
      			searchType:3,
      			page: 1,
      			size: 10
      		}
      	})
				.then((resp) => {
					let data = resp.data;
					let arr = data.data || [];
					arr.forEach((item, idx) => {
						item.tempName = item.tmName.replace(this.keyword, `<span>${this.keyword}</span>`);
					});
					this.suggestData = arr;
				})
	      .catch((err) => {
	        console.log(err);
	      });
      },
		},
		mounted(){
		},
		watch: {
			keyword(){
				console.log(this.keyword)
				let v = this.keyword;
				if (v && v.length > 1 && /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/.test(v)) {
					this.getSuggestData();
				}
			}
		}

	}
</script>

<style lang="scss">
	.suggest_list_sec {
		position: absolute;top: 42px;right: 0;z-index: 2;width: 375px;max-height:152px;text-align: left;font-size: 13px;border: 1px solid #E6E6E6;border-radius:3px;background-color: #fff;
		ul{}
		li{
			height: 30px;line-height: 30px;padding-left: 10px;cursor: pointer;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;
			span{color: #3DB1FA;}
		}
		li:hover{background-color: #F8F8F8;}
	}
</style>
