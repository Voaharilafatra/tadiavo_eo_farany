import api from './api'

export const globalClientService = {



    registerView: async (prestataireId) => {
        const response = await api.post(
            `/prestataires/${prestataireId}/views`
        )

        return response.data
    },

    getOnePrestataire: async (prestataireId) => {
        const response = await api.get(`/prestataires/${prestataireId}`)
        return response.data
    },

    createReview: async (prestataireId, reviewData) => {
        const response = await api.post(
            `/reviews/${prestataireId}`,
            reviewData
        )

        return response.data
    },

    // Récupérer les avis d'un prestataire
    getPrestataireReviews: async (prestataireId) => {
        const response = await api.get(
            `/reviews/provider/${prestataireId}`
        )

        return response.data
    },

    // Supprimer un avis
    deleteReview: async (reviewId) => {
        const response = await api.delete(
            `/reviews/${reviewId}`
        )

        return response.data
    },

}