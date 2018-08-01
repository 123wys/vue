<template>
  <div class="management">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>售后管理</el-breadcrumb-item>
      <el-breadcrumb-item>售后单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="warrantyForm">
      <el-form label-width="84px" label-position="right" :model="warrantyForm" ref="warrantyForm">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="售后单号" prop="warrantyId">
              <el-input v-model.trim="warrantyForm.warrantyId" type="number" placeholder="仅支持数字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商城订单" prop="extOrderId">
              <el-input v-model.trim="warrantyForm.extOrderId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品自编码" prop="outerId">
              <el-input v-model.trim="warrantyForm.outerId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品名称" prop="skuTitle">
              <el-input v-model.trim="warrantyForm.skuTitle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="售后类型" prop="serviceType">
              <el-select v-model="warrantyForm.serviceType">
                <el-option v-for="(key, value) in warrantyType" :label="key" :value="value" :key="key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="售后单状态" prop="warrantyStatus">
              <el-select v-model="warrantyForm.warrantyStatus">
                <el-option v-for="(key, value) in warrantyStatus" :label="key" :value="value" :key="key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收件人" prop="contactName">
              <el-input v-model.trim="warrantyForm.contactName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号" prop="contactMobile">
              <el-input v-model="warrantyForm.contactMobile"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="申请时间">
              <el-date-picker type="daterange" style="width:100%;" v-model="timeValue" placeholder="请选择日期范围" :picker-options="pickerOptions" key="dateA"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" size="small" @click="search">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="beanList" v-if="searchFlag" v-loading="loading" element-loading-text="拼命加载中.">
      <div class="head-border">
        <div class="list-head">
          <div class="warrantyId">售后单号</div>
          <div class="warrantyType">售后类型</div>
          <div class="extOrderId">订单编号</div>
          <div class="applicant">申请人</div>
          <div class="createTime">申请时间</div>
          <div class="rightsPro">维权原因</div>
          <div class="warrantyStatus">售后单状态</div>
          <div class="operation">操作</div>
        </div>
        <div class="list-action">
          <el-checkbox v-model="selectAll" :indeterminate="isIndeterminate">全选</el-checkbox>
          <div class="check">
            <el-button size="small" @click="batchActionReview">批量审核</el-button>
          </div>
          <paging :page-size="pageSize" :page-number="pageNumber" :total='warrantyData.amount' @current-change="currentChangeHandler"></paging>
        </div>
      </div>
      <div class="searchData" v-if="warrantyData.amount > 0">
      	<div class="list-item" v-for="(option, i) in warrantyData.beanList">
	        <div class="warrantyId">
	          <el-checkbox v-model="selection[i]" :disabled="option.warranty.warrantyStatus != 0"></el-checkbox>
	          <span>{{option.warranty.warrantyId}}</span>
	        </div>
	        <div class="warrantyType">{{warrantyType[option.warranty.serviceType]}}</div>
	        <div class="extOrderId">{{option.warranty.extOrderId}}</div>
	        <div class="applicant">{{option.warranty.contactName}}</div>
	        <div class="createTime">{{option.warranty.createTime}}</div>
	        <div class="rightsPro" v-if="option.items[0]">{{option.items[0].skuProblem}}</div>
          <div class="rightsPro" v-else>无</div>
	        <div class="warrantyStatus">{{warrantyStatus[option.warranty.warrantyStatus]}}</div>
	        <div class="operation">
            <!-- <template v-if="option.warranty.serviceType === 1">
              <el-button type="primary" size="small" @click="viewInoive(option)">查看发票</el-button>
            </template>
            <template v-else> -->
              <el-button type="primary" size="small" v-if="option.warranty.warrantyStatus === 0" @click="review(i)">审核</el-button>
              <el-button size="small" @click="warrantyDetail(i)">详情</el-button>
            <!-- </template> -->
	        </div>
	      </div>
      </div>
      <searchNull v-else></searchNull>
    </div>
    <div class="rightPage">
      <el-pagination @size-change="handleSizeChange" @current-change="currentChangeHandler" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="warrantyData.amount">
      </el-pagination>
    </div>
    <el-dialog v-model="dialog" title="售后单审核" size="tiny" custom-class="warrantyDialog">
      <el-form v-model="reviewForm" label-width="80px;" ref="reviewForm">
        <el-form-item label="审核结果" prop="isApproval">
          <el-radio v-model="reviewForm.isApproval" label="1">通过</el-radio>
          <el-radio v-model="reviewForm.isApproval" label="0">不通过</el-radio>
        </el-form-item>
        <el-form-item label="审核备注" prop="comment">
          <el-input type="textarea" :autosize="{minRows: 3, maxRows: 6}" :maxlength="140" v-model="reviewForm.comment" placeholder="请输入审核备注(不超过140个字)"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogSure">确 定</el-button>
        <el-button size="small" @click="dialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="发票"
      :visible.sync="dialogVisible"
      size="small"
      >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Paging from '../common/Paging';
import dateFormat from 'dateFormat';
import axios from 'axios';
import debounce from 'lodash/debounce';
export default {
  name: 'after-sale-management',
  data() {
    return {
      dialogVisible: false,
      searchFlag: false,
      loading: false,
      dialog: false,
      pageSize: 10,
      pageNumber: 1,
      warrantyData: {},
      timeValue: [],
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
      warrantyForm: {
        warrantyId: '',
        extOrderId: '',
        outerId: '',
        skuTitle: '',
        serviceType: '',
        warrantyStatus: '',
        contactName: '',
        contactMobile: '',
        beginCreateTime: '',
        endCreateTime: ''
      },
      selection: [],
      currentWarrantyIds: [],
      reviewForm: {
        isApproval: '1',
        comment: '',
      },
    }
  },
  computed: {
    warrantyStatus() {
      return this.$store.state.enumSet.warrantyStatusType;
    },
    warrantyType() {
      // return this.$store.state.enumSet.warrantyServiceType;
      let options = {
        1: '发票',
        3: '仅退款/退款退货',
        4: '换货'
      };
      // return {3: '退款'};
      return options;
    },
    selectAll: {
      get() {
        let result = [];
        this.warrantyData.beanList.forEach((ele, ind) => {
          result.push(ele.warranty.warrantyStatus === 0);
        })
        return this.selection.length === 0 ? false : this.selection.length && this.selection.every((m, n) => m === result[n]) && this.selectIds.length > 0;
      },
      set(val) {
        if (val) {
          this.selection = this.selection.map((ele, ind) => {
            ele = this.warrantyData.beanList[ind].warranty.warrantyStatus === 0;
            return ele;
          })
        } else {
          this.selection = new Array(this.warrantyData.beanList.length).fill(val);
        }
      }
    },
    selectIds() {
      let arr = [];
      this.selection.forEach((m, n) => {
        if (m) {
          arr.push(this.warrantyData.beanList[n].warranty.warrantyId);
        }
      })
      return arr;
    },
    isIndeterminate() {
      let num = 0;
      this.warrantyData.beanList.forEach(ele => {
        if (ele.warranty.warrantyStatus < 1) {
          num++;
        }
      })
      return this.selectIds.length > 0 && this.selectIds.length !== num;
    },
  },
  methods: {
    viewInoive(option) {
      console.log(option);
    },
    // 翻页
    currentChangeHandler(args) {
      if (this.pageNumber === args) return;
      this.pageNumber = args;
      this.search();
    },
    // 更换每页显示数
    handleSizeChange(args) {
      this.pageSize = args;
      this.search();
    },
    // 查询数据
    search: debounce(function() {
      this.loading = true;
      let query = {
        queryCondition: this.warrantyForm,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      };
      // 默认售后单查6个月
      query.queryCondition.beginCreateTime = dateFormat(new Date() - 180 * 24 * 60 * 60 * 1000, 'yyyy-mm-dd') + ' 00:00:00';
      query.queryCondition.endCreateTime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      // 用户自行填写时间
      if (this.timeValue.length > 0 && !this.timeValue.includes(null)) {
        let timeRange = new Date() - new Date(this.timeValue[0]);
        if (timeRange - 180 * 24 * 60 * 60 * 1000 > 0) {
          this.$message.error('售后单查询时间距今不能大于6个月');
          return;
        }
        query.queryCondition.beginCreateTime = dateFormat(new Date(this.timeValue[0]), 'yyyy-mm-dd') + ' 00:00:00';
        query.queryCondition.endCreateTime = dateFormat(new Date(this.timeValue[1]), 'yyyy-mm-dd') + ' 23:59:59';
        if (new Date(this.timeValue[1]).getMonth() === new Date().getMonth() && new Date(this.timeValue[1]).getDate() === new Date().getDate()) {
          query.queryCondition.endCreateTime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
        }
      }
      // console.log(query);
      axios.post('afterSale/afterSale/query', query)
        .then(res => {
          this.warrantyData = res.data;
          // console.log(this.warrantyData);
          this.searchFlag = true;
          this.loading = false;
        })
        .catch(err => {
          this.$message.error(err.response ? err.response.data : err);
          this.loading = false;
        })
    }, 600, {
      leading: true,
      trailing: false
    }),
    // 审核
    review(i) {
      this.reviewFormReset();
      this.currentWarrantyIds = [this.warrantyData.beanList[i].warranty.warrantyId];
      this.dialog = true;
    },
    batchActionReview() {
      this.currentWarrantyIds = [];
      if (this.selectIds.length === 0) {
        this.$message.info('请至少选择一条售后单');
        return;
      }
      this.reviewFormReset();
      this.dialog = true;
    },
    dialogSure() {
      let audit = {
        warrantyIds: this.selectIds,
        isApproval: this.reviewForm.isApproval > 0,
        comment: this.reviewForm.comment,
      };
      if (this.currentWarrantyIds.length > 0) {
        audit.warrantyIds = this.currentWarrantyIds;
      }
      axios.post('afterSale/afterSale/audit', audit)
        .then(res => {
          if (res.data.length > 0) {
            this.$message.success('审核成功！');
            this.search();
          }
        })
        .catch(err => {
          this.$message.error(err.response ? err.response.data : err)
        })
      this.dialog = false;
    },
    // 售后单详情
    warrantyDetail(i) {
      let order = {
        extOrderId: this.warrantyData.beanList[i].warranty.extOrderId,
        create: 0
      };
      this.$store.commit('setASOrder', order);
      this.$router.push('/aftersale');
    },
    // 表单重置
    reviewFormReset() {
      this.reviewForm = {
        isApproval: '1',
        comment: '',
      };
    },
  },
  activated() {
    this.$refs.warrantyForm.resetFields();
    if (Number(this.$route.query.type) === 1) {
      this.warrantyForm.serviceType = '1';
    }
    this.search();
  },
  components: {
    Paging
  },
  watch: {
    warrantyData: {
      handler(val) {
        this.selection = new Array(val.beanList.length).fill(false);
      },
      deep: true,
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.management {
  padding: 15px;
  .beanList {
  	.searchNull {
  		padding: 150px 0 100px 0;
  		background-color: @white;
  		border: 1px solid @borderLine;
  	}
  }
}

.warrantyForm {
  margin: 10px 0;
}

.list-head {
  height: 40px;
  background-color: @tabBg;
  border-bottom: 1px solid @borderLine;
  > div {
    line-height: 30px;
    font-size: @fontSize14;
    font-weight: 400;
    text-align: center;
  }
}

.warrantyId {
  flex-basis: 10%;
}

.warrantyType {
  flex-basis: 8%;
}

.extOrderId {
  flex-basis: 17%;
}

.applicant {
  flex-basis: 7%;
}

.createTime {
  flex-basis: 13%;
}

.rightsPro {
  flex-basis: 20%;
}

.warrantyStatus {
  flex-basis: 10%;
}

.operation {
  flex-basis: 15%;
}

.list-head,
.list-action,
.list-item {
  display: flex;
  padding: 5px 10px;
  align-items: baseline;
}

.list-action,
.list-item {
  background-color: @white;
}

.list-item {
  border: 1px solid @borderLine;
  border-bottom: none;
  &:last-of-type {
    border-bottom: 1px solid @borderLine;
  }
  > div {
    text-align: center;
  }
  .operation {
    text-align: right;
  }
}

.check {
  flex-grow: 1;
  padding-left: 20px;
}

.head-border {
  border: 1px solid @borderLine;
  margin-bottom: 10px;
}

.rightPage {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
<style lang="less">
.management {
  .warrantyForm {
    .el-form-item__label {
      font-size: 12px;
    }
    .el-input__inner {
      height: 30px;
    }
    .el-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>
<style lang="less">
.management {
  .warrantyDialog {
    .el-dialog__header {
      .el-dialog__title {
        font-size: 14px;
      }
    }
    .el-dialog__body {
      .el-form-item {
        display: flex;
        margin-bottom: 10px;
        .el-form-item__label {
          font-size: 12px;
        }
        .el-form-item__content {
          width: 300px;
        }
      }
    }
  }
}
</style>
