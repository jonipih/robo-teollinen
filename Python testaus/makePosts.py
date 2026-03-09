import requests
import random
import time
import json

# Testausta varten tekee Postinin satunnaisluvuilla
URL = "http://86.50.169.101:80/abbdata"
HEADERS = {'Content-Type': 'application/json'}

def generate_random_data():
    """Generates a dictionary with random sensor values."""
    return {
        "power": round(random.uniform(0, 400), 2),
        "axl1": round(random.uniform(-180, 180), 2),
        "axl2": round(random.uniform(-180, 180), 2),
        "axl3": round(random.uniform(-180, 180), 2),
        "axl4": round(random.uniform(-180, 180), 2),
        "axl5": round(random.uniform(-180, 180), 2),
        "axl6": round(random.uniform(-180, 180), 2)
    }

def start_simulating():
    print(f"Starting POST requests to {URL}. Press Ctrl+C to stop.")
    
    while True:
        data = generate_random_data()
        
        try:
            # Making the POST request
            response = requests.post(URL, data=json.dumps(data), headers=HEADERS)
            
            # Status check
            if response.status_code == 200 or response.status_code == 201:
                print(f"Success: Sent {data}")
            else:
                print(f"Failed: Received status code {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print("Error: Could not connect to the server. Is localhost:3000 running?")
            
        # Wait for 1 second before next iteration
        time.sleep(0.5)

if __name__ == "__main__":
    start_simulating()