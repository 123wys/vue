// 去除双号码
export function getSingleNum(cpCode, orderBean, order) {
  if (cpCode === 'STO' || cpCode === 'ZTO') {
    document.querySelector('td.xx10').innerText = document.querySelector('td.xx10').innerText.replace(orderBean.receiverMobile, '');
    let dom = document.querySelectorAll('td.xx14');
    dom[0].innerText = dom[0].innerText.replace(order.senderMobile, '');
    dom[1].innerText = dom[1].innerText.replace(orderBean.receiverMobile, '');
    dom[2].innerText = dom[2].innerText.replace(order.senderMobile, '');
  }
}
// 模板加专线
export function addSpecial(cpCode) {
  if (cpCode === 'STO') {
    document.querySelector('td[class="x4"]').innerHTML += '&nbsp;专线';
  }
}
// 模板添加商品明细
export function addGoodsDetail(cpCode, orderBean) {
  if (cpCode === 'STO') {
    var tdDom = document.querySelectorAll('.print_paper')[document.querySelectorAll('.print_paper').length - 1].querySelector('td.xx10');
    let inner = '';
    let length = orderBean.orderItems.length < 5 ? orderBean.orderItems.length : 4;
    for (let m = 0; m < length; m++) {
      if (m === 3) {
        inner += orderBean.orderItems[m].skuTitle + ' x ' + orderBean.orderItems[m].num + '...';
      } else {
        inner += orderBean.orderItems[m].skuTitle + ' x ' + orderBean.orderItems[m].num + ' </br>';
      }
    }
    tdDom.innerHTML = inner;
  }
}
// 选定模板样式微调
export function styleAdjust(cpCode) {
  if (cpCode === 'STO') {
    document.querySelector('td[class="x4"]').style.fontSize = '25pt';
    document.querySelector('td[class="xx18"]').style.fontSize = '25px';
    document.querySelector('td[class="xx18"]').style.paddingRight = '10px';
  }
}
