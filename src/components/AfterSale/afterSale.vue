<template>
  <div class="afterSale">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>售后管理</el-breadcrumb-item>
      <el-breadcrumb-item v-if="isCreate != 1">售后单详情</el-breadcrumb-item>
      <el-breadcrumb-item v-else>新建售后单</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="title">订单信息</div>
    <div class="orderInfo" v-if="searchFlag">
      <div>
        <span class="options">订单编号</span>
        <span class="textInfo"><span>{{orderData.extOrderId}}</span><span>{{$store.state.enumSet.allShopInfo[orderData.shopId]}}</span></span>
      </div>
      <div>
        <span class="options">订单金额</span>
        <span class="textInfo">
          <span class="fee">￥{{orderData.paidFee | moneyFmt}}元</span>
        <!-- <span>(含运费)</span> -->
        </span>
      </div>
      <div>
        <span class="options">收货地址</span>
        <span class="textInfo">
          <span v-text="orderData.orders[0].receiverName"></span>
        <span v-text="orderData.orders[0].receiverMobile"></span>
        <span>{{orderData.orders[0].receiverState}}{{orderData.orders[0].receiverCity}}{{orderData.orders[0].receiverDistrict}}{{orderData.orders[0].receiverAddress}}</span>
        </span>
      </div>
    </div>
    <div class="select" v-if="orderData && orderData.warranty && orderData.warranty.serviceType===1 && searchFlag">
      <div class="title">开票数据</div>
      <div class="orderInfo">
        <div class="selector">
          <span class="options">发票抬头</span>
          <span v-text="orderData.invoice.invoiceTitle"></span>
        </div>
        <div class="selector">
          <span class="options">发票类型</span>
          <span v-if="orderData.invoice.invoiceKind === 1">普通发票</span>
          <span v-if="orderData.invoice.invoiceKind === 2">增值发票</span>
        </div>
        <div class="selector">
          <span class="options">联系人</span>
          <span v-text="orderData.consignee.receiverName"></span>
        </div>
        <div class="selector">
          <span class="options">邮寄电话</span>
          <span v-text="orderData.consignee.receiverMobile"></span>
        </div>
        <div class="selector">
          <span class="options">邮寄地址</span>
          <span v-text="orderData.consignee.receiverState"></span>
          <span v-text="orderData.consignee.receiverCity"></span>
          <span v-text="orderData.consignee.receiverDistrict"></span>
          <span v-text="orderData.consignee.receiverAddress"></span>
        </div>
        <div class="selector">
          <span class="options">备注信息</span>
          <span v-text="orderData.warranty.serviceMemo"></span>
        </div>
      </div>
    </div>
    <div class="select" v-if="searchFlag">
      <div class="title">售后单信息<span v-if="isCreate == 0">(<span class="warrantyStatus">{{warrantyStatus[orderData.warranty.warrantyStatus]}}</span>)</span>
      </div>
      <div class="selector">
        <span class="options">维权类型</span>
        <span v-if="isCreate > 0">
          <el-select v-model="rights" placeholder="选择售后类型">
            <el-option
              v-for="item in rightOption"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
        <span v-else>{{serviceType[orderData.warranty.serviceType]}}</span>
      </div>
    </div>
    <div class="operationDetail" v-if="searchFlag && editShow">
      <div class="sku">
        <div class="title">维权商品</div>
        <div class="skuBorder">
          <div class="skuTitle">
            <div class="product">商品</div>
            <div class="specifications">商品规格</div>
            <div class="totalNum">数量</div>
            <div class="totalFee">金额</div>
          </div>
          <div v-for="(order, i) in orderData.orders">
            <div class="sub">
              <span class="warehouse">{{$store.getters.tenantEnum[order.supplierTenantId]}}</span>
              <span>(共{{order.orderItems.length}}件商品)</span>
              <span>系统单号: {{order.orderId}}</span>
              <span class="state">订单状态 :<span :style="{color: orderStatus[parseInt(order.orderStatus)].color}" v-text="orderStatus[order.orderStatus].label"></span></span>
            </div>
            <div class="skuDetail" v-for="(orderDetail, ind) in order.orderItems">
              <div class="product">
                <div class="checkbox" v-if="isCreate > 0">
                  <el-checkbox v-model="selection[i][ind]">{{orderDetail.skuTitle}}</el-checkbox>
                </div>
                <div v-else style="padding-left: 10px;">{{orderDetail.skuTitle}}</div>
                <!-- <div class="productDetail"></div> -->
              </div>
              <div class="specifications">
                <div>{{orderDetail.skuSpecChars}}</div>
                <div>{{orderDetail.extOuterId}}</div>
              </div>
              <div class="totalNum">
                <el-input-number v-if="rights == 4 && selection[i][ind]" v-model="replaceNum[i][ind]" size="small" :max="orderDetail.num" :min="0"></el-input-number>
                <span v-else>{{orderDetail.num}}</span>
              </div>
              <div class="totalFee">{{orderDetail.paidFee | moneyFmt}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="productStatus">
        <span class="options">货物状态</span>
        <span v-if="isCreate > 0">
          <el-radio class="radio" v-model="shippingStatusRadio" label="0" :disabled="rights == 4">未收到货</el-radio>
          <el-radio class="radio" v-model="shippingStatusRadio" label="3">已收到货</el-radio>
        </span>
        <span v-else>{{shippingStatus[orderData.warranty.shippingStatus]}}</span>
      </div>
      <div class="rightPro">
        <span class="options">维权原因</span>
        <span v-if="isCreate > 0">
          <el-select v-model="rightPro" placeholder="选择维权原因">
            <el-option
              v-for="item in rightProOptions"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </span>
        <span v-else>{{orderData.items[0].skuProblem}}</span>
      </div>
      <div class="getFee" v-if="rights != 4">
        <div>
          <span class="options">退款金额</span>
          <span v-if="isCreate > 0">
            <span class="feeInput">
              <el-input type="number" v-model="refundFee" :disabled="inputDis" min="0"></el-input>
            </span>
          <span style="margin-left: 5px;">元</span>
          </span>
          <span v-else>￥<span class="dangerRed">{{refundableFee}}</span>元(含邮费)</span>
        </div>
        <div class="refund" v-if="isCreate > 0">
          <span>最多退款金额￥{{refundFee | moneyFmt}}元(含邮费)</span>
        </div>
      </div>
      <div class="decisionType" v-if="rights == 4">
        <span class="options">申请凭证</span>
        <span>
          <el-select v-model="decisionType">
            <el-option
              v-for="(key, value) in decisionTypeOptions"
              :label="key"
              :value="value">
            </el-option>
          </el-select>
        </span>
      </div>
      <div class="returnType" v-if="rights == 4">
        <span class="options">退货方式</span>
        <span>
        <el-select v-model="returnType">
          <el-option
            v-for="(key, value) in returnTypeOptions"
            :label="key"
            :value="value">
          </el-option>
        </el-select>
        </span>
      </div>
      <div class="getAddr" v-if="false">
        <div>
          <span class="options">退货地址</span>
          <span>
            <el-select v-model="returnGoods" placeholder="选择退货地址">
              <!-- <el-option
                v-for="item in rightProOptions"
                :label="item.label"
                :value="item.value">
              </el-option> -->
            </el-select>
          </span>
        </div>
        <div>
          <span>{{receiverName}}{{receiverMobile}}{{receiverAdd}}</span>
        </div>
      </div>
      <div class="rightDescription flex">
        <span class="options">维权说明</span>
        <span v-if="isCreate > 0">
          <el-input type="textarea" :rows="3" :maxlength="140" placeholder="限140字内" v-model="serviceMemo"></el-input>
        </span>
        <span v-else style="flex-basis:800px;">{{orderData.warranty.serviceMemo}}</span>
      </div>
      <div class="upload flex" v-if="!uploadShow && isCreate > 0">
        <span class="options uploadImg">上传凭证</span>
        <el-upload class="upload-demo" :action="baseUrl +'upload/uploadImage'" :on-error="handleAvatarError" :file-list="fileList" :with-credentials="true" :on-change="uploadChange" :on-remove="uploadChange" :before-upload="beforeAvatarUpload" list-type="picture">
          <el-button size="small">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1Mb</div>
        </el-upload>
      </div>
      <div class="upload flex" v-if="isCreate  == 0">
        <span class="options uploadImg">凭证图片</span>
        <div class="img" v-if="orderData.images.length > 0">
          <div v-for="src in orderData.images">
            <el-popover popper-class="warranty-popover-img" trigger="hover" placement="right" :visible-arrow="false">
              <img :src="src.imageUrl">
              <img slot="reference" :src="src.imageUrl">
            </el-popover>
            <!-- <img :src="src.imageUrl" alt="凭证图片"> -->
          </div>
        </div>
        <div v-else>暂无</div>
      </div>
      <div class="createTime" v-if="isCreate != 1">
        <span class="options">创建时间</span>
        <span>{{operatorEnum[orderData.warranty.createOp]}}&nbsp;{{orderData.warranty.createTime}}</span>
      </div>
      <div class="revoke" v-if="revokeShow">
        <div class="title">撤销信息</div>
        <div class="flex">
          <span class="options">撤销原因</span>
          <span>
            <el-input type="textarea" :rows="3" v-model="revokeInfo"></el-input>
          </span>
        </div>
      </div>
      <div class="revoke" v-if="auditShow">
        <div class="title">审核信息</div>
        <div class="auditInfo">
          <span class="options">审核意见</span>
          <span>
            <el-radio class="radio" v-model="isAudit" label="1">通过</el-radio>
            <el-radio class="radio" v-model="isAudit" label="0">不通过</el-radio>
          </span>
        </div>
        <div class="flex">
          <span class="options">审核说明</span>
          <span>
            <el-input type="textarea" :rows="3" v-model="auditDes"></el-input>
          </span>
        </div>
      </div>
      <div class="revoke" v-if="isReview">
        <div class="title">审核信息</div>
        <!-- <div style="margin-bottom: 15px;">
          <span class="options">撤销原因</span>
          <span>
            <el-select v-model="rightPro" placeholder="选择撤销原因">
              <el-option
                v-for="item in rightProOptions"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
          </span>
        </div> -->
        <div class="auditInfo">
          <span class="options">审核意见</span>
          <span>{{orderData.warranty.auditType > 0 ? '通过' : '不通过'}}</span>
        </div>
        <div class="flex auditInfo">
          <span class="options">处理备注</span>
          <span>
            <span v-text="orderData.warranty.auditMemo"></span>
          </span>
        </div>
        <div class="flex">
          <span class="options">审核时间</span>
          <span>{{operatorEnum[orderData.warranty.auditOp]}}&nbsp;{{orderData.warranty.auditTime}}</span>
        </div>
      </div>
      <div class="operationBtn">
        <!-- <el-button size="small" v-if="isCreate == 0" type="primary" @click="edit">编辑</el-button> -->
        <el-button size="small" type="primary" v-if="isCreate != 0" @click="submit">提交</el-button>
        <span v-if="!isReview" style="margin-right: 10px;">
          <el-button size="small" type="primary" v-if="isCreate == 0 && !auditShow && !revokeShow && !isCancel" @click="audit">审核</el-button>
          <el-button size="small" v-if="isCreate != 1 && !revokeShow && !auditShow && !isCancel" @click="getOff">撤销</el-button>
          <el-button size="small" type="primary" v-if="revokeShow || auditShow" @click="operationSubmit">提交</el-button>
        </span>
        <el-button size="small" @click="goback">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import debounce from 'lodash/debounce';
import {
  baseUrl
} from '../../assets/baseUrl.js'
export default {
  name: 'after-sale',
  data() {
    return {
      imagesArr: [],
      replaceNum: [],
      auditDes: '',
      auditShow: false,
      isAudit: '1',
      fileList: [],
      revokeShow: false,
      revokeInfo: '',
      activeName: 'first',
      searchFlag: false,
      orderData: {},
      rights: '',
      shippingStatusRadio: '0',
      rightPro: '',
      returnGoods: '',
      refundFeeCurrentValue: 0,
      // refound: '11111',
      // refoundPostFee: '10',
      serviceMemo: '',
      selection: [],
      decisionType: '0',
      returnType: '2',
    }
  },
  computed: {
    baseUrl() {
      return baseUrl;
    },
    isReview() {
      return this.orderData.warranty && this.orderData.warranty.auditOp;
    },
    isCancel() {
      return this.orderData.warranty && this.orderData.warranty.warrantyStatus === 999;
    },
    refundableFee() {
      let fee = 0;
      if (this.orderData.refunds) {
        fee = this.orderData.refunds.refundableFee / 100;
      }
      return fee.toFixed(2);
    },
    operatorEnum() {
      return this.$store.state.enumSet.operatorEnum;
    },
    shippingStatus() {
      return this.$store.state.enumSet.shippingStatus;
    },
    warrantyStatus() {
      return this.$store.state.enumSet.warrantyStatusType;
    },
    serviceType() {
      return this.$store.state.enumSet.warrantyServiceType;
    },
    isCreate() {
      return this.$store.state.aftersale.order.create;
    },
    editShow() {
      return this.orderData.create !== 1 ? true : typeof this.rights === 'number';
    },
    inputDis() {
      let num = 0;
      this.selection.forEach(m => {
        m.forEach(n => {
          if (n) num++;
        })
      })
      return num > 1;
    },
    refundFee: {
      get() {
        let num = 0;
        if (this.selectItems.length > 0) {
          num = this.selectItems.map(m => m.paidFee).reduce((pre, next) => {
            return parseFloat(pre) + parseFloat(next);
          });
        }
        this.refundFeeCurrentValue = num;
        return Number(num).toFixed(2);
      },
      set(val) {
        this.refundFeeCurrentValue = val;
      }
    },
    orderStatus() {
      return this.$store.state.enumSet.orderType;
    },
    returnTypeOptions() {
      return {
        0: '上门取件',
        1: '送货至自提点',
        2: '快递',
      };
    },
    decisionTypeOptions() {
      return {
        0: '无',
        1: '有发票',
        2: '有检测报告',
        3: '发票+检测报告'
      };
    },
    selectItems() {
      let result = [];
      this.selection.forEach((m, n) => {
        m.forEach((ele, ind) => {
          if (ele) {
            result.push(this.orderData.orders[n].orderItems[ind])
          }
        })
      })
      return result;
    },
    rightOption() {
      let options = [
        // {
        //   label: '补开发票',
        //   value: 1
        // },
        {
          label: '仅退款/退款退货',
          value: 3
        }, {
          label: '换货',
          value: 4
        },
        // {
        //   label: '补偿',
        //   value: 5
        // }
      ];
      return options;
    },
    rightProOptions() {
      let options = [{
        label: '尺寸大小不符',
        // value: 1
      }, {
        label: '假冒品牌',
        // value: 2
      }, {
        label: '颜色/款式/图案与描述不符',
        // value: 3
      }, {
        label: '做工问题',
        // value: 4
      }, {
        label: '材质不符/材质造假',
        // value: 5
      }, {
        label: '收到商品少件/破损/污渍等',
        // value: 6
      }, {
        label: '尺寸拍错/不喜欢/效果不好',
        // value: 7
      }, {
        label: '其他',
        // value: 8
      }];
      return options;
    },
    uploadShow() {
      let result = this.orderData.orders.every(m => {
        return m.orderStatus === 1;
      });
      return result;
    },
  },
  filters: {
    moneyFmt(val) {
      let s = parseFloat(val).toFixed(2) + '';
      let l = s.split('.')[0].split('').reverse();
      let r = s.split('.')[1];
      let t = '';
      for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '');
      }
      return t.split('').reverse().join('') + '.' + r;
    }
  },
  methods: {
    search() {
      if (!this.$store.state.aftersale.order.extOrderId) {
        this.$router.push('/aftersaleentrance');
        return;
      }
      let queryOrderSimple = {
        queryCondition: {
          mix: this.$store.state.aftersale.order.extOrderId,
        },
        pageNumber: 1,
        pageSize: 10
      };
      axios.post('order/order/queryOrderSimple', queryOrderSimple)
        .then(res => {
          this.orderData = res.data.beanList[0];
          this.orderData.create = this.$store.state.aftersale.order.create;
          let query = {
            queryCondition: {
              extOrderId: this.$store.state.aftersale.order.extOrderId,
            },
            pageNumber: 1,
            pageSize: 10,
          };
          axios.post('/afterSale/afterSale/query', query)
            .then(res => {
              if (this.orderData.create === 1) {
                this.orderData.orders = this.orderData.orders.map(ele => {
                  ele.orderItems = ele.orderItems.filter(n => {
                    return [0, 2, 5].includes(n.warrantyStatus);
                  })
                  return ele;
                });
                this.orderData.orders = this.orderData.orders.filter(ele => {
                  return ele.orderItems.length > 0;
                })
                  // console.log(this.orderData);
                window.setTimeout(() => {
                  this.searchFlag = true;
                }, 0);
              } else {
                if (res.data.beanList.length === 0) {
                  this.$message.info('暂无该售后单详细信息~');
                  this.$router.push('/aftersaleentrance');
                  return;
                }
                this.orderData.images = res.data.beanList[0].images;
                this.orderData.warranty = res.data.beanList[0].warranty;
                this.orderData.items = res.data.beanList[0].items;
                this.orderData.refunds = res.data.beanList[0].refunds;
                this.orderData.consignee = res.data.beanList[0].consignee;
                this.orderData.invoice = res.data.beanList[0].invoice;
                let arr = [];
                for (let i = 0; i < res.data.beanList[0].items.length; i++) {
                  arr.push(res.data.beanList[0].items[i].orderItemId);
                }
                this.orderData.orders = this.orderData.orders.map(ele => {
                  ele.orderItems = ele.orderItems.filter(n => {
                    // return n.warrantyStatus > 0 && arr.includes(n.orderItemId);
                    return arr.includes(n.orderItemId);
                  })
                  return ele;
                });
                this.orderData.orders = this.orderData.orders.filter(ele => {
                  return ele.orderItems.length > 0;
                })
                // console.log(this.orderData);
                window.setTimeout(() => {
                  this.searchFlag = true;
                }, 0);
              }
            })
            .catch(err => {
              this.$message.error(err.response ? err.response.data : err);
            })
        })
        .catch(err => {
          this.$message.error(err.response ? err.response.data : err);
        })
    },
    edit() {
      this.orderData.create = 2;
      this.$store.commit('setASOrder', this.orderData);
      this.searchFlag = false;
      this.search();
    },
    getOff() {
      this.revokeShow = true;
      this.auditShow = false;
    },
    // 提交
    submit: debounce(function() {
      let isNull = this.selectItems.length > 0;
      if (!isNull) {
        this.$message.info('请选择维权商品');
        return;
      }
      if (!this.serviceMemo) {
        this.$message.info('请填写维权说明');
        return;
      }
      // 售后单入参初始化
      let query = {
        warranty: {
          extOrderId: this.orderData.extOrderId,
          contactName: this.orderData.orders[0].receiverName,
          contactMobile: this.orderData.orders[0].receiverMobile,
          serviceMemo: this.serviceMemo, // 维权说明
          shippingStatus: this.shippingStatusRadio,
          isReturn: this.shippingStatusRadio > 1 ? 1 : 0
        },
        itemsBeans: [],
        images: this.imagesArr,
      };
      // 退款
      if (this.rights === 3) {
        if (!this.refundFee) {
          this.$message.info('退款金额不能为空');
          return;
        }
        if (this.selectItems.length === 1 && this.refundFeeCurrentValue - this.refundFee > 0) {
          this.$message.info('退款金额不能高于实付金额');
          return;
        }
        if (!this.refundFeeCurrentValue) {
          this.$message.info('请输入正确金额');
          return;
        }
        query.refundsBean = {
          refundType: 0, // 退款方式 0 原路返回
          refundFee: parseFloat(this.refundFeeCurrentValue).toFixed(2) * 100,
        };
        this.selectItems.forEach((m, n) => {
          query.itemsBeans[n] = {
            extItemId: m.extItemId,
            skuProblem: this.rightPro
          };
        });
        axios.post('/afterSale/afterSale/apply4Refund', query)
          .then(res => {
            if (res.data) {
              this.$message.success('售后单提交成功!');
              // this.orderData.create = 0;
              // console.log(this.orderData);
              this.$store.commit('setASOrder', {});
              this.searchFlag = false;
              // this.search();
              this.$router.push('/aftersaleentrance');
            }
          })
          .catch(err => {
            this.$message.error(err.response ? err.response.data : err)
          })
      } else if (this.rights === 4) { // 换货
        let result = this.replaceNum.filter(el => {
          return el.some(n => n > 0);
        });
        if (result.length === 0) {
          this.$message.info('请选择换货数量');
          return;
        }
        if (!this.rightPro) {
          this.$message.info('请选择维权原因');
          return;
        }
        this.selectItems.forEach((m, n) => {
          query.itemsBeans[n] = {
            extItemId: m.extItemId,
            skuProblem: this.rightPro,
            replacementSkuId: m.skuId,
          };
          this.orderData.orders.forEach((ele, ind) => {
            ele.orderItems.forEach((j, k) => {
              if (j.orderItemId === m.orderItemId) {
                query.itemsBeans[n].num = this.replaceNum[ind][k];
              }
            })
          });
        });
        query.returnsBean = {
          decisionType: this.decisionType,
          returnType: this.returnType
        };
        console.log(query);
        axios.post('afterSale/afterSale/apply4Replacement', query)
        .then(res => {
          if (res.data) {
            this.$message.success('售后单提交成功!');
            this.searchFlag = false;
            this.$router.push('/aftersalemanagement');
          } else {
            console.log(res);
          }
        })
        .catch(err => {
          this.$message.error(err.response ? err.response.data : err)
        })
      }
    }, 600, {
      leading: true,
      trailing: false,
    }),
    // 图片上传
    uploadChange(file, fileList) {
      this.imagesArr = [];
      fileList.forEach(m => {
        this.imagesArr.push(m.response);
      })
    },
    //  头像上传之前
    beforeAvatarUpload(file) {
      console.log(file)
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或者 PNG 格式 !');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB !');
      }
      return isJPG && isLt2M;
    },
    // 上传报错
    handleAvatarError() {
      this.$message.error('图片上传出现了点小问题,刷新后重试');
    },
    // 撤销售后单 . 审核通过
    operationSubmit() {
      if (this.auditShow) { // 审核通过
        if (!this.auditDes) {
          this.$message.info('请输入审核说明 !');
          return;
        }
        let query = {
          warrantyIds: [this.orderData.warranty.warrantyId],
          isApproval: this.isAudit > 0,
          comment: this.auditDes,
        };
        console.log(query);
        axios.post('/afterSale/afterSale/audit', query)
          .then(res => {
            if (res.data.length > 0) {
              this.$message.success('审核通过 !');
              this.$router.push('/aftersaleentrance');
              this.$store.commit('setASOrder', {});
            }
          })
          .catch(err => {
            this.$message.error(err.response ? err.response.data : err);
          })
      } else {
        if (!this.revokeInfo) {
          this.$message.info('请输入撤销原因 !');
          return;
        }
        let query = {
          warrantyIds: [this.orderData.warranty.warrantyId],
          comment: this.revokeInfo,
        };
        axios.post('/afterSale/afterSale/cancel', query)
          .then(res => {
            if (res.data.length > 0) {
              this.$message.success('撤销成功 !');
              this.$router.push('/aftersaleentrance');
              this.$store.commit('setASOrder', {});
            }
          })
          .catch(err => {
            this.$message.error(err.response ? err.response.data : err);
          })
      }
    },
    // 审核开关
    audit() {
      this.auditShow = true;
      this.revokeShow = false;
    },
    moneyFmt(val) {
      let s = parseFloat(val).toFixed(2) + '';
      let l = s.split('.')[0].split('').reverse();
      let r = s.split('.')[1];
      let t = '';
      for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '');
      }
      return t.split('').reverse().join('') + '.' + r;
    },
    goback() {
      if (this.auditShow || this.revokeShow) { // 售后审核、撤销表单重置;
        this.auditShow = false;
        this.revokeShow = false;
        this.serviceMemo = '';
        this.auditDes = '';
      } else {
        this.$router.go(-1);
      }
    },
    reset() {
      this.rights = '';
      this.rightPro = '';
      this.serviceMemo = '';
      this.revokeInfo = '';
      this.searchFlag = false;
      this.revokeShow = false;
      this.auditShow = false;
      this.auditDes = '';
    },
  },
  activated() {
    this.reset();
    this.search();
  },
  watch: {
    orderData: {
      handler(val) {
        let arr = new Array(val.orders.length);
        let numArr = new Array(val.orders.length);
        val.orders.forEach((ele, ind) => {
          arr[ind] = new Array(ele.orderItems.length).fill(false);
          numArr[ind] = new Array(ele.orderItems.length).fill(0);
        })
        this.selection = arr;
        this.replaceNum = numArr;
      },
      deep: true,
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.afterSale {
  color: @lightBlack;
  padding: @normalSize;
  > div + div {
    margin-top: 15px;
  }
}

.title {
  color: @black;
  font-size: @fontSize14;
  font-weight: bold;
  margin-bottom: 15px;
  > span {
    margin-left: @baseSpace;
    font-size: @baseFont;
  }
  .warrantyStatus {
    color: @primaryBlue;
  }
}

.options {
  display: inline-block;
  width: 50px;
  text-align: right;
  font-size: @baseFont;
  color: @lightGary;
  margin-right: 15px;
}

.operationDetail {
  > div + div {
    margin-top: 15px;
  }
}

.orderInfo {
  font-size: @baseFont;
  border-bottom: 1px dashed @borderLine;
  > div {
    line-height: 25px;
    span {
      > span + span {
        margin-left: 10px;
      }
    }
  }
}

.fee {
  color: @warningYellow;
}

.textInfo {
  color: @baseGary;
}

.skuBorder {
  width: 900px;
  border: 1px solid @borderLine;
}

.skuTitle,
.skuDetail {
  display: flex;
  text-align: center;
}

.skuTitle {
  font-size: @fontSize14;
  // font-weight: bold;
  line-height: 40px;
  height: 40px;
  background-color: @tabBg;
}

.sub,
.skuDetail {
  border-top: 1px solid @borderLine;
}

.sub {
  line-height: 25px;
  background-color: #E8F5FF;
  padding: 0 10px;
  .warehouse {
    font-weight: bold;
  }
  > span + span {
    margin-right: 10px;
  }
}

.skuDetail {
  background-color: @white;
  line-height: 25px;
  .product {
    display: flex;
  }
}

.checkbox {
  margin: 0 10px;
}

.product {
  flex-basis: 40%;
}

.specifications {
  flex-basis: 30%;
}

.totalNum,
.totalFee {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  // text-align: right;
  padding-right: 20px;
}

.totalNum {
  flex-basis: 17%;
  align-items: center;
}

.totalFee {
  flex-basis: 13%;
}

.flex {
  display: flex;
}

.feeInput {
  display: inline-block;
  width: 193px;
}

.refund {
  padding-left: 70px;
  line-height: 20px;
  margin-top: @baseSpace;
}

.dangerRed {
  color: @dangerRed;
}

.uploadImg {
  margin-right: 13px;
}

.img {
  display: flex;
  > div {
    width: 50px;
    height: 50px;
    img {
      height: 100%;
    }
  }
}

.auditInfo {
  margin-bottom: 15px;
}

.operationBtn {
  padding-left: 63px;
}

.afterSale {
  .el-tabs {
    margin-top: 0!important;
  }
  .el-textarea {
    min-width: 500px;
    max-width: 730px;
  }
}
</style>
<style lang="less">
@import '../../main.less';
.afterSale {
  .feeInput {
    .el-input__inner {
      color: @dangerRed;
    }
  }
}
</style>
<style lang="less">
.warranty-popover-img {
  > img {
    max-width: 700px;
    max-height: 700px;
  }
}
</style>
