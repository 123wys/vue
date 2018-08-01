<template>
  <div class="auth">
    <p class="auth-subTitle">{{title[authState]}}</p>
    <div class="auth-box" v-show='authState === 0'>
      <iconBox type="KDT" @authStateChange='authStateChange' :href='KDT'>
        <svg class="icon auth-icon" aria-hidden="true">
          <use xlink:href="#icon-youzan"></use>
        </svg>
      </iconBox>
      <iconBox type="TMALL" @authStateChange='authStateChange' :href='TMALL'>
        <svg class="icon auth-icon" aria-hidden="true">
          <use xlink:href="#icon-tianmao"></use>
        </svg>
      </iconBox>
      <iconBox type="TMALL" @authStateChange='authStateChange' :href='TMALL'>
        <svg class="icon auth-icon" aria-hidden="true">
          <use xlink:href="#icon-taobaowang"></use>
        </svg>
      </iconBox>
      <iconBox type="WEIDIAN" @authStateChange='authStateChange' :href='WEIDIAN'>
        <svg class="icon auth-icon" aria-hidden="true">
          <use xlink:href="#icon-weidian1"></use>
        </svg>
      </iconBox>
      <iconBox type="WEISHANG" @createSuccess='createSuccess'>
        <svg class="icon auth-icon" aria-hidden="true">
          <use xlink:href="#icon-woshiweishang"></use>
        </svg>
      </iconBox>
    </div>
    <div style="text-align:center" v-if="nameShow">
      <svg class="icon auth-icon" aria-hidden="true">
        <use xlink:href="#icon-virtual"></use>
      </svg>虚拟店铺-{{name}}<span class="successColor">创建成功</span></div>
    <div v-show='authState === 1' class="isSuccess">
      <p>
        <svg class="icon auth-icon icon-check" aria-hidden="true">
          <use :xlink:href="iconList[platform]"></use>
        </svg>
      </p>
      <span>平台是否授权成功？</span>
      <el-button size="small" @click='assotFail'>否</el-button>
      <el-button type="primary" size="small" @click='assotSuccess'>是</el-button>
    </div>
    <p class="link-us" v-show='authState === 0'>需要对接其他平台？<a href="javascript:void(0)" @click='onlineService'>在线咨询</a></p>
  </div>
</template>
<script>
import {
  mapActions,
  mapGetters
} from 'vuex'
import iconBox from './iconBox'
export default {
  name: 'auth',
  data() {
    return {
      clientInfo: {},
      // 授权店铺类型
      platform: '',
      iconList: {
        KDT: '#icon-youzan',
        TMALL: '#icon-taobaowang',
        WEIDIAN: '#icon-weidian1'
      },
      // 增加成功的虚拟店铺名字
      name: '',
      nameShow: false,
      authState: 0,
      title: ['请选择一个平台授权店铺', ''],
      KDT: 'https://mp.weixin.qq.com/s/uq04GjmLCLx9HP_lJgJIzQ',
      TMALL: 'https://mp.weixin.qq.com/s/DTrnoW4eBUqbbr6u1IRbqg',
      WEIDIAN: 'https://mp.weixin.qq.com/s/jSuNowTgonM7_kowokkKyg'
    }
  },
  components: {
    iconBox
  },
  computed: {
    ...mapGetters([
      'ichannel'
    ])
  },
  methods: {
    ...mapActions([
      'setShopEnum'
    ]),
    createSuccess(name) {
      this.name = name;
      this.nameShow = true;
    },
    authStateChange(state, platform) {
      this.authState = state;
      this.platform = platform;
      this.$emit('platformChange', platform);
    },
    //  授权失败
    assotFail() {
      this.authState = 0;
      this.setShopEnum();
    },
    //  授权成功
    assotSuccess() {
      this.authState = 0;
      this.$emit('authSuccess');
    },
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
.auth-subTitle {
  font-size: 14px;
  color: @lightGary;
  text-align: center;
}

.successColor {
  color: @successGreen;
}

.auth-box {
  width: 590px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  .auth-icon {
    width: 100px;
    height: 30px;
    margin: 0 10px 0 10px;
  }
}

.isSuccess {
  text-align: center;
}

.link-us {
  width: 590px;
  margin: 0 auto;
  margin-top: 10px;
  text-align: right;
  color: @lightGary;
  a:link {
    text-decoration: none;
    color: @primaryBlue;
  }
  a:visited {
    color: @primaryBlue;
  }
}

.icon-check {
  width: 140px;
  height: 80px;
}
</style>
