const Analysis: React.FC = () => {
    return (
        <div>
		<p>To create this app I started with the original&nbsp;
            <a href="https://github.com/brianguire/SlidingTilePuzzleSolver" target="_blank" rel="noopener noreferrer">SlidingTilePuzzleSolver</a> project
            and approached it as though it was a modernization of a legacy app.  
		</p>
		
		<p><b>Coding:</b> This app was built with React and JavaScript.  The code is organized into components, each 
            with a specific purpose.  The main components provide the content for the Introduction, Puzzle, and Analysis tabs.  
            The Puzzle component contains the logic for the sliding tile puzzle, including the grid representation, 
            and tile movement functionality.  The Analysis component provides insights into the development process 
            and design decisions made during the creation of this app.
		</p>
		
		<p><b>Styling:</b> A number of styling improvements were made to the original app, including better styling on the 
            puzzle tiles, the display of the solution and the arrangement of the solved puzzle.
		</p>
		
		<p><b>Functionality: </b>There is now a larger clickable space in each tile to affect a move.  The app will show 
            a message if the user tries to use the Auto-solve feature on a solved puzzle.
		</p>
        </div>
    );
}

export default Analysis;