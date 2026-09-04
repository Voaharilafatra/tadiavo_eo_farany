import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  FiArrowRight,
  FiArrowLeft,
  FiCheck,
  FiPlus,
  FiTrash2,
  FiMapPin
} from 'react-icons/fi'

import { devenirProService } from '../../api/devenirPro.service'
import  clientExplorerService  from '../../api/clientExplor.service'

function BecomeProviderForm() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [error, setError] = useState(null)

  const [categories, setCategories] = useState([])
  const [features, setFeatures] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    category_ids: [],
    description: '',

    services: [
      {
        name: '',
        description: '',
        price: {
          avg: '',
          currency: 'MGA'
        }
      }
    ],

    location: {
      type: 'Point',
      coordinates: ['', '']
    },

    address: {
      municipality: '',
      neighborhood: '',
      description: ''
    },

    opening_hours: {},

    contact: {
      phone: '',
      email: ''
    },

    features: []
  })

  // =========================================================
  // CHARGEMENT DES CATEGORIES
  // =========================================================

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true)

        const data = await clientExplorerService.getCategories()

        console.log('Catégories reçues :', data)

        setCategories(data)
      } catch (error) {
        console.error(
          'Erreur chargement catégories :',
          error.response?.data || error
        )

        setError("Impossible de charger les catégories.")
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  // =========================================================
  // CHARGEMENT DES FEATURES
  // =========================================================

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const data = await clientExplorerService.getFeatures()

        console.log('Features reçues :', data)

        setFeatures(data)
      } catch (error) {
        console.error(
          'Erreur chargement features :',
          error.response?.data || error
        )
      }
    }

    loadFeatures()
  }, [])

  // =========================================================
  // CHANGEMENTS DES CHAMPS SIMPLES
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // =========================================================
  // ADRESSE
  // =========================================================

  const handleAddressChange = (e) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }))
  }

  // =========================================================
  // CONTACT
  // =========================================================

  const handleContactChange = (e) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value
      }
    }))
  }

  // =========================================================
  // CATEGORIE
  // =========================================================

  const handleCategoryChange = (e) => {
    const value = e.target.value

    setFormData(prev => ({
      ...prev,
      category_ids: value ? [value] : []
    }))
  }

  // =========================================================
  // SERVICE
  // =========================================================

  const handleServiceChange = (index, field, value) => {
    setFormData(prev => {
      const services = [...prev.services]

      services[index] = {
        ...services[index],
        [field]: value
      }

      return {
        ...prev,
        services
      }
    })
  }

  const handleServicePriceChange = (index, value) => {
    setFormData(prev => {
      const services = [...prev.services]

      services[index] = {
        ...services[index],
        price: {
          ...services[index].price,
          avg: value
        }
      }

      return {
        ...prev,
        services
      }
    })
  }

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [
        ...prev.services,
        {
          name: '',
          description: '',
          price: {
            avg: '',
            currency: 'MGA'
          }
        }
      ]
    }))
  }

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }))
  }

  // =========================================================
  // FEATURES
  // =========================================================

  const handleFeatureChange = (feature) => {
    setFormData(prev => {
      const alreadySelected = prev.features.includes(feature)

      return {
        ...prev,
        features: alreadySelected
          ? prev.features.filter(item => item !== feature)
          : [...prev.features, feature]
      }
    })
  }

  // =========================================================
  // GEOLOCALISATION
  // =========================================================
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    setError("La géolocalisation n'est pas supportée par votre navigateur.")
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords

      setFormData(prev => ({
        ...prev,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude]
        }
      }))

      setError(null)
    },
    (error) => {
      console.error("Erreur géolocalisation :", error)

      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError(
            "L'accès à votre position a été refusé. Autorisez la géolocalisation dans les paramètres de votre navigateur."
          )
          break

        case error.POSITION_UNAVAILABLE:
          setError(
            "Votre position n'est pas disponible actuellement."
          )
          break

        case error.TIMEOUT:
          setError(
            "La récupération de votre position a pris trop de temps."
          )
          break

        default:
          setError(
            "Impossible de récupérer votre position."
          )
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  )
}

  // =========================================================
  // VALIDATION AVANT PASSAGE A L'ETAPE SUIVANTE
  // =========================================================

  const handleNext = () => {
    setError(null)

    if (step === 1) {
      if (!formData.name.trim()) {
        setError("Le nom du prestataire est obligatoire.")
        return
      }

      if (!formData.contact.email.trim()) {
        setError("L'email professionnel est obligatoire.")
        return
      }
    }

    if (step === 2) {
      if (formData.category_ids.length === 0) {
        setError("Veuillez sélectionner une catégorie.")
        return
      }

      if (!formData.description.trim()) {
        setError("Veuillez renseigner une description.")
        return
      }

      const invalidService = formData.services.some(
        service =>
          !service.name.trim() ||
          !service.description.trim() ||
          !service.price.avg
      )

      if (invalidService) {
        setError(
          "Veuillez compléter correctement tous les services."
        )
        return
      }
    }

    if (step === 3) {
      if (!formData.address.municipality.trim()) {
        setError("La ville est obligatoire.")
        return
      }

      if (!formData.address.neighborhood.trim()) {
        setError("Le quartier est obligatoire.")
        return
      }

      if (
        !formData.location.coordinates[0] ||
        !formData.location.coordinates[1]
      ) {
        setError("Veuillez renseigner votre position GPS.")
        return
      }
    }

    setStep(prev => Math.min(prev + 1, 4))
  }

  const handlePrev = () => {
    setError(null)
    setStep(prev => Math.max(prev - 1, 1))
  }

  // =========================================================
  // SOUMISSION
  // =========================================================

 const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    setLoading(true)
    setError(null)

    const dataToSend = {
      name: formData.name.trim(),

      category_ids: formData.category_ids,

      description: formData.description.trim(),

      services: formData.services.map(service => ({
        name: service.name.trim(),
        description: service.description.trim(),
        price: {
          avg: Number(service.price.avg),
          currency: service.price.currency
        }
      })),

      location: {
        type: 'Point',
        coordinates: [
          Number(formData.location.coordinates[0]),
          Number(formData.location.coordinates[1])
        ]
      },

      address: {
        municipality: formData.address.municipality.trim(),
        neighborhood: formData.address.neighborhood.trim(),
        description: formData.address.description.trim()
      },

      opening_hours: formData.opening_hours,

      contact: {
        phone: formData.contact.phone.trim(),
        email: formData.contact.email.trim()
      },

      features: formData.features
    }

    console.log(
      'Données envoyées au backend :',
      JSON.stringify(dataToSend, null, 2)
    )

    // Attend :
    // 1. la réponse du backend
    // 2. l'enregistrement du provider_id dans localStorage
    const response = await devenirProService.createPrestataire(dataToSend)

    console.log('Prestataire créé :', response)

    // Vérification facultative
    const providerId = localStorage.getItem('provider_id')

    console.log('Provider ID enregistré :', providerId)

    if (!providerId) {
      throw new Error(
        "Le prestataire a été créé, mais son ID n'a pas été enregistré."
      )
    }

    // La navigation arrive seulement après l'enregistrement
    navigate('/prestataire')

  } catch (error) {
    console.error(
      'Erreur création prestataire :',
      error.response?.data || error
    )

    const detail = error.response?.data?.detail

    if (Array.isArray(detail)) {
      setError(
        detail
          .map(item => item.msg || 'Erreur de validation')
          .join(', ')
      )
    } else {
      setError(
        detail ||
        error.message ||
        "Impossible de créer le profil prestataire."
      )
    }
  } finally {
    setLoading(false)
  }
}
  const slideVariants = {
    hidden: {
      x: 50,
      opacity: 0
    },
    visible: {
      x: 0,
      opacity: 1
    },
    exit: {
      x: -50,
      opacity: 0
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-5 sm:px-8 flex flex-col items-center justify-center">

      {/* RETOUR */}

      <div className="w-full max-w-3xl mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-black transition font-semibold text-sm"
        >
          <FiArrowLeft />
          Retour
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-[2rem] shadow-sm border border-zinc-200 overflow-hidden">

        {/* ================================================= */}
        {/* PROGRESS BAR */}
        {/* ================================================= */}

        <div className="bg-zinc-100 p-6 flex justify-between items-center border-b border-zinc-200">

          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className="flex flex-col items-center flex-1 relative"
            >

              <div
                className={`
                  w-10 h-10 rounded-full
                  flex items-center justify-center
                  font-bold text-sm z-10
                  transition-colors duration-300
                  ${
                    step >= s
                      ? 'bg-yellow-400 text-white shadow-md'
                      : 'bg-zinc-200 text-zinc-500'
                  }
                `}
              >
                {step > s ? <FiCheck /> : s}
              </div>

              {s < 4 && (
                <div
                  className={`
                    absolute top-5 left-1/2
                    w-full h-1
                    -translate-y-1/2
                    transition-colors duration-300
                    ${
                      step > s
                        ? 'bg-yellow-400'
                        : 'bg-zinc-200'
                    }
                  `}
                />
              )}

            </div>
          ))}

        </div>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div className="mx-8 mt-6 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <div className="p-8 sm:p-12 relative overflow-hidden min-h-[500px]">

          <AnimatePresence mode="wait">

            <motion.div
              key={step}
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >

              {/* ================================================= */}
              {/* STEP 1 */}
              {/* ================================================= */}

              {step === 1 && (
                <div>

                  <h2 className="text-2xl font-bold text-black mb-6">
                    Informations de base
                  </h2>

                  <div className="space-y-5">

                    {/* NOM */}

                    <div>
                      <label className="block text-sm font-semibold text-zinc-600 mb-2">
                        Nom de l'entreprise ou Prestataire
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none"
                        placeholder="Ex : Plombier Express"
                      />
                    </div>

                    {/* EMAIL */}

                    <div>
                      <label className="block text-sm font-semibold text-zinc-600 mb-2">
                        Email professionnel
                      </label>

                      <input
                        type="email"
                        value={formData.contact.email}
                        onChange={handleContactChange}
                        name="email"
                        className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none"
                        placeholder="contact@domaine.com"
                      />
                    </div>

                    {/* TELEPHONE */}

                    <div>
                      <label className="block text-sm font-semibold text-zinc-600 mb-2">
                        Téléphone
                      </label>

                      <input
                        type="tel"
                        value={formData.contact.phone}
                        onChange={handleContactChange}
                        name="phone"
                        className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none"
                        placeholder="Ex : 034 00 000 00"
                      />
                    </div>

                  </div>
                </div>
              )}

              {/* ================================================= */}
              {/* STEP 2 */}
              {/* ================================================= */}

              {step === 2 && (
                <div>

                  <h2 className="text-2xl font-bold text-black mb-6">
                    Spécialités & Services
                  </h2>

                  <div className="space-y-6">

                    {/* CATEGORIE */}

                    <div>
                      <label className="block text-sm font-semibold text-zinc-600 mb-2">
                        Catégorie principale
                      </label>

                      {loadingCategories ? (
                        <div className="rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-500">
                          Chargement des catégories...
                        </div>
                      ) : (
                        <select
                          value={formData.category_ids[0] || ''}
                          onChange={handleCategoryChange}
                          className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none"
                        >
                          <option value="">
                            Sélectionner une catégorie
                          </option>

                          {categories.map(category => (
                            <option
                              key={category._id}
                              value={category._id}
                            >
                              {category.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* DESCRIPTION */}

                    <div>
                      <label className="block text-sm font-semibold text-zinc-600 mb-2">
                        Description de votre activité
                      </label>

                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none"
                        placeholder="Décrivez votre expertise..."
                      />
                    </div>

                    {/* SERVICES */}

                    <div>

                      <div className="flex items-center justify-between mb-3">

                        <label className="text-sm font-semibold text-zinc-600">
                          Vos services
                        </label>

                        <button
                          type="button"
                          onClick={addService}
                          className="flex items-center gap-1 text-sm font-semibold text-yellow-500 hover:text-yellow-600"
                        >
                          <FiPlus />
                          Ajouter
                        </button>

                      </div>

                      <div className="space-y-4">

                        {formData.services.map((service, index) => (

                          <div
                            key={index}
                            className="rounded-2xl border border-zinc-200 p-4 space-y-3"
                          >

                            <div className="flex justify-between items-center">

                              <p className="font-semibold text-zinc-800">
                                Service {index + 1}
                              </p>

                              {formData.services.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeService(index)
                                  }
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <FiTrash2 />
                                </button>
                              )}

                            </div>

                            <input
                              type="text"
                              value={service.name}
                              onChange={e =>
                                handleServiceChange(
                                  index,
                                  'name',
                                  e.target.value
                                )
                              }
                              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-yellow-400"
                              placeholder="Nom du service"
                            />

                            <textarea
                              value={service.description}
                              onChange={e =>
                                handleServiceChange(
                                  index,
                                  'description',
                                  e.target.value
                                )
                              }
                              rows="2"
                              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-yellow-400"
                              placeholder="Description du service"
                            />

                            <input
                              type="number"
                              min="0"
                              value={service.price.avg}
                              onChange={e =>
                                handleServicePriceChange(
                                  index,
                                  e.target.value
                                )
                              }
                              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-yellow-400"
                              placeholder="Prix moyen en MGA"
                            />

                          </div>

                        ))}

                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* ================================================= */}
              {/* STEP 3 */}
              {/* ================================================= */}

              {step === 3 && (
                <div>

                  <h2 className="text-2xl font-bold text-black mb-6">
                    Localisation
                  </h2>

                  <div className="space-y-5">

                    {/* VILLE */}

                    <div>
                      <label className="block text-sm font-semibold text-zinc-600 mb-2">
                        Ville
                      </label>

                      <input
                        type="text"
                        name="municipality"
                        value={formData.address.municipality}
                        onChange={handleAddressChange}
                        className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none"
                        placeholder="Ex : Antananarivo"
                      />
                    </div>

                    {/* QUARTIER */}

                    <div>
                      <label className="block text-sm font-semibold text-zinc-600 mb-2">
                        Quartier
                      </label>

                      <input
                        type="text"
                        name="neighborhood"
                        value={formData.address.neighborhood}
                        onChange={handleAddressChange}
                        className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none"
                        placeholder="Ex : Ivandry"
                      />
                    </div>

                    {/* ADRESSE */}

                    <div>
                      <label className="block text-sm font-semibold text-zinc-600 mb-2">
                        Adresse / précision
                      </label>

                      <textarea
                        name="description"
                        value={formData.address.description}
                        onChange={handleAddressChange}
                        rows="3"
                        className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none"
                        placeholder="Ex : Près de la pharmacie..."
                      />
                    </div>

                    {/* POSITION */}

                    <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-5">

                      <div className="flex items-center gap-3 mb-3">

                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">
                          <FiMapPin />
                        </div>

                        <div>
                          <p className="font-semibold text-zinc-800">
                            Position GPS
                          </p>

                          <p className="text-sm text-zinc-500">
                            Utilisée pour afficher votre établissement sur la carte.
                          </p>
                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-white hover:bg-yellow-500 transition"
                      >
                        Utiliser ma position
                      </button>

                      {formData.location.coordinates[0] &&
                        formData.location.coordinates[1] && (
                          <p className="mt-3 text-sm text-green-600">
                            Position enregistrée ✓
                          </p>
                        )}

                    </div>

                  </div>

                </div>
              )}

              {/* ================================================= */}
              {/* STEP 4 */}
              {/* ================================================= */}

              {step === 4 && (
                <div>

                  <div className="text-center py-6">

                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500 text-3xl">
                      <FiCheck />
                    </div>

                    <h2 className="text-2xl font-bold text-black mb-2">
                      Tout est prêt !
                    </h2>

                    <p className="text-zinc-500 max-w-md mx-auto">
                      Vérifiez vos informations puis cliquez sur
                      Enregistrer pour créer votre profil prestataire.
                    </p>

                  </div>

                  {/* RESUME */}

                  <div className="mt-6 rounded-2xl bg-zinc-50 border border-zinc-200 p-5 space-y-3">

                    <div className="flex justify-between gap-4">
                      <span className="text-zinc-500">
                        Nom
                      </span>

                      <span className="font-semibold text-right">
                        {formData.name}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-zinc-500">
                        Catégorie
                      </span>

                      <span className="font-semibold text-right">
                        {
                          categories.find(
                            category =>
                              category._id ===
                              formData.category_ids[0]
                          )?.name || '-'
                        }
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-zinc-500">
                        Ville
                      </span>

                      <span className="font-semibold text-right">
                        {formData.address.municipality}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-zinc-500">
                        Quartier
                      </span>

                      <span className="font-semibold text-right">
                        {formData.address.neighborhood}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-zinc-500">
                        Services
                      </span>

                      <span className="font-semibold text-right">
                        {formData.services.length}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-zinc-500">
                        Position GPS
                      </span>

                      <span className="font-semibold text-green-600">
                        {formData.location.coordinates[0]
                          ? 'Enregistrée ✓'
                          : 'Manquante'}
                      </span>
                    </div>

                  </div>

                </div>
              )}

            </motion.div>

          </AnimatePresence>
        </div>

        {/* ================================================= */}
        {/* CONTROLES */}
        {/* ================================================= */}

        <div className="p-6 bg-zinc-50 border-t border-zinc-200 flex justify-between items-center">

          <button
            onClick={handlePrev}
            disabled={step === 1 || loading}
            className={`
              flex items-center gap-2
              px-6 py-2.5 rounded-full
              font-bold transition
              ${
                step === 1
                  ? 'opacity-0 pointer-events-none'
                  : 'text-zinc-600 bg-white border border-zinc-200 hover:bg-zinc-100'
              }
            `}
          >
            <FiArrowLeft />
            Précédent
          </button>

          {step < 4 ? (

            <button
              onClick={handleNext}
              disabled={loading || loadingCategories}
              className="flex items-center gap-2 px-8 py-2.5 rounded-full font-bold bg-yellow-400 text-white hover:bg-yellow-500 transition shadow-md shadow-yellow-400/20 disabled:opacity-50"
            >
              Suivant
              <FiArrowRight />
            </button>

          ) : (

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-2.5 rounded-full font-bold bg-black text-white hover:bg-zinc-800 transition shadow-md disabled:opacity-50"
            >

              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Enregistrement...
                </>
              ) : (
                <>
                  Enregistrer
                  <FiCheck />
                </>
              )}

            </button>

          )}

        </div>

      </div>
    </div>
  )
}

export default BecomeProviderForm