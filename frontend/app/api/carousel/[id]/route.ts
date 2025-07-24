import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    const carouselItem = await sql`
      SELECT * FROM carousel_items
      WHERE id = ${id}
    `

    if (carouselItem.length === 0) {
      return NextResponse.json({ error: "Élément non trouvé" }, { status: 404 })
    }

    return NextResponse.json(carouselItem[0])
  } catch (error) {
    console.error("Erreur lors de la récupération de l'élément du carrousel:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération de l'élément du carrousel" }, { status: 500 })
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

    // Mettre à jour l'élément
    const updatedItem = await sql`
      UPDATE carousel_items
      SET 
        title = ${body.title},
        subtitle = ${body.subtitle || ""},
        description = ${body.description || ""},
        cta = ${body.cta || "En savoir plus"},
        image_url = ${body.image_url},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (updatedItem.length === 0) {
      return NextResponse.json({ error: "Élément non trouvé" }, { status: 404 })
    }

    return NextResponse.json(updatedItem[0])
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'élément du carrousel:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de l'élément du carrousel" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    // Vérifier si c'est le dernier élément
    const countResult = await sql`
      SELECT COUNT(*) as count FROM carousel_items
    `

    if (countResult[0].count <= 1) {
      return NextResponse.json({ error: "Impossible de supprimer le dernier élément du carrousel" }, { status: 400 })
    }

    // Récupérer l'ordre de l'élément à supprimer
    const itemToDelete = await sql`
      SELECT order_index FROM carousel_items WHERE id = ${id}
    `

    if (itemToDelete.length === 0) {
      return NextResponse.json({ error: "Élément non trouvé" }, { status: 404 })
    }

    const orderIndex = itemToDelete[0].order_index

    // Supprimer l'élément
    await sql`
      DELETE FROM carousel_items WHERE id = ${id}
    `

    // Réorganiser les indices des éléments restants
    await sql`
      UPDATE carousel_items
      SET order_index = order_index - 1
      WHERE order_index > ${orderIndex}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'élément du carrousel:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression de l'élément du carrousel" }, { status: 500 })
  }
}
