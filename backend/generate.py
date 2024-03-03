import json
import os

from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

# Load environment variables from .env file
load_dotenv()

# Load the trasncript JSON data
with open("./data/transcript.json", "r") as file:
    data = json.load(file)

# Extract and format the transcript text
formatted_transcript = "\n".join(
    [f'{entry["speaker"]}: {entry["text"]}' for entry in data["transcript"]]
)

# Now, you can access your API key securely
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError(
        "API key not found. Please set the OPENAI_API_KEY environment variable."
    )

# Prompt template
template = """Transcript in JSON: {transcript}

Context: Using only the detailed information from a telehealth call transcript provided without hallucinating and leaving fields blank if you don't have the required information, generate a SOAP note that adheres to the following structured format, including all relevant medical and clinical information under each heading and subheading as detailed below:

1. Subjective (S):
    - Chief Complaint (CC): Summarize the patient's primary complaint or reason for the visit in one or two sentences.
    - History of Present Illness (HPI): Provide details of the chief complaint using the "OLDCARTS" methodology (Onset, Location, Duration, Characterization, Alleviating/Aggravating factors, Radiation, Temporal factors, Severity).
    - History:
        - Medical history: Note any relevant current or past medical conditions.
        - Surgical history: Include details of past surgeries with years if possible.
        - Family history: Document relevant family medical history.
        - Social History: Use the "HEADSS" acronym (Home, Education/Employment, Eating, Activities, Drugs, Sexuality, Suicide/Depression) to summarize the patient's social circumstances.
    - Review of Systems (ROS): List symptoms the patient has mentioned, organized by system (General, Gastrointestinal, Musculoskeletal, etc.).
    - Current Medications, Allergies: List any current medications including the dose, route, and frequency, as well as any known allergies.
2. Objective (O):
    - Document objective data from the patient encounter, including vital signs, physical exam findings, laboratory data, imaging results, and other diagnostic data. Distinguish between symptoms (Subjective) and signs (Objective).
3. Assessment (A):
    - Problem: List the diagnosis or problem list in order of importance.
    - Differential Diagnosis: Provide a list of possible diagnoses, explaining the rationale for each and discussing the decision-making process.
4. Plan (P):
    - For each problem listed in the Assessment, detail the necessary tests, therapy (including medications), specialist referrals or consults, and patient education or counseling planned.

Ensure the generated SOAP note is organized, concise, and clearly separates each section and subheading as outlined. The note should accurately reflect the patient's condition and plan of care based only on the subjective and objective information provided.

Generate the SOAP note based on the structured format and detailed instructions provided above."""

prompt = ChatPromptTemplate.from_template(template)

# Initialize the Langchain client with your API key
model = ChatOpenAI(
    temperature=0, model_name="gpt-3.5-turbo-0125", openai_api_key=openai_api_key
)

# Generate SOAP note
chain = prompt | model

response = chain.invoke({"transcript": formatted_transcript})

print(response.content)
