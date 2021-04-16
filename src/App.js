import logo from './logo.svg';
import './App.scss';
import SudokuInputBox from './components/SudokuInputBox';

import {initialBoards} from './initialBoards';

function validateSudokuEntry(e){
  console.log('Cell id: '+e.target.id+' Cell Value: '+e.target.value)
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Sudoku
      </header>
      <div className="App-content">
        <aside>
          Rules & Stats
        </aside>
        <main>
          Puzzle
          {initialBoards[0].map(((rowData,rowIndex)=>{
            return (
            <div key={'row-'+rowIndex}>
              {rowData.map((cell,index)=>{
                return (
                <SudokuInputBox value={cell} validate={validateSudokuEntry}
                id={'row-'+rowIndex+'-col-'+index}
                key={'row-'+rowIndex+'-col-'+index} />
                )
              })}
            </div>
            )
          })

          )}
        </main>
      </div>
    </div>
  );
}

export default App;
