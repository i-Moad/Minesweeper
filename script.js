const container = document.getElementById('container');
const easyNumberOfVictory = document.getElementById('easyNumberOfVictory');
const normalNumberOfVictory = document.getElementById('normalNumberOfVictory');
const hardNumberOfVictory = document.getElementById('hardNumberOfVictory');
const expertNumberOfVictory = document.getElementById('expertNumberOfVictory');
const easyBestTime = document.getElementById('easyBestTime');
const normalBestTime = document.getElementById('normalBestTime');
const hardBestTime = document.getElementById('hardBestTime');
const expertBestTime = document.getElementById('expertBestTime');
const restartBtn = document.getElementById('restart');
const timer = document.getElementById('timer');
const difficultyBtns = document.getElementById('difficulty')
const BtnEasy = document.getElementById('BtnEasy');
const BtnNormal = document.getElementById('BtnNormal');
const BtnHard = document.getElementById('BtnHard');
const BtnExpert = document.getElementById('BtnExpert');
const processedCells = new Set();
const bombImageSrc = "./assets/bomb.png";
const flagImageSrc = "./assets/flag.png";
const questionMarkSrc = "./assets/questionMark.png";
const bombs = [];

let gameEnd = false;
let gameDifficulty = "easy";
let progress = 0;
let maxProgress = 62;
let maxBombs = 10;
let maxAxis = { xAxis: 8, yAxis: 9 };
let start = false;
let startTime;
let timerInterval;
let currentTime = "--:--:---";
let statistics = {
    easyMode: { numberOfvictory: 0, bestTime: "--:--:---" },
    normalMode: { numberOfvictory: 0, bestTime: "--:--:---" },
    hardMode: { numberOfvictory: 0, bestTime: "--:--:---" },
    expertMode: { numberOfvictory: 0, bestTime: "--:--:---" },
    lastDificculty: "easy"
};


// Save function to store all statistics data at once
function saveData() {
    localStorage.setItem("statistics", JSON.stringify(statistics));
}


// Load function to retrieve all statistics data at once
function loadData() {
    let savedData = localStorage.getItem("statistics");
    if (savedData) {
        statistics = JSON.parse(savedData);
    }
}


function displayData() {
    easyNumberOfVictory.innerText = statistics.easyMode.numberOfvictory;
    easyBestTime.innerText = statistics.easyMode.bestTime;
    normalNumberOfVictory.innerText = statistics.normalMode.numberOfvictory;
    normalBestTime.innerText = statistics.normalMode.bestTime;
    hardNumberOfVictory.innerText = statistics.hardMode.numberOfvictory;
    hardBestTime.innerText = statistics.hardMode.bestTime;
    expertNumberOfVictory.innerText = statistics.expertMode.numberOfvictory;
    expertBestTime.innerText = statistics.expertMode.bestTime;
}


// Reset function to clear all saved data
function resetData() {
    localStorage.removeItem("statistics");
}


// Function to convert time from MM:SS:MMM format to milliseconds
function timeToMilliseconds(time) {
    if (time === "--:--:---") return Infinity;  // Consider default time as the worst possible (infinity)
    let [minutes, seconds, milliseconds] = time.split(/[:.]/).map(Number);
    return (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
}


// Function to update the best time for a given mode if BestTimeEver is better
function updateBestTime(mode) {
    let currentBestTime = statistics[mode].bestTime;
    if (timeToMilliseconds(currentTime) < timeToMilliseconds(currentBestTime)) {
        statistics[mode].bestTime = currentTime;
    }
}


function prepareGameBoard() {
    difficulty = statistics.lastDificculty;
    applyDifficulty(difficulty)
}


function applyDifficulty(difficulty) {
    restart();
    Array.from(difficultyBtns.children).forEach(btn => {
        btn.classList.remove('selected');
    });

    if (difficulty == "easy") {
        gameDifficulty = "easy";
        statistics.lastDificculty = "easy";
        BtnEasy.classList.add('selected');
        maxProgress = 62;
        maxBombs = 10;
        maxAxis.xAxis = 8;
        maxAxis.yAxis = 9;
        container.innerHTML = '';
        removeClassAtPosition(container, 1);
        container.classList.add('easy');

        for (let i = 0; i < maxAxis.yAxis; i++) {
            for (let j = 0; j < maxAxis.xAxis; j++) {
                container.innerHTML += `<div class="gridHide X-${j} Y-${i} cell"></div>`;
            }
        }

        saveData();
    }

    if (difficulty == "normal") {
        gameDifficulty = "normal";
        statistics.lastDificculty = "normal";
        BtnNormal.classList.add('selected');
        maxProgress = 100;
        maxBombs = 20;
        maxAxis.xAxis = 10;
        maxAxis.yAxis = 12;
        container.innerHTML = '';
        removeClassAtPosition(container, 1);
        container.classList.add('normal');

        for (let i = 0; i < maxAxis.yAxis; i++) {
            for (let j = 0; j < maxAxis.xAxis; j++) {
                container.innerHTML += `<div class="gridHide X-${j} Y-${i} cell"></div>`;
            }
        }

        saveData();
    }

    if (difficulty == "hard") {
        gameDifficulty = "hard";
        statistics.lastDificculty = "hard";
        BtnHard.classList.add('selected');
        maxProgress = 138;
        maxBombs = 30;
        maxAxis.xAxis = 12;
        maxAxis.yAxis = 14;
        container.innerHTML = '';
        removeClassAtPosition(container, 1);
        container.classList.add('hard');

        for (let i = 0; i < maxAxis.yAxis; i++) {
            for (let j = 0; j < maxAxis.xAxis; j++) {
                container.innerHTML += `<div class="gridHide X-${j} Y-${i} cell"></div>`;
            }
        }

        saveData();
    }

    if (difficulty == "expert") {
        gameDifficulty = "expert";
        statistics.lastDificculty = "expert";
        BtnExpert.classList.add('selected');
        maxProgress = 155;
        maxBombs = 40;
        maxAxis.xAxis = 13;
        maxAxis.yAxis = 15;
        container.innerHTML = '';
        removeClassAtPosition(container, 1);
        container.classList.add('expert');

        for (let i = 0; i < maxAxis.yAxis; i++) {
            for (let j = 0; j < maxAxis.xAxis; j++) {
                container.innerHTML += `<div class="gridHide X-${j} Y-${i} cell"></div>`;
            }
        }

        saveData();
    }
}


// Function to start the timer
function startTimer() {
    startTime = new Date().getTime(); // Record the start time
    timerInterval = setInterval(updateTimer, 1); // Update the timer every millisecond
}


// Function to update the timer display
function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;

    // Calculate minutes, seconds, and milliseconds
    const minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const milliseconds = elapsedTime % 1000;

    // Display the timer
    timer.innerHTML = `<span id="currentTime">${padZero(minutes)}:${padZero(seconds)}:${padMilliseconds(milliseconds)}<span>`;
}


// Function to pad numbers with leading zeros
function padZero(number) {
    return number < 10 ? "0" + number : number;
}


// Function to pad milliseconds with leading zeros
function padMilliseconds(number) {
    if (number < 10) return "00" + number;
    else if (number < 100) return "0" + number;
    else return number;
}


// Function to stop the timer
function stopTimer() {
    clearInterval(timerInterval);
}


function resetTime() {
    stopTimer();
    timer.innerHTML = `<span>00:00:000<span>`;
}


function restart() {
    // Get all div elements inside the container
    const divs = container.getElementsByTagName('div');

    // Loop through each div
    for (let i = 0; i < divs.length; i++) {
        const div = divs[i];

        // Check if the div has the 'gridShow' class
        if (div.classList.contains('gridShow')) {
            // Replace 'gridShow' with 'gridHide'
            div.classList.replace('gridShow', 'gridHide');
        }

        if (div.classList.contains('lose')) {
            removeClassAtPosition(div, 4);
        }

        if (div.classList.contains('win')) {
            removeClassAtPosition(div, 4);
        }

        if (div.classList.contains('N')) {
            // Replace 'gridShow' with 'gridHide'
            removeClassAtPosition(div, 5);
            removeClassAtPosition(div, 4);
        }

        clearDivContent(div);
    }

    resetTime();
    bombs.length = 0;
    start = false;
    gameEnd = false;
    progress = 0;
    processedCells.clear();
}


function clearDivContent(div) {
    div.innerHTML = '';
}


function removeClassAtPosition(element, position) {
    // Check if the position is valid
    if (position >= 0 && position < element.classList.length) {
        // Get the class name at the specified position
        const classNameToRemove = element.classList.item(position);
        
        // Remove the class
        element.classList.remove(classNameToRemove);
    } else {
        console.error("Invalid position");
    }
}


function win() {
    bombs.forEach(coords => {
        // Find the div with the specific coordinates
        const targetDiv = findDivWithCoord(coords);
        targetDiv.classList.add("win");
    });

    if (gameDifficulty == "easy") {
        statistics.easyMode.numberOfvictory += 1;
        currentTime = document.getElementById('currentTime').innerText;
        updateBestTime("easyMode");
    }

    if (gameDifficulty == "normal") {
        statistics.normalMode.numberOfvictory += 1;
        currentTime = document.getElementById('currentTime').innerText;
        updateBestTime("normalMode");
    }

    if (gameDifficulty == "hard") {
        statistics.hardMode.numberOfvictory += 1;
        currentTime = document.getElementById('currentTime').innerText;
        updateBestTime("hardMode");
    }

    if (gameDifficulty == "expert") {
        statistics.expertMode.numberOfvictory += 1;
        currentTime = document.getElementById('currentTime').innerText;
        updateBestTime("expertMode");
    }
}


function lose(targetCoord) {
    showBombs();
    divRed = findDivWithCoord(targetCoord);
    divRed.classList.add("lose");
    gameEnd = true;
    progress = 0;
    stopTimer();
}


function coordinatesAreEqual(coord1, coord2) {
    return coord1.x === coord2.x && coord1.y === coord2.y;
}


function findDivWithCoord(coords) {
    // Find the div with the specific coordinates
    const targetDiv = Array.from(container.getElementsByClassName("cell")).find(div => {
        return div.classList.contains(`X-${coords.x}`) && div.classList.contains(`Y-${coords.y}`);
    });

    return targetDiv;
}


function switchToGridShow(targetCoord) {
    const key = `${targetCoord.x},${targetCoord.y}`;

    if (processedCells.has(key)) {
        return;
    }

    processedCells.add(key);

    const target = findDivWithCoord(targetCoord);
    
    if (target == undefined) {
        return;
    }

    target.classList.replace("gridHide", "gridShow");

    progress += 1;

    if (target.classList.contains(`N`)) {
        const bombNum = parseInt(target.classList[4].split('')[1]);
        target.innerHTML = `<p>${bombNum}</p>`;
    }
    else if (isObjectInList(targetCoord, bombs)) {
        return;
    }
    else {
        showArea(target);
    }
}


function showArea(target) {
    const targetX = parseInt(target.classList[1].split('-')[1]);
    const targetY = parseInt(target.classList[2].split('-')[1]);
    const targetCoord = {
        x: targetX,
        y: targetY
    }
    if (!target.classList.contains(`N`)) {
        if (isObjectInList(targetCoord, bombs)) {
            lose(targetCoord);
            return;
        }
        const targetArea = [
            { x: targetX, y: targetY },
            { x: targetX, y: targetY+1 },
            { x: targetX, y: targetY-1 },
            { x: targetX+1, y: targetY },
            { x: targetX+1, y: targetY+1 },
            { x: targetX+1, y: targetY-1 },
            { x: targetX-1, y: targetY },
            { x: targetX-1, y: targetY+1 },
            { x: targetX-1, y: targetY-1 }
        ];
        targetArea.forEach(one => {
            switchToGridShow(one);
        });
    }
    else {
        switchToGridShow(targetCoord);
    }
}


function countEqualObjects(list1, list2) {
    let count = 0;
    
    list1.forEach(obj1 => {
        list2.forEach(obj2 => {
            if (coordinatesAreEqual(obj1, obj2)) {
                count++;
            }
        });
    });

    return count;
}


function isObjectInList(obj, list) {
    return list.some(item => coordinatesAreEqual(item, obj));
}


function showBombs() {
    bombs.forEach(coords => {
        // Find the div with the specific coordinates
        const targetDiv = findDivWithCoord(coords);

        switchToGridShow(coords);

        // Add the 'bomb' class to the target div if found
        if (targetDiv) {
            const bombImage = document.createElement('img');
            bombImage.src = bombImageSrc;
            bombImage.alt = "bomb";
            bombImage.classList.add('bomb');
            bombImage.draggable = false;
            bombImage.oncontextmenu = function() {
                return false;
            };
            targetDiv.appendChild(bombImage);
        } else {
            console.log('Target div not found.');
        }
    });
}


function showFlag(target) {
    const FlagImage = document.createElement('img');
    FlagImage.src = flagImageSrc;
    FlagImage.alt = "flag";
    FlagImage.classList.add('flag');
    FlagImage.draggable = false;
    FlagImage.oncontextmenu = function() {
        return false;
    };
    target.appendChild(FlagImage);
}


function showQuestionMark(target) {
    const QuestionMarkImage = document.createElement('img');
    QuestionMarkImage.src = questionMarkSrc;
    QuestionMarkImage.alt = "questionMark";
    QuestionMarkImage.classList.add('questionMark');
    QuestionMarkImage.draggable = false;
    QuestionMarkImage.oncontextmenu = function() {
        return false;
    };
    target.parentNode.appendChild(QuestionMarkImage);
    target.remove();
}


function addNumberOfBombs() {
    for (let i = 0; i < maxAxis.yAxis; i++) {
        for (let j = 0; j < maxAxis.xAxis; j++) {
            if (isObjectInList({x:j, y:i}, bombs)) {
                continue;
            }

            let x = j;
            let y = i;
            const areaCoord = [
                { x: x, y: y+1 },
                { x: x, y: y-1 },
                { x: x+1, y: y },
                { x: x+1, y: y+1 },
                { x: x+1, y: y-1 },
                { x: x-1, y: y },
                { x: x-1, y: y+1 },
                { x: x-1, y: y-1 }
            ];
            const numberOfBombs = countEqualObjects(areaCoord, bombs);
            const targetDiv = findDivWithCoord({x: x, y: y});

            if (numberOfBombs == 0){
                continue;
            }

            if (targetDiv) {
                targetDiv.classList.add(`N${numberOfBombs}`);
                targetDiv.classList.add(`N`);
            }
            else {
                console.log('Target div not found.');
            }
        }
    }
}


document.addEventListener("DOMContentLoaded", () => {
    loadData();
    prepareGameBoard();
    displayData();
});


// Right click role
container.oncontextmenu = function(e) {
    e.preventDefault();
    const gridTarget = e.target;

    if (gridTarget.outerHTML == `<img src="./assets/questionMark.png" alt="questionMark" class="questionMark" draggable="false">`) {
        gridTarget.remove();
        return;
    }
    
    if (gridTarget.outerHTML == `<img src="./assets/flag.png" alt="flag" class="flag" draggable="false">`) {
        showQuestionMark(gridTarget);
        return;
    }

    if (gridTarget.classList.contains('gridHide')) {
        showFlag(gridTarget);
    }
    
    return;
};


document.addEventListener('keypress', (e) => {
    if(e.key == "r") {
        restart();
    }
});


container.addEventListener('click', (e) => {
    if (gameEnd) {
        return;
    }

    const gridTarget = e.target;

    if (!gridTarget.classList.contains('gridHide')) {
        return;
    }

    if (gridTarget.outerHTML == `<img src="./assets/questionMark.png" alt="questionMark" class="questionMark" draggable="false">` || gridTarget.outerHTML == `<img src="./assets/flag.png" alt="flag" class="flag" draggable="false">`) {
        return;
    }

    if (!start) {
        const startPointX = parseInt(gridTarget.classList[1].split('-')[1]);
        const startPointY = parseInt(gridTarget.classList[2].split('-')[1]);
        const startArea = [
            { x: startPointX, y: startPointY },
            { x: startPointX, y: startPointY+1 },
            { x: startPointX, y: startPointY-1 },
            { x: startPointX+1, y: startPointY },
            { x: startPointX+1, y: startPointY+1 },
            { x: startPointX+1, y: startPointY-1 },
            { x: startPointX-1, y: startPointY },
            { x: startPointX-1, y: startPointY+1 },
            { x: startPointX-1, y: startPointY-1 }
        ];

        for (let i = 0; i < maxBombs; i++) {
            const bombCoord = {};
            bombCoord.x = Math.floor(Math.random() * maxAxis.xAxis);
            bombCoord.y = Math.floor(Math.random() * maxAxis.yAxis);
            
            const isAlreadyInBombs = isObjectInList(bombCoord ,bombs);
            const isInTheStartArea = isObjectInList(bombCoord ,startArea);
            
            if (!isAlreadyInBombs && !isInTheStartArea) {
                bombs.push(bombCoord);
                continue;
            }
            
            i -= 1;
        }

        addNumberOfBombs();
        
        start = true;

        startTimer();
    }

    if (gridTarget.classList[0] == "gridHide") {
        showArea(gridTarget);
    }

    if (progress >= maxProgress) {
        gameEnd = true;
        stopTimer();
        win();
        saveData();
        displayData();
    }
});


restartBtn.addEventListener("click", () => {
    restart();
});