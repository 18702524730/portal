<template>
  <div class="serviceDetail ">
    <!-- 头部标题 -->
    <!-- <div class="apply_num" v-if="!previewImg">
      <span class="apply_left">申请/注册号</span>
      <span v-if="!acceptMaterials" class="apply_right">待商标局形式审查通过后显示</span>
      <span v-else class="apply_right">{{acceptMaterials}}</span>
    </div>
    <div class="preview_tit mt25 mb20 ml20" v-if="previewImg">
      <p @click="previewClickImg"><img src="~assets/img/return.png" alt="">预览《{{certificateImg | downFileName}}》</p>
    </div> -->
    <!-- 办理进度 -->
    <div class="state_list" v-if="!previewImg">
    	<!-- 服务单已生成 -->
    	<div class="state_time" v-if="recordData[0]||!recordData[99]">
        <p :class="{'sc':recordData[0]}"><span class="mr10">●</span>服务单已生成</p>
        <div v-for="item in recordData[0]" style="width:359px;margin-left:4px;">
          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{item.operating_time | formatDate}}</span>
        </div>
        <i></i>
      </div>

      <template v-if="type==0">
	      <!-- 服务商已接单 -->
	      <div class="state_time" v-if="recordData[2]||!recordData[99]">
	        <p :class="{'sc':recordData[2]}"><span class="mr10">●</span>服务商已接单</p>
	        <div v-for="item in recordData[2]" style="width:359px;margin-left:4px;">
	          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
	          <span class="ml40">{{item.operating_time | formatDate}}</span>
	        </div>
	        <i></i>
	      </div>
	      <!-- 待服务完善 -->
	      <div class="state_time" v-if="recordData[3]||!recordData[99]">
	        <p :class="{'sc':recordData[3]}"><span class="mr10">●</span>待服务完善</p>
	        <div v-for="item in recordData[3]" style="width:359px;margin-left:4px;">
	          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
	          <span class="ml40">{{item.operating_time | formatDate}}</span>
	        </div>
	        <i></i>
	      </div>
	      <!-- 待用户确认信息 -->
	      <div class="state_time" v-if="recordData[4]||!recordData[99]">
	        <p :class="{'sc':recordData[4] && recordData[4].length}"><span class="mr10">●</span>待用户确认信息</p>
	        <div v-if="recordData[4] &&　recordData[4].length" v-for="itemoperate in recordData[4]" style="margin-left:4px;">
	          <span class="ml25 time_left">{{itemoperate.bs_feedback_operate || '--'}}</span>
	          <span class="ml40">{{itemoperate.operating_time | formatDate}}</span>
	        </div>
	        <i></i>
	      </div>
	      <!-- 待支付加项费用 -->
	      <div class="state_time" v-if="recordData[5]">
	        <p :class="{'sc':recordData[5]}"><span class="mr10">●</span>待支付加项费用</p>
	        <div v-for="item in recordData[5]" style="margin-left:4px;">
	          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
	          <span class="ml40">{{item.operating_time | formatDate}}</span>
	        </div>
	        <i></i>
	      </div>
	      <!-- 待平台审核 -->
	      <div class="state_time" v-if="recordData[6]||!recordData[99]">
	        <p :class="{'sc':recordData[6]}"><span class="mr10">●</span>待平台审核</p>
	        <div v-for="item in recordData[6]" style="width:359px;margin-left:4px;">
	          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
	          <span class="ml40">{{item.operating_time | formatDate}}</span>
	        </div>
	        <i></i>
	      </div>
	      <!-- 待申报至商标局 -->
	      <div class="state_time" v-if="recordData[7]||!recordData[99]">
	        <p :class="{'sc':recordData[7]}"><span class="mr10">●</span>待申报至商标局</p>
	        <div v-for="item in recordData[7]" style="width:359px;margin-left:4px;">
	          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
	          <span class="ml40">{{item.operating_time | formatDate}}</span>
	        </div>
	        <i></i>
	      </div>
      </template>

      <template v-if="type==2">
      	<!-- 已完善待审核 -->
	      <div class="state_time" v-if="recordData[4]||!recordData[99]">
	        <p :class="{'sc':recordData[4]}"><span class="mr10">●</span>已完善待审核</p>
	        <div v-for="item in recordData[4]" style="width:359px;margin-left:4px;">
	          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
	          <span class="ml40">{{item.operating_time | formatDate}}</span>
	        </div>
	        <i></i>
	      </div>
	      <!-- 已审核待申报 -->
	      <div class="state_time" v-if="recordData[7]||!recordData[99]">
	        <p :class="{'sc':recordData[7]}"><span class="mr10">●</span>已审核待申报</p>
	        <div v-for="item in recordData[7]" style="width:359px;margin-left:4px;">
	          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
	          <span class="ml40">{{item.operating_time | formatDate}}</span>
	        </div>
	        <i></i>
	      </div>
      </template>

      <!-- 待商标局收文 -->
      <div class="state_time" v-if="recordData[8]||!recordData[99]">
        <p :class="{'sc':recordData[8]}"><span class="mr10">●</span>待商标局收文</p>
        <div v-for="item in recordData[8]" style="width:359px;margin-left:4px;">
          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{item.operating_time | formatDate}}</span>
        </div>
        <i></i>
      </div>
      <!-- 待形式审查 -->
      <div class="state_time" v-if="recordData[9]||!recordData[99]">
        <p :class="{'sc':recordData[9]}"><span class="mr10">●</span>待形式审查</p>
        <div v-for="item in recordData[9]" style="margin-left:4px;">
          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{item.operating_time | formatDate}}</span>
          <span class="ml30 mr515" style="width:95px;display:inline-block;">{{item.type | downFileName}}</span>
          <a v-if="item.url" class="ml25" @click="previewClick(item)">预览</a>
          <a v-if="item.url" class="ml20" :href="item.url" target="_blank">下载</a>
        </div>
        <i :class="{'longer': recordData[9] && recordData[9].length>1}"></i>
      </div>

      <div class="state_time" v-if="!recordData[11]&&!recordData[99]">
        <p><span class="mr10">●</span>待实质审查</p>
        <i></i>
      </div>
      <!-- 待实质审查 -->
      <div class="state_time" v-if="recordData[11]">
        <p :class="{'sc':recordData[11]}"><span class="mr10">●</span>待实质审查</p>
        <div v-if="recordData[11]&&recordData[11].length" v-for="info in recordData[11]" style="margin-left:4px;">
          <span class="ml25 time_left">{{info.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{info.operating_time | formatDate}}</span>
          <span class="ml30 mr515" style="width:95px;display:inline-block;">{{info.type | downFileName}}</span>
          <a v-if="info.url" class="ml25" @click="previewClick(info)">预览</a>
          <a v-if="info.url" class="ml20" :href="info.url" target="_blank">下载</a>
        </div>
        <i :class="{'longer': recordData[11].length>1}"></i>
      </div>
      <!-- 实质审查部分驳回 -->
      <div class="state_time" v-if="recordData[13]">
        <p :class="{'sc':recordData[13]}"><span class="mr10">●</span>待初审公告</p><!-- 显示用户查看状态 -->
        <div v-for="item in recordData[13]" style="margin-left:4px;">
          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{item.operating_time | formatDate}}</span>
          <span class="ml30 mr515" style="width:95px;display:inline-block;">{{item.type | downFileName}}</span>
          <a v-if="item.url" class="ml25" @click="previewClick(item)">预览</a>
          <a v-if="item.url" class="ml20" :href="item.url" target="_blank">下载</a>
        </div>
        <i :class="{'longer': recordData[13].length>1}"></i>
      </div>
      <!-- 实质审查不通过被驳回 -->
      <div class="state_time" v-if="recordData[14]">
        <p :class="{'sc':recordData[14]}"><span class="mr10">●</span>被驳回</p><!-- 显示用户查看状态 -->
        <div v-if="recordData[14]&&recordData[14].length" v-for="info in recordData[14]" style="margin-left:4px;">
          <span class="ml25 time_left">{{info.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{info.operating_time | formatDate}}</span>
          <span class="ml30 mr515" style="width:95px;display:inline-block;">{{info.type | downFileName}}</span>
          <a v-if="info.url" class="ml25" @click="previewClick(info)">预览</a>
          <a v-if="info.url" class="ml20" :href="info.url" target="_blank">下载</a>
        </div>
        <i :class="{'longer': recordData[14].length>1}"></i>
      </div>
      <!-- 形式审查通过待实质审查 -->
      <div class="state_time" v-if="recordData[19]">
        <p :class="{'sc':recordData[19]}"><span class="mr10">●</span>待初审公告</p><!-- 显示用户查看状态 -->
        <div v-for="item in recordData[19]" style="margin-left:4px;">
          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{item.operating_time | formatDate}}</span>
          <span class="ml30 mr515" style="width:95px;display:inline-block;">{{item.type | downFileName}}</span>
          <a v-if="item.url" class="ml25" @click="previewClick(item)">预览</a>
          <a v-if="item.url" class="ml20" :href="item.url" target="_blank">下载</a>
        </div>
        <i :class="{'longer': recordData[19].length>1}"></i>
      </div>
      <!-- 待初审公告 ，后台返回值状态-->
      <div class="state_time" v-if="recordData[12]||!recordData[99]">
        <p :class="{'sc':recordData[12]}"><span class="mr10">●</span>待初审公告</p><!-- 显示用户查看状态 -->
        <div v-if="recordData[12]&&recordData[12].length" v-for="info in recordData[12]" style="margin-left:4px;">
          <span class="ml25 time_left">{{info.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{info.operating_time | formatDate}}</span>
          <span class="ml30 mr515" style="width:95px;display:inline-block;">{{info.type | downFileName}}</span>
          <a v-if="info.url" class="ml25" @click="previewClick(info)">预览</a>
          <a v-if="info.url" class="ml20" :href="info.url" target="_blank">下载</a>
        </div>
        <i :class="{'longer': recordData[12] && recordData[12].length>1}"></i>
      </div>
      <!-- 初审公告部分异议 -->
      <div class="state_time" v-if="recordData[16]">
        <p :class="{'sc':recordData[16]}"><span class="mr10">●</span>待发放注册证</p><!-- 显示用户查看状态 -->
        <div v-for="item in recordData[16]" style="margin-left:4px;">
          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{item.operating_time | formatDate}}</span>
          <span class="ml30 mr515" style="width:95px;display:inline-block;">{{item.type | downFileName}}</span>
          <a v-if="item.url" class="ml25" @click="previewClick(item)">预览</a>
          <a v-if="item.url" class="ml20" :href="item.url" target="_blank">下载</a>
        </div>
        <i :class="{'longer': recordData[16].length>1}"></i>
      </div>
      <!-- 初审公告不通过被异议 -->
      <div class="state_time" v-if="recordData[17]">
        <p :class="{'sc':recordData[17]}"><span class="mr10">●</span>被异议</p><!-- 显示用户查看状态 -->
        <div v-if="recordData[17]&&recordData[17].length" v-for="info in recordData[17]" style="margin-left:4px;">
          <span class="ml25 time_left">{{info.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{info.operating_time | formatDate}}</span>
          <span class="ml30 mr515" style="width:95px;display:inline-block;">{{info.type | downFileName}}</span>
          <a v-if="info.url" class="ml25" @click="previewClick(info)">预览</a>
          <a v-if="info.url" class="ml20" :href="info.url" target="_blank">下载</a>
        </div>
        <i :class="{'longer': recordData[17].length>1}"></i>
      </div>
      <!-- 实质审查通过待初审公告 -->
      <div class="state_time" v-if="recordData[22]">
        <p :class="{'sc':recordData[22]}"><span class="mr10">●</span>待发放注册证</p><!-- 显示用户查看状态 -->
        <div v-for="item in recordData[22]" style="margin-left:4px;">
          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{item.operating_time | formatDate}}</span>
          <span class="ml30 mr515" style="width:95px;display:inline-block;">{{item.type | downFileName}}</span>
          <a v-if="item.url" class="ml25" @click="previewClick(item)">预览</a>
          <a v-if="item.url" class="ml20" :href="item.url" target="_blank">下载</a>
        </div>
        <i :class="{'longer': recordData[22].length>1}"></i>
      </div>
      <!--  初审公告通过待发放注册证 -->
      <div class="state_time" v-if="!recordData[99]">
        <p :class="{'sc':recordData[15]}"><span class="mr10">●</span>待发放注册证</p><!-- 显示用户查看状态 -->
        <div v-for="item in recordData[15]" style="margin-left:4px;">
          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{item.operating_time | formatDate}}</span>
          <span class="ml30 mr515" style="width:95px;display:inline-block;">{{item.type | downFileName}}</span>
          <a v-if="item.url" class="ml25" @click="previewClick(item)">预览</a>
          <a v-if="item.url" class="ml20" :href="item.url" target="_blank">下载</a>
        </div>
        <i></i>
      </div>
      <!-- 已发放注册证 -->
      <div class="state_time" v-if="!recordData[99]">
        <p :class="{'sc':recordData[18]}"><span class="mr10">●</span>已发放注册证</p><!-- 显示用户查看状态 -->
        <div v-if="recordData[18]" v-for="item in recordData[18]" style="margin-left:4px;">
          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{item.operating_time | formatDate}}</span>
          <span class="ml30 mr515" style="width:95px;display:inline-block;">{{item.type | downFileName}}</span>
          <a v-if="item.url" class="ml25" @click="previewClick(item)">预览</a>
          <a v-if="item.url" class="ml20" :href="item.url" target="_blank">下载</a>
        </div>
      </div>
      <!-- 办理终止 -->
      <div class="state_time" v-if="recordData[99]">
        <p :class="{'sc':recordData[99]}"><span class="mr10">●</span>办理终止</p><!-- 显示用户查看状态 -->
        <div v-if="recordData[99]" v-for="item in recordData[99]" style="margin-left:4px;">
          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{item.operating_time | formatDate}}</span>
          <span class="ml30 mr515" style="width:95px;display:inline-block;">{{item.type | downFileName}}</span>
          <a v-if="item.url" class="ml25" @click="previewClick(item)">预览</a>
          <a v-if="item.url" class="ml20" :href="item.url" target="_blank">下载</a>
        </div>
      </div>
    </div>
    <div class="img_preview" v-if="previewImg">
      <el-carousel indicator-position="none" :interval="5000" arrow="always" :autoplay='false' trigger="click">
        <el-carousel-item v-for="(itemSrc,$index) in previewSrc" :key="$index">
          <img :src="itemSrc" alt="">
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>
<script>
import Filters from 'api/filters.js'
const rootUrl = CONFIG.rootUrl;
export default {
  props:['previewImg','recordData','acceptMaterials','order_id', 'type'],
  data() {
    return {
      previewSrc:'',
      certificateImg:'',
      token:'',
      rootUrl:rootUrl
    }
  },
  mounted() {
    console.log(this.recordData);
    this.token = this.$cookie.get("user_token");
    console.log(this.rootUrl)
  },
  methods: {
    Remarktype(type){
      let typeName = '';
      if(type == 1){
        typeName = '订单已退款';
      }else if(type == 2){
        typeName = '订单已重新申报';
      }else if(type == 3){
        typeName = '其他';
      }
      return typeName;
    },
    previewClickImg(){
      this.$emit('previewClick');
    },
    // 弹框内预览
    previewClick(data){
      this.$http.get('./api/preview?pdf_url='+data.url)
      .then((response) => {
        this.previewSrc = response.data.urls;
        this.$emit('previewClick', this.previewSrc);
      })
      .catch((error) => {
      });
      // this.certificateImg = data.type;
      // this.previewImg = true;
    },

  },
  filters: {
    formatDate:Filters.formatDate.dateFormat,
    downFileName:Filters.downFileName
  }

}
</script>
<style lang="scss">
  // 服务记录
  .service_preview{
    width: 658px; float: left; height: 280px; overflow-y: auto;
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-track {
      background-color: #eee;
    } /* 滚动条的滑轨背景颜色 */
    &::-webkit-scrollbar-thumb {
        background-color: #ddd;
    } /* 滑块颜色 */
    &::-webkit-scrollbar-button {
        background-color: #eee; display:none;
    } /* 滑轨两头的监听按钮颜色 */
    &::-webkit-scrollbar-corner {
        background-color: black;
    }
    .apply_num{padding:30px 20px 20px;
      .apply_left{font-size: 14px;color: #333333;}
      .apply_right{margin-left: 15px;font-size: 14px;color: #999999;}
    }
    .state_list{
      margin:0 0 0 20px;padding:0; padding:25px 0;
      .state_time{
        p{line-height:20px;font-size:14px;color:#556677;
          span{font-size:16px;}
        }
        .sc{color:#09BB07;
          span{color:#09BB07;}
        }
        span{font-size: 13px;color: #999999;}
        .time_left{width:150px;display:inline-block;}
        i{height:56px;margin-top: -30px;}
        i.longer{height: 70px;margin-top: -45px;}
        .last_time{height:26px;}
        a{color:#3DB1FA;}
      }
    }
    .instructions{padding:0 20px;
      .td01{width:30%}
      .td02{width:30%}
      .td03{width:40%}
      .list_tit{background-color:#e5e5e5;border-left:1px solid #eee;border-right:1px solid #eee;border-top:1px solid #eee;height:35px;
        li{line-height:35px;}
      }
      .list_info{border-left:1px solid #eee;border-right:1px solid #eee;border-bottom:1px solid #eee;height:35px;}
      ul{
        li{padding-left:20px;font-size: 13px;color:#333;height:30px;line-height:35px;}
      }
    }
    .el-dialog{width:860px;padding:10px 10px 30px;
      .el-dialog__header{text-align:left;
        .el-dialog__title{font-size: 16px;color: #333333;font-weight: normal;}
      }
    }
  }
</style>
