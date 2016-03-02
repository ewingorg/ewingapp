//获取页面传来的参数
		//页面初始化
		mui.init({
			swipeBack: true, //启用右滑关闭功能
		});
		init();
		
		//绑定事件
		document.getElementById("addAddress").addEventListener('tap', function() {
			//接收人
			if(null == $("#receiver").val() || '' == $("#receiver").val()){
				ewing.alert("提示", "接收人不能为空哦", null);
				return;
			}
			
			//电话
			if(null == $("#phone").val() || '' == $("#phone").val()){
				ewing.alert("提示", "电话不能为空哦", null);
				return;
			}
			
			//邮编
			if(null == $("#postCode").val() || '' == $("#postCode").val()){
				ewing.alert("提示", "邮编不能为空哦", null);
				return;
			}
			
			//省份
			if(null == document.body.querySelector(".prov").value || '' == document.body.querySelector(".prov").value){
				ewing.alert("提示", "省份不能为空哦", null);
				return;
			}
			
			//城市
			if(null == document.body.querySelector(".city").value || '' == document.body.querySelector(".city").value){
				ewing.alert("提示", "城市不能为空哦", null);
				return;
			}
			
			//地区
			if(document.body.querySelector(".dist").value != '' && (null == document.body.querySelector(".dist").value || '' == document.body.querySelector(".dist").value)){
				ewing.alert("提示", "地区不能为空哦", null);
				return;
			}
			
			//详细地址
			if(null == $("#address").val() || '' == $("#address").val()){
				ewing.alert("提示", "详细地址不能为空哦", null);
				return;
			}
			
			
			var requestJson = {
						data: {
							id: jQuery.url.param("addId"),
							receiver : $("#receiver").val(),
							phone : $("#phone").val(),
							postCode : $("#postCode").val(),
							province : document.body.querySelector(".prov").value,
							city : document.body.querySelector(".city").value,
							region : document.body.querySelector(".dist").value,
							address : $("#address").val()
						}
					};
					ajax.jsonpSyncRequest("address/saveAddr.action", requestJson, function(json) {
						if(null == json || '' == json){
							return false;
						}
						
						//@TODO修改userId的值
						mui.openWindow({
								id: 'addresslist',
								url: 'addresslist.html?userId=10'
						});
					});
		});
		
			/**
			 * 页面拉新的具体操作
			 */
		function init(){
			//地址选择框初始化
			$("#myAddress").citySelect({
				url: "../../busi/js/citySelector/city.min.js",
			    prov: $("#provInput").val() || '',
			    city: $("#cityInput").val() || '',
			    dist: $("#regionInput").val() || '',
			    nodata:"none",
			    callback: function(){
			    }
			});
		
			 //注意：若为ajax请求，则需将如下代码放在处理完ajax响应数据之后；
			mui.plusReady(function(){
			    //关闭等待框
			    plus.nativeUI.closeWaiting();
			    //显示当前页面
			    mui.currentWebview.show();
			});
		}