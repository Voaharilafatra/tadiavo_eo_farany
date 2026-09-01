import api from './api'

export const devenirProService = {

    createPrestataire: async (prestataireData) => {
        const response = await api.post('/prestataire', prestataireData)
        return response.data
    },

}