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
let serverTurnTimeout = null; // טיימר גיבוי קשיח ברמת השרת

io.on('connection', (socket) => {
    
    socket.on('joinLobby', (data) => {
        if (gameInProgress) {
            socket.emit('lobbyStatus', { error: 'המשחק כבר בעיצומו!' });
            return;
        }
        
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
        
        io.emit('lobbyUpdate', { players: Object.values(players).filter(p => !p.isAi) });
    });

    socket.on('startConfiguredGame', (data) => {
        for (let id in players) {
            if (players[id].isAi) delete players[id];
        }

        const totalSlotsRequested = parseInt(data.totalPlayers) || 2;
        const aiCountRequested = parseInt(data.aiCount) || 1;
        
        const humanIds = Object.keys(players).filter(id => !players[id].isAi);
        turnOrder = [...humanIds];
        
        const aiNames = ['המחשל', 'צייד הבז', 'אלפא-בוט', 'ברזל כבד', 'זיקית רובוטית'];
        const aiColors = ['#ff3333', '#00ff00', '#33ccff', '#ffffff', '#ff00ff'];
        const aiTypes = ['medium', 'heavy', 'light'];
        
        for (let i = 0; i < aiCountRequested; i++) {
            let aiId = 'ai_' + Math.random().toString(36).substr(2, 5);
            players[aiId] = {
                id: aiId,
                name: aiNames[i] || `מחשב ${i+1}`,
                color: aiColors[i] || '#ff3333',
                type: aiTypes[Math.floor(Math.random() * aiTypes.length)],
                isAi: true,
                x: 0,
                hp: 100,
                maxHp: 100,
                lives: 3
            };
            turnOrder.push(aiId);
        }
        
        let totalActive = turnOrder.length;
        let step = 700 / (totalActive + 1);
        
        turnOrder.forEach((id, index) => {
            players[id].x = Math.floor(50 + (index + 1) * step);
            let tType = players[id].type || 'medium';
            if (tType === 'heavy') { players[id].hp = 150; players[id].maxHp = 150; }
            if (tType === 'light') { players[id].hp = 75; players[id].maxHp = 75; }
        });
        
        gameInProgress = true;
        currentTurnIndex = 0;
        
        io.emit('gameStarted', { 
            players: players, 
            turnOrder: turnOrder, 
            currentTurnId: turnOrder[currentTurnIndex] 
        });

        startServerTimeout(); // הפעלת שעון השומר הפנימי של השרת
    });

    socket.on('updateAim', (data) => {
        if (players[socket.id]) {
            io.emit('playerAimed', { id: socket.id, angle: data.angle, power: data.power });
        }
    });

    socket.on('fire', (data) => {
        if (turnOrder[currentTurnIndex] === socket.id) {
            io.emit('playerFired', { id: socket.id, vx: data.vx, vy: data.vy, wType: data.wType });
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
        if (players[turnOrder[currentTurnIndex]] && players[turnOrder[currentTurnIndex]].isAi) {
            nextTurn();
        }
    });

    // פונקציית העברת תור אטומה
    function nextTurn() {
        clearTimeout(serverTurnTimeout); // איפוס השומר הישן
        if (turnOrder.length === 0) return;
        
        let attempts = 0;
        let foundNext = false;
        
        while (attempts < turnOrder.length) {
            currentTurnIndex = (currentTurnIndex + 1) % turnOrder.length;
            let nextId = turnOrder[currentTurnIndex];
            
            if (players[nextId] && (players[nextId].hp > 0 || players[nextId].lives > 0)) {
                foundNext = true;
                break;
            }
            attempts++;
        }
        
        io.emit('nextTurn', { currentTurnId: turnOrder[currentTurnIndex] });
        startServerTimeout(); // הפעלת שומר חדש לתור הבא
    }

    // שומר הסף הקשוח של השרת - אם עברו 13 שניות ושום דבר לא קרה, הוא מעביר תור בכוח
    function startServerTimeout() {
        clearTimeout(serverTurnTimeout);
        serverTurnTimeout = setTimeout(() => {
            if (!gameInProgress) return;
            console.log("סעיף הגנה אקטיבי: תור נתקע, השרת מעביר תור באופן יזום!");
            nextTurn();
        }, 13000); // 13 שניות (נותן עוד 3 שניות ביטחון מעבר לטיימר של המסך)
    }

    socket.on('disconnect', () => {
        if (players[socket.id]) {
            delete players[socket.id];
            turnOrder = turnOrder.filter(id => id !== socket.id);
            if (turnOrder.filter(id => !players[id].isAi).length === 0) {
                gameInProgress = false;
                clearTimeout(serverTurnTimeout);
                players = {};
                turnOrder = [];
            }
            io.emit('lobbyUpdate', { players: Object.values(players).filter(p => !p.isAi) });
        }
    });
});

const PORT = process.env.PORT || 10000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
