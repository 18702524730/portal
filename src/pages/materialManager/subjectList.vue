<template>
	<section><!--style="position:relative;"-->
		<div class="consigneeAddr">
			<h4 class="navTitle">主体信息</h4>
			<sebe-apply-subject class="my-apply-subject" :formData="curSubjectData" :typeList="'2,1,4,3,5'" :parApplyType="curSubjectData.apply_type || 2" @addSuccess="addSuccess"></sebe-apply-subject>
  		<div class="addrList" v-loading="loading" style="min-height: 300px">
  			<div class="addr_header">
    			<span class="td-1">申请主体</span>
    			<span class="td-2">类型</span>
    			<span class="td-3">操作</span>
  			</div>
        <div class="addr_body">
      		<div class="tr" v-for="(item, index) in consignee" :key="item.apply_id">
        		<div class="td-1 real_certification">
              <div>{{item.apply_name}}</div>
              <span v-if="item.is_checked" :class="{label_base: true, label_success: item.is_checked == 1, label_warning: item.is_checked == 2, label_fail: item.is_checked == 3}">{{item.is_checked == 1 ? '已实名认证' : (item.is_checked == 2 || item.is_checked == 3) ? '实名认证中' : item.is_checked == 4 ? '认证失败' : ''}}</span>
              <!-- <p v-if="item.is_checked==1">已实名认证</p>
              <p v-else-if="item.is_checked==2 || item.is_checked==3" class="checking">实名认证中</p>
              <p v-else-if="item.is_checked==4" class="fail">认证失败</p> -->
            </div>
        		<div class="td-2">{{item.apply_type | applySbjFormat}}</div>
     	 			<div class="td-3">
              <a href="#" @click.prevent="modify(item)">修改</a>
              <el-popover placement="bottom" width="160" trigger="click" class="sebe-popover">
                <p class="lc">确认删除该主体吗？</p>
                <div class="lc mt10">
                  <el-button size="mini" type="primary" @click="remove(item)">是</el-button><el-button size="mini" type="primary" @click="hidePop">否</el-button>
                </div>
                <a v-if="!item.is_checked" href="javascript:;" slot="reference">删除</a>
              </el-popover>
            </div>
            <div class="td-4" v-if="item.is_default==1"><span class="default">默认主体</span></div>
            <div class="td-4" v-if="item.is_default==0">
              <a href="#" @click.prevent="setDefaultAddr(item)">设为默认主体</a>
            </div>
      		</div>
        </div>
        <div class="orderBody" v-if="!consignee.length && !loading">
          <p class="error">没有主体信息，赶紧去添加吧！</p>
        </div>
    		<div class="tip">
  				申请主体最多保存10条,已保存<span>{{totalElements}}</span>条
  			</div>
  		</div>
		</div>
	</section>
</template>

<script>
  import Vue from 'vue'
  import SebeApplySubject from 'components/applySubject/SebeApplySubject.vue'
  import qs from 'qs'
  import filters from '../../api/filters'
	export default {
		data(){
			return{
        loading:false,
				consignee:[],//主体列表
				totalElements:'',
        addBtnVisible:true,
        curSubjectData: {},
			}
	  },
    components: {
      SebeApplySubject
    },
  	methods:{
  		addSuccess() {
  			this.curSubjectData = {};
  			this.getConsigneeData();
  		},
  		getConsigneeData(){
      	var self = this;
        self.loading = true;
      	this.$http.get('./api/subject?t='+new Date().getTime()).then(function(resp){
      		resp = resp.data;
      		//console.log(resp);
      		if(resp.elements){
            self.loading = false;
        		self.consignee = resp.elements;
        		self.totalElements = resp.total_elements;
        		//console.log(self.consignee);
            if(self.totalElements === 10){
              self.addBtnVisible = false;
            }else{
              self.addBtnVisible = true;
            }
      		}else {
        		console.error(resp.msg);
      		}
      	})
      	.catch((error) => {
          self.loading = false;
          self.consignee = [];
        	console.error(error);
      	});
    	},
    	setScrollTop(scroll_top) {
        document.documentElement.scrollTop = scroll_top;
        document.body.scrollTop = scroll_top;
    	},
    	//修改
    	modify(item){
        this.curSubjectData = Object.assign({}, item);
        this.setScrollTop(0);
    	},
      //设为默认地址
      setDefaultAddr(item){
        var self = this;
        var setDefault = function(id){
          var data = self.consignee;
          for (var i = data.length - 1; i >= 0; i--) {
            var it = data[i];
            if (it.apply_id !== id) {
              it.is_default = 0;
            }else{
              it.is_default = 1;
            }
          }
        }
        self.hidePop();
        this.$http.put('./api/subject/' + item.apply_id).then(function(resp){
          if(resp.status === 204){
            setDefault(item.apply_id);
            self.$message.success('设置成功！')
          }
        })
        .catch((error) => {
          console.error(error);
        });
      },
      //删除地址
      remove(item){
        //console.log(item);
        var self = this;
        self.$http.delete('./api/subject/' + item.apply_id).then(function(resp){
          if(resp.status === 204){
            self.getConsigneeData();
            self.hidePop();
          }
        })
        .catch((error) => {
          console.error(error);
        });
      },
      //隐藏浮框
      hidePop(){
        document.getElementById('app').click();
      }
  	},
    filters: {
      applySbjFormat : filters.formatApplySbj.format
    },
  	mounted(){
  		this.getConsigneeData();
  	}
  }
</script>

<style lang="scss">
  .consigneeAddr{
  	font-size:13px;padding-top: 20px;
  	.navTitle{padding-left: 20px;}
  	.addrList{
      padding:15px 20px 40px; min-height: 600px;
  		.addr_header{
				height: 40px;line-height: 40px;background-color: #F5F5F5;border: 1px solid #EEEEEE;
				>span{float: left;display: inline-block;text-align: left;}
				.td-1{width: 45%;height: 100%;vertical-align: middle;display: table-cell;padding-left:20px;}
				.td-2{width: 25%;height: 100%;vertical-align: middle;display: table-cell;padding-left:15px;}
				.td-3{width: 12%;height: 100%;vertical-align: middle;display: table-cell;text-align: center;}
			}
			.addr_body{
				border-right: 1px solid #EEEEEE;border-left: 1px solid #EEEEEE;
				.tr{
					width: 100%;border-bottom: 1px solid #EEEEEE;height: 50px;line-height: 50px;
		      >div{float:left;}
					.td-1{
						width: 45%;height: 100%;vertical-align: middle;display:inline-block;padding-left:20px;overflow:hidden;
						>div{float:left;display:inline-block;height: 50px;line-height: 50px;max-width:270px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}
						>span{float:left;margin-left: 10px;margin-top: 13px;}
					}
					.td-2{width: 25%;height: 100%;vertical-align: middle;display:inline-block;padding-left:15px;overflow:hidden;}
					.td-3{width: 12%;height: 100%;vertical-align: middle;display:inline-block;overflow:hidden;color:#63bdfb;cursor:pointer;text-align: center;}
		      .td-3 a{
		      	margin: 0 6px;
		      	&:hover{text-decoration: none;}
		      }
		      .td-4{width: 15%;height: 100%;vertical-align: middle;display:inline-block;padding-left:20px;overflow:hidden;}
		      .td-4 a{text-align: center;height: 24px;display: none;color: #3db1fa;}
		      .td-4 span.default{display:block;height: 30px;margin-top: 10px;line-height: 30px;border-radius: 3px;text-align: center;cursor: default;color: #999999;}
		      &:hover{
		      	background-color: #F5F5F5;
		      	.td-4 a{
		      		display: block;
		      		&:hover{text-decoration: none;}
		      	}
		      }
		    }
	    }
	    .orderBody .error{font-size: 13px;color: #999;padding-left: 20px;line-height: 50px;border-bottom: 1px solid #EEEEEE;border-left: 1px solid #EEEEEE;border-right: 1px solid #EEEEEE;}
	    .tip{color:#999;padding:10px 0;}
  	}
  }
</style>
