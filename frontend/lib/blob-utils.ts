/**
 * Utilitaires pour gérer le téléchargement d'images vers Vercel Blob
 */

/**
 * Télécharge une image vers Vercel Blob
 * @param file Fichier à télécharger
 * @param folder Dossier de destination (pour organisation)
 * @returns URL de l'image téléchargée
 */
export async function uploadImageToBlob(file: File, folder = "general"): Promise<string> {
  try {
    // Créer un FormData pour l'envoi du fichier
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)

    // Appeler l'API de téléchargement
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      // Tentative de lecture du corps de la réponse pour un message d'erreur plus précis
      let errorMessage = `Erreur lors du téléchargement: ${response.status} - ${response.statusText}`
      try {
        const text = await response.text()
        console.log("Response text:", text) // Log the response text for debugging
        const errorBody = JSON.parse(text) // Attempt to parse the text as JSON
        if (errorBody && errorBody.error) {
          errorMessage += ` - ${errorBody.error}`
        }
      } catch (parseError) {
        console.error("Erreur lors de l'analyse du corps de la réponse:", parseError)
        errorMessage += " - Erreur lors de l'analyse de la réponse du serveur."
        // Si la réponse n'est pas du JSON, on garde le message d'erreur initial
      }
      throw new Error(errorMessage)
    }

    try {
      const data = await response.json()
      if (!data.success) {
        throw new Error(`Erreur lors du téléchargement: ${data.error || "Unknown error"}`)
      }
      return data.url
    } catch (jsonError) {
      console.error("Erreur lors de l'analyse JSON:", jsonError)
      throw new Error(`Erreur lors de l'analyse JSON de la réponse: ${jsonError.message}`)
    }
  } catch (error: any) {
    console.error("Erreur lors du téléchargement vers Blob:", error)
    throw error
  }
}
