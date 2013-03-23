function saveSearch() {
    var search = {};
    search.val = $('#search').value;
    search.site = $('#site').value;
    saveTabData(tab, search);
}

function saveTabData(data) {
    localStorage = data; // OK to store data
}

function searchFor(searchVal) {
    if (searchVal === "") return;
    count = 0;
    highlightWord(document.getElementsByTagName("body")[0], searchVal);
    chrome.extension.sendMessage({
        type: "badge",
        text: count.toString()
    }, function(response) {
        console.log("sent")
    });
}

var count = 0;
chrome.extension.onMessage.addListener(

function(request, sender, sendResponse) {
    if (request.type == "search") {
        searchFor([request.term]);
    }
});

/* http://www.kryogenix.org/code/browser/searchhi/ */
/* Modified 20021006 to fix query string parsing and add case insensitivity */
/* Modified 20070316 to stop highlighting inside nosearchhi nodes */
/* Modified 20090104 by Bruce Lawson to use html5 mark element rather than span http://www.whatwg.org/specs/web-apps/current-work/multipage/text-level-semantics.html#the-mark-element */

/* This script is by Stuart Langridge licensed under MIT license http://www.kryogenix.org/code/browser/licence.html */

function highlightWord(node, words) {
    // Iterate into this nodes childNodes
    if (node.hasChildNodes) {
        var hi_cn;
        for (hi_cn = 0; hi_cn < node.childNodes.length; hi_cn++) {
            highlightWord(node.childNodes[hi_cn], words);
        }
    }

    // And do this node itself
    if (node.nodeType == 3) { // text node
        tempNodeVal = node.nodeValue.toLowerCase();
        for (var i = 0; i < words.length; i++) {
            tempWordVal = words[i].toLowerCase();
            if (tempNodeVal.indexOf(tempWordVal) != -1) {
                pn = node.parentNode;
                // check if we're inside a "nosearchhi" zone
                checkn = pn;
                while (checkn.nodeType != 9 && checkn.nodeName.toLowerCase() != 'body') {
                    // 9 = top of doc
                    if (checkn.className.match(/\bnosearchhi\b/)) {
                        return;
                    }
                    checkn = checkn.parentNode;
                }
                if (pn.className != "searchword") {
                    // word has not already been highlighted!
                    nv = node.nodeValue;
                    ni = tempNodeVal.indexOf(tempWordVal);
                    // Create a load of replacement nodes
                    before = document.createTextNode(nv.substr(0, ni));
                    docWordVal = nv.substr(ni, words[i].length);
                    after = document.createTextNode(nv.substr(ni + words[i].length));
                    hiwordtext = document.createTextNode(docWordVal);
                    hiword = document.createElement("mark");
                    hiword.className = "searchword";
                    hiword.appendChild(hiwordtext);
                    pn.insertBefore(before, node);
                    pn.insertBefore(hiword, node);
                    pn.insertBefore(after, node);
                    pn.removeChild(node);
                    count++;
                }

            }
        }
    }
}

chrome.storage.local.get('terms', function(store) {
    searchFor(store.terms);
});