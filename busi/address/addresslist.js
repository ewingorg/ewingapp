		//获取页面传来的参数
		var cusId = jQuery.url.param("userId");
		//是否没有数据
		var pListIsEnd = false;
		var curPage = 1;
		var self = this;
		
		
		mui.init({
				pullRefresh: {
					container: '#pullrefresh',
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
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(pListIsEnd); //参数为true代表没有更多数据了。
					var table = document.body.querySelector('.mui-table-view');
					var cells = document.body.querySelectorAll('.mui-table-view-cell');
					
					
					var requestJson = {
						data: {
							cusId: cusId,
							page : curPage,
							pageSize : 9
						}
					};
			
					ajax.jsonpSyncRequest("address/addrIndex.action", requestJson, function(json) { 
						if (json.length == 0) {
							pListIsEnd = true; 
							return false;
						}					
				
					curPage++;
					$("#addressUi").html('');
					
					var list = json.result;
					for(var i=0; i<list.length; i++){
						$("#liTmp").html('');
						if(list[i].isDefault == 1){
							$("#liTmp").loadTemplate($("#addressLiDefault"), list[i]);
							$('#addressUi').prepend($("#liTmp").html()); 
						}else{
							$("#liTmp").loadTemplate($("#addressLi"), list[i]);
							$('#addressUi').append($("#liTmp").html()); 
						}
					}
					
					//添加listener
					var addresses = document.querySelectorAll(".address");
					for (var i = 0; i < addresses.length; i++) {
						addresses[i].querySelector('.mui-slider-handle').addEventListener('tap', function() {
							mui.openWindow({
								id: 'addressedit',
								url: 'addressedit.html?addId=' + this.getAttribute('addId'),
								show:{autoShow:false}
							});
						});
					}
					
					var addresses = document.querySelectorAll(".defaultAdress");
					for (var i = 0; i < addresses.length; i++) {
						addresses[i].querySelector('.mui-slider-handle').addEventListener('tap', function() {
							mui.openWindow({
								id: 'addressedit',
								url: 'addressedit.html?addId=' + this.getAttribute('addId'),
								show:{autoShow:false}
							});
						});
					}
					
					document.getElementById('addAddress').addEventListener('tap', function() {
						mui.openWindow({
							id: 'address',
							url: 'address.html'
						});
					});
					
					var addresses = document.body.querySelectorAll('.address');
					for(var i=0; i<addresses.length; i++){
						var id = addresses[i].getAttribute('addId');
						addresses[i].querySelector('.delAddr').addEventListener('tap', function(){
							var requestJson = {
								data: {
									id: this.getAttribute('addId')
								}
							};
	
							ajax.jsonpSyncRequest("address/delAddress.action", requestJson, function(json) { 
								if (json.length == 0) {
									pListIsEnd = true; 
									return false;
								}
								
								self.pullupRefresh();
							});
						});
					}
					
				});
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
		
		