import os
import requests

def get_access_token() -> str:
    token_data = {
        "client_id": os.getenv('CLIENT_ID'),
        "client_secret": os.getenv('CLIENT_SECRET'),
        "username": os.getenv('CLOUD_USERNAME'),
        "password": os.getenv('CLOUD_PASSWORD'),
        "grant_type": os.getenv('GRANT_TYPE')
    }
    response = requests.post(os.getenv('TOKEN_URL'), data=token_data)
    return response.json().get("access_token")