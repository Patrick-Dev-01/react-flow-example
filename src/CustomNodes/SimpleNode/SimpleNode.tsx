import { Handle, Position } from "@xyflow/react";
import { useEffect, useState } from "react";
import './simpleNode.css'

export function SimpleNode({ data }){
    const [text, setText] = useState(data.text || "");
    const handleChange = (e) => {
        setText(e.target.value);
        data.text = e.target.value
    };
    
    return (
        <div className="container">
            <Handle type="target" position={Position.Top} id="a"/>
            <input type="text" className="simpleInput" onChange={handleChange} value={text} />
            <Handle type="source" position={Position.Bottom} id="b"/>
        </div>
    )
}