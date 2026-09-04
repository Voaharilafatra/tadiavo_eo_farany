import api from './api'

export const devenirProService = {
  createPrestataire: async (prestataireData) => {
    const response = await api.post('/prestataires', prestataireData)

    const prestataire = response.data

    const providerId = prestataire?.id || prestataire?._id

    if (!providerId) {
      throw new Error("L'ID du prestataire n'a pas été retourné par le serveur")
    }

    localStorage.setItem('provider_id', providerId)

    return prestataire
  },
}