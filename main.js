'use strict';

const FONT = '48px monospace';
let gameFrame = 0;
let gameImgMap;

const WmTimer = () => {
    gameFrame++;

    const $canvas = document.getElementById('main');
    const $game = $canvas.getContext('2d');

    for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
            $game.drawImage(gameImgMap, x * 32, y * 32);     
        }        
    }

    $game.font = FONT;
    $game.fillText('hello wrot' + gameFrame, gameFrame / 10, 64);
}

window.onload = () => {
    gameImgMap = new Image();
    gameImgMap.src = './img/map.png';

    setInterval(() => {
        WmTimer();
    }, 33);
}