var util = require('./util');
var request = require('request');
var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var Async = require('async');
var log = require('./log');

module.exports = function(){
  var task = [];
  task.push(function(callback){getAvaliableNDKVer(callback);});
  task.push(function(callback){getInstalledNDKVer(callback);});

  Async.series(task, function(err, results){
    if(err){
      console.log(err);
      //exit process in case of error
        process.exit();
    }
    var avaliableNDKVer = results[0];
    var installedNDKVerNumber = results[1].split('android-ndk-')[1];

    if(avaliableNDKVer === installedNDKVerNumber){
      log('No new android NDK avaliable');
      // util.notifier('No NDK update avaliable', 'No new android NDK avaliable');
    }
    else if(avaliableNDKVer !== installedNDKVerNumber){
      log('New android NDK avaliable : '+avaliableNDKVer);
      util.notifier('Update Avaliable', 'New android NDK avaliable : '+avaliableNDKVer);
    }
    else{
      log('Something is wrong for NDK version check. Please check...');
      util.notifier('Error', 'Something is wrong for NDK version check.');
    }
  });
};

function getAvaliableNDKVer(callback){
  request(util.ndkurl, function (err, response, body) {
    if(err){
      console.log(err);
      //exit process in case of error
        process.exit();
    }
    var avaliableNDKVersion =  body.split('<h2 id="stable-downloads">Latest Stable Version (')[1].split(')</h2>')[0].trim(' ');
    callback(null, avaliableNDKVersion);
  });
}

function getInstalledNDKVer(callback){
  var installedNDKVer;
  var files = [];
  var ndkPath = path.join('/Users', 'lchoudhary', 'Desktop', 'androidNDK');
  //Filtering '.DS_Store' file from the files array
  _.filter(fs.readdirSync(ndkPath), function(file){
    if(file !== '.DS_Store'){
      files.push(file);
    }
  });
  if(files){
    installedNDKVer = files[files.length-1];
    callback(null, installedNDKVer);
  }
  else{
    installedNDKVer = 'None';
    callback(null, 'None');
  }
}
