//获取页面传来的参数
var shopId = jQuery.url.param("shopId");
mui.init({
	swipeBack: true //启用右滑关闭功能
});

initPullEvent();


//是否没有数据
var pListIsEnd = false;
//产品页码
var pListPage = 1;
//产品页大小
var pListPageSize = 10;


function renderCollectList(json) {
	if (json.result.length == 0) {
		pListIsEnd = true;
		return false;
	}
	pListPage++;
	$("#collectHtmlTmp").html('');
	$("#collectHtmlTmp").loadTemplate($("#lightCollectTemplate"), json.result.list);
	$('#produectList').append($("#collectHtmlTmp").html());

	var productimgs = document.querySelectorAll(".productimg");
	for (var i = 0; i < productimgs.length; i++) {
		productimgs[i].addEventListener('tap', function() {
			mui.openWindow({
				id: 'prodetail',
				url: '../prodetail.html?pId=' + this.getAttribute("value")
			});
		});
	}
}

function initPullEvent() {
	mui.init({
		pullRefresh: {
			container: '#offCanvasContentScroll',
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});

	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		mui('#offCanvasContentScroll').pullRefresh().endPullupToRefresh((pListIsEnd)); //参数为true代表没有更多数据了。
		var table = document.body.querySelector('.pulltable');
		var cells = document.body.querySelectorAll('.mui-table-view-cell');
		
		var requestJson = {
			data: {
				page: pListPage,
				pageSize: pListPageSize
			}
		};

		ajax.jsonpSyncFetch("collect/queryCollectIndex.action", requestJson, 'renderCollectList');
	}
	if (mui.os.plus) {
		mui.plusReady(function() {
			setTimeout(function() {
				mui('#offCanvasContentScroll').pullRefresh().pullupLoading();
			}, 500);
		});
	} else {
		mui.ready(function() {
			mui('#offCanvasContentScroll').pullRefresh().pullupLoading();
		});
	}
}