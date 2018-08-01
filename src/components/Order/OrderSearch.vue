<template>
  <div class="order_search">
    <el-form label-position="right" :model="queryCondition" ref="queryCondition" label-width="72px">
      <el-row style="margin-bottom: 20px;">
        <div class="floatL selfInput">
          <el-input placeholder="商城单号 |系统单号|商家自编码 | 商品名称关键词" v-model.trim="queryCondition.mix" @keyup.enter.native="formSubmit">
            <template slot="append">
              <el-button size="small" style="margin-left:-6px;" type="primary" @click="formSubmit">搜索订单</el-button>
            </template>
          </el-input>
        </div>
        <!-- <div class="floatL">
          <el-button v-if="state=='1' && !moreCheck" @click="exportData" style="height:30px;font-size:12px;">导出查询订单</el-button>
        </div> -->
        <div class="floatL">
          <span><a href="javascript:void(0)" class="moreCheck" @click="checkToggle">{{moreCheckToggle ? '精简搜索条件' : '更多搜索条件'}}</a></span>
        </div>
      </el-row>
      <transition-group name="fade" mode="out-in">
        <!-- <el-row :gutter="15" v-if="moreCheckToggle&& !stateGroup.includes(state)" key="two">
          <el-col :xs="12" :sm="6">
            <el-form-item label="售卖渠道">
              <el-select v-model="queryCondition.platformId" placeholder="全部">
                <el-option v-for="(key, value) in channel" :label="key" :value="value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6">
            <el-form-item label="收件人">
              <el-input v-model="queryCondition.receiverName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6">
            <el-form-item label="买家手机">
              <el-input v-model="queryCondition.receiverMobile"></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row :gutter="15" v-show="moreCheckToggle" key="three">
          <el-col :xs="12" :sm="6">
            <el-form-item label="售卖渠道">
              <!-- <el-select v-model="queryCondition.platformId" placeholder="全部" :disabled="[0, 2].includes(ichannel.tenantInfo.tenantType)">
                <el-option v-for="(label, value) in channel" :label="label" :value="value">
                </el-option>
              </el-select> -->
              <el-select placeholder="请选择" v-model="channelSelect" filterable key="platA">
                <el-option-group v-for="group in allChannel" :label="group.label" v-if="group.show">
                  <el-option v-for="(key, value) in group.options" :label="key" :value="value">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6">
            <el-form-item label="供应商">
              <el-select v-model="queryCondition.supplierId" placeholder="全部" :disabled="haveSupplier" filterable key="supA">
                <el-option v-for="item in supplierIdEnum" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6">
            <el-form-item label="收件人">
              <el-input v-model.trim="queryCondition.receiverName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6">
            <el-form-item label="买家手机">
              <el-input v-model.trim="queryCondition.receiverMobile"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15" key="three" v-show="moreCheckToggle">
          <el-col :xs="12" :sm="6">
            <el-form-item label="留言关键字" v-if="state == 7">
              <el-input v-model="queryCondition.buyerMemo"></el-input>
            </el-form-item>
            <el-form-item label="订单状态" v-if="['all'].includes(state)">
              <el-select v-model="queryCondition.orderStatus" placeholder="全部">
                <el-option v-for="option in orderStatus" :label="option.label" :value="option.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="6">
            <el-form-item label="商品售后" v-if="state != 'sixth'">
              <el-select placeholder="请选择" v-model="queryCondition.warrantyStatus">
                <el-option v-for="option in warrantyStatus" :label="option.label" :value="option.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="6">
            <el-form-item label="仓库">
              <el-select v-model="queryCondition.wmsId">
                <el-option v-for="item in repositoryArr" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="6">
            <el-form-item label="配送方式">
              <el-select v-model="queryCondition.shippingType">
                <el-option v-for="item in shippingTypeEnum" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="6">
            <el-form-item label="物流公司">
              <el-select class="w200" v-model="queryCondition.logisticsCompany" filterable>
                <el-option v-for="(key, value) in logisticAll" :label="key" :value="value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" v-if="state != 4">
            <el-form-item label="付款时间">
              <el-date-picker type="daterange" style="width:100%;" v-model="timeValue" placeholder="请选择日期范围" :picker-options="pickerOptions" key="dateA"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="moreCheckToggle" key="five">
          <el-col :sm="6">
            <el-form-item label=" ">
              <el-checkbox v-model="queryCondition.haveSupplier">仅展示待分发订单</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :sm="6">
            <el-form-item label=" ">
              <el-checkbox v-model="queryCondition.haveMemo">仅展示有备注订单</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="btn" v-show="moreCheckToggle" key="four">
          <el-col :md="24" :sm="6">
            <el-button type="primary" style="height:30px;font-size:12px;width:68px;" @click="formSubmit">搜索 </el-button>
            <!-- <el-button v-if="state=='1' && moreCheckToggle" @click="exportData" style="height:30px;font-size:12px;">导出查询订单</el-button> -->
          </el-col>
        </el-row>
      </transition-group>
    </el-form>
    <el-dialog v-model="exportDialog" title="选择订单导出条件" size="tiny" @open="exportQueryReset" :close-on-click-modal="false">
      <el-form :model="exportQuery" ref="exportQuery" :rules="exportRule" label-width="70px" label-position="left">
        <el-form-item label="订单状态" prop="orderStatus">
          <el-select v-model="exportQuery.orderStatus" multiple placeholder="支持多选">
            <el-option v-for="option in exportOrderStatus" :label="option.label" :value="option.value" :key="option.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="售卖渠道" prop="channel">
          <el-select v-model="exportQuery.channel" filterable placeholder="全部">
            <el-option-group v-for="group in allChannel" :label="group.label" v-if="group.show">
              <el-option v-for="(key, value) in group.options" :label="key" :value="value">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierId">
          <el-select v-model="exportQuery.supplierId" placeholder="可输入关键字搜索" filterable>
            <el-option v-for="item in supplierIdEnum" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款时间" prop="date">
          <el-date-picker type="daterange" v-model="exportQuery.date" placeholder="请选择日期范围" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
        <el-form-item label="精确条件" prop="mix">
          <el-input v-model.trim="exportQuery.mix" placeholder="商品名称|商城单号|系统单号等"></el-input>
        </el-form-item>
        <div class="autoCheckDiv">
          <el-checkbox v-model="autoCheck">自动过滤掉上次导出的订单</el-checkbox>
          <div class="autoCheck"><i class="icon iconfont icon-bangzhu1"></i>适用于一天内多次导出订单的场景</div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="seeHistory" size="small">查看已生成报表</el-button>
        <el-button type="primary" @click="exportData" size="small">生成报表</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import debounce from 'lodash/debounce'
import dateFormat from 'dateFormat'
import axios from 'axios'
import {
  // supplierCheck,
  dateCheck,
  orderStatusCheck
} from '../../assets/validatorEnum.js'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'order-search',
  props: ['state', 'moreCheckToggle'],
  data() {
    return {
      autoCheck: false,
      exportDialog: false,
      exportQuery: {
        orderStatus: ['1'],
        supplierId: null,
        date: '',
        channel: '',
        mix: '',
      },
      exportRule: {
        orderStatus: [{
          validator: orderStatusCheck,
          trigger: 'submit'
        }],
        date: [{
          validator: dateCheck,
          trigger: 'submit'
        }],
        // supplierId: [{
        //   validator: supplierCheck,
        //   trigger: 'submit'
        // }]
      },
      timeValue: '',
      channelSelect: '', // 售卖渠道
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      queryCondition: {
        mix: '', //  精简查询条件
        platformId: '', //  售卖渠道
        supplierId: '', //  供应商 --(目前是供应商)
        receiverName: '', //  收件人姓名
        receiverMobile: '', //  收件人手机号
        orderStatus: '', //  订单状态
        buyerMemo: '', //  买家留言
        warrantyStatus: '', // 售后状态
        wmsId: '', //  仓库
        shippingType: '', //  物流配送方式
        haveSupplier: '', // 是否是待分发订单
        haveMemo: '', // 仅展示有备注订单
        logisticsCompany: '' // 物流公司
      }
    }
  },
  components: {},
  computed: {
    haveSupplier() {
      return this.queryCondition.haveSupplier === true;
    },
    myChannel() {
      let channelEnum = this.$store.state.enumSet.channelEnum;
      let id = this.$store.getters.ichannel.tenantInfo.tenantId;
      delete channelEnum[id];
      return channelEnum;
    },
    myShop() {
      return this.$store.state.enumSet.shopEnum;
    },
    allChannel() {
      let group = [{
        label: '全部',
        options: {
          '': '所有店铺与渠道',
        },
        show: false,
      }, {
        label: '我的店铺',
        options: {
          // 'allShop': '全部店铺',
          ...this.myShop,
        },
        show: true,
      }, {
        label: '我的分销渠道',
        options: {
          // 'allChannel': '全部渠道',
          ...this.myChannel,
        },
        show: true,
      }];
      if (Object.keys(this.myChannel).length === 0) {
        group[2].show = false;
      }
      if (Object.keys(this.myShop).length === 0) {
        group[1].show = false;
      }
      if (Object.keys(this.myShop).length && Object.keys(this.myChannel).length) {
        group[0].show = true;
      }
      if (Object.keys(this.myChannel).length > 1) {
        group[2].options['allChannel'] = '全部渠道';
        group[2].options = this.objReverse(group[2].options);
      }
      if (Object.keys(this.myShop).length > 1) {
        group[1].options['allShop'] = '全部店铺';
        group[1].options = this.objReverse(group[1].options);
      }
      return group;
    },
    warrantyStatus() {
      let options = this.getArr(this.$store.state.enumSet.warrantyStatus);
      options.forEach(ele => {
        if (ele.value === '0') {
          ele.label = '没有售后';
        }
        if (ele.label === '全部') {
          ele.value = 'all';
        }
      })
      return options;
    },
    ...mapGetters([
      'ichannel',
    ]),
    supplierIdEnum() {
      let supplierenum = this.getArr(this.$store.state.enumSet.supplierEnum);
      // supplierenum.push({
      //   label: this.ichannel.tenantInfo.enterpriseTitle,
      //   value: this.ichannel.tenantInfo.tenantId
      // })
      return supplierenum
    },
    orderStatus() {
      let obj = this.$store.state.enumSet.orderType;
      let arr = [];
      for (var k in obj) {
        arr.push({
          value: k,
          label: obj[k].label
        })
      }
      let result = arr.filter(ele => {
        return ele.label !== '已关闭' && ele.label !== '全部'
      })
      result.push({
        value: ['-1', '999'],
        label: '已关闭'
      });
      result.unshift({
        value: '',
        label: '全部'
      });
      return result
    },
    exportOrderStatus() {
      let obj = this.$store.state.enumSet.orderType;
      let arr = [];
      for (var k in obj) {
        arr.push({
          value: k,
          label: obj[k].label
        })
      }
      let result = arr.filter(ele => {
        return ele.label !== '已关闭' && ele.label !== '全部'
      })
      result.push({
        value: 999,
        label: '已关闭'
      });
      return result;
    },
    repositoryEnum() {
      return this.$store.state.enumSet.repositoryEnum;
    },
    repositoryArr() {
      return this.getArr(this.repositoryEnum);
    },
    shippingTypeEnum() {
      return this.getArr(this.$store.state.enumSet.shippingType)
    },
    logisticAll() {
      return this.$store.state.enumSet.logisticsCompanyAll;
    },
  },
  methods: {
    checkToggle: debounce(function() {
      this.$emit('actionCheck')
    }, 1000, {
      leading: true,
      trailing: false
    }),
    formSubmit() {
      let query = Object.assign({}, this.queryCondition);
      if (!this.queryCondition.orderStatus) {
        switch (this.state) {
          case 'all':
          case 'sixth':
            query.orderStatus = '';
            break;
          case '3':
            query.orderStatus = [3, 4];
            break;
          case 'cycleSend':
            query.orderKind = 5;
            break;
          default:
            query.orderStatus = this.state;
            break;
        }
      };
      if (query.haveSupplier) { // 展示未关联时取消选中供应商;
        query.supplierId = '';
      }
      if (!this.queryCondition.warrantyStatus && this.state === 'sixth') {
        query.warrantyStatus = [1, 3, 4, 6, 7];
      }
      if (this.timeValue && !this.timeValue.includes(null)) {
        let time = [];
        time = [dateFormat(this.timeValue[0], 'yyyy-mm-dd') + ' 00:00:00', dateFormat(this.timeValue[1], 'yyyy-mm-dd') + ' 23:59:59'];
        if (this.timeValue[1].getMonth() === new Date().getMonth() && this.timeValue[1].getDate() === new Date().getDate()) {
          time[1] = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
        }
        this.$emit('formSubmit', query, time);
        return;
      }
      this.$emit('formSubmit', query);
    },
    // 订单导出
    exportData: debounce(function(val) {
      this.$refs.exportQuery.validate(valid => {
        if (!valid) {
          return;
        } else {
          this.exportDialog = false;
          // window.open(this.href);
          let query = {
            queryCondition: {}
          };
          query.queryCondition.supplierId = this.exportQuery.supplierId === null ? '' : this.exportQuery.supplierId;
          query.queryCondition.orderStatus = this.exportQuery.orderStatus;
          query.queryCondition.mix = this.exportQuery.mix;
          if (query.queryCondition.orderStatus.includes(999)) {
            query.queryCondition.orderStatus.push('-1');
          }
          if (this.exportQuery.date && !this.exportQuery.date.includes(null)) {
            let time = [];
            time = [dateFormat(this.exportQuery.date[0], 'yyyy-mm-dd') + ' 00:00:00', dateFormat(this.exportQuery.date[1], 'yyyy-mm-dd') + ' 23:59:59'];
            if (this.exportQuery.date[1].getMonth() === new Date().getMonth() && this.exportQuery.date[1].getDate() === new Date().getDate()) {
              time[1] = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
            }
            query.queryCondition.beginPayTime = time[0];
            query.queryCondition.endPayTime = time[1];
          }
          query.queryCondition.beginCreateTime = dateFormat(new Date().getTime() - 3600 * 1000 * 24 * 90, 'yyyy-mm-dd') + ' 00:00:00';
          query.queryCondition.endCreateTime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
          // query.queryCondition.itemStatus = 1;
          // query.queryCondition.warrantyStatus = [0, 2, 5];
          this.exportQuery.partnerIds = '';
          this.exportQuery.shopId = '';
          if (this.exportQuery.channel) {
            this.allChannel.forEach((ele, ind) => {
              if (Object.keys(ele.options).includes(this.exportQuery.channel)) {
                ind === 2 ? (query.queryCondition.partnerIds = this.exportQuery.channel === 'allChannel' ? Object.keys(this.myChannel) : this.exportQuery.channel) : (query.queryCondition.shopId = this.exportQuery.channel === 'allShop' ? Object.keys(this.myShop) : this.exportQuery.channel);
              }
            })
          }
          axios.post('/order/order/queryOrderSimple', query)
            .then(res => {
              if (res.data.amount > 0) {
                // console.log(query)
                query.queryCondition.filter = this.autoCheck;
                // 拼接导出文件 名称
                let uploadFile = '';
                let length = query.queryCondition.orderStatus.length;
                for (let i = 0; i < length; i++) {
                  uploadFile += this.$store.state.enumSet.orderType[query.queryCondition.orderStatus[i]].label;
                }
                uploadFile += '_';
                // let uploadFile = query.queryCondition.orderStatus === '1' ? '待发货订单_' : '全部状态订单_';
                if (query.queryCondition.partnerIds instanceof Array) {
                  uploadFile += '全部渠道商_';
                } else if (query.queryCondition.shopId instanceof Array) {
                  uploadFile += '全部店铺_';
                } else if (!query.queryCondition.partnerIds && !query.queryCondition.shopId) {
                  uploadFile += '全渠道_';
                } else {
                  if (query.queryCondition.partnerIds) {
                    uploadFile += this.myChannel[query.queryCondition.partnerIds] + '_';
                  } else {
                    uploadFile += this.myShop[query.queryCondition.shopId] + '_';
                  }
                }
                if (query.queryCondition.supplierId) {
                  uploadFile += this.$store.state.enumSet.supplierEnum[query.queryCondition.supplierId] + '_';
                } else {
                  uploadFile += '全部供应商_';
                }
                uploadFile += query.queryCondition.beginPayTime.split(' ')[0] + '_';
                uploadFile += query.queryCondition.endPayTime.split(' ')[0];
                query.uploadFile = uploadFile;
                // console.log(query);
                axios.post('/order/order/exportOrder', query)
                  .then(res => {
                    this.$confirm('导出作业已启动，稍后可在任务中心下载！', '提示', {
                      cancelButtonText: '稍后再说',
                      confirmButtonText: '现在前往',
                      type: 'success',
                    }).then(() => {
                      this.$router.push('/taskcenter')
                    });
                    this.$store.commit('addTask', 'orderExport');
                  })
                  .catch(err => {
                    this.$message.error({
                      message: err.response ? err.response.data : err
                    })
                  })
              } else {
                this.$message.error('所选条件范围内暂无订单,请更换导出条件！')
              }
            })
            .catch(err => {
              this.$message.error(err.response ? err.response.data : err)
            })
        }
      })
    }, 2000, {
      leading: true,
      trailing: false,
    }),
    seeHistory() {
      this.exportDialog = false;
      this.$router.push('/taskCenter');
    },
    getArr(obj) {
      let arr = [];
      for (var k in obj) {
        arr.push({
          value: k,
          label: obj[k]
        })
      }
      arr.unshift({
        value: '',
        label: '全部'
      })
      return arr
    },
    objReverse(val) {
      var arr = [];
      var obj = {};
      for (var k in val) {
        arr.unshift({
          label: k,
          value: val[k]
        })
      }
      for (var i = 0; i < arr.length; i++) {
        (function(i) {
          obj[arr[i].label] = arr[i].value
        })(i)
      }
      return obj;
    },
    // 表单重置
    reset() {
      this.queryCondition = {
        mix: '', //  精简查询条件
        platformId: '', //  售卖渠道
        supplierId: '', //  供应商 --(目前是供应商)
        receiverName: '', //  收件人姓名
        receiverMobile: '', //  收件人手机号
        orderStatus: '', //  订单状态
        buyerMemo: '', //  买家留言
        warrantyStatus: '', // 售后状态
        wmsId: '', //  仓库
        shippingType: '', //  物流配送方式
        haveSupplier: '', // 是否为待分发
        haveMemo: '',
        logisticsCompany: '' // 物流公司
      };
      this.timeValue = '';
      this.channelSelect = '';
      this.exportQueryReset();
    },
    exportQueryReset() {
      this.exportQuery = {
        supplierId: null,
        date: [],
        channel: '',
        orderStatus: ['1'],
        mix: '',
      };
      this.autoCheck = false;
    },
  },
  // mounted() {
  //   bus.$on('export', this.exportData);
  // },
  activated() {
    this.reset();
  },
  watch: {
    state() {
      this.reset();
    },
    channelSelect(val) {
      this.queryCondition.partnerIds = '';
      this.queryCondition.shopId = '';
      if (val) {
        this.allChannel.forEach((ele, ind) => {
          if (Object.keys(ele.options).includes(val)) {
            ind === 2 ? (this.queryCondition.partnerIds = val === 'allChannel' ? Object.keys(this.myChannel) : val) : (this.queryCondition.shopId = val === 'allShop' ? Object.keys(this.myShop) : val);
          }
        })
      }
      // console.log(this.queryCondition);
    }
  },
}
</script>
<style lang="less">
@import '../../main.less';
.order_search {
  font-size: 12px;
  padding-bottom: 10px;
  .el-form--label-right {
    input {
      height: 30px!important;
    }
  }
  .el-form-item__label {
    font-size: 12px;
  }
  .el-row {
    .el-form-item {
      margin-bottom: @smallSize;
    }
  }
  .autoCheckDiv {
    padding-left: 70px;
    .autoCheck {
      line-height: 25px;
    }
    .icon {
      vertical-align: 0px;
    }
  }
}

.order_search a {
  color: @primaryBlue;
}

.order_search .btn {
  padding-left: 72px;
}

.selfInput {
  width: 364px;
  .el-input-group__append {
    width: 76px;
    background-color: @borderLine;
    border-color: @borderLine;
    color: #475669;
  }
}

.selfInput input {
  // font-size: 12px!important;
  width: 288px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-color: @borderLine;
}

.floatL {
  float: left;
  overflow: hidden;
  position: relative;
  &:not(:first-child) {
    margin-left: @baseSpace * 2;
  }
}

.el-button.selfBtn_define {
  border-radius: 0;
  font-size: 12px;
  position: absolute;
  right: 0;
  top: 0;
  height: 30px;
  width: 76px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.moreCheck {
  // cursor: pointer;
  font-size: 12px;
  line-height: 30px;
  text-decoration: underline;
  margin-left: @baseSpace * 2;
}

.order_search {
  .el-dialog__title {
    font-size: @fontSize14;
  }
  .el-dialog__body {
    padding: 30px 25px;
    .el-form-item {
      margin-bottom: 20px;
    }
  }
}
</style>
