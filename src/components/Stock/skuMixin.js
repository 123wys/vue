import axios from 'axios';
const querySkuUrl = '/product/prodoffering/querySku'; // 查
const queryShopUrl = '/customer/shopInfo/queryShop';
let skuMxin = {
  data() {
    return {
      shopList: [],
      query: {
        name: '',
        outerId: '',
        mergedType: [0, 1],
        shopId: '',
        supplierTenantId: '',
        wmsStatus: '',
      },
      queryStock: false,
      pageSize: 20,
      pageNumber: 1,
      sortType: '',
      mergedTypes: [{
        label: '全部',
        value: '',
      }, {
        label: '可共享',
        value: 0,
      }, {
        label: '共享主体',
        value: 1,
      }, {
        label: '已共享',
        value: 2,
      }],
      wmsStatusEnum: [{
        label: '全部',
        value: '',
      // }, {
      //   label: '未注册',
      //   value: 0,
      }, {
        label: '注册中',
        value: 1,
      }, {
        label: '已注册',
        value: 2,
      }],
      loading: false,
      skuData: {
        amount: 0,
        beanList: [],
      },
    }
  },
  computed: {
    platform() {
      return this.$store.state.enumSet.platform;
    },
    supplierEnum() {
      return this.$store.state.enumSet.supplierEnum;
    },
  },
  methods: {
    queryHandler() {
      return this.getShopListLength().then(length => {
        if (length === 0) {
          this.$msgbox({
            message: '您尚未授权店铺，请先授权店铺！',
            type: 'error',
            // }).then(() => {
            //   this.$router.push('/shop');
          })
        } else if (length > 0) {
          this.loading = true;
          axios.post(querySkuUrl, {
            queryCondition: this.query,
            queryStock: this.queryStock,
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            sortType: this.sortType,
          }).then(response => {
            this.skuData = response.data;
            this.loading = false;
          }).catch(err => {
            this.loading = false;
            this.$msgbox({
              title: '提示',
              message: '查询失败，' + (err.response ? err.response.data : err),
              type: 'error',
            })
          })
        }
      });
    },
    sizeChangeHandler(pageSize) {
      this.pageSize = pageSize
      this.queryHandler();
    },
    currentChangeHandler(pageNumber) {
      this.pageNumber = pageNumber;
      this.queryHandler();
    },
    getIcon(platformId) {
      return this.$store.state.enumSet.platform[platformId];
    },
    getShopListLength() {
      if (this.isSearchedShop) {
        return Promise.resolve(this.query.shopId.length);
      }
      return this.getShopList();
    },
    getShopList() {
      return axios.post(queryShopUrl).then(response => {
        this.isSearchedShop = true;
        if (response.data.length > 0) {
          this.query.shopId = response.data.map(n => {
            return n.shopId;
          });
        }
        return response.data.length;
      }).catch(err => {
        this.$msgbox({
          message: '获取店铺列表失败，请稍后刷新重试' + (err.response ? err.response.data : err),
          type: 'error',
        })
      });
    }
  },
}
export default skuMxin;
