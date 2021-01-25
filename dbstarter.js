// Заполнение таблицы залами

var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Room = require('./models/room');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var rooms = []

function roomCreate(name, capacity, cb) {
    roomdetail = {name: name, capacity: capacity};

    var room = new Room(roomdetail);

    room.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New room' + room);
        rooms.push(room);
        cb(null, room);
    })
}

function createRooms(cb) {
    async.series([
        function (callback) {
            roomCreate('Малый зал', 100, callback);
        },
        function (callback) {
            roomCreate('Средний зал', 300, callback);
        },
        function (callback) {
            roomCreate('Большой зал', 500, callback);
        }
    ],
    cb)
}

async.series([createRooms],
    function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log('no err');
        }
        mongoose.connection.close()
    })