let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

window.addEventListener("keydown", keyPressed, false);

let sButton = document.querySelector("#sButton");
let rButton = document.querySelector("#rButton");
let scoreLabel = document.querySelector("#score");
let bestScoreLabel = document.querySelector("#bScore");

let start, pTimeStep;
let gameRunning = false;
let gameScore = 0;
let bestScore = 0;

let gridColorStates = {0: "#cdc0b4", 2: "#eee4da", 4: "#ede0c8", 8: "#f2b179", 16: "#f59563", 32: "#f67c5f", 64: "#f65e3b", 128: "#edcf72", 256: "#edcf72", 512: "#edcf72", 1024: "#edc53f", 2048: "#edc22e"};
let cellSpacing = 20;
let cellWidth = 700/4;


let tileMoveVel = 10;

let gridState = randomBlankGridStart();

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (gameScore > bestScore) {
		bestScore = gameScore;
	}
	scoreLabel.innerHTML = "Score: " + gameScore;
	bestScoreLabel.innerHTML = "Best Score: " + bestScore;

	drawGrid();	
}

function drawGrid() {
	for (let y = 0; y < 4; y++) {
		for (let x = 0; x < 4; x++) {
			ctx.fillStyle = gridColorStates[gridState[y][x]];
			let xPos = cellSpacing + (cellWidth * x);
			let yPos = cellSpacing + (cellWidth * y);
			ctx.fillRect(xPos, yPos, cellWidth-cellSpacing, cellWidth-cellSpacing);	
			
			
			if (gridState[y][x] != 0) {
				ctx.fillStyle = "#786e65";
				ctx.font = "90px myFont";
				let xTextPos = xPos+((cellWidth-cellSpacing)/2);
				let yTextPos = yPos+(23*(cellWidth-cellSpacing)/32);
				if (gridState[y][x] > 512) {
					ctx.font = "50px myFont";
					yTextPos = yPos+(5*(cellWidth-cellSpacing)/8)
				}
				ctx.textAlign = 'center';
				ctx.fillText(gridState[y][x], xTextPos, yTextPos);
			}
		}
	}
}


function keyPressed(e) {
	let keyCode = e.keyCode;

	if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
		e.preventDefault();
	}

	// up 38
	// right 39
	// down 40
	// left 37
	let newGameState = undefined;
	if (!gameRunning) {
		return;
	} else {
		if (keyCode == 38) {
			newGameState = up(gridState);
		} else if (keyCode == 40) {
			newGameState = down(gridState);
		} else if (keyCode ==  39) {
			newGameState = right(gridState);
		} else if (keyCode == 37) {
			newGameState = left(gridState);
		}
	}
	if (arraysEqual(newGameState, gridState)) {
		return;
	}
	if (newGameState != undefined) {
		gridState = newGameState;
		let value = 4;
		if (Math.random() < 0.9) {
			value = 2;
		}
		gridState = addTile(gridState, value);

		if (gameScore > bestScore) {
			bestScore = gameScore;
		}
		scoreLabel.innerHTML = "Score: " + gameScore;
		bestScoreLabel.innerHTML = "Best Score: " + bestScore;


		if (isBoardFull(gridState)) {
			gameRunning = !checkIfGameOver();
		}
	}
}


function randomBlankGridStart() {
	let newGrid = [];
	for (let i = 0; i < 4; i++) {
		newGrid.push([]);
		for (var j = 0; j < 4; j++) {
			newGrid[i].push(0);
		}
	}
	newGrid = addTile(newGrid, 2);
	newGrid = addTile(newGrid, 2);
	return newGrid;
}

function isBoardFull(mat) {
	let con = true;
	mat.forEach((outerArray) => {outerArray.forEach((element) => {if (element==0) con=false})});
	
	return con;
}

function addTile(mat, value) {
	if (isBoardFull(mat)) {
		return;
	}

	let x = Math.floor(Math.random() * 4);
	let y = Math.floor(Math.random() * 4);

	while (mat[y][x] != 0) {
		x = Math.floor(Math.random() * 4);
		y = Math.floor(Math.random() * 4);
	}
	mat[y][x] = value;
	return mat;
}

function arraysEqual(a1,a2) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    return JSON.stringify(a1)==JSON.stringify(a2);
}

function enterGameOverState() {
	let gameScore = 0;

	ctx.fillStyle = "rgba(100, 100, 100, 0.6)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font = "100px myFont";
	ctx.textAlign = 'center';
	ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
}

function checkIfGameOver() {
	if (arraysEqual(up(gridState), gridState) && arraysEqual(down(gridState), gridState) && 
	    arraysEqual(right(gridState), gridState) && arraysEqual(left(gridState), gridState)) {
			return true;
		}
	return false;
}
 

function cover_up(mat) {
    let newGrid = [];
    for (let j = 0; j < 4; j++) {
        partial_new = [];
        for (let i = 0; i < 4; i++) {
            partial_new.push(0);
		}
        newGrid.push(partial_new);
	}
	done = false;
    for (let i = 0; i < 4; i++) {
        count = 0;
        for (let j = 0; j < 4; j++) {
            if (mat[i][j] != 0) {
                newGrid[i][count] = mat[i][j];
                if (j != count) {
                    done = true;
				}
                count += 1;
			}
		}
	}
    return [newGrid, done];
}

function merge(mat, done) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (mat[i][j] == mat[i][j+1] && mat[i][j] != 0) {
				gameScore += mat[i][j] * 2;
                mat[i][j] *= 2;
                mat[i][j+1] = 0;
                done = true;
			}
		}
	}
    return [mat, done];
}

function up(game) {
    game = transpose(game);
    let gameInfo = cover_up(game);
    gameInfo = merge(gameInfo[0], gameInfo[1]);
    game = cover_up(gameInfo[0])[0];
    game = transpose(game);
    return game;
}

function down(game) {
	game = reverse(transpose(game));
    let gameInfo = cover_up(game);
    gameInfo = merge(gameInfo[0], gameInfo[1]);
    game = cover_up(gameInfo[0])[0];
    game = transpose(reverse(game));
    return game;
}

function left(game) {
    let gameInfo = cover_up(game);
    gameInfo = merge(gameInfo[0], gameInfo[1]);
    game = cover_up(gameInfo[0])[0];
    return game;
}

function right(game) {
    game = reverse(game);
    gameInfo = cover_up(game);
    gameInfo = merge(gameInfo[0], gameInfo[1]);
    game = cover_up(gameInfo[0])[0];
    game = reverse(game);
    return game;
}


function transpose(mat) {
    let newList = [];
    for (let i = 0; i < 4; i++) {
        newList.push([]);
        for (let j = 0; j < 4; j++) {
            newList[i].push(mat[j][i]);
		}
	}
    return newList;
}


function reverse(mat) {
    let newList = [];
    for (let i = 0; i < 4; i++) {
        newList.push([]);
        for (let j = 0; j < 4; j++) {
			newList[i].push(mat[i][4-j-1]);
		}
	}
    return newList;
}


function step(timeStep) {
	draw();

	if (gameRunning) {
		window.requestAnimationFrame(step);
	} else {
		enterGameOverState();
	}

}

sButton.addEventListener("click", function() {
	gameRunning = true;
	window.requestAnimationFrame(step);

	gameScore = 0;
	gridState = randomBlankGridStart();

})

rButton.addEventListener("click", function() {
	if (!gameRunning && bestScore == 0) {
		return;
	}
	gameRunning = true;
	window.requestAnimationFrame(step);

	gameScore = 0;
	gridState = randomBlankGridStart();

})