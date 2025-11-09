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
<img width="2559" height="1338" alt="Screenshot 2025-11-09 231725" src="https://github.com/user-attachments/assets/c9984916-a50b-4af8-8bad-5e30f94e4680" />


---

### 2️⃣ Image Upload Preview
Displays all selected images before prediction.
<img width="2558" height="1309" alt="Screenshot 2025-11-09 231757" src="https://github.com/user-attachments/assets/907dbfe7-f3c2-4c8d-be13-c01e24e7557e" />


---

### 3️⃣ Prediction Results
Rutting severity visualization (Normal - 🟩, Moderate - 🟨, Severe - 🟥)
<img width="2549" height="1118" alt="Screenshot 2025-11-09 231848" src="https://github.com/user-attachments/assets/0ea0fbce-eefc-4ff7-b534-c2eaffd30067" />


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
