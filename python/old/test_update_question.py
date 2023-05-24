import requests
import json
def update_question():
    url = 'https://ai4christians.com/api/update.php'
    headers = {'Content-Type': 'application/json', 'Authorization': 'Bearer Jump857571111'}
    data = {
        'id': 18390,
        'question': '_What is the capital of France?',
        'skill': 'easy',
        'choices': ['Paris', 'Barcelona', 'Berlin', 'Valencia'],
        'correct': 1,
        'explanations': [
            "It's the capital city of France",
            "It's known for the Eiffel Tower",
            "It's also called the City of Light",
            "It's a major center for art and fashion"
        ]
    }

    response = requests.put(url, headers=headers, data=json.dumps(data))
    print(response.json())
