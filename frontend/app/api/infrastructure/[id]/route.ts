import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    const image = await sql`
      SELECT * FROM infrastructure_images
      WHERE id = ${id}
    `

    if (image.length === 0) {
      return NextResponse.json({ error: "Image non trouvée" }, { status: 404 })
    }

    return NextResponse.json(image[0])
  } catch (error) {
    console.error("Erreur lors de la récupération de l'image:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération de l'image" }, { status: 500 })
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
    if (!body.title || !body.image_url) {
      return NextResponse.json({ error: "Le titre et l'URL de l'image sont requis" }, { status: 400 })
    }

    // Si c'est une image principale, mettre à jour les autres images pour qu'elles ne soient plus principales
    if (body.is_main) {
      await sql`
        UPDATE infrastructure_images
        SET is_main = false
        WHERE is_main = true AND id != ${id}
      `
    }

    // Mettre à jour l'image
    const updatedImage = await sql`
      UPDATE infrastructure_images
      SET 
        title = ${body.title},
        description = ${body.description || ""},
        image_url = ${body.image_url},
        is_main = ${body.is_main || false},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (updatedImage.length === 0) {
      return NextResponse.json({ error: "Image non trouvée" }, { status: 404 })
    }

    return NextResponse.json(updatedImage[0])
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'image:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de l'image" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    // Vérifier si c'est la dernière image
    const countResult = await sql`
      SELECT COUNT(*) as count FROM infrastructure_images
    `

    if (countResult[0].count <= 1) {
      return NextResponse.json({ error: "Impossible de supprimer la dernière image d'infrastructure" }, { status: 400 })
    }

    // Vérifier si c'est l'image principale
    const imageToDelete = await sql`
      SELECT is_main FROM infrastructure_images WHERE id = ${id}
    `

    if (imageToDelete.length === 0) {
      return NextResponse.json({ error: "Image non trouvée" }, { status: 404 })
    }

    // Si c'est l'image principale, définir une autre image comme principale
    if (imageToDelete[0].is_main) {
      const otherImage = await sql`
        SELECT id FROM infrastructure_images
        WHERE id != ${id}
        LIMIT 1
      `

      if (otherImage.length > 0) {
        await sql`
          UPDATE infrastructure_images
          SET is_main = true
          WHERE id = ${otherImage[0].id}
        `
      }
    }

    // Supprimer l'image
    await sql`
      DELETE FROM infrastructure_images WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression de l'image" }, { status: 500 })
  }
}
