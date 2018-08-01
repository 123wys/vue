<template>
  <div class="navTop">
    <div class="wdauto">
      <div class="navTop_left">
        <img src="../../logo.png" alt="logo">
        <span class="sm"><span v-if="title" class="mg">|</span>{{title}}</span>
      </div>
      <div class="navTop_right">
        <p>{{linkTo.des}}&nbsp;&nbsp;<a @click="goTo(linkTo.path)">{{linkTo.label}}</a></p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'nav-top',
  props: ['title', 'linkTo'],
  data() {
    return {}
  },
  computed: {},
  methods: {
    goTo(val) {
      this.$router.push(val);
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.navTop {
  height: @baseSpace * 12;
  background-color: @white;
  width: 100%;
  .wdauto {
    width: 1000px;
    margin: 0 auto;
    overflow: hidden;
    height: 70px;
  .navTop_left {
    float: left;
    img {
      float: left;
      width: @baseSpace * 24;
      height: @baseSpace * 9;
      margin: @baseSpace 0;
    }
    .sm {
      font-size: @homeFont18;
      position: relative;
      top:-10px;
      color: @neutralGary;
      .mg {
        margin:  @baseSpace * 2;
      }
    }
    .lg,
    .sm {
      line-height: @baseSpace * 22;
    }
  }
  .navTop_right {
    float: right;
    position: relative;
    top:-10px;
    margin-bottom: @baseSpace * 4 + 3px;
    p {
      text-align: right;
      margin: 0;
      padding: 0;
      line-height: @baseSpace * 22;
      font-size: @fontSize14;
      color: @neutralGary;
    }
    a {
      color: @tipsBlue;
      font-size: @fontSize14;
      text-decoration: none;
      margin-right: @normalSize;
      cursor: pointer;
    }
  }
}
}
</style>
