chrome.extension.sendRequest({'searchBody': true, 'html': document.body.innerHTML}, function(response) {
	console.log(response);
	if(response.success) {
		document.body.innerHTML = response.html;
	}
});

