import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    const event = await sql`
      SELECT * FROM port_story_events
      WHERE id = ${id}
    `

    if (event.length === 0) {
      return NextResponse.json({ error: "Événement non trouvé" }, { status: 404 })
    }

    return NextResponse.json(event[0])
  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération de l'événement" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    const body = await request.json()

    // Vérifier les champs requis
    if (!body.year || !body.title || !body.image_url) {
      return NextResponse.json({ error: "L'année, le titre et l'URL de l'image sont requis" }, { status: 400 })
    }

    // Mettre à jour l'événement
    const updatedEvent = await sql`
      UPDATE port_story_events
      SET 
        year = ${body.year},
        title = ${body.title},
        description = ${body.description || ""},
        image_url = ${body.image_url},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (updatedEvent.length === 0) {
      return NextResponse.json({ error: "Événement non trouvé" }, { status: 404 })
    }

    return NextResponse.json(updatedEvent[0])
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'événement:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de l'événement" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    // Vérifier si c'est le dernier événement
    const countResult = await sql`
      SELECT COUNT(*) as count FROM port_story_events
    `

    if (countResult[0].count <= 1) {
      return NextResponse.json(
        { error: "Impossible de supprimer le dernier événement de l'histoire du port" },
        { status: 400 },
      )
    }

    // Récupérer l'ordre de l'événement à supprimer
    const eventToDelete = await sql`
      SELECT order_index FROM port_story_events WHERE id = ${id}
    `

    if (eventToDelete.length === 0) {
      return NextResponse.json({ error: "Événement non trouvé" }, { status: 404 })
    }

    const orderIndex = eventToDelete[0].order_index

    // Supprimer l'événement
    await sql`
      DELETE FROM port_story_events WHERE id = ${id}
    `

    // Réorganiser les indices des événements restants
    await sql`
      UPDATE port_story_events
      SET order_index = order_index - 1
      WHERE order_index > ${orderIndex}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'événement:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression de l'événement" }, { status: 500 })
  }
}
