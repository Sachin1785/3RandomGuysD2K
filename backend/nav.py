import os
from google import genai
from google.genai import types
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from pyngrok import ngrok  # added import
from supabase import create_client, Client  # added import
from dotenv import load_dotenv  # added import

load_dotenv()  # added: load environment variables from .env

  # Replace with your Gemini API key

system_prompt = """
You  are a helpful assistant whose sole purpose is to help users easily navigate the website
for example 
if the users asks "where is my wallet??" you have to reply with "/wallet" 
if the users asks "where is my account??" you have to reply with "/wallet" 
if the users asks "account" you have to reply with "/wallet" 
if the users asks "wallet" you have to reply with "/wallet" 
if the user asks "where are my past transactions" you have to reply with "/transactions"
if the user asks "transactions" you have to reply with "/transactions"
if the user asks "transactions" you have to reply with "/transactions"
if the user asks "where can i see every users transactions" you have to reply with "/transactions"
if the user asks "where can i see global transactions" you have to reply with "/transactions"
if the user asks "where are all transactions" you have to reply with "/transactions"

reply only in plaintext
never answer anything else as it will break my whole system
if it is not in the above list just reply with "I am sorry I am not able to help you with that"
"""

def process_instruction(instruction):
    contents = [
        types.Content(role="user", parts=[types.Part.from_text(text=instruction)])
    ]
    config = types.GenerateContentConfig(
        temperature=2,
        top_p=0.9,
        top_k=40,
        max_output_tokens=512,
        system_instruction=system_prompt
    )

    client = genai.Client(api_key=GEMINI_API_KEY)
    model = "gemini-2.0-flash"
    response = client.models.generate_content(model=model, contents=contents, config=config)
    response_text = response.text

    return response_text

def main():
    instruction = input("Enter your instruction: ")
    result = process_instruction(instruction)
    print(result)

app = Flask(__name__)
CORS(app)  # Enable CORS for the Flask app

@app.route('/process', methods=['POST'])
def process():
    data = request.get_json()
    print(data)
    if not data or 'instruction' not in data:
        return jsonify({'error': 'No instruction provided'}), 400
    result = process_instruction(data['instruction'])
    return jsonify({'response': result})

supabase_url: str = os.environ.get("SUPABASE_URL")  # added initialization
supabase_key: str = os.environ.get("SUPABASE_KEY")  # added initialization
supabase: Client = create_client(supabase_url, supabase_key)  # added initialization

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == 'cli':
        main()
    else:
       
        ngrok_id = int(os.environ.get("NGROK_ID", "2"))  # added NGROK_ID variable
        public_url = ngrok.connect(2005)
        print(" * ngrok tunnel \"{}\" -> \"http://127.0.0.1:2005\"".format(public_url))
        # Update supabase with the new ngrok URL
        data = {"id": ngrok_id, "url": public_url.public_url}
        response = supabase.table("ngrok").upsert(data).execute()
        print("Supabase update response:", response)
        app.run(host='0.0.0.0', port=2005)