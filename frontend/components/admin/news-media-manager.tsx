"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Upload, Save, Trash2, Plus } from "lucide-react"
import { uploadImageToBlob } from "@/lib/blob-utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { multimediaApi } from "@/lib/api"

type NewsItem = {
  id: number
  title: string
  date: string
  type: string
  description: string
  image_url: string
}

type MultimediaItem = {
  id: number
  title: string
  file_path: string
  file_type: 'image' | 'video'
  created_at: string
  updated_at: string
}

export function NewsMediaManager() {
  const [activeTab, setActiveTab] = useState("news")
  const [news, setNews] = useState<NewsItem[]>([])
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [multimediaGallery, setMultimediaGallery] = useState<MultimediaItem[]>([])
  const [selectedMultimedia, setSelectedMultimedia] = useState<MultimediaItem | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingNews, setIsLoadingNews] = useState(true)
  const [isLoadingMultimedia, setIsLoadingMultimedia] = useState(true)

  // Charger les données des actualités
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news")
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données")
        }
        const data = await response.json()
        setNews(data)
        if (data.length > 0) {
          setSelectedNews(data[0])
        }
        setIsLoadingNews(false)
      } catch (error) {
        console.error("Erreur:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les données des actualités",
          variant: "destructive",
        })
        setIsLoadingNews(false)
      }
    }

    fetchNews()
  }, [])

  // Charger les données de la galerie multimedia
  useEffect(() => {
    const fetchMultimedia = async () => {
      try {
        const data = await multimediaApi.getAll()
        setMultimediaGallery(data)
        if (data.length > 0) {
          setSelectedMultimedia(data[0])
        }
        setIsLoadingMultimedia(false)
      } catch (error) {
        console.error("Erreur:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de la galerie multimedia",
          variant: "destructive",
        })
        setIsLoadingMultimedia(false)
      }
    }

    fetchMultimedia()
  }, [])

  const handleNewsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedNews) return

    try {
      setIsUploading(true)
      const imageUrl = await uploadImageToBlob(file, "news")

      setSelectedNews({
        ...selectedNews,
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
      const updatedItems = multimediaGallery.map((item) => 
        item.id === updatedMultimedia.id ? updatedMultimedia : item
      )
      setMultimediaGallery(updatedItems)
      setSelectedMultimedia(updatedMultimedia)

      toast({
        title: "Fichier téléchargé",
        description: "Le fichier a été téléchargé avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du téléchargement du fichier.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveNews = async () => {
    if (!selectedNews) return

    try {
      setIsSaving(true)

      const response = await fetch(`/api/news/${selectedNews.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedNews),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde")
      }

      const updatedNews = await response.json()

      // Mettre à jour l'actualité dans le tableau
      const updatedItems = news.map((item) => (item.id === updatedNews.id ? updatedNews : item))

      setNews(updatedItems)

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

  const handleSaveMultimedia = async () => {
    if (!selectedMultimedia) return

    try {
      setIsSaving(true)

      const formData = new FormData()
      formData.append('title', selectedMultimedia.title)

      const updatedMultimedia = await multimediaApi.update(selectedMultimedia.id, formData)

      // Mettre à jour le multimedia dans le tableau
      const updatedItems = multimediaGallery.map((item) => (item.id === updatedMultimedia.id ? updatedMultimedia : item))

      setMultimediaGallery(updatedItems)
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

  const handleAddNews = async () => {
    try {
      setIsSaving(true)

      const newItemData = {
        title: "Nouvelle actualité",
        date: new Date().toISOString().split("T")[0],
        type: "press",
        description: "Description de la nouvelle actualité...",
        image_url: "/placeholder.svg?height=400&width=600",
      }

      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItemData),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout")
      }

      const newItem = await response.json()
      setNews([...news, newItem])
      setSelectedNews(newItem)

      toast({
        title: "Actualité ajoutée",
        description: "Une nouvelle actualité a été ajoutée avec succès.",
      })
    } catch (error) {
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
      setMultimediaGallery([...multimediaGallery, newItem])
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

  const handleDeleteNews = async (id: number) => {
    if (news.length <= 1) {
      toast({
        title: "Impossible de supprimer",
        description: "Vous devez conserver au moins une actualité.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)

      const response = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression")
      }

      const updatedNews = news.filter((item) => item.id !== id)
      setNews(updatedNews)
      setSelectedNews(updatedNews[0])

      toast({
        title: "Actualité supprimée",
        description: "L'actualité a été supprimée avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression de l'actualité.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteMultimedia = async (id: number) => {
    if (multimediaGallery.length <= 1) {
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

      const updatedMultimedia = multimediaGallery.filter((item) => item.id !== id)
      setMultimediaGallery(updatedMultimedia)
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

  const renderNewsTab = () => {
    if (isLoadingNews) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Chargement des actualités...</span>
        </div>
      )
    }

    if (news.length === 0) {
      return (
        <div className="text-center p-8">
          <p className="mb-4">Aucune actualité trouvée.</p>
          <Button onClick={handleAddNews}>Ajouter une première actualité</Button>
        </div>
      )
    }

    return (
      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Actualités</h2>
            <Button size="sm" variant="outline" onClick={handleAddNews}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>

          {news.map((item) => (
            <Card
              key={item.id}
              className={`cursor-pointer transition-all ${selectedNews?.id === item.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedNews(item)}
            >
              <CardContent className="p-3">
                <div className="relative aspect-video rounded-md overflow-hidden mb-2">
                  <Image src={item.image_url || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                </div>
                <p className="font-medium truncate">{item.title}</p>
                <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedNews && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Modifier l&apos;actualité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative aspect-video rounded-lg overflow-hidden border">
                  <Image
                    src={selectedNews.image_url || "/placeholder.svg"}
                    alt={selectedNews.title}
                    fill
                    className="object-cover"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                    <Label htmlFor="news-image-upload" className="cursor-pointer">
                      <div className="bg-white text-black rounded-full p-3">
                        <Upload className="h-6 w-6" />
                      </div>
                    </Label>
                    <Input
                      id="news-image-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleNewsImageUpload}
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
                      value={selectedNews.title}
                      onChange={(e) => setSelectedNews({ ...selectedNews, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedNews.date}
                      onChange={(e) => setSelectedNews({ ...selectedNews, date: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={selectedNews.type}
                      onValueChange={(value) => setSelectedNews({ ...selectedNews, type: value })}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="press">Communiqué de presse</SelectItem>
                        <SelectItem value="event">Événement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={selectedNews.description}
                      onChange={(e) => setSelectedNews({ ...selectedNews, description: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="destructive" onClick={() => handleDeleteNews(selectedNews.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>

                <Button onClick={handleSaveNews} disabled={isSaving}>
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

  const renderMultimediaTab = () => {
    if (isLoadingMultimedia) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Chargement de la galerie multimedia...</span>
        </div>
      )
    }

    if (multimediaGallery.length === 0) {
      return (
        <div className="text-center p-8">
          <p className="mb-4">Aucun multimedia trouvé.</p>
          <Button onClick={handleAddMultimedia}>Ajouter un premier multimedia</Button>
        </div>
      )
    }

    return (
      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Galerie Multimedia</h2>
            <Button size="sm" variant="outline" onClick={handleAddMultimedia}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>

          {multimediaGallery.map((item) => (
            <Card
              key={item.id}
              className={`cursor-pointer transition-all ${selectedMultimedia?.id === item.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedMultimedia(item)}
            >
              <CardContent className="p-3">
                <div className="relative aspect-video rounded-md overflow-hidden mb-2">
                  <Image
                    src={`http://localhost:5000${item.file_path}` || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  {item.file_type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  )}
                </div>
                <p className="font-medium truncate">{item.title}</p>
                <p className="text-xs text-gray-500 capitalize">{item.file_type}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedMultimedia && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Modifier le multimedia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="block mb-2">Fichier actuel</Label>
                  <div className="relative aspect-video rounded-lg overflow-hidden border">
                    <Image
                      src={`http://localhost:5000${selectedMultimedia.file_path}` || "/placeholder.svg"}
                      alt={selectedMultimedia.title}
                      fill
                      className="object-cover"
                    />

                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <Label htmlFor="multimedia-file-upload" className="cursor-pointer">
                        <div className="bg-white text-black rounded-full p-3">
                          <Upload className="h-6 w-6" />
                        </div>
                      </Label>
                      <Input
                        id="multimedia-file-upload"
                        type="file"
                        accept="image/*,video/*"
                        className="sr-only"
                        onChange={handleMultimediaFileUpload}
                        disabled={isUploading}
                      />
                    </div>

                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="multimediaTitle">Titre</Label>
                    <Input
                      id="multimediaTitle"
                      value={selectedMultimedia.title}
                      onChange={(e) => setSelectedMultimedia({ ...selectedMultimedia, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="multimediaType">Type de fichier</Label>
                    <Input
                      id="multimediaType"
                      value={selectedMultimedia.file_type}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="multimediaPath">Chemin du fichier</Label>
                    <Input
                      id="multimediaPath"
                      value={selectedMultimedia.file_path}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="destructive" onClick={() => handleDeleteMultimedia(selectedMultimedia.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>

                <Button onClick={handleSaveMultimedia} disabled={isSaving}>
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

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="news">Actualités</TabsTrigger>
          <TabsTrigger value="multimedia">Galerie Multimedia</TabsTrigger>
        </TabsList>

        <TabsContent value="news">{renderNewsTab()}</TabsContent>

        <TabsContent value="multimedia">{renderMultimediaTab()}</TabsContent>
      </Tabs>
    </div>
  )
}
