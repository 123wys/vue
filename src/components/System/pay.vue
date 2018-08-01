<template>
  <div class="pay">
    <div class="paytitile">
      <div class="xylogo">
        <img src="../../toplogo.png">
      </div>
      <div class="xypay">
        <span style="font-size: 20px;">小亚通</span>
        <span style="font-size: 14px;">|付款收银</span>
      </div>
      <div class="backdiv">
        <el-button class="backbtn">返回管理平台</el-button>
      </div>
    </div>
    <div class="payinfo">
      <div class="payinfoleft">
        <!-- <div class="proimg">
          <img src="../../assets/img/update.png">
        </div> -->
        <img class="proimg" src="../../assets/img/update.png">
        <div class="version">
          <span>专业版</span>
        </div>
        <div class="description">
          <span>电商订单智能分发全功能</span><br>
          <span>在线邀请供应商入驻无限量</span><br>
          <span>快递面单、发货单快速打印</span><br>
          <span>京东物流仓配服务</span><br>
          <span>在线快速对账结算</span><br>
          <span>实时库存智能管理</span><br>
          <span>多渠道客户统一识别管理</span><br>
          <span>数据中心助力高效运营</span><br>
          <span>专属服务经理</span>
        </div>
      </div>
      <div class="payinforight">
        <div class="payproject">
          <span>支付项目:</span>
          <span style="margin-left:10px;color:#324057;">专业版（版本升级）</span>
        </div>
        <div>
          <span>使用周期:</span>
          <el-radio-group v-model="servicetime">
            <el-radio-button label="1">1年</el-radio-button>
            <el-radio-button label="2">2 + 1年</el-radio-button>
          </el-radio-group>
        </div>
        <div class="paymoney">
          <span>支付金额:</span>
          <span style="margin-left:10px;color:#F5A623;">￥19,600.00</span>
        </div>
        <div class="protocal">
          <span style="color:#324057;font-size: 12px;">扫码即代表您已同意</span>
          <span style="font-size: 12px;"><a href="javascript:void(0);">《小亚通服务协议》</a></span><br>
          <span style="font-size: 12px;">若使用银行卡付款，请留意银行卡支付限额以具体银行为准</span>
        </div>
      </div>
    </div>
    <div class="callservice">
      <i class="icon iconfont icon-kefu1" style="color: #C0CCDA;"></i>&nbsp;
      <span style="color: #4A90E2;">联系客服</span>
    </div>
    <div class="phone">
      <span style="color:#66728C;">客户服务：</span>
      <span style="color:#324057;">132-1614-7425</span>
      <span style="color:#66728C;margin-left: 15px;">技术支持：</span>
      <span style="color:#324057;">130-4762-8481</span>
    </div>
  </div>
</template>
<script>
// import bus from '../../store/bus.js'
export default {
  name: 'pay',
  data() {
    return {
      activeName: 'mygoods',
      servicetime: ''
    }
  },
  computed: {},
  components: {
    // mygoods
    // ProductAnalysis
  },
  mounted() {
    // bus.$emit('OrderTapOne')
  },
  methods: {
    handleClick(tab, event) {
      // if (tab.name === 'second') {
      //   bus.$emit('OrderTapTwo');
      // } else if (tab.name === 'third') {
      //   bus.$emit('OrderTapThree');
      // } else {
      //   bus.$emit('OrderTapOne')
      // }
    }
  },
  watch: {
    activeName(val, oldVal) {
      // bus.$emit(val);
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.pay {
  padding: @normalSize;
}
.paytitile {
  height: 70px;
  width: 100%;
  background: @pageBg;
  margin-bottom: 30px;
}
.xylogo {
  float: left;
  width: 40px;
  height: 40px;
  margin-left: 30px;
  margin-top: 15px; 
}
.xylogo img {
  width: 40px;
  height: 40px;
}
.xypay {
  float: left;
  margin-left: 5px;
  margin-top: 25px;
  color: @baseGary;
}
.backdiv {
  float: right;
  margin-top: 20px;
  margin-right: 20px;
}
.backbtn {
  height: 30px;
  width: 100px;
  border-radius: 0px;
  padding: 0px;
}
.payinfo {
  width: 736px;
  height: 420px;
  border: 1px solid @borderLine;
  margin:0 auto;
}
.payinfoleft {
  width: 280px;
  height: 100%;
  float: left;
  border-right: 1px solid @borderLine;
}
.proimg {
  width: 100px;
  height: 100px;
  margin-top: 30px;
  margin-left: 30px;
}
.version {
  margin-left: 30px;
  margin-top: 30px;
  color: @baseGary;
  font-size: 24px;
}
.description {
  margin-top: 20px;
  margin-left: 30px;
  font-size: 12px;
  color: @neutralGary;
}
.payinforight {
  height: 100%;
  float: left;
  padding: 45px 60px 25px 60px;
  font-size: 14px;
  color: @neutralGary;
}
.payproject {
  margin-bottom: 25px;
}
.paymoney {
  margin-top: 25px;
  margin-bottom: 25px;
}
.protocal {
  padding: 10px;
  background: @Gary;
  a:link {
    color: @tipsBlue;
    text-decoration: none;
  }
  a:visited {
    color: @tipsBlue;
  }
}
.callservice {
  width: 100%;
  text-align: center;
  font-size: @fontSize14;
  margin-top: 30px;
  margin-bottom: 15px;
}
.phone {
  width: 100%;
  text-align: center;
  font-size: @fontSize14;
}
</style>
<style lang="less">
.pay {
  .el-radio-button__inner {
    width: 80px;
    height: 30px;
    line-height: 30px;
    padding: 0px;
  }
  .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 0px;
  }
  .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 0px;
  }
}
</style>
