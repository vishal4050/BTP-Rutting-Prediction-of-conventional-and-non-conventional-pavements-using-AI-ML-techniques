# 🛣️ Pavement Rutting Prediction using AI/ML

This project predicts the **severity of pavement rutting** using image-based machine learning models.  
It allows users to **upload or capture road images**, processes them through a trained AI model, and visualizes the rutting severity in a **color-coded bar graph**.

---

## 🚀 Features

- 📸 Upload or capture pavement images directly.
- 🧠 Predicts **Normal**, **Moderate**, or **Severe** rutting.
- 📊 Visualizes predictions for all images using an interactive color-coded graph.
- 📍 Supports entry of **start and end locations** for field data collection.
- 💾 Option to **download result graphs** for documentation and analysis.

---

## 🧩 Tech Stack

| Component | Technology Used |
|------------|----------------|
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | FastAPI (Python) |
| **ML Model** | TensorFlow / Keras |
| **Visualization** | Matplotlib / Plotly |
| **Deployment** | Render / Streamlit (optional) |

---

## 🖼️ Application Preview

### 1️⃣ Home Page
Upload or capture images and enter location details.
![Home Page](./assets/8610f4f5-5229-4d89-b28b-4be10150c0a6.png)

---

### 2️⃣ Image Upload Preview
Displays all selected images before prediction.
![Image Upload Preview](./assets/a0549877-e738-4d2e-90fa-9ebfabadd42b.png)

---

### 3️⃣ Prediction Results
Rutting severity visualization (Normal - 🟩, Moderate - 🟨, Severe - 🟥)
![Prediction Results](./assets/39dcd68e-3428-4002-800c-96bf6a59027d.png)

---

## 🧠 Working Principle

1. **Input Stage:** User uploads road surface images.
2. **Preprocessing:** Images are resized, normalized, and fed into the ML model.
3. **Prediction:** Model classifies each image into one of three severity levels.
4. **Visualization:** A color-coded severity graph is generated.
5. **Download:** Users can save the graph for reporting or research.

---

## 👨‍💻 Developed By

**Vishal**  
Under the guidance of **Dr. Ramu Baadiga**  
📧 [ce220004050@gmail.com](mailto:ce220004050@gmail.com)  
📞 +91 8650212801  

---

## 📜 License

© 2025 All Rights Reserved.  
This project is developed for **IIT Indore B.Tech Final Year Project (BTP)**.

---

## 🌟 Future Enhancements

- Integration with **real-time GPS-based mapping**.
- Incorporation of **Deep Learning (CNN-based)** models for higher accuracy.
- Creation of a **mobile version** for field engineers.
