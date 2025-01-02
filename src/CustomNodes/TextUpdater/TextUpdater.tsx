import { Handle, Position } from '@xyflow/react';
import './textUpdater.css';
import { useEffect, useState } from 'react';
import { Cube, TrashSimple } from '@phosphor-icons/react';
 
export function TextUpdater({ id, data }) {
  const [title, setTitle] = useState(data.title || "");
  const [text, setText] = useState(data.text || "");
  
  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
    data.title = e.target.value
    // data.handleChangeTitle(e.target.value);
  }

  const handleChangeText = (e) => {
    setText(e.target.value);
    data.text = e.target.value
  };

  function handleDeleteNode(id: string){
    data.deleteNode(id);
  }
 
  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Top} id='a' />
      <header className='header'>
        <div className="title">
          <Cube size={12}/>
          <input type="text" name='title' defaultValue={data.title} placeholder='...' onChange={handleChangeTitle}/>
        </div>
        <button type='button' className='deleteButton' onClick={() => handleDeleteNode(id)}>
          <TrashSimple size={10}/>
        </button>
      </header>
      <textarea className="text" id="text" rows={5} name="text" defaultValue={data.text} 
        onChange={handleChangeText} placeholder='...' 
      />
      <Handle type="source" position={Position.Bottom} id="b" />
    </div>
  );
}