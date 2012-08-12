<%@ page contentType="text/plain" language="java" %><%@ page import="java.net.HttpURLConnection" %><%@ page import="java.net.MalformedURLException" %><%@ page import="java.net.URL" %><%
  String expanded = null;
  String url = request.getParameter("url");
  if (url != null) {
    try {
      HttpURLConnection connection = (HttpURLConnection)new URL(url).openConnection();
      connection.setInstanceFollowRedirects(false);
      connection.connect();
      int responseCode = connection.getResponseCode();
      // a permanent redirect is expected
      if (responseCode == 301) {
        for (int counter = 0;; counter++) {
          String headerName = connection.getHeaderFieldKey(counter);
          if (headerName == null) {
            break;
          }
          if ("location".compareToIgnoreCase(headerName) == 0) {
            expanded = connection.getHeaderField(counter);
            break;
          }
        }
      }
    }
    catch (MalformedURLException e) {
    }
  }
  if (expanded != null) {
    response.setStatus(HttpServletResponse.SC_OK);
    out.println(expanded);
  } else {
    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
  }
%>
