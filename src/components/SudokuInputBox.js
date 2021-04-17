import React, {useState} from "react";
import { Form } from 'react-bootstrap';
import './SudokuInputBox.scss';

export default function SudokuInputBox(props) {

    const[cellVal,setCellVal] = useState(props.value);

    return (
        <Form.Control id={props.id} value={cellVal!==0?cellVal:''} className="sudokuCell" type="number" 
        onChange={(e)=>{
            setCellVal(e.target.value)
            props.updateSudokuData(e)}
        }/>
    )
}

