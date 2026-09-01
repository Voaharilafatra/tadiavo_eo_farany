import { useSearchParams } from 'react-router-dom'
import { FiFilter } from 'react-icons/fi'

function ResultatsRecherche() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  
  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-5 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-black">Résultats de recherche</h1>
          <p className="mt-2 text-zinc-600">Recherche : <span className="font-bold text-black">{q || "Filtres avancés"}</span></p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar des filtres */}
          <div className="w-64 hidden lg:block bg-white p-5 rounded-2xl shadow-sm border border-zinc-200 h-fit">
            <div className="flex items-center gap-2 font-bold mb-4">
              <FiFilter /> Filtres
            </div>
            {/* ... on pourra ajouter les combobox ici aussi ... */}
            <p className="text-sm text-zinc-500">Bientôt : Filtres interactifs ici</p>
          </div>

          {/* Liste des résultats */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl p-8 text-center border border-zinc-200">
              <p className="text-zinc-500">Recherche en cours ou résultats à afficher ici.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultatsRecherche
