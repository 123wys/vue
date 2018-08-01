<template>
  <div v-loading="loading" id="warehouse-edit">
    <h2>基本信息</h2>
    <el-form :model="warehouseEdit" :rules="rules" ref="form" label-width="10%" label-position="left">
      <el-form-item label="仓库名称" prop="wmsName">
        <el-input class="form-input" placeholder="" v-model.trim="warehouseEdit.wmsName" :maxlength="20">
        </el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contactName">
        <el-input class="form-input" placeholder="" v-model.trim="warehouseEdit.contactName" :maxlength="10">
        </el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="contactMobile">
        <el-input placeholder="" v-model="warehouseEdit.contactMobile" class="form-input">
        </el-input>
      </el-form-item>
      <el-form-item label="仓库地址" prop="locDistrict">
        <district-select class="district form-input" :province="warehouseEdit.locState" :city="warehouseEdit.locCity" :district="warehouseEdit.locDistrict" @district-change="districtChange"></district-select>
        <el-input class="form-input" placeholder="街道详细地址" v-model.trim="warehouseEdit.locAddress">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios';
import DistrictSelect from '../../common/DistrictSelect';
let createWarehouseUrl = 'warehouse/warehouse/createWarehouse';
let updateWarehouseUrl = 'warehouse/warehouse/updateWarehouse';
export default {
  name: 'warehouse-edit',
  props: ['warehouse'],
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
        // wmsTag: '',
        // locTown: '所在城镇名称',
        // locZip: '邮政编码',
        // wmsCapacity: '仓库体积',
        // contactPhone: '仓库联系电话号码',
        // wmsPriority: '优先权从0-9,0为优先级最高,9为最低',
        // comments: '仓库备注',
      },
      rules: {
        wmsName: {
          required: true,
          message: '请输入',
        },
        contactName: {
          required: true,
          message: '请输入',
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
          }
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
          trigger: 'formSubmit',
        },
        locAddress: {
          required: true,
          message: '请输入',
        },
      },
      loading: false,
    }
  },
  computed: {},
  watch: {
    warehouse: {
      handler(val) {
        this.warehouseEdit = Object.assign({}, val);
      },
      immediate: true,
    }
  },
  methods: {
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let url = '';
          if (this.warehouseEdit.wmsId) { // 修改
            url = updateWarehouseUrl;
          } else {
            url = createWarehouseUrl;
          }
          this.loading = true;
          let condition = {
            warehouse: this.warehouseEdit
          };
          axios.post(url, condition).then(response => {
            this.loading = false;
            this.$message.success('操作成功！');
            this.$emit('success');
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
    cancel() {
      this.$emit('close');
    },
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../../main.less';
.form-input {
  width: 42%;
}

.form-select {
  width: 13.6%;
}

.district {
  display: block;
  margin-bottom: @baseSpace*2;
}
</style>
<style lang="less">
@import '../../../main.less';
#warehouse-edit .el-form-item.is-required .el-form-item__label:before {
  display: none;
}
</style>
