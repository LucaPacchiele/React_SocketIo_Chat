const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./script");

const app = express();
app.use(index);

const server = http.createServer(app);
//5347
const io = socketIo(server, {
    cors: true,
    origins: ["http://127.0.0.1:3000"],
}
);

// const moment = require('moment'); // require
// moment().format(); 


const utentiLoggati = [
    //{ userName: "pippo", socketId: "0bm0fpa00001", online: true },
    //   { userName: "mario", socketId: "00msy0r000y2", online:true },
    //   { userName: "asd", socketId: "a0000B0myr03", online:true }
];


const signin = (name) => {
    const currUserIndex = utentiLoggati.findIndex((el) => el.userName === name)
    if (currUserIndex > -1) {
        utentiLoggati.splice(currUserIndex, 1)
        return true
    }
    return false
}

const signout = (name) => {
    let currUserIndex = utentiLoggati.findIndex((el) => el.userName === name)
    if (currUserIndex > -1) {
        utentiLoggati.splice(currUserIndex, 1)
        return true
    }
    return false
}


setInterval(async () => {
    console.log(" #U: ", utentiLoggati.length, "#S: ", io.of("/").sockets.size, "\n", utentiLoggati, "\n_______________")
    if (utentiLoggati.length !== io.of("/").sockets.size)
        console.log("  !!!  UTENTI  !=  SOCKET  !!!", utentiLoggati.length, io.of("/").sockets.size)
    // Socket aperte
    // const ids = await io.of("/").allSockets();
    // console.log(ids)

    // const allSockets = Array.from(ids)
    // allSockets.map((el, i) => {
    //     console.log(i, " -> ", el)
    // })
}, 3000);

io.on("connection", (socket) => {
    console.log("New client connected on ", socket.id);

    // socket.emit("welcome", (res) => console.log(res));

    //console.log(Array.from(io.sockets.adapter.rooms))
    //console.log("Untenti online: ", utentiLoggati.length, "\n", utentiLoggati, "\n_______________", "socket aperte: ", io.of("/").sockets.size)


    socket.on("signin", (user, callback) => {
        const { name, id, socketId } = user

        if (signin(name)) {
            console.log(name, " already logged, update socket: ", socket.id);
            callback({
                status: `${name} login ALREADY`
            })
        }
        else {
            console.log(name, " joined on ", socket.id);
            callback({
                status: `${name} login OK.`
            })
        }
        const currUser = {
            userName: name,
            socketId
        }
        utentiLoggati.push(currUser);
    });

    // database utenti e settaggio se online o offline

    socket.on("signout", (user, callback) => {
        const { name, socketId } = user

        if (signout(name)) {
            console.log(name, "signout OK")
            socket.broadcast.emit("client_logout", name);

            callback({
                status: `${name} signout OK`
            })
        }
        else {
            callback({
                status: `${name} signout ERROR`
            })
        }
    });
    

    socket.on("getOnlineUsers", (name, callback) => {
        let data = []
        data = utentiLoggati.filter((el) => {
            return el.userName !== name
        })
        // console.log(" --> getOnlineUsers from ", socket.id, "data length: ", data.length)
        callback({
            data: JSON.stringify(data)
        })
    })

    socket.on('msgAllReadOut', ({ fromUser, withUser }) => {
        const recipientIndex = utentiLoggati.findIndex((el) => el.userName === withUser)
        if (recipientIndex > -1) {
            console.log("ho letto tutti i messaggi di di", utentiLoggati[recipientIndex].userName)
            socket.to(utentiLoggati[recipientIndex].socketId).emit("msgAllReadIn", { fromUser, withUser });
        }
    })

    // socket.on('msgReadOut', (msg) => {
    //     const { from, to, body, time } = msg
    //     const recipientIndex = utentiLoggati.findIndex((el) => {
    //         return el.userName === from
    //     })
    //     if (recipientIndex > -1) {
    //         console.log("notifica lettura di", body," a ", utentiLoggati[recipientIndex].userName)
    //         socket.to(utentiLoggati[recipientIndex].socketId).emit("msgReadIn", msg);
    //     }
    // })


    socket.on('msgOut', (msg) => {
        const { from, to, body, time } = msg
        const recipientIndex = utentiLoggati.findIndex((el) => {
            return el.userName === to
        })
        if (recipientIndex > -1) {
            console.log("inoltro msg a ", utentiLoggati[recipientIndex].userName)
            socket.to(utentiLoggati[recipientIndex].socketId).emit("msgIn", msg);
        }
        console.log("messaggio inviato a ", utentiLoggati[recipientIndex].socketId)
    })



    // io client disconnect
    socket.on('disconnect', (reason) => {
        console.log("Client disconnected ", socket.id, " Reason: ", reason)
        if (reason === 'transport close') {
            
            let currUserIndex = utentiLoggati.findIndex((el) => {
                return el.socketId === socket.id
            })

            if (currUserIndex > -1) {
                let currUsername = utentiLoggati[currUserIndex].userName
                console.log(currUsername, " left");

                //eliminazione user dall'array e comunicazione a tutti i client
                socket.broadcast.emit("client_logout", currUsername);
                utentiLoggati.splice(currUserIndex, 1)
            }
        }

        socket.disconnect()

    });



});




server.listen(port, () => console.log(`Listening on port ${port}`));