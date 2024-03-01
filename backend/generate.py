import os

from dotenv import load_dotenv
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_openai import OpenAI

# Load environment variables from .env file
load_dotenv()

# Now, you can access your API key securely
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError(
        "API key not found. Please set the OPENAI_API_KEY environment variable."
    )

# Prompt template
template = """Question: {question}

Answer: Let's think step by step."""

prompt = PromptTemplate.from_template(template)

# Initialize the Langchain client with your API key
llm = OpenAI(
    temperature=0, model_name="gpt-3.5-turbo-0125", openai_api_key=openai_api_key
)


# Generate SOAP note
llm_chain = LLMChain(prompt=prompt, llm=llm)

question = "What NFL team won the Super Bowl in the year Justin Beiber was born?"

response = llm_chain.run(question)

print(response)

# Assuming your transcript is stored in 'transcript.txt'
with open("transcript.txt", "r") as file:
    transcript = file.read()

prompt = f"""
[Your detailed prompt goes here, as designed in the previous steps]

{transcript}

Generate the SOAP note based on the structured format and detailed instructions provided above.
"""
