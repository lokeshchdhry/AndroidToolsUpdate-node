# AndroidToolsUpdate-node

Android tools update checker using node.
This tool will check for the following update avaliability:
1. Android Platform Tools.
2. Android Build Tools.
3. Android SDK Tools.
4. New Android platform.
5. Android NDK.

This node script can run in the background checking android tools update for you every 30 minutes. For this you need to have `forever` installed (`$ [sudo] npm install forever -g`).

### Running node script as a background process.
```javascript
forever start --spinSleepTime 5000 --minUptime 10000 -l <path to forever log> -o <path to forever output log> -a -e <path to forever error log> <path to index.js file in AndroidToolsUpdate-node/lib/index.js>  --killTree true
```

### Listing the node script details.
`forever list`

### Stopping the node script.
`forever stopall`

## License
Copyright (c) 2017 Lokesh Choudhary  
Licensed under the MIT license.
