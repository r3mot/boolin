import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ElementSidebar } from "./ElementSidebar";
import { SettingSidebar } from "./SettingSidebar";

export function Sidebar() {
  return (
    <aside className="w-64 border-r">
      <div className="p-6">
        <Tabs defaultValue="nodes" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="nodes" className="w-full">
              Nodes
            </TabsTrigger>
            <TabsTrigger value="styles" className="w-full">
              Styles
            </TabsTrigger>
          </TabsList>

          <Separator className="mt-4" />

          <TabsContent value="nodes">
            <ElementSidebar />
          </TabsContent>
          <TabsContent value="styles">
            <SettingSidebar />
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}
