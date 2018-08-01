<template>
  <div class="share-stock">
    <el-form v-model='query' label-width="90px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="名称">
            <el-input class="w240" v-model="query.name" size="small" @keyup.enter.native="queryHandler" placeholder="商品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="自编码">
            <el-input class="w240" v-model="query.outerId" size="small" placeholder="商品自编码">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="共享类型">
            <el-select class="w240" v-model="query.mergedType" size="small">
              <el-option v-for="item of mergedTypes" :label="item.label" :value="item.value" :key="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" size="small" @click="queryHandler">搜索</el-button>
      </el-form-item>
    </el-form>
    <sku-list :search-loading="loading" :sku-data="skuData" :page-size="pageSize" :page-number="pageNumber" @size-change="sizeChangeHandler" @current-change="currentChangeHandler">
    </sku-list>
  </div>
</template>
<script>
import SkuList from './SkuList';
import skuMixin from './skuMixin';
export default {
  name: 'share-stock',
  mixins: [skuMixin],
  components: {
    SkuList,
  },
  computed: {
    tenantId() {
      return this.$store.state.user.ichannel.tenantInfo.tenantId;
    }
  },
  mounted() {
    this.queryStock = true;
    this.query.supplierTenantId = this.tenantId;
    this.queryHandler();
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../../main.less';
.share-stock {
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
