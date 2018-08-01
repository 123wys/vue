<template>
  <div class="err_order_search">
    <el-form label-position="right" :model="queryCondition" label-width="90px">
      <el-row style="margin-top: 15px;">
        <div class="floatL selfInput">
          <el-input placeholder="输入外部订单号" v-model="queryCondition.extOrderId">
            <el-button type="primary" slot="append" size="small" style="margin-left:-6px;" @click="formSubmit">搜索订单</el-button>
          </el-input>
        </div>
        <div class="floatL">
          <span>
            <a class="moreCheck" @click="checkToggle">{{moreCheck ? '精简搜索条件' : '更多搜索条件'}}</a>
          </span>
        </div>
        <div v-if="fullPath === 'undisorder'" class="floatR">
          <i class="icon iconfont icon-tixing"></i>
          <span>点击分发后，进入商品关联供应商，关联后系统将自动分发订单哦~</span>
        </div>
      </el-row>
      <transition-group name="fade" mode="out-in">
        <el-row :gutter="15" v-show="moreCheck" key="one">
          <el-col :xs="12" :sm="6">
            <el-form-item label="商品自编码">
              <el-input size="small" v-model="queryCondition.outerId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6">
            <el-form-item label="商品名称">
              <el-input size="small" v-model="queryCondition.skuTitle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6">
            <el-form-item label="付款时间">
              <el-date-picker type="daterange" size="small" v-model="timeValue" placeholder="请选择日期范围" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6">
            <el-form-item label="订单创建时间">
              <el-date-picker type="daterange" size="small" v-model="createTimeValue" placeholder="请选择日期范围" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15" v-show="moreCheck" key="three">
          <el-col :xs="12" :sm="6">
            <el-form-item label="收件人">
              <el-input size="small" v-model="queryCondition.receiverName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6">
            <el-form-item label="买家手机">
              <el-input size="small" v-model="queryCondition.receiverMobile"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6">
            <el-form-item label="售卖渠道">
              <el-select placeholder="请选择" v-model="channelSelect" filterable>
                <el-option-group v-for="group in allChannel" :label="group.label" v-if="group.show">
                  <el-option v-for="(key, value) in group.options" :label="key" :value="value">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6">
            <el-form-item v-if="fullPath !== 'undisorder' && fullPath !== 'deadorder'" label="问题订单原因">
              <el-select size="small" v-model="queryCondition.errorType">
                <el-option v-for="(key, value) in errorTypeEnum" :label="key" :value="value" v-if="value !== '-8' && value !== '-1'">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="btn" v-show="moreCheck" key="four">
          <el-button type="primary" style="height:30px;font-size:12px;width:68px;" @click="formSubmit">搜索 </el-button>
        </el-row>
      </transition-group>
    </el-form>
  </div>
</template>
<script>
import Vue from 'vue'
import debounce from 'lodash/debounce'
import {
  Form,
  FormItem,
  Col,
  Row,
  Input,
  Select,
  Option,
  DatePicker,
  Button
} from 'element-ui'
import {
  mapGetters
} from 'vuex'
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Col)
Vue.use(Row)
Vue.use(DatePicker)
Vue.use(Button)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
export default {
  name: 'error-order-search',
  props: ['state', 'moreCheck', 'fullPath'],
  data() {
    return {
      channelSelect: '',
      timeValue: '',
      createTimeValue: '',
      errorType: [],
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
        extOrderId: '',
        outerId: '',
        skuTitle: '',
        platformId: '',
        receiverName: '',
        receiverMobile: '',
        beginCreateTime: '',
        endCreateTime: '',
        beginPayTime: '',
        endPayTime: '',
        errorType: '',
        partnerIds: '',
        shopId: '',
      }
    }
  },
  components: {},
  computed: {
    channel() {
      return {
        '': '全部',
        ...this.$store.state.enumSet.platformEnum
      };
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
    errorTypeEnum() {
      return {
        '': '全部',
        ...this.$store.state.enumSet.errorType
      };
    },
    ...mapGetters([
      'ichannel',
    ]),
  },
  methods: {
    checkToggle: debounce(function() {
      this.$emit('actionCheck')
    }, 1000, {
      leading: true,
      trailing: false
    }),
    timeFormat: function(time) {
      if (time[0] === null && time[1] === null) {
        return ['', ''];
      }
      if (time.length > 0) {
        let t = time;
        return t.map(function(time, ind) {
          let tf = new Date(time)
          let yy = tf.getFullYear()
          let MM = (tf.getMonth() + 1) > 9 ? tf.getMonth() + 1 : ('0' + (tf.getMonth() + 1))
          let dd = tf.getDate() > 9 ? tf.getDate() : '0' + tf.getDate()
          let HH = tf.getHours() > 9 ? tf.getHours() : '0' + tf.getHours()
          let mm = tf.getMinutes() > 9 ? tf.getMinutes() : '0' + tf.getMinutes()
          let ss = tf.getSeconds() > 9 ? tf.getSeconds() : '0' + tf.getSeconds()
          time = `${yy}-${MM}-${dd} ${HH}:${mm}:${ss}`
          return time
        })
      }
    },
    formSubmit: function() {
      this.$emit('formSubmit', this.queryCondition, this.timeFormat(this.timeValue), this.timeFormat(this.createTimeValue))
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
  },
  activated() {
    this.queryCondition = {
      extOrderId: '',
      outerId: '',
      skuTitle: '',
      platformId: '',
      receiverName: '',
      receiverMobile: '',
      beginCreateTime: '',
      endCreateTime: '',
      beginPayTime: '',
      endPayTime: '',
      errorType: '',
      partnerIds: '',
      shopId: ''
    };
    this.timeValue = '';
    this.createTimeValue = '';
  },
  watch: {
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
.err_order_search {
  font-size: 12px;
  padding-bottom: 10px;
  input {
    height: 30px!important;
  }
  .el-form-item__label {
    font-size: 12px;
  }
  .el-row {
    .el-form-item {
      margin-bottom: @smallSize;
    }
  }
  /*datepicker宽度*/
  .el-date-editor--daterange.el-input{
    width: 100%;
  }
}

.err_order_search a {
  color: @primaryBlue;
}

.err_order_search .btn {
  padding-left: 90px;
}

.selfInput {
  width: 364px;
  .el-input-group__append{
    width: 76px;
  }
}

.selfInput input {
  width: 288px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.floatL {
  float: left;
  overflow: hidden;
  position: relative;
  height: 42px;
  line-height: 42px;
}

.floatR {
  float: right;
  width: 420px;
  height: 42px;
  background-color: @white;
  border: 1px solid @borderLine;
  border-radius: 4px;
  overflow: hidden;
  color: @warningYellow;
  font-size: 12px;
  line-height: 42px;
  i {
    margin: 0 10px 0 10px;
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
  cursor: pointer;
  font-size: 12px;
  line-height: 30px;
  text-decoration: underline;
  margin-left: @baseSpace * 2;
}
</style>
