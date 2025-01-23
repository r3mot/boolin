import { create } from "zustand";
import {
  type PreferencesState,
  createPreferencesStore,
} from "./preference.shared";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export const usePreferenceStore = create<PreferencesState>()(
  devtools(
    persist(createPreferencesStore, {
      name: "boolin-preferences",
      storage: createJSONStorage(() => localStorage),
    })
  )
);
