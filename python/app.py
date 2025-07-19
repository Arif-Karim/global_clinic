from openai import OpenAI
from pydantic import BaseModel
import json

from dotenv import load_dotenv
load_dotenv(dotenv_path="python/.env",override=True)

client = OpenAI()

input = ""
class Doctor(BaseModel):
    name: str


with open("./profiles.json") as f: 
    data = json.load(f)

system_content = (
    f"Here is a list of volunteer doctors: {data}\n"
    "In the prompt the user will provide what medical issue they are facing. "
    "Your job is to find the most relevant doctor that can help with the issue."
)

# user_prompt = "I have a 7-year-old child with a persistent high fever, cough, and difficulty breathing. The child is not responding to standard antibiotics. I suspect a complicated pneumonia or possibly tuberculosis. Is there a pediatrician or infectious disease specialist who can advise on further management and possible alternative treatments?"
user_prompt = "i have a sick child that wants to read quran"

prompt=[
        {"role": "system", "content": system_content},
        {
            "role": "user",
            "content": user_prompt,
        },
    ]



response = client.responses.parse(
    model="gpt-4.1-nano-2025-04-14",
    input=prompt,
    text_format=Doctor,
)

event = response.output_parsed
name = event.name