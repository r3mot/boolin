import { CircuitState } from "@/types/enums";

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
