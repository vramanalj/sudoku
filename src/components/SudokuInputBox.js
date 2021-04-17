import React, {useState} from "react";
import './SudokuInputBox.scss';

export default function SudokuInputBox(props) {

    const[cellVal,_setCellVal] = useState(props.value);

    const setCellVal = (val) => {
        if(val>=0 && val<10){
            _setCellVal(val);
        }
    };

    return (
        <input id={props.id} min={1} max={9} value={cellVal!==0?cellVal:''} className="sudokuCell" type="number" 
        onChange={(e)=>{
            setCellVal(e.target.value)
            props.updateSudokuData(e)}
        }/>
    )
}

