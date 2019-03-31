#!/usr/bin/env node

/**
 * D-Bus media keys to Natvie messaging proxy
 * @author Dmitry Pepperstein (@imcatwhocode) <imcatwhocode@gmail.com>
 * Thanks Simeon Velichkov (@simov on Github) for the implementation of Native Messaging encoding / decoding functions
 */

// Connects to the session bus
const dbusSession = require('dbus').getBus('session');

// Connect to DBug interface responsible for media keys handling
dbusSession.getInterface(

  'org.gnome.SettingsDaemon',
  '/org/gnome/SettingsDaemon/MediaKeys',
  'org.gnome.SettingsDaemon.MediaKeys',
  (err, iface) => {

    // Catch
    if (err) throw new Error(err);

    // Proxying media keys events
    iface.on('MediaPlayerKeyPressed', (eventCount, eventName) => {

      // Building payload, encoding it into Native Messaging format and putting into stdout
      const payload = Buffer.from(JSON.stringify({channel: 'playback-control', event: eventName}));
      const header = Buffer.alloc(4);
      header.writeUInt32LE(payload.length, 0);
      process.stdout.write(Buffer.concat([header, payload]));

    });

    /* eslint new-cap: 0 */
    iface.GrabMediaPlayerKeys(0, 'org.gnome.SettingsDaemon.MediaKeys');

  }

);
