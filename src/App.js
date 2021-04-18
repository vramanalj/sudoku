import './App.scss';
import SudokuInputBox from './components/SudokuInputBox';
import { indexOf, cloneDeep, flatten, lastIndexOf } from 'lodash'
import {initialBoards} from './initialBoards';
import React, { useState, useEffect, useRef } from 'react';
import { useStopwatch, useTimer, } from 'react-timer-hook';

function App() {
  let currentBoardOriginalData = useRef([]);
  const[boardData,setBoardData] = useState([]);
  const[gameStatus,setGameStatus] = useState('Not Started');
  const[showResultFlag,setShowResultFlag] = useState(false);
  const[gamesPlayed, setGamesPlayed] = useState(0);
  const[gamesWon, setGamesWon] = useState(0);
  const[timeRecords, setTimeRecords] = useState([]);

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

  function gridDuplicatePresent(boardDataToValidate,row,col,val=undefined){
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
    if(val){
      let duplicateFoundinGrid = indexOf(gridData,val) > -1
      return duplicateFoundinGrid;
    }else{
      let duplicateFoundinGrid = indexOf(gridData,boardDataToValidate[row][col]) !== lastIndexOf(gridData,boardDataToValidate[row][col]);
      return duplicateFoundinGrid;
    }

  }

  function rowDuplicatePresent(boardDataToValidate,row,col,val=undefined){
    let rowData=[];
    Array.from(Array(9).keys()).map(index=>
      rowData.push(boardDataToValidate[row][index])
    );
    // if a value is passed check for it's presence in a row or just find out if there are any duplicates in a row
    if(val){
      let duplicateFoundinRow = indexOf(rowData,val) > -1
      return duplicateFoundinRow;
    }else{
      let duplicateFoundinRow = indexOf(rowData,boardDataToValidate[row][col]) !== lastIndexOf(rowData,boardDataToValidate[row][col]);
      return duplicateFoundinRow
    }

  }

  function colDuplicatePresent(boardDataToValidate,row,col,val=undefined){
    let columnData=[];
    Array.from(Array(9).keys()).map(index=>
      columnData.push(boardDataToValidate[index][col])
    );
    if(val){
      let duplicateFoundinColumn = indexOf(columnData,val) > -1
      return duplicateFoundinColumn;
    }else{
      let duplicateFoundinColumn = indexOf(columnData,boardDataToValidate[row][col]) !== lastIndexOf(columnData,boardDataToValidate[row][col]);
      return duplicateFoundinColumn;
    }
  }

  function isSudokuSolved(data,showResult=false){
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if(rowDuplicatePresent(data,i,j) || colDuplicatePresent(data,i,j) || gridDuplicatePresent(data,i,j) || 
        data[i][j]===0 || isNaN(data[i][j])){
          console.log("Failed");
          setGamesPlayed(gamesPlayed+1);
          showResult && setShowResultFlag('Fail');
          return false;
        }
      }
    }
    console.log("Passed");
    showResult && setShowResultFlag('Pass');
    setGamesPlayed(gamesPlayed+1);
    setGamesWon(gamesWon+1);
    let newArr = [...timeRecords];
    newArr.push([minutes.toString().padStart(2, '0')+" : "+seconds.toString().padStart(2, '0')]);
    setTimeRecords(newArr)
    pause();
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
        Sudoku.
      </header>
      <div className="App-content">
        <aside className="rulesStats has-text-left">
          <div className="content">
            <h5 className="title is-size-6">Rules </h5>
            <div className="pl-5 is-size-5">
              <p className="has-text-justified">The goal of Sudoku is to fill in a 9×9 grid with digits so that each column, row, and 3×3 section contain the numbers between 1 to 9. 
                At the beginning of the game, the 9×9 grid will have some of the squares filled in. 
                Your job is to use logic to fill in the missing digits and complete the grid. Don’t forget, a move is incorrect if:
              </p>
              <div className="">
                <ul>
                  <li> Any row contains more than one of the same number from 1 to 9 </li>
                  <li> Any column contains more than one of the same number from 1 to 9 </li>
                  <li> Any 3×3 grid contains more than one of the same number from 1 to 9 </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="content">
            <h5 className="title is-6">Stats </h5>
            <div className='stats'>
              <div className="statLabels pl-5">
                <div><span>Games Finished</span></div>
                <div><span>Games Won</span></div>
                <div><span>Best Time</span></div>
              </div>
              <div className="statValues">
                <div><span>{gamesPlayed}</span></div>
                <div><span>{gamesWon}</span></div>
                <div><span>{timeRecords[0]}</span></div>
              </div>
            </div>
          </div>
        </aside>
        <main className="puzzleArea">
          <div className="puzzleAreaContent">
          <div className="puzzleTopButtons mb-2 buttons">
            {gameStatus==='In Progress' && <button className="button is-link" onClick={pauseGame}>Pause Game</button>}
            {gameStatus==='Paused' && <button className="button is-link" onClick={resumeGame}>Resume Game</button>}
            <div className="timerText"><span>{hours.toString().padStart(2, '0')}</span>:
            <span>{minutes.toString().padStart(2, '0')}</span>:<span>{seconds.toString().padStart(2, '0')}</span></div>
            <button className="button is-link" onClick={initializeGame}>New Game</button>
          </div>
          <div className={`boardDiv ${gameStatus==='Paused'?'disabled':''}`}>
            {boardData && boardData.map(((rowData,rowIndex)=>{
              return (
                  <div key={'row-'+rowIndex}>
                    {rowData.map((cell,index)=>{
                      return (
                      <SudokuInputBox updateSudokuData={updateSudokuData} value={cell} validate={isSudokuEntryValid}
                      id={'row-'+rowIndex+'-col-'+index}
                      key={'row-'+rowIndex+'-col-'+index}
                      rowIndex={rowIndex}
                      colIndex={index}
                      />
                      )
                    })}
                  </div>
              )
            })
            )}
          </div>
          <div className="puzzleBottomButtons mt-2 buttons">
            <button className="button is-danger" onClick={resetSudoku}>Reset Sudoku</button>
            <button className="button is-primary" onClick={()=>{isSudokuSolved(boardData,true)}}>Submit Sudoku</button>
            <button className="button is-warning" onClick={()=>{solveSudoku(currentBoardOriginalData.current)}}>Solve Sudoku</button>
          </div>
          {showResultFlag!==false && <div className={`message ${showResultFlag==='Pass'?'is-success':'is-danger'}`}>
            <div className="message-header">
              <p>Result</p>
              <button className="delete" aria-label="delete" onClick={()=>{setShowResultFlag(false)}}></button>
            </div>
            <div className="message-body">
              {showResultFlag === 'Pass' && <span><strong>Good Job!</strong> You have sucessfully cleared this puzzle.</span>}
              {showResultFlag === 'Fail' && <span><strong>Sorry!</strong> This solution is not correct, please check again.</span>}
            </div>
          </div>
          }
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
