<template>
  <div class="myOrders">
    <h4 class="navTitle">我的存证</h4>
    <div class="listHeaderTab">
      <ul>
        <li :class="{active: czType == '2'}" @click="czdetail('2')">文件存证</li>
        <li :class="{active: czType == '1'}" @click="czdetail('1')">网页存证</li>
      </ul>
    </div>
    <template>
      <table class="table table-bordered listHeadExplain">
        <thead>
          <tr>
            <th style="width:454px;text-align:left;padding-left:20px;">
              <span v-if="czType=='2'">存证文件</span>
              <span v-else-if="czType=='1'">存证网页</span>
            </th>
            <th style="width:170px;"><span>存证渠道</span></th>
            <th style="width:170px;"><span>存证时间</span></th>
            <th><span>操作</span></th>
          </tr>
        </thead>
      </table>
      <div class="listHead mt20" v-loading="loading" v-if="czData.length">
        <table class="table table-bordered mb10" v-for="item in czData" :key="item.orderSn">
          <thead>
            <tr>
              <th colspan="4">
                <div class="title">
                  <span>服务单号：{{item.orderSn}}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="name">
                <img src="~assets/img/cz/otherImg.png" alt="">
                <div class="servicr_r ml15">
                  <div class="clearfix">
                    <p class="fl name">{{item.fileName}}</p>
                  </div>
                </div>
              </td>
              <td class="cz_type">
                <span class="td_2">{{item.czChannel|czChannelFormat}}</span>
              </td>
              <td class="timer">
                <div>{{item.updateTime|dateFormat}}</div>
              </td>
              <td class="action">
                <router-link :to="'myczlist/'+item.orderSn+'?cztype='+czType">查看详情</router-link>
                <!-- <a v-if="!item.usedCzb>=1&&item.validTime>newtime" href="javascript:;" class="renewal_btn mt5" @click="renewalclick(item)">续费</a> -->
                <!-- <a class="renewal-btn mt5" v-else-if="item.usedCzb>=1&&item.validTime>newtime" href="javascript:;">续费</a> -->
                <a class="renewal-btn mt5" v-if="item.validTime<newtime" href="javascript:;">已过期</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="lc mb10 mt20" v-if="czData.length">
        <el-pagination
          @current-change="currentChange"
          :current-page="page"
          :page-size="size"
          layout="total, prev, pager, next, jumper"
          :total="total"
          background>
        </el-pagination>
      </div>
      <noResult v-else></noResult>
       <!-- 续费 -->
      <el-dialog title="存证续费" width="400px" :visible.sync="renewal" custom-class="dialog-renewal">
        <div class="pop_window" v-if="czdata">
          <div class="renewal_detail">
            <div class="renewal-list">
              <p class="renewal-time">续费年限：<span>1年</span></p>
              <p class="renewal-number" v-if="czDatanum>0">剩余存证可抵扣次数：{{czDatanum}}次</p>
              <p v-if="czDatanum==0" class="renewal-number">存证续费金额：2.00元</p>
            </div>
            <div class="renewal_txt">
              <p>注意：</p>
              <p>1、存证过期后将失去法律效力，请及时续费。</p>
              <p>2、推荐使用存证包抵扣，更划算便捷。</p>
            </div>
            <div class="lc mt20">
              <a v-if="czDatanum==0" @click="renewal=false"><el-button size="small" type="primary">取消</el-button></a>
              <a @click="czOtherPay"><el-button :disabled="isDisabled" size="small" type="primary">{{czDatanum == 0?"确认支付":"在线支付"}}</el-button></a>
              <a v-if="czDatanum>0" @click="czPay" class="ml10 mr10"><el-button size="small" type="primary">存证包支付</el-button></a>
            </div>
            
          </div>
        </div>
        <div class="renewal-success" v-if="czbDetail.notarizationRef">
          <img src="~assets/img/reg_login/success.png">
          <p>续费成功</p>
          <p v-if="czType=='2'">存证文件：{{czbDetail.notarizationRef.fileName}}</p>
          <p v-if="czType=='1'">存证网址：{{czbDetail.notarizationRef.fileName}}</p>
          <p>有效期限：{{czbDetail.notarizationRef.validTime|dateFormat}}</p>
          <el-button size="small" type="primary" @click="renewal=false" class="mt10">确认</el-button>
        </div>
        <!-- 续费失败 -->
        <div class="renewal-success" v-if="czbDetail.status">
          <img src="~assets/img/reg_login/Group-error.png">
          <p>续费失败，请稍后再试</p>
          <el-button size="small" type="primary" @click="czerror=false" class="mt10">确认</el-button>
        </div>
      </el-dialog>
    </template>
  </div>
</template>
<script>
  import Vue from 'vue'
  import $ from 'jquery'
  import noResult from 'components/noResult/noResult.vue'
  const indexUrl = CONFIG.indexUrl;
  const cartUrl = CONFIG.cartUrl;
  import Filters from 'api/filters.js'
  const czUrl = CONFIG.czUrl;
  import qs from 'qs'
  export default {
    components: {
      noResult
    },
    data(){
        return{
          czdata:false,//存证弹框显示
          newtime:'',//当前时间
          czbDetail:[],
          isDisabled:false,
          czUrl: czUrl,
          indexUrl: indexUrl,
          cartUrl: cartUrl,
          renewal:false,
          noResult: false,//无查询结果时显示
          errorResult: false,
          czType:2,
          loading: true,
          page: 1,
          tempPage: 1,
          size: 5,
          total:5,
          czData:[],
          refId:'',
          czDatanum:''
        }
    },
    methods:{
      search(){
        this.newtime = new Date().getTime();
        var self = this;
        self.loading = true;
        self.noResult = false;
        self.errorResult = false;
        this.czType = (this.$route.query.cztype-0) || 2;
        var tempPage = (self.$route.query.page-0)-1 || 0;
        self.$http.post('./api/findNotarizationByNotarizationType', qs.stringify({
          state:3,
          notarizationType: self.czType,
          page: tempPage,
          size: self.size
        }))
        .then((response) => {
          self.loading = false;
          var data = response.data;
          self.czData = data.data;
          self.page = data.page+1;
          self.siza = data.size;
          self.total = data.total_elements;
          if (!data.data || !data.data.length) {
              self.noResult = true;
              self.noDataTipHandle(self.czType);
            }
        })
        .catch((error) => {
          self.loading = false;
          self.errorResult = true;
          self.czData = [];
          var data = error.response.data;
        });
        this.$emit('renderNoPay');
      },
      // 续费
      renewalclick(item){
        var self = this;
        if(this.isDisabled){
          return;
        }
        self.czdata = true;
        this.czbDetail = [];
        this.isDisabled = true;
        this.refId = item.refId;
        //查询存证包数量
        self.$http.post('./api/queryleftcznum', qs.stringify({
        refId: self.refId
        }))
        .then((response) => {
          self.loading = false;
          self.czDatanum = response.data.leftCzNum;
          self.renewal = true;
          self.isDisabled = false;
        })
        .catch((error) => {
          self.loading = false;
          self.isDisabled = false;
          self.czerror = true;
        });
      },
      //存证包支付
      czPay(item){
        var self = this;
        if(this.isDisabled){
          return;
        }
        this.isDisabled = true;
          self.$http.post('./api/payWithCzb', qs.stringify({
            refId: self.refId
          }))
          .then((response) => {
            self.loading = false;
            self.isDisabled = false;
            self.czdata = false;
            self.czbDetail = response.data;
            //避免出现饿了吗loading功能
            self.czType = (self.$route.query.cztype-0) || 2;
            var tempPage = (self.$route.query.page-0)-1 || 0;
            self.$http.post('./api/findNotarizationByNotarizationType', qs.stringify({
              state:3,
              notarizationType: self.czType,
              page: tempPage,
              size: self.size
            }))
            .then((response) => {
              var data = response.data;
              self.czData = data.data;
              self.page = data.page+1;
              self.siza = data.size;
              self.total = data.total_elements;
              if (!data.data || !data.data.length) {
                  self.noResult = true;
                  self.noDataTipHandle(self.czType);
                }
            })
            .catch((error) => {
              self.errorResult = true;
              self.czData = [];
              var data = error.response.data;
            });
          })
          .catch((error) => {
            self.loading = false;
            self.isDisabled = false;
          });
      },
      czOtherPay(){//其他支付
        var self = this;
        if(this.isDisabled){
          return;
        }
        this.isDisabled = true;
        self.$http.post('./api/confirmczpay', qs.stringify({
          refId: self.refId
        }))
        .then((response) => {
          self.loading = false;
          if(response.data.code == "0"){
            self.isDisabled = false;
             var url = cartUrl+'/shop/pages/pay.html?order_sn='+response.data.data.orderFictitiousSn;
            location.href = url;
          }
        })
        .catch((error) => {
          self.loading = false;
          self.isDisabled = false;
        });
      },
      //翻页
      currentChange(currentPage){
        var route = this.$route;
        var path = route.path;
        var newQuery = $.extend({}, route.query, {page: currentPage || 1});
        this.$router.push({path: path, query: newQuery});
      },
      czdetail(cztype){
        this.$router.push({path: 'myczlist', query: {cztype: cztype}});
      },
      //异常提示处理
      noDataTipHandle(status){
        var ret = '暂无存证记录，推荐查看存证介绍'
        if (status == '1') {
          ret = '没有网页存证~';
        }else if(status == '2'){
          ret = '没有文件存证~';
        }
        this.noDataTip = ret;
      },
      refresh(){
        this.search();
      }
    },
    mounted(){
      this.status = this.$route.query.cztype;
      this.search();
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'search'
    },
    filters: {
      dateFormat: Filters.formatDate.dateFormat,
      orderStatusformat: Filters.orderStatusformat,
      payStatusformat: Filters.payStatusformat,
      priceformat:Filters.priceformat,
      titleLengthFormat:Filters.titleLengthFormat,
      czChannelFormat:Filters.czChannelFormat,
    }
  }
</script>

<style scoped lang="scss">
.myOrders{
  font-size: 13px;width: 980px;background: #fff;position: relative;padding: 20px;
  .listHead table{
     tr{
        td.name {width:454px;padding-left: 20px;
          .servicr_r{width:310px;display:inline-block;vertical-align: top;
            .name{word-break:break-all;}
          }
        }
        td.cz_type,td.timer {width:170px;text-align:center;vertical-align: top;
          span{color:#333;line-height:19px;display:inline-block;}
        }
        td.action{vertical-align: text-top;
          a{padding-top: 0;text-decoration:none;}
          .renewal-btn{color:#999;cursor: default;}
          .renewal_btn:hover{color:#3db1fa;cursor: pointer;}
        }
     }
  }
}
.dialog-renewal{
  .renewal_detail{
    font-size:14px;
    .renewal_txt{
      padding-bottom: 20px;padding-top:10px;
      p{color:#999;font-size:12px;
        a{color:#3db1fa;}
      }
    }
    .renewal-list{
      padding-bottom: 5px;border-bottom:1px dashed #ddd;
      p{line-height:14px;margin-bottom: 12px;font-size:14px;
        span{color:#ff3333;font-size:14px;}
      }
    }
  }
}
.renewal-success{
  text-align:center;
  p{font-size: 14px;line-height: 100%;margin-top: 7px;word-break: break-all;}
  :nth-child(2){font-size:16px;margin-bottom: 20px;}
}

</style>
