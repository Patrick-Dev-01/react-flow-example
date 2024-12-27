import { useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import './App.css';
import { ReactFlow, Controls, Background, applyEdgeChanges, applyNodeChanges, addEdge, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TextUpdater } from './CustomNodes/TextUpdater/TextUpdater';
import { SimpleNode } from './CustomNodes/SimpleNode/SimpleNode';

const initialNodes = [
  {
    id: 'node-inicial',
    position: { x: 0, y: 0 },
    data: { label: 'Inicio' }
  }
]

const nodeTypes = { 
  textUpdater: TextUpdater,
  simpleNode: SimpleNode
}

function App(){
  return(
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  )
}

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const { getViewport } = useReactFlow(); 

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

  const addSimpleNode = () => {
    console.log(uuid());
    const newNode = {
        id: uuid(),
        type: 'simpleNode',
        position: { x: 250, y: 5 },
        data: { value: "" }
    }

    setNodes((nds) => [...nds, newNode]);
  }

  // const addNodeInView = useCallback(() => {

  //   const { x, y, zoom } = getViewport();
  //   // Calcular o centro da viewport
  //   const centerX = x + window.innerWidth / zoom;
  //   const centerY = y + window.innerHeight / zoom;

  //   // Converter para coordenadas do canvas
  //   const position = { x: centerX, y: centerY };

  //   return position;
  // }, [getViewport]);

  const addTextUpdaterNode = () => {
    const newNode = {
      id: uuid(),
      type: `textUpdater`,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        handleChangeTitulo: (newTitle: string) => console.log('Text updated:', newTitle),
        handleChangeText: (newText: string) => console.log('Text updated:', newText)
      }
    }

    setNodes((nds) => [...nds, newNode]);
  }

  function submitNodes(){
    console.log(nodes)
  }

  return (
    <div style={{ height: '100vh' }}>
      <div className='toolbar'>
        <div className="block-types">
          <button type='button' onClick={addSimpleNode}>Simple Node</button>
        </div>
        <div className="block-types">
          <button type='button' onClick={addTextUpdaterNode}>Text Updater</button>
        </div>

        <button type='button' onClick={submitNodes}>Submit diagram</button>
      </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
    </div>
  )
}

export default App
