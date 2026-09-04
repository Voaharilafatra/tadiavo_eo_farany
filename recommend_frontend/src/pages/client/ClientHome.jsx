import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FiSearch,
  FiFilter,
  FiMapPin,
  FiStar
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import clientExplorerService from '../../api/clientExplor.service'

function ClientHome() {
  const navigate = useNavigate()
  const API_URL = 'http://localhost:8000'
  // -----------------------------
  // Filtres
  // -----------------------------
  const [filters, setFilters] = useState({
    category_ids: [],
    service: '',
    city: '',
    neighborhood: '',
    max_price: ''
  })


  // -----------------------------
  // Données de l'explorateur
  // -----------------------------
  const [categories, setCategories] = useState([])
  const [cities, setCities] = useState([])
  const [neighborhoods, setNeighborhoods] = useState([])
  const [services, setServices] = useState([])
  const [features, setFeatures] = useState([])
  const [recommendations, setRecommendations] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // -----------------------------
  // Chargement des données
  // -----------------------------
  useEffect(() => {
    const loadExplorerData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [
          categoriesData,
          citiesData,
          neighborhoodsData,
          servicesData,
          featuresData,
          recommendationsData
        ] = await Promise.all([
          clientExplorerService.getCategories(),
          clientExplorerService.getCities(),
          clientExplorerService.getNeighborhoods(),
          clientExplorerService.getServices(),
          clientExplorerService.getFeatures(),
          clientExplorerService.getRecommendationsForMe()
        ])

        setCategories(categoriesData || [])
        setCities(citiesData || [])
        setNeighborhoods(neighborhoodsData || [])
        setServices(servicesData || [])
        setFeatures(featuresData || [])
        setRecommendations(recommendationsData || [])

      } catch (err) {
        console.error('Erreur chargement données :', err)

        setError(
          err.response?.data?.detail ||
          'Impossible de charger les données'
        )
      } finally {
        setLoading(false)
      }
    }

    loadExplorerData()
  }, [])

  // -----------------------------
  // Modification d'un filtre
  // -----------------------------
  const handleFilterChange = (e) => {
    const { name, value } = e.target

    if (name === 'category_ids') {
      setFilters((prev) => ({
        ...prev,
        category_ids: value ? [value] : []
      }))

      return
    }

    setFilters((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // -----------------------------
  // Supprimer un filtre
  // -----------------------------
  const clearFilter = (name) => {
    if (name === 'category_ids') {
      setFilters((prev) => ({
        ...prev,
        category_ids: []
      }))

      return
    }

    setFilters((prev) => ({
      ...prev,
      [name]: ''
    }))
  }

  // -----------------------------
  // Supprimer tous les filtres
  // -----------------------------
  const clearAllFilters = () => {
    setFilters({
      category_ids: [],
      service: '',
      city: '',
      neighborhood: '',
      max_price: ''
    })
  }
  // -----------------------------
  // Filtres actifs
  // -----------------------------
  const activeFilters = [
    filters.category_ids.length > 0
      ? ['category_ids', filters.category_ids[0]]
      : null,

    filters.service
      ? ['service', filters.service]
      : null,

    filters.city
      ? ['city', filters.city]
      : null,

    filters.neighborhood
      ? ['neighborhood', filters.neighborhood]
      : null,

    filters.max_price
      ? ['max_price', filters.max_price]
      : null
  ].filter(Boolean)
  // -----------------------------
  // Recherche avancée
  // -----------------------------
  const handleAdvancedSearch = () => {
    const params = new URLSearchParams()

    if (filters.category_ids.length > 0) {
      params.set(
        'category_ids',
        filters.category_ids[0]
      )
    }

    if (filters.service) {
      params.set('service', filters.service)
    }

    if (filters.city) {
      params.set('city', filters.city)
    }

    if (filters.neighborhood) {
      params.set(
        'neighborhood',
        filters.neighborhood
      )
    }

    if (filters.min_rating) {
      params.set(
        'min_rating',
        filters.min_rating
      )
    }

    if (filters.max_price) {
      params.set(
        'max_price',
        filters.max_price
      )
    }

navigate(
  `/client/recherche/criteria?${params.toString()}`
)


  }

  // -----------------------------
  // Chargement
  // -----------------------------
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-zinc-500">
          Chargement...
        </p>
      </div>
    )
  }

  // -----------------------------
  // Erreur
  // -----------------------------
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-5">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-bold text-red-500">
            Une erreur est survenue
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-black sm:text-4xl">
            Trouvez le service idéal
          </h1>

          <p className="mt-2 text-zinc-600">
            Affinez votre recherche pour trouver les meilleurs
            prestataires selon vos besoins.
          </p>
        </div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-[2rem] border gap-1 border-zinc-200 bg-white p-2 shadow-sm lg:p-4"
        >
          {/* Titre */}
          <div className="mb-6 flex items-center gap-3">
            <FiFilter className="text-xl text-yellow-500" />

            <h2 className="text-lg font-bold text-black">
              Filtrer les résultats
            </h2>
          </div>

          {/* Grille */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

            {/* Catégorie */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="category_ids"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >
                Catégorie
              </label>

              <select
                id="category_ids"
                name="category_ids"
                value={filters.category_ids[0] || ''}
                onChange={handleFilterChange}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 focus:bg-white"
              >
                <option value="">
                  Toutes les catégories
                </option>

                {categories.map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ville */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="city"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >
                Ville
              </label>

              <select
                id="city"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 focus:bg-white"
              >
                <option value="">
                  Toutes les villes
                </option>

                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Quartier */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="neighborhood"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >
                Quartier
              </label>

              <select
                id="neighborhood"
                name="neighborhood"
                value={filters.neighborhood}
                onChange={handleFilterChange}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 focus:bg-white"
              >
                <option value="">
                  Tous les quartiers
                </option>

                {neighborhoods.map((neighborhood) => (
                  <option
                    key={neighborhood}
                    value={neighborhood}
                  >
                    {neighborhood}
                  </option>
                ))}
              </select>
            </div>

            {/* Service */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="service"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >
                Service
              </label>

              <select
                id="service"
                name="service"
                value={filters.service}
                onChange={handleFilterChange}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 focus:bg-white"
              >
                <option value="">
                  Tous les services
                </option>

                {services.map((service) => (
                  <option
                    key={service}
                    value={service}
                  >
                    {service}
                  </option>
                ))}
              </select>
            </div>

            {/* Prix maximum */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="max_price"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >
                Prix maximum (Ar)
              </label>

              <input
                id="max_price"
                type="number"
                name="max_price"
                min="0"
                placeholder="Ex. 50000"
                value={filters.max_price}
                onChange={handleFilterChange}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 focus:bg-white"
              />
            </div>
          </div>

          {/* Filtres actifs */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-4">

              <span className="text-sm font-semibold text-zinc-500">
                Filtres actifs :
              </span>

              {activeFilters.map(([key, value]) => {
                const category =
                  categories.find(
                    (item) => item._id === value
                  )

                const displayedValue =
                  key === 'category_ids'
                    ? category?.name || value
                    : key === 'min_rating'
                      ? `${value} étoile${Number(value) > 1 ? 's' : ''} et plus`
                      : key === 'max_price'
                        ? `Prix max : ${value} Ar`
                        : value

                return (
                  <div
                    key={key}
                    className="flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-sm font-medium text-yellow-700"
                  >
                    <span>
                      {displayedValue}
                    </span>

                    <button
                      type="button"
                      onClick={() => clearFilter(key)}
                      className="ml-1 font-bold text-yellow-600 transition hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                )
              })}

              <button
                type="button"
                onClick={clearAllFilters}
                className="ml-2 text-sm font-semibold text-red-500 underline transition hover:text-red-600"
              >
                Effacer tout
              </button>
            </div>
          )}

          {/* Recherche */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleAdvancedSearch}
              className="flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-3 text-sm font-bold text-white shadow-md shadow-yellow-400/20 transition hover:scale-105 hover:bg-yellow-500 active:scale-95"
            >
              <FiSearch />
              Rechercher
            </button>
          </div>
        </motion.div>
        {/* Recommandations */}
        <div className="mt-12">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-black">
              Prestataires recommandés pour vous
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Découvrez les prestataires correspondant à vos recherches récentes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.length > 0 ? (
              recommendations.map((provider) => (
                <div
                  key={provider._id}
                  onClick={() =>
                    navigate(`/client/prestataire/${provider._id}`)
                  }
                  className="flex cursor-pointer flex-col rounded-[2rem] border border-zinc-100 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  {/* Image */}
                  <div className="mb-4 h-40 w-full overflow-hidden rounded-[1.5rem] bg-zinc-200">
                    {provider.images?.length > 0 ? (
                      <img
                        src={`${API_URL}${provider.images[0].url}`}
                        alt={provider.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                        Aucune image
                      </div>
                    )}
                  </div>

                  {/* Catégories + note */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {provider.categories?.map((category) => (
                        <span
                          key={category.id}
                          className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-yellow-600"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-1 text-sm text-zinc-700">
                      <FiStar className="fill-yellow-400 text-yellow-400" />

                      <span className="font-bold">
                        {provider.rating?.average ?? "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Nom */}
                  <h4 className="mt-3 text-lg font-bold text-black">
                    {provider.name}
                  </h4>

                  {/* Description */}
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                    {provider.description}
                  </p>

                  {/* Localisation */}
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-zinc-500">
                    <FiMapPin className="text-yellow-500" />

                    <span>
                      {provider.address?.neighborhood}
                      {provider.address?.neighborhood &&
                        provider.address?.municipality
                        ? ", "
                        : ""}
                      {provider.address?.municipality}
                    </span>
                  </div>

                  {/* Services */}
                  {provider.services?.length > 0 && (
                    <div className="mt-4 border-t border-zinc-100 pt-4">
                      <div className="flex flex-wrap gap-2">
                        {provider.services.slice(0, 2).map((service) => (
                          <span
                            key={service.id}
                            className="rounded-full bg-zinc-50 px-3 py-1 text-sm font-semibold text-zinc-600"
                          >
                            {service.name}
                          </span>
                        ))}

                        {provider.services.length > 2 && (
                          <span className="rounded-full bg-zinc-50 px-3 py-1 text-sm font-semibold text-zinc-400">
                            +{provider.services.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <h4 className="text-lg font-bold text-black">
                  Aucune recommandation disponible
                </h4>

                <p className="mt-2 text-sm text-zinc-500">
                  Effectuez quelques recherches pour obtenir des recommandations
                  personnalisées.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Devenir prestataire */}
        <div className="mt-20 flex flex-col items-center justify-between gap-6 rounded-3xl bg-yellow-400 p-8 text-center shadow-lg shadow-yellow-400/20 md:flex-row md:p-12 md:text-left">
          <div>
            <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
              Voulez-vous devenir prestataire ?
            </h3>

            <p className="mt-2 font-medium text-yellow-50">
              Proposez vos services sur TADIAVO-EO et développez
              votre activité dès aujourd'hui.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate('/client/devenir-prestataire')
            }
            className="flex-shrink-0 rounded-full bg-white px-8 py-4 font-bold text-yellow-500 shadow-md transition-all hover:scale-105 hover:shadow-xl active:scale-95"
          >
            Devenir prestataire
          </button>
        </div>

      </div>
    </div>
  )
}

export default ClientHome