<template>
  <div class="invite" v-loading="loading" element-loading-text="拼命加载中...">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>企业互联</el-breadcrumb-item>
      <el-breadcrumb-item>我的供应商</el-breadcrumb-item>
    </el-breadcrumb>
    <div v-if="tableData.length > 0 || isSearch">
      <el-row class="nav">
        <div class="inputWd">
          <el-autocomplete placeholder="商家名称" v-model.trim="supplier" :fetch-suggestions="querySearchAsync" :trigger-on-focus="false" @keyup.enter.native="search">
          </el-autocomplete>
          <el-button class="selfBtn_search" @click="search">搜索商家</el-button>
        </div>
        <div class="nav_right"><span class="invite_icon" @click="invite"><i class="icon iconfont icon-yaoqing1 yaoqing"></i>邀请供应商</span></div>
      </el-row>
      <div class="table_body">
        <el-table :data="tableData" style="width: 100%" :default-sort="{prop: 'assocStatus', order: 'descending'}">
          <el-table-column prop="enterpriseTitle" label="商家名称" width="220">
          </el-table-column>
          <!-- <el-table-column label="主营类目" width="150">
          <template scope="scope">
            <div style="padding:10px 0 10px 0">
              <span v-for='item in scope.row.category'>{{item}}</span>
            </div>
          </template>
        </el-table-column> -->
          <el-table-column label="联系人">
            <template scope="scope">
              <div style="padding:10px 0 10px 0">
                <div>{{scope.row.contacts}}</div>
                <div>{{scope.row.mobile}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="地址">
            <template scope="scope">
              <span>{{scope.row.locProvince}}&nbsp;{{scope.row.locCity}}&nbsp;{{scope.row.locDistrict}}&nbsp;{{scope.row.locAddress}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="inviteTime" label="邀请时间" sortable>
          </el-table-column>
          <el-table-column prop="assocStatus" label="状态" width="100" sortable>
            <template scope="scope">
              <div>
                <div v-if='scope.row.assocStatus == 0' class="pending">待确认</div>
                <div v-if='scope.row.assocStatus == 1' class="cooperate">已合作</div>
                <!-- <div v-if='scope.row.assocStatus == 2' class="reject">已拒绝</div> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width='180' style='overflow:visible'>
            <template scope="scope">
              <el-button size="small" @click='goDetail(scope.row)'>详情</el-button>
            </template>
          </el-table-column>
          <template slot="empty">
            <searchNull></searchNull>
          </template>
        </el-table>
        <div class="foot">
          <el-pagination style="margin-top:40px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" class='pagination' layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
      <!-- <div v-else class="no-channel">
      <span v-if="isSearch">搜索结果为空，您可以 : </span>
      <span v-else>您还没有供应商，赶紧去 : </span>
      <el-button type="primary" @click="invite"><i class="icon iconfont icon-yaoqing1"></i>邀请供应商</el-button>
    </div> -->
    </div>
    <div class="noData" v-else>
      <span class="icon_bg">
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gongyingshangweikong"></use>
        </svg>
      </span>
      <span class="font1">您还没有供应商哦~</span>
      <span class="font2">邀请供应商入驻, 实现订单分发</span>
      <el-button type="primary" size="large" @click="invite">邀请供应商</el-button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'supplier',
  data() {
    return {
      loading: true,
      pageNumber: 1,
      pageSize: 10,
      total: 1,
      isSearch: false,
      supplier: '',
      tableData: [],
      restaurants: [],
    }
  },
  methods: {
    //  远程加载供应商
    search(e, pN = 1, pS = 10, once) {
      this.loading = true;
      // this.isSearch = true;
      // this.tableData = [];
      let query = {
        queryCondition: {
          enterpriseTitle: this.supplier,
          // tenantType: [1, 2],
          assocStatus: [0, 1],
          querySupplier: 1,
        },
        pageNumber: pN,
        pageSize: pS
      }
      // console.log(query)
      axios.post('/customer/tenantInfo/queryTenant', query)
        .then(res => {
          this.total = res.data.amount;
          this.tableData = res.data.beanList;
          if (once) {
            if (!this.tableData) this.isSearch = true;
            let values = [];
            for (let i = 0; i < this.tableData.length; i++) {
              values.push({
                value: this.tableData[i].enterpriseTitle
              });
            }
            this.restaurants = values;
          } else {
            this.isSearch = true;
          }
          this.loading = false;
        })
        .catch(err => {
          this.$message.error({
            message: err.response ? err.response.data : err
          });
          this.loading = false;
        })
    },
    querySearchAsync(queryString, cb) {
      let restaurants = this.restaurants;
      let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 300 * Math.random());
    },
    createStateFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.indexOf(queryString.toLowerCase()) !== -1 || restaurant.value.indexOf(queryString.toUpperCase()) !== -1);
      };
    },
    //  详情跳转
    goDetail(row) {
      window.sessionStorage.channel = JSON.stringify(row);
      this.$router.push({
        path: '/channelDetail',
        query: {
          tenantId: row.tenantId,
          origin: 'supplier'
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.search('', this.pageNumber, val);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.search('', val, this.pageSize);
    },
    invite() {
      if (!this.shopNum) {
        this.$message.error({
          message: '邀请供应商前，请先添加至少一个店铺！'
        })
        return false
      }
      this.$router.push('/inviteSupplier')
    },
  },
  computed: {
    ...mapGetters([
      'ichannel'
    ]),
    shopNum() {
      return Object.keys(this.$store.state.enumSet.shopEnum).length;
    }
  },
  beforeRouteLeave(to, from, next) {
    // this.search('', 1, 10, true);
    this.supplier = '';
    next();
  },
  activated() {
    this.search('', 1, 10, true);
  },
}
</script>
<style lang="less" scoped>
@import '../../../main.less';
.invite {
  padding: @baseSpace * 3;
  .nav {
    height: 45px;
  }
  .nav_right {
    float: right;
  }
  .invite_icon {
    font-size: 14px;
    color: @primaryBlue;
    cursor: pointer;
    float: right;
    margin: @normalSize @normalSize 0;
    .yaoqing {
      color: @darkGary;
      font-size: 22px;
    }
  }
  .table_body {
    margin-top: 17px;
    .pending {
      width: 68px;
      height: 25px;
      background: @warningYellow;
      color: #fff;
      line-height: 25px;
      text-align: center;
      border-radius: 10px;
    }
    .cooperate {
      width: 68px;
      height: 25px;
      background: @successGreen;
      color: #fff;
      line-height: 25px;
      text-align: center;
      border-radius: 10px;
    }
    // .reject {
    //   width: 68px;
    //   height: 25px;
    //   background: @danger;
    //   color: #fff;
    //   line-height: 25px;
    //   text-align: center;
    //   border-radius: 10px;
    // }
  }
  .no-channel {
    min-width: 820px;
    height: 127px;
    border: 1px solid @lightGary;
    margin-top: 17px;
    font-size: 13px;
    line-height: 127px;
    text-align: center;
    span {
      margin-right: @largeSize;
    }
  }
  .noData {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    span {
      font-size: @fontSize14;
      color: @lightGary;
    }
    .icon_bg {
      margin-top: 120px;
      .icon {
        width: 128px;
        height: 128px;
      }
    }
    .font1 {
      font-size: @homeFont18;
      margin-top: @baseSpace * 2;
    }
    .font2 {
      margin-bottom: @baseSpace * 8;
    }
  }
}
.foot {
  text-align: end;
}
</style>
<style lang="less">
@import '../../../main.less';
.inputWd {
  width: 364px;
  height: 30px;
  overflow: hidden;
  position: relative;
  float: left;
  margin-top: 15px;
}

.inputWd input {
  // font-size: 12px!important;
  width: 288px;
  height: 30px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.selfBtn_search {
  border-radius: 0;
  font-size: 12px;
  position: absolute;
  right: 0;
  top: 0;
  height: 30px;
  width: 76px;
  background-color: @borderLine;
  border-color: @borderLine;
  color: @lightBlack;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  padding: 5px;
  &:hover {
    border-color: @borderLine;
    color: @lightBlack;
  }
}
.invite .el-table {
  font-size: 12px;
}
</style>
