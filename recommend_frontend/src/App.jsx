import { lazy, Suspense, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Loader from './components/Loader.jsx'
import MobileNav from './components/MobileNav.jsx'
import BackToTop from './components/BackToTop.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const OAuth = lazy(() => import('./pages/OAuth.jsx'))

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-400/20 border-t-yellow-400" />
    </div>
  )
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function Layout() {
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
      {showLoader ? <Loader /> : <Layout />}
    </BrowserRouter>
  )
}

export default App
