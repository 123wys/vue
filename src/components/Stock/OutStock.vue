<template>
  <div class="out-stock">
    <el-form v-model='queryCondition' label-width="90px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="出库单号">
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
          <el-form-item label="出库类型">
            <el-select class="w200" v-model="queryCondition.ticketTypes" size="small">
              <el-option v-for="item in ticketTypeEnum" :label="item.label" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出库日期">
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
      <div class="number">出库数量</div>
      <div class="number">正品</div>
      <div class="number">次品</div>
    </div>
    <div class="list-action">
      <paging :page-size="pageSize" :page-number="pageNumber" :total='data.amount' @current-change="currentChangeHandler"></paging>
    </div>
    <div v-loading="loading">
      <template v-if="data&&data.amount">
        <div class="ticket" v-for="(ticketItem,index) of data.beanList" :key="ticketItem.ticket.ticketId">
          <div class="item-head">
            <div class="ticketmsg">
              <span>出库单号：<span>{{ticketItem.ticket.ticketId}}</span></span>
              <span>仓库：<span>{{repositoryEnum[ticketItem.ticket.wmsId]}}</span><span v-if="!repositoryEnum[ticketItem.ticket.wmsId]" class="red">已删除</span></span>
              <span>类型：<span>{{getTicketType(ticketItem.ticket.ticketType)}}</span></span>
              <span>申请时间：<span>{{ticketItem.ticket.createTime}}</span></span>
              <span>出库时间：<span>{{(ticketItem.ticket.auditTime||ticketItem.ticket.doneTime).slice(0,10)}}</span></span>
              <div class="remark" v-show="ticketItem.ticket.auditMemo || ticketItem.ticket.ticketComments">
                <div v-if="ticketItem.ticket.ticketComments">
                  <span>备注信息：</span><span class="yellow" v-text="ticketItem.ticket.ticketComments"></span>
                </div>
                <div v-if="ticketItem.ticket.auditMemo">
                  <span>审核留言：</span><span class="red" v-text="ticketItem.ticket.auditMemo"></span>
                </div>
              </div>
            </div>
            <div></div>
          </div>
          <div class="sku" v-for="sku of ticketItem.items" :key="sku.outerId">
            <div class="title" v-text="sku.skuTitle"></div>
            <div class="specification">
              <div v-text="sku.skuProperties"></div>
              <div v-text="sku.outerId" class="muted"></div>
            </div>
            <div class="number" v-text="sku.quantityNum + sku.defectiveNum"></div>
            <div class="number" v-text="sku.quantityNum"></div>
            <div class="number" v-text="sku.defectiveNum"></div>
          </div>
        </div>
      </template>
      <searchNull v-else></searchNull>
    </div>
    <div class="foot">
      <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" :total="data.amount" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import dateFormat from 'dateFormat';
import Paging from '../common/Paging';
const queryTicketUrl = '/warehouse/warehouse/queryTicket';
let ticketTypesInit = [201, 202, 203];
export default {
  name: 'out-stock',
  components: {
    Paging,
  },
  data() {
    return {
      queryCondition: {
        ticketIds: '',
        ticketTypes: ticketTypesInit,
        skuTitle: '',
        outerId: '',
        auditStatus: 1,
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
      ticketTypeEnum: [{
        key: ticketTypesInit,
        label: '全部',
      }, {
        key: 201,
        label: '销售预占/出库',
      }, {
        key: 202,
        label: '冻结预占/出库',
      }, {
        key: 203,
        label: '盘整出库',
      }],
      data: {
        amount: 0,
        beanList: [],
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
    this.queryCondition.ticketTypes = ticketTypesInit;
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
    getTicketType(val) {
      let type = this.ticketTypeEnum.find(n => n.key === parseInt(val));
      return type ? type.label : '';
    },
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.out-stock {
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
  flex-basis: 12%;
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
