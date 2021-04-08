<template>
  <div class="commodity_r fl">
    <el-form ref="form" label-width="70px">
      <el-form-item label="商品评分" required>
        <el-rate class="mt10" v-model="item.score" :colors="['#FF6439','#FF6439','#FF6439']" :texts="gradedText" show-text></el-rate>
      </el-form-item>
      <div class="impression mb10 clearfix">
        <p class="fl">买家印象</p>
        <div class="fl clearfix">
          <span class="fl mb10" v-for="(info,num) in impressionList" :class="{'pitch_on':info.listPitch,'pitch_no':(!info.listPitch && item.evaluateLabelList&&item.evaluateLabelList.length>=3)}" @click="impressionPitch(item,info,num)" :key="info.id">
            {{info.labelName}}
            <i v-if="info.listPitch" class="el-icon-success"></i>
          </span>
        </div>
      </div>
      <el-form-item label="分享心得" class="experience">
        <el-input type="textarea" maxlength="500" rows="6" v-model="item.content" placeholder="分享体验心得，给万千想买的人一个参考~"></el-input>
        <span class="">还可以输入{{500-(item.content?item.content.length:0)}}字</span>
      </el-form-item>
    </el-form>
  </div>
  
</template>
<script>
  import Vue from 'vue'
  import $ from 'jquery'
  const userUrl = CONFIG.userUrl;
  export default {
    components: {
    },
    props: {
      item: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data(){
      return{
        loading:false,
        appraiseState:1,
        gradedText:[
          "非常不满意，各方面都很差","不满意，比较差 ","一般，需要改善","比较满意，但仍可改善","非常满意，无可挑剔"
        ],
        gradedData:[],
        impressionList:[],
      }
    },
    methods:{
      impressionPitch(item,info,index){//对卖家印象选中状态进行操作
          console.log(item)
        if(!item.evaluateLabelList || !item.evaluateLabelList.length){//判断是否选中卖家印象
          info.listPitch = true;//是否选中
          item.evaluateLabelList.push(info);//选中的印象存放位置，后面会单独取出来
        }else if(item.evaluateLabelList.length <= 3){//卖家印象最大三个
          for(let r in item.evaluateLabelList){
            if(item.evaluateLabelList[r].id == info.id){//选中同样的删除
              info.listPitch = false;
              item.evaluateLabelList.splice(r,1);
              return;
            }
          }
          if(item.evaluateLabelList.length < 3){//不到三个添加
            info.listPitch = true;
            item.evaluateLabelList.push(info);
          }else{//已经选中三个且没有点击同一个，不做操作
            return
          }
        }else if(item.evaluateLabelList.length > 3){//超出三个选中的return
          return;
        }
      },
      search(){
        let url = userUrl+"/api/evaluation/findLabel"
        this.$http.get(url)
        .then((response) => {
          var data = response.data;
          this.impressionList = data.elements;
          this.impressionList.forEach((item)=>{
            this.$set(item,'listPitch',false);//首先为获取的印象添加bool，方便后面选中判断
          })

        })
        .catch((error) => {
          
        });
      }
    },
    mounted(){
      console.log(this.item.score,8888888)
      this.search();
      
    },
    watch: {
    },
    filters: {
    }
  }
</script>
