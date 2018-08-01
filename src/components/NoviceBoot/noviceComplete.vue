<template>
  <div class="noviceComplete">
    <p class="complete-title">初始化设置完成！</p>
    <p>请前往<em>“商品管理”</em>将商品<em>关联供应商</em>实现订单分发，自营商品<em>“设为自营”</em>哦~</p>
    <p class="complete-btn">
      <el-button type="primary" style='width:100px' @click='goProduct'>去关联</el-button>
    </p>
  </div>
</template>
<script>
export default {
  name: 'noviceComplete',
  data() {
    return {}
  },
  computed: {},
  methods: {
    goProduct() {
      this.$emit('noviceComplete');
      this.$router.push({
        path: '/production',
        query: {
          mark: 'bindPro'
        }
      })
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.noviceComplete {
  p {
    text-align: center;
    em {
      font-style: normal;
      font-weight: bold;
    }
  }
}

.complete-title {
  font-size: 18px;
  color: @successGreen;
}

.complete-btn {
  margin-top: 40px;
}
</style>
