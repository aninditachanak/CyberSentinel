import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY is not set")

client = genai.Client(api_key=api_key)

response = client.models.generate_content(
    model="gemma-4-26b-a4b-it",
    contents="""
You are CyberSentinel, an AI cybersecurity investigation assistant.

Analyze this security event:

Failed password for admin from 185.23.44.91
Failed password for admin from 185.23.44.91
Failed password for root from 185.23.44.91
Accepted password for admin from 185.23.44.91

Give me:

1. Threat type
2. Severity
3. Evidence
4. Recommended actions

Keep the answer concise and security-focused.
"""
)

print("\n===== CYBERSENTINEL AI ANALYSIS =====\n")
print(response.text)
