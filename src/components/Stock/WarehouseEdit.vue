<template>
  <div v-loading="loading" id="warehouse-edit">
    <h2>基本信息</h2>
    <el-form :model="warehouseEdit" :rules="rules" ref="form" label-width="10%" label-position="left">
      <el-form-item label="仓库名称" prop="wmsName">
        <el-input class="form-input" placeholder="" v-model.trim="warehouseEdit.wmsName" :maxlength="20" size="small">
        </el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contactName">
        <el-input class="form-input" placeholder="" v-model.trim="warehouseEdit.contactName" :maxlength="10" size="small">
        </el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="contactMobile">
        <el-input placeholder="" v-model="warehouseEdit.contactMobile" class="form-input" size="small">
        </el-input>
      </el-form-item>
      <el-form-item label="仓库地址" prop="locDistrict">
        <district-select class="form-input" :province="warehouseEdit.locState" :city="warehouseEdit.locCity" :district="warehouseEdit.locDistrict" @district-change="districtChange" size="small"></district-select>
      </el-form-item>
      <el-form-item prop="locAddress">
        <el-input class="form-input" placeholder="街道详细地址" v-model.trim="warehouseEdit.locAddress" size="small">
        </el-input>
      </el-form-item>
      <h2>实体仓库<span class='muted'>小亚通已对接京东等实体仓库，无实体仓库请忽略</span></h2>
      <el-form-item label="选择仓库">
        <el-cascader class="form-input" v-model="entityWms" :options="entityWmsOptions" clearable size="small"></el-cascader>
      </el-form-item>
      <el-form-item v-if="showEntityForm">
        <el-form class="entity-form" label-width="25%" label-position="left">
          <el-form-item v-for="param of paramsBeans" :label="param.paramTitle">
            <el-input class="form-input" v-model.trim="param.paramValue" size="small">
            </el-input>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save" size="small">保存</el-button>
        <el-button @click="cancel" size="small">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios';
import DistrictSelect from '../common/DistrictSelect';
import cloneDeep from 'lodash/cloneDeep';
// import {
//   noEmptyItem
// } from '../../assets/util';
let createWarehouseUrl = 'warehouse/warehouse/createWarehouse';
let updateWarehouseUrl = 'warehouse/warehouse/updateWarehouse';
let getEntityWmsTypeUrl = 'enum/getEntityWmsType';
let getJDExtWmsIdUrl = 'enum/getJDExtWmsId';
let getJDWmsParamsUrl = 'enum/getJDWmsParams';
export default {
  name: 'warehouse-edit',
  props: ['warehouse', 'wmsparams'],
  components: {
    DistrictSelect,
  },
  data() {
    return {
      warehouseEdit: {
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
        // wmsTag: '',
        // locTown: '所在城镇名称',
        // locZip: '邮政编码',
        // wmsCapacity: '仓库体积',
        // contactPhone: '仓库联系电话号码',
        // wmsPriority: '优先权从0-9,0为优先级最高,9为最低',
        // comments: '仓库备注',
      },
      entityWmsOptions: [],
      paramsBeans: [],
      paramItems: '',
      rules: {
        wmsName: {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
        contactName: {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
        contactMobile: [{
          required: true,
          message: '请输入',
        }, {
          validator(rule, value, callback) {
            if (isNaN(value) || value.length !== 11) {
              callback(new Error('请输入正确手机号'));
            } else {
              callback();
            }
          },
          trigger: 'blur',
        }],
        locState: {
          required: true,
          message: '请选择',
        },
        locCity: {
          required: true,
          message: '请选择',
        },
        locDistrict: {
          required: true,
          message: '请选择或输入',
          trigger: 'change',
        },
        locAddress: {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
      },
      loading: false,
    }
  },
  computed: {
    entityWms: {
      set(val) {
        this.warehouseEdit.entityWmsType = val[0];
        this.warehouseEdit.extWmsId = val[1];
        this.$forceUpdate();
      },
      get() {
        return [this.warehouseEdit.entityWmsType, this.warehouseEdit.extWmsId];
      },
    },
    showEntityForm() {
      return this.warehouseEdit.entityWmsType && this.warehouseEdit.entityWmsType.includes('@');
    }
  },
  watch: {
    warehouse: {
      handler(val) {
        this.warehouseEdit = Object.assign({
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
        }, val);
      },
      immediate: true,
    },
    wmsparams(val) {
      if (val && val.length) this.paramsBeans = cloneDeep(val);
    },
  },
  methods: {
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // if (this.showEntityForm) {
          //   if (!noEmptyItem(this.paramsBeans, 'paramValue')) {
          //     this.$message.error('请完善实体仓库信息');
          //     return;
          //   }
          // }
          let condition = {
            warehouse: this.warehouseEdit,
          };
          let url = '';
          if (this.warehouseEdit.wmsId) { // 修改
            url = updateWarehouseUrl;
            condition.warehouseId = this.warehouseEdit.wmsId;
          } else {
            url = createWarehouseUrl;
          }
          if (this.showEntityForm) { // 实体仓库信息
            condition.paramsBeans = this.paramsBeans;
          }
          this.loading = true;
          axios.post(url, condition).then(response => {
            this.loading = false;
            this.$message.success('操作成功！');
            this.$emit('success');
            if (!this.warehouseEdit.wmsId) {
              this.$store.dispatch('setRepositoryEnum');
            }
          }).catch(err => {
            this.loading = false;
            this.$msgbox({
              message: '操作失败，' + (err.response ? err.response.data : err),
              type: 'error',
            })
          })
        } else {
          return false;
        }
      });
    },
    districtChange(val) {
      this.warehouseEdit.locState = val[0];
      this.warehouseEdit.locCity = val[1];
      this.warehouseEdit.locDistrict = val[2];
    },
    // showEntityForm() {
    //   return this.warehouseEdit.entityWmsType && this.warehouseEdit.entityWmsType.includes('@');
    // },
    cancel() {
      this.$emit('close');
    },
  },
  mounted() {
    axios.post(getEntityWmsTypeUrl).then(response => {
      for (let i in response.data) {
        let option = {
          value: i,
          label: response.data[i],
        };
        if (i === 'JD') { // 如果今后有别的仓库接入，需要增加相应的children
          option.children = [];
          axios.post(getJDExtWmsIdUrl).then(response => {
            for (let i in response.data) {
              option.children.push({
                value: i,
                label: response.data[i],
              })
            }
          }).catch(e => {});
        }
        this.entityWmsOptions.push(option);
      }
    }).catch(e => {});
    if (this.wmsparams && this.wmsparams.length === 0) {
      axios.post(getJDWmsParamsUrl).then(response => {
        let paramsBeans = [];
        for (let i in response.data) {
          paramsBeans.push({
            paramTitle: response.data[i],
            paramCode: i,
            paramValue: '',
          });
        }
        this.paramsBeans = paramsBeans.sort((a, b) => {
          if (a.paramCode < b.paramCode) {
            return 1;
          } else {
            return -1;
          }
        });
      }).catch(e => {});
    } else {
      this.paramsBeans = cloneDeep(this.wmsparams).sort((a, b) => {
        if (a.paramCode < b.paramCode) {
          return 1;
        } else {
          return -1;
        }
      });
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.form-input {
  width: 260px;
}

.form-select {
  width: 13.6%;
}

.muted {
  margin-left: 45px;
  font-size: 12px;
  font-weight: normal;
}

.entity-form {
  display: flex;
  flex-wrap: wrap;
  background-color: @white;
  max-width: 840px;
  .el-form-item {
    flex-basis: 50%;
  }
  .form-input {
    padding-bottom: 15px;
  }
}
</style>
//
<style lang="less">
@import '../../main.less';
#warehouse-edit {
  .el-cascader--small .el-cascader__label {
    line-height: 35px;
  }
  .el-form-item.is-required .el-form-item__label:before {
    display: none;
  }
}
</style>
