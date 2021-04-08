<template>
  <div class="complaintDetail">
    <h4 class="navTitle">详情</h4>
    <div>
      <div class="detailTitle">服务进度</div>
      <div class="detailCont">
        <div class="contList">
          <div class="contlia"><span>服务编号：</span><span>{{ProtectDetails.businessSn}}</span></div>
          <div class="contlia"><span>服务类型：</span><span>{{ProtectDetails.businessType==1?'跨平台电商保护':ProtectDetails.businessType==2?'侵权监测':ProtectDetails.businessType==3?'侵权判定':ProtectDetails.businessType==4?'质量抽检/鉴定/召回':ProtectDetails.businessType==5?'行政/刑事':ProtectDetails.businessType==6?'海关保护':ProtectDetails.businessType==7?'法律服务':ProtectDetails.businessType==8?'授权许可':''}}</span></div>
          <div class="contlia"><span>服务进度：</span><span>{{ProtectDetails.state==1?'待受理':ProtectDetails.state==2?'服务中':ProtectDetails.state==3?'服务完成':ProtectDetails.state==4?'不予受理':''}}</span></div>
        </div>
        <div class="buzhou">
          <div class="bzli" 
          :class="ProtectDetails.ipProtectOperateDTOList?ProtectDetails.ipProtectOperateDTOList[0]?ProtectDetails.ipProtectOperateDTOList[0].stateAfterOperate==1?'bzstate1':'':'':''" 
          >
            <div class="bznumber">1</div>
            <div class="bzstatus">待受理</div>
            <div class="timename" v-if="ProtectDetails.ipProtectOperateDTOList&&ProtectDetails.ipProtectOperateDTOList[0]&&ProtectDetails.ipProtectOperateDTOList[0].createTime">
              提交时间
            </div>
            <div class="bztime" v-if="ProtectDetails.ipProtectOperateDTOList&&ProtectDetails.ipProtectOperateDTOList[0]&&ProtectDetails.ipProtectOperateDTOList[0].createTime">
              {{ProtectDetails.ipProtectOperateDTOList[0].createTime | dateFormat}}
            </div>
          </div>
          <div class="bzli bzli2" 
          :class="ProtectDetails.ipProtectOperateDTOList?ProtectDetails.ipProtectOperateDTOList[1]?ProtectDetails.ipProtectOperateDTOList[1].stateAfterOperate==2?'bzstate2':'bzstateno':'':''" 
          >
            <div class="bznumber">2</div>
            <div class="bzstatus">服务中</div>
            <div class="timename" v-if="ProtectDetails.ipProtectOperateDTOList&&ProtectDetails.ipProtectOperateDTOList[1]&&ProtectDetails.ipProtectOperateDTOList[1].createTime">
              受理时间
            </div>
            <div class="bztime" v-if="ProtectDetails.ipProtectOperateDTOList&&ProtectDetails.ipProtectOperateDTOList[1]&&ProtectDetails.ipProtectOperateDTOList[1].createTime">
              {{ProtectDetails.ipProtectOperateDTOList[1].createTime | dateFormat}}
            </div>
          </div>
          <div class="bzli bzli3" 
          :class="ProtectDetails.ipProtectOperateDTOList?ProtectDetails.ipProtectOperateDTOList[2]?ProtectDetails.ipProtectOperateDTOList[2].stateAfterOperate==3?'bzstate2':'':(ProtectDetails.ipProtectOperateDTOList&&ProtectDetails.ipProtectOperateDTOList[1]&&ProtectDetails.ipProtectOperateDTOList[1].stateAfterOperate==4)?'bzstateno':'':''" 
          >
            <div class="bznumber">3</div>
            <div class="bzstatus">已完成</div>
            <div class="timename"  v-if="ProtectDetails.ipProtectOperateDTOList&&ProtectDetails.ipProtectOperateDTOList[2]&&ProtectDetails.ipProtectOperateDTOList[2].createTime">
              完成时间
            </div>
            <div class="bztime" v-if="ProtectDetails.ipProtectOperateDTOList&&ProtectDetails.ipProtectOperateDTOList[2]&&ProtectDetails.ipProtectOperateDTOList[2].createTime">
              {{ProtectDetails.ipProtectOperateDTOList[2].createTime | dateFormat}}
            </div>
          </div>
          <div class="bzli bzli4" 
          :class="ProtectDetails.ipProtectOperateDTOList?ProtectDetails.ipProtectOperateDTOList[1]?ProtectDetails.ipProtectOperateDTOList[1].stateAfterOperate==4?'bzstate2':'bzstateno':'bzstateno':''"
          >
            <div class="bznumber">2</div>
            <div class="bzstatus">不予受理</div>
            <div class="timename" v-if="ProtectDetails.ipProtectOperateDTOList&&ProtectDetails.ipProtectOperateDTOList[1]&&ProtectDetails.ipProtectOperateDTOList[1].createTime">
              审核时间
            </div>
            <div class="bztime" v-if="ProtectDetails.ipProtectOperateDTOList&&ProtectDetails.ipProtectOperateDTOList[1]&&ProtectDetails.ipProtectOperateDTOList[1].createTime">
              {{ProtectDetails.ipProtectOperateDTOList[1].createTime | dateFormat}}
            </div>
          </div>
        </div>
      </div>
      <div class="detailTitle">案件详细信息</div>
      <!-- 跨平台电商保护 -->
      <div class="xinxiUl" v-if="ProtectDetails.businessType==1">
        <div class="xinxilist"><span>投诉/申诉：</span><span>{{ProtectDetails.protectType}}</span></div>
        <div v-if="ProtectDetails.protectType=='投诉'">
          <div class="xinxilist"><span>投诉平台：</span><span>{{ProtectDetails.complaintPlatform}}</span></div>
          <div class="xinxilist"><span>投诉网址：</span><span>{{ProtectDetails.complaintWebsite}}</span></div>
          <div class="xinxilist"><span>投诉内容：</span><span>{{ProtectDetails.complaintContent}}</span></div>
        </div>
        <div v-else>
          <div class="xinxilist"><span>申诉平台：</span><span>{{ProtectDetails.complaintPlatform}}</span></div>
          <div class="xinxilist"><span>被投诉侵犯知识产权类型：</span><span>{{ProtectDetails.ipType}}</span></div>
        </div>
        <div class="xinxilist" v-if="ProtectDetails.voucher">
          <span>案件材料：</span>
          <span class="filelist">
            <span :title="decodeURI(item.fileName)" v-for="(item,key) in JSON.parse(ProtectDetails.voucher)" :key="key" @click="openFn(item.url)">
              <span class="fileimg">
                <img :src="(item.url.toLowerCase().indexOf('jpg')>-1)?item.url:
                (item.url.toLowerCase().indexOf('png')>-1)?item.url:
                (item.url.toLowerCase().indexOf('jpeg')>-1)?item.url:
                (item.url.toLowerCase().indexOf('bmp')>-1)?item.url:require('../../assets/img/complaintDetail/more.png')" alt="">
              </span>
              <span class="filname">{{decodeURI(item.fileName)}}</span>
            </span>
          </span>
        </div>
        <div class="xinxilist"><span>联系人：</span><span>{{ProtectDetails.lxrName}}</span></div>
        <div class="xinxilist"><span>联系电话：</span><span>{{ProtectDetails.lxrPhone}}</span></div>
      </div>
      <!-- 侵权监测 -->
      <div class="xinxiUl" v-if="ProtectDetails.businessType==2">
        <div class="xinxilist"><span>监测模式：</span><span>{{ProtectDetails.monitorModel}}</span></div>
        <div class="xinxilist"><span>监测关键词：</span><span>{{ProtectDetails.monitorBrand}}</span></div>
        <div class="xinxilist"><span>监测类型：</span><span>{{ProtectDetails.monitorType}}</span></div>
        <div class="xinxilist">
          <span>监测平台：</span>
          <span>
            <span v-for="(item,key) in ProtectDetails.monitorPlatform.split(';')" :key="key" v-show="item">{{item==1?'中文电商： 淘宝 天猫 拼多多 京东 阿里巴巴 慧聪网 苏宁；':item==2?'地图： 高德地图；':item==3?'搜索引擎： 百度搜索 搜狗搜索 360搜索 必应；':item==4?'社媒账号： 微博账号检索 微信公众号检索 抖音账号检索；':item==5?'新闻门户： 人民网 新浪网 新华网 国搜新闻；':item==6?'社媒账号： 微博账号检索 微信公众号检索 抖音账号检索；':item==7?'工商信息： 工商信息；':''}}<br></span>
          </span>
        </div>
        <div class="xinxilist"><span>联系人：</span><span>{{ProtectDetails.lxrName}}</span></div>
        <div class="xinxilist"><span>联系电话：</span><span>{{ProtectDetails.lxrPhone}}</span></div>
      </div>
      <!-- 侵权判定 -->
      <div class="xinxiUl" v-if="ProtectDetails.businessType==3">
        <div class="xinxilist"><span>判定类型：</span><span>{{ProtectDetails.determineType}}</span></div>
        <div class="xinxilist" v-if="ProtectDetails.determineType=='专利'"><span>专利类型：</span><span>{{ProtectDetails.patentType==1?'外观设计专利':ProtectDetails.patentType==2?'实用新型专利':ProtectDetails.patentType==3?'发明专利':''}}</span></div>
        <div class="xinxilist" v-if="ProtectDetails.determineType=='专利'"><span>专利名称：</span><span>{{ProtectDetails.patentName}}</span></div>
        <div class="xinxilist" v-if="ProtectDetails.determineType=='专利'"><span>专利申请号：</span><span>{{ProtectDetails.caseNo}}</span></div>
        <div class="xinxilist" v-if="ProtectDetails.determineType=='版权'"><span>版权类型：</span><span>{{ProtectDetails.serviceType==1?'软件著作权':ProtectDetails.serviceType==2?'作品著作权':''}}</span></div>
        <div class="xinxilist" v-if="ProtectDetails.determineType=='版权'"><span>作品名称：</span><span>{{ProtectDetails.patentName}}</span></div>
        <div class="xinxilist" v-if="ProtectDetails.determineType=='版权'"><span>作品类型：</span><span>{{ProtectDetails.lawType}}</span></div>
        <div class="xinxilist" v-if="ProtectDetails.complaintWebsite"><span>侵权商品链接：</span><span>{{ProtectDetails.complaintWebsite}}</span></div>
        <div class="xinxilist" v-if="ProtectDetails.tortDesc"><span>侵权说明：</span><span>{{ProtectDetails.tortDesc}}</span></div>
        <div class="xinxilist" v-if="ProtectDetails.voucher">
          <span>案件材料：</span>
          <span class="filelist">
            <span :title="decodeURI(item.fileName)" v-for="(item,key) in JSON.parse(ProtectDetails.voucher)" :key="key" @click="openFn(item.url)">
              <span class="fileimg">
                <img :src="(item.url.toLowerCase().indexOf('jpg')>-1)?item.url:
                (item.url.toLowerCase().indexOf('png')>-1)?item.url:
                (item.url.toLowerCase().indexOf('jpeg')>-1)?item.url:
                (item.url.toLowerCase().indexOf('bmp')>-1)?item.url:require('../../assets/img/complaintDetail/more.png')" alt="">
              </span>
              <span class="filname">{{decodeURI(item.fileName)}}</span>
            </span>
          </span>
        </div>
        <div class="xinxilist"><span>联系人：</span><span>{{ProtectDetails.lxrName}}</span></div>
        <div class="xinxilist"><span>联系电话：</span><span>{{ProtectDetails.lxrPhone}}</span></div>
      </div>
      <!-- 质量抽检/鉴定/召回 -->
      <div class="xinxiUl" v-if="ProtectDetails.businessType==4">
        <div class="xinxilist"><span>质量监测项目：</span><span>{{ProtectDetails.qualityProject}}</span></div>
        <div class="xinxilist"><span>产品销售平台：</span><span>{{ProtectDetails.salePlatform}}</span></div>
        <div class="xinxilist"><span>产品网址：</span><span>{{ProtectDetails.complaintWebsite}}</span></div>
        <div class="xinxilist"><span>产品生产商所在地：</span><span>{{ProtectDetails.productionAddress}}</span></div>
        <div class="xinxilist"><span>产品问题描述：</span><span>{{ProtectDetails.tortDesc}}</span></div>
        <div class="xinxilist" v-if="ProtectDetails.productionUnqualified"><span>产品质量不合格/缺陷项：</span><span>{{ProtectDetails.productionUnqualified}}</span></div>
        <div class="xinxilist" v-if="ProtectDetails.voucher">
          <span>案件材料：</span>
          <span class="filelist">
            <span :title="decodeURI(item.fileName)" v-for="(item,key) in JSON.parse(ProtectDetails.voucher)" :key="key" @click="openFn(item.url)">
              <span class="fileimg">
                <img :src="(item.url.toLowerCase().indexOf('jpg')>-1)?item.url:
                (item.url.toLowerCase().indexOf('png')>-1)?item.url:
                (item.url.toLowerCase().indexOf('jpeg')>-1)?item.url:
                (item.url.toLowerCase().indexOf('bmp')>-1)?item.url:require('../../assets/img/complaintDetail/more.png')" alt="">
              </span>
              <span class="filname">{{decodeURI(item.fileName)}}</span>
            </span>
          </span>
        </div>
        <div class="xinxilist"><span>联系人：</span><span>{{ProtectDetails.lxrName}}</span></div>
        <div class="xinxilist"><span>联系电话：</span><span>{{ProtectDetails.lxrPhone}}</span></div>
      </div>
      <!-- 行政/刑事 -->
      <div class="xinxiUl" v-if="ProtectDetails.businessType==5">
        <div class="xinxilist"><span>侵权类型：</span><span>{{ProtectDetails.tortType}}</span></div>
        <div class="xinxilist"><span>线索描述：</span><span>{{ProtectDetails.tortDesc}}</span></div>
        <div class="xinxilist"><span>身份类型：</span><span>{{ProtectDetails.identityType}}</span></div>
        <div class="xinxilist" v-if="ProtectDetails.voucher">
          <span>案件材料：</span>
          <span class="filelist">
            <span :title="decodeURI(item.fileName)" v-for="(item,key) in JSON.parse(ProtectDetails.voucher)" :key="key" @click="openFn(item.url)">
              <span class="fileimg">
                <img :src="(item.url.toLowerCase().indexOf('jpg')>-1)?item.url:
                (item.url.toLowerCase().indexOf('png')>-1)?item.url:
                (item.url.toLowerCase().indexOf('jpeg')>-1)?item.url:
                (item.url.toLowerCase().indexOf('bmp')>-1)?item.url:require('../../assets/img/complaintDetail/more.png')" alt="">
              </span>
              <span class="filname">{{decodeURI(item.fileName)}}</span>
            </span>
          </span>
        </div>
        <div class="xinxilist"><span>联系人：</span><span>{{ProtectDetails.lxrName}}</span></div>
        <div class="xinxilist"><span>联系电话：</span><span>{{ProtectDetails.lxrPhone}}</span></div>
      </div>
      <!-- 海关保护 -->
      <div class="xinxiUl" v-if="ProtectDetails.businessType==6">
        <div class="xinxilist"><span>知识产权类型：</span><span>{{ProtectDetails.ipType}}</span></div>
        <div class="xinxilist"><span>服务类型：</span><span>{{ProtectDetails.serviceType}}</span></div>
        <div class="xinxilist" v-if="ProtectDetails.tortDesc"><span>线索：</span><span>{{ProtectDetails.tortDesc}}</span></div>
        <div class="xinxilist" v-if="ProtectDetails.voucher">
          <span>案件材料：</span>
          <span class="filelist">
            <span :title="decodeURI(item.fileName)" v-for="(item,key) in JSON.parse(ProtectDetails.voucher)" :key="key" @click="openFn(item.url)">
              <span class="fileimg">
                <img :src="(item.url.toLowerCase().indexOf('jpg')>-1)?item.url:
                (item.url.toLowerCase().indexOf('png')>-1)?item.url:
                (item.url.toLowerCase().indexOf('jpeg')>-1)?item.url:
                (item.url.toLowerCase().indexOf('bmp')>-1)?item.url:require('../../assets/img/complaintDetail/more.png')" alt="">
              </span>
              <span class="filname">{{decodeURI(item.fileName)}}</span>
            </span>
          </span>
        </div>
        <div class="xinxilist"><span>联系人：</span><span>{{ProtectDetails.lxrName}}</span></div>
        <div class="xinxilist"><span>联系电话：</span><span>{{ProtectDetails.lxrPhone}}</span></div>
      </div>
      <!-- 法律服务 -->
      <div class="xinxiUl" v-if="ProtectDetails.businessType==7">
        <div class="xinxilist"><span>法律服务类型：</span><span>{{ProtectDetails.lawType}}</span></div>
        <div class="xinxilist"><span>案号：</span><span>{{ProtectDetails.caseNo}}</span></div>
        <div class="xinxilist"><span>案情描述：</span><span>{{ProtectDetails.tortDesc}}</span></div>
        <div class="xinxilist"><span>诉求：</span><span>{{ProtectDetails.appeal}}</span></div>
        <div class="xinxilist" v-if="ProtectDetails.voucher">
          <span>案件材料：</span>
          <span class="filelist">
            <span :title="decodeURI(item.fileName)" v-for="(item,key) in JSON.parse(ProtectDetails.voucher)" :key="key" @click="openFn(item.url)">
              <span class="fileimg">
                <img :src="(item.url.toLowerCase().indexOf('jpg')>-1)?item.url:
                (item.url.toLowerCase().indexOf('png')>-1)?item.url:
                (item.url.toLowerCase().indexOf('jpeg')>-1)?item.url:
                (item.url.toLowerCase().indexOf('bmp')>-1)?item.url:require('../../assets/img/complaintDetail/more.png')" alt="">
              </span>
              <span class="filname">{{decodeURI(item.fileName)}}</span>
            </span>
          </span>
        </div>
        <div class="xinxilist"><span>联系人：</span><span>{{ProtectDetails.lxrName}}</span></div>
        <div class="xinxilist"><span>联系电话：</span><span>{{ProtectDetails.lxrPhone}}</span></div>
      </div>
      <!-- 授权许可 -->
      <div class="xinxiUl" v-if="ProtectDetails.businessType==8">
        <div class="xinxilist"><span>知识产权类型：</span><span>{{ProtectDetails.ipType}}</span></div>
        <div class="xinxilist" v-if="ProtectDetails.ipType=='商标'"><span>商标注册号：</span><span>{{ProtectDetails.caseNo}}</span></div>
        <div class="xinxilist" v-if="ProtectDetails.ipType=='版权'"><span>版权登记号：</span><span>{{ProtectDetails.caseNo}}</span></div>
        <div class="xinxilist" v-if="ProtectDetails.ipType=='专利'"><span>专利申请号：</span><span>{{ProtectDetails.caseNo}}</span></div>
        <div class="xinxilist" v-if="ProtectDetails.voucher">
          <span>案件材料：</span>
          <span class="filelist">
            <span :title="decodeURI(item.fileName)" v-for="(item,key) in JSON.parse(ProtectDetails.voucher)" :key="key" @click="openFn(item.url)">
              <span class="fileimg">
                <img :src="(item.url.toLowerCase().indexOf('jpg')>-1)?item.url:
                (item.url.toLowerCase().indexOf('png')>-1)?item.url:
                (item.url.toLowerCase().indexOf('jpeg')>-1)?item.url:
                (item.url.toLowerCase().indexOf('bmp')>-1)?item.url:require('../../assets/img/complaintDetail/more.png')" alt="">
              </span>
              <span class="filname">{{decodeURI(item.fileName)}}</span>
            </span>
          </span>
        </div>
        <div class="xinxilist"><span>联系人：</span><span>{{ProtectDetails.lxrName}}</span></div>
        <div class="xinxilist"><span>联系电话：</span><span>{{ProtectDetails.lxrPhone}}</span></div>
      </div>
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
          jinzhan:123,
          ProtectDetails:'',
        }
    },
    methods:{
      openFn(key){
        window.open(key)
      },
      ipProtectDetail(key){
        this.loading=true;
        this.$http({
            method:'get',
            url:'./api/ipprotect/ipProtectDetail',
            params: {
              "access_token":this.$cookie.get('user_token') || '',
              "businessSn":key
            },
        }).then((response) => {
          this.loading = false;
          this.ProtectDetails = response.data;
          // this.ProtectDetails = {
          //   "pgIndex" : 1,
          //   "pgCount" : 10,
          //   "sortType" : null,
          //   "sortField" : null,
          //   "id" : 5,
          //   "sbId" : null,
          //   "openId" : null,
          //   "memberId" : 2,
          //   "businessSn" : "210127000005",
          //   "businessType" : 1,
          //   "protectType" : "投诉",
          //   "ipType" : null,
          //   "serviceType" : null,
          //   "monitorModel" : null,
          //   "monitorBrand" : null,
          //   "monitorType" : null,
          //   "determineType" : null,
          //   "patentType" : null,
          //   "lawType" : null,
          //   "caseNo" : null,
          //   "patentName" : null,
          //   "appeal" : null,
          //   "tortType" : null,
          //   "tortDesc" : null,
          //   "monitorPlatform" : null,
          //   "complaintPlatform" : "天猫",
          //   "complaintWebsite" : "www.baidu.com",
          //   "complaintContent" : "滥用商标关键词",
          //   "qualityProject" : null,
          //   "salePlatform" : null,
          //   "productionAddress" : null,
          //   "productionUnqualified" : null,
          //   "identityType" : null,
          //   "lxrName" : "艾斯",
          //   "lxrPhone" : "18868403698",
          //   "state" : 1,
          //   "updateTime" : 1611741092000,
          //   "createTime" : 1611741092000,
          //   "ipProtectOperateDTOList" : [ {
          //     "businessSn" : "210127000005",
          //     "stateAfterOperate" : 1,
          //     "memo" : null,
          //     "operateType" : 1,
          //     "createTime" : 1611741092000
          //   } ],
          //   "voucher":'[{\"url\":\"https://hzsebetest.oss-cn-hangzhou.aliyuncs.com/28B623B3B14E3C404D7058BD1CBD9980.jpg\",\"fileName\":\"2.BMP\",\"fileSize\":496407},{\"url\":\"https://hzsebetest.oss-cn-hangzhou.aliyuncs.com/0F867DDEA315238ADB52224C7935AE7C.doc\",\"fileName\":\"%E6%96%B0%E5%BB%BA%20DOC%20%E6%96%87%E6%A1%A3.doc\",\"fileSize\":9216},{\"url\":\"https://hzsebetest.oss-cn-hangzhou.aliyuncs.com/D2E7F7B2BDE007CD9DB2368CEF3F7436.png\",\"fileName\":\"lALPDg7mOaogPJbNAc3NAxY_790_461.png\",\"fileSize\":9744}]',
            
          // }
        }).catch((err) => {
          this.loading = false;
          if(err&&err.response&&err.response.data&&err.response.data.msg){
            this.$message.error(err.response.data.msg)
          }else{
            this.$message.error('系统繁忙，请稍后再试')
          }
        });
      },
    },
    mounted(){
      console.log(this.businessSn)
      this.ipProtectDetail(this.$route.params.web_id)
    },
    watch: {
    },
    filters: {
      dateFormat:Filters.formatDate.dateFormat,
    }
  }
</script>

<style scoped lang="scss">
  .complaintDetail{
    font-size: 14px;
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
    .detailTitle{
      height: 40px;
      line-height: 40px;
      background: #f5f5f5;
      font-size: 14px;
      padding-left: 14px;
      margin-top: 20px;
    }
    .detailCont{
      display: flex;
      padding: 0 14px;
      .contList{
        width: 26%;
        .contlia{
          margin-top: 14px;
          >span:first-child{
            color: #999;
          }
          >span:last-child{
            color: #333;
          }
        }
      }
      .buzhou{
        display: flex;
        justify-content: flex-start;
        width: 74%;
        font-size: 14px;
        .bzli{
          width: 33.333333333333%;
          text-align: center;
          margin-top: 8px;
          position: relative;
          .bznumber{
            width: 30px;
            height: 30px;
            border-radius: 50%;
            color: #F8F8F8;
            background: #999;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
          }
          .bzstatus{
            margin-top: 8px;
            color: #333;
          }
          .timename{
            color: #999;
            margin-top: 6px;
          }
          .bztime{
            color: #333;
          }
        }
        .bzli2::before,.bzli4::before,.bzli3::before{
          content: '';
          position: absolute;
          width: 155px;
          top: 14px;
          left: -80px;
          height: 1px;
          background: #999;
        }
        .bzstate1{
          .bznumber{
            background: rgba(71, 182, 245, 1);
            color: #fff;
          }
        }
        .bzstate2{
          .bznumber{
            background: rgba(71, 182, 245, 1);
            color: #fff;
          }
        }
        .bzstate2::before{
          background: rgba(71, 182, 245, 1);
        }
        .bzstateno{
          display: none;
        }
      }
    }
    .xinxiUl{
      .xinxilist{
        display: flex;
        margin-top: 14px;
        >span:first-child{
          color: #999;
          flex-shrink: 0;
        }
        >span:last-child{
          color: #333;
        }
        .filelist{
          display: flex;
          >span{
            width: 100px;
            text-align: center;
            margin: 0 10px;
            cursor: pointer;
            word-break: break-word;
            .fileimg{
              width: 100%;
              height: 131px;
              display: inline-block;
              position: relative;
              img{
                width: 100%;
                display: block;
                box-shadow: 0 0 2px rgba(0, 0, 0, .1);
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
              }
            }
            .filname{
              width: 100px;
              height: 20px;
              display: inline-block;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
</style>
