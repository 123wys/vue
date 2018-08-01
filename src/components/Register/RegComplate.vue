<template>
  <div class="gc">
    <p class="title">
      <i class="el-icon-circle-check"></i>
      <span>恭喜您注册成功</span>
    </p>
    <div class="qrcode">
      <img src="../../assets/img/qrcode.jpg" alt="小亚科技二维码">
      <p>微信扫一扫关注小亚通</p>
    </div>
    <div class="btn">
      <el-button type="primary" @click="regNext">进入系统</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'reg-complate',
  data() {
    return {}
  },
  methods: {
    regNext() {
      this.$router.push('/index');
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.gc {
  width: 600px;
  margin: 35px auto 0;
.title{
  text-align: center;
}
  i {
    color: @success;
    font-size: 20px;
    margin: 2px 10px 0 0;
  }
  p {
    margin: 0;
    font-size: 16px;
    color: @success;
  }
  .qrcode {
    width: 202px;
    height: 202px;
    margin: @normalSize auto;
    text-align: center;
    p {
      font-size: 14px;
      color: @black;
    }
    img {
      width: 174px;
    }
  }
  .btn {
    text-align: center;
    padding-bottom: 20px;
  }
}
</style>
