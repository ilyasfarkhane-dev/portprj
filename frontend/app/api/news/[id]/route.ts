import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    const newsItem = await sql`
      SELECT * FROM news_items
      WHERE id = ${id}
    `

    if (newsItem.length === 0) {
      return NextResponse.json({ error: "Actualité non trouvée" }, { status: 404 })
    }

    return NextResponse.json(newsItem[0])
  } catch (error) {
    console.error("Erreur lors de la récupération de l'actualité:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération de l'actualité" }, { status: 500 })
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
    if (!body.title || !body.date || !body.type || !body.image_url) {
      return NextResponse.json({ error: "Le titre, la date, le type et l'URL de l'image sont requis" }, { status: 400 })
    }

    // Mettre à jour l'actualité
    const updatedItem = await sql`
      UPDATE news_items
      SET 
        title = ${body.title},
        date = ${body.date},
        type = ${body.type},
        description = ${body.description || ""},
        image_url = ${body.image_url},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (updatedItem.length === 0) {
      return NextResponse.json({ error: "Actualité non trouvée" }, { status: 404 })
    }

    return NextResponse.json(updatedItem[0])
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'actualité:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de l'actualité" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    // Vérifier si c'est la dernière actualité
    const countResult = await sql`
      SELECT COUNT(*) as count FROM news_items
    `

    if (countResult[0].count <= 1) {
      return NextResponse.json({ error: "Impossible de supprimer la dernière actualité" }, { status: 400 })
    }

    // Supprimer l'actualité
    await sql`
      DELETE FROM news_items WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'actualité:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression de l'actualité" }, { status: 500 })
  }
}
