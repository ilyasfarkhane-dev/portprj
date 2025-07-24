import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    const mediaItem = await sql`
      SELECT * FROM media_gallery
      WHERE id = ${id}
    `

    if (mediaItem.length === 0) {
      return NextResponse.json({ error: "Média non trouvé" }, { status: 404 })
    }

    return NextResponse.json(mediaItem[0])
  } catch (error) {
    console.error("Erreur lors de la récupération du média:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération du média" }, { status: 500 })
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
    if (!body.title || !body.type || !body.thumbnail_url) {
      return NextResponse.json({ error: "Le titre, le type et l'URL de la miniature sont requis" }, { status: 400 })
    }

    // Vérifier que le type est valide
    if (body.type !== "image" && body.type !== "video") {
      return NextResponse.json({ error: 'Le type doit être "image" ou "video"' }, { status: 400 })
    }

    // Vérifier les champs spécifiques au type
    if (body.type === "image" && !body.full_size_url) {
      return NextResponse.json(
        { error: "L'URL de l'image complète est requise pour le type \"image\"" },
        { status: 400 },
      )
    }

    if (body.type === "video" && !body.video_url) {
      return NextResponse.json({ error: 'L\'URL de la vidéo est requise pour le type "video"' }, { status: 400 })
    }

    // Mettre à jour le média
    const updatedItem = await sql`
      UPDATE media_gallery
      SET 
        title = ${body.title},
        type = ${body.type},
        thumbnail_url = ${body.thumbnail_url},
        full_size_url = ${body.full_size_url || null},
        video_url = ${body.video_url || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (updatedItem.length === 0) {
      return NextResponse.json({ error: "Média non trouvé" }, { status: 404 })
    }

    return NextResponse.json(updatedItem[0])
  } catch (error) {
    console.error("Erreur lors de la mise à jour du média:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour du média" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    // Vérifier si c'est le dernier média
    const countResult = await sql`
      SELECT COUNT(*) as count FROM media_gallery
    `

    if (countResult[0].count <= 1) {
      return NextResponse.json({ error: "Impossible de supprimer le dernier média" }, { status: 400 })
    }

    // Supprimer le média
    await sql`
      DELETE FROM media_gallery WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression du média:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression du média" }, { status: 500 })
  }
}
