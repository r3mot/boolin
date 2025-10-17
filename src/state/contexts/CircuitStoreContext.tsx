import { type ReactNode, createContext, useContext, useRef } from "react";
import { createStore } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

import {
  type CircuitStoreState,
  circuitStoreCreator,
} from "../stores/circuit.shared";

export const createCircuitStore = () => {
  return createStore<CircuitStoreState>(circuitStoreCreator);
};

export type CircuitStoreApi = ReturnType<typeof createCircuitStore>;

export const CircuitStoreContext = createContext<CircuitStoreApi | undefined>(
  undefined
);

export interface CircuitStoreProviderProps {
  children: ReactNode;
}

export function CircuitStoreProvider({ children }: CircuitStoreProviderProps) {
  const storeRef = useRef<CircuitStoreApi>({} as CircuitStoreApi);

  if (!storeRef.current) {
    storeRef.current = createCircuitStore();
  }

  return (
    <CircuitStoreContext.Provider value={storeRef.current}>
      {children}
    </CircuitStoreContext.Provider>
  );
}

export type UseCircuitStoreContextSelector<T> = (store: CircuitStoreState) => T;

export const useCircuitStoreContext = <T,>(
  selector: UseCircuitStoreContextSelector<T>
) => {
  const storeContext = useContext(CircuitStoreContext);

  if (storeContext === undefined) {
    throw new Error(
      "useCircuitStoreContext must be used within a CircuitStoreProvider"
    );
  }

  return useStoreWithEqualityFn(storeContext, selector, shallow);
};
