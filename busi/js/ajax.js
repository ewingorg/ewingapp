if (!this.ajax) {
	var ajax = {};
}
//var serverUrl = "http://127.0.0.1/ewingdoor/";
var serverUrl = "http://120.25.210.50/ewingdoor/";
/*var serverUrl = "http://127.0.0.1:8080/ewingdoor/";*/

ajax.jsonpSyncRequest = function(methodUrl, json, sucFn, errFn) {

	var dataListJson = JSON.stringify(json);
	$.ajax({
		data: {
			param: dataListJson
		},
		type: "get",
		async: false,
		url: serverUrl + methodUrl,
		dataType: "jsonp",
		jsonp: "callbackparam", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
		jsonpCallback: "success_jsonpCallback", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
		success: sucFn,
		error: errFn
	});
}

ajax.jsonpSyncFetch = function(methodUrl, json, jsonpCallback) {
	var dataListJson = JSON.stringify(json);
	$.ajax({
		data: {
			param: dataListJson
		},
		type: "get",
		async: false,
		url: serverUrl + methodUrl,
		dataType: "jsonp",
		jsonp: "callbackparam", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
		jsonpCallback: jsonpCallback //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
		 
	});
}

ajax.jsonpCallback = function(json,callbackFn){
	if(null != json && json.respType == 2){
		window.location = json.result;
	}else{
		var jsonstr = JSON.stringify(json); 
		eval(callbackFn+"("+jsonstr+")");
	}
}
 