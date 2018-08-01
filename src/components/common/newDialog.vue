<template>
  <div class="dialog" v-show="visible" transition="dialog-fade">
    <div class="dialog-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import Popup from 'vue-popup';
require('vue-popup/lib/popup.css');
export default {
  mixins: [Popup],

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: true
    },
    showModal: {
      type: Boolean,
      default: true
    },
    modal: {
      default: true
    },
    closeOnClickModal: {
      default: true
    },
    title: String
  },
  mounted() {},
  methods: {
    willOpen() {
      console.log('will open...');
      return true;
    }
  }
};
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