<template>
	<div>
	<p class="order_detail_title">订单详情</p>
	<div class="order_detail">
		<div class="detail_left">
			<p class="orderId">
				<svg class="icon" aria-hidden="true">
				    <use xlink:href="#icon-tianmao"></use>
				</svg>
				<span>{{dataList[0].ordId}}</span></p>
			<ul>
				<li>买家昵称&nbsp;: <span class="blue">{{dataList[0].buyerNicker}}</span></li>
				<li>发票信息&nbsp;: <span>电子收据+普通发票;类型-公司;抬头:杭州白白技术有限公司</span></li>
				<li class="red">买家留言&nbsp;: <span>{{dataList[0].buyerMessage}}</span></li>
				<li>下单时间&nbsp;: <span>{{dataList[0].payDate | date}}</span></li>
				<li>付款时间&nbsp;: <span>{{dataList[0].payDate | date}}</span></li>
			</ul>
		</div>
		<div class="detail_right">
			<ul>
				<li class="gray">付款&nbsp;: <span>{{dataList[0].payType}}</span></li>
				<li>总价&nbsp;: <span>{{dataList[0].totalFee | currency}}</span></li>
				<li>折扣&nbsp;: <span>-{{dataList[0].discountFee | currency}}</span></li>
				<li>运费&nbsp;: <span>{{dataList[0].expressFee | currency}}</span></li>
				<li class="pay">实收&nbsp;: <span>{{dataList[0].paymentFee | currency}}</span></li>
			</ul>
		</div>
	</div>
	</div>
</template>
<script>
	export default {
	  name: 'order-detail-head',
	  data() {
	    return {
	      dataList: [{
	        ordId: 'E20170101101408013526132',
	        totalFee: 5800,
	        discountFee: 0,
	        paymentFee: 5800,
	        expressFee: 0,
	        eshopName: '',
	        buyerId: 2435311262,
	        buyerNicker: '随风zz',
	        payType: 'WEIXIN_DAIXIAO',
	        payDate: 1483236849900,
	        remarks: '',
	        buyerMessage: '能请吴晓波同学签字不？',
	        platformId: 'kdt',
	        agentId: 100015361
	      }]
	    }
	  },
	  filters: {
	    date: function(val) {
	      var time = new Date(val)
	      function timeFormat(val) {
	        return val < 10 ? '0' + val : val;
	      }
	      return `${time.getFullYear()}-${timeFormat(time.getMonth() + 1)}-${timeFormat(time.getDate())} ${timeFormat(time.getHours())}:${timeFormat(time.getMinutes())}:${timeFormat(time.getSeconds())}`
	    },
	    currency: function(val) {
	      if (val === 0) {
	        return '￥0.00'
	      } else {
	        return '￥' + (val / 100).toFixed(2)
	      }
	    }
	  },
	  components: {},
	  methods: {},
	}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.order_detail_title{
		font-size:14px;
		line-height:18px;
		margin:0;
		margin-top:20px;
		font-weight:bold;
		text-indent:10px;
		}
	.order_detail{
		box-sizing:border-box;
		height:180px;
		background-color:#e8f5ff;
		margin-left:10px;
		margin-top:15px;
		padding:20px;
		color:#475669;
	}
	.detail_left{
		float:left;
	}
	.detail_right{
		float:right;
	}
	.orderId{
		margin:0;
		font-size:16px;
		line-height:20px;
	}
	.orderId span{
		margin-left:5px;
	}
	.detail_left ul,.detail_right ul{
		list-style:none;
		padding:0;
		margin:0;
		margin-top:15px;
		font-size:12px;
		line-height:12px;
	}
	.detail_left ul li{
		margin-bottom:12px;
	}
	.detail_left ul li span{
		margin-left:10px;
	}
	.red{
		color:#ff4949;
	}
	.detail_left .blue{
		color:#20a0ff;
	}
	.detail_right ul{
		margin-top:10px;
		margin-right:100px;
		color:#99a9bf;
	}
	.detail_right ul li{
		width:162px;
		margin-bottom:7px;
	}
	.detail_right .gray{
		margin-bottom:15px;
		color:#475669;
	}
	.detail_right ul li span{
		float:right;
	}
	.detail_right .pay{
		margin-top:30px;
		font-size:18px;
	}
	.detail_right .pay span{
		color:#FF4949;
	}
</style>