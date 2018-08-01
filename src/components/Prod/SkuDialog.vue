<template>
  <el-dialog custom-class="skuDialog" v-model="dialogShow" title="选择SKU" @open="search(1)" :close-on-click-modal="false">
    <div class="input">
      <el-form label-position="right" label-width="100px" :model="skuForm" ref="skuForm">
        <el-row :gutter="10">
          <el-col :lg="10">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model.trim="skuForm.name" @keyup.native.enter="search"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="10">
            <el-form-item label="商品自编码" prop="outerId">
              <el-input v-model.trim="skuForm.outerId" @keyup.native.enter="search"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="4">
            <div class="searchButton">
              <el-button size="small" type="primary" @click="search">搜索商品</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
     <!--  <el-input size="small" placeholder="商家名称 | 商家自编码" v-model="mix" @keyup.native.enter="search">
        <el-button slot="append" @click="search">搜索商品</el-button>
      </el-input> -->
    </div>
    <div v-if="searchFlag">
      <div class="skuList" v-loading="loading" element-loading-text="拼命加载中..">
        <div class="title">
          <div class="prod">商品/规格</div>
          <!-- <div class="null"></div> -->
          <div class="num">数量</div>
        </div>
        <div class="sku" v-if="skuList.beanList.length">
          <div class="skuDetail" v-for="(sku, i) in skuList.beanList">
            <div class="prod">
              <el-checkbox v-model="selection[i]">{{sku.skuName}}</el-checkbox>
              <div class="prodSku">{{sku.skuCharSpec}}</div>
              <div class="prodSku">商品自编码:{{sku.outerId}}</div>
            </div>
            <!-- <div class="null"></div> -->
            <div class="num">
              <div class="numInput">
                <el-input type="number" size="small" v-model="numArr[i]"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="nullSku" v-else>
          <searchNull></searchNull>
        </div>
      </div>
      <div class="paging">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber" :page-sizes="[5, 10, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="skuList.amount">
        </el-pagination>
      </div>
      <div class="dialogFooter">
        <el-button type="primary" size="small" @click="dialogSure">确定</el-button>
        <el-button size="small" @click="dialogCancel">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import axios from 'axios';
export default {
  name: 'sku-dialog',
  props: {
    dialog: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      pageSize: 5,
      pageNumber: 1,
      skuList: {},
      searchFlag: false,
      loading: false,
      selection: [],
      numArr: [],
      // mix: '',
      skuForm: {
        name: '',
        outerId: ''
      },
    };
  },
  computed: {
    dialogShow: {
      get() {
        return this.dialog;
      },
      set(val) {
        if (val || !this.dialog) return;
        this.$emit('dialog-cancel');
      }
    },
    selectIds() {
      let arr = [];
      this.selection.forEach((ele, m) => {
        if (ele) {
          arr.push({
            sku: this.skuList.beanList[m],
            num: this.numArr[m]
          });
        }
      })
      return arr;
    }
  },
  methods: {
    search(sign) {
      if (sign !== 1) {
        this.loading = true;
      }
      let query = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        queryCondition: {
          mergedType: [0, 1],
          ...this.skuForm
        },
      };
      axios.post('product/prodoffering/querySku', query)
        .then(res => {
          this.skuList = res.data;
          this.searchFlag = true;
          this.loading = false;
        })
        .catch(err => {
          this.$message.error(err.response ? err.response.data : err);
        })
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.search();
    },
    dialogSure() {
      if (!this.selectIds.length) {
        this.$message.info('请选择SKU');
        return;
      }
      let result = this.selectIds.every(n => {
        return n.num > 0
      })
      if (result) {
        this.$emit('dialog-sure', this.selectIds);
      } else {
        this.$message.info('所选SKU分配数不能少于1');
        return;
      }
    },
    dialogCancel() {
      this.$emit('dialog-cancel');
    },
  },
  watch: {
    'skuList.beanList'(val) {
      this.selection = new Array(val.length).fill(false);
      this.numArr = new Array(val.length).fill(0);
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.input {
  // width: 289px;
  .searchButton {
    margin-top: 4px;
  }
}

.skuList {
  margin-top: 15px;
  .title,
  .skuDetail {
    display: flex;
    .prod {
      flex-basis: 75%;
    }
    // .null {
    //   flex-grow: 1;
    // }
    .num {
      flex-basis: 25%;
      padding: 0 10px;
    }
  }
  .title {
    height: 30px;
    text-align: center;
    line-height: 30px;
    background-color: @tabBg;
    border: 1px solid @borderLine;
    font-weight: bold;
  }
  .skuDetail {
    padding: 5px;
    border: 1px solid @borderLine;
    &:first-child {
      margin-top: 15px;
    }
    &:not(:last-child) {
      border-bottom: none;
    }
    &:hover {
      background-color: @tabBg;
    }
    .prod {
      // display: flex;
      // align-items: center;
      .prodSku {
        padding-left: 23px;
      }
    }
    .num {
      display: flex;
      justify-content: center;
      align-items: center;
      .numInput {
        width: 70px;
      }
    }
  }
}

.nullSku {
  border: 1px solid @borderLine;
  overflow: hidden;
  padding-top: 80px;
  margin-top: 10px;
}

.paging {
  display: flex;
  padding: 10px;
  justify-content: flex-end;
}

.dialogFooter {
  text-align: right;
}
</style>
<style lang="less">
@import '../../main.less';
.skuDialog {
  .input {
    .el-form-item {
      margin-bottom: 10px;
    }
  }
  .el-dialog__body {
    padding: 15px 10px 10px;
  }
  .skuDetail {
    .prod {
      .el-checkbox__label {
        font-size: 12px;
      }
    }
  }
}
</style>
