import requests
import json

url = "https://explainit.app/api/create.php"
api_key = "55556666"

data = {
    "question": "Which council affirmed the deity of Jesus Christ and formulated the Nicene Creed?",
    "skill": "medium",
    "choices": [
        "The Council of Jerusalem",
        "The Council of Nicaea",
        "The Council of Chalcedon",
        "The Council of Ephesus"
    ],
    "correct": 1,
    "explanations": [
        "Incorrect. The Council of Jerusalem dealt with issues related to Gentile converts to Christianity, not the deity of Jesus Christ.",
        "Correct. The Council of Nicaea affirmed the deity of Jesus Christ and formulated the Nicene Creed.",
        "Incorrect. The Council of Chalcedon dealt with the nature of Christ, not specifically his deity.",
        "Incorrect. The Council of Ephesus dealt with the issue of Mary being called the Mother of God, not the deity of Jesus Christ."
    ]
}

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

print("Sending request to create a new record...")

response = requests.post(url, headers=headers, data=json.dumps(data))

if response.status_code == 201:
    print("Success! The new record was created.")
    print("Response message:", response.json()["message"])
elif response.status_code == 400:
    print("Error: Unable to add the question. Data is incomplete.")
elif response.status_code == 401:
    print("Error: Unauthorized.")
elif response.status_code == 503:
    print("Error: Unable to add the question.")
else:
    print(f"Unexpected error. Status code: {response.status_code}, Response message: {response.text}")
