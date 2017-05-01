/*
 * AndroidToolsUpdate-node
 * https://github.com/lokeshchdhry/AndroidToolsUpdate-node
 *
 * Copyright (c) 2017 Lokesh Choudhary
 * Licensed under the MIT license.
 */
//  var forever = require('forever-monitor');
//
//  var child = new (forever.Monitor)('index.js', {
//    max: 10,
//    silent: true,
//    killTree: true,
//    sourceDir: '/Users/lchoudhary/Desktop/repositories/AndroidToolsUpdate-node/lib/', // Directory that the source script is in
//    logFile: '/Users/lchoudhary/Desktop/foreverlogs/forever.log', // Path to log output from forever process (when daemonized)
//    outFile: '/Users/lchoudhary/Desktop/foreverlogs/out.log ', // Path to log output from child stdout
//    errFile: '/Users/lchoudhary/Desktop/foreverlogs/err.log' // Path to log output from child stderr
//  });
//
// child.start();
//
// child.on('exit', function () {
//  console.log('your-filename.js has exited after 10 restarts');
// });
//
//
//
// child.on('watch:restart', function(info) {
//    console.error('Restaring script because ' + info.file + ' changed');
// });
//
// child.on('restart', function() {
//    console.error('Forever restarting script for ' + child.times + ' time');
// });
//
// child.on('exit:code', function(code) {
//    console.error('Forever detected script exited with code ' + code);
// });
