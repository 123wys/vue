<template>
  <div class="authSuccess">
    <div class="authSuccess-box" v-if='type === 0'>
      <p>
        <svg class="icon auth-icon icon-check" aria-hidden="true">
          <use :xlink:href="iconList[platform]"></use>
        </svg>
      </p>
      <p class="success">激活成功!</p>
      <p>系统正在启动抓单引擎，稍后将自动同步店铺商品、抓取订单（5-10分钟）</p>
      <el-progress :text-inside="false" :stroke-width="10" :percentage="percentage" :status='status'></el-progress>
      <p style="margin-top: 30px;" v-if="selectType === 1"><el-button type="primary" @click="success" class="btn">完成</el-button></p>
    </div>
    <div class="authSuccess-box" v-else>
      <p>
        <svg class="icon auth-icon icon-check" aria-hidden="true">
          <use :xlink:href="iconList[platform]"></use>
        </svg>
      </p>
      <p class="fail">若为新增店铺则<span class="failed">激活失败</span>请重新授权!</p>
      <p class="fail">若为重新激活店铺则已经<span class="success">成功激活</span>请忽略提示!</p>
      <p>请确认是否已经成功授权店铺，若没有请重新授权</p>
      <p><el-button type="primary" @click.native='reAuth'>重新授权</el-button></p>
      <p><el-button type="text" size="mini" class="skip" @click.native="skip">跳过，进入系统</el-button></p>
    </div>
  </div>
</template>
<script>
import {
  mapActions
} from 'vuex'
export default {
  name: 'authSuccess',
  props: ['platform', 'selectType'],
  data() {
    return {
      iconList: {
        KDT: '#icon-youzan',
        TMALL: '#icon-taobaowang',
        WEIDIAN: '#icon-weidian1'
      },
      percentage: 0,
      type: 0,
      change: false,
      status: ''
    }
  },
  mounted() {
    this.type = 0;
    // this.processAdd();
    this.setShopEnum().then((data) => {
      if (this.shopNum > 0 && this.change) {
        this.processAdd();
        this.change = false;
      } else {
        this.type = 1;
      }
    })
  },
  watch: {
    'shopNum': function(val, oldVal) {
      console.log('shopNum数量增加')
      this.change = true;
    },
    'percentage': function(val, oldVal) {
      if (val > 99) {
        this.status = 'success';
      }
    }
  },
  computed: {
    shopNum() {
      return Object.keys(this.$store.state.enumSet.shopEnum).length;
    },
  },
  methods: {
    ...mapActions([
      'setShopEnum'
    ]),
    skip() {
      this.$emit('skip');
    },
    success() {
      this.$emit('success')
    },
    reAuth() {
      this.$emit('reAuth');
    },
    processAdd() {
      if (this.percentage < 100) {
        this.percentage += 1;
        setTimeout(this.processAdd, 100)
      }
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.authSuccess-box {
  width: 500px;
  height: 130px;
  padding: 15px;
  margin: 0 auto;
  margin-top: 10px;
  // background-color: @tabBg;
  // border: 1px solid @borderLine;
  p {
    margin: 0 0 10px 0;
    text-align: center;
  }
}
.fail {
  font-size: 18px;
  // color: @dangerRed;
  color: @baseGary;
}
.success {
  font-size: 18px;
  color: @successGreen;
}
.failed{
  color: @dangerRed;
}
.icon-check{
  width: 140px;
  height: 80px;
}
.btn{
  width: 120px;
}
.skip{
  color: @lightGary;
  transition: color 0.5s;
}
.skip:hover{
  color: @primaryBlue;
}
</style>
