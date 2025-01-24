import { Header } from "./components/Header";
import { ReactFlowView } from "./components/ReactFlowView";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { useFlowAnimation } from "./hooks/useFlowAnimation";

export default function App() {
  // mount and forget
  useFlowAnimation();
  return (
    <div id="app">
      <Toaster />
      <div className="min-h-screen">
        <Header />
        <div className="min-h-[calc(100vh-3.5rem)] grid grid-cols-[16rem_1fr]">
          <Sidebar />
          <ReactFlowView />
        </div>
      </div>
    </div>
  );
}
