from tensorflow.keras.models import load_model

try:
    model = load_model("my_model.h5")
    print("✅ Model loaded successfully!")
except Exception as e:
    print("❌ Model failed to load:", e)
