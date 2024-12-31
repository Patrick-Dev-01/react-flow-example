import { Handle, NodeToolbar, Position } from "@xyflow/react";
import { useEffect, useState } from "react";
import './nodeselect.css';
import { Cube, TrashSimple } from "@phosphor-icons/react";

export function NodeSelect({ data }){
    const [title, setTitle] = useState(data.title || "");

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
        data.title = e.target.value
      }
    
    function handleDeleteNode(id: string){
        data.deleteNode(id);
    }
    
    return (
        <div className="nodeBlock">
        
            <Handle type="target" position={Position.Top} id="a"/>
            <header className='header'>
                <div className="title">
                    <Cube size={12}/>
                    <input type="text" name='title' placeholder='...' value={title} onChange={handleChangeTitle}/>
                </div>
                <button type='button' className='deleteButton' onClick={() => handleDeleteNode(id)}>
                    <TrashSimple size={10}/>
                </button>
            </header>
            <section>

            </section>
            <Handle type="source" position={Position.Bottom} id="b"/>
        </div>
    )
}