<!DOCTYPE html>
<html lang="he">
<head>
    <meta charset="UTF-8">
    <title>אדמה חרוכה - תנועה טקטית, בחירת טנקים וסאונד</title>
    <style>
        body { margin: 0; background-color: #111; color: #fff; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; }
        canvas { border: 2px solid #ffcc00; background-color: #050510; display: none; }
        #status { margin-top: 10px; font-size: 18px; font-weight: bold; color: #ffcc00; display: none; }
        #controls-info { margin-top: 5px; font-size: 14px; color:#aaa; display: none; text-align: center; line-height: 1.5; }
        
        .panel { background-color: #222; padding: 30px; border: 2px solid #ffcc00; border-radius: 10px; text-align: center; max-width: 500px; }
        button { background-color: #ffcc00; color: #000; border: none; padding: 12px 25px; font-size: 16px; font-weight: bold; margin: 10px; cursor: pointer; border-radius: 5px; transition: 0.2s; }
        button:hover { background-color: #ffee55; transform: scale(1.05); }
        
        #tank-select { display: none; }
        .tank-option { background: #333; border: 1px solid #555; padding: 15px; margin: 10px 0; border-radius: 5px; cursor: pointer; transition: 0.2s; text-align: right; }
        .tank-option:hover { border-color: #ffcc00; background: #3c3c3c; }
        .tank-name { font-size: 18px; font-weight: bold; color: #ffcc00; margin-bottom: 5px; }
    </style>
    <script src="/socket.io/socket.io.js"></script>
</head>
<body>

    <!-- תפריט ראשי -->
    <div id="menu" class="panel">
        <h2>אדמה חרוכה - בחר מצב משחק</h2>
        <button onclick="openTankSelection()">🤖 משחק נגד המחשב</button>
        <button onclick="startOnlineGame()">🌐 משחק אונליין נגד חבר</button>
    </div>

    <!-- תפריט בחירת טנקים -->
    <div id="tank-select" class="panel">
        <h2>בחר את דגם הטנק שלך</h2>
        
        <div class="tank-option" onclick="selectTank('medium')">
            <div class="tank-name">🚀 טנק צייד (Medium)</div>
            <div>מאוזן לכל משימה. חיים: 100% | גודל: בינוני</div>
        </div>
        
        <div class="tank-option" onclick="selectTank('heavy')">
            <div class="tank-name">🐘 טנק ממותה (Heavy)</div>
            <div>משוריין וכבד. חיים: 150% (150 HP) | גודל: רחב וחשוף</div>
        </div>
        
        <div class="tank-option" onclick="selectTank('light')">
            <div class="tank-name">⚡ טנק זיקית (Light)</div>
            <div>קטן וחמקמק. חיים: 75% (75 HP) | גודל: צר וקשה לפגיעה</div>
        </div>
    </div>

    <h2 id="gameTitle" style="display:none;">אדמה חרוכה</h2>
    <canvas id="gameCanvas" width="800" height="500"></canvas>
    <div id="status">טוען...</div>
    <div id="controls-info">
        חצים: כיוון ועוצמה | רווח: אש<br>
        <strong>🚙 תנועה טקטית:</strong> Shift + חץ ימינה/שמאלה (עד 5 צעדים בתור, זזת - התור עובר!)
    </div>

<script>
let socket;
let isAiMode = false;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusDiv = document.getElementById('status');

let myId = 'local_player';
let gameActive = false;
let currentTurnId = null;
let gamePlayers = {};
let projectile = null;
const gravity = 0.15;

let aiLastSpecs = { angle: 135, power: 60 };
let aiLastXLand = null;
let playerMovesLeft = 5; // מונה צעדים לתור הנוכחי

const TANK_TYPES = {
    medium: { width: 24, height: 12, maxHp: 100 },
    heavy: { width: 34, height: 16, maxHp: 150 },
    light: { width: 16, height: 8, maxHp: 75 }
};

const terrain = [];
for (let x = 0; x < canvas.width; x++) {
    terrain[x] = 400 + Math.sin(x * 0.01) * 60 + Math.cos(x * 0.03) * 20;
}

let myAngle = 45;
let myPower = 50;

let audioCtx = null;
function initAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }

function playLaserSound() {
    initAudio();
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'square'; osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.3);
}

function playExplosionSound() {
    initAudio();
    const bufferSize = audioCtx.sampleRate * 0.4; const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0); for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = audioCtx.createBufferSource(); noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter(); filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, audioCtx.currentTime); filter.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.4);
    const gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.3, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    noise.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
    noise.start();
}

function playMoveSound() {
    initAudio();
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(60, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime); gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.08);
}

function playGameOverSound(win) {
    initAudio();
    const now = audioCtx.currentTime; const notes = win ? [261.63, 329.63, 392.00, 523.25] : [392.00, 349.23, 311.13, 246.94];
    notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
        osc.type = 'triangle'; osc.frequency.setValueAtTime(freq, now + index * 0.15);
        gain.gain.setValueAtTime(0.15, now + index * 0.15); gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.15 + 0.14);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(now + index * 0.15); osc.stop(now + index * 0.15 + 0.14);
    });
}

function openTankSelection() { initAudio(); isAiMode = true; document.getElementById('menu').style.display = 'none'; document.getElementById('tank-select').style.display = 'block'; }
function showGameLayout() { document.getElementById('menu').style.display = 'none'; document.getElementById('tank-select').style.display = 'none'; document.getElementById('gameTitle').style.display = 'block'; canvas.style.display = 'block'; statusDiv.style.display = 'block'; document.getElementById('controls-info').style.display = 'block'; }

window.selectTank = function(type) {
    showGameLayout();
    const aiTypes = ['medium', 'heavy', 'light'];
    const aiType = aiTypes[Math.floor(Math.random() * aiTypes.length)];

    gamePlayers = {
        'local_player': { id: 'local_player', x: 150, color: '#ffcc00', name: 'צהובי', angle: 45, power: 50, type: type, hp: TANK_TYPES[type].maxHp, maxHp: TANK_TYPES[type].maxHp },
        'ai_player': { id: 'ai_player', x: 650, color: '#ff3333', name: 'המחשב', angle: 135, power: 60, type: aiType, hp: TANK_TYPES[aiType].maxHp, maxHp: TANK_TYPES[aiType].maxHp }
    };
    
    aiLastSpecs = { angle: 135, power: 60 }; aiLastXLand = null; playerMovesLeft = 5; currentTurnId = 'local_player'; gameActive = true;
    updateStatusText(); draw();
}

window.startOnlineGame = function() {
    initAudio(); isAiMode = false; showGameLayout(); statusDiv.innerText = "מתחבר לשרת... שלח את הלינק לחבר!";
    socket = io();
    socket.on('init', (data) => { myId = data.id; if (data.side === 'right') myAngle = 135; });
    socket.on('startGame', (data) => {
        gamePlayers = data.players;
        for(let id in gamePlayers) { gamePlayers[id].type = 'medium'; gamePlayers[id].hp = 100; gamePlayers[id].maxHp = 100; }
        playerMovesLeft = 5; currentTurnId = data.turn; gameActive = true; updateStatusText();
    });
    socket.on('playerAimed', (data) => { if (gamePlayers[data.id]) { gamePlayers[data.id].angle = data.angle; gamePlayers[data.id].power = data.power; } });
    socket.on('playerFired', (data) => {
        const shootingTank = gamePlayers[data.id]; const tSpecs = TANK_TYPES[shootingTank.type]; playLaserSound();
        projectile = { x: shootingTank.x, y: terrain[shootingTank.x] - tSpecs.height, vx: data.vx, vy: data.vy, owner: data.id };
    });
    socket.on('playerMoved', (data) => { if (gamePlayers[data.id]) { gamePlayers[data.id].x = data.x; } });
    socket.on('nextTurn', (data) => { currentTurnId = data.turn; playerMovesLeft = 5; setTimeout(() => { updateStatusText(); }, 1500); });
    socket.on('playerLeft', () => { gameActive = false; statusDiv.innerText = "השחקן השני התנתק. מחכה לשחקן חדש..."; });
    draw();
}

function endTurnWithMovement() {
    if (isAiMode) {
        currentTurnId = 'ai_player';
        setTimeout(() => { updateStatusText(); }, 1500);
    } else {
        socket.emit('fire', { vx: 0, vy: 0, special: 'moved' }); 
    }
}

function runAiTurn() {
    if (!gameActive) return;
    statusDiv.innerText = "המחשב מנתח נתונים..."; statusDiv.style.color = "#ff3333";

    setTimeout(() => {
        const me = gamePlayers['local_player']; const ai = gamePlayers['ai_player']; const aiSpecs = TANK_TYPES[ai.type];
        
        const lastPlayerImpactDist = aiLastXLand !== null ? Math.abs(aiLastXLand - ai.x) : 999;
        if (ai.hp < (ai.maxHp * 0.5) && lastPlayerImpactDist < 60 && Math.random() < 0.4) {
            statusDiv.innerText = "המחשב מחליט לתמרן ולברוח!";
            const dir = ai.x > me.x ? 1 : -1; 
            const steps = 3 + Math.floor(Math.random() * 3); 
            
            for(let i=0; i<steps; i++) {
                let nextX = ai.x + (dir * 6);
                if (nextX > 50 && nextX < 750) ai.x = nextX;
            }
            playMoveSound();
            currentTurnId = 'local_player';
            playerMovesLeft = 5;
            setTimeout(() => { updateStatusText(); }, 1500);
            return;
        }

        let targetAngle = aiLastSpecs.angle; let targetPower = aiLastSpecs.power;
        if (aiLastXLand !== null) {
            const errorX = aiLastXLand - me.x;
            if (Math.abs(errorX) > 10) {
                if (aiLastXLand < me.x) targetPower -= Math.abs(errorX) * 0.12;
                else targetPower += Math.abs(errorX) * 0.12;
            }
        } else {
            const distance = Math.abs(me.x - ai.x); targetPower = 45 + (distance * 0.05);
        }

        targetPower += (Math.random() - 0.5) * 4; targetPower = Math.max(20, Math.min(100, targetPower));
        ai.angle = targetAngle; ai.power = targetPower; aiLastSpecs = { angle: targetAngle, power: targetPower };

        const fireRad = (targetAngle * Math.PI) / 180; const speed = targetPower * 0.12;
        playLaserSound();
        projectile = { x: ai.x, y: terrain[ai.x] - aiSpecs.height, vx: Math.cos(fireRad) * speed, vy: -Math.sin(fireRad) * speed, owner: 'ai_player' };

        currentTurnId = 'local_player';
        playerMovesLeft = 5;
        setTimeout(() => { updateStatusText(); }, 1500);
    }, 1500);
}

function updateStatusText() {
    if (!gameActive) return;
    if (currentTurnId === myId) {
        statusDiv.innerText = "התור שלך! (עוצמה: " + Math.floor(myPower) + " | זווית: " + myAngle + "° | דלק: " + playerMovesLeft + "/5)";
        statusDiv.style.color = "#ffcc00";
    } else {
        const opposingName = gamePlayers[currentTurnId] ? gamePlayers[currentTurnId].name : "היריב";
        statusDiv.innerText = "תור של " + opposingName + "..."; statusDiv.style.color = "#ff3333";
        if (isAiMode && currentTurnId === 'ai_player') runAiTurn();
    }
}

function checkExplosionDamage(craterX) {
    for (let id in gamePlayers) {
        const p = gamePlayers[id]; const tSpecs = TANK_TYPES[p.type]; const halfWidth = tSpecs.width / 2;
        let distanceToTank = 0;
        if (craterX < p.x - halfWidth) distanceToTank = (p.x - halfWidth) - craterX;
        else if (craterX > p.x + halfWidth) distanceToTank = craterX - (p.x + halfWidth);

        if (distanceToTank < 35) {
            const damage = Math.floor((1 - (distanceToTank / 35)) * 50);
            if (damage > 0) p.hp = Math.max(0, p.hp - damage);
        }
    }

    for (let id in gamePlayers) {
        if (gamePlayers[id].hp <= 0) {
            gameActive = false;
            if (id === myId) { statusDiv.innerText = "הטנק שלך הושמד! המחשב ניצח 💀"; statusDiv.style.color = "#ff3333"; playGameOverSound(false); }
            else { statusDiv.innerText = "בום! השמדת את " + gamePlayers[id].name + "! 🎉"; statusDiv.style.color = "#00ff00"; playGameOverSound(true); }
            break;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // ציור שטח
    ctx.beginPath(); ctx.moveTo(0, canvas.height);
    for (let x = 0; x < canvas.width; x++) ctx.lineTo(x, terrain[x]);
    ctx.lineTo(canvas.width, canvas.height); ctx.fillStyle = '#3a2512'; ctx.fill();

    // ציור טנקים
    for (let id in gamePlayers) {
        const p = gamePlayers[id]; const tSpecs = TANK_TYPES[p.type]; const tankY = terrain[Math.floor(p.x)];
        
        ctx.save();
        ctx.fillStyle = '#1e1e1e'; ctx.fillRect(p.x - (tSpecs.width / 2), tankY - 4, tSpecs.width, 4); 
        ctx.fillStyle = p.color; ctx.fillRect(p.x - (tSpecs.width / 2) + 2, tankY - tSpecs.height, tSpecs.width - 4, tSpecs.height - 3); 
        
        ctx.beginPath(); ctx.arc(p.x, tankY - tSpecs.height + 1, tSpecs.width / 4, Math.PI, 0); ctx.fillStyle = '#fff'; ctx.fill(); 

        const angleToUse = id === myId ? myAngle : (p.angle || (p.x > 400 ? 135 : 45));
        const rad = (angleToUse * Math.PI) / 180;
        ctx.beginPath(); ctx.moveTo(p.x, tankY - tSpecs.height);
        ctx.lineTo(p.x + Math.cos(rad) * (tSpecs.width * 0.7), (tankY - tSpecs.height) - Math.sin(rad) * (tSpecs.width * 0.7));
        ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = Math.max(2, tSpecs.width / 8); ctx.stroke(); 
        ctx.restore();

        // מד חיים
        ctx.fillStyle = '#555'; ctx.fillRect(p.x - 25, tankY - tSpecs.height - 15, 50, 5);
        ctx.fillStyle = p.hp > (p.maxHp * 0.4) ? '#00ff00' : '#ff3333'; ctx.fillRect(p.x - 25, tankY - tSpecs.height - 15, (p.hp / p.maxHp) * 50, 5);
        
        ctx.font = "11px sans-serif"; ctx.fillStyle = "#fff"; ctx.textAlign = "center";
        ctx.fillText(p.name + " (" + p.hp + " HP)", p.x, tankY - tSpecs.height - 22);
    }

    // פגז באוויר
    if (projectile) {
        projectile.vy += gravity; projectile.x += projectile.vx; projectile.y += projectile.vy;
        ctx.beginPath(); ctx.arc(projectile.x, projectile.y, 5, 0, Math.PI * 2); ctx.fillStyle = '#ff3333'; ctx.fill();

        if (projectile.x >= 0 && projectile.x < canvas.width) {
            if (projectile.y >= terrain[Math.floor(projectile.x)]) {
                const craterX = Math.floor(projectile.x);
                if (projectile.owner === 'ai_player') aiLastXLand = craterX;

                playExplosionSound();
                for (let x = craterX - 25; x <= craterX + 25; x++) {
                    if (x >= 0 && x < canvas.width) {
                        const dist = Math.abs(x - craterX); const depth = Math.sqrt(Math.max(0, 25*25 - dist*dist));
                        terrain[x] += depth;
                    }
                }
                checkExplosionDamage(craterX); projectile = null;
            }
        } else { projectile = null; }
    }
    requestAnimationFrame(draw);
}

let activeKeys = {};
window.addEventListener('keydown', (e) => { activeKeys[e.key] = true; });
window.addEventListener('keyup', (e) => { delete activeKeys[e.key]; });

function handleGameControls() {
    if (!gameActive || currentTurnId !== myId || projectile) return;

    const me = gamePlayers[myId];
    let changed = false;

    if (activeKeys['Shift']) {
        if (playerMovesLeft > 0) {
            let nextX = me.x;
            if (activeKeys['ArrowLeft'] || activeKeys['a']) { nextX = me.x - 6; playerMovesLeft--; activeKeys['ArrowLeft'] = false; activeKeys['a'] = false; changed = true; }
            if (activeKeys['ArrowRight'] || activeKeys['d']) { nextX = me.x + 6; playerMovesLeft--; activeKeys['ArrowRight'] = false; activeKeys['d'] = false; changed = true; }
            
            if (nextX > 30 && nextX < canvas.width - 30) {
                me.x = nextX;
                playMoveSound();
                if (!isAiMode) socket.emit('move', { x: me.x });
            }

            if (playerMovesLeft <= 0) {
                updateStatusText();
                setTimeout(() => { endTurnWithMovement(); }, 600);
                return;
            }
        }
    } 
    else {
        if (activeKeys['ArrowUp']) { myAngle = Math.min(180, myAngle + 1); changed = true; }
        if (activeKeys['ArrowDown']) { myAngle = Math.max(0, myAngle - 1); changed = true; }
        if (activeKeys['ArrowRight']) { myPower = Math.min(100, myPower + 0.5); changed = true; }
        if (activeKeys['ArrowLeft']) { myPower = Math.max(1, myPower - 0.5); changed = true; }
    }

    if (changed) {
        updateStatusText();
        if (!isAiMode && !activeKeys['Shift']) socket.emit('updateAim', { angle: myAngle, power: myPower });
    }

    if (activeKeys[' ']) {
        activeKeys[' '] = false; 
        const rad = (myAngle * Math.PI) / 180;
        const speed = myPower * 0.12;
        const tSpecs = TANK_TYPES[me.type];
        
        playLaserSound();

        if (isAiMode) {
            projectile = { x: me.x, y: terrain[Math.floor(me.x)] - tSpecs.height, vx: Math.cos(rad) * speed, vy: -Math.sin(rad) * speed, owner: 'local_player' };
            currentTurnId = 'ai_player';
            playerMovesLeft = 5;
            setTimeout(() => { updateStatusText(); }, 1500);
        } else {
            socket.emit('fire', { vx: Math.cos(rad) * speed, vy: -Math.sin(rad) * speed });
        }
    }
}

setInterval(handleGameControls, 50);
</script>
</body>
</html>
