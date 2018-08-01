<template>
  <div class="toolbox">
    <transition name="rotatex3d">
      <keep-alive>
        <task-center-lite v-if="showWindow" @close="close"></task-center-lite>
      </keep-alive>
    </transition>
    <div class="task">
      <div class="show-taskcenter" :class="animateClass" @click="showTaskcenter" @animationend="clearAnimate">
        <el-badge :is-dot="showNew"><i class="iconfont icon-renwuzhongxin"></i></el-badge>
      </div>
      <transition name="sliderignt" @after-enter="bannerInter">
        <div v-if="showBanner" class="taskbanner">
          <transition name="fade" @after-leave="showBanner=false">
            <template v-if="showText">
              <div class="tasktext">
                <span class="tasklabel">任务中心</span>
                <span class="taskclose" @click="close">收起<i class="iconfont icon-shouqi"></i></span>
              </div>
            </template>
          </transition>
        </div>
      </transition>
    </div>
    <div class="pluse fadeOutUp animated" v-if="showPluse" @animationend="showPluse=false">+1</div>
    <transition name="fade">
      <div class="go-top" @click="goTop" v-if="showGoTop"><i class="iconfont icon-huidaodingbu-copy"></i></div>
    </transition>
  </div>
</template>
<script>
import throttle from 'lodash/throttle'
import TWEEN from 'tween.js'
import TaskCenterLite from './TaskCenterLite/TaskCenterLite'
import 'animate.css'
export default {
  name: 'toolbox',
  data() {
    return {
      showGoTop: false,
      showNew: false,
      showPluse: false,
      showBanner: false,
      showText: false,
      showWindow: false,
      animateClass: '',
    }
  },
  computed: {
    count() {
      return this.$store.state.toolbox.count;
    },
  },
  methods: {
    goTop() {
      let over = false;

      function animate(time) {
        if (!over) {
          window.requestAnimationFrame(animate)
          TWEEN.update(time)
        }
      };
      new TWEEN.Tween(document.body)
        .easing(TWEEN.Easing.Quadratic.Out)
        .to({
          scrollTop: 0
        }, 500)
        .start().onComplete(() => {
          over = true
        });
      animate();
    },
    showTaskcenter() {
      this.showNew = false;
      // this.$router.push('/taskcenter');
      if (!this.showBanner) {
        this.showBanner = true;
        // this.showGoTop = false;
      }
    },
    bannerInter() {
      this.showText = true;
      this.showWindow = true;
    },
    close() {
      this.showText = false;
      this.showWindow = false;
    },
    clearAnimate() {
      this.animateClass = '';
      this.showNew = true;
      this.showPluse = true;
    },
  },
  watch: {
    count() {
      this.animateClass = 'wobble animated';
    }
  },
  mounted() {
    window.onscroll = throttle(() => {
      if (document.body.scrollTop >= 100) {
        this.showGoTop = true;
      } else {
        this.showGoTop = false;
      }
    }, 200);
  },
  components: {
    TaskCenterLite,
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../main.less';
.toolbox {
  position: fixed;
  right: @baseSpace*3;
  bottom: @baseSpace*15;
  z-index: 2000;
  perspective: 800px;
  transform-style: preserve-3d;
  perspective-origin: bottom;
}

.task-center-lite {
  transform-origin: bottom;
}

.task {
  background-color: @primaryBlue;
  color: @white;
  display: flex;
  align-items: center;
}

.taskbanner {
  width: 315px;
  .tasktext {
    white-space: nowrap;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tasklabel {
      font-size: 16px;
    }
    .taskclose {
      cursor: pointer;
      padding-right: @baseSpace*3;
      .iconfont {
        font-size: 12px;
        margin-left: @baseSpace;
      }
    }
  }
}

.go-top,
.show-taskcenter {
  width: @baseSpace*7;
  height: @baseSpace*7;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .iconfont {
    font-size: 22px;
  }
}

.go-top {
  background-color: @tabBg;
  margin-left: 100%;
  transform: translate(-100%);
  font-size: 22px;
  position: absolute;
}

.pluse {
  text-align: center;
  font-size: 20px;
  color: @dangerRed;
  position: relative;
  margin-bottom: -23px;
  bottom: 50px;
}

.red-point {
  transition: right linear .5s, bottom cubic-bezier(0.55, 0.06, 0.68, 0.19) .5s;
}


.rotatex3d-enter-active,
.rotatex3d-leave-active {
  transition: transform .5s
}

.rotatex3d-enter,
.rotatex3d-leave-active {
  transform: rotateX(-92deg);
}
</style>
