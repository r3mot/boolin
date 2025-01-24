import {
  backgroundSelector,
  type BackgroundType,
} from "@/state/stores/preference.shared";
import { useShallow } from "zustand/shallow";
import { usePreferenceStore } from "@/state/stores/preference.store";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Paintbrush } from "lucide-react";
import { Label } from "@/components/ui/label";

export function AppearanceSettings() {
  const { background, backgroundOptions, setBackground } = usePreferenceStore(
    useShallow(backgroundSelector)
  );

  function handleChange(v: BackgroundType) {
    setBackground(v);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Paintbrush className="w-5 h-5 mr-2 text-muted-foreground" />
        <h3 className="text-sm font-medium">Appearance</h3>
      </div>
      <div className="space-y-2">
        <Label htmlFor="background-variant" className="text-xs">
          Background Variant
        </Label>
        <Select
          onValueChange={handleChange}
          value={background}
          aria-label="Select Background Variant"
        >
          <SelectTrigger id="background-variant">
            <SelectValue placeholder="Select variant" />
          </SelectTrigger>
          <SelectContent>
            {backgroundOptions.length > 0 ? (
              backgroundOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  <span className="capitalize"> {option}</span>
                </SelectItem>
              ))
            ) : (
              <SelectItem disabled value="">
                No options available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
