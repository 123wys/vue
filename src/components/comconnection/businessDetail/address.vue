<template>
  <div>
    <el-select v-model="ruleForm.locProvince" placeholder="省" @change="locProvinceChange" style='width:130px'>
      <el-option v-for="locProvince of locProvinceGroup" :label="locProvince" :value="locProvince" :key="locProvince"></el-option>
    </el-select>
    <el-select v-model="ruleForm.locCity" placeholder="市" @change="locCityChange" style='width:130px'>
      <el-option v-for="locCity of locCityGroup" :label="locCity" :value="locCity" :key="locCity"></el-option>
    </el-select>
    <el-select v-model="ruleForm.locDistrict" placeholder="区" style='width:130px'>
      <el-option v-for="locDistrict of locDistrictGroup" :label="locDistrict" :value="locDistrict" :key="locDistrict"></el-option>
    </el-select>
    <el-input v-model="ruleForm.locAddress" placeholder="街道详细地址" style='width:400px'></el-input>
  </div>
</template>
<script>
export default {
  name: 'haddress',
  props: ['ruleForm', 'addmark'],
  data() {
    return {
      locProvinceGroup: {},
      locCityGroup: {},
      locDistrictGroup: {},
      pf: true,
      cf: true
    }
  },
  created() {
    this.getlocProvince();
  },
  mounted() {},
  computed: {},
  activated() {},
  methods: {
    //  省市区三级联动
    getlocProvince() {
      this.axios.get('enum/getProvince').then(response => {
        this.locProvinceGroup = response.data;
        if (this.ruleForm.locProvince) {
          let locProvinceId;
          for (let x in this.locProvinceGroup) {
            if (this.locProvinceGroup[x] === this.ruleForm.locProvince) {
              locProvinceId = x;
            }
          }
          this.getlocCity(locProvinceId);
        };
      }).catch(error => {
        this.$message.error(error.response.data);
      });
    },
    locProvinceChange() {
      if (!this.addmark.pf) {
        this.ruleForm.locCity = '';
        this.ruleForm.locDistrict = '';
        this.locDistrictGroup = [];
      }
      this.addmark.pf = false;
      let locProvinceId;
      for (let x in this.locProvinceGroup) {
        if (this.locProvinceGroup[x] === this.ruleForm.locProvince) {
          locProvinceId = x;
        }
      }
      this.getlocCity(locProvinceId);
    },
    getlocCity(locProvinceId) {
      if (!locProvinceId) {
        return false;
      }
      this.axios.get('enum/getCity', {
        params: {
          provinceId: locProvinceId,
        },
      }).then(response => {
        this.locCityGroup = response.data;
        if (this.ruleForm.locCity) {
          let locCityId;
          for (let x in this.locCityGroup) {
            if (this.locCityGroup[x] === this.ruleForm.locCity) {
              locCityId = x;
            }
          }
          this.getlocDistrict(locCityId);
        }
      }).catch(error => {
        this.$message.error(error.response.data);
      });
    },
    locCityChange(locCity) {
      if (!this.addmark.cf) {
        this.ruleForm.locDistrict = '';
      }
      this.addmark.cf = false;
      let locCityId;
      for (let x in this.locCityGroup) {
        if (this.locCityGroup[x] === this.ruleForm.locCity) {
          locCityId = x;
        }
      }
      this.getlocDistrict(locCityId);
    },
    getlocDistrict(locCityId) {
      if (!locCityId) {
        return false;
      }
      this.axios.get('enum/getDistrict', {
        params: {
          cityId: locCityId,
        },
      }).then(response => {
        this.locDistrictGroup = response.data;
      }).catch(error => {
        this.$message.error(error.response.data);
      });
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
</style>
