from google.oauth2 import id_token
from google.auth.transport import requests

from app.core.config import settings


def verify_google_credential(
    credential: str,
) -> dict:

    try:
        idinfo = id_token.verify_oauth2_token(
            credential,
            requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )

    except Exception as exc:
        print("Erreur detaillee Google verify_oauth2_token:", str(exc))
        raise ValueError("Invalid Google credential.") from exc

    return idinfo
