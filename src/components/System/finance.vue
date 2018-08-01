<template>
  <div class="system">
    <div class="head">
      <span class="position">当前位置：</span>系统管理
    </div>
  </div>
</template>
<script>
export default {
  name: 'system',
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
@import '../../main.less';
.head {
  font-size: 14px;
  border-bottom: solid 1px @gary;
  padding: 8px 0 @normalSize 0;
}

.system {
  color: @lightBlack;
  padding: @normalSize;
}
</style>
