var origBoard;                                     //creating a variable which will store or boart value
const huPlayer = 'O';                              //human carry zero value to create on columns
const aiPlayer = 'X';                              //ai carry X value to create on columns
const winCombos = [                                //all possibe winning combinations --> 8
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');   //selecting all div tags having cell class
startGame();                                        //calling startfunction game to start our game moments

function startGame() {                                                 //startGame Function
	document.querySelector(".endgame").style.display = "none";         //everytime we are hiding you display at game starts (pop up which says the winning or draw message)

	origBoard = Array.from(Array(9).keys());                           //creating an array of nine elements
	for (var i = 0; i < cells.length; i++) {                           //setting a string one
		cells[i].innerText = '';                                       //passing empty string to cell with respec to their id
		cells[i].style.removeProperty('background-color');             //removing the background property
		cells[i].addEventListener('click', turnClick, false);          //first turn human player moose click event check for any cell we click
	}
}

function turnClick(square) {                                           //when we click the box then its pass a value that we are collecting in sqare(indicating the box)
	if (typeof origBoard[square.target.id] == 'number') {              //creating a condition if there is numerb
		turn(square.target.id, huPlayer)                               //then human player moves
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);  // here we checking if human win or its not tie then ai moves
	}
}

function turn(squareId, player) {                                       //here we are selecting moves of ai and human
	origBoard[squareId] = player;                                       //here we are setting X and zero value where ai or human move
	document.getElementById(squareId).innerText = player;               //fetching the element and setting the text X or O respectiverly squareId is a variable which carry id for <tr> tags

	let gameWon = checkWin(origBoard, player)                           //her we are checking the winning persone
	if (gameWon) gameOver(gameWon)                                      //if gameWon have any value then we will do some task on that
}

function checkWin(board, player) {                                      //checking the winning palyer
	let plays = board.reduce((a, e, i) =>                               //here we are breaking our array where a is accmulator e is element and i is index
		(e === player) ? a.concat(i) : a, []);                          //checking condition this is the method used to find where players playes its move

	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {                     //fetching wunCombos variable to check every condition
		if (win.every(elem => plays.indexOf(elem) > -1)) {              //check codition we every move and fetching that wining combinations match or not
			gameWon = {index: index, player: player};                   //if matched then we will update our gameWon and then return that
			break;                                                      //terminating loop when we get out value
		}
	}
	return gameWon;
}

function gameOver(gameWon) {                                             //this function prints who win and restart game
	for (let index of winCombos[gameWon.index]) {                        //fetching winning index
		document.getElementById(index).style.backgroundColor =           //then we are checking that player is human then give background color to bule else red
			gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {                              //diabling the clicking function
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");   //declering winner if human wins then we will print win else lose
}

function declareWinner(who) {                                             //who is the text of winning and losing
	document.querySelector(".endgame").style.display = "block";           //setting none to block to view our setup
	document.querySelector(".endgame .text").innerText = who;             //here we are setting out text in tag carring class endgame and text
}

function emptySquares() {                                                 //this function tells that which box are empty
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {                                                     //here is the function will called by Ai
	return minimax(origBoard, aiPlayer).index;                            //here we are calling minimax function then returing inxed returned by minimax function
}

function checkTie() {                                                     //this functions check the tie
	if (emptySquares().length == 0) {                                     //if empty function return zero that this this will call
		for (var i = 0; i < cells.length; i++) {                          //for loop to give some attribute
			cells[i].style.backgroundColor = "green";                     //selecting background color to green
			cells[i].removeEventListener('click', turnClick, false);      //taking the ability to click on board
		}
		declareWinner("Tie Game!")                                        //printing that game is Tie
		return true;
	}
	return false;
}
//braing or our game
function minimax(newBoard, player) {
	var availSpots = emptySquares();                                      //fetching empty spots

	if (checkWin(newBoard, huPlayer)) {                                   //checking the winner if human wins it return score -10
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {                            //checking for Ai and if wins then returning 10 score
		return {score: 10};
	} else if (availSpots.length === 0) {                                 //and score ties it returning zero
		return {score: 0};
	}
	var moves = [];                                                       //here we are creaitng a empty list which will store score of emptyscore
	for (var i = 0; i < availSpots.length; i++) {                         //running the loop for empty score
		var move = {};                                                    //creating an empty dict
		move.index = newBoard[availSpots[i]];                             //in move object creating a index key which will store our empty index
		newBoard[availSpots[i]] = player;                                 //passing player that is ai to that sopt

		if (player == aiPlayer) {                                         //if player is ai
			var result = minimax(newBoard, huPlayer);                     //calling or huPlayer function to collect -10
			move.score = result.score;                                    //collecting the score at perticular index
		} else {                                                          //same for human player
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;                            //again setting our board to empty

		moves.push(move);                                                //now pusing our object to array ehich carry inxed and score
	}
	var bestMove;                                                        //creating bestMove variable
	if(player === aiPlayer) {                                             //if player is ai
		var bestScore = -10000;                                           //setting best score to -10000
		for(var i = 0; i < moves.length; i++) {                           //running our loop
			if (moves[i].score > bestScore) {                             //checking our condition if our score is higher thant bestscore
				bestScore = moves[i].score;                               //sellecting the bestScore to that which will find greater value from that in next turn
				bestMove = i;                                             //setting index to that
			}
		}
	} else {                                                               //if player is human this will run
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];                                            //returning mest move and then fetchs its index and mark X for ai
}