import api from './api';



export const authService = {

  loginWithGoogle: async (credential) => {
    const response = await api.post("/auth/login_google", {
      credential,
    });
    console.log("Réponse de l'API après la connexion Google :", response.data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/users/me'); // Updated based on FASTAPI_BACKEND_SPEC.md 
    return response.data;
  },
  
};
// src/utils/providerStorage.js

export const enrichProviderStorage = async (user) => {
  if (!user?._id) {
    console.warn('User ID introuvable')
    return null
  }

  try {
    const response = await api.get(
      `/prestataires/owner/${user._id}`
    )

    const providerId = response.data.provider_id

    if (!providerId) {
      console.warn('Provider ID introuvable')
      return null
    }

    localStorage.setItem('provider_id', providerId)
console.log('provider_id enregistré dans le localStorage :', providerId)
    console.log('provider_id enregistré :', providerId)

    return providerId
  } catch (error) {
    console.error(
      'Erreur récupération provider_id :',
      error.response?.data || error
    )

    return null
  }
}