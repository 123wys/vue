<template>
  <div class="order-prod">
    <div class="prod-box">
      <div class="picture">
        <el-popover popper-class="popper-img" trigger="hover" placement="top" :visible-arrow="false">
          <img :src="prod.imageUrl">
          <img slot="reference" :src="prod.imageUrl" @error='imgErrorHandler(prod)'>
        </el-popover>
      </div>
      <div class="msg">
        <div class="title" v-text="prod.extSkuTitle"></div>
        <!-- <div class="outerId" v-text="prod.extOuterId"></div> -->
        <div class="skuSpecChars" v-text="prod.skuSpecChars"></div>
      </div>
    </div>
    <div class="price" v-text="prod.price"></div>
    <!-- <div class="sale">{{parseFloat(prod.paidFee)/(parseFloat(prod.price)*parseInt(prod.num))}}</div> -->
    <div class="sale"></div>
    <div class="number" v-text="prod.num"></div>
  </div>
</template>
<script>
import imgerr from '../../assets/img/imgerror.png'
export default {
  name: 'order-prod',
  props: ['prod'],
  computed: {},
  methods: {
    imgErrorHandler(prod) {
      prod.imageUrl = imgerr;
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../../main.less';
.order-prod {
  padding: 15px;
  display: flex;
  +.order-prod {
    border-top: dotted 1px @borderLine;
  }
  .prod-box{
    flex-basis: 65%;
    display: flex;
  }
  .picture {
    flex-basis: 16%;
    display: flex;
    justify-content: flex-start;
    img {
      height: @prodImg;
      width: @prodImg;
    }
  }
  .msg {
    line-height: @baseSpace * 4;
    flex-basis: 84%;
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
      margin-top: 5px;
      color: @darkGary;
    }
  }
  .price {
    box-sizing: border-box;
    padding-right: 15px;
    flex-basis: 11%;
    text-align: right;
  }
  .number {
    box-sizing: border-box;
    padding-right: 15px;
    flex-basis: 11%;
    text-align: right;
  }
  .sale {
    box-sizing: border-box;
    padding-right: 15px;
    flex-basis: 13%;
    text-align: right;
  }
}
</style>
