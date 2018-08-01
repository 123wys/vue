<template>
  <div class="err-order-list">
    <div class="head">
      <div class="list-head">
        <div class="title">商品</div>
        <div class="price">单价</div>
        <div class="number">数量</div>
        <div class="action">操作</div>
      </div>
      <div class="list-action">
        <el-checkbox v-if="fullPath !== 'undisorder' && fullPath !== 'deadorder'" class="select-all" v-model="isSelectAll">全选</el-checkbox>
        <div class="batch">
          <!-- <el-button v-if="fullPath !== 'undisorder' && fullPath !== 'deadorder'" size="small" @click="batchActionHandler('cdlz')">批量流转</el-button> -->
          <el-button v-if="fullPath !== 'undisorder' && fullPath !== 'deadorder'" size="small" @click="batchActionHandler('jbz')">批量备注</el-button>
        </div>
        <div class="check">
          <el-checkbox v-if="fullPath !== 'undisorder' && fullPath !== 'deadorder'" v-model="hideProd">隐藏商品信息</el-checkbox>
        </div>
        <el-button v-if="fullPath !== 'undisorder' && fullPath !== 'deadorder'" type="success" size="small" @click="batchActionHandler('all')" style="margin-right:10px;">全部流转</el-button>
        <paging :page-size="pageSize" :page-number="pageNumber" :total='orderData.amount' @current-change="currentChangeHandler"></paging>
      </div>
    </div>
    <template v-if="orderData && orderData.amount>0">
      <error-order-parent v-for="(order, i) of orderData.custOrder4Iboss" :order="order" :hide-prod="hideProd" :select="selectWrap[i]" :fullPath="fullPath" @select-change-p="selectChangeP(i, ...$event)" @action="actionHandler(i, ...$event)" @actionCode="actionHandlerCode(i, ...$event)"></error-order-parent>
    </template>
    <div v-else class="nullstyle">
      <searchNull class="margin-t80" style="padding-top:60px;"></searchNull>
    </div>
    <div class="foot">
      <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" :total="orderData.amount" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import debounce from 'lodash/debounce'
import ErrorOrderParent from './ErrorOrderParent'
import Paging from '../common/Paging'
import Vue from 'vue'
import {
  Checkbox,
  Button,
  Pagination,
} from 'element-ui'
Vue.use(Checkbox)
Vue.use(Button)
Vue.use(Pagination)
export default {
  name: 'error-order-list',
  props: {
    orderData: {
      default: function() {
        return {
          amount: 0,
          list: [],
        }
      }
    },
    pageSize: {
      required: true,
    },
    pageNumber: {
      required: true,
    },
    fullPath: '',
  },
  components: {
    ErrorOrderParent,
    Paging,
  },
  data() {
    return {
      selectWrap: [],
      hideProd: window.localStorage.hideProd === 'true',
    }
  },
  computed: {
    isSelectAll: {
      get() {
        return this.selectWrap.length === 0 ? false : this.selectWrap.length && this.selectWrap.every(n => n);
      },
      set(val) {
        this.selectWrap.forEach((n, i) => {
          if (n !== val) {
            this.selectWrap.splice(i, 1, val);
          }
        });
      }
    },
    selection() {
      let selection = [];
      this.selectWrap.forEach((n, i) => {
        if (n) {
          selection.push(this.orderData.custOrder4Iboss[i]);
        }
      });
      return selection;
    }
  },
  methods: {
    selectChangeP(j, val) {
      this.selectWrap.splice(j, 1, val);
    },
    getSelectWrap(orderData) {
      let selectWrap = [];
      if (orderData && orderData.amount && orderData.custOrder4Iboss && orderData.custOrder4Iboss.length) {
        orderData.custOrder4Iboss.forEach(() => {
          selectWrap.push(false);
        });
      }
      return selectWrap;
    },
    actionHandler(...args) {
      this.$emit('action', args);
    },
    actionHandlerCode(...args) {
      this.$emit('actionCode', args);
    },
    batchActionHandler: debounce(function(action) {
      this.$emit('batch-action', action);
    }, 600, {
      leading: true,
      trailing: false,
    }),
    sizeChangeHandler(args) {
      this.$emit('size-change', args);
    },
    currentChangeHandler(args) {
      if (this.pageNumber === args) return;
      this.$emit('current-change', args);
    },
  },
  watch: {
    orderData: {
      handler(val) {
        this.selectWrap = this.getSelectWrap(val);
      },
      immediate: true,
    },
    hideProd(val) {
      window.localStorage.hideProd = val;
    }
  },
  created() {
    this.selectWrap = this.getSelectWrap(this.orderData);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../../main.less';
.err-order-list > div {
  margin-bottom: @smallSize;
}

.head {
  line-height: 20px;
  border: solid 1px @borderLine;
}

.list-head {
  background-color: #eff2f7;
  display: flex;
  font-size: 14px;
  padding: @normalSize;
  .title {
    flex-basis: 43%;
    margin-left: 2%;
  }
  .price {
    flex-basis: 10%;
  }
  .number {
    flex-basis: 30%;
  }
  .action {
    flex-basis: 15%
  }
}

.list-action {
  padding: @smallSize - 5px 0;
  display: flex;
  /*justify-content: space-between;*/
  align-items: baseline;
  .select-all,
  .batch,
  .paging {
    padding: 0 @baseSpace * 2;
  }
  .check {
    flex-grow: 1;
    margin-left: @baseSpace * 2;
  }
}

.nullstyle {
  height: 420px;
  border:solid 1px #E5E9F2;
}

.foot {
  text-align: end;
  padding: @smallSize;
}
</style>
