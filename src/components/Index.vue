<template>
  <div class="indexBg">
    <el-row class="title">
      <div class="logo-box">
        <router-link to='businessDetail'>
          <img v-if='ichannel.tenantInfo.logoUrlSrc' :src="ichannel.tenantInfo.logoUrlSrc" alt="Logo" @error='imgErrorHandler(ichannel.tenantInfo)'>
          <img v-else :src='HeadLogo' alt="企业logo">
        </router-link>
      </div>
      <div class="shopTitle">
        <div>
          <el-tooltip class="item" effect="dark" :content="ichannel.tenantInfo.enterpriseTitle" placement="top-start">
            <router-link to='businessDetail'><span class='shopName' v-text="ichannel.tenantInfo.enterpriseTitle"></span></router-link>
          </el-tooltip>
          <span v-if="verno === 1001" class="version basiccolor">基础版</span>
          <span v-else-if="verno === 1002" class="version procolor">专业版</span>
          <span v-else-if="verno === 1003" class="version procolor">专业版</span>
          <span v-else-if="verno === 1004" class="version procolor">多门店专业版</span>
          <span v-else-if="verno === 1005" class="version ulticolor">旗舰版</span>
        </div>
        <div class="shopTotal">
          <span>目前拥有<span v-text="shopNum"></span><span>家店铺</span></span>
          <router-link to='businessDetail' class='edit-user'>编辑<span class="icon iconfont icon-iconbianji"></span></router-link>
        </div>
      </div>
      <!-- <div class="shopIcon">
        <img src="../assets/img/identifyV.png" alt="大V" class="idv">
        <span class="et">企业</span>
        <img src="../assets/img/defaultDiamond.png" alt="钻石">
      </div> -->
      <!-- <div class="maintain" v-if='warn'>
        <img src="../assets/img/upgradeRocket.png" alt="小火箭">
        <p class="sry" :title='warn' style="-webkit-box-orient: vertical;">
          {{warn}}
        </p>
      </div> -->
      <div class="versioninfo">
        <div class="valid">
          <span style="font-size:24px;font-family:stheitisc light;">剩余&nbsp;<span style="color:#4A90E2;">{{days}}</span>&nbsp;天</span>
          <span style="color:#99A9BF;font-size:12px;display:block;float:right;margin-top:18px;height:12px;line-height:12px;">{{expiredate}}到期</span>
        </div>
        <div class="progress">
          <el-progress :text-inside="false" :show-text="false" :stroke-width="10" :percentage="percentage"></el-progress>
        </div>
      </div>
    </el-row>
    <el-row class="index">
      <el-col class="index_left">
        <index-left></index-left>
      </el-col>
      <el-col class="index_right">
        <index-right @openNovice = 'openNovice'></index-right>
      </el-col>
    </el-row>
    <el-dialog v-model="dialogVisible" size="small" :close-on-click-modal='false' class="BG-Novice">
      <span slot="title" class="Novice"><i v-if="selectType != 0">新手引导</i>
      </span>
      <template v-if="selectType ===0">
        <selectType :ichannel="ichannel" @selectTypeChange="selectTypeChange"></selectType>
      </template>
      <template v-if="selectType === 1">
        <auth @authSuccess='authSuccess' @platformChange='platformChange' v-show='allStep === 0 && active === 1' style="margin-top: 40px;"></auth>
        <authSuccess :platform='platform' v-if='allStep === 1 && active === 1' key='authSuccess' @reAuth='reAuth' style="margin-top: 10px;" :selectType="selectType" @success="dialogVisible = false" @skip="skip"></authSuccess>
      </template>
      <template v-if="selectType === 2">
        <div class="step">
          <el-steps :active="active" :center="true" :align-center="true">
            <el-step title="授权店铺"></el-step>
            <el-step title="邀请供应商"></el-step>
            <el-step title="完成" icon="circle-check"></el-step>
          </el-steps>
        </div>
        <div class="content">
          <auth @authSuccess='authSuccess' @platformChange='platformChange' v-show='allStep === 0 && active === 1'></auth>
          <authSuccess :platform='platform' v-if='allStep === 1 && active === 1' key='authSuccess' @reAuth='reAuth' :selectType="selectType" @skip="skip"></authSuccess>
          <addSup @addSupSuccess='addSupSuccess' v-if='allStep === 2 && active === 2' key='addSup'></addSup>
          <addSupSuccess v-if='allStep === 3 && active === 2' key='addSupSuccess' :inviteType='inviteType' :enterpriseTitle='enterpriseTitle'></addSupSuccess>
          <noviceComplete v-if='active === 3' @noviceComplete='noviceComplete'></noviceComplete>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click.native="activeBack" style='width:100px'  :disabled='canPrev' :class='{notShow:canPrev}'>上一步</el-button>
          <el-button type="primary" @click.native="activeGo" style='width:100px'  :disabled='canNext' :class='{notShow:canNext}'>下一步</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- <myDialog v-model='dgshow' @close='dgshow=false'>hello world</myDialog>
    <myDialog v-model='dgshow2' @close='dgshow2=false'>hello world2222</myDialog>
    <button @click="dgshow = !dgshow">Open Dialog</button> -->
  </div>
</template>
<script>
// import {
//   baseUrl
// } from '../assets/baseUrl'
import IndexLeft from './Index/IndexLeft'
import IndexRight from './Index/IndexRight'
import HeadLogo from '../assets/img/HeadLogo.png'
import auth from './NoviceBoot/auth'
import authSuccess from './NoviceBoot/authSuccess'
import addSup from './NoviceBoot/addSup'
import addSupSuccess from './NoviceBoot/addSupSuccess'
import noviceComplete from './NoviceBoot/noviceComplete'
import selectType from './NoviceBoot/selectType'
import myDialog from './common/MyDialog'
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  name: 'index',
  data() {
    return {
      dgshow: false,
      dgshow2: false,
      platform: '',
      active: 1,
      //  0选择自营还是供应商发货 1自营 2供应商发货
      selectType: 0,
      //  0授权店铺 1授权店铺成功 2添加供应商 3添加供应商成功 4商品关联供应商
      allStep: 0,
      //  0是离线邀请  1是在线邀请
      inviteType: 0,
      enterpriseTitle: '',
      dialogVisible: false,
      HeadLogo: HeadLogo,
      time: '',
      warn: '',
      percentage: 75,
      verno: '1001',
      expiredate: '',
      days: 0,
    }
  },
  mounted() {
    // setTimeout(() => {
    //   this.dgshow2 = true;
    // }, 5000)
    var _self = this;
    this.getIchannel(_self).then((data) => {
      this.setShopEnum().then((xx) => {
        if (this.shopNum === 0 && this.ichannel.tenantInfo.tenantType !== 1) {
          this.dialogVisible = true;
        }
      });
    })
    // let localAddrStart = ['localhost', '192', 'demo'];
    // let localFlag = localAddrStart.some(n => {
    //   return window.location.host.startsWith(n);
    // })
    // if (localFlag) {
    //   var socket = window.io(baseUrl + 'warnTips', {
    //     'force new connection': true
    //   });
    //   var _self = this;
    //   //  将websockt注入到vuex中
    //   _self.connectWebsocket(socket);
    //   socket.on('warn', function(data) {
    //     _self.time = data.time;
    //     _self.warn = data.message;
    //     if (data.message) {
    //       _self.$notify({
    //         title: '通知',
    //         message: data.message,
    //         type: 'warning',
    //         offset: 100
    //       });
    //     }
    //   })
    //   socket.on('connect', function() {
    //     var userAgent = navigator.userAgent;
    //     if (userAgent.indexOf('Chrome') > -1) {
    //       console.log('%c websocket连接成功:' + '天蝎座', 'color:#F7BA2A;text-shadow:1px 1px 3px #ccc'); // 'G5p5...'
    //     } else {
    //       console.log('websocket连接成功:' + socket.id); // 'G5p5...'
    //     }
    //   });
    // }
    // this.queryShop();
  },
  components: {
    IndexLeft,
    IndexRight,
    auth,
    authSuccess,
    addSup,
    addSupSuccess,
    noviceComplete,
    myDialog,
    selectType
  },
  watch: {
    'active': function(val, oldVal) {
      if (val === 1) {
        this.allStep = 0;
      }
      if (val === 2) {
        this.allStep = 2;
      }
      if (val === 3) {
        this.allStep = 3;
      }
    }
  },
  methods: {
    ...mapActions([
      'setShopEnum',
      'getIchannel',
      'connectWebsocket'
    ]),
    //  跳过授权直接进入系统
    skip() {
      this.dialogVisible = false;
    },
    platformChange(val) {
      this.platform = val;
    },
    selectTypeChange(val) {
      this.selectType = val;
    },
    openNovice() {
      this.selectType = 0;
      this.active = 1;
      this.allStep = 0;
      this.inviteType = 0;
      this.dialogVisible = true;
    },
    //  授权失败但是用户点击成功
    reAuth() {
      this.active = 1;
      this.allStep = 0;
    },
    //  结束新手引导
    noviceComplete() {
      this.dialogVisible = false;
      this.active = 1;
      this.allStep = 0;
    },
    //  授权成功
    authSuccess() {
      this.allStep = 1;
    },
    //  邀请店铺成功
    addSupSuccess(obj) {
      this.inviteType = obj.type;
      this.enterpriseTitle = obj.enterpriseTitle;
      this.allStep = 3;
    },
    activeGo() {
      if (this.active < 3) {
        this.active++;
        if (this.active === 2) {
          this.allStep = 2;
        }
      } else {
        this.active = 1;
      }
    },
    activeBack() {
      if (this.active > 1) {
        this.active--;
      }
    },
    imgErrorHandler(offering) {
      offering.logoUrlSrc = HeadLogo;
    },
    queryShop() {
      let query = {};
      this.axios.post('/customer/shopInfo/queryShopGroupByPlatform', query).then(res => {
        if (!res.data.amount) {
          this.$router.push({
            path: '/help'
          });
        };
        return 'hello';
      }).catch(err => {
        this.$message({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    contains(item, items) {
      for (var i = 0; i < items.length; i++) {
        if (items[i] === item) {
          return true;
        }
      }
      return false;
    },
    getVerpri(key, vplist) {
      for (var i = 0; i < vplist.length; i++) {
        if (vplist[i].roleId === key) {
          return vplist[i];
        }
      }
      return null;
    },
    getDateDiff(time1, time2) {
      let days = time1.getTime() - time2.getTime();
      return parseInt(days / (1000 * 60 * 60 * 24));
    },
    queryPriv() {
      let query = {
        tenantId: this.ichannel.tenantInfo.tenantId
      }
      this.axios.post('/sysmgnt/version/getVersionPrivileges', query).then(res => {
        let vplist = res.data;
        let roles = [];
        for (var i = 0; i < vplist.length; i++) {
          roles.push(vplist[i].roleId);
        }
        let startdate = '';
        let expiredate = '';
        if (this.contains(1005, roles)) {
          this.verno = 1005;
          startdate = this.getVerpri(1005, vplist).effectiveDate.substring(0, 10);
          expiredate = this.getVerpri(1005, vplist).expiredDate.substring(0, 10);
        } else if (this.contains(1004, roles) && !this.contains(1005, roles)) {
          this.verno = 1004;
          startdate = this.getVerpri(1004, vplist).effectiveDate.substring(0, 10);
          expiredate = this.getVerpri(1004, vplist).expiredDate.substring(0, 10);
        } else if (this.contains(1003, roles) && !this.contains(1004, roles) && !this.contains(1005, roles)) {
          this.verno = 1002;
          startdate = this.getVerpri(1003, vplist).effectiveDate.substring(0, 10);
          expiredate = this.getVerpri(1003, vplist).expiredDate.substring(0, 10);
        } else if (this.contains(1002, roles) && !this.contains(1003, roles) && !this.contains(1004, roles) && !this.contains(1005, roles)) {
          this.verno = 1002;
          startdate = this.getVerpri(1002, vplist).effectiveDate.substring(0, 10);
          expiredate = this.getVerpri(1002, vplist).expiredDate.substring(0, 10);
        } else if (this.contains(1001, roles) && !this.contains(1003, roles) && !this.contains(1004, roles) && !this.contains(1005, roles) && !this.contains(1002, roles)) {
          this.verno = 1001;
          startdate = this.getVerpri(1001, vplist).effectiveDate.substring(0, 10);
          expiredate = this.getVerpri(1001, vplist).expiredDate.substring(0, 10);
        }
        this.days = this.getDateDiff(new Date(expiredate.replace(/-/g, '/')), new Date());
        let alldays = this.getDateDiff(new Date(expiredate.replace(/-/g, '/')), new Date(startdate.replace(/-/g, '/')));
        this.percentage = this.days / alldays * 100;
        this.expiredate = expiredate;
      }).catch(err => {
        this.$message.error({
          message: err.response ? err.response.data : err
        });
      })
    },
  },
  activated() {
    this.queryPriv();
    this.axios.post('/notice/notice/getNotice', {}).then(res => {
      this.warn = res.data.content;
    })
  },
  computed: {
    ...mapGetters([
      'ichannel',
      'websockt'
    ]),
    shopNum() {
      return Object.keys(this.$store.state.enumSet.shopEnum).length;
    },
    canNext() {
      return this.shopNum === 0 || this.active === 3;
    },
    canPrev() {
      return this.active === 1;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // vm.setShopEnum();
    })
  }
}
</script>
<style lang="less" scoped>
@import '../main.less';
.notShow {
  opacity: 0;
}
.Novice {
  i {
    display: inline-block;
    font-style: normal;
    font-size: 18px;
    margin-bottom: 8px;
  }
}

.edit-user {
  margin-left: 20px;
  color: @primaryBlue!important;
}

.step {
  width: 600px;
  margin: 0 auto;
}

.title {
  padding-left: @baseSpace * 3;
  height: 75px;
  background-color: @pageBg;
  font-size: @homeFont24;
  color: @baseGary;
  box-shadow: 2px 2px 5px @borderLine;
  .shopTitle,
  .logo-box {
    float: left;
    margin-top: @baseSpace * 3;
    a:link {
      text-decoration: none;
      color: #000;
    }
    a:visited {
      color: #000;
    }
  }
  .shopName {
    display: inline-block;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: @baseGary;
    transition: color 0.5s;
  }
  .shopName:hover {
    color: @neutralGary;
  }
  .version {
    font-size: 12px;
    color: #ffffff;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    height: 18px;
    margin-left: 10px;
    line-height: 18px;
    padding-left:5px;
    padding-right: 5px;
    border-radius: 4px;
  }
  .basiccolor {
    background-color: #66728C;
  }
  .procolor {
    background-color: #4A90E2;
  }
  .ulticolor {
    background-color: #D1A830;
  }
  .logo-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    line-height: 60px;
    margin-top: 7.5px;
    margin-right: @baseSpace * 3;
    border: 1px solid @borderLine;
    border-radius: 50%;
    overflow: hidden;
    transition: box-shadow 0.5s;
    a {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 60px;
    }
    img {
      font-size: 12px;
      width: 100%;
      height: 100%;
      text-align: center;
    }
  }
  .logo-box:hover {
    box-shadow: 0 0 8px #000;
  }
  .shopTotal {
    font-size: @baseFont;
    color: @neutralGary;
    line-height: @baseFont;
    // margin-top: 6px;
    > span > span {
      color: @primaryBlue;
    }
  }
  .shopIcon {
    margin-top: @baseSpace * 5;
    overflow: hidden;
    margin-left: @baseSpace * 2;
  }
  .shopIcon,
  .shopIcon img,
  .et {
    float: left;
  }
  .et {
    display: inline-block;
    font-size: @baseFont;
    color: @white;
    width: 32px;
    height: 15px;
    line-height: 15px;
    border-radius: 4px;
    text-align: center;
    margin: 0 @baseSpace * 2;
    background-color: #4990E2;
  }
  .maintain {
    float: right;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 255px;
    height: 50px;
    margin: @baseSpace * 2px;
    background-color: @white;
    border: 1px solid @borderLine;
    border-radius: 4px;
    overflow: hidden;
    img {
      margin: 0 10px 0 10px;
    }
    .sry {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 160px;
      margin: 0;
      text-align: justify;
      font-size: @baseFont;
      color: @neutralGary;
    }
  }
  .versioninfo {
    float: right;
    align-items: center;
    width: 270px;
    margin-top: 5px;
    margin-bottom: @baseSpace * 2px;
    margin-right: 15px;
    overflow: hidden;
  }
  .valid {
    width: 100%;
  }
  .progress {
    width: 100%;
    margin-top: 10px;
  }
}

.index {
  min-width: 900px;
  padding: @smallSize;
  padding-top: @baseSpace * 4;
  display: flex;
  justify-content: space-between;
  .index_right {
    width: 300px;
  }
}
</style>
<style lang="less">
.indexBg .BG-Novice .el-dialog__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 20px 10px 20px!important;
  background-color: #fff!important;
}

.indexBg .BG-Novice .el-dialog__body {
  height: 350px;
  padding-top: 10px!important;
  border-bottom: none!important;
}

.indexBg .BG-Novice .el-dialog--small {
  width: 700px;
  height: 500px;
}

.indexBg .BG-Novice .el-form-item__error {
  padding-top: 0;
}
.indexBg .BG-Novice .dialog-footer{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
