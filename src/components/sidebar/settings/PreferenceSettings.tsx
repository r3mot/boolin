import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { preferenceSelector } from "@/state/stores/preference.shared";
import { usePreferenceStore } from "@/state/stores/preference.store";
import { ToggleLeft } from "lucide-react";
import { useShallow } from "zustand/shallow";

export function PreferencesSettings() {
  const { animatedEdges, snapToGrid, setReducedMotion, setSnapToGrid } =
    usePreferenceStore(useShallow(preferenceSelector));

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <ToggleLeft className="w-5 h-5 mr-2 text-muted-foreground" />
        <h3 className="text-sm font-medium">Preferences</h3>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="reduced-motion" className="text-sm">
              Reduced Motion
            </Label>
            <p className="text-xs text-muted-foreground">
              Removes animated edges between nodes
            </p>
          </div>
          <Switch
            checked={animatedEdges}
            onCheckedChange={setReducedMotion}
            id="reduced-motion"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="snap-to-grid" className="text-sm">
              Snap to Grid
            </Label>
            <p className="text-xs text-muted-foreground">
              Align elements to a grid
            </p>
          </div>
          <Switch
            checked={snapToGrid}
            onCheckedChange={setSnapToGrid}
            id="snap-to-grid"
          />
        </div>
      </div>
    </div>
  );
}
