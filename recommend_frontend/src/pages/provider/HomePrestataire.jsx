import { useState, useEffect } from 'react'
import { prestataireDashboardService } from '../../api/prestataireDash.service'
import { FiEye, FiStar, FiMessageSquare, FiTrendingUp, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useOutletContext } from 'react-router-dom'
// Mock Data

function HomePrestataire() {
  const { user } = useOutletContext()
  const providerId = localStorage.getItem('provider_id')
  console.log('provider_id :', providerId)
  const [services, setServices] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false)
  const [editingServiceId, setEditingServiceId] = useState(null)
  const [newService, setNewService] = useState({ name: '', description: '', price: '' })

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?._id) return

      try {
        setLoading(true)
        setError(null)

        const [servicesData, dashboardData] = await Promise.all([
          prestataireDashboardService.getPrestataireServices(providerId),
          prestataireDashboardService.getPrestataireDashboard(providerId)
        ])

        console.log('Services :', servicesData)
        console.log('Dashboard :', dashboardData)

        setServices(servicesData)
        setDashboard(dashboardData)

      } catch (error) {
        console.error(
          'Erreur chargement dashboard :',
          error.response?.data || error
        )

        setError(
          error.response?.data?.detail ||
          'Impossible de charger les données du dashboard.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user?.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-400/20 border-t-yellow-400" />
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }


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

const handleSaveService = async (e) => {
  e.preventDefault()

  if (!newService.name || !newService.price) {
    return
  }

  try {

    // =========================
    // MODIFICATION
    // =========================
    if (editingServiceId) {

      const serviceData = {
        name: newService.name,
        description: newService.description,
        price: {
          avg: parseInt(newService.price),
          currency: "MGA"
        }
      }

      console.log("Service ID :", editingServiceId)
      console.log("Données envoyées :", serviceData)

      const updatedService =
        await prestataireDashboardService.updateService(
          editingServiceId,
          serviceData
        )

      console.log("Service modifié :", updatedService)

      // Mettre à jour la liste avec la réponse du backend
      setServices(prevServices =>
        prevServices.map(service =>
          service.id === editingServiceId
            ? updatedService
            : service
        )
      )

      setIsModalOpen(false)
      setEditingServiceId(null)

    } else {

      // =========================
      // AJOUT
      // =========================

      const serviceData = {
        name: newService.name,
        description: newService.description,
        price: {
          avg: parseInt(newService.price),
          currency: "MGA"
        }
      }

      const addedService =
        await prestataireDashboardService.addService(serviceData)

      console.log("Service ajouté :", addedService)

      setServices(prevServices => [
        ...prevServices,
        addedService
      ])

      setIsModalOpen(false)
    }

  } catch (error) {

    console.error(
      "Erreur lors de l'enregistrement du service :",
      error.response?.data || error
    )

    alert(
      error.response?.data?.detail ||
      "Impossible d'enregistrer le service."
    )
  }
}

  const handleDeleteService = (id) => {
    setServices(services.filter(s => s.id !== id))
  }
  const viewsData = dashboard.views.daily.map(item => ({
    name: item.date,
    views: item.views
  }))
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
              <div className="text-2xl font-bold text-zinc-900">
                {dashboard.reviews.statistics.average_rating} / 5
              </div>

              <p className="text-sm text-zinc-500">
                Note moyenne
              </p>            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-6 border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center text-xl">
              <FiEye />
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-900">
                {dashboard.views.total}
              </div>

              <p className="text-sm text-zinc-500">
                Vues ce mois-ci
              </p>            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-6 border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-xl">
              <FiStar />
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-900">
                {dashboard.reviews.statistics.total}
              </div>

              <p className="text-sm text-zinc-500">
                Avis reçus
              </p> </div>
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
              <span className="text-sm font-bold text-zinc-400"> {dashboard.reviews.statistics.total} total</span>
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              {dashboard.reviews.items.map(review => (
                <div
                  key={review.id}
                  className="flex gap-4 border-b border-zinc-100 py-4 last:border-0"
                >
                  <img
                    src={review.user?.picture}
                    alt={review.user?.name || 'Utilisateur'}
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-zinc-900">
                        {review.user?.name || 'Utilisateur'}
                      </p>

                      <span className="text-sm text-zinc-400">
                        {new Date(review.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-1">
                      <FiStar className="text-yellow-500" />

                      <span className="text-sm font-medium">
                        {review.rating ?? '-'} / 5
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-zinc-600">
                      {review.comment}
                    </p>
                  </div>
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
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none"
                  placeholder="Ex: Diagnostic"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-600 mb-2">Description</label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
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
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
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

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black flex items-center gap-2">
                <FiMessageSquare className="text-yellow-500" />
                Tous les avis
              </h2>

              <button
                onClick={() => setIsReviewsModalOpen(false)}
                className="text-zinc-400 hover:text-red-500 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Liste des avis */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">

              {dashboard?.reviews?.items?.length > 0 ? (
                dashboard.reviews.items.map((review) => (
                  <div
                    key={review.id}
                    className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100"
                  >
                    {/* Nom + note */}
                    <div className="flex justify-between items-center mb-3">

                      <div className="flex items-center gap-3">
                        {/* Photo utilisateur */}
                        {review.user?.picture ? (
                          <img
                            src={review.user.picture}
                            alt={review.user?.name || "Utilisateur"}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center font-bold text-yellow-600">
                            {review.user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}

                        <div>
                          <span className="font-bold text-base text-black">
                            {review.user?.name || "Utilisateur"}
                          </span>

                          {review.created_at && (
                            <p className="text-xs text-zinc-400">
                              {new Date(review.created_at).toLocaleDateString("fr-FR")}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Étoiles */}
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={
                              i < review.rating
                                ? "fill-current"
                                : "text-zinc-300"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {/* Commentaire */}
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      {review.comment || "Aucun commentaire."}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-zinc-500">
                  Aucun avis disponible.
                </div>
              )}

              {/* Fin */}
              {dashboard?.reviews?.items?.length > 0 && (
                <div className="text-center py-4 text-zinc-500 text-sm italic">
                  Fin des avis.
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default HomePrestataire