import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const newsItems = await sql`
      SELECT * FROM news_items
      ORDER BY date DESC
    `

    return NextResponse.json(newsItems)
  } catch (error) {
    console.error("Erreur lors de la récupération des actualités:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des actualités" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Vérifier les champs requis
    if (!body.title || !body.date || !body.type || !body.image_url) {
      return NextResponse.json({ error: "Le titre, la date, le type et l'URL de l'image sont requis" }, { status: 400 })
    }

    // Insérer la nouvelle actualité
    const newItem = await sql`
      INSERT INTO news_items (
        title, date, type, description, image_url
      ) VALUES (
        ${body.title},
        ${body.date},
        ${body.type},
        ${body.description || ""},
        ${body.image_url}
      )
      RETURNING *
    `

    return NextResponse.json(newItem[0])
  } catch (error) {
    console.error("Erreur lors de la création d'une actualité:", error)
    return NextResponse.json({ error: "Erreur lors de la création d'une actualité" }, { status: 500 })
  }
}
