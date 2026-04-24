import { nodeCatalog } from "../../data/nodeCatalog";
import type { NodeKind } from "../../types/workflow";

type SidebarProps = {
  onAddNode: (type: NodeKind) => void;
};

export const Sidebar = ({ onAddNode }: SidebarProps) => (
  <aside className="panel sidebar">
    <div className="panel__header">
      <h2>Node Library</h2>
      <p>Click to add a step, then drag it into place on the canvas.</p>
    </div>

    <div className="sidebar__list">
      {nodeCatalog.map((item) => (
        <button
          key={item.type}
          className="sidebar__item"
          onClick={() => onAddNode(item.type)}
          onDragStart={(event) => {
            event.dataTransfer.setData("application/reactflow", item.type);
            event.dataTransfer.effectAllowed = "move";
          }}
          draggable
          type="button"
        >
          <strong>{item.label}</strong>
          <span>{item.hint}</span>
        </button>
      ))}
    </div>
  </aside>
);
