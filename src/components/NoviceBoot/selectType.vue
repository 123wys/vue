<template>
  <div class="selectType">
    <h1>开启小亚通轻电商之旅</h1>
    <p class="subTitle">Dear&nbsp“{{ichannel.tenantInfo.enterpriseTitle}}”&nbsp您好！为快速了解系统请按引导操作<i class="icon iconfont icon-hanglvicon hanglvicon"></i></p>
    <el-row :gutter="20" style="width:480px;margin:0 auto;">
      <el-col :span="12">
        <div class="left-box box">
          <h1>我有供应商</h1>
          <p>订单可分发至供应商发货</p>
          <p>
            <svg class="left-icon" aria-hidden="true">
              <use xlink:href="#icon-woyougongyingshang"></use>
            </svg>
          </p>
          <p><el-button type="primary" size="small" @click="sendBySupplier">开始体验</el-button></p>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="right-box box">
          <h1>我是自营</h1>
          <p>商品由自己发货</p>
          <p>
            <svg class="left-icon" aria-hidden="true">
              <use xlink:href="#icon-ziying"></use>
            </svg>
          </p>
          <p><el-button type="primary" size="small" @click="sendBySelf">开始体验</el-button></p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'selectType',
  data() {
    return {}
  },
  props: [
    'ichannel'
  ],
  computed: {},
  methods: {
    sendBySupplier() {
      this.$emit('selectTypeChange', 2);
    },
    sendBySelf() {
      this.$emit('selectTypeChange', 1);
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.selectType {
  h1{
    margin: 0;
    text-align: center;
    font-size:20px;
    color: @baseGary;
    font-weight: normal;
  }
  .subTitle{
    position: relative;
    margin-bottom: 35px;
    font-size: 12px;
    color: @lightGary;
    text-align: center;
  }
  .hanglvicon{
    position: absolute;
    top: -35px;
    right: 140px;
    font-size: 48px;
    color: #eee;
    // transition: all 2s;
    animation: fly 3.5s forwards;
  }
  @keyframes fly{
    from{
      transform: translate(-30px,0px) rotate(-20deg);
    }
    to{
      transform: translate(-300px,-40px) rotate(-10deg);
    }
  }
  // .hanglvicon:hover{
  //   transform: translate(-30px,-10px) rotate(-20deg);
  // }
  .box{
    padding: 5px;
    height: 205px;
    background-color: @pageBg;
    transition: box-shadow .2s;
    h1{
      margin: 20px 0 5px 0;
      color: @primaryBlue;
    }
    p{
      text-align: center;
      margin: 0 0 5px 0;
    }
    p:nth-child(4) {
      margin-top: 15px;
      button{
        width: 112px;
        height: 30px;
      }
    }
    .left-icon{
      width: 160px;
      height: 60px;
    }
  }
  .box:hover{
    box-shadow: 5px 5px 5px #ccc;
  }
}
</style>
