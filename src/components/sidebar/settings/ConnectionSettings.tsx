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
import {
  connectionSelector,
  type ConnectionPathType,
} from "@/state/stores/preference.shared";
import { useShallow } from "zustand/shallow";
import { Switch } from "@/components/ui/switch";

export function ConnectionSettings() {
  const {
    connectionPath,
    connectionPathOptions,
    animatedEdges,
    setAnimatedEdges,
    setConnectionPath,
  } = usePreferenceStore(useShallow(connectionSelector));

  function handleChange(v: ConnectionPathType) {
    setConnectionPath(v);
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
          value={connectionPath}
          aria-label="Select Connection Path"
        >
          <SelectTrigger id="connection-path">
            <SelectValue placeholder="Select path type" />
          </SelectTrigger>
          <SelectContent>
            {connectionPathOptions.length > 0 ? (
              connectionPathOptions.map(({ value, label }) => (
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
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="reduced-motion" className="text-xs">
            Animated Edges
          </Label>
          <p className="text-xs text-muted-foreground">
            Disable animated edges
          </p>
        </div>
        <Switch
          checked={animatedEdges}
          onCheckedChange={setAnimatedEdges}
          id="reduced-motion"
        />
      </div>
    </div>
  );
}
