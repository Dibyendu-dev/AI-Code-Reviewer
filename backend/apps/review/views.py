import os
import json
from .schema import CodeReviewSchema
from rest_framework.decorators import api_view
from rest_framework.response import Response
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel('gemini-3-flash-preview')


@api_view(['POST'])
def review_code(request):

    # Try several sources for the incoming code to be robust to JSON or form-data.
    code = None
    try:
        code = request.data.get("code")
    except Exception:
        code = None

    if not code:
        # Fallback to Django's standard POST parsing (e.g., multipart/form-data)
        code = request.POST.get("code")

    if not code:
        # As a last resort, attempt to parse raw JSON body.
        try:
            body = request.body.decode("utf-8")
            parsed = json.loads(body) if body else {}
            code = parsed.get("code")
        except Exception:
            code = None

    if not code:
        # Include helpful debug hints in the response to diagnose the client payload.
        return Response(
            {
                "error": "No code provided",
                "debug": {
                    "content_type": request.content_type,
                    "data_keys": list(request.data.keys()) if hasattr(request, "data") else None,
                    "post_keys": list(request.POST.keys()),
                    "raw_body": request.body.decode("utf-8", errors="replace")[:1000],
                },
            },
            status=400,
        )

    prompt = f"""
        You are a senior code reviewer AI.

        Analyze the given code and return ONLY valid JSON.

        STRICT OUTPUT FORMAT:

        {{
        "overallScore": number (0-10),
        "summary": string,
        "issues": [
            {{
            "title": string,
            "description": string,
            "severity": "LOW" | "MEDIUM" | "HIGH",
            "line": number or null
            }}
        ],
        "suggestions": [
            {{
            "improvement": string,
            "example_fix": string
            }}
        ],
        "strengths": [string]
        }}

        Rules:
        - Do NOT return anything except JSON
        - No markdown
        - No explanations outside JSON

        Code:
        {code}
        """

    try:
        response = model.generate_content(
            prompt,
            generation_config={
                "response_mime_type": "application/json"
            }
        )

        raw_output = response.text

        # Clean Gemini weird formatting (important)
        cleaned = raw_output.strip().replace("```json", "").replace("```", "")

        parsed_json = json.loads(cleaned)

        # Validate with schema
        validated = CodeReviewSchema(**parsed_json)

        return Response(validated.dict())

    except Exception as e:
        return Response({
            "error": str(e),
            "raw_output": raw_output if 'raw_output' in locals() else None
        }, status=500)