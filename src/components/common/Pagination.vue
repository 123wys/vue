<template>
  <div class="pagination">
    <div>
      <el-checkbox v-if="isShowSelect" :indeterminate="indeterminate" class="select" v-model="currentValue">全选</el-checkbox> <span class="amount-label">共 <span class="amount-num" v-text="total.toLocaleString()"></span>条 筛选结果</span>
    </div>
    <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler" :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" :total="total" layout="sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: 'pagination',
  props: {
    value: Boolean,
    indeterminate: Boolean,
    isShowSelect: {
      type: Boolean,
      default: true,
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    },
    pageCount: Number,
    currentPage: {
      type: Number,
      default: 1
    },
    pageSizes: {
      type: Array,
      default () {
        return [10, 20, 50];
      }
    },
  },
  computed: {
    currentValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
        this.$emit('change', val)
      }
    }
  },
  methods: {
    sizeChangeHandler(arg) {
      this.$emit('size-change', arg);
    },
    currentChangeHandler(arg) {
      this.$emit('current-change', arg);
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.pagination {
  padding: @smallSize;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .select {
    padding-right: @baseSpace*3;    
  }
  .amount-label {
    color: @lightGary;
  }
  .amount-num {
    color: @black;
  }
}
</style>
