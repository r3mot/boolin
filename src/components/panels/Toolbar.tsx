import { Save, Printer, HardDriveUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToolbar } from "@/hooks/useToolbar";

export default function ToolbarPanel() {
  const { save, restore, download } = useToolbar();
  return (
    <div className="flex items-center justify-center gap-2 rounded-lg">
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={save}
      >
        <Save className="w-5 h-5" />
        <span>Save</span>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={restore}
      >
        <HardDriveUpload className="w-5 h-5" />
        <span>Restore</span>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={download}
      >
        <Printer className="w-5 h-5" />
        <span>Print</span>
      </Button>
    </div>
  );
}
