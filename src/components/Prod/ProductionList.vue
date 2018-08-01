<template>
  <div class="production-list" v-loading="loading">
    <div class="list">
      <div class="head">
        <span class="title">商品/规格</span>
        <span class="price">单价</span>
        <!-- <span class="stock">库存</span> -->
        <!-- <span class="sold">销量</span> -->
        <span class="create">上架时间</span>
        <span class="agent">供应商</span>
        <span class="action">操作</span>
      </div>
      <div class="list-action">
        <el-checkbox v-model="sellectAll">全选</el-checkbox>
        <el-button size="small" @click="setSelfBatch">批量设为自营</el-button>
        <el-button v-if="nullSupplier === 1" size="small" @click="showSupplierTenantDialog()">批量关联供应商</el-button>
        <el-button v-else size="small" @click="showSupplierTenantDialog()">批量更换供应商</el-button>
        <div class="check">
          <el-checkbox v-model="hideSku">隐藏规格详情</el-checkbox>
        </div>
        <paging :page-size="pageSize" :page-number="pageNumber" :total='offeringDate.amount' @current-change="currentChangeHandler"></paging>
      </div>
      <div v-if="reminder" class="warning-bunner"><i class="iconfont icon-jinggao yellow warning-icon"></i>
        <div class="warning-content"><span class="warning-title">您有新的商品未关联供应商</span>
          <el-button class="warning-btn" type="text" size="small" @click="$emit('warning', 'link')">去关联</el-button>
          <i class="warning-closebtn el-icon-close" @click="$emit('warning', 'close')"></i></div>
      </div>
      <template v-if="offeringDate && offeringDate.amount">
        <div class="body" v-loading="searchLoading" element-loading-text="拼命加载中...">
          <div class="prod" v-for="(offering,index) of offeringDate.offeringList" :key="offering.offeringId">
            <div class="prodmsg">
              <div class="title">
                <div class="title-left">
                  <el-checkbox class="check" v-model="selects[index]"></el-checkbox>
                  <el-popover popper-class="popper-img" trigger="hover" placement="top" :visible-arrow="false">
                    <img :src="offering.imageFileName">
                    <img class="title-img" slot="reference" :src="offering.imageFileName" @error='imgErrorHandler(offering)'>
                  </el-popover>
                </div>
                <div class="title-right">
                  <div class="name" v-text="offering.offeringName"></div>
                  <el-tag type="warning" v-if="offering.isPresale">预售</el-tag>
                  <div class="shop"><i :class="getIcon(offering.platformId)"></i>{{shopEnum[offering.shopId]}}</div>
                  <div class="catalog" v-text="offering.catalogName"></div>
                </div>
              </div>
              <div class="price"></div>
              <!-- <div class="stock" v-text="offering.stockNum"></div> -->
              <!-- <div class="sold" v-text="offering.soldNum"></div> -->
              <div class="create" v-text="offering.createDate"></div>
              <div class="agent" v-text="tenantEnum[offering.supplierTenantId]"></div>
              <div class="action" key="1">
                <template v-if="offering.supplierTenantId">
                  <el-button size="small" :disabled="syncloading[index].flag" @click="syncProd(offering.shopId, offering.outerOfferingId, index)" v-text="syncloading[index].text"></el-button>
                  <!-- <el-button size="small" @click="showSupplierTenantDialog([offering.offeringId],offering.supplierTenantId+'')">更换供应商</el-button> -->
                  <el-button size="small" @click="showSupplierTenantDialog([offering], offering.supplierTenantId+'')">更换供应商</el-button>
                </template>
                <el-button v-else size="small" @click="showSupplierTenantDialog([offering])" key="2">关联供应商</el-button>
                <el-button size="small" @click="showNameDialogHandler(offering)">修改名称</el-button>
              </div>
            </div>
            <div class="sku" v-for="(sku, j) of offering.skuList" :key="sku.skuId" v-show="!hideSku">
              <div class="title">
                <div class="title-left"></div>
                <div class="title-right">
                  <div class="name" v-text="sku.skuCharSpec"></div>
                  <div class="catalog">商家自编码：<span v-text="sku.outerId"></span></div>
                </div>
                <div class="cycleSign" v-if="sku.skuType === 3">
                  <svg class="icon cycleIcon" aria-hidden="true">
                    <use xlink:href="#icon-zhouqipei"></use>
                  </svg>
                </div>
              </div>
              <div class="price" v-text="sku.price"></div>
              <!-- <div class="stock" v-text="sku.stockNum"></div> -->
              <!-- <div class="sold" v-text="sku.soldNum"></div> -->
              <div class="create"></div>
              <div class="agent"></div>
              <div class="cycleSend">
                <el-button size="small" @click="cycleSend(offering, j)">周期送</el-button>
              </div>
            </div>
          </div>
        </div>
      </template>
      <searchNull v-else></searchNull>
    </div>
    <pagination class="pl" v-model="sellectAll" @size-change="sizeChangeHandler" @current-change="currentChangeHandler" :current-page="pageNumber" :page-sizes="[20, 50, 100]" :page-size="pageSize" :total="offeringDate.amount"></pagination>
    <!-- <span>商品列表为空，去</span>
      <el-button type="primary" size="large" @click="syncShop"><i class="icon iconfont icon-daoru1"></i>同步店铺商品</el-button> -->
    <el-dialog :title="dialogTitle" size="tiny" v-model="dialogSupplierTenant" @close="clearForm">
      <div class="dialog-body">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item prop="selectedSupplierTenant" v-if="dialogMode===1">
            <el-select v-model="form.selectedSupplierTenant" class="select" placeholder="请选择" filterable>
              <el-option v-for="(val, key) in supplierEnum" :label="val" :value="key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="offeringName" v-if="dialogMode===2">
            <el-input v-model="form.offeringName" size="small" placeholder="请输入名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="dialogSupplierTenant = false" size="small">取 消</el-button>
        <el-button type="primary" @click="dialogSure" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  mapState
} from 'vuex';
import axios from 'axios';
import Paging from '../common/Paging'
import Pagination from '../common/Pagination'
import imgerr from '../../assets/img/imgerror.png'
const setProductSupplierUrl = '/product/prodoffering/setProductSupplier';
const syncProductUrl = '/product/prodoffering/requestForSyncProduct';
const setOfferingNameUrl = '/product/prodoffering/setOfferingName';
// let undisorderUrl = 'order/order/batchConvert';
// let imgPre = 'http://images.i-boss.cn/';
const dialogMode = {
  supplier: 1,
  offeringName: 2,
}
export default {
  name: 'production-list',
  props: {
    offeringDate: {
      default: {
        amount: 0,
        offeringList: [],
      },
    },
    searchLoading: {
      default: false,
    },
    pageSize: '',
    pageNumber: '',
    nullSupplier: '',
    shopList: '',
    extOrdId: '',
    reminder: '',
  },
  components: {
    Paging,
    Pagination
  },
  data() {
    return {
      syncloading: [],
      hideSku: false,
      // hideSku: window.localStorage.hideSku === 'true',
      selects: [],
      dialogSupplierTenant: false,
      offeringIds: [],
      offeringNames: [],
      // selectOffers: [],
      shopIds: [],
      skuIds: [],
      form: {
        selectedSupplierTenant: '',
        offeringName: '',
      },
      selectedTemp: '',
      loading: false,
      rules: {
        selectedSupplierTenant: {
          required: true,
          message: '请选择',
          trigger: 'submit',
        },
        offeringName: {
          required: true,
          message: '请输入',
          trigger: 'submit',
        },
      },
      dialogMode: '',
      offeringId: '',
    }
  },
  computed: {
    sellectAll: {
      get() {
        return this.selects.length > 0 && this.selects.every(n => n);
      },
      set(val) {
        this.selects.forEach((n, i) => {
          this.selects.splice(i, 1, val);
        })
      },
    },
    sellectedIds() {
      let sellectedIds = [];
      let sOffers = [];
      this.selects.forEach((n, i) => {
        if (n) {
          sellectedIds.push(this.offeringDate.offeringList[i].offeringId);
          sOffers.push(this.offeringDate.offeringList[i]);
        }
      });
      this.selectOffers = sOffers;
      return sellectedIds;
    },
    selectOffers() {
      let sOffers = [];
      this.selects.forEach((n, i) => {
        if (n) {
          sOffers.push(this.offeringDate.offeringList[i]);
        }
      });
      return sOffers;
    },
    dialogTitle() {
      if (this.dialogMode === dialogMode.offeringName) return '修改商品名称';
      return '关联供应商';
    },
    // sellectedofferingNames() {
    //   let sellectedofferingNames = [];
    //   this.selects.forEach((n, i) => {
    //     if (n) {
    //       sellectedofferingNames.push(this.offeringDate.offeringList[i].offeringName)
    //     }
    //   });
    //   return sellectedofferingNames;
    // },
    ...mapState({
      supplierEnum: state => state.enumSet.supplierEnum,
      shopEnum: state => state.enumSet.shopEnum,
    }),
    tenantEnum() {
      return this.$store.getters.tenantEnum;
    },
  },
  methods: {
    cycleSend(prodList, prodIndex) {
      prodList.prodIndex = prodIndex;
      window.sessionStorage.cycleSendData = JSON.stringify(prodList);
      this.$router.push('/cycleSend');
    },
    sizeChangeHandler(pageSize) {
      this.$emit('size-change', pageSize);
    },
    currentChangeHandler(pageNumber) {
      this.$emit('current-change', pageNumber);
    },
    syncProd(shopId, outerOfferingId, index) {
      this.syncloading.splice(index, 1, {
        flag: true,
        text: '同步中',
      });
      axios.post(syncProductUrl, {
        shopId,
        outerOfferingId,
      }).then(response => {
        window.setTimeout(() => {
          this.syncloading.splice(index, 1, {
            flag: false,
            text: '同步'
          });
          this.$message.success('同步成功！');
        }, 10000);
      }).catch(err => {
        this.syncloading.splice(index, 1, {
          flag: false,
          text: '同步'
        });
        this.$msgbox({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        });
      })
    },
    imgErrorHandler(offering) {
      offering.imageFileName = imgerr;
    },
    setSelfBatch() {
      if (!this.sellectedIds.length) {
        this.$message.error('请至少选择一项！');
      } else {
        this.loading = true;
        this.offeringIds = this.sellectedIds;
        this.skuIds = this.selectOffers.reduce((prve, curr) => {
          prve = prve.concat(curr.skuList.map(sku => sku.skuId));
          return prve;
        }, []);
        this.relateSupplierTenant(this.$store.getters.ichannel.tenantInfo.tenantId);
      }
    },
    showSupplierTenantDialog(offerings = this.selectOffers, supplierTenantId = this.selectedTemp) {
      let shopIds = [];
      for (var i = 0; i < this.shopList.length; i++) {
        shopIds[i] = this.shopList[i].shopId;
      }
      if (!offerings.length) {
        this.$message.error('请至少选择一项！');
      } else {
        let offeringIds = [];
        let skuIds = [];
        for (let j = 0; j < offerings.length; j++) {
          offeringIds.push(offerings[j].offeringId);
          for (let m = 0; m < offerings[j].skuList.length; m++) {
            skuIds.push(offerings[j].skuList[m].skuId);
          }
        }
        this.dialogMode = dialogMode.supplier;
        this.dialogSupplierTenant = true;
        this.offeringIds = offeringIds;
        this.skuIds = skuIds;
        // this.offeringNames = offeringNames;
        this.shopIds = shopIds;
        if (typeof this.supplierEnum[supplierTenantId] !== 'undefined') {
          this.form.selectedSupplierTenant = supplierTenantId;
        }
      }
    },
    showNameDialogHandler(offering) {
      this.offeringId = offering.offeringId;
      this.form.offeringName = offering.offeringName;
      this.dialogMode = dialogMode.offeringName;
      this.dialogSupplierTenant = true;
    },
    dialogSure() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false;
        }
        this.dialogSupplierTenant = false;
        this.loading = true;
        if (this.dialogMode === dialogMode.supplier) {
          this.selectedTemp = this.form.selectedSupplierTenant;
          this.relateSupplierTenant()
        } else if (this.dialogMode === dialogMode.offeringName) {
          axios.post(setOfferingNameUrl, {
            offeringId: this.offeringId,
            name: this.form.offeringName,
          }).then(response => {
            this.loading = false;
            this.$message.success('设置成功');
            this.$parent.queryHandler();
          }).catch(err => {
            this.loading = false;
            this.$msgbox({
              message: '操作失败，' + (err.response ? err.response.data : err),
              type: 'error',
            });
          })
        }
      })
    },
    relateSupplierTenant(supplierTenantId = this.form.selectedSupplierTenant) {
      axios.post(setProductSupplierUrl, {
        offeringIds: this.offeringIds,
        supplierTenantId,
        skuIds: this.skuIds,
        // offeringNames: this.offeringNames,
        shopIds: this.shopIds,
      }).then(() => {
        this.loading = false;
        this.$message.success('关联成功');
        this.$parent.queryHandler();
        // if (this.extOrdId !== '') {
        //   let me = this;
        //   let extOrdIds = [this.extOrdId];
        //   axios.post(undisorderUrl, {
        //     extOrderIds: extOrdIds,
        //   }).then(() => {
        //     me.loading = false;
        //     me.$message.success('关联成功');
        //     me.$parent.queryHandler();
        //   }).catch(err => {
        //     me.loading = false;
        //     me.$msgbox({
        //       message: '订单流转失败，' + (err.response ? err.response.data : err),
        //       type: 'error',
        //     })
        //   })
        // } else {
        //   this.$parent.queryHandler();
        // }
      }).catch(err => {
        this.loading = false;
        this.$msgbox({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    getIcon(platformId) {
      return this.$parent.getIcon(platformId);
    },
    clearForm() {
      if (this.dialogMode === dialogMode.supplier) {
        this.$refs.form.resetFields();
      }
    },
  },
  watch: {
    offeringDate: {
      handler(val) {
        let length = val.offeringList.length
        this.syncloading = new Array(length).fill({
          flag: false,
          text: '同步',
        });
        this.selects = new Array(length).fill(false);
      },
      immediate: true,
    },
    hideSku(val) {
      window.localStorage.hideSku = val;
    },
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../../main.less';
.production-list {}

.icon.iconfont {
  margin-right: @baseSize;
}

.head {
  padding: @baseSize*2 @baseSize*3;
  background-color: @tabBg;
  border: solid 1px @borderLine;
  border-bottom: none;
  font-size: 14px;
  display: flex;
  .title {
    padding-left: 87px;
  }
}

.list-action {
  border: solid 1px @borderLine;
  border-top: none;
  background-color: @white;
  padding: @baseSize @baseSize*3;
  margin-bottom: 10px;
  display: flex;
  align-items: baseline;
  >*+* {
    /*border-radius: 0;*/
    margin-left: @baseSize*3;
  }
  .check {
    flex-grow: 1;
  }
}

.body {
  background-color: @white;
}

.prod {
  border: solid 1px @borderLine;
  /*border-top: none;*/
  + .prod {
    border: solid 1px @borderLine;
    margin-top: @baseSpace*2;
  }
}

.prod:hover {
  background-color: @tabBg;
  transition: background-color 0.3s;
}

.prodmsg,
.sku {
  display: flex;
  padding: @baseSize*2 @baseSize*3;
}

.sku {
  padding-left: @baseSize*3;
  .title {
    padding-left: 87px;
  }
}

.prodmsg + .sku {
  border-top: solid 1px @borderLine;
}

.sku + .sku {
  border-top: dashed 1px @borderLine;
}

.title {
  width: 40%;
  display: flex;
  /*justify-content: space-between;*/
  .title-img {
    height: @prodImg;
    width: @prodImg;
    margin-right: @baseSize*2;
    display: block;
  }
  .title-left {
    display: flex;
    align-items: center;
    .check {
      margin-right: @baseSpace;
    }
  }
  .title-right {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    .name {
      width: 100%;
    }
    >*:not(:first-child) {
      margin-right: @baseSize;
    }
    .catalog {
      color: @darkGary;
    }
  }
  .cycleSign {
    flex-grow: 1;
    align-self: center;
    .cycleIcon {
      float: right;
      width: 20px;
      height: 20px;
    }
  }
}

.price {
  width: 10%;
  text-align: right;
  padding-right: @baseSpace*3;
}


/*.stock {
  width: 10%;
}
*/


/*.sold {
  width: 10%;
}*/

.cycleSend {
  flex-grow: 1;
  /*text-align: right;*/
}

.create {
  width: 13%;
  text-align: center;
}

.agent {
  width: 15%;
}

.action {
  width: 22%;
}

.foot {
  text-align: end;
  padding: @smallSize;
}

.dialog-body {
  text-align: center;
  > .el-select {
    width: 100%;
  }
  .el-form-item {
    margin-bottom: 0;
  }
}

.select {
  width: 100%;
}

.production-list .pl {
  padding-left: @baseSpace*3 + 1;
}

.warning-bunner {
  border: 1px solid @warningYellow;
  background-color: #fefce8;
  padding: 5px 15px;
  margin-bottom: 10px;
  display: table;
  position: relative;
  width: 100%;
  .warning-icon {
    display: table-cell;
    width: 15px;
    vertical-align: middle;
  }
  .warning-content {
    display: table-cell;
    padding: 0 10px;
  }
  .warning-btn {
    padding: 0 15px;
  }
  .warning-closebtn {
    top: 9px;
    right: 15px;
    position: absolute;
    cursor: pointer;
  }
}

.searchNull {
  padding: 160px 0 173px;
  background-color: @white;
  border: solid 1px @borderLine;
}
</style>
