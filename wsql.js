var S = require('string');
var attributes=[];
function wsQuery($, jqo, option, self) {
    this.object = option;    
    this.element = jqo;        
    this.toJson=function(){
        console.log(JSON.stringify(this.object));
    }
    this.getAttributes = function (sel) {
        if (!option) {
            return [];
        }

        var sels = sel.split(',');
        for (var e in sels) {
            if (sels[e].indexOf(':attr-') > -1) {
                var attribute = S(sels[e]).between(':attr-').s;
                attributes.push(attribute);
                sel = S(sel).replaceAll(':attr-' + attribute, '').s;
            } else {
                attributes.push(false);
            }
        }
        return sel;
    }
    this.select = function (sel) {
        if (!jqo) {
            jqo = $('html');
        }


        return new wsQuery($, jqo, sel);
    }
    this.from = function (text) {
        if (!jqo) {
            jqo = $('html');
        }
        var o = '';
        if (Array.isArray(option)) {
            o = option.join().trim();
        } else
        if (typeof option === "object") {
            o = [];
            for (var k in option) {
                o.push(option[k]);
            }
            o = o.join().trim();
        }
        o = this.getAttributes(o);
        
        if ($(text).length > 0) {
            var el = $(text);
            var self = $(text);
        } else {
            var i = -2;
            var self = jqo.find("*:contains(" + text + ")").eq(-1);
            var el = jqo.find("*:contains(" + text + ")").eq(-2);
            var i = -2;
            while (o && el.find(o).length < 1) {
                i = i - 1;
                el = jqo.find("*:contains(" + text + ")").eq(i);
            }
        }
        return new wsQuery($, el, option, self);
    }
    this.fetch = function (attr) {
        var me = this;
        if (!jqo) {
            jqo = $('html');
        }
        var sample = option;
        if (Array.isArray(option)) {
            sample = option[0];
        } else
        if (typeof option === "object") {
            var values = [];
            var keys = [];
            for (var k in option) {

                values.push(option[k]);
                keys.push(k);
            }
            sample = values[0];
            option = values;
        }
        var attribute = S(sample).between(':attr-').s;
        sample = S(sample).replaceAll(':attr-' + attribute, '').s;
        var list = jqo;
        if (jqo.find('tr').length == jqo.find(sample).length) {
            list = jqo.find('tr');
        } else
        if (jqo.find('li').length == jqo.find(sample).length) {
            list = jqo.find('li');
        } else
        if (jqo.find('div').length == jqo.find(sample).length) {
            list = jqo.find('div');
        }

        var records = [];

        list.each(function () {
            var th = $(this);
            if (!Array.isArray(option)) {
                option = [option];
            }
            for (var o in option) {
                var opt = option[o];
                var attribute = S(opt).between(':attr-').s;                
                opt = S(opt).replaceAll(':attr-' + attribute, '').s;
                var object = th.find(opt);
                var ret = '';
                if (self && object.text() != self.text()) {
                    if (!attr && object) {                        
                        if (attributes[o]) {
                            ret = object.attr(attributes[o]);
                        } else {
                            if (object[0].name == "input") {
                                ret = object.val();
                            } else
                            if (object[0].name == "img") {
                                ret = object.attr("src");
                            } else {
                                ret = object.text();
                            }
                        }
                    } else {
                        ret = object.attr(attr);
                    }
                }
                var f = {};
                if (keys) {
                    f[keys[o]] = ret;
                } else {
                    f[opt] = ret;
                }
                records.push(f);
            }
        })


        return new wsQuery($, list, records);
    }
}
module.exports = wsQuery;
