<template>
  <div class="production">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs ref="tabs" @tab-click="tabClick" v-model='activeName'>
      <el-tab-pane v-for='tab in tabs' :label="tab.label" :name="tab.saleStatus+''">
      </el-tab-pane>
    </el-tabs>
    <div class="right-btn">
      <el-button type="text" @click="exportProd"><i class="icon iconfont icon-daochu"></i><span>导出查询结果</span></el-button>
      <el-button type="text" @click="syncProd"><i class="icon iconfont icon-tongbushangpin"></i><span>同步商品</span></el-button>
    </div>
    <el-form v-model='query' label-width="90px">
      <el-row key="1">
        <el-col :span="8">
          <el-form-item label="商品">
            <el-input class="w240" v-model="query.nameOrOuterId" size="small" @keyup.enter.native="queryHandler" placeholder="商品名称|商品自编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="店铺">
            <el-select class="w240" v-model="query.shopId" size="small">
              <el-option v-for="shop of shopList" :label="shop.shopName" :value="shop.shopId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="activeName!='2'">
          <el-form-item label="供应商">
            <el-select class="w240" v-model="query.supplierTenantId" size="small" filterable placeholder="可输入关键字搜索">
              <el-option v-for="(val, key) of supplierEnum" :label="val" :value="key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" size="small" @click="queryHandler">搜索</el-button>
      </el-form-item>
    </el-form>
    <production-list v-if="searchedFlag" :extOrdId="extOrdId" :nullSupplier="query.nullSupplier" :shopList="shopList" :search-loading="loading" :offering-date="offeringData" :page-size="query.pageSize" :page-number="query.pageNumber" :reminder="reminder" @size-change="sizeChangeHandler" @current-change="currentChangeHandler" @warning="warningHandler" key="prod"></production-list>
  </div>
</template>
<script>
import productionList from './ProductionList';
import axios from 'axios';
const queryProductsUrl = '/product/prodoffering/queryProducts'; // 查
const exportProdUrl = '/product/prodoffering/exportProd';
const syncProductUrl = '/product/prodoffering/requestForSyncProduct';
const queryShopUrl = '/customer/shopInfo/queryShop';
export default {
  name: 'production',
  components: {
    productionList,
  },
  data() {
    return {
      activeName: '0',
      shopList: [],
      shopIds: [],
      query: {
        nameOrOuterId: '',
        shopId: '',
        saleStatus: 0,
        supplierTenantId: '', // 供应商id,
        nullSupplier: '', // 是否关联供应商（0关联供应商，1未关联供应商）
        pageSize: 20,
        pageNumber: 1,
      },
      loading: false,
      searchedFlag: false,
      isSearchedShop: false,
      needLink: false,
      tabs: [{
        label: '出售中',
        saleStatus: 0
      }, {
        label: '未上架',
        saleStatus: 1
      }, {
        label: '待关联供应商',
        //  原值'' 修改为 2
        saleStatus: 2
      }],
      offeringData: {
        amount: 0,
        offeringList: [],
      },
      skuData: {
        amount: 0,
        beanList: [],
      },
      moreLabel: '',
      extOrdId: '', // 外部订单号，用于接收从待分发订单传过来的订单号
    }
  },
  computed: {
    platform() {
      return this.$store.state.enumSet.platform;
    },
    supplierEnum() {
      return this.$store.state.enumSet.supplierEnum;
    },
    reminder() {
      return this.needLink && this.activeName !== '2';
    }
  },
  methods: {
    queryHandler() {
      return this.getShopListLength().then(length => {
        if (length === 0) {
          this.$msgbox({
            message: '您尚未授权店铺，请先授权店铺！',
            type: 'error',
            closeOnClickModal: false,
            closeOnPressEscape: false,
            // }).then(() => {
            //   this.$router.push('/shop');
          })
        } else if (length > 0) {
          this.loading = true;
          let queryCondition = {
            shopId: this.query.shopId,
            nameOrOuterId: this.query.nameOrOuterId,
            queryCondition: this.query.queryCondition,
            nullSupplier: this.query.nullSupplier,
          };
          if (this.query.nullSupplier === '') {
            queryCondition.saleStatus = this.query.saleStatus;
            queryCondition.supplierTenantId = this.query.supplierTenantId;
          }
          axios.post(queryProductsUrl, {
            queryCondition,
            pageNumber: this.query.pageNumber,
            pageSize: this.query.pageSize,
          }).then(response => {
            this.offeringData = response.data;
            this.loading = false;
            // 只查询一次未关联商品
            if (!this.searchedFlag) {
              this.queryNullSupplier();
            }
            this.searchedFlag = true;
          }).catch(err => {
            this.loading = false;
            this.$msgbox({
              title: '提示',
              message: '查询失败，' + (err.response ? err.response.data : err),
              type: 'error',
            })
          })
        }
      });
    },
    sizeChangeHandler(pageSize) {
      this.query.pageSize = pageSize
      this.queryHandler();
    },
    currentChangeHandler(pageNumber) {
      this.query.pageNumber = pageNumber;
      this.queryHandler();
    },
    exportProd() {
      let queryCondition = {
        shopId: this.query.shopId,
        nameOrOuterId: this.query.nameOrOuterId,
        queryCondition: this.query.queryCondition,
        nullSupplier: this.query.nullSupplier,
      };
      if (this.query.nullSupplier === '') {
        queryCondition.saleStatus = this.query.saleStatus;
        queryCondition.supplierTenantId = this.query.supplierTenantId;
      }
      axios.post(exportProdUrl, {
        queryCondition,
        uploadFile: '商品列表' + Date.now(),
        pageSize: 2147483647,
      }).then(() => {
        this.$confirm('导出作业已启动，稍后可在任务中心下载！', '提示', {
          cancelButtonText: '稍后再说',
          confirmButtonText: '现在前往',
          type: 'success',
        }).then(() => {
          this.$router.push('/taskcenter')
        });
        this.$store.commit('addTask', 'prodExport');
      }).catch(err => {
        this.$msgbox({
          title: '提示',
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    syncProd() {
      this.shopIds.forEach(n => {
        axios.post(syncProductUrl, {
          shopId: n,
        }).then(response => {
          if (response.data === -1) {
            this.$msgbox({
              message: '操作失败，店铺数据有误',
              type: 'error',
            });
            return;
          }
          this.$message.success('请求已发送，同步需要一些时间，请稍后查询商品');
        }).catch(err => {
          this.$msgbox({
            message: '操作失败，' + (err.response ? err.response.data : err),
            type: 'error',
          });
        })
      })
    },
    tabClick(val) {
      this.query.saleStatus = parseInt(val.name);
      if (val.name === '2') {
        this.needLink = false;
        this.query.nullSupplier = 1;
      } else {
        this.query.nullSupplier = '';
      }
      this.query.pageNumber = 1;
      this.queryHandler();
    },
    getIcon(platformId) {
      return this.$store.state.enumSet.platform[platformId];
    },
    warningHandler(val) {
      if (val === 'link') {
        this.activeName = '2';
        this.query.nullSupplier = 1;
        this.queryHandler();
      }
      this.needLink = false;
    },
    queryNullSupplier() {
      let queryCondition = {
        shopId: this.query.shopId,
        nullSupplier: 1,
      }
      axios.post(queryProductsUrl, {
        queryCondition,
        pageNumber: 1,
        pageSize: 1,
      }).then(response => {
        if (response.data.amount) {
          this.needLink = true;
        };
      }).catch(e => {
        console.error(e);
      })
    },
    getShopListLength() {
      if (this.isSearchedShop) {
        return Promise.resolve(this.shopList.length);
      }
      return this.getShopList();
    },
    getShopList() {
      return axios.post(queryShopUrl).then(response => {
        this.isSearchedShop = true;
        if (response.data.length > 0) {
          this.shopIds = response.data.map(n => {
            return n.shopId;
          })
          this.shopList = response.data.map(n => {
            return {
              shopName: n.shopTitle,
              shopId: [n.shopId],
            }
          });
          this.shopList.unshift({
            shopName: '全部',
            shopId: this.shopIds,
          })
          this.query.shopId = this.shopIds;
        }
        return response.data.length;
      }).catch(err => {
        this.$msgbox({
          message: '获取店铺列表失败，请稍后刷新重试' + (err.response ? err.response.data : err),
          type: 'error',
        })
      });
    }
  },
  watch: {},
  mounted() {
    this.$store.dispatch('setShopEnum');
    this.$store.dispatch('setSupplierEnum');
    if (Object.keys(this.$route.query).length === 0) {
      this.queryHandler();
    }
  },
  activated() {
    if (Object.keys(this.$route.query).length === 0) return;
    if (this.$route.query.mark === 'bindPro') {
      this.activeName = '2';
      this.query.nullSupplier = 1;
    }
    if (this.$route.query.extOrdId && this.$route.query.extOrdId !== '') {
      this.extOrdId = this.$route.query.extOrdId;
    }
    this.query.nameOrOuterId = this.$route.query.productTitle || '';
    if (this.$route.query.data) {
      this.activeName = this.$route.query.data;
    }
    this.queryHandler();
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../../main.less';
.production {
  padding: @baseSize*3;
  position: relative;
  .w240 {
    width: 240px;
  }
  .el-form-item {
    margin-bottom: @baseSpace*2;
  }
}

.right-btn {
  position: absolute;
  right: 2%;
  z-index: 2;
  top: 42px;
}

.head {
  font-size: 14px;
  padding: 8px 0 @normalSize 0;
}

.shop {
  font-size: 18px;
}

.icon.iconfont {
  margin-right: @baseSize;
  vertical-align: baseline;
}

.icon-daochu {
  font-size: 22px;
  line-height: 0.5em;
}

.search {
  width: 361px;
  margin-bottom: @baseSize*4;
}

.foot {
  text-align: end;
  padding: @smallSize;
}

.warning {
  padding-left: @baseSize*4;
  color: @warning;
  font-size: 12px;
}
</style>
<style lang='less'>
@import '../../main.less';
.search {
  input {
    border-color: @borderLine;
  }
  .el-input-group__append {
    border-color: @borderLine;
    background-color: @borderLine;
    font-size: 12px;
    color: @lightBlack;
  }
}
</style>
