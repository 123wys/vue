<template>
  <div class="index-right">
    <div class="novice-Boot">
      <svg class="novice-Boot-icon" aria-hidden="true" @click='openNovice'>
        <use xlink:href="#icon-xinshouyindao"></use>
      </svg>
      <span @click='openNovice'>新手引导</span>
    </div>
    <div class="ask-ceo">
      <img src="../../assets/img/ceoLogo.png" />
      <div>
        <p @click='onlineService'>有问题请找我</p>
        <p class="e-c2" @click='onlineService'>CEO随时在线答疑</p>
      </div>
    </div>
    <!-- <div class="ask-ceo" v-if='ichannel.tenantInfo.tenantType != 1'>
      <i class="icon iconfont icon-yaoqingma yaoqingma e-c1-icon" @click='manualInvite'></i>
      <div @click='manualInvite'>
        <p>邀请供应商</p>
        <p class="e-c2">发送邀请码，供应商入驻发货</p>
      </div>
    </div>
    <div class="ask-ceo" v-if='ichannel.tenantInfo.tenantType != 1'>
      <i class="icon iconfont icon-guanlianshangpin guanlianshangpin e-c1-icon" @click='productBind'></i>
      <div @click='productBind'>
        <p>关联商品</p>
        <p class="e-c2">与供应商关联，自营商品设为自营</p>
      </div>
    </div> -->
    <div class="index-Hot" v-if='ichannel.tenantInfo.tenantType != 1'>
      <h2 class="title">
        <span class="title-text">
        <!-- <svg class="icon title-icon" aria-hidden="true"><use xlink:href="#icon-rexiaoshangpin"></use></svg> -->
        近七日热销商品
        </span>
        <router-link :to="{ path: '/productAnalysis' }" class="hot-more">更多</router-link>
      </h2>
      <div v-if='!topSale.length' class="hot-null">暂无排行商品</div>
      <div v-else class="hot-box" v-for='(item,index) in topSale'>
        <div class="hot-img">
          <!-- <img :src="item.imageUrl" /> -->
          <el-popover popper-class="popper-img" trigger="hover" placement="top" :visible-arrow="false">
            <img :src="item.imageUrl">
            <img slot="reference" :src="item.imageUrl" @error='imgErrorHandler(item)'>
          </el-popover>
          <svg class="icon top-icon" aria-hidden="true" v-if='index === 0'>
            <use xlink:href="#icon-rexiaoshangpinjinpai"></use>
          </svg>
          <svg class="icon top-icon" aria-hidden="true" v-if='index === 1'>
            <use xlink:href="#icon-rexiaoshangpinyinpai"></use>
          </svg>
          <svg class="icon top-icon" aria-hidden="true" v-if='index === 2'>
            <use xlink:href="#icon-rexiaoshangpintongpai"></use>
          </svg>
        </div>
        <p class="hot-name" style="-webkit-box-orient: vertical;" v-text='item.skuName' :title='item.skuName'></p>
        <p class="hot-count" v-text='item.skuNumDay'></p>
      </div>
    </div>
  </div>
</template>
<script>
import imgerr from '../../assets/img/imgerror.png'
// import axios from 'axios'
import {
  mapGetters
} from 'vuex'
var querySkuListUrl = '/dataCenter/prodCenter/querySkuList';
export default {
  name: 'index-right',
  data() {
    return {
      mark: '',
      dialogVisible: false,
      dialogVisible2: false,
      shopAmount: '',
      topSale: [],
      ProductNumUndefinedSupplier: 0,
      clientInfo: {}
    };
  },
  computed: {
    ...mapGetters([
      'ichannel'
    ]),
    shopEnum() {
      return this.$store.state.enumSet.shopEnum;
    }
  },
  methods: {
    onlineService() {
      this.clientInfo.name = this.ichannel.tenantInfo.enterpriseTitle;
      this.clientInfo.tel = this.ichannel.tenantInfo.mobile;
      this.clientInfo.address = this.ichannel.tenantInfo.locProvince + this.ichannel.tenantInfo.locCity + this.ichannel.tenantInfo.locDistrict + this.ichannel.tenantInfo.locAddress;
      this.clientInfo.email = this.ichannel.tenantInfo.email;
      this.clientInfo.comment = this.ichannel.tenantInfo.contacts;
      if (this.ichannel.tenantInfo.tenantType === 0) {
        this.clientInfo.gender = '渠道商';
      } else if (this.ichannel.tenantInfo.tenantType === 1) {
        this.clientInfo.gender = '供应商';
      } else {
        this.clientInfo.gender = '渠道商&供应商';
      }
      window.open('https://static.meiqia.com/dist/standalone.html?eid=53091&metadata=' + JSON.stringify(this.clientInfo));
    },
    openNovice() {
      this.$emit('openNovice');
    },
    imgErrorHandler(prod) {
      prod.imageUrl = imgerr;
    },
    getSkuStat() {
      var data = {
        queryCondition: {
          dateTypes: 0
        },
        pageSize: 50,
        pageNumber: 1
      };
      this.axios.post(querySkuListUrl, data).then(res => {
        this.topSale = res.data.beanList.slice(0, 4);
      }).catch(err => {
        this.$message({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    //  查询是否有店铺
    queryShop() {
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
    //  手动邀请
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
    //  获取未关联供应商商品数量
    getProductNumUndefinedSupplier() {
      this.axios.post('/enum/shopInfo', {}).then(res => {
        var a = Object.keys(res.data);
        if (a && !a.length) {
          return false;
        }
        let query = {
          pageNumber: 1,
          pageSize: 1,
          queryCondition: {
            shopId: a,
            nullSupplier: 1
          }
        };
        this.axios.post('/product/prodoffering/queryProducts', query).then(res => {
          this.ProductNumUndefinedSupplier = res.data.amount;
        }).catch(err => {
          this.$message({
            message: '操作失败，' + (err.response ? err.response.data : err),
            type: 'error',
          })
        })
      }).catch(err => {
        this.$message({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    }
  },
  activated() {
    this.queryShop();
    this.getSkuStat();
    this.getProductNumUndefinedSupplier();
  }
}
</script>
<style lang='less' scoped>
@import '../../main.less';
.flex-start {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.index-right {
  width: 300px;
}

a:link {
  color: @baseGary;
  text-decoration: none;
}

a:visited {
  color: @baseGary;
}

.ask-ceo,
.novice-Boot,
.index-Hot {
  border: 1px solid @borderLine;
  width: 100%;
  margin-bottom: 10px;
  background: #fff;
}

.ask-ceo {
  .flex-start;
  padding: 10px 0 10px 15px;
  img {
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-right: 10px;
    transition: all 0.5s;
  }
  img:hover{
    transform: rotate(360deg) scale(2);
  }
  p {
    margin: 0;
    font-size: 14px;
    cursor: pointer;
  }
  .e-c2 {
    width: 100%;
    margin-top: 7px;
    font-size: 12px;
    line-height: 12px;
    color: @lightGary;
  }
  .yaoqingma{
    color: @dangerRed;
  }
  .guanlianshangpin{
    color: @warningYellow;
  }
  .e-c1-icon{
    cursor: pointer;
    font-size: 25px;
    margin-right: 15px;
    transition: all 1s;
  }
  .e-c1-icon:hover{
    transform: rotateY(180deg);
  }
}

.novice-Boot {
  .flex-start;
  height: 51px;
  padding: 0 10px 0 15px;
  .novice-Boot-icon {
    width: 28px;
    height: 28px;
    margin-right: 10px;
    cursor: pointer;
  }
  span {
    font-size: 24px;
    color: @primaryBlue;
    cursor: pointer;
  }
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 10px 0 15px;
  height: 45px;
  margin: 0;
  font-weight: normal;
  font-size: 14px;
  color: @baseGary;
  border-bottom: 1px solid @borderLine;
  .title-icon {
    width: 15px;
    height: 15px;
    margin-right: 9px;
  }
  .title-text {
    height: 21px;
    line-height: 21px;
  }
}


.hot-null {
  .flex-center;
  height: 75px;
  color: @lightGary;
}

.index-Hot {
  .hot-box {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: 280px;
    height: 75px;
    padding: 10px 0 10px 0;
    margin: 0 auto;
    border-bottom: 1px dashed @borderLine;
    .hot-img {
      position: relative;
      .flex-center;
      width: 55px;
      height: 55px;
      margin-left: 10px;
      border: 1px solid @borderLine;
      img {
        width: 55px;
        height: 55px;
      }
      .top-icon {
        position: absolute;
        width: 20px;
        height: 20px;
        top: -5px;
        left: -5px;
      }
    }
    .hot-name {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      align-self: flex-start;
      /*width: 127px;*/
      flex-basis: 131px;
      max-height: 48px;
      padding: 2px 0 0 10px;
      margin: 0;
      text-align: justify;
      color: @neutralGary;
    }
    .hot-count {
      /*width: 70px;*/
      flex-basis: 78px;
      padding: 2px 5px 0 10px;
      margin: 0;
      text-align: right;
      font-size: 12px;
      color: @baseGary;
      font-weight: bold;
    }
  }
  .hot-more {
    display: inline-block;
    height: 21px;
    line-height: 21px;
    font-size: 12px;
    color: @lightGary;
  }
}
</style>
