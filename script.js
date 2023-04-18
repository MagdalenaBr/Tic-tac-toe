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
	const boardReset = () => {
		board.map((_, i) => {
			board[i] = "";
		});
	};
	return {
		board,
		getField,
		setField,
		boardReset,
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
	const playerOne = Player("X");
	const playerTwo = Player("O");
	let round = 1;
	let gameOver = false;
	const gameRound = fieldIndex => {
		gameBoard.setField(fieldIndex, switchPlayer());
		if (checkWin()) {
			console.log("win");
			gameOver = true;
			ScreenControler.displayEndMessage(`The Winner is '${switchPlayer()}'`);
		}
		if (!checkWin() && checkDraw()) {
			console.log("draw");
			ScreenControler.displayEndMessage("It's a draw");
		}
		round++;
		ScreenControler.displayPlayersTurn(`'${switchPlayer()}' turn`);
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
	const resetGame = () => {
		round = 1;
		gameOver = false;
	};
	return {
		resetGame,
		switchPlayer,
		gameRound,
		endOfTheGame,
	};
})();

const ScreenControler = (() => {
	const fields = [...document.querySelectorAll(".game-board__field")];
	const insertMark = e => {
		if (GameControler.endOfTheGame() || e.target.textContent !== "") return;
		GameControler.gameRound(e.target.dataset.index);
		updateGame();
	};
	const updateGame = () => {
		for (let i = 0; i < fields.length; i++) {
			fields[i].textContent = gameBoard.getField(i);
		}
	};
	fields.forEach(field => {
		field.addEventListener("click", insertMark);
	});
	/////////////////////////////////////////////////////////////////////////////
	const startBtn = document.querySelector(".start-window__btn");
	const playerTurn = document.querySelector(".player-turn");
	const endWindow = document.querySelector(".end-window");
	const displayPlayersTurn = message => {
		playerTurn.textContent = message;
	};
	const displayEndMessage = message => {
		const endMessage = document.querySelector(".end-window__message");
		endWindow.style.display = "flex";
		endMessage.textContent = message;
	};

	startBtn.addEventListener("click", function (e) {
		const startWindow = document.querySelector(".start-window");
		e.preventDefault();
		startWindow.classList.add("disabled");
		startBtn.style.display = "none";
		playerTurn.style.display = "block";
	});

	const restartBtn = document.querySelector(".end-window__restart-btn");
	restartBtn.addEventListener("click", function () {
		GameControler.resetGame();
		gameBoard.boardReset();
		endWindow.style.display = "none";
		ScreenControler.displayPlayersTurn(`'X' turn`);
		updateGame();
	});
	return {
		displayPlayersTurn,
		displayEndMessage,
	};
})();

