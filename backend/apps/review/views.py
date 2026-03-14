import os
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
            import json
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
    You are a senior software engineer.

    Review this code and return:
    1. Bugs
    2. Security issues
    3. Improvements
    4. Suggested fixes

    Code:
    {code}
    """

    try:

        response = model.generate_content(prompt)

        review = response.text

        return Response({
            "review": review
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)