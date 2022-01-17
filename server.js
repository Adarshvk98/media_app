const app = require('./src/app');
const moment = require('moment');
const http = require('http').createServer(app);

const port = process.env.PORT || 3000;

const server = http.listen(port, () => {
    console.log('Express server listening on port ' + port);
});

const io = require('socket.io').listen(server);

app.locals.io = io;
//Whenever someone connects this gets executed
io.on('connection', (socket) => {

    console.log('A user connected');

    let list = io.sockets.sockets;
    let users = Object.keys(list);


    // Set the nickname property for a given client
    socket.on('nick', (nick) => {
        socket.set('nickname', nick);
        socket.emit('userlist', users);
    });


    // Relay chat data to all clients
    socket.on('chat', (data) => {
        socket.get('nickname', (err, nick) => {

            let payload = {
                message: data.message,
                nick: (err || nick === null) ? 'Anonymous' : nick,
                time: moment(new Date()).format("hh:mm a")
            };

            socket.emit('chat', payload);
            socket.broadcast.emit('chat', payload);
        });
    });

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});