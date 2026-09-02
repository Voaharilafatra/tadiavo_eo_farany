import api from './api'

export const prestataireDashboardService = {

    // Récupérer tous les services d'un prestataire
    getPrestataireServices: async (prestataireId) => {
        const response = await api.get(
            `/prestataires/${prestataireId}/services`
        )

        return response.data
    },

    // Récupérer un service précis d'un prestataire
    getPrestataireService: async (prestataireId, serviceId) => {
        const response = await api.get(
            `/prestataires/${prestataireId}/services/${serviceId}`
        )

        return response.data
    },

    updateService: async (serviceId, data) => {
        const response = await api.patch(
            `/prestataires/${serviceId}`,
            data
        )

        return response.data
    },
    // Récupérer le dashboard d'un prestataire
    getPrestataireDashboard: async (prestataireId) => {
        const response = await api.get(
            `/prestataires/${prestataireId}/dashboard`
        )

        return response.data
    },

    // Ajouter une image à un prestataire
    uploadPrestataireImage: async (prestataireId, file) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await api.post(
            `/prestataires/${prestataireId}/images`,
            formData
        )

        return response.data
    },

    async addService(serviceData) {
        const providerId = localStorage.getItem('provider_id')

        if (!providerId) {
            throw new Error('Provider ID introuvable.')
        }

        const response = await api.post(
            `/prestataires/${providerId}/services`,
            serviceData
        )

        return response.data
    },
}