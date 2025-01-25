import { useCircuitStore } from "@/state/stores/circuit.store";
import { usePreferenceStore } from "@/state/stores/preference.store";
import {
  Edge,
  getNodesBounds,
  getViewportForBounds,
  useReactFlow,
} from "@xyflow/react";
import { toPng } from "html-to-image";
import { useCallback } from "react";
import { toast } from "sonner";

const lsKey = "boolin-logic-editor";
const imageWidth = 1024;
const imageHeight = 768;

export function useToolbar() {
  const { setViewport } = useReactFlow();
  const setLocalNodes = useCircuitStore((state) => state.setNodes);
  const setLocalEdges = useCircuitStore((state) => state.setEdges);
  const setGeneratedId = useCircuitStore((state) => state.setGeneratedId);
  const generatedId = useCircuitStore((state) => state.generatedId);
  const localNodes = useCircuitStore((state) => state.nodes);
  const flowInstance = useCircuitStore((state) => state.reactFlowInstance);
  const animatedEdges = usePreferenceStore((state) => state.animatedEdges);

  const save = useCallback(() => {
    if (flowInstance !== undefined) {
      const flow = flowInstance.toObject();
      const flowWithId = {
        ...flow,
        generatedId,
      };

      localStorage.setItem(lsKey, JSON.stringify(flowWithId));
      toast.success("Flow saved");
    }
  }, [flowInstance, generatedId]);

  const restore = useCallback(() => {
    const restoreNodes = async () => {
      const flow = JSON.parse(localStorage.getItem(lsKey) || "[]");
      if (flow) {
        if (flow.edges.length === 0 && flow.nodes.length === 0) {
          toast.error("No flow to restore");
          return;
        }

        const edges = flow.edges.map((edge: Edge) => {
          return {
            ...edge,
            animated: animatedEdges,
          };
        });

        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setLocalNodes(flow.nodes);
        setLocalEdges(edges);
        setGeneratedId(flow.generatedId);
        setViewport({ x, y, zoom });
        toast.success("Flow restored");
      }
    };

    restoreNodes();
  }, [
    setLocalNodes,
    setLocalEdges,
    setGeneratedId,
    setViewport,
    animatedEdges,
  ]);

  const createAndDownload = useCallback((url: string) => {
    const a = document.createElement("a");
    a.setAttribute("download", "boolin.png");
    a.setAttribute("href", url);
    a.click();
    toast.success("Image downloaded");
  }, []);

  const download = useCallback(() => {
    const bounds = getNodesBounds(localNodes);
    const vp = getViewportForBounds(bounds, imageWidth, imageHeight, 0.5, 1, 0);
    toPng(document.querySelector(".react-flow__viewport") as HTMLElement, {
      backgroundColor: "white",
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        transform: `translate(${vp.x}px, ${vp.y}px) scale(${vp.zoom})`,
      },
    }).then(createAndDownload);
  }, [createAndDownload, localNodes]);

  return { save, restore, download };
}
