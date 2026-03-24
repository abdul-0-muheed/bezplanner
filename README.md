# 🚀 BezPlanner  
**The fastest way for founders to create an investor-grade business plan—no consultants, no spreadsheets.**

---

## 🌐 Demo  
🖥️ Live App: [https://bezplanner.vercel.app](https://bezplanner.vercel.app)  
📁 Repo: [https://github.com/abdul-0-muheed/bezplanner](https://github.com/abdul-0-muheed/bezplanner)

---

## 📖 Overview  
Building a startup is hard; writing the legal & strategic paperwork shouldn’t be.  
BezPlanner is a cloud-native SaaS that turns a short questionnaire into a complete, investor-ready business plan in < 5 minutes.  
Target users are pre-seed / seed-stage founders who need guidance on required documents, where to get them, and how to structure their story—without paying consultants or wrestling with spreadsheets.

---

## ✨ Features  
- ⚡️ 5-minute, end-to-end flow: sign-up → questionnaire → PDF export  
- 🧠 AI-powered narrative generation (OpenAI)  
- 🕸️ Real-time market data scraping (BeautifulSoup)  
- 📄 Auto-generated legal check-list per startup stage  
- 🔐 JWT-based auth, CORS-gated, fully HTTPS  
- 📱 Responsive React SPA with Tailwind CSS  
- 🖨️ Exportable, beautifully formatted PDF  
- 🔄 Stateless containers + horizontal-scaling ready  

---

## 🏗️ Architecture  
Clean MVC on the backend, component-driven React on the frontend.  
Two autonomous runtimes communicate strictly via REST/JSON.  
Everything is stateless except a single PostgreSQL cluster.

---

## 🔑 Key Components  
| Component | Tech | Responsibility |
|-----------|------|----------------|
| API Gateway | FastAPI | Routing, validation, JWT auth |
| Domain Services | Python | Business rules, LLM prompts, scraping |
| Repositories | SQLAlchemy | ACID persistence |
| SPA Frontend | React + Vite | Interactive Q&A, live preview |
| Styling | Tailwind CSS | Responsive, accessible UI |
| CI/CD | GitHub Actions | Lint → test → build → deploy |
| Hosting | DigitalOcean droplet + nginx | Reverse proxy, SSL termination |

---

## 🔄 Data Flow  
1. User registers → JWT issued  
2. Answers questionnaire → answers stored relationally  
3. Backend orchestrates:  
   - Scrapes latest market data  
   - Builds structured context  
   - Sends prompt to OpenAI → returns narrative sections  
4. Frontend streams sections in real-time  
5. User exports → backend assembles PDF → signed URL returned  

---

## 🧪 Tech Stack  
**Backend**  
- Python 3.11  
- FastAPI  
- SQLAlchemy 2.0 (async)  
- PostgreSQL 15  
- OpenAI API  
- BeautifulSoup4  
- PyTest, ruff, black  

**Frontend**  
- React 18  
- Vite  
- Tailwind CSS  
- ESLint + Prettier  
- Axios  

**DevOps**  
- Docker  
- GitHub Actions  
- nginx  
- DigitalOcean  
- Certbot (Let’s Encrypt)

---

## 📁 Project Structure  
bezplanner/
├── backend/
│   ├── alembic/               # DB migrations
│   ├── app/
│   │   ├── api/               # Route handlers
│   │   ├── core/              # Config, security
│   │   ├── models/            # SQLAlchemy models
│   │   ├── services/            # Domain logic
│   │   └── main.py
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── main.jsx
│   ├── public/
│   ├── tailwind.config.js
│   └── vite.config.js
├── .github/workflows/
├── docker-compose.yml
└── README.md
---

## ⚙️ Installation & Usage  

### 1. Clone  
bash
git clone https://github.com/abdul-0-muheed/bezplanner.git
cd bezplanner
### 2. Backend  
bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env              # fill variables
alembic upgrade head
uvicorn app.main:app --reload
Backend runs on [http://localhost:8000](http://localhost:8000) – interactive docs at `/docs`.

### 3. Frontend  
bash
cd ../frontend
npm install
cp .env.example .env.local        # add VITE_API_URL=http://localhost:8000
npm run dev
Frontend runs on [http://localhost:5173](http://localhost:5173).

### 4. One-liner with Docker  
bash
docker-compose up --build
---

## 🔌 API / Integrations  
- REST contract versioned at `/api/v1`  
- Swagger/OpenAPI 3 auto-generated at `/docs`  
- Integrations: OpenAI (GPT-4), web-scraped market data (no API keys required)  

---

## 🔐 Environment Variables  
| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL DSN |
| `JWT_SECRET_KEY` | HS256 signing key |
| `OPENAI_API_KEY` | GPT access |
| `CORS_ORIGINS` | Comma-separated list |
| `ENVIRONMENT` | `local`, `staging`, `production` |

---

## 🧪 Testing & Build  

**Backend**  
bash
cd backend
pytest -q
**Frontend**  
bash
cd frontend
npm run lint
npm run build
**CI**  
Every push to `main` triggers lint → test → build → docker push → deploy via GitHub Actions.

---

## 📝 Notes  
- No blob storage; all data relational for simplicity & GDPR deletes.  
- Stateless containers make horizontal scaling trivial.  
- Rate-limiting & request-id tracing baked into FastAPI middleware.  

---

## 🤝 Contributing  
1. Fork  
2. Create feature branch (`git checkout -b feature/amazing-feature`)  
3. Commit (`git commit -m 'Add amazing feature'`)  
4. Push & open a PR  

---

## 📄 License  
MIT – see [LICENSE](LICENSE) for details.

---

## 📬 Contact  
Open an issue or start a discussion in the GitHub repo.