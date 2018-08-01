<template>
  <div class="reg">
    <nav-top :title="'注册'" :linkTo="{path: '/login',label: '立即登录', des: '已有账号？'}"></nav-top>
    <div class="bg">
      <div class="reg_body">
        <el-steps :active="activeNum" :center="true" :align-center="true":space="400">
          <el-step title="设定账号"></el-step>
          <el-step title="完善信息"></el-step>
          <el-step title="注册成功"></el-step>
        </el-steps>
      </div>
      <router-view></router-view>
    </div>

    <cr-footer></cr-footer>
  </div>
</template>
<script>
import Vue from 'vue'
import {
  Steps,
  Step,
} from 'element-ui'
Vue.use(Steps)
Vue.use(Step)
import NavTop from '../common/NavTop'
import CrFooter from '../common/CrFooter'
export default {
  prop: ['title', 'linkTo'],
  name: 'register',
  data() {
    return {
      activeNum: 1,
    }
  },
  methods: {
    goLogin() {
      this.$router.push('/login');
    }
  },
  watch: {
    $route($router) {
      let href = $router.path.split('/').pop();
      switch (href) {
        case 'setAccount':
          this.activeNum = 1;
          break;
        case 'complateShip':
          this.activeNum = 2;
          break;
        case 'regComplate':
          this.activeNum = 3;
          break;
      }
    }
  },
  mounted() {
    if (this.$route.query.code && this.$route.query.state) {
      let appKey = {
        code: this.$route.query.code,
        state: this.$route.query.state
      };
      window.sessionStorage.appKey = JSON.stringify(appKey);
    }
  },
  components: {
    NavTop,
    CrFooter
  },
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.reg {
  width: 100%;
}

.bg{
  background: @pageBg;
  min-width: 1000px;
  overflow: hidden;
}

.reg_body {
  width: 700px;
  margin: 0 auto;
  /*margin-top: 30px;*/
  padding-top: 30px;
  height: 120px;
}
</style>
