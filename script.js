"use strict";
const gameBoard = (() => {
	let board = ["", "", "", "", "", "", "", "", ""];
	const setField = (i, marker) => {
		if (i > board.length) return;
		board[i] = marker;
	};

	const getField = i => {
		if (i > board.length) return;
		return board[i];
	};
	return {
		board,
		getField,
		setField,
	};
})();

const Player = marker => {
	this.marker = marker;
	const setMarker = () => marker;
	return {
		setMarker,
	};
};

const GameControler = (() => {
	const playerOne = Player("O");
	const playerTwo = Player("X");
	let round = 1;
	let gameOver = false;
	const gameRound = fieldIndex => {
		gameBoard.setField(fieldIndex, switchPlayer());
		if (checkWin()) {
			console.log("win");
			gameOver = true;
		}
		if (!checkWin() && checkDraw()) {
			console.log("draw");
		}
		round++;
	};

	const switchPlayer = () => {
		return round % 2 === 1 ? playerOne.setMarker() : playerTwo.setMarker();
	};

	const checkWin = () => {
		const winningConditions = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		// for (const condition of winningConditions) {
		// 	let [a, b, c] = condition;
		// 	if (
		// 		gameBoard.getField(a) &&
		// 		gameBoard.getField(a) == gameBoard.getField(b) &&
		// 		gameBoard.getField(b) == gameBoard.getField(c)
		// 	) {
		// 		return [a, b, c];
		// 	}
		// }
		// console.log()
		return winningConditions.some(condition =>
			condition.every(cell => gameBoard.board[cell] === switchPlayer())
		);
	};

	const checkDraw = () => {
		return !gameBoard.board.includes("");
	};
	const endOfTheGame = () => {
		return gameOver;
	};

	return {
		gameRound,
		endOfTheGame,
	};
})();

const ScreenControler = (() => {
	const fields = [...document.querySelectorAll(".field")];
	const insertMark = e => {
		if (GameControler.endOfTheGame()) return;
		GameControler.gameRound(e.target.dataset.index);
		updateGame();
	};
	const updateGame = () => {
		for (let i = 0; i < fields.length; i++) {
			fields[i].textContent = gameBoard.getField(i);
		}
	};

	fields.forEach(field => {
		field.addEventListener("click", insertMark, { once: true });
	});
})();
