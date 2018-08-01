<template>
  <div class="my-channel">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>企业互联</el-breadcrumb-item>
      <el-breadcrumb-item>我的渠道商</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <template v-if='!showB && first'>
      <loadNull text='暂无渠道商'></loadNull>
    </template> -->
    <!-- <template v-if='showB || (!showB && !first)'> -->
    <template>
      <el-input placeholder="输入商家名称" size='small' v-model.trim="enterpriseTitle"  @keyup.enter.native="searchChannel()">
        <template slot="append">
          <el-button @click="searchChannel()">搜索供应商</el-button>
        </template>
      </el-input>
      <div class="nav_right"><span class="invite_icon" @click="invite()"><i class="icon iconfont icon-yaoqingqudaoshang yaoqing"></i>邀请渠道商</span></div>
      <!-- <div class="search">
        <el-input v-model="enterpriseTitle" placeholder="商家名称" class='search-input' size='small' @keyup.native.13='searchChannel' style='width:288px;'></el-input>
        <el-button type="primary" size='small' class='search-btn' @click='searchChannel'>搜索商家</el-button>
      </div> -->
      <div class="content-box">
        <template>
          <el-table key='a' :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中" class="list-complete-item">
            <searchNull slot="empty" v-if='!showB'></searchNull>
            <el-table-column prop="enterpriseTitle" label="商家名称" width="200">
              <template scope="scope">
                <div style="padding:10px 0 10px 0">
                  <div>{{scope.row.enterpriseTitle}}</div>
                  <div class="type">
                    <span v-if='scope.row.tenantType == 0 '>渠道商</span>
                    <span v-if='scope.row.tenantType == 1 '>供应商</span>
                    <span v-if='scope.row.tenantType == 2 '>渠道商、供应商</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="联系人" width="200">
              <template scope="scope">
                <div style="padding:10px 0 10px 0">
                  <div>{{scope.row.contacts}}</div>
                  <div>{{scope.row.mobile}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="地址">
              <template scope="scope">
                <div style="padding:10px 0 10px 0">
                  <div>{{scope.row.locProvince}}&nbsp{{scope.row.locCity}}&nbsp{{scope.row.locDistrict}}&nbsp{{scope.row.locAddress}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="inviteTime" label="邀请时间" sortable>
            </el-table-column>
            <el-table-column label="状态" width="100" sortable>
              <template scope="scope">
                <div>
                  <div v-if='scope.row.assocStatus == -1' class="no-cooperate">未合作</div>
                  <div v-if='scope.row.assocStatus == 0' class="pending">待处理</div>
                  <div v-if='scope.row.assocStatus == 1' class="cooperate">已合作</div>
                  <div v-if='scope.row.assocStatus == 2' class="rejected">已拒绝</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width='180'>
              <template scope='scope'>
                <el-popover ref="popover" placement="top" width="250">
                  <div class="accept-top">
                    <el-button size="mini" @click.native.prevent="cancel" type="text" icon="close" style='color:#99a98f'></el-button>
                  </div>
                  <div class="accept-box">
                    <div class="accept-left">
                      <i class="icon iconfont icon-zhucechenggong"></i>
                    </div>
                    <div class="accept-right">
                      <p class="channel-sure">确定接受邀请？</p>
                      <p class='channel-selected-name'>渠道商:{{scope.row.enterpriseTitle}}</p>
                    </div>
                  </div>
                  <div style="text-align: right; margin: 0;">
                    <el-button size="mini" @click.native.prevent="cancel">取消</el-button>
                    <el-button type="primary" size="mini" @click.native.prevent="acceptChannel(scope.row)">确定</el-button>
                  </div>
                </el-popover>
                <el-button v-popover:popover size="small" type='primary' v-if='scope.row.assocStatus === 0 && scope.row.applyTenantId !== jurisdiction.tenantId'>接受邀请</el-button>
                <el-button size="small" class='detail' @click.native.prevent='goDetail(scope.row)'>详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination key='d' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" class='pagination list-complete-item' layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </template>
      </div>
    </template>
  </div>
</template>
<script>
import loadNull from './loadNull.vue'
import {
  mapGetters,
  mapActions
} from 'vuex'
import debounce from 'lodash/debounce'
export default {
  name: 'my-channel',
  components: {
    loadNull,
  },
  data() {
    return {
      first: true,
      showB: false,
      searchStatus: false,
      loading: false,
      enterpriseTitle: '',
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      nextNum: 10
    }
  },
  beforeRouteEnter(to, from, next) {
    next();
    // next(vm => {
    //   console.log(vm.nextNum);
    // });
  },
  mounted() {},
  activated() {
    this.getChannel();
  },
  computed: {
    ...mapGetters([
      'channelList',
      'jurisdiction'
    ])
  },
  methods: {
    ...mapActions([
      'setChannelList'
    ]),
    //  详情跳转
    goDetail(row) {
      window.sessionStorage.channel = JSON.stringify(row);
      this.$router.push({
        path: '/channelDetail',
        query: {
          tenantId: row.tenantId,
          origin: 'myChannel'
        }
      });
    },
    //  查询渠道商
    searchChannel: debounce(function() {
      this.first = false;
      this.searchStatus = true;
      this.getChannel();
    }, 1000, {
      leading: true,
      trailing: false
    }),
    cancel() {
      document.body.click();
    },
    //  接受渠道商
    acceptChannel(row) {
      var _self = this;
      var data = {
        assocStatus: 1,
        partnerTenantId: row.tenantId
      }
      this.axios.post('/customer/tenantInfo/approvalPartner', data).then(function(response) {
        _self.$message({
          message: '恭喜你，接受邀请成功',
          type: 'success'
        });
        row.assocStatus = 1;
        document.body.click();
      }).catch(function(error) {
        _self.$message.error(error.response.data);
        document.body.click();
      });
      console.log(data);
    },
    //  获取渠道商列表
    getChannel() {
      var _self = this;
      _self.loading = true;
      let data = {
        queryCondition: {
          enterpriseTitle: this.enterpriseTitle,
          // tenantType: [0, 2],
          assocStatus: [0, 1],
          querySupplier: 0
        },
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      };
      this.axios.post('/customer/tenantInfo/queryTenant', data).then(function(response) {
        _self.total = response.data.amount;
        _self.tableData = response.data.beanList;
        //  如果列表不为空 则showB = true;
        if (!response.data.beanList.length) {
          _self.showB = false;
        } else {
          _self.showB = true;
        }
        _self.loading = false;
      }).catch(function(error) {
        _self.loading = false;
        _self.$message.error(error.response.data);
      });
    },
    //  分页尺寸变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.getChannel();
      console.log(`每页 ${val} 条`);
    },
    //  当前页
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getChannel();
      console.log(`当前页: ${val}`);
    },
    invite() {
      // this.$router.push('/inviteSupplier')
      this.$router.push({
        path: '/inviteSupplier',
        query: {
          type: 1
        }
      });
    },
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../../main.less';
.nav_right {
  float: right;
  margin-bottom: 10px;
}
.invite_icon {
  font-size: 14px;
  color: @darkGary;
  cursor: pointer;
  float: right;
  margin: @normalSize @normalSize 0;
  .yaoqing {
    margin-right: 5px;
    font-size: 22px;
  }
}
.list-complete-item{
  font-size: @baseFont;
}
.right-btn {
  position: absolute;
  right: 2%;
  z-index: 2;
}

.none {
  display: none;
}

.my-channel {
  padding: @normalSize;
}

.search {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 500px;
  margin: 15px 0 15px 0;
  .search-btn {
    border-color: @Gary;
    border-left: none;
    background-color: @Gary;
    color: @neutralGary;
    width: 76px;
    height: 30px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

.content-box {
  position: relative;
  width: 100%;
  min-height: 400px;
  .pagination {
    width: 100%;
    margin: 20px 0 20px 0;
    text-align: right;
  }
}

.no-cooperate,
.pending,
.cooperate,
.rejected {
  width: 68px;
  height: 25px;
  color: #fff;
  line-height: 25px;
  text-align: center;
  border-radius: 10px;
}

.no-cooperate {
  background: @baseGary;
}

.pending {
  background: @warningYellow;
}

.cooperate {
  background: @successGreen;
}

.rejected {
  background: @dangerRed;
}

.accept-left {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 46px;
  height: 46px;
  i {
    font-size: 40px;
    color: @warning;
  }
}

.accept-top {
  text-align: right;
}

.accept-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.accept-right {
  box-sizing: border-box;
  width: 200px;
  padding-left: 10px;
  p {
    margin: 0;
  }
  .channel-sure {
    font-size: @normalSize;
  }
  .channel-selected-name {
    margin-top: 5px;
    color: @darkGary;
  }
}

.type {
  font-size: @baseFont;
  color: @darkGary;
}

.detail {
  position: relative;
}
</style>
<style lang="less">
@import '../../../main.less';
.my-channel {
  .el-input {
    width: 320px;
    .el-input-group__append {
      width: 85px;
      background-color: @borderLine;
      border-color: @borderLine;
      color: @lightBlack;
      text-align: center;
      .el-button {
        width: 85px;
        padding: 0;
        height: 30px;
      }
    }
    input {
      height: 30px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-color: @borderLine;
    }
  }
}
.my-channel .el-table .cell,
.my-channel .el-table__header-wrapper {
  overflow: visible;
}

.my-channel input {
  border-color: @Gary;
}

.my-channel .search .el-input__inner {
  font-size: 12px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}

.list-complete-enter,
.list-complete-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-complete-leave-active {
  position: absolute;
}
</style>
