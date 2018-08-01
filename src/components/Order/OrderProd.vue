<template>
  <div class="order-prod">
    <div class="picture">
      <el-popover popper-class="popper-img" trigger="hover" placement="top" :visible-arrow="false">
        <template v-if="prod.imageUrl">
          <img :src="prod.imageUrl">
          <img slot="reference" :src="prod.imageUrl" @error='imgErrorHandler(prod)'>
        </template>
        <template v-else>
          <img src="../../assets/img/imgerror.png">
          <img slot="reference" src="../../assets/img/imgerror.png">
        </template>
      </el-popover>
    </div>
    <div class="msg">
      <div class="title" v-text="prod.skuTitle"></div>
      <div class="outerId" v-text="prod.outerId"></div>
      <div class="" v-text="prod.skuSpecChars"></div>
    </div>
    <div class="price">
      <div v-text="prod.price"></div>
      <div>x<span v-text="prod.num"></span></div>
    </div>
    <!-- <div class="number" v-text="prod.num"></div> -->
    <div class="warranty">
      <!-- <el-button type="text" size="small" v-if="prod.warrantyStatus" @click="warranty">{{warrantyStatus[prod.warrantyStatus]}}</el-button> -->
      <div v-if="prod.warrantyStatus">{{warrantyStatus[prod.warrantyStatus]}}</div>
      <div v-else v-text="skuType[prod.itemStatus].label" :class="skuType[prod.itemStatus].color"></div>
    </div>
    <div class="action">
      <el-button title="关联供应商，继而分发订单" v-if="!orderSon.supplierTenantId&&orderSon.orderStatus==1" size="small" type="primary" @click="disOrder(prod.outerId, orderSon.extOrdId)">分发</el-button>
    </div>
  </div>
</template>
<script>
import imgerr from '../../assets/img/imgerror.png'
export default {
  name: 'order-prod',
  props: ['prod', 'orderSon'],
  computed: {
    warrantyStatus() {
      return this.$store.state.enumSet.warrantyStatus
    },
    skuType() {
      return this.$store.state.enumSet.skuType
    },
  },
  methods: {
    imgErrorHandler(prod) {
      prod.imageUrl = imgerr;
    },
    warranty() {
      this.$emit('warranty');
    },
    disOrder(productTitle, extOrdId) {
      this.$router.push({
        path: '/production',
        query: {
          mark: 'bindPro',
          productTitle: productTitle,
          extOrdId: extOrdId
        }
      })
    },
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../../main.less';
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
/*  .number {
    flex-basis: 10%;
    text-align: end;
  }*/
  .warranty {
    flex-basis: 10%;
    text-align: end;
    a {
      color: @primaryBlue;
      text-decoration: none;
    }
  }
  .action {
    flex-grow: 1;
    text-align: right;
  }
}
</style>
