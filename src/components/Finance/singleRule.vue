<template>
  <div class="supplierList">
    <el-row style="margin: 10px 0 15px 0;">
      <el-col :span="14" class="searchRole">
        <el-input size="small" placeholder="输入商品名称/商品自编码" v-model="search" @keyup.enter.native="searchSKU">
          <div slot="append" style="cursor: pointer;" @click="searchSKU">搜索</div>
        </el-input>
      </el-col>
    </el-row>
    <div class="head">
      <div class="cols">
        <div class="goods">
          商品SKU
        </div>
        <div>
          <span>售价</span>
        </div>
      </div>
    </div>
    <!--<el-checkbox v-model="isSelectAll"></el-checkbox>-->
    <div class="body" style="height: 390px;overflow: auto;">
      <template v-if="recData && recData.amount">
        <div style="margin: 10px 0;" v-for="(offering,parentIndex) in recData.offeringList">
          <div class="row" style="background-color: #E5E9F2;">
            <div class="goods">
              <el-checkbox v-model="selectsAll[parentIndex]"
                           @change="isSelectAll(selectsAll,parentIndex)"></el-checkbox>
              <img :src="offering.imageFileName" width="38" height="38" style="margin-left: 9px;">
              <div style="margin-left: 10px;">
                <div class="goodsName" v-text="offering.offeringName"></div>
                <div><i :class="getIcon(offering.platformId)"></i>
                  &nbsp;<span class="Name">{{shopEnum[offering.shopId]}}</span>
                  <!--<span v-text="offering.catalogName"></span>-->
                </div>
              </div>
            </div>
          </div>
          <div class="row" v-for="(sku,index) in offering.skuList">
            <div class="goodsDetail">
              <el-checkbox v-model="selects[parentIndex][index]"
                           @change="singleChecked(selects,parentIndex,index)"></el-checkbox>
              <div class="list">
                <div v-text="sku.skuCharSpec"></div>
                <span class="outerId"> 商家自编码：{{sku.outerId}}</span>
              </div>
            </div>
            <div>
              <span style="padding-right: 18px;">
              {{sku.price}}
            </span>
            </div>
          </div>
        </div>
        <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                       :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize"
                       :total="recData.amount" layout="total, sizes, prev, pager, next, jumper" style="float: right;margin-bottom:10px;">
        </el-pagination>
      </template>
      <searchNull v-else style="margin-top: 180px;"></searchNull>
    </div>
    <div class="btns">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </div>
</template>
<script>
  import {
    mapState
  } from 'vuex';
  export default {
    props: {
      recData: {
        type: Object,
        default: function () {
          return {
            amount: 0,
            offeringList: [],
          }
        },
      },
      pageSize: {
        required: true,
      },
      pageNumber: {
        required: true,
      },
    },
    data() {
      return {
        search: '',
        selects: [],
        selectsAll: [],
      }
    },
    computed: {
      tenantEnum() {
        return this.$store.getters.tenantEnum;
      },
      ...mapState({
        shopEnum: state => state.enumSet.shopEnum,
      })
    },
    watch: {
      recData: {
        handler(val) {
          this.selects = [];
          this.selectsAll = new Array(val.offeringList.length).fill(false);
          val.offeringList.forEach((n, i) => {
            this.selects.splice(i, 0, new Array(n.skuList.length).fill(false));
          })
        },
        deep: true,
        immediate: true,
      },
    },
    methods: {
//        全选
      isSelectAll(val, index) {
        let lens = this.selects[index];
        for (let i = 0; i < lens.length; i++) {
          lens.splice(i, 1, val[index])
        }
      },
//      单选
      singleChecked(val, parentIndex, index) {
        let select = this.selects[parentIndex].every(n => n);
        if (!select) {
          this.selectsAll.splice(parentIndex, 1, false);
        }
      },
//        查询
      searchSKU() {
        this.$emit('searchskuList', this.search);
      },
//      确定提交
      confirm() {
        let sellectedIds = [];
        this.selects.forEach((n, i) => {
          n.forEach((m, j) => {
            if (m) {
              let supplier = {
                supplierName: this.tenantEnum[this.recData.offeringList[i].supplierTenantId],
                supplierTenantId: this.recData.offeringList[i].supplierTenantId,
                shopId: this.recData.offeringList[i].shopId,
                platformId: this.recData.offeringList[i].platformId,
              }
              let target = Object.assign({}, supplier, this.recData.offeringList[i].skuList[j]);
              sellectedIds.push(target);
            }
          })
        })
        if (sellectedIds.length) {
          this.$emit('success', sellectedIds);
        } else {
          this.$msgbox({
            message: '请选择商品SKU价格或百分比',
            type: 'error'
          })
        }
//        let bool = sellectedIds.every(n => {
//          return n.costPrice || n.numerator || n.numerator === 0;
//        })
//        if (bool && sellectedIds.length !== 0) {
//          this.$emit('success', sellectedIds);
//        } else {
//          this.$msgbox({
//            message: '请设置商品SKU价格或百分比',
//            type: 'error'
//          })
//        }
      },
//      取消
      cancel() {
//        this.clearSetskuList()
        this.$emit('cancel')
      },
      sizeChangeHandler(args) {
        this.$emit('size-change', args);
      },
      currentChangeHandler(args) {
        if (this.pageNumber === args) return;
        this.$emit('current-change', args);
      },
      getIcon(platformId) {
        return this.$store.state.enumSet.platform[platformId];
      },
      clearSetskuList() {
        this.selectsAll = new Array(this.recData.offeringList.length).fill(false);
        this.recData.offeringList.forEach((n, i) => {
          this.selects.splice(i, 0, new Array(n.skuList.length).fill(false));
        })
//        this.setAllPrice.forEach((n, i) => {
//          this.setAllPrice.splice(i, 1, null);
//        })
//        this.setPrice.forEach((n, i) => {
//          n.forEach((m, j) => {
//            this.setPrice[i].splice(j, 1, null);
//            this.selects[i].splice(j, 1, false);
//          })
//        })
      }
    },
  }
</script>
<style lang="less" scoped>
  @import '../../main.less';

  .supplierList {
    margin-bottom: 10px;

  .pl {
    padding-left: @baseSpace *3 !important;
  }

  .supplierName {
    font-size: 14px;
    color: #000000;
  }

  .supplierNumbers {
    font-size: 12px;
    color: #302057;
    margin-left: 10px;
  }

  .btns {
    padding-top: 20px;
    border-top: 1px solid #E5E9F2;
    display: flex;
    justify-content: flex-end;
  }

  }
  /*头部*/
  .head {
    border: solid 1px @borderLine;

  .cols {
    font-size: 14px;
    background-color: @tabBg;
    height: @baseSpace *6;
    line-height: @baseSpace *6;
    padding: 0 @baseSpace *13;
    display: flex;
    justify-content: space-between;
  }

  }
  /*中间*/
  .body {

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: @white;
    padding: @baseSpace *2 @baseSpace *3;
    border: solid 1px @borderLine;

  +
  .row {
    border-top: none;
  }

  .goods {
    display: flex;
    justify-content: flex-start;
    align-items: center;

  .goodsName {
    color: #324057;
    font-size: 13px;
    padding-bottom: 3px;
  }

  .Name {
    font-size: 12px;
  }

  }

  .goodsDetail {
    background-color: @white;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: @baseFont;
    color: #324057;
    padding-left: 28px;

  .list {
    padding-left: 29px;

  .outerId {
    color: #8492A6;
  }

  }

  }
  }
  }
</style>
<style lang="less">
  @import '../../main.less';

  .batch-btn {

  .el-button {
    padding-top: 5.5px;
    padding-bottom: 5.5px;
    // border-radius: 0;
  }

  }

  .finance {

  .el-dialog__body {
    padding: @baseSpace *4;
  }

  }

  .searchRole {

  .el-input {
    width: 300px;

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

  }
  .el-input__inner {
    display: inline-block !important;
  }

  }
  .el-dialog__body {
    padding: 15px 20px;
  }

  .price {

  .el-input {
    width: 100px !important;
    display: inline-block !important;
  }

  input {
    text-align: right;
    height: 30px;
    width: 100px;
  }

  }
</style>
