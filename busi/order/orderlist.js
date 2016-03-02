//获取页面传来的参数
var cusId = jQuery.url.param("userId");

var self = this;
var page = 1; //定义页面码
var pageSize = 5;
var status;

//页面初始化
mui.init({
	swipeBack: true, //启用右滑关闭功能
});
init();


function init(){
	//注册事件
	var aItems = document.querySelectorAll('.mui-control-item');
		for(var i=0; i<aItems.length; i++){
			aItems[i].addEventListener('tap', function(){
				status = this.getAttribute('status');
				
				self.load(status);
		});
	}
		
	load();
}

function load(status) {
	var requestJson = {
		data: {
			status : status,
			page: page,
			pageSize: pageSize
		}
	};
	ajax.jsonpSyncRequest("order/list.action", requestJson, function(json) {
		if (json.length == 0) {
			return false;
		}

		$("#showOrderList").html('');
		for (var i = 0; i < json.result.list.length; i++) {
			document.getElementById('orderLiDiv').querySelector('.mui-table-view').innerHTML = '';
			$("#tmp").html('');
			document.getElementById('orderLiDiv').querySelector('.mui-table-view').innerHTML += $("#tmp").loadTemplate($("#orderHeaderLi"), json.result.list[i]).html();
			$("#tmp").html('');
			document.getElementById('orderLiDiv').querySelector('.mui-table-view').innerHTML += $("#tmp").loadTemplate($("#orderLi"), json.result.list[i].list).html();
			$("#tmp").html('');
			document.getElementById('orderLiDiv').querySelector('.mui-table-view').innerHTML += $("#tmp").loadTemplate($("#productCountLi"), json.result.list[i]).html();
			
			if('0' == json.result.list[i].status){
				$("#tmp").html('');
				document.getElementById('orderLiDiv').querySelector('.mui-table-view').innerHTML += $("#tmp").loadTemplate($("#btnLi"), json.result.list[i]).html();
			}

			$("#showOrderList").append($("#orderLiDiv").html());
		}
		
		var resImgs = document.body.querySelectorAll('.resImg');
		for(var i=0; i<resImgs.length; i++){
			resImgs[i].addEventListener('tap', function(){
				mui.openWindow({
					id: 'prodetail',
					url: '../prodetail.html?pId=' + this.getAttribute("resId") 
				});
			});
		}
		
		//注册事件
		var cancalBtns = document.body.querySelectorAll('.closeOrder');
		for(var i=0; i<cancalBtns.length; i++){
			cancalBtns[i].addEventListener('tap', function(){
				var requestJson = {
					data: {
						orderId: this.getAttribute('orderId')
					}
				};
				
				ajax.jsonpSyncRequest("order/close.action", requestJson, function(json) {
					if (json.length == 0) {
						return false;
					}
					
					self.load(status);
				});
			});
		}
		
		var payBtns = document.body.querySelectorAll('.payOrder');
		for(var i=0; i<payBtns.length; i++){
			payBtns[i].addEventListener('tap', function(){
				var requestJson = {
					data: {
						orderId: this.getAttribute('orderId')
					}
				};
				
				ajax.jsonpSyncRequest("order/close.action", requestJson, function(json) {
					if (json.length == 0) {
						return false;
					}
					
					self.load(status);
				});
			});
		}
	});
}