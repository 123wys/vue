var testData = {
  'chartsData': {
    'legend': {
      'data': [
        '吴酒'
      ]
    },
    'xAxis': {
      'data': [
        '2017-04-02',
        '2017-04-03',
        '2017-04-04',
        '2017-04-05'
      ]
    },
    'series': [{
      'name': '吴酒',
      'type': 'line',
      'smooth': true,
      'stack': '总量',
      'areaStyle': {
        'normal': {}
      },
      'data': [
        34,
        24,
        28,
        12
      ]
    }]
  },
  'countAll': 488
}

var dataA = {
  amount: 1,
  beanList: [{
    infoId: 'hello world',
    createTime: '2017-05-03 12:00:00',
    totalOrder: 1,
    auditOrder: 1,
    waitingOrder: 1,
    aftersales: 1,
    errorOrder: 1,
    state: ''
  }]
}
export default testData
export { dataA }
