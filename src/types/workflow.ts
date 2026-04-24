import type { Edge, Node } from "reactflow";

export type NodeKind = "start" | "task" | "approval" | "automation" | "end";

export type KeyValuePair = {
  id: string;
  key: string;
  value: string;
};

export type AutomationDefinition = {
  id: string;
  label: string;
  params: string[];
};

export type SimulationStep = {
  nodeId: string;
  nodeLabel: string;
  status: "success" | "warning" | "error";
  detail: string;
};

export type StartNodeData = {
  type: "start";
  title: string;
  metadata: KeyValuePair[];
};

export type TaskNodeData = {
  type: "task";
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KeyValuePair[];
};

export type ApprovalNodeData = {
  type: "approval";
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
};

export type AutomationNodeData = {
  type: "automation";
  title: string;
  actionId: string;
  actionLabel: string;
  actionParams: Record<string, string>;
};

export type EndNodeData = {
  type: "end";
  endMessage: string;
  summaryFlag: boolean;
};

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomationNodeData
  | EndNodeData;

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

export type SimulationResponse = {
  isValid: boolean;
  errors: string[];
  steps: SimulationStep[];
};
