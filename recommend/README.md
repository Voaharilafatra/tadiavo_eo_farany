# Recommendation API

Backend de l'application de recommandation développé avec **FastAPI** et **MongoDB**.

---

# Technologies

- Python 3.13+
- FastAPI
- MongoDB
- Motor (MongoDB Async Driver)
- Pydantic
- Pytest
- Ruff

---
cd backend

# Créer un environnement virtuel

Linux / macOS

```bash
python3 -m venv .venv
```

Windows

```bash
python -m venv .venv
```

---

# Activer l'environnement virtuel

Linux / macOS

```bash
source .venv/bin/activate
```

Windows

```powershell
.venv\Scripts\activate
```

---

# Installer les dépendances

Toutes les dépendances sont installées avec :

```bash
pip install -r requirements.txt
```

Le projet utilise notamment :

- FastAPI
- Uvicorn
- Motor
- PyMongo
- Pydantic
- Pydantic Settings
- Python Dotenv
- HTTPX
- Email Validator
- Pytest
- Pytest Asyncio
- Ruff

---

# Variables d'environnement

Créer le fichier .env identique a .env.example :

```
.env
```


# Lancer MongoDB

Si MongoDB est installé localement :

```bash
sudo systemctl start mongod
```

ou lancer votre instance MongoDB Atlas.

---

# Démarrer le serveur

```bash
uvicorn app.main:app --reload
```

L'API sera disponible à :

```
http://127.0.0.1:8000
```

---

# Documentation

Swagger

```
http://127.0.0.1:8000/docs
```

ReDoc

```
http://127.0.0.1:8000/redoc
```

---

# Lancer les tests

Tous les tests

```bash
pytest
```

Tests avec détails

```bash
pytest -v
```

Tests asynchrones

```bash
pytest -v -s
```

---

# Vérification du style du code

Analyser le projet

```bash
ruff check .
```

Corriger automatiquement

```bash
ruff check . --fix
```

---

# Structure du projet

```
app/
│
├── api/
├── core/
├── database/
├── models/
├── repositories/
├── schemas/
├── services/
├── utils/
├── main.py
│
tests/
│
requirements.txt
.env.example
README.md
```

---

# Dépendances principales

| Package | Utilisation |
|----------|-------------|
| FastAPI | Framework API |
| Uvicorn | Serveur ASGI |
| Motor | Driver MongoDB asynchrone |
| PyMongo | Driver MongoDB |
| Pydantic | Validation des données |
| Pydantic Settings | Gestion de la configuration |
| Python Dotenv | Chargement du fichier `.env` |
| HTTPX | Client HTTP pour les tests et appels API |
| Email Validator | Validation des adresses e-mail |
| Pytest | Framework de tests |
| Pytest Asyncio | Tests asynchrones |
| Ruff | Analyse statique et formatage du code |

---

# Installer une nouvelle dépendance

```bash
pip install <package>
```

Mettre ensuite à jour les dépendances :

```bash
pip freeze > requirements.txt
```

---

# Mettre à jour le projet

```bash
git pull origin main

pip install -r requirements.txt
```

---

# Avant chaque Push

Vérifier le style :

```bash
ruff check .
```

Lancer les tests :

```bash
pytest
```

Puis :

```bash
git add .

git commit -m "Description"

git push origin <branch>
```

---

# Contribution

1. Créer une nouvelle branche

```bash
git checkout -b feature/nom-feature
```

2. Développer la fonctionnalité.

3. Vérifier le style du code.

```bash
ruff check .
```

4. Vérifier les tests.

```bash
pytest
```

5. Envoyer la branche.

```bash
git push origin feature/nom-feature
```

6. Ouvrir une Pull Request.
