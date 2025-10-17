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
