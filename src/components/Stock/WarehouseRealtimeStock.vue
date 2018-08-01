<template>
  <div class="warehouse-realtime-stock">
    <el-form v-model='queryCondition' label-width="90px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="仓库">
            <el-select class="w200" v-model="queryCondition.wmsIds" size="small">
              <el-option v-for="item in repositoryArr" :label="item.label" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品名称">
            <el-input class="w200" v-model.trim="queryCondition.skuTitle" size="small" @keyup.enter.native="searchHandler"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品自编码">
            <el-input class="w200" v-model.trim="queryCondition.outerIds" size="small" @keyup.enter.native="searchHandler"></el-input>
          </el-form-item>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" size="small" @click="searchHandler">搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="prod-list" v-loading="loading">
      <div class="list-head">
        <div class="title">商品/规格</div>
        <div class="warehouse">仓库</div>
        <div class="sellable">可售</div>
        <div class="preempt">预占</div>
        <div class="freeze">冻结</div>
        <div class="defective">次品</div>
        <div class="total">总库存</div>
        <div class="in-out">出库/入库总数</div>
        <div class="operation">操作</div>
      </div>
      <div class="list-action">
        <paging :page-size="pageSize" :page-number="pageNumber" :total='data.amount' @current-change="currentChangeHandler"></paging>
      </div>
      <template v-if="data.amount">
        <div class="prod" v-for="(stock,index) of data.beanList" :key="stock.offeringStock.offeringStockId">
          <div class="prodmsg">
            <div class="title-img">
              <el-popover popper-class="popper-img" trigger="hover" placement="top" :visible-arrow="false">
                <img :src="stock.offeringStock.offeringImageUrl">
                <img slot="reference" :src="stock.offeringStock.offeringImageUrl" @error='imgErrorHandler'>
              </el-popover>
            </div>
            <div class="title-name">
              <div class="name" v-text="stock.offeringStock.offeringTitle"></div>
            </div>
            <div class="warehouse">
              <div>{{repositoryEnum[stock.offeringStock.wmsId]}}<span v-if="!repositoryEnum[stock.offeringStock.wmsId]" class="red">已删除</span></div>
              <el-tag v-if="$parent.getEntityWmsType(stock.offeringStock.wmsId)" type="primary" v-text="'实体-'+$parent.getEntityWmsName(stock.offeringStock.wmsId)"></el-tag>
            </div>
            <div class="sellable" v-text="stock.offeringStock.quantityNum"></div>
            <div class="preempt" v-text="stock.offeringStock.reservedNum"></div>
            <div class="freeze" v-text="stock.offeringStock.lockQuantity"></div>
            <div class="defective" v-text="stock.offeringStock.defectiveNum"></div>
            <div class="total" v-text="getTotalNum(stock.offeringStock)"></div>
            <div class="in-out">{{stock.offeringStock.totalOutNums}}/{{stock.offeringStock.totalInNums}}</div>
            <div class="operation" v-if="!$parent.getEntityWmsType(stock.offeringStock.wmsId)">
              <el-button size="small" @click="showDialogHandler(stock,1)">调整库存</el-button>
              <el-button size="small" @click="showDialogHandler(stock,2)">冻结解冻</el-button>
            </div>
          </div>
          <div class="sku" v-for="skuStock of stock.skuStocks" :key="skuStock.skuStockId">
            <div class="title-img"><i class="iconfont icon-jinggao red" v-if="skuStock.quantityNum==0"></i></div>
            <div class="title-name">
              <div class="name" v-text="skuStock.skuProperties"></div>
              <div class="muted" v-text="skuStock.outerId"></div>
            </div>
            <div class="warehouse"></div>
            <div class="sellable" :class="{red: skuStock.quantityNum==0}" v-text="skuStock.quantityNum"></div>
            <div class="preempt" v-text="skuStock.reservedNum"></div>
            <div class="freeze" v-text="skuStock.lockQuantity"></div>
            <div class="defective" v-text="skuStock.defectiveNum"></div>
            <div class="total" v-text="getTotalNum(skuStock)"></div>
            <div class="in-out">{{skuStock.totalOutNums}}/{{skuStock.totalInNums}}</div>
            <div class="operation">
              <el-button size="small" @click="showShopDialogHandler(skuStock)">库存同步</el-button>
            </div>
          </div>
        </div>
      </template>
      <searchNull v-else></searchNull>
    </div>
    <div class="foot">
      <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" :total="data.amount" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <el-dialog v-if="dialogData" v-model="dialogShow" :title="dialogTitle" custom-class="stock-dialog">
      <div class="list-head">
        <div class="title">商品/规格</div>
        <div class="warehouse">仓库</div>
        <div class="sellable">可售</div>
        <div class="freeze" v-if="dialogType===2">冻结</div>
        <div class="defective" v-if="dialogType===1">次品</div>
      </div>
      <div class="prod">
        <div class="prodmsg">
          <div class="title-img">
            <img :src="dialogData.offeringStock.offeringImageUrl" @error='imgErrorHandler'>
          </div>
          <div class="title-name">
            <div class="name" v-text="dialogData.offeringStock.offeringTitle"></div>
          </div>
          <div class="warehouse" v-text="repositoryEnum[dialogData.offeringStock.wmsId]"></div>
          <div class="sellable" v-text="getOfferingNum().quantityNum"></div>
          <div class="freeze" v-text="getOfferingNum().lockQuantity" v-if="dialogType===2"></div>
          <div class="defective" v-text="getOfferingNum().defectiveNum" v-if="dialogType===1"></div>
        </div>
        <div class="sku" v-for="(skuStock,index) of dialogData.skuStocks" :key="skuStock.outerId">
          <div class="title-img"></div>
          <div class="title-name">
            <div class="name" v-text="skuStock.skuProperties"></div>
            <div class="muted" v-text="skuStock.outerId"></div>
          </div>
          <div class="warehouse"></div>
          <div class="sellable">
            <span v-text="skuStock.quantityNum" v-if="dialogType===2"></span>
            <el-input-number v-model="skuStock.quantityNum" v-if="dialogType===1" size="small" :min="0"></el-input-number>
          </div>
          <div class="freeze" v-if="dialogType===2">
            <el-input-number v-model="skuStock.lockQuantity" size="small" :min="0" :max="dialogSellablePlusRreeze[index]" @change="freezeChangeHandler($event,skuStock,index)"></el-input-number>
          </div>
          <div class="defective" v-if="dialogType===1">
            <el-input-number v-model="skuStock.defectiveNum" size="small" :min="0"></el-input-number>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-tooltip effect="light" popper-class="help-popper">
          <div slot="content">
            <ol v-if="dialogType===1">
              <li>调整实时库存的操作是SKU级的，商品级库存为sku库存的累加值。</li>
              <li>总库存不可以直接修改。只能通过调整可售库存（正品）、次品库存和虚库存来间接影响总库存。</li>
              <li>调整后，若调增自动生成一条入库单，若调减则生成出库单</li>
            </ol>
            <ol v-if="dialogType===2">
              <li>冻结解冻操作是SKU级，商品级为sku的累加值</li>
              <li>建议冻结库存总数量应小于可售库存，应该留有一定的余量给订单预占。</li>
            </ol>
          </div>
          <i class="iconfont icon-bangzhu1 blue help"></i>
        </el-tooltip>
        <div>
          <el-button size="small" @click="dialogShow=false">取 消</el-button>
          <el-button size="small" type="primary" @click="dialogSure">提 交</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="调整店铺库存" v-model="isShowShopDialog" v-loading="shopDialogLoading">
      <div class="shop-sku-dialog">
        <div class="shop-sku-head">
          <div class="shop-sku-name">规格/名称</div>
          <div class="shop-sku-number">库存</div>
        </div>
        <div class="shop-sku-msg">
          <div class="shop-sku-name">{{shopSkuStock.skuProperties}}</div>
          <div class="shop-sku-number">总库存：{{shopSkuStock.quantityNum}}，已分配：<span :class="{red: skuShopsNumTotal>shopSkuStock.quantityNum}">{{skuShopsNumTotal}}</span></div>
        </div>
        <div class="shop-sku-item" v-for="shopStock of skuShops">
          <div class="shop-sku-name">
            <div>{{shopStock.skuName}}</div>
            <i :class="platform[shopStock.platformId]"></i>&nbsp;
            <span class="name" v-text="shopEnum[shopStock.shopId]"></span>
          </div>
          <div class="shop-sku-number">
            <el-input-number v-model="shopStock.stockNum" :min="0" size="small"></el-input-number>
          </div>
        </div>
      </div>
      <div slot="footer" class="shop-dialog-footer">
        <el-button size="small" @click="isShowShopDialog=false">取 消</el-button>
        <el-button size="small" type="primary" @click="shopDialogSure">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import imgerr from '../../assets/img/imgerror.png';
import Paging from '../common/Paging';
import cloneDeep from 'lodash/cloneDeep';
import axios from 'axios';
// import debounce from 'lodash/debounce'
const queryStockUrl = '/warehouse/warehouse/queryStock';
const adjustInStockUrl = '/warehouse/warehouse/adjustInStock';
const adjustOutStockUrl = '/warehouse/warehouse/adjustOutStock';
const lockSkuUrl = '/warehouse/warehouse/lockSku';
const unlockSkuUrl = '/warehouse/warehouse/unlockSku';
const querySkuUrl = '/product/prodoffering/querySku'; // 查sku
const updateSkuUrl = '/product/prodoffering/updateSku'; // 查sku
export default {
  name: 'warehouse-realtime-stock',
  components: {
    Paging,
  },
  data() {
    return {
      queryCondition: {
        skuTitle: '',
        outerIds: '',
        wmsIds: '',
      },
      pageSize: 10,
      pageNumber: 1,
      data: {
        amount: 0,
        beanList: [],
      },
      loading: false,
      dialogData: '',
      dialogShow: false,
      dialogType: 1, // 1库存调整 2冻结解冻
      dialogSellablePlusRreeze: [],
      isShowShopDialog: false,
      shopDialogLoading: false,
      shopSkuStock: '', // 调整店铺库存时展示
      skuShops: [], // 调整店铺库存时个店铺展示
    }
  },
  computed: {
    repositoryEnum() {
      return this.$store.state.enumSet.repositoryEnum;
    },
    repositoryArr() {
      let arr = [{
        key: '',
        label: '全部'
      }];
      Object.keys(this.repositoryEnum).forEach(n => {
        arr.push({
          key: n,
          label: this.repositoryEnum[n]
        })
      });
      return arr;
    },
    dialogTitle() {
      if (this.dialogType === 1) return '库存调整';
      if (this.dialogType === 2) return '冻结解冻';
    },
    helpContent() {
      if (this.dialogType === 1) return '库存调整';
      if (this.dialogType === 2) return '冻结解冻';
    },
    shopEnum() {
      return this.$store.state.enumSet.shopEnum;
    },
    platform() {
      return this.$store.state.enumSet.platform;
    },
    skuShopsNumTotal() {
      return this.skuShops.reduce((prve, sku) => {
        prve += sku.stockNum;
        return prve;
      }, 0)
    }
  },
  methods: {
    searchHandler() {
      this.loading = true;
      let query = {
        queryCondition: this.queryCondition,
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
      }
      axios.post(queryStockUrl, query).then(response => {
        this.loading = false;
        if (!response.data.beanList) {
          response.data.beanList = [];
        }
        this.data = response.data;
      }).catch(err => {
        this.loading = false;
        this.$msgbox({
          title: '提示',
          message: '查询失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    sizeChangeHandler(size) {
      this.pageSize = size;
      this.searchHandler();
    },
    currentChangeHandler(number) {
      this.pageNumber = number;
      this.searchHandler();
    },
    imgErrorHandler(event) {
      event.target.src = imgerr;
    },
    getTotalNum(stock) {
      return stock.quantityNum + stock.reservedNum + stock.lockQuantity + stock.defectiveNum;
    },
    showDialogHandler(stock, type) {
      if (!this.repositoryEnum[stock.offeringStock.wmsId]) {
        this.$message.error('对应仓库已被删除，不可操作！');
        return;
      }
      this.dialogData = cloneDeep(stock);
      this.dialogSellablePlusRreeze = this.dialogData.skuStocks.map(n => n.quantityNum + n.lockQuantity);
      this.dialogType = type;
      this.dialogShow = true;
    },
    dialogSure() {
      this.dialogShow = false;
      // let ticketType;
      let [inItems, outItems, lockItems, unlockItems] = [
        [],
        [],
        [],
        []
      ];
      let original = this.data.beanList.find(n => n.offeringStock.offeringStockId === this.dialogData.offeringStock.offeringStockId);
      this.dialogData.skuStocks.forEach((n, index) => {
        let quantityNum = n.quantityNum - original.skuStocks[index].quantityNum; // 正品差
        let defectiveNum = n.defectiveNum - original.skuStocks[index].defectiveNum; // 次品差
        let item = {
          offeringId: this.dialogData.offeringStock.offeringId,
          offeringTitle: this.dialogData.offeringStock.offeringTitle,
          offeringImageUrl: this.dialogData.offeringStock.offeringImageUrl,
          skuId: n.skuId,
          skuTitle: n.skuTitle,
          skuProperties: n.skuProperties || 'n/a',
          outerId: n.outerId,
          skuImageUrl: n.skuImageUrl,
          barCode: n.barCode || 'n/a',
        }
        if (quantityNum === 0 && defectiveNum === 0) return; // 无调整
        if (this.dialogType === 1) { // 正、次品调整
          if (quantityNum >= 0 && defectiveNum >= 0) { // 全入库
            item.quantityNum = quantityNum;
            item.defectiveNum = defectiveNum;
            inItems.push(item);
            return;
          }
          if (quantityNum <= 0 && defectiveNum <= 0) { // 全出库
            item.quantityNum = Math.abs(quantityNum);
            item.defectiveNum = Math.abs(defectiveNum);
            outItems.push(item);
            return;
          }
          if (quantityNum > 0 && defectiveNum < 0) {
            let item2 = Object.assign({}, item);
            item.quantityNum = quantityNum;
            item.defectiveNum = 0;
            inItems.push(item);
            item2.quantityNum = 0;
            item2.defectiveNum = Math.abs(defectiveNum);
            outItems.push(item2);
            return;
          }
          if (quantityNum < 0 && defectiveNum > 0) {
            let item2 = Object.assign({}, item);
            item.quantityNum = Math.abs(quantityNum);
            item.defectiveNum = 0;
            outItems.push(item);
            item2.quantityNum = 0;
            item2.defectiveNum = defectiveNum;
            inItems.push(item2);
            return;
          }
        } else if (this.dialogType === 2) {
          item.quantityNum = Math.abs(quantityNum);
          item.defectiveNum = 0;
          if (quantityNum > 0) { // 解冻
            unlockItems.push(item);
          } else {
            lockItems.push(item);
          }
        }
      })
      let promiseAll = []
      if (inItems.length) {
        // 入库调整
        let condition = {
          ticket: {
            ticketTitle: 'title',
            wmsId: this.dialogData.offeringStock.wmsId,
            ticketType: 102,
          }
        }
        condition.items = inItems;
        promiseAll.push(axios.post(adjustInStockUrl, condition));
      }
      if (outItems.length) {
        // 出库调整
        let condition = {
          ticket: {
            ticketTitle: 'title',
            wmsId: this.dialogData.offeringStock.wmsId,
            ticketType: 203,
          }
        }
        condition.items = outItems;
        promiseAll.push(axios.post(adjustOutStockUrl, condition));
      }
      if (lockItems.length) {
        // 冻结调整
        let condition = {
          ticket: {
            ticketTitle: 'title',
            wmsId: this.dialogData.offeringStock.wmsId,
            ticketType: 202,
          }
        }
        condition.items = lockItems;
        promiseAll.push(axios.post(lockSkuUrl, condition));
      }
      if (unlockItems.length) {
        // 解冻调整
        let condition = {
          ticket: {
            ticketTitle: 'title',
            wmsId: this.dialogData.offeringStock.wmsId,
            ticketType: 103,
          }
        }
        condition.items = unlockItems;
        promiseAll.push(axios.post(unlockSkuUrl, condition));
      }
      if (promiseAll.length) {
        this.loading = true;
        Promise.all(promiseAll).then(() => {
          this.$message.success('调整成功！')
          this.searchHandler();
        }).catch(err => {
          this.loading = false;
          this.$msgbox({
            title: '提示',
            message: '操作失败，' + (err.response ? err.response.data : err),
            type: 'error',
          })
        })
      } else {
        this.$message.info('未检测到改动。')
      }
    },
    freezeChangeHandler(val, skuStock, index) {
      skuStock.quantityNum = this.dialogSellablePlusRreeze[index] - val;
    },
    getOfferingNum() {
      let result = {
        quantityNum: 0,
        lockQuantity: 0,
        defectiveNum: 0,
      }
      this.dialogData.skuStocks.forEach(n => {
        result.quantityNum += n.quantityNum;
        result.lockQuantity += n.lockQuantity;
        result.defectiveNum += n.defectiveNum;
      });
      return result;
    },
    showShopDialogHandler(skuStock) {
      this.shopSkuStock = skuStock;
      this.skuShops = [];
      this.isShowShopDialog = true;
      axios.post(querySkuUrl, {
        queryCondition: {
          mergedSkuId: skuStock.skuId,
        },
        pageSize: 1000,
        pageNumber: 1,
      }).then(response => {
        response.data.beanList.forEach(n => {
          n.stockNum = n.stockNum || 0;
        })
        this.skuShops = response.data.beanList
      }).catch(err => {
        this.skuShops = [];
        this.$msgbox({
          title: '提示',
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        });
      });
    },
    shopDialogSure() {
      let skus = this.skuShops.map(n => ({
        skuId: n.skuId,
        stockNum: n.stockNum,
      }));
      this.shopDialogLoading = true;
      axios.post(updateSkuUrl, {
        skus,
      }).then(() => {
        this.isShowShopDialog = false;
        this.shopDialogLoading = false;
        this.$message.success('调整成功！');
      }).catch(err => {
        this.shopDialogLoading = false;
        this.$msgbox({
          title: '提示',
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        });
      });
    },
  },
  watch: {},
  activated() {
    this.searchHandler();
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../../main.less';
.search {
  width: 361px;
  margin-bottom: @baseSpace*4;
}

.list-head {
  background-color: @tabBg;
  font-size: 14px;
  padding: @baseSpace*2;
  border: solid 1px @borderLine;
  border-bottom: none;
  text-align: right;
  display: flex;
  >* {
    flex: 1 0;
  }
}

.list-action {
  border: solid 1px @borderLine;
  padding: @baseSpace*2;
  display: flex;
  /*justify-content: space-between;*/
  flex-direction: row-reverse;
  align-items: center;
  margin-bottom: @baseSpace*2;
}

.prod {
  border: solid 1px @borderLine;
  margin-bottom: @baseSpace*3;
}

.prod:hover .sku {
  background-color: @tabBg;
  transition: background-color 0.3s;
}

.prodmsg,
.sku {
  padding: @baseSpace @baseSpace*2;
  text-align: right;
  display: flex;
  >* {
    flex: 1 0;
  }
}

.prodmsg {
  background-color: @parentItemBg;
  align-items: center;
}

.sku {
  border-top: solid 1px @borderLine;
  background-color: @white;
  align-items: center;
  .title-img {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
  }
}

.title {
  flex-basis: 20%;
  margin-left: 60px;
  text-align: left;
}

.title-img {
  margin-right: @baseSpace*2;
  width: 50px;
  height: 50px;
  flex: initial;
  img {
    width: 50px;
  }
}

.title-name {
  flex-basis: 20%;
  text-align: left;
}

.warehouse {
  flex-basis: 10%;
  text-align: left;
}

.sellable {
  flex-basis: 8%;
}

.preempt {
  flex-basis: 8%;
}

.freeze {
  flex-basis: 8%;
}

.defective {
  flex-basis: 8%;
}

.total {
  flex-basis: 8%;
}

.in-out {
  flex-basis: 10%;
}

.operation {
  flex-basis: 15%;
  text-align: center;
}

.sku,
.prodmsg {
  .operation {
    text-align: left;
    padding-left: 10px;
  }
}

.foot {
  margin-top: @baseSpace*4;
  text-align: end;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.help {
  cursor: help;
}

.searchNull {
  padding: 80px 0 20px;
  border: solid 1px @borderLine;
  background-color: @white;
}

.shop-sku-dialog {
  border: solid 1px @borderLine;
  .shop-sku-head,
  .shop-sku-msg,
  .shop-sku-item {
    display: flex;
    padding: @baseSpace*2;
  }
  .shop-sku-head {
    background-color: @tabBg;
    font-size: 14px;
  }
  .shop-sku-item {
    border-top: solid 1px @borderLine;
  }
  .shop-sku-name,
  .shop-sku-number {
    flex-basis: 50%;
  }
}

.shop-dialog-footer {
  text-align: right;
}
</style>
<style lang="less">
@import '../../main.less';
.stock-dialog {
  width: 65%;
  min-width: 850px;
}

.help-popper {
  padding: 0;
  color: @neutralGary;
  border-color: @borderLine !important;
  ol {
    padding-left: @baseSpace*5;
    line-height: 1.8em;
  }
}
</style>
