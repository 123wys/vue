import axios from 'axios';
// import Vue from 'vue';
// const v = new Vue();
const orderType = {
  '': {
    label: '全部',
    icon: '',
    color: ''
  },
  '-1': {
    label: '已关闭',
    icon: '',
    color: ''
  },
  0: {
    label: '待支付',
    icon: 'icon iconfont',
    color: '',
  },
  1: {
    label: '待发货',
    icon: 'icon iconfont icon-yifahuo1',
    color: 'blue',
  },
  2: {
    label: '发货中',
    icon: 'icon iconfont ',
    color: '',
  },
  3: {
    label: '已发货',
    icon: 'icon iconfont icon-yifahuo',
    color: 'green',
  },
  4: {
    label: '已完成',
    icon: 'icon iconfont ',
    color: 'muted',
  },
  5: {
    label: '已拒收',
    icon: '',
    color: ''
  },
  6: {
    label: '预售',
    icon: 'icon iconfont icon-yushou',
    color: 'red',
  },
  7: {
    label: '待审核',
    icon: 'icon iconfont icon-icon',
    color: 'yellow',
  },
  999: {
    label: '已关闭',
    icon: 'icon iconfont ',
    color: '',
  }
};

const skuType = {
  '-1': {
    label: '已关闭',
    icon: 'icon iconfont ',
    color: '',
  },
  0: {
    label: '待付款',
    icon: 'icon iconfont icon-icon',
    color: 'yellow',
  },
  1: {
    label: '待发货',
    icon: 'icon iconfont icon-yifahuo1',
    color: 'blue',
  },
  2: {
    label: '发货中',
    icon: 'icon iconfont ',
    color: '',
  },
  3: {
    label: '已发货',
    icon: 'icon iconfont icon-yifahuo',
    color: 'green',
  },
  4: {
    label: '已完成',
    icon: 'icon iconfont ',
    color: 'muted',
  },
  5: {
    label: '已拒收',
    icon: '',
    color: ''
  },
  6: {
    label: '预售',
    icon: 'icon iconfont icon-yushou',
    color: 'red',
  },
  7: {
    label: '待审核',
    icon: 'icon iconfont icon-icon',
    color: 'yellow',
  },
  999: {
    label: '已关闭',
    icon: 'icon iconfont ',
    color: '',
  },
}

const warrantyStatus = {
  0: ' ',
  1: '退款中',
  2: '退款关闭',
  3: '退款成功',
  4: '退货中',
  5: '退货关闭',
  6: '退货成功',
};
// 售后单售后状态枚举
const warrantyStatusType = {
  '': '全部',
  0: '待审核',
  1: '待买家确认',
  2: '处理完成',
  999: '作废',
};
// 售后单操作类型枚举
const warrantyServiceType = {
  '': '全部',
  1: '补开发票',
  2: '改地址',
  3: '退款',
  4: '换货',
  5: '仅补偿',
};
// 售后货物状态枚举
const shippingStatus = {
  0: '待发货',
  1: '仓库发货中',
  2: '已发货',
  3: '已签收',
  4: '已拒收',
};
const payType = {
  WEIXIN_DAIXIAO: '微信',
};
const jobStatus = {
  0: {
    label: '待处理',
    type: '',
  },
  1: {
    label: '处理中',
    type: 'primary',
  },
  2: {
    label: '处理完成',
    type: 'gray',
  },
  3: {
    label: '处理失败',
    type: ''
  },
  4: {
    label: '作废',
    type: ''
  },
};
const platform = { // 平台icon
  kdt: 'icon iconfont icon-weibiaoti-',
  KDT: 'icon iconfont icon-weibiaoti-',
  taobao: 'icon iconfont icon-taobao',
  tmall: 'icon iconfont icon-tianmao1',
  TMALL: 'icon iconfont icon-tianmao1',
  jingdong: 'icon iconfont icon-jingdong',
  WEIDIAN: 'icon iconfont icon-weidian2',
  weidian: 'icon iconfont icon-weidian2',
  OFFLINE: 'icon iconfont icon-virtual',
  offline: 'icon iconfont icon-virtual'
}
const platformName = { // 平台名称
  kdt: '有赞',
  KDT: '有赞',
  taobao: '淘宝&天猫',
  TAOBAO: '淘宝&天猫',
  tmall: '淘宝&天猫',
  TMALL: '淘宝&天猫',
  jingdong: '京东',
  WEIDIAN: '微店',
  weidian: '微店',
  offline: '虚拟店铺',
  OFFLINE: '虚拟店铺'
}
const errorType = { // 问题订单原因/问题订单类型
  '-1': '找不到SKU',
  '-2': '收件人信息不完整',
  '-3': '订单缺少订单项',
  '-4': '调用产品管理接口异常',
  '-5': '手机号码长度不合法',
  '-6': '固定电话长度不合法',
  '-7': '邮政编码长度不合法',
  '-8': 'SKU未关联供应商',
  '-999': '未知原因',
}
const electronicType = { // 可支持电子面单打单枚举
  'EMS': 'EMS',
  'SF': '顺丰',
  'YTO': '圆通',
  'HTKY': '百世快递',
  'ZTO': '中通',
  'YD': '韵达',
  'STO': '申通',
  'DBL': '德邦物流',
  'UC': '优速',
  'ZJS': '宅急送',
  // 'JD': '京东',
  'XFEX': '信丰',
  'QFKD': '全峰',
  // 'KYSY': '跨越速运',
  // 'ANE': '安能',
  'FAST': '快捷',
  'GTO': '国通',
  'HHTT': '天天',
};
const cnLogisticType = {
  'EYB': '中国邮政',
  'EMS': 'EMS',
  'ZJS': '宅急送',
  'SF': '顺丰快递',
  'FAST': '快捷快递',
  'POSTB': '邮政商务小包',
  'HTKY': '百世快递',
  'YTO': '圆通快递',
  'ZTO': '中通快递',
  'UC': '优速快递',
  'GTO': '国通快递',
  'TTKDEX': '天天快递',
  'QFKD': '全峰快递',
  'STO': '申通快递',
  'YUNDA': '韵达快递'
};
const moduleName = { // 模块名称枚举
  // 150100: '导入生成订单',
  // 150101: '订单导出',
  // 150102: '发货单导入',
  // 150103: '导出订单物流信息',
  // 150104: '自定义导出类型',
  // 110101: '同步商品',
  // 110102: '同步商品图片',
  // 130101: '邀请企业',
  // 130102: '接受邀请',
  // 100101: '欠费提醒',
  150100: '导入订单',
  150101: '订单导出',
  150102: '发货单导入',
  150103: '导出订单物流信息',
  150104: '自定义导出类型',
  110101: '同步商品',
  110102: '同步商品图片',
  110103: '商品导出',
  130101: '邀请供应商',
  130102: '供应商接受邀请',
  130103: '邀请渠道商',
  130104: '渠道商接受邀请',
  130401: '店铺授权',
  100101: '欠费提醒',
  160101: '导出账单'
};
const logisticsCompanyAll = {
  ZTO: '中通快递',
  YTO: '圆通速递',
  SF: '顺丰速运',
  TTKDEX: '天天快递',
  HTKY: '百世快递',
  STO: '申通快递',
  EMS: 'EMS',
  DBL: '德邦物流',
  YUNDA: '韵达快递',
  EYB: 'EMS经济快递',
  UC: '优速快递',
  DBKD: '德邦快递',
  BESTQJT: '百世快运',
  POST: '中国邮政',
  CYS0000010: '京东快递',
  POSTB: '邮政快递包裹',
  ZJS: '宅急送',
  YCT: '黑猫宅急便',
  GTO: '国通快递',
  QFKD: '全峰快递',
  SURE: '速尔',
  FAST: '快捷快递',
  BHWL: '保宏物流',
  BEST: '百世物流',
  DFH: '东方汇',
  'BJRFD-001': '如风达配送',
  ESB: 'E速宝',
  DTW: '大田',
  CNEX: '佳吉快递',
  AIR: '亚风',
  CYEXP: '长宇',
  MGSD: '美国速递',
  UNIPS: '发网',
  FEDEX: '联邦快递',
  SHQ: '华强物流',
  GDEMS: '广东EMS',
  GZLT: '飞远配送',
  LB: '龙邦速递',
  PKGJWL: '派易国际物流77',
  UAPEX: '全一快递',
  LTS: '联昊通',
  HZABC: '飞远(爱彼西)配送',
  NEDA: '能达速递',
  QRT: '增益速递',
  HOAU: '天地华宇',
  WND: 'WnDirect',
  XB: '新邦物流',
  XFWL: '信丰物流',
  YC: '远长',
  YUD: '长发',
  OTHER: '其他',
};

// 物流配送方式枚举
const shippingType = {
  free: '卖家包邮',
  post: '平邮',
  express: '快递',
  ems: 'ems',
  virtual: '虚拟发货',
  25: '次日达',
  26: '预约配送',
  fetch: '到店自取',
  local: '同城配送',
}
/*
  获取权限
 */
const privilege = '/sysmgnt/privilege/selectPrivilegeSet4Oper';
/*
 不包含权限枚举
 */
const operatorEnum = 'enum/operators'; // 操作员枚举
const shopEnum = 'enum/shopInfo'; // 店铺枚举
const platformEnum = 'enum/platformId'; //  获取售卖渠道
// const logisticsCompanyEnum = 'enum/logisticsCompanyId'; //  获取快递
const roleIdsEnum = 'enum/roles';
const entityWmsTypeEnum = 'enum/getEntityWmsType'; // 获取实体仓库类型枚举
/*
 包含权限信息枚举
 */
const repositoryEnum = 'enum/warehouse'; // 仓库枚举
const supplierEnum = 'enum/supplier'; // 租户下的供应商
const channelEnum = 'enum/channel'; // 租户下的渠道商
// const tenantEnum = 'enum/tenantInfo'; // 供应商或渠道商
const allShopInfo = 'enum/allShopInfo'; // 跨权限查询店铺枚举,供应商 翻译店铺专用！！
const getEnum = function(url, callback, mutation, errmsg, data) {
  return axios.post(url, data).then(response => {
    callback(mutation, response.data);
    return 'success';
  }).catch(err => {
    // v.$msgbox({
    //   message: errmsg + (err.response ? err.response.data : err),
    //   type: 'error',
    // })
    console.error(errmsg + (err.response ? err.response.data : err))
    return new Error('error');
  })
}
const state = {
  privilege: [],
  orderType,
  skuType,
  warrantyStatus,
  payType,
  jobStatus,
  platform,
  platformName,
  errorType,
  warrantyStatusType,
  warrantyServiceType,
  shippingStatus,
  shippingType,
  electronicType,
  moduleName,
  logisticsCompanyAll,
  cnLogisticType,
  operatorEnum: {},
  shopEnum: {},
  platformEnum: {},
  entityWmsTypeEnum: {},
  repositoryEnum: {},
  supplierEnum: {},
  channelEnum: {},
  // tenantEnum: {},
  allShopInfo: {},
  operationRoleds: {},
};
const getters = {
  logisticsCompanyFH(state) { // 发货专用物流枚举
    const logisticsCompanyFH = {};
    const useKeywords = ['申通', '圆通', '中通', '汇通', '韵达', '顺丰', '天天快递', '德邦快递'];
    for (const i in state.logisticsCompanyAll) {
      if (useKeywords.some(n => state.logisticsCompanyAll[i].includes(n))) {
        logisticsCompanyFH[i] = state.logisticsCompanyAll[i]
      }
    }
    logisticsCompanyFH['EMS'] = 'EMS';
    return logisticsCompanyFH;
  },
  tenantEnum(state) {
    return Object.assign({}, state.supplierEnum, state.channelEnum);
  }
}
const mutations = {
  setPrivilege(state, payload) {
    state.privilege = payload;
  },
  // setLogisticsCompanyEnum(state, payload) {
  //   state.logisticsCompanyAll = Object.assign({}, payload);
  // },
  setOperatorEnum(state, payload) {
    state.operatorEnum = Object.assign({}, payload);
  },
  setShopEnum(state, payload) {
    state.shopEnum = Object.assign({}, payload);
  },
  setPlatformEnum(state, payload) {
    state.platformEnum = Object.assign({}, payload);
  },
  setRepositoryEnum(state, payload) {
    state.repositoryEnum = Object.assign({}, payload);
  },
  setSupplierEnum(state, payload) {
    state.supplierEnum = Object.assign({}, payload);
  },
  setChannelEnum(state, payload) {
    state.channelEnum = Object.assign({}, payload);
  },
  // setTenantEnum(state, payload) {
  //   state.tenantEnum = Object.assign({}, payload);
  // },
  setEntityWmsTypeEnum(state, payload) {
    state.entityWmsTypeEnum = Object.assign({}, payload);
  },
  setAllShopInfo(state, payload) {
    state.allShopInfo = Object.assign({}, payload);
  },
  setAllRoleIds(state, payload) {
    state.operationRoleds = Object.assign({}, payload);
  },
}
const actions = {
  // setLogisticsCompanyEnum({
  //   commit
  // }, payload) {
  //   getEnum(logisticsCompanyEnum, commit, 'setLogisticsCompanyEnum', '获取快递公司失败，');
  // },
  setPrivilege({
    commit
  }, payload) {
    return getEnum(privilege, commit, 'setPrivilege', '获取用户权限失败，');
  },
  setOperatorEnum({
    commit
  }, payload) {
    getEnum(operatorEnum, commit, 'setOperatorEnum', '获取操作员失败，');
  },
  setShopEnum({
    commit
  }, payload) {
    return getEnum(shopEnum, commit, 'setShopEnum', '获取店铺列表失败，');
  },
  setPlatformEnum({
    commit
  }, payload) {
    getEnum(platformEnum, commit, 'setPlatformEnum', '获取操作员失败');
  },
  setRepositoryEnum({
    commit
  }, payload) {
    getEnum(repositoryEnum, commit, 'setRepositoryEnum', '获取操仓库列表失败，');
  },
  setSupplierEnum({
    commit
  }, payload) {
    getEnum(supplierEnum, commit, 'setSupplierEnum', '获取供应商失败，');
  },
  // setTenantEnum({
  //   commit
  // }, payload) {
  //   getEnum(tenantEnum, commit, 'setTenantEnum', '获取租户列表失败，');
  // },
  setEntityWmsTypeEnum({
    commit
  }, payload) {
    getEnum(entityWmsTypeEnum, commit, 'setEntityWmsTypeEnum', '获取实体仓库枚举失败，');
  },
  setAllShopInfo({
    commit
  }, payload) {
    getEnum(allShopInfo, commit, 'setAllShopInfo', '获取店铺列表失败，');
  },
  setAllRoleIds({
    commit
  }, payload) {
    getEnum(roleIdsEnum, commit, 'setAllRoleIds', '获取角色列表失败，');
  },
  setChannelEnum({
    commit
  }, payload) {
    getEnum(channelEnum, commit, 'setChannelEnum', '获取渠道列表失败，');
  },
}
export default {
  state,
  getters,
  mutations,
  actions
}
