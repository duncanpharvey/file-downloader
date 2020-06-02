const fs = require('fs');
const https = require('https');
const request = require('request');

var url = process.argv[2];
var foldername = url.match(/portfolio-items\/.*?\//)[0].slice(16, -1);

fs.mkdir(foldername, () => { console.log('created folder: ' + foldername); });

function download(uri, filename, callback) {
    request(uri).pipe(fs.createWriteStream(__dirname + '/' + foldername + '/' + filename)).on('close', callback);
}

function done(filename) {
    return function () { console.log(filename + " - download complete") };
}

https.get(url, function (res) {
    res.setEncoding('utf8');
    var str;
    res.on('data', (chunk) => {
        str += chunk;
    });

    res.on('end', () => {
        var uris = str.match(/data-orig-src="https:\/\/19pe4y4dfvzy2kg6fzjb9sxy-wpengine.netdna-ssl.com\/wp-content\/uploads\/\d{4}\/\d{2}\/([A-Za-z0-9\-\_\.]+)\.(jpg|jpeg|png)/g);
        var downloaded = 0;
        const regex = RegExp('logo');
        uris.forEach(uri => {
            var filename = uri.match(/\/([A-Za-z0-9\-\_\.]+)\.(jpg|jpeg|png)/)[0].slice(1);
            if (!regex.test(filename)) {
                download(uri.slice(15), filename, done(filename));
                downloaded ++;
            }
        });

        console.log(downloaded + " images downloaded");
    });
});