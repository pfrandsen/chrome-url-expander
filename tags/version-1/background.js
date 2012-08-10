/*
 * Chrome URL Expander background page script
 *
 * Copyright 2011-2012, Peter Frandsen (pfrandsen@gmail.com)
 * Licensed under the Apache 2.0 license (http://www.apache.org/licenses/LICENSE-2.0)
 *
*/


/**
 * Performs an XMLHttpRequest to url-expander.appspot.com/expand.jsp to expand a url.
 * @param request JSON Object Data sent in the request. Is used as parameter to the
 *     callback function. If the HTTP request returns status 200, then the expanded
 *     url will be added to the request object with key "expanded".
 * @param callback Function Called when the HTTP request is finished. The request
 *      parameter is used as argument to the callback function.
 */
function expandURL(request, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        request.expanded = xhr.responseText;
      }
      callback(request);
    }
  }
  xhr.open("GET", "http://url-expander.appspot.com/expand.jsp?url= + codeURIComponent(request.url), true);
  xhr.send();
}

/**
 * Handles data sent via chrome.extension.sendRequest().
 * @param request JSON Object Data sent in the request. Contains the url to be expanded. 
 * @param sender Object Origin of the request.
 * @param callback Function The method to call when the request completes.
 */
function onRequest(request, sender, callback) {
  expandURL(request, callback);
}

// Wire up the listener.
chrome.extension.onRequest.addListener(onRequest);