<template>
  <div class="order-list">
    <div class="head">
      <div class="list-head">
        <div class="title">商品</div>
        <div class="price">单价/数量</div>
        <!-- <div class="number">数量</div> -->
        <div class="warranty">状态</div>
        <div class="action">订单操作</div>
      </div>
      <div class="list-action">
        <el-checkbox class="select-all" v-model="isSelectAll">全选</el-checkbox>
        <div class="batch">
          <el-button size="small" v-if="status==6" @click="batchActionHandler('qrdh')">批量确认到货</el-button>
          <el-button size="small" v-if="status==7" @click="batchActionHandler('shtg')">批量过审</el-button>
          <el-button size="small" v-if="status==7" @click="batchActionHandler('gc')">批量改仓</el-button>
          <el-button size="small" v-if="status==7" @click="batchActionHandler('qxdd')">批量取消</el-button>
          <el-button size="small" type="primary" v-if="status==1||status=='all'" @click="batchActionHandler('dywld')">打印快递单</el-button>
          <el-button size="small" v-if="status==1||status=='all'" @click="batchActionHandler('cnes')">打印菜鸟面单</el-button>
          <el-button size="small" v-if="status==1||status=='all'" @click="batchActionHandler('dyfhd')">打印发货单</el-button>
          <el-button size="small" v-if="status=='all'" @click="batchActionHandler('ppgys')">批量匹配供应商</el-button>
          <el-button size="small" v-if="status==6" @click="batchActionHandler('thsh')">批量退审</el-button>
          <el-button size="small" v-if="status!=='all'&&status!=1" @click="batchActionHandler('jbz')">批量备注</el-button>
        </div>
        <div class="check">
          <!--           <template v-if="status=='all'">
            <el-checkbox>不显示已发货</el-checkbox>
            <el-checkbox>不显示已关闭</el-checkbox>
          </template> -->
          <!-- <el-checkbox v-model="hideProd" style="margin-left:10px;">隐藏商品信息</el-checkbox> -->
        </div>
        <!-- <el-button type="primary" size="small" v-if="status==1" @click="busExport">导出订单</el-button> -->
        <!-- <el-button size="small" v-if="status==1" @click="goExport">查看导出记录</el-button> -->
        <el-button type="success" size="small" @click="batchActionHandler('cyd')">批量发货</el-button>
        <paging :page-size="pageSize" :page-number="pageNumber" :total='orderData.amount' @current-change="currentChangeHandler"></paging>
      </div>
    </div>
    <template v-if="orderData && orderData.amount>0">
      <order-parent v-for="(order, i) of orderData.beanList" :order="order" :select-inner="selectWrap[i]" :hide-prod="hideProd" @select-change-p="selectChangeP(i, ...$event)" @action="actionHandler(i, ...$event)"></order-parent>
    </template>
    <searchNull v-else></searchNull>
    <pagination v-model="isSelectAll" @size-change="sizeChangeHandler" @current-change="currentChangeHandler" :current-page="pageNumber" :page-sizes="[20, 50, 100]" :page-size="pageSize" :total="orderData.amount"></pagination>
  </div>
</template>
<script>
import debounce from 'lodash/debounce'
import OrderParent from './OrderParent'
import Paging from '../common/Paging'
import Pagination from '../common/Pagination'
// import bus from '../../store/bus.js'
export default {
  name: 'order-list',
  props: {
    orderData: {
      default: function() {
        return {
          amount: 0,
          beanList: [],
        }
      }
    },
    status: {
      required: true,
    },
    pageSize: {
      required: true,
    },
    pageNumber: {
      required: true,
    },
  },
  components: {
    OrderParent,
    Paging,
    Pagination,
  },
  data() {
    return {
      selectWrap: [],
      hideProd: false,
    }
  },
  computed: {
    isSelectAll: {
      get() {
        return this.selectWrap.length === 0 ? false : this.selectWrap.length && this.selectWrap.every(n => n.every(m => m));
      },
      set(val) {
        this.selectWrap.forEach(n => {
          n.forEach((m, j) => {
            if (m !== val) {
              n.splice(j, 1, val);
            }
          });
        });
      }
    },
    selection() {
      let selection = [];
      this.selectWrap.forEach((n, i) => {
        n.forEach((m, j) => {
          if (m) {
            let slt = this.orderData.beanList[i].orders[j];
            slt.ordId = this.orderData.beanList[i].ordId;
            selection.push(slt);
          }
        });
      });
      return selection;
    }
  },
  methods: {
    // goExport() {
    //   this.$store.commit('setTaskName', 'orderExport');
    //   this.$router.push('/taskcenter');
    // },
    selectChangeP(i, j, val) {
      this.selectWrap[i].splice(j, 1, val);
    },
    getSelectWrap(orderData) {
      let selectWrap = [];
      if (orderData && orderData.amount && orderData.beanList && orderData.beanList.length) {
        orderData.beanList.forEach(n => {
          let selectInner = [];
          n.orders.forEach(() => {
            selectInner.push(false);
          });
          selectWrap.push(selectInner);
        });
      }
      return selectWrap;
    },
    actionHandler(...args) {
      this.$emit('action', args);
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
    // 利用bus实现导出订单
    // busExport() {
    //   bus.$emit('export');
    // }
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
.order-list > div {
  margin-bottom: @smallSize;
}

.head {
  border: solid 1px @borderLine;
}

.list-head {
  background-color: @tabBg;
  display: flex;
  font-size: 14px;
  padding: @normalSize;
  .title {
    flex-basis: 30%;
    margin-left: 10%;
  }
  .price {
    flex-basis: 10%;
    text-align: end;
  }
/*  .number {
    flex-basis: 10%;
    text-align: end;
  }*/
  .warranty {
    flex-basis: 10%;
    text-align: end;
  }
  .action {
    flex-grow: 1;
    text-align: center;
  }
}

.list-action {
  background-color: @white;
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
  }
}

.searchNull {
  padding: 160px 0 173px;
  background-color: @white;
  border: solid 1px @borderLine;
}
</style>
<style>
.el-checkbox__label {
  font-size: 12px;
}
</style>
