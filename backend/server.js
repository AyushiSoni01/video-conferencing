const app = require("./src/app")
const http = require("http")
const { Server } = require("socket.io")
const { initSocket } = require("./src/socket/socket")

// create HTTP server manually
const server = http.createServer(app)

//attach socket.io
const io = new Server(server, {
    cors : {
        origin : "http://localhost:5173"
    }
})

initSocket(io)


server.listen(3000, () => {
    console.log("Server started on port:3000");   
})