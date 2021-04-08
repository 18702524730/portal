<template>
  <div class="refund_list">
    <h4 class="navTitle">退款管理</h4>
    <div class="listHeaderTab">
      <ul>
        <li :class="{active: appraiseState === 0}" @click="toggle(0)">退款中</li>
        <li :class="{active: appraiseState === 2}" @click="toggle(2)">退款完成</li>
      </ul>
    </div>
    <template>
      <table class="table table-bordered listHeadExplain">
        <thead>
          <tr>
            <th style="width:365px;text-align:left;padding-left:20px;"><span>商品</span></th>
            <th style="width:200px;"><span>退款金额</span></th>
            <th style="width:200px;"><span>申请时间</span></th>
            <th><span>退款操作</span></th>
          </tr>
        </thead>
      </table>

      <div class="listHead mt20">
        <table class="table table-bordered mb10" v-for="(item, index) in listData">
          <thead>
            <tr>
              <th colspan="4">
                <div class="title">
                  <span>服务单号：{{item.order_sn}}</span>
                  <span>退款编号：{{item.refund_sn}}</span>
                  <span class="shop_name" @click="toShopDetail(item)">{{item.order_store_name | storeName}}</span>
                  <a v-if="item.order_distribute_from == 1" key="sell" href="http://pct.zoosnet.net/LR/Chatpre.aspx?id=PCT70172520&lng=cn&p=http%3a%2f%2fwww.ipsebe.com" class="link_seller" target="_blank">联系商家</a>
                  <a v-else target="_blank" key="sell" class="link_seller" href="http://wpa.qq.com/msgrd?v=3&uin=271652610&site=qq&menu=yes">联系商家</a>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="name">
                <img :src="item.order_bs_image" alt="">
                <div class="servicr_r ml15">
                  <div class="clearfix">
                    <p class="fl name" @click="toDetail(item)">{{item.bs_name}}</p>
                  </div>
                </div>
              </td>
              <td class="money">
                <p>总额：{{item.amount_user|priceformat}}</p>
                <div>实退金额：{{item.amount|priceformat}}</div>
              </td>
              <td class="timer">
                <div>{{item.create_time|dateFormat}}</div>
              </td>
              <td class="action">
                <a v-if="item.audit_state == 2" href="http://pct.zoosnet.net/LR/Chatpre.aspx?id=PCT70172520&lng=cn&p=http%3a%2f%2fwww.ipsebe.com" target="_blank">申诉</a>
                <!-- 上传申请材料 -->
                <p>{{item.state|refundStatus}}</p>
                <span>退款原因：{{item.refund_reason_type_name}}</span>
                <!-- <router-link :to="'serviceList/'">查看详情</router-link> -->
              </td>
            </tr>
          </tbody>
        </table>
        <noResult v-if="!listData.length && !loading"></noResult>

        <div class="lc" v-if="listData.length">
          <el-pagination
            @current-change="currentChange"
            :current-page="page"
            :page-size="size"
            layout="total, prev, pager, next, jumper"
            :total="total"
            background>
          </el-pagination>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
  import Vue from 'vue'
  import qs from 'qs'
  import $ from 'jquery'
  import noResult from 'components/noResult/noResult.vue'
  import Filters from 'api/filters.js'
  const trademarkUrl = CONFIG.trademarkUrl;
  const indexUrl = CONFIG.indexUrl;
  export default {
    components: {
      noResult
    },
    data(){
        return{
          appraiseState:0,
          loading: false,
          refundreasonVisible: false,
          rejectreasonVisible: false,
          dialogImgVisible: false,
          dialogImageUrl:'',
          page: 1,
          size: 5,
          total:0,
          listData:[],
          itemData:{},
          refundProgressData:[]
        }
    },
    methods:{
      toShopDetail(item){
        if(item.order_store_code){
          window.open(indexUrl+'/store/'+item.order_store_code+'.htm')
        }
      },
      toDetail(item){
        if(item.order_bussiness_type == 4){//交易订单
          window.open(trademarkUrl+'/trademark/'+item.order_bs_number+'.htm')
        }else{
          window.open(item.bs_code === 'sbfw_gnsb_zzzc' ? `${indexUrl}/sebe/pages/selfRegister.html#/one` : indexUrl+'/store/service/'+item.order_bs_number+'.htm')
        }
      },
      currentChange(page){//翻页
        var route = this.$route;
        var path = route.path;
        var newQuery = $.extend({}, route.query, {page: page || 1});
        this.$router.push({path: path, query: newQuery});
      },
      search(){//查询退款列表
        var self = this;
        self.page = this.$route.query.page?this.$route.query.page-0:1;
        self.loading = true;
        self.$http.post('./api/listRefunds', qs.stringify({
          state:self.appraiseState,
          pg_index: self.page,
          pg_count: self.size
        }))
        .then((response) => {
          var data = response.data;
          self.loading = false;
          self.total = data.total_elements;
          self.listData = data.elements;
        })
        .catch((error) => {
          self.loading = false;
          self.listData = [];
          var data = error.response.data;
        });
      },
      toggle(index){
        if(this.appraiseState === index){
          return
        }else{
          this.appraiseState = index;
          this.currentChange(1)
          this.search();
        }
      }
    },
    mounted(){
      this.search();
    },
    watch: {
      '$route': 'search'
    },
    filters: {
      dateFormat: Filters.formatDate.dateFormat,
      refundStatus:Filters.refundStatus,
      priceformat:Filters.priceformat,
      storeName:Filters.storeName
    }
  }
</script>
<style lang="scss">
  .refund_list{padding:20px;
    .listHead {
      table{
        tr{
          th{
            .title{
              a{color:#3db1fa;text-decoration:none;cursor: pointer;}
            }
          }
          td.name{padding:20px;width:365px;box-sizing:border-box;font-size:0;
            .servicr_r{display:inline-block;
              >div{
                .name{width:130px;color:#333;cursor: pointer;}
              }
              p{
                i{font-size:18px;color:#FF6439;}
              }
            }
            img{width:90px;height:90px;display:inline-block;}
            div{font-size:13px;color:#666;vertical-align:top;overflow: visible;
              a{color:#151515;display:inline-block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;width:248px;line-height:17px;vertical-align:top;}
              span{color:#151515;display:inline-block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;width:330px;line-height:17px;vertical-align:top;}
            }
          }
          td.money{color:#151515;width:200px;padding-left:0;text-align: center;
            div{font-size:13px;color:#666;}
            p{margin-top:-32px;color:#999;}
            a{color:#3DB1FA;}
          }
          td.timer{width:200px;text-align:center;
            div{font-size:13px;color:#666;margin-top:-32px;}
          }
          td.action{text-align:center;
            p{font-size:13px;color:#333;line-height:18px;width:80px;margin:0 auto 10px;}
            span{font-size:13px;line-height:18px;color:#ff3939;}
            >a{padding:2px 10px;border:1px solid #eee;text-decoration:none;display:inline-block;margin:0 auto 5px;border-radius:2px;}
          }
        }
      }
    }
  }
</style>
