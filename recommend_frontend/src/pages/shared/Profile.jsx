import { useState, useEffect } from 'react'
import { FiUser, FiMail, FiMapPin, FiPhone, FiEdit2, FiSave, FiX, FiArrowLeft } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import api from '../../api/api'

function Profile() {
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    // Simuler le chargement des infos depuis l'API ou le localStorage
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/auth/users/me')
        .then(res => {
          setUser(res.data)
          setFormData({
            name: res.data.name || '',
            email: res.data.email || '',
            phone: res.data.phone || '+261 34 00 000 00', // Exemple
            address: res.data.address || 'Antananarivo, Madagascar' // Exemple
          })
        })
    }
  }, [])

  const handleSave = (e) => {
    e.preventDefault()
    // Normalement un call API PATCH /auth/users/me
    setUser({ ...user, ...formData })
    setIsEditing(false)
  }

  if (!user) return <div className="min-h-screen bg-zinc-50 flex justify-center items-center">Chargement...</div>

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-zinc-500 hover:text-black mb-6 transition font-semibold text-sm">
          <FiArrowLeft /> Retour
        </button>
        <h1 className="text-3xl font-extrabold text-black mb-8">Mon Profil</h1>
        
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-200">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 pb-8 border-b border-zinc-100">
            <div className="relative">
              <img src={user.picture || 'https://via.placeholder.com/100'} alt="Profil" className="w-24 h-24 rounded-full object-cover border-4 border-zinc-50 shadow-md" />
              <button className="absolute bottom-0 right-0 bg-yellow-400 text-white p-2 rounded-full shadow-lg hover:bg-yellow-500 transition">
                <FiEdit2 size={14} />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-black">{user.name}</h2>
              <p className="text-zinc-500">{user.role === 'prestataire' ? 'Prestataire vérifié' : 'Compte Client'}</p>
              <div className="mt-3 inline-flex bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div> Actif
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-zinc-600 mb-2">
                  <FiUser className="text-yellow-500" /> Nom complet
                </label>
                {isEditing ? (
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none" required />
                ) : (
                  <p className="text-black font-medium px-4 py-3 bg-zinc-50 rounded-xl border border-transparent">{user.name}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-zinc-600 mb-2">
                  <FiMail className="text-yellow-500" /> Adresse Email
                </label>
                {isEditing ? (
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none" required disabled />
                ) : (
                  <p className="text-black font-medium px-4 py-3 bg-zinc-50 rounded-xl border border-transparent">{user.email}</p>
                )}
                {isEditing && <p className="text-xs text-zinc-400 mt-1">L'email lié au compte Google ne peut pas être modifié.</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-zinc-600 mb-2">
                  <FiPhone className="text-yellow-500" /> Téléphone
                </label>
                {isEditing ? (
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none" />
                ) : (
                  <p className="text-black font-medium px-4 py-3 bg-zinc-50 rounded-xl border border-transparent">{formData.phone}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-zinc-600 mb-2">
                  <FiMapPin className="text-yellow-500" /> Adresse
                </label>
                {isEditing ? (
                  <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none" />
                ) : (
                  <p className="text-black font-medium px-4 py-3 bg-zinc-50 rounded-xl border border-transparent">{formData.address}</p>
                )}
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-4 border-t border-zinc-100">
              {isEditing ? (
                <>
                  <button type="button" onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition">
                    <FiX /> Annuler
                  </button>
                  <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-white bg-black hover:bg-zinc-800 transition shadow-md">
                    <FiSave /> Enregistrer
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-black bg-yellow-400 hover:bg-yellow-500 transition shadow-md shadow-yellow-400/20">
                  <FiEdit2 /> Modifier le profil
                </button>
              )}
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Profile