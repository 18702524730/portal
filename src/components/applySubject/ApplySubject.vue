<template>
  <!-- 存证主体模块 -->
  <div class="applySubject">
  	<h3>选择存证申请人</h3>
    <div class="mainOwern-wrap">
      <div class="tips">重要说明：存证申请人信息是出证的重要信息，且存证完成后不可修改，请保证申请人信息真实、准确。</div>
      <div class="mainOwern clearfix">
        <ul>
          <li v-for="(item, index) in listsData" :class="{active: applySubjectId==item.apply_id}" @click="selectApplySubject(item.apply_id)">
            <p class="name">{{item.apply_name}}</p>
            <p class="type">{{item.apply_type|applyTypeFilter}}</p>
            <i class="edit" @click.stop="showPopup(item)">修改</i>
          </li>
          <li @click="showPopup" v-if="listsData.length<10">
            <div class="main-add"><i>+</i><span>增加申请人</span></div>
          </li>
        </ul>
      </div>
    </div>
    <popup v-if="visible" @close="visible=false" :visible="visible" :formData="popupData" @addSuccess="addSuccess" :typeList="applytype" :parApplyType="parApplyType"></popup>
  </div>
</template>

<script>
  import Vue from 'vue'
  import $ from 'jquery'
  import qs from 'qs'
  import popup from 'components/applySubject/Popup.vue'
  const indexUrl = CONFIG.indexUrl;
  const userUrl = CONFIG.userUrl;
  const getSubjectUrl = userUrl + '/api/subject';


  export default {
  	props:['applytype', 'needRender'],
    data() {
      return {
        visible: false,
        nologin: false,
        parApplyType: 2,
        popupData: {},
        applySubjectId: '',
        listsData: []
      }
    },
    components: {
      popup
    },
    mounted () {
      var self = this;
      try{
        document.domain = 'ipsebe.com';
      }catch(error){
        console.log(error)
      }
      this.initListsData();
    },
    methods: {
      initListsData(){
        this.getListsData(this.applytype);
      },
      // 会员主体类型，1：大陆个体，2：大陆企业，3：境外个体，4：境外企业 typesList: 1,4 逗号隔开
      getListsData(typesList){
    		var self = this;
        //qs.stringify({applyType: type})
        self.nologin = false;
    		this.$http.get(getSubjectUrl + '?typesList=' + typesList + '&access_token='+ this.$cookie.get('user_token') + '&t=' + new Date().getTime())
        .then(function(response) {
          var data = response.data;
          self.listsData = data.elements;
          if (data.elements.length) {
            self.applySubjectId = data.elements[0].apply_id;
            self.$emit('selectApplySubjectId', {orderApplySubjectId: data.elements[0].apply_id});
          }
        })
        .catch(function(error) {
          console.log(error)
          if (!error.response) {
            self.$emit('nologin');
            self.nologin = true;
            return;
          }
          var data = error.response.data;
          if(data.status == '401'){//未登录
            //self.$emit('nologin');
            //location.href = CONFIG.userUrl + '/iprp/#/access/login?return_url='+ encodeURIComponent(location.href);
            self.$emit('nologin');
            self.nologin = true;
          }
        });
    	},
      addSuccess(){
        this.visible = false;
        this.initListsData();
      },
      selectApplySubject(applyTypeId){
        this.applySubjectId = applyTypeId;
        this.$emit('selectApplySubjectId', {orderApplySubjectId: applyTypeId});
      },
    	showPopup(item){
    		var self = this;
        if (item.apply_type) {
          this.popupData = item;
          this.parApplyType = item.apply_type;
        }else{
          if (self.nologin) {
            self.$emit('nologin');
            return;
          }
          this.popupData = {}
        }
        this.visible = true;
    	}
    },
    watch:{
      needRender(){
        if (this.needRender) {
          this.nologin = false;
          this.initListsData();
        }
      },
      visible(){
        var v = $('.v-modal');
        if (this.visible) {
          if (v.length) {
            v.show()
          }else{
            $('body').append('<div class="v-modal" style="z-index: 1999;"></div>');
          }
        }else{
          v.hide();
        }
        /*this.initData();
        if (this.visible) {
          this.initProvince();
          this.initCountry();
        }*/
      }
    },
    filters:{
      applyTypeFilter(input){
        var ret = ''
        switch (input+''){
          case '1':
            ret = "大陆个体";
            break;
          case '2':
            ret = "大陆企业";
            break;
          case '3':
            ret = "境外个体";
            break;
          case '4':
            ret = "境外企业";
            break;
        }
        return ret;
      }
    }
  }
</script>


<style lang="scss">
.applySubject{
  h3{font-size:16px;height: 40px;line-height: 40px;}
  .mainOwern-wrap{
    .tips{padding:10px 20px;line-height: 24px;min-height: 44px;background-color: #fff6e2;}
    .mainOwern{
      padding:15px 0 0;
      li{
        position: relative;cursor: pointer;float: left;width:230px;height: 80px;border: 1px solid #e6e6e6;margin:0 16px 15px;padding: 10px;
        p{}
        p.name{
          line-height: 16px;color: #333;max-height: 32px;overflow: hidden;
        }
        p.type{
          position: absolute;bottom: 10px;left: 10px;color: #999;
        }
        i.edit{display: none;position: absolute;bottom: 10px;right: 10px;font-style: normal;color: #3db1fa;cursor: pointer;}
        .main-add{
          position: relative;height: 22px;color: #3db1fa;vertical-align: middle;top: 15px;text-align: center;
          i{display: inline-block;width: 16px;height: 24px;line-height: 20px;text-align: center;font-style: normal;vertical-align: middle;font-size: 24px;}
          span{display: inline-block;height: 22px;line-height: 22px;padding-left: 3px;vertical-align: middle;}
        }
      }
      li:hover{
        border-color: #3db1fa;
        i.edit{display: block;}
      }
      li.active{border-color: #3db1fa;background-color: #3db1fa;
        p.name,p.type,i.edit{color: #fff;}
      }
    }
  }
}
</style>
