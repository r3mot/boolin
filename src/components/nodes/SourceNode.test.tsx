import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NodeType, CircuitState } from "@/types/enums";
import SourceNode from "./SourceNode";
import { mockNodes } from "@/../__mocks__/circuit.mock";
import { Switch } from "../ui/switch";

vi.mock("../handles/OutputHandle", () => ({
  OutputHandle: vi.fn(() => <div data-testid="output-handle" />),
}));

vi.mock("../ui/switch", () => ({
  Switch: vi.fn(({ onCheckedChange, label }) => (
    <button
      onClick={() => onCheckedChange?.(true)}
      data-testid="switch-button"
      data-label={label}
    >
      Switch
    </button>
  )),
}));

const mockSetNodes = vi.fn();
const mockStoreNodes = [
  {
    id: mockNodes.source.id,
    type: NodeType.Source,
    data: {
      operation: mockNodes.source.data.operation,
      state: mockNodes.source.data.state,
      originalState: mockNodes.source.data.originalState,
    },
    position: { x: 0, y: 0 },
  },
];

const mockData = {
  state: mockNodes.source.data.state,
  originalState: mockNodes.source.data.originalState,
  operation: mockNodes.source.data.operation,
};

vi.mock("@/state/stores/circuit.store", () => ({
  useCircuitStore: vi.fn((selector) => {
    const store = {
      nodes: mockStoreNodes,
      setNodes: mockSetNodes,
    };
    return selector(store);
  }),
}));

describe("SourceNode Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the component with LOW state", () => {
    render(
      <SourceNode
        id="1"
        type={NodeType.Source}
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

    const toggleContainer = screen.getByTestId("toggle-1");
    expect(toggleContainer).toBeInTheDocument();
  });

  it("renders the OutputHandle", () => {
    render(
      <SourceNode
        id="1"
        type={NodeType.Source}
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

    const handle = screen.getByTestId("output-handle");
    expect(handle).toBeInTheDocument();
  });

  it("updates the switch label based on state changes", () => {
    const { rerender } = render(
      <SourceNode
        id="1"
        type={NodeType.Source}
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

    const firstCall = (Switch as unknown as ReturnType<typeof vi.fn>).mock
      .calls[0];
    expect(firstCall[0]).toMatchObject({
      label: CircuitState.LOW,
      size: "lg",
      variant: "glow",
    });

    rerender(
      <SourceNode
        id="1"
        type={NodeType.Source}
        data={{
          ...mockData,
          state: CircuitState.HIGH,
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

    const lastCall = (Switch as unknown as ReturnType<typeof vi.fn>).mock.calls[
      (Switch as unknown as ReturnType<typeof vi.fn>).mock.calls.length - 1
    ];
    expect(lastCall[0]).toMatchObject({
      label: CircuitState.HIGH,
      size: "lg",
      variant: "glow",
    });
  });

  it("calls setNodes when switch is toggled", () => {
    render(
      <SourceNode
        id="1"
        type={NodeType.Source}
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

    const lastSwitchCall = (Switch as unknown as ReturnType<typeof vi.fn>).mock
      .calls[
      (Switch as unknown as ReturnType<typeof vi.fn>).mock.calls.length - 1
    ];
    const onCheckedChange = lastSwitchCall[0]?.onCheckedChange;

    onCheckedChange(true);

    expect(mockSetNodes).toHaveBeenCalled();
  });
});
