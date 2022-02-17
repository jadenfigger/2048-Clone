
function findBestMove(grid) {
	let bestMove = -1;
	let bestScore = 0;

	for (let move = 0; move < 4; move++) {
		var score = multiRandomRun(grid, move, runsTextBox.value);
		if (score >= bestScore) {
			bestScore = score;
			bestMove = move;
		}
	}

	return bestMove;
}

function multiRandomRun(grid, move, runs) {
	console.log(move);
	let total = 0.0;
	for (let i = 0; i < runs; i++) {
		tempScore = 0;
		total += randomRun(grid, move);
	}

	return total / runs;
}

function randomRun(grid, move) {
	let g = simulateMove(grid, move);
	if (_.isEqual(grid, g)) {
		return -1;
	}
	let score = tempScore;
	addTile(g, Math.random() < 0.9 ? 2 : 4);

	let moves = 1;
	while (true) {
		if (checkIfGameOver(g)) break;

		tempScore = 0;
		let ng = simulateMove(g, Math.floor(Math.random() * 4));
		if (_.isEqual(ng, g)) continue;

		g = ng.clone();
		addTile(g, Math.random() < 0.9 ? 2 : 4)
		score += tempScore;
		moves++;
	}
	return score;
}


function simulateMove(board, dir) {
	let newGridState = undefined;
	switch(dir) {
		case 0: 
			newGridState = transpose(move(transpose(board.clone())));
			break;
		case 1:
			newGridState = reverse(move(reverse(board.clone())));
			break;
		case 2:
			newGridState = transpose(reverse(move(reverse(transpose(board.clone())))));
			break;
		case 3:
			newGridState = move(board.clone());
			break;
	}
	return newGridState;
}
