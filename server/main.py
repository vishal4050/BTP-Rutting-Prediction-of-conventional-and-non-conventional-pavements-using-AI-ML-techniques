from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
# Import the correct preprocessing function for EfficientNet
from tensorflow.keras.applications.efficientnet import preprocess_input
from PIL import Image
import numpy as np
import io
from typing import List

# Initialize the FastAPI app
app = FastAPI()

# --- CORS Configuration ---
origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# --- Model Loading (FINAL FIX) ---

def build_model():
    """
    Builds the model architecture to perfectly match the training script.
    """
    # Define the input layer explicitly, matching the training IMAGE_SIZE
    input_tensor = tf.keras.layers.Input(shape=(224, 224, 3))

    # 1. Create the base EfficientNetB0 model.
    # The training script used pooling='avg' which we replicate by adding the layer manually.
    base_model = tf.keras.applications.EfficientNetB0(
        include_top=False,
        weights=None,
        input_tensor=input_tensor,
        pooling=None
    )

    # 2. Manually load the ImageNet weights into our correctly-shaped base model.
    weights_url = "https://storage.googleapis.com/keras-applications/efficientnetb0_notop.h5"
    weights_path = tf.keras.utils.get_file(
        'efficientnetb0_notop.h5',
        weights_url,
        cache_subdir='models'
    )
    base_model.load_weights(weights_path)

    # 3. Replicate the exact layers from the training script.
    x = tf.keras.layers.GlobalAveragePooling2D(name="avg_pool")(base_model.output)
    x = tf.keras.layers.Dropout(0.2, name="dropout_layer")(x) # Adding dropout to match
    output = tf.keras.layers.Dense(3, activation='softmax', name="output_layer")(x)

    # 4. Combine into the final model.
    model = tf.keras.Model(inputs=base_model.input, outputs=output)
    
    return model

# Create the model with the correct architecture and base weights
model = build_model()

# Load your fine-tuned weights by name.
model.load_weights('my_model.h5', by_name=True) 

# CRITICAL FIX: The class names must match the alphabetical order from training.
# 0 = moderate, 1 = normal, 2 = severe
CLASS_NAMES = ['Moderate', 'Normal', 'Severe']
# --- End of Fixed Section ---


def preprocess_image(image_bytes: bytes):
    """
    Preprocesses a single image, resizing to the correct training dimensions.
    """
    image = Image.open(io.BytesIO(image_bytes))
    if image.mode != 'RGB':
        image = image.convert('RGB')
    # CRITICAL FIX: Resize to 224x224 to match training
    image = image.resize((224, 224))
    image_array = np.array(image)
    image_batch = np.expand_dims(image_array, axis=0)
    processed_image = preprocess_input(image_batch)
    return processed_image

# --- API Endpoint ---
@app.post("/predict/")
async def predict_rutting(files: List[UploadFile] = File(...)):
    """Receives images, predicts rutting severity, and returns results."""
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

# To run the app, use the command:
# uvicorn main:app --reload
