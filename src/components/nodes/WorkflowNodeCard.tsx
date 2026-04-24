import { Handle, Position, type NodeProps } from "reactflow";
import type { WorkflowNodeData } from "../../types/workflow";

const typeStyles: Record<WorkflowNodeData["type"], string> = {
  start: "node-card start",
  task: "node-card task",
  approval: "node-card approval",
  automation: "node-card automation",
  end: "node-card end"
};

const titleForNode = (data: WorkflowNodeData) => {
  switch (data.type) {
    case "start":
      return data.title || "Start";
    case "task":
      return data.title || "Task";
    case "approval":
      return data.title || "Approval";
    case "automation":
      return data.title || "Automated Step";
    case "end":
      return data.endMessage || "End";
  }
};

const subtitleForNode = (data: WorkflowNodeData) => {
  switch (data.type) {
    case "start":
      return "Workflow begins here";
    case "task":
      return data.assignee ? `Assigned to ${data.assignee}` : "Human task";
    case "approval":
      return data.approverRole ? `${data.approverRole} approval` : "Approval step";
    case "automation":
      return data.actionLabel || "No automation selected";
    case "end":
      return data.summaryFlag ? "Summary enabled" : "Final step";
  }
};

export const WorkflowNodeCard = ({ data, selected }: NodeProps<WorkflowNodeData>) => (
  <div className={`${typeStyles[data.type]} ${selected ? "selected" : ""}`}>
    {data.type !== "start" && <Handle type="target" position={Position.Top} />}
    <div className="node-card__type">{data.type}</div>
    <div className="node-card__title">{titleForNode(data)}</div>
    <div className="node-card__subtitle">{subtitleForNode(data)}</div>
    {data.type !== "end" && <Handle type="source" position={Position.Bottom} />}
  </div>
);
