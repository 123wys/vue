<template>
  <div class="entrance-list">
    <div class="head">
      <!-- <div class="list-head"> -->
      <div class="title">商品</div>
      <div class="price">单价</div>
      <div class="number">数量</div>
      <div class="warranty">商品售后</div>
      <div class="action">订单操作</div>
      <!-- </div> -->
      <!--       <div class="list-action">
        <el-checkbox class="select-all" v-model="isSelectAll">全选</el-checkbox>
        <paging :page-size="pageSize" :page-number="pageNumber" :total='orderData.amount' @current-change="currentChangeHandler"></paging>
      </div> -->
    </div>
    <div v-loading.body="loading" element-loading-text="拼命加载中">
      <template v-if="orderData && orderData.amount>0">
        <div class="order-parent" v-for="(order, i) of orderData.beanList">
          <div class="parent-head">
            <div class="left">
              <i :class="getIcon(order)"></i><strong v-text="shopEnum[order.shopId]" class="shop-name"></strong>
              <span>商城单号：<span v-text="order.extOrderId"></span></span><span>付款时间：<span v-text="order.payTime"></span></span>
            </div>
            <div class="right">
              总额：<strong v-text="order.totalFee"></strong> （共
              <span v-text="getProdNum(order)"></span>件商品，分成<span v-text="order.orders.length" class="warning"></span>个包裹）
            </div>
          </div>
          <template v-for="(orderSon, i) of order.orders">
            <div class="order-son">
              <div class="msg">
                <div>
                  <span><span class="warehouse" v-text="tenantEnum[orderSon.supplierTenantId]"></span><span class="sum" v-text="'(共' + orderSon.orderItems.length + '件商品)'"></span>
                  </span>
                  <span>系统单号：<span v-text="orderSon.orderId"></span></span><span>订单状态：<span :style="getStatusColor(orderSon)" v-text="showSatausLabel(orderSon.orderStatus)"></span></span>
                  <template v-if="orderSon.companyName">
                    <span>物流公司：{{orderSon.companyName}}</span>
                    <span>物流单号：{{orderSon.deliveryNo}}</span>
                  </template>
                </div>
                <div class="receiver">
                  <span>收货信息：<span v-text="orderSon.receiverName"></span>
                  <span v-text="orderSon.receiverMobile"></span><span v-text="orderSon.receiverState+orderSon.receiverCity+orderSon.receiverDistrict+orderSon.receiverAddress"></span></span>
                </div>
                <div class="remark" v-show="orderSon.buyerMessage || orderSon.orderMemo || orderSon.comment">
                  <div v-if="orderSon.buyerMessage">
                    <span>买家留言：</span><span class="buyer" v-text="orderSon.buyerMessage"></span>
                  </div>
                  <div v-if="orderSon.orderMemo">
                    <span>商家备注：</span><span class="orderMemo" v-text="orderSon.orderMemo"></span>
                  </div>
                  <div v-if="orderSon.comment">
                    <span>审核留言：</span><span class="comment" v-text="orderSon.comment"></span>
                  </div>
                </div>
              </div>
              <div class="action">
                <el-button size="small" v-if="[0,1,7].includes(parseInt(orderSon.orderStatus))" @click="changeRecipientInfo(orderSon)">修改收货信息</el-button>
                <el-button size="small" v-if="orderSon.orderStatus > 0 && orderSon.orderStatus < 8 && orderSon.orderItems.some(m => [0, 2, 5].includes(m.warrantyStatus))" @click="goAfterSale(order.extOrderId,1)">转售后</el-button>
                <!-- <el-button size="small" v-else @click="goAfterSale(order.extOrderId,0)">售后单</el-button> -->
              </div>
            </div>
            <div class="order-prod" v-for="prod of orderSon.orderItems" :key="prod.outerId">
              <div class="picture">
                <el-popover popper-class="popper-img" trigger="hover" placement="top" :visible-arrow="false">
                  <img :src="prod.imageUrl">
                  <img slot="reference" :src="prod.imageUrl">
                </el-popover>
              </div>
              <div class="msg">
                <div class="title" v-text="prod.skuTitle"></div>
                <div class="outerId" v-text="prod.outerId"></div>
                <div class="" v-text="prod.skuSpecChars"></div>
              </div>
              <div class="price" v-text="prod.price"></div>
              <div class="number" v-text="prod.num"></div>
              <div class="warranty warrantyALink"><a href="javascript:void(0)" @click="goAfterSale(orderSon.extOrderId, 0)">{{warrantyStatus[prod.warrantyStatus]}}</a></div>
            </div>
          </template>
        </div>
      </template>
      <div v-else-if="!searchedFlag" class="remind"><p><i class="iconfont icon-xinshouyindao blue i"></i><span>请先搜索订单，进行售后处理</span></p></div>
      <searchNull v-else></searchNull>
    </div>
    <el-dialog title="修改收货信息" v-model="dialogShow" size="tiny" custom-class="orderdialog" :close-on-click-modal="false">
      <el-form :model="order" :rules="rules" ref="form" label-width="90px" label-position="left">
        <el-form-item label="姓名" prop="receiverName">
          <el-input v-model.trim="order.receiverName">
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="receiverMobile">
          <el-input v-model="order.receiverMobile">
          </el-input>
        </el-form-item>
        <el-form-item label="地址" prop="receiverCity">
          <district-select class="district" :province="order.receiverState" :city="order.receiverCity" :district="order.receiverDistrict" @district-change="districtChange"></district-select>
          <el-input type="textarea" :rows="2" placeholder="详细地址" v-model.trim="order.receiverAddress">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogShow=false">取 消</el-button>
        <el-button size="small" type="primary" @click="dialogSure" @keyup.native.enter="dialogSure">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import debounce from 'lodash/debounce'
import DistrictSelect from '../common/DistrictSelect';
import axios from 'axios'
const xgshxxUrl = 'order/order/editConsignee';
export default {
  name: 'entrance-list',
  props: {
    orderData: {
      default: function() {
        return {
          amount: 0,
          beanList: [],
        }
      }
    },
    searchedFlag: {},
  },
  components: {
    DistrictSelect,
  },
  data() {
    return {
      dialogShow: false,
      loading: false,
      order: {
        orderId: '',
        receiverName: '',
        receiverMobile: '',
        receiverState: '',
        receiverCity: '',
        receiverDistrict: '',
        receiverAddress: '',
      },
      rules: {
        receiverName: {
          required: true,
          message: '请输入',
          trigger: 'submit',
        },
        receiverMobile: [{
          required: true,
          message: '请输入',
          trigger: 'submit',
        }, {
          validator(rule, value, callback) {
            if (isNaN(value) || value.length !== 11) {
              callback(new Error('请输入正确手机号'));
            } else {
              callback();
            }
          }
        }],
        receiverState: {
          required: true,
          message: '请选择',
          trigger: 'submit',
        },
        receiverCity: {
          required: true,
          message: '请选择',
          trigger: 'submit',
        },
        receiverAddress: {
          required: true,
          message: '请输入',
          trigger: 'submit',
        },
      },
    }
  },
  computed: {
    shopEnum() {
      return this.$store.state.enumSet.allShopInfo;
    },
    orderType() {
      return this.$store.state.enumSet.orderType;
    },
    tenantEnum() {
      return this.$store.getters.tenantEnum;
    },
    warrantyStatus() {
      return this.$store.state.enumSet.warrantyStatus
    },
  },
  methods: {
    getIcon(order) {
      return this.$store.state.enumSet.platform[order.platformId]
    },
    getProdNum(order) {
      let num = 0;
      order.orders.forEach(n => {
        num += n.orderItems.length;
      });
      return num;
    },
    getStatusColor(orderSon) {
      let color = this.orderType[parseInt(orderSon.orderStatus)].color;
      return {
        color
      };
    },
    showSatausLabel(status) {
      return this.orderType[status].label;
    },
    districtChange(val) {
      this.order.receiverState = val[0];
      this.order.receiverCity = val[1];
      this.order.receiverDistrict = val[2];
    },
    changeRecipientInfo(order) {
      this.order.orderId = order.orderId;
      this.order.receiverName = order.receiverName;
      this.order.receiverMobile = order.receiverMobile;
      this.order.receiverState = order.receiverState;
      this.order.receiverCity = order.receiverCity;
      this.order.receiverDistrict = order.receiverDistrict;
      this.order.receiverAddress = order.receiverAddress;
      this.$nextTick(() => {
        this.dialogShow = true;
      })
    },
    dialogSure() {
      this.$refs.form.validate((valid) => {
        if (!valid) return false;
        this.dialogShow = false;
        this.loading = true;
        axios.post(xgshxxUrl, {
          orderId: this.order.orderId,
          receiverState: this.order.receiverState,
          receiverCity: this.order.receiverCity,
          receiverDistrict: this.order.receiverDistrict,
          receiverTown: '',
          receiverAddress: this.order.receiverAddress,
          receiverName: this.order.receiverName,
          receiverMobile: this.order.receiverMobile,
        }).then(response => {
          this.loading = false;
          this.$message.success('修改成功！');
          this.$emit('research');
        }).catch(err => {
          this.loading = false;
          this.$msgbox({
            message: '操作失败，' + (err.response ? err.response.data : err),
            type: 'error',
          })
        })
      });
    },
    goAfterSale(extOrderId, create = 1) { // 0是查看,1是新建
      this.$store.commit('setASOrder', {extOrderId, create});
      this.$router.push('aftersale');
    },
  },
  watch: {},
  created() {}
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
  .number {
    flex-basis: 10%;
    text-align: end;
  }
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

.remind {
  width: 100%;
  padding: 150px 0;
  font-size: 18px;
  text-align: center;
  background-color: @white;
  border: solid 1px @borderLine;
  .i {
    font-size: 35px;
    margin-right: @baseSpace*3;
    vertical-align: middle;
  }
}

.searchNull {
  padding: 160px 0 173px;
  background-color: @white;
  border: solid 1px @borderLine;
}

.order-parent {
  border: solid 1px @borderLine;
  background-color: @white;
  margin-top: @baseSpace * 2;
  .parent-head {
    background-color: #e8f5ff;
    line-height: 20px;
    padding: @smallSize;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }
  .left > span + span {
    margin-left: @largeSize + 5px;
  }
  .shop-name {
    font-size: 12px;
    color: @black;
    margin-left: @smallSize;
    margin-right: @baseSize*3;
  }
  .warning {
    color: @warning;
  }
  .gary {
    color: @gary;
  }
  .paymsg {
    padding: @normalSize 40px;
    height: 46px;
    > span + span {
      margin-left: @largeSize;
    }
  }
}

.order-son {
  border-top: solid 1px @borderLine;
  padding: @smallSize;
  display: flex;
  align-items: baseline;
  +div {
    border-top: solid 1px @borderLine;
  }
  .checkbox {
    margin-right: @smallSize;
  }
  .msg {
    flex-basis: 60%;
    > div:first-child {
      color: @baseGary;
    }
    > div > span + span {
      margin-left: @largeSize;
    }
    > div + div {
      margin-top: @smallSize;
    }
  }
  .action {
    flex-grow: 1;
    text-align: end;
    a {
      text-decoration: none;
      color: @primaryBlue;
      margin-left: @smallSize;
    }
  }
  .warehouse {
    font-size: 14px;
    color: @baseGary;
    margin-right: @baseSpace;
  }
  .receiver {
    margin-left: @baseSpace * 2;
    span + span {
      margin-left: @smallSize;
    }
  }
  .sum {
    color: @darkGary;
  }
  .remark {
    border: solid 1px #ffdda4;
    border-radius: 5px;
    background-color: #fefce8;
    display: inline-block;
    margin-left: @baseSpace * 2;
    min-width: 60%;
    padding: @smallSize @normalSize;
    .buyer {
      color: @danger;
    }
    .orderMemo {
      color: @blue;
    }
    .comment {
      color: @warning;
    }
    >div+div {
      margin-top: @smallSize - 3px;
    }
  }
}

.order-son:hover {
  background-color: @tabBg;
  transition: background-color 0.3s;
}

.order-prod {
  padding: @smallSize;
  display: flex;
  +.order-prod {
    border-top: dotted 1px @borderLine;
  }
  .picture {
    flex-basis: 10%;
    display: flex;
    justify-content: center;
    img {
      height: @prodImg;
      width: @prodImg;
    }
  }
  .msg {
    line-height: @baseSpace * 4;
    flex-basis: 30%;
    div {
      width: 80%
    }
    .title {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    .outerId {
      color: @darkGary;
    }
  }
  .price {
    flex-basis: 10%;
    text-align: end;
  }
  .number {
    flex-basis: 10%;
    text-align: end;
  }
  .warranty {
    flex-basis: 10%;
    text-align: end;
  }
}

.orderdialog {
  min-width: 420px;
  .el-dialog__body {
    padding-bottom: 10px;
    .nospace {
      margin-bottom: 0;
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
  .district {
    width: 100%;
    padding-bottom: 10px;
  }
  .el-select {
    width: 100%;
  }
}
.warrantyALink {
  a{
    color: @primaryBlue;
    text-decoration: none;
  }
}
</style>
