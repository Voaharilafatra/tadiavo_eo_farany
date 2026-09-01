import { useSearchParams, useNavigate } from 'react-router-dom'
import { FiFilter, FiStar, FiMapPin, FiArrowLeft } from 'react-icons/fi'
import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Correction des icônes Leaflet par défaut qui ne chargent pas bien avec Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

const center = [-18.8792, 47.5079] // Antananarivo

const mockProviders = [
  { 
    id: 1, 
    title: 'Nettoyage complet à domicile', 
    description: 'Service rapide et professionnel pour votre maison.',
    category: 'Ménage', 
    city: 'Antananarivo', 
    neighborhood: 'Ivandry', 
    rating: 4.8, 
    sampleService: 'Nettoyage T2/T3',
    img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    lat: -18.8680, lng: 47.5300
  },
  { 
    id: 2, 
    title: 'Plombier Express 24/7', 
    description: 'Dépannage rapide pour fuites et installations.',
    category: 'Plomberie', 
    city: 'Antananarivo', 
    neighborhood: 'Ambohijatovo', 
    rating: 4.5, 
    sampleService: "Réparation fuite d'eau",
    img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80',
    lat: -18.9100, lng: 47.5250
  },
  { 
    id: 3, 
    title: 'Jardinier Pro', 
    description: 'Entretien de jardins, taille de haies, et tonte.',
    category: 'Jardinage', 
    city: 'Toamasina', 
    neighborhood: 'Ambohijatovo', 
    rating: 5.0, 
    sampleService: 'Tonte de pelouse',
    img: 'https://images.unsplash.com/photo-1416879598555-5271887e2de1?auto=format&fit=crop&w=800&q=80',
    lat: -18.1500, lng: 49.4000
  },
  { 
    id: 4, 
    title: 'Électricien Bâtiment', 
    description: 'Rénovation électrique, diagnostic et dépannage.',
    category: 'Électricité', 
    city: 'Fianarantsoa', 
    neighborhood: 'Centre', 
    rating: 3.5, 
    sampleService: 'Diagnostic électrique',
    img: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
    lat: -21.4500, lng: 47.0800
  },
]

// Composant pour recalculer le centre de la carte dynamiquement
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

function ResultatsRecherche() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [hoveredProvider, setHoveredProvider] = useState(null)
  
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category')
  const city = searchParams.get('city')

  // Filtrage simple pour la démo
  const results = mockProviders.filter(p => {
    let match = true
    if (q && !p.title.toLowerCase().includes(q.toLowerCase()) && !p.category.toLowerCase().includes(q.toLowerCase())) match = false
    if (category && p.category !== category) match = false
    if (city && p.city !== city) match = false
    return match
  })
  
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-73px)] overflow-hidden bg-white">
      
      {/* Colonne de Gauche : Liste des résultats */}
      <div className="w-full md:w-1/2 lg:w-[55%] h-1/2 md:h-full overflow-y-auto p-5 sm:p-8 bg-zinc-50 border-b md:border-b-0 md:border-r border-zinc-200 order-2 md:order-1">
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-zinc-500 hover:text-black mb-4 transition font-semibold text-sm">
            <FiArrowLeft /> Retour
          </button>
          <h1 className="text-2xl font-extrabold text-black">Résultats de recherche</h1>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            {q && <span className="bg-white border border-zinc-200 px-3 py-1 rounded-full text-zinc-600">Recherche: <span className="font-bold">{q}</span></span>}
            {category && <span className="bg-white border border-zinc-200 px-3 py-1 rounded-full text-zinc-600">Catégorie: <span className="font-bold">{category}</span></span>}
            {city && <span className="bg-white border border-zinc-200 px-3 py-1 rounded-full text-zinc-600">Ville: <span className="font-bold">{city}</span></span>}
          </div>
          <p className="mt-4 text-zinc-500 font-semibold">{results.length} prestataire(s) trouvé(s)</p>
        </div>

        <div className="flex flex-col gap-6">
          {results.length > 0 ? (
            results.map(provider => (
              <div 
                key={provider.id} 
                onClick={() => navigate(`/client/prestataire/${provider.id}`)}
                onMouseEnter={() => setHoveredProvider(provider.id)}
                onMouseLeave={() => setHoveredProvider(null)}
                className="flex flex-col sm:flex-row bg-white rounded-3xl p-4 shadow-sm border border-zinc-100 hover:shadow-md transition cursor-pointer gap-4 group"
              >
                <div className="w-full sm:w-48 h-36 rounded-2xl bg-zinc-200 overflow-hidden flex-shrink-0">
                  <img src={provider.img} alt={provider.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-md uppercase tracking-wider">{provider.category}</span>
                      <div className="flex items-center gap-1 bg-zinc-50 px-2 py-1 rounded-full border border-zinc-100">
                        <FiStar className="fill-yellow-400 text-yellow-400 text-sm" />
                        <span className="font-bold text-sm text-black">{provider.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-black mt-2 leading-tight group-hover:text-yellow-600 transition-colors">{provider.title}</h3>
                    <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{provider.description}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-zinc-600 font-medium">
                      <FiMapPin className="text-yellow-500" />
                      {provider.neighborhood}, {provider.city}
                    </div>
                    <span className="text-xs font-semibold bg-zinc-100 text-zinc-600 px-3 py-1.5 rounded-full">{provider.sampleService}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-zinc-200">
              <p className="text-zinc-500 text-lg">Aucun résultat trouvé pour votre recherche.</p>
            </div>
          )}
        </div>
      </div>

      {/* Colonne de Droite : Carte Interactive Leaflet */}
      <div className="w-full md:w-1/2 lg:w-[45%] h-1/2 md:h-full relative bg-zinc-100 z-0 order-1 md:order-2">
        <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
          <ChangeView center={center} zoom={12} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {results.map(provider => (
            <Marker 
              key={provider.id} 
              position={[provider.lat, provider.lng]}
              eventHandlers={{
                mouseover: (e) => {
                  e.target.openPopup();
                  setHoveredProvider(provider.id);
                },
                mouseout: (e) => {
                  e.target.closePopup();
                  setHoveredProvider(null);
                },
                click: () => navigate(`/client/prestataire/${provider.id}`)
              }}
            >
              <Popup closeButton={false} className="custom-popup">
                <div className="p-1 w-40 cursor-pointer" onClick={() => navigate(`/client/prestataire/${provider.id}`)}>
                  <div className="w-full h-20 rounded-lg overflow-hidden mb-2">
                    <img src={provider.img} alt="" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-bold text-black text-sm leading-tight line-clamp-1">{provider.title}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-zinc-500">{provider.category}</span>
                    <div className="flex items-center gap-1 text-xs text-yellow-600 font-bold">
                      <FiStar className="fill-yellow-400 text-yellow-400" />
                      {provider.rating}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

    </div>
  )
}

export default ResultatsRecherche
