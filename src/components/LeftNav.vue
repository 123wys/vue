<template>
  <div class="left-nav" :style='{minHeight:navHeight + "px"}' v-loading="loading" element-loading-text="宙斯盾权限验证">
    <el-menu :default-active="active" :router=true theme="dark" :default-openeds="opens" :style='{height:(navHeight-100) + "px"}' @mousewheel.native='scrollEvent' @DOMMouseScroll.native="scrollEvent" ref='menux'>
      <template v-for="(nav, i) in navs">
        <transition-group name="slide" tag="div">
          <el-submenu v-if="nav.submenus && notShow(nav.unshow,nav.entityId,nav.to)" :index="nav.index" :key="nav.index" ref="menu" mode="vertical">
            <template slot="title"><i :class="nav.icon" style="margin-right:8px"></i>{{nav.name}}</template>
            <el-menu-item v-for="submenu in nav.submenus" :index="submenu.subto" :key="submenu.subto" v-if='notShow(submenu.unshow,submenu.entityId,submenu.subto)'>
              <!-- @click.native="changeTitle(submenu.subname)" -->
              <span v-text="submenu.subname"></span>
            </el-menu-item>
          </el-submenu>
          <!-- <el-menu-item v-else :index="nav.to" :route="nav.route" @click.native="changeTitle(nav.name)"> -->
          <el-menu-item v-if="!nav.submenus && notShow(nav.unshow,nav.entityId,nav.to)" :index="nav.to" :key="nav.to" :route="nav.route" class='single-menu'>
            <i :class="nav.icon"></i><span v-text="nav.name" class="margin-left8"></span>
          </el-menu-item>
        </transition-group>
      </template>
    </el-menu>
  </div>
</template>
<script>
import Vue from 'vue'
import throttle from 'lodash/throttle'
import {
  mapGetters,
  mapActions,
} from 'vuex'
import {
  Menu,
  MenuItem,
  Submenu,
  Card,
} from 'element-ui'
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Card)
export default {
  name: 'left-nav',
  data() {
    return {
      loading: false,
      //  允许访问的路径
      pathArr: ['/editInvoice'],
      //  菜单路径 系统中所有路由路径数组
      menuPath: [],
      //  账号拥有权限--entityId实体数组
      currentPrivilege: [1504],
      //  当前账号privilege 存储privId
      privilegeArr: [],
      //  菜单权限枚举
      privilegeEnum: [],
      //  entityId-路径 映射
      mapPath: {
        1001: '/',
        1301: '',
        1304: '/shop',
        1302: '/supplier',
        1303: '/myChannel',
        // 1305: '/storehouse',
        1101: '/production',
        1201: '',
        1202: '/order',
        1203: '/errororder',
        // 1204: '/orderimported',
        1205: '/undisorder',
        1206: '/deadorder',
        1401: '',
        1402: '/realtimestock',
        1403: '/inoutstock',
        1404: '/warehouse',
        1405: '/warehouseprod',
        1501: '',
        1502: '/aftersaleentrance',
        1503: '/aftersalemanagement',
        1504: '/editInvoice',
        1601: '',
        1602: '/finance',
        1603: '/financeRule',
        1604: '/freeReport',
        1701: '/dataCenter',
        1801: '/appCenter',
        1901: '/callCenter',
        2001: '',
        2002: '/system',
        2003: '/role',
        2101: '/taskcenter',
        2201: '',
        2202: '/customer',
        2203: '/groupRule'
      },
      opens: ['orderMenu'],
      active: '',
      navHeight: 200,
      navs: [{
        icon: 'icon iconfont icon-home',
        name: '首页',
        to: '/index',
        entityId: 1001
      }, {
        icon: 'icon iconfont icon-hulianwang',
        name: '企业互联',
        to: '',
        entityId: 1301,
        index: 'comconnection',
        submenus: [{
          subname: '我的店铺',
          subto: '/shop',
          entityId: 1304
        }, {
          subname: '我的供应商',
          subto: '/supplierList',
          // unshow: 1,
          entityId: 1302
        }, {
          subname: '我的渠道商',
          subto: '/myChannel',
          entityId: 1303
        }
        // , {
        //   subname: '我的仓库',
        //   subto: '/storehouse',
        //   entityId: 1305
        // }
        ]
      }, {
        icon: 'icon iconfont icon-baihuogouwu1',
        name: '商品管理',
        to: '/production',
        entityId: 1101,
        // unshow: 1 //  tenantType为0显示 否则不显示
      }, {
        icon: 'icon iconfont icon-dingdanguanli1',
        name: '订单管理',
        to: '',
        entityId: 1201,
        index: 'orderMenu',
        submenus: [{
          subname: '所有订单',
          subto: '/order',
          entityId: 1202
        }, {
        //   subname: '待分发订单',
        //   subto: '/undisorder',
        //   entityId: 1205,
        //   unshow: 1
        // }, {
          subname: '有问题订单',
          subto: '/errororder',
          entityId: 1203,
          // unshow: 1,
        // }, {
        //   subname: '导入记录',
        //   subto: '/orderimported',
        //   entityId: 1204,
        // }, {
        //   subname: '缺SKU订单',
        //   subto: '/deadorder',
        //   entityId: 1206,
        //   unshow: 1
        }]
      },
      {
        icon: 'icon iconfont icon-kucun',
        name: '库存管理',
        to: '',
        entityId: 1401,
        index: 'stock',
        submenus: [{
          subname: '实时库存',
          subto: '/realtimestock',
          entityId: 1402,
        }, {
          subname: '出入库',
          subto: '/inoutstock',
          entityId: 1403,
        }, {
          subname: '仓库商品',
          subto: '/warehouseprod',
          entityId: 1405,
        }, {
          subname: '我的仓库',
          subto: '/warehouse',
          entityId: 1404,
        }]
      },
      {
        icon: 'icon iconfont icon-101',
        name: '售后管理',
        to: '',
        entityId: 1501,
        index: 'afterSale',
        submenus: [{
          subname: '售后单管理',
          subto: '/aftersalemanagement',
          entityId: 1503
        }, {
          subname: '新建售后',
          subto: '/aftersaleentrance',
          entityId: 1502
        }, {
          subname: '补开发票',
          subto: '/editInvoice',
          entityId: 1504
        }]
      },
      {
        icon: 'icon iconfont icon-fcstubiao09',
        name: '客户管理',
        to: '',
        entityId: 2201,
        index: 'customerCenter',
        submenus: [{
          subname: '客户列表',
          subto: '/customer',
          entityId: 2202
        }, {
          subname: '分组规则',
          subto: '/groupRule',
          entityId: 2203
        }]
      },
      {
        icon: 'icon iconfont icon-jiesuanguanli',
        name: '财务结算',
        to: '',
        entityId: 1601,
        index: 'finance',
        // unshow: 1, //  tenantType为0显示 否则不显示
        submenus: [{
          subname: '财务对账',
          subto: '/finance',
          entityId: 1602
        }, {
          subname: '快速对账',
          subto: '/freeReport',
          entityId: 1604
        }
        // {
        //   subname: '结算规则',
        //   subto: '/financeRule',
        //   entityId: 1603
        // }
        ]
      },
      {
        icon: 'icon iconfont icon-data-one',
        name: '数据中心',
        to: '',
        entityId: 1701,
        index: 'dataCenter',
        // unshow: 1, //  tenantType为0显示 否则不显示
        submenus: [{
          subname: '订单分析',
          subto: '/orderAnalysis',
          entityId: 1702
        }, {
          subname: '商品分析',
          subto: '/productAnalysis',
          entityId: 1703
        }]
      },
      // {
      //   icon: 'icon iconfont icon-mokuaixianxing',
      //   name: '应用中心',
      //   to: '/appCenter',
      //   entityId: 1801
      // }, {
      //   icon: 'icon iconfont icon-icon121',
      //   name: '客服中心',
      //   to: '/callCenter',
      //   entityId: 1901
      // },
      {
        icon: 'icon iconfont icon-renwuzhongxin',
        name: '任务中心',
        to: '/taskcenter',
        entityId: 2101
      },
      {
        icon: 'icon iconfont icon-xitongguanli1',
        name: '系统管理',
        to: '/sysmgnt',
        entityId: 2001
        // index: 'systemMenus',
        // submenus: [{
        //   subname: '用户管理',
        //   subto: '/system',
        //   entityId: 2002
        // }, {
        //   subname: '角色管理',
        //   subto: '/role',
        //   entityId: 2003
        // }]
      }]
    }
  },
  created() {
    this.loading = true;
    this.menuPath = [...new Set(Object.values(this.mapPath))];
    this.navHeight = parseInt(window.innerHeight);
    //  先获取枚举在获取用户当前权限
    this.getMenus().then(data => {
      this.setPrivilege().then(() => {
        for (var i = this.privilege.length - 1; i >= 0; i--) {
          for (var j = this.privilegeEnum.length - 1; j >= 0; j--) {
            if (this.privilegeEnum[j].privId === this.privilege[i]) {
              this.currentPrivilege.push(this.privilegeEnum[j].entityId);
              this.pathArr.push(this.mapPath[this.privilegeEnum[j].entityId]);
              //  如果当前菜单为二级菜单，则把一级菜单也添加到current里面
              if (this.privilegeEnum[j].entityType) {
                this.currentPrivilege.push(this.privilegeEnum[j].entityType);
              };
            }
          }
        }
        //  去除重复的entityType
        this.currentPrivilege = [...new Set(this.currentPrivilege)];
        this.loading = false;
      })
    }).catch(err => {
      this.loading = false;
      this.$message({
        message: '操作失败，' + (err.response ? err.response.data : err),
        type: 'error',
      })
    });
    this.active = window.location.hash.slice(1);
  },
  computed: {
    ...mapGetters([
      'ichannel'
    ]),
    privilege() {
      return this.$store.state.enumSet.privilege;
    }
  },
  mounted() {
    var icons = document.querySelectorAll('.el-icon-arrow-down');
    for (let i = 0, len = icons.length; i < len; i++) {
      icons[i].className = 'el-submenu__icon-arrow el-icon-caret-bottom';
    }
    let _self = this;
    window.addEventListener('resize', throttle(function() {
      _self.navHeight = parseInt(window.innerHeight);
    }, 1000), false);
  },
  methods: {
    ...mapActions([
      'setPrivilege'
    ]),
    scrollEvent(event) {
      //  滚动高度  页面高度 可视区域高度
      var scrollTop = this.$refs.menux.$el.scrollTop;
      var scrollHeight = this.$refs.menux.$el.scrollHeight;
      var height = this.$refs.menux.$el.clientHeight;
      var delta = event.wheelDelta;
      if ((delta < 0 && scrollHeight - scrollTop - height <= 10)) {
        this.$refs.menux.$el.scrollTop = scrollHeight - height;
        event.preventDefault();
      }
      if ((delta > 0 && scrollTop <= 10)) {
        this.$refs.menux.$el.scrollTop = 0;
        event.preventDefault();
      }
    },
    //   获取菜单权限枚举
    getMenus() {
      return new Promise((resolve, reject) => {
        if (window.sessionStorage && window.sessionStorage.menuEnum) {
          this.privilegeEnum = JSON.parse(window.sessionStorage.menuEnum);
          resolve();
        } else {
          let query = {
            type: 1,
            queryCondition: {
              privType: 1
            },
            pageNumber: 1,
            pageSize: 1000
          }
          this.axios.post('/sysmgnt/privilege/selectSysPrivileges', query).then(res => {
            this.privilegeEnum = res.data.beanList;
            window.sessionStorage.menuEnum = JSON.stringify(res.data.beanList);
            resolve();
          }).catch(err => {
            reject(err);
          })
        }
      });
    },
    //  如果unshow等于当前用户的tenantType则不予以显示
    notShow(unshow, entityId, path) {
      //  如果tenantType为0（渠道商）则显示 否则不显示
      if (unshow === 1 && this.ichannel.tenantInfo.tenantType) {
        return false;
      } else {
        if (this.currentPrivilege.includes(entityId)) {
          return true;
        } else {
          return false;
        }
      }
    }
  },
  watch: {
    '$route.path' (val) {
      // 属于菜单路径 但pathArr中却没有该菜单路径 则重定向到index页面
      if (this.menuPath.includes(val)) {
        if (!this.pathArr.includes(val)) {
          this.$router.push('/index');
        }
      }
      this.active = val
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '../main.less';
.left-nav {
  transition: all .8s;
}

.left-nav .el-menu {
  // margin-top: 10px;
}

.left-nav .icon {
  vertical-align: 0em;
}
.left-nav .el-menu{
  overflow-y: scroll;
  width: 170px;
}
</style>
<style lang="less">
@import '../main.less';
.left-nav .el-submenu.is-opened>.el-submenu__title .el-submenu__icon-arrow {
  transform: rotateZ(180deg) scale(0.5);
}

.el-submenu__icon-arrow {
  transform: scale(0.5);
}

.left-nav .el-submenu__title,
.left-nav .el-menu-item {
  height: 36px;
  line-height: 36px;
  color: @lightGary;
  background-color: @leftmenuBg;
}

.left-nav .is-active {
  color: @btnhoverBg!important;
}

.left-nav .el-menu-item:hover {
  color: @btnhoverBg!important;
  background: @leftmenuBg!important;
}

.left-nav .el-submenu__title:hover {
  color: @btnhoverBg!important;
  background: @leftmenuBg!important;
}

.left-nav > .el-menu>.el-menu-item,
.left-nav .el-submenu {
  border-bottom: 1px solid @baseGary;
}

.left-nav .el-submenu .el-menu-item:first-child {
  border-top: 1px solid @baseGary;
}

.left-nav .el-menu {
  background: @leftmenuBg!important;
}

.left-nav .el-submenu .el-menu-item {
  padding-left: 15px!important;
  margin-left: 30px;
}
.single-menu{
  border-bottom: 1px solid @baseGary;
}
.left-nav .el-loading-mask {
  background-color: rgba(0, 0, 0, 0.5)
}
.el-submenu{
  width: 150px!important;
}
</style>
