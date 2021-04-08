<template>
  <div class="already_evaluated" v-loading="loading">
    <div class="listHead mt20">
      <table class="table table-bordered mb10">
        <thead>
          <tr>
            <th colspan="1">
              <div class="title">
                <span>评价</span>
              </div>
            </th>
            <th colspan="2">
              <div class="title" style="text-align:center;">
                <span>被评价人</span>
              </div>
            </th>
            <th  colspan="2">
              <div class="title" style="text-align:center;">
                <span>商品信息</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody v-if="alreadyData&&alreadyData.length">
          <tr v-for="(item, index) in alreadyData" :key="item.order_id">
            <td class="name">
              <div class="servicr_r">
                <div style="width:340px" class="mb10">
                  <p>
                    <i class="el-icon-star-on mr5" v-for="index in item.score" :key="index"></i>
                  </p>
                  <p class="labelTxt mt10" style="color:#333;">{{item.content}}</p>
                </div>
                {{item.buyLabel}}
                <span class="num-btn mr10" v-for="info in item.buyLabel">{{info}}</span>
              </div>
            </td>
            <td class="info" colspan="2">
              <span class="shop_name" @click="toShopDetail(item)">{{item.shopName}}</span>
            </td>
            <td class="operation" colspan="2">
              <div class="service_name" @click="toDetail(item)">{{item.serviceInfo}}</div>
              <div>{{item.paidAmount|priceformat}}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <noResult v-if="!alreadyData.length&&!loading"></noResult>

      <div class="pagination-wrap" v-if="!loading&&alreadyData.length">
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
  </div>
</template>
<script>
  import Vue from 'vue'
  import $ from 'jquery'
  import noResult from 'components/noResult/noResult.vue'
  import Filters from '../../../api/filters';
  const trademarkUrl = CONFIG.trademarkUrl;
  const indexUrl = CONFIG.indexUrl;
  export default {
    components: {
      noResult
    },
    data(){
        return{
          page:1,
          size:5,
          total:20,
          loading:false,
          appraiseState:1,
          alreadyData:{}
        }
    },
    methods:{
      toShopDetail(item){
        window.open(indexUrl+'/store/'+item.shopSn+'.htm')
      },
      toDetail(item){
        if(item.orderBussinessType == 2){
          window.open(indexUrl+'/cms/service/rightoriginal.htm')
        }else if(item.orderBussinessType == 4){//交易订单
          window.open(trademarkUrl+'/trademark/'+item.goodsSn+'.htm')
        }else{
          window.open(item.orderBsCode === 'sbfw_gnsb_zzzc' ? `${indexUrl}/sebe/pages/selfRegister.html#/one` : indexUrl+'/store/service/'+item.goodsSn+'.htm')
        }
      },
      currentChange(page){
        var path = this.$router.path;
        this.page = page;
        let data = {
          status:this.$route.query.status?this.$route.query.status:1,
          page:this.page
        }
        this.$router.push({path: path, query: data});
        this.search();
      },
      search(){
        this.loading=true;
        this.$http.get('./api/evaluation/evaluatedlist', {
          params: {
            type:2,
            pg_index: this.page,
            pg_count: this.size
          }
        })
        .then((response) => {
          var data = response.data;
          this.loading = false;
          this.total = data.total_elements;
          this.alreadyData = data.elements;
          this.alreadyData.forEach((item)=>{
            item.buyLabel=item.buyLabel.split("|");
            console.log(item)
          })

        })
        .catch((error) => {
          this.loading = false;
        });
      }
    },
    mounted(){
      var page = Number(this.$route.query.page);
      this.page = page?page:1;
      console.log("测试")
      this.search();
    },
    watch: {
    },
    filters: {
      priceformat:Filters.priceformat
    }
  }
</script>
<style lang="scss">
  .already_evaluated{
    .listHead{
      table{
        tr{border:1px solid #eee;
          th,td{border:0;}
          td.name{padding:20px;
            .servicr_r{display:inline-block;vertical-align: top;
              .cls_name{height:26px;border:1px solid #CEECFF;background-color:#ECF7FF;text-align:center;font-size:12px;width:100px;color:#3db1fa;border-radius:13px;line-height:24px;text-align:center;}
              .order_info{font-size:13px;color:#666;vertical-align:top;overflow: visible;
                .name{width:200px;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
                a{color:#151515;display:inline-block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;width:248px;line-height:17px;vertical-align:top;}
                span{color:#151515;display:inline-block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;width:330px;line-height:17px;vertical-align:top;}
              }
              p{font-size:14px;line-height:18px;
                i{font-size:18px;color:#FF6439;}
              }
              .labelTxt{max-width: 460px;word-break: break-all;}
              .num-btn{padding:5px 10px;border:1px solid #eee;}
            }
          }
          .shop_name{padding-left: 34px;background: url(~assets/img/shop.png) no-repeat 12px 1px;background-size: 16px 16px;display: inline-block;transform: translateY(3px);height:17px;line-height:17px;font-size:13px;cursor: pointer;}
          .operation{
            .service_name{cursor: pointer;}
            div{
              text-align:left;font-size:13px;margin-bottom: 7px;padding-left:20px;
            }
          }
        }
      }
    }
  }
  .noResult{text-align:center;}
</style>
