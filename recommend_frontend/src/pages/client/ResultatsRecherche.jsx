import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  FiFilter,
  FiStar,
  FiMapPin,
  FiArrowLeft
} from 'react-icons/fi'
import { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

import clientExplorerService from '../../api/clientExplor.service'

// Correction Leaflet
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

const center = [-18.8792, 47.5079]

// Composant pour déplacer la carte
function ChangeView({ providers }) {
  const map = useMap()

  useEffect(() => {
    const validCoordinates = providers
      .filter(
        (provider) =>
          provider.location?.coordinates?.[0] != null &&
          provider.location?.coordinates?.[1] != null
      )
      .map((provider) => [
        provider.location.coordinates[1], // latitude
        provider.location.coordinates[0]  // longitude
      ])

    if (validCoordinates.length === 0) {
      map.setView([-18.8792, 47.5079], 12)
      return
    }

    // Un seul provider
    if (validCoordinates.length === 1) {
      map.setView(validCoordinates[0], 15)
      return
    }

    // Plusieurs providers :
    // on ajuste automatiquement la carte
    // pour tous les afficher
    const bounds = L.latLngBounds(validCoordinates)

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15
    })
  }, [providers, map])

  return null
}
function ResultatsRecherche({ searchMode }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hoveredProvider, setHoveredProvider] = useState(null)
  const API_URL = 'http://localhost:8000'
  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true)
        setError(null)

        let data = []

        if (searchMode === 'natural') {
          const query = searchParams.get('query') || ''

          if (!query) {
            setProviders([])
            return
          }

          data = await clientExplorerService.naturalSearch(query)

        } else {
          const categoryId =
            searchParams.get('category_ids')

          const criteria = {
            category_ids: categoryId
              ? [categoryId]
              : null,

            service:
              searchParams.get('service') || null,

            city:
              searchParams.get('city') || null,

            neighborhood:
              searchParams.get('neighborhood') || null,

            min_rating:
              searchParams.get('min_rating')
                ? Number(searchParams.get('min_rating'))
                : null,

            max_price:
              searchParams.get('max_price')
                ? Number(searchParams.get('max_price'))
                : null,
          }

          data =
            await clientExplorerService.classicSearch(
              criteria
            )
        }

        console.log('Résultats :', data)

        setProviders(data || [])

      } catch (err) {
        console.error(
          'Erreur recherche :',
          err
        )

        setError(
          err.response?.data?.detail ||
          'Impossible de récupérer les résultats.'
        )

        setProviders([])

      } finally {
        setLoading(false)
      }
    }

    loadResults()

  }, [searchMode, searchParams])
  // --------------------------------------------------
  // Paramètres de recherche
  // --------------------------------------------------

  const query = searchParams.get('query') || ''

  const categoryId = searchParams.get('category_ids') || ''

  const service = searchParams.get('service') || ''

  const city = searchParams.get('city') || ''

  const neighborhood = searchParams.get('neighborhood') || ''

  const minRating = searchParams.get('min_rating') || ''

  const maxPrice = searchParams.get('max_price') || ''

  // --------------------------------------------------
  // Résultats
  // --------------------------------------------------

  const results = providers || []

 {loading ? (
  <div className="mt-4 flex items-center gap-3">
    <div className="h-1.5 w-32 overflow-hidden rounded-full bg-zinc-200">
      <div className="h-full w-1/2 rounded-full bg-yellow-400 animate-search-loading" />
    </div>

    <span className="text-sm font-medium text-zinc-400">
      Recherche en cours...
    </span>
  </div>
) : (
  <p className="mt-4 text-zinc-500 font-semibold">
    {results.length} prestataire
    {results.length > 1 ? 's' : ''} trouvé
    {results.length > 1 ? 's' : ''}
  </p>
)}

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-zinc-50 px-5">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-black">
            Une erreur est survenue
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-5 rounded-full bg-yellow-400 px-6 py-3 font-bold text-white transition hover:bg-yellow-500"
          >
            Retour
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-73px)] overflow-hidden bg-white">

      {/* =====================================================
          COLONNE GAUCHE : LISTE
      ===================================================== */}

      <div className="w-full md:w-1/2 lg:w-[55%] h-1/2 md:h-full overflow-y-auto p-5 sm:p-8 bg-zinc-50 border-b md:border-b-0 md:border-r border-zinc-200 order-2 md:order-1">

        <div className="mb-6">

          {/* Retour */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-black mb-4 transition font-semibold text-sm"
          >
            <FiArrowLeft />
            Retour
          </button>

          {/* Titre */}
          <h1 className="text-2xl font-extrabold text-black">
            Résultats de recherche
          </h1>

          {/* Critères affichés */}
          <div className="mt-2 flex flex-wrap gap-2 text-sm">

            {/* Recherche naturelle */}
            {searchMode === 'natural' && query && (
              <span className="bg-white border border-zinc-200 px-3 py-1 rounded-full text-zinc-600">
                Recherche :
                <span className="font-bold ml-1">
                  {query}
                </span>
              </span>
            )}

            {/* Catégorie */}
            {searchMode === 'criteria' && categoryId && (
              <span className="bg-white border border-zinc-200 px-3 py-1 rounded-full text-zinc-600">
                Catégorie :
                <span className="font-bold ml-1">
                  {categoryId}
                </span>
              </span>
            )}

            {/* Service */}
            {searchMode === 'criteria' && service && (
              <span className="bg-white border border-zinc-200 px-3 py-1 rounded-full text-zinc-600">
                Service :
                <span className="font-bold ml-1">
                  {service}
                </span>
              </span>
            )}

            {/* Ville */}
            {city && (
              <span className="bg-white border border-zinc-200 px-3 py-1 rounded-full text-zinc-600">
                Ville :
                <span className="font-bold ml-1">
                  {city}
                </span>
              </span>
            )}

            {/* Quartier */}
            {neighborhood && (
              <span className="bg-white border border-zinc-200 px-3 py-1 rounded-full text-zinc-600">
                Quartier :
                <span className="font-bold ml-1">
                  {neighborhood}
                </span>
              </span>
            )}

            {/* Note */}
            {minRating && (
              <span className="bg-white border border-zinc-200 px-3 py-1 rounded-full text-zinc-600">
                Note min :
                <span className="font-bold ml-1">
                  {minRating}
                </span>
              </span>
            )}

            {/* Prix */}
            {maxPrice && (
              <span className="bg-white border border-zinc-200 px-3 py-1 rounded-full text-zinc-600">
                Prix max :
                <span className="font-bold ml-1">
                  {maxPrice} Ar
                </span>
              </span>
            )}

          </div>

          {/* Nombre de résultats */}
          <p className="mt-4 text-zinc-500 font-semibold">
            {results.length} prestataire
            {results.length > 1 ? 's' : ''} trouvé
            {results.length > 1 ? 's' : ''}
          </p>

        </div>

        {/* =====================================================
            LISTE DES PROVIDERS
        ===================================================== */}

        <div className="flex flex-col gap-6">

          {results.length > 0 ? (

            results.map((provider) => {

              const imageUrl =
                provider.images?.[0]?.url
                  ? `http://localhost:8000${provider.images[0].url}`
                  : null

              const categories =
                provider.categories || []

              const coordinates =
                provider.location?.coordinates || []

              const longitude =
                coordinates[0]

              const latitude =
                coordinates[1]

              return (
                <div
                  key={provider._id}
                  onClick={() =>
                    navigate(
                      `/client/prestataire/${provider._id}`
                    )
                  }
                  onMouseEnter={() =>
                    setHoveredProvider(provider._id)
                  }
                  onMouseLeave={() =>
                    setHoveredProvider(null)
                  }
                  className="flex flex-col sm:flex-row bg-white rounded-3xl p-4 shadow-sm border border-zinc-100 hover:shadow-md transition cursor-pointer gap-4 group"
                >

                  {/* Image */}
                  <div className="w-full sm:w-48 h-36 rounded-2xl bg-zinc-200 overflow-hidden flex-shrink-0">

                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={provider.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
                        Aucune image
                      </div>
                    )}

                  </div>

                  {/* Informations */}
                  <div className="flex-1 flex flex-col justify-between py-1">

                    <div>

                      {/* Catégories + note */}
                      <div className="flex justify-between items-start mb-1 gap-3">

                        <div className="flex flex-wrap gap-2">

                          {categories.map((category) => (
                            <span
                              key={category.id}
                              className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-md uppercase tracking-wider"
                            >
                              {category.name}
                            </span>
                          ))}

                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 bg-zinc-50 px-2 py-1 rounded-full border border-zinc-100 flex-shrink-0">

                          <FiStar className="fill-yellow-400 text-yellow-400 text-sm" />

                          <span className="font-bold text-sm text-black">
                            {provider.rating?.average ?? 'N/A'}
                          </span>

                        </div>

                      </div>

                      {/* Nom */}
                      <h3 className="text-lg font-bold text-black mt-2 leading-tight group-hover:text-yellow-600 transition-colors">
                        {provider.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                        {provider.description}
                      </p>

                    </div>

                    {/* Bas de carte */}
                    <div className="mt-3 flex items-center justify-between text-sm gap-3">

                      {/* Localisation */}
                      <div className="flex items-center gap-1.5 text-zinc-600 font-medium">

                        <FiMapPin className="text-yellow-500" />

                        <span>
                          {provider.address?.neighborhood}

                          {provider.address?.neighborhood &&
                            provider.address?.municipality
                            ? ', '
                            : ''}

                          {provider.address?.municipality}
                        </span>

                      </div>

                      {/* Premier service */}
                      {provider.services?.length > 0 && (
                        <span className="text-xs font-semibold bg-zinc-100 text-zinc-600 px-3 py-1.5 rounded-full">
                          {provider.services[0].name}
                        </span>
                      )}

                    </div>

                  </div>

                </div>
              )
            })

          ) : (

            <div className="text-center py-20 bg-white rounded-3xl border border-zinc-200">

              <p className="text-zinc-500 text-lg">
                Aucun résultat trouvé pour votre recherche.
              </p>

            </div>

          )}

        </div>

      </div>

      {/* =====================================================
          COLONNE DROITE : CARTE
      ===================================================== */}

      <div className="w-full md:w-1/2 lg:w-[45%] h-1/2 md:h-full relative bg-zinc-100 z-0 order-1 md:order-2">

        <MapContainer
          center={center}
          zoom={12}
          style={{
            height: '100%',
            width: '100%'
          }}
        >
          <ChangeView providers={results} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {results.map((provider) => {

            const coordinates =
              provider.location?.coordinates || []

            const longitude =
              coordinates[0]

            const latitude =
              coordinates[1]

            // Ne pas créer de Marker si les coordonnées
            // sont absentes ou invalides
            if (
              latitude === undefined ||
              longitude === undefined
            ) {
              return null
            }

            const imageUrl =
              provider.images?.[0]?.url
                ? `http://localhost:8000${provider.images[0].url}`
                : null

            return (
              <Marker
                key={provider._id}
                position={[
                  latitude,
                  longitude
                ]}
                eventHandlers={{
                  mouseover: (e) => {
                    e.target.openPopup()
                    setHoveredProvider(provider._id)
                  },

                  mouseout: (e) => {
                    e.target.closePopup()
                    setHoveredProvider(null)
                  },

                  click: () =>
                    navigate(
                      `/client/prestataire/${provider._id}`
                    )
                }}
              >

                <Popup
                  closeButton={false}
                  className="custom-popup"
                >

                  <div
                    className="p-1 w-40 cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/client/prestataire/${provider._id}`
                      )
                    }
                  >

                    {/* Image */}
                    <div className="w-full h-20 rounded-lg overflow-hidden mb-2">

                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={provider.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-xs text-zinc-400">
                          Pas d'image
                        </div>
                      )}

                    </div>

                    {/* Nom */}
                    <h4 className="font-bold text-black text-sm leading-tight line-clamp-1">
                      {provider.name}
                    </h4>

                    {/* Catégorie + note */}
                    <div className="flex items-center justify-between mt-1">

                      <span className="text-xs text-zinc-500">
                        {provider.categories?.[0]?.name ||
                          'Non catégorisé'}
                      </span>

                      <div className="flex items-center gap-1 text-xs text-yellow-600 font-bold">

                        <FiStar className="fill-yellow-400 text-yellow-400" />

                        {provider.rating?.average ?? 'N/A'}

                      </div>

                    </div>

                  </div>

                </Popup>

              </Marker>
            )
          })}

        </MapContainer>

      </div>

    </div>
  )
}

export default ResultatsRecherche
