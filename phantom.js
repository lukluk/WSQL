var phantom = require('phantom');

function psQuery(gpage) {
    this.open = function (url, cb) {
        phantom.create(function (ph) {
            ph.createPage(function (page) {
                page.open(url, function (status) {

                    gpage = page;
                    cb && cb(page);
                });
            });
        });
    }


}
module.exports = psQuery;