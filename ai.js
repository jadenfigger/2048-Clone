
// 1 = up
// 2 = right
// 3 = down
// 4 = left
function calculateNextMove(gs) {
	let bestMove = -1;
	let bestScore = 0;

	for (let move = 1; move <= 4; move++) {
		let score = calculateScore(gs, move);

		if (score > bestScore) {
			bestScore = score;
			bestMove = move;
		}
	}

	return bestMove;
}


function calculateScore(board, move) {
	newBoard = simulateMove(board, move);
	if (arraysEqual(newBoard, board)) {
		return 0;
	}
	return generateScore(newBoard, 0, 2);
}


function simulateMove(board, move) {
	let newBoard = undefined;
	switch(move) {
		case 1: 
			newBoard = up(board)[0];
			break;
		case 2:
			newBoard = right(board)[0];
			break;
		case 3:
			newBoard = down(board)[0];
			break;
		case 4:
			newBoard = left(board)[0];
			break;
	}
	return newBoard;
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
				let newBoard2 = board;
				newBoard2[y][x] = 2;
				let moveScore2 = calculateMoveScore(newBoard2, curDepth, maxDepth);
				totalScore += (0.9 * moveScore2);

				let newBoard4 = board;
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
		if (!arraysEqual(newBoard, board)) {
			let score = generateScore(newBoard, curDepth+1, maxDepth);

			bestScore = Math.max(score, bestScore);
		}
	}
	return bestScore;
}

function calculateFinalScore(board) {
	let numOfEmpty = 0;
	for (let y = 0; y < 4; y++) {
		for (let x = 0; x < 4; x++) {
			if (board[y][x] == 0) {
				numOfEmpty += 1;
			}
		}
	}
	return numOfEmpty;

	// let sum = 0
	// for (let y = 0; y < 4; y++) {
	// 	for (let x = 0; x < 4; x++) {
	// 		sum += board[y][x];
	// 	}
	// }
	// return sum;
}