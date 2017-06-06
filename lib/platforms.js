var fs = require('fs');
var Async = require('async');
var path = require('path');
var util = require('./util');
var log = require('./log');
var _ = require('underscore');

module.exports = function(callback){
  var task = [];
  task.push(function(callback){util.getxmldata(util.dataFile, util.url, callback);});
  task.push(function(callback){util.parsexml(util.dataFile, callback);});
  task.push(function(callback){highestInstalledPlatform(callback);});

  Async.series(task, function(err, result){
    if(err){
      log(err);
      //exit process in case of error
      process.exit();
    }
    var data = result[1];
    var installed_Ver = result[2];

    getPlatforms(data, function(err, result){
      if(err){
        log(err);
        //exit process in case of error
        process.exit();
      }
      var avaliable_ver = result;
      if(installed_Ver === avaliable_ver){
        log('No new android platforms avaliable');
        // util.notifier('No Update Avaliable', 'No new android platform avaliable');
        callback(null, null);
      }
      else if(installed_Ver !== avaliable_ver){
        log('New android platform avaliable : '+avaliable_ver);
        util.notifier('Update Avaliable', 'New android platform avaliable : '+avaliable_ver);
        callback(null, null);
      }
      else{
        log('Something is wrong for platforms. Please check...');
        util.notifier('Error', 'Something is wrong for platforms.');
        callback(null, null);
      }
    });
  });
};

function getPlatforms(data, callback){
  var len = (data['sdk:sdk-repository'].remotePackage.length);
  var ver_arr = [];

  for(var i=0; i<=len-1; i++){
    var path = data['sdk:sdk-repository'].remotePackage[i].$.path;
    var name = path.split(';')[0];
    if(name === 'platforms'){
      var ver = path.split(';')[1];
      ver_arr.push(ver);
      ver_arr.sort();
    }
  }
  callback(null, ver_arr[ver_arr.length-1]);
}

function highestInstalledPlatform(callback){
  var highest_platform;
  var files = [];
  var android_sdkPath = process.env.ANDROID_SDK;
  var platforms_path = path.join(android_sdkPath, 'platforms');
  //Filtering '.DS_Store' file from the files array
  _.filter(fs.readdirSync(platforms_path), function(file){
    if(file !== '.DS_Store'){
      files.push(file);
    }
  });
  if(files){
    highest_platform = files[files.length-1];
    callback(null, highest_platform);
  }
  else{
    highest_platform = 'None';
    callback(null, 'None');
  }
}
