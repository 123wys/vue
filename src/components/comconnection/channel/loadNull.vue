<template>
  <div class="loadNull">
    <!-- <p class="wait-icon"><span class="icon iconfont icon-qudaoshangweikong"></span></p> -->
    <p class="wait-icon">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-qudaoshangweikong"></use>
      </svg>
    </p>
    <p class="wait-text">{{text}}</p>
  </div>
</template>
<script>
export default {
  name: 'loadNull',
  props: ['text'],
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
@import '../../../main.less';
.icon {
  width: 128px;
  height: 128px;
  color: #9aaac0;
}

.wait-icon,
.wait-text {
  text-align: center;
  color: #9aaac0;
}

.wait-icon {
  margin: 190px 0 0 0;
}

.wait-text {
  margin: 20px 0 0 0;
  font-size: 18px;
}
</style>
