var storage = chrome.storage.local;

function addSearchTerm() {
  var searchVal = search.value;
  if(searchVal !== "") {
    chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.sendMessage(tab.id, {type: "search", term: searchVal}, function(response) {});
    });
    storage.get('terms', function(store) {
      var terms = store.terms;
      if(terms === undefined) terms = [];
      terms.push(searchVal);
      storage.set({'terms': terms}, function() {
        // Notify that we saved.
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  saveSearch.addEventListener("click", addSearchTerm);
  storage.get('terms', function(store) {
    console.log(store);
    //search.value = items.term;
    for(var i = 0; i < store.length; i++) {
          var element=document.getElementById('termsList').value;
          
          // This is the <ul id="myList"> element that will contains the new elements
          var container = document.getElementById('termsList');
          // Create a new <li> element for to insert inside <ul id="myList">
          var new_element = document.createElement('li');
          new_element.innerHTML = element;
          container.insertBefore(new_element, container.firstChild);
          // Show a message if the element has been added;
          document.getElementById('msg').style.display="block";
          document.getElementById('msg').innerHTML = "Elemend added!";
          // Clean input field
          //document..getElementById('newElement').value="";
    }
  });
});

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);
    if (request.type == "badge")
      chrome.browserAction.setBadgeText({text: request.text});
});