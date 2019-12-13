"use strict";
var gameGrid = document.getElementById("gameGrid");
var boxes = [];
var playerMoves = [];
var boxMoves = [];
var player;
var moves = 0;
var seconds = 0;
var minutes = 0;
var timer;
startGame();

function startGame() {

    for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 19; x++) {
            const element = document.createElement("div");
            element.classList.add("divBox");
            element.id = "x" + x + "y" + y;

            switch (tileMap01.mapGrid[y][x][0]) {
                case "W":
                    element.classList.add(Tiles.Wall);
                    break;
                case "G":
                    element.classList.add(Tiles.Goal);
                    break;
                case "B":
                    element.classList.add(Tiles.Space);
                    element.classList.add(Entities.Block);
                    boxes.push(element);
                    break;
                case "P":
                    element.classList.add(Tiles.Space);
                    element.classList.add(Entities.Character);
                    player = element;
                    break;
                default:
                    element.classList.add(Tiles.Space);
            }
            gameGrid.appendChild(element);
        }
    }
    document.getElementById("movesText").innerHTML = "Moves: " + moves;
    document.getElementById("timeText").innerHTML = "Time: 00 : 00";
    timer = setInterval(updateTime, 1000);
}


function movePlayer(event) {
    const key = event.keyCode;
    if (key === 37 || key === 38 || key === 39 || key === 40 || key === 13 || key === 32) {
        const yPos = player.id.indexOf("y");
        let x = parseInt(player.id.slice(1, yPos));
        let y = parseInt(player.id.slice(yPos + 1));

        switch (key) {
            case 37:
                checkCollision(x, -1, y, +0);
                break;
            case 38:
                checkCollision(x, +0, y, -1);
                break;
            case 39:
                checkCollision(x, +1, y, +0);
                break;
            case 40:
                checkCollision(x, +0, y, + 1);
                break;
            case 32:
                stepBack();
                break;
            case 13:
                /*
                gameGrid.innerHTML = "";
                while (boxes.length > 0) {
                    boxes.pop();
                }
                */
                boxes.length = [];
                boxes.length = [];
                playerMoves.length = [];
                boxMoves.length = [];
                moves = 0;
                seconds = 0;
                minutes = 0;
                clearInterval(timer);
                startGame();
                break;
        }
    }
}

function checkCollision(x, xChange, y, yChange) {
    x = x + xChange;
    y = y + yChange;
    let nextX = x + xChange;
    let nextY = y + yChange;
    let boxCheck = true;

    boxCheck = checkBoxCollision(x, y, nextX, nextY);

    if (tileMap01.mapGrid[y][x][0] !== "W" && boxCheck === true) {
        playerMoves.push(player);
        player.classList.remove(Entities.Character)
        player = document.getElementById("x" + x + "y" + y);
        player.classList.add(Entities.Character);
        console.log(player);

        moves++;
        document.getElementById("movesText").innerHTML = "Moves: " + moves;
        checkWinCondition();
    }
}

function checkBoxCollision(x, y, nextX, nextY) {
    let noBoxCollide = true;
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].id === "x" + x + "y" + y) {
            for (let l = 0; l < boxes.length; l++) {
                if (boxes[l].id === "x" + nextX + "y" + nextY) {
                    noBoxCollide = false;
                    break;
                }
            }

            if (tileMap01.mapGrid[nextY][nextX][0] !== "W" && noBoxCollide === true) {
                const oldBox = boxes[i];
                const newBox = document.getElementById("x" + nextX + "y" + nextY);
                boxMoves.push([moves, i, oldBox]);
                moveBoxes(oldBox, i, newBox);
                return true;
            }
            else {
                console.log("Not a moveable Box!");
                return false;
            }
        }
    }
    return true;
}

function moveBoxes(oldBox, i, newBox) {
    if (oldBox.classList.contains("entity-block-goal")) {
        oldBox.classList.remove(Entities.BlockDone)
    }
    else {
        oldBox.classList.remove(Entities.Block);
    }
    if (newBox.classList.contains("tile-goal")) {

        newBox.classList.add(Entities.BlockDone);
        console.log(newBox);
    }
    else {
        oldBox.classList.remove(Entities.Block);
        newBox.classList.add(Entities.Block);
        console.log(newBox);
    }
    boxes[i] = newBox;
}

function checkWinCondition() {
    let gameWon = true;
    boxes.forEach(box => {
        if (!box.classList.contains("entity-block-goal")) {
            gameWon = false;
            return;
        }
    });

    if (gameWon === true) {
        clearInterval(timer);
        const h1Element = document.createElement("h1");
        h1Element.id = "winTitle";
        h1Element.innerHTML = "Congratulations!";
        gameGrid.appendChild(h1Element);
    }
}

function stepBack() {
    if (moves > 0) {
        player.classList.remove(Entities.Character);
        player = playerMoves[playerMoves.length - 1];
        player.classList.add(Entities.Character);
        playerMoves.pop();

        moves -= 1;
        document.getElementById("movesText").innerHTML = "Moves: " + moves;

        for (let i = 0; i < boxMoves.length; i++) {
            if (boxMoves[i][0] === moves) {
                let id = boxMoves[i][1];
                moveBoxes(boxes[id], id, boxMoves[i][2]);
                boxMoves.pop();
                break;
            }
        }
    }
}

function updateTime() {
    seconds++;
    while (seconds >= 60) {
        minutes++;
        seconds -= 60;
    }
    let secondsStr = seconds.toString();
    let minutesStr = minutes.toString();

    if (seconds < 10) {
        secondsStr = "0" + seconds.toString();
    }
    if (minutes < 10) {
        minutesStr = "0" + minutes.toString();
    }

    document.getElementById("timeText").innerHTML = "Time: " + minutesStr + " : " + secondsStr;
}