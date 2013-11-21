"use strict";

var parse = exports.parse = function(v){
    v = '(' + v + ')'
    v = v.replace(/ /g, '');
    v = v.replace(/\(/g, '["');
    v = v.replace(/\)/g, '"]');

    v = v.replace(/\+/g, '","+","');
    v = v.replace(/\*/g, '","*","');

    v = v.replace(/\"\[/g, '[');
    v = v.replace(/\]\"/g, ']');

    return JSON.parse(v);
}

var isDigit = function(v){
    switch(v[0]){
    case '*':
    case '/':
    case '-':
    case '+':
        return true;
    default:
        break;
    }
    return !isNaN(Number(v));
}
var dependency = exports.dependency = function(table){
    var depend = {};
    for(var key in table){
        depend[key] = {};
        for(var field in table[key]){
            var v = table[key][field];
            var f = function(depend, v){
                for(var i = 0; i<v.length; ++i){
                    if(v[i] instanceof Array){
                        f(depend, v[i]);
                    }else{
                        if(!isDigit(v[i])){
                            depend[v[i].split('.')[0]] = 1;
                        }
                    }
                }
            }
            f(depend[key], v);
        }
    }
    var convert = function(depend){
        var dic = {};

        for(var key in depend){
            dic[key] = [];
            for(var f in depend[key]){
                dic[key].push(f);
            }
        }
        return dic;
    };
    return convert(depend);
}

