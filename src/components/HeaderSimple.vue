<template>
  <header class="header-sm-wrap">
    <div class="header-sm commWidth">
      <h1 class="logo fl">
        <a :href="indexUrl" title="拾贝"><img src="~assets/img/header_footer/logo-mini.png" alt="拾贝"  /></a>
      </h1>
      <div class="fr goback"><a :href="indexUrl">返回首页</a></div>
    </div>
  </header>
</template>

<script>
const indexUrl = CONFIG.indexUrl;
//import {indexUrl} from 'src/config'
export default {
  props:[],
  data() {
    return {
    	indexUrl: indexUrl
    }
  },
  methods: {
  }
}
</script>

<style>
.header-sm-wrap{ border-bottom: 0;background-color: #fff;text-align: left; height:80px;}
  .header-sm{height: 80px; top:0; }
  .header-sm .logo{margin:0;padding:0; }
  .header-sm .logo>a {width:140px; height:22px; display: inline-block; margin-top: 30px;}
.header-sm .logo>a>img {width: 100%; height:100%; }
  .header-sm .goback{margin-right: 33px;height: 80px;line-height: 80px;font-size: 14px;}
  .header-sm .goback a{color: #333; font-size: 16px;}
  .header-sm .goback a:hover {text-decoration: none; color: #3db1fa;}
</style>
