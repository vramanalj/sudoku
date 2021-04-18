import React, {useRef, useState} from "react";
import './SudokuInputBox.scss';

export default function SudokuInputBox(props) {

    const[cellVal,_setCellVal] = useState(props.value);
    const activeRowIndex = useRef(0);
    const activeColIndex = useRef(0);

    const setCellVal = (val) => {
        if(val>=0 && val<10){
            _setCellVal(val);
        }
    };

    function setActiveRowCol(e){
        activeRowIndex.current = parseInt(e.target.id.substring(4,5));
        activeColIndex.current = parseInt(e.target.id.substring(10,11));
        console.log('aCTIVE row: '+activeRowIndex.current);
        console.log('aCTIVE col: '+activeColIndex.current);
    }

    return (
        <input id={props.id} min={1} max={9} value={cellVal!==0?cellVal:''} 
        className={`sudokuCell ${props.colIndex===0?'highlight-left-border':''} 
        ${props.rowIndex===0?'highlight-top-border':''}
        ${props.colIndex===8 || props.colIndex===5 || props.colIndex===2?'highlight-right-border':''}
        ${props.rowIndex===8 || props.rowIndex===5 || props.rowIndex===2?'highlight-bottom-border':''}
        `} 
        type="number" 
        onSelect={(e)=>{
            setActiveRowCol(e)
        }}
        onChange={(e)=>{
            setCellVal(e.target.value)
            props.updateSudokuData(e)}
        }/>
    )
}

