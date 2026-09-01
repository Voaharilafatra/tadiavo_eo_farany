import { useParams, Link } from 'react-router-dom'
import { FiMapPin, FiStar, FiClock, FiPhone, FiMail, FiCheck, FiArrowLeft, FiNavigation } from 'react-icons/fi'
import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

function ProviderInfo() {
  const { id } = useParams()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [showRoute, setShowRoute] = useState(false)
  const [travelMode, setTravelMode] = useState('DRIVING')
  const [myReview, setMyReview] = useState({ rating: 4, text: "Très bon travail, je recommande !" })

  // Simulation position utilisateur (Ex: Analakely)
  const userLocation = { lat: -18.9000, lng: 47.5200 }

  // Données factices basées sur le modèle JSON demandé
  const provider = {
    id: id,
    name: "Plombier Express 24/7",
    category_ids: ["Plomberie", "Dépannage"],
    description: "Expert en plomberie avec plus de 10 ans d'expérience. Intervention rapide et travail de qualité garanti pour tous vos besoins en installation et réparation.",
    rating: 4.5,
    reviewsCount: 24,
    img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=80',
    services: [
      {
        name: "Réparation fuite d'eau",
        description: "Recherche et réparation de fuites sur tuyauterie apparente ou encastrée.",
        price: { avg: 45000, currency: "MGA" },
        rating: 4.6,
        reviewsCount: 12
      },
      {
        name: "Installation chauffe-eau",
        description: "Pose complète avec raccordement électrique et eau.",
        price: { avg: 150000, currency: "MGA" },
        rating: 4.9,
        reviewsCount: 5
      }
    ],
    address: {
      municipality: "Antananarivo",
      neighborhood: "Ambohijatovo",
      description: "Près de l'ancien marché"
    },
    location: {
      lat: -18.9100,
      lng: 47.5250
    },
    opening_hours: {
      lundi: { open: "08:00", close: "17:00" },
      mardi: { open: "08:00", close: "17:00" },
      mercredi: { open: "08:00", close: "17:00" }
    },
    contact: {
      phone: "+261 34 00 000 00",
      email: "contact@plombierexpress.mg"
    },
    features: ["Devis gratuit", "Intervention d'urgence", "Garantie 1 an"]
  }

  const calculateRoute = () => {
    // Avec Leaflet, calculer un itinéraire réel nécessite un plugin comme leaflet-routing-machine
    // Pour la démo, on simule juste l'affichage d'une ligne droite entre les deux points.
    setShowRoute(true)
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* Header Image */}
      <div className="relative h-64 md:h-80 w-full bg-zinc-800">
        <img src={provider.img} alt={provider.name} className="w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full px-5 py-6 sm:px-8 lg:px-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Link to="/client" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition">
                <FiArrowLeft /> Retour à l'accueil
              </Link>
              <div className="flex items-center gap-2 mb-2">
                {provider.category_ids.map(cat => (
                  <span key={cat} className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                    {cat}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white">{provider.name}</h1>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="text-yellow-400 text-2xl flex"><FiStar className="fill-yellow-400" /></div>
              <div className="text-white">
                <p className="text-xl font-bold">{provider.rating} <span className="text-sm font-normal text-white/70">/ 5</span></p>
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
              <h2 className="text-xl font-bold text-black mb-6">Services proposés</h2>
              <div className="space-y-4">
                {provider.services.map((service, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-100 bg-zinc-50 hover:bg-yellow-50/50 transition">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-black">{service.name}</h3>
                        <div className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                          <FiStar className="fill-yellow-500 text-yellow-500" />
                          {service.rating} <span className="text-yellow-700/60 font-medium">({service.reviewsCount})</span>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-500 mt-1">{service.description}</p>
                    </div>
                    <div className="whitespace-nowrap sm:text-right">
                      <p className="text-xs text-zinc-400 uppercase font-semibold">Prix moyen</p>
                      <p className="font-bold text-black text-lg">{service.price.avg.toLocaleString()} {service.price.currency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Avis et commentaires */}
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-200">
              <h2 className="text-xl font-bold text-black mb-6">Mon Avis</h2>
              
              {myReview ? (
                <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 mb-6 relative">
                  <div className="flex gap-2 text-yellow-400 mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <FiStar key={star} className={star <= myReview.rating ? "fill-yellow-400" : "text-zinc-300"} />
                    ))}
                  </div>
                  <p className="text-zinc-700 italic">"{myReview.text}"</p>
                  <button 
                    onClick={() => {
                      if (window.confirm("Voulez-vous vraiment supprimer votre avis ?")) {
                        setMyReview(null);
                      }
                    }}
                    className="absolute top-4 right-4 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition"
                  >
                    Supprimer
                  </button>
                </div>
              ) : (
                <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                  <div className="flex gap-2 text-zinc-300 mb-4 text-2xl">
                    {[1, 2, 3, 4, 5].map(star => (
                      <FiStar 
                        key={star} 
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className={`cursor-pointer transition ${
                          (hoverRating || rating) >= star 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "hover:text-yellow-400"
                        }`} 
                      />
                    ))}
                  </div>
                  <textarea 
                    rows="3" 
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Partagez votre expérience avec ce prestataire..."
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 mb-4"
                  ></textarea>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        setRating(0);
                        setHoverRating(0);
                        setReviewText('');
                      }}
                      className="bg-zinc-200 text-zinc-600 font-bold py-2.5 px-6 rounded-full hover:bg-zinc-300 transition"
                    >
                      Annuler
                    </button>
                    <button 
                      onClick={() => {
                        if (rating === 0) alert("Veuillez sélectionner une note (étoiles) !");
                        else {
                          setMyReview({ rating, text: reviewText });
                          setRating(0);
                          setReviewText('');
                        }
                      }}
                      className="bg-black text-white font-bold py-2.5 px-6 rounded-full hover:bg-zinc-800 transition"
                    >
                      Publier l'avis
                    </button>
                  </div>
                </div>
              )}
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
                  <a href={`tel:${provider.contact.phone}`} className="font-bold text-black hover:text-yellow-500 transition">{provider.contact.phone}</a>
                </li>
                <li className="flex items-center gap-3">
                  <FiMail className="text-yellow-500 text-lg flex-shrink-0" />
                  <a href={`mailto:${provider.contact.email}`} className="font-bold text-black hover:text-yellow-500 transition">{provider.contact.email}</a>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-zinc-100">
                <h4 className="flex items-center gap-2 font-bold text-black mb-4">
                  <FiClock className="text-yellow-500" /> Horaires d'ouverture
                </h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(provider.opening_hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="text-zinc-500 capitalize">{day}</span>
                      <span className="font-semibold text-black">{hours.open} - {hours.close}</span>
                    </div>
                  ))}
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
                <MapContainer center={[provider.location.lat, provider.location.lng]} zoom={14} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Marqueur du prestataire */}
                  <Marker position={[provider.location.lat, provider.location.lng]}>
                    <Popup>{provider.name}</Popup>
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