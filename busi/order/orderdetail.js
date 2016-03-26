//获取页面传来的参数
var orderId = jQuery.url.param("orderId");
var addrData = new Array();
var addrList;

var self = this;

init();


/*function prepareAddrSelector(data) {
	(function(mui, doc) {
		mui.init();
		mui.ready(function() {
			//普通示例
			var userPicker = new mui.PopPicker();
			userPicker.setData(self.addrData);
			var showUserPickerButton = doc.body.querySelector('.addrLi');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					$("#addrUl").html('');
					console.log(items[0]);
					$("#addrUl").loadTemplate($("#addrLi"), addrList[items[0].value]);
					$("#addrUl").attr('addrId', addrList[items[0].value].id);

					self.prepareAddrSelector(addrData);
				});
			}, false);
		});
	})(mui, document);
}*/

function init() {
	var requestJson = {
		data: {
			orderId: orderId
		}
	};
	
	ajax.jsonpSyncFetch("order/getDetail.action", requestJson, 'renderOrder');
}

function renderOrder(json) {
	if (json.length == 0) {
		return false;
	}

	$("#addrUl").loadTemplate($("#addrLi"), json.result.orderAddr);
	$("#payWayUl").loadTemplate($("#payWayLi"), json.result.payWays);

	for (var i = 0; i < json.result.list.length; i++) {
		$("#tmp").html('');
		$("#tmp").loadTemplate($("#orderUl"), json.result.list[i]);
		$("#order").append($("#tmp").html());
	}
	$("#tmp").html('');

	self.analyseTotal();

	addrData.length = 0;
	addrList = json.result.addrList;
	/*for (var i = 0; i < addrList.length; i++) {
		addrData.push({
			value: i,
			text: addrList[i].receiver + " " + addrList[i].province + " " + addrList[i].city + " " + addrList[i].region + " " + addrList[i].address
		});
	}*/
	/*self.prepareAddrSelector(addrData);*/

	var minusPros = document.querySelectorAll('.minusProduct');
	for (var i = 0; i < minusPros.length; i++) {
		minusPros[i].addEventListener('tap', function() {
			var productNum = this.parentNode.querySelector(".productNum");
			if (productNum.value >= 1) {
				self.changeNum(this.parentNode, -1);
			} else {
				return;
			}
		});
	}

	var plusPros = document.querySelectorAll('.plusProduct');
	for (var i = 0; i < plusPros.length; i++) {
		plusPros[i].addEventListener('tap', function() {
			var productNum = this.parentNode.querySelector(".productNum");
			self.changeNum(this.parentNode, 1);
		});
	}

	var icons = document.body.querySelectorAll('.resIcon');
	for (var i = 0; i < icons.length; i++) {
		icons[i].addEventListener('tap', function() {
			mui.openWindow({
				id: 'prodetail',
				url: '../prodetail.html?pId=' + this.getAttribute("resId")
			});
		});
	}
	
	var refundBtns = document.body.querySelectorAll('.refundBtn');
	for (var i = 0; i < refundBtns.length; i++) {
		refundBtns[i].addEventListener('tap', function() {
			mui.openWindow({
				id: 'applyrefund',
				url: 'applyrefund.html?detailId=' + this.getAttribute("detailId")
			});
		});
	}
}

function submitOrder(json) {
	if (json.length == 0) {
		return false;
	}

	//开始支付界面
	if (json.result == 2000000) {

	}
}

function analyseTotal() {
	var totalPrice = 0;
	var orderPriceDivs = document.body.querySelectorAll('.orderDiv');
	for (var i = 0; i < orderPriceDivs.length; i++) {
		var orderPrice = orderPriceDivs[i].querySelector(".orderPrice");
		totalPrice = totalPrice + parseFloat(orderPrice.innerHTML);
	}
	document.getElementById("totalPrice").innerHTML = totalPrice.toFixed(2);
}

function changeNum(pNode, changeNum) {
	var productNum = pNode.querySelector(".productNum");
	productNum.value = parseInt(changeNum) + parseInt(productNum.value);
	var cargoFee = pNode.parentNode.parentNode.parentNode.querySelector(".cargoFee").innerHTML;
	var price = pNode.parentNode.parentNode.parentNode.querySelector(".price").innerHTML;
	var totalPrice = productNum.value * parseFloat(price);
	var orderPrice = totalPrice + parseFloat(cargoFee);
	pNode.parentNode.parentNode.parentNode.querySelector(".orderPrice").innerHTML = orderPrice.toFixed(2);
	self.analyseTotal();
}