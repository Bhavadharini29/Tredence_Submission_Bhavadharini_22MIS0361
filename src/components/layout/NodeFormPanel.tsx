import type {
  ApprovalNodeData,
  AutomationDefinition,
  AutomationNodeData,
  EndNodeData,
  KeyValuePair,
  StartNodeData,
  TaskNodeData,
  WorkflowNode
} from "../../types/workflow";

type NodeFormPanelProps = {
  node: WorkflowNode | null;
  automations: AutomationDefinition[];
  onChange: (nodeId: string, updater: (current: WorkflowNode["data"]) => WorkflowNode["data"]) => void;
};

const createEmptyPair = (): KeyValuePair => ({
  id: crypto.randomUUID(),
  key: "",
  value: ""
});

const KeyValueEditor = ({
  items,
  onChange,
  label
}: {
  items: KeyValuePair[];
  label: string;
  onChange: (items: KeyValuePair[]) => void;
}) => (
  <div className="form-section">
    <label>{label}</label>
    <div className="key-value-list">
      {items.map((item) => (
        <div key={item.id} className="key-value-row">
          <input
            value={item.key}
            onChange={(event) =>
              onChange(
                items.map((entry) =>
                  entry.id === item.id ? { ...entry, key: event.target.value } : entry
                )
              )
            }
            placeholder="Key"
          />
          <input
            value={item.value}
            onChange={(event) =>
              onChange(
                items.map((entry) =>
                  entry.id === item.id ? { ...entry, value: event.target.value } : entry
                )
              )
            }
            placeholder="Value"
          />
          <button
            type="button"
            className="ghost-button"
            onClick={() => onChange(items.filter((entry) => entry.id !== item.id))}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="ghost-button" onClick={() => onChange([...items, createEmptyPair()])}>
        Add field
      </button>
    </div>
  </div>
);

export const NodeFormPanel = ({ node, automations, onChange }: NodeFormPanelProps) => {
  if (!node) {
    return (
      <aside className="panel form-panel">
        <div className="panel__header">
          <h2>Node Settings</h2>
          <p>Select a node on the canvas to edit its configuration.</p>
        </div>
      </aside>
    );
  }

  const updateNode = (updater: (current: WorkflowNode["data"]) => WorkflowNode["data"]) => {
    onChange(node.id, updater);
  };

  const renderStartForm = (data: StartNodeData) => (
    <>
      <label>
        Start title
        <input
          value={data.title}
          onChange={(event) => updateNode((current) => ({ ...current, title: event.target.value }))}
        />
      </label>
      <KeyValueEditor
        items={data.metadata}
        label="Metadata"
        onChange={(metadata) => updateNode((current) => ({ ...current, metadata }))}
      />
    </>
  );

  const renderTaskForm = (data: TaskNodeData) => (
    <>
      <label>
        Title
        <input
          value={data.title}
          onChange={(event) => updateNode((current) => ({ ...current, title: event.target.value }))}
        />
      </label>
      <label>
        Description
        <textarea
          value={data.description}
          onChange={(event) =>
            updateNode((current) => ({ ...current, description: event.target.value }))
          }
        />
      </label>
      <label>
        Assignee
        <input
          value={data.assignee}
          onChange={(event) => updateNode((current) => ({ ...current, assignee: event.target.value }))}
        />
      </label>
      <label>
        Due date
        <input
          type="date"
          value={data.dueDate}
          onChange={(event) => updateNode((current) => ({ ...current, dueDate: event.target.value }))}
        />
      </label>
      <KeyValueEditor
        items={data.customFields}
        label="Custom fields"
        onChange={(customFields) => updateNode((current) => ({ ...current, customFields }))}
      />
    </>
  );

  const renderApprovalForm = (data: ApprovalNodeData) => (
    <>
      <label>
        Title
        <input
          value={data.title}
          onChange={(event) => updateNode((current) => ({ ...current, title: event.target.value }))}
        />
      </label>
      <label>
        Approver role
        <input
          value={data.approverRole}
          onChange={(event) =>
            updateNode((current) => ({ ...current, approverRole: event.target.value }))
          }
        />
      </label>
      <label>
        Auto-approve threshold
        <input
          type="number"
          value={data.autoApproveThreshold}
          onChange={(event) =>
            updateNode((current) => ({
              ...current,
              autoApproveThreshold: Number(event.target.value)
            }))
          }
        />
      </label>
    </>
  );

  const renderAutomationForm = (data: AutomationNodeData) => {
    const selectedAutomation = automations.find((item) => item.id === data.actionId);

    return (
      <>
        <label>
          Title
          <input
            value={data.title}
            onChange={(event) => updateNode((current) => ({ ...current, title: event.target.value }))}
          />
        </label>
        <label>
          Action
          <select
            value={data.actionId}
            onChange={(event) => {
              const option = automations.find((item) => item.id === event.target.value);
              updateNode((current) => ({
                ...current,
                actionId: option?.id ?? "",
                actionLabel: option?.label ?? "",
                actionParams: option
                  ? Object.fromEntries(option.params.map((param) => [param, ""]))
                  : {}
              }));
            }}
          >
            <option value="">Select automation</option>
            {automations.map((automation) => (
              <option key={automation.id} value={automation.id}>
                {automation.label}
              </option>
            ))}
          </select>
        </label>

        {selectedAutomation?.params.map((param) => (
          <label key={param}>
            {param}
            <input
              value={data.actionParams[param] ?? ""}
              onChange={(event) =>
                updateNode((current) => {
                  const automationCurrent = current as AutomationNodeData;
                  return {
                    ...automationCurrent,
                    actionParams: {
                      ...automationCurrent.actionParams,
                      [param]: event.target.value
                    }
                  };
                })
              }
            />
          </label>
        ))}
      </>
    );
  };

  const renderEndForm = (data: EndNodeData) => (
    <>
      <label>
        End message
        <textarea
          value={data.endMessage}
          onChange={(event) =>
            updateNode((current) => ({ ...current, endMessage: event.target.value }))
          }
        />
      </label>
      <label className="toggle">
        <input
          type="checkbox"
          checked={data.summaryFlag}
          onChange={(event) =>
            updateNode((current) => ({ ...current, summaryFlag: event.target.checked }))
          }
        />
        Include summary
      </label>
    </>
  );

  return (
    <aside className="panel form-panel">
      <div className="panel__header">
        <h2>Node Settings</h2>
        <p>Editing {node.data.type} node</p>
      </div>

      <div className="form-stack">
        {node.data.type === "start" && renderStartForm(node.data)}
        {node.data.type === "task" && renderTaskForm(node.data)}
        {node.data.type === "approval" && renderApprovalForm(node.data)}
        {node.data.type === "automation" && renderAutomationForm(node.data)}
        {node.data.type === "end" && renderEndForm(node.data)}
      </div>
    </aside>
  );
};
