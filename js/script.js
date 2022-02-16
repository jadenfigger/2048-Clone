window.addEventListener("keydown", keyPressed, false);

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let sButton = document.querySelector("#sButton");
let rButton = document.querySelector("#rButton");
let scoreLabel = document.querySelector("#score");
let bestScoreLabel = document.querySelector("#bScore");

let gameRunning = false;
let gameScore = 0;
let bestScore = 0;

let gridColorStates = {0: "#cdc0b4", 2: "#eee4da", 4: "#ede0c8", 8: "#f2b179", 16: "#f59563", 32: "#f67c5f", 64: "#f65e3b", 128: "#edcf72", 256: "#edcf72", 512: "#edcf72", 1024: "#edc53f", 2048: "#edc22e"};
let cellSpacing = 15;
let cellWidth = (document.querySelector("#myCanvas").width - cellSpacing) / 4;

let gridState;

let depth = 2; 

Array.prototype.clone = function() {
	let newArray = [];

	for (var i = 0; i < this.length; i++)
		newArray[i] = this[i].slice();
	
	return newArray;
}

function randomBlankGridStart() {
	let newGrid = [];
	for (let i = 0; i < 4; i++) {
		newGrid.push([]);
		for (var j = 0; j < 4; j++) {
			newGrid[i].push(0);
		}
	}
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
}

function hexToHSL(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	  r = parseInt(result[1], 16);
	  g = parseInt(result[2], 16);
	  b = parseInt(result[3], 16);
	  r /= 255, g /= 255, b /= 255;
	  var max = Math.max(r, g, b), min = Math.min(r, g, b);
	  var h, s, l = (max + min) / 2;
	  if(max == min){
		h = s = 0; // achromatic
	  }else{
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch(max){
		  case r: h = (g - b) / d + (g < b ? 6 : 0); break;
		  case g: h = (b - r) / d + 2; break;
		  case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	  }
	var HSL = new Object();
	HSL['h']=h;
	HSL['s']=s;
	HSL['l']=l;
	return HSL;
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

function cover_up(mat) {
    let newGrid = [0, 0, 0, 0];
    let count = 0;
	for (let j = 0; j < 4; j++) {
		if (mat[j] != 0) {
			newGrid[count] = mat[j];
			count += 1;
		}
	}
    return newGrid;
}

function checkIfGameOver(arr) {
	for (let dir = 1; dir <= 4; dir++) {
		let nGrid = simulateMove(arr, dir);
		if (!_.isEqual(nGrid, gridState)) {
			return false;
		}
	}
	return true;
} 

function merge(mat) {
	for (let j = 0; j < 4; j++) {
		if (mat[j] === mat[j+1] && mat[j] !== 0) {
			mat[j] *= 2;
			mat[j+1] = 0;
		}
	}
    return mat;
}

function move(arr) {
	let newArray = [];
	for (let x = 0; x < 4; x++) {
		newArray.push(cover_up(merge(cover_up(arr[x]))));
	}
	return newArray;
}

function keyPressed(e) {
	let keyCode = e.keyCode;
	// up 38
	// right 39
	// down 40
	// left 37

	// let newGridState = randomBlankGridStart();
	// if (keyCode == 38) {
	// 	newGridState = transpose((move(JSON.parse(JSON.stringify(transpose(gridState))))));
	// } else if(keyCode == 39) {
	// 	newGridState = reverse(move(JSON.parse(JSON.stringify(reverse(gridState)))));
	// } else if(keyCode == 40) {
	// 	newGridState = transpose(reverse(move(JSON.parse(JSON.stringify(reverse(transpose(gridState)))))));
	// } else if(keyCode == 37) {
	// 	newGridState = move(JSON.parse(JSON.stringify(gridState)));
	// }
	e.preventDefault();
	let newGridState = simulateMove(gridState, calculateNextMove(gridState, depth));

	if (_.isEqual(newGridState, gridState)) {
		return;
	}

	gridState = newGridState.clone();

	let value = 2;
	if (Math.random() < 0.1) {
		value = 4;
	}
	addTile(gridState, value);
	
}

function enterGameOverState() {
	window.cancelAnimationFrame();
}

function step(timeStep) {
	draw();

	let start = performance.now();
	let dir = calculateNextMove(gridState, depth);
	if (dir == -1) {
	}
	let newGridState = simulateMove(gridState, dir);

	if (checkIfGameOver(gridState)) {
		gameRunning = false;
		console.log("Game Over");
		return;
	}

	if (_.isEqual(newGridState, gridState)) {
		return;
	}

	gridState = newGridState.clone();


	let value = 2;
	if (Math.random() < 0.1) {
		value = 4;
	}
	addTile(gridState, value);

	if (gameRunning) {
		window.requestAnimationFrame(step);
	} else {
		enterGameOverState();
	}
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
				ctx.font = "70px myFont";
				let xTextPos = xPos+((cellWidth-cellSpacing)/2);
				let yTextPos = yPos+(24*(cellWidth-cellSpacing)/32);
				if (gridState[y][x] > 512) {
					ctx.font = "40px myFont";
					yTextPos = yPos+(5*(cellWidth-cellSpacing)/8)
				}
				if (hexToHSL(gridColorStates[gridState[y][x]]).L < 0.68) {
					ctx.fillStyle = "#f9f6f2";
				} else {
					ctx.fillStyle = "#776e65";
				}
				ctx.textAlign = 'center';
				ctx.fillText(gridState[y][x], xTextPos, yTextPos);
			}
		}
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	scoreLabel.innerHTML = "Score: " + gameScore;
	bestScoreLabel.innerHTML = "Best Score: " + bestScore;

	drawGrid();	
}

sButton.addEventListener("click", function() {
	gameRunning = true;
	gameScore = 0;
	gridState = randomBlankGridStart();
	addTile(gridState, 2);
	addTile(gridState, 2);

	window.requestAnimationFrame(step);
})

rButton.addEventListener("click", function() {
	if (!gameRunning && bestScore == 0) {
		return;
	}

	gameRunning = true;
	gameScore = 0;
	gridState = randomBlankGridStart();
	addTile(gridState, 2);
	addTile(gridState, 2);

	window.requestAnimationFrame(step);
})
