const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// השרת שולח את קובץ המשחק המרכזי ישירות למי שנכנס לאתר
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

let players = {};
let turn = null;

io.on('connection', (socket) => {
    // שחקן ראשון מתחבר - מקבל את המיתוג צהובי
    if (Object.keys(players).length === 0) {
        players[socket.id] = { id: socket.id, x: 150, color: '#ffcc00', name: 'צהובי' };
        socket.emit('init', { id: socket.id, side: 'left', players });
    } 
    // שחקן שני מתחבר
    else if (Object.keys(players).length === 1) {
        players[socket.id] = { id: socket.id, x: 650, color: '#ff3333', name: 'שחקן 2' };
        socket.emit('init', { id: socket.id, side: 'right', players });
        turn = Object.keys(players)[0]; 
        io.emit('startGame', { players, turn });
    } else {
        socket.emit('full');
        return;
    }

    socket.on('updateAim', (data) => {
        if (players[socket.id]) {
            io.emit('playerAimed', { id: socket.id, angle: data.angle, power: data.power });
        }
    });

    socket.on('fire', (data) => {
        if (socket.id === turn) {
            io.emit('playerFired', { id: socket.id, vx: data.vx, vy: data.vy });
            const playerIds = Object.keys(players);
            turn = playerIds.find(id => id !== socket.id);
            io.emit('nextTurn', { turn });
        }
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        turn = null;
        io.emit('playerLeft');
    });
});

const PORT = process.env.PORT || 10000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
