function HomePrestataire() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-5">
      <div className="bg-white rounded-[2rem] p-10 max-w-2xl w-full text-center shadow-lg border border-zinc-100">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold">
          ✓
        </div>
        <h1 className="text-3xl font-extrabold text-black mb-4">Bienvenue dans votre Espace Prestataire !</h1>
        <p className="text-zinc-600 mb-8 leading-relaxed">
          Votre profil est maintenant actif. Vous pouvez ajouter de nouveaux services, consulter vos statistiques et interagir avec vos clients.
        </p>
        <button className="bg-yellow-400 text-white font-bold px-8 py-3 rounded-full hover:bg-yellow-500 transition shadow-md shadow-yellow-400/20">
          Accéder à mon tableau de bord (Prochainement)
        </button>
      </div>
    </div>
  )
}

export default HomePrestataire