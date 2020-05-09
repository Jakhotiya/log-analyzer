const {parse,hasValidformat} = require('./parse');
const fs = require('fs');
const path = require('path');

const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";


if (process.argv.length < 3) {
    console.error('No log file specified for processing. Exiting');
    process.exit();
}

let filename = path.resolve(__dirname, process.argv[2]);
let website = process.argv[3];

function parseChunk(chunk) {
    let str = chunk;
    let lines = [];
    while (true) {
        let del = str.indexOf('\n');
        if (del === -1) {
            break;
        }
        lines.push(str.slice(0, del));
        str = str.slice(del + 1);
    }
    lines = lines.filter((l)=>{
        return hasValidformat(l);
    });
    return [lines, str];
}


MongoClient.connect(url,{ useUnifiedTopology: true }, function (err, conn) {
    if (err) throw err;

    let log = conn.db('nginx_log');
    log.collection(website).createIndex({request:'text'});
    log.collection(website).createIndex({time:1});
    log.collection(website).createIndex({request_time:1});


    let stream = fs.createReadStream(filename, {encoding: 'utf8', flag: 'r',highWaterMark:1024*1024});

    let leftover;
    stream.on('data', (data) => {

        let [lines, str] = parseChunk(leftover + data);
        leftover = str;

        let linesArr = lines.map(l => {
            return parse(l);
        });

        if(lines.length===0){
            return;
        }
        stream.pause();
        log.collection(website).insertMany(linesArr, (err, res) => {
            stream.resume();
            if (err) {
                console.log(err);
                return;
            }
            console.log(res.result);
        });

    });

    stream.on('end', (data) => {
        let [lines, str] = parseChunk(leftover + data);

        if(lines.length===0){
            conn.close();
            return;
        }

        let linesArr = lines.map(l => {
            return parse(l);
        });

        log.collection(website).insertMany(linesArr, (err, res) => {

            conn.close();
            if (err) {
                console.log(err);
                return;
            }
            console.log(res);
        });

    });

    stream.on('error', (err) => {
        console.log(err);
    });


});





