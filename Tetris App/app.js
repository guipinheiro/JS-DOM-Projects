document.addEventListener("DOMContentLoaded", () => {
	//JS Code for after DOM loading
	//Main elements we will be using through the game

	//Main grid of the game, div outside the cells
	const grid = document.querySelector(".grid");
	//The cells itself
	let squares = Array.from(document.querySelectorAll(".grid div"));
	const scoreDisplay = document.querySelector("#score");
	let score = 0;
	const startBtn = document.querySelector("#start-btn");
	const width = 10;
	let timerId;
	let gameOverCheck = false;

	//Mini grid display:
	let nextRandom = 0;

	//The tetrominoes
	const lTetromino = [
		[1, width + 1, width * 2 + 1, 2],
		[width, width + 1, width + 2, width * 2 + 2],
		[1, width + 1, width * 2, width * 2 + 1],
		[width, width * 2, width * 2 + 1, width * 2 + 2],
	];

	const zTetromino = [
		[width + 1, width + 2, width * 2, width * 2 + 1],
		[0, width, width + 1, width * 2 + 1],
		[width + 1, width + 2, width * 2, width * 2 + 1],
		[0, width, width + 1, width * 2 + 1],
	];

	const tTetromino = [
		[1, width, width + 1, width + 2],
		[1, width + 1, width + 2, width * 2 + 1],
		[width, width + 1, width + 2, width * 2 + 1],
		[1, width, width + 1, width * 2 + 1],
	];

	const oTetromino = [
		[0, 1, width, width + 1],
		[0, 1, width, width + 1],
		[0, 1, width, width + 1],
		[0, 1, width, width + 1],
	];

	const iTetromino = [
		[1, width + 1, width * 2 + 1, width * 3 + 1],
		[width, width + 1, width + 2, width + 3],
		[1, width + 1, width * 2 + 1, width * 3 + 1],
		[width, width + 1, width + 2, width + 3],
	];

	const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

	//Start position, where tetromino is born
	let currentPosition = 4;
	let currentRotation = 0;

	//Get a random tetromino
	function randomTetro() {
		return Math.floor(Math.random() * theTetrominoes.length);
	}
	let random = randomTetro();
	let current = theTetrominoes[random][currentRotation]; //always picking first rotation

	//draw the first rotation of a random tetromino
	function draw() {
		current.forEach((index) => {
			squares[currentPosition + index].classList.add("tetromino");
		});
	}

	//undraw the Tetromino
	function undraw() {
		current.forEach((index) => {
			squares[currentPosition + index].classList.remove("tetromino");
		});
	}

	//Assign functions to keyCodes
	function control(event) {
		if (!gameOverCheck) {
			if (event.key === "ArrowLeft") {
				moveLeft();
			} else if (event.key === "ArrowRight") {
				moveRight();
			} else if (event.key === "ArrowUp") {
				rotate();
			} else if (event.key === "ArrowDown") {
				moveDown();
			}
		}
	}

	document.addEventListener("keydown", control);

	//Move down function
	function moveDown() {
		undraw();
		currentPosition += width;
		draw();
		freeze();
	}

	//Freeze function so it stops moving when reaching the bottom
	function freeze() {
		if (!gameOverCheck) {
			if (current.some((index) => squares[currentPosition + index + width].classList.contains("taken"))) {
				current.forEach((index) => squares[currentPosition + index].classList.add("taken"));
				//Start new tetromino after freezing one
				random = nextRandom;
				nextRandom = randomTetro();
				current = theTetrominoes[random][currentRotation];
				currentPosition = 4;
				draw();
				displayShape();
				addScore();
				gameOver();
			}
		}
	}

	//Move our tetromino left and right unless there is a blockage (another tetromino or wall)
	function moveLeft() {
		undraw();
		const isAtLeftEdge = current.some((index) => (currentPosition + index) % width === 0);

		//If it is not at the left edge, moves it to the left by one space
		if (!isAtLeftEdge) currentPosition -= 1;

		//If tries to move at a space that contains a taken cell, brings it back to the original position
		if (current.some((index) => squares[currentPosition + index].classList.contains("taken"))) {
			currentPosition += 1;
		}
		draw();
	}

	function moveRight() {
		undraw();
		const isAtRightEdge = current.some((index) => (currentPosition + index) % width === width - 1);

		//If it is not at the right edge, moves it to the right by one space
		if (!isAtRightEdge) currentPosition += 1;

		//If tries to move at a space that contains a taken cell, brings it back to the original position
		if (current.some((index) => squares[currentPosition + index].classList.contains("taken"))) {
			currentPosition -= 1;
		}
		draw();
	}

	//Rotate the tetromino
	function rotate() {
		undraw();
		currentRotation++;

		//If our tetromino rotate beyond the amount of rotations on each shape, goes back to the first one
		if (currentRotation === current.length) {
			currentRotation = 0;
		}

		//! Here we have a bug, if we rotate a shape in the corner, the rotation might makes it go to the other side of the grid
		current = theTetrominoes[random][currentRotation];
		draw();
	}

	//Show up next tetromino in mini-grid display
	const displaySquares = document.querySelectorAll(".mini-grid div");
	const displayWidth = 4;
	let displayIndex = 0;

	//The tetromino without rotations
	const upNextTetromino = [
		[1, displayWidth + 1, displayWidth * 2 + 1, 2],
		[displayWidth + 1, displayWidth + 2, displayWidth * 2, displayWidth * 2 + 1],
		[1, displayWidth, displayWidth + 1, displayWidth + 2],
		[0, 1, displayWidth, displayWidth + 1],
		[1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
	];

	//Display the shape in the mini tetromino display
	function displayShape() {
		displaySquares.forEach((square) => {
			//Remove any trace of tetromino form in the entire mini grid
			square.classList.remove("tetromino");
		});
		upNextTetromino[nextRandom].forEach((index) => {
			displaySquares[displayIndex + index].classList.add("tetromino");
		});
	}

	//Add functionality to the start button
	startBtn.addEventListener("click", () => {
		if (timerId) {
			clearInterval(timerId);
			timerId = null;
		} else {
			draw();
			timerId = setInterval(moveDown, 600);
			nextRandom = randomTetro();
			displayShape();
		}
	});

	//Add score
	function addScore() {
		const takenRow = width + 1;
		for (let i = 0; i < squares.length - takenRow; i += width) {
			const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

			if (row.every((index) => squares[index].classList.contains("taken"))) {
				score += 10;
				scoreDisplay.textContent = score;
				row.forEach((index) => {
					squares[index].classList.remove("taken");
					squares[index].classList.remove("tetromino");
				});
				const squaresRemoved = squares.splice(i, width);
				squares = squaresRemoved.concat(squares);
				squares.forEach((cell) => grid.appendChild(cell));
			}
		}
	}

	//Game over function
	function gameOver() {
		if (current.some((index) => squares[currentPosition + index].classList.contains("taken"))) {
			scoreDisplay.textContent += " - GAME OVER";
			clearInterval(timerId);
			gameOverCheck = true;
		}
	}
});
