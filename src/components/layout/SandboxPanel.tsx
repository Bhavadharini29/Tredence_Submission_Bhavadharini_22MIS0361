import type { SimulationResponse } from "../../types/workflow";

type SandboxPanelProps = {
  result: SimulationResponse | null;
  serializedGraph: string;
  isRunning: boolean;
  onRun: () => void;
};

export const SandboxPanel = ({
  result,
  serializedGraph,
  isRunning,
  onRun
}: SandboxPanelProps) => (
  <section className="panel sandbox-panel">
    <div className="panel__header">
      <div>
        <h2>Workflow Sandbox</h2>
        <p>Serialize the graph, validate it, and inspect the simulation log.</p>
      </div>
      <button type="button" className="primary-button" onClick={onRun} disabled={isRunning}>
        {isRunning ? "Running..." : "Run Simulation"}
      </button>
    </div>

    <div className="sandbox-grid">
      <div>
        <h3>Workflow JSON</h3>
        <pre>{serializedGraph}</pre>
      </div>

      <div>
        <h3>Execution Log</h3>
        {!result && <p className="muted">Run the sandbox to see validation and execution output.</p>}

        {result?.errors.length ? (
          <div className="error-box">
            {result.errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        ) : null}

        <div className="log-list">
          {result?.steps.map((step) => (
            <article key={step.nodeId} className={`log-item ${step.status}`}>
              <strong>{step.nodeLabel}</strong>
              <span>{step.detail}</span>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);
