"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload, Save, Trash2, Plus } from 'lucide-react'
import { infrastructureApi } from "@/lib/api"
import { Label } from "@/components/ui/label"

export function DynamicInfrastructureManager() {
  const [mapItem, setMapItem] = useState<any | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Helper for image URL
  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath || imagePath === 'null' || imagePath === 'undefined' || imagePath === '') {
      return "/placeholder.svg"
    }
    try {
      const path = imagePath.startsWith('/') ? imagePath : `/uploads/${imagePath}`
      const url = `http://localhost:5000${path}`
      new URL(url)
      return url
    } catch {
      return "/placeholder.svg"
    }
  }

  // Load infrastructure map from backend
  const refreshData = async () => {
    setIsLoading(true)
    try {
      const data = await infrastructureApi.get()
      setMapItem(data)
    } catch (error) {
      setMapItem(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('image', file)
      let updated
      if (mapItem && mapItem.id) {
        updated = await infrastructureApi.update(mapItem.id, formData)
      } else {
        updated = await infrastructureApi.create(formData)
      }
      await refreshData()
      toast({
        title: "🗺️ Image mise à jour",
        description: "L'image de l'infrastructure a été téléchargée avec succès !",
      })
    } catch (error) {
      toast({
        title: "❌ Erreur d'upload",
        description: "Une erreur s'est produite lors du téléchargement de l'image.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!mapItem || !mapItem.id) return
    try {
      setIsSaving(true)
      await infrastructureApi.delete(mapItem.id)
      await refreshData()
      toast({
        title: "🗑️ Image supprimée",
        description: "L'image de l'infrastructure a été supprimée avec succès !",
      })
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Une erreur s'est produite lors de la suppression de l'image.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des données...</span>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Carte des Infrastructures</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative aspect-video rounded-lg overflow-hidden border">
            <Image
              src={getImageUrl(mapItem?.image_path)}
              alt="Carte des infrastructures"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
              <Label htmlFor="infrastructure-image-upload" className="cursor-pointer">
                <div className="bg-white text-black rounded-full p-3">
                  <Upload className="h-6 w-6" />
                </div>
              </Label>
              <Input
                id="infrastructure-image-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </div>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {mapItem && mapItem.id && (
            <Button variant="destructive" onClick={handleDelete} disabled={isSaving}>
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
} 