import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const carouselItems = await sql`
      SELECT * FROM carousel_items
      ORDER BY order_index ASC
    `

    return NextResponse.json(carouselItems)
  } catch (error) {
    console.error("Erreur lors de la récupération des éléments du carrousel:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des éléments du carrousel" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Vérifier les champs requis
    if (!body.title || !body.image_url) {
      return NextResponse.json({ error: "Le titre et l'URL de l'image sont requis" }, { status: 400 })
    }

    // Obtenir l'index maximum actuel
    const maxOrderResult = await sql`
      SELECT COALESCE(MAX(order_index), 0) as max_order
      FROM carousel_items
    `

    const maxOrder = maxOrderResult[0].max_order || 0
    const newOrder = maxOrder + 1

    // Insérer le nouvel élément
    const newItem = await sql`
      INSERT INTO carousel_items (
        title, subtitle, description, cta, image_url, order_index
      ) VALUES (
        ${body.title},
        ${body.subtitle || ""},
        ${body.description || ""},
        ${body.cta || "En savoir plus"},
        ${body.image_url},
        ${newOrder}
      )
      RETURNING *
    `

    return NextResponse.json(newItem[0])
  } catch (error) {
    console.error("Erreur lors de la création d'un élément du carrousel:", error)
    return NextResponse.json({ error: "Erreur lors de la création d'un élément du carrousel" }, { status: 500 })
  }
}
