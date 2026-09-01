import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { motion } from 'framer-motion'

function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
      className="border-t border-zinc-200/10 bg-yellow-900 px-5 py-16 text-white sm:px-8 lg:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <a href="/" className="flex items-center gap-3 text-white">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-yellow-400 text-lg font-black text-white shadow-lg shadow-yellow-400/20">T</span>
            <span className="text-xl font-bold tracking-tight">TADIAVO-EO</span>
          </a>
          <p className="mt-6 max-w-sm text-sm leading-7 text-zinc-400">
            La plateforme de référence pour découvrir, comparer et contacter les meilleurs prestataires de services locaux. Une expérience fluide et sécurisée.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">Liens rapides</h3>
          <div className="mt-6 grid gap-4 text-sm text-zinc-400">
            <a href="/" className="transition hover:text-white hover:translate-x-1">Accueil</a>
            <a href="/oauth" className="transition hover:text-white hover:translate-x-1">Connexion</a>
            <a href="/dashboard" className="transition hover:text-white hover:translate-x-1">Mon Espace</a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">Contact</h3>
          <a href="mailto:mivononaandrehy7@gmail.com" className="mt-6 block text-sm text-zinc-400 transition hover:text-white">mivononaandrehy7@gmail.com</a>
          <div className="mt-8 flex items-center gap-4">
            <a 
              href="#" 
              className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-zinc-400 transition-all hover:bg-yellow-400 hover:text-white hover:-translate-y-1"
              aria-label="Facebook"
            >
              <FaFacebook className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-zinc-400 transition-all hover:bg-yellow-400 hover:text-white hover:-translate-y-1"
              aria-label="Instagram"
            >
              <FaInstagram className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-zinc-400 transition-all hover:bg-yellow-400 hover:text-white hover:-translate-y-1"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between border-t border-white/10 pt-8 text-xs text-zinc-500 sm:flex-row">
        <p>Copyright © 2026 TADIAVO-EO. Tous droits réservés.</p>
        <div className="mt-4 flex gap-6 sm:mt-0">
          <a href="#" className="hover:text-white transition">Mentions légales</a>
          <a href="#" className="hover:text-white transition">Confidentialité</a>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer