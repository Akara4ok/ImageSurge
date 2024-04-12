""" Web API """
import os
from flask import Flask, request
from flask_cors import CORS
import sys
sys.path.append("Services/")
from Validation import BrisqueValidator

app = Flask(__name__)
CORS(app)

validator = BrisqueValidator(os.getenv("THRESHOLD") if os.getenv("THRESHOLD") is not None else 40.0)

@app.route('/validate', methods=['POST'])
def validate_endpoint():
    content = request.get_json()
    data_path = content["data-path"]
    result = validator.validate(data_path)
    if(result):
        return {
                "result": result
            }, 200

    return {
                "message": "Internal server error"
            }, 500
    

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)