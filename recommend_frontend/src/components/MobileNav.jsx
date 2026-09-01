import { FiCompass, FiHome, FiLogIn, FiMessageSquare, FiShield } from 'react-icons/fi'

const routes = [
  { label: 'Accueil', href: '#accueil', icon: FiHome },
  { label: 'Service', href: '#service', icon: FiCompass },
  { label: 'Guide', href: '#guide', icon: FiShield },
  { label: 'Contact', href: '#contact', icon: FiMessageSquare },
]

function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white/95 shadow-[0_-20px_40px_-24px_rgba(15,23,42,0.2)] md:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        {routes.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            className="inline-flex flex-col items-center gap-1 rounded-3xl px-3 py-2 text-xs font-medium text-zinc-600 transition hover:bg-yellow-50 hover:text-yellow-400"
          >
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-yellow-50 text-yellow-400">
              <Icon className="h-4 w-4" />
            </span>
            {label}
          </a>
        ))}

        <a
          href="/oauth"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400 text-white shadow-lg shadow-yellow-400/30 transition hover:bg-yellow-500"
          aria-label="Connexion"
        >
          <FiLogIn className="h-5 w-5" />
        </a>
      </div>
    </nav>
  )
}

export default MobileNav