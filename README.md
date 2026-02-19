# 🎫 AI-Powered Support Ticket System

A modern, full-stack Support Ticket System built with the **MERN Stack** (MongoDB, Express, React, Node.js) and **Docker**. This application features an intelligent **LLM Integration** that automatically categorizes tickets and suggests priority levels based on user descriptions.

## ✨ Features

- **🤖 AI Auto-Classification**: Uses OpenAI (GPT-3.5) to analyze ticket descriptions and suggest accurate Categories and Priority levels in real-time.
- **📊 Real-time Dashboard**: Visualizes key metrics like Total Tickets, Open Count, Average Tickets/Day, and distributions using efficient MongoDB Aggregations.
- **📱 Fully Responsive Design**: Built with **Tailwind CSS**, ensuring a seamless experience on both Desktop and Mobile devices.
- **⚡ Optimistic UI**: Instant feedback on status updates (Open -> In Progress -> Resolved) for a snappy user experience.
- **🔍 Advanced Filtering**: Search by keyword and filter by Status, Priority, and Category simultaneously.
- **🐳 Dockerized**: standardized development environment using `docker-compose`.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **AI/LLM**: OpenAI API (`gpt-3.5-turbo`)
- **DevOps**: Docker, Docker Compose

## 🚀 Getting Started

### Prerequisites
- Docker Desktop (Running)
- OpenAI API Key

### Option 1: Run with Docker (Recommended)

1.  **Clone the repository**:
    ```bash
    git clone <repository_url>
    cd SupportTicketSystem
    ```

2.  **Configure Environment**:
    - The project comes with a root `.env` file. Ensure it contains your API Key:
      ```env
      OPENAI_API_KEY=your_openai_api_key_here
      ```

3.  **Start the Application**:
    ```bash
    docker-compose up --build
    ```

4.  **Access the App**:
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Backend API: [http://localhost:5000](http://localhost:5000)

### Option 2: Run Locally (Without Docker)

**Backend:**
1.  Navigate to `backend/`.
2.  Create a `.env` file:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    OPENAI_API_KEY=your_openai_api_key
    ```
3.  Install & Run:
    ```bash
    npm install
    npm start
    ```

**Frontend:**
1.  Navigate to `frontend/`.
2.  Install & Run:
    ```bash
    npm install
    npm run dev
    ```

## 🧠 Design Decisions & LLM Choice

### Why OpenAI (GPT-3.5)?
We chose **OpenAI's GPT-3.5-turbo** for the classification engine because:
1.  **Speed & Cost**: It balances response time with cost-effectiveness, which is crucial for a real-time "on-blur" UI interaction.
2.  **Accuracy**: Zero-shot classification performance for support contexts is excellent.
3.  **Reliability**: High availability ensures users aren't blocked from submitting tickets.

### Architectural Choices
- **MongoDB Aggregation**: Instead of calculating stats (like "Average Tickets Per Day") in JavaScript, we utilize MongoDB's native aggregation pipeline for performance scalability.
- **Separation of Concerns**: The LLM interaction is isolated in a `llmService.js` module. This allows for easy swapping of models (e.g., to Anthropic or a local Llama model) without rewriting controller logic.
- **Graceful Degradation**: If the LLM service fails or the API key is missing, the system defaults to "General" category and "Medium" priority, ensuring the core functionality (creating a ticket) never breaks.
- **Component-Based UI**: The React frontend is broken down into reusable components (`TicketList`, `TicketForm`, `StatsDashboard`) for maintainability.

## 📂 Project Structure

```
SupportTicketSystem/
├── backend/                # Node.js/Express Server
│   ├── config/             # DB Connection logic
│   ├── controllers/        # Request handlers (Tickets, Stats)
│   ├── models/             # Mongoose Schemas
│   ├── routes/             # API Route definitions
│   └── services/           # External services (OpenAI)
├── frontend/               # React Client
│   ├── src/
│   │   ├── components/     # UI Components (Form, List, Dashboard)
│   │   └── api.js          # Axios configuration
│   └── tailwind.config.js  # Styling configuration
├── docker-compose.yml      # Container orchestration
└── .env                    # Environment variables (API Keys)
```

## 🧪 Testing

The repository includes a comprehensive set of functional features that can be tested manually:
1.  **Submit a Ticket**: Type a description and watch the "Category" and "Priority" dropdowns auto-update.
2.  **Check Stats**: Verify the dashboard counters increment immediately.
3.  **Filter**: Use the search bar or dropdowns to slice the data.
