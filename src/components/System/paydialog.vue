<template>
  <el-dialog title="小亚通|支付平台" v-model="dialogShow" custom-class="paydialog" :close-on-click-modal="false" @open="getPayQrCode" @close="close">
    <div class="pay">
      <!-- <div class="paytitile">
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
      </div> -->
      <div class="payinfo">
        <div class="payinfoleft">
          <!-- <img class="proimg" src="../../assets/img/update.png"> -->
          <svg class="icon function-icon " aria-hidden="true">
            <use :xlink:href="funcIcon()"></use>
          </svg>
          <div class="version">
            <span>{{payobject}}</span>
          </div>
          <div v-if="dialogfunc === 1002 || dialogfunc === 1003" class="description">
            <span>电商订单智能分发全功能</span>
            <br>
            <span>在线邀请供应商入驻无限量</span>
            <br>
            <span>快递面单、发货单快速打印</span>
            <br>
            <span>京东物流仓配服务</span>
            <br>
            <span>在线快速对账结算</span>
            <br>
            <span>实时库存智能管理</span>
            <br>
            <span>多渠道客户统一识别管理</span>
            <br>
            <span>数据中心助力高效运营</span>
            <br>
            <span>专属服务经理</span>
          </div>
          <div v-if="dialogfunc === 1004" class="description">
            <span>线上线下多门店订单智能分发</span>
            <br>
            <span>在线邀请门店入驻无限量</span>
            <br>
            <span>多仓单仓、发货自提全面支持</span>
            <br>
            <span>多门店账号彼此独立</span>
            <br>
            <span>在线快速对账结算</span>
            <br>
            <span>多门店动态库存智能管理</span>
            <br>
            <span>多渠道客户统一识别管理</span>
            <br>
            <span>数据中心助力高效运营</span>
            <br>
            <span>专属服务经理</span>
          </div>
          <div v-if="dialogfunc === 1001" class="description">
            <span>电商订单智能分发全功能</span>
            <br>
            <span>在线邀请供应商入驻无限量</span>
            <br>
            <span>快递面单、发货单快速打印</span>
            <br>
            <span>京东物流仓配服务</span>
            <br>
            <span>在线快速对账结算</span>
            <br>
            <span>实时库存智能管理</span>
            <br>
            <span>多渠道客户统一识别管理</span>
            <br>
            <span>数据中心助力高效运营</span>
            <br>
            <span>专属服务经理</span>
          </div>
          <div v-if="dialogfunc === 1001" class="description">
            <span>电子面单&普通面单双模式打印</span>
            <br>
            <span>对接市场主流物流公司</span>
            <br>
            <span>多渠道订单快速批量打印</span>
            <br>
            <span>无需跨平台即可享受一键打单</span>
          </div>
          <div v-else class="description">
            <span>电子面单&普通面单双模式打印</span>
            <br>
            <span>对接市场主流物流公司</span>
            <br>
            <span>多渠道订单快速批量打印</span>
            <br>
            <span>无需跨平台即可享受一键打单</span>
          </div>
        </div>
        <div class="payinforight">
          <div class="payproject">
            <span>支付项目:</span>
            <span style="margin-left:10px;color:#324057;">{{payobject}}</span>
          </div>
          <div>
            <span>使用周期:</span>
            <el-radio-group v-model="servicetime" @change="getPayQrCode()">
              <el-radio-button label="1">1年</el-radio-button>
              <el-radio-button label="2">2 + 1年</el-radio-button>
            </el-radio-group>
          </div>
          <div class="paymoney">
            <span>支付金额:</span>
            <span style="margin-left:10px;color:#F5A623;">￥{{(parseFloat(payprice)/100).toFixed(2)}}</span>
          </div>
          <div class="protocal">
            <span style="color:#324057;font-size: 12px;">扫码即代表您已同意</span>
            <span style="font-size: 12px;"><a href="javascript:void(0);">《小亚通服务协议》</a></span>
            <br>
            <span style="font-size: 12px;">若使用银行卡付款，请留意银行卡支付限额以具体银行为准</span>
          </div>
          <div class="payarea">
            <div class="payarealeft">
              <canvas id="canvas" width="150" height="150" style="height: 150px;width: 150px;"></canvas>
            </div>
            <div class="payarearight">
              <div class="weixinpay">
                <i class="icon iconfont icon-saoerweima"></i><br>
                <span style="color:#324057;font-size: 14px;">请用</span>
                <svg class="icon weixinicon" aria-hidden="true">
                  <use xlink:href="#icon-weixin"></use>
                </svg>
                <span>扫码完成支付</span>
              </div>
            </div>
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
  </el-dialog>
</template>

<script>
import axios from 'axios'
import qrcode from 'qrcode'
// import qrcode from 'vue-qrcode'
export default {
  name: 'paydialog',
  props: {
    dialog: {
      default: false,
    },
    dialogfunc: {
      default: 0,
    },
    payobject: {
      default: '',
    }
  },
  data() {
    return {
      servicetime: '1',
      qrText: '',
      // options: {
      //   size: 150,
      //   background: '#fff',
      // },
      // size: 150,
      // background: '#fff',
      orderId: 0,
      payprice: 0,
      beattimer: 0,
    }
  },
  computed: {
    dialogShow: {
      get() {
        return this.dialog;
      },
      set(val) {
        if (val || !this.dialog) return;
        this.$emit('cancel');
      }
    },
  },
  components: {
    qrcode
    // mygoods
    // ProductAnalysis
  },
  mounted() {
    // bus.$emit('OrderTapOne')
  },
  methods: {
    funcIcon() {
      let iconcode = '';
      switch (this.dialogfunc) {
        case 1001:
        case 1002:
        case 1003:
        case 1004:
        case 1005:
          iconcode = '#icon-shengji1';
          break;
        case 1101:
          iconcode = '#icon-piliangdadan1';
          break;
        case 1102:
          iconcode = '#icon-piliangdadan1';
          break;
        case 1103:
          iconcode = '#icon-duomendiandinggou';
          break;
        case 1104:
          iconcode = '#icon-kucunguanlidinggou';
          break;
        case 1105:
          iconcode = '#icon-shujuzhongxindinggou';
          break;
        case 1106:
          iconcode = '#icon-kehuguanlidinggou';
          break;
        default:
          iconcode = '#icon-shengji1';
          break;
      }
      return iconcode;
    },
    close() {
      clearInterval(this.beattimer);
      this.$emit('cancel');
    },
    getPayQrCode() {
      let priceId = '';
      if (this.servicetime === '1') {
        priceId = this.dialogfunc + '01';
      } else if (this.servicetime === '2') {
        priceId = this.dialogfunc + '02';
      }
      let query = {
        priceId: priceId
      }
      axios.post('/payment/weixin/generateQR', query)
        .then(res => {
          // this.qrText = res.data.QR;
          let qrText = res.data.QR;
          let canvas = document.getElementById('canvas');
          qrcode.toCanvas(canvas, qrText, error => {
            if (error) console.error(error)
            console.log('success!');
          })
          this.orderId = res.data.orderId;
          this.payprice = res.data.price;
          this.heartbeat(this.orderId);
        })
        .catch(err => {
          this.$message.error({
            message: err.response ? err.response.data : err
          });
        })
    },
    heartbeat(orderId) {
      // var beattimer;
      this.beattimer = setInterval(function() {
        let query = {
          orderIds: [orderId]
        }
        axios.post('/sysmgnt/version/getVersionOrders', query)
          .then(res => {
            let orderStatus = res.data[0].orderStatus;
            if (orderStatus === 1) {
              this.$message.success('支付成功');
              clearInterval(this.beattimer);
              this.confirmPaidResult(orderId);
            } else if (orderStatus === 0) {
              this.$message.error('支付失败');
              clearInterval(this.beattimer);
            }
          })
          .catch(err => {
            this.$message.error({
              message: err.response ? err.response.data : err
            });
          })
      }, 3000);
    },
    confirmPaidResult(orderId) {
      let query = {
        orderId: orderId
      }
      axios.post('/payment/weixin/confirmPaidResult', query)
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
          this.$message.error({
            message: err.response ? err.response.data : err
          });
        })
    }
  },
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
  width: 738px;
  height: 450px;
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
.function-icon {
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
.payarea {
  margin-top: 20px;
}
.payarealeft {
  width: 150px;
  height: 150px;
  float: left;
}
.payarearight {
  height: 150px;
  float:left;
}
.weixinpay {
  width: 100%;
  margin-top: 90px;
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
.weixinicon {
  font-size: 25px;
}
</style>
<style lang="less">
.paydialog {
  min-width: 820px;
}
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
