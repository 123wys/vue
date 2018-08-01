<template>
  <div class="customerTable">
    <div class="head">
      <!-- <div class="list-head">
        <div class="title">买家昵称/收件人</div>
        <div class="source">渠道来源</div>
        <div class="buyDate">最近购买日期</div>
        <div class="counts">累计订单数</div>
        <div class="totalFee">累计购买金额</div>
        <div class="group">客户分组</div>
        <div class="action">操作</div>
      </div> -->
      <el-table style="width: 100%;min-width:900px" @sort-change='sortChange'>
        <el-table-column prop="title" label="买家昵称/收件人" min-width='16'>
        </el-table-column>
        <el-table-column prop="source" label="渠道来源" min-width='15'>
        </el-table-column>
        <el-table-column prop="latelyPayTime" label="最近购买日期" min-width='16' align='center' sortable='customer'>
        </el-table-column>
        <el-table-column prop="totalOrderNum" label="累计订单数" min-width='16' align='right' sortable='customer'>
        </el-table-column>
        <el-table-column prop="totalPaidFee" label="累计购买金额" min-width='16' align='right' sortable='customer'>
        </el-table-column>
        <el-table-column prop="group" label="客户分组" min-width='10' align='center'>
        </el-table-column>
        <el-table-column prop="action" label="操作" min-width='11' align='right'>
        </el-table-column>
      </el-table>
      <div class="list-action">
        <el-checkbox class="select-all" v-model="isSelectAll">全选</el-checkbox>
        <div class="batch">
          <el-button size="small" @click='createTagArr'>批量打标签</el-button>
        </div>
        <div class="check">
          <el-checkbox v-model="hideReceiver">隐藏收件人信息</el-checkbox>
        </div>
        <paging :page-size="pageSize" :page-number="pageNumber" :total='customerData.amount' @current-change="currentChangeHandler"></paging>
      </div>
    </div>
    <template v-if="customerData && customerData.amount>0">
      <div v-for='(item,i) in customerData.beanList' class="tabel-item">
        <div class="table-list-head">
          <div class="table-title">
            <div>
              <el-checkbox style='margin-right:7px;' v-model='selection[i]'></el-checkbox>{{item.customerInfo.buyerNick}}</div>
            <ul class="table-tag-list" v-if='item.customerTags.length'>
              <li v-for='tag in item.customerTags' v-text='mapTag(tag.specId)' v-bind:class="{ active: mapTag(tag.specId)==='星标'}"></li>
            </ul>
          </div>
          <div class="table-source">
            <i :class="icon(item.customerInfo.platformId)"></i><strong v-text="shopEnum[item.customerInfo.shopId]" class="shop-name"></strong>
          </div>
          <div class="table-buyDate">{{item.customerInfo.latelyPayTime}}</div>
          <div class="table-counts" @click='showOrders(item.customerOrders,item.customerInfo)'>{{item.customerInfo.totalOrderNum}}</div>
          <div class="table-totalFee">{{item.customerInfo.totalPaidFee}}</div>
          <div class="table-group">
            <p v-for='name in item.customerGroups' class="group-p" :title='name.specName'>{{name.specName}}</p>
          </div>
          <div class="table-action">
            <el-button :plain="true" type="info" size='mini' @click='changeTag(item.customerTags,item.customerInfo.customerId)'>打标签</el-button>
          </div>
        </div>
        <div class="receiver" v-show='!hideReceiver'>
          <p v-for='address in item.customerConsignees'>{{address.receiverName}} - {{address.receiverMobile}} - {{address.receiverState}}{{address.receiverCity}}{{address.receiverDistrict}}{{address.receiverAddress}}</p>
        </div>
      </div>
    </template>
    <div v-else class="nullstyle">
      <searchNull class="margin-t80" style="padding-top:60px;"></searchNull>
    </div>
    <div class="foot">
      <pagination v-model="isSelectAll" @size-change="sizeChangeHandler" @current-change="currentChangeHandler" :current-page="pageNumber" :page-sizes="[20, 50, 100]" :page-size="pageSize" :total="customerData.amount"></pagination>
    </div>
    <el-dialog title="打标签" v-model="dialogVisible" size="tiny">
      <div>
        <el-checkbox-group v-model="specIds" style='margin-bottom:10px'>
          <el-checkbox v-for="item in TagArr" :label="item.specId" :value="item.specName" :disabled='item.specName ==="星标"&&tagType === 2'>{{item.specName}}<span class="icon iconfont icon-iconfont05" style='color:red;margin-left:2px' v-show='tagType === 2'></span></el-checkbox>
        </el-checkbox-group>
      </div>
      <div>
        <el-input v-show='tagType===1' type="text" name="specName" placeholder="请输入标签的名称" v-model='specName' size='small'></el-input>
        <div v-show='tagType!=0' style='text-align:right'>
          <el-button v-show='tagType!==0' type="text" size='small' @click='tagType = 0'>取消</el-button>
          <el-button v-show='tagType===1' type="text" size='small' @click='createTag'>添加</el-button>
          <el-button v-show='tagType===2' type="text" size='small' @click='deleteTag'>删除</el-button>
        </div>
        <el-button v-show='tagType===0' type="text" size='small' @click='tagType = 1;specName = ""'>新建标签</el-button>
        <el-button v-show='tagType===0' type="text" size='small' @click='tagType = 2;specIds = []'>删除标签</el-button>
      </div>
      <span slot="footer" class="dialog-footer" v-if='tagType === 0'>
        <el-button @click="dialogVisible = false" size='small'>取 消</el-button>
        <el-button v-show='isBatch === 0' type="primary" @click="changeTagSure" size='small'>确 定</el-button>
        <el-button v-show='isBatch === 1' type="primary" @click="createTagArrSure" size='small'>确定批量</el-button>
      </span>
    </el-dialog>
    <el-dialog title="累计购买订单" v-model="dialogVisible2" size="large" class='buyOrders'>
      <div class="x-overflow">
        <customerOrder :customerInfo='customerInfo' :orderData='orderData' v-loading="loading2" element-loading-text="拼命加载中"></customerOrder>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false" size='small'>返 回</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
import Paging from '../common/Paging'
import customerOrder from './CustomerOrder'
import Pagination from '../common/Pagination'
export default {
  name: 'customerTable',
  data() {
    return {
      tableData: [],
      customerInfo: {},
      orderData: [],
      hideReceiver: false,
      dialogVisible: false,
      dialogVisible2: false,
      loading2: false,
      selection: [],
      customerId: '',
      specIds: [],
      //  解除标签数组
      specCharIds: [],
      //  规格名称
      specName: '',
      //  0默认 1新建 2删除
      tagType: 0,
      //  0单个客户修改标签 1 批量修改标签
      isBatch: 0
    }
  },
  props: {
    customerData: {
      default: function() {
        return {
          amount: 0,
          beanList: []
        }
      }
    },
    pageSize: {
      required: true,
    },
    pageNumber: {
      required: true,
    },
  },
  components: {
    Paging,
    customerOrder,
    Pagination
  },
  computed: {
    ...mapGetters([
      'TagArr'
    ]),
    shopEnum() {
      return this.$store.state.enumSet.allShopInfo;
    },
    isSelectAll: {
      get() {
        return this.customerData.amount ? this.selection.every(n => n) : false;
      },
      set(val) {
        this.selection = new Array(this.customerData.beanList.length).fill(val);
      }
    },
    //  批量修改用户id数组
    selectIds() {
      return this.customerData.beanList.filter((n, i) => this.selection[i]).map(n => n.customerInfo.customerId);
    }
  },
  watch: {
    customerData: {
      handler(val) {
        this.selection = new Array(val.beanList.length).fill(false);
      },
      immediate: true,
    }
  },
  mounted() {},
  methods: {
    ...mapActions([
      'setTagArr'
    ]),
    sortChange(obj) {
      this.$emit('sortChange', obj);
    },
    icon(platformId) {
      return this.$store.state.enumSet.platform[platformId]
    },
    //  显示客户订单
    showOrders(customerOrders, customerInfo) {
      this.loading2 = true;
      this.customerInfo = customerInfo;
      var orderArr = [];
      for (var i = 0, length = customerOrders.length; i < length; i++) {
        orderArr.push(customerOrders[i].extOrderId);
      }
      var data = {
        extOrderIds: orderArr
      }
      this.axios.post('/order/order/queryOriginalSimple', data).then(res => {
        this.orderData = res.data;
        this.loading2 = false;
      }).catch(error => {
        this.$message.error(error.response.data);
        this.loading2 = false;
      });
      this.dialogVisible2 = true;
    },
    //  修改客户标签
    changeTag(customerTags, customerId) {
      this.isBatch = 0;
      this.tagType = 0;
      this.dialogVisible = true;
      this.customerId = customerId;
      this.specIds = customerTags.map(n => n.specId);
      this.specCharIds = customerTags.map(n => n.customerSpecCharId);
    },
    //  确认修改客户标签
    changeTagSure() {
      //  如果specIds specCharIds都为空 不做处理
      if (!this.specCharIds.length && !this.specIds.length) {
        this.dialogVisible = false;
        return;
      }
      var data = {
        customerIds: [this.customerId],
        specIds: this.specIds,
        specCharIds: this.specCharIds
      };
      //  如果specIds为空 specCharIds不为空 调用unbind
      if (!this.specIds.length && this.specCharIds.length) {
        this.unbindCustomerSpec(data);
      }
      //  如果specIds不为空 specCharIds为空 调用unbind
      if (this.specIds.length) {
        this.ubbCustomerSpec(data);
      }
    },
    //  单纯增加标签
    bindCustomerSpec(data) {
      this.axios.post('/customer/customer/bindCustomerSpec', data).then(res => {
        // console.log(res.data);
        this.dialogVisible = false;
        this.$emit('refreshTabel');
      }).catch(error => {
        this.$message.error(error.response.data);
      });
    },
    //  绑定客户标签先删后增
    ubbCustomerSpec(data) {
      this.axios.post('/customer/customer/ubbCustomerSpec', data).then(res => {
        // console.log(res.data);
        this.dialogVisible = false;
        this.$emit('refreshTabel');
      }).catch(error => {
        this.$message.error(error.response.data);
      });
    },
    //  解绑客户标签
    unbindCustomerSpec(data) {
      this.axios.post('/customer/customer/unbindCustomerSpec', data).then(res => {
        // console.log(res.data);
        this.dialogVisible = false;
        this.$emit('refreshTabel');
      }).catch(error => {
        this.$message.error(error.response.data);
      });
    },
    //  新建客户标签
    createTag() {
      var data = {
        specName: this.specName
      };
      if (!this.specName) {
        return false;
      }
      var _self = this;
      this.axios.post('/customer/customer/createTag', data).then(res => {
        this.setTagArr(_self);
        this.specName = '';
        this.tagType = 0;
      }).catch(error => {
        this.$message.error(error.response.data);
      });
    },
    //  删除标签
    deleteTag() {
      var data = {
        specIds: this.specIds
      }
      var _self = this;
      this.axios.post('/customer/customer/removeCustomerSpec', data).then(res => {
        this.setTagArr(_self);
        this.$emit('refreshTabel');
        this.tagType = 0;
        this.dialogVisible = false;
      }).catch(error => {
        this.$message.error(error.response.data);
      });
    },
    //  标签名称映射
    mapTag(specId) {
      for (var i = this.TagArr.length - 1; i >= 0; i--) {
        if (this.TagArr[i].specId === specId) {
          return this.TagArr[i].specName;
        }
      }
    },
    //  批量打标签
    createTagArr() {
      this.isBatch = 1;
      this.specIds = [];
      this.tagType = 0;
      this.dialogVisible = true;
    },
    //  批量打标签确定
    createTagArrSure() {
      if (!this.specIds.length || !this.selectIds.length) {
        this.$message.error('标签或者选择客户不能为空！');
        return false;
      }
      var _self = this;
      var data = {
        specIds: this.specIds,
        customerIds: this.selectIds
      }
      this.axios.post('/customer/customer/bindCustomerSpec', data).then(res => {
        this.dialogVisible = false;
        this.setTagArr(_self);
        this.$emit('refreshTabel');
      }).catch(error => {
        this.$message.error(error.response.data);
      });
    },
    sizeChangeHandler(args) {
      this.$emit('size-change', args);
    },
    currentChangeHandler(args) {
      if (this.pageNumber === args) return;
      this.$emit('current-change', args);
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.tabel-item:hover .table-list-head,
.tabel-item:hover .receiver {
  background-color: #eef0f6;
}
.tabel-item{
  min-width: 900px;
}
.active {
  background-color: @warningYellow!important;
}

.customerTable {
  clear: both;
}

.customerTable > div {
  margin-bottom: @smallSize;
}

.head {
  line-height: 20px;
  border: solid 1px @borderLine;
  min-width: 900px;
}

.list-head {
  background-color: #eff2f7;
  display: flex;
  font-size: 14px;
  padding: @normalSize;
  .title {
    flex-basis: 28%;
    margin-left: 2%;
  }
  .source {
    box-sizing: border-box;
    padding-left: 15px;
    flex-basis: 18%;
  }
  .buyDate {
    text-align: center;
    flex-basis: 13%;
  }
  .counts {
    text-align: right;
    box-sizing: border-box;
    padding-right: 15px;
    flex-basis: 10%;
  }
  .totalFee {
    text-align: right;
    box-sizing: border-box;
    padding-right: 15px;
    flex-basis: 13%;
  }
  .group {
    text-align: center;
    flex-basis: 10%;
  }
  .action {
    text-align: right;
    flex-basis: 6%;
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
  border: solid 1px #E5E9F2;
}

.foot {
  text-align: end;
  padding: @smallSize;
}

.table-list-head {
  min-width:900px;
  transition: background 0.3s;
  background-color: #fff;
  display: flex;
  justify-content: flex-start;
  font-size: 12px;
  // padding: 15px 15px 15px 10px;
  padding: 15px 0 15px 0;
  text-align: left;
  border: 1px solid @borderLine;
  .table-title {
    padding-left: 15px;
    flex-basis: 16%;
  }
  .table-source {
    padding-left: 18px;
    flex-basis: 15%;
    .shop-name {
      font-size: 12px;
      color: @black;
      margin-left: @smallSize;
      margin-right: @baseSize*3;
    }
  }
  .table-buyDate {
    text-align: center;
    flex-basis: 16%;
  }
  .table-counts {
    text-align: right;
    box-sizing: border-box;
    color: @tipsBlue;
    font-size: 14px;
    cursor: pointer;
    font-weight: bold;
    padding-right: 30px;
    flex-basis: 16%;
  }
  .table-totalFee {
    text-align: right;
    box-sizing: border-box;
    padding-right: 30px;
    flex-basis: 16%;
  }
  .table-group {
    text-align: center;
    flex-basis: 10%;
  }
  .table-action {
    box-sizing: border-box;
    padding-right: 15px;
    text-align: right;
    flex-basis: 11%;
    // flex: 1;
  }
}

.table-tag-list {
  padding: 0 0 0 25px;
  list-style: none;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  li {
    background: @lightGary;
    color: #fff;
    height: 20px;
    line-height: 20px;
    padding: 0 5px 0 5px;
    margin-right: 5px;
    border-radius: 15px;
  }
}

.receiver {
  transition: background 0.3s;
  background: #fff;
  border: 1px solid @borderLine;
  border-top: none;
  box-sizing: border-box;
  padding: 10px 10px 0px 35px;
  p {
    margin: 0;
    padding-bottom: 10px;
  }
}

.buyOrders {}

.x-overflow {
  max-height: 500px;
  overflow-y: scroll;
  // margin-right: -30px;
  padding-right: 10px;
}

.group-p {
  width: 120px;
  margin: 0 auto;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
<style>
/*.customerTable .el-dialog{
  overflow: hidden;
}*/

.customerTable .el-table__body-wrapper {
  display: none;
}
</style>
