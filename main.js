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
let gameEnemyTypeHP;
let gameLvl = 1; 
let gamePlayerX = START_X * TILE_SIZE + TILE_SIZE / 2;
let gamePlayerY = START_Y * TILE_SIZE + TILE_SIZE / 2;
let gameMovingX = 0;
let gameMovingY = 0;
let gameItem = 0;
let gamePhase = 0;
let gameCursor = 0;
let gameMessage_1 = null;
let gameMessage_2 = null;
let gameImgMap;
let gameImgPlayer;
let gameImageMonster;
let gameImageBoss;
let gameEnemyType;
let battleTurnOrder;
let $gameScreen;
let gameWidth;
let gameHeight;

const gameFileMap = './img/map.png';
const gameFilePlayer = './img/player.png';
const gameFileMonster = './img/monster.png';
const gameFileBoss = './img/boss.png';

const gameEncounter = [0, 0, 0, 1, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0];
const gameMonstersNames = ['Slime', 'Rabbit', 'Knight', 'Dragon', 'Demon Lord'];

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

const Action = () => {
    gamePhase++;

    if (((gamePhase + battleTurnOrder) & 1) == 0) {
        const enemyDamage = calculateDamage(gameEnemyType + 2);

        SetMessage(`The ${gameMonstersNames[gameEnemyType]} attacks!`, `${enemyDamage} Damage`);

        gameHP -= enemyDamage;

       //gameHP <= 0 && (gamePhase = 7);//?
    if (gameHP <= 0) { 
        gameHP = 0;   
        gamePhase = 7;
    };//?

        return;
    }

    if (gameCursor == 0) {
        const heroDamage = calculateDamage(gameLvl + 1);

        SetMessage('You attack!', `${heroDamage} Damage`);

        gameEnemyTypeHP -= heroDamage;
        gameEnemyTypeHP <= 0 && (gamePhase = 5);

        return;
    }

    if (Math.random() < 0.5) {
        SetMessage('You ran away...', null);

        gamePhase = 6;

        return;
    }

    SetMessage('You ran away...', 'But You have been turned around');
};

const AppearEnemy = target => {
    gamePhase = 1;
    gameEnemyTypeHP = target * 3 + 5;
    gameEnemyType = target;

    SetMessage('The enemy is here!', null);
};

const GainExp = amount => {
    gameExp += amount;

    while (gameLvl * (gameLvl + 1) * 2 <= gameExp) {
        gameLvl++;
        gameMonsterHP += 4 + Math.floor(Math.random() * 3);
    }
};

const CommandFight = () => {
    gamePhase = 2;
    gameCursor = 0;
        
    SetMessage(' Fight', ' Run');
};

const DrawEncounter = game => {
    game.fillStyle = '#000000';
    game.fillRect(0, 0, WIDTH, HEIGHT);


    if (gamePhase <= 5) {
        if (isBoss()) {
            game.drawImage(
                gameImageBoss, WIDTH / 2 - gameImageBoss.width / 2,
                HEIGHT / 2 - gameImageBoss.height / 2
            );
        } else {
            let w = gameImageMonster.width / 4;
            let h = gameImageMonster.height;

            game.drawImage(
                gameImageMonster, gameEnemyType * w, 0, w, h, 
                Math.floor(WIDTH / 2 - w / 2), 
                Math.floor(HEIGHT / 2 - h / 2), w, h
            );
        }    
    }

    DrawStatus(game);
    DrawMessage(game);

    if (gamePhase == 2) {
        game.fillText('⇒', 6, 96 + 14 * gameCursor);
    }
};

const DrawField = game => {
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

    game.fillStyle = WINDOW_STYLE;//!
    game.fillRect(2, 2, 44, 37);

    DrawStatus(game);
    DrawMessage(game);//!
};

const DrawMain = () => {
    const $game = $gameScreen.getContext('2d');

    gamePhase <= 1 ? DrawField($game) : DrawEncounter($game);

    

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
   // game.fillText(`Lv ${gameLvl}`, 4, 13);
    game.fillText(`Lv `, 4, 13);
    DrawTextR(game, gameLvl, 36, 13);
    //game.fillText(`HP ${gameHP}`, 4, 25);
    game.fillText(`HP `, 4, 25);
    DrawTextR(game, gameHP, 36, 25);
   // game.fillText(`Exp ${gameExp}`, 4, 37);
    game.fillText(`Exp `, 4, 37);
    DrawTextR(game, gameExp, 36, 37);
};

const DrawTextR = (game, str, x, y) => {
    game.textAlign = 'right';
    game.fillText(str, x, y);
    game.textAlign = 'left';
};
 
const DrawTile = (game, x, y, index) => {
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
    if (gamePhase != 0) return;

    if (gameMovingX != 0 || gameMovingY != 0 || gameMessage_1) {

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
            gameHP = gameMonsterHP;
            SetMessage('Slay the  Demon Lord!', null);
        }

        if (m == 10 || m == 11) {
            gameHP = gameMonsterHP;
            SetMessage('There\'s another village', 'in the far west!');
        }

        if (m == 12) {
            gameHP = gameMonsterHP;
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
                SetMessage('The door is open.', null);
            }
        }

        if (m == 15) {
            AppearEnemy(gameMonstersNames.length - 1);
        }

        if (Math.random() * 4 < gameEncounter[m]) {
            let target = Math.abs(
                gamePlayerX / TILE_SIZE - START_X) + 
                Math.abs(gamePlayerY / TILE_SIZE - START_Y
            );

            m == 6 && (target += 8);
            m == 7 && (target += 16);

            target += Math.random() * 8;
            target = Math.floor(target / 16);
            target = Math.min(target, gameMonstersNames.length - 2);

            AppearEnemy(target);
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
    if (!gameMessage_1) {
        gameFrame++;

        TickField();
    }    

    WmPaint();
};

window.onkeydown = (e) => {
    let code = e.keyCode;

    if (gameKey[code] != 0) return;

    gameKey[code] = 1;

    if (gamePhase == 1) {
        CommandFight();

        return;
    }

    if (gamePhase == 2) {
        if (code == 13 || code == 90) {
            battleTurnOrder = Math.floor(Math.random() * 2);

            Action();
        } else {gameCursor = 1 - gameCursor}

        return;
    }

    if (gamePhase == 3) {
        Action();

        return;
    }

    if (gamePhase == 4) {
        CommandFight();

        return;
    };

    if (gamePhase == 5) {
        gamePhase = 6;

        GainExp(gameEnemyType + 1);
        SetMessage('The Enemy has been defeated!', null);

        return;
    }

    if (gamePhase == 6) {
        if (isBoss() && gameCursor == 0) {
            SetMessage('Demon Lord is defeated', 'and peace has returned to the world.');

            return;
        }    

        gamePhase = 0;
    }

    if (gamePhase == 7) {
        gamePhase = 8;

        SetMessage('You died!...', null);

        return;
    }

    if (gamePhase == 8) {
        SetMessage('Game over', null);

        return;
    }

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

    window.addEventListener('resize', () => WmSize());

    setInterval(() => WmTimer(), INTERVAL);
};