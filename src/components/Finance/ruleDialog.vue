<template>
  <div class="addRule" v-loading="loading">
    <el-popover ref="popover1" placement="bottom-start" width="320" trigger="hover">
      <div style="padding: 20px;">
        <span style="color:#324057;">1、单一供货价</span><br>
        <span>按照售卖商品的供货价结算</span><br>
        <span>具体到商品，需要先设定商品sku的供货价，然后绑定该规则</span><br><br>
        <span style="color:#324057;">2、单一销售额比例</span><br>
        <span>按照账期内的累计销售额比例结算</span><br>
        <span>具体到商品绑定该规则即可，不需录入商品的供货价</span><br><br>
        <span style="color:#324057;">3、销售额比例按时间阶梯</span><br>
        <span>支持不同时间段设置不同的结算比例</span><br>
        <span>如6.18活动期间几天，销售额比例不同</span><br><br>
        <span style="color:#324057;">4、供货价比例按时间阶梯</span><br>
        <span>支持账期内不同时间段内按照不同的供货价结算</span><br>
        <span>如6.18活动期间，按照正常供货价的80%结算</span><br>
      </div>
    </el-popover>
    <el-row>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" label-position="left">
        <el-form-item label="规则名称" prop="ruleName">
          <el-col :span="14">
            <el-input size="small" placeholder="输入规则名" v-model.trim="ruleForm.ruleName"
                      :maxlength="30" style="width:320px;">
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="规则类型" prop="ruleType">
          <el-col :span="14">
            <el-select v-model="ruleForm.ruleType" size="small" placeholder="请选择">
              <el-option
                v-for="(value,key) in allRuleTypes"
                :label="value" :value="key">
              </el-option>
            </el-select>
            &nbsp;&nbsp;
            <i class="icon iconfont icon-bangzhu1" v-popover:popover1></i>
          </el-col>
        </el-form-item>
        <el-form-item label="销售额比例" prop="discount" v-if="parseInt(ruleForm.ruleType)===2">
          <div class="discount">
            <el-input size="small" v-model="ruleForm.discount" placeholder="输入整数"
                      @keyup.native="clearNum(ruleForm)"></el-input>
            <span>%</span>
          </div>
        </el-form-item>
        <el-form-item label="阶梯比例" prop="date"
                      v-if="parseInt(ruleForm.ruleType)===3 || parseInt(ruleForm.ruleType)===4">
          <div class="title">
            <span>时间范围</span>
            <span>折扣率</span>
          </div>
          <div class="enter" v-for="index in number">
            <div>
              <el-date-picker size="mini" v-model="ruleForm.expiryDate[index-1].start" type="daterange"
                              placeholder="选择日期范围"></el-date-picker>
            </div>
            <div class="right">
              <el-input size="mini" v-model="ruleForm.expiryDate[index-1].discount" placeholder="输入整数"
                        @keyup.native="clearDisNum(ruleForm.expiryDate[index-1])"></el-input>
              <span>%</span>
            </div>
            <div>
              <svg class="icon icon-remove" aria-hidden="true" @click="reduce(index)">
                <use xlink:href="#icon-iconfont05"></use>
              </svg>
            </div>
          </div>
          <el-row>
            <span @click="add" class="content">
               <svg class="icon icon-add" aria-hidden="true">
                  <use xlink:href="#icon-xinzeng"></use>
                </svg>&nbsp;添加新的阶梯折扣</span>
          </el-row>
          </el-col>
        </el-form-item>
        <el-form-item label="结算订单" prop="type">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox v-for="(value,key) in types" :label="key" :value="value" size="small">{{value}}</el-checkbox>
          </el-checkbox-group>
          <!-- <el-checkbox v-model="isChecked" @change="IsChecked(isChecked)">售后单&nbsp;<span style="color: #8492A6">(包含退款中、退款关闭、退货中、退货关闭)</span>
          </el-checkbox> -->
        </el-form-item>
        <el-form-item label="售后单类型">
          <el-checkbox-group v-model="ruleForm.warrantyStatus">
            <el-checkbox v-for="(value,key) in serviceTypes" :label="key" :value="value" size="small">{{value}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="运费结算">
          <el-radio-group v-model="ruleForm.freightFlag">
            <el-radio label="0">不结算</el-radio>
            <el-radio label="1">结算至供应商</el-radio>
          </el-radio-group>
          <span></span>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button size="small" @click="close">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" size="small">确定</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>
<script>
  import dateFormat from 'dateFormat'
  import axios from 'axios';
  import bus from '../../store/bus.js';
  let NewSetSettlementRule = '/finance/rule/NewSetSettlementRule'
  export default{
    data() {
      // 规则名称验证
      let ruleName = function (rule, value, callback) {
        if (!value) {
          return callback(new Error('规则名称不能为空'))
        } else {
          return callback();
        }
      }
      //        规则类型验证
      let ruleTypes = function (rule, value, callback) {
        if (!value) {
          return callback(new Error('规则类型不能为空'))
        } else {
          return callback();
        }
      }
//      折扣验证
      let discount = function (rule, value, callback) {
        if (!value) {
          return callback(new Error('销售额比例不能为空'))
        } else {
          return callback();
        }
      }
//     日期验证
//      let dateCheck = function (rule, value, callback) {
//        if (!value.length || value[0] === null && value[1] === null) {
//          return callback(new Error('日期不能为空'));
//        } else {
//          return callback();
//        }
//      }
      return {
        loading: false,
        number: 1,
        isChecked: '',
        ruleForm: {
          ruleName: '',
          ruleType: '',
          type: ['3', '4'],
          warrantyStatus: ['2', '5'],
          expiryDate: [{
            start: [],
            discount: ''
          }],
          discount: '',
          service: '',
          freightFlag: '0'
        },
        rules: {
          ruleName: [
            {
              validator: ruleName,
              trigger: 'formSubmit'
            }
          ],
          ruleType: [
            {
              validator: ruleTypes,
              trigger: 'formSubmit'
            }
          ],
          discount: [
            {
              validator: discount,
              trigger: 'formSubmit'
            }
          ],
          type: [
            {type: 'array', required: true, message: '请选择(待发货、已发货、已完成)订单状态一种', trigger: 'formSubmit'}
          ],
//          date: [
//            {
//              validator: dateCheck,
//              trigger: 'formSubmit'
//            }
//          ]
        },
        types: {
          1: '待发货',
          3: '已发货',
          4: '已完成',
        },
        serviceTypes: {
          1: '退款中',
          2: '退款关闭',
          3: '退款成功',
          4: '退货中',
          5: '退货关闭',
          6: '退货成功',
        },
        allRuleTypes: {
          1: '单一供货价',
          2: '单一销售额比例',
          3: '供货价比例按时间阶梯',
          4: '销售额比例按时间阶梯',
        }
      }
    },
    methods: {
      submitForm(formName) {
        // if (this.ruleForm.warrantyStatus.length > 0) {
        //   this.ruleForm.warrantyStatus.push('0');
        // }
        this.ruleForm.warrantyStatus.push('0');
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let ruleType = parseFloat(this.ruleForm.ruleType);
            let lens = this.ruleForm.expiryDate.length;
            let data = [];
            if (ruleType === 3 || ruleType === 4) {
              for (let i = 0; i < lens; i++) {
                let startDate = dateFormat(this.ruleForm.expiryDate[i].start[0], 'yyyy-mm-dd') + ' 00:00:00'
                let endDate = dateFormat(this.ruleForm.expiryDate[i].start[1], 'yyyy-mm-dd') + ' 23:59:59'
                data.push({
                  effectiveDate: startDate,
                  expireDate: endDate,
                  numerator: parseFloat(this.ruleForm.expiryDate[i].discount),
                  denominator: 100
                })
              }
            }
            let query = {}
            switch (ruleType) {
              case ruleType = 1:
                query = {
                  ruleDetail: {
                    rule: {
                      ruleType: this.ruleForm.ruleType,
                      ordStatus: this.ruleForm.type.join(','),
                      warrantyStatus: this.ruleForm.warrantyStatus.join(',')
                    }
                  }
                };
                break;
              case ruleType = 2:
                query = {
                  ruleDetail: {
                    rule: {
                      ruleType: this.ruleForm.ruleType,
                      ordStatus: this.ruleForm.type.join(','),
                      warrantyStatus: this.ruleForm.warrantyStatus.join(',')
                    },
                    segments: [{numerator: parseFloat(this.ruleForm.discount), denominator: 100}],
                  }
                };
                break;
              case ruleType = 3:
                query = {
                  ruleDetail: {
                    rule: {
                      ruleType: 1,
                      ordStatus: this.ruleForm.type.join(','),
                      warrantyStatus: this.ruleForm.warrantyStatus.join(',')
                    },
                    segments: data,
                  }
                };
                break;
              case ruleType = 4:
                query = {
                  ruleDetail: {
                    rule: {
                      ruleType: 2,
                      ordStatus: this.ruleForm.type.join(','),
                      warrantyStatus: this.ruleForm.warrantyStatus.join(',')
                    },
                    segments: data,
                  }
                }
                break;
            }
            query.ruleDetail.rule.freightFlag = this.ruleForm.freightFlag;
            query.ruleDetail.rule.ruleName = this.ruleForm.ruleName;
            this.loading = true;
            axios.post(NewSetSettlementRule, query).then(response => {
              this.loading = false;
              if (response.data) {
                this.$emit('cancel');
                bus.$emit('searchSettlementRule');
                this.number = 1;
                this.ruleForm.warrantyStatus.splice(0, this.ruleForm.warrantyStatus.length);
                this.ruleForm.expiryDate.splice(0, this.ruleForm.expiryDate.length);
                this.ruleForm.expiryDate.push({start: [], discount: ''});
                this.resetForm('ruleForm');
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
      clearDisNum(val) {
        val.discount = val.discount.replace(/[^\d]/g, '');
        if (parseFloat(val.discount) > 100) {
          val.discount = '';
        }
      },
      clearNum(ruleForm) {
        this.ruleForm.discount = this.ruleForm.discount.replace(/[^\d]/g, '');
        if (parseFloat(this.ruleForm.discount) > 100) {
          this.ruleForm.discount = '';
        }
      },
      //      清空表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      add() {
        this.number++;
        let query = {
          start: [],
          discount: ''
        }
        this.ruleForm.expiryDate.push(query);
      },
      reduce(index) {
        if (this.number > 1) {
          this.number--;
          this.ruleForm.expiryDate.splice(index - 1, 1);
        }
        return;
      },
      // IsChecked(val) {
      //   if (val) {
      //     this.ruleForm.service = '1,2,4,5'
      //   } else {
      //     this.ruleForm.service = '';
      //   }
      // },
      close() {
        this.$emit('cancel');
        this.resetForm('ruleForm');
        this.ruleForm.warrantyStatus.splice(0, this.ruleForm.warrantyStatus.length);
        this.number = 1;
        this.freightFlag = '0';
        this.ruleForm.expiryDate.splice(0, this.ruleForm.expiryDate.length);
        this.ruleForm.expiryDate.push({start: [], discount: ''});
      }
    },
  }
</script>

<style lang="less">
  @import '../../main.less';

  .addRule {
    color: #8492A6;

  .title {
    width: 350px;
    display: flex;
    justify-content: space-around;
    font-size: 12px;
  }

  .enter {
    width: 350px;
    display: flex;
    justify-content: space-around;
    position: relative;
    top: -10px;

  .right {

  .el-input {
    width: 80px;
  }

  input {
    text-align: right;
  }

  }
  .icon-remove {
    font-size: 16px;
    cursor: pointer;
  }

  }

  .content {
    font-size: 12px;
    cursor: pointer;
    position: relative;
    top: -15px;

  .icon-add {
    font-size: 13px;
  }

  }
  .discount {
    display: flex;
    justify-content: flex-start;
    align-items: center;

  span {
    padding-left: 5px;
  }

  .el-input {
    width: 80px;
  }

  input {
    text-align: right;
  }

  }
  .el-checkbox__label {
    font-size: 12px !important;
  }

  .el-date-editor--daterange.el-input {
    width: 190px;
  }

  .el-form-item {
    margin-bottom: 10px;
  }

  .el-form-item__error {
    padding-top: 0;
  }

  .el-form-item__label {
    font-size: 12px;
    color: #8492A6;
    line-height: null;
  }

  .el-radio__label {
    font-size: 12px;
  }

  .el-dialog__title {
    font-size: 14px;
    color: #324057;
    font-weight: normal;
  }

  .el-form-item.is-required .el-form-item__label:before {
    display: none;
  }

  }
</style>
