<template>
  <div class="register-production-list" v-loading="loading">
    <div class="list">
      <div class="head">
        <span class="title">商品</span>
        <span class="outerId">规格/自编码</span>
        <span class="cate">系统类目</span>
        <span class="barcode">条形码</span>
        <span class="state">注册状态</span>
      </div>
      <div class="list-action">
        <el-checkbox v-model="isSellectAll">全选</el-checkbox>
        <el-button size="small" @click="rsgisterProdHandler">注册到京东仓库</el-button>
        <div class="space"></div>
        <paging :page-size="pageSize" :page-number="pageNumber" :total='skuData.amount' @current-change="currentChangeHandler"></paging>
      </div>
      <div class="warning-bunner"><i class="iconfont icon-jinggao yellow warning-icon"></i>
        <div class="warning-content"><span class="warning-title">只有京东实体仓库才需要注册商品，若无京东实体仓，不必注册！</span>
        </div>
      </div>
      <template v-if="skuData && skuData.amount">
        <div class="body" v-loading="searchLoading" element-loading-text="拼命加载中...">
          <div class="sku" v-for="(sku,index) of skuData.beanList" :key="sku.skuId">
            <el-checkbox class="check" v-model="selects[index]"></el-checkbox>
            <div class="title">{{sku.skuName}}</div>
            <div class="outerId">
              <div>{{sku.skuCharSpec}}</div>
              <div class="muted">{{sku.outerId}}</div>
            </div>
            <span class="cate">{{cateEnum[sku.wmsThirdcatNo]}}</span>
            <div class="barcode">{{sku.barCode}}</div>
            <div class="state">{{wmsStatusEnum[sku.wmsStatus]}}</div>
          </div>
        </div>
      </template>
      <searchNull v-else></searchNull>
    </div>
    <pagination class="pl" @size-change="sizeChangeHandler" @current-change="currentChangeHandler" :current-page="pageNumber" :page-sizes="[20, 50, 100]" :page-size="pageSize" :total="skuData.amount"></pagination>
    <el-dialog title="注册/修改" v-model="dialogShow" v-loading="dialogLoading" size="large" top="10%">
      <div class="dialog-body">
        <div class="head">
          <span class="title">商品</span>
          <span class="outerId">规格/自编码</span>
          <span class="cate">系统类目</span>
          <span class="barcode">条形码</span>
          <span class="safedays">保质期（天）<el-tooltip effect="light" content="如果商品有保质期，请务必填入真实保质期，否则京东不给入库。商品没有保质期，请填0。一旦注册保质期无法更改！">
          <i class="iconfont icon-jinggao yellow help"></i>
        </el-tooltip></span>
        </div>
        <div class="batch">
          <div class="title">批量操作</div>
          <div class="outerId"></div>
          <div class="cate">
            <el-cascader class="cascader" size="small" :options="cateOptions" @change="batchCateHandler" filterable clearable>
            </el-cascader>
          </div>
          <div class="barcode">
            <el-input size="small" @change="batchBacodeHandler"></el-input>
          </div>
          <div class="safedays">
            <el-input-number size="small" :min="0" @change="batchSafedaysHandler"></el-input-number>
          </div>
        </div>
        <div class="skus">
          <div class="sku" v-for="(sku,index) of selection" :key="sku.skuId">
            <div class="title">{{sku.skuName}}</div>
            <div class="outerId">
              <div>{{sku.skuCharSpec}}</div>
              <div class="muted">{{sku.outerId}}</div>
            </div>
            <div class="cate">
              <el-cascader class="cascader" size="small" v-if="skuWmsInfos[index]" v-model="skuWmsInfos[index].wmsThirdcatNo" :options="cateOptions" filterable clearable>
              </el-cascader>
            </div>
            <div class="barcode">
              <el-input size="small" v-if="skuWmsInfos[index]" v-model="skuWmsInfos[index].barCode"></el-input>
            </div>
            <div class="safedays">
              <el-input-number size="small" :min="0" v-if="skuWmsInfos[index]" v-model="skuWmsInfos[index].safeDays"></el-input-number>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="dialogShow = false" size="small">取 消</el-button>
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
import cateEnum from '../../assets/cateEnum.js'
import cateOptions from '../../assets/cateOptions.json'
import {
  noEmptyItem,
} from '../../assets/util';
let setSkuWmsInfoUrl = 'product/prodoffering/setSkuWmsInfo';
// let imgPre = 'http://images.i-boss.cn/';
export default {
  name: 'register-production-list',
  props: {
    skuData: {
      default: function() {
        return {
          amount: 0,
          beanList: [],
        }
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
    Pagination,
  },
  data() {
    return {
      hideSku: false,
      dialogShow: false,
      rsgistingSkus: [],
      loading: false,
      dialogLoading: false,
      selects: [],
      wmsStatusEnum: {
        '': '未注册',
        0: '未注册',
        1: '注册中',
        2: '已注册',
      },
      cateEnum,
      cateOptions,
      skuWmsInfos: [],
    }
  },
  computed: {
    ...mapState({
      supplierEnum: state => state.enumSet.supplierEnum,
      shopEnum: state => state.enumSet.shopEnum,
    }),
    tenantEnum() {
      return this.$store.getters.tenantEnum;
    },
    isSellectAll: {
      get() {
        return this.selects.length > 0 && this.selects.every(n => n);
      },
      set(val) {
        this.selects = new Array(this.selects.length).fill(val);
      }
    },
    selection() {
      return this.skuData.beanList.filter((n, i) => this.selects[i]);
    }
  },
  methods: {
    sizeChangeHandler(pageSize) {
      this.$emit('size-change', pageSize);
    },
    currentChangeHandler(pageNumber) {
      this.$emit('current-change', pageNumber);
    },
    imgErrorHandler(offering) {
      offering.imageFileName = imgerr;
    },
    rsgisterProdHandler(offering) {
      if (this.selection.length === 0) {
        this.$message.error('请至少选择1项！');
        return;
      }
      this.skuWmsInfos = this.selection.map(n => {
        let catNo = n.wmsThirdcatNo;
        let wmsThirdcatNo = ['', '', catNo];
        // 如果有规格，找出父级
        if (catNo) {
          this.cateOptions.some(n => {
            let flag = n.children.some(m => {
              if (m.children.some(o => o.value === catNo)) {
                wmsThirdcatNo[1] = m.value;
                return true;
              };
            })
            if (flag) {
              wmsThirdcatNo[0] = n.value;
              return true;
            }
          });
        }
        return {
          wmsThirdcatNo,
          barCode: n.barCode,
          mergedSkuId: n.skuId,
          safeDays: n.safeDays,
        }
      });
      this.dialogShow = true;
    },
    batchCateHandler(val) {
      this.skuWmsInfos.forEach(n => {
        n.wmsThirdcatNo = val;
      })
    },
    batchBacodeHandler(val) {
      this.skuWmsInfos.forEach(n => {
        n.barCode = val;
      })
    },
    batchSafedaysHandler(val) {
      this.skuWmsInfos.forEach(n => {
        n.safeDays = val;
      })
    },
    dialogSure() {
      if (!noEmptyItem(this.skuWmsInfos, 'barCode')) {
        this.$message.error('请完善注册信息！');
        return;
      }
      let skuWmsInfos = this.skuWmsInfos.map(n => ({
        mergedSkuId: n.mergedSkuId,
        barCode: n.barCode,
        wmsThirdcatNo: n.wmsThirdcatNo[2],
        safeDays: n.safeDays || 0,
      }))
      this.dialogLoading = true;
      axios.post(setSkuWmsInfoUrl, {
        skuWmsInfos,
      }).then(() => {
        this.dialogLoading = false;
        this.dialogShow = false;
        this.$parent.queryHandler();
        this.$message.success('操作成功！')
      }).catch(err => {
        this.dialogLoading = false;
        this.$msgbox({
          title: '提示',
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    getIcon(platformId) {
      return this.$parent.getIcon(platformId);
    },
  },
  watch: {
    skuData: {
      handler(val) {
        this.selects = new Array(val.beanList.length).fill(false);
      },
      immediate: true,
    },
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../../main.less';
.register-production-list {}

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
  .space {
    flex-grow: 1;
  }
}

.body {}

.skus {
  max-height: 300px;
  overflow-y: scroll;
}

.batch,
.sku {
  background-color: @white;
  border: solid 1px @borderLine;
  padding: @baseSize*2 @baseSize*3;
  display: flex;
  align-items: center;
  margin-bottom: @baseSpace*2;
  /*border-top: none;*/
  + .sku {
    border: solid 1px @borderLine;
  }
}

.batch {
  padding-right: 34px;
}

.body .sku:hover {
  background-color: @tabBg;
  transition: background-color 0.3s;
}

.check {
  margin-right: 10px;
}

.title {
  width: 25%;
}

.outerId {
  width: 25%;
}

.cate {
  width: 25%;
  padding-right: @baseSpace*3;
}

.barcode {
  width: 25%;
}

.state {
  width: 10%;
}

.foot {
  text-align: end;
  padding: @smallSize;
}

.dialog-body {
  .cascader {
    width: 100%;
    min-width: 240px;
  }
  .outerId {
    width: 20%;
    padding-right: 10px;
  }
  .cate {
    width: 20%;
    flex-grow: 1;
    padding-right: 10px;
  }
  .barcode {
    width: 15%;
    flex-grow: 1;
    padding-right: 10px;
  }
  .safedays {
    width: 10%;
    flex-grow: 1;
    padding-right: 10px;
  }
}

.register-production-list .pl {
  padding-left: @baseSpace*3 + 1;
}

.searchNull {
  padding: 160px 0 173px;
  background-color: @white;
  border: solid 1px @borderLine;
}

.help {
  cursor: help;
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
}
</style>
