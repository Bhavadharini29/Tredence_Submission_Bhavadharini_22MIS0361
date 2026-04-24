import type { WorkflowEdge, WorkflowNode } from "../types/workflow";

export const serializeWorkflow = (nodes: WorkflowNode[], edges: WorkflowEdge[]) => ({
  nodes: nodes.map((node) => ({
    id: node.id,
    type: node.data.type,
    position: node.position,
    data: node.data
  })),
  edges: edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target
  }))
});
