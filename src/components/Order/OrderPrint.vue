<template>
  <div class="print_main">
    <p class="crumbs">当前位置 : <span>打单</span></p>
    <div class="print_p ptn">
      <span>打印出货单</span>
      <el-button type="primary" style="float:right;margin:15px;" @click="preview">打印</el-button>
    </div>
    <div class="print_p">
      <el-row>
        <el-col :span="4">
          <span>打印物流面单</span>
        </el-col>
        <el-col :span="20" style="margin-top:20px;">
          <el-form :model="print" label-width="100px" :inline="true" class="from">
            <el-form-item label="物流公司">
              <el-select placeholder="请选择" v-model="print.logistics">
                <el-option v-for="(key, value) in logistics" :label="`${key}`" :value="`${value}`">
                  <span style="float: left" v-text="key"></span>
                  <span style="float: right; color: #8492a6; font-size: 12px" v-text="value"></span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="面单类型:">
              <el-radio label="纸质面单" v-model="print.type"></el-radio>
              <el-radio label="电子面单" v-model="print.type" disabled></el-radio>
            </el-form-item>
            <el-button type="primary" :disabled="!print.logistics" style="float:right;margin-right:15px;" @click="printLog">打印</el-button>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <p class="total">累计已选{{total}}条订单</p>
    <div class="result">
      <el-table :data="orderLists" style="width: 100%;font-size:12px;">
        <el-table-column type="index" label="编号" width="70">
          <!-- <template scope="scope">
            <span v-text="scope.row.$index"></span>
          </template> -->
        </el-table-column>
        <el-table-column label="店铺">
          <template scope="scope">
            <span v-text="shopEnum[scope.row.shopId]"></span>
          </template>
        </el-table-column>
        <el-table-column label="订单号">
          <template scope="scope">
            <span>{{scope.row.extOrderId}}</span>
            <br>
            <span style="color:#99a98f;">系统单号 : {{scope.row.orderId}}</span>
          </template>
        </el-table-column>
        <el-table-column label="收货人">
          <template scope="scope">
            <span>{{scope.row.receiverName}}</span>
            <br>
            <span>{{scope.row.receiverMobile}}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址" min-width="150">
          <template scope="scope">
            <span>{{scope.row.receiverState}}{{scope.row.receiverCity}}{{scope.row.receiverCountry}}{{scope.row.receiverDistrict}}{{scope.row.receiverTown}}{{scope.row.receiverAddress}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import callPrint from '../../print_busi.js'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'order-print',
  data() {
    return {
      print: {
        logistics: '',
        type: '纸质面单'
      },
      // logistics: {},
      total: 0,
      orderLists: []
    }
  },
  computed: {
    ...mapGetters([
      'ichannel',
      'logisticsCompanyFH'
    ]),
    logistics() {
      return this.logisticsCompanyFH;
    },
    shopEnum() {
      return this.$store.state.enumSet.allShopInfo;
    },
  },
  created() {
    this.orderLists = JSON.parse(window.localStorage.orderPrint);
    this.total = this.orderLists.length;
  },
  methods: {
    preview() {
      callPrint(this.dataFormat(this.orderLists, 1));
    },
    printLog() {
      callPrint(this.dataFormat(this.orderLists, 2, this.print.logistics));
    },
    dataFormat(danjy, printType = 0, logistic = 0) {
      var aa = [printType, [],
        [],
        []
      ];
      for (var i = 0; i < danjy.length; i++) {
        aa[1][i] = [];
        aa[1][i].push(danjy[i].extOrderId);
        aa[1][i].push(danjy[i].receiverMobile);
        aa[1][i].push(danjy[i].receiverName);
        aa[1][i].push('');
        aa[1][i].push(danjy[i].receiverState);
        aa[1][i].push(danjy[i].receiverCity);
        aa[1][i].push(danjy[i].receiverDistrict);
        aa[1][i].push(danjy[i].receiverAddress);
        aa[1][i].push(danjy[i].buyerMessage);
        aa[2][i] = [logistic, 1, []];
        for (var j = 0; j < danjy[i].orderItems.length; j++) {
          aa[2][i][2][j] = [];
          aa[2][i][2][j].push(j + 1);
          aa[2][i][2][j].push(danjy[i].extOrderId);
          aa[2][i][2][j].push(danjy[i].orderItems[j].extSkuTitle);
          aa[2][i][2][j].push(danjy[i].orderItems[j].num);
          aa[2][i][2][j].push(danjy[i].orderItems[j].price);
          aa[2][i][2][j].push(danjy[i].orderItems[j].totalFee);
          aa[2][i][2][j].push(this.shopEnum[danjy[i].shopId]);
        };
      };
      aa[3] = ['', '', '', '', '', '', ''];
      return aa;
    }
  },
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.print_main {
  padding: @normalSize;
}

.crumbs {
  color: @darkGary;
  margin: 0;
  span {
    color: @black;
  }
}

.print_p {
  height: 74px;
  border: 1px solid rgb(226, 233, 239);
  span {
    font-size: @largeSize;
    line-height: 74px;
    margin-left: 30px;
  }
}

.ptn {
  margin-top: @smallSize;
  border-bottom: none;
}

.form {
  float: left;
}
</style>
