<template>
	<div>
		<!-- 头部标题 -->
	  <div class="apply_num" v-if="!previewImg">
	  	<span class="apply_left">申请/注册号</span>
	  	<span v-if="!recordData.acceptMaterials" class="apply_right">待商标局形式审查通过后显示</span>
	  	<span v-else class="apply_right">{{recordData.acceptMaterials}}</span>
	  </div>
    <div class="preview_tit mt25 mb20 ml20" v-if="previewImg">
      <p @click="previewClickImg"><img src="~assets/img/return.png" alt="">预览《{{certificateImg | downFileName}}》</p>
    </div>
    <!-- 办理进度 -->
    <div class="state_list_cxb" v-if="!previewImg">
    	<!-- 服务单已生成 -->
      <div class="state_time" v-if="recordData[0]">
        <p :class="{'sc':recordData[0]}"><span class="mr10">●</span>服务单已生成</p>
        <div class="state_lists" v-if="recordData[0]&&recordData[0].length" v-for="(item,index) in recordData[0]" :class="{'list_first':index==0}">
          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{item.operating_time | formatDate}}</span>
        </div>
        <i style="margin-top:-30px;height:50px;"></i>
      </div>
      <!-- 已提交待确认 -->
      <div class="state_time">
        <p :class="{'sc':recordData[2]}"><span class="mr10">●</span>已提交待确认</p>
        <div class="state_lists" v-if="recordData[2]&&recordData[2].length" v-for="(item,index) in recordData[2]" :class="{'list_first':index==0}">
          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{item.operating_time | formatDate}}</span>
        </div>
        <i style="margin-top:0px;height:20px;"></i>
      </div>
      <!-- 已确认待上报 -->
      <div class="state_time">
        <p :class="{'sc':recordData[5]}"><span class="mr10">●</span>已确认待上报</p>
        <div class="state_lists" v-if="recordData[5]&&recordData[5].length" v-for="(item,index) in recordData[5]" :class="{'list_first':index==0}">
          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{item.operating_time | formatDate}}</span>
        </div>
        <i style="height:20px;margin-top:0"></i>
      </div>
      <!-- 已上报待审核 -->
      <div class="state_time">
        <p :class="{'sc':recordData[6]}"><span class="mr10">●</span>已上报待审核</p>
        <div class="state_lists" v-if="recordData[6]&&recordData[6].length" v-for="(item,index) in recordData[6]" :class="{'list_first':index==0}">
          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{item.operating_time | formatDate}}</span>
        </div>
        <i style="height:20px;margin-top:0"></i>
      </div>
      <!-- 已审核待申报 -->
      <div class="state_time">
        <p :class="{'sc':recordData[7]}"><span class="mr10">●</span>已审核待申报</p>
        <div class="state_lists" v-if="recordData[7]&&recordData[7].length" v-for="(item,index) in recordData[7]" :class="{'list_first':index==0}">
          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{item.operating_time | formatDate}}</span>
        </div>
        <i style="height:20px;margin-top:0"></i>
      </div>
      <!-- 已申报待商标局收文 -->
      <div class="state_time" v-if="recordData[9]">
        <p :class="{'sc':recordData[9]}"><span class="mr10">●</span>已申报待商标局收文</p>
        <div class="state_lists" v-if="recordData[9]&&recordData[9].length" v-for="(item,index) in recordData[9]" :class="{'list_first':index==0}">
          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{item.operating_time | formatDate}}</span>
          <span v-if="item.type && item.type!=null" class="ml40 mr515" style="width:140px;display:inline-block;">{{item.type | downFileName}}</span>
          <a v-if="item.url" class="ml40" @click="previewClick(item)">预览</a>
          <a v-if="item.url" class="ml20" :href="rootUrl+'/api/downNetFile?access_token='+token+'&url='+item.url" target="_blank">下载</a>
        </div>
        <i></i>
      </div>
      <!-- 商标局已收文待形式审查 -->
      <div class="state_time" v-if="recordData[10]">
        <p :class="{'sc':recordData[10]}"><span class="mr10">●</span>商标局已收文待形式审查</p>
        <div class="state_lists" v-if="recordData[10]&&recordData[10].length" v-for="(item,index) in recordData[10]" :class="{'list_first':index==0}">
          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{item.operating_time | formatDate}}</span>
          <span class="ml20 mr515" style="width:140px;display:inline-block;">{{item.type | downFileName}}</span>
          <a v-if="item.url" class="ml40" @click="previewClick(item)">预览</a>
          <a v-if="item.url" class="ml20" :href="rootUrl+'/api/downNetFile?access_token='+token+'&url='+item.url" target="_blank">下载</a>
        </div>
        <i></i>
      </div>
      <!-- 形式审查通过待实质审查 -->
      <div class="state_time" v-if="recordData[11]">
        <p :class="{'sc':recordData[11]}"><span class="mr10">●</span>形式审查通过待实质审查</p>
        <div v-if="recordData[11]&&recordData[11].length" v-for="(info,index) in recordData[11]" class="state_lists" :class="{'list_first':index==0}">
          <span class="ml25 time_left">{{info.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{info.operating_time | formatDate}}</span>
          <span class="ml20 mr515" style="width:140px;display:inline-block;">{{info.type | downFileName}}</span>
          <a v-if="info.url" class="ml40" @click="previewClick(info)">预览</a>
          <a v-if="info.url" class="ml20" :href="rootUrl+'/api/downNetFile?access_token='+token+'&url='+info.url" target="_blank">下载</a>
        </div>
        <i style="height:20px;margin-top:0"></i>
      </div>
      <!-- 实质审查不通过被驳回 -->
      <div class="state_time" v-if="recordData[14]">
        <p :class="{'sc':recordData[14]}"><span class="mr10">●</span>实质审查不通过被驳回</p><!-- 显示用户查看状态 -->
        <div v-if="recordData[14]&&recordData[14].length" v-for="info in recordData[14]" style="margin-left:4px;">
          <span class="ml25 time_left">{{info.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{info.operating_time | formatDate}}</span>
          <span class="ml20 mr515" style="width:140px;display:inline-block;">{{info.type | downFileName}}</span>
          <a v-if="info.url" class="ml40" @click="previewClick(info)">预览</a>
          <a v-if="info.url" class="ml20" :href="rootUrl+'/api/downNetFile?access_token='+token+'&url='+info.url" target="_blank">下载</a>
          <i></i>
        </div>
        <i v-if="recordData[14]"></i>
      </div>
      <!-- 实质审查通过待初审公告-->
      <div class="state_time" v-if="recordData[12]">
        <p :class="{'sc':recordData[12]}"><span class="mr10">●</span>实质审查通过待初审公告</p><!-- 显示用户查看状态 -->
        <div v-if="recordData[12]&&recordData[12].length" v-for="(info,index) in recordData[12]" class="state_lists" :class="{'list_first':index==0}">
          <span class="ml25 time_left">{{info.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{info.operating_time | formatDate}}</span>
          <span class="ml20 mr515" style="width:140px;display:inline-block;">{{info.type | downFileName}}</span>
          <a v-if="info.url" class="ml40" @click="previewClick(info)">预览</a>
          <a v-if="info.url" class="ml20" :href="rootUrl+'/api/downNetFile?access_token='+token+'&url='+info.url" target="_blank">下载</a>
        </div>
        <i style="height:20px;margin-top:0"></i>
      </div>
      <!-- 初审公告不通过被异议 -->
      <div class="state_time" v-if="recordData[17]">
        <p :class="{'sc':recordData[17]}"><span class="mr10">●</span>被异议</p><!-- 显示用户查看状态 -->
        <div v-if="recordData[17]&&recordData[17].length" v-for="(info,index) in recordData[17]" class="state_lists" :class="{'list_first':index==0}">
          <span class="ml25 time_left">{{info.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{info.operating_time | formatDate}}</span>
          <span class="ml20 mr515" style="width:140px;display:inline-block;">{{info.type | downFileName}}</span>
          <a v-if="info.url" class="ml40" @click="previewClick(info)">预览</a>
          <a v-if="info.url" class="ml20" :href="rootUrl+'/api/downNetFile?access_token='+token+'&url='+info.url" target="_blank">下载</a>
        </div>
        <i style="height:20px;margin-top:0"></i>
      </div>
      <!--  初审公告通过待发放注册证 -->
      <div class="state_time" v-if="!recordData[99]">
        <p :class="{'sc':recordData[15]}"><span class="mr10">●</span>待发放注册证</p><!-- 显示用户查看状态 -->
        <div class="state_lists" v-if="recordData[15]&&recordData[15].length" v-for="(item,index) in recordData[15]" :class="{'list_first':index==0}">
          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{item.operating_time | formatDate}}</span>
          <span class="ml20 mr515" style="width:140px;display:inline-block;">{{item.type | downFileName}}</span>
          <a v-if="item.url" class="ml40" @click="previewClick(item)">预览</a>
          <a v-if="item.url" class="ml20" :href="rootUrl+'/api/downNetFile?access_token='+token+'&url='+item.url" target="_blank">下载</a>
        </div>
        <i></i>
      </div>
      <!-- 已发放注册证 -->
      <div class="state_time" v-if="!recordData[99]">
        <p :class="{'sc':recordData[18]}"><span class="mr10">●</span>已发放注册证</p><!-- 显示用户查看状态 -->
        <div class="state_lists" v-if="recordData[18]&&recordData[18].length" v-for="(item,index) in recordData[18]" :class="{'list_first':index==0}">
          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{item.operating_time | formatDate}}</span>
          <span class="ml20 mr515" style="width:140px;display:inline-block;">{{item.type | downFileName}}</span>
          <a v-if="item.url" class="ml40" @click="previewClick(item)">预览</a>
          <a v-if="item.url" class="ml20" :href="rootUrl+'/api/downNetFile?access_token='+token+'&url='+item.url" target="_blank">下载</a>
        </div>
      </div>
      <!-- 办理终止 -->
      <div class="state_time" v-if="recordData[99]">
        <p class="sc" style="margin-top:-5px;"><span class="mr10">●</span>办理终止</p><!-- 显示用户查看状态 -->
        <div class="state_lists" v-if="recordData[99]&&recordData[99].length" v-for="(item,index) in recordData[99]" :class="{'list_first':index==0}">
          <span class="ml25 time_left">{{item.bs_feedback_operate || '--'}}</span>
          <span class="ml40">{{item.operating_time | formatDate}}</span>
          <span class="ml20 mr515" style="width:140px;display:inline-block;">{{item.type | downFileName}}</span>
          <a v-if="item.url" class="ml40" @click="previewClick(item)">预览</a>
          <a v-if="item.url" class="ml20" :href="rootUrl+'/api/downNetFile?access_token='+token+'&url='+item.url" target="_blank">下载</a>
        </div>
      </div>
    </div>
    <div class="instructions mt20" v-if="!previewImg">
      <p class="tit">业务办理说明</p>
      <ul class="list_tit clearfix mt10">
        <li class="fl td01">时间</li>
        <li class="fl td01">说明类型</li>
        <li class="fl td01">备注</li>
      </ul>
      <ul class="list_info clearfix" v-if="findHandleRemark.length" v-for="item in findHandleRemark" :key="item">
        <li class="fl td01">{{item.createTime | formatDate}}</li>
        <li class="fl td01">{{Remarktype(item.type)}}</li>
        <li class="fl td01">{{item.remark}}</li>
      </ul>
      <ul class="list_info clearfix" v-if="!findHandleRemark.length">
        <li class="fl td01">暂无记录</li>
        <li class="fl td01"></li>
        <li class="fl td01"></li>
      </ul>
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
	props:['previewImg','recordData','order_id'],
  data() {
    return {
    	previewSrc:'',
    	certificateImg:'',
    	token:'',
      rootUrl:rootUrl,
      findHandleRemark:[]
    }
  },
  mounted() {
    this.token = this.$cookie.get("user_token");
    if(this.order_id){
      this.$http.get(this.rootUrl+'/api/findHandleRemark/'+this.order_id)
      .then((response) => {
        this.findHandleRemark = response.data;
        console.log(response)
      })
      .catch((error) => {
      });
    }
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
      })
      .catch((error) => {
      });
      this.certificateImg = data.type;
      // this.previewImg = true;
      this.$emit('previewClick');
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
	.service_preview_cxb{
		.apply_num{padding:30px 20px 20px;
			.apply_left{font-size: 14px;color: #333333;}
			.apply_right{margin-left: 15px;font-size: 14px;color: #999999;}
		}
		.state_list_cxb{margin:0 20px;padding:0;border-top:1px solid #eee;border-bottom:1px solid #eee;padding-top:25px;max-height:355px;overflow: auto;padding-bottom: 20px;
			.state_time{
				p{line-height:20px;font-size:14px;color:#556677;
					span{font-size:16px;}
				}
        .sc{color:#09BB07;margin-top:-8px;
          span{color:#09BB07;}
        }
				span{font-size: 13px;color: #999999;}
				.time_left{width:160px;display:inline-block;margin-left: 16px;}
				>i{height: 70px;margin-top: -50px;border-left: 1px dashed #ddd;display: block;margin-left: 4px;}
				.last_time{height:26px;}
        div{
          a{color:#999;text-decoration:none;cursor:pointer;font-size:14px;}
          a:hover {color: #3DB1FA;}
        }
        .state_lists{margin-left:4px;border-left: 1px dashed #ddd;padding-top: 5px;}
        .list_first{margin-top:-5px;}
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
