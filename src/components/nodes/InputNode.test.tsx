import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NodeType } from "@/types/enums";
import InputNode from "./InputNode";
import { mockNodes } from "@/../__mocks__/circuit.mock";

vi.mock("../handles/InputHandle", () => ({
  InputHandle: vi.fn(() => <div data-testid="input-handle" />),
}));

describe("InputNode Component", () => {
  const mockLowNode = {
    state: mockNodes.low.data.state,
    originalState: mockNodes.low.data.originalState,
    operation: mockNodes.low.data.operation,
  };

  const mockHighNode = {
    state: mockNodes.high.data.state,
    originalState: mockNodes.high.data.originalState,
    operation: mockNodes.high.data.operation,
  };

  describe("InputNode Image", () => {
    it("displays the correct image for LOW", () => {
      render(
        <InputNode
          id="1"
          type={NodeType.Input}
          data={mockLowNode}
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

      expect(screen.getByTestId("input_img")).toHaveAttribute(
        "src",
        "/svgs/constant-low.svg"
      );
    });

    it("displays the correct image for HIGH", () => {
      render(
        <InputNode
          id="1"
          type={NodeType.Input}
          data={mockHighNode}
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

      expect(screen.getByTestId("input_img")).toHaveAttribute(
        "src",
        "/svgs/constant-high.svg"
      );
    });
  });

  it("renders the InputHandle with correct props", () => {
    render(
      <InputNode
        id="1"
        type={NodeType.Input}
        data={mockLowNode}
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
