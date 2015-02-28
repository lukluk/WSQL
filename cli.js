var readline = require('readline'),
S = require('string')
    rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('WSQL> ');
rl.prompt();

rl.on('line', function(line) {
  line=line.trim();
  if(line.indexOf("open ")>-1){
    var ar=line.split(' ');
    var url=ar[1];
    console.log("Connected to "+url)
  }
  if(line=="exit"){
    process.exit(0);
  }
  else{
    console.log('Invalid command');
  }
  rl.prompt();
}).on('close', function() {
  console.log('Have a great day!');
  process.exit(0);
});
