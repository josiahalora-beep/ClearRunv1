from datetime import datetime, UTC
from typing import Optional, Annotated
from pydantic import BaseModel, Field, BeforeValidator, EmailStr
from bson import ObjectId


def validate_object_id(v):
    if isinstance(v, ObjectId):
        return str(v)
    if isinstance(v, str):
        return v
    raise ValueError("Invalid ObjectId")


PyObjectId = Annotated[str, BeforeValidator(validate_object_id)]


class BaseDocument(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}

    @classmethod
    def from_mongo(cls, doc):
        if doc is None:
            return None
        return cls(**doc)

    def to_mongo(self):
        data = self.model_dump(by_alias=True, exclude_none=True)
        if data.get("_id") is None:
            data.pop("_id", None)
        return data


class LeadSubmission(BaseDocument):
    lead_type: str  # "trial" | "mockup" | "contact" | "partner" | "pilot"
    name: str
    business_name: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    service_type: Optional[str] = None
    message: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class LeadSubmissionCreate(BaseModel):
    lead_type: str
    name: str
    business_name: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    service_type: Optional[str] = None
    message: Optional[str] = None
