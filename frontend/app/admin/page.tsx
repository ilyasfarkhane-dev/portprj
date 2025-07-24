import { DynamicHeroManager } from "@/components/admin/dynamic-hero-manager"
import { DynamicPortStoryManager } from "@/components/admin/dynamic-port-story-manager"
import { DynamicInfrastructureManager } from "@/components/admin/dynamic-infrastructure-manager"
import { DynamicNewsMediaManager } from "@/components/admin/dynamic-news-media-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AdminHeader } from "@/components/admin/admin-header"

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <AdminHeader />
        
        <Tabs defaultValue="carousel" className="space-y-6">
          <TabsList className="w-full border-b pb-px mb-6">
            <TabsTrigger value="carousel">Carrousel</TabsTrigger>
            <TabsTrigger value="port-story">Histoire du Port</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructures</TabsTrigger>
            <TabsTrigger value="news-media">Actualités & Média</TabsTrigger>
          </TabsList>

          <TabsContent value="carousel" className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Gestion du Carrousel</h2>
            <DynamicHeroManager />
          </TabsContent>

          <TabsContent value="port-story" className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Gestion de l&apos;Histoire du Port</h2>
            <DynamicPortStoryManager />
          </TabsContent>

          <TabsContent value="infrastructure" className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Gestion des Infrastructures</h2>
            <DynamicInfrastructureManager />
          </TabsContent>

          <TabsContent value="news-media" className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Gestion des Actualités et Médias</h2>
            <DynamicNewsMediaManager />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
