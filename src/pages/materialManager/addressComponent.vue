<template>
<div>
	<el-form :model="postData" :rules="rules" ref="ruleForm" :inline="true" auto-complete="off">
		<el-form-item label="收件地址：" class="form-group">
			<el-form-item class="form-ipt-sm" prop="addressProvinceId">
				<el-select v-model="postData.addressProvinceId" placeholder="请选择省" @change="changeProvince">
					<el-option
						v-for="item in provinceData"
						:label="item.name"
						:value="item.area_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item class="form-ipt-sm" prop="addressCityId">
				<el-select v-model="postData.addressCityId" placeholder="请选择市" @change="changeCity">
					<el-option
						v-for="item in cityData"
						:label="item.name"
						:value="item.area_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item class="form-ipt-sm" prop="addressAreaId">
				<el-select v-model="postData.addressAreaId" placeholder="请选择区">
					<el-option
						v-for="item in areaData"
						:label="item.name"
						:value="item.area_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="address">
				<el-input v-model="postData.address" placeholder="请输入详细地址" auto-complete="off" class="form-ipt"></el-input>
			</el-form-item>
      <button class="btn btn-primary mt-20" type="submit" @click.prevent="validateBeforeSubmit('ruleForm')">提交</button>
      {{postData}}
		</el-form-item>
  </el-form>
</div>
</template>

<script>
  import Vue from 'vue'
  import qs from 'qs'

  const AreaUrl = './api/areas'; //省市区地址
  export default {
    validator: null,
    data () {
      return {
        postData:{
          addressProvinceId:'',
          addressCityId:'',
          addressAreaId:'',
          address:''
        },
        provinceData:[],
        cityData:[],
        areaData:[],
				// 表单验证规则
        rules: {
          addressProvinceId: [
            {type: 'integer', required: true, message: '请选择省份', trigger: 'change' }
          ],
          addressCityId: [
            {type: 'integer', required: true, message: '请选择城市', trigger: 'change' }
          ],
          addressAreaId: [
            {type: 'integer', required: true, message: '请选择区', trigger: 'change' }
          ],
          address: [
            {type: "string", required: true, message: '请输入地址', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
    },
    mounted () {
      this.initProvince();
    },
    methods: {
      // 初始化省份
      initProvince(){
        var self = this;
        this.$http.get(AreaUrl+'?pId=0')
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
      triggerChange (code, dataName){
				if(!code){
					return;
				}
        var self = this;
        this.$http.get(AreaUrl+'?pId='+ code)
        .then(function(resp){
          resp = resp.data;
          if(resp.elements){
            self[dataName] = resp.elements;
          }else {
            console.error(resp.msg);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      },
			changeProvince(provinceCode){
				this.postData.addressCityId = '';
				this.postData.addressAreaId = '';
				this.areaData = [];
				this.triggerChange(provinceCode, 'cityData');
			},
			changeCity(cityCode){
				this.postData.addressAreaId = '';
				this.triggerChange(cityCode, 'areaData');
      },
      // 提交前验证
      validateBeforeSubmit(formName){
        var self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
						self.submit();
					} else {
            self.$message.error('标红的为必填项，请检查并正确填写。');
            return false;
          }
        });
      },
      submit(){
        //do submit
      }
    }
  } 
</script>

<style scoped>
</style>
