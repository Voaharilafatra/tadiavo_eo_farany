import 'animate.css'

function Loader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-5 py-20">
      <div className="flex flex-col items-center gap-8 animate__animated animate__fadeIn">
        {/* Modern clean spinner */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 h-full w-full animate-spin rounded-full border-[3px] border-gray-100 border-t-yellow-400" />
          <div className="absolute h-16 w-16 rounded-full bg-yellow-50 flex items-center justify-center">
            <span className="text-3xl font-black text-yellow-400">T</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 animate-pulse">
            Tadiavo-eo
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">
              Chargement...
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loader
