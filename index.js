const express = require('express');
const session = require('express-session')
const passport = require('passport');
var https = require("https");

require("dotenv").config();
// require('./controller/notifcationController')
const imageController = require('./controller/imageController');
const app = express();
const port = process.env.PORT;
const routes = require('./routes/admin');
const userRoutes = require('./routes/user');
const cors = require('cors');
const createNotifications = require('./utils/createNotfication');
// require('./utils/createNotifications')
const multer = require('multer');
app.get('/images/:path?', imageController.index);
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))
// app.use(multer().any())
app.use(passport.initialize());
app.use(passport.session())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use('/auth', routes);
app.use('/api', userRoutes)
app.get('/', (req, res) => {
    res.send('login')
})

const server = https.createServer(app)
app.listen(port, () => {
    console.log("app is running ", port)
})

//server
const io = require('./utils/socket-config').init(server);

io.on("connection", (socket) => {
    console.log("client joined");
    socket.on("danyelle_notifications", (data) => {
        console.log("danyelle notifications :", data);
        io.emit('danyelle_notifications', data)
        createNotifications(io)
    })
    server.listen(6000, () => {
        console.log(
            "\u001b[" + 34 + "m" + `Server started on port: ${6000}` + "\u001b[0m"
        );
    })
})



