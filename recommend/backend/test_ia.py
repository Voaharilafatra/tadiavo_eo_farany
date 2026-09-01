import asyncio

from app.services.ai_service import analyze_comment


async def main():

    services = [
        {
            "id": "service_1",
            "name": "Pizza",
            "description": "Pizza artisanale au fromage",
        },
        {
            "id": "service_2",
            "name": "Glace vanille",
            "description": "Glace artisanale à la vanille",
        },
        {
            "id": "service_3",
            "name": "Burger",
            "description": "Burger maison",
        },
    ]

    comment = """
    La pizza était vraiment excellente.
    Par contre la glace était beaucoup trop sucrée.
    Je n'ai pas essayé le burger.
    """

    result = await analyze_comment(
        comment=comment,
        services=services,
    )

    print(result)


asyncio.run(main())
