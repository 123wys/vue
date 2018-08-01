<template>
  <div class="err-order-prod">
    <div class="picture">
      <el-popover popper-class="popper-img" trigger="hover" placement="top" :visible-arrow="false">
        <img :src="prod.productPic">
        <img slot="reference" :src="prod.productPic" @error='imgErrorHandler(prod)'>
      </el-popover>
    </div>
    <div class="msg">
      <div class="title" v-text="prod.productTitle"></div>
      <div class="outerId" v-text="prod.outerId"></div>
    </div>
    <div class="price" v-text="(parseFloat(prod.price)/100).toFixed(2)"></div>
    <div class="number" v-text="prod.number"></div>
    <div class="action">
      <a v-if="fullPath !== 'undisorder' && fullPath !== 'deadorder'" href="javascript:void(0);" @click="actionHandlerCode('xgzbb')" style="text-decoration:none;">修改</a>
      <el-button v-else-if="fullPath !== 'deadorder'" size="small" type="primary" @click="disOrder(prod.productTitle, extOrdId)">分发</el-button>
    </div>
  </div>
</template>
<script>
import debounce from 'lodash/debounce'
import imgerr from '../../assets/img/imgerror.png'
export default {
  name: 'error-order-prod',
  props: ['prod', 'fullPath', 'extOrdId'],
  data() {
    return {}
  },
  methods: {
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
    actionHandlerCode: debounce(function(...args) {
      this.$emit('actionCode', args)
    }, 600, {
      leading: true,
      trailing: false,
    }),
    imgErrorHandler(prod) {
      prod.productPic = imgerr;
    },
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../../main.less';
.err-order-prod {
  padding: @smallSize;
  display: flex;
  +.order-prod {
    border-top: solid 1px @lightGary;
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
    flex-basis: 25%;
    line-height: @baseSpace * 4;
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
    flex-basis: 13%;
    text-align: end;
  }
  .number {
    flex-basis: 30%;
    margin-left: 8%;
  }
  .action {
    flex-basis: 15%;
  }
}
</style>
