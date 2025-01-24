import { usePreferenceStore } from "@/state/stores/preference.store";
import { useEffect } from "react";

export function useFlowAnimation() {
  const animatedEdges = usePreferenceStore((state) => state.animatedEdges);

  useEffect(() => {
    // this is a bit hacky but it works
    // if their api / css changes this will break
    const edges = document.querySelectorAll(".react-flow__edge-connection");
    for (const edge of edges) {
      edge.classList.toggle("animated", animatedEdges);
    }
  }, [animatedEdges]);
}
