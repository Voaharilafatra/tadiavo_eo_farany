import { useParams, Link } from 'react-router-dom'
import {
  FiMapPin,
  FiStar,
  FiClock,
  FiPhone,
  FiMail,
  FiCheck,
  FiArrowLeft,
  FiNavigation
} from 'react-icons/fi'
import { useState, useEffect } from 'react'

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

import globalClientService from '../../api/infoGlobalPrestataire'

// --------------------------------------------------
// Configuration Leaflet
// --------------------------------------------------

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

// --------------------------------------------------
// Composant
// --------------------------------------------------

function ProviderInfo() {
  const { id } = useParams()

  // -----------------------------
  // États
  // -----------------------------

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState('')

  const [showRoute, setShowRoute] = useState(false)
  const [travelMode, setTravelMode] = useState('DRIVING')

  const [provider, setProvider] = useState(null)
  const [reviews, setReviews] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // -----------------------------
  // Position utilisateur
  // -----------------------------

  // Simulation pour le moment
  const userLocation = {
    lat: -18.9000,
    lng: 47.5200
  }

  // -----------------------------
  // Chargement du provider
  // -----------------------------

  useEffect(() => {
    const loadProvider = async () => {
      try {
        setLoading(true)
        setError(null)

        const [
          providerData,
          reviewsData
        ] = await Promise.all([
          globalClientService.getOnePrestataire(id),
          globalClientService.getPrestataireReviews(id)
        ])

        setProvider(providerData)
        setReviews(reviewsData || [])

        // Enregistrer la visite
        try {
          await globalClientService.registerView(id)
        } catch (viewError) {
          console.error(
            'Erreur lors de l’enregistrement de la vue :',
            viewError
          )
        }

      } catch (err) {
        console.error(
          'Erreur chargement prestataire :',
          err
        )

        setError(
          err.response?.data?.detail ||
          'Impossible de charger ce prestataire.'
        )

      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadProvider()
    }
  }, [id])

  // -----------------------------
  // Informations calculées
  // -----------------------------

  const API_URL = 'http://localhost:8000'

  const providerImage =
    provider?.images?.[0]?.url
      ? `${API_URL}${provider.images[0].url}`
      : null

  // MongoDB GeoJSON :
  // coordinates = [longitude, latitude]
  const providerLongitude =
    provider?.location?.coordinates?.[0]

  const providerLatitude =
    provider?.location?.coordinates?.[1]

  // -----------------------------
  // Itinéraire
  // -----------------------------

  const calculateRoute = () => {
    setShowRoute(true)
  }

  // -----------------------------
  // Créer un avis
  // -----------------------------

  const handleCreateReview = async () => {
    if (rating === 0 && !reviewText.trim()) {
      alert(
        'Veuillez donner une note ou écrire un commentaire.'
      )
      return
    }

    try {
      const reviewData = {}

      if (rating > 0) {
        reviewData.rating = rating
      }

      if (reviewText.trim()) {
        reviewData.comment = reviewText.trim()
      }

      const newReview =
        await globalClientService.createReview(
          id,
          reviewData
        )

      setReviews((prev) => [
        newReview,
        ...prev
      ])

      setRating(0)
      setHoverRating(0)
      setReviewText('')

      // Recharger le provider pour mettre à jour
      // la note moyenne
      const updatedProvider =
        await globalClientService.getOnePrestataire(id)

      setProvider(updatedProvider)

    } catch (err) {
      console.error(
        'Erreur création avis :',
        err
      )

      alert(
        err.response?.data?.detail ||
        "Impossible de publier l'avis."
      )
    }
  }

  // -----------------------------
  // Supprimer un avis
  // -----------------------------

  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm(
      'Voulez-vous vraiment supprimer votre avis ?'
    )

    if (!confirmed) {
      return
    }

    try {
      await globalClientService.deleteReview(reviewId)

      setReviews((prev) =>
        prev.filter(
          (review) => review.id !== reviewId
        )
      )

      // Recharger le provider pour mettre à jour
      // la note moyenne
      const updatedProvider =
        await globalClientService.getOnePrestataire(id)

      setProvider(updatedProvider)

    } catch (err) {
      console.error(
        'Erreur suppression avis :',
        err
      )

      alert(
        err.response?.data?.detail ||
        "Impossible de supprimer l'avis."
      )
    }
  }

  // -----------------------------
  // Chargement
  // -----------------------------

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-zinc-500">
          Chargement du prestataire...
        </p>
      </div>
    )
  }

  // -----------------------------
  // Erreur / provider absent
  // -----------------------------

  if (error || !provider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-5">
        <div className="text-center">

          <h2 className="text-xl font-bold text-black">
            Prestataire introuvable
          </h2>

          <p className="mt-2 text-zinc-500">
            {error || 'Ce prestataire n’existe pas.'}
          </p>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="mt-5 rounded-full bg-yellow-400 px-6 py-3 font-bold text-white"
          >
            Retour
          </button>

        </div>
      </div>
    )
  }

  // -----------------------------
  // Coordonnées invalides
  // -----------------------------

  if (
    providerLatitude == null ||
    providerLongitude == null
  ) {
    console.warn(
      'Le provider ne possède pas de coordonnées GPS.'
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* Header Image */}
      <div className="relative h-64 md:h-80 w-full bg-zinc-800">
        {providerImage ? (
          <img
            src={providerImage}
            alt={provider.name}
            className="w-full h-full object-cover opacity-70"
          />
        ) : (
          <div className="w-full h-full bg-zinc-700 flex items-center justify-center text-white">
            Aucune image
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full px-5 py-6 sm:px-8 lg:px-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Link to="/client" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition">
                <FiArrowLeft /> Retour à l'accueil
              </Link>
              <div className="flex items-center gap-2 mb-2">
                {provider.categories?.map((category) => (
                  <span
                    key={category.id}
                    className="bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white">{provider.name}</h1>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="text-yellow-400 text-2xl flex"><FiStar className="fill-yellow-400" /></div>
              <div className="text-white">
                <p className="text-xl font-bold">
                  {provider.rating?.average ?? 0}
                  <span className="text-sm font-normal text-white/70">
                    / 5
                  </span>
                </p>

                <p className="text-xs text-white/70">
                  {provider.rating?.count ?? 0} avis
                </p>
                <p className="text-xs text-white/70">{provider.reviewsCount} avis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Colonne Principale (Infos, Services, Avis) */}
          <div className="lg:col-span-2 space-y-10">

            {/* Description */}
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-200">
              <h2 className="text-xl font-bold text-black mb-4">À propos</h2>
              <p className="text-zinc-600 leading-relaxed">{provider.description}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {provider.features.map(feature => (
                  <div key={feature} className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 rounded-full px-4 py-2 text-sm font-medium text-zinc-700">
                    <FiCheck className="text-green-500" /> {feature}
                  </div>
                ))}
              </div>
            </section>

            {/* Services proposés */}
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-200">
              <h2 className="text-xl font-bold text-black mb-6">
                Services proposés
              </h2>

              <div className="space-y-4">
                {provider.services?.length > 0 ? (
                  provider.services.map((service) => (
                    <div
                      key={service.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-100 bg-zinc-50 hover:bg-yellow-50/50 transition"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-black">
                            {service.name}
                          </h3>

                          <div className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                            <FiStar className="fill-yellow-500 text-yellow-500" />

                            {service.rating?.average ?? 0}

                            <span className="text-yellow-700/60 font-medium">
                              ({service.rating?.count ?? 0})
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-zinc-500 mt-1">
                          {service.description}
                        </p>
                      </div>

                      <div className="whitespace-nowrap sm:text-right">
                        <p className="text-xs text-zinc-400 uppercase font-semibold">
                          Prix moyen
                        </p>

                        <p className="font-bold text-black text-lg">
                          {service.price?.avg?.toLocaleString() ?? 0}{' '}
                          {service.price?.currency ?? 'MGA'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">
                    Aucun service disponible.
                  </p>
                )}
              </div>
            </section>
            {/* Avis et commentaires */}
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-200">

  {/* =====================================================
      TITRE
  ===================================================== */}
  <h2 className="text-xl font-bold text-black mb-6">
    Avis et commentaires
  </h2>


  {/* =====================================================
      FORMULAIRE AJOUTER UN AVIS
  ===================================================== */}
  <div className="mb-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">

    <h3 className="text-lg font-bold text-black mb-4">
      Donnez votre avis
    </h3>

    {/* Note */}
    <div className="mb-4">

      <p className="text-sm font-semibold text-zinc-600 mb-2">
        Votre note
      </p>

      <div className="flex gap-2 text-2xl">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            className={`cursor-pointer transition ${
              (hoverRating || rating) >= star
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-zinc-300 hover:text-yellow-400'
            }`}
          />
        ))}
      </div>

    

    </div>


    {/* Commentaire */}
    <div className="mb-4">

      <label
        htmlFor="review-comment"
        className="text-sm font-semibold text-zinc-600"
      >
        Votre commentaire
      </label>

      <textarea
        id="review-comment"
        rows="4"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Partagez votre expérience avec ce prestataire..."
        className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
      />

    </div>


    {/* Boutons */}
    <div className="flex flex-wrap gap-3">

      <button
        type="button"
        onClick={() => {
          setRating(0)
          setHoverRating(0)
          setReviewText('')
        }}
        className="rounded-full bg-zinc-200 px-6 py-2.5 text-sm font-bold text-zinc-600 transition hover:bg-zinc-300"
      >
        Annuler
      </button>

      <button
        type="button"
        onClick={handleCreateReview}
        disabled={rating === 0 && !reviewText.trim()}
        className="rounded-full bg-yellow-400 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Publier mon avis
      </button>

    </div>

  </div>


  {/* =====================================================
      LISTE DES AVIS
  ===================================================== */}

  <div>

    <div className="mb-4 flex items-center justify-between">

      <h3 className="text-lg font-bold text-black">
        Avis des clients
      </h3>

      <span className="text-sm text-zinc-500">
        {reviews.length} avis
      </span>

    </div>


    {reviews.length > 0 ? (

      <div className="space-y-4">

        {reviews.map((review) => (

          <div
            key={review.id}
            className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6"
          >

            {/* En-tête avis */}
            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-3">

                {/* Avatar */}
                {review.user?.picture ? (
                  <img
                    src={review.user.picture}
                    alt={review.user.name || 'Utilisateur'}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 font-bold text-yellow-700">
                    {(review.user?.name || 'U')
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <div>

                  <p className="font-bold text-black">
                    {review.user?.name || 'Utilisateur'}
                  </p>

                  {/* Étoiles */}
                  <div className="mt-1 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={
                          star <= (review.rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-zinc-300'
                        }
                      />
                    ))}
                  </div>

                </div>

              </div>


              {/* Date */}
              <span className="text-xs text-zinc-400">
                {review.created_at
                  ? new Date(
                      review.created_at
                    ).toLocaleDateString('fr-FR')
                  : ''}
              </span>

            </div>


            {/* Commentaire */}
            {review.comment && (
              <p className="mt-4 text-sm leading-relaxed text-zinc-700">
                "{review.comment}"
              </p>
            )}


            {/* Suppression */}
            {review.is_mine && (
              <div className="mt-4">

                <button
                  type="button"
                  onClick={() =>
                    handleDeleteReview(review.id)
                  }
                  className="rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-500 transition hover:bg-red-100"
                >
                  Supprimer mon avis
                </button>

              </div>
            )}

          </div>

        ))}

      </div>

    ) : (

      <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 py-10 text-center">

        <p className="text-zinc-500">
          Aucun avis pour le moment.
        </p>

        <p className="mt-1 text-sm text-zinc-400">
          Soyez le premier à partager votre expérience.
        </p>

      </div>

    )}

  </div>

</section>
          </div>

          {/* Colonne Latérale (Contact, Horaires, Map) */}
          <div className="space-y-8">

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-200">
              <h3 className="font-bold text-black mb-6">Informations pratiques</h3>

              <ul className="space-y-5 text-sm">
                <li className="flex items-start gap-3">
                  <FiMapPin className="text-yellow-500 mt-1 text-lg flex-shrink-0" />
                  <div>
                    <p className="font-bold text-black">{provider.address.neighborhood}, {provider.address.municipality}</p>
                    <p className="text-zinc-500">{provider.address.description}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <FiPhone className="text-yellow-500 text-lg flex-shrink-0" />
                  <a
                    href={`tel:${provider.contact?.phone}`}
                    className="font-bold text-black hover:text-yellow-500 transition"
                  >
                    {provider.contact?.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <FiMail className="text-yellow-500 text-lg flex-shrink-0" />
                  <a
                    href={`mailto:${provider.contact?.email}`}
                    className="font-bold text-black hover:text-yellow-500 transition"
                  >
                    {provider.contact?.email}
                  </a>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-zinc-100">
                <h4 className="flex items-center gap-2 font-bold text-black mb-4">
                  <FiClock className="text-yellow-500" /> Horaires d'ouverture
                </h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(provider.opening_hours || {}).map(
                    ([day, hours]) => (
                      <div
                        key={day}
                        className="flex justify-between"
                      >
                        <span className="text-zinc-500 capitalize">
                          {day}
                        </span>

                        <span className="font-semibold text-black">
                          {hours.open} - {hours.close}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Carte Interactive Leaflet */}
            <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-zinc-200">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-bold text-black flex items-center gap-2">
                  <FiNavigation className="text-yellow-500" /> Itinéraire
                </h3>
                <select
                  value={travelMode}
                  onChange={(e) => {
                    setTravelMode(e.target.value)
                    setShowRoute(false)
                  }}
                  className="bg-zinc-50 border border-zinc-200 text-sm rounded-lg px-2 py-1 outline-none"
                >
                  <option value="DRIVING">Voiture</option>
                  <option value="WALKING">À pied</option>
                  <option value="BICYCLING">Vélo</option>
                </select>
              </div>

              <div className="h-64 rounded-2xl overflow-hidden relative z-0">
                <MapContainer
                  center={[
                    providerLatitude,
                    providerLongitude
                  ]}
                  zoom={14}
                  style={{
                    height: '100%',
                    width: '100%'
                  }}
                >

                  <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Marqueur du prestataire */}
                  <Marker
                    position={[
                      providerLatitude,
                      providerLongitude
                    ]}
                  >
                    <Popup>
                      {provider.name}
                    </Popup>
                  </Marker>

                  {/* Marqueur de l'utilisateur (si itinéraire activé) */}
                  {showRoute && (
                    <>
                      <Marker position={[userLocation.lat, userLocation.lng]}>
                        <Popup>Votre position</Popup>
                      </Marker>
                      {/* Tracé de l'itinéraire (Ligne simple pour la démo) */}
                      <Polyline
                        positions={[
                          [userLocation.lat, userLocation.lng],
                          [provider.location.lat, provider.location.lng]
                        ]}
                        color="blue"
                        weight={4}
                        dashArray={travelMode === 'WALKING' ? "5, 10" : ""}
                      />
                    </>
                  )}
                </MapContainer>

                {!showRoute && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
                    <button
                      onClick={calculateRoute}
                      className="bg-yellow-400 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:scale-105 active:scale-95 transition"
                    >
                      Voir l'itinéraire
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ProviderInfo