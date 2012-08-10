Chrome extension to expand shortened URL's.

The extension is designed to be non-intrusive. It will only expand
URL's on demand.

It works the following way:

When you place the mouse over a link you can press the CTRL key to
resolve the real url. The expanded URL will be placed in the href
attribute of the link. When you move the mouse over the anchor you
will see the expanded URL in the Status Bubble in the lower left part
of the browser window.
You can right-click on the link and copy the expanded URL through the
normal context menu.
Press the CTRL key over the link again to toggle between the shortened
and the expanded URL.

Regular expression to if url is possibly shortened is inspired by Don
Magee (http://www.tacticalcoder.com)

/http:\/\/\w{1,8}\.\w{1,3}\/\w{1,10}$/i;
