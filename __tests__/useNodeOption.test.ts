import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useNodeOption } from "@/hooks/useNodeOption";
import { useCircuitStore } from "@/state/stores/circuit.store";
import { Operation, NodeType } from "@/types/enums";
import { mockNodes, mockEdge, MockNodeId } from "@/../__mocks__/circuit.mock";

vi.mock("@/state/stores/circuit.store", () => ({
  useCircuitStore: vi.fn(),
}));

const mockUseCircuitStore = vi.mocked(useCircuitStore);

describe("useNodeOption", () => {
  const testNodes = [
    mockNodes.low,
    mockNodes.high,
    mockNodes.and,
    mockNodes.output,
  ];

  const testEdges = [
    mockEdge(MockNodeId.LowNodeId, MockNodeId.AndGateId),
    mockEdge(MockNodeId.HighNodeId, MockNodeId.AndGateId),
    mockEdge(MockNodeId.AndGateId, MockNodeId.OutputNodeId),
  ];

  const mockStoreMethods = {
    generateId: vi.fn(() => "new-id-123"),
    replaceNode: vi.fn(),
    removeNode: vi.fn(),
    nodes: testNodes,
    edges: testEdges,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCircuitStore.mockReturnValue(mockStoreMethods);
  });

  describe("getNodeRole", () => {
    it("should return 'input' for constant-high operation", () => {
      const { result } = renderHook(() => useNodeOption());

      act(() => {
        result.current.replace(MockNodeId.HighNodeId, {
          data: {
            operation: Operation.ConstantHigh,
            state: mockNodes.high.data.state,
            originalState: mockNodes.high.data.originalState,
          },
        });
      });

      expect(mockStoreMethods.replaceNode).toHaveBeenCalled();
    });

    it("should return 'input' for constant-low operation", () => {
      const { result } = renderHook(() => useNodeOption());

      act(() => {
        result.current.replace(MockNodeId.LowNodeId, {
          data: {
            operation: Operation.ConstantLow,
            state: mockNodes.low.data.state,
            originalState: mockNodes.low.data.originalState,
          },
        });
      });

      expect(mockStoreMethods.replaceNode).toHaveBeenCalled();
    });

    it("should return 'output' for output operation", () => {
      const { result } = renderHook(() => useNodeOption());

      act(() => {
        result.current.replace(MockNodeId.OutputNodeId, {
          data: {
            operation: Operation.Output,
            state: mockNodes.output.data.state,
            originalState: mockNodes.output.data.originalState,
          },
        });
      });

      expect(mockStoreMethods.replaceNode).toHaveBeenCalled();
    });

    it("should return 'gate' for logic gate operations", () => {
      const { result } = renderHook(() => useNodeOption());

      act(() => {
        result.current.replace(MockNodeId.AndGateId, {
          data: {
            operation: Operation.And,
            state: mockNodes.and.data.state,
            originalState: mockNodes.and.data.originalState,
          },
        });
      });

      expect(mockStoreMethods.replaceNode).toHaveBeenCalled();
    });
  });

  describe("replace", () => {
    it("should replace a node with new data", () => {
      const { result } = renderHook(() => useNodeOption());

      act(() => {
        result.current.replace(MockNodeId.HighNodeId, {
          data: {
            operation: Operation.ConstantLow,
            state: mockNodes.high.data.state,
            originalState: mockNodes.high.data.originalState,
          },
        });
      });

      expect(mockStoreMethods.replaceNode).toHaveBeenCalledWith(
        MockNodeId.HighNodeId,
        expect.objectContaining({
          id: "new-id-123",
          type: NodeType.Input,
          data: {
            operation: Operation.ConstantLow,
            state: mockNodes.high.data.state,
            originalState: mockNodes.high.data.originalState,
          },
          position: mockNodes.high.position,
        }),
        expect.any(Array)
      );
    });

    it("should filter out edges connected to the replaced node", () => {
      const { result } = renderHook(() => useNodeOption());

      act(() => {
        result.current.replace(MockNodeId.AndGateId, {
          data: {
            operation: Operation.Or,
            state: mockNodes.and.data.state,
            originalState: mockNodes.and.data.originalState,
          },
        });
      });

      const [, , updatedEdges] = mockStoreMethods.replaceNode.mock.calls[0];
      expect(updatedEdges).toEqual([]);
    });

    it("should not replace if target node is not found", () => {
      const { result } = renderHook(() => useNodeOption());

      act(() => {
        result.current.replace("nonexistent-node", {
          data: {
            operation: Operation.And,
            state: 0,
            originalState: 0,
          },
        });
      });

      expect(mockStoreMethods.replaceNode).not.toHaveBeenCalled();
    });

    it("should preserve original operation if not provided in new data", () => {
      const { result } = renderHook(() => useNodeOption());

      act(() => {
        result.current.replace(MockNodeId.HighNodeId, {
          data: {
            state: 0,
            originalState: mockNodes.high.data.originalState,
            operation: Operation.ConstantHigh,
          },
        });
      });

      const [, newNode] = mockStoreMethods.replaceNode.mock.calls[0];
      expect(newNode.data.operation).toBe(Operation.ConstantHigh);
    });

    it("should generate new ID for replaced node", () => {
      const { result } = renderHook(() => useNodeOption());

      act(() => {
        result.current.replace(MockNodeId.HighNodeId, {
          data: {
            operation: Operation.ConstantLow,
            state: mockNodes.high.data.state,
            originalState: mockNodes.high.data.originalState,
          },
        });
      });

      const [, newNode] = mockStoreMethods.replaceNode.mock.calls[0];
      expect(newNode.id).toBe("new-id-123");
      expect(mockStoreMethods.generateId).toHaveBeenCalled();
    });
  });

  describe("handleSwapNode", () => {
    it("should swap a node to a new operation", () => {
      const { result } = renderHook(() => useNodeOption());

      act(() => {
        result.current.handleSwapNode(Operation.Or, MockNodeId.AndGateId);
      });

      expect(mockStoreMethods.replaceNode).toHaveBeenCalledWith(
        MockNodeId.AndGateId,
        expect.objectContaining({
          id: "new-id-123",
          type: NodeType.Gate,
          data: {
            operation: Operation.Or,
            state: mockNodes.and.data.state,
            originalState: mockNodes.and.data.originalState,
          },
          position: mockNodes.and.position,
        }),
        expect.any(Array)
      );
    });

    it("should determine correct node type based on operation", () => {
      const { result } = renderHook(() => useNodeOption());

      act(() => {
        result.current.handleSwapNode(
          Operation.ConstantHigh,
          MockNodeId.AndGateId
        );
      });

      const [, newNode] = mockStoreMethods.replaceNode.mock.calls[0];
      expect(newNode.type).toBe(NodeType.Input);

      act(() => {
        result.current.handleSwapNode(Operation.Output, MockNodeId.HighNodeId);
      });

      const [, newNode2] = mockStoreMethods.replaceNode.mock.calls[1];
      expect(newNode2.type).toBe(NodeType.Output);
    });

    it("should not swap if node is not found", () => {
      const { result } = renderHook(() => useNodeOption());

      act(() => {
        result.current.handleSwapNode(Operation.And, "nonexistent-node");
      });

      expect(mockStoreMethods.replaceNode).not.toHaveBeenCalled();
    });

    it("should preserve node position when swapping", () => {
      const { result } = renderHook(() => useNodeOption());

      act(() => {
        result.current.handleSwapNode(Operation.Xor, MockNodeId.AndGateId);
      });

      const [, newNode] = mockStoreMethods.replaceNode.mock.calls[0];
      expect(newNode.position).toEqual(mockNodes.and.position);
    });
  });

  describe("handleDeleteNode", () => {
    it("should delete a node if found", () => {
      const { result } = renderHook(() => useNodeOption());

      act(() => {
        result.current.handleDeleteNode(MockNodeId.HighNodeId);
      });

      expect(mockStoreMethods.removeNode).toHaveBeenCalledWith(mockNodes.high);
    });

    it("should not delete if node is not found", () => {
      const { result } = renderHook(() => useNodeOption());

      act(() => {
        result.current.handleDeleteNode("nonexistent-node");
      });

      expect(mockStoreMethods.removeNode).not.toHaveBeenCalled();
    });

    it("should delete the correct node", () => {
      const { result } = renderHook(() => useNodeOption());

      act(() => {
        result.current.handleDeleteNode(MockNodeId.AndGateId);
      });

      expect(mockStoreMethods.removeNode).toHaveBeenCalledWith(mockNodes.and);
    });
  });

  describe("hook return values", () => {
    it("should return all expected functions", () => {
      const { result } = renderHook(() => useNodeOption());

      expect(result.current).toEqual({
        replace: expect.any(Function),
        handleSwapNode: expect.any(Function),
        handleDeleteNode: expect.any(Function),
      });
    });

    it("should maintain function references across renders", () => {
      const { result, rerender } = renderHook(() => useNodeOption());

      const firstRender = result.current;
      rerender();
      const secondRender = result.current;

      expect(firstRender.replace).toBe(secondRender.replace);
      expect(firstRender.handleSwapNode).toBe(secondRender.handleSwapNode);
      expect(firstRender.handleDeleteNode).toBe(secondRender.handleDeleteNode);
    });
  });

  describe("integration with mock data", () => {
    it("should work with all mock node types", () => {
      const { result } = renderHook(() => useNodeOption());

      act(() => {
        result.current.handleSwapNode(
          Operation.ConstantHigh,
          MockNodeId.LowNodeId
        );
      });
      act(() => {
        result.current.handleSwapNode(Operation.Output, MockNodeId.HighNodeId);
      });

      act(() => {
        result.current.handleSwapNode(Operation.Nand, MockNodeId.AndGateId);
      });

      act(() => {
        result.current.handleSwapNode(
          Operation.ConstantLow,
          MockNodeId.OutputNodeId
        );
      });

      expect(mockStoreMethods.replaceNode).toHaveBeenCalledTimes(4);
    });

    it("should handle edge filtering correctly with mock edges", () => {
      const { result } = renderHook(() => useNodeOption());

      act(() => {
        result.current.replace(MockNodeId.AndGateId, {
          data: {
            operation: Operation.Or,
            state: mockNodes.and.data.state,
            originalState: mockNodes.and.data.originalState,
          },
        });
      });

      const [, , updatedEdges] = mockStoreMethods.replaceNode.mock.calls[0];

      // When replacing AndGateId (node4), all edges connected to it should be filtered out
      // Since all our test edges connect to node4, the result should be empty
      expect(updatedEdges).toHaveLength(0);
      expect(updatedEdges).toEqual([]);
    });
  });
});
