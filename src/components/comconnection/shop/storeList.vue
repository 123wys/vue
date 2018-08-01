<template>
  <div class="storelist">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item :to="{path: '/shop'}">我的店铺</el-breadcrumb-item>
      <el-breadcrumb-item>门店管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="addShop">
      <el-button type="primary" @click="syncMultiStore()">全量同步门店信息</el-button>
    </div>
    <div class="middle">
      <div class="head">
        <div class="shopName">门店名称</div>
        <div class="platform">门店地址</div>
        <div class="authTime">联系电话</div>
        <div class="status">状态</div>
        <div class="action">操作</div>
      </div>
      <div class="body" v-loading="loading" element-loading-text="拼命加载中">
        <template v-if="shopData && shopData.amount">
          <div class="head whiteBg" style="font-size:12px;" v-for="(item, i) in shopData.beanList">
            <div class="shopName">{{item.name}}</div>
            <div class="platform">
              {{item.province}}&nbsp;{{item.city}}&nbsp;{{item.district}}&nbsp;{{item.address}}
            </div>
            <div class="authTime">{{item.phone}}</div>
            <div class="status">
              <span v-if="item.enterStatus === 0" class="radiusBk" style="background-color:red;color: #FFFFFF;">未入驻</span>
              <span v-else-if="item.enterStatus === 1" class="radiusBk" style="background-color:green;color: #FFFFFF;">已入驻</span>
            </div>
            <div class="action">
              <el-button v-if="item.enterStatus === 0" size="small" @click="inviteStore(item.storeId, item.name)">邀请入驻</el-button>
            </div>
          </div>
        </template>
        <searchNull v-else class="margin-t80" style="padding-top:60px;padding-bottom:60px;"></searchNull>
      </div>
    </div>
    <pagination class="pl" :isShowSelect="false" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" :total="shopData.amount" @size-change="sizeChangeHandler" @current-change="currentChangeHandler"></pagination>
    <el-dialog title="邀请门店入驻" v-model="dialogVisible" size="small">
      <el-form :model="inviteForm" ref="inviteForm">
        <el-form-item label="门店名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model.trim="inviteForm.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="联系人" :label-width="formLabelWidth" prop="contacts">
          <el-input v-model.trim="inviteForm.contacts"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model.trim="inviteForm.mobile" placeholder="手机号将作为小亚通登录账号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="inviteStoreSure()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import Vue from 'vue'
import Pagination from '../../common/Pagination';
import {
  Dialog,
  Button,
  MessageBox,
} from 'element-ui';
Vue.use(Dialog)
Vue.use(Button)
export default {
  name: 'storeList',
  data() {
    return {
      loading: false,
      shopData: '',
      dialogVisible: false,
      pageSize: 10,
      pageNumber: 1,
      formLabelWidth: '80px',
      inviteForm: {
        storeId: '',
        name: '',
        contacts: '',
        mobile: ''
      },
      shopId: '',
    }
  },
  methods: {
    sizeChangeHandler(val) {
      this.pageSize = val;
      this.quertStore();
    },
    currentChangeHandler(val) {
      this.pageNumber = val;
      this.quertStore();
    },
    quertStore: function(...args) {
      this.loading = true;
      let me = this;
      let query = {
        queryCondition: {
          shopId: this.shopId,
          name: ''
        },
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      };
      axios.post('/customer/shopInfo/queryMultiStore', query).then(res => {
        this.loading = false;
        this.shopData = JSON.parse(res.request.response)
      }).catch(function(err) {
        me.loading = false;
        MessageBox({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    inviteStore: function(storeId, storeName) {
      // this.inviteStoreId = storeId;
      // this.inviteStoreName = storeName;
      this.inviteForm.storeId = storeId;
      this.inviteForm.name = storeName;
      this.dialogVisible = true;
    },
    inviteStoreSure: function() {
      if (this.inviteForm.contacts === '') {
        this.$message.info('联系人名称不能为空！');
        return;
      }
      if (this.inviteForm.mobile === '') {
        this.$message.info('手机号不能为空！');
        return;
      }
      let reg = new RegExp(/^[1][34578][0-9]{9}$/g);
      if (!reg.test(this.inviteForm.mobile)) {
        this.$message.info('手机号格式不正确！');
        return;
      }
      let postUrl = '/customer/shopInfo/inviteMultiStore';
      axios.post(postUrl, this.inviteForm).then(res => {
        this.$message.success('邀请成功！');
        this.dialogVisible = false;
        this.quertStore();
      }).catch(function(err) {
        MessageBox({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    syncMultiStore() {
      this.loading = true;
      let me = this;
      let query = {
        shopId: this.shopId
      };
      axios.post('/customer/shopInfo/syncMultiStore', query).then(res => {
        this.quertStore();
      }).catch(function(err) {
        me.loading = false;
        MessageBox({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    }
  },
  components: {
    Pagination,
  },
  activated() {
    this.shopId = this.$route.query.shopId;
    this.quertStore();
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../../main.less';

.storelist{
  padding: @normalSize;
}

.addShop {
  box-sizing: border-box;
  width: 100%;
  height: 25px;
  font-size: 12px;
  line-height: 25px;
  text-align: right;
  .el-button{
    padding: 5.5px 10px 5.5px 10px;
    border-radius: 0;
  }
}

.middle {
  margin-top: 10px;
  border: solid 1px @borderLine;
}

.head {
  background-color: @tabBg;
  border-top: solid 1px @borderLine;
  display: flex;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  .shopName {
    flex-basis: 25%;
    margin-left: 20px;
  }
  .platform {
    flex-basis: 30%;
    margin-left: 15px;
  }
  .authTime {
    flex-basis: 20%;
    margin-left: 15px;
    text-align: center;
  }
  .status {
    flex-basis: 15%;
    margin-left: 15px;
    text-align: center;
  }
  .action {
    flex-basis: 10%;
    text-align: center;
    .el-button{
      width: 70px;
      padding-top: 5.5px;
      padding-bottom:5.5px;
      // border-radius: 0;
    }
  }
  .radiusBk {
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 12px;
  }
}

.whiteBg {
  background-color: @white;
}
</style>
<style lang="less">
@import '../../../main.less';
.storelist {
  .el-input {
    width: 320px;
  }
}
</style>