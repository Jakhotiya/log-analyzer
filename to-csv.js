const fs = require('fs');
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";


if (process.argv.length < 3) {
    console.error('No log file specified for processing. Exiting');
    process.exit();
}

let filename = process.argv[2];
let website = process.argv[3];
let date = process.argv[4];

MongoClient.connect(url,{ useUnifiedTopology: true }, async (err, conn) => {
    if (err) throw err;

    let log = conn.db('nginx_log');

    let cur = log.collection(website).find({
        time: {$gte: new Date(date)},
        request: {$regex: /GET\s\/index\.php\?/},
        request_time: {$gte: 1}
    },{request:1,request_time:1,referer:1});

    let stream = fs.createWriteStream(filename, {encoding: 'utf8' });

    stream.on('error',(err)=>{
        console.log(err);
        conn.close();
        stream.close();
        process.exit();
    });

    cur.forEach((doc)=>{
        if(doc!==null){
            let row = `"${doc.request}","${doc.referer}", ${doc.request_time} \n`;
            console.log(row);
            stream.write(row);
        }

    },(err)=>{
        if(err){
            console.log(err);
        }
        conn.close();
        stream.close();
    });


});