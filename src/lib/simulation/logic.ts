import { CircuitState, GateMetadata, Operation } from "@/types/enums";

const mask = 1;

function toBinary(v: CircuitState): number {
  return v === CircuitState.HIGH ? 1 : 0;
}

function fromBinary(v: number): CircuitState {
  return (v & mask) === 1 ? CircuitState.HIGH : CircuitState.LOW;
}

export const Logic = {
  and(values: CircuitState[]): CircuitState {
    if (values.includes(CircuitState.FLOATING)) return CircuitState.FLOATING;
    let result = mask;
    for (const v of values) result &= toBinary(v);
    return fromBinary(result);
  },

  or(values: CircuitState[]): CircuitState {
    if (values.includes(CircuitState.FLOATING)) return CircuitState.FLOATING;
    let result = 0;
    for (const v of values) result |= toBinary(v);
    return fromBinary(result);
  },

  not([v]: CircuitState[]): CircuitState {
    if (v === CircuitState.FLOATING) return CircuitState.FLOATING;
    return fromBinary(~toBinary(v));
  },

  nand(values: CircuitState[]): CircuitState {
    const val = Logic.and(values);
    if (val === CircuitState.FLOATING) return CircuitState.FLOATING;
    return Logic.not([val]);
  },

  xor(values: CircuitState[]): CircuitState {
    if (values.includes(CircuitState.FLOATING)) return CircuitState.FLOATING;
    let result = 0;
    for (const v of values) result ^= toBinary(v);
    return fromBinary(result);
  },

  nor(values: CircuitState[]): CircuitState {
    const val = Logic.or(values);
    if (val === CircuitState.FLOATING) return CircuitState.FLOATING;
    return Logic.not([val]);
  },

  xnor(values: CircuitState[]): CircuitState {
    const val = Logic.xor(values);
    if (val === CircuitState.FLOATING) return CircuitState.FLOATING;
    return Logic.not([val]);
  },
};

export function computeGateSignal(
  op: Operation,
  inputs: CircuitState[]
): CircuitState {
  const gateMetadata = GateMetadata[op];
  if (!gateMetadata) {
    return CircuitState.FLOATING;
  }
  const { inputs: requiredInputs } = gateMetadata;
  if (inputs.length < requiredInputs) return CircuitState.FLOATING;

  switch (op) {
    case Operation.ConstantLow:
      return CircuitState.LOW;
    case Operation.ConstantHigh:
      return CircuitState.HIGH;
    case Operation.Output:
      return inputs[0] ?? CircuitState.LOW;
    case Operation.And:
      return Logic.and(inputs);
    case Operation.Or:
      return Logic.or(inputs);
    case Operation.Not:
      return Logic.not(inputs);
    case Operation.Nand:
      return Logic.nand(inputs);
    case Operation.Nor:
      return Logic.nor(inputs);
    case Operation.Xor:
      return Logic.xor(inputs);
    // case Operation.Xnor:
    //   return Logic.xnor(inputs);
    default:
      return CircuitState.FLOATING;
  }
}
