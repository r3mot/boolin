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
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

function AnimatedEdgesSettings() {
  const { animatedEdges, setAnimatedEdges } = usePreferenceStore(
    useShallow(connectionSelector)
  );

  return (
    <div className="space-y-2">
      <Label htmlFor="animated-edges" className="text-xs">
        Animated Edges
      </Label>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Enable edge animations
        </span>
        <Switch
          checked={animatedEdges}
          onCheckedChange={setAnimatedEdges}
          id="animated-edges"
        />
      </div>
    </div>
  );
}

function ConnectionPathSettings() {
  const { connectionPath, connectionPathOptions, setConnectionPath } =
    usePreferenceStore(useShallow(connectionSelector));

  function handlePathChange(v: ConnectionPathType) {
    setConnectionPath(v);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="connection-path" className="text-xs">
          Connection Path Type
        </Label>
        <Select
          onValueChange={handlePathChange}
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
    </div>
  );
}

function StrokeSettings() {
  const { strokeWidth, setStrokeWidth } = usePreferenceStore(
    useShallow(connectionSelector)
  );

  function handleChange(values: number[]) {
    setStrokeWidth(values[0]);
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="stroke-width" className="text-xs">
        Stroke Width
      </Label>
      <div className="flex items-center space-x-2">
        <Slider
          id="stroke-width"
          min={1}
          max={4}
          step={0.5}
          value={[strokeWidth]}
          onValueChange={handleChange}
          aria-labelledby="stroke-width-value"
          className="flex-grow"
        />
        <span
          className="text-xs text-muted-foreground w-8 text-right"
          id="stroke-width-value"
        >
          {strokeWidth}px
        </span>
      </div>
    </div>
  );
}

export function ConnectionSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Zap className="w-5 h-5 mr-2 text-muted-foreground" />
        <h3 className="text-sm font-medium">Connection</h3>
      </div>
      <div className="space-y-4">
        <ConnectionPathSettings />
        <StrokeSettings />
        <Separator className="my-4" />
        <AnimatedEdgesSettings />
      </div>
    </div>
  );
}
