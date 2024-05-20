import argparse
import os
import requests
from requests_toolbelt.multipart.encoder import MultipartEncoder

def parse_custom_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--email", help="Email address of the user.", type=str)
    parser.add_argument("--name", help="Name of the project.", type=str)
    parser.add_argument("--secretKey", help="Secret key for authentication.", type=str)
    parser.add_argument("--path", help="Path to the folder containing images.", type=str)
    parser.add_argument("--output", help="Path to save the received file.", type=str)
    return vars(parser.parse_args())

def create_multipart_data(email, name, secretKey, path):
    multipart_form_data = [
        ('email', (None, email)),
        ('name', (None, name)),
        ('secretKey', (None, secretKey)),
    ]
    for filename in os.listdir(path):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
            file_path = os.path.join(path, filename)
            multipart_form_data.append(('file', (filename, open(file_path, 'rb'), 'image/jpeg')))
    return multipart_form_data


def send_data(url, multipart_data):
    response = requests.post(url, files=multipart_data)
    return response

def save_received_file(response, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'wb') as f:
        f.write(response.content)

def main():
    args = parse_custom_args()
    multipart_data = create_multipart_data(args["email"], args["name"], args["secretKey"], args["path"])
    url = "http://localhost:8000/process"  # Modify this URL to the actual target
    response = send_data(url, multipart_data)
    output_file_path = os.path.join(args["output"], "result.zip")  # Modify or specify how to name the received file
    save_received_file(response, output_file_path)
    print(f"File saved to {output_file_path}")

if __name__ == "__main__":
    main()