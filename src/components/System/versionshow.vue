<template>
  <div class="versionshow">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item :to="{path: '/sysmgnt'}">系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>服务资费</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="title">服务资费</div>
    <el-row class="version">
      <el-col class="basic">
        <div class="versiontitle">
          <h2>基础版</h2>
          <h3>1年期</h3>
          <h4 style="color: #333333;">免费</h4>
        </div>
        <div class="versioncontent">
          <ul class="contentlist">
            <li><span style="color: #324057;">电商订单智能分发</span></li>
            <li style="margin-top: 12px;"><span style="color: #324057;">在线邀请供应商入住</span></li>
          </ul>
        </div>
        <div style="text-align:center;">
          <el-button size='small' class="actionbtn">免费试用</el-button>
        </div>
      </el-col>
      <el-col class="pro">
        <div class="versiontitle">
          <h2>专业版</h2>
          <h3>1年期</h3>
          <h4 style="color: #333333;">￥ 9,800</h4>
        </div>
        <div class="versioncontent">
          <ul class="contentlist">
            <li><span class="smalltitle">核心</span><span style="color: #324057;">电商订单智能分发全功能</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">必备</span><span style="color: #324057;">在线邀请供应商入驻无限量</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">便捷</span><span style="color: #324057;">快递面单、发货单快速打印</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">超值</span><span style="color: #324057;">京东物流仓配服务</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">安心</span><span style="color: #324057;">在线快速对账结算</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">灵活</span><span style="color: #324057;">实时库存智能管理</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">高效</span><span style="color: #324057;">多渠道客户统一识别管理</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">智能</span><span style="color: #324057;">数据中心助力高效运营</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">贴身</span><span style="color: #324057;">专属服务经理</span></li>
          </ul>
        </div>
        <div style="text-align:center;">
          <el-button size='small' class="actionbtn">免费试用</el-button>
        </div>
      </el-col>
      <el-col class="protwoyears">
        <div class="versiontitle">
          <h2>专业版</h2>
          <h3>2 + 1年期</h3>
          <h4 style="color: #333333;">￥ 19,600</h4>
        </div>
        <div class="versioncontent">
          <ul class="contentlist">
            <li><span class="smalltitle">核心</span><span style="color: #324057;">电商订单智能分发全功能</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">必备</span><span style="color: #324057;">在线邀请供应商入驻无限量</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">便捷</span><span style="color: #324057;">快递面单、发货单快速打印</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">超值</span><span style="color: #324057;">京东物流仓配服务</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">安心</span><span style="color: #324057;">在线快速对账结算</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">灵活</span><span style="color: #324057;">实时库存智能管理</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">高效</span><span style="color: #324057;">多渠道客户统一识别管理</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">智能</span><span style="color: #324057;">数据中心助力高效运营</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">贴身</span><span style="color: #324057;">专属服务经理</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">优惠</span><span style="color: #324057;">买二赠一更优惠</span></li>
          </ul>
        </div>
        <div style="text-align:center;">
          <el-button size='small' class="actionbtn">免费试用</el-button>
        </div>
      </el-col>
      <el-col class="prostore">
        <div class="versiontitle">
          <h2>多门店专业版</h2>
          <h3>1年期</h3>
          <h4 style="color: #333333;">￥ 9,800</h4>
        </div>
        <div class="versioncontent">
          <ul class="contentlist">
            <li><span class="smalltitle">核心</span><span style="color: #324057;">线上线下门店订单智能分发</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">必备</span><span style="color: #324057;">在线邀请供应商入驻无限量</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">便捷</span><span style="color: #324057;">快递面单、发货单快速打印</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">超值</span><span style="color: #324057;">京东物流仓配服务</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">安心</span><span style="color: #324057;">在线快速对账结算</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">灵活</span><span style="color: #324057;">实时库存智能管理</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">高效</span><span style="color: #324057;">多渠道客户统一识别管理</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">智能</span><span style="color: #324057;">数据中心助力高效运营</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">贴身</span><span style="color: #324057;">专属服务经理</span></li>
          </ul>
        </div>
        <div style="text-align:center;">
          <el-button size='small' class="actionbtn">免费试用</el-button>
        </div>
      </el-col>
      <el-col class="ultimate">
        <div class="versiontitle">
          <h2 style="color: #F5A623;">旗舰版</h2>
          <h3>1年期</h3>
          <h4 style="color: #333333;">价格面议</h4>
        </div>
        <div class="versioncontent">
          <ul class="contentlist">
            <li><span class="smalltitle">核心</span><span style="color: #324057;">基于订单智能分发为客户实现多平台对接</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">必备</span><span style="color: #324057;">在线邀请供应商入驻无限量</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">便捷</span><span style="color: #324057;">快递面单、发货单快速打印</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">超值</span><span style="color: #324057;">京东物流仓配服务</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">安心</span><span style="color: #324057;">在线快速对账结算</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">灵活</span><span style="color: #324057;">实时库存智能管理</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">高效</span><span style="color: #324057;">多渠道客户统一识别管理</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">智能</span><span style="color: #324057;">数据中心助力高效运营</span></li>
            <li style="margin-top: 12px;"><span class="smalltitle">贴身</span><span style="color: #324057;">专属服务经理</span></li>
          </ul>
        </div>
        <div style="text-align:center;">
          <el-button size='small' class="actionbtn">免费试用</el-button>
        </div>
      </el-col>
    </el-row>
    <div class="callservice">
      <i class="icon iconfont icon-kefu1" style="color: #C0CCDA;"></i>&nbsp;
      <span style="color: #4A90E2;">联系客服</span>
    </div>
    <div class="phone">
      <span style="color:#66728C;">客户服务：</span>
      <span style="color:#324057;">132-1614-7425</span>
      <span style="color:#66728C;margin-left: 15px;">技术支持：</span>
      <span style="color:#324057;">130-4762-8481</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'versionshow',
  data() {
    return {
      editMode: 0,
    }
  },
  methods: {
    mapName(roleId) {
      return this.$store.state.enumSet.operationRoleds[roleId + ''] + ' ';
    },
  },
  activated() {
    this.editMode = 0;
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';

.versionshow {
  padding: @normalSize;
}
.title {
  width: 100%;
  text-align: center;
  font-size: @homeFont24;
  margin-top: @baseSpace * 4;
  margin-bottom: @baseSpace * 4;
}
.version {
  display: flex;
  justify-content: space-between;
}
h2 {
  font-size: @homeFont24;
  color: @primaryBlue;
  margin: 0px;
}
h3 {
  font-size: @fontSize14;
  color: @baseGary;
  margin-top: 25px;
  margin-bottom: 0px;
}
h4 {
  font-size: 18px;
  color: @baseGary;
  margin-top: 10px;
  margin-bottom: 0px;
}
.versiontitle {
  text-align: center;
  height: 160px;
  margin-left: 10px;
  margin-right: 10px;
  padding-top: 30px;
  padding-bottom: 30px;
  border-bottom: 1px dashed @borderLine;
}
.versioncontent {
  height: 330px;
  color: @tipsBlue;
  margin-left: 15px;
  margin-right: 15px;
  padding-top: 30px;
  font-size: 12px;
}
.contentlist {
  padding-left: 10px;
  margin: 0px;
}
.actionbtn {
  width: 80px;
  height: 30px;
  margin-bottom: 0px;
}
.smalltitle {
  color: #333333;
  margin-right: 10px;
}
.basic {
  flex-basis: 150px;
  height: 550px;
  margin-right: 10px;
  border: 1px solid @borderLine;
  background: #fff;
}
.pro {
  width: 230px;
  height: 550px;
  margin-right: 10px;
  border: 1px solid @borderLine;
  background: #fff;
  background-image: url('../../assets/img/tuijian.png');
  background-repeat:no-repeat;
  background-size: 60px 65px;
  background-position: 0px 0px;
}
.protwoyears {
  flex-basis: 230px;
  height: 550px;
  margin-right: 10px;
  border: 1px solid @borderLine;
  background: #fff;
  background-image: url('../../assets/img/xingjiabi.png');
  background-repeat:no-repeat;
  background-size: 60px 65px;
  background-position: 0px 0px;
}
.prostore {
  flex-basis: 230px;
  height: 550px;
  margin-right: 10px;
  border: 1px solid @borderLine;
  background: #fff;
}
.ultimate {
  flex-basis: 230px;
  height: 550px;
  border: 1px solid @borderLine;
  background: #fff;
}
.callservice {
  width: 100%;
  text-align: center;
  font-size: @fontSize14;
  margin-top: 30px;
  margin-bottom: 15px;
}
.phone {
  width: 100%;
  text-align: center;
  font-size: @fontSize14;
}
</style>
