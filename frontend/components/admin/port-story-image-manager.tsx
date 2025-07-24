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
import { Loader2, Upload, Save, Trash2 } from "lucide-react"
import { uploadImageToBlob } from "@/lib/blob-utils"

type PortStoryEvent = {
  id: number
  year: string
  title: string
  description: string
  image_url: string
  order_index: number
}

export function PortStoryImageManager() {
  const [timelineEvents, setTimelineEvents] = useState<PortStoryEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<PortStoryEvent | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Charger les données de l'histoire du port
  useEffect(() => {
    const fetchPortStoryEvents = async () => {
      try {
        const response = await fetch("/api/port-story")
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données")
        }
        const data = await response.json()
        setTimelineEvents(data)
        if (data.length > 0) {
          setSelectedEvent(data[0])
        }
        setIsLoading(false)
      } catch (error) {
        console.error("Erreur:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de l'histoire du port",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchPortStoryEvents()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedEvent) return

    try {
      setIsUploading(true)
      const imageUrl = await uploadImageToBlob(file, "port-story")

      setSelectedEvent({
        ...selectedEvent,
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

  const handleSaveEvent = async () => {
    if (!selectedEvent) return

    try {
      setIsSaving(true)

      const response = await fetch(`/api/port-story/${selectedEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedEvent),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde")
      }

      const updatedEvent = await response.json()

      // Mettre à jour l'événement dans le tableau
      const updatedEvents = timelineEvents.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))

      setTimelineEvents(updatedEvents)

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

  const handleAddNewEvent = async () => {
    try {
      setIsSaving(true)

      const newEventData = {
        year: "Année",
        title: "Nouvel événement",
        description: "Description de l'événement",
        image_url: "/placeholder.svg?height=400&width=600",
      }

      const response = await fetch("/api/port-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEventData),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout")
      }

      const newEvent = await response.json()
      setTimelineEvents([...timelineEvents, newEvent])
      setSelectedEvent(newEvent)

      toast({
        title: "Événement ajouté",
        description: "Un nouvel événement a été ajouté avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout de l'événement.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteEvent = async (id: number) => {
    if (timelineEvents.length <= 1) {
      toast({
        title: "Impossible de supprimer",
        description: "Vous devez conserver au moins un événement dans la chronologie.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)

      const response = await fetch(`/api/port-story/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression")
      }

      const updatedEvents = timelineEvents.filter((event) => event.id !== id)
      setTimelineEvents(updatedEvents)
      setSelectedEvent(updatedEvents[0])

      toast({
        title: "Événement supprimé",
        description: "L'événement a été supprimé avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
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

  if (timelineEvents.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="mb-4">Aucun événement trouvé dans l'histoire du port.</p>
        <Button onClick={handleAddNewEvent}>Ajouter un premier événement</Button>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Événements de la chronologie</h2>

        {timelineEvents.map((event) => (
          <Card
            key={event.id}
            className={`cursor-pointer transition-all ${selectedEvent?.id === event.id ? "ring-2 ring-primary" : ""}`}
            onClick={() => setSelectedEvent(event)}
          >
            <CardContent className="p-3">
              <div className="relative aspect-video rounded-md overflow-hidden mb-2">
                <Image src={event.image_url || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
              </div>
              <p className="font-medium">
                {event.year} - {event.title}
              </p>
            </CardContent>
          </Card>
        ))}

        <Button onClick={handleAddNewEvent} className="w-full">
          Ajouter un événement
        </Button>
      </div>

      {selectedEvent && (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Modifier l&apos;événement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative aspect-video rounded-lg overflow-hidden border">
                <Image
                  src={selectedEvent.image_url || "/placeholder.svg"}
                  alt={selectedEvent.title}
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                  <Label htmlFor="timeline-image-upload" className="cursor-pointer">
                    <div className="bg-white text-black rounded-full p-3">
                      <Upload className="h-6 w-6" />
                    </div>
                  </Label>
                  <Input
                    id="timeline-image-upload"
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
                  <Label htmlFor="year">Année</Label>
                  <Input
                    id="year"
                    value={selectedEvent.year}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, year: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={selectedEvent.title}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={selectedEvent.description}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="destructive" onClick={() => handleDeleteEvent(selectedEvent.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>

              <Button onClick={handleSaveEvent} disabled={isSaving}>
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
