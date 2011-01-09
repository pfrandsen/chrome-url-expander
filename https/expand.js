/*
 * Chrome URL Expander content script
 *
 * Copyright 2011, Peter Frandsen (pfrandsen@gmail.com)
 * Licensed under the Apache 2.0 license (http://www.apache.org/licenses/LICENSE-2.0)
 *
*/
var _expander = { "cur" : 0, "posX" : 0, "posY" : 0, "ref" : {} }

document.addEventListener('mousemove', function (e) {
  _expander.posX = e.clientX;
  _expander.posY = e.clientY;
}, false);

document.addEventListener('keydown', function (e) {
  if (e.keyCode == 17) {  // ctrl pressed
    var target = document.elementFromPoint(_expander.posX, _expander.posY);
    if (target) {
      anchor = (function (el) {return el.href ? el : el.parentNode ? arguments.callee(el.parentNode) : null;})(target);
      if (anchor) {
        if (anchor.getAttribute("data-expanded")) {  // url already expanded - toggle href
          if (anchor.getAttribute("data-expanded") == anchor.href) {
            anchor.href = anchor.getAttribute("data-href");
          } else {
            anchor.href = anchor.getAttribute("data-expanded");
          }
        } else {  // expand the url if it matches url shortener pattern
          urlRegEx = /http:\/\/(\w{1,8}\.\w{1,3})\/\w{1,10}$/i;
          if (urlRegEx.test(anchor.href)) {
            console.log("matched, expanding: " + anchor.href);
            var key = _expander.cur++;
            _expander.ref[key] = anchor;
            chrome.extension.sendRequest({'url' : anchor.href, 'element' : key},
              function (data) {
                if (data.expanded) {
                  var anchor = _expander.ref[data.element]
                  // set custom attributes and change href to expanded url (will be shown in Status Bubble)
                  anchor.setAttribute("data-href", anchor.href);
                  anchor.href = data.expanded;
                  anchor.setAttribute("data-expanded", anchor.href); // important to read href - a '/' may be added at end
                }
                delete _expander.ref[data.element];
              });
          }
        }
      }
    }
  }
}, false);
