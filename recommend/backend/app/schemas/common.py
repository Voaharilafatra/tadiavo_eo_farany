from typing import Annotated

from bson import ObjectId
from pydantic import BeforeValidator


def validate_object_id(value):
    if isinstance(value, ObjectId):
        return value

    if ObjectId.is_valid(value):
        return ObjectId(value)

    raise ValueError("Invalid ObjectId")


PyObjectId = Annotated[ObjectId, BeforeValidator(validate_object_id)]
