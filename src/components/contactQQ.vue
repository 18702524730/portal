<template>
  <div class="qq">
  	<a v-if="type == 1 || !type" key="sell" href="http://pct.zoosnet.net/LR/Chatpre.aspx?id=PCT70172520&lng=cn&p=http%3a%2f%2fwww.ipsebe.com" class="link_seller" target="_blank">{{linkText || '联系客服'}}</a>
    <a v-else class="link_seller" @click="contactQQ">{{linkText || '联系客服'}}</a>
  </div>
</template>
<script>
  import Vue from 'vue'
  import $ from 'jquery'
  export default {
    components: {
    },
    props:['type','qqCode','qqOrder', 'linkText'],
    data(){
      return{
      }
    },
    methods:{
    	contactQQ(){
    		var newPage = window.open();
    		this.$http.get('./api/findQQ?order_store_code='+this.qqCode+'&order_bs_number='+(this.qqOrder?this.qqOrder:''))
	    	.then((resp)=>{
	    		console.log(resp.data.qq)
	    		newPage.location.href = 'http://wpa.qq.com/msgrd?v=3&uin='+resp.data.qq+'&site=qq&menu=yes';
	    	})
	    	.catch((err)=>{

	    	})
    	}
    },
    mounted(){
      
    },
    watch: {
    },
    filters: {
    }
  }
</script>
<style lang="less">
	.qq{display:inline-block;}
</style>
