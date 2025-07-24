import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const mediaItems = await sql`
      SELECT * FROM media_gallery
      ORDER BY id DESC
    `

    return NextResponse.json(mediaItems)
  } catch (error) {
    console.error("Erreur lors de la récupération des médias:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des médias" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
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

    // Insérer le nouveau média
    const newItem = await sql`
      INSERT INTO media_gallery (
        title, type, thumbnail_url, full_size_url, video_url
      ) VALUES (
        ${body.title},
        ${body.type},
        ${body.thumbnail_url},
        ${body.full_size_url || null},
        ${body.video_url || null}
      )
      RETURNING *
    `

    return NextResponse.json(newItem[0])
  } catch (error) {
    console.error("Erreur lors de la création d'un média:", error)
    return NextResponse.json({ error: "Erreur lors de la création d'un média" }, { status: 500 })
  }
}
