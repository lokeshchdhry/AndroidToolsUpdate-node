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
    var data = result[1];
    var installed_Ver = result[2];

    getSDKTools(data, function(err, result){
      if(err){
        log(err);
        //exit process in case of error
        process.exit();
      }
      //Flattening results array
      var flat_result  =  _.flatten(result);

      var avaliable_tools_ver = flat_result[0];
      if(compareVersions(installed_Ver, avaliable_tools_ver) === 0){
      log('No new SDK tools update avaliable');
        util.notifier('No Update Avaliable', 'No new SDK tools update avaliable');
        callback(null, null);
      }
      else if(compareVersions(installed_Ver, avaliable_tools_ver) === 1){
        log('No new SDK tools update avaliable');
        util.notifier('No Update Avaliable', 'No new SDK tools update avaliable');
        callback(null, null);
      }
      else if(compareVersions(installed_Ver, avaliable_tools_ver) === -1){
        log('New SDK tools update avaliable :'+avaliable_tools_ver);
        util.notifier('Update Avaliable', 'New SDK tools update avaliable : '+avaliable_tools_ver);
        callback(null, null);
      }
    });
  });
};

function getSDKTools(data, callback){
  var len = (data['sdk:sdk-repository'].remotePackage.length);
  var ver_arr = [];

  for(var i=0; i<=len-1; i++){
    var name = data['sdk:sdk-repository'].remotePackage[i].$.path;
    var channel = data['sdk:sdk-repository'].remotePackage[i].channelRef[0].$.ref;
    var dispName = data['sdk:sdk-repository'].remotePackage[i]['display-name'][0];
    var nodePath = data['sdk:sdk-repository'].remotePackage[i];
    if(name === 'tools' && channel === 'channel-0' && dispName === 'Android SDK Tools'){
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
  var sdktools_path = path.join(android_sdkPath,'/tools');
  //Checking if source.properties file exists
  if(fs.existsSync(sdktools_path+'/source.properties')){
    fs.readFile(sdktools_path+'/source.properties', function(err, result){
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
