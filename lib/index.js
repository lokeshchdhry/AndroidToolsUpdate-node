#!/usr/bin/env node
/*
 * AndroidToolsUpdate-node
 * https://github.com/lokeshchdhry/AndroidToolsUpdate-node
 *
 * Copyright (c) 2017 Lokesh Choudhary
 * Licensed under the MIT license.
 */

var platformTools = require('./platformtools');
var tools = require('./tools');
var buildtools = require('./buildtools');
var platforms = require('./platforms');
var Async = require('async');
var util = require('./util');
var log = require('./log');

// setInterval(main, 3600000); //repeat after every 60 min
setInterval(main, 1800000); //repeat after every 30 min
// setInterval(main, 60000); //repeat after every 60 sec
main();
function main(){
  var Date;
  util.date(function(date){
    Date = date;
  });

  log('\n');
  log('---------------------------------------------------------------');
  log(Date);
  log('---------------------------------------------------------------');
  var task = [];
  task.push(function(callback){platforms(callback);});
  task.push(function(callback){platformTools(callback);});
  task.push(function(callback){tools(callback);});
  task.push(function(callback){buildtools(callback);});

  Async.series(task, function(err, result){
    if(err){
      log(err);
      //exit process in case of error
      process.exit();
    }
  });
}
