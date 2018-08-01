<template>
  <div id="operation">
    <top id="top"></top>
    <div class="margen-white" id="left-nav">
      <left-nav></left-nav>
    </div>
    <div class="margen-white" id="right-content">
      <transition :name="transitionName" mode="out-in">
        <keep-alive>
          <router-view :key="$route.fullPath" :style="contentStyle"></router-view>
        </keep-alive>
      </transition>
      <footer class="footer">
        <div><img :src="logo"></div>
        <div>小亚通，专注社群电商的智能分发系统</div>
      </footer>
    </div>
    <toolbox></toolbox>
  </div>
</template>
<script>
// import {
//   baseUrl
// } from '../assets/baseUrl'
import throttle from 'lodash/throttle';
import Top from './Top';
import LeftNav from './LeftNav';
import Toolbox from './Toolbox';
import axios from 'axios';
import logo from '../assets/img/logo.png'
import {
  mapGetters,
  mapActions
} from 'vuex'
let checkloginUrl = '/noLogin/operLogin/checklogin';
export default {
  name: 'operation',
  data() {
    return {
      transitionName: 'slide',
      contentStyle: '',
      logo,
      interval: '',
      pageNumber: 1,
    }
  },
  beforeRouteEnter(to, from, next) {
    axios.post(checkloginUrl).then(response => {
      if (response.data === 'nologin') {
        next('/login');
      } else {
        next();
      }
    }).catch(() => {
      next('/login');
    })
  },
  components: {
    Top,
    LeftNav,
    Toolbox,
  },
  computed: {
    ...mapGetters([
      'ichannel'
    ])
  },
  methods: {
    ...mapActions([
      // 'setLogisticsCompanyEnum',
      'getIchannel',
      'setOperatorEnum',
      'setRepositoryEnum',
      'setShopEnum',
      'setAllShopInfo',
      'setEntityWmsTypeEnum',
    ]),
    resetHeight() {
      let winHeight = document.documentElement.clientHeight;
      this.contentStyle = {
        minHeight: (winHeight - 65 - 65 - 3) + 'px', // 减去top栏和log栏
      }
    },
    // readMessage(messageIds) {
    //   let query = {
    //     messageIds: messageIds
    //   }
    //   axios.post('/notice/notice/readMessage', query)
    //     .then(res => {})
    //     .catch(err => {
    //       this.$message.error({
    //         message: err.response ? err.response.data : err
    //       });
    //     })
    // },
    // queryMessage() {
    //   let query = {
    //     pageNumber: this.pageNumber,
    //     pageSize: 1
    //   }
    //   axios.post('/notice/notice/queryMessage', query)
    //     .then(res => {
    //       let msgList = res.data.beanList;
    //       // let messageIds = [];
    //       for (let i = 0; i < msgList.length; i++) {
    //         let msg = msgList[i].sysMessage;
    //         let moduleId = msg.moduleId;
    //         let status = msg.status;
    //         let moduleName = this.$store.state.enumSet.moduleName[moduleId];
    //         let msgTitle = '';
    //         let msgType = 'success';
    //         if (status === 0) {
    //           msgTitle = moduleName + '失败';
    //           msgType = 'error';
    //         } else {
    //           msgTitle = moduleName + '成功';
    //         }
    //         let msgDetails = msgList[i].sysMessageDetails;
    //         var _me = this;
    //         let mlength = msgDetails.length;
    //         for (var j = 0; j < mlength; j++) {
    //           (function(mlength, j) {
    //             setTimeout(function() {
    //               let msgDetail = msgDetails[j];
    //               // messageIds.push(msgDetails[j].messageId);
    //               let msgContent = msgDetail.content;
    //               _me.$notify({
    //                 title: msgTitle,
    //                 message: msgContent,
    //                 type: msgType,
    //                 duration: 0,
    //                 offset: 75,
    //                 onClose: _me.readMessage([msgDetails[j].messageId])
    //               });
    //             }, 3000)
    //           })(mlength, j)
    //         }
    //       }
    //       // if (messageIds.length > 0 && messageIds.length >= msgList.length) {
    //       //   this.readMessage(messageIds);
    //       // }
    //     })
    //     .catch(err => {
    //       this.$message.error({
    //         message: err.response ? err.response.data : err
    //       });
    //     })
    // }
  },
  watch: {
    '$route' (to, from) {
      if (to.path === '/help' || to.path === '/supportCenter') {
        this.transitionName = 'bounce';
      } else {
        this.transitionName = 'slide';
      };
    }
  },
  created() {
    var _self = this;
    // this.setLogisticsCompanyEnum();
    this.setOperatorEnum();
    this.setRepositoryEnum();
    this.setShopEnum();
    this.getIchannel(_self);
    this.setAllShopInfo();
    this.setEntityWmsTypeEnum();
  },
  mounted() {
    // if (!this.interval) {
    //   this.interval = window.setInterval(() => {
    //     this.queryMessage();
    //   }, 1000 * 30);
    // }
    this.resetHeight();
    window.addEventListener('resize', throttle(() => {
      this.resetHeight();
    }, 200));
    // if (window.EventSource) {
    //   var source = new window.EventSource(baseUrl + 'events', {withCredentials: true});
    //   console.log(source.withCredentials);
    //   var _self = this;
    //   window.Esource = source;
    //   source.onmessage = function(event) {
    //     if (event.data === 'init') {
    //       console.log('服务端推送准备完成');
    //     } else {
    //       _self.$notify({
    //         title: '通知',
    //         message: event.data,
    //         type: 'warning',
    //         duration: 0,
    //         offset: 100
    //       });
    //     }
    //   };
    // } else {
    //   console.log('您的浏览器不支持服务器推送!')
    // }
  }
}
</script>
<style lang="less">
@import '../main.less';
body {
  background: @pageBg;
}


/** 面包削 start**/

.breadcrumb-head {
  float: left;
  color: @lightGary;
  margin-bottom: 10px;
}

.el-breadcrumb__item__inner,
.el-breadcrumb__item__inner a {
  color: @primaryBlue;
}


/** 面包削 end**/


/**当前组件**/

#top {
  position: fixed;
  width: 100%;
  min-width: 1000px;
  z-index: 100;
}

#left-nav {
  margin-top: 64px;
  width: 150px;
  position: fixed;
  background-color: @leftmenuBg;
  z-index: 100;
  overflow: hidden;
}

#right-content {
  width: 100%;
  min-width: 900px;
  padding-top: 64px;
  padding-left: 150px;
  position: relative;
  overflow: hidden;
}

#app .el-tabs__item,
#app .el-menu-item {
  font-size: 14px;
}

.footer {
  color: @lightGary;
  text-align: center;
  margin-bottom: @baseSpace*2;
  img {
    width: 40px;
    height: 36px;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all .5s
}

.slide-enter,
.slide-leave-active {
  opacity: 0;
  transform: translateX(10px);
}

.bounce-enter-active {
  animation: bounce-in 1s;
}

.bounce-leave-active {
  animation: bounce-out 0.5s;
}

@keyframes bounce-in {
  0% {
    // transform: translate(50%, -50%) scale(0);
    transform: scale(0);
    opacity: 0;
  }
  100% {
    // transform: translate(0px, 0px) scale(1);
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounce-out {
  0% {
    // transform: translate(0px, 0px);
    transform: scale(1);
    opacity: 1;
  }
  100% {
    // transform: translate(-100%, 100%);
    transform: scale(0);
    opacity: 0;
  }
}


/**当前组件 end**/
</style>
