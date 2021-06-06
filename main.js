const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});
const SERVER_PORT = 8000

// where you import your packages
const mpvAPI = require("node-mpv");
// where you want to initialise the API

// binary: "C:\\Users\\SudoSu\\Downloads\\mpv-x86_64-20210523-git-6c1dd02\\mpv.exe" for windows 10 test
const mpv = new mpvAPI({
    socket: "/tmp/mpv",
    verbose: false
});

// somewhere within an async context
// starts MPV
async function start(){
    try {
        await mpv.start();
        // loads a file
        // await mpv.load("/home/sudosu/test.webm");
        // file is playing
        // sets volume to 70%
        await mpv.volume(70);
        } catch (error) {
        // handle errors here
        console.log(error);
    }
}

mpv.on("status", async (status) => {
    console.log(status)
    switch (status.property){
        case 'pause':
            await mpv.command("show-text", [status.value ? 'Pause' : 'Play'])
            io.emit("pause", status.value);
            break;
    }
});

mpv.on("stopped", async() => {
    io.emit("stopped")
})

mpv.on("seek", async (data) => {
    // FIXME: Probably not the best solution
    console.log(data)
    await mpv.command("show-text", [`Seek: ${formatTime(data.end)}`])
    io.emit("playbackTimeResponse", {
        playback_time: formatTime(data.end),
        percent_pos: Math.ceil(await mpv.getProperty("percent-pos"))
    });
})


function formatTime(param){
    var sec_num = parseInt(param);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

async function get_mpv_props(){
    let props = {
        filename: null,
        duration: '00:00:00',
        playback_time: '00:00:00',
        percent_pos: 0,
        media_title: null,
    }

    try {
        props.pause = await mpv.getProperty("pause");
        props.volume = await mpv.getProperty("volume");

        // File related data, only send back if available.
        props.filename = await mpv.getProperty("filename");
        props.duration = formatTime(await mpv.getProperty("duration")) || '00:00:00';
        props.playback_time = formatTime(await mpv.getProperty("playback-time")) || '00:00:00';
        props.percent_pos = Math.ceil(await mpv.getProperty("percent-pos")) || 0;
        props.media_title = await mpv.getProperty("media-title");
    } catch (exc) {
        console.log("No playback.")
    }

    return props
}

/*
TODO List:
- Exception handling (maybe send to frontned too.)
*/
io.on("connection", (socket) => {
    console.log("User connected");
    // TODO: Create a method for this!
    
    get_mpv_props().then((resp) => {
        socket.emit("playerData", resp)
    })
    // Send duration for new connections.
    socket.on("playbackTime", async function (data) {
        console.log("Playback time requested.")
        const playbackTime = await mpv.getProperty("playback-time")
        const percentPos = Math.ceil(await mpv.getProperty("percent-pos"))
        socket.emit("playbackTimeResponse", {playback_time: formatTime(playbackTime), percent_pos: percentPos});
    });

    socket.on("set_player_prop", async function (data){
        try {
            console.log(`Set ${data[0]} to ${data[1]}`)
            await mpv.setProperty(data[0], data[1])
        }
        catch(exc){
            console.log(exc)
        }
    });
    socket.on("openFile", async function(data) {
        await mpv.load(data)
        socket.emit('playerData', await get_mpv_props())
    })

    socket.on("stopPlayback", async function(data) {
        await mpv.stop()
        socket.emit("playerData", await get_mpv_props());
    })

    socket.on("seek", async function(data) {
        try{
            console.log(`User seek ${data}`)
            await mpv.command("seek", [data, "absolute-percent"]);
        }
        catch(exc){
            console.log(exc)
        }
    })
});


server.listen(SERVER_PORT, () => {
    console.log(`listening on *:${SERVER_PORT}`);
});


start()