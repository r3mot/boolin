import { BackgroundVariant, ConnectionLineType } from "@xyflow/react";
import { StateCreator } from "zustand";

export type ConnectionPathType = `${ConnectionLineType}`;
export type BackgroundType = `${BackgroundVariant}`;

const connectionPathLabels: Record<
  Exclude<ConnectionPathType, "simplebezier">,
  string
> = {
  default: "Bezier",
  straight: "Straight",
  step: "Stepped",
  smoothstep: "Smooth Stepped",
};

const connectionPathOptions: { value: ConnectionPathType; label: string }[] =
  Object.entries(connectionPathLabels).map(([value, label]) => ({
    value: value as ConnectionPathType,
    label,
  }));

const backgroundOptions: BackgroundType[] = Object.values(BackgroundVariant);

export interface PreferencesState {
  connectionPath: ConnectionPathType;
  connectionPathOptions: { value: ConnectionPathType; label: string }[];
  reducedMotion: boolean;
  background: BackgroundType;
  backgroundOptions: BackgroundType[];
  snapToGrid: boolean;
  setConnectionPath: (path: ConnectionPathType) => void;
  setReducedMotion: (enabled: boolean) => void;
  setBackground: (variant: BackgroundType) => void;
  setSnapToGrid: (enabled: boolean) => void;
}

export const createPreferencesStore: StateCreator<PreferencesState> = (
  set
) => ({
  connectionPath: "default",
  reducedMotion: false,
  background: "dots",
  connectionPathOptions,
  backgroundOptions,
  snapToGrid: false,
  setConnectionPath: (path) => set({ connectionPath: path }),
  setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
  setBackground: (variant) => set({ background: variant }),
  setSnapToGrid: (enabled) => set({ snapToGrid: enabled }),
});

export const preferenceSelector = (state: PreferencesState) => ({
  reducedMotion: state.reducedMotion,
  snapToGrid: state.snapToGrid,
  setReducedMotion: state.setReducedMotion,
  setSnapToGrid: state.setSnapToGrid,
});
