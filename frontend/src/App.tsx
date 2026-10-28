import { Background, Controls, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes = [
  {
    id: "source",
    position: { x: 80, y: 120 },
    data: { label: "Cliente" },
    type: "input",
  },
  { id: "service", position: { x: 340, y: 120 }, data: { label: "Servicio" } },
  {
    id: "storage",
    position: { x: 600, y: 120 },
    data: { label: "Datos" },
    type: "output",
  },
];

const initialEdges = [
  { id: "source-service", source: "source", target: "service", animated: true },
  { id: "service-storage", source: "service", target: "storage" },
];

export default function App() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark">CP</div>
        <div>
          <h1>CloudPlayground</h1>
          <p>Laboratorio de arquitectura cloud</p>
        </div>
        <span className="local-badge">MVP · local</span>
      </header>
      <section className="workspace" aria-label="Editor de arquitectura">
        <aside className="sidebar">
          <p className="eyebrow">ARQUITECTURA</p>
          <h2>Nuevo proyecto</h2>
          <p className="muted">
            Un lienzo inicial para explorar componentes y conexiones.
          </p>
          <div className="component-card">
            <span>◎</span>
            <div>
              <strong>Cliente</strong>
              <small>Entrada de solicitudes</small>
            </div>
          </div>
          <div className="component-card">
            <span>▦</span>
            <div>
              <strong>Servicio</strong>
              <small>Procesamiento</small>
            </div>
          </div>
          <div className="component-card">
            <span>▤</span>
            <div>
              <strong>Datos</strong>
              <small>Almacenamiento</small>
            </div>
          </div>
          <div className="notice">
            El guardado de proyectos se incorporará localmente en el navegador.
            No hay conexión con AWS.
          </div>
        </aside>
        <div className="canvas-wrap">
          <div className="canvas-toolbar">
            <span>ESCENARIO · BASE</span>
            <button type="button" disabled>
              Simular · próximamente
            </button>
          </div>
          <ReactFlow
            nodes={initialNodes}
            edges={initialEdges}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            proOptions={{ hideAttribution: false }}
          >
            <Background color="#34415a" gap={22} size={1} />
            <Controls />
          </ReactFlow>
        </div>
      </section>
    </main>
  );
}
