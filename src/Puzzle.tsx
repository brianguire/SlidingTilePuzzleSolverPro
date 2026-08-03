import { useState } from 'react';
import { PuzzleState, solve, makeRandomState } from './PuzzleState.js';
import Solution from './Solution.tsx';
import AppCSS from './App.module.css';

const Puzzle: React.FC = () => {
    const [ gridData, setGridData ] = useState<number[][]>([[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15]]);  // 4x4 grid initialized with empty strings
    const [ solution, setSolution ] = useState<string[]>([]); 
    const [ editMode, setEditMode ] = useState<string>('PLAY');  // one of 'SOLVE', 'PLAY', 'EDIT'
    const WAIT_BEFORE_MOVE: number = 500;  // milliseconds to wait before moving the next tile in autoSolve
    const [ originalGrid, setOriginalGrid ] = useState<number[][] | null>(null);  // used to store the original grid when entering edit mode

    // oState is an object of the form typically returned from the PuzzleState function in PuzzleState.js
    function populateGridFromState(oState: PuzzleState) {
        setGridData(oState.grid);
    }

    function getStateFromGrid(): PuzzleState {     
        return  new PuzzleState(gridData, [ ]);
    }

    function shuffle() {
        populateGridFromState(makeRandomState());
        setSolution([]);
    }

    function clickCancel() {
        console.log('clickCancel called, originalGrid is %o', originalGrid);
        if (originalGrid) {
            setGridData(originalGrid);
        }
        setEditMode('PLAY');
    }

    function clickEdit() {
        let o: PuzzleState = getStateFromGrid();
        let aOriginalGrid: number[][] | null = null;
        for (let iRow = 0; iRow < o.grid.length; iRow++) {
            for (let iCol = 0; iCol < o.grid[iRow].length; iCol++) {
                if (!aOriginalGrid) aOriginalGrid = [];
                if (!aOriginalGrid[iRow]) aOriginalGrid[iRow] = [];
                aOriginalGrid[iRow][iCol] = o.grid[iRow][iCol];
            }
        }
        setOriginalGrid(aOriginalGrid);
        console.log('clickEdit called, aOriginalGrid is %o', aOriginalGrid);
        setEditMode('EDIT');
    }

    function clickSave() {
        let o: PuzzleState = getStateFromGrid();

        // verify that the grid contains all numbers from 0 to 15, with no duplicates
        let oNumberCheck: { [key: number]: boolean } = {};
        let aGrid: number[][] = o.grid;
        for (let iRow = 0; iRow < aGrid.length; iRow++) {
            for (let iCol = 0; iCol < aGrid[iRow].length; iCol++) {
                if (oNumberCheck[aGrid[iRow][iCol]]) {
                    alert('Duplicate number found in grid, please fix and try again');
                    return;
                }
                else if (aGrid[iRow][iCol] < 0 || aGrid[iRow][iCol] > 15) {
                    alert('Invalid number found in grid, please fix and try again (allowable numbers are 0 through 15)');
                    return;
                }
                oNumberCheck[aGrid[iRow][iCol]] = true;
            }
        }
        setEditMode('SOLVE');

        // check for solvability before saving the new state
        let aMoveList: string[] | null = solve(o);
        if (aMoveList == null) {
            alert('The puzzle is unsolvable, please make changes and try again');
            setEditMode('EDIT');
        }
        else {
            setSolution(aMoveList);
            setEditMode('PLAY');
        }
    }

    function clickTile(event: React.MouseEvent<HTMLInputElement>) {
        if (editMode !== 'PLAY') return false;
        let iTileNumber: number = parseInt(event.currentTarget.value);
        let o: PuzzleState = getStateFromGrid();
        let oNewState: PuzzleState | null = o.moveIntoEmptySpot(iTileNumber);
        if (oNewState == null) alert('Only moving tiles adjacent to the empty spot is allowed');
        else {
            populateGridFromState(oNewState);
        }
    }

    function updateSolution(): { state: PuzzleState, moveList: string[] } {
        let o: PuzzleState = getStateFromGrid();
        let aMoveList: string[] | null = solve(getStateFromGrid());
        if (aMoveList == null) {
            alert('The puzzle is unsolvable, please shuffle and try again');
            setEditMode('PLAY');
            return { state: o, moveList: [] };
        }
        else setSolution(aMoveList);
        setEditMode('PLAY');
        return { state: o, moveList: aMoveList };  // return these in case this function is being called by autoSolve
    }

    // this function is just so we can refresh the UI to no-edit mode before kicking off the function
    function startUpdateSolution() {
        setEditMode('SOLVE');
        setTimeout(updateSolution, WAIT_BEFORE_MOVE);
    }

    // for autoSolve: take an array of moves, shift one off the top, then set a delay for the next move
    // repeat until the array is empty
    function iterateOneMove(oState: PuzzleState, aMoveList: string[]) {
        console.log('calling iterateOneMove with state %o', oState);
        if (aMoveList.length) {
            let sMove: string = aMoveList.shift()!;
            let aMoveParts: string[] = sMove.split(' ');
            let oNewState: PuzzleState | null = oState.moveIntoEmptySpot(parseInt(aMoveParts[0]));
            if (oNewState) {
                populateGridFromState(oNewState);
                if (!oNewState.isSolved() && aMoveList.length) setTimeout(iterateOneMove, WAIT_BEFORE_MOVE, oNewState, aMoveList);
                else setEditMode('PLAY');
            }
        }
    }

    function autoSolve() {
        let oReturn: { state: PuzzleState, moveList: string[] } = updateSolution();
        if (oReturn.moveList.length == 0) {
            alert('The puzzle is already solved, no moves to make');
            setEditMode('PLAY');
            return;
        }
        setEditMode('SOLVE');
        
        // take the list of moves from the array and perform them, one at a time, starting at the beginning
        // of the array
        console.log('autoSolve calling iterateOneMove with object %o', oReturn);
        iterateOneMove(oReturn.state, oReturn.moveList);
    }

    function startAutoSolve() {
        setEditMode('SOLVE');
        setTimeout(autoSolve, WAIT_BEFORE_MOVE);
    }

    return (
        <div>
		
        <p>Move an adjacent tile into the empty space by clicking on it.  Click the Shuffle button
            to mix up the puzzle.  Click the Edit button to manually arrange the tiles.  Click the Show/Update Solution button to show the solution to the
            puzzle, or update the solution after moving a few tiles.  Click the Auto-solve button to have the app
            solve the puzzle, moving one tile at a time.
        </p>
    
        <div className={ AppCSS.puzzleEditorFlex }>
            <div>
                <table id="puzzleGrid" className={ AppCSS.puzzleGrid }>
                    <tbody>
                    { gridData.map((row, rowIndex) => {
                        return (
                            <tr key={rowIndex}>
                                { row.map((cell, colIndex) => {
                                    return (
                                        <td key={colIndex} className={cell === 0 ? AppCSS.emptyTile : ''}>
                                            { editMode === 'EDIT' ? (
                                                <input id={`grid-${rowIndex}-${colIndex}`} size={1} value={cell == 0 ? '' : cell} onChange={ (e) => {
                                                    let newGridData = [...gridData];
                                                    newGridData[rowIndex][colIndex] = parseInt(e.target.value) || 0;
                                                    setGridData(newGridData);
                                                }} />
                                            ) : (
                                                <input readOnly id={`grid-${rowIndex}-${colIndex}`} size={1} value={cell == 0 ? '' : cell} onClick={clickTile} />
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
        
                <div className={ AppCSS.displayButtons }>
                    { editMode === 'PLAY' ?
                        <div>
                        <button className={ AppCSS.blueButton } onClick={shuffle}>Shuffle</button>
                        <button className={ AppCSS.blueButton } onClick={clickEdit}>Edit</button>
                        <button className={ AppCSS.greenButton } onClick={startUpdateSolution}>Show/Update Solution</button>
                        <button className={ AppCSS.greenButton } onClick={startAutoSolve}>Auto-solve</button>
                        </div>
                    :
                        ( editMode === 'EDIT' ? (
                            <div>
                                <button className={ AppCSS.greenButton } onClick={clickSave}>Save Changes</button>
                                <button className={ AppCSS.redButton } onClick={clickCancel}>Cancel</button>
                            </div>
                        ) : (
                            <p>Solving the puzzle, this may take a minute...</p>
                        ))
                    }
                </div>
            </div>
            <div>{ solution.length > 0 && <Solution aMoveList={solution} /> }</div>
        </div>
		
		<p>NOTE: the solved state for this puzzle app looks like this:
		</p>
            <table className={ AppCSS.rightAlignedTable }>
                <tbody>
                <tr>
                <td>&nbsp;</td>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                </tr>
                <tr>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
                </tr>
                <tr>
                <td>8</td>
                <td>9</td>
                <td>10</td>
                <td>11</td>
                </tr>
                <tr>
                <td>12</td>
                <td>13</td>
                <td>14</td>
                <td>15</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Puzzle;