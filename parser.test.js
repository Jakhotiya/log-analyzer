const parse = require('./parse');

let line =
    '"02/Apr/2020:07:52:52 -0400" client=117.194.232.130 method=GET request="GET /humdash.php?e_c=JavaScript%20Errors&e_a=https%3A%2F%2Fwww.crackias.com%2Ftest_series%2Fviewresult%2FresultDetails%2F99671%2F51%3A274%3A189&e_n=Uncaught%20ReferenceError%3A%20all_close%20is%20not%20defined&idsite=821&rec=1&r=968957&h=17&m=22&s=51&url=https%3A%2F%2Fwww.crackias.com%2Ftest_series%2Fviewresult%2FresultDetails%2F99671%2F51&urlref=https%3A%2F%2Fwww.crackias.com%2Ftest_series%2Fviewresult%2FprelimsResult%2F99671&_id=328da2b065d80fcc&_idts=1585216937&_idvc=12&_idn=0&_refts=1585826491&_viewts=1585818511&_ref=https%3A%2F%2Fwww.google.co.in%2F&send_image=1&pdf=1&qt=0&realp=0&wma=0&dir=0&fla=0&java=0&gears=0&ag=0&cookie=1&res=1536x864&gt_ms=686&pv_id=HHPY19 HTTP/2.0" request_length=767 status=200 bytes_sent=352 body_bytes_sent=43 referer=https://www.crackias.com/test_series/viewresult/resultDetails/99671/51 user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36" upstream_addr=unix:///var/www/vhosts/system/app.humdash.com/php-fpm.sock upstream_status=200 request_time=0.065 upstream_response_time=0.065 upstream_connect_time=0.000 upstream_header_time=0.064'

let res = parse(line);
console.log(res);