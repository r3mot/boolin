import { Zap } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePreferenceStore } from "@/state/stores/preference.store";
import type { ConnectionPathType } from "@/state/stores/preference.shared";

export function ConnectionSettings() {
  const path = usePreferenceStore((state) => state.connectionPath);
  const setPath = usePreferenceStore((state) => state.setConnectionPath);
  const options = usePreferenceStore((state) => state.connectionPathOptions);

  function handleChange(v: ConnectionPathType) {
    setPath(v);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Zap className="w-5 h-5 mr-2 text-muted-foreground" />
        <h3 className="text-sm font-medium">Connection</h3>
      </div>
      <div className="space-y-2">
        <Label htmlFor="connection-path" className="text-xs">
          Connection Path Type
        </Label>
        <Select
          onValueChange={handleChange}
          value={path}
          aria-label="Select Connection Path"
        >
          <SelectTrigger id="connection-path">
            <SelectValue placeholder="Select path type" />
          </SelectTrigger>
          <SelectContent>
            {options.length > 0 ? (
              options.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  <span className="capitalize">{label}</span>
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
