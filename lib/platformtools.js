var fs = require('fs');
var Async = require('async');
var path = require('path');
var compareVersions = require('compare-versions');
var util = require('./util');
var log = require('./log');
var _ = require('underscore');

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
    var task1 = [];
    var data = result[1];
    var installed_Ver = result[2];
    task1.push(function(callback){getRCPlatformTools(data, callback);});
    task1.push(function(callback){getPlatformTools(data, callback);});

    Async.series(task1, function(err, result){
      if(err){
        log(err);
        //exit process in case of error
        process.exit();
      }
      //Flattening results array
      var flat_result  =  _.flatten(result);
      var avaliable_rc_platTools = flat_result[0];
      var avaliable_platTools = flat_result[1];

      if(compareVersions(installed_Ver, avaliable_rc_platTools) === 0 && compareVersions(installed_Ver, avaliable_platTools) === -1){
          log('New platform tools update avaliable :'+avaliable_platTools);
          util.notifier('Update avaliable', 'New platform tools update avaliable :'+avaliable_platTools);
          callback(null, null);
        }
        else if(compareVersions(installed_Ver, avaliable_rc_platTools) === 0 && compareVersions(installed_Ver, avaliable_platTools) === 1){
          log('No new platform tools update avaliable');
          util.notifier('No Update', 'No new platform tools update avaliable');
          callback(null, null);
        }
        else if(compareVersions(installed_Ver, avaliable_rc_platTools) === -1 && compareVersions(installed_Ver, avaliable_platTools) === 0){
          log('New RC platform tools avaliable :'+avaliable_rc_platTools);
          util.notifier('Update avaliable', 'New RC platform tools update avaliable :'+avaliable_rc_platTools);
          callback(null, null);
        }
        else if(compareVersions(installed_Ver, avaliable_rc_platTools) === 1 && compareVersions(installed_Ver, avaliable_platTools) === 0){
          log('No new platform tools update avaliable.');
          util.notifier('No Update', 'No new platform tools update avaliable');
          callback(null, null);
        }
        else if(compareVersions(installed_Ver, avaliable_rc_platTools) === -1 && compareVersions(installed_Ver, avaliable_platTools) === -1){
          log('New RC platform tools avaliable :'+avaliable_rc_platTools);
          util.notifier('Update avaliable', 'New RC platform tools update avaliable :'+avaliable_rc_platTools);
          callback(null, null);
        }
        else if(compareVersions(installed_Ver, avaliable_rc_platTools) === 1 && compareVersions(installed_Ver, avaliable_platTools) === -1){
          log('New platform tools update avaliable :'+avaliable_platTools);
          util.notifier('Update avaliable', 'New platform tools update avaliable :'+avaliable_platTools);
          callback(null, null);
        }
        else if(compareVersions(installed_Ver, avaliable_rc_platTools) === -1 && compareVersions(installed_Ver, avaliable_platTools) === 1){
          log('New RC platform tools update avaliable :'+avaliable_rc_platTools);
          util.notifier('Update avaliable', 'New RC platform tools update avaliable :'+avaliable_rc_platTools);
          callback(null, null);
        }
        else{
          log('Code seems to return wrong data. Please check.');
          util.notifier('Wrong data', 'Code seems to return wrong data. Please check.');
          callback(null, null);
        }
    });
  });
};

function getRCPlatformTools(data, callback){
  var len = (data['sdk:sdk-repository'].remotePackage.length);
  var ver_arr = [];

  for(var i=0; i<=len-1; i++){
    var name = data['sdk:sdk-repository'].remotePackage[i].$.path;
    var channel = data['sdk:sdk-repository'].remotePackage[i].channelRef[0].$.ref;
    var nodePath = data['sdk:sdk-repository'].remotePackage[i];
    if(name === 'platform-tools' && channel === 'channel-2'){
      var major = nodePath.revision[0].major[0];
      var minor = nodePath.revision[0].minor[0];
      var micro = nodePath.revision[0].micro[0];
      var preview = nodePath.revision[0].preview[0];
      var string = major+'.'+minor+'.'+micro+'-rc'+preview;
      ver_arr.push(string);
    }
    // else{
    //   ver_arr = [];
    // }
  }
  callback(null, ver_arr);
}

function getPlatformTools(data, callback){
  var len = (data['sdk:sdk-repository'].remotePackage.length);
  var ver_arr = [];

  for(var i=0; i<=len-1; i++){
    var name = data['sdk:sdk-repository'].remotePackage[i].$.path;
    var channel = data['sdk:sdk-repository'].remotePackage[i].channelRef[0].$.ref;
    var nodePath = data['sdk:sdk-repository'].remotePackage[i];
    if(name === 'platform-tools' && channel === 'channel-0'){
      var major = nodePath.revision[0].major[0];
      var minor = nodePath.revision[0].minor[0];
      var micro = nodePath.revision[0].micro[0];
      var string = major+'.'+minor+'.'+micro;
      ver_arr.push(string);
    }
  }
  callback(null, ver_arr);
}

function getcurrent_ver(callback){
  var current_ver;
  var android_sdkPath = process.env.ANDROID_SDK;
  var platformtools_path = path.join(android_sdkPath,'/platform-tools');
  //Checking if source.properties file exists
  if(fs.existsSync(platformtools_path+'/source.properties')){
    fs.readFile(platformtools_path+'/source.properties', function(err, result){
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
      callback(null, current_ver);
    });
  }
  else{
    current_ver = '0.0.0';
    callback(null, current_ver);
  }
}
