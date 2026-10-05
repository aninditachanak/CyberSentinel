import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY is not set")

client = genai.Client(api_key=api_key)


def analyze_log(log_text):
    prompt = f"""
You are CyberSentinel, an AI cybersecurity investigation engine.

Analyze the following security log.

Your task is to identify potential security threats and return ONLY valid JSON.

The JSON must follow this exact structure:

{{
    "threat": "string",
    "severity": "LOW | MEDIUM | HIGH | CRITICAL",
    "confidence": 0,
    "summary": "string",
    "evidence": [
        "string"
    ],
    "timeline": [
        {{
            "time": "string",
            "event": "string"
        }}
    ],
    "mitre_attack": [
        {{
            "technique": "string",
            "name": "string",
            "reason": "string"
        }}
    ],
    "recommendations": [
        "string"
    ]
}}

Rules:
- confidence must be a number between 0 and 100.
- Do not invent evidence that does not exist in the log.
- Base the analysis only on the supplied log.
- If there is insufficient evidence for a conclusion, say so.
- Keep recommendations practical.
- Return ONLY JSON. No markdown. No explanation outside JSON.

SECURITY LOG:

{log_text}
"""

    response = client.models.generate_content(
        model="gemma-4-26b-a4b-it",
        contents=prompt
    )

    result = response.text.strip()

    # Remove markdown code fences if the model adds them
    if result.startswith("```"):
        result = result.replace("```json", "", 1)
        result = result.replace("```", "", 1)
        result = result.strip()

    try:
        return json.loads(result)

    except json.JSONDecodeError:
        return {
            "error": "AI returned invalid JSON",
            "raw_response": result
        }


if __name__ == "__main__":
    log_file = "../samples/security.log"

    with open(log_file, "r", encoding="utf-8") as file:
        log_data = file.read()

    analysis = analyze_log(log_data)

    print("\n===== CYBERSENTINEL INVESTIGATION =====\n")
    print(json.dumps(analysis, indent=4))
