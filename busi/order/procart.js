//获取页面传来的参数
var cusId = jQuery.url.param("userId");

var self = this;
//是否没有数据
var pListIsEnd = false;
var curPage = 1;


//页面初始化
mui.init({
	swipeBack: true, //启用右滑关闭功能
});
initPullEvent();
init();

function alalyseTotal() {
	var checkboxs = document.body.querySelectorAll('input[type=checkbox]');
	for (var i = 0; i < checkboxs.length; i++) {
		checkboxs[i].addEventListener('change', function() {
			var checkboxs = document.body.querySelectorAll('input[type=checkbox]');
			var totalPrice = 0;
			for (var j = 0; j < checkboxs.length; j++) {
				if (checkboxs[j].checked) {
					var input = checkboxs[j].parentNode.parentNode.querySelector('input[type=number]');
					totalPrice = (parseFloat(totalPrice) + parseFloat(input.getAttribute('pri')) * input.value).toFixed(2);
				}
			}

			$("#totalPrice").html(totalPrice);
		});
	}
}


function init() {
	var balanceBtn = document.getElementById('balanceBtn');
	balanceBtn.addEventListener('tap', function() {
		var ids = '';
		var checkboxs = document.body.querySelectorAll('input[type=checkbox]');
		var data = new Array();
		for (var i = 0; i < checkboxs.length; i++) {
			if (checkboxs[i].checked) {
				var item = {
					id: checkboxs[i].getAttribute('cartid'),
					itemCount: checkboxs[i].parentNode.parentNode.querySelector('input[type=number]').value
				}

				data.push(item);
			}
		}

		var requestJson = {
			data: {
				list: data
			}
		};
		ajax.jsonpSyncFetch("cart/balance.action", requestJson, 'balance');
	});
}

function balance(json) {
	if (json.length == 0) {
		return false;
	}

	mui.openWindow({
		id: 'order',
		url: 'order.html?orderId=' + json.result
	});
}


/**
 * 上拉操作
 */
function initPullEvent() {
	//页面初始化
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh,
			}
		}
	});

	/**
	 * 页面拉新的具体操作
	 */
	function pullupRefresh() {
		mui('#pullrefresh').pullRefresh().endPullupToRefresh((pListIsEnd)); //参数为true代表没有更多数据了。
		var table = document.body.querySelector('.pulltable');
		var cells = document.body.querySelectorAll('.mui-table-view-cell');
		var requestJson = {
			data: {
				cusId: cusId,
				page: curPage,
				pageSize: 10
			}
		};

		ajax.jsonpSyncFetch("cart/index.action", requestJson, 'renderCart');
	}


	if (mui.os.plus) {
		mui.plusReady(function() {
			mui('#pullrefresh').pullRefresh().pullupLoading();
		});
	} else {
		mui.ready(function() {
			mui('#pullrefresh').pullRefresh().pullupLoading();
		});
	}
}

function renderCart(json) {
	if (json.length == 0) {
		pListIsEnd = true;
		return false;
	}

	curPage++;
	$("#balanceDiv").html('');
	$("#cartUl").loadTemplate($("#cartLi"), json.result.list);

	//添加listener
	var lis = document.body.querySelectorAll(".mui-table-view-cell");
	for (var i = 0; i < lis.length; i++) {
		lis[i].querySelector('img').addEventListener('tap', function() {
			mui.openWindow({
				id: 'prodetail',
				url: '../prodetail.html?pId=' + this.getAttribute("resId")
			});
		});
	}

	//绑定事件
	var btns = document.body.querySelectorAll('.mui-btn-numbox-plus');
	for (var i = 0; i < btns.length; i++) {
		btns[i].addEventListener('tap', function() {
			var input = this.parentNode.querySelector('input');
			input.value = parseInt(input.value) + 1;

			if (this.parentNode.parentNode.querySelector('input[type=checkbox]').checked == true) {
				$("#totalPrice").html((parseFloat($("#totalPrice").html()) + parseFloat(input.getAttribute('pri'))).toFixed(2));
			}
		});
	}

	var btns = document.body.querySelectorAll('.mui-btn-numbox-minus');
	for (var i = 0; i < btns.length; i++) {
		btns[i].addEventListener('tap', function() {
			var input = this.parentNode.querySelector('input');
			if (input.value == 0) {
				return;
			}
			input.value = parseInt(input.value) - 1;

			if (this.parentNode.parentNode.querySelector('input[type=checkbox]').checked == true) {
				$("#totalPrice").html((parseFloat($("#totalPrice").html()) - parseFloat(input.getAttribute('pri'))).toFixed(2));
			}
		});
	}

	var delBtns = document.body.querySelectorAll('.delCart');
	for (var i = 0; i < delBtns.length; i++) {
		delBtns[i].addEventListener('tap', function() {
			var requestJson = {
				data: {
					cartId: this.getAttribute('cartId')
				}
			};
			
			this.parentNode.parentNode.style.display = 'none';
			ajax.jsonpSyncFetch("cart/delCart.action", requestJson, 'delCart');
		});
	}

	self.alalyseTotal();
}