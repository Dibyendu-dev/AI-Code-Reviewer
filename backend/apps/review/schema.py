# schema.py
from pydantic import BaseModel
from typing import List, Literal

class Issue(BaseModel):
    title: str
    description: str
    severity: Literal["LOW", "MEDIUM", "HIGH"]
    line: int | None

class Suggestion(BaseModel):
    improvement: str
    example_fix: str

class CodeReviewSchema(BaseModel):
    overallScore: float
    summary: str
    issues: List[Issue]
    suggestions: List[Suggestion]
    strengths: List[str]