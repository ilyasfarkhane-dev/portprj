"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Loader2, Upload, Save, Trash2, Plus, Eye, EyeOff } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mediaApi, multimediaApi } from "@/lib/api"

interface MediaItem {
  id: number
  title: string
  description: string
  periode: string
  image_path: string
  created_at?: string
  updated_at?: string
}

interface MultimediaItem {
  id: number
  title: string
  file_path: string
  file_type: 'image' | 'video'
  created_at: string
  updated_at: string
}

export function DynamicNewsMediaManager() {
  const [activeTab, setActiveTab] = useState("news")
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [multimediaItems, setMultimediaItems] = useState<MultimediaItem[]>([])
  const [selectedMultimedia, setSelectedMultimedia] = useState<MultimediaItem | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMultimedia, setIsLoadingMultimedia] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMediaForm, setNewMediaForm] = useState({
    title: '',
    description: '',
    periode: '',
    image: null as File | null
  })

  // Fetch media data from backend
  const fetchMedia = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching media from backend...')
      const data = await mediaApi.getAll()
      console.log('Fetched media data:', data)
      setMediaItems(data)
      if (data.length > 0) {
        setSelectedMedia(data[0])
      }
    } catch (error) {
      console.error('Error fetching media:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les données des médias",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch multimedia data from backend
  const fetchMultimedia = async () => {
    try {
      setIsLoadingMultimedia(true)
      console.log('Fetching multimedia from backend...')
      const data = await multimediaApi.getAll()
      console.log('Fetched multimedia data:', data)
      
      // Log each item's file_path for debugging
      data.forEach((item, index) => {
        console.log(`Multimedia item ${index}:`, {
          id: item.id,
          title: item.title,
          file_path: item.file_path,
          file_type: item.file_type
        })
      })
      
      setMultimediaItems(data)
      if (data.length > 0) {
        setSelectedMultimedia(data[0])
      }
    } catch (error) {
      console.error('Error fetching multimedia:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les données multimedia",
        variant: "destructive",
      })
    } finally {
      setIsLoadingMultimedia(false)
    }
  }

  useEffect(() => {
    fetchMedia()
    fetchMultimedia()
    
    // Test toast to verify the system is working
    console.log('Testing toast system...')
    toast({
      title: "Test Toast",
      description: "Gestion des Actualités et Médias",
    })
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedMedia) return

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('image', file)
      formData.append('title', selectedMedia.title)
      formData.append('description', selectedMedia.description)
      formData.append('periode', selectedMedia.periode)

      const updatedMedia = await mediaApi.update(selectedMedia.id, formData)
      console.log('Updated media:', updatedMedia)

      // Refresh data from backend to ensure we have the latest
      await fetchMedia()

      console.log('Showing success toast for image upload')
      toast({
        title: "Image téléchargée",
        description: "L'image a été téléchargée avec succès.",
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du téléchargement de l'image.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleMultimediaFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedMultimedia) return

    try {
      setIsUploading(true)
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', selectedMultimedia.title)

      const updatedMultimedia = await multimediaApi.update(selectedMultimedia.id, formData)
      
      // Update the multimedia item in the list
      const updatedItems = multimediaItems.map((item) => 
        item.id === updatedMultimedia.id ? updatedMultimedia : item
      )
      setMultimediaItems(updatedItems)
      setSelectedMultimedia(updatedMultimedia)

      toast({
        title: "Fichier téléchargé",
        description: "Le fichier a été téléchargé avec succès.",
      })
    } catch (error) {
      console.error('Error uploading multimedia file:', error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du téléchargement du fichier.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveMedia = async () => {
    if (!selectedMedia) return

    try {
      setIsSaving(true)
      const formData = new FormData()
      formData.append('title', selectedMedia.title)
      formData.append('description', selectedMedia.description)
      formData.append('periode', selectedMedia.periode)

      const updatedMedia = await mediaApi.update(selectedMedia.id, formData)
      console.log('Updated media:', updatedMedia)

      // Refresh data from backend to ensure we have the latest
      await fetchMedia()

      console.log('Showing success toast for save')
      toast({
        title: "Modifications enregistrées",
        description: "Les modifications ont été enregistrées avec succès.",
      })
    } catch (error) {
      console.error('Error saving media:', error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement des modifications.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveMultimedia = async () => {
    if (!selectedMultimedia) return

    try {
      setIsSaving(true)

      const formData = new FormData()
      formData.append('title', selectedMultimedia.title)

      const updatedMultimedia = await multimediaApi.update(selectedMultimedia.id, formData)

      // Mettre à jour le multimedia dans le tableau
      const updatedItems = multimediaItems.map((item) => (item.id === updatedMultimedia.id ? updatedMultimedia : item))

      setMultimediaItems(updatedItems)
      setSelectedMultimedia(updatedMultimedia)

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

  const handleNewMediaImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewMediaForm(prev => ({ ...prev, image: file }))
    }
  }

  const handleAddMedia = async () => {
    if (!newMediaForm.title || !newMediaForm.description || !newMediaForm.periode || !newMediaForm.image) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs et sélectionner une image.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)
      const formData = new FormData()
      formData.append('title', newMediaForm.title)
      formData.append('description', newMediaForm.description)
      formData.append('periode', newMediaForm.periode)
      formData.append('image', newMediaForm.image)

      const newMedia = await mediaApi.create(formData)
      console.log('Created new media:', newMedia)

      // Refresh data from backend to ensure we have the latest
      await fetchMedia()

      // Reset form
      setNewMediaForm({
        title: '',
        description: '',
        periode: '',
        image: null
      })
      setShowAddForm(false)

      console.log('Showing success toast for add')
      toast({
        title: "Actualité ajoutée",
        description: "Une nouvelle actualité a été ajoutée avec succès.",
      })
    } catch (error) {
      console.error('Error adding media:', error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout de l'actualité.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddMultimedia = async () => {
    try {
      setIsSaving(true)

      // Create a default image file for new multimedia
      const defaultImageBlob = await fetch('/placeholder.svg').then(r => r.blob())
      const defaultImageFile = new File([defaultImageBlob], 'default-image.svg', { type: 'image/svg+xml' })

      const formData = new FormData()
      formData.append('file', defaultImageFile)
      formData.append('title', 'Nouveau multimedia')

      const newItem = await multimediaApi.create(formData)
      setMultimediaItems([...multimediaItems, newItem])
      setSelectedMultimedia(newItem)

      toast({
        title: "Multimedia ajouté",
        description: "Un nouveau multimedia a été ajouté avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout du multimedia.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteMedia = async (id: number) => {
    if (mediaItems.length <= 1) {
      toast({
        title: "Impossible de supprimer",
        description: "Vous devez conserver au moins un média.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)
      await mediaApi.delete(id)

      // Refresh data from backend to ensure we have the latest
      await fetchMedia()

      console.log('Showing success toast for delete')
      toast({
        title: "Média supprimé",
        description: "Le média a été supprimé avec succès.",
      })
    } catch (error) {
      console.error('Error deleting media:', error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression du média.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteMultimedia = async (id: number) => {
    if (multimediaItems.length <= 1) {
      toast({
        title: "Impossible de supprimer",
        description: "Vous devez conserver au moins un élément dans la galerie multimedia.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)

      await multimediaApi.delete(id)

      const updatedMultimedia = multimediaItems.filter((item) => item.id !== id)
      setMultimediaItems(updatedMultimedia)
      setSelectedMultimedia(updatedMultimedia[0])

      toast({
        title: "Multimedia supprimé",
        description: "Le multimedia a été supprimé avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression du multimedia.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getImageUrl = (imagePath: string) => {
    console.log('getImageUrl called with:', imagePath)
    if (!imagePath) return '/placeholder.svg?height=400&width=600'
    
    // If the path already starts with /uploads/, use it as is
    if (imagePath.startsWith('/uploads/')) {
      const fullUrl = `http://localhost:5000${imagePath}`
      console.log('Constructed URL (with /uploads/):', fullUrl)
      return fullUrl
    }
    
    // Otherwise, add the /uploads/ prefix
    const fullUrl = `http://localhost:5000/uploads/${imagePath}`
    console.log('Constructed URL (without /uploads/):', fullUrl)
    return fullUrl
  }

  const getMultimediaUrl = (filePath: string) => {
    if (!filePath) return '/placeholder.svg?height=400&width=600'
    
    // If the path already starts with /uploads/, use it as is
    if (filePath.startsWith('/uploads/')) {
      const fullUrl = `http://localhost:5000${filePath}`
      console.log('Constructed multimedia URL (with /uploads/):', fullUrl)
      return fullUrl
    }
    
    // Otherwise, add the /uploads/ prefix
    const fullUrl = `http://localhost:5000/uploads/${filePath}`
    console.log('Constructed multimedia URL (without /uploads/):', fullUrl)
    return fullUrl
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Chargement des médias...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="news">Actualités</TabsTrigger>
          <TabsTrigger value="multimedia">Galerie Multimedia</TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Gestion des Actualités</h3>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)} 
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              {showAddForm ? 'Annuler' : 'Ajouter une actualité'}
            </Button>
          </div>

          {/* Add New Media Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Nouvelle Actualité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-title">Titre</Label>
                  <Input
                    id="new-title"
                    value={newMediaForm.title}
                    onChange={(e) => setNewMediaForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Titre de l'actualité"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-description">Description</Label>
                  <Textarea
                    id="new-description"
                    value={newMediaForm.description}
                    onChange={(e) => setNewMediaForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description de l'actualité"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-periode">Période</Label>
                  <Input
                    id="new-periode"
                    value={newMediaForm.periode}
                    onChange={(e) => setNewMediaForm(prev => ({ ...prev, periode: e.target.value }))}
                    placeholder="Période (ex: 2024)"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Image</Label>
                  <div className="space-y-4">
                    {newMediaForm.image && (
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={URL.createObjectURL(newMediaForm.image)}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('new-image-upload')?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {newMediaForm.image ? 'Changer l\'image' : 'Sélectionner une image'}
                      </Button>
                      <input
                        id="new-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleNewMediaImageSelect}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddMedia} disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  Créer l'actualité
                </Button>
              </CardFooter>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Media List */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Liste des Actualités</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mediaItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedMedia?.id === item.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedMedia(item)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={getImageUrl(item.image_path)}
                            alt={item.title}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                           {item.periode}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Media Editor */}
            <div className="lg:col-span-2">
              {selectedMedia ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Éditer l&apos;Actualité</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre</Label>
                      <Input
                        id="title"
                        value={selectedMedia.title}
                        onChange={(e) =>
                          setSelectedMedia({ ...selectedMedia, title: e.target.value })
                        }
                        placeholder="Titre de l'actualité"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={selectedMedia.description}
                        onChange={(e) =>
                          setSelectedMedia({ ...selectedMedia, description: e.target.value })
                        }
                        placeholder="Description de l'actualité"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="periode">Période</Label>
                      <Input
                        id="periode"
                        value={selectedMedia.periode}
                        onChange={(e) =>
                          setSelectedMedia({ ...selectedMedia, periode: e.target.value })
                        }
                        placeholder="Période (ex: 2024)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Image</Label>
                      <div className="space-y-4">
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={getImageUrl(selectedMedia.image_path)}
                            alt={selectedMedia.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Upload className="mr-2 h-4 w-4" />
                            )}
                            {isUploading ? "Téléchargement..." : "Changer l'image"}
                          </Button>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteMedia(selectedMedia.id)}
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                      Supprimer
                    </Button>
                    <Button onClick={handleSaveMedia} disabled={isSaving}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Enregistrer
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center text-gray-500">
                      <p>Sélectionnez une actualité pour commencer l'édition</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="multimedia" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Gestion de la Galerie Multimedia</h3>
            <Button 
              onClick={handleAddMultimedia} 
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Ajouter un multimedia
            </Button>
          </div>

          {isLoadingMultimedia ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Chargement de la galerie multimedia...</span>
            </div>
          ) : multimediaItems.length === 0 ? (
            <div className="text-center p-8">
              <p className="mb-4">Aucun multimedia trouvé.</p>
              <Button onClick={handleAddMultimedia}>Ajouter un premier multimedia</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Multimedia List */}
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Liste des Multimedia</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {multimediaItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedMultimedia?.id === item.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedMultimedia(item)}
                      >
                        <div className="flex items-center space-x-3">
                                                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 relative">
                             {item.file_type === "video" ? (
                               // For videos, show video thumbnail with play button overlay
                               <div className="relative w-full h-full">
                                 <video 
                                   src={getMultimediaUrl(item.file_path)}
                                   className="w-full h-full object-cover"
                                   muted
                                   preload="metadata"
                                   onLoadedData={(e) => {
                                     // Set the current time to 1 second to get a thumbnail
                                     e.currentTarget.currentTime = 1
                                   }}
                                   onError={(e) => {
                                     console.error('Error loading video thumbnail:', item.file_path)
                                     // Fallback to placeholder if video fails to load
                                     const container = e.currentTarget.parentElement
                                     if (container) {
                                       container.innerHTML = `
                                         <div class="w-full h-full flex items-center justify-center bg-gray-200">
                                           <div class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                             <div class="w-0 h-0 border-t-[3px] border-t-transparent border-l-[4px] border-l-white border-b-[3px] border-b-transparent ml-0.5"></div>
                                           </div>
                                         </div>
                                       `
                                     }
                                   }}
                                 />
                                 <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                   <div className="w-4 h-4 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                                     <div className="w-0 h-0 border-t-[2px] border-t-transparent border-l-[3px] border-l-blue-600 border-b-[2px] border-b-transparent ml-0.5"></div>
                                   </div>
                                 </div>
                               </div>
                             ) : (
                               // For images, show the actual image
                               <Image
                                 src={getMultimediaUrl(item.file_path)}
                                 alt={item.title}
                                 width={48}
                                 height={48}
                                 className="object-cover w-full h-full"
                                 onError={(e) => {
                                   console.error('Error loading image:', item.file_path)
                                   e.currentTarget.src = '/placeholder.svg?height=48&width=48'
                                 }}
                               />
                             )}
                           </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {item.title}
                            </h4>
                            <p className="text-xs text-gray-500 capitalize">
                              {item.file_type}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Multimedia Editor */}
              <div className="lg:col-span-2">
                {selectedMultimedia ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Éditer le Multimedia</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="multimedia-title">Titre</Label>
                        <Input
                          id="multimedia-title"
                          value={selectedMultimedia.title}
                          onChange={(e) =>
                            setSelectedMultimedia({ ...selectedMultimedia, title: e.target.value })
                          }
                          placeholder="Titre du multimedia"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Fichier actuel</Label>
                        <div className="space-y-4">
                                                                                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                             {selectedMultimedia.file_type === "video" ? (
                               // For videos, show a video player or placeholder
                               <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                 <div className="text-center">
                                   <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4">
                                     <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                                   </div>
                                   <p className="text-sm text-gray-600">Vidéo</p>
                                   <p className="text-xs text-gray-500 mt-1">{selectedMultimedia.title}</p>
                                   <div className="mt-4">
                                     <video 
                                       controls 
                                       className="w-full max-w-md mx-auto rounded-lg"
                                       src={getMultimediaUrl(selectedMultimedia.file_path)}
                                     >
                                       Votre navigateur ne supporte pas la lecture de vidéos.
                                     </video>
                                   </div>
                                 </div>
                               </div>
                             ) : (
                               // For images, show the actual image
                               <Image
                                 src={getMultimediaUrl(selectedMultimedia.file_path)}
                                 alt={selectedMultimedia.title}
                                 fill
                                 className="object-cover"
                                 onError={(e) => {
                                   console.error('Error loading multimedia image:', selectedMultimedia.file_path)
                                   e.currentTarget.src = '/placeholder.svg?height=400&width=600'
                                 }}
                               />
                             )}
                           </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => document.getElementById('multimedia-file-upload')?.click()}
                              disabled={isUploading}
                            >
                              {isUploading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Upload className="mr-2 h-4 w-4" />
                              )}
                              {isUploading ? "Téléchargement..." : "Changer le fichier"}
                            </Button>
                            <input
                              id="multimedia-file-upload"
                              type="file"
                              accept="image/*,video/*"
                              onChange={handleMultimediaFileUpload}
                              className="hidden"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="multimedia-type">Type de fichier</Label>
                        <Input
                          id="multimedia-type"
                          value={selectedMultimedia.file_type}
                          disabled
                          className="bg-gray-100"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="multimedia-path">Chemin du fichier</Label>
                        <Input
                          id="multimedia-path"
                          value={selectedMultimedia.file_path}
                          disabled
                          className="bg-gray-100"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteMultimedia(selectedMultimedia.id)}
                        disabled={isSaving}
                      >
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                        Supprimer
                      </Button>
                      <Button onClick={handleSaveMultimedia} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Enregistrer
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-64">
                      <div className="text-center text-gray-500">
                        <p>Sélectionnez un multimedia pour commencer l'édition</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 