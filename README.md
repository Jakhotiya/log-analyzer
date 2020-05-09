# Improving performance of the application (Standard Operating process)

When looking at a complex application, how do you tell if application if fast or slow.
Judging performance  by performance of landing page of the application can be very misleading. 
Surprisingly this is done very frequently. We need to measure all important and frequently performed
actions. There are three areas where we need to address performance.

1. Performance of the app in browser. Rendering, load time, etc.
2. Latency between client and server. Using CDN, having server close to targetted audience
3. Server performance. Response time of Different requests and load capacity

## Measuring application performance on server

Response time (TTFB,download time) we see in browser for request can be inaccurate reflection of server performance.
It can be affected by network latency and network speed. We need to know if the browserside of our application
is slow, or if the server is slow.

One way to keep track of how our server is performing is to check how fast nginx
(or your webserver) responds to requests.

We can measure whole request cycle time by nginx configuring access log. Following documention links
show how to configure nginx
* [https://docs.nginx.com/nginx/admin-guide/monitoring/logging/](https://docs.nginx.com/nginx/admin-guide/monitoring/logging/)
* [https://www.nginx.com/blog/using-nginx-logging-for-application-performance-monitoring/](https://www.nginx.com/blog/using-nginx-logging-for-application-performance-monitoring/)


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

The most important parameters here being $request_time,$upstream_response_time,$upstream_connect_time

The idea is to have a process where we look at server log everyday to see how server is doing.

## how to use this repository
The code here helps me parse nginx logs and put them in mongodb. nodejs and mongodb are 
required to run this script. MongoDb helps in answering questions like,
1. On an average how many requests do we recieve per day.
2. What is the peak time for load (find best time for deployment)
3. Which requests are slow but frequent (these must be optimized first)

## Why and how to use this script
Aggregation and comparison becomes difficult with log data. 
This script attempts to parse log file and push it to database. 
Then it should be straight forward to see a trend using database queries.


db.humcommerce.updateMany({METHOD:{$exists:1}},[{$set:{REQUEST_TIME:{$toDouble:"$REQUEST_TIME"}}}],{multi:true});
