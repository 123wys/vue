<template>
  <div class="procurement-plan-edit">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/inoutstock' }">出入库</el-breadcrumb-item>
      <el-breadcrumb-item v-text="editMode?'修改采购单':'新建采购单'"></el-breadcrumb-item>
    </el-breadcrumb>
    <!--     <p v-if="editMode">
      <strong>采购单号：{{procurementPlanEdit.ticket.ticketId}}</strong>
      <strong>申请时间：{{procurementPlanEdit.ticket.createTime}}</strong>
      <strong>审核状态：<span :class="getAuditStatusInfo(procurementPlanEdit.ticket.auditStatus,'color')">{{getAuditStatusInfo(procurementPlanEdit.ticket.auditStatus,'label')}}</span></strong>
    </p> -->
    <el-form ref="form" :model='procurementPlanEdit.ticket' label-width="120px" :rules="rules" v-loading="formLoading">
      <el-form-item label="入库仓库" prop="wmsId">
        <el-select class="w260" v-model="procurementPlanEdit.ticket.wmsId" size="small">
          <el-option v-for="(label,key) of repositoryEnum" :label="label" :value="key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入库日期" prop="auditTime">
        <el-date-picker class="w260" type="date" size="small" v-model="procurementPlanEdit.ticket.auditTime" :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="仓库代贴条码">
        <el-checkbox v-model="procurementPlanEdit.ticket.barCodeType" :true-label="1" false-label=""></el-checkbox>
        <el-tooltip effect="light" content="如果您的商品本身没有国内注册的条形码（如进口商品），需要京东仓库代贴注册条形码的勾选此项" popper-class="help-popper">
          <i class="iconfont icon-bangzhu1 blue help"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="备注信息" prop="ticketComments">
        <el-input class="w520" :maxlength="50" v-model="procurementPlanEdit.ticket.ticketComments" placeholder="50字内"></el-input>
      </el-form-item>
      <el-form-item label="采购商品">
        <el-button type="text" size="small" @click="showProdDialogHandler">添加商品</el-button>
        <div class="pro-prod" v-if="procurementPlanEdit.items.length">
          <div class="list-head">
            <div class="prod-title">商品</div>
            <div class="sku-spec">SKU规格</div>
            <div class="number">采购总数（件）</div>
            <div class="operate">操作</div>
          </div>
          <div class="sku" v-for="(item,index) of procurementPlanEdit.items">
            <div class="prod-title" v-text="item.skuTitle"></div>
            <div class="sku-spec">
              <div v-text="item.skuProperties"></div>
              <div v-text="item.outerId"></div>
            </div>
            <div class="number">
              <el-input ref="numInput" type="number" size="small" min="0" :value="item.quantityNum" @input="changeNum($event,item,index)"></el-input>
            </div>
            <div class="operate">
              <el-button type="text" size="small" @click="removeItem(index)">移除</el-button>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submitHandler">提交审核</el-button>
        <el-button size="small" @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog v-model="dialogShow" title="选择商品" custom-class="prod-dialog" top="5%">
      <div><strong>提示：如入库实体仓库，商品须先注册</strong></div>
      </br>
      <el-form v-model='query' label-width="60px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称">
              <el-input class="w240" v-model="query.name" size="small" @keyup.enter.native="searchHandler" placeholder="商品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="自编码">
              <el-input class="w240" v-model="query.outerId" size="small" placeholder="商品自编码">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" size="small" @click="searchHandler">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="prods" v-loading="loading">
        <div class="list-head">
          <el-checkbox class="check" v-model="isDialogSelectedAll">全选</el-checkbox>
          <div class="title">商品</div>
          <div class="outerId">规格/自编码</div>
          <span class="state">注册状态</span>
          <div class="price">售价</div>
        </div>
        <template v-if="skuData && skuData.amount">
          <div class="list-body">
            <div class="sku" v-for="(sku,index) of skuData.beanList" :key="sku.skuId">
              <el-checkbox class="check" v-model="selects[index]"></el-checkbox>
              <div class="title">{{sku.skuName}}</div>
              <div class="outerId">
                <div>{{sku.skuCharSpec}}</div>
                <div class="muted">{{sku.outerId}}</div>
              </div>
              <div class="state" v-text="registerEnum[sku.wmsStatus]"></div>
              <div class="price" v-text="(sku.price/100).toFixed(2)"></div>
            </div>
          </div>
        </template>
        <searchNull v-else></searchNull>
      </div>
      <el-pagination class="pagination" @size-change="sizeChangeHandler" @current-change="currentChangeHandler" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" :total="skuData.amount" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogShow=false">取消</el-button>
        <el-button size="small" type="primary" @click="dialogSure">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import ShopSellableStock from './ShopSellableStock.vue';
import cloneDeep from 'lodash/cloneDeep';
import axios from 'axios';
import unionBy from 'lodash/unionBy';
import imgerr from '../../assets/img/imgerror.png'
const querySkuUrl = '/product/prodoffering/querySku';
const applyPurchasePlanUrl = '/warehouse/warehouse/applyPurchasePlan';
const modifyPurchasePlanUrl = '/warehouse/warehouse/modifyPurchasePlan';
let now = new Date();
let yesterdayTime = now.setDate(now.getDate() - 1);
export default {
  name: 'procurement-plan-edit',
  data() {
    return {
      editMode: false,
      procurementPlanEdit: {
        ticket: {
          ticketId: '',
          ticketType: 101,
          ticketTitle: 'title',
          barCodeType: '',
          wmsId: '',
          auditTime: '',
          ticketComments: '',
        },
        items: [],
      },
      dialogShow: false,
      query: {
        name: '',
        outerId: '',
        mergedType: [0, 1],
      },
      pageSize: 10,
      pageNumber: 1,
      skuData: {
        amount: 0,
        beanList: [],
      },
      selects: [],
      formLoading: false,
      loading: false,
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() <= yesterdayTime;
        },
      },
      rules: {
        wmsId: {
          required: true,
          message: '请选择',
          trigger: 'change',
        },
        auditTime: {
          required: true,
          type: 'date',
          message: '请选择',
          trigger: 'change',
        },
        ticketComments: {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
      },
      registerEnum: {
        '': '未注册',
        0: '未注册',
        1: '注册中',
        2: '已注册',
      },
    }
  },
  computed: {
    repositoryEnum() {
      return this.$store.state.enumSet.repositoryEnum;
    },
    dialogSelection() {
      return this.skuData.beanList.filter((n, i) => this.selects[i]);
    },
    isDialogSelectedAll: {
      get() {
        return this.selects.length > 0 && this.selects.every(n => n);
      },
      set(val) {
        this.selects = new Array(this.selects.length).fill(val);
      }
    },
  },
  methods: {
    initStock() {
      this.$router.push('/initstock');
    },
    removeItem(index) {
      this.procurementPlanEdit.items.splice(index, 1);
    },
    searchHandler() {
      this.loading = true;
      axios.post(querySkuUrl, {
        queryCondition: this.query,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      }).then(response => {
        this.skuData = response.data;
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        this.$msgbox({
          title: '提示',
          message: '查询失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    sizeChangeHandler(pageSize) {
      this.pageSize = pageSize;
      this.searchHandler();
    },
    currentChangeHandler(pageNumber) {
      this.pageNumber = pageNumber;
      this.searchHandler();
    },
    dialogSure() {
      // let offering = this.skuData.offeringList[this.radio];
      this.procurementPlanEdit.items = unionBy(this.procurementPlanEdit.items,
        this.dialogSelection.map(n => {
          return {
            offeringId: n.offeringId,
            offeringTitle: n.skuName,
            offeringImageUrl: n.imageFileName,
            skuId: n.skuId,
            skuTitle: n.skuName,
            skuProperties: n.skuCharSpec || 'n/a',
            wmsGoodsId: n.wmsGoodsId || 'n/a',
            barCode: n.barCode || 'n/a',
            outerId: n.outerId,
            skuImageUrl: n.imageFileName,
            skuPrice: n.price,
            quantityNum: 0,
            defectiveNum: 0,
          }
        }), 'skuId');
      this.dialogShow = false;
    },
    changeNum(val, item, index) { // 对输入数字格式化
      let useVal;
      if (val === '' || val < 0) {
        useVal = 0;
      } else {
        useVal = Math.ceil(val);
      }
      if (useVal.toString() !== val) {
        this.$refs.numInput[index].$refs.input.value = useVal;
      }
      item.quantityNum = useVal;
    },
    submitHandler() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.procurementPlanEdit.items.length) {
            this.$message.error('请选择商品！')
            return;
          }
          let url = applyPurchasePlanUrl;
          let msg = '提交成功！';
          if (this.editMode) {
            url = modifyPurchasePlanUrl;
            msg = '修改成功！';
            this.procurementPlanEdit.ticketId = this.procurementPlanEdit.ticket.ticketId;
            this.procurementPlanEdit.comment = this.procurementPlanEdit.ticket.ticketComments;
          }
          this.formLoading = true;
          axios.post(url, this.procurementPlanEdit).then(response => {
            this.formLoading = false;
            this.$message.success(msg);
            this.$router.push('/inoutstock');
          }).catch(err => {
            this.formLoading = false;
            this.$msgbox({
              title: '提示',
              message: '操作失败，' + (err.response ? err.response.data : err),
              type: 'error',
            });
          })
        } else {
          return false;
        }
      });
    },
    showProdDialogHandler() {
      this.dialogShow = true;
      this.searchHandler();
    },
    imgErrorHandler(event) {
      event.target.src = imgerr;
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
  activated() {
    let statePlan = this.$store.state.stock.plan;
    this.editMode = Boolean(statePlan);
    let procurementPlanEdit = Object.assign({
      ticket: {
        ticketId: '',
        ticketType: 101,
        ticketTitle: 'title',
        barCodeType: '',
        wmsId: '',
        auditTime: '',
        ticketComments: '',
      },
      items: [],
    }, cloneDeep(statePlan));
    procurementPlanEdit.ticket.wmsId += '';
    if (procurementPlanEdit.ticket.auditTime) {
      procurementPlanEdit.ticket.auditTime = new Date(procurementPlanEdit.ticket.auditTime);
    }
    procurementPlanEdit.items.forEach(n => {
      n.skuProperties = n.skuProperties || 'n/a';
      n.wmsGoodsId = n.wmsGoodsId || 'n/a';
      n.barCode = n.barCode || 'n/a';
    })
    this.procurementPlanEdit = procurementPlanEdit;
    if (!this.editMode) {
      this.$refs.form.resetFields();
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.procurement-plan-edit {
  padding: 15px;
  .el-form {
    margin-top: 15px;
  }
}

.w260 {
  width: 260px;
}

.w520 {
  width: 520px;
}

.search {
  width: 360px;
  margin-bottom: 20px;
}

.pro-prod {
  line-height: initial;
  width: 700px;
  .sku {
    // background-color: @whith;
  }
  .prod-title {
    flex-basis: 40%;
  }
  .sku-spec {
    flex-basis: 30%;
  }
  .number {
    flex-basis: 20%;
  }
  .operate {
    flex-basis: 10%;
    text-align: center;
  }
}

.list-head {
  background-color: @tabBg;
  font-size: 14px;
  padding: @baseSpace*2;
  // border: solid 1px @borderLine;
  border-bottom: none;
  display: flex;
  .title {
    flex-basis: 33%;
  }
  .price {
    text-align: center;
    margin-right: 0;
  }
}

.list-body {
  max-height: 300px;
  overflow-y: scroll;
  margin-bottom: 20px;
}

.sku {
  border: solid 1px @borderLine;
  padding: 10px;
  display: flex;
  align-items: center;
  /*border-top: none;*/
  + .sku {
    border: solid 1px @borderLine;
    margin-top: @baseSpace*2;
  }
}

.sku:hover {
  background-color: @tabBg;
  transition: background-color 0.3s;
}

.check {
  margin-right: 5px;
}

.title {
  flex-basis: 40%;
}

.outerId {
  flex-basis: 25%;
}

.state {
  flex-basis: 15%;
}

.price {
  flex-basis: 15%;
  text-align: right;
  margin-right: 10px;
}

.searchNull {
  padding: 70px 0 10px;
  border: solid 1px @borderLine;
}

.pagination {
  text-align: right;
}

.help {
  cursor: help;
}
</style>
<style lang="less">
@import '../../main.less';
.procurement-plan-edit {
  .el-dialog__body {
    padding: 20px;
  }
  .el-radio__label {
    display: none;
  }
  .el-form-item.is-required .el-form-item__label:before {
    display: none;
  }
  .help-popper {
    padding: 0;
    color: @neutralGary;
    border-color: @borderLine !important;
  }
}
</style>
