# FlicPick – AI-Powered Movie Recommendation Platform

Live Demo: https://flicpick.vercel.app  
Portfolio: https://saahil-portfolio.vercel.app  

---

## Overview

FlicPick is a full-stack movie recommendation platform that suggests movies based on user mood and genre preferences using machine learning and external API integration.

The system combines a modern React frontend with a FastAPI backend and a machine learning recommendation engine to provide personalized movie suggestions.

This project demonstrates full-stack development, ML integration, REST API design, and scalable frontend-backend architecture.

---

## Key Features

- Mood-based movie recommendations using ML model
- Genre-based movie discovery
- Real-time movie search with detailed information
- Integration with TMDB API for live movie data
- REST API backend built with FastAPI
- Responsive frontend built with React and TypeScript
- Modern UI built with Material UI

---

## Tech Stack

Frontend:
- React
- TypeScript
- Material UI
- Axios

Backend:
- FastAPI
- Python

Machine Learning:
- Scikit-learn
- Pandas

External API:
- TMDB API

Deployment:
- Vercel (Frontend)
- Backend deployed via Render

---

## System Architecture

The application follows a full-stack client-server architecture:

1. User interacts with React frontend
2. Frontend sends requests to FastAPI backend via REST APIs
3. Backend processes recommendation logic using ML model
4. Backend fetches additional movie data from TMDB API
5. Backend returns structured recommendation data
6. Frontend displays personalized movie recommendations

This architecture demonstrates API design, ML integration, and scalable backend structure.

---

## API Endpoints

POST /recommendations  
Returns movie recommendations based on mood

POST /recommend/genre  
Returns movie recommendations based on selected genre

GET /movies/search?query  
Fetches desired movies from TMDB API

GET /movies/{id}  
Returns detailed movie information

---

## Example API Response

```json
[
  {
    "title": "The Pursuit of Happyness",
    "overview": "...",
    "poster": "https://image.tmdb.org/..."
  }
]
```

---

## What This Project Demonstrates

This project demonstrates my ability to:

- Build full-stack applications using React and FastAPI
- Design and implement REST APIs
- Integrate machine learning models into web applications
- Integrate external APIs into backend systems
- Design scalable frontend-backend architecture
- Deploy production-ready applications

---

## Challenges Solved

- Integrating ML recommendation logic into web backend
- Managing frontend-backend communication
- Handling external API integration efficiently
- Designing scalable backend architecture
- Deploying full-stack applications

---

## Repository Structure

```
Movie-Recommendor/
│
├── frontend/      # React frontend
├── python/        # ML recommendation engine
└── backend/       # FastAPI backend
```

---

## Live Demo

https://flicpick.vercel.app

---

## Author

Saahil Vishwakarma  
Portfolio: https://saahil-portfolio.vercel.app  
GitHub: https://github.com/Saahil-04  
LinkedIn: https://www.linkedin.com/in/saahil-vishwakarma-7a5943288/
