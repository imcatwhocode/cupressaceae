const fs = require('fs');
const os = require('os');
const path = require('path');
const packageInfo = require('./package.json');

// Checking target platform
// I know about dbus implementation for macOS but I'm not sure that they are properly working
if (process.platform !== 'linux') throw new Error('This platform is not supported');

// Checking for WebExtension manifest section prescense in the package.json
if (typeof packageInfo.webextManifest !== 'object') throw new Error('Missing or corrupted WebExtension manifest');

// Encode manifest into JSON format
const manifest = JSON.stringify(packageInfo.webextManifest);

// Obtaining WebExtension manifest target (local or global installation)
let webextManifestTarget = '';

// Checking target autodetection override with environment variable
if (typeof process.env.CUPR_TARGET === 'string') {

  // Checking correctness of defined target
  if (process.env.CUPR_TARGET !== 'local' && process.env.CUPR_TARGET !== 'global') throw new Error(`Incorrect target: ${process.env.CUPR_TARGET}`);

  // Apply enforced target
  webextManifestTarget = process.env.CUPR_TARGET;

} else {

  // @TODO Need to test is Yarn also defines npm_config_global environmental variable?
  webextManifestTarget = (typeof process.env.npm_config_global === 'string' && process.env.npm_config_global) ? 'global' : 'local';
  console.log(`Automatically assuming that target is ${webextManifestTarget}. Set the CUPR_TARGET environment variable to override it`);

}

// Detect available browsers
const manifestLocations = {

  firefox: {

    global: '/usr/lib/mozilla/native-messaging-hosts',
    local: path.resolve(os.homedir(), '.mozilla/native-messaging-hosts')

  },

  chrome: {

    global: '/etc/opt/chrome/native-messaging-hosts',
    local: path.resolve(os.homedir(), '.config/google-chrome/NativeMessagingHosts')

  }

};

// Filter only available browsers
Object
  .keys(manifestLocations)
  .filter(browser => fs.existsSync(manifestLocations[browser][webextManifestTarget]))
  .forEach(browser => {

    // Trying to install manifest
    fs.writeFileSync(path.resolve(manifestLocations[browser][webextManifestTarget], 'cupressaceae.json'), manifest);

    // Log action
    console.log(` => Installed ${webextManifestTarget} manifest for ${browser}`);

  });
