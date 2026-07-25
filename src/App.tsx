import { useState } from 'react'
import Analysis from './Analysis.tsx'
import Puzzle from './Puzzle.tsx'
import Introduction from './Introduction.tsx'
import AppCSS from './App.module.css';

function App(): React.ReactElement {
  const [
    selectedTab,  // can be 'introduction', 'puzzle', or 'analysis'
    setSelectedTab
  ] = useState('introduction');

  return (
    <>
      <h1>Sliding Tile Puzzle Solver</h1>

      <div id="tabs">
          <div className={AppCSS.tabControls}>
            <div id="tab-introduction" className={selectedTab == 'introduction' ? AppCSS.selected : ''} onClick={() => setSelectedTab('introduction')}>Introduction</div>
            <div id="tab-puzzle" className={selectedTab == 'puzzle' ? AppCSS.selected : ''} onClick={() => setSelectedTab('puzzle')}>Puzzle</div>
            <div id="tab-analysis" className={selectedTab == 'analysis' ? AppCSS.selected : ''} onClick={() => setSelectedTab('analysis')}>Development Analysis</div>
          </div>

          <div className={ AppCSS.tabBody }>
            {selectedTab == 'introduction' ? (<Introduction />) : 
              selectedTab == 'puzzle' ? (<Puzzle />) : (<Analysis />)
            }
          </div>
      </div>
    </>
  )
}

export default App
