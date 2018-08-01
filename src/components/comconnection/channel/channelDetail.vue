<template>
  <div class="channel-detail">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item :to="{ path: '/myChannel' }" v-if='origin == "myChannel"'>我的渠道商</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/supplierList' }" v-if='origin == "supplier"'>我的供应商</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/inviteSupplier' }" v-if='origin == "inviteSupplier"'>邀请供应商</el-breadcrumb-item>
      <el-breadcrumb-item>商家详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="channel-one">
      <div class="logo">
        <img v-if='ichannel.tenantInfo.logoUrlSrc' :src='ichannel.tenantInfo.logoUrlSrc' alt="企业logo" @error='imgErrorHandler(ichannel.tenantInfo)'>
        <img v-else :src='HeadLogo' alt="企业logo">
      </div>
      <div class="content">
        <el-tooltip class="item" effect="dark" :content="ichannel.tenantInfo.enterpriseTitle" placement="top-start">
          <p class="channel-title">{{ichannel.tenantInfo.enterpriseTitle}}</p>
        </el-tooltip>
        <div class="channel-type">
          <span class='channel-common channel-mark' v-if='ichannel.tenantInfo.tenantType == 0'>渠道商</span>
          <span class='channel-common channel-mark' v-if='ichannel.tenantInfo.tenantType == 1'>供应商</span>
          <span class='channel-common channel-mark' v-if='ichannel.tenantInfo.tenantType == 2'>渠道商、供应商</span>
          <!--  <template v-if='!ichannel.authentication'>
            <el-popover ref="popover" placement="bottom-start" title="" width="200" trigger="hover" content="您还未认证，认证后享受更多功能">
            </el-popover>
            <span class='channel-common channel-certf no-certf'>未认证</span>
          </template>
          <template v-if='ichannel.authentication'>
            <template v-if='ichannel.tenantInfo.authType == 1'>
              <span class='channel-common channel-certf doing-certf' v-if='!ichannel.authentication.auditStatus'>个人认证未处理</span>
              <span class='channel-common channel-certf doing-certf' v-if='ichannel.authentication.auditStatus == 1'>个人认证审核中</span>
              <span class='channel-common channel-certf done-certf' v-if='ichannel.authentication.auditStatus == 2'>实名认证</span>
              <span class='channel-common channel-certf fail-certf' v-if='ichannel.authentication.auditStatus == 3'>个人认证失败</span>
            </template>
            <template v-if='ichannel.tenantInfo.authType == 2'>
              <span class='channel-common channel-certf doing-certf' v-if='!ichannel.authentication.auditStatus'>企业认证未处理</span>
              <span class='channel-common channel-certf doing-certf' v-if='ichannel.authentication.auditStatus == 1'>企业认证审核中</span>
              <span class='channel-common channel-certf done-certf' v-if='ichannel.authentication.auditStatus == 2'>企业认证</span>
              <span class='channel-common channel-certf fail-certf' v-if='ichannel.authentication.auditStatus == 3'>企业认证失败</span>
            </template>
          </template> -->
          <svg class="icon mar-left zuan" aria-hidden="true">
            <use xlink:href="#icon-zuan"></use>
          </svg>
          <img src="../../../assets/img/identifyV.png" class='mar-left' alt="大V">
        </div>
      </div>
    </div>
    <div class="channel-two">
      <h3 class="msg-title">基本信息</h3>
      <div class="msg-content">
        <el-row style='margin-bottom:10px;'>
          <el-col :span="3">
            <div class="grid-content bg-purple" style="padding-left:40px;">商家名称：</div>
          </el-col>
          <el-col :span="21">
            <div class="grid-content bg-purple-light">{{ichannel.tenantInfo.enterpriseTitle}}</div>
          </el-col>
        </el-row>
        <el-row style='margin-bottom:10px;'>
          <el-col :span="3">
            <div class="grid-content bg-purple" style="padding-left:40px;">商家类型：</div>
          </el-col>
          <el-col :span="21">
            <div class="grid-content bg-purple-light"><span v-if='ichannel.tenantInfo.tenantType ==0'>渠道商</span><span v-if='ichannel.tenantInfo.tenantType ==1'>供应商</span><span v-if='ichannel.tenantInfo.tenantType ==2'>渠道商，供应商</span></div>
          </el-col>
        </el-row>
        <!-- <el-row style='margin-bottom:10px;'>
          <el-col :span="3">
            <div class="grid-content bg-purple" style="padding-left:40px;">主营类目：</div>
          </el-col>
          <el-col :span="21">
            <div class="grid-content bg-purple-light"><span v-for='item in ichannel.tenantInfo.category'>{{item}} </span></div>
          </el-col>
        </el-row> -->
        <el-row style='margin-bottom:10px;'>
          <el-col :span="3">
            <div class="grid-content bg-purple" style="padding-left:40px;">联系人：</div>
          </el-col>
          <el-col :span="21">
            <div class="grid-content bg-purple-light">{{ichannel.tenantInfo.contacts}}</div>
          </el-col>
        </el-row>
        <el-row style='margin-bottom:10px;'>
          <el-col :span="3">
            <div class="grid-content bg-purple" style="padding-left:40px;">手机号：</div>
          </el-col>
          <el-col :span="21">
            <div class="grid-content bg-purple-light">{{ichannel.tenantInfo.mobile}}</div>
          </el-col>
        </el-row>
        <el-row style='margin-bottom:10px;'>
          <el-col :span="3">
            <div class="grid-content bg-purple" style="padding-left:40px;">固定电话：</div>
          </el-col>
          <el-col :span="21">
            <div class="grid-content bg-purple-light">{{ichannel.tenantInfo.telephone}}</div>
          </el-col>
        </el-row>
        <el-row style='margin-bottom:10px;'>
          <el-col :span="3">
            <div class="grid-content bg-purple" style="padding-left:40px;">办公地址：</div>
          </el-col>
          <el-col :span="21">
            <div class="grid-content bg-purple-light">{{ichannel.tenantInfo.locProvince}}&nbsp{{ichannel.tenantInfo.locCity}}&nbsp{{ichannel.tenantInfo.locDistrict}}&nbsp{{ichannel.tenantInfo.locAddress}}</div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import HeadLogo from '../../../assets/img/HeadLogo.png'
export default {
  name: 'channel-detail',
  data() {
    return {
      HeadLogo: HeadLogo,
      ichannel: {
        tenantInfo: ''
      },
      origin: ''
    }
  },
  created() {},
  mounted() {},
  activated() {
    this.origin = this.$route.query.origin;
    if (window.sessionStorage.channel) {
      this.ichannel.tenantInfo = JSON.parse(window.sessionStorage.channel);
    }
  },
  computed: {},
  methods: {
    imgErrorHandler(offering) {
      offering.logoUrlSrc = HeadLogo;
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../../main.less';
.el-col-3 {
  width: 120px;
}

.mar-left {
  margin-right: 10px;
}

.channel-detail {
  padding: @normalSize;
}

.channel-one {
  cursor: default;
  box-sizing: border-box;
  width: 100%;
  height: 86px;
  padding-left: 20px;
  margin-top: 15px;
  margin-bottom: 40px;
  p {
    margin: 0;
  }
  .logo {
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 86px;
    height: 86px;
    padding: 5px;
    margin-right: 20px;
    border: 1px solid @borderLine;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  .content {
    float: left;
    height: 86px;
    .channel-title {
      margin-top: 10px;
      font-size: 28px;
      max-width: 500px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .channel-type {
      margin-top: 13px;
      height: 25px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .channel-common {
        padding: 0 15px 0 15px;
        display: inline-block;
        height: 25px;
        margin-right: 10px;
        line-height: 26px;
        color: #fff;
        text-align: center;
        border-radius: 15px;
      }
      .channel-mark {
        background: @baseGary;
      }
      .channel-certf {
        min-width: 80px;
      }
      .no-certf {
        background: @lightGary;
        color: #000;
      }
      .doing-certf {
        background: @blue;
      }
      .done-certf {
        background: @success;
      }
      .fail-certf {
        background: @danger;
      }
      .zuan {
        width: 13px;
        height: 13px;
      }
    }
  }
}

.channel-two {
  box-sizing: border-box;
  // width: 1123px;
  min-width: 1123px;
  height: 243px;
  padding: 10px;
  margin-left: 20px;
  border: 1px solid @borderLine;
  background: @pageBg;
  .msg-title {
    margin: 0 0 20px 0;
    font-size: 14px;
    font-weight: bold;
  }
  .msg-content {
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    color: @black;
  }
}
</style>
