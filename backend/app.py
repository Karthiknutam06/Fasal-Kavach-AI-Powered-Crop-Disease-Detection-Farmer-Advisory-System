from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import time
import os
import io

app = Flask(__name__)

CORS(app)

model = None


PLANT_VILLAGE_CLASSES = [
    'Apple - Scab', 'Apple - Black rot', 'Apple - Cedar apple rust', 'Apple - Healthy',
    'Blueberry - Healthy', 'Cherry - Powdery mildew', 'Cherry - Healthy',
    'Corn - Cercospora leaf spot', 'Corn - Common rust',
    'Corn - Northern Leaf Blight', 'Corn - Healthy', 'Grape - Black rot',
    'Grape - Esca (Black Measles)', 'Grape - Leaf blight', 'Grape - Healthy',
    'Orange - Haunglongbing (Citrus greening)', 'Peach - Bacterial spot', 'Peach - Healthy',
    'Pepper - Bacterial spot', 'Pepper - Healthy', 'Potato - Early blight',
    'Potato - Late blight', 'Potato - Healthy', 'Raspberry - Healthy', 'Soybean - Healthy',
    'Squash - Powdery mildew', 'Strawberry - Leaf scorch', 'Strawberry - Healthy',
    'Tomato - Bacterial spot', 'Tomato - Early blight', 'Tomato - Late blight',
    'Tomato - Leaf Mold', 'Tomato - Septoria leaf spot', 'Tomato - Spider mites',
    'Tomato - Target Spot', 'Tomato - Yellow Leaf Curl Virus', 'Tomato - Mosaic virus',
    'Tomato - Healthy'
]

def load_ai_model():
    global model, PLANT_VILLAGE_CLASSES
    model_path = os.path.join(os.path.dirname(__file__), 'disease_model.h5')
    classes_path = os.path.join(os.path.dirname(__file__), 'classes.txt')
    
    if os.path.exists(model_path):
        try:
            import tensorflow as tf
            os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
            model = tf.keras.models.load_model(model_path)
            
            # Dynamically grab the classes that we trained on!
            if os.path.exists(classes_path):
                with open(classes_path, 'r') as f:
                    PLANT_VILLAGE_CLASSES = [line.strip() for line in f.readlines() if line.strip()]
            
            print("[+] => FASAL KAVACH LIVE AI MODEL LOADED SUCCESSFULLY!")
        except Exception as e:
            print(f"[-] => Failed to boot live model: {e}")
    else:
        print("[-] => disease_model.h5 not found. Using Mock AI until user runs train_model.py.")

load_ai_model()


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Fasal Kavach API is running🚀"})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json

    time.sleep(1)
    if data and 'email' in data and 'password' in data:
        return jsonify({"status": "success", "message": "Logged in successfully", "token": "mock-jwt-token-123"})
    return jsonify({"status": "error", "message": "Invalid credentials"}), 400

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    time.sleep(1)
    return jsonify({"status": "success", "message": "User registered successfully"})


@app.route('/api/predict-disease', methods=['POST'])
def predict_disease():
    if 'image' not in request.files:
        return jsonify({"status": "error", "message": "No image provided"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"status": "error", "message": "No selected file"}), 400

    global model
    

    if model is not None:
        try:
            import tensorflow as tf
            from PIL import Image
            import numpy as np
            
            img_bytes = file.read()
            img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
            img = img.resize((224, 224))
            

            img_array = tf.keras.preprocessing.image.img_to_array(img)
            img_array = tf.expand_dims(img_array, 0) 
            img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
            

            predictions = model.predict(img_array)
            
  
            class_idx = np.argmax(predictions[0])
            confidence = np.max(predictions[0]) * 100
            
            if class_idx < len(PLANT_VILLAGE_CLASSES):
                disease_name = PLANT_VILLAGE_CLASSES[class_idx]
            else:
                disease_name = "Unknown Crop Phenomenon"

            if "Healthy" in disease_name or "healthy" in disease_name.lower():
                precautions = [
                    "Crop is in excellent health condition.",
                    "Continue regular watering and organic fertilization schedule.",
                    "Monitor weekly for any early signs of pests."
                ]
            else:
                crop = disease_name.split('-')[0].strip() if '-' in disease_name else 'Plant'
                precautions = [
                    f"Isolate the affected {crop} crops immediately to prevent pathogenic spread.",
                    f"Apply targeted organic fungicides targeting {disease_name.split('-')[-1].strip()}.",
                    "Ensure proper row spacing to maximize air circulation and reduce humidity."
                ]
            
            return jsonify({
                "status": "success",
                "disease": disease_name,
                "confidence": f"{confidence:.1f}%",
                "precautions": precautions,
                "is_live": True
            })
            
        except Exception as e:
                  print(f"Error during live processing: {e}")


    time.sleep(2)
    
    diseases = [
        {"name": "Tomato - Late Blight", "confidence": "98.5%", "precautions": ["Apply fungicides that contain chlorothalonil or copper.", "Remove and destroy all infected plant parts immediately.", "Water the plants at the base early in the day."]},
        {"name": "Apple - Scab", "confidence": "92.1%", "precautions": ["Choose resistant varieties when possible.", "Rake up and destroy fallen leaves.", "Apply fungicides predictably."]},
        {"name": "Corn - Common Rust", "confidence": "87.3%", "precautions": ["Plant resistant hybrids.", "Apply foliar fungicides.", "Manage crop residue."]}
    ]
    
    result = random.choice(diseases)
    
    return jsonify({
        "status": "success",
        "disease": f"{result['name']}",
        "confidence": result["confidence"],
        "precautions": result["precautions"],
        "is_live": False
    })


@app.route('/api/recommend', methods=['POST'])
def recommend():
    data = request.json
    time.sleep(1.5)
    
    crops = ['rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas', 'mothbeans', 'mungbean', 'blackgram', 'lentil', 'pomegranate', 'banana', 'mango', 'grapes', 'watermelon', 'muskmelon', 'apple', 'orange', 'papaya', 'coconut', 'cotton', 'jute', 'coffee']
    
    recommended_crop = random.choice(crops)
    
    return jsonify({
        "status": "success",
        "crop": recommended_crop
    })

@app.route('/api/weather', methods=['GET'])
def get_weather():
    return jsonify({
        "temperature": "28°C",
        "condition": "Partly Cloudy",
        "humidity": "65%",
        "icon": "ph-cloud-sun"
    })

@app.route('/api/yield-predict', methods=['POST'])
def predict_yield():
    time.sleep(1.5)
    return jsonify({"status": "success", "yield": "5.5 Tons"})

@app.route('/api/fertilizer', methods=['POST'])
def recommend_fertilizer():
    time.sleep(1.5)
    return jsonify({"status": "success", "fertilizer": "Urea 46-0-0"})

@app.route('/api/chat', methods=['POST'])
def chat():
    time.sleep(1.5)
    return jsonify({"status": "success", "response": "I am your Fasal Kavach AI assistant."})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
