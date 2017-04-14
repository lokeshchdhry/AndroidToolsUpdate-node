var fs = require('fs');
var xml2js = require('xml2js');
var request = require('request');
var Async = require('async');

module.exports = function(){
  var url = 'https://dl.google.com/android/repository/repository2-1.xml';
  var dataFile = './xmldata.txt';

  var task = [];
  task.push(function(callback){getxmldata(dataFile, url, callback);});
  task.push(function(callback){parseXml(dataFile, callback);});
  // task.push(function(callback){getPlatformTools(callback);});

  Async.series(task, function(err, result){
    getPlatformTools(result[1]);
  });
};

function getxmldata(filePath, url, callback){
  request(url, function (error, response, body) {
    // console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    // console.log('body:', body);
    if(error){
      console.log(error);
      //exit process in case of error
        process.exit();
    }
    fs.writeFile(filePath, body, function (err) {
      if (err){
        console.log(err);
        //exit process in case of error
        process.exit();
      }
      console.log('Done');
      callback(null, null);
    });
  });
}

function parseXml(filePath, callback){
  var parser = new xml2js.Parser();
  fs.readFile(filePath, function(err, data) {
    parser.parseString(data,function (err, result) {
      if(err){
        process.exit();
      }
      callback(null, result);
    });
  });
}

function getPlatformTools(data){
  var len = (data['sdk:sdk-repository'].remotePackage.length);
  var ver_arr = [];

  for(var i=0; i<=len-1; i++){
    var name = data['sdk:sdk-repository'].remotePackage[i].$.path;
    var nodePath = data['sdk:sdk-repository'].remotePackage[i];
    if(name === 'platform-tools'){
      var string = nodePath.archives[0].archive[0].complete[0].url[0].substring(16,22);
      var patt1 = /rc/g;
      if(patt1.test(nodePath.archives[0].archive[0].complete[0].url[0])){
        string = nodePath.archives[0].archive[0].complete[0].url[0].substring(16,22)+'rc'+nodePath.revision[0].preview[0];
      }
      ver_arr.push(string);
    }
  }
  console.log(ver_arr.sort().reverse());
}
