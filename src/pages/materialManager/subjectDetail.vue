<template>
	<section class="subjectDetail">
		<div class="subjectDetailTil">
      <h4>资料管理</h4>
      <div class="nav"><a href="#subjectList">主体列表</a> > {{isAdd? '增加':'修改'}}主体</div>
    </div>
    <sebe-apply-subject class="my-apply-subject" :formData="curSubjectData" :typeList="'2,1,4,3,5'" :parApplyType="curSubjectData.apply_type || 2" @addSuccess="addSuccess"></sebe-apply-subject>
	</section>
</template>

<script>
  import Vue from 'vue'
  import $ from 'jquery'
  import Util from 'src/common/js/util.js'
  import Filters from 'api/filters.js'
  import qs from 'qs'
  import SebeApplySubject from 'components/applySubject/SebeApplySubject.vue'
  const rootUrl = CONFIG.rootUrl;
	export default {
    //typeList：需要显示的类型，比如只显示大陆个体和企业，传入'1,2'
    props:['isAdd'],
		data(){
		  return{
        sId: '', //主体id
        curSubjectData:{}
			}
    },
    components: {
      SebeApplySubject
    },
  	methods:{
      addSuccess(){
        var order_sn = this.$route.query.order_sn;
        if (order_sn) {
          this.$router.push({ path: '/orders/'+ order_sn});
        }else{
          this.$router.push({ path: '/subjectList'});
        }
      },
      getDetail(){
        var self = this;
        if (self.sId == '0') {
          self.curSubjectData = {};
          self.$emit('updateIsAdd', true);
          return;
        }
        self.$emit('updateIsAdd', false);
        self.$http.get('./api/subject/'+this.sId+'?t='+new Date().getTime())
        .then(function(resp){
          var data = resp.data;
          if(data){
            self.curSubjectData = data;
          }
        })
        .catch((error) => {
          console.error(error);
        });
      }
  	},
  	mounted(){
      this.sId = this.$route.params.applyId;
      this.getDetail();
  	}
  }
</script>

<style scoped lang="scss">
.subjectDetail{
  font-size:14px;
  padding: 15px 0 20px;
  .subjectDetailTil{
    border-bottom:1px solid #e6e6e6;
    h4{height: 26px;line-height: 26px;font-weight: normal;font-size: 16px;padding-left: 20px;}
    .nav{
      margin-top:8px;margin-bottom: 12px;padding-left: 20px;
      a{color: #3db1fa;}
    }
  }
  .my-apply-subject{
    margin-top:25px;
  }
}
</style>
