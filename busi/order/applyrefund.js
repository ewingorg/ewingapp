var detailId = jQuery.url.param("detailId");


init();
initEvent();


function init() {
	var requestJson = {
		data: {
			orderDetailid: detailId
		}
	};
	ajax.jsonpSyncFetch("refund/apply.action", requestJson, 'renderRefund');
}

function renderRefund(json){
	if(null == json || json.result.length == 0){
		return;
	}
	
	$("#refundForm").loadTemplate($("#formDiv"), json.result);
}

function initEvent(){
	document.getElementById("applyRefund").addEventListener('tap', function() {
		//退货原因
		if (null == $("#refundType").val() || '' == $("#refundType").val()) {
			ewing.alert("提示", "退货原因不能为空哦", null);
			return;
		}
		
		//退货金额
		if (null == $("#refundMoney").val() || '' == $("#refundMoney").val()) {
			ewing.alert("提示", "退货金额不能为空哦", null);
			return;
		}
		
		//退货原因
		if (null == $("#reasonType").val() || '' == $("#reasonType").val()) {
			ewing.alert("提示", "退货原因不能为空哦", null);
			return;
		}
		
		//原因
		if (null == $("#reason").val() || '' == $("#reason").val()) {
			ewing.alert("提示", "原因不能为空哦", null);
			return;
		}
		
		var requestJson = {
			data: {
				orderDetailId: detailId,
				refundType : $("#refundType").val(),
				money : $("#refundMoney").val(),
				reasonType : $("#reasonType").val(),
				reason : $("#reason").val(),
				picUrl : $("#picUrl").val()
			}
		};
		
		ajax.jsonpSyncFetch("refund/submit.action", requestJson, 'afterSubmit');
	});
	
	
	
}

function afterSubmit(json){
	if(null != json && json.success == true){
		ewing.toast("提交成功");
		
		mui.openWindow({
			id: 'orderdetail',
			url: 'orderdetail.html?orderId=' + json.result
		});
	}
	
	ewing.alert("提示", "提交失败", null);
}


