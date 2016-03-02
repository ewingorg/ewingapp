mui.init({
			swipeBack: true //启用右滑关闭功能
});

initTapEvent();
		
//初始化单页的区域滚动
mui('.mui-scroll-wrapper').scroll();

function initTapEvent(){
	
	document.getElementById("indexLi").addEventListener('tap', function() {
		mui.openWindow({
			id: 'index',
			url: '../index.html'
		});
	});
	
	document.getElementById("orderlist").addEventListener('tap', function() {
		mui.openWindow({
			id: 'orderlist',
			url: 'orderlist.html'
		});
	});
	
	document.getElementById("addresslist").addEventListener('tap', function() {
		mui.openWindow({
			id: 'addresslist',
			url: '../address/addresslist.html'
		});
	});
	
	document.getElementById("collectlist").addEventListener('tap', function() {
		mui.openWindow({
			id: 'collectList',
			url: '../collect/collectlist.html'
		});
	});
	
	
	
}