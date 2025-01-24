import { Cable, Cpu } from "lucide-react";
import { Separator } from "../../ui/separator";
import { GateNodes } from "./GateNodes";
import { InputOutputNodes } from "./InputOutputNodes";

export function NodeSidebar() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center">
          <Cable className="w-5 h-5 mr-2 text-muted-foreground" />
          <h3 className="text-sm font-medium">IO Controls</h3>
        </div>
        <InputOutputNodes />
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="flex items-center">
          <Cpu className="w-5 h-5 mr-2 text-muted-foreground" />
          <h3 className="text-sm font-medium">Logic Gates</h3>
        </div>
        <GateNodes />
      </div>
    </div>
  );
}
