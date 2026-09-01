from bson import ObjectId


def serialize_mongo(value):

    if isinstance(value, ObjectId):
        return str(value)

    if isinstance(value, list):
        return [serialize_mongo(item) for item in value]

    if isinstance(value, dict):
        return {key: serialize_mongo(val) for key, val in value.items()}

    return value


def serialize_mongo_list(documents: list[dict]) -> list[dict]:
    return [serialize_mongo(document) for document in documents]
