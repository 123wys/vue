<template>
  <div class="warehouse">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item @click.native='back'>我的仓库</el-breadcrumb-item>
      <el-breadcrumb-item v-if="editMode===1">新增仓库</el-breadcrumb-item>
      <el-breadcrumb-item v-if="editMode===2">修改仓库</el-breadcrumb-item>
    </el-breadcrumb>
    <transition name="slide" mode='out-in'>
      <div v-if="editMode===0" key='a'>
        <div class="warehouse-add">
          <span>我的仓库</span>
          <span>
          <svg class="icon top-icon" aria-hidden="true">
            <use xlink:href="#icon-cangku"></use>
          </svg>
          <el-button type="text" @click="add">新增仓库</el-button>
          </span>
        </div>
        <el-input placeholder="输入仓库名称" class="search" v-model="warehouseName" size="small" @keyup.native.enter="getStore">
          <template slot="append">
            <el-button @click="getStore">搜索仓库</el-button>
          </template>
        </el-input>
        <el-table :data="tableData" v-loading="loading" element-loading-text="拼命加载中" class='store-table'>
          <div slot="empty">
            <searchNull text='搜索结果为空'></searchNull>
          </div>
          <el-table-column prop="infoBean.wmsName" label="仓库名称" width="150">
          </el-table-column>
          <el-table-column label="实体仓库" width="150">
            <template scope="scope">
              <p>{{entityWmsTypeEnum[scope.row.infoBean.entityWmsType]||''}}</p>
            </template>
          </el-table-column>
          <el-table-column label="联系人" width="150">
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
          <el-table-column label="配送范围" width='260'>
            <template scope="scope">
              <div>{{deliveryRangesMap[scope.row.infoBean.wmsId]}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width='260'>
            <template scope="scope">
              <el-button @click.native.prevent="warehouseUpdate(scope.row)" size="small">
                编辑
              </el-button>
              <el-button @click.native.prevent="warehouseDel(scope.row)" size="small">
                删除
              </el-button>
              <el-button @click="showDeliveryDialog(scope.row)" size="small">
                调整范围
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" class='pagination' layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <warehouse-edit :warehouse="edited" :wmsparams='wmsparams' @close="close" v-if="editMode!==0" @success="success" key='b'></warehouse-edit>
    </transition>
    <el-dialog title="删除仓库" v-model="dialogVisible" size="tiny" @close='delCancel'>
      <el-input type="textarea" :rows="2" placeholder="请输入删除备注内容" v-model="delComments">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size='small' @click="delCancel">取 消</el-button>
        <el-button size='small' type="primary" @click="delSure">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="设置配送范围" v-model="rangeDialogShow">
      <strong>提示：不可选择其他仓库已选的范围</strong>
      <div v-for="(districtGroup,index) of districtList" class="districts-group">
        <div class="districts-master">
          <el-checkbox v-model="districtGroup.select" :disabled="districtGroup.disabled" :indeterminate="districtGroup.indeterminate" @change="districtGroupSelect(index)">{{districtGroup.label}}</el-checkbox>
        </div>
        <div class="districts">
          <div v-for="district of districtGroup.sons">
            <el-checkbox v-model="district.select" :disabled="district.disabled" @change="districtSelect(index)">{{district.label}}</el-checkbox>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size='small' @click="rangeDialogShow=false">取 消</el-button>
        <el-button size='small' type="primary" @click="setDeliveryRange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import WarehouseEdit from './WarehouseEdit';
import districtList from '../../assets/district.js';
const queryDeliveryRangeUrl = '/warehouse/warehouse/queryDeliveryRange';
const replaceDeliverRangeUrl = '/warehouse/warehouse/replaceDeliverRange';
let blank = {
  wmsId: '',
  wmsName: '',
  contactName: '',
  contactMobile: '',
  locState: '',
  locCity: '',
  locDistrict: '',
  locAddress: '',
  entityWmsType: '',
  extWmsId: '',
};
export default {
  name: 'warehouse',
  data() {
    return {
      warehouseName: '',
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
      wmsparams: [],
      editMode: 0, // 0:隐藏，1:新建，2:编辑
      rangeDialogShow: false,
      deliveryRangesMap: {},
      deliveryRangesEdit: '',
      districtList: districtList,
    }
  },
  computed: {
    entityWmsTypeEnum() {
      return this.$store.state.enumSet.entityWmsTypeEnum;
    }
  },
  components: {
    WarehouseEdit,
  },
  methods: {
    back() {
      this.editMode = 0;
    },
    getStore() {
      var _self = this;
      _self.loading = true;
      var data = {
        queryCondition: {
          warehouseName: this.warehouseName,
        },
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }
      _self.axios.post('/warehouse/warehouse/queryWarehouse', data).then(function(response) {
        _self.total = response.data.amount;
        _self.tableData = response.data.beanList || [];
        _self.tableData.forEach(n => {
          _self.queryDeliveryRange(n.infoBean.wmsId);
        })
        _self.loading = false;
      }).catch(function(error) {
        _self.$message.error(error.response ? error.response.data : error);
        _self.loading = false;
      });
    },
    add() {
      this.edited = blank;
      this.wmsparams = [];
      this.editMode = 1;
    },
    //  更新仓库
    warehouseUpdate(row) {
      this.edited = row.infoBean;
      this.wmsparams = row.paramsBeans || [];
      this.editMode = 2;
    },
    //  删除仓库模态框打开
    warehouseDel(row) {
      this.dialogVisible = true;
      this.delId = row.infoBean.wmsId;
    },
    showDeliveryDialog(row) {
      this.delId = row.infoBean.wmsId;
      // 仓库已选set
      let rangeSet = new Set(this.deliveryRangesMap[row.infoBean.wmsId].split(','));
      let disabledRangeArr = []
      for (let i in this.deliveryRangesMap) {
        if (i !== row.infoBean.wmsId + '') {
          disabledRangeArr = disabledRangeArr.concat(this.deliveryRangesMap[i].split(','))
        }
      }
      // 其他仓库已选，此仓库不可选set
      let disabledRangeSet = new Set(disabledRangeArr);
      let districtListFlatten = this.districtListFlatten();
      districtListFlatten.forEach(n => {
        if (rangeSet.has(n.label)) {
          n.select = true;
        } else {
          n.select = false;
        }
        if (disabledRangeSet.has(n.label)) {
          n.disabled = true;
        } else {
          n.disabled = false;
        }
      })
      for (let i = 0; i < this.districtList.length; i++) {
        this.districtSelect(i)
      }
      this.rangeDialogShow = true;
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
        this.$store.dispatch('setRepositoryEnum');
      }).catch(error => {
        this.$message.error(error.response ? error.response.data : error);
      });
    },
    delCancel() {
      this.delId = '';
      this.delComments = '';
      this.dialogVisible = false;
    },
    queryDeliveryRange(wmsId) { // 查询配送范围
      this.axios.post(queryDeliveryRangeUrl, {
        wmsId,
      }).then(response => {
        let range = response.data.map(n => n.locState).join();
        this.$set(this.deliveryRangesMap, wmsId, range);
      }).catch(err => {
        this.loading = false;
        this.$msgbox({
          message: '获取范围失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    setDeliveryRange() {
      // 改2维数组为1维，并选出选择的省市
      let deliveryRanges = this.districtList.reduce((prev, curr) => {
        return prev.concat(curr.sons.filter(n => n.select).map(n => {
          return {
            locState: n.label
          }
        }))
      }, []);
      let condition = {
        wmsId: this.delId,
        deliveryRanges,
      }
      this.loading = true;
      this.rangeDialogShow = false;
      this.axios.post(replaceDeliverRangeUrl, condition).then(response => {
        this.loading = false;
        this.queryDeliveryRange(this.delId);
      }).catch(err => {
        this.loading = false;
        this.$msgbox({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    districtGroupSelect(index) { // 全选/取消全选实现
      this.districtList[index].indeterminate = false;
      this.districtList[index].sons.forEach(n => {
        n.select = this.districtList[index].select;
      });
    },
    districtSelect(index) {
      this.districtList[index].select = this.districtList[index].sons.every(n => n.select);
      this.districtList[index].disabled = this.districtList[index].sons.some(n => n.disabled);
      let some = this.districtList[index].sons.some(n => n.select);
      this.districtList[index].indeterminate = !this.districtList[index].select && some;
    },
    districtListFlatten() { // 1维省市选择
      return this.districtList.reduce((prev, curr) => {
        return prev.concat(curr.sons)
      }, []);
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
    },
    //  当前页
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getStore();
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
@import '../../main.less';
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

.warehouse {
  color: @lightBlack;
  padding: @normalSize;
}

.warehouse-add {
  box-sizing: border-box;
  border-bottom: 1px solid #d1d9e5;
  padding-left: 10px;
  width: 100%;
  height: 30px;
  margin: 0 0px 20px 0px;
  font-size: @normalSize;
  line-height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .icon-cangku {
    margin-right: 5px;
    font-size: 25px;
    color: @lightBlack;
  }
}

.search {
  width: 300px;
  margin-bottom: 20px;
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

.districts-group {
  display: flex;
  padding: 10px 0;
  .districts-master {
    flex-basis: 20%;
  }
  .districts {
    flex-basis: 80%;
    display: flex;
    flex-wrap: wrap;
    >div {
      flex-basis: 16%;
    }
  }
}
</style>
<style lang="less">
.warehouse .el-dialog__body {
  padding-bottom: 10px;
}
</style>
