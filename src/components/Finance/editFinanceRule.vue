<template>
  <div class="containers" v-loading="loading">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item :to="{path: '/financeRule'}">结算规则</el-breadcrumb-item>
      <el-breadcrumb-item>编辑规则</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row style="margin: 10px 0 30px 0">
      <h2>{{tenantEnum[supplierInfo.supplierTenantId]}}</h2>
      <span class="shopAll">共有商品SKU<label style="margin-left: 5px;">{{resData.amount}}</label>个</span>
    </el-row>
    <el-row>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" label-position="left">
        <el-form-item label="规则名" prop="ruleName">
          <el-col :span="8" class="ruleName">
            <el-input class="form-input" size="small" placeholder="输入规则名" v-model.trim="ruleForm.ruleName"
                      :maxlength="20">
            </el-input>
            <el-checkbox v-model="checked" @change="activity(checked)">活动规则</el-checkbox>
          </el-col>
        </el-form-item>
        <el-form-item label="有效期" prop="expiryDate">
          <el-date-picker v-model="ruleForm.expiryDate" size="small" type="daterange" placeholder="选择日期范围">
          </el-date-picker>
        </el-form-item>
        </el-form-item>
        <el-form-item label="结算订单" prop="type">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox v-for="(value,key) in types" :label="key" :value="value">{{value}}</el-checkbox>
          </el-checkbox-group>
          <el-checkbox v-model="isChecked" @change="IsChecked(isChecked)">售后单&nbsp;<span style="color: #8492A6">(包含退款中、退款关闭、退货中、退货关闭)</span>
          </el-checkbox>
        </el-form-item>
        <el-form-item label="规则类型" prop="ruleType">
          <el-radio-group v-model="ruleForm.ruleType" @change="clearPrice">
            <el-radio :label="1" v-if="ruleForm.ruleType===1">按供货价</el-radio>
            <el-radio :label="2" v-if="ruleForm.ruleType===2">按销售比例</span></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品设置" class="discount">
          <template v-if="ruleForm.ruleType === 2">
            <el-radio-group v-model="ruleForm.discount">
              <template v-if="IssetAll">
                <el-radio :label="1">所有商品统一比例&nbsp;<span style="color:#8492A6">(自动匹配关联供应商的所有商品)</span></el-radio>
                <el-input placeholder="输入整数" v-model="ruleForm.inputDiscount"
                          @keyup.native="Discount(ruleForm)" style="margin-right: 20px;"></el-input>
              </template>
              <el-radio :label="2" v-if="!IssetAll">部分商品设置比例</el-radio>
            </el-radio-group>
            <span v-if="IssetAll" style="position: relative;left:-40px;">%</span>
            <template v-if="!IssetAll">
              <span style="font-size:12px;">已选商品SKU&nbsp;{{addRuleSKU.length}}个</span>&nbsp;&nbsp;
              <el-button type="text" @click="setCommondity">增加SKU</el-button>
            </template>
          </template>
          <template v-if="addRuleSKU.length">
            <div v-if="ruleForm.ruleType===1">
              <span>已选商品SKU&nbsp;{{addRuleSKU.length}}个</span>&nbsp;&nbsp;
              <el-button type="text" @click="setCommondity">增加SKU</el-button>
            </div>
            <el-col :span="22">
              <div class="head">
                <div class="list-head">
                  <div class="title">商品名称</div>
                  <div class="goods">商品SKU</div>
                  <div class="cupplyFeed">
                    <span v-if="ruleForm.ruleType===1">供货价</span>
                    <span v-else>佣金比例</span>
                  </div>
                  <div class="remove">操作</div>
                </div>
              </div>
              <div v-for="(offering,index) in addRuleSKU">
                <section class="body">
                  <div class="title">
                    <span v-text="offering.skuName"></span>
                  </div>
                  <div class="goods">
                    <div v-text="offering.skuCharSpec"></div>
                    <span class="outerId"> 商家自编码：{{offering.outerId}}</span>
                  </div>
                  <div class="cupplyFeed">
                    <template v-if="ruleForm.ruleType===1">
                      <el-input placeholder="0.00" v-model="setPrice[index]"
                                @keyup.native="setSkuPrice(setPrice,index)"></el-input>
                      <span>元</span>
                    </template>
                    <template v-else>
                      <el-input placeholder="输入整数" v-model="setPrice[index]"
                                @keyup.native="setSkuPrice(setPrice,index)"></el-input>
                      <span>%</span>
                    </template>

                  </div>
                  <div class="remove">
                    <!--<i class="el-icon-delete" @click="removeSKu(index)"></i>-->
                    <svg class="icon icon-remove" aria-hidden="true" @click="removeSKu(index)">
                      <use xlink:href="#icon-iconfont05"></use>
                    </svg>
                  </div>
                </section>
              </div>
            </el-col>
          </template>
          <!--<template v-if="ruleForm.ruleType===1">-->
          <!--<div>-->
          <!--<el-button type="text" @click="setCommondity">适用商品设置</el-button>-->
          <!--</div>-->
          <!--</template>-->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!--对话框-->
    <el-dialog title="适用商品设置" v-model="dialogVisible" size="small" top="10%" :close-on-click-modal="false"
               :show-close="false">
      <single-rule :recData="resData" @success="selectSKU" @cancel="closeDialog"
                   :ruleType="ruleForm.ruleType" :pageNumber='pageNumber' :pageSize='pageSize'
                   @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                   @searchskuList="searchOne" v-loading="loading"></single-rule>
    </el-dialog>
  </div>
</template>
<script>
  import singleRule from './singleRule';
  import dateFormat from 'dateFormat'
  import axios from 'axios';
  import bus from '../../store/bus.js'
  let queryProductsUrl = '/product/prodoffering/queryProducts'
  let setSettlementRule = '/finance/rule/setSettlementRule'
  export default {
    components: {
      singleRule
    },
    data() {
//        规则名称验证
      let ruleName = function (rule, value, callback) {
        if (!value) {
          return callback(new Error('规则名称不能为空'))
        } else {
          return callback();
        }
      }
//        日期验证
      let dateCheck = function (rule, value, callback) {
        if (!value.length || value[0] === null && value[1] === null) {
          return callback(new Error('日期不能为空'));
        } else {
          return callback();
        }
      }
      return {
        IssetAll: true,
        dialogVisible: false,
        pageSize: 10,
        pageNumber: 1,
        supplierId: '',
        loading: false,
        checked: false,
        isChecked: false,
        isAll: true,
        supplierInfo: {},
        addRuleSKU: [],
        setPrice: [],
        nums: '1,2,4,5',
        types: {
          1: '待发货',
          3: '已发货',
          4: '已完成',
        },
        resData: {
          amount: 0,
          supplierName: '',
          offeringList: []
        },
        ruleForm: {
          ruleType: 1,
          discount: 2,
          ruleName: '',
          type: [],
          expiryDate: [],
          activity: 0,
          inputDiscount: '',
          service: ''
        },
        rules: {
          ruleName: [
            {
              validator: ruleName,
              trigger: 'formSubmit'
            }
          ],
          type: [
            {type: 'array', required: true, message: '请选择(待发货、已发货、已完成)订单状态一种', trigger: 'formSubmit'}
          ],
          expiryDate: [
            {
              validator: dateCheck,
              trigger: 'formSubmit'
            }
          ]
        },
      }
    },
//    watch: {
//      addRuleSKU: {
//        handler(val) {
//          this.setPrice = new Array(val.length).fill('')
//        },
//        immediate: true,
//      },
//    },
    computed: {
      tenantEnum() {
        return this.$store.getters.tenantEnum;
      }
    },
    methods: {
      editRuleDetail() {
        this.supplierInfo = JSON.parse(window.sessionStorage.singleRuleDetail);
        this.ruleForm.ruleName = this.supplierInfo.ruleName;
        this.ruleForm.ruleFlag = this.supplierInfo.ruleFlag;
        if (this.ruleForm.ruleFlag) {
          this.checked = true;
        } else {
          this.checked = false;
        }
        this.ruleForm.activity = this.supplierInfo.ruleFlag;
        this.ruleForm.ruleType = this.supplierInfo.ruleType;
        this.ruleForm.expiryDate[0] = dateFormat(this.supplierInfo.effectiveDate, 'yyyy-mm-dd')
        this.ruleForm.expiryDate[1] = dateFormat(this.supplierInfo.expireDate, 'yyyy-mm-dd')
        this.ruleForm.type = this.supplierInfo.ordStatus.split(',');
        if (this.supplierInfo.warrantyStatus) {
          this.isChecked = true;
        } else {
          this.isChecked = false;
        }
        this.addRuleSKU = this.supplierInfo.skuList;
        this.supplierInfo.skuList.forEach((n, i) => {
          if (n.costPrice) {
            let price = parseFloat(n.costPrice / 100).toFixed(2) + '';
            let s = price.substr(price.length - 2, price.length - 1)
            if (s === '00') {
              this.setPrice[i] = price.substr(0, price.length - 3)
            } else {
              this.setPrice[i] = price.substr(0, price.length)
            }
          }
          if (!n.skuId) {
            this.IssetAll = true;
            this.ruleForm.discount = 1;
            this.ruleForm.inputDiscount = n.numerator;
            this.addRuleSKU = [];
            return;
          }
          if (n.numerator) {
            this.IssetAll = false;
            this.setPrice[i] = n.numerator;
          }
        })
      },
//        结算类型
      clearPrice() {
        if (this.addRuleSKU.length) {
          for (let i = 0; i < this.addRuleSKU.length; i++) {
            this.setPrice.splice(i, 1, '');
          }
        }
        return;
      },
//      活动
      activity(val) {
        if (val) {
          this.ruleForm.activity = 1;
        } else {
          this.ruleForm.activity = 0;
        }
      },
      IsChecked(val) {
        if (val) {
          this.ruleForm.service = '1,2,4,5'
        } else {
          this.ruleForm.service = '';
        }
      },
//        商品设置统一折扣
      Discount(val) {
        val.inputDiscount = val.inputDiscount.replace(/[^\d]/g, '');
        if (parseFloat(val.inputDiscount) > 100) {
          val.inputDiscount = 100;
        }
      },
//      设置价格或百分比
      setSkuPrice(val, index) {
        if (this.ruleForm.ruleType === 1) {
          val[index] = val[index].replace(/^\./g, '');
          val[index] = val[index].replace(/[^\d.]/g, '');
          val[index] = val[index].replace(/\.{2,}/g, '.');
          val[index] = val[index].replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
          val.splice(index, 1, val[index]);
        }
        if (this.ruleForm.ruleType === 2) {
          val[index] = val[index].replace(/[^\d]/g, '');
          val.splice(index, 1, val[index]);
          if (parseFloat(val[index]) > 100) {
            val[index] = 100;
          }
        }
      },
//      移除
      removeSKu(index) {
        this.addRuleSKU.splice(index, 1);
      },
//      提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.ruleForm.inputDiscount) {
              this.isAll = false;
            }
            let startDate = dateFormat(this.ruleForm.expiryDate[0], 'yyyy-mm-dd') + ' 00:00:00'
            let endDate = dateFormat(this.ruleForm.expiryDate[1], 'yyyy-mm-dd') + ' 23:59:59'
            if (this.ruleForm.ruleType === 1) {
              this.addRuleSKU.forEach((n, i) => {
                n.effectiveDate = startDate
                n.expireDate = endDate
                n.priority = this.ruleForm.activity
                n.costPrice = this.setPrice[i]
                n.segmentId = this.supplierInfo.segmentDetails[0].segment.segmentId
              })
            }
            if (this.ruleForm.ruleType === 2) {
              this.addRuleSKU.forEach((n, j) => {
                n.effectiveDate = startDate
                n.expireDate = endDate
                n.priority = this.ruleForm.activity
                n.denominator = 100;
                n.numerator = this.setPrice[j]
                n.segmentId = this.supplierInfo.segmentDetails[0].segment.segmentId
              })
            }
            if (this.supplierInfo.skuList[0].skuId === 0) {
              this.supplierInfo.skuList[0].numerator = parseFloat(this.ruleForm.inputDiscount)
            }
            let query = {
              ruleDetail: {
                rule: {
                  createDate: this.supplierInfo.createDate,
                  doneDate: this.supplierInfo.doneDate,
                  freightFlag: this.supplierInfo.freightFlag,
                  itemStatus: this.supplierInfo.itemStatus,
                  effectiveDate: startDate,
                  expireDate: endDate,
                  ruleName: this.ruleForm.ruleName,
                  ruleType: this.ruleForm.ruleType,
                  ruleFlag: this.ruleForm.activity,
                  ordStatus: this.ruleForm.type.join(','),
                  warrantyStatus: this.ruleForm.service,
                  opId: this.supplierInfo.opId,
                  supplierTenantId: this.supplierInfo.supplierTenantId,
                  tenantId: this.supplierInfo.tenantId,
                  state: 1,
                  ruleId: this.supplierInfo.ruleId
                },
                segmentDetails: [{
                  segment: this.supplierInfo.segmentDetails[0].segment,
                  skuMatchings: this.isAll ? this.addRuleSKU : this.supplierInfo.skuList
                }]
              }
            }
            this.loading = true;
            axios.post(setSettlementRule, query).then(response => {
              this.loading = false;
              if (response.data) {
                bus.$emit('addRule')
                this.$router.push({path: '/financeRule'})
              }
            }).catch(err => {
              this.loading = false;
              this.$msgbox({
                title: '提示',
                message: '新增规则失败，' + (err.response ? err.response.data : err),
                type: 'error',
              });
            })
          }
        });
      },
      searchHandlerSku() {
        let query = {
          queryCondition: {
            supplierTenantId: this.supplierInfo.supplierTenantId,
          },
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
        }
        this.loading = true;
        axios.post(queryProductsUrl, query).then(response => {
          this.loading = false;
          this.resData.amount = response.data.amount;
          this.resData.offeringList = response.data.offeringList;
        }).catch(err => {
          this.loading = false;
          this.$msgbox({
            title: '提示',
            message: '查询失败，' + (err.response ? err.response.data : err),
            type: 'error',
          });
        })
      },
      //      查询
      searchOne(inputSKU) {
        let query = {
          queryCondition: {
            supplierTenantId: this.supplierInfo.supplierTenantId,
            offeringName: inputSKU,
            nameOrOuterId: inputSKU,
          },
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
        }
        this.loading = true;
        axios.post(queryProductsUrl, query).then(response => {
          this.loading = false;
          this.resData.amount = response.data.amount;
          this.resData.offeringList = response.data.offeringList;
        }).catch(err => {
          this.loading = false;
          this.$msgbox({
            title: '提示',
            message: '查询失败，' + (err.response ? err.response.data : err),
            type: 'error',
          });
        })
      },
      selectSKU(data) {
        this.dialogVisible = false;
        data.forEach(n => {
          this.addRuleSKU.push(n);
        })
        for (var i = 0; i < this.addRuleSKU.length; i++) {
          for (var j = i + 1; j < this.addRuleSKU.length; j++) {
            if (this.addRuleSKU[i].skuId === this.addRuleSKU[j].skuId) {
              this.addRuleSKU.splice(j, 1);
            }
          }
        }
      },
      closeDialog() {
        this.dialogVisible = false;
      },
//      返回结算规则页面
      back() {
        this.editRuleDetail()
        this.$router.push({
          path: '/financeRule',
        })
      },
      currentChangeHandler(args) {
        this.pageNumber = args;
        this.searchHandlerSku();
      },
      sizeChangeHandler(args) {
        this.pageSize = args;
        this.searchHandlerSku();
      },
//      清空表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
//      设置商品规则
      setCommondity() {
        this.dialogVisible = true;
      },
    },
    created() {
      this.editRuleDetail()
      this.$store.dispatch('setShopEnum');
    },
    mounted() {
      this.searchHandlerSku();
    }
  }
</script>
<style lang="less" scoped>
  @import '../../main.less';

  .containers {

  h2 {
    padding-right: 5px;
    margin: 0;
    display: inline-block;
  }

  .shopAll {
    display: inline-block;
    margin-top: 10px;
  }

  /*头部*/
  .head {
    border: solid 1px @borderLine;
  }

  .list-head {
    background-color: #eff2f7;
    display: flex;
    font-size: 14px;

  .title {
    flex-basis: 39%;
    margin-left: 2%;
  }

  .goods {
    flex-basis: 36%;
    margin-left: 2%;
  }

  .cupplyFeed {
    text-align: center;
    flex-basis: 20%;
  }

  .remove {
    box-sizing: border-box;
    flex-basis: 5%;
  }

  }
  .body {
    display: flex;
    align-items: center;
    font-size: 12px;
    text-align: left;
    border: 1px solid @borderLine;
    padding: -20px !important;

  .title {
    flex-basis: 39%;
    margin-left: 2%;
  }

  .goods {
    flex-basis: 36%;
    margin-left: 2%;

  .outerId {
    color: #8492A6;
  }

  }
  .cupplyFeed {
    text-align: center;
    flex-basis: 20%;
  }

  .remove {
    box-sizing: border-box;
    flex-basis: 5%;

  .icon-remove {
    font-size: 18px;
    cursor: pointer;
  }

  }
  }
  /*.foot{*/
  /*display: flex;*/
  /*font-size: 12px;*/
  /*padding: 5px;*/
  /*text-align: left;*/
  /*border: 1px solid @borderLine;*/
  /*background-color: #fff;*/
  /*.goods {*/
  /*flex-basis: 60%;*/
  /*margin-left: 2%;*/
  /*}*/
  /*.sell {*/
  /*box-sizing: border-box;*/
  /*padding-left: 15px;*/
  /*flex-basis: 17%;*/
  /*}*/
  /*.cupplyFeed {*/
  /*text-align: right;*/
  /*flex-basis: 23%;*/
  /*}*/
  /*}*/
  }
</style>
<style lang="less">
  @import '../../main.less';

  .containers .el-form-item.is-required .el-form-item__label:before {
    display: none;
  }

  .containers {

  .el-checkbox__label {
    font-size: 12px !important;
  }

  .discount {

  .el-input {
    width: 100px !important;
    margin-left: 5px;
    display: inline-block !important;
  }

  input {
    text-align: right;
    height: 25px;
    width: 80px;
  }

  }
  .el-form-item {
    margin-bottom: 15px;
  }

  .el-form-item__error {
    padding-top: 0;
  }

  .el-form-item__label {
    color: #8492A6;
  }

  .el-radio__label {
    font-size: 12px;
  }

  .el-dialog--small {
    width: 60%;
  }

  .el-dialog__title {
    font-size: 14px;
    color: #324057;
    font-weight: normal;
  }

  .ruleName {

  .el-input {
    display: inline-block !important;
    width: 280px !important;
  }

  }
  .cupplyFeed {

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
  }
</style>
