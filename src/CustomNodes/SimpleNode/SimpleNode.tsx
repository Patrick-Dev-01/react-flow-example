import { Handle, Position } from "@xyflow/react";
import { useState } from "react";

export function SimpleNode({ data }){
    const [text, setText] = useState(data.text || "");
    const handleChange = (e) => {
        setText(e.target.value);
        if (data.onChange) data.onChange(e.target.value);
    };
    
    return (
        <div className="container">
            <Handle type="target" position={Position.Top} />
            <input type="text" onChange={handleChange} value={text} />
            <Handle type="target" position={Position.Bottom} />
        </div>
    )
}