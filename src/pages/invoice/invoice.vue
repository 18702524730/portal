<template>
  <div class="incoiceList">
    <h4 class="navTitle">开票信息</h4>
    <invoiceEdit :itemData="curItemData" @addSuccess="addSuccess"></invoiceEdit>
    <div class="incoiceContent" v-loading="loading" style="min-height: 300px">
      <div class="orderTitle">
        <span class="td_1">发票抬头</span>
        <span class="td_2">开票类型</span>
        <span class="td_3">操作</span>
        <span class="td_4"></span>
      </div>
      <div class="orderBody">
        <template v-for="item in incoiceData">
          <ul>
            <li class="td_1"><p :title="item.area_info + item.address">{{item.invoice_title}}</p></li>
            <li class="td_2"><p :title="item.true_name">{{item.invoice_type|invoiceTypeFilter}}</p></li>
            <li class="td_3">
              <a href="#" @click.prevent="modify(item)">修改</a>
              <el-popover placement="bottom" width="160" trigger="click" class="sebe-popover">
              	<p class="lc">确认删除该发票吗？</p>
                <div class="lc mt10">
                  <el-button size="mini" type="primary" @click="ordermove(item)">是</el-button><el-button size="mini" type="primary" @click="hidePop">否</el-button>
                </div>
                <a href="javascript:;" slot="reference">删除</a>
              </el-popover>
            </li>
            <li class="td_4">
              <span class="default" v-if="item.is_default==1">默认开票信息</span>
              <a href="javascript:;" @click.prevent="orderdefault(item)">设为默认开票信息</a>
            </li>
          </ul>
        </template>
      </div>
      <div class="orderBody" v-if="!incoiceData.length && !loading">
        <p class="error">没有开票信息，赶紧去添加吧！</p>
      </div>
      <div class="orderAdd" v-if="!loading">
        <p>开票信息最多保存10条，已保存<span>{{incoiceData.length}}</span>条</p>
      </div>
    </div>
  </div>
</template>
<script>
  Vue.filter('invoiceTypeFilter',function(value){
    if (value == 1) {
      return '增值税普通发票'
    }else{
      return '增值税专用发票'
    }
  })
  import Vue from 'vue'
  import invoiceEdit from './invoiceEdit.vue'
  const listUrl = './api/invoice'

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
        incoiceData:[
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
        curItemData: {}
      }
    },
    components: {
      invoiceEdit
    },
    mounted () {
      this.getList();
    },
    methods: {
    	addSuccess() {
  			this.getList();
  		},
  		setScrollTop(scroll_top) {
        document.documentElement.scrollTop = scroll_top;
        document.body.scrollTop = scroll_top;
    	},
    	//修改
    	modify(item){
        this.curItemData = Object.assign({}, item);
        this.setScrollTop(0);
    	},
      // 查询预订单数据
      getList(){
        var self = this;
        self.loading = true;
        this.$http.get(listUrl + '?t='+new Date().getTime())
        .then((resp) => {
          console.log(resp)
          var data = resp.data;
          self.loading = false;
          //if (data.total_elements>0) {
            self.incoiceData = data.elements;
          /*}else{
            self.showEmpty = true;
          }*/
        })
        .catch((err) => {
          console.log('err')
          self.loading = false;
          self.showEmpty = true;
          self.incoiceData = [];
        });
      },
      ordermove(item){
        var self = this;
        this.$http.delete(listUrl +'/'+item.member_invoiceId)
        .then((response) => {
          var data = response.data;
          self.getList();
          // 删除正在修改的条目时，重置
          if (self.curItemData.member_invoiceId == item.member_invoiceId) {
          	self.curItemData = {};
          }
          self.hidePop();
        })
        .catch((err) => {
        });
      },
      //设为默认地址
      orderdefault(item){
        var self = this;
        self.hidePop();
        self.$http.put(listUrl +'/'+item.member_invoiceId)
        .then((response) => {
          for(var i=0;i<self.incoiceData.length;i++){
            self.incoiceData[i].is_default=0;
          }
          item.is_default=1;
          self.$message.success('设置成功！')
        })
        .catch((err) => {
        });
      },
      //隐藏浮框
      hidePop(){
        document.getElementById('app').click();
      }
    }
  }
</script>

<style lang="scss">
  .incoiceList{
    font-size: 13px;background: #fff;position: relative;padding: 20px 0 40px;
    .navTitle{padding-left: 20px;}
    .incoiceContent{
    	padding: 0 20px;
	    .orderTitle{
	    	height: 40px;line-height: 40px;background-color: #F5F5F5;border: 1px solid #EEEEEE;color: #333333;margin-top:30px;
	    	span{float: left;display: inline-block;color: #333}
	    	.td_1{width: 40%;height: 100%;vertical-align: middle;display: table-cell;padding-left: 20px;}
	    	.td_2{width: 25%;height: 100%;vertical-align: middle;display: table-cell;padding-left: 30px;}
		    .td_3{width: 20%;height: 100%;vertical-align: middle;display: table-cell;padding-left: 20px;text-align:center;}
		    .td_4{width: 15%;height: 100%;vertical-align: middle;display: table-cell;text-align: center;}
	    }
	    .orderBody{
	    	border-right: 1px solid #EEEEEE;border-left: 1px solid #EEEEEE;
		    ul{
		    	overflow: hidden;height: 50px;
		    	li{
		    		float: left;border-bottom: 1px solid #EEEEEE;line-height: 50px;
		    	}
			    .td_1{
			      width: 40%;height: 100%;vertical-align: middle;display: table-cell;padding-left: 20px;
			      p{text-align: left;width: 100%;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}
			    }
			    .td_2{
			      width: 25%;height: 100%;vertical-align: middle;display: table-cell;padding-left: 30px;
			      p{text-align: left;width: 95px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}
			    }
			    .td_3{
			    	width: 20%;height: 100%;vertical-align: middle;display: table-cell;padding-left: 20px;text-align:center;
				    a{
				    	cursor: pointer;text-decoration: none;margin: 0 6px;
			      	&:hover{text-decoration: none;}
			      }
		      }
			    .td_4{
			    	width: 15%;height: 100%;vertical-align: middle;display: table-cell;text-align: center;
			    	span.default{display:block;height: 30px;margin-top: 10px;line-height: 30px;border-radius: 3px;text-align: center;cursor: default;color: #999999;}
			    	a{text-align: center;height: 24px;display: none;color: #3db1fa;}
			    }
			    &:hover{
		      	background-color: #F5F5F5;
		      	.td_4 a{
		      		display: block;
		      		&:hover{text-decoration: none;}
		      	}
		      }
		    }
		    .error{font-size: 13px;color: #999;padding-left: 20px;line-height: 50px;border-bottom: 1px solid #EEEEEE;}
	    }
	    .orderAdd p{color:#999;padding-top: 10px}
		}
  }

  .lc{
    .el-button{width:44px;height:24px;padding:0;}
  }
</style>
