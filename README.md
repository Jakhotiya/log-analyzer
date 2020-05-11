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

Usage 

```
node index.js <logfilepath> <websitename>
```

Website name is used to store all log data into specific collection

Following aggregation pipeline answers the question "What's the low time for the server".
The aggregation gives number of requests for hours of the day. We could add a match stage
before project to process only for a particular date 

```javascript
db.collectionName.aggregate([{$project:{hour:{$hour:'$time'}}},{$group:{_id:'$hour',total:{$sum:1}}}]);
```

After running this on 2 days of log I get following output
```
{ "_id" : 0, "total" : 75192 }
{ "_id" : 1, "total" : 79418 }
{ "_id" : 2, "total" : 79885 }
{ "_id" : 3, "total" : 165685 }
{ "_id" : 4, "total" : 193489 }
{ "_id" : 5, "total" : 188115 }
{ "_id" : 6, "total" : 196378 }
{ "_id" : 7, "total" : 202989 }
{ "_id" : 8, "total" : 235385 }
{ "_id" : 9, "total" : 260271 }
{ "_id" : 10, "total" : 270014 }
{ "_id" : 11, "total" : 273429 }
{ "_id" : 12, "total" : 236463 }
{ "_id" : 13, "total" : 131028 }
{ "_id" : 14, "total" : 128069 }
{ "_id" : 15, "total" : 123332 }
{ "_id" : 16, "total" : 115091 }
{ "_id" : 17, "total" : 263952 }
{ "_id" : 18, "total" : 304178 }
{ "_id" : 19, "total" : 291135 }
{ "_id" : 20, "total" : 127750 }
{ "_id" : 21, "total" : 87385 }
{ "_id" : 22, "total" : 81727 }
{ "_id" : 23, "total" : 81231 }
```

This tell me server has relatively less traffic between 9 PM to 2 AM EST time.
Be aware of the timezone.


#### Find all requests which took more than 3 seconds.

These can later be used output urls to csv files. I use these csv files for load testing with Jmeter

```javascript
db.collectionName.find({time:{$gte:new Date('2020-04-30')},request:{$regex:/GET\s\/index\.php\?/},request_time:{$gte:3}}).pretty();
```

```bash
node to-csv.js load.csv humdash '2020-04-30' 
```