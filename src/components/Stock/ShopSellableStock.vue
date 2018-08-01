<template>
  <div class="shop-sellable-stock">
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
    <div v-loading="loading">
      <div class="list-head">
        <div class="title">商品/规格</div>
        <div class="warehouse">仓库</div>
        <div class="sellable">可售库存</div>
        <div class="percentage">分配比例</div>
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
            <div class="percentage"></div>
            <div class="operation">
              <el-button size="small" @click="showDialogHandler(stock)">调整库存</el-button>
            </div>
          </div>
          <div class="shop" v-for="shopStock of stock.skuAllocationsUse" :key="shopStock.shopId">
            <div class="title-img"><i v-if="!Math.floor(stock.offeringStock.quantityNum*shopStock.stockPercent/100)" class="iconfont icon-jinggao red"></i></div>
            <div class="title-name">
              <i :class="platform[shopStock.platformId]"></i>&nbsp;
              <span class="name" v-text="shopEnum[shopStock.shopId]"></span>
            </div>
            <div class="warehouse"></div>
            <div class="sellable" :class="{red:!Math.floor(stock.offeringStock.quantityNum*shopStock.stockPercent/100)}" v-text="Math.floor(stock.offeringStock.quantityNum*shopStock.stockPercent/100)"></div>
            <div class="percentage" v-text="shopStock.stockPercent+'%'"></div>
            <div class="operation"></div>
          </div>
        </div>
      </template>
      <searchNull v-else></searchNull>
    </div>
    <div class="foot">
      <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" :total="data.amount" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <el-dialog v-if="dialogData" v-model="dialogShow" title="调整店铺可售库存" custom-class="stock-dialog">
      <div>温馨提示：</div>
      <ol>
        <li>建议商城可售比例总和&lt;90%。</li>
        <li>库存调整为异步，调整后建议稍后在商城查看，根据实际情况再次分配</li>
      </ol>
      <div class="list-head">
        <div class="title">商品/规格</div>
        <div class="warehouse">仓库</div>
        <div class="sellable">可售库存</div>
        <div class="percentage">分配比例</div>
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
          <div class="sellable" v-text="dialogData.offeringStock.quantityNum"></div>
          <div class="percentage"></div>
        </div>
        <div class="shop" v-for="(shopStock,index) of dialogData.skuAllocationsUse" :key="shopStock.shopId">
          <div class="title-img"></div>
          <div class="title-name">
            <i class=""></i>
            <div class="name" v-text="shopEnum[shopStock.shopId]"></div>
          </div>
          <div class="warehouse"></div>
          <div class="sellable" v-text="Math.floor(dialogData.offeringStock.quantityNum*shopStock.stockPercent/100)"></div>
          <div class="percentage">
            <el-input-number v-model="shopStock.stockPercent" size="small" :min="0" :max="100" @change="stockPercentChangeHandler($event,shopStock,index)"></el-input-number>%
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-tooltip effect="light" popper-class="help-popper">
          <div slot="content">
            <ol>
              <li>只能将仓库可售库存同步到店铺，按商品下的每个SKU分配比例。</li>
              <li>每个店铺分配的比例总和不超过100%。由于时差原因，小亚通中的可售数量会比商城略大，可能导致超卖，通常建议留有一定的余量，如10%。</li>
              <li>输入比例后，系统自动计算每个店铺分配到的数量。</li>
              <li>点击确定，系统将数量同步到商城 。同步是异步的，建议操作者及时去商城查看重新分配后的数量，并根据实际情况适时再次分配。</li>
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
  </div>
</template>
<script>
import imgerr from '../../assets/img/imgerror.png';
import Paging from '../common/Paging';
import cloneDeep from 'lodash/cloneDeep';
import uniqBy from 'lodash/uniqBy';
import axios from 'axios';
// import debounce from 'lodash/debounce'
const queryStockUrl = '/warehouse/warehouse/queryStock';
const queryShopUrl = '/customer/shopInfo/newQueryShopGroupByPlatform';
const allocationStockUrl = '/warehouse/warehouse/allocationStock';
export default {
  name: 'shop-sellable-stock',
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
      shops: '',
    }
  },
  computed: {
    repositoryEnum() {
      return this.$store.state.enumSet.repositoryEnum;
    },
    shopEnum() {
      return this.$store.state.enumSet.shopEnum;
    },
    platform() {
      return this.$store.state.enumSet.platform;
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
  },
  methods: {
    searchHandler() {
      this.loading = true;
      let query = {
        queryCondition: this.queryCondition,
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
      };
      // 根据店铺列表组合
      this.getShops().then(shops => {
        let skuAllocationsUse = shops.map(m => {
          return {
            platformId: m.platformId,
            shopId: m.shopId,
            stockPercent: 0,
          }
        });
        axios.post(queryStockUrl, query).then(response => {
          this.loading = false;
          if (!response.data.beanList) {
            response.data.beanList = [];
          } else if (response.data.beanList.length) {
            response.data.beanList.forEach(n => {
              n.skuAllocationsUse = n.skuAllocations.concat(skuAllocationsUse);
              // 合并shopId相同项
              n.skuAllocationsUse = uniqBy(n.skuAllocationsUse, 'shopId');
            })
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
      this.dialogShow = true;
    },
    dialogSure() {
      this.dialogShow = false;
      let promiseAll = this.dialogData.skuAllocationsUse.reduce((prev, curr) => {
        this.dialogData.skuStocks.forEach(n => {
          let condition = {
            wmsId: this.dialogData.offeringStock.wmsId,
            skuId: n.skuId,
            platformId: curr.platformId,
            shopId: curr.shopId,
            ownPercent: curr.stockPercent
          }
          prev.push(axios.post(allocationStockUrl, condition));
        })
        return prev;
      }, [])
      this.loading = true;
      Promise.all(promiseAll).then(response => {
        this.loading = false;
        this.$message.success('操作成功！');
        this.searchHandler();
      }).catch(err => {
        this.loading = false;
        this.$msgbox({
          title: '提示',
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      });
    },
    stockPercentChangeHandler(val, skuStock, index) {
      let percent = val;
      this.dialogData.skuAllocationsUse.forEach((n, i) => {
        if (i !== index) {
          percent += n.stockPercent;
        }
      })
      if (percent > 100) {
        this.dialogData.skuAllocationsUse.forEach((n, i) => {
          if (i !== index) {
            n.stockPercent = 0;
          }
        })
      }
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
    getShops() {
      if (Array.isArray(this.shops)) {
        return Promise.resolve(this.shops);
      } else {
        return axios.post(queryShopUrl).then(response => {
          if (response.data.amount) {
            this.shops = response.data.beanList.filter(n => n.platformId !== 'OFFLINE').map(n => {
              return {
                shopId: n.shopId,
                platformId: n.platformId,
                shopTitle: n.shopTitle,
              }
            });
          } else {
            this.shops = []
          }
          return this.shops;
        })
      }
    }
  },
  watch: {},
  activated() {
    this.searchHandler();
    this.getShops();
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
  margin-bottom: @baseSpace*2;
}

.prodmsg,
.shop {
  padding: @baseSpace @baseSpace*2;
  text-align: right;
  display: flex;
  >* {
    flex: 1 0;
  }
}

.prod:hover .shop {
  background-color: @tabBg;
  transition: background-color 0.3s;
}

.prodmsg {
  background-color: @parentItemBg;
  align-items: center;
}

.shop {
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
  flex-basis: 15%;
}

.percentage {
  flex-basis: 15%;
  >div {
    vertical-align: middle;
  }
}

.operation {
  flex-basis: 15%;
  text-align: center;
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
</style>
<style lang="less">
@import '../../main.less';
.stock-dialog {
  width: 65%;
  min-width: 850px;
  .sellable {
    flex-basis: 10%
  }
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
