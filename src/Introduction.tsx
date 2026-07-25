import AppCSS from './App.module.css';

const Introduction: React.FC = () => {
    return (
        <div>
		<p>To go straight to the puzzle, click the <b>Puzzle</b> tab above.</p>
		
		<p>I've always enjoyed all kinds of puzzles, from Rubik's Cube to Pyraminx to The Missing Link.
		Even the puzzles made up of a few metal pieces where you have to figure out how to untangle them, or the wooden
		puzzles where you take them apart and then figure out how to put them back together in the original
		shape.  At a young age I was introduced to the sliding tile puzzle.  I believe it was at 
		my grandparents' house.  They kept a little toy chest for whenever our family came to visit them.
		Ever worked one yourself?
		</p>
		
		<p><img src="/images/sliding-tiles.png" />
		</p>
		
		<p>It took some time but I started to figure out a systematic way of solving the puzzle.  It was
		something I couldn't quite put into words, if I ever even tried.  But once I figured out how to solve
		that puzzle consistently I was hooked.  That was probably the day I became destined to use math and
		logic in my future vocation, whatever that ended up being.
		</p>
		
		<p>This project is an ode to that puzzle.  It started the love of problem solving that I still 
		relish in today.  Maybe this project says a little about me.  Whether you are a potential employer,
		an aspiring developer or a fellow puzzle lover, I hope you find something interesting here.  Try 
		the puzzle out a bit, just for fun.  Study the user interface techniques.  Have a look at the logic 
		that was used to manipulate the puzzle and evaluate the possible moves.  If you are more technical
		minded, you might find the content in the Development Analysis tab interesting.  Enjoy!
		</p>
		
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

export default Introduction;