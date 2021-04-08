<template>
  <section>
    <sebe-header></sebe-header>
    <div class="main">
      <router-view></router-view>
    </div>
    <sebe-footer></sebe-footer>
  </section>
</template>

<script>
  import Vue from 'vue'
  import sebeHeader from 'components/Header.vue'
  import sebeFooter from 'components/FooterSimple.vue'
  import NProgress from 'nprogress'
  import 'nprogress/nprogress.css'
  import { getHomePageInfo } from '../../api/api'
  import filters from '../../api/filters'
  export default {
    components: {
      sebeHeader,
      sebeFooter
    },
    data(){
        return{
        }
    },
    methods:{
      getHomeData(){
        NProgress.start();
        getHomePageInfo().then((res) => {
            let { code } = res;
            this.trademarkCount = res.data.trademarkCount;
            this.patentCount = res.data.patentCount;
            this.organizationList = res.data.organizationList;
            //console.log(res);
            //console.log(this.organizationList);

            NProgress.done();           

        });
      }
    },
    mounted(){
      //this.getHomeData();
    },
    filters: {
        IPRFormat : filters.formatIPRClassify.format
    }
  }
</script>

<style scoped>
  .footer-sm-wrap{background-color: #f2f2f2;}
</style>
