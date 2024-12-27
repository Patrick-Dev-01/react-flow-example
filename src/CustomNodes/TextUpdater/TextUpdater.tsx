import { Handle, Position } from '@xyflow/react';
import './textUpdater.css';
import { useState } from 'react';
 
export function TextUpdater({ data }) {
  const [title, setTitle] = useState(data.title || "");
  const [text, setText] = useState(data.text || "");
  
  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
    if(data.onChange) data.handleChangeTitle(e.target.value);
  }

  const handleChangeText = (e) => {
    setText(e.target.value);
    if (data.onChange) data.onChange(e.target.value);
  };
 
  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Top} />
      <div className='inputs'>
        <input className='title' type="text" name='title' placeholder='...' onChange={handleChangeTitle}/>
        <textarea className="text" id="text" name="text" onChange={handleChangeText} placeholder='...' />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
}