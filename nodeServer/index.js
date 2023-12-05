//Node Server which will handle Socket io connections
const express = require("express");
const path = require("path");
const {open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "userData.db" );

const app = express();
app.use(express.json());

let db = null;
const initializeDbServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    
  } catch (e) {
    console.log(`Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbServer();

const io = require('socket.io')(8000, {
    cors: {
      origin: "http://127.0.0.1:5500",
      methods: ["GET", "POST"]
    }
  });

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        console.log("new user", name)
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    socket.on('disconnect', message =>{
        socket.broadcast.emit('left',users[socket.id])
        delete users[socket.id];
    })
})