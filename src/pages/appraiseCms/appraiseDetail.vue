<template>
<div class="appraise_detail_bgi">
  <sebeHeader></sebeHeader>
  <div class="appraise_detail">
    <h4>评价晒单</h4>
    <div class="order_info mt15">
      <span>订单号：{{gradedInfo.order_fictitious_sn}}</span>
      <span class="ml40">{{gradedInfo.create_time | dateFormat}}</span>
    </div>
    <div class="give_mark mt30 mb20 clearfix">
      <div class="give_graded fl">
        <p class="merchant_graded">商家的服务态度评价</p>
        <el-rate class="mt10" v-model="serviceAttitudeEvaluation" :colors="['#FF6439','#FF6439','#FF6439']" :texts="gradedText" show-text @change="graded()"></el-rate>
      </div>
      <div class="give_graded fl" style="margin:0 108px;">
        <p class="merchant_graded">商家的响应速度评价</p>
        <el-rate class="mt10" v-model="responseSpeedEvaluation" :colors="['#FF6439','#FF6439','#FF6439']" :texts="gradedText" show-text @change="graded()"></el-rate>
      </div>
      <div class="give_graded fl">
        <p class="merchant_graded">商家的专业度评价</p>
        <el-rate class="mt10" v-model="professionalEvaluation" :colors="['#FF6439','#FF6439','#FF6439']" :texts="gradedText" show-text @change="graded()"></el-rate>
      </div>
    </div>
    <div class="commodity_list clearfix" v-for="(item,index) in gradedInfo.fictitiousList" :class="{'bor-top':index===0}" :key="item.order_id">
      <div class="commodity_l fl">
        <img :src="item.orderBsImage" alt="">
        <p>{{item.orderName}}</p>
        <span class="mt5">{{item.amount|priceformat}}</span>
      </div>
      <demo :item="item"></demo>
    </div>
  </div>
    <div class="graded_btn">
      <el-button class="mr10" type="primary" @click="gradedInfoClick">评价</el-button>
      <el-checkbox v-model="anonymous">匿名</el-checkbox>
    </div>
  <sebeFooter></sebeFooter>
</div>
  
</template>
<script>
  import Vue from 'vue'
  import $ from 'jquery'
  import sebeHeader from 'components/Header.vue'
  import sebeFooter from 'components/Footer.vue'
  import demo from './component/demo.vue'
  import Filters from '../../api/filters';
  
  export default {
    components: {
      sebeHeader,sebeFooter,demo
    },
    data(){
      return{
        loading:false,
        appraiseState:1,
        serviceAttitudeEvaluation:5,
        responseSpeedEvaluation:5,
        professionalEvaluation:5,
        gradedText:[
          "非常不满意，各方面都很差","不满意，比较差 ","一般，需要改善","比较满意，但仍可改善","非常满意，无可挑剔"
        ],
        gradedData:[
          {
            content:'1',
            score:0,
            buyerLabel:[],//选中的印象，后面应该独立出来
          },{
            content:'2',
            score:0
          }
        ],
        impressionList:[],
        gradedInfo:{
        },
        anonymous:false
      }
    },
    methods:{
      impressionPitch(item,info,index){//对卖家印象选中状态进行操作
          console.log(item)
        if(!item.buyerLabel || !item.buyerLabel.length){//判断是否选中卖家印象
          info.listPitch = true;//是否选中
          item.buyerLabel.push(index);//选中的印象存放位置，后面会单独取出来
        }else if(item.buyerLabel.length <= 3){//卖家印象最大三个
          for(let r in item.buyerLabel){
            if(item.buyerLabel[r] == index){//选中同样的删除
              info.listPitch = false;
              item.buyerLabel.splice(r,1);
              return;
            }
          }
          if(item.buyerLabel.length < 3){//不到三个添加
            info.listPitch = true;
            item.buyerLabel.push(index);
          }else{//已经选中三个且没有点击同一个，不做操作
            return
          }
        }else if(item.buyerLabel.length > 3){//超出三个选中的return
          return;
        }
      },
      graded(){
        console.log(this.serviceAttitudeEvaluation)
      },
      gradedInfoClick(){
        let goodsEvaluationList = [];
        for(let r in this.gradedInfo.fictitiousList){
          let item = this.gradedInfo.fictitiousList[r];
          if(!item.evaluateLabelList.length){
            this.$message({
              message: '请选择买家印象，最少一条最多三条',
              type: 'warning'
            });
            return;
          }
          let info = {
            serviceSn:item.order_sn,
            serviceInfo:item.orderName,
            paidAmount:item.payment_amount,
            content:item.content,
            score:item.score,
            evaluateLabelList:item.evaluateLabelList,
            goodsSn:item.order_bs_number,
            orderBussinessType:item.orderBussinessType
          }
          goodsEvaluationList.push(info)
        }
        this.gradedInfo.fictitiousList.forEach((item)=>{//避免后台读取数据出问题，前端获取的垃圾数据过多，对数据精简处理
          
        })
        
        let data = {
          orderSn:this.$route.params.order,
          shopSn:this.gradedInfo.order_store_code,
          serviceAttitudeEvaluation:this.serviceAttitudeEvaluation,
          responseSpeedEvaluation:this.responseSpeedEvaluation,
          professionalEvaluation:this.professionalEvaluation,
          anonymous:this.anonymous?1:0,
          paidTime:this.gradedInfo.create_time,
          goodsEvaluationList:goodsEvaluationList
        }
        this.$http.post('/api/evaluation/add',data)
        .then((response)=>{
          // this.push('/appraiseList')
          this.$router.replace({ name: 'appraiseList' });
          // router.replace()
        })
        .catch((err)=>{

        })
        console.log(data)
      },
      search(){
        var order = this.$route.params.order;
        console.log(order)
        this.$http.get('/api/findOrderDetails?orderFictitiousSn='+order)
        .then((response)=>{
          console.log(response.data)
          this.gradedInfo = response.data.data;
          this.gradedInfo.fictitiousList.forEach((item)=>{//添加需要传递给后台的字段
            console.log('测试')
            this.$set(item,'impressionList',[]);//添加获取的印象
            this.$set(item,'evaluateLabelList',[]);//选中的印象
            this.$set(item,'score',5);//评分
            this.$set(item,'content','');//评价内容
            item.impressionList.forEach((info)=>{
              this.$set(info,'listPitch',false);
            })
          })
        })
        .catch((err)=>{

        })
      }
    },
    mounted(){
      let self = this;
      this.search();
    },
    watch: {
    },
    filters: {
      dateFormat:Filters.formatDate.dateFormat,
      priceformat:Filters.priceformat
    }
  }
</script>
<style lang="scss">
.appraise_detail_bgi{min-height:100%;background-color:#F3F4F5;}
.appraise_detail{
  width:1200px;margin:20px auto 0;background-color:#fff;min-height:500px;text-align:center;padding:60px 113px 30px;
  h4{font-size:20px;line-height:26px;color:#333;}
  .order_info{
    span{font-size:14px;line-height:20px;color:#666;}
  }
  .give_mark{
    width:974px;height:137px;background-color:#fffbf8;border:1px solid #ffead7;padding:30px 160px;
    .give_graded{
      width:145px;
      .merchant_graded{font-size:14px;color:#333;line-height:20px;}
      .el-rate__text{font-size:12px;color:#FF9639!important;line-height:17px;display:block;}
      .el-icon-star-on{color:#FF9639!important}
    }
  }
  .commodity_list{
    width:974px;height:344px;background-color:#f8f8f8;border-bottom:1px solid #eee;border-left:1px solid #eee;border-right:1px solid #eee;
    .commodity_l{width:246px;padding-top:40px;border-right:1px solid #eee;height:100%;
      img{width:120px;height:120px;}
      p{width:140px;line-height:17px;font-size:12px;color:#333;margin:10px auto 0;word-break:break-all;}
      span{font-size:12px;color:#999;}
    }
    .commodity_r{padding:50px 50px 0;
      .el-form-item{margin-bottom: 5px;}
      .el-form-item__content{text-align:left;position: relative;
        >span{position: absolute;bottom:-5px;right:20px;font-size:12px;color:#999;}
        .el-rate__item{height:20px;}
      }
      .el-textarea__inner{width:540px;height:137px;max-width:540px;max-height:137px;font-size:12px;line-height:17px;border-color:#eee;}
      // 滚动条样式
      .el-textarea__inner::-webkit-scrollbar{width: 2px;background-color: #eee;}
      .el-textarea__inner::-webkit-scrollbar-thumb  {background-color:#ddd;}
      .el-form-item__label{font-size:12px;color:#666;}
      .impression{font-size:0;
        >p{font-size:12px;color:#666;line-height:28px;width:70px;padding-right:12px;
          &:before{content:"*";color: #FF3939;margin-right: 2px;}
        }
        div{width:540px;
          span{font-size:12px;line-height:28px;display:inline-block;border:1px solid #e6e6e6;background-color:#fff;margin-right: 10px;color:#666;position: relative;cursor: pointer;padding:0 10px;
            i{position: absolute;bottom:0;right:0;}
          }
          .pitch_on{border-color:#FFEAD7;color:#FF9639;background-color:#FFFBF8;}
          .pitch_no{border-color:#ddd;color:#999;background-color:#f5f5f5;cursor: default;}
        }
      }
      .experience{
        .el-form-item__label{line-height:17px;}
      }
      .el-rate__text{font-size:12px;color:#FF9639!important;}
      .el-icon-star-on{color:#FF9639!important}
    }
  }
}
.graded_btn{text-align:center;background-color:#fff;width:1200px;margin:0 auto 20px;padding-bottom:50px;font-size:0;
  button{width:160px;height:40px;background-color:#ff6439;border-color:#ff6439;}
  .el-button--primary:hover, .el-button--primary:focus{background-color:#ff6439;border-color:#ff6439;}
  .el-checkbox{color:#333;}
}
.bor-top{border-top:1px solid #eee;}
</style>
