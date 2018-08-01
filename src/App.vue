<template>
  <div id="app">
    <transition name="slide" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'app',
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="less">
@import 'main.less';
th .cell {
  font-weight: normal!important;
}

.el-table .cell {
  font-size: 12px;
}

.el-table th>.cell {
  font-size: 14px;
}

body {
  margin: 0;
  position: relative;
}

* {
  box-sizing: border-box;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.tabs {
  width: 100%;
}

.position {
  color: @darkGary;
}

.margen-white {
  margin: 0 0px 5px 0;
}

.clearfix:before,
.clearfix:after {
  content: "";
  display: table;
}

.clearfix:after {
  clear: both;
}

.el-popover.popper-img {
  padding: @baseSpace;
  box-shadow: 0 2px 10px -1px @primaryBlue;
  img {
    display: block;
    max-width: 200px;
  }
}

#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 12px;
  // min-width: 1200px;
  .el-dialog__header {
    padding: @baseSpace*2 @baseSpace*4;
    background-color: @tabBg;
    border-radius: 2px;
  }
  .el-dialog__body {
    border-bottom: solid 1px @borderLine;
    font-size: 12px;
  }
  .el-loading-mask {
    z-index: 99;
  }
  .el-progress-bar__inner {
    transition: width .5s;
  }
  .el-loading-mask {
    z-index: 99;
  }
  .margin-left8 {
    margin-left: 8px;
  }
  .margin-t80 {
    margin-top: 80px;
  }
  .el-progress-bar__inner {
    transition: width .5s;
  }
  .icon-weibiaoti- {
    color: #ee0000;
    font-size: 18px;
  }
  .icon-taobao1 {
    color: #FC6420;
    font-size: 18px;
  }
  .icon-tianmao1 {
    color: #C20003;
    font-size: 18px;
  }
  .icon-jingdong {
    color: #C91523;
    font-size: 18px;
  }
  /*颜色*/
  .blue,
  .primary {
    color: @primaryBlue;
  }
  .green,
  .success {
    color: @successGreen;
  }
  .yellow,
  .warning {
    color: @warningYellow;
  }
  .red,
  .danger {
    color: @dangerRed;
  }
  .muted {
    color: @neutralGary;
  }
  /*过渡效果*/
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter,
  .fade-leave-active {
    opacity: 0
  }
  .slide-enter-active,
  .slide-leave-active {
    transition: all .5s
  }
  .slide-enter,
  .slide-leave-active {
    opacity: 0;
    transform: translateX(10px);
  }
  .sliderignt-enter-active,
  .sliderignt-leave-active {
    transition: width .5s
  }
  .sliderignt-enter,
  .sliderignt-leave-active {
    width: 0 !important;
  }
  /*过渡效果 end*/
}
</style>
