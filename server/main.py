from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from tensorflow.keras.applications.efficientnet import preprocess_input
from PIL import Image
import numpy as np
import io
from typing import List
from dotenv import load_dotenv
import os

# --- Load environment variables ---
load_dotenv()

# Initialize FastAPI
app = FastAPI()

# --- CORS Configuration (Dynamic) ---
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# --- Model Loading (Lazy Loading Enabled) ---
model = None  # <-- don't load model immediately

def build_model():
    """
    Builds the model architecture to perfectly match the training script.
    """
    input_tensor = tf.keras.layers.Input(shape=(224, 224, 3))
    base_model = tf.keras.applications.EfficientNetB0(
        include_top=False,
        weights=None,
        input_tensor=input_tensor,
        pooling=None
    )

    weights_url = "https://storage.googleapis.com/keras-applications/efficientnetb0_notop.h5"
    weights_path = tf.keras.utils.get_file(
        'efficientnetb0_notop.h5',
        weights_url,
        cache_subdir='models'
    )
    base_model.load_weights(weights_path)

    x = tf.keras.layers.GlobalAveragePooling2D(name="avg_pool")(base_model.output)
    x = tf.keras.layers.Dropout(0.2, name="dropout_layer")(x)
    output = tf.keras.layers.Dense(3, activation='softmax', name="output_layer")(x)

    model = tf.keras.Model(inputs=base_model.input, outputs=output)
    return model

def get_model():
    """
    Lazy-loads the model only once and reuses it.
    """
    global model
    if model is None:
        model = build_model()
        model.load_weights('my_model.h5', by_name=True)
    return model

# Class labels (must match training)
CLASS_NAMES = ['Moderate', 'Normal', 'Severe']

# --- Image Preprocessing ---
def preprocess_image(image_bytes: bytes):
    image = Image.open(io.BytesIO(image_bytes))
    if image.mode != 'RGB':
        image = image.convert('RGB')
    image = image.resize((224, 224))
    image_array = np.array(image)
    image_batch = np.expand_dims(image_array, axis=0)
    processed_image = preprocess_input(image_batch)
    return processed_image

# --- Prediction Endpoint ---
@app.post("/predict/")
async def predict_rutting(files: List[UploadFile] = File(...)):
    model = get_model()  # ✅ model loads here only once
    results = []
    image_batch = []
    filenames = []

    for file in files:
        filenames.append(file.filename)
        image_bytes = await file.read()

        try:
            processed_batch = preprocess_image(image_bytes)
            image_batch.append(processed_batch[0])
        except Exception as e:
            results.append({
                'fileName': file.filename,
                'error': f'Could not process file. Error: {e}'
            })

    if not image_batch:
        return {"results": results}

    image_batch_np = np.array(image_batch)
    batch_prediction = model.predict(image_batch_np)

    for i, prediction in enumerate(batch_prediction):
        predicted_class_index = np.argmax(prediction)
        predicted_class_name = CLASS_NAMES[predicted_class_index]

        results.append({
            'fileName': filenames[i],
            'predictedClass': predicted_class_name,
            'probabilities': {
                'Moderate': float(prediction[0]),
                'Normal': float(prediction[1]),
                'Severe': float(prediction[2])
            }
        })

    return {"results": results}

# --- Run Command ---
# uvicorn main:app --host 0.0.0.0 --port 8000
