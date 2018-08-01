/**
 * 查询报表
 * /finance/report/queryReports
 * 入参
 * {
 * 'queryCondition':{
 *      reportStatus: -1作废 0待出账 1待结账 2(保留字段) 3待结算 4已结算,
 *      supplierTenantId: 供应商租户id,
 *      supplierName: 供应商名称（模糊匹配),
 *      beginDate: 开始时间,
 *      endDate: 结束时间
 *  }
 *  'pageNumber': 1,
    'pageSize': 10
 * }
 * return 返回结果
 * {
 *  amount:1,
 *  beanList:[{
        'supplierName': 'XXXXX供应商A', // 供应商
        'setcycle': '2017-01-01 ~ 2017-04-30', // 结算周期
        'soldNum': '1343', // 已销商品数(件)
        'totalFee': '112301.23', // 销售额(元)
        'payFee': '112301.23', // 应付总额(元)
        'grossProfit': '0.32', // 毛利率
        'beginDate': '2017-01-01 00:00:00',
        'endDate': ' 2017-04-30 23:59:59',
        'opId': 1111,
        'remark': 'aaaa',
        'reportId': 1111,
        'reportStatus': 22,
        'state': 22,
        'supplierTenantId': 1111,
        'tenantId': 1111,
    }]
  }
 */

/**
 * 生成供应商报表，然后异步生成报表文件
 * 出账
 * /finance/report/generateReport
 * 入参
 * {
 *     supplierTenantIds:[],
 *     beginDate:'',
 *     endDate:''
 * }
 * @param supplierTenantIds = [] 供应商租户id列表
 * @param beginDate 周期开始时间
 * @param endDate 周期结束时间
 * @return 生成的报表数量
 */

/**
 * 更新报表状态
 * 对账/结算
 * /finance/report/updateReportStatus
 * {
 *     reportIds:[],
 *     reportStatus:3
 * }
 * @param reportIds =[] 供应商报表id列表
 * @param reportStatus 报表状态 -1作废 0待出账 1待结账 3待结算 4已结算
 * @return 更新后的报表状态
 * @throws Exception
 */

/**
 * 分页查询供应商报表，目前包括以下条件：报表id，报表状态，供应商租户id，供应商名称（模糊匹配），报表周期
 * 查询详情
 * /finance/report/queryReportDetail
 * @param queryCondition
 * {
 * "queryCondition":{
      reportId : "reportId", // 供应商报表id
      reportStatus : "reportStatus", // 报表状态
      supplierTenantId : "supplierTenantId", // 供应商租户id
      supplierName : "supplierName", // 供应商名称（模糊匹配）
      beginDate : "beginDate", // 开始时间
      endDate : "endDate" // 结束时间
 *  }
 *  "pageNumber": 1,
    "pageSize": 10
 *  }
 * @return
 * @throws Exception
 */

/**
 * 异步请求重出账，把周期内的该供应商订单重新结算，生成新的报表
 * /finance/report/requestForReGenerateReport
 * @param supplierTenantIds 供应商租户id列表
 * @param beginDate 周期开始时间
 * @param endDate 周期结束时间
 * @return 是否成功处理请求，0成功，-1失败
 * @throws Exception
 */

export let checkData = {
  amount: 1000,
  beanList: [{
    supplierTenantId: 10000001, // 供应商租户id,
    supplierName: 'XXXXX供应商A', // 供应商
    supplierId: '12345', // 供应商
    beginDate: 1485878400000,
    endDate: 1490889600000,
    setcycle: '02-01~03-31', // 结算周期
    soldNum: 1343, // 已销商品数(件)
    totalFee: '112301.23', // 销售额(元)
    payFee: '112301.23', // 应付总额(元)
    grossProfit: '0.32', // 毛利率
  }, {
    supplierTenantId: 10000002, // 供应商租户id,
    supplierName: 'XXXXX供应商B', // 供应商
    supplierId: '12346', // 供应商
    beginDate: 1483891200000,
    endDate: 1491926400000,
    setcycle: '01-09~04-12', // 结算周期
    soldNum: 1213, // 已销商品数(件)
    totalFee: '62301.23', // 销售额(元)
    payFee: '92301.23', // 应付总额(元)
    grossProfit: '0.29', // 毛利率
  }]
}
