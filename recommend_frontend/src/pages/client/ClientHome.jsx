import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiFilter, FiMapPin, FiStar } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

function ClientHome() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    category: '',
    city: '',
    neighborhood: '',
    rating: '',
    maxPrice: ''
  })

  
  const categories = ['Plomberie', 'Électricité', 'Ménage', 'Jardinage', 'Mécanique', 'Beauté']
  const cities = ['Antananarivo', 'Toamasina', 'Antsirabe', 'Fianarantsoa']
  const neighborhoods = ['Analakely', 'Ambohijatovo', 'Ankorondrano', 'Ivandry', 'Tanjombato']
  const ratings = ['1+', '2+', '3+', '4+', '5']

  const mockProviders = [
    { 
      id: 1, 
      title: 'Nettoyage complet à domicile', 
      description: 'Service rapide et professionnel pour votre maison.',
      category: 'Ménage', 
      city: 'Antananarivo', 
      neighborhood: 'Ivandry', 
      rating: 4.8, 
      price: 30000,
      sampleService: 'Nettoyage T2/T3',
      img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      id: 2, 
      title: 'Plombier Express 24/7', 
      description: 'Dépannage rapide pour fuites et installations.',
      category: 'Plomberie', 
      city: 'Antananarivo', 
      neighborhood: 'Ambohijatovo', 
      rating: 4.5,
      price: 45000, 
      sampleService: "Réparation fuite d'eau",
      img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      id: 3, 
      title: 'Jardinier Pro', 
      description: 'Entretien de jardins, taille de haies, et tonte.',
      category: 'Jardinage', 
      city: 'Toamasina', 
      neighborhood: 'Ambohijatovo', 
      rating: 5.0,
      price: 50000, 
      sampleService: 'Tonte de pelouse',
      img: 'https://images.unsplash.com/photo-1416879598555-5271887e2de1?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      id: 4, 
      title: 'Électricien Bâtiment', 
      description: 'Rénovation électrique, diagnostic et dépannage.',
      category: 'Électricité', 
      city: 'Antsirabe', 
      neighborhood: 'Analakely', 
      rating: 3.5,
      price: 20000, 
      sampleService: 'Diagnostic électrique',
      img: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80' 
    },
  ]

  const filteredProviders = mockProviders.filter(provider => {
    let match = true;
    if (filters.category && provider.category !== filters.category) match = false;
    if (filters.city && provider.city !== filters.city) match = false;
    if (filters.neighborhood && provider.neighborhood !== filters.neighborhood) match = false;
    if (filters.rating) {
      const minRating = parseInt(filters.rating.replace('+', ''));
      if (provider.rating < minRating) match = false;
    }
    if (filters.maxPrice && provider.price > parseInt(filters.maxPrice)) match = false;
    return match;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const clearFilter = (name) => {
    setFilters(prev => ({ ...prev, [name]: '' }))
  }

  const clearAllFilters = () => {
    setFilters({ category: '', city: '', neighborhood: '', rating: '', maxPrice: '' })
  }

  const activeFilters = Object.entries(filters).filter(([_, value]) => value !== '')

  const handleAdvancedSearch = () => {
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.city) params.set('city', filters.city)
    if (filters.neighborhood) params.set('neighborhood', filters.neighborhood)
    if (filters.rating) params.set('rating', filters.rating)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    
    navigate(`/client/recherche?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-5 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        
        {/* Titre et bienvenue */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-black sm:text-4xl">Trouvez le service idéal</h1>
          <p className="mt-2 text-zinc-600">Affinez votre recherche pour trouver les meilleurs prestataires autour de vous.</p>
        </div>

        {/* Section Filtres (Comboboxes) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-[2rem] bg-white p-6 shadow-sm border border-zinc-200 lg:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <FiFilter className="text-yellow-500 text-xl" />
            <h2 className="text-lg font-bold text-black">Filtrer les résultats</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            
            {/* Par Catégorie */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Catégorie</label>
              <select 
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 focus:bg-white"
              >
                <option value="">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Par Ville */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Ville</label>
              <select 
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 focus:bg-white"
              >
                <option value="">Toutes les villes</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Par Quartier */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Quartier</label>
              <select 
                name="neighborhood"
                value={filters.neighborhood}
                onChange={handleFilterChange}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 focus:bg-white"
              >
                <option value="">Tous les quartiers</option>
                {neighborhoods.map(hood => (
                  <option key={hood} value={hood}>{hood}</option>
                ))}
              </select>
            </div>

            {/* Par Note */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Note Minimum</label>
              <select 
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 focus:bg-white"
              >
                <option value="">Toutes les notes</option>
                {ratings.map(rate => (
                  <option key={rate} value={rate}>{rate} Étoiles</option>
                ))}
              </select>
            </div>

            {/* Par Prix Max */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Prix Max (Ar)</label>
              <input 
                type="number"
                name="maxPrice"
                placeholder="Ex: 50000"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 focus:bg-white"
              />
            </div>

          </div>

          {/* Badges de filtres actifs */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-zinc-100">
              <span className="text-sm font-semibold text-zinc-500">Filtres actifs:</span>
              {activeFilters.map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 rounded-full bg-yellow-50 px-3 py-1.5 text-sm font-medium text-yellow-700 border border-yellow-200">
                  {key === 'maxPrice' ? `Max ${value} Ar` : value}
                  <button onClick={() => clearFilter(key)} className="text-yellow-600 hover:text-red-500 font-bold ml-1">×</button>
                </div>
              ))}
              <button 
                onClick={clearAllFilters} 
                className="text-sm font-semibold text-red-500 hover:text-red-600 underline ml-2 transition"
              >
                Effacer tout
              </button>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleAdvancedSearch}
              className="flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-3 text-sm font-bold text-white transition hover:bg-yellow-500 hover:scale-105 active:scale-95 shadow-md shadow-yellow-400/20"
            >
              <FiSearch />
              Rechercher
            </button>
          </div>
        </motion.div>

        {/* Section de résultats */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-black mb-6">Prestataires plus recommandés par l'IA</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.length > 0 ? (
              filteredProviders.map(provider => (
                <div 
                  key={provider.id} 
                  onClick={() => navigate(`/client/prestataire/${provider.id}`)}
                  className="rounded-[2rem] bg-white p-5 shadow-sm border border-zinc-100 hover:shadow-md transition cursor-pointer flex flex-col"
                >
                  <div className="h-40 w-full rounded-[1.5rem] bg-zinc-200 mb-4 overflow-hidden">
                    <img src={provider.img} alt={provider.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">{provider.category}</span>
                    <div className="flex items-center gap-1 text-zinc-700 text-sm">
                      <FiStar className="fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{provider.rating}</span>
                    </div>
                  </div>
                  <h4 className="mt-2 text-lg font-bold text-black">{provider.title}</h4>
                  <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{provider.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-zinc-500 font-medium">
                    <FiMapPin className="text-yellow-500" />
                    <span>{provider.neighborhood}, {provider.city}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-zinc-600 bg-zinc-50 px-3 py-1 rounded-full">{provider.sampleService}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-zinc-500">
                Aucun prestataire trouvé pour ces filtres. Essayez de modifier vos critères.
              </div>
            )}
          </div>
        </div>

        {/* Section Devenir Prestataire */}
        <div className="mt-20 bg-yellow-400 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between shadow-lg shadow-yellow-400/20 text-center md:text-left gap-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Voulez-vous devenir prestataire ?</h3>
            <p className="mt-2 text-yellow-50 font-medium">Proposez vos services sur TADIAVO-EO et augmentez vos revenus dès aujourd'hui.</p>
          </div>
          <button 
            onClick={() => navigate('/client/devenir-prestataire')}
            className="flex-shrink-0 bg-white text-yellow-500 font-bold px-8 py-4 rounded-full shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            Devenir prestataire
          </button>
        </div>

      </div>
    </div>
  )
}

export default ClientHome