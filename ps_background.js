var storage = chrome.storage.local;

function addSearchTerm() {
    var searchVal = search.value;
    if (searchVal !== "") {
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendMessage(tab.id, {
                type: "search",
                term: searchVal
            }, function(response) {});
        });
        storage.get('terms', function(store) {
            var terms = store.terms;
            if (terms === undefined) terms = [];
            terms.push(searchVal);
            storage.set({
                'terms': terms
            }, function() {
                addListItem("termsList", store.terms);
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    saveSearch.addEventListener("click", addSearchTerm);
    storage.get('terms', function(store) {
        addListItem("termsList", store.terms);
    });
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    if (request.type == "badge") chrome.browserAction.setBadgeText({
        text: request.text
    });
});

function addListItem(listID, terms) {
    var element, new_element;
    var container = document.getElementById(listID);
    container.innerHTML = "";
    for (var i = 0; i < terms.length; i++) {
        element = document.getElementById(listID).value;
        new_element = document.createElement('li');
        new_element.innerHTML = element;
        container.insertBefore(new_element, container.firstChild);
        new_element.innerHTML = terms[i] + " (<span id='deleteTerm_" + i + "' termindex=" + i + " ><a href='#'>delete</a></span>)";
        document.getElementById("deleteTerm_" + i).addEventListener("click", deleteTerm);
    }

}

function deleteTerm(elm) {
    var termIndex = this.getAttribute('termIndex');
    storage.get('terms', function(store) {
        var terms = store.terms;
        terms.splice(termIndex, 1);
        storage.set({
            'terms': terms
        }, function() {
            addListItem("termsList", store.terms);
        });
    });
}