import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@api_view(['POST'])
def review_code(request):

    code = request.data.get("code")

    if not code:
        return Response({"error": "No code provided"}, status=400)

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

        completion = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are an expert code reviewer"},
                {"role": "user", "content": prompt}
            ]
        )

        review = completion.choices[0].message.content

        return Response({
            "review": review
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)