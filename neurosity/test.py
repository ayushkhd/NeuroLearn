from neurosity import NeurositySDK
from dotenv import load_dotenv
import os

load_dotenv()

neurosity = NeurositySDK({
    "device_id": os.getenv("NEUROSITY_DEVICE_ID")
})

neurosity.login({
    "email": os.getenv("NEUROSITY_EMAIL"),
    "password": os.getenv("NEUROSITY_PASSWORD")
})

def callback(data):
    print("data", data)
    # Switch light off/on

    # { probability: 0.93, label: "rightArm", timestamp: 1569961321174, metric: "kinesis" }


unsubscribe = neurosity.kinesis("tongue", callback)
