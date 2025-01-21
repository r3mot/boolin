export const enum NodeType {
  Input = "input",
  Output = "output",
  Gate = "gate",
}

export const enum CircuitState {
  HIGH = 1,
  LOW = 0,
  FLOATING = -1,
}

export const enum Operation {
  ConstantLow = "constant-low",
  ConstantHigh = "constant-high",
  Output = "output",
  Not = "not",
  Or = "or",
  And = "and",
  Xor = "xor",
  Nand = "nand",
  Nor = "nor",
  Xnor = "xnor",
}
