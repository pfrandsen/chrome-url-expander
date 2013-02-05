# send HTTP headers
print "Access-Control-Allow-Origin: *"
print "Content-type: text/plain\n"

# import libraries
import httplib, sys, re
from urlparse import urlparse

# check URL is passed
if len(sys.argv) < 2: exit(1)

# setup recursive counter
n=0
max_n=5 # maximum number of redirections

# function to check URL
def checkUrl(url):
        global n        # recursive counter

        # stop excessive redirections
        if n > (max_n-1): return url

        # parse URL
        o=urlparse(url)

        # establish connection
        conn={'http': httplib.HTTPConnection,
        'https': httplib.HTTPSConnection,
        }.get(o.scheme,lambda x: exit(1))(o.netloc)

        path = "/" + o.path if len(o.path) < 1 else o.path
        path = path + "?" + o.query if len(o.query) > 0 else path

        # request page. nginx needs User-Agent
        try: conn.request("GET", path, "",{"User-Agent": "Python"} )
        except: exit(1)

        # read response headers
        response=conn.getresponse()

        # check status for redirection (3xx)
        if re.match(r"^3[0-9][0-9]$",str(response.status)):
                n+=1
                location=response.getheader("location")
                location = location if re.match(r"^http.*",location) else o.scheme + "://" + o.netloc + location
                return checkUrl(location)
        elif response.status == 200:
                return url
        else:
                exit(1)

print checkUrl(sys.argv[1])
