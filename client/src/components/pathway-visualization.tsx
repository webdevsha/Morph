import { useMemo } from "react";
import ReactFlow, { 
  Background,
  Controls,
  Handle,
  Position,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { Pathway } from "@shared/schema";

type PathwayVisualizationProps = {
  pathways: Pathway[];
  viewType: "timeline" | "topic";
};

type CustomNode = {
  id: string;
  type: string;
  data: {
    label: string;
    description?: string;
  };
  position: { x: number; y: number };
};

function PathwayNode({ data }: { data: { label: string; description?: string } }) {
  return (
    <div className="bg-card border rounded-lg p-4 shadow-sm">
      <Handle type="target" position={Position.Left} />
      <div className="text-sm font-medium">{data.label}</div>
      {data.description && (
        <div className="text-xs text-muted-foreground mt-1">{data.description}</div>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

const nodeTypes = {
  pathway: PathwayNode,
};

export function PathwayVisualization({ pathways, viewType }: PathwayVisualizationProps) {
  const { nodes, edges } = useMemo(() => {
    const nodes: CustomNode[] = [];
    const edges: any[] = [];
    
    pathways.forEach((pathway, pathwayIndex) => {
      const steps = pathway.steps as { title: string; description: string }[];
      
      steps.forEach((step, stepIndex) => {
        const id = `${pathwayIndex}-${stepIndex}`;
        
        nodes.push({
          id,
          type: 'pathway',
          data: {
            label: step.title,
            description: step.description,
          },
          position: viewType === 'timeline'
            ? { x: stepIndex * 250, y: pathwayIndex * 150 }
            : { x: (stepIndex % 3) * 250, y: Math.floor(stepIndex / 3) * 150 },
        });

        if (stepIndex > 0) {
          edges.push({
            id: `e${pathwayIndex}-${stepIndex}`,
            source: `${pathwayIndex}-${stepIndex - 1}`,
            target: id,
            type: 'smoothstep',
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          });
        }
      });
    });

    return { nodes, edges };
  }, [pathways, viewType]);

  return (
    <div style={{ height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
