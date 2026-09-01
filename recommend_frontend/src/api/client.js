import axios from 'axios';

// 1. Création de l'instance Axios avec l'URL de base définie dans le fichier .env
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Intercepteur de REQUÊTE : Ajouter le token JWT à chaque appel
apiClient.interceptors.request.use(
  (config) => {
    // On récupère le token stocké dans le navigateur
    const token = localStorage.getItem('token');
    
    // Si on a un token, on l'ajoute dans les headers d'autorisation
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Intercepteur de RÉPONSE : Gérer les erreurs (ex: token expiré)
apiClient.interceptors.response.use(
  (response) => {
    // Si la requête réussit, on renvoie simplement la réponse
    return response;
  },
  (error) => {
    // Si l'erreur est "401 Unauthorized" (token invalide ou expiré)
    if (error.response && error.response.status === 401) {
      console.warn("Token expiré ou invalide. Déconnexion de l'utilisateur...");
      
      // On supprime le mauvais token
      localStorage.removeItem('token');
      
      // On redirige vers la page d'accueil ou de login si nécessaire
      // window.location.href = '/login'; 
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
