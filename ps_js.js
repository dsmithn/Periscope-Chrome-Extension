chrome.extension.sendRequest({'getTerms': true}, function(response) {
	search(response.terms);
});


function search(terms) {
	var term = terms.toLowerCase();
	var highlightStartTag = "<font style='color:blue; background-color:yellow;'>";
	var highlightEndTag = "</font>";
	
	allTerms = term.split(',');

	for(var n = 0; n < allTerms.length; n++) {
		var newText = "";
		var i = -1;
		var bodyText = document.body.innerHTML;
		var lcBodyText = document.body.innerHTML.toLowerCase();
		term = allTerms[n];

		while (bodyText.length > 0) {
			i = lcBodyText.indexOf(term, i+1);
			if (i < 0) {
				newText += bodyText;
				bodyText = "";
			} else {
				if (bodyText.lastIndexOf(">", i) >= bodyText.lastIndexOf("<", i)) {
					if (lcBodyText.lastIndexOf("/script>", i) >= lcBodyText.lastIndexOf("<script", i)) {
						newText += bodyText.substring(0, i) + highlightStartTag + bodyText.substr(i, term.length) + highlightEndTag;
						bodyText = bodyText.substr(i + term.length);
						lcBodyText = bodyText.toLowerCase();
						i = -1;
					}
				}
			}
		}
		document.body.innerHTML = newText;
	}
}
