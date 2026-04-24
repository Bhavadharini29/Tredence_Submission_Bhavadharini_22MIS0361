import type { NodeKind, WorkflowNodeData } from "../types/workflow";

export type NodeCatalogItem = {
  type: NodeKind;
  label: string;
  hint: string;
};

export const nodeCatalog: NodeCatalogItem[] = [
  { type: "start", label: "Start Node", hint: "Entry point" },
  { type: "task", label: "Task Node", hint: "Manual human task" },
  { type: "approval", label: "Approval Node", hint: "Manager or HR sign-off" },
  { type: "automation", label: "Automated Step", hint: "System action" },
  { type: "end", label: "End Node", hint: "Workflow finish" }
];

export const createDefaultNodeData = (type: NodeKind): WorkflowNodeData => {
  switch (type) {
    case "start":
      return {
        type: "start",
        title: "Start",
        metadata: []
      };
    case "task":
      return {
        type: "task",
        title: "Collect documents",
        description: "",
        assignee: "",
        dueDate: "",
        customFields: []
      };
    case "approval":
      return {
        type: "approval",
        title: "Manager approval",
        approverRole: "Manager",
        autoApproveThreshold: 0
      };
    case "automation":
      return {
        type: "automation",
        title: "Automated step",
        actionId: "",
        actionLabel: "",
        actionParams: {}
      };
    case "end":
      return {
        type: "end",
        endMessage: "Workflow completed",
        summaryFlag: true
      };
  }
};
