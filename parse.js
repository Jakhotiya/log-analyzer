const getDate = require('./date-parse');
const querystring = require('querystring');

let boundaries = ['client=','method=','request=','request_length=','status=',
    'bytes_sent=','body_bytes_sent=','referer=','user_agent=',
    'upstream_addr=','upstream_status=','request_time=',
    'upstream_response_time=','upstream_connect_time=','upstream_header_time='];

let headers = boundaries.map(d=>d.slice(0,d.length-1));

headers.unshift('TIME');

function shouldBeNumber(prop){
    return -1!==['request_length','status','bytes_sent','request_time','upstream_response_time'].indexOf(prop);
}

 function parse(line){

    let res = [];
    boundaries.forEach((b)=>{

        let index = line.indexOf(' '+b);
        let param = line.slice(0,index);

        res.push(param);
        line = line.slice(index+b.length+1);

    });
    res.push(line);
    let obj = {};
    for(let i=0;i<headers.length;i++){

        obj[headers[i]] = shouldBeNumber(headers[i]) ? parseFloat(res[i]) :  res[i];

     }
     obj['TIME'] = getDate(obj['TIME']);

    return obj;

};

 function getIdSite(req){
     let i = req.indexOf('?');
     if(i===-1){
         return i;
     }
    let q = req.slice(0,req.indexOf('?')+1);
     querystring.parse();
 }

function hasValidformat(line){
    for(let i=0;i<boundaries.length;i++){
       if(line.indexOf(boundaries[i])<1){
           return false;
       }
    }
    return true;
}


module.exports = {parse,hasValidformat}