import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { NodeSidebar } from "./nodes/NodeSidebar";
import { SettingSidebar } from "./settings/SettingSidebar";

export function Sidebar() {
  return (
    <aside className="w-64 border-r">
      <div className="p-6">
        <Tabs defaultValue="nodes" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="nodes" className="w-full">
              Nodes
            </TabsTrigger>
            <TabsTrigger value="settings" className="w-full">
              Settings
            </TabsTrigger>
          </TabsList>

          <Separator className="my-4" />

          <TabsContent value="nodes">
            <NodeSidebar />
          </TabsContent>
          <TabsContent value="settings">
            <SettingSidebar />
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}
