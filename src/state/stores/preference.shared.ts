import { BackgroundVariant, ConnectionLineType } from "@xyflow/react";
import { StateCreator } from "zustand";

export type ConnectionPathType = `${ConnectionLineType}`;
export type BackgroundType = `${BackgroundVariant}`;

const connectionPathLabels: Record<ConnectionPathType, string> = {
  default: "Bezier",
  straight: "Straight",
  step: "Stepped",
  smoothstep: "Smooth Stepped",
  simplebezier: "Simple Bezier",
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
  setConnectionPath: (path: ConnectionPathType) => void;
  setReducedMotion: (enabled: boolean) => void;
  setBackground: (variant: BackgroundType) => void;
}

export const createPreferencesStore: StateCreator<PreferencesState> = (
  set
) => ({
  connectionPath: "default",
  reducedMotion: false,
  background: "dots",
  connectionPathOptions,
  backgroundOptions,
  setConnectionPath: (path) => set({ connectionPath: path }),
  setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
  setBackground: (variant) => set({ background: variant }),
});
