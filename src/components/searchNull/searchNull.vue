<template>
  <div class="searchNull">
    <p class="wait-icon">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-sousuojieguoweikong"></use>
      </svg>
    </p>
    <p class="wait-text">{{text}}</p>
  </div>
</template>
<script>
export default {
  name: 'searchNull',
  props: {
    text: {
      default: '查询结果为空，请尝试其他条件'
    }
  },
  data() {
    return {

    }
  },
  computed: {},
  methods: {},
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.icon {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}

.wait-icon,
.wait-text {
  text-align: center;
  color: #9aaac0;
}

.wait-icon {
  margin: -60px 0 0 0;
}

.wait-text {
  margin: 0;
  font-size: 18px;
}
</style>
<style>
.el-table__empty-block {
  height: 420px;
}
</style>
