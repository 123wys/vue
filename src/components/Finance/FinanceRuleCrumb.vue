<template>
  <div class="financeRuleCrumb">
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
      goTo: '新增规则',
      show: false,
    }
  },
  methods: {},
  // watch: {
  //   '$route.path' (val) {
  //     if (val === '/finance/addFinanceRule') {
  //       this.show = true;
  //       this.goTo = '新增规则';
  //     } else if (val === '/financeRule/financeRuleDetail') {
  //       this.show = true;
  //       this.goTo = '规则详情';
  //     } else {
  //       this.show = false;
  //     }
  //   }
  // },
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.financeRuleCrumb {
  padding: @normalSize;
}
</style>
