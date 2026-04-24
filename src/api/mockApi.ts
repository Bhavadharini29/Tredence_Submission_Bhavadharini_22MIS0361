import type {
  AutomationDefinition,
  SimulationResponse,
  WorkflowEdge,
  WorkflowNode
} from "../types/workflow";
import { validateWorkflow } from "../utils/workflowValidation";

const automationDefinitions: AutomationDefinition[] = [
  { id: "send_email", label: "Send Email", params: ["to", "subject"] },
  { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] },
  { id: "notify_slack", label: "Notify Slack", params: ["channel", "message"] }
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAutomations = async (): Promise<AutomationDefinition[]> => {
  await delay(250);
  return automationDefinitions;
};

export const simulateWorkflow = async (
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): Promise<SimulationResponse> => {
  await delay(500);
  const { errors, steps } = validateWorkflow(nodes, edges);

  return {
    isValid: errors.length === 0,
    errors,
    steps: steps.map((step, index) => ({
      ...step,
      detail:
        errors.length === 0
          ? `Step ${index + 1} executed successfully. ${step.detail}`
          : `Step ${index + 1} queued for review. ${step.detail}`
    }))
  };
};
