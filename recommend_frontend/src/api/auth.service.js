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
    const response = await api.get('/authusers/me'); // Updated based on FASTAPI_BACKEND_SPEC.md 
    return response.data;
  }
};
