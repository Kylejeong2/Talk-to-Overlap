from flask import Flask, jsonify, request
from youtube_transcript_api import YouTubeTranscriptApi

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True)


# curl -X POST https://3f7f-24-43-251-141.ngrok-free.app/transcript \
#      -H "Content-Type: application/json" \
#      -d '{"videoId": "HB3l1BPi7zo"}'