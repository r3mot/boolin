import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReactFlowProvider } from "@xyflow/react";
import { DragAndDropProvider } from "./state/contexts/DragAndDropContext.tsx";
import App from "./App.tsx";

import "./index.css";
import "@xyflow/react/dist/base.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactFlowProvider>
      <DragAndDropProvider>
        <App />
      </DragAndDropProvider>
    </ReactFlowProvider>
  </StrictMode>
);
