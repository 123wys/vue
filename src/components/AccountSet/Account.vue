<template>
  <div class="set">
    <transition name="slide" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'account',
  data() {
    return {
      // show: false,
      // goTo: '',
    }
  },
  methods: {},
}
</script>
<style lang="less" scoped>
@import '../../main.less';
// .set {
//   padding: 15px;
//   .fl {
//     color: @lightGary;
//     float: left;
//     font-size: 12px;
//   }
// }
</style>
