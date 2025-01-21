import { updateCircuit } from "@/lib/circuit";
import { CircuitNode } from "@/types/types";
import {
  Edge,
  OnConnect,
  OnEdgesChange,
  OnEdgesDelete,
  OnNodesChange,
  OnNodesDelete,
  ReactFlowInstance,
  addEdge as syncEdge,
  applyNodeChanges as syncNodeChanges,
  applyEdgeChanges as syncEdgeChanges,
  NodeChange,
} from "@xyflow/react";
import { StateCreator } from "zustand";

function isPositionChange(change: NodeChange<CircuitNode>) {
  return change.type === "position";
}

export interface CircuitStoreState {
  nodes: CircuitNode[];
  edges: Edge[];
  generatedId: number;
  getNextId: () => number;
  setNodes: (nodes: CircuitNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  onConnect: OnConnect;
  onNodesChange: OnNodesChange<CircuitNode>;
  onNodesDelete: OnNodesDelete<CircuitNode>;
  onEdgesChange: OnEdgesChange<Edge>;
  onEdgesDelete: OnEdgesDelete;
  concatNode: (node: CircuitNode) => void;
  reactFlowInstance: ReactFlowInstance<CircuitNode> | undefined;
  setReactFlowInstance: (instance: ReactFlowInstance<CircuitNode>) => void;
  clearAll: () => void;
}

export const circuitStoreCreator: StateCreator<CircuitStoreState> = (
  set,
  get
) => ({
  nodes: [],
  edges: [],
  generatedId: 0,
  reactFlowInstance: undefined,

  getNextId: () => {
    const id = get().generatedId;
    set({ generatedId: id + 1 });
    return id;
  },

  setReactFlowInstance: (rf) => set({ reactFlowInstance: rf }),
  setNodes: (nodes) => {
    set((state) => {
      const updates = updateCircuit(nodes, state.edges);
      return {
        nodes,
        edges: updates?.edges ?? state.edges,
      };
    });
  },

  setEdges: (edges) => {
    set((state) => {
      const updates = updateCircuit(state.nodes, edges);
      return {
        edges,
        nodes: updates?.nodes ?? state.nodes,
      };
    });
  },

  onConnect: (connection) => {
    set((state) => {
      const edge = { ...connection, type: "conn" };
      const newEdges = syncEdge(edge, state.edges);

      const { nodes } = state;

      const updates = updateCircuit(nodes, newEdges);

      return {
        edges: updates?.edges ?? newEdges,
        nodes: updates?.nodes ?? nodes,
      };
    });
  },

  onNodesChange: (changes) => {
    set((state) => {
      const newNodes = syncNodeChanges(changes, state.nodes);
      const shouldUpdated = changes.some(isPositionChange);

      if (shouldUpdated) {
        //
        const updates = updateCircuit(newNodes, state.edges);
        return {
          edges: updates?.edges ?? state.edges,
          nodes: updates?.nodes ?? newNodes,
        };
      }

      return { nodes: newNodes };
    });
  },

  onNodesDelete: (nodes) => {
    set((state) => {
      const newNodes = state.nodes.filter((n) => !nodes.includes(n));
      const updates = updateCircuit(newNodes, state.edges);

      return {
        edges: updates?.edges ?? state.edges,
        nodes: updates?.nodes ?? newNodes,
      };
    });
  },

  onEdgesDelete: (edges) => {
    set((state) => {
      const newEdges = state.edges.filter((e) => !edges.includes(e));
      const updates = updateCircuit(state.nodes, newEdges);

      return {
        edges: updates?.edges ?? newEdges,
      };
    });
  },

  onEdgesChange: (changes) => {
    set((state) => {
      const newEdges = syncEdgeChanges(changes, state.edges);
      const updates = updateCircuit(state.nodes, newEdges);
      return {
        edges: updates?.edges ?? newEdges,
        nodes: updates?.nodes ?? state.nodes,
      };
    });
  },

  concatNode: (node) => {
    set((state) => {
      const newNodes = [...state.nodes, node];

      return { nodes: newNodes };
    });
  },

  clearAll: () => {
    set({ nodes: [], edges: [] });
  },
});

export const shallowSelector = (state: CircuitStoreState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onConnect: state.onConnect,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onEdgesDelete: state.onEdgesDelete,
  onNodesDelete: state.onNodesDelete,
  concatNode: state.concatNode,
  frInstance: state.reactFlowInstance,
  setRfInstance: state.setReactFlowInstance,
  generatedId: state.generatedId,
  getNextId: state.getNextId,
});
