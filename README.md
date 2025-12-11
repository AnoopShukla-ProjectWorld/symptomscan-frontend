# 🩺 SymptomScan — Disease Prediction System  
ML-based disease prediction with personalized healthcare insights.

## 🌐 Live Demo  
🔗 **https://symptomscan-system.netlify.app/**  
📌 **Portfolio:** https://anoopshukla-projectworld.github.io/Anoop-Shukla-New-Portfolio/

---

## 🚀 Overview  
**SymptomScan** is a machine learning powered healthcare web app that predicts **40+ diseases** from user-selected symptoms.  
It provides:

- Disease descriptions  
- Treatment recommendations  
- Precautions  
- Diet suggestions  
- Workout guidance  
- Secure login system  
- Prediction history tracking  

Backend is built using **Flask**, and ML engine uses **SVM, Random Forest, and Naive Bayes**.

---

## ✨ Features

### 🧠 Machine Learning  
- Predicts **40+ diseases**  
- Uses **SVM**, **Random Forest**, **Naive Bayes**  
- Confidence scoring  
- Symptom-to-binary-vector conversion  

### 🩺 Healthcare Guidance  
- Disease descriptions  
- Medications  
- Precautions  
- Diet & workout insights  

### 🔐 User Management  
- Login / Signup  
- Update profile  
- Change password  
- Logout with session protection  

### 🕒 Prediction History  
- Saves all predictions  
- View model used, confidence & symptoms  
- Delete entries  

---

## 🛠 Tech Stack

### **Frontend**
- HTML  
- CSS  
- JavaScript  

### **Backend**
- Flask (Python)  
- REST API  

### **Machine Learning**
- Scikit-Learn  
- SVM, Random Forest, Naive Bayes  
- Pandas, NumPy  

### **Database**
- SQLite  

---

## 📁 Project Structure
```

SymptomScan/
│── backend/
│   ├── app.py
│   ├── database.py
│   ├── models/
│   │   ├── svm_model.pkl
│   │   ├── rf_model.pkl
│   │   ├── nb_model.pkl
│   │   └── label_encoder.pkl
│   ├── datasets/
│   ├── test_api.py
│   └── train_model.py
│
│── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── symptoms.html
│   ├── result.html
│   ├── history.html
│   ├── profile.html
│   ├── assets/
│   ├── css/
│   └── js/
│
└── README.md

````

---

## 🔮 Model Training  
All models trained using **Training.csv**, validated using **Testing.csv**.

| Model | Accuracy | Notes |
|-------|----------|-------|
| **Random Forest** | ⭐ Highest | Best classifier |
| **SVM** | High | Accurate for large features |
| **Naive Bayes** | Moderate | Good for probability-based detection |

---

## 📡 API Endpoints

### 🔐 Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Login user |
| POST | `/api/register` | Create new account |
| POST | `/api/user/update_profile` | Update name/email/photo |
| POST | `/api/user/change_password` | Change password |

### 🧠 Prediction
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/symptoms` | Get all symptoms |
| POST | `/api/predict` | Predict disease |
| POST | `/api/save_prediction` | Save prediction |

### 🕒 History
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/history/<user_id>` | Fetch user history |
| DELETE | `/api/history/<prediction_id>` | Delete prediction |

---

## ▶️ How to Run (Backend)

### 1️⃣ Clone repository
```bash
git clone https://github.com/yourusername/symptomscan.git
cd symptomscan/backend
````

### 2️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ (Optional) Train ML models

```bash
python train_model.py
```

### 4️⃣ Start API server

```bash
python app.py
```

Runs at → **[http://localhost:5000](http://localhost:5000)**

---

## 🌐 How to Run (Frontend)

Open any HTML file using:

* Live Server (VS Code)
* Netlify

---

## 📜 License

MIT License © 2025

---

## 👨‍💻 Author

**Anoop Shukla**
🔗 Portfolio: [https://anoopshukla-projectworld.github.io/Anoop-Shukla-New-Portfolio/](https://anoopshukla-projectworld.github.io/Anoop-Shukla-New-Portfolio/)
🔗 GitHub: [https://github.com/AnoopShukla-ProjectWorld](https://github.com/AnoopShukla-ProjectWorld)

