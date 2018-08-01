<template>
  <div class="addSupSuccess">
    <div class="addSupSuccess-box" v-if='inviteType === 0'>
      <p class="addSupSuccess-box-title">“{{enterpriseTitle}}”&nbsp供应商添加成功</p>
      <p><em>邀请码</em>已发送至供应商，其可根据邀请码入驻系统进行发货</p>
      <p>后续可在&nbsp<em>“企业互联-我的供应商”</em>&nbsp继续添加供应商</p>
    </div>
    <div v-else class="addSupSuccess-box">
      <p class="addSupSuccess-box-title">邀请信息已发送至&nbsp“{{enterpriseTitle}}”&nbsp!</p>
      <p>该供应商<em>已入驻</em>小亚通，请等待其<em>“接受邀请”</em>后进行发货</p>
      <p>后续可在&nbsp<em>“企业互联-我的供应商”</em>查看合作进度，并继续添加其他供应商</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'addSupSuccess',
  //  0离线邀请  1在线邀请
  props: ['inviteType', 'enterpriseTitle'],
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
.addSupSuccess-box {
  width: 500px;
  height: 130px;
  padding: 30px;
  margin: 0 auto;
  margin-top: 20px;
  background-color: @tabBg;
  border: 1px solid @borderLine;
  p {
    margin: 0;
    em {
      font-style: normal;
      font-weight: bold;
    }
  }
  .addSupSuccess-box-title {
    font-size: 14px;
    color: @successGreen;
    margin-bottom: 20px;
  }
}
</style>
