const app = require('express')();
const httpServer = require('http').createServer(app);
const options = {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
}
const io = require('socket.io')(httpServer, options);

const PORT = 7000;


const users = {};

httpServer.listen(PORT, () => {
    console.log(`port is listing on ${PORT}`);
});

io.on('connection', (socket) => {
    console.log(`connection established with socket id ${socket.id}`);
    io.emit("all_users", users);
    
    socket.on('disconnect', () => {
        console.log(`${socket.id} got disconnected`);
        for(let user in users) {
            if(users[user] === socket.id) {
                delete users[user];
            }
        }
        io.emit("all_users", users);
    });


    socket.on("new_user", (user) => {
        console.log("new user : "+user);
        users[user] = socket.id;

        io.emit("all_users", users);

    })

    socket.on("send_message", (data) => {
        console.log(data);
        const sockekId = users[data.receiver];
        io.to(sockekId).emit("new_message", data);
    })

});

// app.get('/', (req, res) => {
//     res.status(200).json({"name": "Srikanth"});
// })