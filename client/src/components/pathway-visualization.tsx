import { useMemo } from "react";
import ReactFlow, { 
  Background,
  Controls,
  Handle,
  Position,
  MarkerType,
  Node,
  Edge,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { Pathway, PathwayNode, PathwayEdge } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type PathwayVisualizationProps = {
  pathways: Pathway[];
  viewType: "timeline" | "topic";
  onNodeClick?: (nodeId: string) => void;
};

const difficultyColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800"
};

function PathwayNodeComponent({ data }: { data: PathwayNode["data"] }) {
  return (
    <div className="bg-card border rounded-lg p-4 shadow-sm min-w-[200px]">
      <Handle type="target" position={Position.Left} />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{data.title}</h3>
          {data.difficulty && (
            <Badge className={difficultyColors[data.difficulty as keyof typeof difficultyColors]}>
              {data.difficulty}
            </Badge>
          )}
        </div>

        {data.description && (
          <p className="text-xs text-muted-foreground">{data.description}</p>
        )}

        {data.duration && (
          <div className="text-xs text-muted-foreground">
            Duration: {data.duration}
          </div>
        )}

        {typeof data.completion === 'number' && (
          <div className="space-y-1">
            <Progress value={data.completion} className="h-1" />
            <div className="text-xs text-right text-muted-foreground">
              {data.completion}% complete
            </div>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
}

const ResourceNodeComponent = ({ data }: { data: PathwayNode["data"] }) => (
  <div className="bg-accent/20 border rounded-lg p-3 shadow-sm min-w-[150px]">
    <Handle type="target" position={Position.Left} />
    <div className="text-sm font-medium">{data.title}</div>
    {data.description && (
      <div className="text-xs text-muted-foreground mt-1">{data.description}</div>
    )}
    <Handle type="source" position={Position.Right} />
  </div>
);

const SkillNodeComponent = ({ data }: { data: PathwayNode["data"] }) => (
  <div className="bg-primary/10 border rounded-lg p-2 shadow-sm">
    <Handle type="target" position={Position.Left} />
    <div className="text-sm">{data.title}</div>
    <Handle type="source" position={Position.Right} />
  </div>
);

const nodeTypes = {
  pathway: PathwayNodeComponent,
  resource: ResourceNodeComponent,
  skill: SkillNodeComponent,
};

export function PathwayVisualization({ pathways, viewType, onNodeClick }: PathwayVisualizationProps) {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    pathways.forEach((pathway, pathwayIndex) => {
      // Create pathway node
      const pathwayNode: PathwayNode = {
        id: `pathway-${pathway.id}`,
        type: 'pathway',
        data: {
          title: pathway.title,
          description: pathway.description,
          difficulty: pathway.difficulty,
          duration: pathway.duration,
          category: pathway.category,
          completion: 0, // This should come from user progress data
        },
        position: viewType === 'timeline'
          ? { x: pathwayIndex * 300, y: 0 }
          : { x: (pathwayIndex % 3) * 350, y: Math.floor(pathwayIndex / 3) * 200 }
      };
      nodes.push(pathwayNode);

      // Add dependencies
      pathway.dependencies?.forEach((depId) => {
        edges.push({
          id: `dep-${pathway.id}-${depId}`,
          source: `pathway-${depId}`,
          target: `pathway-${pathway.id}`,
          type: 'smoothstep',
          animated: true,
          style: { stroke: 'hsl(var(--primary))' },
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        });
      });

      // Add resources
      pathway.resources?.forEach((resource, resourceIndex) => {
        const resourceNode: PathwayNode = {
          id: `resource-${pathway.id}-${resourceIndex}`,
          type: 'resource',
          data: {
            title: resource.title,
            description: resource.type
          },
          position: viewType === 'timeline'
            ? { x: pathwayIndex * 300, y: 150 }
            : { x: (pathwayIndex % 3) * 350 + 100, y: Math.floor(pathwayIndex / 3) * 200 + 150 }
        };
        nodes.push(resourceNode);

        edges.push({
          id: `res-${pathway.id}-${resourceIndex}`,
          source: `pathway-${pathway.id}`,
          target: `resource-${pathway.id}-${resourceIndex}`,
          type: 'smoothstep',
          style: { stroke: 'hsl(var(--muted))' }
        });
      });

      // Add skills
      pathway.skills_gained?.forEach((skill, skillIndex) => {
        const skillNode: PathwayNode = {
          id: `skill-${pathway.id}-${skillIndex}`,
          type: 'skill',
          data: {
            title: skill
          },
          position: viewType === 'timeline'
            ? { x: pathwayIndex * 300 + 50, y: -100 }
            : { x: (pathwayIndex % 3) * 350 + 50, y: Math.floor(pathwayIndex / 3) * 200 - 100 }
        };
        nodes.push(skillNode);

        edges.push({
          id: `skill-${pathway.id}-${skillIndex}`,
          source: `pathway-${pathway.id}`,
          target: `skill-${pathway.id}-${skillIndex}`,
          type: 'smoothstep',
          style: { stroke: 'hsl(var(--primary))' }
        });
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
        onNodeClick={(_, node) => onNodeClick?.(node.id)}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}