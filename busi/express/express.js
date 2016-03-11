//获取页面传来的参数
var orderId = jQuery.url.param("orderId");
var cargoName = jQuery.url.param("cargoName"); 
var cargoNumber = jQuery.url.param("cargoNumber"); 

var self = this;
init();

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