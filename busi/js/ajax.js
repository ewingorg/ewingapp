if (!this.ajax) {
	var ajax = {};
}
var serverUrl = "http://100.84.89.236:9999/";

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