import { Handle, NodeToolbar, Position, useEdges } from "@xyflow/react";
import { useEffect, useState } from "react";
import './nodeselect.css';
import { Copy, Cube, DotsThreeOutline, Plus, TrashSimple, XCircle } from "@phosphor-icons/react";
import { v4 as uuid } from 'uuid';

export function NodeSelect({ id, data }){
    const [title, setTitle] = useState(data.title || "");
    const [selects, setSelects] = useState(data.selects || [{
        id: uuid(),
        title: '',
        options: []
    }]);
    const [customizeSelect, setCustomizeSelect] = useState({});
    const [showToolbar, setShowToolbar] = useState<boolean>(false);
    const [optionValue, setOptionValue] = useState<string>('');

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
        data.title = e.target.value
    }

    function handleChangeSelectTitle(title: string, id: string){
        const updatedSelects = selects.map(select => {
            return select.id === id ? { ...select, title } : select
        });

        setSelects(updatedSelects);
        data.selects = updatedSelects;
    }
    
    
    function handleNewSelect(){
        const newSelect = [...selects, { id: uuid(), title: '', options: [] }];
        setSelects([...selects, { id: uuid(), title: '', options: [] }]);
        data.selects = newSelect;
    }
    
    function deleteSelect(id: string){
        const updatedSelects = selects.filter(select => select.id !== id);
        setSelects(updatedSelects);
        
        data.selects = updatedSelects;
    }
    
    function handleShowToolbar(id: string){
        setShowToolbar(!showToolbar);
        
        const select = selects.find(select => select.id === id);
        setCustomizeSelect(select);
    }
    
    function handleAddOption(){
        if(optionValue !== ''){
            setCustomizeSelect(prevState => ({
                ...prevState,
                options: [...prevState.options, { id: uuid(), value: optionValue }],
            }));
        }
    }

    function handleDeleteOption(id: string){
        setCustomizeSelect(prevState => ({
            ...prevState,
            options: prevState.options.filter(op => op.id !== id),
        }))
    }

    function handleDeleteNode(id: string){
        data.deleteNode(id);
    }
    
    return (
        <div className="nodeSelect">
            <NodeToolbar className="toolbarSelect" isVisible={showToolbar}>
                <h1>{customizeSelect.title}</h1>
                <div className="addOptions">
                    <input type="text" placeholder="..." onInput={(e) => setOptionValue(e.currentTarget.value)} />
                    <button type="button" onClick={handleAddOption}>Adicionar</button>
                </div>
                <div className="optionsAdded">
                    {customizeSelect.options && customizeSelect.options.map(option => (
                        <span key={option.id}>
                            <p>{option.value}</p>
                            <button type="button" onClick={() => handleDeleteOption(option.id)}>
                                <XCircle size={10} color="red" weight="fill"/>
                            </button>
                        </span>
                    ))}
                </div>
            </NodeToolbar>
            <Handle type="target" position={Position.Top} id="a"/>
            <header className='header'>
                <div className="title">
                    <Cube size={12}/>
                    <input type="text" name='title' placeholder='...' value={title} onChange={handleChangeTitle}/>
                </div>
                <div className="headerActions">
                    <button onClick={handleNewSelect} title="Adicionar novo combo box">
                        <Plus size={10} />
                    </button>
                    <button type="button" title="Copiar bloco e comboxes">
                        <Copy size={10} />
                    </button>
                    <button type='button' onClick={() => handleDeleteNode(id)}>
                        <TrashSimple size={10} />
                    </button>
                </div>
            </header>
            <section className="section">
                {selects.map(select => (
                    <div className="inputBlock" key={select.id}>
                        <div className="inputBox">
                            <input type="text" name="" id="" placeholder="..." 
                                onChange={(e) => handleChangeSelectTitle(e.currentTarget.value, select.id)} 
                                defaultValue={select.title}
                                disabled={showToolbar} 
                            />
                            <button type="button" onClick={() => handleShowToolbar(select.id)}>
                                <DotsThreeOutline size={8} />
                            </button>
                            <button type="button" onClick={() => deleteSelect(select.id)}>
                                <XCircle size={8} weight="fill" color="gray" />
                            </button>
                        </div>
                        <select name="" id="">
                            {select.options.map(option => (
                                <option value="" key={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                ))}
            </section>
            <Handle type="source" position={Position.Bottom} id="b"/>
        </div>
    )
}