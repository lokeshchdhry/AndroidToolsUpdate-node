var fs = require('fs');
var path = require('path');

module.exports = function(text){
  var logFilePath = path.join('/Users', process.env.USER, 'androidtoolscheck.log');
  try{
      fs.appendFileSync(logFilePath, text+'\n');
    }
  catch(err){
    console.log(err);
    //exit process in case of error
    process.exit();
  }
};
