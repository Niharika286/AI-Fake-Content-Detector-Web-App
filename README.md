# 🤖 AI Fake Content Detector Web App

## 📌 Overview

A MERN-stack web application that detects whether content (text or images) is AI-generated or human-created.
It provides probability scores and a user-friendly interface for quick verification.

---

## 🚀 Features

* ✍️ Text AI Detection
* 🖼️ Image AI Detection (Simulated)
* 📊 AI Probability with Progress Bar
* 🔄 Tab-based UI (Text / Image)
* ⚡ Real-time Results

---

## 🛠️ Tech Stack

* Frontend: React.js
* Backend: Node.js + Express
* Database: MongoDB (optional/logging)
* APIs: AI Detection APIs (simulated for now)

---

## 💻 How to Run the Project

### 🔽 Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/AI-Fake-Content-Detector-Web-App.git
cd AI-Fake-Content-Detector-Web-App
```

---

### 📦 Step 2: Install Dependencies

#### 👉 Backend setup

```bash
cd server
npm install
```

#### 👉 Frontend setup

```bash
cd ../client
npm install
```

---

### ▶️ Step 3: Run the Application

#### 🔵 Start Backend Server

```bash
cd server
npm start
```

Backend runs on:

```
http://localhost:5000
```

---

#### 🟢 Start Frontend (in new terminal)

```bash
cd client
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🔄 How It Works

1. User enters text or uploads an image
2. Frontend sends request to backend
3. Backend processes input (API/simulated logic)
4. Returns AI probability score
5. Frontend displays result with visualization

---

## ⚠️ Notes

* Image detection is currently simulated using random scoring
* Real AI models/APIs can be integrated in future scope
* Both frontend and backend must run simultaneously

---

## 👥 Contributors

* Niharika
* Falak Naz
* Dipanshi Yadav

---

## 📚 Future Scope

* Real AI detection APIs integration
* URL-based content detection
* Multi-language support
* Video/audio deepfake detection

---

## 📄 License

This project is for academic purposes.
