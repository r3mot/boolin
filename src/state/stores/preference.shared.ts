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
  animatedEdges: boolean;
  background: BackgroundType;
  backgroundOptions: BackgroundType[];
  snapToGrid: boolean;
  setConnectionPath: (path: ConnectionPathType) => void;
  setAnimatedEdges: (enabled: boolean) => void;
  setBackground: (variant: BackgroundType) => void;
  setSnapToGrid: (enabled: boolean) => void;
}

export const createPreferencesStore: StateCreator<PreferencesState> = (
  set
) => ({
  connectionPath: "default",
  animatedEdges: false,
  background: "dots",
  connectionPathOptions,
  backgroundOptions,
  snapToGrid: false,
  setConnectionPath: (path) => set({ connectionPath: path }),
  setAnimatedEdges: (enabled) => set({ animatedEdges: enabled }),
  setBackground: (variant) => set({ background: variant }),
  setSnapToGrid: (enabled) => set({ snapToGrid: enabled }),
});

export const preferenceSelector = (state: PreferencesState) => ({
  animatedEdges: state.animatedEdges,
  snapToGrid: state.snapToGrid,
  setReducedMotion: state.setAnimatedEdges,
  setSnapToGrid: state.setSnapToGrid,
});

export const connectionSelector = (state: PreferencesState) => ({
  connectionPath: state.connectionPath,
  setConnectionPath: state.setConnectionPath,
  connectionPathOptions: state.connectionPathOptions,
  animatedEdges: state.animatedEdges,
  setAnimatedEdges: state.setAnimatedEdges,
});

export const backgroundSelector = (state: PreferencesState) => ({
  background: state.background,
  backgroundOptions: state.backgroundOptions,
  setBackground: state.setBackground,
});
