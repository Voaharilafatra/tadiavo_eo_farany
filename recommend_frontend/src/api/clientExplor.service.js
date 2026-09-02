import api from './api'

const clientExplorerService = {
  // -----------------------------
  // Données pour les filtres
  // -----------------------------

  getCategories: async () => {
    const response = await api.get('/search/categories')
    return response.data
  },

  getCities: async () => {
    const response = await api.get('/search/cities')
    return response.data
  },

  getNeighborhoods: async () => {
    const response = await api.get('/search/neighborhoods')
    return response.data
  },

  getServices: async () => {
    const response = await api.get('/search/services')
    return response.data
  },

  getFeatures: async () => {
    const response = await api.get('/search/features')
    return response.data
  },

  // -----------------------------
  // Recherche en langage naturel
  // -----------------------------

  naturalSearch: async (query) => {
    const response = await api.post('/search/langage_natural', {
      query
    })

    return response.data
  },

  // -----------------------------
  // Recherche classique
  // -----------------------------

  classicSearch: async (criteria = {}) => {
    const response = await api.post('/search/classic', criteria)

    return response.data
  },

  // -----------------------------
  // Recommandations
  // -----------------------------

  getRecommendationsForMe: async () => {
    const response = await api.get('/recommendations/for_me')

    return response.data
  }
}

export default clientExplorerService