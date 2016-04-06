if (!this.keytemplate) {
	var keytemplate = {};
} 

keytemplate.callback=function(json){ 
	var templateKeyList = json.result;
		if (!templateKeyList)
			return;

		$("div[name^='KEY_']").each(function(e) {
			var keyContainer = $(this);
			var expectKey = $(this).attr('name').replace('KEY_', '');

			for (var i = 0; i < templateKeyList.length; i++) {
				var group = templateKeyList[i];
				var groupKey = group.groupKey;
				if (expectKey == groupKey) {
					keyContainer.loadTemplate($("#keyTemplate"), group.blockList);
					break;
				}
			}
		}); 
		
 		var blockElementList = document.querySelectorAll("[blockid]");
		for (var i = 0; i < blockElementList.length; i++) {
			var url = blockElementList[i].getAttribute("blockurl"); 
			blockElementList[i].addEventListener('tap', function() {
				mui.openWindow({
					id: 'jumpPage',
					url: this.getAttribute("blockurl")
				});
			});
		}
}

keytemplate.initTemplateKey = function(shopId,templateName) {

	var requestJson = {
		data: {
			shopId: shopId,
			templateName: templateName
		}
	};
	
	ajax.jsonpSyncFetch("web/templateKey.action", requestJson, "keytemplate.callback");
}