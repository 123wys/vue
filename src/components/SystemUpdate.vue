<template>
  <div class="update">
    <img src="../assets/img/systemUpdate.png" alt="假装有图片">
    <p>小亚通&nbsp;系统升级中</p>
    <span>程序猿GG们正在奋力撸码中，请稍后再来~</span>
  </div>
</template>
<script>
export default {
  name: 'system-update',
  data() {
    return {};
  },
  methods: {},
}
</script>
<style lang="less" scoped>
@import '../main.less';
.update {
	height: 500px;
	display: flex;
	flex-flow: column wrap;
	justify-content: center;
	align-items: center;
	img {
		width: 123px;
		height: 150px;
	}
	p {
		margin: 10px 0 0 0;
		font-size: 32px;
		color: #4990E2;
		line-height: 33px;
	}
	span {
		color: @baseGary;
		font-size: 16px;
		line-height: 36px;
	}
}
</style>
