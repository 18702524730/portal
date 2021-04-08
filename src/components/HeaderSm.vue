<template>
  <header>
    <!-- 吊顶 -->
    <top-bar :cartNum="cartNum"></top-bar>

    <div class="header-sm commWidth">
      <h1 class="logo fl">
        <a :href="indexUrl" title="拾贝"><img src="~assets/img/header_footer/logo-sm.png" alt="拾贝"/></a>
      </h1>
      <div class="fl name" v-if="title">
        <i></i><span>{{title}}</span>
      </div>
      <div class="fr goback"><a :href="indexUrl">返回首页</a></div>
    </div>
  </header>
</template>

<script>
import TopBar from 'components/headerFComponents/TopBar.vue'
const indexUrl = CONFIG.indexUrl;
//import {indexUrl} from 'src/config'
export default {
  props:['title', 'cartNum'],
  components: {
    TopBar
  },
  data() {
    return {
    	indexUrl: indexUrl
    }
  },
  methods: {
  },
  mounted(){
  }
}
</script>

<style>
/* 头部样式 */
header{background-color: #fff;text-align: left;}
.header-sm{height: 75px;}
  .header-sm .logo{margin:0;padding:0;}
  .header-sm .name{padding-left:15px;height: 75px;line-height: 75px;position: relative;}
  .header-sm .name i{position: absolute;left: 0;top:28px;height: 19px;background-color: #e6e6e6;width: 1px;display: inline-block;}
  .header-sm .name span{display: inline-block;font-size: 16px;color: #333;}
  .header-sm .goback{margin-right: 33px;height: 75px;line-height: 75px;font-size: 14px;}
  .header-sm .goback a{color: #666}
</style>
