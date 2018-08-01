<template>
  <div class="top">
    <el-popover ref="popover1" placement="bottom" width="150" trigger="hover" v-model="closepopover">
      <div>
        <div class="zhanghaoshezhi">
          <span><a href="#/accountSet" class="acolor">账号设置</a></span>
        </div>
        <div class="tuichudenglu">
          <span><a href="javascript:void(0);" @click="logout()" class="acolor">退出</a></span>
        </div>
      </div>
    </el-popover>
    <!--铃铛信息-->
    <el-popover
      ref="popover4"
      placement="bottom"
      width="300"
      trigger="click" v-model="closePopover" @show="hideBadge()">
      <template v-if='sysMessage.length'>
        <div v-for="message in sysMessage" class="orderMessage" v-loading="loading">
          <div class="title">
            <i :class="[message.icon]"></i>
            <div>
              <div class="order">
                <span v-text="message.moduleName" class="name"></span>
                <span v-text="message.time" class="date"></span>
              </div>
              <div v-text="message.msgTitle" :class="[message.status === 1 ? 'success' : 'error']"></div>
              <div v-text="message.content" class="content"></div>
              <span  class="link" @click="changeRouter(message.path,message.query)">{{message.link}}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="noInfo">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xiaoxitixing"></use>
          </svg>
          <p>暂无未读消息</p>
        </div>
      </template>
      <div class="btn">
        <el-button size="mini" @click="historyInfo">查看历史信息</el-button>
      </div>
    </el-popover>
    <!-- <el-popover ref="service" placement="bottom" width="200" trigger="hover">
      <div>
        <div class="servicetime">
          <span>服务时间：09:00—18:00</span>
        </div>
        <div class="phoneno">
          <i class="icon iconfont icon-dianhua"></i>&nbsp&nbsp
          <span>0571-88938265</span>
        </div>
        <div style="margin-top: 10px;text-align: center;">
          <i class="icon iconfont icon-zaixianzixun"></i>&nbsp&nbsp在线咨询
        </div>
      </div>
    </el-popover>
    <el-popover ref="focus" placement="bottom" width="200" trigger="hover">
      <div>
        <img src="../qrcode.png">
      </div>
    </el-popover> -->
    <div class="logo">
      <div style="float:left">
        <a href="#"><img src="../toplogo.png"></a>
      </div>
      <div class="productTitle">
        <a href="#" style="text-decoration:none;">
          <span class="softname">小亚通</span>
          <!-- <br>
          <span class="version">基础版</span> -->
        </a>
      </div>
    </div>
    <div class="newInfo">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-new1"></use>
      </svg>
      电子面单&批量打单 功能全新上线啦, 快来体验吧～
      <!-- <router-link :to="{ path: '/order', query: { activeName: '1'}}"> -->
      <span @click="goPrintHelp">点击查看教程</span>
      <!-- </router-link> -->
    </div>
    <div class="service">
      <div class="userinfo">
        <div style="font-size:14px;">{{jurisdiction.opName}}&nbsp&nbsp<i class="el-icon-caret-bottom"
                                                                         v-popover:popover1></i></div>
        <div style="font-size:12px;margin-top:5px;">{{jurisdiction.isAdmin == 1 ? '管理员' : '操作员'}}</div>
      </div>
      <div class="userhead">
        <img
          v-if="typeof jurisdiction.thirdUserInfo.headImgUrl !== 'undefined' && jurisdiction.thirdUserInfo.headImgUrl !== ''"
          :src="jurisdiction.thirdUserInfo.headImgUrl" style="width:32px;height:32px;">
        <img v-else src="../defaultHead.png" style="width:32px;height:32px;">
      </div>
      <div class="icondiv">
        <el-badge :value="badge" class="item">
          <svg class="icon" aria-hidden="true" v-popover:popover4>
            <use xlink:href="#icon-xiaoxitixing"></use>
          </svg>
        </el-badge>
        <el-tooltip class="item" effect="light" content="点击在线咨询客服" placement="bottom">
          <svg class="icon" aria-hidden="true" @click="onlineService()">
            <use xlink:href="#icon-kefu1"></use>
            '
          </svg>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="点击进入帮助中心" placement="bottom">
          <svg class="icon" style="font-size: 28px;" aria-hidden="true" @click="goHelp">
            <use xlink:href="#icon-bangzhu1"></use>
          </svg>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import Vue from 'vue'
  import {
    mapGetters,
    mapActions
  } from 'vuex'
  import {
    Row,
    Col,
    Popover,
    Message,
  } from 'element-ui';
  Vue.use(Row)
  Vue.use(Col)
  Vue.use(Popover)
  export default {
    name: 'top',
    data() {
      return {
        headImgUrl: '',
        loginName: '',
        contacts: '',
        loading: false,
        closepopover: false,
        closePopover: false,
        pageSize: 5,
        pageNumber: 1,
        clientInfo: {},
        sysMessage: [],
        badge: 0,
      }
    },
    computed: {
      ...mapGetters([
        'ichannel',
        'jurisdiction'
      ])
    },
    methods: {
      ...mapActions([
        'userReset',
        'jurisdictionReset',
        'getJurisdiction',
        'getIchannel'
      ]),
      hideBadge() {
        this.badge = 0;
      },
      readMessage(messageIds) {
        let query = {
          messageIds: messageIds
        }
        axios.post('/notice/notice/readMessage', query)
          .then(res => {})
          .catch(err => {
            this.$message.error({
              message: err.response ? err.response.data : err
            });
          })
      },
      queryMessage() {
        let data = {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize
        }
        this.loading = true;
        axios.post('/notice/notice/queryMessage', data).then(res => {
          this.total = res.data.amount;
          this.badge = res.data.amount;
          let msgList = res.data.beanList;
          let msg = [];
          if (msgList.length) {
            for (var i = 0; i < msgList.length; i++) {
              let time = msgList[i].sysMessage.createTime;
              let moduleId = msgList[i].sysMessage.moduleId;
              let moduleName = this.$store.state.enumSet.moduleName[moduleId];
              let status = msgList[i].sysMessage.status;
              let msgTitle = '';
              let msgTitleN = '';// 此消息标题用于弹窗，跟列表格式不一样
              let msgType = 'success';// 弹窗类型
              let icon = '';
              let link = '';
              let path = '';
              let query = '';
              if (status === 0) {
                msgTitle = moduleName + '失败';
                msgType = 'error';
                switch (moduleId) {
                  case 130401:
                    msgTitle = '失效';
                    icon = 'el-icon-warning waring'
                    link = '重新授权'
                    break;
                  case 110101:
                    msgTitle = '失败';
                    icon = 'el-icon-circle-cross iconError';
                    link = '重新同步';
                    path = '/production';
                    query = '0'
                    break;
                  default:
                    msgTitle = '失败';
                    icon = 'el-icon-circle-cross iconError'
                }
              } else {
                msgTitle = moduleName + '成功';
//                  供应商接受邀请
                if (moduleId === 130102) {
                  icon = 'el-icon-circle-check iconSuccess';
                  link = '查看详情';
                  path = '/supplierList';
                  query = '1'
//                  邀请供应商
                } else if (moduleId === 130101) {
                  icon = 'el-icon-information information';
                  link = '查看详情';
                  path = '/supplierList';
                  query = '1'
//                  邀请渠道商
                } else if (moduleId === 130103) {
                  icon = 'el-icon-information information';
                  link = '查看详情➔';
                  path = '/myChannel';
                  query = '1';
//                  渠道商接受邀请
                } else if (moduleId === 130104) {
                  icon = 'el-icon-circle-check iconSuccess';
                  link = '查看详情';
                  path = '/myChannel';
                  query = '1';
//                  欠费提醒
                } else if (moduleId === 100101) {
                  icon = 'el-icon-warning waring';
                  link = '联系客服';
                } else {
                  msgTitle = '成功';
                  icon = 'el-icon-circle-check iconSuccess'
                  switch (moduleId) {
//                      导入订单
                    case 150100:
                      link = '查看待审核订单';
                      path = '/order';
                      query = '7'
                      break;
//                      订单导出
                    case 150101:
                      link = '去下载➔';
                      path = '/taskcenter'
                      query = 'orderExport'
                      break;
//                      发货单导入
                    case 150102:
                      link = '查看已发货订单';
                      path = '/order';
                      query = '3';
                      break;
//                      同步商品
                    case 110101:
                      link = '去关联';
                      path = '/production'
                      query = '2'
                      break;
//                      商品导出
                    case 110103:
                      link = '去下载';
                      path = '/taskcenter';
                      query = 'prodExport';
                      break;
//                      导出账单
                    case 160101:
                      link = '去下载';
                      path = '/taskcenter';
                      query = 'accountExport'
                      break;
                  }
                }
              }
              let msgDetails = msgList[i].sysMessageDetails;
              let _me = this;
              let content = '';
              let mlength = msgDetails.length;
              for (var j = 0; j < mlength; j++) {
                content += msgDetails[j].content;
                (function(mlength, j) {
                  setTimeout(function() {
                    let msgContent = msgDetails[j].content;
                    _me.$notify({
                      title: msgTitleN,
                      message: msgContent,
                      type: msgType,
                      duration: 0,
                      offset: 75,
                      onClose: _me.readMessage([msgDetails[j].messageId])
                    });
                  }, 3000)
                })(mlength, j)
              }
              msg.push({
                moduleName: moduleName,
                content: content,
                time: time,
                msgTitle: msgTitle,
                status: status,
                icon: icon,
                link: link,
                path: path,
                query: query
              })
            }
          }
          this.sysMessage = msg;
          this.loading = true;
        }).catch(err => {
          this.loading = true;
          this.$message.error({
            message: err.response ? err.response.data : err
          });
        })
      },
      historyInfo() {
        this.closePopover = false;
        this.$router.push({path: '/infoCenter'});
      },
      changeRouter(path, data) {
        this.closePopover = false;
        this.$router.push({
          path: path,
          query: {
            data: data
          }
        })
      },
      goHelp() {
        window.open('https://i.xiaoyatong.com/Help.html')
      },
      goPrintHelp() {
        window.open('https://i.xiaoyatong.com/Help.html#/HelpDetail?infoId=100000001167')
      },
      logout() {
        axios.post('/noLogin/operLogin/logout').then(res => {
          if (res.data === 'success') {
            var menu = window.sessionStorage.menuEnum;
            window.sessionStorage.clear();
            window.sessionStorage.menuEnum = menu;
            this.closepopover = false;
            this.delCookie('loginName');
            this.userReset();
            this.jurisdictionReset();
            window.Esource && window.Esource.close();
            this.$router.push('/login');
          }
        }).catch(err => {
          Message.error({
            message: err.response ? err.response.data : err
          })
        })
      },
      getCookie(name) {
        let arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
        if (arr !== null) return decodeURI(arr[2]);
        return null;
      },
      delCookie(name) {
        let exp = new Date();
        exp.setTime(exp.getTime() - 1);
        let cval = this.getCookie(name);
        if (cval !== null) {
          document.cookie = name + '=' + cval + ';path=/;expires=' + exp.toUTCString();
        }
      },
      queryTenantInfo(loginName) {
        let query = {};
        axios.post('/customer/tenantInfo/getCurrentTenant', query).then(res => {
          if (res.data.contacts) {
            this.contacts = res.data.contacts;
          }
        }).catch(() => {
          Message.error({
            message: '查询租户信息失败'
          })
        })
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
    created() {
      this.loginName = this.getCookie('loginName');
      // this.queryTenantInfo(this.loginName);
      let _self = this;
      this.getJurisdiction(_self);
      this.$store.dispatch('setSupplierEnum');
      this.$store.dispatch('setAllRoleIds');
      this.$store.dispatch('setChannelEnum');
    },
    mounted() {
      this.queryMessage();
      // if (!this.interval) {
      //   this.interval = window.setInterval(() => {
      //     this.queryMessage();
      //   }, 1000 * 60 * 1);
      // }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import '../main.less';

  .top {
    height: 65px;
    opacity: 100%;
    display: flex;
    justify-content: space-between;
    background-color: #324057;
  }

  .noInfo {
    padding-top: 20px;
    color: @darkGary;
    text-align: center;

  .icon {
    font-size: 30px;
  }

  }

  .logo {
    height: 65px;
    min-width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  a:link {
    text-decoration: none;
    color: #000;
  }

  a:hover {
    color: #000;
  }

  .newInfo {
    background-color: #3B4A61;
    width: 700px;
    height: 35px;
    line-height: 15px;
    margin-top: 15px;
    margin-left: 10px;
    font-size: 14px;
    padding: 7px 10px;
    color: #fff;

  .icon {
    vertical-align: middle;
    font-size: 28px;
    margin-left: 15px;
  }

  span {
    cursor: pointer;
    color: #65AFFF;
  }

  }
  .logo img {
    width: 41px;
    height: 38px;
    margin-left: 15px;
  }

  .service {
    min-width: 388px;
    color: #99A9BF;
    flex-grow: 1;
    text-align: right;
  }

  .icondiv {
    line-height: 65px;

  .icon {
    font-size: 25px;
    vertical-align: middle;
    margin-right: 30px;
    cursor: pointer;

  &:hover {
    color: #fff;
  }

  }
  }

  /*.online {*/
  /*margin-left: 20px;*/
  /*cursor: pointer;*/
  /*}*/

  .userhead {
    width: 32px;
    height: 32px;
    line-height: 32px;
    float: right;
    margin-top: 17px;
    margin-left: 3px;
    border-radius: 16px;
    overflow: hidden;
  }

  .userinfo {
    height: 35px;
    /*line-height: 65px;*/
    float: right;
    margin: 15px 15px 0 10px;
    text-align: left;
  }

  .orderMessage {

    padding-bottom: 10px;
    border-bottom: 1px solid @gary;

  .el-popover {
    padding: 0 10px 10px 10px;
  }

  .title {
    display: flex;
    justify-content: flex-start;

  i {
    position: relative;
    top: 12px;
    padding-right: 5px;
    font-size: 16px;
  }

  .iconSuccess {
    color: @successGreen;
  }

  .iconError {
    color: @dangerRed;
  }

  .warning {
    color: @warning;
  }

  .information {
    color: @primaryBlue;
  }
  }

  .order {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    padding-bottom: 5px;

  .name {
    font-size: @fontSize14;
  }

  .date {
    color: @lightBlack;
    font-size:@baseFont;
  }
  }
  .success {
    font-size:@baseFont;
    color: @successGreen;
  }

  .error {
    font-size:@baseFont;
    color: @dangerRed;
  }
  .content {
    padding-top: 5px;
    font-size:@baseFont;
  }
  .link {
    display: inline-block;
    font-size: @baseFont;
    padding-top: 5px;
    cursor: pointer;
    text-decoration: underline;
    color: @btnhoverBg;
  }
  }
  .btn {
    text-align: center;
    padding-top: 20px;
  }

  /*.vipinfo {*/
  /*flex-basis: 185px;*/
  /*height: 100%;*/
  /*font-size: 12px;*/
  /*background-color: #3B4A61;*/
  /*margin-left: 20px;*/
  /*}*/

  /*.vipinfo div {*/
  /*margin-right: 20px;*/
  /*text-align: right;*/
  /*position: relative;*/
  /*top: 25%;*/
  /*}*/

  .softname {
    font-size: 20px;
    color: #FFFFFF;
  }

  .version {
    font-size: 10px;
    color: #C0CCDA;
  }

  .productTitle {
    padding-left: 5px;
  }

  .info {
    width: 80%;
    height: 60px;
    margin-top: 20px;
    text-align: center;
    white-space: nowrap;
  }

  .info i {
    margin-left: 40px;
  }

  .servicetime {
    width: 180px;
    background-color: #d3dce6;
    border-radius: 20px;
    text-align: center;
  }

  .phoneno {
    margin-top: 10px;
    border-bottom: solid 1px #d3dce6;
    padding: 0px 0 8px 0;
    text-align: center;
  }

  .zhanghaoshezhi {
    height: 33px;
    text-align: left;
    border-bottom: solid 1px #d3dce6;
    padding: 0px 0 8px 0;
  }

  .tuichudenglu {
    height: 23px;
    margin-top: 10px;
  }

  .acolor {
    color: #324057;
    text-decoration: none;
  }

  .vipinfo a:link,
  .vipinfo a:visited,
  .acolor a:hover,
  .acolor a:active {
    color: #4A90E2;
    text-decoration: none;
  }
</style>
<style lang="less">
.top {
  .el-badge__content.is-fixed {
    top: 0;
    right: 10px;
    position: absolute;
    transform: translateY(50%) translateX(-50%);
  }
  .el-badge__content {
    border: 0px;
  }
}
</style>
