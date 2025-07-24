"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Upload, Save, Trash2, Plus } from "lucide-react"
import { uploadImageToBlob } from "@/lib/blob-utils"

type InfrastructureImage = {
  id: number
  title: string
  description: string
  image_url: string
  is_main: boolean
}

export function InfrastructureImageManager() {
  const [infrastructureImages, setInfrastructureImages] = useState<InfrastructureImage[]>([])
  const [selectedImage, setSelectedImage] = useState<InfrastructureImage | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Charger les données des infrastructures
  useEffect(() => {
    const fetchInfrastructureImages = async () => {
      try {
        const response = await fetch("/api/infrastructure")
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données")
        }
        const data = await response.json()
        setInfrastructureImages(data)
        if (data.length > 0) {
          setSelectedImage(data[0])
        }
        setIsLoading(false)
      } catch (error) {
        console.error("Erreur:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les données des infrastructures",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchInfrastructureImages()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedImage) return

    try {
      setIsUploading(true)
      const imageUrl = await uploadImageToBlob(file, "infrastructure")

      setSelectedImage({
        ...selectedImage,
        image_url: imageUrl,
      })

      toast({
        title: "Image téléchargée",
        description: "L'image a été téléchargée avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du téléchargement de l'image.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveImage = async () => {
    if (!selectedImage) return

    try {
      setIsSaving(true)

      const response = await fetch(`/api/infrastructure/${selectedImage.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedImage),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde")
      }

      const updatedImage = await response.json()

      // Si l'image mise à jour est principale, mettre à jour toutes les autres images
      if (updatedImage.is_main) {
        const updatedImages = infrastructureImages.map((img) =>
          img.id === updatedImage.id ? updatedImage : { ...img, is_main: false },
        )
        setInfrastructureImages(updatedImages)
      } else {
        // Sinon, mettre à jour uniquement l'image modifiée
        const updatedImages = infrastructureImages.map((img) => (img.id === updatedImage.id ? updatedImage : img))
        setInfrastructureImages(updatedImages)
      }

      toast({
        title: "Modifications enregistrées",
        description: "Les modifications ont été enregistrées avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement des modifications.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddNewImage = async () => {
    try {
      setIsSaving(true)

      const newImageData = {
        title: "Nouvelle image",
        description: "Description de la nouvelle image",
        image_url: "/placeholder.svg?height=600&width=1200",
        is_main: infrastructureImages.length === 0, // Si c'est la première image, la définir comme principale
      }

      const response = await fetch("/api/infrastructure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newImageData),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout")
      }

      const newImage = await response.json()

      // Si la nouvelle image est principale, mettre à jour toutes les autres images
      if (newImage.is_main) {
        const updatedImages = infrastructureImages.map((img) => ({ ...img, is_main: false }))
        setInfrastructureImages([...updatedImages, newImage])
      } else {
        setInfrastructureImages([...infrastructureImages, newImage])
      }

      setSelectedImage(newImage)

      toast({
        title: "Image ajoutée",
        description: "Une nouvelle image a été ajoutée avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout de l'image.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteImage = async (id: number) => {
    if (infrastructureImages.length <= 1) {
      toast({
        title: "Impossible de supprimer",
        description: "Vous devez conserver au moins une image d'infrastructure.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)

      const response = await fetch(`/api/infrastructure/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression")
      }

      const updatedImages = infrastructureImages.filter((img) => img.id !== id)
      setInfrastructureImages(updatedImages)
      setSelectedImage(updatedImages[0])

      toast({
        title: "Image supprimée",
        description: "L'image a été supprimée avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
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

  if (infrastructureImages.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="mb-4">Aucune image d'infrastructure trouvée.</p>
        <Button onClick={handleAddNewImage}>Ajouter une première image</Button>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Images d'infrastructure</h2>
          <Button size="sm" variant="outline" onClick={handleAddNewImage}>
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>

        {infrastructureImages.map((image) => (
          <Card
            key={image.id}
            className={`cursor-pointer transition-all ${selectedImage?.id === image.id ? "ring-2 ring-primary" : ""}`}
            onClick={() => setSelectedImage(image)}
          >
            <CardContent className="p-3">
              <div className="relative aspect-video rounded-md overflow-hidden mb-2">
                <Image src={image.image_url || "/placeholder.svg"} alt={image.title} fill className="object-cover" />
                {image.is_main && (
                  <div className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    Principale
                  </div>
                )}
              </div>
              <p className="font-medium truncate">{image.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedImage && (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Modifier l&apos;image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative aspect-video rounded-lg overflow-hidden border">
                <Image
                  src={selectedImage.image_url || "/placeholder.svg"}
                  alt={selectedImage.title}
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

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={selectedImage.title}
                    onChange={(e) => setSelectedImage({ ...selectedImage, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={selectedImage.description}
                    onChange={(e) => setSelectedImage({ ...selectedImage, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-main"
                    checked={selectedImage.is_main}
                    onCheckedChange={(checked) => setSelectedImage({ ...selectedImage, is_main: checked })}
                  />
                  <Label htmlFor="is-main">Image principale</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="destructive" onClick={() => handleDeleteImage(selectedImage.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>

              <Button onClick={handleSaveImage} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
