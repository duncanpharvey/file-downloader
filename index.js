const fs = require('fs');
const request = require('request');

function download(uri, filename, callback) {
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
}

function done(filename) {
    return function() { console.log(filename + " - download complete") };
}
  
fs.readFile('text.txt', (err, data) => { 
    if (err) throw err; 
  
    var uris = data.toString().match(/data-orig-src="https:\/\/19pe4y4dfvzy2kg6fzjb9sxy-wpengine.netdna-ssl.com\/wp-content\/uploads\/\d{4}\/\d{2}\/([A-Za-z0-9\-\_\.]+)\.jpg/g);
    
    uris.forEach(uri => {
        var filename = uri.match(/\/([A-Za-z0-9\-\_\.]+)\.jpg/)[0].slice(1); 
        download(uri.slice(15), filename, done(filename));
    }); 
});