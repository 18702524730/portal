<template>
  <div class="addressList">
    <h4 class="navTitle">收件地址</h4>
    <addressDetail :itemData="curAddressData" @addSuccess="addSuccess"></addressDetail>
    <div class="addressContent" v-loading="loading" style="min-height: 300px">
      <div class="orderTitle">
        <span class="td_1">收件人</span>
        <span class="td_2">地址</span>
        <span class="td_3">联系电话</span>
        <span class="td_4">操作</span>
      </div>
      <div class="orderBody">
        <template v-for="item in addressData">
          <ul>
            <li class="td_1"><p :title="item.true_name">{{item.true_name}}</p></li>
            <li class="td_2"><p :title="item.area_info + item.address">{{item.area_info + item.address}}</p></li>
            <li class="td_3"><p>{{item.tel_phone | numToStar}}</p></li>
            <li class="td_4">
              <a href="#" @click.prevent="modify(item)">修改</a>
              <el-popover placement="bottom" width="160" trigger="click" class="sebe-popover">
              	<p class="lc">确认删除该地址吗？</p>
                <div class="lc mt10">
                  <el-button size="mini" type="primary" @click="ordermove(item)">是</el-button><el-button size="mini" type="primary" @click="hidePop">否</el-button>
                </div>
                <a href="javascript:;" slot="reference">删除</a>
              </el-popover>
            </li>
            <li class="td_5">
              <span class="default" v-if="item.is_default==1">默认地址</span>
              <a href="javascript:;" @click.prevent="orderdefault(item)">设为默认地址</a>
            </li>
          </ul>
        </template>
      </div>
      <div class="orderBody" v-if="showEmpty && !loading">
        <p class="error">没有地址信息，赶紧去添加吧！</p>
      </div>
      <div class="orderAdd">
        <p>收件地址最多保存10条，已保存<span>{{addressData.length}}</span>条</p>
      </div>
    </div>
  </div>
</template>
<script>
  Vue.filter('phoneFilter',function(value){
  	if (!value) {return ''}
  	var len = value.length, phoneS, phoneE, phone;
  	if (len == 11) {
	    phoneS = value.slice(0,3);
	    phoneE = value.slice(-4);
	    phone = phoneS +"****"+phoneE;
    }else{
    	phoneE = value.slice(-4);
    	phone = value.replace(phoneE, '****');
    }
    return phone;
  })
  import Vue from 'vue'
  import addressDetail from './addressDetail.vue'
  import Filters from 'api/filters.js'

  export default {
    data () {
      //手机号码验证
      let checkPhone = (rule, value, callback) => {
        let reg = /^1\d{10}$/;
        if (!value) {
          return callback(new Error('请填写收件人手机号'));
        }
        setTimeout(() => {
          if (!reg.test(value)) {
            callback(new Error('手机号格式错误'));
          } else {
            callback();
          }
        }, 1000);
      }
      return{
        loading: false,
        showEmpty:false,
        editForm:'',
        default:false,
        addForm: {
          phone:''
        },
        addFormRules:{
          address:[
            { required: true, message: '请填写收件人地址', trigger: 'blur' }
          ],
          name:[
            { required: true, message: '请填写收件人姓名', trigger: 'blur' }
          ],
          phone: [
            { validator:checkPhone, required: true,trigger: 'blur' }
          ]
        },
        addressData:[
          /*{
            "address_id" : "",
            "true_name" : "",
            "member_id" : "",
            "province_id" : "",
            "area_id" : "",
            "city_id" : "",
            "area_info" : "",
            "address" : "",
            "zip_code" : null,
            "tel_phone" : "",
            "mob_phone" : "",
            "is_default" : "",
            "create_time" : "",
            "update_time" : ""
          }*/
        ],
        curAddressData: {}
      }
    },
    components: {
      addressDetail
    },
    mounted () {
      this.getCartList();
    },
    methods: {
    	addSuccess() {
  			this.getCartList();
  		},
    	setScrollTop(scroll_top) {
        document.documentElement.scrollTop = scroll_top;
        document.body.scrollTop = scroll_top;
    	},
    	//修改
    	modify(item){
        this.curAddressData = Object.assign({}, item);
        this.setScrollTop(0);
    	},
      // 查询预订单数据
      getCartList(){
        var self = this;
        self.loading = true;
        this.$http.get('./api/address?t='+new Date().getTime()).then(function(response) {
          var data = response.data;
          var addressdata = data
          self.loading = false;
          if (addressdata.total_elements>0) {
            self.addressData = data.elements;
          }else{
            self.addressData = [];
            self.showEmpty = true;
          }
        }, function(response) {
          self.loading = false;
          self.showEmpty = true;
          self.addressData = [];
          console.log(response)
        });
      },
      ordermove(item){
        var self = this;
        this.$http.delete('./api/address/'+item.address_id).then(function(response) {
          self.getCartList();
          // 删除正在修改的条目时，重置
          if (self.curAddressData.address_id == item.address_id) {
          	self.curAddressData = {};
          }
          self.hidePop();
        }, function(response) {
          console.log(response)
        });
      },
      //设为默认地址
      orderdefault(item){
        var self = this;
        self.hidePop();
        self.$http.put('./api/address/'+item.address_id).then(function(response) {
          for(var i=0;i<self.addressData.length;i++){
            self.addressData[i].is_default=0;
          }
          item.is_default=1;
          self.$message.success('设置成功！')
        }, function(response) {
          console.log(response)
        });
      },
      //隐藏浮框
      hidePop(){
        document.getElementById('app').click();
      }
    },
    filters: {
			numToStar: Filters.numToStar,
		}
  }
</script>
<style lang="scss">
  .addressList{
    font-size: 13px;padding-top: 20px;background: #fff;position: relative;padding-bottom: 40px;
    .navTitle{padding-left: 20px;}
    .addressContent{
    	padding: 0 20px;
	    .orderTitle{
	    	width: 100%;height: 40px;line-height: 40px;background-color: #F5F5F5;border: 1px solid #EEEEEE;color: #333333;margin-top:30px;
	    	span{float: left;display: inline-block;color: #333}
	    	.td_1{
		      width: 14%;height: 100%;vertical-align: middle;display: table-cell;padding-left: 20px;
		    }
		    .td_2{
		      width: 40%;height: 100%;vertical-align: middle;display: table-cell;padding-left: 20px;
		    }
		    .td_3{width: 17%;height: 100%;vertical-align: middle;display: table-cell;padding-left: 20px}
		    .td_4{width: 10%;height: 100%;vertical-align: middle;display: table-cell;text-align: center;}
	    }
	    .orderBody{
	    	border-right: 1px solid #EEEEEE;border-left: 1px solid #EEEEEE;
	    	ul{
	    		overflow: hidden;height: 50px;
	    		li{
	    			float: left;border-bottom: 1px solid #EEEEEE;line-height: 50px;
	    		}
	    		.td_1{
			      width: 14%;height: 100%;vertical-align: middle;display: table-cell;padding-left: 20px;
			      p{text-align: left;width: 95px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}
			    }
			    .td_2{
			      width: 40%;height: 100%;vertical-align: middle;display: table-cell;padding-left: 20px;
			      p{text-align: left;width: 100%;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}
			    }
			    .td_3{width: 17%;height: 100%;vertical-align: middle;display: table-cell;padding-left: 20px}
			    .td_4{width: 10%;height: 100%;vertical-align: middle;display: table-cell;text-align: center;}
			    .td_4 a{
			    	cursor: pointer;text-decoration: none;margin: 0 6px;
		      	&:hover{text-decoration: none;}
		      }
			    .td_4 span{color: #3db1fa;cursor: pointer;}
			    .td_5{
			    	width: 19%;height: 100%;vertical-align: middle;display: table-cell;text-align: center;
			    	span.default{display:block;height: 30px;margin-top: 10px;line-height: 30px;border-radius: 3px;text-align: center;cursor: default;color: #999999;}
			    	a{text-align: center;height: 24px;display: none;color: #3db1fa;}
			    }
					&:hover{
		      	background-color: #F5F5F5;
		      	.td_5 a{
		      		display: block;
		      		&:hover{text-decoration: none;}
		      	}
		      }
	    	}
	    	.error{font-size: 13px;color: #999;padding-left: 20px;line-height: 50px;border-bottom: 1px solid #EEEEEE;}
	    }

	    .orderAdd p{color:#999;padding:10px 0;}
    }
  }

</style>
