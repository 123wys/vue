<template>
  <div class="waitProduct">
    <h1 class="title">以人民的名义奋力开发中</h1>
    <p class="subTitle">微信扫一扫关注订阅号“&nbsp<span>小亚通&nbsp|&nbsp周一上新</span>&nbsp”~</p>
    <img src="../../assets/img/qrcode.jpg">
  </div>
</template>
<script>
export default {
  name: 'waitProduct',
  props: {
    text: {
      default: '敬请期待'
    }
  },
  data() {
    return {

    }
  },
  computed: {},
  methods: {},
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.waitProduct {
  text-align: center;
  .title {
    margin: 190px 0 0 0;
    font-size: 18px;
    font-weight: normal;
    color: @lightGary;
  }
  .subTitle {
    margin: 5px 0 30px 0;
    font-size: 14px;
    color: @lightGary;
    span {
      color: @baseGary;
    }
  }
  img {
    width: 100px;
    height: 100px;
  }
}
</style>
