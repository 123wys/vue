<template>
  <div class="breaddiv">
    <span class="breadtitle">当前位置:</span>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item v-for="label in labels">{{label.text}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
import Vue from 'vue'
import {
  Breadcrumb,
  BreadcrumbItem,
} from 'element-ui'
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)

export default {
  name: 'breadcrumb-nav',
  data() {
    return {
      labels: [{
        text: '订单管理'
      }, {
        text: '已售订单管理'
      }]
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.breaddiv {
  padding-bottom: 10px;
}
.breadtitle {
  float: left;
  font-size: 13px;
  line-height: 1;
  padding-right: 5px;
}
</style>
