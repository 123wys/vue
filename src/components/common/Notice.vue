<template>
  <el-dialog v-model="resCode" size="tiny" modal="false" custom-class="cus">
  	<div class="dialog_body">
  		<div>
  			<i class="icon_f el-icon-circle-cross"></i>
  		</div>
  		<div>
  			<p class="p_title">{{resData}}</p>
  			<p class="p_content">{{resReason}}</p>
  		</div>
  	</div>
	<span slot="footer" class="dialog-footer">
	  <el-button type="primary" @click="resCode=false">确 定</el-button>
	</span>
  </el-dialog>
</template>
<script>
  import Vue from 'vue'
  import {
    Dialog,
    Button
  } from 'element-ui'
  Vue.use(Dialog)
  Vue.use(Button)
  export default {
    name: 'notice',
    data() {
      return {
        resCode: true,
        resData: '到货失败',
        resReason: '仓库中无对应商品'
      }
    }
  }
</script>
<style>
  .cus p{
  	margin:0;
  	padding:0;
  	height:20px;
  	line-height:20px;
  }
  .p_title{
  	font-size: 20px;
  }
  .cus .p_content{
  	font-size:13px;
  	margin-top:15px;
  }
  .icon_f{
  	font-size:50px;
  	line-height:56px;
  	margin: 1px 20px 0 30px;
  	color: #FF4948;
  }
  .dialog_body{
  	display:flex;
  	justify-content: flex-start;
  }
  .cus .el-dialog__body{
  	padding:30px 0 0;
  }
 
</style>