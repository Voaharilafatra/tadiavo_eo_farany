from google import genai

from app.core.config import settings
from app.schemas.ia_schema import CommentAnalysis
from app.schemas.searches_schema import AIExtractedSearch
from app.repositories.category_repo import get_available_category_slugs


client = genai.Client(api_key=settings.API_KEY)


async def extract_search_criteria(
    query: str,
) -> AIExtractedSearch:

    category_slugs = await get_available_category_slugs()

    categories_text = "\n".join(f"- {slug}" for slug in category_slugs)
    prompt = f"""
Tu es le système d'interprétation des recherches
d'une application de recommandation locale.

Recherche utilisateur :
"{query}"

Extrais uniquement les critères réellement présents
ou clairement déductibles.

Retourne :

- category_slugs
- service
- city
- neighborhood
- max_price
- min_rating
- features

Règles :

1. N'invente aucune information.
2. Si un critère n'est pas présent, retourne null.
3. category_slugs doit contenir uniquement les catégories
   fournies dans la liste ci-dessous.
4. Ne retourne jamais un ObjectId MongoDB.
5. max_price est en MGA.
6. Retourne uniquement le JSON demandé.

Catégories disponibles :
{categories_text}

"""

    response = await client.aio.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": AIExtractedSearch,
        },
    )

    return AIExtractedSearch.model_validate_json(response.text)


async def analyze_comment(
    comment: str,
    services: list[dict],
) -> CommentAnalysis:

    services_text = "\n".join(
        [
            f"""
            ID: {service["id"]}
            Nom: {service["name"]}
            Description: {service.get("description", "")}
            """
            for service in services
        ]
    )

    prompt = f"""
Tu es un système d'analyse de commentaires pour une plateforme
de recommandation de services.

Voici les services proposés par un établissement :

{services_text}

Voici le commentaire laissé par un utilisateur :

"{comment}"

Ta tâche :

1. Identifie uniquement les services réellement concernés
   par le commentaire.

2. Pour chaque service concerné, attribue un score :

   +2 = très positif
   +1 = positif
    0 = neutre
   -1 = négatif
   -2 = très négatif

3. Si le commentaire ne permet pas d'évaluer un service,
   ne retourne PAS ce service.

4. Utilise uniquement les IDs des services fournis.

5. N'invente jamais de service.

Retourne uniquement les données correspondant au schéma demandé.
"""

    response = await client.aio.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": CommentAnalysis,
        },
    )

    return CommentAnalysis.model_validate_json(response.text)
