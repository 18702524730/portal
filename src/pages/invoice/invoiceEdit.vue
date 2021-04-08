<template>
  <div class="incoiceEdit">
    <div class="radio">
      <el-form label-position="left">
        <el-form-item label="请选择开票类型" label-width="140px">
          <el-radio-group v-model="applyType" style="line-height:28px;">
            <el-radio :label="item.id" :key="item.id" v-for="item in invoiceListData">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="orderAddincoice" v-show="applyType==2">
      <el-form label-position="left" :model="postData" :rules="rules" ref="ruleForm" auto-complete="off" label-width="140px">
        <el-form-item class="addincoice" label="发票抬头" prop="invoice_title">
          <el-input v-model="postData.invoice_title" :maxlength="60" placeholder="请填写发票抬头" ></el-input>
        </el-form-item>
        <el-form-item class="addincoice" label="纳税人识别号" prop="invoice_code">
          <el-input v-model="postData.invoice_code" :maxlength="20" placeholder="请填写纳税人识别号"></el-input>
        </el-form-item>
        <el-form-item class="addincoice" label="注册电话" prop="regist_phone">
          <el-input v-model="postData.regist_phone" :maxlength="13" placeholder="请填写注册电话号码，固话区号后请加-"></el-input>
        </el-form-item>
        <el-form-item label="注册地址" class="form-group" required  style="width:100%">
          <el-form-item class="incoice_option form-ipt-sm" prop="province_id" style="display:inline-block;width:140px;margin-right: 6px;">
            <el-select v-model="postData.province_id" placeholder="请选择省" @change="changeProvince('postData', postData.province_id)">
              <el-option
                v-for="item in provinceData"
                :label="item.name"
                :value="item.area_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="incoice_option form-ipt-sm" prop="city_id" style="display:inline-block;width:140px;margin-right: 5px;">
            <el-select v-model="postData.city_id" placeholder="请选择市" @change="changeCity('postData', postData.city_id)">
              <el-option
                v-for="item in cityData"
                :label="item.name"
                :value="item.area_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="incoice_option form-ipt-sm" prop="area_id" style="display:inline-block;width:140px;">
            <el-select v-model="postData.area_id" placeholder="请选择区">
              <el-option
                v-for="item in areaData"
                :label="item.name"
                :value="item.area_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item class="addincoice" label="详细地址" prop="address">
          <el-input v-model="postData.address" :maxlength="80" placeholder="请填写企业注册地址，与企业登记证件保持一致"></el-input>
        </el-form-item>

        <el-form-item class="addincoice" label="开户行名称" prop="account_bank">
          <el-input v-model="postData.account_bank" :maxlength="30" placeholder="请填写对公账户的开户行名称"></el-input>
        </el-form-item>

        <el-form-item class="addincoice" label="银行账号" prop="account_number">
          <el-input v-model="postData.account_number" :maxlength="19" placeholder="请填写对公账户的银行账号"></el-input>
        </el-form-item>
        <div class="bot">
          <p>仅限一般纳税人企业填写，小规模纳税人请选择增值税普通发票</p>
        </div>
        <el-form-item class="addincoice" label=" ">
          <el-checkbox v-model="isDefault">设为默认</el-checkbox>
        </el-form-item>
        <el-form-item class="addincoice" label=" ">
          <el-button type="primary" @click="validateBeforeSubmit('ruleForm')" :disabled="submitDisabled">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="orderAddincoice" v-show="applyType==1">
      <el-form label-position="left" :model="postData" :rules="ordrules" ref="ordruleForm" auto-complete="off" label-width="140px">

        <el-form-item class="addincoice" label="发票抬头" prop="invoice_title">
          <el-input v-model="postData.invoice_title" :maxlength="60" placeholder="请填写发票抬头" ></el-input>
        </el-form-item>

        <el-form-item class="addincoice" label="纳税人识别号" prop="invoice_code">
          <el-input v-model="postData.invoice_code" :maxlength="20" placeholder="请填写纳税人识别号" ></el-input>
        </el-form-item>
        <div class="taxbot">
          <p>大陆企业必填，其他开票申请人无需填写</p>
        </div>
        <el-form-item class="addincoice" label=" ">
          <el-checkbox v-model="isDefault">设为默认</el-checkbox>
        </el-form-item>
        <el-form-item class="addincoice" label=" ">
          <el-button type="primary" @click="ordaddSbj('ordruleForm')" :disabled="submitDisabled">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
	</div>
</template>
<script>
  import Vue from 'vue'
  import qs from 'qs'

  const addressUrl = './api/areas';
  const DefaultPostData = {
    member_invoiceId:'',
    is_default:0,
    invoice_type:'',
    invoice_title:'',
    invoice_code:'',
    regist_phone:'',
    province_id:'',
    city_id:'',
    area_id:'',
    area_info:'',
    address:'',
    account_bank:'',
    account_number:''
  }
  export default {
    validator: null,
    props: {
    	itemData: Object,
    },
    data () {
      //纳税人识别号
      let invoiceCodeCheck0 = (rule, value, callback) => {
        let reg = /(^[a-zA-Z0-9]{15}$)|(^[a-zA-Z0-9]{18}$)|(^[a-zA-Z0-9]{20}$)/;
        if (value) {
          if (!reg.test(value)) {
            callback(new Error('纳税人识别号格式错误'));
          } else {
            callback();
          }
        }else{
          callback();
        }
      };
      //纳税人识别号
      let invoiceCodeCheck = (rule, value, callback) => {
        let reg = /(^[a-zA-Z0-9]{15}$)|(^[a-zA-Z0-9]{18}$)|(^[a-zA-Z0-9]{20}$)/;
        if (!value) {
            return callback(new Error('请填写纳税人识别号'));
        }
        setTimeout(() => {
            if (!reg.test(value)) {
              callback(new Error('纳税人识别号格式错误'));
            } else {
              callback();
            }
        }, 50);
      };
      //联系电话验证
      let checkPhone = (rule, value, callback) => {
        let reg = /(^1\d{10}$)|(^\d{3,4}-\d{7,8}$)|(^\d{7,8}$)/;
        if (!value) {
            return callback(new Error('请填写企业联系电话'));
        }
        setTimeout(() => {
            if (!reg.test(value)) {
              callback(new Error('请填写正确的联系电话'));
            } else {
              callback();
            }
        }, 50);
      };
      //统一邮编验证
      let checkZipCode = (rule, value, callback) =>{
        let zipCodeReg = /^[a-zA-Z0-9\-]{1,10}$/;
        if (!value) {
            return callback(new Error('邮编不能为空'));
        }
        if (value.length > 10) {
            return callback(new Error('邮编不能超过10个字符'));
        }
        setTimeout(() => {
            if (!zipCodeReg.test(value)) {
              callback(new Error('邮编格式错误'));
            } else {
              callback();
            }
        }, 50);
      };
      return{
        invoiceListData:[
          {
            name: '增值税普通发票',
            id: 1,
            isShow: false
          },
          {
            name: '增值税专用发票',
            id: 2,
            isShow: false
          }
        ],
        member_invoiceId: 0,
        isDefault: false,
        applyType:1,
        catename:'新增',
        // 防止按钮多次点击
        submitDisabled: false,
        formData:{},
        cityName:{},
        idEdit: false,
        postData: {...DefaultPostData},
        provinceData:[],
        cityData:[],
        areaData:[],
        // 表单验证规则
        ordrules:{
          invoice_title:[
            { type: "string",required: true, message: '请填写发票抬头', trigger: 'blur' }
          ],
          invoice_code:[
            { validator:invoiceCodeCheck0, trigger: 'blur' }
          ]
        },
        rules: {
          invoice_title:[
            { type: "string",required: true, message: '请填写发票抬头', trigger: 'blur' }
          ],
          invoice_code:[
            { required: true, validator:invoiceCodeCheck, trigger: 'blur' }
          ],
          regist_phone: [
            { type: "string",validator:checkPhone, required: true,trigger: 'blur' }
          ],
          account_number:[
            { required: true, message: '请填写银行账号', trigger: 'blur' },
            { pattern: /^[1-9]{1}\d{8,19}$/, message: '请输入正确的银行账号', trigger: 'blur' }
          ],
          account_bank:[
            { required: true, message: '请填写开户行名称', trigger: 'blur' },
          ],
          province_id: [
            {type: 'integer', required: true, message: '请选择省份', trigger: 'change' }
          ],
          city_id: [
            {type: 'integer', required: true, message: '请选择城市', trigger: 'change' }
          ],
          area_id: [
            {type: 'integer', required: true, message: '请选择区', trigger: 'change' }
          ],
          address: [
            { required: true, message: '请填写企业注册地址，与企业登记证件保持一致', trigger: 'blur' },
          ]
        }
      }
    },
    mounted(){
    	this.member_invoiceId = this.postData.member_invoiceId || 0;
      this.initProvince();
    },
    methods:{
      // 初始化省份
			initProvince(){
				var self = this;
				this.$http.get(addressUrl+'?pId=0')
				.then(function(resp){
					resp = resp.data;
					if(resp.elements){
						self.provinceData = resp.elements;
					}else {
						console.error(resp.msg);
					}
				})
				.catch((error) => {
					console.error(error);
				});
			},
			// 省份切换渲染城市 城市切换渲染区
			_triggerChange (code, dataName, callback){
				var self = this;
				self[dataName] = [];
				if(!code){
					return;
				}
				this.$http.get(addressUrl+'?pId='+ code)
				.then(function(resp){
					resp = resp.data;
					if(resp.elements){
						self[dataName] = resp.elements;
						callback && callback();
					}else {
						console.error(resp.msg);
					}
				})
				.catch((error) => {
					console.log(error);
				});
			},
			//更改省
			changeProvince(formName, provinceCode, prevfix){
				this[formName].area_id = '';
				this[formName].city_id = '';
				this._triggerChange(provinceCode,  (prevfix ? prevfix : '') + 'cityData');
			},
			//更改市
			changeCity(formName, cityCode, prevfix){
				this[formName].area_id = '';
				this._triggerChange(cityCode, (prevfix ? prevfix : '') + 'areaData');
			},
			//获取选中的省市区对应的中文名称
			getSelectName (code, dataName){
				var data = this[dataName];
				var ret = '';
				data.forEach((item, i) => {
					if (item.area_id == code) {
						ret = item.name;
						return false;
					}
				});
				return ret;
			},
			//地址拼接area_info
			getAreaInfo(data, prevfix){
				var apply_type = this.apply_type;
				var area_id = data.area_id;
				var province_id = data.province_id;
				var city_id = data.city_id;
				return [this.getSelectName(province_id, 'provinceData'), this.getSelectName(city_id, (prevfix ? prevfix : '') + 'cityData'), this.getSelectName(area_id, (prevfix ? prevfix : '') + 'areaData')].join(' ');
			},
      // 提交前验证
      validateBeforeSubmit(formName){
        var self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            self.addSbj(formName);
          } else {
            //self.$message.error('标红的为必填项，请检查并正确填写。');
            return false;
          }
        });
      },
      ordaddSbj(formName){
      	this.member_invoiceId = this.postData.member_invoiceId || 0;
        var self = this;
        if (self.submitDisabled) {
          return;
        }
        self.submitDisabled = true;
        self.catename = this.member_invoiceId == 0 ? '添加' : '修改'
        this.idEdit = this.member_invoiceId != 0;
        //调取接口
        var data = {
          invoice_type: this.applyType,
          invoice_title: this.postData.invoice_title,
          invoice_code: this.postData.invoice_code,
          is_default: this.isDefault ? 1 : 0,
        };
        if (this.idEdit) {
          data.member_invoiceId = this.postData.member_invoiceId;
        }else{
          data.member_invoiceId = null;
        }
        self.$refs[formName].validate((valid) => {
          if(valid){
            this.$confirm('确认'+self.catename+'该开票信息吗?', '提示', {
              type: 'warning',
              closeOnClickModal: false
            }).then(() => {
                this.$http[this.idEdit ? 'put' : 'post']('./api/invoice',data).then(function(response) {
                  self.submitDisabled = false;
                  var data = response.data;
                  if (data) {
  									self.postData = {...DefaultPostData};
										self.$nextTick(() => {
											self.$refs[formName].resetFields();
										});
                  	self.$emit('addSuccess');
                    self.$message({
                      title: '成功',
                      message: self.catename+'成功',
                      type: 'success'
                    });
                  }
                }, function(response) {
                  self.submitDisabled = false;
                });
            }).catch(() => {
              self.submitDisabled = false;
            });
          } else {
            self.submitDisabled = false;
            //self.$message.error('标红的为必填项，请检查并正确填写。');
            return false;
          }
        })
      },
      addSbj(formName){
      	this.member_invoiceId = this.postData.member_invoiceId || 0;
        var self = this;
        if (self.submitDisabled) {
          return;
        }
        self.submitDisabled = true;
        self.catename = this.member_invoiceId == 0 ? '添加' : '修改'
        this.idEdit = this.member_invoiceId != 0;
        var data = {
          invoice_type: this.applyType,
          invoice_title: this.postData.invoice_title,
          invoice_code: this.postData.invoice_code,
          regist_phone: this.postData.regist_phone,
          province_id: this.postData.province_id,
          city_id: this.postData.city_id,
          area_id: this.postData.area_id,
          area_info: this.getAreaInfo(this.postData),
          address: this.postData.address,
          account_bank: this.postData.account_bank,
          account_number: this.postData.account_number,
          is_default: this.isDefault ? 1 : 0,
        };
        if (this.idEdit) {
          data.member_invoiceId = this.postData.member_invoiceId;
        }else{
          data.member_invoiceId = null;
        }
        self.$refs[formName].validate((valid) => {
          if(valid){
            this.$confirm('确认'+self.catename+'该开票信息吗?', '提示', {
              type: 'warning',
              closeOnClickModal: false
            }).then(() => {
                this.$http[this.idEdit ? 'put' : 'post']('./api/invoice',data).then(function(response) {
                  self.submitDisabled = false;
                  var data = response.data;
                  if (data) {
                  	self.postData = {...DefaultPostData};
										self.$nextTick(() => {
											self.$refs[formName].resetFields();
										});
                  	self.$emit('addSuccess');
                    self.$message({
                      title: '成功',
                      message: self.catename+'成功',
                      type: 'success'
                    });
                  }
                }, function(response) {
                  self.submitDisabled = false;
                });
            }).catch(() => {
              self.submitDisabled = false;
            });
          } else {
            self.submitDisabled = false;
            //self.$message.error('标红的为必填项，请检查并正确填写。');
            return false;
          }
        })
      }
    },
    watch: {
    	itemData(){
    		this.postData = Object.assign({...DefaultPostData}, this.itemData);
    		if (!this.postData.member_invoiceId) {
    			this.isDefault = false;
    			this.$nextTick(() => {
    				this.$refs.ruleForm.resetFields();
    			});
    			return;
    		}
    		this.applyType = this.postData.invoice_type;
    		this.isDefault = this.postData.is_default == 1 ? true: false;
    		this._triggerChange(this.postData.province_id, 'cityData');
				this._triggerChange(this.postData.city_id, 'areaData');
				this.$nextTick(() => {
  				this.$refs[this.applyType == 2 ? 'ruleForm' : 'ordruleForm'].validate();
  			});
    	},
    	applyType(){
  			this.$refs[this.applyType == 2 ? 'ruleForm' : 'ordruleForm'].clearValidate();
    	}
    }
	}
</script>

<style lang="scss">
.incoiceEdit{
	padding-left: 30px;padding-top: 20px;
	.radio{height: 50px;}
	.orderAddincoice{
		label{line-height: 20px;margin-top: 10px;}
		.addincoice{width: 580px;}
		.bot{padding-left: 140px;font-size: 14px;color: #666;margin-bottom: 0px;margin-top: -5px;}
		.taxbot{padding-left: 140px;font-size: 14px;color: #666;margin-bottom: 0px;margin-top: -5px;}
	}
}
</style>
