//获取页面传来的参数
var self = this;
var shopId = jQuery.url.param("shopId");
var catId = jQuery.url.param("catId");
//是否没有数据
var pListIsEnd = false;
//产品页码
var pListPage = 1;
//产品页大小
var pListPageSize = 2;

mui.init({
	swipeBack: true //启用右滑关闭功能
});

keytemplate.initTemplateKey(shopId, 'index.html');
initCategorySelect();
initPullEvent();
initTapEvent();

function initPage() {
	pListIsEnd = false;
	//产品页码
	pListPage = 1;
	//产品页大小
	pListPageSize = 2;
	self.catId = 0;
	$("#produectList").html('');
}

//设置所有事件
function initTapEvent() {
	document.getElementById("accountCenter").addEventListener('tap', function() {
		mui.openWindow({
			id: 'ordercenter',
			url: 'order/ordercenter.html'
		});
	});

	document.getElementById("mainBtn").addEventListener('tap', function() {
		mui.openWindow({
			id: 'index',
			url: 'index.html?shopId=' + self.shopId
		});
	});
}

function fillCategory(json) {
	$("#categoryUl").html('');
	$("#categoryUl").loadTemplate($("#categoryLi"), json.result);

	var catAs = document.body.querySelectorAll('.catA');
	for (var i = 0; i < catAs.length; i++) {
		catAs[i].addEventListener('tap', function() {
				mui.openWindow({
					id: 'categoryList',
					url: 'categoryList.html?catId=' + this.getAttribute("catId") + "&shopId=" + self.shopId
				});
		});
	}
}

function fillProductList(json) {
	if (json.result.length == 0) {
		pListIsEnd = true;
		return false;
	}
	
	pListPage++;
	$("#productInfoHtmlTmp").html('');
	$("#productInfoHtmlTmp").loadTemplate($("#lightProductTemplate"), json.result.list);
	$('#produectList').append($("#productInfoHtmlTmp").html());
	$('#catHeader').loadTemplate($("#header"), json.result);

	var productimgs = document.querySelectorAll(".productimg");
	for (var i = 0; i < productimgs.length; i++) {
		productimgs[i].addEventListener('tap', function() {
			mui.openWindow({
				id: 'prodetail',
				url: 'prodetail.html?pId=' + this.getAttribute("value")
			});
		});
	}

	var buyBtns = document.body.querySelectorAll(".buyBtn");
	for (var i = 0; i < buyBtns.length; i++) {
		buyBtns[i].addEventListener('tap', function() {
			mui.openWindow({
				id: 'prodetail',
				url: 'prodetail.html?pId=' + this.getAttribute("proId")
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
				callback: self.pullupRefresh
			}
		}
	});


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

/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	mui('#offCanvasContentScroll').pullRefresh().endPullupToRefresh((pListIsEnd)); //参数为true代表没有更多数据了。
	var table = document.body.querySelector('.pulltable');
	var cells = document.body.querySelectorAll('.mui-table-view-cell');
	var requestJson = {
		data: {
			categoryId: self.catId,
			page: pListPage,
			pageSize: pListPageSize,
			shopId: shopId
		}
	};
	ajax.jsonpSyncFetch("product/categoryList.action", requestJson, "fillProductList");
}

function initCategorySelect() {
	var requestJson = {
		data: {
			shopId: shopId
		}
	};
	ajax.jsonpSyncFetch("product/category.action", requestJson, "fillCategory");
	//主界面‘显示侧滑菜单’按钮的点击事件
	//侧滑容器父节点
	var offCanvasWrapper = mui('#offCanvasWrapper');
	//主界面容器
	var offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
	//菜单容器
	var offCanvasSide = document.getElementById("offCanvasSide");
	//移动效果是否为整体移动
	var moveTogether = false;
	//侧滑容器的class列表，增加.mui-slide-in即可实现菜单移动、主界面不动的效果；
	var classList = offCanvasWrapper[0].classList;
	//主界面‘显示侧滑菜单’按钮的点击事件
	document.getElementById('offCanvasShow').addEventListener('tap', function() {
		offCanvasWrapper.offCanvas('show');
	});
	//菜单界面，‘关闭侧滑菜单’按钮的点击事件
	document.getElementById('offCanvasHide').addEventListener('tap', function() {
		offCanvasWrapper.offCanvas('close');
	});

	//主界面和侧滑菜单界面均支持区域滚动；
	mui('#offCanvasSideScroll').scroll();
	mui('#offCanvasContentScroll').scroll();
	//实现ios平台原生侧滑关闭页面；
	if (mui.os.plus && mui.os.ios) {
		mui.plusReady(function() { //5+ iOS暂时无法屏蔽popGesture时传递touch事件，故该demo直接屏蔽popGesture功能
			plus.webview.currentWebview().setStyle({
				'popGesture': 'none'
			});
		});
	}
}