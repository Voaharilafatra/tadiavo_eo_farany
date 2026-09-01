# TADIAVO-EO - Documentation du Frontend

TADIAVO-EO est une plateforme web de mise en relation entre clients et prestataires de services locaux. Ce depot contient exclusivement le code source du frontend de l'application. Le projet integre une recherche par geolocalisation, une gestion des profils et un systeme d'avis.

---

## 1. Vue d'ensemble du Projet

### Fonctionnalites principales
*   **Recherche et Decouverte :** Moteur de recherche de prestataires avec filtres par categorie, distance et mots-cles.
*   **Geolocalisation :** Affichage interactif des prestataires sur une carte (OpenStreetMap via Leaflet) avec marqueurs et cluters.
*   **Systeme d'Avis :** Consultation, ajout et reponse aux avis des clients.
*   **Tableaux de Bord (Dashboard) :** Espaces privatifs destines a la gestion du profil, des favoris (clients) et des statistiques/services publies (prestataires).
*   **Authentification :** Gestion des sessions via un contexte global, incluant le support pour Google OAuth.

### Technologies et Bibliotheques
*   **Framework :** React 19
*   **Build Tool :** Vite
*   **CSS & UI :** Tailwind CSS v4
*   **Routage :** React Router DOM v6
*   **Cartographie :** Leaflet, React-Leaflet
*   **Animations :** Framer Motion, Animate.css
*   **Iconographie :** React-Icons (Feather Icons)
*   **Requetes HTTP (Optionnel/Prevues) :** Axios (configure dans package.json)

---

## 2. Guide d'Installation et de Demarrage

### Prerequis
*   Node.js (version 18 ou superieure)
*   NPM ou Yarn

### Installation

1.  **Cloner le depot localement :**
    ```bash
    git clone https://github.com/votre-organisation/tadiavo-eo-frontend.git
    cd tadiavo-eo-frontend
    ```

2.  **Installer les dependances :**
    ```bash
    npm install
    ```

3.  **Configurer les variables d'environnement :**
    Copiez le fichier `.env.example` s'il est present et renommez-le en `.env`.
    Assurez-vous de renseigner les URL de l'API backend et les cles publiques.
    ```env
    VITE_API_BASE_URL=http://localhost:8000/api
    VITE_GOOGLE_MAPS_API_KEY=votre_cle_api_ici
    ```

4.  **Demarrer le serveur de developpement :**
    ```bash
    npm run dev
    ```
    L'application sera accessible a l'adresse : `http://localhost:5173`.

---

## 3. Architecture du Code

Le code source est situe dans le repertoire `src/` et est structure de la maniere suivante :

*   `assets/` : Ressources statiques (images, logos, SVGs).
*   `components/` : Composants React reutilisables (boutons, formulaires, en-tetes).
    *   `auth/` : Composants de protection des routes (PrivateRoute).
    *   `maps/` : Composants encapsulant la logique Leaflet (LeafletMap, MapComponent).
*   `contexts/` : Fichiers de gestion d'etat global (ex: `AuthContext.jsx` pour la gestion de l'authentification et de la session utilisateur).
*   `data/` : Fichiers contenant des donnees statiques (Mock Data) utilisees pour le developpement et la simulation de l'API.
*   `pages/` : Les differentes vues de l'application (Accueil, Recherche, OAuth, Details de service).
    *   `dashboard/` : Vues specifiques de l'espace connecte (Admin, Client, Prestataire).
*   `App.jsx` : Configuration principale du routage et definition de la structure de l'application (Layout dynamique selon l'itineraire).
*   `main.jsx` : Point d'entree de l'application React.
*   `index.css` : Styles globaux et variables CSS personnalisees injectees pour le theme Tailwind.

---

## 4. Routage et Navigation

L'application utilise `React Router DOM` pour la gestion de la navigation client. Voici les routes principales :

*   **Publiques :**
    *   `/` : Page d'accueil (Landing Page).
    *   `/oauth` : Page de connexion et d'inscription.
    *   `/service/:id` : Page de detail d'un service (accessible publiquement mais utilise le layout de navigation de type Dashboard).
*   **Privees (necessite une authentification via `PrivateRoute`) :**
    *   `/dashboard` : Tableau de bord principal.
    *   `/profile` : Parametres de l'utilisateur.
    *   `/search` : Interface de recherche detaillee avec liste et carte.
    *   `/map` : Vue carte en plein ecran.
    *   `/favorites` : Liste des services favoris du client.
    *   `/my-services` : Gestion des services pour un prestataire.
    *   `/my-reviews` : Gestion et consultation des avis.

---

## 5. Specifications de l'API (Backend Integration)

Le frontend a ete concu pour se connecter a une API REST (voir le fichier complet `FASTAPI_BACKEND_SPEC.md`).
Les modules frontend devront s'appuyer sur ces points de terminaison une fois l'integration avec le backend finalisee :

*   **Utilisateurs & Auth :** `/auth/login`, `/auth/google`, `/users/me`
*   **Services :** `/services`, `/services/{id}`, `/services/search`, `/services/nearby`
*   **Favoris & Avis :** `/users/me/favorites`, `/services/{id}/reviews`, `/reviews/{id}/reply`
*   **Tableaux de Bord :** `/dashboard/summary`, `/dashboard/stats`

---

## 6. Scripts de Developpement

*   `npm run dev` : Lance le serveur Vite en mode developpement avec Hot Module Replacement (HMR).
*   `npm run build` : Compile l'application pour la production dans le repertoire `dist/`.
*   `npm run lint` : Analyse statique du code (ESLint) pour identifier les erreurs de syntaxe.
*   `npm run preview` : Lance un serveur local pour previsualiser le build de production.

---

## 7. Contribution

1.  Creez une branche a partir de `main` : `git checkout -b feature/nom-de-la-fonctionnalite`
2.  Assurez-vous que le linter ne remonte aucune erreur avant de valider : `npm run lint`
3.  Validez vos modifications : `git commit -m "Description detaillee des changements"`
4.  Poussez vos changements : `git push origin feature/nom-de-la-fonctionnalite`
5.  Ouvrez une Pull Request pour revue de code.

---

## 8. Licence

Ce projet est distribue sous la licence MIT. Vous etes libre de l'utiliser et de le modifier.
