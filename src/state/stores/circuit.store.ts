import { create } from "zustand";

import { type CircuitStoreState, circuitStoreCreator } from "./circuit.shared";

export const useCircuitStore = create<CircuitStoreState>(circuitStoreCreator);
