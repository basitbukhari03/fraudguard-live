# 🛡️ FraudGuard — AI-Powered Fraud Detection Platform

**Live:** [https://fraudguard.live](https://fraudguard.live)

FraudGuard is a real-time fraud detection web application that uses machine learning to analyze financial transactions and predict fraudulent activity with high accuracy.

---

## ✨ Features

- 🔍 **Real-Time Fraud Detection** — Analyze transactions instantly with AI
- 🤖 **XGBoost ML Model** — Trained on real-world fraud patterns with 30+ engineered features
- 📊 **Risk Scoring** — Get fraud probability percentages and risk level (Low/Medium/High)
- 💡 **Risk Insights** — AI-generated explanations for why a transaction is suspicious
- 📈 **Transaction History** — Track and filter all analyzed transactions
- 🔐 **Secure Authentication** — JWT-based auth with email verification (OTP)
- ✉️ **Email Verification** — Only verified emails (Gmail, Outlook, Yahoo, etc.) can register
- 🌙 **Dark Theme UI** — Premium glassmorphism design with smooth animations

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI Components |
| **React Router** | Client-side routing |
| **React Query** | Server state management |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Flask (Python)** | REST API |
| **XGBoost** | ML Fraud Detection Model |
| **MongoDB Atlas** | User Database |
| **Flask-Mail** | Email OTP Verification |
| **JWT (PyJWT)** | Authentication Tokens |
| **scikit-learn** | Feature Engineering Pipeline |

### Deployment
| Service | Component |
|---------|-----------|
| **Vercel** | Frontend Hosting |
| **Render** | Backend API Hosting |
| **MongoDB Atlas** | Cloud Database |

---

## 📂 Project Structure

```
src/
├── components/ui/     # Reusable UI components (shadcn/ui)
├── contexts/          # React Context providers
│   ├── AuthContext.tsx           # Authentication state
│   └── TransactionHistoryContext.tsx  # Transaction history
├── hooks/             # Custom React hooks
├── pages/             # Route pages
│   ├── Index.tsx      # Landing page
│   ├── Login.tsx      # Sign in
│   ├── Register.tsx   # Sign up with email validation
│   ├── Verify.tsx     # OTP email verification
│   ├── Dashboard.tsx  # Main dashboard with prediction form
│   └── History.tsx    # Transaction history with filters
├── services/          # API integration
│   ├── api.ts         # Fraud prediction API
│   └── auth.ts        # Authentication + email verification API
├── types/             # TypeScript interfaces
└── App.tsx            # Root component with routes
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/basitbukhari03/fraudguard-live.git

# Navigate to the project
cd fraudguard-live

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE=https://fraudguard-api-udbp.onrender.com
```

---

## 🔒 Authentication Flow

```
1. User registers with name, email, password
2. Email domain validated (Gmail, Outlook, Yahoo, etc. only)
3. 6-digit OTP sent to email
4. User verifies OTP → Account activated
5. JWT token issued → User logged in
```

---

## 📱 Mobile App

FraudGuard also has a **React Native + Expo** mobile app that connects to the same backend API.

See the [FraudGuardApp](../FraudGuardApp/) directory for the mobile app source code.

---

## 📄 License

This project is part of a university research project on fraud detection using machine learning.

---

**Built by [Muhammad Basit](https://github.com/basitbukhari03)** 🚀
