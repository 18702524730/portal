<template>
  <div class="appraise_list">
    <h4 class="navTitle">评价管理</h4>
    <div class="listHeaderTab">
      <ul>
        <li :class="{active: appraiseState === 1}" @click="toggle(1)">待评价</li>
        <li :class="{active: appraiseState === 2}" @click="toggle(2)">已评价</li>
      </ul>
    </div>
    <!-- 待评价 -->
    <waitEvaluated v-if="appraiseState === 1"></waitEvaluated>
    <alreadyEvaluated v-if="appraiseState === 2"></alreadyEvaluated>
  </div>
</template>
<script>
  import Vue from 'vue'
  import $ from 'jquery'
  import waitEvaluated from './component/waitEvaluated.vue';
  import alreadyEvaluated from './component/alreadyEvaluated.vue'
  
  export default {
    components: {
      waitEvaluated,alreadyEvaluated
    },
    data(){
      return{
        loading:false,
        appraiseState:1,
        page:1,
        size:5,
        total:0
      }
    },
    methods:{
      toggle(index){
        if(this.appraiseState === index){
          return
        }else{
          this.appraiseState = index;
        }
        let path = this.$router.path;
        this.$router.push({path: path, query: { status: this.appraiseState }});
      },
      
    },
    mounted(){
      this.appraiseState = Number(this.$route.query.status?this.$route.query.status:1);
      console.log("测试",this.appraiseState)
    },
    watch: {
    },
    filters: {
    }
  }
</script>
<style lang="scss">
  // 和我的订单列表页面共用样式
  .appraise_list{padding:20px 20px 30px;
    .listHead {
      table{
        tr{
          th{
            .title{
              a{color:#3db1fa;text-decoration:none;cursor: pointer;}
              .shop_name{cursor: pointer;}
            }
          }
          td{position: relative;}
          td.image{text-align: center;
            img{width:80px;height:80px;}
          }
          td.name{padding:0px;width:484px;box-sizing:border-box;font-size:0;
            .servicr_r{display:inline-block;vertical-align: top;
              .cls_name{height:26px;border:1px solid #CEECFF;background-color:#ECF7FF;text-align:center;font-size:12px;width:100px;color:#3db1fa;border-radius:13px;line-height:24px;text-align:center;}
              .order_info{font-size:13px;color:#666;vertical-align:top;overflow: visible;
                .name{width:200px;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;cursor: pointer;}
                a{color:#151515;display:inline-block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;width:248px;line-height:17px;vertical-align:top;}
                span{color:#151515;display:inline-block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;width:330px;line-height:17px;vertical-align:top;}
              }
              p{
                i{font-size:18px;color:#FF6439;}
              }
            }
            img{width:80px;height:80px;display:inline-block;}
            tr{
              td{padding-left: 20px;border:0;width:483px;}
            }
            .pt20 td{padding-top: 20px;}
            .pb20 td{padding-bottom: 20px;}
            .bor_bottom{border-bottom:1px solid #eee;
              >img{cursor: pointer;}
            }
          }
          td.info{color:#151515;width:160px;padding-left:0;text-align: center;
            div{font-size:13px;color:#666;position: absolute;top:20px;text-align:center;width:100%;}
            a{color:#3DB1FA;}
          }
          td.money{
            div{font-size:13px;color:#666;position: absolute;top:20px;text-align:center;width:100%;}
          }
          td.action{
            div{font-size:13px;color:#666;position: absolute;top:20px;text-align:center;width:100%;
              a{text-decoration:none;}
              .el-button--small{border-radius:2px;}
            }
          }
        }
      }
    }
  }
</style>
