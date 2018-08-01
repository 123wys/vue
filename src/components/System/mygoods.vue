<template>
  <div class="mygoods">
    <div class="basicinfo">
      <div class="basicleft">
        <span style="color:#4A90E2;font-size:24px;">{{vername}}</span><br>
        <span style="color:#99A9BF;font-size:12px;">{{expiredate}}到期</span><br>
        <span style="color:#66728C;font-size:16px;margin-top:10px;">{{price}}</span>
      </div>
      <div class="basicmiddle">
        <ul class="contentlist">
          <li><span style="color: #324057;">电商订单智能分发</span></li>
          <li style="margin-top: 10px;"><span style="color: #324057;">在线邀请供应商入住</span></li>
          <li style="list-style-type:none;margin-top: 10px"><router-link to='versionshow'><a href="javascript:void(0);">查看所有高级功能></a></router-link></li>
        </ul>
      </div>
      <div class="basicright">
        <div class="rleft">
          <div class="valid">
            <span style="font-size:24px;font-family:stheitisc light;">剩余&nbsp;<span style="color:#4A90E2;">{{days}}</span>&nbsp;天</span>
            <span style="color:#99A9BF;font-size:12px;display:block;float:right;margin-top:18px;height:12px;line-height:12px;">{{expiredate}}到期</span>
          </div>
          <div class="progress">
            <el-progress :text-inside="false" :show-text="false" :stroke-width="15" :percentage="percentage"></el-progress>
          </div>
        </div>
        <div class="rright">
          <!-- <el-button size='small' class="actionbtn">免费试用</el-button> -->
          <el-button v-if="vername === '免费版'" size='small' type="danger" class="actionbtn">升级</el-button>
          <el-button v-if="vername !== '免费版' && days > 30" size='small' class="actionbtn" @click="buyfunc(verno, vername)">续费</el-button>
          <el-button v-if="vername !== '免费版' && days >= 0 && days <= 30" size='small' type="danger" class="actionbtn" @click="buyfunc(verno, vername)">立即续费</el-button>
        </div>
      </div>
    </div>
    <div class="tips">
      <div style="float:left;font-size:14px;color:#324057;">功能订购</div>
      <div style="float:right;font-size:12px;color:#4A90E2;">升级享受更多功能</div>
    </div>
    <div class="function">
      <div class="singlefunDiv">
        <div :class="['singlefun', fbatchprint ? buyalready : pldd]">
          <svg class="icon function-icon" aria-hidden="true">
            <use xlink:href="#icon-piliangdadan1"></use>
          </svg>
          <br>
          <span class="function-name">批量打单</span><br>
          <span class="function-price">￥198<span class="year">/年</span></span><br>
          <span v-if="fbatchprint && fbpdays > 30" style="corlor:#66728C;font-size:12px;margin-bottom:10px;">{{fbpetime}}到期</span>
          <span v-else-if="fbatchprint && fbpdays <= 30" class="radiusBk" style="background-color:red;color: #FFFFFF;">剩余{{fbpdays}}天到期</span>
          <span v-else-if="!fbatchprint" style="corlor:#66728C;font-size:12px;margin-bottom:10px;">多渠道电子&普通面单双模式</span>
          <br>
          <el-button-group v-if="fbatchprint" class="bthgroup">
            <el-button class="singlebtn" @click="quickUse('/order', '1')">使用</el-button>
            <el-button class="singlebtn">续费</el-button>
          </el-button-group>
          <el-button-group v-else class="bthgroup">
            <el-button class="singlebtn">联系客服</el-button>
            <el-button class="singlebtn blueBtn" @click="buyfunc(1101, '批量打单')">立即订购</el-button>
          </el-button-group>
        </div>
      </div>
      <div class="singlefunDiv">
        <div :class="['singlefun', {buyalready: fstockmgnt}]">
          <svg class="icon function-icon" aria-hidden="true">
            <use xlink:href="#icon-kucunguanlidinggou"></use>
          </svg>
          <br>
          <span class="function-name">库存管理</span><br>
          <span class="function-price">￥980<span class="year">/年</span></span><br>
          <span v-if="fstockmgnt && fsmdays > 30" style="corlor:#66728C;font-size:12px;margin-bottom:10px;">{{fsmetime}}到期</span>
          <span v-else-if="fstockmgnt && fsmdays <= 30" class="radiusBk" style="background-color:red;color: #FFFFFF;">剩余{{fsmdays}}天到期</span>
          <span v-else-if="!fstockmgnt" style="corlor:#66728C;font-size:12px;margin-bottom:10px;">对接京东&商城库存数据</span>
          <br>
          <el-button-group v-if="fstockmgnt" class="bthgroup">
            <el-button class="singlebtn" @click="quickUse('/realtimestock', 'WarehouseRealtimeStock')">使用</el-button>
            <el-button class="singlebtn">续费</el-button>
          </el-button-group>
          <el-button-group v-else class="bthgroup">
            <el-button class="singlebtn">联系客服</el-button>
            <el-button class="singlebtn blueBtn" @click="buyfunc(1104, '库存管理')">立即订购</el-button>
          </el-button-group>
        </div>
      </div>
      <div class="singlefunDiv">
        <div :class="['singlefun', {buyalready: fdatacenter}]">
          <svg class="icon function-icon" aria-hidden="true">
            <use xlink:href="#icon-shujuzhongxindinggou"></use>
          </svg>
          <br>
          <span class="function-name">数据中心</span><br>
          <span class="function-price">￥198<span class="year">/年</span></span><br>
          <span v-if="fdatacenter && fdcdays > 30" style="corlor:#66728C;font-size:12px;margin-bottom:10px;">{{fdcetime}}到期</span>
          <span v-else-if="fdatacenter && fdcdays <= 30" class="radiusBk" style="background-color:red;color: #FFFFFF;">剩余{{fdcdays}}天到期</span>
          <span v-else-if="!fdatacenter" style="corlor:#66728C;font-size:12px;margin-bottom:10px;">订单&商品排行一目了然</span>
          <br>
          <el-button-group v-if="fdatacenter" class="bthgroup">
            <el-button class="singlebtn" @click="quickUse('/orderAnalysis', 'OrderTapOne')">使用</el-button>
            <el-button class="singlebtn">续费</el-button>
          </el-button-group>
          <el-button-group v-else class="bthgroup">
            <el-button class="singlebtn">联系客服</el-button>
            <el-button class="singlebtn blueBtn" @click="buyfunc(1105, '数据中心')">立即订购</el-button>
          </el-button-group>
        </div>
      </div>
      <div class="singlefunDiv">
        <div :class="['singlefun', {buyalready: ffinancy}]">
          <svg class="icon function-icon" aria-hidden="true">
            <use xlink:href="#icon-jiesuanduizhang"></use>
          </svg>
          <br>
          <span class="function-name">财务结算</span><br>
          <span class="function-price">￥198<span class="year">/年</span></span><br>
          <span v-if="ffinancy && ffinancydays > 30" style="corlor:#66728C;font-size:12px;margin-bottom:10px;">{{ffinancyetime}}到期</span>
          <span v-else-if="ffinancy && ffinancydays <= 30" class="radiusBk" style="background-color:red;color: #FFFFFF;">剩余{{ffinancydays}}天到期</span>
          <span v-else-if="!ffinancy" style="corlor:#66728C;font-size:12px;margin-bottom:10px;">分发订单结算必备</span>
          <br>
          <el-button-group v-if="ffinancy" class="bthgroup">
            <el-button class="singlebtn" @click="quickUse('/finance', 'first')">使用</el-button>
            <el-button class="singlebtn">续费</el-button>
          </el-button-group>
          <el-button-group v-else class="bthgroup">
            <el-button class="singlebtn">联系客服</el-button>
            <el-button class="singlebtn blueBtn" @click="buyfunc(1102, '财务结算')">立即订购</el-button>
          </el-button-group>
        </div>
      </div>
      <div class="singlefunDivNoborder">
        <div :class="['singlefun', {buyalready: fstroes}]">
          <svg class="icon function-icon" aria-hidden="true">
            <use xlink:href="#icon-duomendiandinggou"></use>
          </svg>
          <br>
          <span class="function-name">多门店</span><br>
          <span class="function-price">￥198<span class="year">/年</span></span><br>
          <span v-if="fstroes && fstroesdays > 30" style="corlor:#66728C;font-size:12px;margin-bottom:10px;">{{fstroesetime}}到期</span>
          <span v-else-if="fstroes && fstroesdays <= 30" class="radiusBk" style="background-color:red;color: #FFFFFF;">剩余{{fstroesdays}}天到期</span>
          <span v-else-if="!fstroes" style="corlor:#66728C;font-size:12px;margin-bottom:10px;">线上线下多门店矩阵运营</span>
          <br>
          <el-button-group v-if="fstroes" class="bthgroup">
            <el-button class="singlebtn" @click="quickUse('/shop', null)">使用</el-button>
            <el-button class="singlebtn">续费</el-button>
          </el-button-group>
          <el-button-group v-else class="bthgroup">
            <el-button class="singlebtn">联系客服</el-button>
            <el-button class="singlebtn blueBtn" @click="buyfunc(1103, '多门店')">立即订购</el-button>
          </el-button-group>
        </div>
      </div>
    </div>
    <div class="functionother">
      <div class="singlefunDivNoborder">
        <div :class="['singlefun', {buyalready: fcrm}]">
          <svg class="icon function-icon" aria-hidden="true">
            <use xlink:href="#icon-kehuguanlidinggou"></use>
          </svg>
          <br>
          <span class="function-name">客户管理</span><br>
          <span class="function-price">￥398<span class="year">/年</span></span><br>
          <span v-if="fcrm && fcrmdays > 30" style="corlor:#66728C;font-size:12px;margin-bottom:10px;">{{fcrmetime}}到期</span>
          <span v-else-if="fcrm && fcrmdays <= 30" class="radiusBk" style="background-color:red;color: #FFFFFF;">剩余{{fcrmdays}}天到期</span>
          <span v-else-if="!fcrm" style="corlor:#66728C;font-size:12px;margin-bottom:10px;">多渠道客户识别有效运营</span>
          <br>
          <el-button-group v-if="fcrm" class="bthgroup">
            <el-button class="singlebtn" @click="quickUse('/customer', null)">使用</el-button>
            <el-button class="singlebtn">续费</el-button>
          </el-button-group>
          <el-button-group v-else class="bthgroup">
            <el-button class="singlebtn">联系客服</el-button>
            <el-button class="singlebtn blueBtn" @click="buyfunc(1106, '客户管理')">立即订购</el-button>
          </el-button-group>
        </div>
      </div>
    </div>
    <div class="tips">
      <div class="buyhis">支付记录&nbsp;&nbsp;<a href="javascript:void(0);" @click="queryBuyHis();"><i class="icon iconfont icon-tongbu"></i></a></div>
    </div>
    <div class="payrecord">
      <div class="head">
        <div class="paytime">支付时间</div>
        <div class="paytype">付款方式</div>
        <div class="serverproject">服务项目</div>
        <div class="payfee">金额</div>
        <div class="action">操作</div>
      </div>
      <div class="body" v-loading="loading" element-loading-text="拼命加载中">
        <template v-if="payrecord && payrecord.length > 0">
          <div class="head whiteBg" style="font-size:12px;" v-for="(item, i) in payrecord">
            <div class="paytime">{{item.payTime}}</div>
            <div class="paytype">微信支付</div>
            <div class="serverproject">{{item.priceName}}</div>
            <div class="payfee">{{(parseFloat(item.price)/100).toFixed(2)}}</div>
            <div class="action">
              <a href="javascript:void(0);">交易详情</a>
            </div>
          </div>
        </template>
        <searchNull v-else class="margin-t80" style="padding-top:60px;padding-bottom:60px;"></searchNull>
      </div>
    </div>
    <paydialog :dialog="showPayDialog" :dialogfunc="dialogfunc" :payobject="payobject" @cancel="cancel" @confirm="confirm"></paydialog>
  </div>
</template>
<script>
import axios from 'axios'
import paydialog from './paydialog'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'mygoods',
  data() {
    return {
      loading: false,
      showPayDialog: false,
      vername: '基础版',
      verno: '1001',
      expiredate: '',
      price: '免费',
      percentage: 65,
      days: 0,
      fbatchprint: false, // 批量打单
      fbpetime: '',
      fbpdays: 0,
      fstockmgnt: false,  // 库存管理
      fsmetime: '',
      fsmdays: 0,
      fdatacenter: false, // 数据中心
      fdcetime: '',
      fdcdays: 0,
      ffinancy: false, // 结算管理
      ffinancyetime: '',
      ffinancydays: 0,
      fstroes: false, // 多门店
      fstroesetime: '',
      fstroesdays: 0,
      fcrm: false, // 客户管理
      fcrmetime: '',
      fcrmdays: 0,
      buyalready: 'buyalready',
      pldd: 'pldd',
      dialogfunc: 0, // 当前操作的功能
      payobject: '',
      payrecord: []
    }
  },
  computed: {
    ...mapGetters([
      'ichannel'
    ])
  },
  methods: {
    quickUse(path, activeName) {
      this.$router.push({
        path: path,
        query: {
          activeName
        }
      });
    },
    contains(item, items) {
      for (var i = 0; i < items.length; i++) {
        if (items[i] === item) {
          return true;
        }
      }
      return false;
    },
    getVerpri(key, vplist) {
      for (var i = 0; i < vplist.length; i++) {
        if (vplist[i].roleId === key) {
          return vplist[i];
        }
      }
      return null;
    },
    getDateDiff(time1, time2) {
      // let time1 = new Date(timestr.replace(/-/g, "/"));
      // let time2 = new Date();
      let days = time1.getTime() - time2.getTime();
      return parseInt(days / (1000 * 60 * 60 * 24));
    },
    queryPriv() {
      let query = {
        tenantId: this.ichannel.tenantInfo.tenantId
      }
      axios.post('/sysmgnt/version/getVersionPrivileges', query).then(res => {
        let vplist = res.data;
        let roles = [];
        for (var i = 0; i < vplist.length; i++) {
          roles.push(vplist[i].roleId);
        }
        let startdate = '';
        let expiredate = '';
        if (this.contains(1005, roles)) {
          this.vername = '旗舰版';
          this.verno = 1005;
          startdate = this.getVerpri(1005, vplist).effectiveDate.substring(0, 10);
          expiredate = this.getVerpri(1005, vplist).expiredDate.substring(0, 10);
          this.price = '面议';
        } else if (this.contains(1004, roles) && !this.contains(1005, roles)) {
          this.vername = '多门店专业版';
          this.verno = 1004;
          startdate = this.getVerpri(1004, vplist).effectiveDate.substring(0, 10);
          expiredate = this.getVerpri(1004, vplist).expiredDate.substring(0, 10);
          this.price = '￥9,800';
        } else if (this.contains(1003, roles) && !this.contains(1004, roles) && !this.contains(1005, roles)) {
          this.vername = '专业版2+1';
          this.verno = 1002;
          startdate = this.getVerpri(1003, vplist).effectiveDate.substring(0, 10);
          expiredate = this.getVerpri(1003, vplist).expiredDate.substring(0, 10);
          this.price = '￥19,600';
        } else if (this.contains(1002, roles) && !this.contains(1003, roles) && !this.contains(1004, roles) && !this.contains(1005, roles)) {
          this.vername = '专业版';
          this.verno = 1002;
          startdate = this.getVerpri(1002, vplist).effectiveDate.substring(0, 10);
          expiredate = this.getVerpri(1002, vplist).expiredDate.substring(0, 10);
          this.price = '￥9,800';
        } else if (this.contains(1001, roles) && !this.contains(1003, roles) && !this.contains(1004, roles) && !this.contains(1005, roles) && !this.contains(1002, roles)) {
          this.vername = '基础版';
          this.verno = 1001;
          startdate = this.getVerpri(1001, vplist).effectiveDate.substring(0, 10);
          expiredate = this.getVerpri(1001, vplist).expiredDate.substring(0, 10);
          this.price = '免费';
        }
        if (this.contains(1101, roles)) {
          this.fbatchprint = true;
          this.fbpetime = this.getVerpri(1101, vplist).expiredDate.substring(0, 10);
          this.fbpdays = this.getDateDiff(new Date(this.fbpetime.replace(/-/g, '/')), new Date());
        }
        if (this.contains(1104, roles)) {
          this.fstockmgnt = true;
          this.fsmetime = this.getVerpri(1104, vplist).expiredDate.substring(0, 10);
          this.fsmdays = this.getDateDiff(new Date(this.fsmetime.replace(/-/g, '/')), new Date());
        }
        if (this.contains(1105, roles)) {
          this.fdatacenter = true;
          this.fdcetime = this.getVerpri(1105, vplist).expiredDate.substring(0, 10);
          this.fdcdays = this.getDateDiff(new Date(this.fdcetime.replace(/-/g, '/')), new Date());
        }
        if (this.contains(1102, roles)) {
          this.ffinancy = true;
          this.ffinancyetime = this.getVerpri(1102, vplist).expiredDate.substring(0, 10);
          this.ffinancydays = this.getDateDiff(new Date(this.ffinancyetime.replace(/-/g, '/')), new Date());
        }
        if (this.contains(1103, roles)) {
          this.fstroes = true;
          this.fstroesetime = this.getVerpri(1103, vplist).expiredDate.substring(0, 10);
          this.fstroesdays = this.getDateDiff(new Date(this.fstroesetime.replace(/-/g, '/')), new Date());
        }
        if (this.contains(1106, roles)) {
          this.fcrm = true;
          this.fcrmetime = this.getVerpri(1106, vplist).expiredDate.substring(0, 10);
          this.fcrmdays = this.getDateDiff(new Date(this.fcrmetime.replace(/-/g, '/')), new Date());
        }
        this.days = this.getDateDiff(new Date(expiredate.replace(/-/g, '/')), new Date());
        let alldays = this.getDateDiff(new Date(expiredate.replace(/-/g, '/')), new Date(startdate.replace(/-/g, '/')));
        this.percentage = this.days / alldays * 100;
        this.expiredate = expiredate;
      }).catch(err => {
        this.$message.error({
          message: err.response ? err.response.data : err
        });
      })
    },
    queryBuyHis() {
      this.loading = true;
      let query = {
        orderStatus: [1]
      }
      axios.post('/sysmgnt/version/getVersionOrders', query)
        .then(res => {
          this.payrecord = res.data;
          this.loading = false;
        })
        .catch(err => {
          this.$message.error({
            message: err.response ? err.response.data : err
          });
          this.loading = false;
        })
    },
    cancel() {
      this.showPayDialog = false;
    },
    confirm() {
      console.log('--------');
    },
    buyfunc(roleId, funname) {
      this.dialogfunc = roleId;
      this.payobject = funname;
      this.showPayDialog = true;
    }
  },
  components: {
    paydialog
  },
  activated() {
    this.queryPriv();
    this.queryBuyHis();
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';

.mygoods {

}
.basicinfo {
  width: 100%;
  height: 110px;
  background: @white;
  border: 1px solid @borderLine;
  padding: 15px;
}
.basicleft {
  width: 30%;
  height: 80px;
  float: left;
}
.basicmiddle {
  width: 35%;
  height: 80px;
  float: left;
  color: @tipsBlue;
}
.basicright {
  width: 35%;
  height: 80px;
  float: left;
  background: #F9FAFC;
  padding: 10px 0px 10px 15px;
  display: flex;
}
.contentlist {
  padding-left: 10px;
  margin: 0px;
  a:link {
    color: @tipsBlue;
    text-decoration: none;
  }
  a:visited {
    color: @tipsBlue;
  }
}
.rleft {
  flex-basis: 75%;
  min-width: 225px;
  height: 60px;
  float: left;
}
.rright {
  flex-basis: 25%;
  min-width: 80px;
  height: 60px;
  line-height: 60px;
  float: left;
  text-align:center;
}
.valid {
  width: 100%;
}
.progress {
  width: 100%;
  margin-top: 10px;
}
.actionbtn {
  width: 80px;
  height: 30px;
}
.tips {
  margin-top: 25px;
  margin-bottom: 10px;
  width: 100%;
  height: 20px;
  line-height: 20px;
}
.function {
  width: 100%;
  min-width: 1110px;
  height: 210px;
  background: @white;
  border: 1px solid @borderLine;
  padding-top: 15px;
  padding-bottom: 15px;
  display: flex;
  flex-wrap: wrap;
}
.singlefunDiv {
  width: 20%;
  min-width: 220px;
  height: 180px;
  border-right: 1px solid @borderLine;
}
.singlefunDivNoborder {
  width: 20%;
  min-width: 220px;
  height: 180px;
}
.singlefun {
  width: 180px;
  height: 180px;
  margin:0 auto;
  text-align: center;
}
.pldd {
  background-image: url('../../assets/img/tuijian2.png');
  background-repeat:no-repeat;
  background-size:36px 36px;
  background-position: 0px 0px;
}
.buyalready {
  background-image: url('../../assets/img/buy.png');
  background-repeat:no-repeat;
  background-size:36px 36px;
  background-position: 0px 0px;
}
.function-icon {
  width: 50px;
  height: 50px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.function-name {
  font-size: 14px;
  color: #324057;
  margin-bottom: 15px;
}
.function-price {
  font-size: 16px;
  color: #324057;
  margin-bottom: 5px;
}
.year {
  font-size: 12px;
  color: #99A9BF;
}
.bthgroup {
  width: 160px;
  height: 30px;
  margin-top: 10px;
}
.singlebtn {
  width: 80px;
  height: 30px;
}
.blueBtn {
  color: #4A90E2;
}
.radiusBk {
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 12px;
}
.functionother {
  width: 100%;
  min-width: 1110px;
  height: 210px;
  background: @white;
  border-left: 1px solid @borderLine;
  border-right: 1px solid @borderLine;
  border-bottom: 1px solid @borderLine;
  padding-top: 15px;
  padding-bottom: 15px;
  display: flex;
  flex-wrap: wrap;
}
.payrecord {
  border: solid 1px @borderLine;
}
.head {
  background-color: @tabBg;
  border-top: solid 1px @borderLine;
  display: flex;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  .paytime {
    flex-basis: 20%;
    margin-left: 15px;
  }
  .paytype {
    flex-basis: 20%;
    margin-left: 15px;
  }
  .serverproject {
    flex-basis: 30%;
    margin-left: 15px;
  }
  .payfee {
    flex-basis: 15%;
    margin-left: 15px;
    text-align: center;
  }
  .action {
    flex-basis: 15%;
    text-align: right;
    margin-right: 15px;
    a:link {
      color: @tipsBlue;
      text-decoration: none;
    }
    a:visited {
      color: @tipsBlue;
    }
  }
}
.whiteBg {
  background-color: @white;
}
.buyhis {
  float:left;
  font-size:14px;
  color:#324057;
  a:link { 
    color: #324057;
    text-decoration: none;
  } 
  a:visited { 
    color: #324057; 
    text-decoration: none; 
  }
}
</style>
<style lang="less">
.mygoods {
  .el-button {
    padding: 0px;
    border-radius: 0px;
  }
}
</style>
