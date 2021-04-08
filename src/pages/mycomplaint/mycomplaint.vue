<template>
  <div class="mycomplaint">
    <h4 class="navTitle">保护投诉</h4>
    <div class="listHeaderTab">
      <ul>
        <li :class="{active: czType == ''}" @click="czdetail('')">全部</li>
        <li :class="{active: czType == 1}" @click="czdetail(1)">待受理</li>
        <li :class="{active: czType == 2}" @click="czdetail(2)">服务中</li>
        <li :class="{active: czType == 3}" @click="czdetail(3)">已完成</li>
        <li :class="{active: czType == 4}" @click="czdetail(4)">不予受理</li>
      </ul>
    </div>
    <table class="complaintTabs">
      <thead>
        <tr>
          <th>服务类型</th>
          <th>提交时间</th>
          <th>服务进度</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="ProtectLists&&ProtectLists.total_elements>0" v-for="(item, key) in ProtectLists.elements" :key="key">
          <td>{{item.businessType==1?'跨平台电商保护':item.businessType==2?'侵权监测':item.businessType==3?'侵权判定':item.businessType==4?'质量抽检/鉴定/召回':item.businessType==5?'行政/刑事':item.businessType==6?'海关保护':item.businessType==7?'法律服务':item.businessType==8?'授权许可':''}}</td>
          <td>{{item.createTime | dateFormat}}</td>
          <td>{{item.state==1?'待受理':item.state==2?'服务中':item.state==3?'服务完成':item.state==4?'不予受理':''}}</td>
          <td>
            <router-link :to="'mycomplaint/'+item.businessSn">查看详情</router-link>
            <!-- <a class="renewal-btn mt5" v-if="item.createTime<newTime" href="javascript:;">已过期</a> -->
          </td>
        </tr>
        <tr v-if="!ProtectLists||ProtectLists.total_elements==0" class="zwsj"><td colspan="4">暂无数据</td></tr>
      </tbody>
    </table>
    <div class="pagination-wrap" v-if="1">
      <el-pagination
        @current-change="releaseCurrent"
        :current-page=1
        :page-size="size"
        layout="total, prev, pager, next, jumper"
        :total="total"
        background>
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import $ from 'jquery'
  import qs from 'qs'
  import Filters from '../../api/filters';
  export default {
    data(){
        return{
          czType:'',
          page:1,
          size:8,
          total:10,
          ProtectLists:'',
          newTime:new Date().getTime()
        }
    },
    methods:{
      czdetail(key){
        this.czType = key
        this.ipProtectList()
      },
      ipProtectList(){
        this.loading=true;
        this.$http({
            method:'get',
            url:'./api/ipprotect/ipProtectList',
            params: {
              "access_token":this.$cookie.get('user_token') || '',
              "state":this.czType,     //状态，1:待受理，2：服务中，3：服务完成，4：不予受理
              "page":this.page,
              "size":this.size
            },
        }).then((response) => {
          this.loading = false;
          this.ProtectLists = response.data;
          // this.ProtectLists = {
          //   "total_elements": 2,
          //   "elements": [
          //     {
          //       "businessType": 1,
          //       "createTime": 1611741092000,
          //       "state": 1,
          //       "businessSn": "210127000005"
          //     },
          //     {
          //       "businessType": 1,
          //       "createTime": 1611741217000,
          //       "state": 1,
          //       "businessSn": "210127000007"
          //     }
          //   ]
          // }
          this.total = this.ProtectLists.total_elements
        }).catch((err) => {
          this.loading = false;
          if(err&&err.response&&err.response.data&&err.response.data.msg){
            if(err.response.data.status == 401){
              return
            }
            this.$message.error(err.response.data.msg)
          }else{
            this.$message.error('系统繁忙，请稍后再试')
          }
        });
      },
      releaseCurrent(val){
        console.log("第"+`${val}`+"页")
        this.page = `${val}`;
        this.ipProtectList()
      },
      lookDetail(key){
        
      }
    },
    mounted(){
      this.ipProtectList()
    },
    watch: {
    },
    filters: {
      dateFormat:Filters.formatDate.dateFormat,
    }
  }
</script>

<style scoped lang="scss">
  .mycomplaint{
    font-size: 13px;
    width: 980px;
    background: #fff;
    position: relative;
    padding: 20px;
    .navTitle{
      height: 21px;
      line-height: 21px;
      font-weight: bold;
      font-size: 16px;
      color: #333;
    }
    .complaintTabs{
      width: 100%;
      border: 1px solid #eee;
      color: #333;
      th{
        text-align: center;
        background-color: #f5f5f5;
        height: 40px;
        line-height: 40px;
        width: 25%;
      }
      td{
        border: 1px solid #eee;
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
        text-align: center;
        .renewal-btn{color:#999;cursor: default;}
        a{
          margin: 0 10px;
        }
      }
      .zwsj{
        td{
          text-align: center;
        }
      }
    }
    .pagination-wrap{
      margin-top: 20px;
    }
  }
</style>
