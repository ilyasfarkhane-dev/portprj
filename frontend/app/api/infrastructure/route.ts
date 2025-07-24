import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const infrastructureImages = await sql`
      SELECT * FROM infrastructure_images
      ORDER BY id ASC
    `

    return NextResponse.json(infrastructureImages)
  } catch (error) {
    console.error("Erreur lors de la récupération des images d'infrastructure:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des images d'infrastructure" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Vérifier les champs requis
    if (!body.title || !body.image_url) {
      return NextResponse.json({ error: "Le titre et l'URL de l'image sont requis" }, { status: 400 })
    }

    // Si c'est une image principale, mettre à jour les autres images pour qu'elles ne soient plus principales
    if (body.is_main) {
      await sql`
        UPDATE infrastructure_images
        SET is_main = false
        WHERE is_main = true
      `
    }

    // Insérer la nouvelle image
    const newImage = await sql`
      INSERT INTO infrastructure_images (
        title, description, image_url, is_main
      ) VALUES (
        ${body.title},
        ${body.description || ""},
        ${body.image_url},
        ${body.is_main || false}
      )
      RETURNING *
    `

    return NextResponse.json(newImage[0])
  } catch (error) {
    console.error("Erreur lors de la création d'une image d'infrastructure:", error)
    return NextResponse.json({ error: "Erreur lors de la création d'une image d'infrastructure" }, { status: 500 })
  }
}
