<template>
  <div class="supportCenter">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>帮助中心</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="part-one">
      <el-col :span="8">
        <div>
          <h1 class="how-support">我们怎样提供帮助</h1>
          <p class="content">每周三在&nbsp“小亚通”&nbsp订阅号实时推出&nbsp“每周一答”&nbsp
            <br/>技术市场人员在线答疑
            <br/>汇聚常见问题形成帮助手册</p>
        </div>
      </el-col>
      <el-col :span="16">
        <div>
          <h1 class="how-support" style='font-size:18px'>开启轻电商之旅，只需3步走</h1>
          <p class="content">授权店铺，邀请供应商，商品关联供应商，触发&nbsp“下载订单”&nbsp开启订单汇聚分发
            <br/>
            <router-link to="help">查看新手引导&nbsp></router-link>
          </p>
        </div>
      </el-col>
    </el-row>
    <el-row class="part-two">
      <el-col :span="8">
        <div>
          <h1 class="how-support" style='font-size:18px'>企业互联</h1>
          <p class="content"><a href="https://mp.weixin.qq.com/s/76Ne0OlO8kyQgNdgGWPV7w" target='_blank'>怎样授权店铺</a>
            <br/><a href="https://mp.weixin.qq.com/s/19q3XRLExK8PSDHyZe3ypg" target='_blank'>如何邀请供应商</a></p>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <h1 class="how-support" style='font-size:18px'>订单管理</h1>
          <p class="content"><a href="https://mp.weixin.qq.com/s/12JRyel4CnhTRTsDJvV7pQ" target='_blank'>如何发货</a>
            <br/><a href="https://mp.weixin.qq.com/s/ZzQ7Ry8XSw0mvno62tEIVQ" target='_blank'>如何处理问题订单</a></p>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <h1 class="how-support" style='font-size:18px;color:#66728C'>其他</h1>
        </div>
      </el-col>
    </el-row>
    <div class="footer">
      <h1 class="how-support" style='padding-left:7px'>还有问题吗？</h1>
      <img src="../../assets/img/qrcode.jpg">
      <p>微信扫一扫关注小亚通</p>
      <p>欢迎致电客服&nbsp0571-88938265&nbsp或&nbsp <a href="javascript:void(0)" @click='onlineService'>在线交流&nbsp></a></p>
    </div>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex'
export default {
  name: 'supportCenter',
  data() {
    return {
      clientInfo: {}
    }
  },
  computed: {
    ...mapGetters([
      'ichannel'
    ])
  },
  activated() {},
  methods: {
    onlineService() {
      this.clientInfo.name = this.ichannel.tenantInfo.enterpriseTitle;
      this.clientInfo.tel = this.ichannel.tenantInfo.mobile;
      this.clientInfo.address = this.ichannel.tenantInfo.locProvince + this.ichannel.tenantInfo.locCity + this.ichannel.tenantInfo.locDistrict + this.ichannel.tenantInfo.locAddress;
      this.clientInfo.email = this.ichannel.tenantInfo.email;
      this.clientInfo.comment = this.ichannel.tenantInfo.contacts;
      if (this.ichannel.tenantInfo.tenantType === 0) {
        this.clientInfo.gender = '渠道商';
      } else if (this.ichannel.tenantInfo.tenantType === 1) {
        this.clientInfo.gender = '供应商';
      } else {
        this.clientInfo.gender = '渠道商&供应商';
      }
      window.open('https://static.meiqia.com/dist/standalone.html?eid=53091&metadata=' + JSON.stringify(this.clientInfo));
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.supportCenter {
  min-width: 900px;
  color: @lightBlack;
  padding: @normalSize;
}

a:link {
  color: @tipsBlue;
  text-decoration: none;
}

a:visited {
  color: @tipsBlue;
}

.part-one {
  margin-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid @borderLine;
  padding-left: 15px;
}

.part-two {
  padding: 20px 0 20px 0;
  padding-left: 15px;
  border-bottom: 1px solid @borderLine;
}

.how-support {
  height: 40px;
  margin: 0;
  line-height: 40px;
  font-size: 28px;
  color: @baseGary;
  font-weight: normal;
}

.content {
  margin: 5px 0 0 0;
  font-size: 12px;
  line-height: 24px;
  color: @neutralGary;
}

.footer {
  width: 250px;
  margin: 0 auto;
  margin-top: 100px;
  text-align: center;
  h1 {
    font-size: 18px;
    text-align: center;
  }
  img {
    width: 100px;
    height: 100px;
  }
  p {
    margin: 0 0 5px 0;
  }
}
</style>
