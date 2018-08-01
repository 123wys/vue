<template>
  <div class="login_bottom">
    <p>Copyright <i class="icon iconfont icon-copyright-copy"></i>2016-2017<i></i>杭州小亚科技有限公司<i></i>ALL Rights Reserved. 浙ICP备17006717号</p>
  </div>
</template>
<script>
export default {
  name: 'cr-footer',
  data() {
    return {}
  },
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.login_bottom {
  p {
    min-width: 1000px;
    text-align: center;
    margin-top: @baseSpace * 12;
    line-height: 17px;
    color: @lightGary;
    i {
      margin: 0 @baseSpace;
    }
  }
}
</style>
