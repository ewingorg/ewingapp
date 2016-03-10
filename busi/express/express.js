//获取页面传来的参数
var orderId = jQuery.url.param("orderId");
var addrData = new Array();
var addrList;

var self = this;

init();


function prepareAddrSelector(data) {
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
}

function init() {
	var requestJson = {
		data: {
			orderId: orderId,
			expressCom : '圆通快递',
			expressNum : '881142919526377939'
		}
	};
	ajax.jsonpSyncFetch("express/queryExpress.action", requestJson, 'renderOrder');
}

function renderOrder(json) {
	if (null == json.result || json.result.length == 0) {
		return false;
	}
	
	var address  = json.result.address;
	var list = json.result.data;
	console.log(json);

	$("#addrUl").loadTemplate($("#addrLi"), address);
	$("#expressUl").loadTemplate($("#expressLi"), list);
}