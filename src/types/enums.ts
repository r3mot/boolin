export const CircuitState = {
  HIGH: 1,
  LOW: 0,
  FLOATING: -1,
} as const;
export type CircuitState = (typeof CircuitState)[keyof typeof CircuitState];

export const NodeType = {
  Input: "input",
  Output: "output",
  Gate: "gate",
} as const;

export type NodeType = (typeof NodeType)[keyof typeof NodeType];

export const Operation = {
  ConstantLow: "constant-low",
  ConstantHigh: "constant-high",
  Output: "output",
  Not: "not",
  And: "and",
  Or: "or",
  Nand: "nand",
  Nor: "nor",
  Xor: "xor",
} as const;

export type Operation = (typeof Operation)[keyof typeof Operation];

export const GateMetadata = {
  [Operation.ConstantLow]: { inputs: 0, outputs: 1 },
  [Operation.ConstantHigh]: { inputs: 0, outputs: 1 },
  [Operation.Output]: { inputs: 1, outputs: 0 },
  [Operation.Not]: { inputs: 1, outputs: 1 },
  [Operation.And]: { inputs: 2, outputs: 1 },
  [Operation.Or]: { inputs: 2, outputs: 1 },
  [Operation.Nand]: { inputs: 2, outputs: 1 },
  [Operation.Nor]: { inputs: 2, outputs: 1 },
  [Operation.Xor]: { inputs: 2, outputs: 1 },
} as const;

export type GateMetadata = typeof GateMetadata;
