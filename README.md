# Cupressaceae
Proxy between D-Bus media keys events and WebExtensions NativeMessaging

## Installation
```bash
$ # Ensure that you've already have nodejs >= 10.x installed
$ sudo apt install libdbus-1-dev libglib2.0-dev  # Or alternative for your package manager
$ git clone https://github.com/imcatwhocode/cupressaceae.git
$ cd cupressaceae
```

**Next step is a bit tricky!**
We're using WebExtensions Native Messaging mechanism to run the desktop app and establish a connection between them and browser extension. To allow extension runs the desktop application, we should put the NativeMessaging manifest into specific browsers folders in your system. There are two kinds of these folders:

  1. **Local folder.** This way doesn't require root permissions to register manifest because it writes the manifest file into a local browser folder in the user's home.

  2. **Global folder.** That's no-go without root permissions because in that case, we should put our manifest into the system folder, but it makes our desktop application available for all users.

To perform local manifest folder installation, you should run:
```bash
$ CUPR_TARGET=local sudo npm install -g
```

If `CUPR_TARGET` environmental variable is set to "global" (or not set at all and npm runs with "-g" flag), we will perform global manifest installation:
```bash
$ CUPR_TARGET=global sudo npm install -g --unsafe

# OR #

$ sudo npm install -g --unsafe
```

**Notice** that global installation requires `--unsafe` npm's flag to run post-install script with sudo permissions!

That's all! You can run `cupressaceae` in terminal to ensure that media keys handles correctly.

## Known issues and TODO things
 - [ ] Only one instance at the time catches events correctly
 - [ ] Allow fully local installation (without `npm -g`)
