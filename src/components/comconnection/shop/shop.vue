<template>
  <div class="shop-page">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>我的店铺</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="addShop">
      <el-button type="primary" @click="selectPlatform()">新增 / 重新授权店铺</el-button>
    </div>
    <div class="middle">
      <div class="head">
        <div class="shopName">店铺名称</div>
        <div class="platform">平台</div>
        <div class="authTime">授权时间</div>
        <div class="status">状态</div>
        <div class="action">操作</div>
      </div>
      <div class="body" v-loading="loading" element-loading-text="拼命加载中">
        <template v-if="shopData && shopData.amount">
          <div class="head whiteBg" style="font-size:12px;" v-for="(item, i) in shopData.beanList">
            <div class="shopName">{{item.shopTitle}}</div>
            <div class="platform"><i :class="getIcon(item.platformId)" style="margin-right:5px;"></i>{{getPlatName(item.platformId)}}</div>
            <div class="authTime">{{item.createTime}}</div>
            <div class="status">
              <span v-if="item.authStatus === 0 && item.platformId !== 'OFFLINE'" class="radiusBk" style="background-color:red;color: #FFFFFF;">已失效</span>
              <span v-else-if="item.authStatus === 1 && item.platformId !== 'OFFLINE'" class="radiusBk" style="background-color:blue;color: #FFFFFF;">待激活</span>
              <span v-else-if="item.authStatus === 2 && item.platformId !== 'OFFLINE'" class="radiusBk" style="background-color:green;color: #FFFFFF;">已激活</span>
            </div>
            <div class="action">
              <el-button v-if="item.authStatus === 0 && item.platformId !== 'OFFLINE'" size="small" @click="authshop(item.platformId)">重新授权</el-button>
              <el-button v-else-if="item.authStatus === 1 && item.platformId !== 'OFFLINE'" size="small" @click="activeShop(item.shopId, item.shopTitle, item.platformId)">去激活</el-button>
              <el-button v-if="item.platformId === 'KDT'" size="small" @click="storeManage(item.shopId)">门店管理</el-button>
              <el-button v-if="item.platformId === 'OFFLINE'" size="small" @click="editShop(item)">编辑</el-button>
            </div>
          </div>
        </template>
        <searchNull v-else class="margin-t80" style="padding-top:60px;padding-bottom:60px;"></searchNull>
      </div>
    </div>
    <el-dialog title="新增店铺" v-model="selectPltDialog" size="small" :close-on-click-modal="false">
      <div>
        <span style="margin-right: 15px;">店铺类型</span>
        <el-radio-group v-model="shopType">
          <el-radio label="platform">平台店铺</el-radio>
          <el-radio label="virtual">虚拟店铺</el-radio>
        </el-radio-group>
      </div>
      <div v-if="shopType === 'platform'" class="platformList">
        <span style="margin-right: 15px;font-size: 14px;">选择平台</span>
        <template>
          <el-radio-group v-model="platform">
            <el-radio class="radio" label="KDT">
              <i class="icon iconfont icon-weibiaoti-"></i>
              <span>有赞</span>
            </el-radio>
            <el-radio class="radio" label="TMALL">
              <svg class="icon" aria-hidden="true"><use xlink:href="#icon-taobaotianmao"></use></svg>
              <span>淘宝&天猫</span>
            </el-radio>
            <el-radio class="radio" label="WEIDIAN">
              <svg class="icon" aria-hidden="true"><use xlink:href="#icon-weidian"></use></svg>
              <span>微店</span>
            </el-radio>
          </el-radio-group>
        </template>
      </div>
      <div v-else-if="shopType === 'virtual'" style="margin-top: 10px;">
        <span style="margin-right: 15px;">店铺名称</span>
        <el-input v-model="virtualName" size="small" placeholder="请输入店铺名称" style="width:280px;"></el-input>
      </div>
      <span slot="footer">
        <el-button size="small" @click="cancelSelect">取 消</el-button>
        <el-button size="small" type="primary" @click="authshop('')">提 交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="温馨提示" v-model="dialogVisible" size="tiny">
      <i class="el-icon-information" style="color:#EDC241;font-size:30px;"></i>&nbsp;&nbsp;&nbsp;&nbsp;
      <span style="font-size:22px;font-weight:bold;">{{dialogText}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel">{{cancelBtnText}}</el-button>
        <el-button type="primary" @click="dialogSure">{{sureBtnText}}</el-button>
      </span>
    </el-dialog>
    <el-dialog v-model="activeFailuerDia" size="tiny" top="35%" class="dialog-footer" :close-on-click-modal="false" :show-close="false" :modal="false" custom-class="active-dialog">
      <div class="sync-shop">
        <div class="sync-shop-name"><i :class="failuerCss"></i>{{failuerShop}}</div>
        <div class="sync-shop-content">
          <div class="start">店铺无法激活</div>  
        </div>       
      </div>
      <div style="font-size:12px;color:#F5A623;">店铺内有商品未关联供应商，请先关联</div>
      <span slot="footer">
        <el-button size="small" @click="activeFailuerDia = false">取 消</el-button>
        <el-button size="small" type="primary" @click="linkProduct">去关联商品</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑店铺" v-model="editShopDialog" size="tiny">
      <div>
        <span style="margin-right: 15px;">店铺名称</span>
        <el-input v-model="virtualName" size="small" placeholder="请输入店铺名称" style="width:250px;"></el-input>
      </div>
      <span slot="footer">
        <el-button size="small" @click="editShopDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="shureEdit()">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import Vue from 'vue'
import {
  Dialog,
  Button,
  MessageBox,
} from 'element-ui';
// import {
//   getShopData
// } from './testData'
Vue.use(Dialog)
Vue.use(Button)
export default {
  name: 'myshop',
  data() {
    return {
      loading: false,
      shopData: '',
      shopAmount: 1,
      dialogVisible: false,
      dialogText: '平台店铺是否授权成功？',
      buyAuth: false,
      sureBtnText: '是',
      cancelBtnText: '否',
      selectPltDialog: false,
      platform: '',
      activeFailuerDia: false,
      failuerShop: '',
      failuerCss: '',
      shopType: 'platform',
      virtualName: '',
      editShopDialog: false,
      editShopItem: {},
    }
  },
  methods: {
    queryShop: function(...args) {
      this.loading = true;
      let query = {};
      axios.post('/customer/shopInfo/newQueryShopGroupByPlatform', query).then(res => {
        this.loading = false;
        this.shopData = JSON.parse(res.request.response)
        this.shopAmount = this.shopData.amount;
      }).catch(function(err) {
        this.loading = false;
        MessageBox({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    authshop: function(plat) {
      if (this.shopType === 'virtual') {
        if (this.virtualName === '') {
          this.$message.info('请输入店铺名称！');
          return;
        }
        let query = {
          shopTitle: this.virtualName
        };
        axios.post('/customer/shopInfo/createVirtualShop', query).then(res => {
          this.$message.success('添加成功');
          this.selectPltDialog = false;
          this.queryShop();
        }).catch(function(err) {
          MessageBox({
            message: '操作失败，' + (err.response ? err.response.data : err),
            type: 'error',
          })
        })
      } else {
        if (plat !== '') {
          this.platform = plat;
        }
        if (this.platform === '') {
          this.$message.info('请选择一个平台！');
          return;
        } else if (this.platform === 'TMALL') {
          this.sureBtnText = '我已订购';
          this.cancelBtnText = '去订购';
          this.dialogText = '您是否在淘宝服务市场订购小亚通服务？';
          this.buyAuth = true;
        } else {
          this.sureBtnText = '是';
          this.cancelBtnText = '否';
          this.dialogText = '平台店铺是否授权成功？';
          this.buyAuth = false;
        }
        this.selectPltDialog = false;
        this.dialogVisible = true;
        if (this.platform !== 'TMALL') {
          window.open(axios.defaults.baseURL + 'customer/shopInfo/getShopAuthUrl?platformId=' + this.platform);
        }
      }
    },
    dialogSure: function() {
      if (this.buyAuth) {
        this.sureBtnText = '是';
        this.cancelBtnText = '否';
        this.dialogText = '平台店铺是否授权成功？'
        this.buyAuth = false;
        window.open(axios.defaults.baseURL + 'customer/shopInfo/getShopAuthUrl?platformId=TMALL');
      } else {
        this.dialogVisible = false;
        this.queryShop();
      }
    },
    dialogCancel: function() {
      this.dialogVisible = false;
      if (this.buyAuth) {
        window.open('https://fuwu.taobao.com/ser/detail.htm?spm=0.0.0.0.CkU7Bu&service_code=FW_GOODS-1000357588');
      }
    },
    getIcon: function(platformId) {
      return this.$store.state.enumSet.platform[platformId];
    },
    getPlatName: function(platformId) {
      return this.$store.state.enumSet.platformName[platformId];
    },
    selectPlatform: function() {
      this.platform = '';
      this.selectPltDialog = true;
    },
    cancelSelect: function() {
      this.platform = '';
      this.selectPltDialog = false;
    },
    getProductNumUndefinedSupplier(shopId, shopTitle, platformId) {
      return new Promise((resolve, reject) => {
        let query = {
          shopIds: [shopId],
        };
        let me = this;
        this.axios.post('/product/prodoffering/getProductNumUndefinedSupplier', query).then(res => {
          if (res.data) {
            me.failuerShop = shopTitle;
            me.failuerCss = me.getIcon(platformId);
            me.activeFailuerDia = true;
            // reject('您还有' + res.data + '件商品没有关联供应商');
          } else {
            resolve('success');
          }
        }).catch(err => {
          reject('操作失败，' + (err.response ? err.response.data : err));
        })
      })
    },
    editShopStatus(query) {
      this.axios.post('/order/order/activeShop', query).then(res => {
        this.$message({
          message: '激活成功，系统已开始抓取店铺订单',
          type: 'success',
        })
        this.queryShop();
      }).catch(err => {
        this.$message({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    activeShop(shopId, shopTitle, platformId) {
      let query = {
        shopId: shopId
      };
      this.editShopStatus(query);
      // this.getProductNumUndefinedSupplier(shopId, shopTitle, platformId).then(data => {
      //   console.log('同步订单店铺id:' + shopId);
      //   this.$message({
      //     message: '激活成功，系统已开始抓取店铺订单',
      //     type: 'success',
      //   })
      //   let query = {
      //     shopId: shopId
      //   };
      //   console.log('开始同步订单 入参:' + JSON.stringify(query));
      //   this.editShopStatus(query);
      // }).catch(err => {
      //   this.$message({
      //     message: err,
      //     type: 'warning',
      //   })
      // })
    },
    linkProduct: function() {
      this.activeFailuerDia = false;
      this.$router.push({
        path: '/production',
        query: {
          mark: 'bindPro'
        }
      })
    },
    storeManage: function(shopId) {
      this.$router.push({
        path: '/store',
        query: {
          shopId: shopId
        }
      })
    },
    editShop: function(item) {
      this.virtualName = item.shopTitle;
      this.editShopItem = item;
      this.editShopDialog = true;
    },
    shureEdit: function() {
      let query = {
        shopTitle: this.virtualName,
        platformId: 'OFFLINE',
        shopId: this.editShopItem.shopId,
        shopKeeper: this.editShopItem.shopKeeper,
        contactMobile: this.editShopItem.contactMobile
      };
      axios.post('/customer/shopInfo/updateShopInfo', query).then(res => {
        this.$message.success('修改成功');
        this.editShopDialog = false;
        this.queryShop();
      }).catch(function(err) {
        MessageBox({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    }
  },
  activated() {
    this.queryShop();
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../../main.less';

.shop-page{
  padding: @normalSize;
}

.addShop {
  box-sizing: border-box;
  width: 100%;
  height: 25px;
  font-size: 12px;
  line-height: 25px;
  text-align: right;
  .el-button{
    padding: 5.5px 10px 5.5px 10px;
    border-radius: 0;
  }
}

.middle {
  margin-top: 10px;
  border: solid 1px @borderLine;
}

.head {
  background-color: @tabBg;
  border-top: solid 1px @borderLine;
  display: flex;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  .shopName {
    flex-basis: 40%;
    margin-left: 20px;
  }
  .platform {
    flex-basis: 15%;
    margin-left: 15px;
  }
  .authTime {
    flex-basis: 20%;
    margin-left: 15px;
    text-align: center;
  }
  .status {
    flex-basis: 15%;
    margin-left: 15px;
    text-align: center;
  }
  .action {
    flex-basis: 10%;
    text-align: center;
    .el-button{
      width: 70px;
      padding-top: 5.5px;
      padding-bottom:5.5px;
      // border-radius: 0;
    }
  }
  .radiusBk {
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 12px;
  }
}

.whiteBg {
  background-color: @white;
}

.platformList {
  font-size: 12px;
  margin-top: 10px;
  padding-bottom: @baseSpace*4;
}

.icon_big {
  font-size: 32px;
  margin-left: 20px;
}

.left {
  padding-top: @normalSize;
}

.right {
  padding-top: @largeSize;
}

.channel {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.tb {
  margin: 0;
}

.bottom {
  font-size: 14px;
  padding-top: 100px;
}

.noauth {
  padding-top: 20px;
}

</style>
<style lang="less">
@import '../../../main.less';            

.shop {
  .el-dialog__body {
    padding: @baseSpace*4;
  }
  .el-input {
    width: 360px;
  }
}

.active-dialog {
  .el-dialog__header {
    padding: 0px !important;
    background-color: #FFFFFF !important;
  }
  .el-dialog__body {
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .sync-shop {
    .sync-shop-name {
      margin-top: @baseSize*4;
      margin-bottom: @smallSize;
    }
    .sync-shop-content {
      .start {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
}
</style>
