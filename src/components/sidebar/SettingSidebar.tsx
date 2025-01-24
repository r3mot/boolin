import { usePreferenceStore } from "@/state/stores/preference.store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  BackgroundType,
  ConnectionPathType,
} from "@/state/stores/preference.shared";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

function BackgroundSettings() {
  const background = usePreferenceStore((state) => state.background);
  const setBackground = usePreferenceStore((state) => state.setBackground);
  const options = usePreferenceStore((state) => state.backgroundOptions);

  function handleChange(v: BackgroundType) {
    setBackground(v);
  }

  return (
    <div className="space-y-2 isolte">
      <Label htmlFor="background-select" className="dark:text-foreground">
        Background
      </Label>
      <Select
        onValueChange={handleChange}
        value={background}
        aria-label="Select Background"
      >
        <SelectTrigger className="capitalize" id="background-select">
          <SelectValue placeholder="Background" />
        </SelectTrigger>
        <SelectContent>
          {options.length > 0 ? (
            options.map((option) => (
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
  );
}

function ConnectionPathSettings() {
  const path = usePreferenceStore((state) => state.connectionPath);
  const setPath = usePreferenceStore((state) => state.setConnectionPath);
  const options = usePreferenceStore((state) => state.connectionPathOptions);

  function handleChange(v: ConnectionPathType) {
    setPath(v);
  }

  return (
    <div className="space-y-2 isolte">
      <Label htmlFor="connection-path-select" className="dark:text-foreground">
        Connection Path
      </Label>
      <Select
        onValueChange={handleChange}
        value={path}
        aria-label="Select Connection Path"
      >
        <SelectTrigger className="capitalize" id="connection-path-select">
          <SelectValue placeholder="Line" />
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
  );
}

function MotionSettings() {
  const preferMotion = usePreferenceStore((state) => state.reducedMotion);
  const setPreferMotion = usePreferenceStore((state) => state.setReducedMotion);

  return (
    <div className="flex items-center space-x-2 isolte">
      <Switch
        checked={preferMotion}
        onCheckedChange={setPreferMotion}
        aria-label="Reduce Motion"
      />
      <Label htmlFor="reduce-motion-toggle" className="text-foreground text-xs">
        Reduce Motion
      </Label>
    </div>
  );
}

export function SettingSidebar() {
  return (
    <div className="flex-grow">
      <div className="space-y-4">
        <BackgroundSettings />
        <Separator />
        <ConnectionPathSettings />
        <Separator />
        <MotionSettings />
      </div>
    </div>
  );
}
