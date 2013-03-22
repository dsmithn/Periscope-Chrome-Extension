console.log("ps_background.js loaded");
var storage = chrome.storage.local;

function searchCurrentPage() {
  var searchVal = search.value;
  console.log("searching for: " + searchVal);
  if(searchVal !== "") {
    chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.sendMessage(tab.id, {type: "search", term: searchVal}, function(response) {
        console.log(response);
      });
      storage.set({'term': searchVal}, function() {
          // Notify that we saved.
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  saveSearch.addEventListener("click", searchCurrentPage);
  storage.get('term', function(items) {
    console.log(items);
    search.value = items.term;
  });
});

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);
    if (request.type == "badge")
      chrome.browserAction.setBadgeText({text: request.text});
});