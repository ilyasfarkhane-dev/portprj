"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Upload, Save, Trash2 } from 'lucide-react'
import { uploadImageToBlob } from "@/lib/blob-utils"

type CarouselItem = {
  id: number
  title: string
  subtitle: string
  description: string
  cta: string
  image_url: string
  order_index: number
}

export function CarouselImageManager() {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([])
  const [selectedItem, setSelectedItem] = useState<CarouselItem | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Charger les données du carrousel
  useEffect(() => {
    const fetchCarouselItems = async () => {
      try {
        const response = await fetch('/api/carousel')
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données')
        }
        const data = await response.json()
        setCarouselItems(data)
        if (data.length > 0) {
          setSelectedItem(data[0])
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Erreur:', error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du carrousel",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }
    
    fetchCarouselItems()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedItem) return

    try {
      setIsUploading(true)
      // Utiliser la fonction d'upload vers Vercel Blob
      const imageUrl = await uploadImageToBlob(file, "carousel")

      // Mettre à jour l'élément sélectionné avec la nouvelle URL d'image
      setSelectedItem({
        ...selectedItem,
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

  const handleSaveItem = async () => {
    if (!selectedItem) return

    try {
      setIsSaving(true)

      const response = await fetch(`/api/carousel/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedItem),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde')
      }

      const updatedItem = await response.json()

      // Mettre à jour l'élément dans le tableau
      const updatedItems = carouselItems.map((item) => 
        item.id === updatedItem.id ? updatedItem : item
      )

      setCarouselItems(updatedItems)

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

  const handleAddNewItem = async () => {
    try {
      setIsSaving(true)

      const newItemData = {
        title: "Nouveau Slide",
        subtitle: "Sous-titre",
        description: "Description du nouveau slide",
        cta: "En savoir plus",
        image_url: "/placeholder.svg?height=600&width=1200",
      }

      const response = await fetch('/api/carousel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItemData),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout')
      }

      const newItem = await response.json()
      setCarouselItems([...carouselItems, newItem])
      setSelectedItem(newItem)

      toast({
        title: "Slide ajouté",
        description: "Un nouveau slide a été ajouté avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout du slide.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteItem = async (id: number) => {
    if (carouselItems.length <= 1) {
      toast({
        title: "Impossible de supprimer",
        description: "Vous devez conserver au moins un élément dans le carrousel.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)

      const response = await fetch(`/api/carousel/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      const updatedItems = carouselItems.filter((item) => item.id !== id)
      setCarouselItems(updatedItems)
      setSelectedItem(updatedItems[0])

      toast({
        title: "Élément supprimé",
        description: "L'élément a été supprimé avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression de l'élément.",
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

  if (carouselItems.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="mb-4">Aucun élément trouvé dans le carrousel.</p>
        <Button onClick={handleAddNewItem}>Ajouter un premier slide</Button>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Slides du Carrousel</h2>

        {carouselItems.map((item) => (
          <Card
            key={item.id}
            className={`cursor-pointer transition-all ${selectedItem?.id === item.id ? "ring-2 ring-primary" : ""}`}
            onClick={() => setSelectedItem(item)}
          >
            <CardContent className="p-3">
              <div className="relative aspect-video rounded-md overflow-hidden mb-2">
                <Image src={item.image_url || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
              </div>
              <p className="font-medium truncate">{item.title}</p>
            </CardContent>
          </Card>
        ))}

        <Button onClick={handleAddNewItem} className="w-full">
          Ajouter un slide
        </Button>
      </div>

      {selectedItem && (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Modifier le slide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative aspect-video rounded-lg overflow-hidden border">
                <Image
                  src={selectedItem.image_url || "/placeholder.svg"}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                  <Label htmlFor="carousel-image-upload" className="cursor-pointer">
                    <div className="bg-white text-black rounded-full p-3">
                      <Upload className="h-6 w-6" />
                    </div>
                  </Label>
                  <Input
                    id="carousel-image-upload"
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
                    value={selectedItem.title}
                    onChange={(e) => setSelectedItem({ ...selectedItem, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle">Sous-titre</Label>
                  <Input
                    id="subtitle"
                    value={selectedItem.subtitle}
                    onChange={(e) => setSelectedItem({ ...selectedItem, subtitle: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={selectedItem.description}
                    onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="cta">Texte du bouton</Label>
                  <Input
                    id="cta"
                    value={selectedItem.cta}
                    onChange={(e) => setSelectedItem({ ...selectedItem, cta: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="destructive" onClick={() => handleDeleteItem(selectedItem.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>

              <Button onClick={handleSaveItem} disabled={isSaving}>
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
