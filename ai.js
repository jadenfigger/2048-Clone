let counter = 0;

function calculateNextMove(gs, depth) {
	counter = 0;
	let bestMove = -1;
	let bestScore = 0;


	for (let move = 1; move <= 4; move++) {
		let score = calculateScore(gs, move, depth);

		if (score > bestScore) {
			bestScore = score;
			bestMove = move;
		}
	}
	return [bestMove, counter];
}

function calculateScore(board, move, depth) {
	newBoard = simulateMove(board, move);
	if (_.isEqual(newBoard, board)) {
		return 0;
	}
	return generateScore(newBoard, 0, depth);
}

function simulateMove(board, dir) {
	let newGridState = undefined;
	switch(dir) {
		case 1: 
			newGridState = transpose(move(board.clone()));
			break;
		case 2:
			newGridState = reverse(move(board.clone()));
			break;
		case 3:
			newGridState = transpose(reverse(move(board.clone())));
			break;
		case 4:
			newGridState = move(board.clone());
			break;
	}
	counter++;
	return newGridState;
}

function generateScore(board, curDepth, maxDepth) {
	if (curDepth == maxDepth) {
		let finalScore = calculateFinalScore(board);

		return finalScore;
	}

	totalScore = 0;
	for (let y = 0; y < 4; y++) {
		for (let x = 0; x < 4; x++) {
			if (board[y][x] == 0) {
				let newBoard2 = board.clone();
				newBoard2[y][x] = 2;
				let moveScore2 = calculateMoveScore(newBoard2, curDepth, maxDepth);
				totalScore += (0.9 * moveScore2);

				let newBoard4 = board.clone();
				newBoard4[y][x] = 4;
				let moveScore4 = calculateMoveScore(newBoard4, curDepth, maxDepth);
				totalScore += (0.1 * moveScore4);
			}
		}
	}
	return totalScore;
}

function calculateMoveScore(board, curDepth, maxDepth) {
	let bestScore = 0;
	for (let move = 1; move <= 4; move++) {
		let newBoard = simulateMove(board, move);
		if (!_.isEqual(newBoard, board)) {
			let score = generateScore(newBoard, curDepth+1, maxDepth);

			bestScore = Math.max(score, bestScore);
		}
	}
	return bestScore;
}

function calculateFinalScore(board) {
	// let numOfEmpty = 0;
	// for (let y = 0; y < 4; y++) {
	// 	for (let x = 0; x < 4; x++) {
	// 		if (board[y][x] == 0) {
	// 			numOfEmpty += 1;
	// 		}
	// 	}
	// }
	// return numOfEmpty;

	let score = 0;
	let weightedGrid = [[4**15, 4**14, 4**13, 4**12],
						[4**8, 4**9, 4**10, 4**11],
						[4**7, 4**6, 4**5, 4**4],
						[0, 4**1, 4**2, 4**3]]

	for (let y = 0; y < 4; y++) {
		for (let x = 0; x < 4; x++) {	
			score += board[y][x] * weightedGrid[y][x];
			score += checkIfNeighbordsSame(y, x, board);
		}
	}

	return score;
	
}

// let b = [[0, 0, 0, 0],
// 		 [0, 0, 0, 0],
// 		 [128, 128, 0, 0],
// 		 [0, 0, 0, 0]];
// console.log(calculateFinalScore(b));

function checkIfNeighbordsSame(y, x, board) {
	let tot = 0;
	for (let yDiff = -1; yDiff <= 1; yDiff++) {
		for (let xDiff = -1; xDiff <= 1; xDiff++) {
			let nY = y + yDiff;
			let nX = x + xDiff;
			if (nY < 0 || nY > 3 || nX < 0 || nX > 3 || (nY == y && nX == x) || (nY != y && nX != x)) {
				continue;
			}
			if (board[y][x] == board[nY][nX]) {
				tot += 1;
			}
		}
	}
	return tot;
}