
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
			page: page,
			pageSize: pageSize
		}
	};
	ajax.jsonpSyncRequest("collect/queryCollectIndex.action", requestJson, function(json) {
		if (json.length == 0) {
			return false;
		}

		$("#collectDiv").html('');
		$('#collectDiv').loadTemplate($("#collectUl"), json.result.list).html();
		
		var resImgs = document.body.querySelectorAll('.resUl');
		for(var i=0; i<resImgs.length; i++){
			resImgs[i].addEventListener('tap', function(){
				mui.openWindow({
					id: 'prodetail',
					url: '../prodetail.html?pId=' + this.getAttribute("resId") 
				});
			});
		}
	});
}