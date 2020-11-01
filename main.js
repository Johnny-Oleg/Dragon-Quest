'use strict';

const FONT = '48px monospace';
const WIDTH = 128;
const HEIGHT = 120;

let gameFrame = 0;
let gameImgMap;
let $gameScreen;

const DrawMain = () => {
    const $game = $gameScreen.getContext('2d');

    for (let y = 0; y < 32; y++) {
        for (let x = 0; x < 64; x++) {
            $game.drawImage(gameImgMap, x * 32, y * 32);     
        }        
    }

    $game.font = FONT;
    $game.fillText('hello wrot' + gameFrame, gameFrame / 10, 64);
};

const WmPaint = () => {
    DrawMain();

    const $canvas = document.getElementById('main');
    const $game = $canvas.getContext('2d');

    $game.drawImage(
        $gameScreen, 0, 0, $gameScreen.width, $gameScreen.height,
        0, 0, $canvas.width, $canvas.height
    );
};

const WmSize = () => {
    const $canvas = document.getElementById('main');

    $canvas.width = window.innerWidth;
    $canvas.height = window.innerHeight;
};

const WmTimer = () => {
    gameFrame++;

    WmPaint();
};

window.onload = () => {
    gameImgMap = new Image();
    gameImgMap.src = './img/map.png';
    $gameScreen = document.createElement('canvas');
    $gameScreen.width = WIDTH;
    $gameScreen.height = HEIGHT;

    WmSize();    
    window.addEventListener('resize', () => {WmSize();});
    setInterval(() => {
        WmTimer();
    }, 33);
}