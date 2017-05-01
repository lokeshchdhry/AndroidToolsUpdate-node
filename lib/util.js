var request = require('request');
var fs = require('fs');
var xml2js = require('xml2js');
var notifier = require('node-notifier');
var log = require('./log');

module.exports = {
  url: 'https://dl.google.com/android/repository/repository2-1.xml',

  dataFile: __dirname+'/xmldata.txt',

  notifier: function(title, message){
    notifier.notify({
      title: title,
      // 'subtitle': void 0,
      message: message,
      sound: false,
      icon: './icons/android.png',
      // open: 'file:///Applications/Android Studio.app',
      wait: true,
      closeLabel: 'Close',
      actions: '',
      timeout: 10
    }, function(error, response) {
      if(error){
        log(error);
      }
    });
  },

  getxmldata: function(filePath, url, callback){
    request(url, function (error, response, body) {
      // util.writeLog('statusCode:', response && response.statusCode);
      if(error){
        log(error);
        //exit process in case of error
          process.exit();
      }
      fs.writeFile(filePath, body, function (err) {
        if (err){
          log(err);
          //exit process in case of error
          process.exit();
        }
        // util.writeLog('Done');
        callback(null, null);
      });
    });
  },

  parsexml: function(filePath, callback){
    var parser = new xml2js.Parser();
    fs.readFile(filePath, function(err, data) {
      parser.parseString(data,function (err, result) {
        if(err){
          process.exit();
        }
        callback(null, result);
      });
    });
  },

  date: function(callback){
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    var currDate = "Date:"+year + "/" + month + "/" + day + " Time:" + hour + ":" + min + ":" + sec;
    callback(currDate);
  }
};
