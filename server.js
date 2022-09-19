require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}

let DB_URI = "mongodb+srv://learnmaina:ZNYNgrYVtkph1Wgq@cluster0.qzknohd.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(DB_URI, {
    useUnifiedTopology: true,
    useNewURLParser: true,
}).then(() => console.log("Connected to DB"))
    .catch((e) => console.log(e.message))

const authRouter = require("./routes/auth");
const templateRouter = require('./routes/template');
const reportRouter = require('./routes/report');
const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.static('public'))

app.use('/auth', authRouter);
app.use(authenticateRequest);

app.use('/template', templateRouter);
app.use('/report', reportRouter);
const httpServer = app.listen(8000 || process.env.PORT, () => {
    console.log("Server running")
});

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log("Client Connected", socket.id);

    socket.on('join-room', room => {
        socket.join(parseInt(room));
    })
    socket.on('create-room', room => {
        socket.join(room)
        socket.emit('room-code', room)
    })
    socket.on('send-name', (student, room) => {
        socket.broadcast.emit('name', student, room);
    })
    socket.on('navigate', (pin) => {
        io.to(pin).emit('start-game');
    })
    socket.on('send-question', (questions, room) => {
        io.to(room).emit('questions', questions);
    })
    socket.on('change-question', (room) => {
        io.to(room).emit('next-question')
    })
    socket.on('send-score', (room, choiceno, questionno, student, value) => {
        io.to(room).emit('score', choiceno, questionno, student, value)
    })
    socket.on('status-page',(room)=>{
        io.to(room).emit('see-status');
    })
    socket.on('send-winner-details', (room,data,winner)=>{
        io.to(room).emit('winner-details',data,winner);
    })
    socket.on('disconnect', () => console.log("Client disconnected"));
})

function authenticateRequest(req, res, next) {
    const headerInfo = req.headers['authorization'];

    if (headerInfo === undefined) {
        return res.status(401).send('No token provided')
    }
    const token = headerInfo.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userInfo = payload;
        next()
    }
    catch (e) {
        res.status(401).send("Invalid token provided");
    }
}