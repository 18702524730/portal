<template>
	<div class="suggest_list" v-if="show && suggestData.length">
    <ul>
      <li v-for="item in suggestData" @click.stop="searchName(item.ENTNAME)" v-html="item.tempName"></li>
  	</ul>
	</div>
</template>
<script>
	import Vue from 'vue'
	import qs from 'qs'
	const stewardUrl = CONFIG.stewardUrl;
	export default {
		props: ['show', 'companyName', 'wordLenth'],
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
      	this.$http.get(stewardUrl + '/companyInfo/selectCompanyInfoName?companyName='+ this.companyName)
				.then((resp) => {
					let data = resp.data;
					let arr = data.data || [];
					arr.forEach((item, idx) => {
						item.tempName = item.ENTNAME.replace(this.companyName, `<span>${this.companyName}</span>`);
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
			companyName(){
				let v = this.companyName;
				if (v && v.length >= this.wordLenth && /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/.test(v)) {
					this.getSuggestData();
				}
			}
		}

	}
</script>

<style lang="scss">
	.suggest_list {
		position: absolute;top: 36px;left: 287px;z-index: 2;width: 300px;max-height:152px;text-align: left;font-size: 13px;border: 1px solid #E6E6E6;border-radius:3px;background-color: #fff;
		ul{}
		li{
			height: 30px;line-height: 30px;padding-left: 10px;cursor: pointer;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;
			span{color: #3DB1FA;}
		}
		li:hover{background-color: #F8F8F8;}
	}
</style>
