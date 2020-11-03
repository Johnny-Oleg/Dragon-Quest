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
const INTERVAL = 33;
const SCROLL = 1;
const SMOOTH = 0;
const TILE_COLUMN = 4;
const TILE_ROW = 4;
const TILE_SIZE = 8;

const gameKey = new Uint8Array(0x100);

let gameAngle = 0;
let gameFrame = 0;
let gameExp = 0;
let gameHP = START_HP;
let gameMonsterHP = START_HP;
let gameLvl = 1; 
let gamePlayerX = START_X * TILE_SIZE + TILE_SIZE / 2;
let gamePlayerY = START_Y * TILE_SIZE + TILE_SIZE / 2;
let gameMovingX = 0;
let gameMovingY = 0;
let gameItem = 0;
let gamePhase = 0;
let gameMessage_1 = null;
let gameMessage_2 = null;
let gameImgMap;
let gameImgPlayer;
let gameImageMonster;
let $gameScreen;
let gameWidth;
let gameHeight;

const gameFileMap = './img/map.png';
const gameFilePlayer = './img/player.png';
const gameFileMonster = './img/monster.png';

const gameEncounter = [0, 0, 0, 1, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0];

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

const DrawEncounter = game => {
    game.fillStyle = '#000000';
    game.fillRect(0, 0, WIDTH, HEIGHT);

    game.drawImage(gameImageMonster, WIDTH / 2, HEIGHT / 2);
};

const DrawMap = game => {
    let mx = Math.floor(gamePlayerX / TILE_SIZE);
    let my = Math.floor(gamePlayerY / TILE_SIZE);

    for (let dy = -SCREEN_HEIGHT; dy <= SCREEN_HEIGHT; dy++) {
        let ty = my + dy;
        let playerY = (ty + MAP_HEIGHT) % MAP_HEIGHT;

        for (let dx = -SCREEN_WIDTH; dx <= SCREEN_WIDTH; dx++) {
            let tx = mx + dx;
            let playerX = (tx + MAP_WIDTH) % MAP_WIDTH;

            DrawTile(
                game, tx * TILE_SIZE + WIDTH / 2 - gamePlayerX, 
                ty * TILE_SIZE + HEIGHT / 2 - gamePlayerY, 
                gameMap[playerY * MAP_WIDTH + playerX]
            );   
        }        
    }

    // $game.fillStyle = '#ff0000';
    // $game.fillRect(0, HEIGHT / 2 - 1, WIDTH, 2);
    // $game.fillRect(WIDTH / 2 - 1, 0, 2, HEIGHT);

    game.drawImage(
        gameImgPlayer, (gameFrame >> 4 & 1) * CHARACTER_WIDTH, gameAngle * CHARACTER_HEIGHT, CHARACTER_WIDTH, CHARACTER_HEIGHT, 
        WIDTH / 2 - CHARACTER_WIDTH / 2, HEIGHT / 2 - CHARACTER_HEIGHT + TILE_SIZE / 2, CHARACTER_WIDTH, CHARACTER_HEIGHT
    );
};

const DrawMain = () => {
    const $game = $gameScreen.getContext('2d');

    gamePhase == 0 ? DrawMap($game) : DrawEncounter($game);

    $game.fillStyle = WINDOW_STYLE;
    $game.fillRect(2, 2, 44, 37);

    DrawStatus($game);
    DrawMessage($game);

    // $game.fillStyle = WINDOW_STYLE;
    // $game.fillRect(20, 3, 105, 15);
    // $game.font = FONT;
    // $game.fillStyle = FONT_STYLE;
    // $game.fillText(
    //     `x=${gamePlayerX} y=${gamePlayerY} m=${gameMap[my * MAP_WIDTH + mx]}`,
    //     25, 15
    // );
};

const DrawMessage = game => {
    if (!gameMessage_1) return;

    game.fillStyle = WINDOW_STYLE;
    game.fillRect(4, 84, 120, 30);
    game.font = FONT;
    game.fillStyle = FONT_STYLE;
    game.fillText(gameMessage_1, 6, 96);

    gameMessage_2 && game.fillText(gameMessage_2, 6, 110); //!!
};

const DrawStatus = game => {
    game.font = FONT;
    game.fillStyle = FONT_STYLE;
    game.fillText(`Lv ${gameLvl}`, 4, 13);
    game.fillText(`HP ${gameHP}`, 4, 25);
    game.fillText(`Exp ${gameExp}`, 4, 37);
};
 
const DrawTile = (game, x, y, index) => {
    const indexX = (index % TILE_COLUMN) * TILE_SIZE;
    const indexY = Math.floor(index / TILE_COLUMN) * TILE_SIZE;

    game.drawImage(
        gameImgMap, indexX, indexY, TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE
    );  
};

const loadImages = () => {
    gameImgMap = new Image();
    gameImgMap.src = gameFileMap;

    gameImgPlayer = new Image();
    gameImgPlayer.src = gameFilePlayer;

    gameImageMonster = new Image();
    gameImageMonster.src = gameFileMonster;
};

// function SetMessage(text_1, text_2 = null); // IE

const SetMessage = (text_1, text_2) => {
    gameMessage_1 = text_1;
    gameMessage_2 = text_2;
};

const Sign = value => {
    if (value == 0) {
        return 0;
    }
    if (value < 0) {
        return -1;
    }

    return 1;
};

const TickField = () => {
    if (gameMovingX !== 0 || gameMovingY !== 0 || gameMessage_1) {

    } else if (gameKey[37]) {   
        gameAngle = 1;                       //
        gameMovingX = -TILE_SIZE;
    } else if (gameKey[38]) {
        gameAngle = 3;                       //
        gameMovingY = -TILE_SIZE
    } else if (gameKey[39]) {
        gameAngle = 2;                       //
        gameMovingX = TILE_SIZE
    } else if (gameKey[40]) {
        gameAngle = 0;                       //
        gameMovingY = TILE_SIZE
    }; //? switch case

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
            SetMessage('Slay the Demon Lord!', null);
        }

        if (m == 10 || m == 11) {
            SetMessage('There\'s another village', 'in the far west!');
        }

        if (m == 12) {
            SetMessage('The key is', 'in a cave!');
        }

        if (m == 13) {
            gameItem = 1;
            SetMessage('I got the key!', null);
        }

        if (m == 14) {
            if (gameItem == 0) {
                gamePlayerY -= TILE_SIZE;
                SetMessage('I need a key!', null);
            } else {
                SetMessage('The door is open.');
            }
        }

        if (m == 15) {
            SetMessage('Demon Lord is defeated', 'and peace has returned to the world.');
        }

        if (Math.random() * 4 < gameEncounter[m]) {
            gamePhase = 1;
            SetMessage('The enemy is here!', null);
        }
    }   

    gamePlayerX += Sign(gameMovingX) * SCROLL;
    gamePlayerY += Sign(gameMovingY) * SCROLL;
    gameMovingX -= Sign(gameMovingX) * SCROLL;
    gameMovingY -= Sign(gameMovingY) * SCROLL;

    gamePlayerX += (MAP_WIDTH * TILE_SIZE);
    gamePlayerX %= (MAP_WIDTH * TILE_SIZE);
    gamePlayerY += (MAP_HEIGHT * TILE_SIZE);
    gamePlayerY %= (MAP_HEIGHT * TILE_SIZE);
};

const WmPaint = () => {
    DrawMain();

    const $canvas = document.getElementById('main');
    const $game = $canvas.getContext('2d');

    $game.drawImage(
        $gameScreen, 0, 0, $gameScreen.width, $gameScreen.height,
        0, 0, gameWidth, gameHeight
    );
};

const WmSize = () => {
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

const WmTimer = () => {
    gameFrame++;

    TickField();
    WmPaint();
};

window.onkeydown = (e) => {
    let code = e.keyCode;

    if (gameKey[code] != 0) return;

    gameKey[code] = 1;

    gamePhase == 1 && (gamePhase = 0);

    gameMessage_1 = null;
};

window.onkeyup = (e) => {
    let code = e.keyCode;

    gameKey[code] = 0;
};

window.onload = () => {
    loadImages();

    $gameScreen = document.createElement('canvas');
    $gameScreen.width = WIDTH;
    $gameScreen.height = HEIGHT;

    WmSize();    

    window.addEventListener('resize', () => {WmSize();});
    setInterval(() => {
        WmTimer();
    }, INTERVAL);
};