# Measuring application performance on server

Response time we see in browser for request can be inaccurate reflection server performance.
It can be affected by network latency if the client is far away from the server. Or it can be
affected by client's internet connection. We need to know if the browserside of our application
is slow, or if the server is slow.

One way to keep track of how our server is performing is to check how fast nginx responds for requests

We can measure whole request cycle time by configuring access log. Following documention links
show how to configure nginx
(https://docs.nginx.com/nginx/admin-guide/monitoring/logging/)[https://docs.nginx.com/nginx/admin-guide/monitoring/logging/]
(https://www.nginx.com/blog/using-nginx-logging-for-application-performance-monitoring/)[https://www.nginx.com/blog/using-nginx-logging-for-application-performance-monitoring/]


```bash
   log_format apm '"$time_local" client=$remote_addr '
                  'method=$request_method request="$request" '
                  'request_length=$request_length '
                  'status=$status bytes_sent=$bytes_sent '
                  'body_bytes_sent=$body_bytes_sent '
                  'referer=$http_referer '
                  'user_agent="$http_user_agent" '
                  'upstream_addr=$upstream_addr '
                  'upstream_status=$upstream_status '
                  'request_time=$request_time '
                  'upstream_response_time=$upstream_response_time '
                  'upstream_connect_time=$upstream_connect_time '
                  'upstream_header_time=$upstream_header_time';

```

The most important paramters here being $request_time,$upstream_response_time,$upstream_connect_time

The idea is to have a process where we look at server log everyday to see how server is doing.

## Why and how to use this script
Aggregation and comparison becomes difficult with log data. 
This script attempts to parse log file and push it to database. 
Then it should be straight forward to see a trend using database queries.


db.humcommerce.updateMany({METHOD:{$exists:1}},[{$set:{REQUEST_TIME:{$toDouble:"$REQUEST_TIME"}}}],{multi:true});
