import { FiArrowRight, FiHeart, FiMapPin, FiShield, FiStar, FiZap } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import 'animate.css'
import api from '../api/api';

const features = [
  { icon: FiZap, title: 'Visibilité pour petits prestataires', text: 'Augmentez votre présence locale pour être trouvé par plus de clients.' },
  { icon: FiHeart, title: 'Recommandations personnalisées', text: 'Des résultats adaptés à chaque besoin et chaque zone.' },
  { icon: FiStar, title: 'Avis et ranking', text: 'Notez les services, consultez les retours et choisissez en confiance.' },
  { icon: FiMapPin, title: 'Directions géolocalisées', text: 'Obtenez l\'itinéraire direct vers les meilleures adresses proches de vous.' },
]

const guideSteps = [
  { 
    id: 1,
    title: 'Rechercher', 
    description: 'Choisissez votre catégorie et trouvez les meilleurs prestataires locaux.',
    details: 'Utilisez la barre de recherche pour trouver des prestataires par catégorie, localisation ou mot-clé. Affinez votre recherche avec les filtres disponibles.'
  },
  { 
    id: 2,
    title: 'Comparer', 
    description: 'Consultez les avis, les distances et les services proposés.',
    details: 'Comparez les prestataires selon leurs notes, leurs avis clients, leur proximité et les services qu\'ils proposent. Faites le meilleur choix.'
  },
  { 
    id: 3,
    title: 'Réserver', 
    description: 'Réservez ou contactez rapidement votre choix.',
    details: 'Contactez directement le prestataire ou effectuez une réservation en ligne. Recevez une confirmation instantanée par email.'
  },
]

const testimonials = [
  { name: 'Florida', role: 'Cliente satisfaite', text: 'Super service ! – Florida', initials: 'F' },
  { name: 'Mira', role: 'Voyageuse', text: 'La carte est claire et la recherche locale est instantanée.', initials: 'M' },
  { name: 'Rivo', role: 'Prestataire', text: 'Nous avons gagné en visibilité auprès de nouveaux clients.', initials: 'R' },
]

function Home() {
  const [activeStep, setActiveStep] = useState(1)
  const [nearbyServices, setNearbyServices] = useState([])

  useEffect(() => {
    // Services à proximité avec coordonnées GPS (Données statiques pour la Landing)
    const services = [
      {
        id: 1,
        title: 'Café du Marché',
        category: 'Restaurant',
        location: 'Antananarivo',
        rating: 4.8,
        reviews: 45,
        lat: -18.8792,
        lng: 47.5079,
        price: '15€ - 50€',
        description: 'Cuisine française et malgache dans un cadre chaleureux.'
      },
      {
        id: 2,
        title: 'Plomberie Express',
        category: 'Plomberie',
        location: 'Antananarivo',
        rating: 4.5,
        reviews: 32,
        lat: -18.8692,
        lng: 47.5179,
        price: '30€/h',
        description: 'Intervention rapide pour tous vos problèmes de plomberie.'
      }
    ]
    setNearbyServices(services)
  }, [])

  return (
    <main className="bg-white text-black">
      {/* Section Accueil */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        id="accueil" 
        className="relative overflow-hidden px-5 pb-20 pt-28 sm:px-8 md:pb-28 lg:px-10"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-400">
              TADIAVO-EO · Trouvez localement
            </span>
            <h1 className="mt-8 text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl lg:text-6xl">Trouvez les meilleurs services autour de vous, en quelques secondes.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-600 sm:text-lg">TADIAVO-EO met en relation clients et prestataires locaux avec une expérience fluide, sécurisée et optimisée pour la découverte.</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href="#apropos" className="group inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-yellow-500 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/30">
                En savoir plus 
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href="#service" className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-7 py-4 text-sm font-semibold text-black transition-all duration-300 hover:border-yellow-400 hover:text-yellow-400 hover:scale-105 hover:shadow-lg">
                Nos services
              </a>
            </div>
          </div>
          
          {/* Illustration Home (Photo circulaire avec icônes animées, sans card) */}
          <div className="relative mx-auto flex w-full max-w-[520px] items-center justify-center">
            <div className="absolute -right-6 top-10 h-36 w-36 rounded-full bg-yellow-50 blur-2xl animate-[pulse_4s_infinite]" />
            <div className="absolute -left-10 bottom-6 h-28 w-28 rounded-full bg-yellow-50 blur-2xl animate-[pulse_4s_infinite]" />
            
            {/* Animation Circulaire */}
            <div className="relative h-[500px] w-full flex items-center justify-center">
              <div className="relative h-96 w-96">
                {/* Photo circulaire (lien en ligne) - prestataire avec carte */}
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" alt="Prestataire et localisation" className="absolute inset-0 h-full w-full object-cover rounded-full shadow-2xl z-0 border-8 border-white" />
                
                {/* Icones animées SUR l'image */}
                <div className="absolute inset-0 z-20 animate-[spin_12s_linear_infinite]">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 grid h-14 w-14 place-items-center rounded-full bg-yellow-400 text-white shadow-xl animate-[spin_12s_linear_infinite_reverse]">
                    <FiStar className="h-6 w-6" />
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 grid h-14 w-14 place-items-center rounded-full bg-blue-500 text-white shadow-xl animate-[spin_12s_linear_infinite_reverse]">
                    <FiShield className="h-6 w-6" />
                  </div>
                  <div className="absolute top-1/2 right-4 -translate-y-1/2 grid h-14 w-14 place-items-center rounded-full bg-red-500 text-white shadow-xl animate-[spin_12s_linear_infinite_reverse]">
                    <FiHeart className="h-6 w-6" />
                  </div>
                  <div className="absolute top-1/2 left-4 -translate-y-1/2 grid h-14 w-14 place-items-center rounded-full bg-green-500 text-white shadow-xl animate-[spin_12s_linear_infinite_reverse]">
                    <FiMapPin className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section À propos */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        id="apropos" 
        className="px-5 py-20 sm:px-8 lg:px-10"
      >
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[.95fr_.95fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">À propos</p>
            <h2 className="text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Une expérience locale rapide, claire et fiable.</h2>
            <p className="max-w-2xl text-base leading-7 text-zinc-600">TADIAVO-EO connecte rapidement les utilisateurs aux meilleurs prestataires près de chez eux, avec des avis, une géolocalisation et un accès sécurisé via Google OAuth.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-yellow-400">
                <h3 className="font-semibold text-black">Visibilité locale</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">Une présentation claire des services disponibles à proximité.</p>
              </div>
              <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-yellow-400">
                <h3 className="font-semibold text-black">Connexion simplifiée</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">Authentification rapide via Google OAuth, sans mot de passe additionnel.</p>
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-10 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="space-y-6">
              <div className="rounded-[1.75rem] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-yellow-50">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">Mission</p>
                <p className="mt-4 text-sm leading-7 text-zinc-600">Offrir un service local moderne aux clients et prestataires, avec un parcours intuitif et sécurisé.</p>
              </div>
              <div className="rounded-[1.75rem] bg-yellow-50 p-6 transition-all duration-300 hover:bg-yellow-100 hover:shadow-md">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">Confiance</p>
                <p className="mt-4 text-sm leading-7 text-zinc-600">Utilisez une plateforme qui met la confiance et la simplicité au centre de l'expérience.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section Services */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        id="service" 
        className="border-y border-zinc-100 bg-yellow-50 px-5 py-20 sm:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">Service</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Découvrez les services que vous pouvez activer.</h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text }, index) => (
              <article 
                key={title} 
                className="group rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-yellow-400 animate__animated animate__zoomIn"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <span className="grid h-14 w-14 place-items-center rounded-3xl bg-yellow-50 text-2xl text-yellow-400 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                  <Icon />
                </span>
                <h3 className="mt-6 text-xl font-semibold text-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section Guide avec étapes interactives */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        id="guide" 
        className="px-5 py-20 sm:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[.95fr_.95fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">Guide</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Utilisez TADIAVO-EO en trois étapes simples.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">Recherchez, comparez et réservez le meilleur service dans votre zone, rapidement et sans obstacles.</p>
            </div>
            <div className="space-y-4">
              {guideSteps.map((step) => (
                <div 
                  key={step.id} 
                  className={`rounded-[2rem] border p-6 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg ${
                    activeStep === step.id 
                      ? 'border-yellow-400 bg-yellow-50 shadow-lg' 
                      : 'border-zinc-200 bg-white hover:border-yellow-300'
                  } animate__animated animate__fadeInRight`}
                  style={{ animationDelay: `${(step.id - 1) * 0.2}s` }}
                  onClick={() => setActiveStep(step.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold transition-all duration-300 ${
                      activeStep === step.id 
                        ? 'bg-yellow-400 text-white scale-110' 
                        : 'bg-yellow-50 text-yellow-400'
                    }`}>
                      {step.id}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                          activeStep === step.id ? 'text-yellow-400' : 'text-black'
                        }`}>
                          {step.title}
                        </h3>
                        <span className={`text-xs transition-transform duration-300 ${
                          activeStep === step.id ? 'rotate-180' : ''
                        }`}>
                          {activeStep === step.id ? '▼' : '▶'}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-zinc-600">{step.description}</p>
                      {activeStep === step.id && (
                        <div className="mt-4 pt-4 border-t border-yellow-200 animate__animated animate__fadeInUp">
                          <p className="text-sm text-zinc-700">{step.details}</p>
                          <div className="mt-3 flex gap-2">
                            <span className="inline-flex items-center rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-semibold text-yellow-600">
                              Étape {step.id}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-semibold text-yellow-600">
                              {step.title}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section Démo */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        id="demo" 
        className="bg-yellow-50 px-5 py-20 sm:px-8 lg:px-10"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">Démo</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Explorez les services autour de vous en un clic.</h2>
            <p className="mt-5 text-base leading-7 text-zinc-600">Visualisez les prestataires activés, consultez leur profil et obtenez les directions directement depuis la carte.</p>
          </div>
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 sm:p-8 animate__animated animate__fadeInRight">
            <div className="flex items-center justify-between rounded-3xl bg-yellow-50 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-black">Carte de recherche</p>
                <p className="text-xs text-zinc-500">Vue des prestataires en temps réel</p>
              </div>
              <span className="inline-flex rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-white animate__animated animate__pulse animate__infinite">Actif</span>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="rounded-[1.75rem] bg-yellow-50 p-5 transition-all duration-300 hover:bg-yellow-100">
                <div className="flex items-center justify-between text-sm font-semibold text-black">
                  <span>Carte</span>
                  <span>0,8 km</span>
                </div>
                <div className="mt-5 h-60 rounded-[1.5rem] bg-white p-4 shadow-inner">
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-3 py-2 text-xs font-semibold text-yellow-400 shadow transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        Google Maps API
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-3xl bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                          <p className="text-xs text-zinc-500">Préféré</p>
                          <p className="mt-2 font-semibold text-black">Restaurant Plaisir</p>
                        </div>
                        <div className="rounded-3xl bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                          <p className="text-xs text-zinc-500">Note</p>
                          <p className="mt-2 font-semibold text-black">4,8/5</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[1.5rem] bg-yellow-50/70 p-4 shadow-inner transition-all duration-300 hover:bg-yellow-50">
                      <div className="flex items-center gap-3 text-sm text-zinc-600">
                        <span className="grid h-10 w-10 place-items-center rounded-3xl bg-yellow-50 text-yellow-400 transition-all duration-300 hover:rotate-12 hover:scale-110">
                          <FiMapPin />
                        </span>
                        <div>
                          <p className="font-semibold text-black">Direction immédiate</p>
                          <p className="text-xs">Ouvrir l'itinéraire vers le prestataire</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.75rem] bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center gap-3 text-sm text-zinc-500">
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-yellow-50 text-yellow-400 transition-all duration-300 hover:rotate-12 hover:scale-110">
                    <FiShield />
                  </span>
                  <p>Authentification sécurisée avec Google OAuth.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section Contact */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        id="contact" 
        className="px-5 py-20 sm:px-8 lg:px-10"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.95fr_.65fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">Contact</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Contactez l'équipe TADIAVO-EO</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">Prêt à lancer votre projet ? Envoyez-nous un message pour recevoir une réponse rapide et personnalisée.</p>
            <div className="mt-8 space-y-4 text-sm leading-7 text-zinc-600">
              <p><span className="font-semibold text-black">Email :</span> mivononaandrehy7@gmail.com</p>
              <p><span className="font-semibold text-black">Téléphone :</span> +261 34 12 345 67</p>
            </div>
          </div>
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-10 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate__animated animate__fadeInRight">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">Nous écrire</p>
            <h3 className="mt-4 text-2xl font-semibold text-black">Demande de contact rapide</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-600">Laissez-nous un message et nous reviendrons vers vous très vite.</p>
            <div className="mt-8 space-y-4">
              <input 
                type="text" 
                placeholder="Votre nom" 
                className="w-full rounded-3xl border border-zinc-200 bg-white px-5 py-4 text-sm text-black outline-none ring-0 transition-all duration-300 focus:border-yellow-400 focus:shadow-md focus:shadow-yellow-400/20 hover:border-yellow-300" 
              />
              <input 
                type="email" 
                placeholder="Votre email" 
                className="w-full rounded-3xl border border-zinc-200 bg-white px-5 py-4 text-sm text-black outline-none ring-0 transition-all duration-300 focus:border-yellow-400 focus:shadow-md focus:shadow-yellow-400/20 hover:border-yellow-300" 
              />
              <textarea 
                rows="4" 
                placeholder="Votre message" 
                className="w-full rounded-3xl border border-zinc-200 bg-white px-5 py-4 text-sm text-black outline-none ring-0 transition-all duration-300 focus:border-yellow-400 focus:shadow-md focus:shadow-yellow-400/20 hover:border-yellow-300"
              />
              <button className="w-full rounded-full bg-yellow-400 px-6 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-yellow-500 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/30 active:scale-95 animate__animated animate__pulse animate__infinite">
                Envoyer le message
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section Témoignages */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="px-5 pb-32 sm:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">Témoignages</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Les avis qui font confiance à TADIAVO-EO.</h2>
            </div>
            <div className="flex items-center gap-2 text-yellow-400 animate__animated animate__fadeInRight">
              {[...Array(5)].map((_, index) => <FiStar key={index} className="text-lg" />)}
              <span className="text-sm font-semibold text-zinc-700">4,9 / 5</span>
            </div>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map(({ name, role, text, initials }, index) => (
              <figure 
                key={name} 
                className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-yellow-400 animate__animated animate__flipInY"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(5)].map((_, index) => <FiStar key={index} />)}
                </div>
                <blockquote className="mt-5 text-base leading-7 text-zinc-700">"{text}"</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-3xl bg-yellow-50 text-sm font-bold text-yellow-400 transition-all duration-300 hover:scale-110 hover:rotate-12">
                    {initials}
                  </span>
                  <div>
                    <p className="font-semibold text-black">{name}</p>
                    <p className="text-sm text-zinc-500">{role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </motion.section>
    </main>
  )
}

export default Home
