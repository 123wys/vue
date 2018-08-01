<template>
  <div class="orderImportPreview">
    <p class="preview-title">系统将在后台导入<span>{{count}}</span>条订单，完成后及时提醒您，请稍后在“待审核”订单中查看</p>
    <p class="preview-tip">以下是导入文件中选取的第一条数据，请确定内容与格式是否匹配若有错误请返回重新匹配字段</p>
    <div class="box">
      <div class="list-head">
        <div class="shop-name">商品</div>
        <div class="price-count">单价/数量</div>
        <div class="status">状态</div>
      </div>
      <div class="order-content">
        <div style="margin-right: 20px;">{{shopEnum[shopId]}}</div>
        <div style="margin-right: 20px;">订单编号：{{previewData['info.extOrderId']}}</div>
        <div style="margin-right: 20px;">成交时间：{{previewData['info.payTime']}}</div>
        <div class="total-pay">总额：<span>￥{{totalFee}}</span></div>
        <!-- <div class="total-pay"></div> -->
      </div>
      <div class="customer-content">
        <div class="address">收货地址：{{previewData['consignee.receiverName']}} {{previewData['consignee.receiverMobile']}} {{previewData['consignee.receiverState']}}{{previewData['consignee.receiverCity']}}{{previewData['consignee.receiverAddress']}}</div>
        <p class="remark">
          买家留言：
          <el-tooltip class="item" effect="light" :content="previewData['memo.sellerMemo']" placement="top">
            <span>{{previewData['memo.sellerMemo']}}</span>
          </el-tooltip>
        </p>
      </div>
      <div class="product-content">
        <div class="shop-name">
          <img src="../../assets/img/product.png" class="shop-photo">
          <div class="shop-msg">
            <p style="-webkit-box-orient: vertical;">{{previewData['items.extSkuTitle']}}</p>
            <p class="skuId">{{previewData['items.extOuterId']}}</p>
          </div>
        </div>
        <div class="price-count">
          <p>{{previewData['items.price']}}</p>
          <p>x{{previewData['items.num']}}</p>
        </div>
        <div class="status">待审核</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'orderImportPreview',
  props: {
    text: {
      default: '敬请期待'
    },
    previewData: Object,
    count: Number,
    shopId: {}
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {
    shopEnum() {
      return this.$store.state.enumSet.shopEnum;
    },
    totalFee() {
      var total = parseFloat(this.previewData['items.price']) * parseInt(this.previewData['items.num']).toFixed(2);
      return total;
    }
  },
  methods: {},
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.orderImportPreview {
  font-family: "microsoft yahei";
  .preview-title {
    margin: 0;
    font-size: 16px;
    span {
      color: @warningYellow;
    }
  }
  .preview-tip {
    margin: 35px 0 10px 0;
    font-size: 12px;
    color: @warningYellow;
  }
  .list-head {
    line-height: 40px;
    height: 40px;
    background: @tabBg;
    display: flex;
    .shop-name {
      flex-basis: 60%;
      padding-left: 80px;
    }
    .price-count {
      flex-basis: 20%;
      text-align: right;
    }
    .status {
      flex-basis: 20%;
      padding-right: 15px;
      text-align: right;
    }
  }
  .box {
    border: 1px solid @borderLine;
    .order-content {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      min-height: 35px;
      padding-left: 15px;
      line-height: 35px;
      font-size: 12px;
      background-color: #e8f5ff;
      border-top: 1px solid @borderLine;
      border-bottom: 1px solid @borderLine;
      .total-pay {
        flex: 1;
        padding-right: 15px;
        text-align: right;
        span {
          font-weight: bold;
        }
      }
    }
    .customer-content {
      padding: 15px 15px 10px 15px;
      border-bottom: 1px solid @borderLine;
      .remark {
        width: 600px;
        height: 32px;
        padding: 0 10px;
        margin: 10px 0 0 0;
        line-height: 32px;
        border: 1px solid #ffdda4;
        background-color: #fefce8;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        span {
          color: @dangerRed;
        }
      }
    }
    .product-content {
      display: flex;
      padding: 10px 0 10px 0px;
      .shop-name {
        flex-basis: 60%;
        padding-left: 15px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        img {
          margin-right: 11px;
        }
        .shop-msg {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          P {
            margin: 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            align-self: flex-start;
            font-size: 12px;
          }
          .skuId {
            color: @lightGary;
          }
        }
      }
      .price-count {
        flex-basis: 20%;
        p {
          margin: 0;
          text-align: right;
        }
        p:nth-child(2) {
          margin-top: 10px;
        }
      }
      .status {
        flex-basis: 20%;
        padding-right: 15px;
        text-align: right;
      }
    }
  }
}
</style>
