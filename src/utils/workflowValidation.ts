import type { SimulationStep, WorkflowEdge, WorkflowNode } from "../types/workflow";

type ValidationResult = {
  errors: string[];
  steps: SimulationStep[];
};

const labelForNode = (node: WorkflowNode) => {
  switch (node.data.type) {
    case "start":
      return node.data.title;
    case "task":
      return node.data.title;
    case "approval":
      return node.data.title;
    case "automation":
      return node.data.title;
    case "end":
      return node.data.endMessage;
  }
};

const detectCycle = (nodes: WorkflowNode[], edges: WorkflowEdge[]) => {
  const map = new Map<string, string[]>();
  nodes.forEach((node) => map.set(node.id, []));
  edges.forEach((edge) => {
    const list = map.get(edge.source);
    if (list) {
      list.push(edge.target);
    }
  });

  const visited = new Set<string>();
  const stack = new Set<string>();

  const walk = (nodeId: string): boolean => {
    if (stack.has(nodeId)) {
      return true;
    }
    if (visited.has(nodeId)) {
      return false;
    }
    visited.add(nodeId);
    stack.add(nodeId);

    const neighbours = map.get(nodeId) ?? [];
    for (const next of neighbours) {
      if (walk(next)) {
        return true;
      }
    }

    stack.delete(nodeId);
    return false;
  };

  return nodes.some((node) => walk(node.id));
};

export const validateWorkflow = (
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): ValidationResult => {
  const errors: string[] = [];
  const steps: SimulationStep[] = [];
  const startNodes = nodes.filter((node) => node.data.type === "start");
  const endNodes = nodes.filter((node) => node.data.type === "end");

  if (startNodes.length !== 1) {
    errors.push("Workflow must contain exactly one Start node.");
  }

  if (endNodes.length === 0) {
    errors.push("Workflow must contain at least one End node.");
  }

  for (const node of nodes) {
    const incoming = edges.filter((edge) => edge.target === node.id);
    const outgoing = edges.filter((edge) => edge.source === node.id);

    if (node.data.type === "start" && incoming.length > 0) {
      errors.push("Start node cannot have incoming connections.");
    }

    if (node.data.type !== "end" && outgoing.length === 0) {
      errors.push(`"${labelForNode(node)}" is missing an outgoing connection.`);
    }

    if (node.data.type !== "start" && incoming.length === 0) {
      errors.push(`"${labelForNode(node)}" is disconnected from the workflow.`);
    }

    steps.push({
      nodeId: node.id,
      nodeLabel: labelForNode(node),
      status: incoming.length || node.data.type === "start" ? "success" : "warning",
      detail:
        node.data.type === "automation"
          ? "Ready to invoke configured automation."
          : "Ready for workflow execution."
    });
  }

  if (detectCycle(nodes, edges)) {
    errors.push("Cycle detected. Please remove circular paths before simulation.");
  }

  return { errors, steps };
};
