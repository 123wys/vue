<template>
  <el-cascader :options="options" ref="cascader" :size="size" v-model="selection" @active-item-change="itemChangeHandler" @change="changeHandler"></el-cascader>
</template>
<script>
import axios from 'axios';
const provinceUrl = 'enum/getProvince';
const cityUrl = 'enum/getCity';
const districtUrl = 'enum/getDistrict';
export default {
  name: 'district-select',
  props: {
    province: {
      default: '',
    },
    city: {
      default: '',
    },
    district: {
      default: '',
    },
    size: String,
  },
  data() {
    return {
      selection: this.propDistrict,
      options: [],
    }
  },
  computed: {
    propDistrict() {
      return [this.province, this.city, this.district];
    },
  },
  methods: {
    getProvinces() {
      if (this.options.length && this.options[0].key) {
        return Promise.resolve();
      }
      return axios.post(provinceUrl).then(response => {
        this.options = Object.keys(response.data).map(n => {
          return {
            label: response.data[n],
            value: response.data[n],
            key: n,
            children: [],
          }
        });
      }).catch(e => {
        this.$msgbox({
          title: '提示',
          message: '获取省列表失败！',
          type: 'error',
        });
      })
    },
    getCitys(province) {
      if (province.children.length && province.children[0].key) {
        return Promise.resolve();
      }
      return axios.post(cityUrl, {
        provinceId: province.key
      }).then(response => {
        province.children = Object.keys(response.data).map(n => {
          return {
            label: response.data[n],
            value: response.data[n],
            key: n,
            children: [],
          }
        });
      }).catch(e => {
        this.$msgbox({
          title: '提示',
          message: '获取市列表失败！',
          type: 'error',
        });
      })
    },
    getDistricts(city) {
      if (city.children.length && city.children[0].key) return;
      axios.post(districtUrl, {
        cityId: city.key
      }).then(response => {
        let keys = Object.keys(response.data);
        if (keys.length === 0) {
          this.$delete(city, 'children')
        } else {
          city.children = keys.map(n => {
            return {
              label: response.data[n],
              value: response.data[n],
              key: n,
            }
          })
        }
      }).catch(e => {
        this.$msgbox({
          title: '提示',
          message: '获取区列表失败！',
          type: 'error',
        });
      })
    },
    itemChangeHandler(val) {
      let province = this.options.find(n => val[0] === n.label);
      this.getCitys(province).then(() => {
        if (val[1]) {
          let city = province.children.find(n => val[1] === n.label);
          this.getDistricts(city);
        }
      })
    },
    changeHandler(val) {
      if (val.length === 2) {
        this.$emit('district-change', [...val, '']);
      } else {
        this.$emit('district-change', val);
      }
    },
    initOptions() {
      if (!this.selection[0]) {
        this.getProvinces();
        return;
      }
      this.initOption(this.options, this.selection[0]);
      let province = this.options.find(n => n.label === this.selection[0]);
      let city;
      if (this.selection[1] && province) {
        this.initOption(province.children, this.selection[1]);
        city = province.children.find(n => n.label === this.selection[1]);
        if (this.selection[2] && city && city.children) {
          this.initOption(city.children, this.selection[2]);
        }
      }
      this.getProvinces().then(() => {
        province = this.options.find(n => n.label === this.selection[0]);
        if (!province) return;
        this.initOption(province.children, this.selection[1]);
        city = province.children.find(n => n.label === this.selection[1]);
        if (!city || !city.children) return;
        this.initOption(city.children, this.selection[2]);
        this.getCitys(province).then(() => {
          city = province.children.find(n => n.label === this.selection[1]);
          if (!city || !city.children) return
          this.initOption(city.children, this.selection[2], false);
        }).then(() => {
          city = province.children.find(n => n.label === this.selection[1]);
          if (!city) return
          this.getDistricts(city);
        })
      })
    },
    initOption(array, item, hasChildren = true) {
      if (!array.length) {
        if (hasChildren) {
          array.push({
            label: item,
            value: item,
            children: [],
          })
        } else {
          array.push({
            label: item,
            value: item,
          })
        }
      }
    },
  },
  watch: {
    propDistrict: {
      handler(val) {
        this.selection = val;
        this.initOptions();
        // if (this.options.length && this.options[0].key) {
        //   this.itemChangeHandler(val);
        // } else {
        //   this.getProvinces().then(() => {
        //     this.itemChangeHandler(val);
        //   })
        // }
      },
      immediate: true,
    }
  },
}
</script>
