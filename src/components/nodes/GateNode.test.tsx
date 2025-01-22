import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NodeType } from "@/types/enums";
import GateNode from "./GateNode";
import { mockNodes } from "@/../__mocks__/circuit.mock";

vi.mock("../handles/OutputHandle", () => ({
  OutputHandle: vi.fn(({ id }) => <div data-testid={`output-handle-${id}`} />),
}));

vi.mock("../handles/InputHandle", () => ({
  InputHandle: vi.fn(({ id }) => <div data-testid={`input-handle-${id}`} />),
}));

describe("GateNode Component", () => {
  const mockAndData = {
    state: mockNodes.and.data.state,
    originalState: mockNodes.and.data.originalState,
    operation: mockNodes.and.data.operation,
  };

  const mockNotData = {
    state: mockNodes.not.data.state,
    originalState: mockNodes.not.data.originalState,
    operation: mockNodes.not.data.operation,
  };

  const mockOrData = {
    state: mockNodes.or.data.state,
    originalState: mockNodes.or.data.originalState,
    operation: mockNodes.or.data.operation,
  };

  it("renders the correct image based on the operation", () => {
    render(
      <GateNode
        id="1"
        type={NodeType.Gate}
        data={mockAndData}
        dragging={false}
        zIndex={1}
        selectable={true}
        deletable={true}
        selected={false}
        draggable={true}
        isConnectable={false}
        positionAbsoluteX={0}
        positionAbsoluteY={0}
      />
    );

    const image = screen.getByAltText("gate-node");
    expect(image).toHaveAttribute("src", "/svgs/and.svg");
  });

  it("renders the correct handles for the NOT operation", () => {
    render(
      <GateNode
        id="1"
        type={NodeType.Gate}
        data={mockNotData}
        dragging={false}
        zIndex={1}
        selectable={true}
        deletable={true}
        selected={false}
        draggable={true}
        isConnectable={false}
        positionAbsoluteX={0}
        positionAbsoluteY={0}
      />
    );

    const outputHandle = screen.getByTestId("output-handle-handle-1");
    const inputHandle = screen.getByTestId("input-handle-handle-1");

    expect(outputHandle).toBeInTheDocument();
    expect(inputHandle).toBeInTheDocument();
  });

  it("renders the correct handles for non-NOT operations", () => {
    render(
      <GateNode
        id="1"
        type={NodeType.Gate}
        data={mockOrData}
        dragging={false}
        zIndex={1}
        selectable={true}
        deletable={true}
        selected={false}
        draggable={true}
        isConnectable={false}
        positionAbsoluteX={0}
        positionAbsoluteY={0}
      />
    );

    const outputHandle1 = screen.getByTestId("output-handle-target-1-1");
    const outputHandle2 = screen.getByTestId("output-handle-target-2-1");
    const inputHandle = screen.getByTestId("input-handle-handle-1");

    expect(outputHandle1).toBeInTheDocument();
    expect(outputHandle2).toBeInTheDocument();
    expect(inputHandle).toBeInTheDocument();
  });
});
