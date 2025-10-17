import { updateCircuit } from "@/lib/simulation/state";
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

function isStructuralChange(change: NodeChange<CircuitNode>) {
  return change.type === "add" || change.type === "remove";
}
export interface CircuitStoreState {
  nodes: CircuitNode[];
  edges: Edge[];
  generatedId: number;
  reactFlowInstance?: ReactFlowInstance<CircuitNode>;

  getNextId: () => number;
  setGeneratedId: (id: number) => void;
  setNodes: (nodes: CircuitNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  setReactFlowInstance: (instance: ReactFlowInstance<CircuitNode>) => void;
  onConnect: OnConnect;
  onNodesChange: OnNodesChange<CircuitNode>;
  onNodesDelete: OnNodesDelete<CircuitNode>;
  onEdgesChange: OnEdgesChange<Edge>;
  onEdgesDelete: OnEdgesDelete;

  // custom
  concatNode: (node: CircuitNode) => void;
  removeNode: (node: CircuitNode) => void;
  replaceNode: (
    nodeIdToReplace: string,
    newNode: CircuitNode,
    newEdges: Edge[]
  ) => void;
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
  setGeneratedId: (id) => set({ generatedId: id }),

  setReactFlowInstance: (instance) => set({ reactFlowInstance: instance }),
  setNodes: (nodes) =>
    set((state) => {
      const updates = updateCircuit(nodes, state.edges);
      return {
        nodes,
        edges: updates?.edges ?? state.edges,
      };
    }),

  setEdges: (edges) =>
    set((state) => {
      const updates = updateCircuit(state.nodes, edges);
      return {
        edges,
        nodes: updates?.nodes ?? state.nodes,
      };
    }),

  onConnect: (connection) =>
    set((state) => {
      const edge = { ...connection, type: "connection" };
      const newEdges = syncEdge(edge, state.edges);
      const updates = updateCircuit(state.nodes, newEdges);

      return {
        edges: updates?.edges ?? newEdges,
        nodes: updates?.nodes ?? state.nodes,
      };
    }),

  onNodesChange: (changes) =>
    set((state) => {
      const newNodes = syncNodeChanges(changes, state.nodes);
      const shouldUpdate = changes.some(isStructuralChange);

      if (shouldUpdate) {
        const updates = updateCircuit(newNodes, state.edges);
        return {
          nodes: updates?.nodes ?? newNodes,
          edges: updates?.edges ?? state.edges,
        };
      }

      return { nodes: newNodes };
    }),

  onNodesDelete: (deletedNodes) =>
    set((state) => {
      const newNodes = state.nodes.filter((n) => !deletedNodes.includes(n));
      const updates = updateCircuit(newNodes, state.edges);

      return {
        nodes: updates?.nodes ?? newNodes,
        edges: updates?.edges ?? state.edges,
      };
    }),

  onEdgesDelete: (edgesToDelete) =>
    set((state) => {
      const toRemove = new Set(edgesToDelete.map((e) => e.id));
      const newEdges = state.edges.filter((e) => !toRemove.has(e.id));
      const updates = updateCircuit(state.nodes, newEdges);

      return {
        edges: updates?.edges ?? newEdges,
        nodes: updates?.nodes ?? state.nodes,
      };
    }),

  onEdgesChange: (changes) =>
    set((state) => {
      const newEdges = syncEdgeChanges(changes, state.edges);
      const updates = updateCircuit(state.nodes, newEdges);
      return {
        edges: updates?.edges ?? newEdges,
        nodes: updates?.nodes ?? state.nodes,
      };
    }),

  concatNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  removeNode: (node) =>
    set((state) => {
      const newNodes = state.nodes.filter((n) => n.id !== node.id);
      const newEdges = state.edges.filter(
        (e) => e.source !== node.id && e.target !== node.id
      );
      const updates = updateCircuit(newNodes, newEdges);

      return {
        nodes: updates?.nodes ?? newNodes,
        edges: updates?.edges ?? newEdges,
      };
    }),

  replaceNode: (nodeId, newNode, newEdges) =>
    set((state) => {
      const filteredNodes = state.nodes.filter((n) => n.id !== nodeId);
      const updatedNodes = [...filteredNodes, newNode];
      const updates = updateCircuit(updatedNodes, newEdges);

      return {
        nodes: updates?.nodes ?? updatedNodes,
        edges: updates?.edges ?? newEdges,
      };
    }),

  clearAll: () => set({ nodes: [], edges: [] }),
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
  reactFlowInstance: state.reactFlowInstance,
  setReactFlowInstance: state.setReactFlowInstance,
  generatedId: state.generatedId,
  getNextId: state.getNextId,
});
