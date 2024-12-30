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
  const flowKey = 'example-flow-restore';
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport } = useReactFlow(); 

  const onSave = useCallback(() => {
    if(rfInstance){
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));

      if(flow){
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
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

  const addSimpleNode = () => {
    const newNode = {
        id: uuid(),
        type: 'simpleNode',
        position: { x: 250, y: 5 },
        data: { value: "" }
    }

    setNodes((nds) => [...nds, newNode]);
  }

  
  const addTextUpdaterNode = () => {
    const newNode = {
      id: uuid(),
      type: `textUpdater`,
      position: { x: 250, y: 5 },
      data: {
        title: "",
        text: "",
        deleteNode: deleteNode, 
      },
      
    }
    
    setNodes((nds) => [...nds, newNode]);
  }

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
          onInit={setRfInstance}
          onEdgeClick={(event, edge) => removeEdge(edge.id)}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
        <div className='actions'>
          <button type='button' onClick={onSave}>Save</button>
          <button type='button' onClick={onRestore}>Restore</button>
        </div>
    </div>
  )
}

export default App
