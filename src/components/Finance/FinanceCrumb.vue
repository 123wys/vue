<template>
  <div class="financeCrumb">
    <transition name="slide" mode="out-in">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'finance-crumb',
  data() {
    return {
      goTo: '对账详情',
      show: false,
    }
  },
  methods: {},
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.financeCrumb {
  padding: @normalSize;
}
</style>
