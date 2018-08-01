import getLodop from './LodopFuncs.js'
var printCtrl = null; //  打印控件

var printType = 0; //  0预览出货单,1打印出货单,2打印物流单
var arrySender; //  寄件人信息
var arryReceiver; //  父页面传过来的收件人相关信息
var strHtml; // 电子面单打印模板
var logisticInfo; // 电子面单物流选择
var printerIndex; // 打印机
/*
arryReceiver[0] = erp内部订单号
arryReceiver[1] = 手机号
arryReceiver[2] = 收货人
arryReceiver[4] = 省
arryReceiver[5] = 市
arryReceiver[6] = 区
arryReceiver[7] = 地址
arryReceiver[8] = 买家留言
 */
var custOrderLogisticsList; //  父页面传过来的发货清单信息
//  custOrderLogisticsList:[物流公司编码，物流单号，包裹明细[num,ordId,prodName,remainNumber,price,amount,ordItemId]]

/* 打印物流单
logisticsCompanyId:
STO=申通快递
ZTO=中通速递
BSHT=汇通快运
YTO=圆通速递
YUNDA=韵达快运
EMS=邮政EMS
SF=顺丰速运
DBKB=德邦快递
 */
function CreateShipPage(logisticsCompanyId, printer) {
  /*
  printCtrl.PRINT_INIT('套打模板');
  var imageUrl = getRootPath() + '/resource/express/' + logisticsCompanyId +'.png';
  printCtrl.ADD_PRINT_IMAGE(0,0,0,0,'<img border='0' src=''+ imageUrl+'' />');
  */
  printCtrl.PRINT_INITA(10, 10, 762, 533, '物流单套打');
  /*
    printCtrl.SET_PRINT_STYLEA(0,'Stretch',2);
  if(logisticsCompanyId!='SF'){
    printCtrl.SET_PRINT_PAGESIZE(1,'230mm','127mm','');
  }else{
    printCtrl.SET_PRINT_PAGESIZE(1,'230mm','140mm','');
  }
  */
  printCtrl.SET_PRINTER_INDEXA(printer);
  //  add by YuanH 20160929 增加未定义判断
  for (var i = 0; i < arrySender.length; i++) {
    arrySender[i] = arrySender[i] === undefined ? '' : arrySender[i];
  }
  for (let i = 0; i < arryReceiver.length; i++) {
    arryReceiver[i] = arryReceiver[i] === undefined ? '' : arryReceiver[i];
  }
  if (logisticsCompanyId == 'DBKD') { // 德邦快递
    printCtrl.ADD_PRINT_TEXT(115, 124, 100, 24, arrySender[1]); // "始发地"
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
    printCtrl.ADD_PRINT_TEXT(114, 265, 100, 25, arrySender[0]); // 寄件人姓名
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
    printCtrl.ADD_PRINT_TEXT(144, 125, 100, 25, arrySender[8]); // 月结号
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
    printCtrl.ADD_PRINT_TEXT(172, 134, 214, 24, arrySender[7]); // 寄件人电话
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 11);
    printCtrl.ADD_PRINT_TEXT(200, 129, 268, 41, arrySender[3] + arrySender[4] + arrySender[5] + arrySender[6]); // 寄件人地址
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
    printCtrl.ADD_PRINT_TEXT(244, 128, 100, 25, ''); //收件人单位
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
    printCtrl.ADD_PRINT_TEXT(244, 274, 100, 25, arryReceiver[2]); // 收件人姓名
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
    printCtrl.ADD_PRINT_TEXT(272, 131, 215, 25, arryReceiver[1]); // 收件人电话
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
    printCtrl.ADD_PRINT_TEXT(299, 122, 64, 25, arryReceiver[4]); // 收件人 省份
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
    printCtrl.ADD_PRINT_TEXT(299, 182, 68, 25, arryReceiver[5]); // 收件人 市区
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
    printCtrl.ADD_PRINT_TEXT(299, 246, 78, 25, arryReceiver[6]); // 收件人 县区
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
    printCtrl.ADD_PRINT_TEXT(326, 93, 297, 25, arryReceiver[7]); // 收件人详细地址
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
    printCtrl.ADD_PRINT_TEXT(68, 581, 85, 40, arryReceiver[5]); // 目的地
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 14);
    printCtrl.SET_PRINT_STYLEA(0, "Alignment", 2);
    printCtrl.SET_PRINT_STYLEA(0, "Bold", 1);
  }
  if (logisticsCompanyId == 'STO') { // 申通快递
    printCtrl.ADD_PRINT_TEXT(100, 134, 108, 44, arrySender[0]); //寄件人姓名
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 14);
    printCtrl.ADD_PRINT_TEXT(91, 287, 121, 41, arrySender[1]); //始发地
    printCtrl.SET_PRINT_STYLEA(0, "FontName", "黑体");
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 16);
    printCtrl.ADD_PRINT_TEXT(100, 499, 116, 42, arryReceiver[2]); //收件人名字
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 14);
    printCtrl.ADD_PRINT_TEXT(100, 663, 112, 47, arryReceiver[5]); //收件人地市
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 16);
    printCtrl.SET_PRINT_STYLEA(0, "Bold", 1);
    printCtrl.ADD_PRINT_TEXT(155, 115, 70, 35, arrySender[3]); //寄件地址，省份
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 14);
    printCtrl.ADD_PRINT_TEXT(155, 207, 66, 39, arrySender[4]); //寄件地址，地市
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 14);
    printCtrl.ADD_PRINT_TEXT(155, 293, 90, 38, arrySender[5]); //寄件地址，区
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 14);
    printCtrl.ADD_PRINT_TEXT(154, 478, 82, 41, arryReceiver[4]); //收件地址，省份
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 14);
    printCtrl.ADD_PRINT_TEXT(152, 568, 82, 42, arryReceiver[5]); //收件地址，地市
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 14);
    printCtrl.ADD_PRINT_TEXT(150, 656, 74, 41, arryReceiver[6]); //收件地址，区
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 14);
    printCtrl.ADD_PRINT_TEXT(187, 50, 357, 35, arrySender[6]); //寄件人地址
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 11);
    printCtrl.ADD_PRINT_TEXT(183, 411, 358, 36, arryReceiver[7]); //收件人地址
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 11);
    printCtrl.ADD_PRINT_TEXT(210, 163, 192, 31, arrySender[7]); //寄件人联系电话
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 14);
    printCtrl.ADD_PRINT_TEXT(210, 536, 248, 31, arryReceiver[1]); //收件人联系电话
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 14);
    printCtrl.ADD_PRINT_TEXT(344, 415, 357, 117, arryReceiver[8]); //买家留言
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 14);
    printCtrl.ADD_PRINT_TEXT(127, 130, 100, 35, arrySender[2]); //发货公司名字
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 14);
    printCtrl.SET_PRINT_STYLEA(0, "Bold", 1);
  } else if (logisticsCompanyId == 'ZTO') { // 中通速递
    printCtrl.ADD_PRINT_TEXT(94, 118, 114, 30, arrySender[0]); // 寄件人
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.ADD_PRINT_TEXT(184, 114, 283, 25, arrySender[2]); // 单位名称
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.SET_PRINT_STYLEA(0, 'Bold', 1);
    printCtrl.ADD_PRINT_TEXT(98, 479, 104, 34, arryReceiver[2]); // 收件人名字
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.ADD_PRINT_TEXT(98, 641, 121, 31, arryReceiver[5]); // 收件地址，地市
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 16);
    printCtrl.SET_PRINT_STYLEA(0, 'Bold', 1);
    printCtrl.ADD_PRINT_TEXT(130, 477, 283, 24, arryReceiver[4] + ',' + arryReceiver[5] + ',' + arryReceiver[6]); // 收件人省市区
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(129, 120, 278, 21, arrySender[3] + ',' + arrySender[4] + ',' + arrySender[5]); // 寄件人省市区
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(161, 61, 329, 24, arrySender[6]); // 寄件人详细地址
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(162, 420, 338, 20, arryReceiver[7]); // 收件人详细地址
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(211, 127, 272, 31, arrySender[7]); // 寄件人联系电话
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.ADD_PRINT_TEXT(214, 472, 291, 25, arryReceiver[1]); // 收件人联系电话
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.ADD_PRINT_TEXT(363, 563, 199, 100, arryReceiver[8]); // 买家留言
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
  } else if (logisticsCompanyId == 'BSHT') { // 汇通快运
    printCtrl.ADD_PRINT_TEXT(84, 115, 125, 30, arrySender[0]); // 寄件人
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.ADD_PRINT_TEXT(86, 284, 112, 27, arrySender[1]); // 始发地
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 16);
    printCtrl.SET_PRINT_STYLEA(0, 'Bold', 1);
    printCtrl.ADD_PRINT_TEXT(112, 104, 294, 25, arrySender[2]); // 单位名称
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.SET_PRINT_STYLEA(0, 'Bold', 1);
    printCtrl.ADD_PRINT_TEXT(82, 466, 143, 28, arryReceiver[2]); // 收件人名字
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.ADD_PRINT_TEXT(82, 646, 116, 26, arryReceiver[5]); // 收件地址，地市
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 16);
    printCtrl.SET_PRINT_STYLEA(0, 'Bold', 1);
    printCtrl.ADD_PRINT_TEXT(163, 61, 84, 32, arrySender[3]); // 寄件地址，省份
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.ADD_PRINT_TEXT(164, 159, 93, 29, arrySender[4]); // 寄件地址，地市
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.ADD_PRINT_TEXT(165, 265, 99, 31, arrySender[5]); // 寄件地址，区
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.ADD_PRINT_TEXT(198, 55, 343, 26, arrySender[6]); // 寄件人详细地址
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(168, 410, 100, 31, arryReceiver[4]); // 收件地址，省份
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.ADD_PRINT_TEXT(168, 520, 88, 32, arryReceiver[5]); // 收件地址，地市
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.ADD_PRINT_TEXT(166, 627, 99, 30, arryReceiver[6]); // 收件地址，区
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.ADD_PRINT_TEXT(197, 406, 353, 30, arryReceiver[7]); // 收件人详细地址
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(219, 109, 291, 31, arrySender[7]); // 寄件人联系电话
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.ADD_PRINT_TEXT(218, 459, 296, 30, arryReceiver[1]); // 收件人联系电话
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.ADD_PRINT_TEXT(350, 547, 216, 66, arryReceiver[8]); // 买家留言
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 12);
  } else if (logisticsCompanyId == 'YTO') { // 圆通速递
    printCtrl.ADD_PRINT_TEXT(88, 119, 100, 30, arrySender[0]); // 寄件人
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.ADD_PRINT_TEXT(87, 257, 143, 27, arrySender[1]); // 始发地
    printCtrl.SET_PRINT_STYLEA(0, 'FontName', '黑体');
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 16);
    printCtrl.SET_PRINT_STYLEA(0, 'Bold', 1);
    printCtrl.ADD_PRINT_TEXT(108, 111, 302, 25, arrySender[2]); // 单位名称
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.SET_PRINT_STYLEA(0, 'Bold', 1);
    printCtrl.ADD_PRINT_TEXT(86, 481, 168, 28, arryReceiver[2]); // 收件人名字
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.ADD_PRINT_TEXT(41, 654, 123, 49, arryReceiver[5]); // 收件地址，地市
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 16);
    printCtrl.SET_PRINT_STYLEA(0, 'Bold', 1);
    printCtrl.ADD_PRINT_TEXT(135, 469, 75, 28, arryReceiver[4]); // 收件地址，省份
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(135, 109, 59, 21, arrySender[3]); // 寄件地址，省份
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(134, 177, 54, 24, arrySender[4]); // 寄件地址，地市
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(134, 249, 48, 25, arrySender[5]); // 寄件地址，区
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(134, 553, 59, 25, arryReceiver[5]); // 收件地址，地市
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(132, 621, 52, 25, arryReceiver[6]); // 收件地址，区
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(161, 60, 337, 35, arrySender[6]); // 寄件人详细地址
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(161, 426, 344, 36, arryReceiver[7]); // 收件人详细地址
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(201, 149, 150, 25, arrySender[7]); // 寄件人联系电话
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(203, 507, 173, 25, arryReceiver[1]); // 收件人联系电话
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(364, 461, 174, 66, arryReceiver[8]); // 买家留言
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 10);
  } else if (logisticsCompanyId == 'YUNDA') { // 韵达快运
    printCtrl.ADD_PRINT_TEXT(86, 118, 75, 36, arrySender[0]); // 寄件人
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.ADD_PRINT_TEXT(115, 126, 262, 25, arrySender[2]); // 单位名称
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.SET_PRINT_STYLEA(0, 'Bold', 1);
    printCtrl.ADD_PRINT_TEXT(88, 451, 88, 33, arryReceiver[2]); // 收件人名字
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.ADD_PRINT_TEXT(87, 595, 158, 31, arryReceiver[5]); // 收件地址，地市
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 16);
    printCtrl.SET_PRINT_STYLEA(0, 'Bold', 1);
    printCtrl.ADD_PRINT_TEXT(148, 449, 303, 29, arryReceiver[4] + ',' + arryReceiver[5] + ',' + arryReceiver[6]); // 收件人省市区
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(145, 123, 265, 31, arrySender[3] + ',' + arrySender[4] + ',' + arrySender[5]); // 寄件人省市区
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(176, 64, 325, 34, arrySender[6]); // 寄件人详细地址
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(179, 390, 364, 35, arryReceiver[7]); // 收件人详细地址
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(201, 241, 147, 36, arrySender[7]); // 寄件人联系电话
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 12);
    printCtrl.ADD_PRINT_TEXT(203, 390, 159, 31, arryReceiver[1]); // 收件人联系电话
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 12);
    printCtrl.ADD_PRINT_TEXT(345, 535, 219, 89, arryReceiver[8]); // 买家留言
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
  } else if (logisticsCompanyId == 'EMS') { // 邮政EMS
    printCtrl.ADD_PRINT_TEXT(85, 127, 112, 35, arrySender[0]); // 寄件人
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.ADD_PRINT_TEXT(86, 291, 133, 32, arrySender[7]); // 寄件人联系电话
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 12);
    printCtrl.ADD_PRINT_TEXT(111, 132, 184, 25, arrySender[2]); // 单位名称
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.SET_PRINT_STYLEA(0, 'Bold', 1);
    printCtrl.ADD_PRINT_TEXT(202, 131, 110, 28, arryReceiver[2]); // 收件人名字
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 14);
    printCtrl.ADD_PRINT_TEXT(303, 145, 179, 26, arryReceiver[5]); // 收件地址，地市
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 16);
    printCtrl.SET_PRINT_STYLEA(0, 'Bold', 1);
    printCtrl.ADD_PRINT_TEXT(200, 293, 186, 24, arryReceiver[1]); // 收件人联系电话
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 12);
    printCtrl.ADD_PRINT_TEXT(131, 107, 354, 21, arrySender[3] + ',' + arrySender[4] + ',' + arrySender[5]); // 寄件人省市区
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(153, 89, 383, 19, arrySender[6]); // 寄件人详细地址
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(263, 89, 390, 20, arryReceiver[4] + ',' + arryReceiver[5] + ',' + arryReceiver[6]); // 收件人省市区
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(286, 87, 388, 20, arryReceiver[7]); // 收件人详细地址
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 11);
    printCtrl.ADD_PRINT_TEXT(361, 654, 162, 90, arryReceiver[8]); // 买家留言
    printCtrl.SET_PRINT_STYLEA(0, 'FontSize', 10);
  } else if (logisticsCompanyId == 'SF') { // 顺丰速运
    printCtrl.ADD_PRINT_TEXT(100, 314, 75, 30, arrySender[0]); //寄件人
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 14);
    printCtrl.ADD_PRINT_TEXT(210, 83, 53, 33, arrySender[1]); //始发地
    printCtrl.SET_PRINT_STYLEA(0, "FontName", "黑体");
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 14);
    printCtrl.ADD_PRINT_TEXT(100, 132, 100, 25, arrySender[2]); //单位名称
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 14);
    printCtrl.SET_PRINT_STYLEA(0, "Bold", 1);
    printCtrl.ADD_PRINT_TEXT(183, 322, 72, 33, arryReceiver[2]); //收件人名字
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 14);
    // printCtrl.ADD_PRINT_TEXT(360,78,55,31,arryReceiver[5]);//收件地址，地市
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 14);
    printCtrl.SET_PRINT_STYLEA(0, "Bold", 1);
    printCtrl.ADD_PRINT_TEXT(213, 130, 274, 34, arryReceiver[4] + "   " + arryReceiver[5] + "  " + arryReceiver[6]); //收件人省市区
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 11);
    printCtrl.ADD_PRINT_TEXT(130, 105, 267, 26, arrySender[3] + "" + arrySender[4] + "" + arrySender[5]); //寄件人省市区
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 11);
    printCtrl.ADD_PRINT_TEXT(130, 240, 294, 24, arrySender[6]); //寄件人详细地址
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 11);
    printCtrl.ADD_PRINT_TEXT(155, 135, 138, 35, arrySender[7]); //寄件人联系电话
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 13);
    printCtrl.ADD_PRINT_TEXT(235, 78, 403, 30, arryReceiver[7]); //收件人详细地址
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 11);
    printCtrl.ADD_PRINT_TEXT(255, 150, 195, 31, arryReceiver[1]); //收件人联系电话
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 13);
    printCtrl.ADD_PRINT_TEXT(455, 561, 192, 66, arryReceiver[8]); //买家留言
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 11);
  } else if (logisticsCompanyId == 'TTKDEX') { // 天天快递
    printCtrl.PRINT_INITA(1, 1, 960, 508, "");
    printCtrl.SET_PRINT_PAGESIZE(1, 2400, 1270, "");
    // printCtrl.ADD_PRINT_SETUP_BKIMG("< img src='dorado/bdf2/uploader/process.display?id=eac3a735-b63f-4ed5-aceb-209fe8ebebf2&orgcode=work' />");
    // printCtrl.SET_SHOW_MODE("BKIMG_WIDTH","118.53mm");
    // printCtrl.SET_SHOW_MODE("BKIMG_HEIGHT","127mm");
    // printCtrl.ADD_PRINT_TEXT(248,84,305,57,"[卖家备注]");
    // printCtrl.SET_PRINT_STYLEA(0,"FontSize",14);
    // printCtrl.SET_PRINT_STYLEA(0,"Bold",1);
    // printCtrl.ADD_PRINT_TEXT(110,594,184,33,"[会员呢称]");
    // printCtrl.SET_PRINT_STYLEA(0,"FontSize",13);
    // printCtrl.SET_PRINT_STYLEA(0,"Bold",1);
    printCtrl.ADD_PRINT_TEXT(107, 466, 110, 30, arryReceiver[2]); // 收件人姓名
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 13);
    printCtrl.SET_PRINT_STYLEA(0, "Bold", 1);
    printCtrl.ADD_PRINT_TEXT(170, 451, 324, 77, arryReceiver[4] + arryReceiver[5] + arryReceiver[6] + arryReceiver[7]); // 收件人地址
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 13);
    printCtrl.SET_PRINT_STYLEA(0, "Bold", 1);
    printCtrl.ADD_PRINT_TEXT(236, 480, 136, 33, arryReceiver[1]); // 收件人电话
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 13);
    printCtrl.SET_PRINT_STYLEA(0, "Bold", 1);
    printCtrl.ADD_PRINT_TEXT(106, 286, 154, 30, ''); // 固定电话
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 13);
    printCtrl.SET_PRINT_STYLEA(0, "Bold", 1);
    printCtrl.ADD_PRINT_TEXT(207, 623, 144, 29, ''); // 收件人备用电话
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 13);
    printCtrl.SET_PRINT_STYLEA(0, "Bold", 1);
    printCtrl.ADD_PRINT_TEXT(106, 138, 120, 32, arrySender[0]); // 寄件人姓名
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 13);
    printCtrl.SET_PRINT_STYLEA(0, "Bold", 1);
    printCtrl.ADD_PRINT_TEXT(236, 135, 138, 35, arrySender[7]); //寄件人联系电话
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 13);
    printCtrl.ADD_PRINT_TEXT(-2, 23, 135, 85, ''); // 打印序号
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 16);
    printCtrl.SET_PRINT_STYLEA(0, "Bold", 1);
    printCtrl.ADD_PRINT_TEXT(309, 84, 312, 51, arryReceiver[8]); // 买家留言
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 13);
    printCtrl.SET_PRINT_STYLEA(0, "Bold", 1);
    printCtrl.ADD_PRINT_TEXT(344, 445, 335, 101, arryReceiver[5]); // 目的地大字
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 33);
    printCtrl.SET_PRINT_STYLEA(0, "Bold", 1);
    printCtrl.ADD_PRINT_TEXT(396, 77, 262, 33, ''); // 寄件时间
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
    printCtrl.SET_PRINT_STYLEA(0, "Bold", 1);
    printCtrl.ADD_PRINT_HTM(169, 119, 307, 109, arrySender[3] + '' + arrySender[4] + arrySender[5] + arrySender[6]); // 寄件人地址
    printCtrl.ADD_PRINT_TEXT(137, 127, 267, 35, arrySender[2]); // 店铺
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 17);
    printCtrl.SET_PRINT_STYLEA(0, "Bold", 1);
  }
}

// 生成发货清单内容
function CreateProductListPage(arryProduct, printer) {
  printCtrl.PRINT_INITA(0, 0, 1100, 533, "发货清单");
  printCtrl.SET_PRINTER_INDEXA(printer);

  printCtrl.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
  // printCtrl.PRINT_INITA(0,-43,1046,542,"发货清单");
  // printCtrl.SET_PRINT_PAGESIZE(1,2300,1270,"");
  printCtrl.ADD_PRINT_IMAGE(8, 60, 0, 1, "(图像1的超文本路径)");
  printCtrl.SET_PRINT_STYLEA(0, "Stretch", 2);
  var fhStr = arryProduct[0][6] ? '[' + arryProduct[0][6] + ']' : '';
  printCtrl.ADD_PRINT_TEXT(35, 276, 291, 52, fhStr + "发货清单");
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 16);
  printCtrl.SET_PRINT_STYLEA(0, "Bold", 1);
  printCtrl.ADD_PRINT_TEXT(80, 34, 100, 30, "买家姓名：");
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
  printCtrl.ADD_PRINT_TEXT(80, 116, 100, 31, arryReceiver[2]);
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
  printCtrl.ADD_PRINT_TEXT(80, 240, 100, 40, "买家电话：");
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
  printCtrl.ADD_PRINT_TEXT(80, 317, 151, 40, arryReceiver[1]);
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
  printCtrl.ADD_PRINT_TEXT(80, 433, 100, 36, "发货日期：");
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
  printCtrl.ADD_PRINT_TEXT(80, 515, 142, 37, getNowDate());
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
  printCtrl.ADD_PRINT_TEXT(80, 638, 100, 42, "总件数：");
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
  printCtrl.ADD_PRINT_TEXT(108, 34, 1000, 40, '买家地址:' + arryReceiver[4] + arryReceiver[5] + arryReceiver[6] + arryReceiver[7]);
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
  //计算总件数
  var totalNum = 0;
  for (var i = 0; i < arryProduct.length; i++) {
    totalNum += arryProduct[i][3];
  }

  printCtrl.ADD_PRINT_TEXT(80, 703, 110, 46, totalNum.toString());
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
  printCtrl.ADD_PRINT_RECT(138, 32, 685, 54, 0, 1);
  printCtrl.ADD_PRINT_LINE(138, 91, 192, 91, 0, 1);
  printCtrl.ADD_PRINT_LINE(138, 299, 192, 299, 0, 1);
  printCtrl.ADD_PRINT_LINE(138, 461, 192, 461, 0, 1);
  printCtrl.ADD_PRINT_LINE(138, 542, 192, 542, 0, 1);
  printCtrl.ADD_PRINT_LINE(138, 631, 192, 631, 0, 1);
  printCtrl.ADD_PRINT_TEXT(158, 41, 100, 50, "序号");
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 16);
  printCtrl.ADD_PRINT_TEXT(158, 134, 164, 45, "商城订单号");
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 16);
  printCtrl.ADD_PRINT_TEXT(158, 338, 161, 41, "商品名称");
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 16);
  printCtrl.ADD_PRINT_TEXT(158, 482, 100, 51, "数量");
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 16);
  printCtrl.ADD_PRINT_TEXT(158, 565, 100, 40, "单价");
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 16);
  printCtrl.ADD_PRINT_TEXT(158, 652, 100, 45, "金额");
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 16);
  for (var i = 0; i < arryProduct.length; i++) {
    //num,ordId,prodName,number,price,amount,ordItemId
    var num = arryProduct[i][0]; //序号
    var ordId = arryProduct[i][1]; //商城订单号
    var prodName = arryProduct[i][2]; //商品名称
    var number = arryProduct[i][3]; //数量
    var price = arryProduct[i][4]; //单价
    var amount = arryProduct[i][5]; //金额

    printCtrl.ADD_PRINT_LINE(138 + (i + 1) * 50, 32, 188 + (i + 1) * 50, 32, 0, 1); //最左
    printCtrl.ADD_PRINT_LINE(138 + (i + 1) * 50, 91, 188 + (i + 1) * 50, 91, 0, 1);
    printCtrl.ADD_PRINT_LINE(138 + (i + 1) * 50, 299, 188 + (i + 1) * 50, 299, 0, 1);
    printCtrl.ADD_PRINT_LINE(138 + (i + 1) * 50, 461, 188 + (i + 1) * 50, 461, 0, 1);
    printCtrl.ADD_PRINT_LINE(138 + (i + 1) * 50, 542, 188 + (i + 1) * 50, 542, 0, 1);
    printCtrl.ADD_PRINT_LINE(138 + (i + 1) * 50, 631, 188 + (i + 1) * 50, 631, 0, 1);
    printCtrl.ADD_PRINT_LINE(138 + (i + 1) * 50, 718, 188 + (i + 1) * 50, 718, 0, 1); //最右
    printCtrl.ADD_PRINT_LINE(188 + (i + 1) * 50, 32, 188 + (i + 1) * 50, 718, 0, 1); //横线
    printCtrl.ADD_PRINT_TEXT(200 + i * 50, 60, 100, 25, num); //序号
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
    printCtrl.ADD_PRINT_TEXT(200 + i * 50, 98, 202, 25, ordId); //商城订单号
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 11);
    printCtrl.ADD_PRINT_TEXT(195 + i * 50, 310, 160, 25, prodName); //商品名称
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 10);
    printCtrl.ADD_PRINT_TEXT(200 + i * 50, 500, 37, 25, number); //数量
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
    printCtrl.ADD_PRINT_TEXT(200 + i * 50, 549, 88, 25, "￥" + Number(price).toFixed(2)); //单价"￥52.00"
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
    printCtrl.ADD_PRINT_TEXT(200 + i * 50, 638, 90, 25, "￥" + Number(amount).toFixed(2)); //金额
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
  }
}

// 生成A5出货单
function CreateOrderListPageA5(orderList, printer) {
  var length = orderList.orderItems.length;
  printCtrl.PRINT_INITA(0, 0, "139.99mm", "210mm", "A5纸打印设计");
  printCtrl.SET_PRINTER_INDEXA(printer);
  printCtrl.SET_PRINT_PAGESIZE(1, 0, 0, "A5");
  printCtrl.ADD_PRINT_TEXT(5, 6, 493, 30, "发货清单");
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 15);
  printCtrl.SET_PRINT_STYLEA(0, "Alignment", 2);
  printCtrl.SET_PRINT_STYLEA(0, "Bold", 1);
  printCtrl.ADD_PRINT_SHAPE(4, "9mm", "2.91mm", "135.2mm", "0.26mm", 0, 1, "#000000");
  printCtrl.ADD_PRINT_TEXT("10.05mm", "1.59mm", "19.84mm", "6.61mm", "收件人:");
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
  printCtrl.SET_PRINT_STYLEA(0, "Bold", 1);
  printCtrl.ADD_PRINT_TEXT("10.58mm", "21.17mm", "26.46mm", "5.82mm", orderList.receiverName); // 收件人姓名
  printCtrl.ADD_PRINT_TEXT("16.67mm", "1.59mm", "26.46mm", "5.82mm", orderList.receiverMobile); // 收件人phone
  printCtrl.ADD_PRINT_TEXT("22.49mm", "1.59mm", "132.29mm", "5.82mm", orderList.receiverState + orderList.receiverCity + orderList.receiverDistrict + orderList.receiverAddress);
  printCtrl.ADD_PRINT_TEXT(40, 259, 70, 24, "操作员:");
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
  printCtrl.SET_PRINT_STYLEA(0, "Bold", 1);
  printCtrl.ADD_PRINT_TEXT(42, 328, 85, 25, arrySender[0]); // 操作员
  printCtrl.ADD_PRINT_TEXT(42, 423, 110, 25, arrySender[7]); // 操作员电话
  printCtrl.ADD_PRINT_SHAPE(4, "27.99mm", "2.12mm", "134.94mm", "0.26mm", 0, 1, "#000000");
  printCtrl.ADD_PRINT_TEXT("29.1mm", "1.59mm", "18.52mm", "5.56mm", "订单编号：");
  printCtrl.ADD_PRINT_TEXT("29.1mm", "19.58mm", "57.94mm", "5.82mm", orderList.extOrderId); // 订单编号
  printCtrl.ADD_PRINT_TEXT("35.19mm", "1.59mm", "18.26mm", "5.82mm", "付款时间:");
  printCtrl.ADD_PRINT_TEXT("35.19mm", "19.58mm", "60.33mm", "5.82mm", orderList.payTime); // 付款时间

  printCtrl.ADD_PRINT_LINE(152, 5, 152, 520, 0, 1);
  printCtrl.ADD_PRINT_TEXT("41.96mm", "1.48mm", "23.42mm", "7.06mm", "商品自编码");
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 11);
  printCtrl.SET_PRINT_STYLEA(0, "Alignment", 2);
  printCtrl.ADD_PRINT_TEXT("41.96mm", "24.9mm", "40.64mm", "7.06mm", "商品名称");
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 11);
  printCtrl.SET_PRINT_STYLEA(0, "Alignment", 2);
  printCtrl.ADD_PRINT_TEXT("41.96mm", "65.99mm", "35.35mm", "7.06mm", "规格");
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 11);
  printCtrl.SET_PRINT_STYLEA(0, "Alignment", 2);
  printCtrl.ADD_PRINT_TEXT("41.96mm", "100.97mm", "17.99mm", "7.06mm", "数量");
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 11);
  printCtrl.SET_PRINT_STYLEA(0, "Alignment", 2);
  printCtrl.ADD_PRINT_TEXT("41.96mm", "119.06mm", "16.67mm", "7.06mm", "单价￥");
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 11);
  printCtrl.SET_PRINT_STYLEA(0, "Alignment", 2);
  printCtrl.ADD_PRINT_LINE(182, 6, 182, 520, 0, 1); //横线
  // 表格竖线
  printCtrl.ADD_PRINT_LINE(182 + length * 44, 5, 151, 5, 0, 1);
  printCtrl.ADD_PRINT_LINE(182 + length * 44, 94, 151, 94, 0, 1);
  printCtrl.ADD_PRINT_LINE(182 + length * 44, 248, 151, 248, 0, 1);
  printCtrl.ADD_PRINT_LINE(182 + length * 44, 382, 151, 382, 0, 1);
  printCtrl.ADD_PRINT_LINE(182 + length * 44, 450, 151, 450, 0, 1);
  printCtrl.ADD_PRINT_LINE(182 + length * 44, 520, 151, 520, 0, 1);
  // 订单详细
  for (var i = 0; i < length; i++) {
    printCtrl.ADD_PRINT_TEXT(182 + i * 44, 6, 88, 44, orderList.orderItems[i].outerId); //自编码
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 11);
    printCtrl.ADD_PRINT_TEXT(182 + i * 44, 96, 154, 44, orderList.orderItems[i].skuTitle); //商品名称
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 10);
    printCtrl.ADD_PRINT_TEXT(182 + i * 44, 250, 134, 44, orderList.orderItems[i].skuSpecChars); //规格
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 10);
    printCtrl.ADD_PRINT_TEXT(182 + i * 44, 384, 68, 44, orderList.orderItems[i].num); //数量
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 11);
    printCtrl.ADD_PRINT_TEXT(182 + i * 44, 452, 63, 44, Number(orderList.orderItems[i].price).toFixed(2)); //单价
    printCtrl.SET_PRINT_STYLEA(0, "FontSize", 11);
    printCtrl.ADD_PRINT_LINE(182 + (i + 1) * 44, 6, 182 + (i + 1) * 44, 520, 0, 1); //横线
  }
  // 金额信息
  printCtrl.ADD_PRINT_TEXT(188 + i * 44, 97, 418, 22, "总价: ￥" + orderList.totalFee + '  优惠: ￥' + orderList.discountFee);
  printCtrl.SET_PRINT_STYLEA(0, "Alignment", 3);
  printCtrl.ADD_PRINT_TEXT(210 + i * 44, 34, 481, 25, "实付金额: ￥" + orderList.paidFee);
  printCtrl.SET_PRINT_STYLEA(0, "FontSize", 12);
  printCtrl.SET_PRINT_STYLEA(0, "Alignment", 3);
  printCtrl.SET_PRINT_STYLEA(0, "Bold", 1);
}

// 生成热敏小票
function CreateOrderListPageMini(orderList, printer) {
  var length = orderList.orderItems.length;
  printCtrl.PRINT_INITA(0,0,"55.01mm","210mm","热敏小票打印设计");
  printCtrl.SET_PRINTER_INDEXA(printer);
  printCtrl.SET_PRINT_PAGESIZE(3,550,10,"热敏小票");
  var fhStr = orderList.shopTranslation ? orderList.shopTranslation : '发货单';
  printCtrl.ADD_PRINT_TEXT(4,2,200,30, fhStr);
  printCtrl.SET_PRINT_STYLEA(0,"FontSize",11);
  printCtrl.SET_PRINT_STYLEA(0,"Alignment",2);
  printCtrl.SET_PRINT_STYLEA(0,"Bold",1);
  printCtrl.ADD_PRINT_TEXT(33,2,200,22,"订单号:" + orderList.extOrderId);
  printCtrl.SET_PRINT_STYLEA(0,"FontSize",8);
  printCtrl.ADD_PRINT_TEXT(55,2,200,22, "付款时间:" + orderList.payTime);
  printCtrl.SET_PRINT_STYLEA(0,"FontSize",8);
  printCtrl.ADD_PRINT_TEXT(76,2,200,22, "收件人:" + orderList.receiverName + ' ' + orderList.receiverMobile);
  printCtrl.ADD_PRINT_TEXT(99,2,200,40, "地址: " + orderList.receiverState + orderList.receiverCity + orderList.receiverDistrict + orderList.receiverAddress);
  printCtrl.ADD_PRINT_TEXT(140,2,90,23,"商品名称");
  printCtrl.SET_PRINT_STYLEA(0,"Alignment",2);
  printCtrl.SET_PRINT_STYLEA(0,"Bold",1);
  printCtrl.ADD_PRINT_TEXT(140,91,70,23,"单价/数量");
  printCtrl.SET_PRINT_STYLEA(0,"Alignment",2);
  printCtrl.SET_PRINT_STYLEA(0,"Bold",1);
  printCtrl.ADD_PRINT_TEXT(140,160,45,23,"小计");
  printCtrl.SET_PRINT_STYLEA(0,"Alignment",2);
  printCtrl.SET_PRINT_STYLEA(0,"Bold",1);
  printCtrl.ADD_PRINT_LINE(158, 1, 158, 205, 0, 1);

  for (var i = 0; i < length; i++) {
    printCtrl.ADD_PRINT_TEXT(162 + i * 40, 2, 90, 40, orderList.orderItems[i].skuTitle);
    printCtrl.SET_PRINT_STYLEA(0,"FontSize",7);
    printCtrl.ADD_PRINT_TEXT(162 + i * 40, 92, 70, 40, orderList.orderItems[i].price + '/' + orderList.orderItems[i].num);
    printCtrl.SET_PRINT_STYLEA(0,"FontSize",8);
    printCtrl.SET_PRINT_STYLEA(0, "Alignment", 2);
    printCtrl.ADD_PRINT_TEXT(162 + i * 40, 160, 45, 40, parseFloat(orderList.orderItems[i].num * Number(orderList.orderItems[i].price)).toFixed(2));
    printCtrl.SET_PRINT_STYLEA(0,"FontSize",8);
    printCtrl.SET_PRINT_STYLEA(0,"Alignment",2);
  }
  printCtrl.ADD_PRINT_TEXT(162 + length * 40, 5, 195, 26, "总价:￥" + orderList.totalFee + "元 优惠:￥" + orderList.discountFee + '元');
  printCtrl.SET_PRINT_STYLEA(0,"Alignment",3);
  printCtrl.ADD_PRINT_TEXT(188 + length * 40, 5, 195, 26, "实付金额:￥" + orderList.paidFee + '元');
  printCtrl.SET_PRINT_STYLEA(0,"Bold",1);
  printCtrl.SET_PRINT_STYLEA(0,"Alignment",3);
}

// 电子面单
function es(strHtml, logisticInfo, printer) {
  printCtrl.PRINT_INIT("打印电子面单");
  printCtrl.SET_PRINTER_INDEXA(printer);
  printCtrl.SET_PRINT_PAGESIZE(3, '100mm', '0mm', '电子面单');
  // if (logisticInfo.logisticType == 'EMS') {  // EMS
  //     printCtrl.SET_PRINT_PAGESIZE(1, '100mm','150mm','电子面单');
  // } else if (logisticInfo.logisticType == 'SF') { // 顺丰
  //     if (logisticInfo.templateSize) {
  //       printCtrl.SET_PRINT_PAGESIZE(1, '100mm','210mm','电子面单');
  //     } else {
  //       printCtrl.SET_PRINT_PAGESIZE(1, '100mm','150mm','电子面单');
  //     }
  // } else if (logisticInfo.logisticType == 'YTO') { // 圆通
  //     printCtrl.SET_PRINT_PAGESIZE(1, '100mm','180mm','电子面单');
  // } else if (logisticInfo.logisticType == 'HTKY') { // 百世快递
  //     if (logisticInfo.templateSize) {
  //       printCtrl.SET_PRINT_PAGESIZE(1, '100mm','180mm','电子面单');
  //     } else {
  //       printCtrl.SET_PRINT_PAGESIZE(1, '100mm','183mm','电子面单');
  //     }
  // } else if (logisticInfo.logisticType == 'ZTO') { // 中通
  //     printCtrl.SET_PRINT_PAGESIZE(1, '100mm','180mm','电子面单');
  // } else if (logisticInfo.logisticType == 'YD') { // 韵达
  //     if (logisticInfo.templateSize) {
  //       printCtrl.SET_PRINT_PAGESIZE(1, '100mm','180mm','电子面单');
  //     } else {
  //       printCtrl.SET_PRINT_PAGESIZE(1, '100mm','203mm','电子面单');
  //     }
  // } else if (logisticInfo.logisticType == 'STO') { // 申通
  //     printCtrl.SET_PRINT_PAGESIZE(1, '100mm','180mm','电子面单');
  // } else if (logisticInfo.logisticType == 'DBL') { // 德邦
  //     printCtrl.SET_PRINT_PAGESIZE(1, '100mm','177mm','电子面单');
  // } else if (logisticInfo.logisticType == 'UC') { // 优速
  //     printCtrl.SET_PRINT_PAGESIZE(1, '100mm','180mm','电子面单');
  // } else if (logisticInfo.logisticType == 'ZJS') { // 宅急送
  //     printCtrl.SET_PRINT_PAGESIZE(1, '100mm','120mm','电子面单');
  // } else if (logisticInfo.logisticType == 'JD') { // 京东
  //     printCtrl.SET_PRINT_PAGESIZE(1, '100mm','110mm','电子面单');
  // } else if (logisticInfo.logisticType == 'XFEX') { // 信丰
  //     printCtrl.SET_PRINT_PAGESIZE(1, '100mm','150mm','电子面单');
  // } else if (logisticInfo.logisticType == 'QFKD') { // 全峰
  //     printCtrl.SET_PRINT_PAGESIZE(1, '100mm','180mm','电子面单');
  // } else if (logisticInfo.logisticType == 'KYSY') { // 跨越速运
  //     printCtrl.SET_PRINT_PAGESIZE(1, '100mm','137mm','电子面单');
  // } else if (logisticInfo.logisticType == 'ANE') { // 安能
  //     printCtrl.SET_PRINT_PAGESIZE(1, '100mm','180mm','电子面单');
  // } else if (logisticInfo.logisticType == 'FAST') { // 快捷
  //     printCtrl.SET_PRINT_PAGESIZE(1, '100mm','180mm','电子面单');
  // } else if (logisticInfo.logisticType == 'GTO') { // 国通
  //     printCtrl.SET_PRINT_PAGESIZE(1, '100mm','180mm','电子面单');
  // } else if (logisticInfo.logisticType == 'HHTT') { // 天天
  //     printCtrl.SET_PRINT_PAGESIZE(1, '100mm','180mm','电子面单');
  // }
  printCtrl.ADD_PRINT_HTM(0, 0, '100mm', '100%', strHtml);
  // printCtrl.ADD_PRINT_IMAGE('1mm', '1mm', '100mm', '99%', strHtml);
  // printCtrl.ADD_PRINT_HTML(0, 0, '100mm', '100%', strHtml);
  // printCtrl.ADD_PRINT_TABLE(0, 0, '100mm', '100%', strHtml);
}

function getRootPath() {
  // 获取当前网址，如： http:// localhost:8083/uimcardprj/share/meun.jsp
  var curWwwPath = window.document.location.href;
  // 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
  var pathName = window.document.location.pathname;
  var pos = curWwwPath.indexOf(pathName);
  // 获取主机地址，如： http:// localhost:8083
  var localhostPaht = curWwwPath.substring(0, pos);
  // 获取带'/'的项目名，如：/uimcardprj
  var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
  return (localhostPaht + projectName);
}

// 页面载入马上执行
function callPrint(arrParam, electronic, billOfSale) {
  printCtrl = getLodop();
  if (printCtrl == null) {
    return -1; // 未打印成功
  }

  if (arrParam == undefined) {
    alert('提示：打印窗口未收到任何打印或预览信息，请联系相关工程师解决！');
    return;
  }
  printType = arrParam[0]; // 0预览出货单,1打印出货单,2打印物流单
  arryReceiver = arrParam[1][0]; // 父页面传过来的收件人相关信息
  custOrderLogisticsList = arrParam[2]; // 父页面传过来的发货清单信息
  arrySender = arrParam[3]; // add by YuanH 父页面发货人信息
  printerIndex = arrParam[4]; // 打印机编号
  if (electronic && electronic.length > 0) {
    strHtml = electronic[0]; // 电子面单
    logisticInfo = electronic[1]; // 电子面单物流公司
    printerIndex = electronic[2]; // 选择打印机
  }
  if (printType == 0) { // 发货清单内容预览
    CreateProductListPage(custOrderLogisticsList[0][2]); // 只预览第一个包裹的发货清单
    printCtrl.PREVIEW();
    return printType;
  } else if (printType == 1) { // 发货清单内容全部打印
    var bPrinted = true;
    for (var j = 0; j < custOrderLogisticsList.length; j++) {
      arryReceiver = arrParam[1][j];
      CreateProductListPage(custOrderLogisticsList[j][2], printerIndex); // 循环打印发货清单  
      // printCtrl.PRINT();
      if (printCtrl.PRINT()) {} // 已发出实际打印命令！
      else { // 用户放弃打印！
        bPrinted = false;
      }
    }
    if (bPrinted) {
      return printType;
    }
  } else if (printType == 2) { // 打印物流单
    // 如果涉及多个物流公司的发货单，给出一个提醒
    var msg = getLogisticsCompanyMsg(custOrderLogisticsList);
    if (msg != '') {
      alert('提示：本次涉及多个物流公司【' + msg + '】的物流单打印，请注意按发货明细的顺序在打印机上放置物流单！');
    }
    var bPrinted = true;
    for (var j = 0; j < custOrderLogisticsList.length; j++) {
      arryReceiver = arrParam[1][j];
      CreateShipPage(custOrderLogisticsList[j][0], printerIndex); // 传入物流公司编码  
      // printCtrl.PRINT();
      if (printCtrl.PRINT()) {} // 已发出实际打印命令！
      else { // 用户放弃打印！
        bPrinted = false;
      }
    }
    if (bPrinted) {
      return printType;
    }
  } else if (printType == 3) { // 打印电子面单
    var bPrinted = true;
    es(strHtml, logisticInfo, printerIndex);
    if (printCtrl.PRINT()) {} else {
      bPrinted = false;
    }
    if (bPrinted) {
      return printType;
    }
  } else if (printType == 4) { // 打印a5、热敏小票 出货单
    var bPrinted = true;

    if (billOfSale[1] == 'a5') {
      CreateOrderListPageA5(billOfSale[0], billOfSale[2]); // param1: 订单数据, param2: 打印机编号
    } else {
      CreateOrderListPageMini(billOfSale[0], billOfSale[2]);
    }
    // es(strHtml, logisticInfo);

    if (printCtrl.PRINT()) {} else {
      bPrinted = false;
    }
    if (bPrinted) {
      return printType;
    }
  }
  return -1; // 未打印标志
}

/*弹出窗口模式
window.onload = function(){
  var arrParam = window.dialogArguments;// [printType,arryReceiver,custOrderLogisticsList];
  callPrint(arrParam);
}
*/

function getLogisticsCompanyMsg(custOrderLogisticsList) {
  var mapCompanyId = new Array();
  var companyId = '';
  for (var j = 0; j < custOrderLogisticsList.length; j++) {
    companyId = custOrderLogisticsList[j][0]; // 物流公司编码  
    var bFound = false;
    for (var i = 0; i < mapCompanyId.length; i++) {
      if (companyId == mapCompanyId[i]) {
        bFound = true;
        break;
      }
    }
    if (!bFound) {
      mapCompanyId.push(companyId);
    }
  }
  var msg = '';
  if (mapCompanyId.length > 1) { // 说明有多个物流公司
    var arryCompanyId = new Array();
    arryCompanyId.push(['STO', '申通快递']);
    arryCompanyId.push(['ZTO', '中通速递']);
    arryCompanyId.push(['BSHT', '汇通快运']);
    arryCompanyId.push(['YTO', '圆通速递']);
    arryCompanyId.push(['YUNDA', '韵达快运']);
    arryCompanyId.push(['EMS', '邮政EMS']);
    arryCompanyId.push(['SF', '顺丰速运']);
    arryCompanyId.push(['TTKDEX', '天天快递']);

    for (var i = 0; i < mapCompanyId.length; i++) {
      for (var a = 0; a < arryCompanyId.length; a++) {
        if (mapCompanyId[i] == arryCompanyId[a][0]) {
          msg += arryCompanyId[a][1] + ';'
          break;
        }
      }
    }
  }
  return msg;
}

function getNowDate() {
  var now = new Date();
  var year = now.getFullYear();
  var month = (now.getMonth() + 1).toString();
  var day = (now.getDate()).toString();
  var dateTime = year + '年' + month + '月' + day + '日';
  return dateTime;
}
export default callPrint
