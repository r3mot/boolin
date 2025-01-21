const mask = 1;

export const Logic = {
  and(values: number[]) {
    return values.reduce((a, v) => a & v, 1);
  },
  or(values: number[]) {
    return values.reduce((a, v) => a | v, 0);
  },
  not(values: number[]) {
    return ~values[0] & mask;
  },
  nand(values: number[]) {
    return ~this.and(values) & mask;
  },
  xor(values: number[]) {
    return values.reduce((a, v) => a ^ v, 0);
  },
  nor(values: number[]) {
    return ~this.or(values) & mask;
  },
  xnor(values: number[]) {
    return ~this.xor(values) & mask;
  },
};
