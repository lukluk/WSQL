var readline = require('readline'),
    S = require('string'),
    request = require('request'),
    vm = require('vm'),
    wsql = require('./wsql'),
    fs = require('fs'),
    cheerio = require('cheerio'),
    util = require('util')
rl = readline.createInterface(process.stdin, process.stdout);
console.log("WSQL v.Alpha");
rl.setPrompt('WSQL> ');
rl.prompt();
var connected = false;
var $ = null;


rl.on('line', function (line) {
    line = line.trim();
    if (line.indexOf("use ") > -1) {
        var ar = line.split(' ');
        var url = ar[1];
        connected = false;
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                connected = true;

                $ = cheerio.load(body);

            }
        })
    } else
    if (line == "exit") {
        process.exit(0);
    } else {
        if (connected) {
            var sandbox = {
                web: new wsql($),
                $:$,
                LINK:'a',
                TITLE:'h2',
                LINKTITLE:'h2>a'
            }
            try {
            var vmResult = vm.runInNewContext(line, sandbox);
            console.log(vmResult);
                } catch (e) {
                    console.log(e);
                }
        } else {
            console.log('not connected');
        }
    }
    rl.prompt();
}).on('close', function () {
    console.log('Have a great day!');
    process.exit(0);
});
