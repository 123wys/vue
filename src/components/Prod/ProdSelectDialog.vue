<template>
  <div style="height:680px;">
    <el-input placeholder="输入商品名称/商品自编码" v-model.trim="nameOrOutId" @keyup.enter.native="searchProd()">
      <template slot="append">
        <el-button @click="searchProd()">搜索商品</el-button>
      </template>
    </el-input>
    <div class="tableData">
      <div class="head">
        <div class="prodName textIndent">商品名/规格</div>
      </div>
      <div class="tableaction batchBtn">
        <el-checkbox class="select-all" v-model="isSelectAll" :indeterminate="isIndeterminate">全选</el-checkbox>
        <div class="batchBtn">
         <!--  <el-button size="small" @click="batchActionHandle()">批量设置</el-button> -->
        </div>
        <paging class="paging" :page-size="pageSize" :page-number="pageNumber" :total='prodSelectList.amount' @current-change="currentChangeHandler"></paging>
      </div>
    </div>
    <template v-if="prodSelectList && prodSelectList.amount">
      <div class="body" v-loading.body="loading" element-loading-text="拼命加载中...">
        <div class="prod" v-for="(offering,index) of prodSelectList.offeringList" :key="offering.outerOfferingId">
          <div class="prodmsg">
            <div class="title">
              <div class="title-left">
                <el-checkbox class="check" v-model="selects[index]"></el-checkbox>
                <el-popover popper-class="popper-img" trigger="hover" placement="top" :visible-arrow="false">
                  <img :src="offering.imageFileName">
                  <img class="title-img" slot="reference" :src="offering.imageFileName" @error='imgErrorHandler(offering)'>
                </el-popover>
              </div>
              <div class="title-right">
                <div class="name" v-text="offering.offeringName"></div>
                <el-tag type="warning" v-if="offering.isPresale">预售</el-tag>
                <div class="shop"><svg class="icon iconfont" aria-hidden="true"><use :xlink:href="'#' + getIcon(offering.platformId).split(' ')[2]"></use></svg>{{shopEnum[offering.shopId]}}</div>
                <div class="catalog" v-text="offering.catalogName"></div>
              </div>
            </div>
          </div>
          <div class="sku" v-for="sku of offering.skuList" :key="sku.outerId">
            <div class="title">
              <div class="title-left"></div>
              <div class="title-right">
                <div class="name" v-text="sku.skuCharSpec"></div>
                <div class="catalog">商家自编码：<span v-text="sku.outerId"></span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <searchNull v-else></searchNull>
    <pagination class="pl" v-model="isSelectAll" :indeterminate="isIndeterminate" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" :total="prodSelectList.amount" @size-change="sizeChangeHandler" @current-change="currentChangeHandler"></pagination>
    <div class="btn">
      <el-button type="primary" size="small" @click="confirm()">确定</el-button>
      <el-button size="small" @click="close">取消</el-button>
    </div>
  </div>
</template>
<script>
import {
  mapState
} from 'vuex';
import axios from 'axios';
import Paging from '../common/Paging';
import Pagination from '../common/Pagination';
import imgerr from '../../assets/img/imgerror.png'
export default{
  name: 'prodSelectDialog',
  data() {
    return {
      pageSize: 10,
      pageNumber: 1,
      nameOrOutId: '',
      selects: [],
      prodSelectList: {
        amount: 0,
        offeringList: [],
      },
      loading: false,
    }
  },
  computed: {
    isSelectAll: {
      get() {
        return this.selects.length > 0 && this.selects.every(n => n);
      },
      set(val) {
        this.selects.forEach((n, i) => {
          this.selects.splice(i, 1, val);
        })
      }
    },
    sellectedIds() {
      let sellectedIds = [];
      this.selects.forEach((n, i) => {
        if (n) {
          sellectedIds.push(this.prodSelectList.offeringList[i])
        }
      });
      return sellectedIds;
    },
    isIndeterminate() {
      return this.sellectedIds.length > 0 && this.sellectedIds.length < this.prodSelectList.offeringList.length;
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
    currentChangeHandler(val) {
      this.pageNumber = val;
      this.searchProd();
    },
    sizeChangeHandler(val) {
      this.pageSize = val;
      this.searchProd();
    },
    getIcon(platformId) {
      if (this.$store.state.enumSet.platform[platformId] === undefined) {
        return 'icon iconfont icon-disanfangdianpu';
      }
      return this.$store.state.enumSet.platform[platformId];
    },
    confirm() {
      if (this.sellectedIds.length <= 0) {
        this.$message.info('请至少选择一个商品！');
        return;
      }
      this.$emit('confirm', this.sellectedIds);
    },
    close() {
      this.$emit('cancel');
    },
    imgErrorHandler(offering) {
      offering.imageFileName = imgerr;
    },
    searchProd() {
      this.loading = true;
      let query = {
        queryCondition: {
          nameOrOuterId: this.nameOrOutId,
          nullSupplier: 1
        },
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }
      axios.post('/product/prodoffering/queryProducts', query)
        .then(res => {
          this.loading = false;
          this.prodSelectList = res.data;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error({
            message: err.response ? err.response.data : err
          });
        })
    },
  },
  components: {
    Paging,
    Pagination
  },
  mounted() {
    this.searchProd('');
  },
  watch: {
    prodSelectList: {
      handler(val) {
        let length = val.offeringList.length
        this.selects = new Array(length).fill(false);
      },
      immediate: true,
    }
  },
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.el-input{
  width: 320px;
}

.tableData {
  margin-top: @baseSpace * 4;
  margin-bottom: @baseSpace * 2;
  border: solid 1px @borderLine;
  &:nth-child(3) {
    margin-top: @baseSpace * 2;
  }
}

.tableborder {
  border-left: solid 1px @borderLine;
  border-right: solid 1px @borderLine;
  border-top: solid 1px @borderLine;
}

.head {
  background-color: @tabBg;
  display: flex;
  font-size: @fontSize14;
  padding: 0 @baseSpace * 3;
  height: @baseSpace * 8;
  line-height: @baseSpace * 8;
  &:not(:first-child) {
    border-top: 1px solid @borderLine;
  }
  .prodName {
    flex-basis: 100%;
    margin-left: 15px;
  }
  .textIndent {
    text-indent: @baseSpace;
  }
}

.tableaction {
  padding: @baseSpace + 3px 0 0 @baseSpace * 3;
  display: flex;
  border-top: 1px solid @borderLine;
  align-items: baseline;
  height: @baseSpace * 8;
  .select-all {
    font-size: @baseFont;
  }
  .batchBtn,
  .paging {
    font-size: @baseFont;
    padding: 0 @baseSpace * 2;
  }
  .batchBtn {
    flex-grow: 1;
  }
  .paging {
    margin-left: 10px;
    border-left: solid 1px @borderLine;
  }
}

.body {
  background-color: @white;
  height: 400px;
  overflow-y: auto;
}

.prod {
  border: solid 1px @borderLine;
  /*border-top: none;*/
  + .prod {
    border: solid 1px @borderLine;
    margin-top: @baseSpace*2;
  }
}

.prod:hover {
  background-color: @tabBg;
  transition: background-color 0.3s;
}

.prodmsg {
  background-color: #e8f5ff;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.prodmsg,
.sku {
  display: flex;
  padding: @baseSize*2 @baseSize*3;
}

.sku {
  padding-left: @baseSize*3;
  .title {
    padding-left: 87px;
  }
}

.prodmsg + .sku {
  border-top: solid 1px @borderLine;
}

.sku + .sku {
  border-top: dashed 1px @borderLine;
}

.title {
  width: 100%;
  display: flex;
  .title-img {
    height: @prodImg;
    width: @prodImg;
    margin-right: @baseSize*2;
    display: block;
  }
  .title-left {
    display: flex;
    align-items: center;
    .check {
      margin-right: @baseSpace;
    }
  }
  .title-right {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    .name {
      width: 100%;
    }
    >*:not(:first-child) {
      margin-right: @baseSize;
    }
    .catalog {
      color: @darkGary;
    }
  }
}

.searchNull {
  padding: 160px 0 173px;
  background-color: @white;
  border: solid 1px @borderLine;
}

.btn {
  display: flex;
  justify-content: flex-end;
  padding: 10px 5px;
  border-top: solid 1px @borderLine;
}
</style>
<style lang="less">
@import '../../main.less';
.el-dialog__body {
  padding: 10px 20px 10px 20px !important; 
}
</style>
