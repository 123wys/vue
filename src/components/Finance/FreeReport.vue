<template>
  <div class="freeReport">
    <transition name="slide" mode="out-in">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'free-report',
  data() {
    return {
      goTo: '免费对账单',
      show: false,
    }
  },
  methods: {},
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.freeReport {
}
</style>
