import { lazy, Suspense, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Loader from './components/Loader.jsx'
import MobileNav from './components/MobileNav.jsx'
import BackToTop from './components/BackToTop.jsx'

import ClientLayout from './layouts/ClientLayout.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const OAuth = lazy(() => import('./pages/OAuth.jsx'))
const ClientHome = lazy(() => import('./pages/client/ClientHome.jsx'))
const ResultatsRecherche = lazy(() => import('./pages/client/ResultatsRecherche.jsx'))
const ProviderInfo = lazy(() => import('./pages/client/ProviderInfo.jsx'))
const BecomeProviderForm = lazy(() => import('./pages/client/BecomeProviderForm.jsx'))
const HomePrestataire = lazy(() => import('./pages/provider/HomePrestataire.jsx'))

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-400/20 border-t-yellow-400" />
    </div>
  )
}

function Layout() {
  const isAuth = !!localStorage.getItem('token');

  if (isAuth) {
    return <Navigate to="/client" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/oauth" element={<OAuth />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <MobileNav />
      <BackToTop />
    </div>
  )
}

function App() {
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <BrowserRouter>
      {showLoader ? <Loader /> : (
        <Routes>
          {/* Routes Client avec le Layout spécifique */}
          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<Suspense fallback={<PageLoader />}><ClientHome /></Suspense>} />
            <Route path="recherche" element={<Suspense fallback={<PageLoader />}><ResultatsRecherche /></Suspense>} />
            <Route path="devenir-prestataire" element={<Suspense fallback={<PageLoader />}><BecomeProviderForm /></Suspense>} />
          </Route>

          {/* Route Info Prestataire sans Header/Footer global */}
          <Route path="/client/prestataire/:id" element={<Suspense fallback={<PageLoader />}><ProviderInfo /></Suspense>} />
          
          {/* Routes Prestataire (pourrait avoir son propre layout plus tard) */}
          <Route path="/prestataire" element={<Suspense fallback={<PageLoader />}><HomePrestataire /></Suspense>} />

          {/* Routes publiques */}
          <Route path="/*" element={<Layout />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}

export default App
