import { FiSearch, FiChevronDown, FiUser, FiLogOut } from 'react-icons/fi'
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

function ProviderHeader({ user, onSearch }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    setIsDropdownOpen(false)
    Swal.fire({
      title: 'Déconnexion',
      text: "Voulez-vous vraiment vous déconnecter ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#eab308',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Oui, me déconnecter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token')
        window.location.href = '/'
      }
    })
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/client/recherche?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-10">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 text-lg font-extrabold text-black">
          <span className="grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-xl bg-yellow-400 text-sm font-black text-white shadow-sm">T</span>
          <span className="hidden sm:inline">TADIAVO-EO</span>
        </Link>


        {/* PROFIL */}
        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 rounded-full hover:bg-zinc-50 p-1 pr-3 transition border border-transparent hover:border-zinc-200"
            >
              <div className="relative">
                <img 
                  src={user?.picture || 'https://via.placeholder.com/40'} 
                  alt="Profil" 
                  className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                />
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
              </div>
              
              <div className="hidden flex-col items-start md:flex">
                <span className="text-sm font-bold text-black leading-tight">
                  {user?.name || user?.email?.split('@')[0]}
                </span>
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  {user?.role === 'prestataire' ? 'Prestataire' : 'Client'}
                </span>
              </div>
              <FiChevronDown className={`text-zinc-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white shadow-xl border border-zinc-100 overflow-hidden">
                <div className="p-4 border-b border-zinc-50 bg-zinc-50/50">
                  <p className="text-sm font-bold text-black">{user?.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                </div>
                <div className="p-2">
                  <Link 
                    to={user?.role === 'prestataire' ? "/prestataire/profile" : "/client/profile"} 
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
        </div>
      </div>
    </header>
  )
}
export default ProviderHeader
