# MPV-Remote plugin

This plugin needed for MPV-Remote Android application to work.

## Installation

Required dependencies:

- MPV
- Git
- Node.JS with NPM installed on your PC.
- youtube-dl for playing youtube videos,
- [MPV Remote android application](https://github.com/husudosu/mpv-remote-app/blob/master/android/app/release/app-release.apk)

This plugin & app currently only a development version, so not available on NPM yet.

To install do this:

```bash
npm install -g git+https://github.com/husudosu/mpv-remote-node.git # Linux: use sudo if needed
# Run MPV remote and follow instructions
mpv-remote
```

## How to run MPV

If you don't want MPV close after playback finished use --idle flag

```
mpv --idle
```

## Port

The MPV remote plugin runs on port 8000 by default.

## Supported systems

Tested on Linux, Windows 10

## Limitations

- Currently only one instance of MPV supported,

## TODO

- Put the project into NPM registry,
- Provide easier web port changing method,
- Tidy up the code,
- Better README,
- Make installing way easier, (dunno how right now)
