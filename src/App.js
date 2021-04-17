import './App.scss';
import SudokuInputBox from './components/SudokuInputBox';
import { indexOf, cloneDeep, flatten } from 'lodash'
import {initialBoards} from './initialBoards';
import React, { useState, useEffect, useRef } from 'react';
import { useStopwatch, useTimer } from 'react-timer-hook';


function App() {
  let currentBoardOriginalData = useRef([]);
  const[boardData,setBoardData] = useState([]);
  const[gameStatus,setGameStatus] = useState('Not Started');
  const expiryTimer = new Date();
  expiryTimer.setHours(expiryTimer.getHours() + 24); 
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset
  } = useStopwatch({ expiryTimer, onExpire: () => console.warn('onExpire called') });

  function initializeGame(){
    let availableGames =  initialBoards.length;
    let gameNo= Math.floor(Math.random() * (availableGames));
    console.log(gameNo);
    setBoardData([]);
    setTimeout(() => {
      setBoardData(initialBoards[gameNo]);
    }, 1);
    currentBoardOriginalData.current=cloneDeep(initialBoards[gameNo]);
    reset();
    setGameStatus('In Progress');
  }

  useEffect(()=>{
    initializeGame();
  },[])

  function solveSudoku(data) {
    let boardSolution = cloneDeep(data);
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (boardSolution[i][j] === 0) {
          for (let k = 1; k <= 9; k++) {
            if (isSudokuEntryValid(boardSolution, i, j, k)) {
              boardSolution[i][j] = k;
            if (solveSudoku(boardSolution)) {
              return true;
            } else {
              boardSolution[i][j] = 0;
            }
          }
        }
        return false;
      }
    }
  }   
  setBoardData([]);
  setTimeout(() => {
    setBoardData(boardSolution);
  }, 1);
  setGameStatus('Finished');
  pause();
  }
  

  function resetSudoku(){
    setGameStatus('In Progress');
    reset();
    setBoardData([]);
    setTimeout(() => {
      setBoardData(currentBoardOriginalData.current);
    }, 10);
  }

  function isSudokuEntryValid(boardDataToValidate,row,col,val){
    if(
      rowDuplicatePresent(boardDataToValidate,row,col,val) || 
      colDuplicatePresent(boardDataToValidate,row,col,val) ||
      gridDuplicatePresent(boardDataToValidate,row,col,val)
    ){
      return false;
    }
    return true;
  }

  function gridDuplicatePresent(boardDataToValidate,row,col,val){
    const gridGroups=[[0,1,2],[3,4,5],[6,7,8]];
    let gridRowsToCheck=flatten(gridGroups.filter((grid=>{
      return grid.includes(row)
    })));
    let gridColumnsToCheck=flatten(gridGroups.filter((grid=>{
      return grid.includes(col)
    })));

    let gridData=[]
    gridRowsToCheck.map(rowIndex=>
      gridColumnsToCheck.map(colIndex=>
        gridData.push(boardDataToValidate[rowIndex][colIndex])
      )
    )
    let duplicateFoundinGrid = indexOf(gridData,val) > -1
    return duplicateFoundinGrid;
  }

  function rowDuplicatePresent(boardDataToValidate,row,col,val){
    let rowData=[];
    Array.from(Array(9).keys()).map(index=>
      rowData.push(boardDataToValidate[row][index])
    );
    let duplicateFoundinRow = indexOf(rowData,val) > -1
    return duplicateFoundinRow;
  }

  function colDuplicatePresent(boardDataToValidate,row,col,val){
    let columnData=[];
    Array.from(Array(9).keys()).map(index=>
      columnData.push(boardDataToValidate[index][col])
    );
    let duplicateFoundinColumn = indexOf(columnData,val) > -1
    return duplicateFoundinColumn;
  }

  function isSudokuSolved(data){
   let result = data.filter((row)=>
      row.indexOf(0)>-1
    )
    if(result.length>0){
      return false;
    }
    return true;
  }
  
  function updateSudokuData(e){
    let row = +e.target.id.substring(4,5);
    let col = +e.target.id.substring(10,11);
    console.log('Row: '+row+' Col: '+col);
    console.log('Entry Validity: '+isSudokuEntryValid(boardData,row,col,parseInt(e.target.value)));
    boardData[row][col] = cloneDeep(parseInt(e.target.value));

  }

  function pauseGame(){
    setGameStatus('Paused');
    pause();
  }

  function resumeGame(){
    setGameStatus('In Progress');
    start();
  }
  

  return (
    <div className="App">
      <header className="App-header">
        Sudoku
      </header>
      <div className="App-content">
        <aside className="rulesStats">
          Rules & Stats
        </aside>
        <main className="puzzleArea">
          <div className="puzzleTopButtons mb-2 buttons are-medium">
            {gameStatus==='In Progress' && <button className="button is-link" onClick={pauseGame}>Pause Game</button>}
            {gameStatus==='Paused' && <button className="button is-link" onClick={resumeGame}>Resume Game</button>}
            <div className="timerText"><span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span></div>
            <button className="button is-link" onClick={initializeGame}>New Game</button>
          </div>
          <div className={gameStatus==='Paused'?'disabled':''}>
            {boardData && boardData.map(((rowData,rowIndex)=>{
              return (
                  <div key={'row-'+rowIndex}>
                    {rowData.map((cell,index)=>{
                      return (
                      <SudokuInputBox updateSudokuData={updateSudokuData} value={cell} validate={isSudokuEntryValid}
                      id={'row-'+rowIndex+'-col-'+index}
                      key={'row-'+rowIndex+'-col-'+index} />
                      )
                    })}
                  </div>
              )
            })
            )}
          </div>
          <div className="puzzleBottomButtons mt-2 buttons are-medium">
            <button className="button is-danger" onClick={resetSudoku}>Reset Sudoku</button>
            <button className="button is-primary" onClick={()=>{solveSudoku(currentBoardOriginalData.current)}}>Solve Sudoku</button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
