
const LINK = 'a',
  TEXT = '*',
  IMAGE = 'img'

function wsQuery($,jqo, option, self) {
  this.output = option;
  this.element = jqo;
  //ws.from('Kategori').
  this.select = function(sel) {
    if (!jqo) {
      jqo = $('html');
    }
    return new wsQuery($,jqo, sel);
  }
  this.from = function(text) {
    if (!jqo) {
      jqo = $('html');
    }
    var i = -2;
    var self = jqo.find("*:contains(" + text + ")").eq(-1);
    var el = jqo.find("*:contains(" + text + ")").eq(-2);
    var i=-2;
    while (el.find(option).length < 1) {
      i=i-1;
      el = jqo.find("*:contains(" + text + ")").eq(i);
    }

    return new wsQuery($,el, option, self);
  }
  this.fetch = function(attr) {
    var ret = [];
    if (!jqo) {
      jqo = $('html');
    }
    var objects = jqo.find(option);
    objects.each(function() {
      if (self && $(this).text() != self.text()) {
        if (!attr) {
          ret.push($(this).text());
        } else {
          ret.push($(this).attr(attr));
        }
      }
    })

    return new wsQuery($,objects, ret);
  }
}
module.exports =wsQuery;
//web.select("h2").from("Keperluan Pribadi").fetch().output.join();
