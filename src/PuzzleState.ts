// by Brian Guire, July 2026
const PUZZLE_WIDTH_HEIGHT: number = 4;
const TILE_MAX_VALUE: number = 15;
const MAX_MOVE_QUEUE: number = 50000;

class PuzzleState {
	grid: number[][];
	moveList: string[];

	constructor(aGrid: number[][], aMoveList: string[]) {
		// validate aGrid
		// rows 0-3 are the bottom through top rows, respectively
		// columns 0-3 are the left through right columns, respectively
		if (aGrid.length != PUZZLE_WIDTH_HEIGHT) {
			console.log('first parameter passed to constructor of State must be 4x4 array');
		}
		
		let aIntCheck: number[] = [];
		for (let i: number = 0; i < PUZZLE_WIDTH_HEIGHT; i++) {
			if (aGrid[i].length != PUZZLE_WIDTH_HEIGHT) {
				console.log('first parameter passed to constructor of State must be 4x4 array');
			}
			for (let j: number = 0; j < PUZZLE_WIDTH_HEIGHT; j++) {
				let iTest: number = aGrid[i][j];
				if (iTest < 0 || iTest > TILE_MAX_VALUE) {
					console.log(`value at coordinate ${i}, ${j} in first parameter of State constructor is out of bounds`);
				}
				if (aIntCheck.indexOf(iTest) >= 0) {
					console.log(`value ${iTest} is duplicated in first parameter of State constructor`);
				}
				aIntCheck.push(iTest);
			}
		}
		
		this.grid = aGrid;
		this.moveList = aMoveList;	
	}
		
	getNextMoves(): { UP: PuzzleState | null; DOWN: PuzzleState | null; LEFT: PuzzleState | null; RIGHT: PuzzleState | null } {
		let oReturn: { UP: PuzzleState | null; DOWN: PuzzleState | null; LEFT: PuzzleState | null; RIGHT: PuzzleState | null } = { UP: null, DOWN: null, LEFT: null, RIGHT: null };
		let oEmptyCoordinate: { row: number | null, column: number | null } = { row: null, column: null };
		
		outerLoop: for (let i: number = 0; i < PUZZLE_WIDTH_HEIGHT; i++) {
			for (let j: number = 0; j < PUZZLE_WIDTH_HEIGHT; j++) {
				if (this.grid[i][j] == 0) {
					oEmptyCoordinate.row = i;
					oEmptyCoordinate.column = j;
					break outerLoop;
				}
			}
		}
		if (oEmptyCoordinate.row == null || oEmptyCoordinate.column == null) {
			console.log('no empty space found in grid, cannot get next moves');
			return oReturn;
		}
		
		// determine which direction was the last move
		let sLastMoveDirection: string = '';
		if (this.moveList.length) {
			let sLastMove: string = this.moveList[this.moveList.length - 1];
			let aLastMove: string[] = sLastMove.split(' ');
			sLastMoveDirection = aLastMove[1];
		}
			
		// a DOWN move is allowed as long as the empty space is not in row 0
		// AND UP wasn't the last move (otherwise we would undo the last move)
		if (oEmptyCoordinate.row != 0 && sLastMoveDirection != 'UP') {
			let aNewGrid: number[][] = [ ];
			for (let i: number = 0; i < PUZZLE_WIDTH_HEIGHT; i++) {
				for (let j: number = 0; j < PUZZLE_WIDTH_HEIGHT; j++) {
					if (!aNewGrid[i]) aNewGrid[i] = [ ];
					aNewGrid[i][j] = this.grid[i][j];
				}
			}
			
			let iTileToMove: number = this.grid[oEmptyCoordinate.row - 1][oEmptyCoordinate.column];
			aNewGrid[oEmptyCoordinate.row][oEmptyCoordinate.column] = iTileToMove;
			aNewGrid[oEmptyCoordinate.row - 1][oEmptyCoordinate.column] = 0;
			
			let aNewMoveList: string[] = [...this.moveList];
			let sNewMove = "DOWN";
			if (iTileToMove >= 10) sNewMove = iTileToMove + ' ' + sNewMove;
			else sNewMove = '0' + iTileToMove + ' ' + sNewMove;
			aNewMoveList.push(sNewMove);
			oReturn.DOWN = new PuzzleState(aNewGrid, aNewMoveList);
		}
		
		// a UP move is allowed as long as the empty space is not in row 3
		// AND DOWN wasn't the last move (otherwise we would undo the last move)
		if (oEmptyCoordinate.row != PUZZLE_WIDTH_HEIGHT - 1 && sLastMoveDirection != 'DOWN') {
			let aNewGrid: number[][] = [ ];
			for (let i: number = 0; i < PUZZLE_WIDTH_HEIGHT; i++) {
				for (let j: number = 0; j < PUZZLE_WIDTH_HEIGHT; j++) {
					if (!aNewGrid[i]) aNewGrid[i] = [ ];
					aNewGrid[i][j] = this.grid[i][j];
				}
			}
			let iTileToMove: number = this.grid[oEmptyCoordinate.row + 1][oEmptyCoordinate.column];
			aNewGrid[oEmptyCoordinate.row][oEmptyCoordinate.column] = iTileToMove;
			aNewGrid[oEmptyCoordinate.row + 1][oEmptyCoordinate.column] = 0;
			
			let aNewMoveList: string[] = [...this.moveList];
			let sNewMove: string = "UP";
			if (iTileToMove >= 10) sNewMove = iTileToMove + ' ' + sNewMove;
			else sNewMove = '0' + iTileToMove + ' ' + sNewMove;
			aNewMoveList.push(sNewMove);
			oReturn.UP = new PuzzleState(aNewGrid, aNewMoveList);
		}
				
		// a LEFT move is allowed as long as the empty space is not in column 3
		// AND RIGHT wasn't the last move (otherwise we would undo the last move)
		if (oEmptyCoordinate.column != PUZZLE_WIDTH_HEIGHT - 1 && sLastMoveDirection != 'RIGHT') {
			let aNewGrid: number[][] = [ ];
			for (let i: number = 0; i < PUZZLE_WIDTH_HEIGHT; i++) {
				for (let j: number = 0; j < PUZZLE_WIDTH_HEIGHT; j++) {
					if (!aNewGrid[i]) aNewGrid[i] = [ ];
					aNewGrid[i][j] = this.grid[i][j];
				}
			}
			let iTileToMove: number = this.grid[oEmptyCoordinate.row][oEmptyCoordinate.column + 1];
			aNewGrid[oEmptyCoordinate.row][oEmptyCoordinate.column] = iTileToMove;
			aNewGrid[oEmptyCoordinate.row][oEmptyCoordinate.column + 1] = 0;
			
			let aNewMoveList: string[] = [...this.moveList];
			let sNewMove = "LEFT";
			if (iTileToMove >= 10) sNewMove = iTileToMove + ' ' + sNewMove;
			else sNewMove = '0' + iTileToMove + ' ' + sNewMove;
			aNewMoveList.push(sNewMove);
			oReturn.LEFT = new PuzzleState(aNewGrid, aNewMoveList);
		}
				
		// a RIGHT move is allowed as long as the empty space is not in column 0
		// AND LEFT wasn't the last move (otherwise we would undo the last move)
		if (oEmptyCoordinate.column != 0 && sLastMoveDirection != 'LEFT') {
			let aNewGrid: number[][] = [ ];
			for (let i: number = 0; i < PUZZLE_WIDTH_HEIGHT; i++) {
				for (let j: number = 0; j < PUZZLE_WIDTH_HEIGHT; j++) {
					if (!aNewGrid[i]) aNewGrid[i] = [ ];
					aNewGrid[i][j] = this.grid[i][j];
				}
			}
			let iTileToMove: number = this.grid[oEmptyCoordinate.row][oEmptyCoordinate.column - 1];
			aNewGrid[oEmptyCoordinate.row][oEmptyCoordinate.column] = iTileToMove;
			aNewGrid[oEmptyCoordinate.row][oEmptyCoordinate.column - 1] = 0;
			
			let aNewMoveList: string[] = [...this.moveList];
			let sNewMove: string = "RIGHT";
			if (iTileToMove >= 10) sNewMove = iTileToMove + ' ' + sNewMove;
			else sNewMove = '0' + iTileToMove + ' ' + sNewMove;
			aNewMoveList.push(sNewMove);
			oReturn.RIGHT = new PuzzleState(aNewGrid, aNewMoveList);
		}
		return oReturn;
	};
	
	// return new State if iTileNumber is next to the empty spot, null otherwise
	moveIntoEmptySpot(iTileNumber: number): PuzzleState | null {
		let iTile: number = iTileNumber;
		if (iTile < 0 || iTile > 15) return null;
		let oEmptyCurrentPosition: { row: number | null, column: number | null } = { row: null, column: null };
		let oTileCurrentPosition: { row: number | null, column: number | null } = { row: null, column: null };
		
		outerLoopEmpty: for (let i: number = 0; i < PUZZLE_WIDTH_HEIGHT; i++) {
			for (let j = 0; j < PUZZLE_WIDTH_HEIGHT; j++) {
				if (this.grid[i][j] == 0) {
					oEmptyCurrentPosition = { row: i, column: j };
				}
				if (this.grid[i][j] == iTile) {
					oTileCurrentPosition = { row: i, column: j };
				}
			}
		}

		if (oEmptyCurrentPosition.row == null || oEmptyCurrentPosition.column == null || oTileCurrentPosition.row == null || oTileCurrentPosition.column == null) {
			console.log('could not find empty space or tile in grid, cannot move tile');
			return null;
		}
		
		// the move is valid if the tile is in the same row (or column) as the empty spot and is
		// in the adjacent column (or row)
		if (oEmptyCurrentPosition.row == oTileCurrentPosition.row && Math.abs(oEmptyCurrentPosition.column - oTileCurrentPosition.column) == 1
			|| oEmptyCurrentPosition.column == oTileCurrentPosition.column && Math.abs(oEmptyCurrentPosition.row - oTileCurrentPosition.row) == 1) {
			let aNewGrid: number[][] = [ ];
			for (let i: number = 0; i < PUZZLE_WIDTH_HEIGHT; i++) {
				for (let j: number = 0; j < PUZZLE_WIDTH_HEIGHT; j++) {
					if (!aNewGrid[i]) aNewGrid[i] = [ ];
					aNewGrid[i][j] = this.grid[i][j];
				}
			}
			aNewGrid[oEmptyCurrentPosition.row][oEmptyCurrentPosition.column] = this.grid[oTileCurrentPosition.row][oTileCurrentPosition.column];
			aNewGrid[oTileCurrentPosition.row][oTileCurrentPosition.column] = 0;
			return new PuzzleState(aNewGrid, [ ]);
		}
		else {
			return null;
		}
	};
	
	// score the puzzle's current state
	// highest score means solved
	// 1. check the fourth row to see which pieces are in place
	// 2. check the fourth column to see which pieces are in place
	// 3. check the third row to see which pieces are in place
	// 4. check the third column to see which pieces are in place
	// ... and so on
	// then for the first tile in the sequence that is not in place, give it a fractional score for
	// how close it is to it's proper position
	getScore(): number {
		let fReturn: number = 0;
		let iOutOfPlace: number | null = null;
		let aCheckPositionsInThisOrder: [number, number][] = [
			[ 3, 3 ], [ 3, 2 ], [ 3, 1 ], [ 3, 0 ],
			[ 2, 3 ], [ 1, 3 ], [ 0, 3 ],
			[ 2, 2 ], [ 2, 1 ], [ 2, 0 ],
			[ 1, 2 ], [ 0, 2 ],
			[ 1, 1 ], [ 1, 0 ],
			[ 0, 1 ],
			[ 0, 0 ]
		];
		
		for (let i: number = 0; i < aCheckPositionsInThisOrder.length; i++) {
			let aPoint: [number, number] = aCheckPositionsInThisOrder[i];
			let row: number = aPoint[0];
			let col: number = aPoint[1];
			if (this.grid[row][col] == row * PUZZLE_WIDTH_HEIGHT + col) {
				fReturn++;
			}
			else {
				iOutOfPlace = row * PUZZLE_WIDTH_HEIGHT + col;
				break;
			}
		}
		
		if (fReturn < TILE_MAX_VALUE + 1 && iOutOfPlace !== null) fReturn += this.getTileScore(iOutOfPlace);
		
		return fReturn;
	};
	
	// assuming iTileNumber is out of place, give the tile a fractional score, will be between 0.0 - 0.4
	// depending on how close the tile is to it's correct spot
	getTileScore(iTileNumber: number): number {
		let iReturn: number = 0;
		let oTileCurrentPosition: { row: number | null, column: number | null } = { row: null, column: null };
		let oTileCorrectPosition: { row: number | null, column: number | null } = { row: null, column: null };
		
		outerLoop: for (let i: number = 0; i < PUZZLE_WIDTH_HEIGHT; i++) {
			for (let j: number = 0; j < PUZZLE_WIDTH_HEIGHT; j++) {
				if (this.grid[i][j] == iTileNumber) {
					oTileCurrentPosition = { row: i, column: j };
					break outerLoop;
				}
			}
		}

		if (oTileCurrentPosition.row == null || oTileCurrentPosition.column == null) {
			console.log('could not find tile in grid, cannot score tile');
			return 0;
		}
		
		oTileCorrectPosition.row = Math.floor(iTileNumber / PUZZLE_WIDTH_HEIGHT);
		oTileCorrectPosition.column = iTileNumber % PUZZLE_WIDTH_HEIGHT;
		
		iReturn += (PUZZLE_WIDTH_HEIGHT - 1 - Math.abs(oTileCorrectPosition.row - oTileCurrentPosition.row)) * 0.1;
		iReturn += (PUZZLE_WIDTH_HEIGHT - 1 - Math.abs(oTileCorrectPosition.column - oTileCurrentPosition.column)) * 0.1;
		return iReturn;
	};
	
	// return true if the puzzle is solved, false otherwise
	// solved looks like this:
	// 12 13 14 15
	//  8  9 10 11
	//  4  5  6  7
	//     1  2  3
	isSolved(): boolean {
		return this.getScore() == TILE_MAX_VALUE + 1;
	};
};

// compare the grids for two states, return true if all the tiles are in the same positions, false otherwise
function areGridsEqual(oState1: PuzzleState, oState2: PuzzleState): boolean {
	for (let i: number = 0; i < PUZZLE_WIDTH_HEIGHT; i++) {
		for (let j: number = 0; j < PUZZLE_WIDTH_HEIGHT; j++) {
			if (oState1.grid[i][j] != oState2.grid[i][j]) return false;
		}
	}
	
	return true;
};

// oState is State object created using the State function above
// returns an array of the form [ '12 LEFT', '10 DOWN', '15 RIGHT', ... ]
function solve(oState: PuzzleState): string[] | null {
	let aQueue: PuzzleState[] = [ oState ]; // populate this with State objects
	let bSolved: boolean = false;
	let fHighScore: number = 0;
	
	while (!bSolved) {
		
		// take the state from the front of the queue and examine it
		// if the puzzle is solved, return the move list
		// otherwise, get the next moves and add them to the queue
		let oTemp: PuzzleState = aQueue.shift()!;
		if (oTemp.isSolved()) {
			console.log('puzzle solved, returning solution: %o', oTemp.moveList);
			bSolved = true;
			return oTemp.moveList;
		}
		
		else {
			let oMoves: { [key: string]: PuzzleState | null } = oTemp.getNextMoves();
			for (const sDirection in oMoves) {
				
				if (oMoves[sDirection]) {
				
					// if the next move has a score that is the high score so far, assume that it has the
					// most promise for a quick solution and dump all of the other states/move lists from the queue
					if (fHighScore == null || oMoves[sDirection].getScore() > fHighScore) {
						fHighScore = oMoves[sDirection].getScore();
						console.log('new high score %f at state %o, resetting solution queue', fHighScore, oMoves[sDirection]);
						aQueue = [ ];
					}
					
					// assume that if the next move is too far below the high score, it's not a good move
					if (oMoves[sDirection].getScore() < fHighScore - 6) continue;
					
					// if the grid is the exact same as the grid for one of the states already in the queue, do not add to queue
					// we don't want to be moving the tiles in circles
					for (let i: number = 0; i < aQueue.length; i++) {
						if (areGridsEqual(oMoves[sDirection], aQueue[i])) continue;
					}
					
					aQueue.push(oMoves[sDirection]);
				}
			}
		}
		
		if (aQueue.length > MAX_MOVE_QUEUE) {
			console.log('queue size limit reached, queue: %o', aQueue);
		}
	}
	return null;
};

// we can't just populate the spaces on the grid with the numbers 0-15, there is a chance we will 
// generate an unsolvable state
// instead, generate a random set of moves (5000 should be enough)
function makeRandomState(): PuzzleState {
	let oState: PuzzleState = new PuzzleState([ [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15] ], [ ]);
	const NUMBER_RANDOM_MOVES: number = 5000;
	
	for (let i: number = 0; i < NUMBER_RANDOM_MOVES; i++) {
		let oMoves: { [key: string]: PuzzleState | null } = oState.getNextMoves();
		let aNextMoves: PuzzleState[] = [ ];
		for (const sDirection in oMoves) {
			if (oMoves[sDirection] != null) aNextMoves.push(oMoves[sDirection]);
		}
		
		// now pick one of the moves at random
		let iPossibleMoves: number = aNextMoves.length;
		let iChooseThisOne: number = Math.floor(Math.random() * iPossibleMoves);
		oState = aNextMoves[iChooseThisOne];
	}
	
	return oState;
}

export { PuzzleState, solve, makeRandomState };

console.log('PuzzleState.js is now loaded');