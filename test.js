var util = require('util');
var vm = require('vm');

var sandbox = { globalVar: 1 };
var o= vm.createContext(sandbox);

for (var i = 0; i < 10; ++i) {
    vm.runInContext('globalVar *= 2;', o);
}
console.log(util.inspect(o));