<template>
  <transition name="fade">
    <div class="dialog" v-show="show">
      <div class="dialog-content">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>
<script>
// import 'vue-popup-mixin/dist/VuePopupMixin.css';
// import Popup from 'vue-popup-mixin'
import Popup from './pupupMixin/index'
export default {
  model: {
    prop: 'show',
    event: 'change'
  },
  mixins: [Popup],
  mounted() {},
  methods: {
    // 响应 overlay事件
    overlayClick() {
      console.log('关闭事件')
      this.$emit('close');
    },
    // 响应 esc 按键事件
    escPress() {
      this.$emit('close');
    }
  }
}
</script>
<style scoped>
.dialog {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  position: fixed;
  width: 90%;
}

.dialog-content {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.dialog-fade-transition {
  transition: opacity .3s linear;
}

.dialog-fade-enter,
.dialog-fade-leave {
  opacity: 0;
}
</style>
