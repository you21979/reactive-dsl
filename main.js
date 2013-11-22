"use strict";
var fs = require('fs');
var FSM = require('event-fsm');
var events = require('events');
var parser = require('./parser');

var state = function(){
    return new events.EventEmitter();
}

var analyze = function(fsm, v){
    var len = v.length;
    if(len === 0){
        return;
    }else if(v[0] === '#'){
        return;
    }else if(v[0] === '['){
        fsm.setState('ENTRY', v.substr(1, len - 2));
    }else{
        fsm.update(v);
    }
}

var main = function(){
    var table = {};
    var current = null;

    var fsm = new FSM({
        NONE : state(),
        ENTRY : state()
            .on('begin', function(arg){
                table[arg] = {};
                current = table[arg];
            })
            .on('update', function(arg){
                var kv = arg.split('=');
                current[kv[0]] = parser.parse(kv[1]);
            })
            .on('end', function(arg){
                current = null;
            })
            ,
        EXEC : state()
            .on('begin', function(){
                var dep = parser.dependency(table);
                console.log(dep);
                console.log(table);
            })
            ,
    });
    fs.readFile('./in.txt', 'utf-8', function(err, val){
        var line = val.split('\n');
        line.forEach(function(v){
            analyze(fsm, v);
        });
        fsm.setState('EXEC');
    });
}

main();
