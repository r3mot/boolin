import { Header } from "./components/Header";
import { ReactFlowView } from "./components/ReactFlowView";
import { Sidebar } from "./components/Sidebar";

export default function App() {
  return (
    <div id="app">
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
