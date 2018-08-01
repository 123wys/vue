<template>
  <div class="procurement-plan">
    <el-form v-model='queryCondition' label-width="90px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="采购单号">
            <el-input class="w200" v-model.trim="queryCondition.ticketIds" size="small" @keyup.enter.native="searchHandler"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品名称">
            <el-input class="w200" v-model.trim="queryCondition.skuTitle" size="small" @keyup.enter.native="searchHandler"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品自编码">
            <el-input class="w200" v-model.trim="queryCondition.outerId" size="small" @keyup.enter.native="searchHandler"></el-input>
          </el-form-item>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="审核状态">
            <el-select class="w200" v-model="queryCondition.auditStatus" size="small">
              <el-option v-for="item in auditStatusEnum" :label="item.label" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="仓库">
            <el-select class="w200" v-model="queryCondition.wmsIds" size="small">
              <el-option v-for="item in repositoryArr" :label="item.label" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请日期">
            <el-date-picker class="w200" v-model="createdDateRange" type="daterange" size="small" placeholder="选择日期范围">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="入库日期">
            <el-date-picker class="w200" v-model="auditDateRange" type="daterange" size="small" placeholder="选择日期范围">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" size="small" @click="searchHandler">搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="list-head">
      <div class="title">商品名称</div>
      <div class="specification">规格</div>
      <div class="number">入库数量</div>
      <div class="operation">操作</div>
    </div>
    <div class="list-action">
      <paging :page-size="pageSize" :page-number="pageNumber" :total='data.amount' @current-change="currentChangeHandler"></paging>
    </div>
    <div v-loading="loading">
      <template v-if="data&&data.amount">
        <div class="ticket" v-for="(ticketItem,index) of data.beanList" :key="ticketItem.ticket.ticketId">
          <div class="item-head">
            <div class="ticketmsg">
              <span v-if="checkTimeOut(ticketItem)" class="red"><i class="iconfont icon-jinggao"></i>超时</span>
              <span>采购单号：<span>{{ticketItem.ticket.ticketId}}</span></span>
              <span>仓库：<span>{{repositoryEnum[ticketItem.ticket.wmsId]}}</span><span v-if="!repositoryEnum[ticketItem.ticket.wmsId]" class="red">已删除</span></span>
              <span>申请时间：<span>{{ticketItem.ticket.createTime}}</span></span>
              <span :class="{red: checkTimeOut(ticketItem)}">入库时间：<span>{{ticketItem.ticket.auditTime.slice(0,10)}}</span></span>
              <span>状态：<span :class="getAuditStatusInfo(ticketItem.ticket.auditStatus,'color')">{{getAuditStatusInfo(ticketItem.ticket.auditStatus,'label')}}</span></span>
              <div class="remark" v-show="ticketItem.ticket.auditMemo || ticketItem.ticket.ticketComments">
                <div v-if="ticketItem.ticket.ticketComments">
                  <span>备注信息：</span><span class="yellow" v-text="ticketItem.ticket.ticketComments"></span>
                </div>
                <div v-if="ticketItem.ticket.auditMemo">
                  <span>审核留言：</span><span class="red" v-text="ticketItem.ticket.auditMemo"></span>
                </div>
              </div>
            </div>
            <div class="operation">
              <el-button size="small" type="primary" v-if="ticketItem.ticket.auditStatus===0" :loading="buttons[index].aduit" @click="showAduitDialog(ticketItem.ticket.ticketId,index)">审核</el-button>
              <el-button size="small" v-if="ticketItem.ticket.auditStatus!==1" @click="editPlan(ticketItem)">编辑</el-button>
              <el-button size="small" v-if="ticketItem.ticket.auditStatus==0" :loading="buttons[index].delete" @click="deletePlan(ticketItem.ticket.ticketId,index)">删除</el-button>
            </div>
          </div>
          <div class="sku" v-for="sku of ticketItem.items" :key="sku.outerId">
            <div class="title" v-text="sku.skuTitle"></div>
            <div class="specification">
              <div v-text="sku.skuProperties"></div>
              <div v-text="sku.outerId" class="muted"></div>
            </div>
            <div class="number" v-text="sku.quantityNum"></div>
          </div>
        </div>
      </template>
      <searchNull v-else></searchNull>
    </div>
    <div class="foot">
      <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" :total="data.amount" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <el-dialog v-model="dialogShow" title="审核采购计划" size="tiny">
      <el-input type="textarea" :maxlength="50" :rows="2" v-model="aduitMsg.comment" placeholder="请输入50字内审核意见"></el-input>
      <div slot="footer">
        <el-button class="red" icon="circle-cross" size="small" @click="aduitPlan(false)">审核不通过</el-button>
        <el-button class="blue" icon="circle-check" size="small" @click="aduitPlan(true)">审核通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import dateFormat from 'dateFormat';
import Paging from '../common/Paging';
const queryTicketUrl = '/warehouse/warehouse/queryTicket';
const approvalPurchasePlanUrl = '/warehouse/warehouse/approvalPurchasePlan';
const cancelPurchasePlanUrl = '/warehouse/warehouse/cancelPurchasePlan';
export default {
  name: 'procurement-plan',
  components: {
    Paging,
  },
  data() {
    return {
      queryCondition: {
        ticketIds: '',
        ticketTypes: 101,
        skuTitle: '',
        outerId: '',
        auditStatus: '',
        wmsIds: '',
        beginAuditDate: '',
        endAuditDate: '',
        beginCreatedDate: '',
        endCreatedDate: '',
        ticketStatus: [0, 1, 2, 3],
      },
      auditDateRange: [],
      createdDateRange: [],
      pageSize: 10,
      pageNumber: 1,
      loading: false,
      auditStatusEnum: [{
        key: '',
        label: '全部',
      }, {
        key: 0,
        label: '待审核',
        color: 'blue',
      }, {
        key: 1,
        label: '审核通过',
        color: 'green',
      }, {
        key: 2,
        label: '审核不通过',
        color: 'red',
      }],
      editMode: 0, // 0:展示列表;1:新建;2:编辑
      procurementPlan: {
        ticket: {
          ticketId: '',
          ticketTitle: 'title',
          barCodeType: '',
          wmsId: '',
          auditTime: '',
          ticketComments: '',
        },
        items: [],
      },
      data: {
        amount: 0,
        beanList: [],
      },
      buttons: [],
      dialogShow: false,
      aduitMsg: {
        ticketId: '',
        index: '',
        comment: '',
      },
    }
  },
  computed: {
    repositoryEnum() {
      return this.$store.state.enumSet.repositoryEnum;
    },
    repositoryArr() {
      let arr = [{
        key: '',
        label: '全部'
      }];
      Object.keys(this.repositoryEnum).forEach(n => {
        arr.push({
          key: n,
          label: this.repositoryEnum[n]
        })
      });
      return arr;
    }
  },
  activated() {
    this.searchHandler();
  },
  methods: {
    searchHandler() {
      this.loading = true;
      if (this.auditDateRange[0]) {
        this.queryCondition.beginAuditDate = dateFormat(this.auditDateRange[0], 'yyyy-mm-dd HH:MM:ss');
        this.queryCondition.endAuditDate = (dateFormat(this.auditDateRange[1], 'yyyy-mm-dd') + ' 23:59:59');
      } else {
        this.queryCondition.beginAuditDate = '';
        this.queryCondition.endAuditDate = '';
      }
      if (this.createdDateRange[0]) {
        this.queryCondition.beginCreatedDate = dateFormat(this.createdDateRange[0], 'yyyy-mm-dd HH:MM:ss');
        this.queryCondition.endCreatedDate = (dateFormat(this.createdDateRange[1], 'yyyy-mm-dd') + ' 23:59:59');
      } else {
        this.queryCondition.beginCreatedDate = '';
        this.queryCondition.endCreatedDate = '';
      }
      // this.queryCondition.beginAuditDate = this.auditDateRange[0];
      // this.queryCondition.endAuditDate = this.auditDateRange[1];
      // this.queryCondition.beginCreatedDate = this.createdDateRange[0];
      // this.queryCondition.endCreatedDate = this.createdDateRange[1];
      let query = {
        queryCondition: this.queryCondition,
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        sortType: {
          sortType: 'createTime',
          direction: 'DESCENDING',
        },
      }
      axios.post(queryTicketUrl, query).then(response => {
        this.loading = false;
        if (!response.data.beanList) {
          response.data.beanList = [];
        }
        this.data = response.data;
        this.buttons = new Array(this.data.beanList.length).fill({
          aduit: false,
          delete: false,
        });
      }).catch(err => {
        this.loading = false;
        this.$msgbox({
          title: '提示',
          message: '查询失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    sizeChangeHandler(size) {
      this.pageSize = size;
      this.searchHandler();
    },
    currentChangeHandler(number) {
      this.pageNumber = number;
      this.searchHandler();
    },
    getAuditStatusInfo(key, prop) {
      return this.auditStatusEnum.find(n => n.key === key)[prop];
    },
    checkTimeOut(ticket) { // 是否超时
      if (ticket.auditStatus === 1) return false;
      let lastTime = ticket.ticket.auditTime.slice(0, 12) + ' 23:59:59.999';
      return Date.now() > new Date(lastTime).getTime();
    },
    showAduitDialog(ticketId, index) {
      this.aduitMsg.ticketId = ticketId;
      this.aduitMsg.index = index;
      this.aduitMsg.comment = '';
      this.dialogShow = true;
    },
    aduitPlan(approval) {
      if (!this.aduitMsg.comment) {
        this.$message.error('请输入审核意见');
        return
      }
      this.buttons[this.aduitMsg.index].aduit = true;
      this.dialogShow = false;
      let condition = {
        ticketId: this.aduitMsg.ticketId,
        comment: this.aduitMsg.comment,
        approval,
      }
      axios.post(approvalPurchasePlanUrl, condition).then(response => {
        this.buttons[this.aduitMsg.index].aduit = false;
        this.$message.success('操作成功！');
        this.searchHandler();
      }).catch(err => {
        this.buttons[this.aduitMsg.index].aduit = false;
        this.$msgbox({
          title: '提示',
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    editPlan(ticket) {
      this.$store.commit('setPlan', ticket);
      this.$router.push('/procurementplan');
    },
    deletePlan(ticketId, index) {
      this.$confirm('确定删除该采购单？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttons[index].delete = true;
        axios.post(cancelPurchasePlanUrl, {
          ticketId,
          comment: '删除',
        }).then(() => {
          this.buttons[index].delete = false;
          this.$message.success('删除成功！');
          this.searchHandler();
        }).catch(err => {
          this.buttons[index].delete = false;
          this.$msgbox({
            title: '提示',
            message: '操作失败，' + (err.response ? err.response.data : err),
            type: 'error',
          })
        })
      }).catch(() => {});
    },
    clearProcurementPlan() {
      this.procurementPlan = {
        ticket: {
          ticketId: '',
          ticketTitle: 'title',
          barCodeType: '',
          wmsId: '',
          auditTime: '',
          ticketComments: '',
        },
        items: [],
      }
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.procurement-plan {
  .el-form-item {
    margin-bottom: 10px;
  }
}

.w200 {
  width: 200px;
}

.list-head {
  background-color: @tabBg;
  font-size: 14px;
  padding: @baseSpace*2;
  border: solid 1px @borderLine;
  border-bottom: none;
  display: flex;
}

.list-action {
  border: solid 1px @borderLine;
  padding: @baseSpace*2;
  display: flex;
  /*justify-content: space-between;*/
  flex-direction: row-reverse;
  align-items: center;
  margin-bottom: @baseSpace*2;
}

.ticket {
  border: solid 1px @borderLine;
  margin-bottom: @baseSpace*3;
}

.item-head {
  padding: @baseSpace*2 @baseSpace*3;
  background-color: @parentItemBg;
  align-items: baseline;
  display: flex;
  justify-content: space-between;
}

.ticketmsg {
  >span {
    display: inline-block;
  }
  >*+* {
    margin-left: @baseSpace*5;
  }
}

.remark {
  border: solid 1px #ffdda4;
  border-radius: 5px;
  background-color: #fefce8;
  display: inline-block;
  margin: 10px 0 0 10px;
  min-width: 60%;
  padding: @baseSpace @baseSpace*2;
}

.ticket:hover .sku {
  background-color: @tabBg;
  transition: background-color 0.3s;
}

.sku {
  padding: @baseSpace*2 @baseSpace*3;
  border-top: solid 1px @borderLine;
  display: flex;
  background-color: @white;
}

.title {
  flex-basis: 40%;
}

.specification {
  flex-basis: 20%;
}

.number {
  flex-basis: 15%;
  text-align: right;
}

.operation {
  flex-basis: 25%;
  min-width: 160px;
  flex-shrink: 0;
  text-align: right;
}

.foot {
  text-align: right;
}

.searchNull {
  padding: 80px 0 20px;
  border: solid 1px @borderLine;
  background-color: @white;
}
</style>
