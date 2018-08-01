<template>
  <span class="paging">
    <span class="total-label">
      共 <span class="total-number" v-text="total.toLocaleString()"></span> 条
  </span>
  <span class="prev" @click=prev :class="pageNumber== 1 ? 'disabled' : '' "><i class="el-icon-arrow-left"></i></span>
  <span class="blue">{{pageNumber}}</span>
  <span>/ {{totalPage}}</span>
  <span class="next" @click=next :class="pageNumber===totalPage ? 'disabled' : '' "><i class="el-icon-arrow-right"></i></span>
  </span>
</template>
<script>
import debounce from 'lodash/debounce'
export default {
  name: 'paging',
  props: {
    pageNumber: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    totalPage() {
      return Math.ceil(this.total / this.pageSize) || 1;
    }
  },
  methods: {
    prev: debounce(function() {
      if (this.pageNumber > 1) {
        this.$emit('current-change', this.pageNumber - 1);
      }
    }, 500, {
      leading: true,
      trailing: false
    }),
    next: debounce(function() {
      if (this.pageNumber < this.totalPage) {
        this.$emit('current-change', this.pageNumber + 1);
      }
    }, 500, {
      leading: true,
      trailing: false
    })
  },
  components: {}
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.paging {
  border-left: solid 1px @borderLine;
  padding-left: @baseSpace * 2;
}
.total-label {
  color: @lightGary;
  .total-number {
    color: @black;
  }
  margin-right: @baseSpace * 2;
}

.prev,
.next {
  cursor: pointer;
  .el-icon-arrow-left,
  .el-icon-arrow-right {
    color: @lightGary;
  }
}

.prev {
  padding-right: @baseSpace;
}

.next {
  padding-left: @baseSpace;
}

.blue {
  color: #20A0FF;
}

.disabled {
  cursor: not-allowed;
}
</style>
