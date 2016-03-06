//获取页面传来的参数
var pId = jQuery.url.param("pId");
mui.init({
	swipeBack: true //启用右滑关闭功能
});
mui('#productDetail').scroll();
renderProductDetail();
var productPriceList;
var productSpecList;

function renderProductDetail() {
	var requestJson = {
		data: {
			pId: pId
		}
	};
	ajax.jsonpSyncFetch("product/detail.action", requestJson, 'renderProduct');
}

function renderProduct(json) {
	$("#productionDetailContainer").loadTemplate($("#productDetailTemplate"), json.result);
	$("#productionPriceContainer").loadTemplate($("#productPriceTemplate"), json.result);
	$("#productSpecContrainer").loadTemplate($("#productSpecTemplate"), json.result.specList);
	productPriceList = json.result.priceList;
	productSpecList = json.result.specList;
	initTapEvent();

	if (null != json.result.productDetail && json.result.productDetail.isCollect == 1) {
		$("#collectA").addClass('mui-active');
	}
}

//设置所有点击事件
function initTapEvent() {
	//	document.getElementById("minusProduct").addEventListener('tap', function() {
	//		var productNum = document.getElementById("productNum").value;
	//		if (productNum >= 1) {
	//			changeNum(-1);
	//		} else {
	//			document.getElementById("productNum").value = 1;
	//		}
	//	});
	//	document.getElementById("plusProduct").addEventListener('tap', function() {
	//		changeNum(1);
	//	});

	document.getElementById("collectA").addEventListener('tap', function() {
		var requestJson = {
			data: {
				resId: pId
			}
		};

		if (document.getElementById("collectA").className.indexOf("mui-active") != -1) {
			ajax.jsonpSyncFetch("collect/delCollect.action", requestJson, 'delCollect');
		} else {
			ajax.jsonpSyncFetch("collect/addCollect.action", requestJson, 'addCollect');
		}
	});

	document.getElementById("navhome").addEventListener('tap', function() {
		mui.openWindow({
			id: 'index',
			url: 'index.html'
		});
	});
	document.getElementById("prodcutCart").addEventListener('tap', function() {
		mui.openWindow({
			id: 'producatCart',
			url: 'order/procart.html'
		});
	});
	document.getElementById("orderList").addEventListener('tap', function() {
		mui.openWindow({
			id: 'orderlist',
			url: 'order/orderlist.html'
		});
	});
	document.getElementById("confirmSpec").addEventListener('tap', function() {
		var action = document.getElementById("confirmSpec").getAttribute("action");
		//判断是否所有属性已经选择
		if (!isAllAttrSelected()) {
			return;
		}

		if (action == 'addCart') { //加入购物车
			var requestJson = {
				data: {
					resourceId: pId,
					priceId: $("#selectPrice").attr("priceId"),
					count: $("#productNum").val()
				}
			};

			ajax.jsonpSyncFetch("cart/addCart.action", requestJson, 'addCart');
		} else if (action == 'addShoppping') { //加入订单
			var requestJson = {
				data: {
					resourceId: pId,
					priceId: $("#selectPrice").attr("priceId"),
					count: $("#productNum").val()
				}
			};

			ajax.jsonpSyncFetch("order/addOrder.action", requestJson, 'addOrder');
		}
	});
	//点击购物和购买的时候变换动作类型，方便选择产品规格后跳转
	document.getElementById("addCart").addEventListener('tap', function() {
		document.getElementById("confirmSpec").setAttribute("action", "addCart");
	});
	document.getElementById("addShopping").addEventListener('tap', function() {
		document.getElementById("confirmSpec").setAttribute("action", "addShoppping");
	});
	var specBtns = document.querySelectorAll(".specBtn");
	for (var i = 0; i < specBtns.length; i++) {
		specBtns[i].addEventListener('tap', function() {
			this.className = "mui-btn specBtn mui-btn-warning mui-btn-outlined";
			var specBtns = document.querySelectorAll(".specBtn");
			for (var j = 0; j < specBtns.length; j++) {
				if (specBtns[j] != this && specBtns[j].getAttribute("value") == this.getAttribute("value")) {
					specBtns[j].className = "mui-btn";
				}
			}
			getPriceWhileSelectSpec();
		});
	}
}

function addCollect(json) {
	if (json.result == 2000000) {
		$("#collectA").addClass('mui-active');
	}else{
		$("#collectA").removeClass('mui-active');
	}
}

function delCollect(json) {
	if (json.result == 2000000) {
		$("#collectA").removeClass('mui-active');
	}else{
		$("#collectA").addClass('mui-active');
	}
}

function addCart(json) {
	mui.toast('成功加入购物车!');
	var curCartNum = document.getElementById("productCartNum").innerHTML;
	if (!curCartNum)
		curCartNum = 0;
	document.getElementById("productCartNum").innerHTML = Number.parseInt(curCartNum) + 1;
	document.getElementById("specDiv").style.display = 'none';
}

function addOrder(json) {
	if (null == json.result.orderId || '' == json.result.orderId) {
		mui.toast("提交失败");
		return;
	}
	document.getElementById("specDiv").style.display = 'none';
	mui.openWindow({
		id: 'order',
		url: 'order/order.html?orderId=' + json.result.orderId
	});
}
//function changeNum(changeNum) {
//	var productNum = document.getElementById("productNum").value;
//	var fixPrice = getPriceWhileSelectSpec();
//	var totalPrice = productNum * parseFloat(fixPrice.price);;
//	document.getElementById("selectPrice").innerHTML = totalPrice.toFixed(2);
//}
/**
 * 根据规格获取价格
 */
function getPriceWhileSelectSpec() {
	if (!productSpecList && productSpecList.length == 0)
		return;
	var selectSpecArray = new Array();
	//查找所有规格组已经选中项
	for (var i = 0; i < productSpecList.length; i++) {
		var rootSpec = productSpecList[i].rootSpec.spec;
		var specBtns = document.querySelectorAll(".specBtn");
		for (var j = 0; j < specBtns.length; j++) {
			if (specBtns[j].getAttribute("value") == rootSpec && specBtns[j].className.indexOf("mui-btn-outlined") != -1) {
				selectSpecArray.push(specBtns[j].getAttribute("attach"));
			}
		}
	}
	//匹配选中項和规格列表
	var fixPrice;
	for (var i = 0; i < productPriceList.length; i++) {
		var specIds = productPriceList[i].specIds.split(",");
		var exist;
		for (var j = 0; j < specIds.length; j++) {
			exist = false;
			for (var z = 0; z < selectSpecArray.length; z++) {
				if (specIds[j] == selectSpecArray[z]) {
					exist = true;
				}
			}
			if (!exist)
				break;
		}
		if (exist) {
			fixPrice = productPriceList[i];
		}
	}
	if (!fixPrice)
		return;
	var selectPrice = parseFloat(fixPrice.price);
	//设置价格
	document.getElementById("selectPrice").innerHTML = selectPrice.toFixed(2);
	document.getElementById("selectPrice").setAttribute("priceId", fixPrice.id);
	return fixPrice;
}

/**
 * 判断是否所有的属性已经选择
 */
function isAllAttrSelected() {
	var attrSelectorLis = document.body.querySelectorAll('.specGroup');
	for (var i = 0; i < attrSelectorLis.length; i++) {
		var specBtns = attrSelectorLis[i].querySelectorAll('.specBtn');
		var isSelect = false;
		for (var j = 0; j < specBtns.length; j++) {
			if (specBtns[j].className.indexOf("mui-btn-outlined") != -1) {
				isSelect = true;
				break;
			}
		}

		if (isSelect == false) {
			var attr = attrSelectorLis[i].querySelector('.detailfront').innerHTML;
			mui.toast("请选择" + attr);
			return false;
		}
	}

	return true;
}