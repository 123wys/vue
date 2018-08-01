<template>
  <div class="customerCenterSearch">
    <el-form label-position="right" :model="queryCondition" label-width="90px">
      <el-row style="margin-top: 15px; margin-bottom: 20px;">
        <div class="floatL selfInput">
          <el-input placeholder="买家昵称|收件人|手机号" v-model.trim="queryCondition.mix">
            <el-button type="primary" slot="append" size="small" style="margin-left:-6px;" @click="formSubmit">搜索客户</el-button>
          </el-input>
        </div>
        <div class="floatL">
          <span>
            <a class="moreCheck" @click="checkToggle">{{moreCheck ? '精简搜索条件' : '更多搜索条件'}}</a>
          </span>
        </div>
      </el-row>
      <transition-group name="fade" mode="out-in" tag='div'>
        <el-row :gutter="15" v-if="moreCheck" key="one">
          <el-col :xs="8" :sm="8">
            <el-form-item label="客户标签">
              <!-- <el-input size="small" v-model="queryCondition.tag"></el-input> -->
              <el-select v-model="queryCondition.tag" multiple placeholder="全部">
                <el-option v-for="item in TagArr" :label="item.specName" :value="item.specId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8">
            <el-form-item label="客户分组">
              <el-select v-model="queryCondition.group" clearable placeholder="全部">
                <el-option v-for="item in GroupArr" :label="item.specName" :value="item.specId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8">
            <el-form-item label="购买日期">
              <el-date-picker type="daterange" size="small" v-model="timeValue" placeholder="请选择日期范围" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15" v-if="moreCheck" key="three">
          <el-col :xs="8" :sm="8">
            <el-form-item label="累计订单数">
              <el-col :span="11">
                <el-input size="small" v-model="queryCondition.orderCountsMin" @keyup.native="clearNumMin(queryCondition)"></el-input>
              </el-col>
              <el-col class="line" :span="2" style='text-align:center'>-</el-col>
              <el-col :span="11">
                <el-input size="small" v-model="queryCondition.orderCountsMax" @keyup.native="clearNumMax(queryCondition)"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8">
            <el-form-item label="累计购买金额">
              <el-col :span="11">
                <el-input size="small" v-model="queryCondition.totalPaidFeeMin" @keyup.native="clearNoNumMin(queryCondition)" style='max-width:150px;'></el-input>
              </el-col>
              <el-col class="line" :span="2" style='text-align:center'>-</el-col>
              <el-col :span="11">
                <el-input size="small" v-model="queryCondition.totalPaidFeeMax" @keyup.native="clearNoNumMax(queryCondition)" style='max-width:150px;'></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8">
            <el-form-item label="渠道来源">
              <el-select v-model="queryCondition.shopId" clearable placeholder="全部">
                <el-option v-for="(key, value) in shopEnum" :label="key" :value="value" :key="value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="btn" v-if="moreCheck" key="four">
          <el-button type="primary" style="height:30px;font-size:12px;width:68px;" @click="formSubmit">搜索</el-button>
        </el-row>
      </transition-group>
    </el-form>
  </div>
</template>
<script>
import debounce from 'lodash/debounce'
import dateFormat from 'dateFormat'
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  name: 'customerCenterSearch',
  props: ['moreCheck'],
  data() {
    return {
      timeValue: '',
      errorType: [],
      pickerOptions: {
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
        shopId: '',
        mix: '',
        tag: [],
        group: '',
        orderCountsMin: '',
        orderCountsMax: '',
        totalPaidFeeMin: '',
        totalPaidFeeMax: ''
      }
    }
  },
  created() {
    var _self = this;
    this.setTagArr(_self);
    this.setGroupArr(_self);
  },
  components: {},
  computed: {
    ...mapGetters([
      'TagArr',
      'GroupArr'
    ]),
    shopEnum() {
      return this.$store.state.enumSet.shopEnum
    }
  },
  methods: {
    ...mapActions([
      'setTagArr',
      'setGroupArr',
      'setShopEnum'
    ]),
    checkToggle: debounce(function() {
      this.$emit('actionCheck')
    }, 1000, {
      leading: true,
      trailing: false
    }),
    clearNumMin(queryCondition) {
      this.queryCondition.orderCountsMin = this.queryCondition.orderCountsMin.replace(/[^\d]/g, '')
    },
    clearNumMax(queryCondition) {
      this.queryCondition.orderCountsMax = this.queryCondition.orderCountsMax.replace(/[^\d]/g, '')
    },
    clearNoNumMax(queryCondition) {
      //  先把非数字的都替换掉，除了数字和.
      queryCondition.totalPaidFeeMax = queryCondition.totalPaidFeeMax.replace(/[^\d.]/g, '');
      //  必须保证第一个为数字而不是.
      queryCondition.totalPaidFeeMax = queryCondition.totalPaidFeeMax.replace(/^\./g, '');
      //  保证只有出现一个.而没有多个.
      queryCondition.totalPaidFeeMax = queryCondition.totalPaidFeeMax.replace(/\.{2,}/g, '.');
      //  保证.只出现一次，而不能出现两次以上
      queryCondition.totalPaidFeeMax = queryCondition.totalPaidFeeMax.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    },
    clearNoNumMin(queryCondition) {
      //  先把非数字的都替换掉，除了数字和.
      queryCondition.totalPaidFeeMin = queryCondition.totalPaidFeeMin.replace(/[^\d.]/g, '');
      //  必须保证第一个为数字而不是.
      queryCondition.totalPaidFeeMin = queryCondition.totalPaidFeeMin.replace(/^\./g, '');
      //  保证只有出现一个.而没有多个.
      queryCondition.totalPaidFeeMin = queryCondition.totalPaidFeeMin.replace(/\.{2,}/g, '.');
      //  保证.只出现一次，而不能出现两次以上
      queryCondition.totalPaidFeeMin = queryCondition.totalPaidFeeMin.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    },
    timeFormat: function(time) {
      if (time[0] === null && time[1] === null) {
        return ['', ''];
      };
      if (time.length > 0) {
        let t = time;
        t[0] = dateFormat(t[0], 'yyyy-mm-dd') + ' 00:00:00'
        t[1] = dateFormat(t[1], 'yyyy-mm-dd') + ' 23:59:59'
        return t;
      }
    },
    formSubmit: function() {
      if (this.queryCondition.orderCountsMin && this.queryCondition.orderCountsMax && parseInt(this.queryCondition.orderCountsMin) > parseInt(this.queryCondition.orderCountsMax)) {
        var count = this.queryCondition.orderCountsMin;
        this.queryCondition.orderCountsMin = parseInt(this.queryCondition.orderCountsMax);
        this.queryCondition.orderCountsMax = parseInt(count);
      }
      if (this.queryCondition.totalPaidFeeMin && this.queryCondition.totalPaidFeeMax && parseFloat(this.queryCondition.totalPaidFeeMin) > parseFloat(this.queryCondition.totalPaidFeeMax)) {
        var fee = this.queryCondition.totalPaidFeeMin;
        this.queryCondition.totalPaidFeeMin = parseFloat(this.queryCondition.totalPaidFeeMax);
        this.queryCondition.totalPaidFeeMax = parseFloat(fee);
      }
      this.$emit('formSubmit', this.queryCondition, this.timeFormat(this.timeValue))
    },
  },
  activated() {
    if (!Object.keys(this.shopEnum).length) {
      this.setShopEnum();
    }
    this.queryCondition = {
      shopId: '',
      mix: '',
      tag: [],
      group: '',
      orderCountsMin: '',
      orderCountsMax: '',
      totalPaidFeeMin: '',
      totalPaidFeeMax: ''
    };
    this.timeValue = '';
    if (this.$route.query.group) {
      this.queryCondition.group = this.$route.query.group;
    };
  },
  watch: {},
}
</script>
<style lang="less">
@import '../../main.less';
.customerCenterSearch {
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
  .el-date-editor--daterange.el-input {
    width: 100%;
  }
}

.customerCenterSearch a {
  color: @primaryBlue;
}

.customerCenterSearch .btn {
  padding-left: 90px;
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
  cursor: pointer;
  font-size: 12px;
  line-height: 30px;
  text-decoration: underline;
  margin-left: @baseSpace * 2;
}
</style>
