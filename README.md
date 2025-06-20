# 🎮 Movie Recommender

**Movie Recommender** is a personalized film discovery platform that recommends movies based on your mood and genre preferences. Powered by machine learning and integrated with The Movie Database (TMDB), it helps users discover hidden gems and trending favorites through a modern, responsive interface.

---

## 🌟 Features

* 🎭 **Mood-Based Recommendations** – Happy, Sad, Neutral? Get tailored suggestions.
* 🎮 **Genre Filtering** – Explore trending movies by genre.
* 🔍 **Smart Search** – Search and find movies with detailed info.
* 🧠 **Machine Learning Backend** – Makes intelligent, context-aware recommendations.
* 📈 **Trending & Top Picks** – Stay updated with what’s hot.
* 🌙 **Modern Dark UI** – Responsive design built with MUI and React.

---

## 🧱 Tech Stack

| Frontend           | Backend          | Machine Learning     | Data/API Source |
| ------------------ | ---------------- | -------------------- | --------------- |
| React + TypeScript | Python + FastAPI | Scikit-learn, Pandas | TMDB API        |

Other Tools:

* MUI (Material-UI)
* Axios
* React Router
* JWT (for future authentication)

---

## 📦 Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/movie-recommender.git
cd movie-recommender
```

### 2. Backend Setup (FastAPI + ML)

```bash
cd backend
python -m venv env
source env/bin/activate  # Use ./env/Scripts/activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

> ⚠️ Make sure to add your TMDB API Key in your `.env` or config.

### 3. Frontend Setup (React + MUI)

```bash
cd frontend
npm install
npm run dev
```

The frontend should now be running at: `http://localhost:3000`

---

## 🧪 API Endpoints

| Method | Endpoint           | Description                              |
| ------ | ------------------ | ---------------------------------------- |
| POST   | `/recommend/mood`  | Recommend movies based on mood           |
| POST   | `/recommend/genre` | Recommend movies based on selected genre |
| GET    | `/movies/trending` | Fetch trending movies from TMDB          |
| GET    | `/movies/:id`      | Get detailed info for a specific movie   |

---

## 📸 Screenshots

> *(Insert screenshots or GIF previews)*

---

## ✨ Example

**Request:**

```json
POST /recommend/mood
{
  "mood": "happy"
}
```

**Response:**

```json
[
  {
    "title": "The Pursuit of Happyness",
    "overview": "...",
    "poster": "https://image.tmdb.org/..."
  },
  ...
]
```

---

## 🚀 Upcoming Features

* 🢑 User accounts and favorite tracking
* 🧠 Deep learning-based recommendation engine
* 📱 PWA support for mobile experience
* 💬 Chatbot-style assistant

---

## 🛡 License

MIT License. See the [LICENSE](LICENSE) file for full details.

---

## 🙋‍♂️ Contributing

Contributions are welcome! Please open an issue or a pull request if you'd like to collaborate.

---

## 🔗 Contact

Made with ❤️ by [Your Name](https://github.com/your-username)
Have questions or suggestions? Reach out via GitHub or email.
