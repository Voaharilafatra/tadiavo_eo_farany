import { useState } from 'react'
import { FiEye, FiStar, FiMessageSquare, FiTrendingUp, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock Data
const viewsData = [
  { name: '1', views: 12 }, { name: '5', views: 19 }, { name: '10', views: 15 },
  { name: '15', views: 22 }, { name: '20', views: 30 }, { name: '25', views: 28 },
  { name: '30', views: 45 },
]

const recentReviews = [
  { id: 1, user: 'Alice', rating: 5, text: 'Très bon travail, rapide et efficace.' },
  { id: 2, user: 'Marc', rating: 4, text: 'Bon plombier mais est arrivé avec 10 min de retard.' },
]

function HomePrestataire() {
  const [services, setServices] = useState([
    { 
      id: 1, 
      name: "Réparation fuite d'eau", 
      description: "Recherche et réparation de fuites encastrées.",
      price: { avg: 45000, currency: "MGA" } 
    },
    { 
      id: 2, 
      name: "Installation chauffe-eau", 
      description: "Pose et raccordement électrique complet.",
      price: { avg: 150000, currency: "MGA" } 
    },
  ])
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false)
  const [editingServiceId, setEditingServiceId] = useState(null)
  const [newService, setNewService] = useState({ name: '', description: '', price: '' })

  const openAddModal = () => {
    setEditingServiceId(null)
    setNewService({ name: '', description: '', price: '' })
    setIsModalOpen(true)
  }

  const openEditModal = (service) => {
    setEditingServiceId(service.id)
    setNewService({ 
      name: service.name, 
      description: service.description, 
      price: service.price.avg.toString() 
    })
    setIsModalOpen(true)
  }

  const handleSaveService = (e) => {
    e.preventDefault()
    if (newService.name && newService.price) {
      if (editingServiceId) {
        // Mode modification
        setServices(services.map(s => 
          s.id === editingServiceId 
            ? { 
                ...s, 
                name: newService.name, 
                description: newService.description,
                price: { avg: parseInt(newService.price), currency: "MGA" } 
              } 
            : s
        ))
      } else {
        // Mode ajout
        setServices([...services, { 
          id: Date.now(), 
          name: newService.name, 
          description: newService.description,
          price: { avg: parseInt(newService.price), currency: "MGA" } 
        }])
      }
      setIsModalOpen(false)
    }
  }

  const handleDeleteService = (id) => {
    setServices(services.filter(s => s.id !== id))
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-5 sm:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* En-tête du Dashboard */}
        <div>
          <h1 className="text-3xl font-extrabold text-black">Tableau de Bord</h1>
          <p className="text-zinc-500 mt-1">Gérez votre activité et suivez vos performances.</p>
        </div>

        {/* Section Statistiques Résumé */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[2rem] p-6 border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-xl">
              <FiTrendingUp />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-500">3 derniers jours</p>
              <p className="text-2xl font-bold text-black">+24 vues</p>
            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-6 border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center text-xl">
              <FiEye />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-500">Consultations (Total)</p>
              <p className="text-2xl font-bold text-black">1,204</p>
            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-6 border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-xl">
              <FiStar />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-500">Note moyenne</p>
              <p className="text-2xl font-bold text-black">4.8 <span className="text-sm font-normal text-zinc-400">/ 5</span></p>
            </div>
          </div>
        </div>

        {/* Section Graphique et Avis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Graphique */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-zinc-200 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-6">Répartition sur les 30 jours</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="views" stroke="#eab308" strokeWidth={3} dot={{ fill: '#eab308', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Avis & Commentaires */}
          <div className="bg-white rounded-[2rem] p-8 border border-zinc-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black flex items-center gap-2">
                <FiMessageSquare className="text-yellow-500" /> Avis récents
              </h2>
              <span className="text-sm font-bold text-zinc-400">22 total</span>
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              {recentReviews.map(review => (
                <div key={review.id} className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-black">{review.user}</span>
                    <div className="flex text-yellow-400 text-xs">
                      {[...Array(5)].map((_, i) => <FiStar key={i} className={i < review.rating ? "fill-current" : "text-zinc-300"} />)}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-600 line-clamp-3">{review.text}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setIsReviewsModalOpen(true)}
              className="w-full mt-4 py-3 text-sm font-bold text-yellow-500 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition"
            >
              Voir tous les avis
            </button>
          </div>
        </div>

        {/* Section CRUD Services */}
        <div className="bg-white rounded-[2rem] p-8 border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black">Mes Services</h2>
            <button 
              onClick={openAddModal}
              className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-zinc-800 transition shadow-md"
            >
              <FiPlus /> Ajouter
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(service => (
              <div key={service.id} className="border border-zinc-200 p-5 rounded-2xl flex flex-col justify-between hover:border-yellow-400 transition group">
                <div>
                  <h3 className="font-bold text-black">{service.name}</h3>
                  <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{service.description}</p>
                  <p className="text-sm font-semibold text-zinc-700 mt-3">{service.price.avg.toLocaleString()} {service.price.currency}</p>
                </div>
                <div className="flex justify-end gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(service)} className="p-2 text-zinc-400 hover:text-blue-500 bg-zinc-50 hover:bg-blue-50 rounded-full transition"><FiEdit2 /></button>
                  <button onClick={() => handleDeleteService(service.id)} className="p-2 text-zinc-400 hover:text-red-500 bg-zinc-50 hover:bg-red-50 rounded-full transition"><FiTrash2 /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modal Ajout / Modif Service */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-black mb-6">
              {editingServiceId ? 'Modifier un service' : 'Ajouter un service'}
            </h2>
            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-600 mb-2">Nom du service</label>
                <input 
                  type="text" 
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none" 
                  placeholder="Ex: Diagnostic" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-600 mb-2">Description</label>
                <textarea 
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none" 
                  placeholder="Description détaillée du service..." 
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-600 mb-2">Prix moyen (Ar)</label>
                <input 
                  type="number" 
                  value={newService.price}
                  onChange={(e) => setNewService({...newService, price: e.target.value})}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none" 
                  placeholder="Ex: 50000" 
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-full font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 rounded-full font-bold text-white bg-yellow-400 hover:bg-yellow-500 transition shadow-md shadow-yellow-400/20"
                >
                  {editingServiceId ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Voir tous les avis */}
      {isReviewsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-2xl shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black flex items-center gap-2">
                <FiMessageSquare className="text-yellow-500" /> Tous les avis (22)
              </h2>
              <button onClick={() => setIsReviewsModalOpen(false)} className="text-zinc-400 hover:text-red-500 text-2xl font-bold">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {recentReviews.map(review => (
                <div key={review.id} className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-base text-black">{review.user}</span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => <FiStar key={i} className={i < review.rating ? "fill-current" : "text-zinc-300"} />)}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed">{review.text}</p>
                </div>
              ))}
              <div className="text-center py-4 text-zinc-500 text-sm italic">Fin des avis.</div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default HomePrestataire