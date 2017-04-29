var fs = require('fs');
var Async = require('async');
var path = require('path');
var compareVersions = require('compare-versions');
var util = require('./util');
var log = require('./log');

module.exports = function(callback){
  var task = [];
  task.push(function(callback){util.getxmldata(util.dataFile, util.url, callback);});
  task.push(function(callback){util.parsexml(util.dataFile, callback);});
  task.push(function(callback){getcurrent_ver(callback);});

  Async.series(task, function(err, result){
    if(err){
      log(err);
      //exit process in case of error
      process.exit();
    }
    var data = result[1];
    var installed_Ver = result[2];

    getBuildTools(data, function(err, result){
      if(err){
        log(err);
        //exit process in case of error
        process.exit();
      }
      var avaliable_ver = result;
        if(compareVersions(installed_Ver, avaliable_ver) === 0){
          log('No new build tools update avaliable');
          util.notifier('No Update Avaliable', 'No new build tools update avaliable');
          callback(null, null);
        }
        else if(compareVersions(installed_Ver, avaliable_ver) === 1){
          log('No new build tools update avaliable');
          util.notifier('No Update Avaliable', 'No new build tools update avaliable');
          callback(null, null);
        }
        else if(compareVersions(installed_Ver, avaliable_ver) === -1){
          log('New build tools update avaliable'+avaliable_ver);
          util.notifier('Update Avaliable', 'New build tools update avaliable : '+avaliable_ver);
          callback(null, null);
        }
    });
  });
};

function getBuildTools(data, callback){
  var len = (data['sdk:sdk-repository'].remotePackage.length);
  var ver_arr = [];

  for(var i=0; i<=len-1; i++){
    var path = data['sdk:sdk-repository'].remotePackage[i].$.path;
    var name = path.split(';')[0];
    if(name === 'build-tools'){
      var ver = path.split(';')[1];
      ver_arr.push(ver);
      ver_arr.sort();
    }
  }
  callback(null, ver_arr[ver_arr.length-1]);
}

function getcurrent_ver(callback){
  var current_ver;
  var android_sdkPath = process.env.ANDROID_SDK;
  var buildtools_path = path.join(android_sdkPath, '/build-tools');
  //Checking if build-tools folder exists
  if(fs.existsSync(buildtools_path)){
    fs.readdir(buildtools_path, function(err, files){
      if(err){
        log(err);
        //exit process in case of error
        process.exit();
      }
      var highest = files[files.length-1];
      try{
        process.chdir(path.join(buildtools_path, highest));
      }
      catch(err){
        log(err);
        //exit process in case of error
        process.exit();
      }
      fs.readFile(path.join(buildtools_path, highest,'source.properties'), function(err, result){
        if(err){
          log(err);
          //exit process in case of error
            process.exit();
        }
        current_ver = result.toString().split('Pkg.Revision=')[1].split('\n')[0];
        var patt = /.0/g;
        var patt1 = /rc/g;
        if(patt1.test(current_ver)){
          if(!patt.test(current_ver)){
            current_ver = current_ver.split(' ')[0]+'.0'+'.0-'+current_ver.split(' ')[1];
          }
          else{
            current_ver = current_ver.split(' ')[0]+'-'+current_ver.split(' ')[1];
          }
        }
        //Going back to lib dir
        process.chdir(__dirname);
        callback(null, current_ver);
      });
    });
  }
  else{
    current_ver = '0.0.0';
    callback(null, current_ver);
  }
}
