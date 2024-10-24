from flask import Flask, jsonify, request
from youtube_transcript_api import YouTubeTranscriptApi
import os
import openai
import pinecone
from dotenv import load_dotenv
import uuid
from datetime import datetime

app = Flask(__name__)

# Load environment variables
load_dotenv()

# Initialize OpenAI and Pinecone
openai.api_key = os.getenv("OPENAI_API_KEY")
pinecone.init(api_key=os.getenv("PINECONE_API_KEY"), environment=os.getenv("PINECONE_ENVIRONMENT"))
index = pinecone.Index(os.getenv("PINECONE_INDEX"))

@app.route('/transcript', methods=['POST'])
def get_transcript():
    data = request.get_json()
    video_id = data.get('videoId')
    if not video_id:
        return jsonify({"error": "Missing video_id in request body"}), 400

    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return jsonify({"transcript": transcript})
    except Exception as e:
        print(f"Error fetching transcript: {e}")
        return jsonify({"error": "Failed to fetch transcript"}), 500

@app.route('/process_video', methods=['POST'])
def process_video():
    data = request.get_json()
    video_id = data.get('videoId')
    if not video_id:
        return jsonify({"error": "Missing video_id in request body"}), 400

    try:
        # Fetch transcript using YouTube API or similar
        transcript_response = get_transcript(video_id)
        transcript = transcript_response.get_json().get('transcript')

        # Process transcript to generate embeddings
        for entry in transcript:
            sentence = entry['text']
            timestamp = entry['start']
            duration = entry['duration']
            response = openai.Embedding.create(input=sentence, model="text-large-3")
            embedding = response['data'][0]['embedding']
            
            # Upsert to Pinecone with namespace
            namespace = f"overlap_{video_id}_embeddings"
            index.upsert([(str(uuid.uuid4()), embedding, {"timestamp": timestamp, "duration": duration})], namespace=namespace)

        return jsonify({"status": "success"}), 200
    except Exception as e:
        print(f"Error processing video: {e}")
        return jsonify({"error": "Failed to process video"}), 500

if __name__ == '__main__':
    app.run(debug=True)
