"""Simple test script to verify Google Gemini API key"""
import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Get API key
api_key = os.getenv('GOOGLE_API_KEY')

if not api_key:
    print("❌ No API key found in .env file")
    exit(1)

print(f"✓ API Key found: {api_key[:10]}...")

try:
    # Configure and test
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    print("✓ Model initialized successfully (Gemini 2.5 Flash)")
    
    # Test with a simple prompt
    response = model.generate_content("Say hello in one sentence")
    print(f"✓ Response received: {response.text}")
    
    print("\n✅ API key is working perfectly!")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
