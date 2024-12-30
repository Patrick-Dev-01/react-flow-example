import { Handle, Position } from '@xyflow/react';
import './textUpdater.css';
import { useEffect, useState } from 'react';
import { Trash } from '@phosphor-icons/react';
import TrashIcon from '../../assets/trash-2.svg';
 
export function TextUpdater({ id, data, deleteNode, teste }) {
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
    // if (data.onChange) data.onChange(e.target.value);
  };

  function handleDeleteNode(id: string){
    data.deleteNode(id);
  }
 
  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Top} id='a' />
      <div className='inputs'>
        <input className='title' type="text" name='title' placeholder='...' onChange={handleChangeTitle}/>
        <textarea className="text" id="text" name="text" onChange={handleChangeText} placeholder='...' />
      </div>
      <button type='button' className='deleteButton' onClick={() => handleDeleteNode(id)}>
        <img src={TrashIcon} alt="" />
      </button>
      <Handle type="source" position={Position.Bottom} id="b" />
    </div>
  );
}