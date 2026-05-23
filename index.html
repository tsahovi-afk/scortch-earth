const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

let players = {};
let turnOrder = [];
let currentTurnIndex = 0;
let gameInProgress = false;
let maxPlayersConfig = 2;

io.on('connection', (socket) => {
    
    socket.on('joinLobby', (data) => {
        if (gameInProgress) {
            socket.emit('lobbyStatus', { error: 'המשחק כבר בעיצומו!' });
            return;
        }
        
        // שמירת נתוני השחקן שהתחבר מהרשת
        players[socket.id] = {
            id: socket.id,
            name: data.name || 'שחקן רשת',
            color: data.color || '#ffcc00',
            type: data.type || 'medium',
            isAi: false,
            x: 0,
            hp: 100,
            maxHp: 100,
            lives: 3
        };
        
        io.emit('lobbyUpdate', { players: Object.values(players) });
    });

    socket.on('startConfiguredGame', (data) => {
        if (gameInProgress) return;
        
        maxPlayersConfig = parseInt(data.totalPlayers) || 2;
        const aiCount = parseInt(data.aiCount) || 0;
        
        // הגרלת מיקומים על פני המסך (במרווחים שווים)
        let totalSlots = Object.keys(players).length + aiCount;
        let step = 700 / (totalSlots + 1);
        let currentSlot = 1;
        
        // מיקום שחקני אנושיים
        turnOrder = [];
        for (let id in players) {
            players[id].x = Math.floor(50 + currentSlot * step);
            turnOrder.push(id);
            currentSlot++;
        }
        
        // הוספת בוטים של מחשב (AI) ללובי ולסבב התורות
        const aiNames = ['המחסל', 'צייד הבז', 'אלפא-בוט', 'ברזל כבד', 'זיקית רובוטית'];
        const aiColors = ['#ff3333', '#00ff00', '#33ccff', '#ffffff', '#ff00ff'];
        const aiTypes = ['medium', 'heavy', 'light'];
        
        for (let i = 0; i < aiCount; i++) {
            let aiId = 'ai_' + Math.random().toString(36).substr(2, 5);
            players[aiId] = {
                id: aiId,
                name: aiNames[i] || `מחשב ${i+1}`,
                color: aiColors[i] || '#ff3333',
                type: aiTypes[Math.floor(Math.random() * aiTypes.length)],
                isAi: true,
                x: Math.floor(50 + currentSlot * step),
                hp: 100,
                maxHp: 100,
                lives: 3,
                inventory: { 1: Infinity, 2: 2, 3: 1 }
            };
            turnOrder.push(aiId);
            currentSlot++;
        }
        
        gameInProgress = true;
        currentTurnIndex = 0;
        
        io.emit('gameStarted', { 
            players: players, 
            turnOrder: turnOrder, 
            currentTurnId: turnOrder[currentTurnIndex] 
        });
    });

    socket.on('updateAim', (data) => {
        if (players[socket.id]) {
            io.emit('playerAimed', { id: socket.id, angle: data.angle, power: data.power });
        }
    });

    socket.on('fire', (data) => {
        if (turnOrder[currentTurnIndex] === socket.id) {
            if (!data.special) {
                io.emit('playerFired', { id: socket.id, vx: data.vx, vy: data.vy, wType: data.wType });
            }
            nextTurn();
        }
    });

    socket.on('move', (data) => {
        if (players[socket.id] && turnOrder[currentTurnIndex] === socket.id) {
            players[socket.id].x = data.x;
            io.emit('playerMoved', { id: socket.id, x: data.x });
        }
    });

    socket.on('aiFinishedTurn', () => {
        // העברת תור רשמית לאחר שהבוט סיים לירות או לזוז
        if (players[turnOrder[currentTurnIndex]] && players[turnOrder[currentTurnIndex]].isAi) {
            nextTurn();
        }
    });

    function nextTurn() {
        if (turnOrder.length === 0) return;
        
        // מעבר לשחקן הבא שעדיין חי
        let attempts = 0;
        do {
            currentTurnIndex = (currentTurnIndex + 1) % turnOrder.length;
            attempts++;
        } while (players[turnOrder[currentTurnIndex]] && players[turnOrder[currentTurnIndex]].hp <= 0 && pHasLives(turnOrder[currentTurnIndex]) === false && attempts < turnOrder.length);
        
        io.emit('nextTurn', { currentTurnId: turnOrder[currentTurnIndex] });
    }

    function pHasLives(id) {
        return players[id] && players[id].lives > 0;
    }

    socket.on('disconnect', () => {
        if (players[socket.id]) {
            delete players[socket.id];
            turnOrder = turnOrder.filter(id => id !== socket.id);
            if (turnOrder.length <= 1) {
                gameInProgress = false;
                io.emit('playerLeftReset');
            } else {
                io.emit('lobbyUpdate', { players: Object.values(players) });
            }
        }
    });
});

const PORT = process.env.PORT || 10000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
