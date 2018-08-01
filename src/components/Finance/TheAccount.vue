<template>
	<el-input placeholder="输入供应商名称">
			<template slot="append">
				<el-button>{{btnName}}</el-button>
			</template>
		</el-input>
</template>
<script>
export default {
  name: 'the-account',
  props: ['btnName'],
  data() {
    return {}
  }
}
</script>
<style></style>