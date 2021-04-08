<template>
		<section class="buton_home">
			<el-row>
			  <el-button type="primary">默认按钮44px</el-button>
			  <el-button size="medium" type="primary">中等按钮42px</el-button>
			  <el-button size="small" type="primary">小型按钮30px</el-button>
			  <el-button size="mini" type="primary">超小按钮24px</el-button>
			</el-row>
			<el-row>
			  <el-button>默认按钮44px</el-button>
			  <el-button size="medium">中等按钮42px</el-button>
			  <el-button size="small">小型按钮30px</el-button>
			  <el-button size="mini">超小按钮24px</el-button>
			</el-row>
			<el-row>
			  <el-button round>默认按钮44px</el-button>
			  <el-button size="medium" round>中等按钮42px</el-button>
			  <el-button size="small" round>小型按钮30px</el-button>
			  <el-button size="mini" round>超小按钮24px</el-button>
			</el-row>
			<el-row>
			  <el-button size="medium" type="primary" disabled>禁用按钮</el-button>
			  <el-button size="medium" disabled>禁用按钮</el-button>
			</el-row>
			<a href="https://www.ipsebe.com/" target="_blank"><el-button size="small" type="primary">超链接跳转</el-button></a>
			<el-checkbox-group v-model="checkList">
		    <el-checkbox label="复选框 A"></el-checkbox>
		    <el-checkbox label="复选框 B"></el-checkbox>
		    <el-checkbox label="复选框 C"></el-checkbox>
		    <el-checkbox label="禁用" disabled></el-checkbox>
		    <el-checkbox label="选中且禁用" disabled></el-checkbox>
		  </el-checkbox-group>
		  <div class="box">
			  <el-radio v-model="radio1" label="备选项">备选项</el-radio>
			  <el-radio disabled v-model="radio1" label="禁用">备选项</el-radio>
	  		<el-radio disabled v-model="radio1" label="选中且禁用">备选项</el-radio>
  		</div>
  		<div class="input-group box">
	  		<el-input placeholder="默认大小40px" v-model="input" disabled clearable></el-input>
				<el-input placeholder="默认大小40px" v-model="input" clearable></el-input>
				<el-input placeholder="中等36px" v-model="input" size="medium" clearable></el-input>
				<el-input placeholder="小型32px" v-model="input" size="small" clearable></el-input>
				<el-input placeholder="超小28px" v-model="input" size="mini" clearable></el-input>
			</div>
			<div class="box">
			  <el-select v-model="value" placeholder="默认大小40px">
			    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
			  </el-select>
			  <el-select v-model="value" placeholder="中等36px" size="medium">
			    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
			  </el-select>
			  <el-select v-model="value" placeholder="小型32px" size="small">
			    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
			  </el-select>
			  <el-select v-model="value" placeholder="超小28px" size="mini">
			    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
			  </el-select>
		  </div>
		  <div class="box">
		    <span class="demonstration">完整功能</span>
		    <el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="currentPage4"
		      :page-sizes="[100, 200, 300, 400]"
		      :page-size="100"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="400"
		      background>
		    </el-pagination>
		  </div>
		  <div class="box">
		    <el-button :plain="true" @click="open2">成功消息</el-button>
			  <el-button :plain="true" @click="open3">警告消息</el-button>
			  <el-button :plain="true" @click="open">消息消息</el-button>
			  <el-button :plain="true" @click="open4">错误消息</el-button>
			  <el-button :plain="true" @click="open5">可关闭消息</el-button>
		  </div>

		  <el-button @click="giveUp=true">弹出框内容居中</el-button>
		  <el-button @click="giveUp1=true">弹出框内容居右</el-button>
		  <!-- 撤消出证 -->
			<el-dialog title="提示" width="400px" :visible.sync="giveUp" :close-on-click-modal="false" :append-to-body="true">
				<p class="lc">您确定要撤销出证吗？</p>
				<div class="lc mt20">
					<el-button size="small" type="primary" @click="giveUp=false">取消</el-button><el-button size="small" type="primary" class="sub" @click="giveUp=false">确定</el-button>
				</div>
			</el-dialog>
			<el-dialog title="提示" width="400px" :visible.sync="giveUp1" :close-on-click-modal="false" :append-to-body="true">
				<p>您确定要撤销出证吗？</p>
				<div class="lr mt20">
					<el-button size="small" type="primary" @click="giveUp1=false">取消</el-button><el-button size="small" type="primary" class="sub" @click="giveUp1=false">确定</el-button>
				</div>
			</el-dialog>
			<el-popover placement="bottom" width="170" trigger="click" popper-class="xxx">
        <p class="lc">是否取消该订单？</p>
        <div class="lc mt10">
          <el-button size="mini" type="primary" @click="giveUp1=false">是</el-button><el-button size="mini" type="primary" class="sub" @click="giveUp1=false">否</el-button>
        </div>
        <a href="javascript:;" class="cancel_order" slot="reference">默认popover</a>
      </el-popover>
      <!-- <el-popover placement="bottom" width="170" trigger="click" popper-class="dark-popover xxx">
        <p class="lc">是否取消该订单？</p>
        <div class="lc mt20">
          <el-button size="mini" type="primary" @click="giveUp1=false">是</el-button><el-button size="mini" type="primary" class="sub" @click="giveUp1=false">否</el-button>
        </div>
        <a href="javascript:;" class="cancel_order" slot="reference">深色popover</a>
      </el-popover> -->
		</section>
</template>

<script>
	import Vue from 'vue'
	export default {
		data () {
      return {
        checkList: ['选中且禁用','复选框 A'],
        radio1: '备选项',
        input:'',
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: '',
        currentPage4: 4,
        giveUp: false,
        giveUp1: false
      };
    },
    methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      open() {
        this.$message('这是一条消息提示');
      },
      open2() {
        this.$message({
          message: '恭喜你，这是一条成功消息',
          type: 'success',
          duration: 0,
          showClose: true,
        });
      },
      open3() {
        this.$message({
          message: '警告哦，这是一条警告消息',
          type: 'warning'
        });
      },
      open4() {
        this.$message.error('错了哦，这是一条错误消息');
      },
      open5() {
        this.$message.error({
        	message: '错了哦，这是一条错误消息',
          showClose: true,
        });
      }
    },
	}
</script>
<style lang="scss">
.buton_home{
		width:100%;background-color: #fff;position: relative;z-index: 1;padding:20px;
		button{margin-bottom: 10px; }
		.box{padding-top:10px;}
		.input-group{
			.el-input{width: 180px;}
		}
}
</style>
