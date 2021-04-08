<template>
	<div>
		<sebe-header></sebe-header>
    <div class="err">
    	<div class="empty">
	        <span class="tip">抱歉！您访问的页面失联啦......</span>
	        <div class="hef">
	        	<a class="onpage" href="" @click.prevent="goold">返回上级</a>
	        	<a class="homepage" :href="indexUrl">返回首页</a>
	        </div>
	    </div>
		</div>
		<sebe-footer></sebe-footer>
	</div>
</template>
<script>
import sebeHeader from 'components/Header.vue'
import sebeFooter from 'components/FooterSm.vue'
const indexUrl = CONFIG.indexUrl;
export default {
  name: 'app',
  components: {
		sebeHeader,
		sebeFooter
	},
  data () {
  	return {
  		indexUrl:indexUrl
  	}
  },
  methods: {
  	goold(){
  		self.$router.go(-1);
  	}
  }
}
	
</script>
<style lang="scss" scoped>
    .err{width:100%;background:#f5f5f5;min-height: 600px;
    	.empty{width: 808px;text-align: right;font-size:18px;margin:0 auto;height:600px;background: url(~assets/img/404.png) left center no-repeat;padding-top: 250px;
			.tip{font-size:24px;color:#666;}
			.hef{overflow:hidden;padding-left:484px;margin-top:25px;
				a{display:inline-block;height:40px;width: 120px;border-radius:3px;line-height:40px;text-align:center;font-size:16px;float:left;text-decoration:none}
				.onpage{background:#ff2200;color:#fff}
				.homepage{color:#ff2200;margin-left: 15px;}
			}
    	}
    }
</style>