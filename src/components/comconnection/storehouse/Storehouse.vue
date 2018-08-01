<template>
  <div class="storehouse">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>企业互联</el-breadcrumb-item>
      <el-breadcrumb-item @click.native='back'>我的仓库</el-breadcrumb-item>
      <el-breadcrumb-item v-if="editMode===1">新增仓库</el-breadcrumb-item>
      <el-breadcrumb-item v-if="editMode===2">修改仓库</el-breadcrumb-item>
    </el-breadcrumb>
    <transition name="slide" mode='out-in'>
      <div v-if="editMode===0" key='a'>
        <div class="storehouse-add" @click="add" style="cursor:pointer">
          <svg class="icon top-icon" aria-hidden="true">
            <use xlink:href="#icon-cangku"></use>
          </svg>
          <el-button type="text">新增仓库</el-button>
        </div>
        <el-table :data="tableData" v-loading="loading" element-loading-text="拼命加载中" class='store-table'>
          <div slot="empty">
            <searchNull text='您还没有仓库哦~'></searchNull>
          </div>
          <el-table-column prop="infoBean.wmsName" label="仓库名称" width="200">
          </el-table-column>
          <el-table-column label="联系人" width="200">
            <template scope="scope">
              <p class='contacts-name'>{{scope.row.infoBean.contactName}}</p>
              <p class='contacts-mobile'>{{scope.row.infoBean.contactMobile}}</p>
            </template>
          </el-table-column>
          <el-table-column label="仓库地址">
            <template scope="scope">
              <p>{{scope.row.infoBean.locState}}&nbsp{{scope.row.infoBean.locCity}}&nbsp{{scope.row.infoBean.locDistrict}}&nbsp{{scope.row.infoBean.locAddress}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width='200'>
            <template scope="scope">
              <el-button @click.native.prevent="storehouseUpdate(scope.row)" size="small">
                编辑
              </el-button>
              <el-button @click.native.prevent="storehouseDel(scope.row)" size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" class='pagination' layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <warehouse-edit :warehouse="edited" @close="close" v-if="editMode!==0" @success="success" key='b'></warehouse-edit>
    </transition>
    <el-dialog title="删除仓库" v-model="dialogVisible" size="tiny" @close='delCancel'>
      <el-input type="textarea" :rows="2" placeholder="请输入删除备注内容" v-model="delComments">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size='small' @click="delCancel">取 消</el-button>
        <el-button size='small' type="primary" @click="delSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import WarehouseEdit from './WarehouseEdit';
let blank = {
  wmsId: '',
  wmsName: '',
  contactName: '',
  contactMobile: '',
  locState: '',
  locCity: '',
  locDistrict: '',
  locAddress: '',
}
export default {
  name: 'storehouse',
  data() {
    return {
      dialogVisible: false,
      delId: '',
      delComments: '',
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      tableData: [{
        infoBean: {
          wmsName: '',
          contactName: '',
          contactMobile: '',
          locstate: ''
        }
      }],
      edited: blank,
      editMode: 0, // 0:隐藏，1:新建，2:编辑
    }
  },
  computed: {},
  components: {
    WarehouseEdit,
  },
  methods: {
    back() {
      console.log(123);
      this.editMode = 0;
    },
    getStore() {
      var _self = this;
      _self.loading = true;
      var data = {
        queryCondition: {},
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }
      _self.axios.post('/warehouse/warehouse/queryWarehouse', data).then(function(response) {
        _self.total = response.data.amount;
        _self.tableData = response.data.beanList;
        _self.loading = false;
      }).catch(function(error) {
        _self.$message.error(error.response.data);
        _self.loading = false;
      });
    },
    add() {
      this.edited = blank;
      this.editMode = 1;
    },
    //  更新仓库
    storehouseUpdate(row) {
      this.edited = row.infoBean;
      this.editMode = 2;
    },
    //  删除仓库模态框打开
    storehouseDel(row) {
      this.dialogVisible = true;
      this.delId = row.wmsId;
    },
    // 删除仓库确定
    delSure() {
      var data = {
        wmsId: this.delId,
        comments: this.delComments
      }
      this.axios.post('/stock/warehouse/removeWarehouse', data).then(response => {
        this.getStore();
        this.delId = '';
        this.delComments = '';
        this.dialogVisible = false;
      }).catch(error => {
        this.$message.error(error.response.data);
      });
    },
    delCancel() {
      this.delId = '';
      this.delComments = '';
      this.dialogVisible = false;
    },
    close() {
      this.editMode = 0;
    },
    success() {
      this.editMode = 0;
      this.getStore();
    },
    //  分页尺寸变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.getStore();
      console.log(`每页 ${val} 条`);
    },
    //  当前页
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getStore();
      console.log(`当前页: ${val}`);
    }
  },
  activated() {
    this.editMode = 0;
    this.getStore();
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../../main.less';
.store-table {
  font-size: @baseFont;
}

a:link {
  text-decoration: none;
  color: @lightBlue;
}

a:visited {
  color: @lightBlue;
}

a:hover {
  color: @lightBlue;
}

a:active {
  color: @lightBlue;
}

.storehouse {
  color: @lightBlack;
  padding: @normalSize;
}

.storehouse-add {
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  margin: 5px 0px 5px 0px;
  font-size: @normalSize;
  line-height: 40px;
  text-align: right;
  .icon-cangku {
    margin-right: 5px;
    font-size: 25px;
    color: @lightBlack;
  }
}

.contacts-name {
  margin: 0;
  // color: @lightBlack;
}

.contacts-mobile {
  margin: 0;
  // color: @lightBlack;
}

.pagination {
  margin: 20px 0 20px 0;
  text-align: right;
}
</style>
<style lang="less">
.storehouse .el-dialog__body {
  padding-bottom: 10px;
}
</style>
