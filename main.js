import ENGINE from './engine.js';

'use strict';

const FONT = '12px monospace';
const FONT_STYLE = '#ffffff';
const WINDOW_STYLE = 'rgba(0, 0, 0, 0.75)';
const CHARACTER_WIDTH = 8;
const CHARACTER_HEIGHT = 9;
const START_HP = 20;
const START_X = 15;
const START_Y = 17;
const WIDTH = 128;
const HEIGHT = 120;
const SCREEN_WIDTH = 8;
const SCREEN_HEIGHT = 8;
const MAP_WIDTH = 32;
const MAP_HEIGHT = 32;
const SCROLL = 1;
const SMOOTH = false;
const TILE_COLUMN = 4;
const TILE_SIZE = 8;

const gameKey = new Uint8Array(0x100);

let gameAngle = 0;
let gameFrame = 0;
let gameExp = 0;
let gameHP = START_HP;
let gameMonsterHP = START_HP;
let gameEnemyTypeHP;
let gameLvl = 1;
let gamePlayerX = START_X * TILE_SIZE + TILE_SIZE / 2;
let gamePlayerY = START_Y * TILE_SIZE + TILE_SIZE / 2;
let gameMovingX = 0;
let gameMovingY = 0;
let gameItem = false;
let gamePhase = 0;
let gameCursor = 0;
let gameMessage_1 = null;
let gameMessage_2 = null;
let gameImgMap;
let gameImgPlayer;
let gameImageMonster;
let gameImageBoss;
let gameImageTrueBoss;
let gameEnemyType;
let battleTurnOrder;
let gameWidth;
let gameHeight;
let audio;

const gameFileMap = './img/map.png';
const gameFilePlayer = './img/player.png';
const gameFileMonster = './img/monster.png';
const gameFileBoss = './img/boss.png';
const gameFileTrueBoss = './img/finalboss.png';

const track_1 = './music/Unknown_World.mp3';
const track_2 = './music/Inn.mp3';
const track_3 = './music/Fight.mp3';
const track_4 = './music/Enemy_Defeated.mp3';
const track_5 = './music/Level_Up.mp3';
const track_6 = './music/King_Dragon.mp3';
const track_7 = './music/Finale.mp3';
const track_8 = './music/Dead.mp3';

const gameEncounter = [0, 0, 0, 1, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0];
const gameMonstersNames = ['Slime', 'Rabbit', 'Knight', 'Dragon', 'DemonLord'];
const musicTracks = [track_1, track_2, track_3, track_4, track_5, track_6, track_7, track_8];

const gameMap = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 3, 3, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 3, 6, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 3, 3, 6, 6, 7, 7, 7, 2, 2, 2, 7, 7, 7, 7, 7, 7, 7, 6, 3, 0, 0, 0, 3, 3, 0, 6, 6, 6, 0, 0, 0,
    0, 0, 3, 3, 6, 6, 6, 7, 7, 2, 2, 2, 7, 7, 2, 2, 2, 7, 7, 6, 3, 3, 3, 6, 6, 3, 6, 13, 6, 0, 0, 0,
    0, 3, 3, 10, 11, 3, 3, 6, 7, 7, 2, 2, 2, 2, 2, 2, 1, 1, 7, 6, 6, 6, 6, 6, 3, 0, 6, 6, 6, 0, 0, 0,
    0, 0, 3, 3, 3, 0, 3, 3, 3, 7, 7, 2, 2, 2, 2, 7, 7, 1, 1, 6, 6, 6, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 7, 7, 7, 7, 2, 7, 6, 3, 1, 3, 6, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 7, 2, 7, 6, 3, 1, 3, 3, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 0, 3, 3, 3, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 3, 12, 3, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 7, 7, 6, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 6, 6, 6, 6, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 6, 6, 3, 3, 3, 3, 1, 1, 3, 3, 3, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 3, 3, 3, 6, 6, 6, 3, 3, 3, 1, 1, 1, 1, 1, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 8, 9, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 3, 3, 1, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 3, 3, 3, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0,
    7, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 0, 0, 0, 0, 0,
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7,
];

const loadMusic = () => {
    audio = new Audio();
    audio.autoplay = true;
    audio.loop = true;
    audio.src = musicTracks[0];
};

const changeMusic = (music, loop) => {
    audio.src = music;
    audio.loop = loop;
};

const battleScreen = () => {
    gamePhase++;

    if (((gamePhase + battleTurnOrder) & 1) == 0) {
        const enemyDamage = calculateDamage(gameEnemyType + 2);
        const enemyMessage_1 = `${gameMonstersNames[gameEnemyType]} attacks!`;
        const enemyMessage_2 = `${enemyDamage} Damage`;

        setMessage(enemyMessage_1, enemyMessage_2);

        gameHP -= enemyDamage;

        if (gameHP <= 0) { 
            gameHP = 0;   
            gamePhase = 7;
        };

        return;
    }

    if (gameCursor == 0) {
        const heroDamage = calculateDamage(gameLvl + 1);
        const heroMessage_1 = 'You attack!';
        const heroMessage_2 = `${heroDamage} Damage`;

        setMessage(heroMessage_1, heroMessage_2);

        gameEnemyTypeHP -= heroDamage;
        gameEnemyTypeHP <= 0 && (gamePhase = 5);

        return;
    }

    if (Math.random() < 0.5) {
        setMessage('You ran away...', null);

        gamePhase = 6;

        return;
    }

    setMessage('You ran away...', 'but escape fails!');
};

const appearEnemy = target => {
    gamePhase = 1;
    gameEnemyTypeHP = target * 3 + 5;
    gameEnemyType = target;

    setMessage('The Enemy', 'appears!');
};

const gainExp = amount => {
    gameExp += amount;

    changeMusic(musicTracks[3]);

    while (gameLvl * (gameLvl + 1) * 2 <= gameExp) {
        gameLvl++;
        gameMonsterHP += 4 + Math.floor(Math.random() * 3);

        changeMusic(musicTracks[4]);
    }
};

const battleCommand = () => {
    gamePhase = 2;
    gameCursor = 0;
        
    setMessage(' Fight', ' Run');
};

const drawEncounter = game => {
    game.fillStyle = '#000000';
    game.fillRect(0, 0, WIDTH, HEIGHT);

    if (gamePhase <= 5) {
        if (isBoss()) {
            if (gameLvl < 10) {
                let w = gameImageBoss.width;
                let h = gameImageBoss.height;
                const bossWidth = Math.floor(128 / 2 - w) + TILE_SIZE * 2;
                const bossHeight = Math.floor(120 / 2 - h) + TILE_COLUMN * 5;

                game.drawImage(gameImageBoss, bossWidth, bossHeight);

            } else {
                let w = gameImageTrueBoss.width;
                let h = gameImageTrueBoss.height;
                const bossWidth = Math.floor(128 / 2 - w) + TILE_SIZE * 7;
                const bossHeight = Math.floor(120 / 2 - h) + TILE_COLUMN * 9;

                game.drawImage(gameImageTrueBoss, bossWidth, bossHeight);
            }    
        } else {
            let w = gameImageMonster.width / 4;
            let h = gameImageMonster.height;

            const monsterWidth = Math.floor(WIDTH / 2 - w / 2);
            const monsterHeight = Math.floor(HEIGHT / 2 - h / 2);

            game.drawImage(
                gameImageMonster, gameEnemyType * w, 0, 
                w, h, monsterWidth, monsterHeight, w, h
            );
        }    
    }

    drawStatus(game);
    drawMessage(game);

    if (gamePhase == 2) {
        game.fillText('⇒', 6, 96 + 14 * gameCursor);
    }
};

const drawField = game => {
    let mx = Math.floor(gamePlayerX / TILE_SIZE);
    let my = Math.floor(gamePlayerY / TILE_SIZE);
    let ipw = WIDTH / 2 - CHARACTER_WIDTH / 2;
    let iph = HEIGHT / 2 - CHARACTER_HEIGHT + TILE_SIZE / 2;
    let frame = (gameFrame >> 4 & 1) * CHARACTER_WIDTH;

    for (let dy = -SCREEN_HEIGHT; dy <= SCREEN_HEIGHT; dy++) {
        let ty = my + dy;
        let py = (ty + MAP_HEIGHT) % MAP_HEIGHT;
        let tyw = ty * TILE_SIZE + HEIGHT / 2 - gamePlayerY;

        for (let dx = -SCREEN_WIDTH; dx <= SCREEN_WIDTH; dx++) {
            let tx = mx + dx;
            let px = (tx + MAP_WIDTH) % MAP_WIDTH;
            let txw = tx * TILE_SIZE + WIDTH / 2 - gamePlayerX;

            drawTile(game, txw, tyw, gameMap[py * MAP_WIDTH + px]);   
        }        
    }

    game.drawImage(
        gameImgPlayer, frame, 
        gameAngle * CHARACTER_HEIGHT, 
        CHARACTER_WIDTH, CHARACTER_HEIGHT, ipw, 
        iph, CHARACTER_WIDTH, CHARACTER_HEIGHT
    );

    game.fillStyle = WINDOW_STYLE;
    game.fillRect(2, 2, 44, 37);

    drawStatus(game);
    drawMessage(game);
};

const drawMain = () => {
    const $game = ENGINE.GR.mG;

    gamePhase <= 1 ? drawField($game) : drawEncounter($game);
};

const drawMessage = game => {
    if (!gameMessage_1) return;

    game.fillStyle = WINDOW_STYLE;
    game.fillRect(4, 84, 120, 30);
    game.font = FONT;
    game.fillStyle = FONT_STYLE;
    game.fillText(gameMessage_1, 6, 96);

    gameMessage_2 && game.fillText(gameMessage_2, 6, 110);
};

const drawStatus = game => {
    game.font = FONT;
    game.fillStyle = FONT_STYLE;
    
    game.fillText(`Lv `, 4, 13);
    drawTextR(game, gameLvl, 45, 13);
    game.fillText(`HP `, 4, 25);
    drawTextR(game, gameHP, 45, 25);
    game.fillText(`Exp `, 4, 37);
    drawTextR(game, gameExp, 45, 37);
};

const drawTextR = (game, str, x, y) => {
    game.textAlign = 'right';
    game.fillText(str, x, y);
    game.textAlign = 'left';
};

const drawTile = (game, x, y, index) => {
    const indexX = (index % TILE_COLUMN) * TILE_SIZE;
    const indexY = Math.floor(index / TILE_COLUMN) * TILE_SIZE;

    game.drawImage(
        gameImgMap, indexX, indexY, TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE
    );  
};

const calculateDamage = value => Math.floor(value * (1 + Math.random()));

const isBoss = () => gameEnemyType == gameMonstersNames.length - 1;

const loadImages = () => {
    gameImgMap = new Image();
    gameImgMap.src = gameFileMap;

    gameImgPlayer = new Image();
    gameImgPlayer.src = gameFilePlayer;

    gameImageMonster = new Image();
    gameImageMonster.src = gameFileMonster;

    gameImageBoss = new Image();
    gameImageBoss.src = gameFileBoss;

    gameImageTrueBoss = new Image();
    gameImageTrueBoss.src = gameFileTrueBoss;
};

// function setMessage(text_1, text_2 = null); // IE

const setMessage = (text_1, text_2) => {
    gameMessage_1 = text_1;
    gameMessage_2 = text_2;
};

const tickField = () => {
    if (gamePhase != 0) return;

    if (gameMovingX != 0 || gameMovingY != 0 || gameMessage_1) {

    } else if (gameKey[37]) {   
        gameAngle = 1;                       
        gameMovingX = -TILE_SIZE;
    } else if (gameKey[38]) {
        gameAngle = 3;                       
        gameMovingY = -TILE_SIZE
    } else if (gameKey[39]) {
        gameAngle = 2;                       
        gameMovingX = TILE_SIZE
    } else if (gameKey[40]) {
        gameAngle = 0;                       
        gameMovingY = TILE_SIZE
    };

    let mx = Math.floor((gamePlayerX + gameMovingX) / TILE_SIZE);
    let my = Math.floor((gamePlayerY + gameMovingY) / TILE_SIZE);

    mx += MAP_WIDTH;
    mx %= MAP_WIDTH;
    my += MAP_HEIGHT;
    my %= MAP_HEIGHT;

    let m = gameMap[my * MAP_WIDTH + mx];

    if (m < 3) {
        gameMovingX = 0;
        gameMovingY = 0;
    }

    if (Math.abs(gameMovingX) + Math.abs(gameMovingY) == SCROLL) {
        if (m == 8 || m == 9) {
            gameHP = gameMonsterHP;

            changeMusic(musicTracks[1]);
            setMessage('Slay the', 'Demon Lord!');
        }

        if (m == 10 || m == 11) {
            gameHP = gameMonsterHP;

            changeMusic(musicTracks[1]);
            setMessage('Go to a village', 'in the east...');
        }

        if (m == 12) {
            gameHP = gameMonsterHP;

            changeMusic(musicTracks[1]);
            setMessage('The key is', 'in a cave!');
        }

        if (m == 13) {
            gameItem = true;

            setMessage('You got the key!', null);
        }

        if (m == 14) {
            if (!gameItem) {
                gamePlayerY -= TILE_SIZE;

                setMessage('You need a key!', null);
            } else {
                setMessage('The door is open.', null);
            }
        }

        if (m == 15) {
            appearEnemy(gameMonstersNames.length - 1);
            changeMusic(musicTracks[5]);
        }

        if (Math.random() * 10 < gameEncounter[m]) {
            let target = Math.abs(
                gamePlayerX / TILE_SIZE - START_X) + 
                Math.abs(gamePlayerY / TILE_SIZE - START_Y
            );

            m == 6 && (target += 8);
            m == 7 && (target += 16);

            target += Math.random() * 8;
            target = Math.floor(target / 16);
            target = Math.min(target, gameMonstersNames.length - 2);

            appearEnemy(target);
        }
    }   

    gamePlayerX += ENGINE.sign(gameMovingX) * SCROLL;
    gamePlayerY += ENGINE.sign(gameMovingY) * SCROLL;
    gameMovingX -= ENGINE.sign(gameMovingX) * SCROLL;
    gameMovingY -= ENGINE.sign(gameMovingY) * SCROLL;

    gamePlayerX += (MAP_WIDTH * TILE_SIZE);
    gamePlayerX %= (MAP_WIDTH * TILE_SIZE);
    gamePlayerY += (MAP_HEIGHT * TILE_SIZE);
    gamePlayerY %= (MAP_HEIGHT * TILE_SIZE);
};

const windowPaint = () => {
    drawMain();

    const $canvas = document.getElementById('main');
    const $game = $canvas.getContext('2d');

    $game.drawImage(
        ENGINE.GR.mCanvas, 0, 0, ENGINE.GR.mCanvas.width, ENGINE.GR.mCanvas.height,
        0, 0, gameWidth, gameHeight
    );
};

const windowSize = () => {
    const $canvas = document.getElementById('main');

    $canvas.width = window.innerWidth;
    $canvas.height = window.innerHeight;

    const $game = $canvas.getContext('2d');
    $game.imageSmoothingEnabled = $game.msImageSmoothingEnabled = SMOOTH;

    gameWidth = $canvas.width; 
    gameHeight = $canvas.height;

    gameWidth / WIDTH < gameHeight / HEIGHT ? 
        gameHeight = gameWidth * HEIGHT / WIDTH :
        gameWidth = gameHeight * WIDTH / HEIGHT;
};

ENGINE.onTimer = d => {
    if (!gameMessage_1) {
        while (d--) {
            gameFrame++;

            tickField();
        }
    }

    windowPaint();
};

window.onkeydown = ({ keyCode }) => {
    let code = keyCode;

    if (gameKey[code] != 0) return;

    gameKey[code] = 1;

    if (gamePhase == 1) {
        battleCommand();
        changeMusic(musicTracks[2], true);

        return;
    }

    if (gamePhase == 2) {
        if (code == 13 || code == 90) {
            battleTurnOrder = Math.floor(Math.random() * 2);

            battleScreen();
        } else {
            gameCursor = 1 - gameCursor
        };

        return;
    }

    if (gamePhase == 3) {
        battleScreen();

        return;
    }

    if (gamePhase == 4) {
        battleCommand();

        return;
    };

    if (gamePhase == 5) {
        gamePhase = 6;

        gainExp(gameEnemyType + 1);
        setMessage('The Enemy has', 'been defeated!');

        return;
    }

    if (gamePhase == 6) {
        if (isBoss() && gameCursor == 0) {
            setMessage('Demon Lord', 'is defeated...');
            changeMusic(musicTracks[6]);

            return;
        }    

        gamePhase = 0;
        gamePhase == 0 && changeMusic(musicTracks[0], true);
    }

    if (gamePhase == 7) {
        gamePhase = 8;

        setMessage('You died!...', null);
        changeMusic(musicTracks[7]);

        return;
    }

    if (gamePhase == 8) {
        setMessage('Game over', null);

        return;
    }

    gameMessage_1 = null;
};

window.onkeyup = ({ keyCode }) => {
    let code = keyCode;

    gameKey[code] = 0;
};

window.onload = () => {
    loadImages();
    loadMusic();
    windowSize();    

    window.addEventListener('resize', () => windowSize());
    ENGINE.init();
};