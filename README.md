MPV remote control API. You can use [MPV Remote android application](https://github.com/husudosu/mpv-remote-app/blob/master/android/app/release/app-release.apk) or you can create your own frontend.

API documentation accessible here.

# Installation

### Requirements:

- Node.JS (use 13.14.0 LTS for Windows 7)
- yt-dlp or youtube-dl for playing youtube videos,

### Note about youtube-dl

youtube-dl buffers too much for me (Windows 10 & 11), so I've changed to yt-dlp and no issues at all.

### Install package

```bash
sudo apt install npm # Only on linux if using Windows install Node.JS
npm install -g npm-package url
mpv-remote # Follow instructions
```

# How to run MPV

If you don't want MPV close after playback finished use --idle flag or you can add `idle=yes` to your mpv.conf.

```
mpv --idle
```

# Configuration variables

You can configure server by using `--script-opts` flag of MPV like this (options seperated by ,):

```
mpv --script-opts=mpvremote-filebrowserpaths=/home/sudosu,mpvremote-uselocaldb=0
```

Or you can use a script-opts file.

scipt-opts location for mpvremote:

```bash
%appdata%/mpv/script-opts/mpvremote.conf # For windows
~/.config/mpv/script-opts/mpvremote.conf # For linux
```

If using script-opts file, you don't need `mpvremote-` prefix at configuration options.

[More info about script-opts files.](https://mpv.io/manual/master/#configuration)

Example configuration file:

```
# ~/.config/mpv/script-opts/mpvremote.conf
uselocaldb=1
webport=8000
unsafefilebrowsing=1
filebrowserpaths="'/home/usr/Steins;Gate';'/home/usr/media2'"
```

## Available options:

| Option name                  | Description                                                                                                                                                                                                                           | Default value       | Available options/example                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | -------------------------------------------- |
| mpvremote-uselocaldb         | Use local database to store media statuses and collections.                                                                                                                                                                           | 1                   | 0 - Disabled <br /> 1 - Enabled              |
| mpvremote-filebrowserpaths   | Stores paths which can be browsable by users it's a semicolon seperated list                                                                                                                                                          | N/A                 | "'/home/usr/Steins;Gate';'/home/usr/media2'" |
| mpvremote-webport            | Port of MPV backend engine                                                                                                                                                                                                            | 8000                | Any port within correct range                |
| mpvreomte-address            | Server address                                                                                                                                                                                                                        | Your first local IP | 127.0.0.1                                    |
| mpvremote-unsafefilebrowsing | Allows you to browse your local filesystem. Be careful though, exposing your whole filesystem not the safest option. For security reasons filebrowser only send results of media files, playlists, subtitle files and subdirectories. | 1                   | 0 - Disabled<br/> 1 - Enabled                |

# Troubleshooting

If the server not starts, try run it manually, to get the exception (From terminal/command prompt):

```bash
node ~/.config/mpv/scripts/mpvremote/remoteServer.js # On linux systems
node %APPDATA%/mpv/scripts/mpvremote/remoteServer.js # On Windows from command prompt.
```

If you report server non starting issue copy the output of this command.

If you get "No socket provided" output the server works fine, so there's something up with the plugin or MPV itself.

## Youtube playback issues

I recommend using [yt-dlp](https://github.com/yt-dlp/yt-dlp) for playing Youtube videos, but if you use youtube-dl:

- If you can't play Youtube videos then try to update the **youtube-dl** package (as admin): `pip3 install --upgrade youtube-dl`

## Common issues on Linux

yargs requires 12 or newer version of Node.JS so you should update your Node.JS version. For example this error occours on Ubuntu 20.04.3 LTS.

- [How to update Node.JS](https://askubuntu.com/questions/426750/how-can-i-update-my-nodejs-to-the-latest-version)
- [If still not works, try update MPV to newer version](https://linuxhint.com/install-mpv-video-player-linux/)

# Limitations

- Currently only one instance of MPV supported
