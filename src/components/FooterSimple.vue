<template>
	<!-- 页尾 -->
	<footer class="footer-sm-wrap">
		<!-- 页尾下半部分 -->
		<div class="footer-sm">
			<p class="link_box">
				<a :href="CONFIG.indexUrl+'/cms/service/aboutsebe.htm'" class="item" target="_blank">关于拾贝</a>
				<a :href="CONFIG.indexUrl+'/cms/zixun/index.htm?id=12'" class="item" target="_blank">资讯中心</a>
				<a :href="CONFIG.indexUrl+'/sebe/pages/facilitator.html'" class="item" target="_blank">商家入驻</a>
				<a :href="CONFIG.indexUrl+'/sebe/pages/channel.html'" class="item" target="_blank">合伙人入驻</a>
				<a :href="CONFIG.indexUrl+'/cms/service/contactus.htm'" class="item" target="_blank">联系我们</a>
			</p>
			<p class="info">
				© 2015-现在 拾贝  All rights reserved  <a target="_blank" href="http://www.miitbeian.gov.cn/state/outPortal/loginPortal.action">浙ICP备15042618号</a> | <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010402003197">浙公网安备 33010402003197号</a> &nbsp; 杭州拾贝知识产权服务有限公司
			</p>
		</div>
	</footer>
</template>

<script>
export default {
	data () {
		return {
			CONFIG: CONFIG
		}
	},
}
</script>


<style>
.footer-sm-wrap{font-size: 12px; background-color: transparent;}
	.footer-sm{height:106px;padding-top: 30px; text-align: center; }
	.footer-sm .info {font-size: 12px; color: #999; width: 100%; text-align: center;}
	.footer-sm .link_box {width: 100%; height:18px; text-align: center; margin-bottom: 10px;}
	.footer-sm .link_box .item {display: inline-block; padding: 0 20px; border-right: 1px solid #666; color: #666; font-size: 14px; height:18px; line-height: 18px;}
	.footer-sm .link_box .item:last-child {border-right: none;}
	.footer-sm a{color: #999; font-size: 12px;}
	.footer-sm .link_box .item:hover {text-decoration: none; color: #3db1fa;}
	footer .footer-sm a:hover{color: #3db1fa; text-decoration: none;}
</style>
