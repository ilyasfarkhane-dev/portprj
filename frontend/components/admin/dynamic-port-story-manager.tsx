"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload, Save, Trash2, Plus } from 'lucide-react'
import { histoireApi } from "@/lib/api"

type HistoireItem = {
  id: number
  title: string
  description: string
  periode: string
  image_path: string
}

export function DynamicPortStoryManager() {
  const [histoireItems, setHistoireItems] = useState<HistoireItem[]>([])
  const [selectedItem, setSelectedItem] = useState<HistoireItem | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Helper function to safely construct image URL
  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath || imagePath === 'null' || imagePath === 'undefined' || imagePath === '') {
      return "/placeholder.svg"
    }
    try {
      // Add /uploads/ prefix if the imagePath doesn't start with /
      const path = imagePath.startsWith('/') ? imagePath : `/uploads/${imagePath}`
      const url = `http://localhost:5000${path}`
      new URL(url) // Validate URL
      return url
    } catch (error) {
      return "/placeholder.svg"
    }
  }

  // Function to refresh data from backend
  const refreshData = async () => {
    try {
      const data = await histoireApi.getAll()
      console.log('Histoire data refreshed:', data)
      setHistoireItems(data)
      if (data.length > 0 && selectedItem) {
        // Keep the same item selected if it still exists
        const currentSelected = data.find(item => item.id === selectedItem.id)
        setSelectedItem(currentSelected || data[0])
      } else if (data.length > 0) {
        setSelectedItem(data[0])
      }
    } catch (error) {
      console.error('Error refreshing histoire data:', error)
    }
  }

  // Load histoire data from backend
  useEffect(() => {
    const fetchHistoireData = async () => {
      try {
        console.log('Loading histoire data...')
        await refreshData()
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading histoire data:', error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de l'histoire du port. Vérifiez que le serveur backend est démarré.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchHistoireData()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedItem) return

    try {
      setIsUploading(true)
      
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('images', file)
      formData.append('title', selectedItem.title)
      formData.append('description', selectedItem.description)
      formData.append('periode', selectedItem.periode)

      // Update the histoire item
      const updatedItem = await histoireApi.update(selectedItem.id, formData)
      console.log('Image upload - updated item received:', updatedItem)
      
      // Refresh all data from backend to ensure UI is up to date
      await refreshData()

      toast({
        title: "🖼️ Image mise à jour",
        description: "L'image a été téléchargée et mise à jour avec succès !",
      })
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error)
      toast({
        title: "❌ Erreur d'upload",
        description: "Une erreur s'est produite lors du téléchargement de l'image.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveItem = async () => {
    if (!selectedItem) return

    console.log('Starting update for histoire item:', selectedItem)

    try {
      setIsSaving(true)

      // Create FormData for the update
      const formData = new FormData()
      formData.append('title', selectedItem.title)
      formData.append('description', selectedItem.description)
      formData.append('periode', selectedItem.periode)

      console.log('Sending update with data:', {
        title: selectedItem.title,
        description: selectedItem.description,
        periode: selectedItem.periode
      })

      const updatedItem = await histoireApi.update(selectedItem.id, formData)
      console.log('Updated item received from backend:', updatedItem)

      // Refresh all data from backend to ensure UI is up to date
      await refreshData()

      console.log('Showing success toast...')
      
      // Force the toast to show with a slight delay to ensure state updates are complete
      setTimeout(() => {
        toast({
          title: "✅ Succès",
          description: "L'événement a été mis à jour avec succès !",
        })
        console.log('Success toast triggered with delay')
      }, 100)

    } catch (error) {
      console.error('Update error:', error)
      toast({
        title: "❌ Erreur",
        description: "Une erreur s'est produite lors de la mise à jour de l'événement.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
      console.log('Update operation completed')
    }
  }

  const handleAddNewItem = async () => {
    try {
      setIsSaving(true)

      // Create FormData for new item
      const formData = new FormData()
      formData.append('title', 'Nouvel événement')
      formData.append('description', 'Description du nouvel événement')
      formData.append('periode', 'Période')

      // We need to create a temporary file for the required image
      const response = await fetch('/placeholder.svg')
      const blob = await response.blob()
      const file = new File([blob], 'placeholder.svg', { type: 'image/svg+xml' })
      formData.append('images', file)

      const newItem = await histoireApi.create(formData)
      console.log('New histoire item created:', newItem)
      
      // Refresh data to get the complete list
      await refreshData()

      toast({
        title: "➕ Nouvel événement",
        description: "Un nouvel événement a été ajouté avec succès !",
      })
    } catch (error) {
      console.error('Create error:', error)
      toast({
        title: "❌ Erreur",
        description: "Une erreur s'est produite lors de l'ajout de l'événement.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteItem = async (id: number) => {
    if (histoireItems.length <= 1) {
      toast({
        title: "Impossible de supprimer",
        description: "Vous devez conserver au moins un événement dans l'histoire du port.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)

      await histoireApi.delete(id)

      // Refresh data to get the updated list
      await refreshData()

      toast({
        title: "🗑️ Événement supprimé",
        description: "L'événement a été supprimé avec succès !",
      })
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: "❌ Erreur",
        description: "Une erreur s'est produite lors de la suppression de l'événement.",
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

  if (histoireItems.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="mb-4">Aucun événement trouvé dans l'histoire du port.</p>
        <Button onClick={handleAddNewItem}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un premier événement
        </Button>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Événements de l'Histoire</h2>

        {histoireItems.map((item) => (
          <Card
            key={item.id}
            className={`cursor-pointer transition-all ${selectedItem?.id === item.id ? "ring-2 ring-primary" : ""}`}
            onClick={() => setSelectedItem(item)}
          >
            <CardContent className="p-3">
              <div className="relative aspect-video rounded-md overflow-hidden mb-2">
                <Image 
                  src={getImageUrl(item.image_path)} 
                  alt={item.title} 
                  fill 
                  className="object-cover" 
                />
              </div>
              <p className="font-medium truncate">{item.title}</p>
              <p className="text-sm text-gray-500">{item.periode}</p>
            </CardContent>
          </Card>
        ))}

        <Button onClick={handleAddNewItem} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un événement
        </Button>
      </div>

      {selectedItem && (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Modifier l'événement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative aspect-video rounded-lg overflow-hidden border">
                <Image
                  src={getImageUrl(selectedItem.image_path)}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                  <Label htmlFor="histoire-image-upload" className="cursor-pointer">
                    <div className="bg-white text-black rounded-full p-3">
                      <Upload className="h-6 w-6" />
                    </div>
                  </Label>
                  <Input
                    id="histoire-image-upload"
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
                  <Label htmlFor="periode">Période</Label>
                  <Input
                    id="periode"
                    value={selectedItem.periode}
                    onChange={(e) => setSelectedItem({ ...selectedItem, periode: e.target.value })}
                    placeholder="ex: 1960-1970"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={selectedItem.description}
                    onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
                    rows={4}
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