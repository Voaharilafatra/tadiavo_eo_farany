import { FiArrowUp } from 'react-icons/fi'
import { useState, useEffect } from 'react'

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-50 grid h-12 w-12 place-items-center rounded-full bg-yellow-400 text-white shadow-lg shadow-yellow-400/30 transition-all duration-300 hover:bg-yellow-500 hover:scale-110 hover:shadow-yellow-400/50 md:bottom-8 md:right-8"
          aria-label="Retour en haut"
        >
          <FiArrowUp className="h-6 w-6" />
        </button>
      )}
    </>
  )
}

export default BackToTop