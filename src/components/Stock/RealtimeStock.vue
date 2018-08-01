<template>
  <div class="realtime-stock">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>实时库存</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs v-model="activeComp">
      <el-tab-pane v-for="tab in tabs" :label="tab.label" :name="tab.name" :key="tab.name"></el-tab-pane>
    </el-tabs>
    <div class="right-btn">
      <el-button type="text" @click="initStock"><i class="iconfont icon-chushihua"></i><span>批量入库</span></el-button>
    </div>
    <keep-alive>
      <component :is="activeComp" :key="activeComp"></component>
    </keep-alive>
  </div>
</template>
<script>
import axios from 'axios';
import WarehouseRealtimeStock from './WarehouseRealtimeStock.vue';
// import ShopSellableStock from './ShopSellableStock.vue';
export default {
  name: 'realtime-stock',
  components: {
    WarehouseRealtimeStock,
    // ShopSellableStock,
  },
  data() {
    return {
      tabs: [{
        label: '仓库实时库存',
        name: 'WarehouseRealtimeStock',
      // }, {
      //   label: '店铺可售库存',
      //   name: 'ShopSellableStock',
      }],
      activeComp: 'WarehouseRealtimeStock',
      wmsDetails: [],
    }
  },
  computed: {
    entityWmsTypeEnum() {
      return this.$store.state.enumSet.entityWmsTypeEnum;
    },
  },
  activated() {},
  methods: {
    initStock() {
      this.$router.push('/initstock');
    },
    getEntityWmsName(wmsId) {
      let wms = this.wmsDetails.find(n => n.wmsId === wmsId);
      if (wms) return wms.entityWmsName;
      return '';
    },
    getEntityWmsType(wmsId) {
      let wms = this.wmsDetails.find(n => n.wmsId === wmsId);
      if (wms) return wms.entityWmsType;
      return '';
    },
  },
  mounted() {
    var data = {
      pageNumber: 1,
      pageSize: 32767,
    }
    axios.post('/warehouse/warehouse/queryWarehouse', data).then(response => {
      if (response.data.beanList) {
        this.wmsDetails = response.data.beanList.map(n => {
          n.entityWmsName = this.entityWmsTypeEnum[n.entityWmsType];
          return n;
        })
      };
    }).catch(error => {
      console.error(error.response ? error.response.data : error);
    });
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.realtime-stock {
  padding: @baseSpace*3;
  position: relative;
}

.right-btn {
  position: absolute;
  right: 2%;
  z-index: 2;
  top: 42px;
}

.iconfont {
  vertical-align: middle;
  margin-right: 5px;
}
</style>
