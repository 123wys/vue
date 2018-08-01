<template>
  <div class="channel-detail">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>商家信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="channel-one">
      <div class="logo">
        <img v-if='ichannel.tenantInfo.logoUrlSrc' :src="ichannel.tenantInfo.logoUrlSrc" class="avatar" alt='企业logo' @error='imgErrorHandler(ichannel.tenantInfo)'>
        <img v-else :src='HeadLogo' alt="企业logo">
      </div>
      <authent :ichannel='ichannel' style='cursor:default'></authent>
    </div>
    <div class="channel-two">
      <div class="update-msg"><i class="icon iconfont icon-iconbianji"></i><a href='javascript:void(0)' class="update-btn" @click='editMsg'>编辑信息</a></div>
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
            <div class="grid-content bg-purple-light">{{ichannel.tenantInfo.mobile}}
            </div>
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
    <!-- <h2 class="vip-title">vip特享权益</h2>
    <div class="vip-box">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple vip-intro">VIP1：免费精简版
            <br />
            <br />到期日：2017-03-05（剩余时间20天）</div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple vip-intro">VIP2：基础版</div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple vip-intro">VIP3：豪华版</div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple vip-intro">VIP4：企业专业定制版<a href='#/operation' class="consultation"><i class="icon iconfont icon-kefu" style="margin-right:5px;color:#F7BA2A"></i>立即咨询</a></div>
        </el-col>
      </el-row>
    </div> -->
  </div>
</template>
<script>
import authent from './authent'
import HeadLogo from '../../../assets/img/HeadLogo.png'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'channel-detail',
  components: {
    authent
  },
  data() {
    return {
      HeadLogo: HeadLogo,
      data: {
        id: ''
      }
    }
  },
  activated() {},
  computed: {
    ...mapGetters([
      'ichannel'
    ])
  },
  methods: {
    imgErrorHandler(offering) {
      offering.logoUrlSrc = this.HeadLogo;
    },
    //  修改绑定手机号
    changeMobile() {
      this.$router.push({
        path: '/accountSet/account'
      })
    },
    //  编辑信息
    editMsg() {
      this.$router.push({
        path: '/businessUpdate',
        query: {
          tenantId: this.ichannel.tenantInfo.tenantId
        }
      });
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

.head {
  font-size: 14px;
  padding: 8px 0 @normalSize 0;
}

.channel-detail {
  padding: @normalSize;
}

.channel-one {
  box-sizing: border-box;
  width: 100%;
  height: 86px;
  padding-left: 20px;
  margin-top: 15px;
  margin-bottom: 20px;
  p {
    margin: 0;
  }
  .logo {
    position: relative;
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
    .avatar-uploader {
      width: 80px;
      height: 86px;
    }
    .update-logo {
      position: absolute;
      bottom: -25px;
      left: 8px;
      width: 100px;
      text-align: left;
      color: @darkGary;
      transition: color .5s;
    }
    .update-logo:hover {
      color: #C0CCDA;
    }
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  //   .content css原位置
}

.channel-two {
  position: relative;
  box-sizing: border-box;
  min-width: 1123px;
  height: 243px;
  padding: 10px;
  margin-left: 20px;
  border: 1px solid @borderLine;
  background: @pageBg;
  .update-msg {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 140px;
    height: 40px;
    top: 5px;
    right: 5px;
    // background: #dff7e1;
    .update-btn {
      margin-left: 5px;
      text-decoration: none;
      cursor: pointer;
    }
    a:link {
      color: #20A0FF!important;
    }
    a:visited {
      color: #20A0FF!important;
    }
    a:hover {
      color: #1D8CE0!important;
    }
    a:active {
      color: #20A0FF!important;
    }
  }
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

.change-mobile {
  margin-left: 20px;
  font-size: @smallSize;
  color: @darkGary;
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
  transition: color .5s;
}

.change-mobile:hover {
  color: #C0CCDA;
}

.vip-title {
  padding-left: 20px;
  font-weight: normal;
  font-size: 14px;
}

.vip-box {
  min-width: 1123px;
  height: 243px;
  margin-left: 20px;
  .vip-intro {
    box-sizing: border-box;
    padding: 10px;
    .consultation {
      position: absolute;
      bottom: 10px;
      right: 20px;
      text-decoration: none!important;
    }
    a:link {
      color: #20A0FF!important;
    }
    a:visited {
      color: #20A0FF!important;
    }
    a:hover {
      color: #1D8CE0!important;
    }
    a:active {
      color: #20A0FF!important;
    }
  }
}
</style>
<style lang='less'>
@import '../../../main.less';
.logo .el-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.logo .el-upload__files {
  display: none;
}

.logo .el-upload__inner {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.vip-box .el-row {
  height: 100%;
}

.vip-box .el-col {
  height: 100%;
}

.vip-box .grid-content {
  box-sizing: border-box;
  border: 1px solid @borderLine;
  height: 100%;
  background: @pageBg;
}
</style>
