<template>
  <div class="help">
    <h1 class="title">开启小亚通的轻电商之旅，只需简单三步！<el-button size="small" class='iknow' @click='iknow'>我知道了</el-button></h1>
    <div class="modul-A">
      <div class="lg-cir">
        <div class="sm-cir">01</div>
      </div>
      <div class="head-box">
        <svg class="icon title-icon" aria-hidden="true">
          <use xlink:href="#icon-xinzengshouquandianpu"></use>
        </svg>
        <span class="title-name">店铺授权</span>
      </div>
      <h2 class="subTitle">授权成功后，系统将自动下载商品&订单</h2>
      <ul class="process">
        <li><a href='https://mp.weixin.qq.com/s?__biz=MzI3MDYzMzU3OA==&mid=100000214&idx=1&sn=336fa2f4a089cf50dc0318d5e79bfa4c&chksm=6acf5ed35db8d7c5025957ac7ce300d5e2adc80fc022e4f3d50990cea605b5bd9e1e83c49a30&scene=0&key=101a24050fd304bb82392ff5f4ceb7216185dbc3d9e46d654002a2a7b766794a230549f559582e18e259dfe34369f82574ec45101a9ca46c1ae239fe44e541d39e561e452bc616f072ed1dca81cb98a7&ascene=0&uin=MjI4NTMxNjU4MQ%3D%3D&devicetype=iMac+MacBookPro11%2C4+OSX+OSX+10.12.4+build(16E195)&version=12020110&nettype=WIFI&fontScale=100&pass_ticket=k3lPkiwOQS%2FmVAsrb0dixE6k2R9zCg7iy8ZpDwtNrXQ3smfrVOEucHfebmTmD4fZ' target='_blank'>淘宝&天猫授权流程</a></li>
        <li><a href='https://mp.weixin.qq.com/s?__biz=MzI3MDYzMzU3OA==&mid=100000215&idx=1&sn=c438a55c18e374b23c707045f347fc5f&chksm=6acf5ed25db8d7c4fff9c69d5aaa00f7f25dfd5de9fb0cfb82b6bdfbf9171ec0f38d64044f9e&scene=0&key=6c635715766a9eaaa7600766fbdc4615da21bf8806cc48c08cba51659a7bad09777df47d8647f94f3f6a1df9ac2c8b481c9094474979dc6e222748f2957d47c783edc74d83f30a5e9eba5854ece9e731&ascene=0&uin=MjI4NTMxNjU4MQ%3D%3D&devicetype=iMac+MacBookPro11%2C4+OSX+OSX+10.12.4+build(16E195)&version=12020110&nettype=WIFI&fontScale=100&pass_ticket=k3lPkiwOQS%2FmVAsrb0dixE6k2R9zCg7iy8ZpDwtNrXQ3smfrVOEucHfebmTmD4fZ' target='_blank'>有赞授权流程</a></li>
      </ul>
      <div class="icon-box">
        <a href='javascript:void(0)' @click='authshop("KDT")'>
          <svg class="icon auth-icon" aria-hidden="true">
            <use xlink:href="#icon-weibiaoti-"></use>
          </svg>
        </a>
        <a href='javascript:void(0)' @click='authshop("TMALL")'>
          <svg class="icon auth-icon" aria-hidden="true">
            <use xlink:href="#icon-tianmao1"></use>
          </svg>
        </a>
        <a href='javascript:void(0)' @click='authshop("TMALL")'>
          <svg class="icon auth-icon" aria-hidden="true">
            <use xlink:href="#icon-taobao"></use>
          </svg>
        </a>
        <a href='javascript:void(0)' @click='authshop("WEIDIAN")'>
          <svg class="icon auth-icon" aria-hidden="true">
            <use xlink:href="#icon-weidian"></use>
          </svg>
        </a>
      </div>
    </div>
    <div class="Arrow">
      <svg class="icon Arrow-icon" aria-hidden="true">
        <use xlink:href="#icon-jiantou"></use>
      </svg>
    </div>
    <div class="modul-B" v-if='ichannel.tenantInfo.tenantType != 1'>
      <div class="lg-cir">
        <div class="sm-cir">02</div>
      </div>
      <div class="head-box">
        <svg class="icon title-icon" aria-hidden="true">
          <use xlink:href="#icon-yaoqinggongyingshang"></use>
        </svg>
        <span class="title-name">邀请供应商</span>
      </div>
      <h2 class="subTitle">由供应商直接发货代销的商品</h2>
      <ul class="process">
        <li><a href='https://mp.weixin.qq.com/s?__biz=MzI3MDYzMzU3OA==&mid=100000216&idx=1&sn=d3670b33d6e9917c92211dba6d2178e5&chksm=6acf5edd5db8d7cb47bbe5d32624064adffdfd05a3124a7ec680b2e4cb75d2d9e4b25122cba2&scene=0&key=019f1c355eb8650a3fed4709b8a9c0bfa163ab8cdeb84bc57d44a56eddf06b8877bd84627e03bd5a7b424b2deb0142edf548067cfa088e56828169960a1b6f44a414f9c1d08b7220f5945c862148ed86&ascene=0&uin=MjI4NTMxNjU4MQ%3D%3D&devicetype=iMac+MacBookPro11%2C4+OSX+OSX+10.12.4+build(16E195)&version=12020110&nettype=WIFI&fontScale=100&pass_ticket=k3lPkiwOQS%2FmVAsrb0dixE6k2R9zCg7iy8ZpDwtNrXQ3smfrVOEucHfebmTmD4fZ' target="_blank">如何邀请供应商</a></li>
        <li><a href='https://mp.weixin.qq.com/s?__biz=MzI3MDYzMzU3OA==&mid=100000217&idx=1&sn=ad222de8cba9fc006d2d78908f84bba8&chksm=6acf5edc5db8d7ca2dd165a17cea2cfbb1beadc028a4cda6dca6ac761d6bda52ae103e2988a6&scene=0&key=75c7c3229dd8353ac60884acb79b42f4916a389c77bcfcaff4b72fd3f5bd2a3c315f80202577079a2e44a63a9ee75c11a9d83720024cff7fe4b22141fe0e0bc1c70cb1c42fd0fadd6865a10ee2c26347&ascene=0&uin=MjI4NTMxNjU4MQ%3D%3D&devicetype=iMac+MacBookPro11%2C4+OSX+OSX+10.12.4+build(16E195)&version=12020110&nettype=WIFI&fontScale=100&pass_ticket=k3lPkiwOQS%2FmVAsrb0dixE6k2R9zCg7iy8ZpDwtNrXQ3smfrVOEucHfebmTmD4fZ' target='_blank'>供应商如何接受邀请</a></li>
      </ul>
      <p class="tip">您的供应商将收到小亚通系统发送的<span>邀请短信</span>，供应商凭<span>邀请码注册入驻系统</span>。</p>
      <h2 class="subTitle">如果您的商品全部为自营，可以忽略次操作。</h2>
      <div class="btn">
        <el-button type="primary" @click='manualInvite' size='small' style='width:200px'>立即邀请供应商</el-button>
      </div>
    </div>
    <div class="Arrow">
      <svg class="icon Arrow-icon" aria-hidden="true">
        <use xlink:href="#icon-jiantou"></use>
      </svg>
    </div>
    <div class="modul-C" v-if='ichannel.tenantInfo.tenantType != 1'>
      <div class="lg-cir">
        <div class="sm-cir">03</div>
      </div>
      <div class="head-box">
        <svg class="icon title-icon" aria-hidden="true">
          <use xlink:href="#icon-guanlianshangpin"></use>
        </svg>
        <span class="title-name">商品关联供应商</span>
      </div>
      <h2 class="subTitle">关联后，订单将自动拆单分发、结算</h2>
      <p class="tip">指定您的商品由哪个供应商发货，设置后系统将自动拆分订单并分发给对应的供应商。</p>
      <p class="tip">并按商品关联规则分发给相应的供应商。</p>
      <h2 class="subTitle">如果您的商品全部为自营，可以忽略次操作。</h2>
      <div class="btn">
        <el-button type="primary" @click='productBind' size='small' style='width:200px'>商品关联供应商</el-button>
      </div>
    </div>
    <el-dialog title="温馨提示" v-model="dialogVisible" size="tiny">
      <i class="el-icon-information" style="color:#EDC241;font-size:30px;"></i>&nbsp;&nbsp;&nbsp;&nbsp;
      <span style="font-size:22px;font-weight:bold;">平台店铺是否授权成功？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assotFail">否</el-button>
        <el-button type="primary" @click="assotSuccess">是</el-button>
      </span>
    </el-dialog>
    <el-dialog title="温馨提示" v-model="dialogVisible2" size="tiny">
      <i class="el-icon-information" style="color:#EDC241;font-size:30px;"></i>&nbsp;&nbsp;&nbsp;&nbsp;
      <span style="font-size:22px;font-weight:bold;">是否已订购小亚通服务？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="notBuy">否</el-button>
        <el-button type="primary" @click="dialogVisible2 = false">是</el-button>
      </span>
    </el-dialog>
    <el-dialog title="温馨警告" v-model="dialogVisible3" size="tiny">
      <span>当前存在<span style='color:#F7BA2A;font-size:16px'>{{unbindProduct}}</span>件未关联供应商商品<br/>若选择同步订单,与该商品关联的订单都会进入到问题订单中</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible3 = false">取消同步</el-button>
    <el-button type="primary" @click="downloadOrderWithUndefined">同步订单</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'help',
  data() {
    return {
      mark: '',
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      unbindProduct: 0,
      shopAmount: '',
    }
  },
  computed: {
    ...mapGetters([
      'ichannel'
    ])
  },
  activated() {
    this.queryShop();
  },
  methods: {
    iknow() {
      this.$router.go(-1);
    },
    //  未订购小亚通服务
    notBuy() {
      window.open('https://fuwu.taobao.com/ser/detail.htm?spm=0.0.0.0.CkU7Bu&service_code=FW_GOODS-1000357588');
    },
    //  授权成功
    assotSuccess() {
      this.dialogVisible = false;
      window.location.reload();
    },
    assotFail() {
      if (this.mark === 'KDT' || this.mark === 'WEIDIAN') {
        this.dialogVisible = false;
      } else {
        this.dialogVisible = false;
        setTimeout(() => {
          this.dialogVisible2 = true;
        }, 500);
      }
    },
    //  查询是否有店铺
    queryShop(...args) {
      let query = {};
      this.axios.post('/customer/shopInfo/queryShopGroupByPlatform', query).then(res => {
        this.shopAmount = res.data.amount;
      }).catch(err => {
        this.$message({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    //  店铺受权
    authshop(platform) {
      this.dialogVisible = true;
      this.mark = platform;
      window.open(axios.defaults.baseURL + 'customer/shopInfo/getShopAuthUrl?platformId=' + platform);
    },
    //  商品关联
    productBind() {
      if (!this.shopAmount) {
        this.$message({
          message: '商品关联供应商，请先添加至少一个店铺',
          type: 'error',
        })
        return false;
      }
      this.$router.push({
        path: '/production',
        query: {
          mark: 'bindPro'
        }
      })
    },
    //  手动邀请供应商
    manualInvite() {
      if (!this.shopAmount) {
        this.$message({
          message: '邀请供应商前，请先添加至少一个店铺',
          type: 'error',
        })
        return false;
      }
      this.$router.push({
        path: '/inviteSupplier'
      })
    },
    getProductNumUndefinedSupplier() {
      return new Promise((resolve, reject) => {
        let query = {};
        this.axios.post('/product/prodoffering/getProductNumUndefinedSupplier', query).then(res => {
          if (res.data) {
            //  一会修改
            this.dialogVisible3 = true;
            this.unbindProduct = res.data;
            // reject('您还有' + res.data + '件商品没有关联供应商');
            reject();
          } else {
            resolve('success');
          }
        }).catch(err => {
          reject('操作失败，' + (err.response ? err.response.data : err));
        })
      })
    },
    getShopIdArr() {
      return new Promise((resolve, reject) => {
        let query = {};
        this.axios.post('/customer/shopInfo/queryShopGroupByPlatform', query).then(res => {
          var shopIdArr = [];
          var noAuth = [];
          var allShop = [];
          var data = res.data;
          if (!data.amount) {
            reject('您还没有授权店铺');
          };
          for (var item in data) {
            if (item !== 'amount') {
              for (var i = data[item].length - 1; i >= 0; i--) {
                allShop.push(data[item][i].shopId);
                if (data[item][i].authStatus === 1) {
                  shopIdArr.push(data[item][i].shopId);
                } else {
                  if (data[item][i].authStatus === 0) {
                    noAuth.push(data[item][i].shopId);
                  }
                }
              }
            }
          }
          if (shopIdArr.length) {
            resolve(shopIdArr);
          } else {
            var has = allShop.length - shopIdArr.length - noAuth.length;
            var auth = allShop.length - noAuth.length;
            reject('当前授权店铺共：' + auth + '家，已经同步：' + has + '家，' + '未授权：' + noAuth.length + '家');
          }
        }).catch(err => {
          reject('操作失败，' + (err.response ? err.response.data : err));
        })
      })
    },
    activeShop(query) {
      this.axios.post('/order/order/activeShop', query).then(res => {}).catch(err => {
        this.$message({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    downloadOrderWithUndefined() {
      this.getShopIdArr().then(shopIdArr => {
        // console.log('同步订单店铺id:' + shopIdArr);
        this.$message({
          message: '操作成功，正在同步' + shopIdArr.length + '家店铺订单',
          type: 'success',
        })
        for (var i = shopIdArr.length - 1; i >= 0; i--) {
          let query = {
            shopId: shopIdArr[i]
          };
          // console.log('开始同步订单 入参:' + JSON.stringify(query));
          this.dialogVisible3 = false;
          this.activeShop(query);
        }
      }).catch(err => {
        this.dialogVisible3 = false;
        this.$message({
          message: err,
          type: 'warning',
        })
      })
    },
    downloadOrder() {
      this.getProductNumUndefinedSupplier().then(data => {
        return this.getShopIdArr();
      }).then(shopIdArr => {
        // console.log('同步订单店铺id:' + shopIdArr);
        this.$message({
          message: '操作成功，正在同步' + shopIdArr.length + '家店铺订单',
          type: 'success',
        })
        for (var i = shopIdArr.length - 1; i >= 0; i--) {
          let query = {
            shopId: shopIdArr[i]
          };
          // console.log('开始同步订单 入参:' + JSON.stringify(query));
          this.activeShop(query);
        }
      }).catch(err => {
        if (err) {
          this.$message({
            message: err,
            type: 'warning',
          })
        }
      })
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.iknow {
  width: 80px;
  margin-left: 30px;
  vertical-align: top;
}

.help {
  color: @lightBlack;
  padding: 50px 0 0 50px;
}

.title {
  margin: 0 0 80px 0;
  height: 30px;
  line-height: 30px;
  font-size: 24px;
  color: @leftmenuBg;
  font-weight: normal;
}

.head-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .title-icon {
    width: 25px;
    height: 25px;
    margin-right: @baseSpace*4;
  }
  .title-name {
    font-size: 18px;
    color: @leftmenuBg;
  }
}

.subTitle {
  margin: 10px 0 10px 0;
  font-size: @baseFont;
  color: @lightGary;
  font-weight: normal;
}

.loadOrder {
  font-size: 18px;
  color: @leftmenuBg;
}

.process {
  color: @tipsBlue;
  li {
    margin-bottom: 10px;
  }
  a:link {
    color: @tipsBlue;
    text-decoration: none;
  }
  a:visited {
    color: @tipsBlue;
  }
}

.icon-box {
  height: 50px;
  margin-bottom: @baseSpace*6;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .auth-icon {
    margin-right: @baseSpace*5;
    width: 36px;
    height: 36px;
  }
}
.Arrow-icon{
  width: 20px;
  height: 27px;
}
.tip {
  color: @baseGary;
  span {
    color: @warningYellow;
  }
}

.btn {
  text-align: center;
  margin-top: 20px;
}
.modul-A,.modul-B,.modul-C{
  position: relative;
  box-sizing: border-box;
  float: left;
  width: 320px;
  height: 400px;
  padding: 80px 30px 30px;
  background-color: #fff;
  border: 1px solid @borderLine;
  border-radius: 10px;
  box-shadow: 0px 0px 5px #ccc;
  margin-bottom: 10px;
}
.Arrow{
  float: left;
  width: 40px;
  height: 400px;
  text-align: center;
  line-height: 400px;
}
.lg-cir{
  position: absolute;
  display: flex;
  justify-content:center;
  align-items:center;
  width: 100px;
  height: 100px;
  border: 1px solid @borderLine;
  border-radius: 50%;
  background-color: #F9FAFC;
  box-shadow: 0px 0px 5px #ccc;
  left: 50%;
  top: 0%;
  transform: translate(-50%,-50%);
  .sm-cir{
    width:70px;
    height:70px;
    border-radius: 50%;
    border: 1px solid @borderLine;
    background-color: @primaryBlue;
    text-align: center;
    line-height: 70px;
    color: #fff;
    font-size: 36px;
  }
}
</style>
