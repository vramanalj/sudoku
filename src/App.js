import logo from './logo.svg';
import './App.scss';
import SudokuInputBox from './components/SudokuInputBox';
import { indexOf, lastIndexOf, clone, intersection, flatten, zip } from 'lodash'
import {initialBoards} from './initialBoards';
import { Button } from 'react-bootstrap'
import React, { useState, useEffect } from 'react';


function App() {
  const[boardData,setBoardData] = useState(initialBoards[0]);

  function solveSudoku(){
    let boardDataSolution=clone(boardData);
    boardDataSolution.map((row,rowIndex)=>
      row.map((cell,columnIndex)=>
        {
          if(cell===0){
            for(let i=1;i<=9;i++){
              boardDataSolution[rowIndex][columnIndex]=i;
              if(isSudokuEntryValid(boardDataSolution,rowIndex,columnIndex)) {
                break;
              }
            }
          }
        }
      )
    )
    let newBoard=[...boardDataSolution];
    console.log(newBoard===boardDataSolution);
    console.log('Final Sol: '+boardDataSolution);

    setBoardData([]);
    setTimeout(() => {
      setBoardData(newBoard);
    }, 1);
    // initialBoards[0]=boardData
  }

  function isSudokuEntryValid(boardDataToValidate,row,col){
    const gridGroups=[[0,1,2],[3,4,5],[6,7,8]];
    console.log(boardDataToValidate);
    let columnData=[];
    let rowData=[];
    Array.from(Array(9).keys()).map(index=>
      rowData.push(boardDataToValidate[row][index])
    );
    Array.from(Array(9).keys()).map(index=>
      columnData.push(boardDataToValidate[index][col])
    );
  
    let gridRowsToCheck=flatten(gridGroups.filter((grid=>{
      return grid.includes(row)
    })));
    let gridColumnsToCheck=flatten(gridGroups.filter((grid=>{
      return grid.includes(col)
    })));
  
    console.log(gridRowsToCheck);
    console.log(gridColumnsToCheck);
    let gridData=[]
    gridRowsToCheck.map(rowIndex=>
      gridColumnsToCheck.map(colIndex=>
        gridData.push(boardDataToValidate[rowIndex][colIndex])
      )
    )
  
    console.log(gridData);
  
    let duplicateFoundinColumn = indexOf(columnData,boardDataToValidate[row][col]) !== lastIndexOf(columnData,boardDataToValidate[row][col]);
    let duplicateFoundinRow = indexOf(rowData,boardDataToValidate[row][col]) !== lastIndexOf(rowData,boardDataToValidate[row][col]);
    let duplicateFoundinGrid = indexOf(gridData,boardDataToValidate[row][col]) !== lastIndexOf(gridData,boardDataToValidate[row][col]);
  
    console.log("Duplicate Found in Column"+duplicateFoundinColumn);
    console.log("Duplicate Found in Row"+duplicateFoundinRow);
    console.log("Duplicate Found in Grid"+duplicateFoundinGrid);
    if(duplicateFoundinColumn || duplicateFoundinRow || duplicateFoundinGrid){
      return false;
    }
    return true;
  }
  
  function updateSudokuData(e){
    let row = +e.target.id.substring(4,5);
    let col = +e.target.id.substring(10,11);
    console.log('Row: '+row+' Col: '+col);
    initialBoards[0][row][col] = clone(parseInt(e.target.value));
    console.log('Entry Validity: '+isSudokuEntryValid(initialBoards[0],row,col));
  }
  

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
          <Button onClick={solveSudoku}>Solve Sudoku</Button>
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
        </main>
      </div>
    </div>
  );
}

export default App;
