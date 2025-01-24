import { Separator } from "@/components/ui/separator";
import { AppearanceSettings } from "./AppearanceSettings";
import { ConnectionSettings } from "./ConnectionSettings";
import { PreferencesSettings } from "./PreferenceSettings";

export function SettingSidebar() {
  return (
    <div className="flex-grow">
      <div className="space-y-6">
        <AppearanceSettings />
        <Separator />
        <ConnectionSettings />
        <Separator />
        <PreferencesSettings />
      </div>
    </div>
  );
}
