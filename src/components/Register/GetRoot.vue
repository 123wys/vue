<template>
  <div>
    <div class="getRoot" v-if="goToGetRoot">
      <p class="title title_err" v-if="!getRootResult"><i class="el-icon-circle-cross" style="font-size:20px;margin-right:10px;float:left;margin-top:2px;"></i><span>授权失败！请重新选择进行授权操作</span></p>
      <p class="title" v-else>为请选择目标渠道去授权一个店铺</p>
      <el-row :gutter="25">
        <el-col :span="8">
          <div class="graybg">
            <el-row>
              <el-col :span="12" class="left">
                <i class="icon iconfont icon-youzan icon_big"></i>
              </el-col>
              <el-col :span="12" class="right">
                <p class="tb">抓取订单</p>
                <p class="tb">同步商品</p>
                <el-button type="primary" size="small" style="margin-top:10px;" @click="getRoot('youzan')">立即授权</el-button>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="graybg">
            <el-row>
              <el-col :span="12" class="left">
                <i class="icon iconfont icon-tianmao icon_big"></i>
              </el-col>
              <el-col :span="12" class="right">
                <p class="tb">抓取订单</p>
                <p class="tb">同步商品</p>
                <el-button type="primary" size="small" style="margin-top:10px;" @click="getRoot('tianmao')">立即授权</el-button>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="graybg">
            <el-row>
              <el-col :span="12" class="left">
                <i class="icon iconfont icon-taobao icon_big"></i>
              </el-col>
              <el-col :span="12" class="right">
                <p class="tb">抓取订单</p>
                <p class="tb">同步商品</p>
                <el-button type="primary" size="small" style="margin-top:10px;" @click="getRoot('taobao')">立即授权</el-button>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="getRoot getRoot_sec" v-else>
      <p class="title" v-if="!getRootResult">在目标平台渠道上授权完成后，请确认</p>
      <p class="title title_suc" v-else><i class="el-icon-circle-check"></i><span>店铺授权成功</span></p>
      <div class="confirm">
        <el-row :gutter="35" v-if="!getRootResult">
          <el-col :span="4" style="padding-top:20px;"><i class="icon iconfont icon-youzan icon_big"></i></el-col>
          <el-col :span="8" class="black">已成功授权店铺？</el-col>
          <el-col :span="12" style="padding-top:40px;">
            <el-button size="small" style="width:60px;" @click="getConfirm(false)">否</el-button>
            <el-button type="primary" size="small" style="width:60px;" @click="getConfirm(true)">是</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="35" v-else>
          <el-col :span="4" style="padding-top:20px;"><i class="icon iconfont icon_big" :class="rootShop"></i></el-col>
          <el-col :span="8" style="padding-top:20px;">
            <p>平台渠道 : {{channel}}</p>
            <p style="margin: 9px 0;">店铺账号 : <span style="color:#F90;">{{account}}</span></p>
            <p>店铺名称 : {{shopName}}</p>
          </el-col>
        </el-row>
      </div>
      <el-row v-if="getRootResult" style="margin-top:25px;">
        <el-col :offset="20">
          <el-button type="primary" style="width:100px;" @click="regNext">完成</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import {
  Row,
  Col,
  Button,
  Message,
} from 'element-ui'
Vue.use(Row)
Vue.use(Col)
Vue.use(Button)
export default {
  data() {
    return {
      getRootResult: true,
      goToGetRoot: true,
      channel: '有赞',
      account: 11231231232,
      shopName: '蓝狮子官方旗舰店',
    }
  },
  computed: {
    rootShop() {
      let icon = '';
      switch (this.channel) {
        case '有赞':
        case 'youzan':
          icon = 'icon-youzan';
          break;
        case 'tianmao':
          icon = 'icon-tianmao';
          break;
        case 'taobao':
          icon = 'icon-taobao';
          break;
      }
      return icon;
    }
  },
  methods: {
    getRoot(msg) {
      Message.info({
        message: msg
      })
      this.channel = msg;
      this.goToGetRoot = !this.goToGetRoot;
      this.getRootResult = false;
    },
    getConfirm(tf) {
      if (tf) {
        Message.success({
          message: '授权成功'
        })
        this.getRootResult = true
      } else {
        Message.error({
          message: '授权失败'
        })
        this.goToGetRoot = !this.goToGetRoot
      }
    },
    regNext() {
      this.$router.push('/register/regComplate')
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.getRoot {
  width: 750px;
  margin: 0 auto;
  .title {
    color: #F90;
    margin: 0;
    padding: 25px 0 15px 0;
    height: 63px;
  }
  .title_err {
    color: @danger;
    font-size: 16px;
  }
  .graybg {
    wdith: 220px;
    height: 112px;
    background-color: @darkWhite;
  }
  .icon_big {
    font-size: 64px;
    margin-left: 25px;
  }
  .left {
    padding-top: @normalSize;
  }
  .right {
    padding-top: @largeSize;
  }
  .tb {
    margin: 0;
  }
}

.getRoot_sec {
  width: 600px;
  .title_suc {
    color: @success;
    font-size: 16px;
    i {
      font-size: 20px;
      float: left;
      margin: 2px 10px 0 0;
    }
  }
  .confirm {
    width: 600px;
    height: 105px;
    background-color: @darkWhite;
    .black {
      color: @black;
      font-size: @largeSize;
      line-height: 105px;
      font-weight: 200;
    }
    p {
      margin: 0;
    }
  }
}
</style>
