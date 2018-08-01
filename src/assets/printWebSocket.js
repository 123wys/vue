import axios from 'axios';
// 菜鸟接口调用
// 获取全部电子面单模板
export function getAllStdtemplates(accessToken) {
  let query = {
    session: accessToken,
  };
  return axios.post('electronicSheet/cnEs/stdtemplates', query)
}
// 获取商家已配置的电子面单模板
export function getMyStdtemplates(accessToken) {
  let query = {
    session: accessToken,
  };
  return axios.post('electronicSheet/cnEs/mystdtemplates', query)
}
// 获取发货地&CP开通状态&账户的使用情况
export function isvSearch(accessToken, cpCode) {
  let query = {
    session: accessToken
  };
  query.cp_code = cpCode || '';
  return axios.post('electronicSheet/cnEs/countSearch', query)
}
// 获取商家自定义区模板
export function getMyCustomTemplate(accessToken, templateId) {
  let query = {
    session: accessToken,
    template_id: templateId
  };
  return axios.post('electronicSheet/cnEs/customares', query)
}
// 取号
export function orderPrint(accessToken, selectOrders, shopEnum, cnForm, branchArr, templateUrlArr, customData) {
  doSetPrinterConfig(cnForm.printer); // 设置所用打印机
  let query = convert2orderPrint(accessToken, selectOrders, shopEnum, cnForm, branchArr, templateUrlArr); // 拼接叫号数据
  axios.post('electronicSheet/cnEs/orderPrint', query)
  .then(res => {
    if (res.data.modules) {
      doPrint(res.data, customData, cnForm.printer) // param1.叫号所得模板数据 2.客户自定义区 3.所选打印机 
    }
  })
}
// 数据结构调整
function convert2orderPrint(accessToken, selectOrders, shopEnum, cnForm, branchArr, templateUrlArr) {
  let query = {
    session: accessToken,
    param_waybill_cloud_print_apply_new_request: {
      cp_code: cnForm.logisticType, // 物流公司编码
      sender: { // 寄件人信息
        address: {
          ...branchArr[cnForm.branchName].shipp_address_cols.address_dto[cnForm.addressIndex]
        },
        name: cnForm.name,
        mobile: cnForm.mobile, // 手机号
        phone: cnForm.phone, // 固话
      },
    }
  };
  query.param_waybill_cloud_print_apply_new_request.trade_order_info_dtos = order2tb(selectOrders);
  let shopUserId = '';
  shopEnum.forEach(shop => {
    if (shop.value === cnForm.accessToken) {
      shopUserId = shop.userId;
    }
  })
  query.param_waybill_cloud_print_apply_new_request.trade_order_info_dtos.forEach(ele => {
    ele.template_url = templateUrlArr[cnForm.esUrl].user_std_template_url;
    ele.user_id = shopUserId;
  })
  return query;
}
// 区分平台
function switchPlatform(val) {
  let platform = '';
  switch (val) {
    case 'TMALL':
      platform = 'TB';
      break;
    default:
      platform = 'OTHERS';
      break;
  }
  return platform;
}

function order2tb(selectOrders) {
  let arr = [];
  for (let i = 0; i < selectOrders.length; i++) {
    var obj = {
      object_id: i,
      order_info: {
        order_channels_type: switchPlatform(selectOrders[i].platformId),
        trade_order_list: [selectOrders[i].extOrderId],
      },
      package_info: {
        items: []
      },
      recipient: {
        address: {
          province: selectOrders[i].receiverState,
          city: selectOrders[i].receiverCity,
          district: selectOrders[i].receiverDistrict,
          detail: selectOrders[i].receiverAddress
        },
        name: selectOrders[i].receiverName,
        mobile: selectOrders[i].receiverMobile
      },
    };
    for (let k = 0; k < selectOrders[i].orderItems.length; k++) {
      obj.package_info.items.push({
        name: selectOrders[i].orderItems[k].skuTitle,
        count: selectOrders[i].orderItems[k].num
      })
    }
    arr.push(obj);
  }
  return arr;
}
// 开始连接打印机
var socket;
// 打开Socket
// http的端口是13528
// socket = new WebSocket('ws://127.0.0.1:13528');
// 如果是https的话，端口是13529
socket = new WebSocket('wss://localhost:13529');
var key = false; // 判断是否安装了菜鸟插件
var printerData = {};
// 打开Socket
socket.onopen = function(event) {
  key = true;
  if (key) {
    getPrinters();
  }
  socket.onmessage = function(eventMsg) {
    var data = JSON.parse(eventMsg.data);
    if ('getPrinters' === data.cmd) {
      printerData = data.printers;
    }
  }
};
export {
  printerData
}; // 传出socket;
export function doConnect() {
  return key;
}
/***
 *
 * 获取请求的UUID，指定长度和进制,如
 * getUUID(8, 2)   //"01001010" 8 character (base=2)
 * getUUID(8, 10) // "47473046" 8 character ID (base=10)
 * getUUID(8, 16) // "098F4D35"。 8 character ID (base=16)
 *
 */
function getUUID(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
    uuid = [],
    i;
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    var r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}
/***
 * 构造request对象
 */
function getRequestObject(cmd) {
  var request = new Object();
  request.requestID = getUUID(8, 16);
  request.version = '1.0';
  request.cmd = cmd;
  return request;
}
/**
 * 请求打印机列表demo
 * */
export function getPrinters() {
  var request = getRequestObject('getPrinters');
  socket.send(JSON.stringify(request));
}
/**
 * 设置打印机
 **/
function doSetPrinterConfig(val) {
  var request = new Object();
  request.requestID = getUUID(8, 16);
  request.version = '1.0';
  request.cmd = 'setPrinterConfig';
  request.printer = {
    needTopLogo: false,
    needBottomLogo: false
  };
  request.printer.name = val;
  socket.send(JSON.stringify(request));
}
/**
 * 开始打印
 **/
function doPrint(printData, customData, printer) {
  var request = new Object();
  request.requestID = printData.request_id;
  request.version = '1.0';
  request.cmd = 'print';
  request.task = {
    taskID: getUUID(6, 16),
    preview: false,
    printer: printer,
    notifyMode: 'allInOne',
    firstDocumentNumber: 0, // v0.2.8.3 新增：task 起始 document 序号
    totalDocumentCount: printData.modules.waybill_cloud_print_response.length // v0.2.8.3 本次新增task document 总数
  }
  request.task.documents = convert2document(printData.modules.waybill_cloud_print_response, customData);
  socket.send(JSON.stringify(request));
}
// 取号数据 拍为 打印数据
function convert2document(data, customData) {
  var arr = [];
  var customObj = {
      templateURL: customData.result.datas.custom_area_result[0].custom_area_url
    };
  for (let i = 0; i < data.length; i++) {
    arr.push({
      documentID: data[i].waybill_code,
      contents: [JSON.parse(data[i].print_data), customObj]
    });
  }
  return arr;
}