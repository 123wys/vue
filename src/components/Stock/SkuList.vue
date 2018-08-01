<template>
  <div class="sku-list" v-loading="loading">
    <div class="list">
      <div class="head">
        <span class="title">商品</span>
        <span class="outerId">规格/自编码</span>
        <span class="merged">共享SKU</span>
        <span class="create">上架时间</span>
        <span class="supplier">供应商</span>
        <span class="operate">操作</span>
      </div>
      <div class="list-action">
        <el-checkbox v-model="isSellectAll">全选</el-checkbox>
        <el-button type="primary" size="small" @click="showDialogHandler()">共享库存</el-button>
        <div class="space muted">提示：供应商为自己且没有入库的sku才可以共享。如果您查不到目标sku，请先去
          <el-button type="text" size="small" @click="$router.push('/production')">商品管理</el-button> 页设为自营</div>
        <paging :page-size="pageSize" :page-number="pageNumber" :total='skuData.amount' @current-change="currentChangeHandler"></paging>
      </div>
      <template v-if="skuData && skuData.amount">
        <div class="body" v-loading="searchLoading" element-loading-text="拼命加载中...">
          <div class="sku" v-for="(sku,index) of skuData.beanList" :key="sku.skuId">
            <el-checkbox class="check" v-model="selects[index].isSelect" :disabled="selects[index].disabled"></el-checkbox>
            <div class="title">
              <div class="sku-title" v-text="sku.skuName"></div>
              <div class="shop"><i :class="getIcon(sku.platformId)"></i>{{shopEnum[sku.shopId]}}</div>
            </div>
            <div class="outerId">
              <div>{{sku.skuCharSpec}}</div>
              <div class="muted">{{sku.outerId}}</div>
            </div>
            <div class="merged">
              <el-tag v-if="sku.skuStocks&&sku.skuStocks.length>0" type="primary">库</el-tag>
              <el-tag v-if="sku.mergedType==1" type="warning">共享主体</el-tag>
              <template v-if="sku.mergedType==2">
                <div>{{sku.mergedSku.skuCharSpec}}</div>
                <div class="muted">{{sku.mergedSku.outerId}}</div>
              </template>
            </div>
            <div class="create">{{sku.createDate}}</div>
            <div class="supplier">{{tenantEnum[sku.supplierTenantId]}}</div>
            <div class="operate">
              <el-button type="primary" size="small" @click="showDialogHandler([sku.skuId])" v-if="sku.mergedType==0&&(!sku.skuStocks)">共享库存</el-button>
              <el-button size="small" @click="unmergedSkuHandler(sku.skuId)" v-if="sku.mergedType==2">解除共享</el-button>
            </div>
          </div>
        </div>
      </template>
      <searchNull v-else></searchNull>
    </div>
    <pagination class="pl" v-model="isSellectAll" @size-change="sizeChangeHandler" @current-change="currentChangeHandler" :current-page="pageNumber" :page-sizes="[20, 50, 100]" :page-size="pageSize" :total="skuData.amount"></pagination>
    <el-dialog :title="'选择要设置的'+mergingSkuIds.length+'个sku的共享仓库主体'" v-model="isShowDialog" top="5%" custom-class="mainsku-dialog">
      <el-form v-model='query' label-width="70px">
        <el-row>
          <el-col :span="9">
            <el-form-item label="名称">
              <el-input class="w240" v-model="query.name" size="small" @keyup.enter.native="queryHandler" placeholder="商品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="自编码">
              <el-input class="w240" v-model="query.outerId" size="small" placeholder="商品自编码">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="small" @click="queryHandler">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="muted">提示：只有自营且有入库的sku可以设置为共享仓库主体。如果您目标不可选择，请先
          <el-button type="text" size="small" @click="goStock">入库</el-button>。</div>
      </el-form>
      <div class="list">
        <div class="head">
          <span class="title">商品</span>
          <span class="outerId">规格/自编码</span>
          <span class="merged"></span>
        </div>
        <template v-if="mainabledSkuData && mainabledSkuData.amount">
          <div class="body" v-loading="dialogLoading" element-loading-text="拼命加载中...">
            <div class="sku" v-for="(sku,index) of mainabledSkuData.beanList" :key="sku.skuId">
              <el-radio class="check" v-model="dialogRadio" :label="sku.skuId" :disabled="mergingSkuIds.includes(sku.skuId)||!(sku.skuStocks&&sku.skuStocks.length>0)"></el-radio>
              <div class="title">
                <div class="sku-title" v-text="sku.skuName"></div>
                <div class="shop"><i :class="getIcon(sku.platformId)"></i>{{shopEnum[sku.shopId]}}</div>
              </div>
              <div class="outerId">
                <div>{{sku.skuCharSpec}}</div>
                <div class="muted">{{sku.outerId}}</div>
              </div>
              <div class="merged">
                <el-tag v-if="sku.skuStocks&&sku.skuStocks.length>0" type="primary">库</el-tag>
                <el-tag v-if="sku.mergedType==1" type="warning">共享主体</el-tag>
              </div>
            </div>
          </div>
        </template>
        <searchNull v-else></searchNull>
      </div>
      <div class="pagin">
        <el-pagination @size-change="dialogSizeChangeHandler" @current-change="dialogCurrentChangeHandler" :current-page="dialogPageNumber" :page-sizes="[10, 20, 50]" :page-size="dialogPageSize" :total="mainabledSkuData.amount" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
      <div slot="footer">
        <el-button @click="isShowDialog=false" size="small">取 消</el-button>
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
const querySkuUrl = '/product/prodoffering/querySku'; // 查
const mergeSkuUrl = '/product/prodoffering/mergeSku';
const cancelMergedSkuUrl = '/product/prodoffering/cancelMergedSku';
export default {
  name: 'sku-list',
  props: {
    skuData: {
      default: {
        amount: 0,
        beanList: [],
      },
    },
    searchLoading: {
      default: false,
    },
    pageSize: '',
    pageNumber: '',
  },
  components: {
    Paging,
    Pagination
  },
  data() {
    return {
      selects: [],
      loading: false,
      mergingSkuIds: [],
      isShowDialog: false,
      dialogRadio: '',
      mainabledSkuData: {
        amount: 0,
        beanList: [],
      },
      query: {
        name: '',
        outerId: '',
        mergedType: [0, 1],
        shopId: this.$parent.query.shopId,
        tenantId: this.$parent.tenantId,
        supplierTenantId: this.$parent.tenantId,
      },
      dialogPageNumber: 1,
      dialogPageSize: 20,
    }
  },
  computed: {
    isSellectAll: {
      get() {
        // 列表空为false
        if (this.selection.length === 0) return false;
        // 没选中的都是disabled则为true
        return this.selects.filter(n => !n.isSelect).every(n => n.disabled);
      },
      set(val) {
        this.selects.forEach(n => {
          if (!n.disabled) n.isSelect = val;
        });
      }
    },
    selection() {
      return this.skuData.beanList.filter((n, i) => this.selects[i].isSelect);
    },
    ...mapState({
      supplierEnum: state => state.enumSet.supplierEnum,
      shopEnum: state => state.enumSet.shopEnum,
    }),
    tenantEnum() {
      return this.$store.getters.tenantEnum;
    },
  },
  methods: {
    sizeChangeHandler(pageSize) {
      this.$emit('size-change', pageSize);
    },
    currentChangeHandler(pageNumber) {
      this.$emit('current-change', pageNumber);
    },
    queryHandler() {
      this.dialogLoading = true;
      axios.post(querySkuUrl, {
        queryCondition: this.query,
        queryStock: true,
        pageNumber: this.dialogPageNumber,
        pageSize: this.dialogPageSize,
      }).then(response => {
        this.mainabledSkuData = response.data;
        this.dialogLoading = false;
      }).catch(err => {
        this.dialogLoading = false;
        this.$msgbox({
          title: '提示',
          message: '查询失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    dialogSizeChangeHandler(pageSize) {
      this.dialogPageSize = pageSize
      this.queryHandler();
    },
    dialogCurrentChangeHandler(pageNumber) {
      this.dialogPageNumber = pageNumber;
      this.queryHandler();
    },
    unmergedSkuHandler(skuId) {
      let skuIds = [skuId];
      this.loading = true;
      axios.post(cancelMergedSkuUrl, {
        skuIds,
      }).then(() => {
        this.loading = false;
        this.$parent.queryHandler();
        this.$message.success('操作成功！');
      }).catch(err => {
        this.loading = false;
        this.$msgbox({
          title: '提示',
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        });
      })
    },
    showDialogHandler(mergingSkuIds = this.selection.map(n => n.skuId)) {
      this.mergingSkuIds = mergingSkuIds;
      this.isShowDialog = true;
      this.dialogRadio = '';
      this.queryHandler();
    },
    dialogSure() {
      if (!this.dialogRadio) {
        this.$message.error('未选择sku的共享库存主体！');
        return
      }
      let mergedSkuId = this.dialogRadio;
      this.loading = true;
      axios.post(mergeSkuUrl, {
        mergedSkuId,
        skuIds: this.mergingSkuIds,
      }).then(() => {
        this.loading = false;
        this.isShowDialog = false;
        this.$parent.queryHandler();
        this.$message.success('操作成功！');
      }).catch(err => {
        this.loading = false;
        this.$msgbox({
          title: '提示',
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        });
      })
    },
    goStock() {
      this.isShowDialog = false;
      this.$router.push('/inoutstock');
    },
    getIcon(platformId) {
      return this.$parent.getIcon(platformId);
    },
  },
  watch: {
    skuData: {
      handler(val) {
        let selects = new Array(val.beanList.length);
        for (let i = 0; i < selects.length; i++) {
          // 不允许选中已合并的子sku
          selects[i] = {
            isSelect: false,
            // 不可选共享过的和入库过的sku
            disabled: val.beanList[i].mergedType !== 0 ||
              (val.beanList[i].skuStocks && val.beanList[i].skuStocks.length > 0),
          }
        }
        this.selects = selects;
      },
      immediate: true,
    },
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../../main.less';
.sku-list {}

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
    margin-left: 23px;
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
  .space {
    flex-grow: 1;
  }
}

.body {
  background-color: @white;
  border: solid 1px @borderLine;
}

.sku {
  border-bottom: solid 1px @borderLine;
  padding: 10px 15px;
  display: flex;
  align-items: center;
}

.sku:hover {
  background-color: @tabBg;
  transition: background-color 0.3s;
}

.check {
  margin-right: 5px;
}

.title,
.outerId,
.merged {
  flex-basis: 20%;
  word-break: break-all;
}

.create {
  flex-basis: 15%;
}

.supplier {
  flex-basis: 10%;
}

.operate {
  flex-basis: 10%;
}

.mainsku-dialog {
  .title {
    flex-basis: 50%;
  }
  .outerId {
    flex-basis: 30%;
    word-break: break-all;
  }
  .merged {
    flex-basis: 20%;
  }
  .body {
    max-height: 300px;
    overflow-x: hidden;
    overflow-y: auto;
    margin-bottom: 10px;
  }
}

.pagin {
  text-align: right;
}

.foot {
  text-align: end;
  padding: @smallSize;
}

.sku-list .pl {
  padding-left: @baseSpace*3 + 1;
}

.searchNull {
  padding: 160px 0 173px;
  background-color: @white;
  border: solid 1px @borderLine;
}
</style>
<style lang='less'>
.sku-list {
  .el-dialog__body {
    padding: 10px 20px;
  }
  .el-radio__label {
    display: none;
  }
  .mainsku-dialog {
    .el-form-item {
      margin-bottom: 10px;
    }
    .muted {
      margin-bottom: 10px;
    }
  }
}
</style>
