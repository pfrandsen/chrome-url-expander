/*
 * Chrome URL Expander content script
 *
 * Copyright 2011-2012, Peter Frandsen (pfrandsen@gmail.com)
 * Licensed under the Apache 2.0 license (http://www.apache.org/licenses/LICENSE-2.0)
 *
*/

document.addEventListener('mousemove', function (e) {
  _urlExpander.setMousePosition(e.clientX, e.clientY);
}, false);

document.addEventListener('keydown', function (e) {
  _urlExpander.handleKeyDown(e.keyCode);
}, false);

var _urlExpander = new function() {
  var mousePosition = { "posX" : 0, "posY" : 0 };

  this.setMousePosition = function(x, y) {
    mousePosition.posX = x;
    mousePosition.posY = y;
  }

  this.handleKeyDown = function(keyCode) {
    if (isCtrlKey(keyCode)) {
      checkAndExpandAnchor();
    }
  }

  isCtrlKey = function(keyCode) {
    return keyCode == 17;
  }

  function checkAndExpandAnchor() {
    var anchor = getAnchorAtLastMousePosition();
    if (anchor) {
      expandAnchor(anchor);
    }
  }

  function getAnchorAtLastMousePosition() {
    var target = document.elementFromPoint(mousePosition.posX, mousePosition.posY);
    var element = null;
    if (target) {
      element = (function (el) {return el.href ? el : el.parentNode ? arguments.callee(el.parentNode) : null;})(target);
    }
    return element;
  }

  function expandAnchor(anchor) {
    if (isAnchorExpanded(anchor)) {
      toggleAnchorTarget(anchor);
    } else {
      if (matchesURLShortener(anchor.href)) {
        expandURL(anchor.href, getCallbackClosure(anchor));
      }
    }
  }

  function isAnchorExpanded(anchor) {
    return anchor.getAttribute("data-expanded") ? true : false;
  }

  function toggleAnchorTarget(anchor) {
    if (anchor.getAttribute("data-expanded") == anchor.href) {
      anchor.href = anchor.getAttribute("data-href");
    } else {
      anchor.href = anchor.getAttribute("data-expanded");
    }
    forceStatusBubbleUpdate();
  }

  function matchesURLShortener(href) {
    urlRegEx = /(http[s]?:\/\/)(\w{1,8}\.\w{1,3})\/\w{1,10}$/i;
    return urlRegEx.test(href);
  }

  function getCallbackClosure(anchor) {
    var targetAnchor = anchor;
    var callback = function (data) {
      if (data.expanded) {
        // set custom attributes and change href to expanded url (will be shown in Status Bubble on mouse movement)
        targetAnchor.setAttribute("data-href", targetAnchor.href);
        targetAnchor.href = data.expanded;
        targetAnchor.setAttribute("data-expanded", targetAnchor.href); // important to read href - a '/' may be added at end
      }
    }
    return callback; 
  }

  function expandURL(url, callback) {
    var data = {'url' : url};
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          data.expanded = xhr.responseText;
        }
        callback(data);
        forceStatusBubbleUpdate();
      }
    }
    xhr.open("POST", "http://url-expander.appspot.com/expand.jsp", true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send("url=" + encodeURIComponent(url));
  }

  function forceStatusBubbleUpdate() {
    // this is a hack to move the cursor; see bug report: https://code.google.com/p/chromium/issues/detail?id=141370
    //window.scroll(0,1);
    //window.scroll(0,-1);
  }

}

console.log("Url expander content script loaded");
