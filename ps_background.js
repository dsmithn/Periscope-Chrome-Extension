var storage = chrome.storage.local;

document.addEventListener('DOMContentLoaded', function() {
    saveSearch.addEventListener("click", addSearchTerm);
    clearAll.addEventListener("click", function() {
        storage.clear();
        addListTerm("termsList", []);
    });
    hightlightColor.addEventListener("click", function() {
        hightlightColor.setAttribute('style', 'display:none;');
        colorPicker.setAttribute('style', 'display:inline;');
    });
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

chrome.tabs.onActivated.addListener(function(tab) {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {
            type: "searchAll"
        }, function(response) {});
    });
});

function addSearchTerm() {
    var searchVal = search.value;
    var webVal = websites.value;
    var color = colorPicker.value;
    if (webVal === "") webVal = "*";
    if (searchVal !== "") {
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendMessage(tab.id, {
                type: "search",
                term: {
                    term: searchVal,
                    website: webVal,
                    color: color
                }
            }, function(response) {});
        });
        storage.get('terms', function(store) {
            var terms = store.terms;
            if (terms === undefined) terms = [];
            terms.push({
                term: searchVal,
                website: webVal,
                color: color
            });
            storage.set({
                'terms': terms
            }, function() {
                addListItem("termsList", store.terms);
            });
        });
        searchVal.value = "";
        hightlightColor.setAttribute('style', 'display:inline;');
        colorPicker.setAttribute('style', 'display:none;');
        colorPicker.value = "FFFF00";
    }
}

function addListItem(listID, terms) {
    var element, new_element, liHTML;
    var container = document.getElementById(listID);
    container.innerHTML = "";
    for (var i = 0; i < terms.length; i++) {
        element = document.getElementById(listID).value;
        new_element = document.createElement('li');
        new_element.innerHTML = element;
        container.insertBefore(new_element, container.firstChild);
        //liHTML = 
        new_element.innerHTML = "<span style='background-color:#" + terms[i].color + ";'>" + terms[i].term + "</span>@" + terms[i].website;
        new_element.innerHTML += " (<span id='deleteTerm_" + i + "' termindex=" + i + " ><a href='#'>delete</a></span>)";
        new_element.innerHTML += " (<span id='findTerm_" + i + "' termindex=" + i + " ><a href='#'>find next</a> /";
        new_element.innerHTML += " <span id='findTermPrev_" + i + "' termindex=" + i + " ><a href='#'>prev</a>)";
        document.getElementById("deleteTerm_" + i).addEventListener("click", deleteTerm);
        document.getElementById("findTerm_" + i).addEventListener("click", findTermClick);
        document.getElementById("findTermPrev_" + i).addEventListener("click", findTermPrevClick);
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

function findTerm(index, prev) {
    storage.get('terms', function(store) {
        var term = store.terms[index].term;
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendMessage(tab.id, {
                type: "findTerm",
                term: term,
                prev: prev
            }, function(response) {});
        });
    });
}

function findTermClick(elm) {
    findTerm(this.getAttribute('termIndex'), false);
}

function findTermPrevClick(elm) {
    findTerm(this.getAttribute('termIndex'), true);
}