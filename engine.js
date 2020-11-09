'use strict';

var ENGINE = ENGINE || {}; 
ENGINE.GR = {};

ENGINE.mCurrentFrame = 0;
ENGINE.mFPS = 60;
ENGINE.mWidth = 128;
ENGINE.mHeight = 120;

ENGINE.onTimer = () => {}

ENGINE.init = () => {
    ENGINE.GR.mCanvas = document.createElement('canvas');
    ENGINE.GR.mCanvas.width = ENGINE.mWidth;
    ENGINE.GR.mCanvas.height = ENGINE.mHeight;
    ENGINE.GR.mG = ENGINE.GR.mCanvas.getContext('2d');

    requestAnimationFrame(ENGINE.windowTimer);
}

// IE
ENGINE.sign = function(value) {
    if (value == 0) return 0;
    if (value < 0) return -1;

    return 1;
}
// EI

ENGINE.windowTimer = () => {
    if (!ENGINE.mCurrentStart) {
        ENGINE.mCurrentStart = performance.now();
    }

    let d = Math.floor((performance.now() - ENGINE.mCurrentStart) * ENGINE.mFPS / 1000 - ENGINE.mCurrentFrame);

    if (d > 0) {
        ENGINE.onTimer(d);

        ENGINE.mCurrentFrame += d;
    } 
        
    requestAnimationFrame(ENGINE.windowTimer);
}

export default ENGINE;