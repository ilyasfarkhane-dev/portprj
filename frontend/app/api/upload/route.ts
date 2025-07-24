import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("Début du traitement de la requête d'upload")
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "general"

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("BLOB_READ_WRITE_TOKEN n'est pas défini")
      return NextResponse.json(
        {
          success: false,
          error:
            "BLOB_READ_WRITE_TOKEN n'est pas défini. Assurez-vous qu'il est configuré dans votre environnement Vercel.",
        },
        { status: 500 },
      )
    }

    if (!file) {
      console.log("Aucun fichier n'a été fourni")
      return NextResponse.json({ success: false, error: "Aucun fichier n'a été fourni" }, { status: 400 })
    }

    // Générer un nom de fichier unique
    const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`
    console.log(`Nom du fichier généré: ${fileName}`)

    // Télécharger le fichier vers Vercel Blob
    try {
      console.log("Début du téléchargement vers Vercel Blob")
      const blob = await put(fileName, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      })
      console.log(`Téléchargement réussi. URL: ${blob.url}`)

      // Retourner l'URL du fichier téléchargé
      return NextResponse.json({ success: true, url: blob.url })
    } catch (blobError: any) {
      console.error("Erreur lors du téléchargement vers Vercel Blob:", blobError)
      return NextResponse.json(
        {
          success: false,
          error: "Erreur lors du téléchargement vers Vercel Blob",
          details: blobError.message,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Erreur lors du traitement de la requête:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Une erreur s'est produite lors du traitement de la requête",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
