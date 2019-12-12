"use strict";
var gameGrid = document.getElementById("gameGrid");
var playerId = 0;
var boxes = [];
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
                    boxes.push(element.id);
                    break;
                case "P":
                    element.classList.add(Tiles.Space);
                    element.classList.add(Entities.Character);
                    playerId = element.id;
                    break;
                default:
                    element.classList.add(Tiles.Space);
            }
            gameGrid.appendChild(element);
        }
    }
}


function movePlayer(event) {
    const key = event.keyCode;
    if (key === 37 || key === 38 || key === 39 || key === 40 || key === 13) {
        const yPos = playerId.indexOf("y");
        let x = parseInt(playerId.slice(1, yPos));
        let y = parseInt(playerId.slice(yPos + 1));

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
            case 13:
                gameGrid.innerHTML = "";
                while (boxes.length > 0) {
                    boxes.pop();
                }
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
        const currentPlayerPos = document.getElementById(playerId);
        currentPlayerPos.classList.remove(Entities.Character)
        playerId = "x" + x + "y" + y;
        const newPlayerPos = document.getElementById(playerId);
        newPlayerPos.classList.add(Entities.Character);
        console.log(newPlayerPos);
    }
}

function checkBoxCollision(x, y, nextX, nextY) {
    let noBoxCollide = true;
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i] === "x" + x + "y" + y) {
            for (let l = 0; l < boxes.length; l++) {
                if (boxes[l] === "x" + nextX + "y" + nextY) {
                    noBoxCollide = false;
                    break;
                }
            }

            if (tileMap01.mapGrid[nextY][nextX][0] !== "W" && noBoxCollide === true) {
                const oldBoxPos = document.getElementById(boxes[i]);
                boxes[i] = "x" + nextX + "y" + nextY;
                let goalBox = checkGoalBoxes(oldBoxPos, boxes[i], x, y, nextX, nextY);

                if (goalBox === false) {
                    oldBoxPos.classList.remove(Entities.Block);
                    const newBoxPos = document.getElementById(boxes[i]);
                    newBoxPos.classList.add(Entities.Block);
                    console.log(newBoxPos);
                }
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

function checkGoalBoxes(oldBoxPos, boxId, oldX, oldY, nextX, nextY) {
    if (tileMap01.mapGrid[oldY][oldX][0] === "G") {
        oldBoxPos.classList.remove(Entities.BlockDone)
    }
    else {
        oldBoxPos.classList.remove(Entities.Block);
    }
    if (tileMap01.mapGrid[nextY][nextX][0] === "G") {

        const newBoxPos = document.getElementById(boxId);
        newBoxPos.classList.add(Entities.BlockDone);
        console.log(newBoxPos);

        checkWinCondition();
        return true;
    }
    return false;
}

function checkWinCondition() {
    let gameWon = true;
    for (let i = 0; i < boxes.length; i++) {
        let box = document.getElementById(boxes[i]);
        if (!box.classList.contains("entity-block-goal")) {
            gameWon = false;
            break;
        }
    }
    if (gameWon === true) {
        const h1Element = document.createElement("h1");
        h1Element.id = "winTitle";
        h1Element.innerHTML = "Congratulations!";
        gameGrid.appendChild(h1Element);
    }
}