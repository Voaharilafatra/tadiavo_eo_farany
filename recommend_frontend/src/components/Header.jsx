import { FiLogIn, FiUser, FiChevronDown, FiLogOut, FiBell, FiSearch } from 'react-icons/fi'
import { useState, useEffect, useRef } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import api from '../api/api'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import NotificationPopover from './NotificationPopover'

const landingNavItems = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'A propos', href: '#apropos' },
  { label: 'Service', href: '#service' },
  { label: 'Guide', href: '#guide' },
  { label: 'Contact', href: '#contact' },
]

function Header() {
  const [unreadCount, setUnreadCount] = useState(0);

  // ...

  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/users/me')
        .then((response) => setUser(response.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        });
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuccess = async (credentialResponse) => {
    try {
      // 1. Connexion Google
      const response = await api.post('/auth/login_google', {
        credential: credentialResponse.credential,
      });

      const token = response.data;
      const actualToken = token.access_token ? token.access_token : token;

      // 2. Enregistrer le token
      localStorage.setItem('token', actualToken);

      console.log(
        'Token enregistré dans le localStorage :',
        actualToken
      );

      // 3. Récupérer l'utilisateur connecté
      const userRes = await api.get('/auth/users/me');
      const user = userRes.data;

      // 4. Enregistrer l'utilisateur
      localStorage.setItem('user', JSON.stringify(user));

      console.log('User enregistré dans le localStorage :', user);

      // 5. Si c'est un prestataire, récupérer son provider_id
      if (user.role === 'prestataire') {
        try {
          const providerRes = await api.get(
            `/prestataires/owner/${user._id}`
          );

          const providerId = providerRes.data.provider_id;

          if (providerId) {
            localStorage.setItem('provider_id', providerId);

            console.log(
              'Provider ID enregistré dans le localStorage :',
              providerId
            );
          } else {
            console.warn('Provider ID introuvable');
          }

        } catch (providerError) {
          console.error(
            'Erreur récupération provider_id :',
            providerError.response?.data || providerError
          );

          // On peut continuer la connexion même si le provider_id échoue
        }
      }

      // 6. Mettre à jour le state
      setUser(user);

      // 7. Toast de succès
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: 'success',
        title: `Bienvenue, ${user.name || 'Utilisateur'} !`
      }).then(() => {
        window.location.reload();
      });

    } catch (error) {
      console.error("Erreur de connexion:", error);

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'La connexion a échoué.',
      });
    }
  };
  const handleLogout = () => {
    setIsDropdownOpen(false);
    Swal.fire({
      title: 'Déconnexion',
      text: "Voulez-vous vraiment vous déconnecter ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#eab308', // yellow-500
      cancelButtonColor: '#ef4444', // red-500
      confirmButtonText: 'Oui, me déconnecter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        setUser(null);
        window.location.reload();
      }
    });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-xl shadow-sm animate__animated animate__fadeInDown">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-10">

        {/* LOGO & NAVIGATION */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 text-lg font-extrabold text-black">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-yellow-400 text-sm font-black text-white shadow-sm">T</span>
            TADIAVO-EO
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 md:flex flex-1 justify-center px-8">
            {user ? (
              <div className="relative w-full max-w-lg">
                <input
                  type="text"
                  placeholder="Rechercher un service, un prestataire..."
                  className="w-full rounded-full border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-400/20"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-lg" />
              </div>
            ) : (
              landingNavItems.map((item) => (
                <a key={item.href} href={item.href} className="transition hover:text-yellow-400">
                  {item.label}
                </a>
              ))
            )}
          </nav>
        </div>

        {/* SECTION UTILISATEUR / BOUTON CONNEXION */}
        <div className="hidden items-center md:flex gap-4">
          {user ? (
            <>
              <NotificationPopover user={user} />
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 rounded-full hover:bg-zinc-50 p-1 pr-3 transition border border-transparent hover:border-zinc-200"
                >
                  <div className="relative">
                    <img
                      src={user.picture || 'https://via.placeholder.com/40'}
                      alt="Profil"
                      className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                    />
                    {/* Point vert (en ligne) */}
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                  </div>

                  <div className="flex flex-col items-start">
                    <span className="text-sm font-bold text-black leading-tight">
                      {user.name || user.email?.split('@')[0]}
                    </span>
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      {user.role === 'admin' ? 'Admin' : user.role === 'prestataire' ? 'Pro' : 'Client'}
                    </span>
                  </div>

                  <FiChevronDown className={`text-zinc-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Menu Déroulant (Dropdown) */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white shadow-xl border border-zinc-100 overflow-hidden animate__animated animate__fadeIn animate__faster">
                    <div className="p-4 border-b border-zinc-50 bg-zinc-50/50">
                      <p className="text-sm font-bold text-black">{user.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>

                    <div className="p-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-yellow-50 hover:text-yellow-600"
                      >
                        <FiUser /> Voir mon profil
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 mt-1"
                      >
                        <FiLogOut /> Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="overflow-hidden rounded-full shadow-sm hover:shadow-md transition-shadow">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => alert("Impossible de se connecter avec Google.")}
                useOneTap
                shape="pill"
                type="standard"
                text="signin_with"
              />
            </div>
          )}
        </div>

        {/* VERSION MOBILE */}
        <button
          onClick={user ? () => navigate('/profile') : undefined}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:bg-yellow-50 md:hidden relative"
          aria-label={user ? "Profil" : "Connexion"}
        >
          {user ? (
            <>
              <img src={user.picture || 'https://via.placeholder.com/40'} alt="Profil" className="h-full w-full rounded-full object-cover" />
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
            </>
          ) : <FiLogIn className="h-5 w-5" />}
        </button>
      </div>
    </header>
  )
}

export default Header