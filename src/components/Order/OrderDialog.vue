<template>
  <el-dialog :title="actionName" v-model="dialogShow" size="small" custom-class="orderdialog" :close-on-click-modal="false" @open="electronicSearch">
    <el-form :model="order" :rules="rules" ref="form" label-width="90px" label-position="left">
      <el-form-item class="nospace">
        <el-input v-if="action === 'jbz'" type="textarea" :rows="2" placeholder="请输入50个字以内备注信息" v-model.trim="remarksAppend" :maxlength="50" key="remarks">
        </el-input>
        <el-input v-if="action === 'qxdd'" type="textarea" :rows="2" placeholder="请输入50个字以内原因" v-model.trim="remarksAppend" :maxlength="50" key="remarks">
        </el-input>
        <el-input v-if="action === 'jjtk'" type="textarea" :rows="2" placeholder="请输入50个字以内原因" v-model.trim="remarksAppend" :maxlength="50" key="remarks">
        </el-input>
        <el-input v-if="action === 'zsh'" type="textarea" :rows="2" placeholder="请输入50个字以内原因" v-model.trim="remarksAppend" :maxlength="50" key="remarks">
        </el-input>
      </el-form-item>
      <el-form-item prop="comment" class="nospace" v-if="action === 'thsh'">
        <el-input type="textarea" :rows="2" placeholder="请输入50个字以内退审原因" v-model.trim="order.comment" :maxlength="50" key="comment">
        </el-input>
      </el-form-item>
      <template v-if="action === 'xgshxx'">
        <el-form-item label="姓名" prop="receiverName">
          <el-input v-model.trim="order.receiverName">
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="receiverMobile">
          <el-input v-model="order.receiverMobile">
          </el-input>
        </el-form-item>
        <el-form-item label="地址" prop="receiverCity">
          <district-select class="district" :province="order.receiverState" :city="order.receiverCity" :district="order.receiverDistrict" @district-change="districtChange"></district-select>
          <el-input type="textarea" :rows="2" placeholder="详细地址" v-model.trim="order.receiverAddress">
          </el-input>
        </el-form-item>
      </template>
      <!--    <el-form-item prop="warehouseId" v-if="action === 'gc'" class="nospace" parseInt>
        <el-select v-model="order.warehouseId" placeholder="请选择仓库">
          <el-option v-for="(val, key) in repositorys" :label="val" :value="parseInt(key)"></el-option>
        </el-select>
      </el-form-item> -->
      <template v-if="action === 'fh'">
        <div class="prods">
          <div class="head">
            <el-checkbox class="checkbox" style="visibility: hidden"></el-checkbox>
            <div class="title">商品</div>
            <div class="number">数量</div>
            <div class="status">状态</div>
            <div class="logistics">物流</div>
          </div>
          <div class="body">
            <div class="prod" v-for="(prod, index) of order.orderItems" :key="prod.skuId">
              <el-checkbox class="checkbox" v-model="selects[index]" :disabled="prod.itemStatus!==1"></el-checkbox>
              <div class="title-img"><img :src="prod.imageUrl"></img>
              </div>
              <div class="title-name" v-text="prod.skuTitle"></div>
              <div class="number" v-text="prod.num"></div>
              <div class="status">
                <div v-if="prod.warrantyStatus" @click="warranty" class="red">{{warrantyStatus[prod.warrantyStatus]}}</div>
                <div v-else v-text="skuType[prod.itemStatus].label" :class="skuType[prod.itemStatus].color"></div>
              </div>
              <div class="logistics">
                <div v-text="prod.companyName"></div>
                <div v-text="prod.deliveryNo"></div>
              </div>
            </div>
          </div>
        </div>
        <p>收货地址：{{order.receiverName}} {{order.receiverMobile}} {{order.receiverCity+order.receiverState+order.receiverDistrict+order.receiverAddress}}</p>
        <el-form-item label="发货方式">
          <el-radio v-model="deliverType" :label="0">物流发货</el-radio>
          <el-radio v-model="deliverType" :label="1">无需物流</el-radio>
        </el-form-item>
        <el-row :gutter="20" v-if="deliverType===0">
          <el-col :span="12">
            <el-form-item label="快递公司" prop="logisticsCompanyId">
              <el-select v-model="order.logisticsCompanyId" size="small" placeholder="请选择快递公司" @change="jumpToNo" filterable>
                <el-option v-for="(val,key) in logisticsCompanyIds" :label="val" :value="key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item id="logistics-no" label="快递单号" prop="logisticsNo">
              <el-input v-model.trim="order.logisticsNo" @keyup.native.enter="dialogSure" size="small">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <template v-if="action === 'dywld'">
        <div class="dywld">
          <el-form-item label="选择打印机">
            <el-select v-model="printer">
              <el-option v-for="(key, value) in lodopPrinter" :key="key" :value="value" :label="key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="面单类型">
            <el-radio v-model="isElectronic" label="0">普通面单</el-radio>
            <el-radio v-model="isElectronic" label="1">电子面单</el-radio>
          </el-form-item>
          <el-form-item label="自动发货" v-if="isElectronic > 0">
            <el-radio v-model="autoDelivery" label="1">是，订单自动流转至“已发货”</el-radio>
            <el-radio v-model="autoDelivery" label="0">否，稍后自行点击发货</el-radio>
          </el-form-item>
          <el-form-item label="快递公司">
            <el-select placeholder="请选择" v-model="order.logisticType">
              <el-option v-for="(key, value) in logisticsCompanyFH" :label="`${key}`" :value="`${value}`">
                <span style="float: left" v-text="key"></span>
                <span style="float: right; color: #8492a6; font-size: 12px" v-text="value"></span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否专线" v-if="isElectronic > 0 && order.logisticType === 'STO'">
            <el-checkbox v-model="special">所选订单全部为专线</el-checkbox>
          </el-form-item>
          <el-form-item label="规格" prop="templateSize" v-if="isElectronic > 0 && ['YD', 'SF', 'HTKY'].includes(order.logisticType)">
            <el-radio-group v-model="order.templateSize">
              <el-radio v-for="option in templateSizeOptions" :label="option.label">{{option.value}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="extraCode" v-if="['SF'].includes(order.logisticType) && isElectronic > 0">
            <el-col :span="12">
              <el-input v-model.trim="order.extraCode"></el-input>
            </el-col>
          </el-form-item>
          <div class="tenantSecret" v-if="isElectronic > 0 && !['SF', 'FAST', 'ZJS'].includes(order.logisticType)">
            <div class="esAccount senderDes">
              <span>物流账号</span>
              <span class="createSender" v-if="!senderSceret" @click="senderSceret = true"><i class="icon iconfont icon-tianjia1"></i>使用新账号</span>
              <span class="notCreate" v-else @click="senderSceret = false">取消使用</span>
              <span class="delete" v-show="popoverShow">是否删除选中账号？
                <span class="isSure" @click="deleteConfirm(1)">是</span>
              <span class="isNot" @click="popoverShow = false">否</span>
              </span>
            </div>
            <div class="senderInfo tenantInfo" v-if="senderSceret">
              <el-form-item label="商家代码" prop="tenantAccount">
                <el-col :span="12">
                  <el-input v-model.trim="order.tenantAccount" placeholder="客户ID/商家ID/操作编码等"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="商家密钥" prop="tenantSecret" v-if="!['YTO', 'DBL', 'JD', 'KYSY', 'ANE'].includes(order.logisticType)">
                <el-col :span="12">
                  <el-input v-model.trim="order.tenantSecret" placeholder="商家接口密钥/客户密码等"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item :label="extraCode" v-if="['YTO', 'STO', 'GTO', 'HHTT', 'XFEX'].includes(order.logisticType)">
                <el-col :span="12">
                  <el-input v-model.trim="order.extraCode"></el-input>
                </el-col>
              </el-form-item>
            </div>
            <div class="senderList" v-if="!senderSceret && searchFlag && (electronicArr.length > 0 || (defaultElectronic && defaultElectronic.elecId))">
              <div>
                <el-radio-group v-model="electronicNth">
                  <el-radio :label="'default'"><span>商家代码:&nbsp;{{defaultElectronic.merchantCode}}</span>&nbsp;<span>商家密钥:&nbsp;{{defaultElectronic.merchantKey}}</span>
                    <span @click="popoverShow = true" v-show="defaultElectronic && defaultElectronic.elecId" style="float:right;">
                      <i class="icon iconfont icon-iconfont05"></i>
                    </span>
                  </el-radio>
                  <div v-for="(option, i) in electronicArr" :key="option.createTime" v-if="eleDropToggle">
                    <el-radio :label="i"><span>商家代码:&nbsp;{{option.merchantCode}}</span>&nbsp;<span>商家密钥:&nbsp;{{option.merchantKey}}</span>
                      <span @click="popoverShow = true" style="float:right;">
                        <i class="icon iconfont icon-iconfont05"></i>
                      </span>
                    </el-radio>
                  </div>
                </el-radio-group>
                <div class="dropToggle">
                  <span v-if="!eleDropToggle" @click="eleDropToggle = true">点击展开更多</span>
                  <span v-if="eleDropToggle" @click="eleDropToggle = false">点击收起</span>
                </div>
              </div>
            </div>
          </div>
          <div class="senderDes">
            <span>发件信息</span>
            <span class="createSender" v-if="!createSender" @click="createSender = true"><i class="icon iconfont icon-tianjia1"></i>使用新地址</span>
            <span class="notCreate" v-else @click="createSender = false">取消使用</span>
            <span class="delete" v-show="addressDeleteShow">是否删除选中地址？
              <span class="isSure" @click="deleteConfirm(0)">是</span>
            <span class="isNot" @click="addressDeleteShow = false">否</span>
            </span>
          </div>
          <div class="senderInfo" v-if="createSender">
            <el-form-item label="发件人" prop="senderName">
              <el-col :span="12">
                <el-input v-model.trim="order.senderName"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="手机号" prop="senderMobile">
              <el-col :span="12">
                <el-input v-model.trim="order.senderMobile"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="月结号" prop="monthlyCoding" v-if="isElectronic < 1 && order.logisticType === 'DBKD'">
              <el-col :span="12">
                <el-input v-model.trim="order.monthlyCoding"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="发件地址" prop="senderAdd">
              <el-row>
                <el-col :span="12">
                  <district-select class="district" :province="order.senderProvince" :city="order.senderCity" :district="order.senderDistrict" @district-change="setDistrict"></district-select>
                </el-col>
                <el-col :span="11" :offset="1">
                  <el-input placeholder="详细地址" v-model.trim="order.senderAdd"></el-input>
                </el-col>
              </el-row>
            </el-form-item prop="isDefault">
            <div class="setDefault">
              <el-checkbox v-model="order.isDefault">设为默认</el-checkbox>
            </div>
          </div>
          <div class="senderList" v-if="!createSender && searchFlag && (senderArr.length > 0 || defaultSender.mobile)">
            <div>
              <el-radio-group v-model="senderNth">
                <el-radio :label="'default'">{{defaultSender.addresser}}&nbsp;{{defaultSender.mobile}}&nbsp;{{defaultSender.province}}{{defaultSender.city}}{{defaultSender.area}}{{defaultSender.detailed}}
                  <span v-if="defaultSender.monthlyCoding">月结号:&nbsp;{{defaultSender.monthlyCoding}}</span>
                  <span @click="addressDeleteShow = true" v-show="defaultSender.addresser" style="float:right;">
                    <i class="icon iconfont icon-iconfont05"></i>
                  </span>
                </el-radio>
                <el-radio v-for="(option, i) in senderArr" :label="i" :key="option.createTime" v-if="dropToggle">{{option.addresser}}&nbsp;{{option.mobile}}&nbsp;{{option.province}}{{option.city}}{{option.area}}{{option.detailed}}
                  <span v-if="option.monthlyCoding">月结号:$&nbsp;{{option.monthlyCoding}}</span>
                  <span @click="addressDeleteShow = true" style="float:right;">
                    <i class="icon iconfont icon-iconfont05"></i>
                  </span>
                </el-radio>
              </el-radio-group>
              <div class="dropToggle">
                <span v-if="!dropToggle" @click="dropToggle = true">点击展开更多</span>
                <span v-if="dropToggle" @click="dropToggle = false">点击收起</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogCancel">取 消</el-button>
      <el-button size="small" type="primary" @click="dialogSure">提 交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import DistrictSelect from '../common/DistrictSelect';
import axios from 'axios';
import getLodop from '../../LodopFuncs.js';
let logisticsBak = '';
export default {
  name: 'order-dialog',
  props: {
    action: {
      default: '',
    },
    dialog: {
      default: false,
    },
    editedOrders: {
      type: Array,
    },
  },
  components: {
    DistrictSelect,
  },
  data() {
    return {
      dropToggle: false,
      eleDropToggle: false,
      createSender: false,
      searchFlag: false,
      senderSceret: false,
      popoverShow: false,
      addressDeleteShow: false,
      isElectronic: '0',
      order: {
        remarks: '',
        receiverName: '',
        receiverMobile: '',
        receiverState: '',
        receiverCity: '',
        receiverDistrict: '',
        receiverAddress: '',
        warehouse: '',
        warehouseId: '',
        logisticsCompanyId: '',
        logisticsCompany: '',
        logisticsNo: '',
        logisticType: '',
        orderItems: [],
        senderName: '',
        senderMobile: '',
        senderProvince: '',
        senderCity: '',
        senderDistrict: '',
        senderAdd: '',
        isDefault: false,
        tenantAccount: '',
        tenantSecret: '',
        isElectronic: '0',
        elecId: '',
        templateSize: '',
        isCreate: 0,
        extraCode: '',
        autoDelivery: '0',
        special: '',
        printer: '',
        monthlyCoding: '',
      },
      special: false,
      autoDelivery: '0',
      remarksAppend: '',
      selects: [],
      printer: '',
      rules: {
        comment: {
          required: true,
          message: '请输入',
          trigger: 'submit',
        },
        receiverName: {
          required: true,
          message: '请输入',
          trigger: 'submit',
        },
        receiverMobile: [{
          required: true,
          message: '请输入',
          trigger: 'submit',
        }, {
          validator(rule, value, callback) {
            if (isNaN(value) || value.length !== 11) {
              callback(new Error('请输入正确手机号'));
            } else {
              callback();
            }
          }
        }],
        receiverState: {
          required: true,
          message: '请选择省市',
          trigger: 'submit',
        },
        receiverCity: {
          required: true,
          message: '请选择省市',
          trigger: 'submit',
        },
        receiverAddress: {
          required: true,
          message: '请输入',
          trigger: 'submit',
        },
        warehouseId: {
          required: true,
          message: '请选择',
          trigger: 'submit',
        },
        logisticsCompanyId: {
          required: true,
          message: '请选择',
          trigger: 'submit',
        },
        logisticsNo: {
          required: true,
          message: '请输入',
          trigger: 'submit',
        },
        logisticType: {
          required: true,
          message: '请选择快递公司',
          trigger: 'submit',
        },
        senderName: {
          required: true,
          message: '请输入发件人',
          trigger: 'submit',
        },
        senderMobile: {
          required: true,
          message: '请输入电话号码',
          trigger: 'submit',
        },
        tenantSecret: {
          required: true,
          message: '请输入商家密钥',
          trigger: 'submit',
        },
        tenantAccount: {
          required: true,
          message: '请输入商家代码',
          trigger: 'submit',
        },
        senderAdd: {
          required: true,
          message: '请输入详细地址',
          trigger: 'submit',
        },
      },
      deliverType: 0, // 发货方式 0快递发货 1无需快递
      repositorys: {},
      senderArr: [], // 发件人信息
      defaultSender: {},
      senderNth: 'default',
      electronicArr: [], // 电子面单账户信息
      defaultElectronic: {},
      electronicNth: 'default',
    }
  },
  computed: {
    lodopPrinter() {
      let options = {};
      let lodop = getLodop();
      let len = lodop.GET_PRINTER_COUNT();
      for (let i = 0; i < len; i++) {
        options[i] = lodop.GET_PRINTER_NAME(i);
      }
      return options;
    },
    extraCode() {
      let code = '';
      switch (this.order.logisticType) {
        case 'STO':
        case 'GTO':
        case 'HHTT':
          code = '网点名称';
          break;
        case 'XFEX':
          code = '客户商户ID';
          break;
        case 'SF':
          code = '月结号';
          break;
        case 'YTO':
          code = '密钥串';
          break;
        case 'ZJS':
          code = '快递单号';
          break;
        default:
          code = '';
          break;
      }
      return code;
    },
    templateSizeOptions() {
      let options = [];
      switch (this.order.logisticType) {
        case 'SF':
          options = [{
            label: '',
            value: '二联(切点90/60)',
          }, {
            label: '210',
            value: '三联(切点90/60/60)',
          }];
          break;
        case 'HTKY':
          options = [{
            label: '',
            value: '二联(切点87/5/91)',
          }, {
            label: '180',
            value: '二联(切点110/70)',
          }];
          break;
        case 'YD':
          options = [{
            label: '',
            value: '二联(切点152/51)',
          }, {
            label: '180',
            value: '二联(切点110/70)',
          }];
          break;
        default:
          options = [];
          break;
      }
      return options;
    },
    logisticsCompanyFH() {
      return this.isElectronic > 0 ? this.$store.state.enumSet.electronicType : this.$store.getters.logisticsCompanyFH;
    },
    selectItemIds() {
      let filtered = this.order.orderItems.filter((n, i) => this.selects[i]);
      if (filtered.length === this.order.orderItems.length) {
        return '';
      }
      return filtered.map(n => n.orderItemId);
    },
    actionName() {
      if (this.action === 'thsh') return '退回审核';
      if (this.action === 'jbz') return '商家备注';
      if (this.action === 'xgshxx') return '修改收货信息';
      if (this.action === 'gc') return '改仓';
      if (this.action === 'qxdd') return '取消订单';
      if (this.action === 'fh') return '发货';
      if (this.action === 'zsh') return '转售后';
      if (this.action === 'jjtk') return '拒绝退款';
      if (this.action === 'dywld') return '打印快递单';
      return '';
    },
    dialogShow: {
      get() {
        return this.dialog;
      },
      set(val) {
        if (val || !this.dialog) return;
        this.$emit('dialog-cancel');
      }
    },
    editedorderIds() {
      return this.editedOrders.map(n => n.orderId)
    },
    logisticsCompanyIds() {
      return this.$store.state.enumSet.logisticsCompanyAll
    },
    skuType() {
      return this.$store.state.enumSet.skuType;
    },
    warrantyStatus() {
      return this.$store.state.enumSet.warrantyStatus
    },
  },
  watch: {
    editedOrders(val) {
      for (let i in this.order) {
        this.order[i] = '';
      }
      this.order.orderItems = [];
      this.remarksAppend = '';
      if (!val.length) return;
      if (val.length === 1) { // 单个订单操作复制信息
        Object.assign(this.order, val[0]);
      }
    },
    dialog(val) {
      if (val && this.action === 'fh') {
        this.switchDeliverType();
      }
    },
    'order.logisticsCompanyId' (val) {
      this.order.logisticsCompany = this.logisticsCompanyIds[val];
    },
    'order.orderItems' (val) {
      let arr = [];
      val.forEach(n => {
        arr.push(n.itemStatus === 1);
      })
      this.selects = arr;
    },
    'order.logisticType' (val) {
      this.order.templateSize = '';
      if (val) {
        this.electronicSecretSearch(val);
      }
    },
    deliverType(val) {
      this.switchDeliverType(val);
    }
  },
  methods: {
    // 根据deliverType修改物流公司
    switchDeliverType(val = this.deliverType) {
      this.order.logisticsNo = '';
      if (val === 0) {
        this.order.logisticsCompanyId = logisticsBak;
      } else if (val === 1) {
        this.order.logisticsCompanyId = 'N/A';
      }
    },
    dialogSure() {
      let flag = 1;
      this.$refs.form.validate((valid) => {
        if (!valid) {
          flag = 0;
          return false;
        }
      });
      if (flag) {
        if (this.action === 'fh' && Array.isArray(this.selectItemIds) && !this.selectItemIds.length) {
          this.$message.error('请至少选择一项');
          return;
        }
        if (this.action === 'dywld') { // 打印物流单
          this.order.isElectronic = this.isElectronic;
          if (!this.printer) {
            this.$message.info('请选择打印机');
            return;
          }
          this.order.printer = this.printer;
          // let lodop = getLodop();
          // lodop.SET_PRINTER_INDEXA(this.printer);
          if (!this.order.logisticType) {
            this.$message.info('请选择快递公司');
            return;
          }
          if (!this.createSender && !this.defaultSender.addresser) {
            this.$message.info('请选择或填写发件信息');
            return;
          }
          if (this.createSender && !this.order.senderProvince) {
            this.$message.info('请选择发货地址');
            return;
          }
          if (!this.createSender) {
            let option = this.senderNth !== 'default' ? this.senderArr[this.senderNth] : this.defaultSender;
            if (!option) {
              this.$message.info('请 选择或新建 发货地址');
              return;
            }
            this.order.senderName = option.addresser;
            this.order.senderMobile = option.mobile;
            this.order.senderProvince = option.province;
            this.order.senderCity = option.city;
            this.order.senderDistrict = option.area;
            this.order.senderAdd = option.detailed;
            this.order.monthlyCoding = option.monthlyCoding;
          } else {
            this.order.isCreate = 1; // 新建发件人标识
          }
          if (this.isElectronic > 0) { // 电子面单
            // if (['YD', 'SF', 'HTKY'].includes(this.order.logisticType) && !this.order.templateSize) {
            //   this.$message.info('请选择电子面单规格');
            //   return;
            // }
            if (['YTO', 'STO', 'ZJS', 'XFEX', 'GTO', 'HHTT'].includes(this.order.logisticType) && this.senderSceret && !this.order.extraCode) {
              this.$message.info(`请填写${this.extraCode}`);
              return;
            }
            if (!['SF', 'FAST', 'ZJS'].includes(this.order.logisticType)) {
              if (!this.senderSceret && !this.defaultElectronic.elecId) {
                this.$message.info('请 选择或新建 快递公司密钥');
                return;
              }
              if (!this.senderSceret) {
                let option = this.electronicNth !== 'default' ? this.electronicArr[this.electronicNth] : this.defaultElectronic;
                // this.order.tenantSecret = option.merchantKey;
                // this.order.tenantAccount = option.merchantCode;
                this.order.elecId = option.elecId;
              } else {
                if (this.order.isCreate === 1) {
                  this.order.isCreate = 3; // 发件信息、商家密钥都为新建
                } else {
                  this.order.isCreate = 2; // 新建商家密钥标识
                }
              }
            }
            this.order.autoDelivery = this.autoDelivery;
            this.order.special = this.special;
          }
        }
        this.$emit('dialog-sure', this.editedorderIds, this.order, this.remarksAppend + ' ', this.selectItemIds)
      };
    },
    dialogCancel() {
      this.$emit('dialog-cancel');
    },
    clearForm() {
      this.$refs.form.resetFields();
    },
    districtChange(val) {
      this.order.receiverState = val[0];
      this.order.receiverCity = val[1];
      this.order.receiverDistrict = val[2];
    },
    jumpToNo() {
      if (this.dialog && this.deliverType === 0) {
        logisticsBak = this.order.logisticsCompanyId;
        this.$el.querySelector('#logistics-no input').focus();
      }
    },
    setDistrict(val) {
      this.order.senderProvince = val[0];
      this.order.senderCity = val[1];
      this.order.senderDistrict = val[2];
    },
    electronicSearch() {
      // this.$refs.form.resetFields();
      if (this.action === 'dywld') { // 打单页面重置
        if (this.createSender || this.senderSceret) {
          this.clearForm();
        }
        this.order.senderName = '';
        this.order.senderMobile = '';
        this.order.senderProvince = '';
        this.order.senderCity = '';
        this.order.senderDistrict = '';
        this.order.senderAdd = '';
        this.order.monthlyCoding = '';
        this.order.tenantSecret = '';
        this.order.tenantAccount = '';
        this.order.elecId = '';
        this.order.templateSize = '';
        this.order.autoDelivery = '0';
        this.order.isCreate = 0;
        this.senderNth = 'default';
        this.electronicNth = 'default';
        this.addressDeleteShow = false;
        this.popoverShow = false;
        this.special = '';
        this.senderSceret = false;
        this.createSender = false;
        axios.get('electronicSheet/es/querySender')
          .then(res => {
            if (res.data.length > 0) {
              if (res.data.some(n => n.isdefault > 0)) {
                res.data.forEach((ele, ind) => {
                  if (ele.isdefault === 1) {
                    this.defaultSender = ele;
                    res.data.splice(ind, 1);
                  }
                })
              } else {
                this.defaultSender = res.data.shift();
                this.senderArr = res.data;
              }
            }
            this.senderArr = res.data;
            this.searchFlag = true;
          })
          .catch(err => {
            this.$message.error(err.response ? err.response.data : err);
          })
      }
    },
    electronicSecretSearch(val) {
      this.defaultElectronic = {};
      this.electronicArr = [];
      let query = {
        logisticCompany: val,
      };
      axios.post('electronicSheet/es/queryElec', query)
        .then(res => {
          if (res.data.length > 0) {
            this.defaultElectronic = res.data.shift();
            this.electronicArr = res.data;
          }
          this.senderSceret = false;
        })
        .catch(err => {
          this.$message.error(err.response ? err.response.data : err);
        })
    },
    deleteConfirm(val) {
      if (val === 0) { // 删除地址
        let option = this.senderNth !== 'default' ? this.senderArr[this.senderNth] : this.defaultSender;
        let deleteData = {
          senderId: option.senderId,
        };
        axios.post('electronicSheet/es/removeSender', deleteData)
          .then(res => {
            if (res.data > 0) {
              this.addressDeleteShow = false;
              this.electronicSearch();
            }
          })
          .catch(err => {
            this.$message.error(err.response ? err.response.data : err);
          })
      } else { // 删除账号
        let option = this.electronicNth !== 'default' ? this.electronicArr[this.electronicNth] : this.defaultElectronic;
        let deleteData = {
          elecId: option.elecId,
        };
        axios.post('electronicSheet/es/removeElec', deleteData)
          .then(res => {
            if (res.data > 0) {
              this.popoverShow = false;
              this.electronicSecretSearch(option.logisticCompany);
            }
          })
          .catch(err => {
            this.$message.error(err.response ? err.response.data : err);
          })
      }
    },
    createInfo(isCreate, val) {
      if ([1, 3].includes(isCreate)) {
        let insertData = {
          addresser: val.senderName,
          mobile: val.senderMobile,
          province: val.senderProvince,
          city: val.senderCity,
          area: val.senderDistrict,
          detailed: val.senderAdd,
          isdefault: val.isDefault ? 1 : 0,
          monthlycoding: val.monthlyCoding,
        };
        axios.post('electronicSheet/es/insertSender', insertData)
          .catch(err => {
            this.$message.error(err.response ? err.response.data : err);
          })
      }
      if ([2, 3].includes(isCreate)) {
        let insertData = {
          code: val.tenantAccount,
          key: val.tenantSecret,
          logisticCompany: val.logisticType,
        };
        switch (val.logisticType) {
          case 'STO':
          case 'GTO':
          case 'HHTT':
          case 'XFEX':
            insertData.sendSite = val.extraCode;
            break;
          case 'SF':
          case 'YTO':
            insertData.monthCode = val.extraCode;
            break;
          case 'ZJS':
            insertData.logisticCode = val.extraCode;
            break;
        }
        axios.post('electronicSheet/es/insertElec', insertData)
          .then(res => {
            if (res.data) {
              this.electronicSecretSearch(val.logisticType);
            }
          })
          .catch(err => {
            this.$message.error(err.response ? err.response.data : err);
          })
      }
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.prods {
  .head {
    background-color: @tabBg;
    font-size: 14px;
    padding: @baseSpace*2;
    border: solid 1px @borderLine;
    display: flex;
  }
  .prod {
    padding: @baseSpace*2;
    display: flex;
    border: solid 1px @borderLine;
    border-top: none;
  }
  .checkbox {
    flex-basis: 3%;
    align-self: center;
  }
  .title {
    flex-basis: 30%;
    margin-left: 10%;
  }
  .title-img {
    flex-basis: 10%;
    padding: 0 @baseSpace;
    > img {
      width: 100%;
    }
  }
  .title-name {
    flex-basis: 30%;
  }
  .number {
    text-align: right;
    padding-right: 5%;
    flex-basis: 15%;
  }
  .status {
    flex-basis: 20%;
  }
  .logistics {
    flex-basis: 22%;
  }
}
</style>
<style lang="less">
@import '../../main.less';
.orderdialog {
  min-width: 420px;
  .el-dialog__body {
    padding-bottom: 10px;
    .nospace {
      margin-bottom: 0;
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
  .district {
    width: 100%;
    padding-bottom: 10px;
  }
  .el-select {
    width: 100%;
  }
  .instruction {
    margin-bottom: @normalSize;
    color: @lightBlack;
  }
}

.dywld {
  .el-select {
    width: 200px;
  }
  .senderDes {
    margin-bottom: 10px;
    padding-left: 15px;
    span {
      font-size: 14px;
    }
  }
  .district {
    padding-bottom: 0;
  }
  .senderInfo {
    padding: 15px 5px 10px 0;
    background-color: @tabBg;
    margin-bottom: 10px;
  }
  .tenantSecret {
    margin-bottom: 10px;
  }
  .tenantInfo {
    padding-bottom: 0;
    overflow: hidden;
  }
  .setDefault {
    padding-left: 90px;
  }
  .el-form-item__label {
    font-size: 12px;
    text-indent: 15px;
  }
  .el-form-item {
    margin-bottom: 17px;
  }
  .senderList {
    padding-left: 85px;
    .el-radio + .el-radio {
      margin-left: 0;
    }
    .el-radio-group,
    .el-radio {
      width: 100%;
    }
  }
  .createSender,
  .notCreate {
    font-size: 12px!important;
    cursor: pointer;
    margin-left: 10px;
    i {
      margin-right: 5px;
    }
  }
  .createSender {
    color: @primaryBlue;
  }
  .notCreate {
    color: @lightGary;
  }
  .dropToggle {
    margin: 5px 0;
    span {
      cursor: pointer;
      color: @lightGary;
    }
  }
  .delete {
    color: @dangerRed;
    float: right;
    // margin-left: 15px;
    .isSure,
    .isNot {
      cursor: pointer;
    }
    .isSure {
      color: @primaryBlue;
      margin: 0 10px;
    }
    .isNot {
      color: @black;
    }
  }
  .icon-iconfont05 {
    color: @lightGary;
  }
}

.el-select-dropdown {
  z-index: 9999!important;
}
</style>
