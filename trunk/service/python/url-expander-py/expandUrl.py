#
# Copyright 2013 Amadeus Stevenson
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import webapp2
from google.appengine.api.urlfetch import fetch

class expandUrl(webapp2.RequestHandler):
	def get(self):
		self.response.headers.add('Content-Type','text/plain')
		self.response.headers.add('Access-Control-Allow-Origin','*')
		url=self.request.get('url')

		if not url:
			self.response.out.write("Usage example: " + self.request.environ['wsgi.url_scheme'] + "://" + self.request.environ['HTTP_HOST'] + "/?url=http://goo.gl/0LRZv\n\n")
			self.response.out.write("Response: http://code.google.com/p/chrome-url-expander/")
			return

		try:
			result=fetch(url,validate_certificate=False,follow_redirects=True)
			url=result.final_url if result.final_url else url
			self.response.out.write(url)
		except Exception as e: # show errors if &debug is defined
			self.response.out.write(e if self.request.get('debug') else self.request.get('url'))

app = webapp2.WSGIApplication([('/', expandUrl)],
								debug=True)