import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NodeType } from "@/types/enums";
import OutputNode from "./OutputNode";
import { mockNodes } from "@/../__mocks__/circuit.mock";

vi.mock("../handles/InputHandle", () => ({
  InputHandle: vi.fn(() => <div data-testid="input-handle" />),
}));

describe("OutputNode Component", () => {
  const mockData = {
    state: mockNodes.output.data.state,
    originalState: mockNodes.output.data.originalState,
    operation: mockNodes.output.data.operation,
  };

  it("updates the image based on state changes", () => {
    const { rerender } = render(
      <OutputNode
        id="1"
        type={NodeType.Output}
        data={mockData}
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

    expect(screen.getByTestId("output_img")).toHaveAttribute(
      "src",
      "/svgs/output-low.svg"
    );

    rerender(
      <OutputNode
        id="1"
        type={NodeType.Output}
        data={{
          state: 1,
          originalState: mockNodes.output.data.originalState,
          operation: mockNodes.output.data.operation,
        }}
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

    expect(screen.getByTestId("output_img")).toHaveAttribute(
      "src",
      "/svgs/output-high.svg"
    );
  });

  it("renders the InputHandle with correct props", () => {
    render(
      <OutputNode
        id="1"
        type={NodeType.Output}
        data={mockData}
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

    const handle = screen.getByTestId("input-handle");
    expect(handle).toBeInTheDocument();
    expect(handle).toHaveAttribute("data-testid", "input-handle");
  });
});
