"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CarouselImageManager } from "./carousel-image-manager"
import { PortStoryImageManager } from "./port-story-image-manager"
import { InfrastructureImageManager } from "./infrastructure-image-manager"
import { NewsMediaManager } from "./news-media-manager"

export function AdminDashboard() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Panneau d&apos;Administration</h1>

      <Tabs defaultValue="carousel">
        <TabsList className="mb-8">
          <TabsTrigger value="carousel">Carrousel</TabsTrigger>
          <TabsTrigger value="port-story">Histoire du Port</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructures</TabsTrigger>
          <TabsTrigger value="news-media">Actualités & Médias</TabsTrigger>
        </TabsList>

        <TabsContent value="carousel">
          <CarouselImageManager />
        </TabsContent>

        <TabsContent value="port-story">
          <PortStoryImageManager />
        </TabsContent>

        <TabsContent value="infrastructure">
          <InfrastructureImageManager />
        </TabsContent>

        <TabsContent value="news-media">
          <NewsMediaManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
