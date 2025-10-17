import { CircuitState, Operation } from "@/types/enums";
import { mockEdge, MockNodeId, mockNodes } from "../__mocks__/circuit.mock";
import { expect, describe, it } from "vitest";
import { getSourceNodes, isOutputNode } from "@/lib/simulation/helpers";
import { computeGateSignal } from "@/lib/simulation/logic";
import { isPathToActiveOutput } from "@/lib/simulation/graph";
import { simulateCircuit } from "@/lib/simulation/simulation";
import {
  applyEdgeStates,
  applyNodeStates,
  haveEdgeStylesChanged,
  haveNodeStatesChanged,
  updateCircuit,
} from "@/lib/simulation/state";

describe("Circuit Library Tests", () => {
  describe("Node Identification Functions", () => {
    describe("isOutputNode", () => {
      it("should return true for an output node", () => {
        const nodes = [mockNodes.output];
        expect(isOutputNode(mockNodes.output.id, nodes)).toBe(true);
      });

      it("should return false for a non-output node", () => {
        const nodes = [mockNodes.and];
        expect(isOutputNode(mockNodes.and.id, nodes)).toBe(false);
      });

      it("should return false if the node ID is not in the node list", () => {
        const nodes = [mockNodes.and];
        expect(isOutputNode("nonexistent", nodes)).toBe(false);
      });
    });

    describe("getSourceNodes", () => {
      it("should return only source nodes (ConstantHigh and ConstantLow)", () => {
        const nodes = [mockNodes.high, mockNodes.low, mockNodes.and];
        const sources = getSourceNodes(nodes);
        expect(sources).toEqual([mockNodes.high, mockNodes.low]);
      });

      it("should return an empty array if there are no source nodes", () => {
        const nodes = [mockNodes.and, mockNodes.output];
        const sources = getSourceNodes(nodes);
        expect(sources).toEqual([]);
      });
    });
  });

  describe("Gate Signal Computation", () => {
    describe("computeGateSignal", () => {
      it("should return FLOATING if inputs are insufficient", () => {
        const result = computeGateSignal(Operation.And, [CircuitState.HIGH]);
        expect(result).toBe(CircuitState.FLOATING);
      });

      it("should return FLOATING for unsupported operations", () => {
        const result = computeGateSignal(
          "unsupported_operation" as Operation,
          []
        );
        expect(result).toBe(CircuitState.FLOATING);
      });

      it("should compute signals correctly for basic gates", () => {
        expect(
          computeGateSignal(Operation.And, [
            CircuitState.HIGH,
            CircuitState.LOW,
          ])
        ).toBe(CircuitState.LOW);
        expect(
          computeGateSignal(Operation.Or, [CircuitState.HIGH, CircuitState.LOW])
        ).toBe(CircuitState.HIGH);
        expect(computeGateSignal(Operation.Not, [CircuitState.HIGH])).toBe(
          CircuitState.LOW
        );
        expect(
          computeGateSignal(Operation.Nand, [
            CircuitState.HIGH,
            CircuitState.HIGH,
          ])
        ).toBe(CircuitState.LOW);
        expect(
          computeGateSignal(Operation.Xor, [
            CircuitState.HIGH,
            CircuitState.LOW,
          ])
        ).toBe(CircuitState.HIGH);
        expect(
          computeGateSignal(Operation.Nor, [CircuitState.LOW, CircuitState.LOW])
        ).toBe(CircuitState.HIGH);
      });
    });
  });

  describe("Pathfinding Functions", () => {
    describe("isPathToActiveOutput", () => {
      it("should return true if there is a HIGH path to the output node", () => {
        const nodes = [
          mockNodes.low,
          mockNodes.high,
          mockNodes.and,
          mockNodes.output,
        ];
        const edges = [
          mockEdge(MockNodeId.LowNodeId, MockNodeId.AndGateId),
          mockEdge(MockNodeId.HighNodeId, MockNodeId.AndGateId),
          mockEdge(MockNodeId.AndGateId, MockNodeId.OutputNodeId),
        ];

        const state = {
          node1: CircuitState.LOW,
          node2: CircuitState.HIGH,
          node4: CircuitState.LOW,
        };
        expect(isPathToActiveOutput(edges[0], nodes, edges, state)).toBe(false);

        const state2 = {
          node1: CircuitState.LOW,
          node2: CircuitState.HIGH,
          node5: CircuitState.HIGH,
          node3: CircuitState.HIGH,
        };

        const nodes2 = [
          mockNodes.low,
          mockNodes.high,
          mockNodes.or,
          mockNodes.output,
        ];
        const edges2 = [
          mockEdge(MockNodeId.LowNodeId, MockNodeId.OrGateId),
          mockEdge(MockNodeId.HighNodeId, MockNodeId.OrGateId),
          mockEdge(MockNodeId.OrGateId, MockNodeId.OutputNodeId),
        ];
        expect(isPathToActiveOutput(edges2[0], nodes2, edges2, state2)).toBe(
          true
        );
      });
    });
  });

  describe("Circuit Simulation", () => {
    it("should simulate basic circuits", () => {
      const nodes = [
        mockNodes.high,
        mockNodes.low,
        mockNodes.and,
        mockNodes.output,
      ];
      const edges = [
        mockEdge(MockNodeId.HighNodeId, MockNodeId.AndGateId),
        mockEdge(MockNodeId.LowNodeId, MockNodeId.AndGateId),
        mockEdge(MockNodeId.AndGateId, MockNodeId.OutputNodeId),
      ];
      const result = simulateCircuit(nodes, edges);

      expect(result[MockNodeId.OutputNodeId]).toBeDefined();
      expect(result[MockNodeId.LowNodeId]).toBe(CircuitState.LOW);
      expect(result[MockNodeId.HighNodeId]).toBe(CircuitState.HIGH);
    });

    it("should simulate a complex circuit with multiple gates", () => {
      const nodes = [
        mockNodes.high,
        mockNodes.low,
        mockNodes.and,
        mockNodes.or,
        mockNodes.not,
        mockNodes.nand,
        mockNodes.output,
      ];
      const edges = [
        mockEdge(MockNodeId.HighNodeId, MockNodeId.AndGateId),
        mockEdge(MockNodeId.LowNodeId, MockNodeId.AndGateId),
        mockEdge(MockNodeId.AndGateId, MockNodeId.OrGateId),
        mockEdge(MockNodeId.LowNodeId, MockNodeId.OrGateId),
        mockEdge(MockNodeId.OrGateId, MockNodeId.NotGateId),
        mockEdge(MockNodeId.NotGateId, MockNodeId.NandGateId),
        mockEdge(MockNodeId.HighNodeId, MockNodeId.NandGateId),
        mockEdge(MockNodeId.NandGateId, MockNodeId.OutputNodeId),
      ];

      const result = simulateCircuit(nodes, edges);

      expect(result[MockNodeId.AndGateId]).toBe(CircuitState.LOW);
      expect(result[MockNodeId.OrGateId]).toBe(CircuitState.LOW);
      expect(result[MockNodeId.NotGateId]).toBe(CircuitState.HIGH);
      expect(result[MockNodeId.NandGateId]).toBe(CircuitState.LOW);
      expect(result[MockNodeId.OutputNodeId]).toBe(CircuitState.LOW);
    });
  });

  describe("Circuit State Updates", () => {
    describe("applyEdgeStates", () => {
      it("should update edge styles based on node activity", () => {
        const nodes = [mockNodes.high, mockNodes.output];
        const edges = [
          mockEdge(MockNodeId.HighNodeId, MockNodeId.OutputNodeId),
        ];
        const state = { node2: CircuitState.HIGH, node3: CircuitState.HIGH };

        const updatedEdges = applyEdgeStates(nodes, edges, state);
        expect(updatedEdges[0].style).toEqual({ stroke: "green" });
      });
    });

    describe("applyNodeStates", () => {
      it("should update node states based on the circuit state", () => {
        const nodes = [mockNodes.high, mockNodes.output];
        const state = {
          [MockNodeId.HighNodeId]: CircuitState.HIGH,
          [MockNodeId.OutputNodeId]: CircuitState.HIGH,
        };

        const updatedNodes = applyNodeStates(nodes, state);
        expect(updatedNodes[0].data.state).toBe(CircuitState.HIGH);
        expect(updatedNodes[1].data.state).toBe(CircuitState.HIGH);
      });

      it("should leave node states unchanged if circuit state is empty", () => {
        const nodes = [mockNodes.high, mockNodes.output];
        const state = {}; // No circuit state

        const updatedNodes = applyNodeStates(nodes, state);
        console.log(updatedNodes);
        expect(updatedNodes[0].data.state).toBe(CircuitState.HIGH);
        expect(updatedNodes[1].data.state).toBe(CircuitState.LOW);
      });
    });

    describe("haveNodeStatesChanged", () => {
      it("should return true if any node state has changed", () => {
        const original = [mockNodes.low];
        const updated = [
          {
            ...mockNodes.low,
            data: { ...mockNodes.low.data, state: CircuitState.HIGH },
          },
        ];
        expect(haveNodeStatesChanged(original, updated)).toBe(true);
      });

      it("should return false if no node state has changed", () => {
        const original = [mockNodes.low];
        const updated = [mockNodes.low];
        expect(haveNodeStatesChanged(original, updated)).toBe(false);
      });
    });

    describe("haveEdgeStylesChanged", () => {
      it("should return true if any edge style has changed", () => {
        const original = [
          mockEdge(MockNodeId.LowNodeId, MockNodeId.OutputNodeId),
        ];
        const updated = [
          { ...original[0], style: { stroke: "green" } }, // Style changed
        ];
        expect(haveEdgeStylesChanged(original, updated)).toBe(true);
      });

      it("should return false if no edge style has changed", () => {
        const original = [
          mockEdge(MockNodeId.LowNodeId, MockNodeId.OutputNodeId),
        ];
        const updated = [original[0]];
        expect(haveEdgeStylesChanged(original, updated)).toBe(false);
      });
    });
  });

  describe("Circuit Update Detection", () => {
    it("should return undefined when there are no changes in nodes or edges", () => {
      const nodes = [mockNodes.high, mockNodes.output];
      const edges = [mockEdge(MockNodeId.HighNodeId, MockNodeId.OutputNodeId)];

      const initialResult = updateCircuit(nodes, edges);
      expect(initialResult).toBeDefined();

      const result = updateCircuit(
        initialResult?.nodes || nodes,
        initialResult?.edges || edges
      );

      expect(result).toBeUndefined();
    });

    it("should return updated nodes if nodes have changed", () => {
      const nodes = [mockNodes.high, mockNodes.output];
      const edges = [mockEdge(MockNodeId.HighNodeId, MockNodeId.OutputNodeId)];

      const result = updateCircuit(nodes, edges);

      expect(result).toBeDefined();
      expect(result?.nodes).toBeDefined();
      const output = result?.nodes?.find(
        (n) => n.id === MockNodeId.OutputNodeId
      );
      expect(output).toBeDefined();
      expect(output?.data.state).toBe(CircuitState.HIGH);
    });

    it("should return updated edges if edge styles have changed", () => {
      const nodes = [mockNodes.high, mockNodes.output];
      const edges = [mockEdge(MockNodeId.HighNodeId, MockNodeId.OutputNodeId)];

      const result = updateCircuit(nodes, edges);

      expect(result).toBeDefined();
      expect(result?.edges).toBeDefined();
      expect(result?.edges![0].style).toEqual({ stroke: "green" });
    });

    it("should return updated nodes and edges when both have changed", () => {
      const nodes = [mockNodes.high, mockNodes.low, mockNodes.output];
      const edges = [
        mockEdge(MockNodeId.HighNodeId, MockNodeId.OutputNodeId),
        mockEdge(MockNodeId.LowNodeId, MockNodeId.OutputNodeId),
      ];

      const result = updateCircuit(nodes, edges);

      expect(result).toBeDefined();
      expect(result?.nodes).toBeDefined();
      expect(result?.edges).toBeDefined();
    });

    it.fails("should fail with malformed input data", () => {
      const nodes = [mockNodes.malformed]; // `data.operation` is missing
      const edges = [
        mockEdge(MockNodeId.MalformedNodeId, MockNodeId.HighNodeId),
      ];

      const result = updateCircuit(nodes, edges);
      expect(result).toBeUndefined();
    });
  });
});
