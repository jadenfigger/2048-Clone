let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

window.addEventListener("keydown", keyPressed, false);

let sButton = document.querySelector("#sButton");
let rButton = document.querySelector("#rButton");
let scoreLabel = document.querySelector("#score");
let bestScoreLabel = document.querySelector("#bScore");
let aiCheckBox = document.querySelector("#ai");

let start, pTimeStep;
let gameRunning = false;
let gameScore = 0;
let bestScore = 0;

let aiPlaying = false;

let gridColorStates = {0: "#cdc0b4", 2: "#eee4da", 4: "#ede0c8", 8: "#f2b179", 16: "#f59563", 32: "#f67c5f", 64: "#f65e3b", 128: "#edcf72", 256: "#edcf72", 512: "#edcf72", 1024: "#edc53f", 2048: "#edc22e"};
let cellSpacing = 15;
let cellWidth = (document.querySelector("#myCanvas").width - cellSpacing) / 4;


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

function merge(mat) {
	for (let j = 0; j < 4; j++) {
		if (mat[j] == mat[j+1] && mat[j] != 0) {
			mat[j] *= 2;
			mat[j+1] = 0;
		}
	}
    return mat;
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
				ctx.textAlign = 'center';
				ctx.fillText(gridState[y][x], xTextPos, yTextPos);
			}
		}
	}
}


function keyPressed(e) {
	let keyCode = e.keyCode;
	// up 38
	// right 39
	// down 40
	// left 37
	let newGameBoard = null;
	if (!gameRunning) {
		return;
	} else {
		if (keyCode == 38) {
		} else if (keyCode == 40) {
		} else if (keyCode ==  39) {
		} else if (keyCode == 37) {
		}

	}
	if (gameInfo != undefined) {
		if (arraysEqual(gameInfo[0], gridState)) {
			return;
		}
		gridState = gameInfo[0];
		gameScore = gameInfo[1];
		console.log(gameScore);
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

function permute(str, l, r){
	console.log(str, l, r);
	if (l == r) {
		console.log(str);
	} else {
		for (let i = l; i <= r; i++)
		{
			str = swap(str, l, i);
			permute(str, l + 1, r);
			str = swap(str, l, i);
		}
	}
}
	 
function swap(a, i, j) {
	let temp;
	let charArray = a.split("");
	temp = charArray[i] ;
	charArray[i] = charArray[j];
	charArray[j] = temp;
	return (charArray).join("");
}

sButton.addEventListener("click", function() {
	// gameRunning = true;
	// window.requestAnimationFrame(step);

	// gameScore = 0;
	// gridState = randomBlankGridStart();

	
	 
	let str = "ABC";
	let n = str.length;
	permute(str, 0, n-1);
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


function getCombn(arr, pre) {
	pre = pre || '';
	if (!arr.length) {
		return pre;
	}
	var ans = arr[0].reduce(function(ans, value) {
		return ans.concat(getCombn(arr.slice(1), pre + value));
	}, []);
	return ans;
}


let innerarray = ['2 ', '4 ', '8 ', '16 ', '32 ','64 ', '128 ', '256 ', '512 ', '1024 ', '2048 ', '4096 ', '8192 ', '16384 ', '32768 '];
let allCombn = getCombn([innerarray, innerarray, innerarray, innerarray]);

let preTransf = [];
let postTransf = [];
for (let i = 0; i < allCombn.length; i++) {
	let preState = allCombn[i].split(' ');
	preState.pop();
	preTransf.push(preState);

	let newState = cover_up(preState);
	merge(newState);
	newState = cover_up(newState);
	postTransf.push(newState);
}

				