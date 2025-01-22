import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReactFlowProvider } from "@xyflow/react";
import { DragAndDropProvider } from "./state/contexts/DragAndDropContext.tsx";
import App from "./App.tsx";

import "./index.css";
import "@xyflow/react/dist/base.css";
import { ThemeProvider } from "./state/contexts/ThemeProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ReactFlowProvider>
        <DragAndDropProvider>
          <App />
        </DragAndDropProvider>
      </ReactFlowProvider>
    </ThemeProvider>
  </StrictMode>
);
