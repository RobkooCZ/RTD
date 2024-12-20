/// <reference path="gameMap.ts" />

function returnBasicMap(): number[][]{
    return [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    ]
}

function returnBasicMapPath(){
    return [
        { x: 50, y: 300 }, //first straight 
        { x: 100, y: 300 },
        { x: 150, y: 300 },
        { x: 200, y: 300 },
        { x: 250, y: 300 },
        { x: 300, y: 300 },
        { x: 350, y: 300 },
        { x: 400, y: 300 },
        { x: 450, y: 300 },
        { x: 450, y: 250 }, //straight up
        { x: 450, y: 200 },
        { x: 450, y: 150 },
        { x: 450, y: 100 },
        { x: 450, y: 50 }, 
        { x: 400, y: 50 }, // straight left
        { x: 350, y: 50 },
        { x: 300, y: 50 },
        { x: 250, y: 50 },
        { x: 200, y: 50 },
        { x: 200, y: 100 }, // straight down
        { x: 200, y: 150 },
        { x: 200, y: 200 },
        { x: 200, y: 250 },
        { x: 200, y: 300 },
        { x: 200, y: 350 },
        { x: 200, y: 400 },
        { x: 200, y: 450 },
        { x: 200, y: 500 },
        { x: 200, y: 550 },
        { x: 200, y: 600 },
        { x: 200, y: 650 },
        { x: 200, y: 700 },
        { x: 200, y: 750 },
        { x: 150, y: 750 }, // straight left
        { x: 100, y: 750 },
        { x: 50, y: 750 },
        { x: 50, y: 700 }, // straight up
        { x: 50, y: 650 },
        { x: 50, y: 600 },
        { x: 50, y: 550 },
        { x: 100, y: 550 }, // straight right
        { x: 150, y: 550 },
        { x: 200, y: 550 },
        { x: 250, y: 550 },
        { x: 300, y: 550 },
        { x: 350, y: 550 },
        { x: 400, y: 550 },
        { x: 450, y: 550 },
        { x: 500, y: 550 },
        { x: 550, y: 550 },
        { x: 600, y: 550 },
        { x: 650, y: 550 },
        { x: 700, y: 550 },
        { x: 750, y: 550 },
        { x: 800, y: 550 },
        { x: 850, y: 550 },
        { x: 900, y: 550 },
        { x: 950, y: 550 },
        { x: 950, y: 500 }, // straight up
        { x: 950, y: 450 },
        { x: 950, y: 400 },
        { x: 950, y: 350 },
        { x: 950, y: 300 },
        { x: 950, y: 250 },
        { x: 1000, y: 250 }, // straight right
        { x: 1050, y: 250 },
        { x: 1100, y: 250 },
        { x: 1150, y: 250 },
        { x: 1150, y: 300 }, // straight down
        { x: 1150, y: 350 },
        { x: 1150, y: 400 },
        { x: 1150, y: 450 },
        { x: 1150, y: 500 },
        { x: 1150, y: 550 },
        { x: 1150, y: 600 },
        { x: 1150, y: 650 },
        { x: 1150, y: 700 },
        { x: 1150, y: 750 },
        { x: 1150, y: 800 },
        { x: 1150, y: 850 },
    ];
}

function returnEasyMap(): number[][]{
    return [
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 0, 0, 1, 0, 1, 0, 0],
        [0, 0, 1, 0, 0, 1, 0, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
    ]
};

function returnEasyMapPath(){
    return [
        { x: 350, y: 450 },
    { x: 350, y: 400 },
    { x: 350, y: 350 },
    { x: 350, y: 300 },
    { x: 350, y: 250 },
    { x: 350, y: 200 },
    { x: 300, y: 200 },
    { x: 250, y: 200 },
    { x: 200, y: 200 },
    { x: 150, y: 200 },
    { x: 100, y: 200 },
    { x: 100, y: 250 },
    { x: 100, y: 300 },
    { x: 100, y: 350 },
    { x: 150, y: 350 },
    { x: 200, y: 350 },
    { x: 250, y: 350 },
    { x: 250, y: 300 },
    { x: 250, y: 250 },
    { x: 250, y: 200 },
    { x: 250, y: 150 },
    { x: 250, y: 100 },
    { x: 250, y: 50 },
    { x: 250, y: 0 },
    ];
}