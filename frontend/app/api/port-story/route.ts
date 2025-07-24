import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const portStoryEvents = await sql`
      SELECT * FROM port_story_events
      ORDER BY order_index ASC
    `

    return NextResponse.json(portStoryEvents)
  } catch (error) {
    console.error("Erreur lors de la récupération des événements de l'histoire du port:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des événements de l'histoire du port" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Vérifier les champs requis
    if (!body.year || !body.title || !body.image_url) {
      return NextResponse.json({ error: "L'année, le titre et l'URL de l'image sont requis" }, { status: 400 })
    }

    // Obtenir l'index maximum actuel
    const maxOrderResult = await sql`
      SELECT COALESCE(MAX(order_index), 0) as max_order
      FROM port_story_events
    `

    const maxOrder = maxOrderResult[0].max_order || 0
    const newOrder = maxOrder + 1

    // Insérer le nouvel événement
    const newEvent = await sql`
      INSERT INTO port_story_events (
        year, title, description, image_url, order_index
      ) VALUES (
        ${body.year},
        ${body.title},
        ${body.description || ""},
        ${body.image_url},
        ${newOrder}
      )
      RETURNING *
    `

    return NextResponse.json(newEvent[0])
  } catch (error) {
    console.error("Erreur lors de la création d'un événement de l'histoire du port:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création d'un événement de l'histoire du port" },
      { status: 500 },
    )
  }
}
