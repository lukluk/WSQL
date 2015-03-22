#!/usr/bin/env node

var readline = require('readline'),
    S = require('string'),
    request = require('request'),
    vm = require('vm'),
    wsql = require('./wsql'),
    phantom = require('./phantom'),
    fs = require('fs'),
    cheerio = require('cheerio'),
    util = require('util')
rl = readline.createInterface(process.stdin, process.stdout);
var connected = false;
var $ = null;
var global = false;
var contex = false;

var sandbox = {
    send: function (line, cb) {

        try {

            var vmResult = vm.runInContext(line, contex);
            cb && cb();
            
            contex.output && console.log(util.inspect(contex.output));
        } catch (e) {
            console.log(e);
        }

    }
}

// FILE
if (process.argv[2]) {
    var txt = fs.readFileSync(process.argv[2]) + '';
    var qlines = txt.split(';');
    //    var qlines = [];
    //    for (var n in lines) {
    //        var line = lines[n];
    //        var a = line.split(';');
    //        if (a.length > 1) {
    //            for (var l in a) {
    //                qlines.push(a[l]);
    //            }
    //        } else {
    //            qlines.push(line);
    //        }
    //    }

    var startTime = new Date();
    startTime = startTime.getTime();
    var index = 0;
    var nextLine = function () {
        line = qlines[index];
        index = index + 1;
        if (line) {
            line = line.trim();
            console.log('>', line);
            if (line.indexOf("use -b ") > -1) {
                var ar = line.split(' ');
                var url = ar[2];
                connected = false;

                var ps = new phantom();
                ps.open(url, function (page) {

                    page.evaluate(function () {
                        return document.documentElement.outerHTML;
                    }, function (result) {
                        $ = cheerio.load(result);
                        
                        global = {
                            web: new wsql($),
                            page: page,
                            $: $
                        }
                        contex = vm.createContext(global);
                        connected = true;
                        nextLine();
                    });

                });
            } else
            if (line.indexOf("use -c ") > -1) {
                var ar = line.split(' ');
                var url = ar[2];
                connected = false;
                var data = fs.readFileSync('tmp/' + S(url).slugify().s);
                connected = true;
                $ = cheerio.load(data);
                global = {
                    web: new wsql($),
                    $: $
                }
                contex = vm.createContext(global);
                nextLine();
            } else
            if (line.indexOf("use ") > -1) {
                var ar = line.split(' ');
                var url = ar[1];
                connected = false;
                console.log('connecting..');
                request(url, function (error, response, body) {

                    if (!error && response.statusCode == 200) {
                        connected = true;
                        $ = cheerio.load(body);
                        console.log('connected');
                        fs.writeFile('tmp/' + S(url).slugify().s, body);
                        global = {
                            web: new wsql($),
                            $: $
                        }
                        contex = vm.createContext(global);
                        nextLine();

                    }
                })
            } else
            if (line == "exit") {
                var now = new Date();
                now = now.getTime();
                var deltaTime = (now - startTime) / 1000;
                console.log('executed ', deltaTime, 'seconds');
                process.exit(0);
            } else {
                if (connected) {
                    sandbox.send(line, function () {
                        nextLine();
                    });
                } else {
                    console.log('not connected');
                    nextLine();
                }
            }
            if (index >= qlines.length) {
                var now = new Date();
                now = now.getTime();
                var deltaTime = (now - startTime) / 1000;
                console.log('executed ', deltaTime, 'seconds');
                process.exit(0);
            }

        }
    }
    nextLine();



} else {
    console.log("WSQL v.Alpha");
    rl.setPrompt('WSQL> ');
    rl.prompt();

}
// Shell
rl.on('line', function (line) {
    line = line.trim();
    if (line.indexOf("use -c ") > -1) {
        var ar = line.split(' ');
        var url = ar[2];
        connected = false;

        var data = fs.readFileSync('tmp/' + S(url).slugify().s);
        connected = true;
        $ = cheerio.load(data);
        global = {
            web: new wsql($),
            $: $
        }
        contex = vm.createContext(global);

    } else
    if (line.indexOf("use -b ") > -1) {
        var ar = line.split(' ');
        var url = ar[2];
        connected = false;

        var ps = new phantom();
        ps.open(url, function (page) {
            page.evaluate(function () {
                return document.documentElement.outerHTML;
            }, function (result) {
                $ = cheerio.load(result);
                
                global = {
                    web: new wsql($),
                    page: page,
                    $: $
                }
                contex = vm.createContext(global);
                connected = true;
                rl.prompt();
            });

        });




    } else
    if (line.indexOf("use ") > -1) {
        var ar = line.split(' ');
        var url = ar[1];
        connected = false;
        console.log('connecting..');
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                connected = true;
                console.log('connected');
                $ = cheerio.load(body);
                global = {
                    web: new wsql($),
                    $: $
                }
                contex = vm.createContext(global);
                rl.prompt();
            }
        })
    } else
    if (line == "exit") {
        process.exit(0);
    } else {
        if (connected) {
            sandbox.send(line);
        } else {
            console.log('not connected');
            rl.prompt();
        }
    }

}).on('close', function () {
    console.log('Have a great day!');
    process.exit(0);
});