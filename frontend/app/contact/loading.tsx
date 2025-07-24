export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-16 h-16 border-4 border-[#003366] border-t-[#D4AF37] rounded-full animate-spin"></div>
      <h2 className="mt-4 text-xl font-semibold text-[#003366]">Chargement...</h2>
      <p className="mt-2 text-gray-600">Nous préparons la page de contact</p>
    </div>
  )
}
