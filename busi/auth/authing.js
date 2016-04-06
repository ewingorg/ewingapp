var code = jQuery.url.param("code");
var state = jQuery.url.param("state");


init();


function init(){
	var requestJson = {
		data: {
			code: code,
			state: state
		}
	};
	ajax.jsonpSyncFetch("apiwx/getAuthCode.action", requestJson, "renderFunc");
}

function renderFunc(json){
}
