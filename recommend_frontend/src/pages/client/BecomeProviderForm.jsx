import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiArrowLeft, FiCheck } from 'react-icons/fi'

function BecomeProviderForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4))
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1))

  const handleSubmit = (e) => {
    e.preventDefault()
    // Logique de soumission au backend ici
    navigate('/prestataire')
  }

  const slideVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-5 sm:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl mb-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-zinc-500 hover:text-black transition font-semibold text-sm">
          <FiArrowLeft /> Retour
        </button>
      </div>
      <div className="w-full max-w-3xl bg-white rounded-[2rem] shadow-sm border border-zinc-200 overflow-hidden">
        
        {/* Progress Bar */}
        <div className="bg-zinc-100 p-6 flex justify-between items-center border-b border-zinc-200">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="flex flex-col items-center flex-1 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors duration-300 ${step >= s ? 'bg-yellow-400 text-white shadow-md' : 'bg-zinc-200 text-zinc-500'}`}>
                {step > s ? <FiCheck /> : s}
              </div>
              {s < 4 && (
                <div className={`absolute top-5 left-1/2 w-full h-1 -translate-y-1/2 transition-colors duration-300 ${step > s ? 'bg-yellow-400' : 'bg-zinc-200'}`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="p-8 sm:p-12 relative overflow-hidden min-h-[400px]">
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
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-black mb-6">Informations de base</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-600 mb-2">Nom de l'entreprise ou Prestataire</label>
                      <input type="text" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none" placeholder="Ex: Plombier Express" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-600 mb-2">Email professionnel</label>
                      <input type="email" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none" placeholder="contact@domaine.com" />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-black mb-6">Spécialités & Services</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-600 mb-2">Catégorie Principale</label>
                      <select className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none">
                        <option>Plomberie</option>
                        <option>Électricité</option>
                        <option>Jardinage</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-600 mb-2">Description de vos services</label>
                      <textarea rows="4" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none" placeholder="Décrivez votre expertise..."></textarea>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-black mb-6">Localisation</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-600 mb-2">Ville</label>
                      <input type="text" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none" placeholder="Ex: Antananarivo" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-600 mb-2">Quartier</label>
                      <input type="text" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-yellow-400 outline-none" placeholder="Ex: Ivandry" />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500 text-3xl">
                    <FiCheck />
                  </div>
                  <h2 className="text-2xl font-bold text-black mb-2">Tout est prêt !</h2>
                  <p className="text-zinc-500 max-w-md mx-auto">Vérifiez vos informations et cliquez sur Enregistrer pour créer votre profil prestataire et accéder à votre tableau de bord.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Form Controls */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-200 flex justify-between items-center">
          <button 
            onClick={handlePrev}
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-zinc-600 bg-white border border-zinc-200 hover:bg-zinc-100'}`}
          >
            <FiArrowLeft /> Précédent
          </button>
          
          {step < 4 ? (
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-2.5 rounded-full font-bold bg-yellow-400 text-white hover:bg-yellow-500 transition shadow-md shadow-yellow-400/20"
            >
              Suivant <FiArrowRight />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              className="flex items-center gap-2 px-8 py-2.5 rounded-full font-bold bg-black text-white hover:bg-zinc-800 transition shadow-md"
            >
              Enregistrer <FiCheck />
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default BecomeProviderForm