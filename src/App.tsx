import { useState, useCallback, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import './App.css';
import { ReactFlow, Controls, Background, applyEdgeChanges, applyNodeChanges, addEdge, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TextUpdater } from './CustomNodes/TextUpdater/TextUpdater';
import { SimpleNode } from './CustomNodes/SimpleNode/SimpleNode';
import { NodeSelect } from './CustomNodes/NodeSelect/NodeSelect';
import { DnDProvider } from './context/dnd/DndContext';
import { useDnD } from './hooks/useDnd';

const initialNodes = [
  {
    id: 'node-inicial',
    position: { x: 0, y: 0 },
    data: { label: 'Inicio' }
  }
]

const nodeTypes = { 
  textUpdater: TextUpdater,
  simpleNode: SimpleNode,
  nodeSelect: NodeSelect
}

function App(){
  return(
    <ReactFlowProvider>
      <DnDProvider>
        <Flow />
      </DnDProvider>
    </ReactFlowProvider>
  )
}

function Flow() {
  const flowKey = 'example-flow-restore';
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport, screenToFlowPosition } = useReactFlow(); 
  const [type, setType] = useDnD();

  const onSave = useCallback(() => {
    if(rfInstance){
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const flow = localStorage.getItem(flowKey);

    if(flow){
      const { nodes, edges, viewport } = JSON.parse(flow);

      const restoredNodes = nodes.map(node => {
          return {
              ...node,
              data: { ...node.data, deleteNode }, // Reatribui a função
          };
      });

      const { x = 0, y = 0, zoom = 1 } = viewport;
      setNodes(restoredNodes || []);
      setEdges(edges || []);
      setViewport({ x, y, zoom });
    }
  }, [setNodes, setViewport]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)), 
    [],
  );

  const onEdgesChange = useCallback(
    (changes) => setNodes((eds) => applyEdgeChanges(changes, eds)), 
    [],
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const removeEdge = (edgeId) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
  }

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
 
  const onDrop = useCallback((event) => {
    event.preventDefault();

    if (!type) {
      return;
    }

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode = {
      id: uuid(),
      type,
      position,
      data: {
        deleteNode: deleteNode,
      },
    };

    setNodes((nds) => nds.concat(newNode));
    
  }, [screenToFlowPosition, type]);

  function deleteNode(nodeId: string){
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));

    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }

  function submitNodes(){
    const cleanNodes = nodes.map(({id, position, type, data}) => {
      const { deleteNode, ...cleanData } = data;

      return {
        id, 
        position, 
        type,
        data: cleanData
      }
    })

    console.log(cleanNodes);
  }

  return (
    <div className='app' style={{ height: '100vh' }}>
      <div className='toolbar'>
        <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'simpleNode')} draggable>
          Simple Node
        </div>
        <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'textUpdater')} draggable>
          Text Updater
        </div>
        <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'nodeSelect')} draggable>
          Node Select
        </div>
        <button type='button' onClick={submitNodes}>Submit diagram</button> 
        {/* <div className="block-types">
          <button type='button' onClick={addSimpleNode}>Simple Node</button>
        </div>
        <div className='block-types'>
          <button type='button' onClick={addNodeSelect}>Node Select</button>
        </div>
        <div className="block-types">
          <button type='button' onClick={addTextUpdaterNode}>Text Updater</button>
        </div>
          */}
      </div>
     
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onInit={setRfInstance}
          onEdgeClick={(event, edge) => removeEdge(edge.id)}
          onDragOver={onDragOver}
          onDrop={onDrop}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
        <div className='rightToolbar'>
          <div className='actions'>
            <button type='button' onClick={onSave}>Save</button>
            <button type='button' onClick={onRestore}>Restore</button>
          </div>
          <div className='nodeOptions'>
            
          </div>
        </div>
    </div>
  )
}

export default App
