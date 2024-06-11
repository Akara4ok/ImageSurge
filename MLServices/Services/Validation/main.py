""" Web API """
import os
from flask import Flask, request
from flask_cors import CORS
import sys
sys.path.append("Services/")
from Validation import BrisqueValidator

app = Flask(__name__)
CORS(app)

validator = BrisqueValidator(threshold=os.getenv("THRESHOLD") if os.getenv("THRESHOLD") is not None else 60.0)

@app.route('/validate', methods=['POST'])
def validate_endpoint():
    content = request.get_json()
    path = content["path"]
    name = content["name"]
    source = content["source"]
    result, quality = validator.validate(path, name, source)
    if(result):
        return {
                "result": result,
                "quality": 100 - quality
            }, 200

    return {
                "message": "Internal server error"
            }, 500
    

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)