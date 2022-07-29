const io = require('./socket-config').init();
const { notifications } = require('../models');
const socket = require('socket.io');
const { apiSuccess } = require('../helpers/apiHelpers');

const createNotifications = async (data) => {

    try {
        let { title, body, notfiable_id, notifiable_type, name, name_id } = data;
        let notifyMe = await notifications.create(
            {
                title: title,
                notfiable_id: notfiable_id,
                body: body,
                notifiable_type: notifiable_type,
                name: name,
                name_id: name_id

            })
    let noti = io.on("connection", (socket) => {
            console.log("client joined");
            socket.on("danyelle_notifications", (data) => {
                console.log("danyelle notifications :", data);
                io.emit('danyelle_notifications', data)
            })
        })
        // console.log(notifiable_type, noti)

    } catch (error) {
        console.log(error)
    }
}

module.exports = createNotifications