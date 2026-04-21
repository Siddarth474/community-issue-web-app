# 🌍 Community Issue Tracker

A full-stack web application that empowers citizens to report and track local civic issues such as potholes, broken streetlights, and garbage dumps — with real-time community engagement.

---

## 🚀 Overview

The **Community Issue Tracker** is designed to bridge the gap between citizens and local authorities by providing a transparent, interactive platform to highlight and prioritize civic problems.

Users can:

* 📍 Report issues directly on a map
* 🗳️ Vote on existing issues
* 💬 Discuss problems through comments
* ⚡ See updates in real-time

---

## ✨ Features

### 🗺️ Interactive Map

* Built using **Leaflet.js**
* Custom markers based on issue categories
* Click-to-report functionality with precise geolocation

### ⚡ Real-Time Updates

* Powered by **Socket.io**
* Live updates for:

  * Votes
  * Comments
  * Issue status

### 📈 Voting System

* Upvote / Downvote mechanism
* Helps prioritize issues based on community feedback

### 💬 Comment System

* Threaded discussions under each issue
* Enables community engagement and updates

### 🖼️ Image Upload

* Integrated with **Cloudinary**
* Users can attach images to issues for better context

### 🤖 AI Description Helper

* Powered by **Gemini API**
* Assists users in generating meaningful issue descriptions

### 🔐 Authentication

* Implemented using **NextAuth.js**
* Secure login & signup

### 🎨 UI/UX

* Fully responsive design
* Built with **Tailwind CSS** and **shadcn/ui**
* Light/Dark mode support

---

## 🧱 Tech Stack

### Frontend

* Next.js
* React
* Tailwind CSS
* shadcn/ui
* Leaflet.js

### Backend

* Next.js API Routes
* Express (modular logic)
* Node.js

### Database

* MongoDB

### Real-Time

* Socket.io

### Authentication

* NextAuth.js

### Media & AI

* Cloudinary
* Gemini API

---

## 📂 Project Structure

```bash
.
├── next-client/               # Next.js Frontend & API Routes
│   ├── public/                # Static assets
│   └── src/
│       ├── app/               # Next.js App Router (Pages & API)
│       ├── components/        # Reusable UI components
│       ├── context/           # Global state management
│       ├── db/                # Database connection logic
│       ├── helpers/           # Helper & utility functions
│       ├── lib/               # Libraries and configurations
│       ├── models/            # MongoDB schemas
│       └── middleware.js      # Next.js middleware
├── socket-server/             # Dedicated real-time WebSocket server
│   └── server.js              # Express & Socket.io setup
├── package.json               # Root dependencies/scripts
└── README.md                  # Project documentation
```

---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/community-issue-tracker.git
cd community_issue_tracker
```

---

### 2️⃣ Install Dependencies

```bash
cd next-client
npm install
cd ..
cd socket-server
npm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env.local` file in the root directory and add:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Auth
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
ACCESS_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=your_secret
REFRESH_TOKEN_SECRET=your_secret
REFRESH_TOKEN_EXPIRY=your_secret

# Socket.io
NEXT_PUBLIC_SOCKET_URL=your_socket_url

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Gemini API
GEMINI_API_KEY=your_gemini_api_key
```

---

### 4️⃣ Run the Development Server

```bash
npm run dev
```

App will be running at:

👉 [http://localhost:3000](http://localhost:3000)

---

## 🔄 Real-Time Flow (How It Works)

1. User reports an issue → stored in MongoDB
2. Event emitted via Socket.io
3. All connected clients receive update instantly
4. UI re-renders with latest data

---

## 🧪 Key Functionalities to Test

* Create a new issue on map
* Upload image with issue
* Upvote/downvote an issue
* Add comments
* Observe real-time updates across multiple tabs
* Use AI description helper

---

## 📌 Future Improvements

* 📊 Admin dashboard for authorities
* 📍 Issue status tracking (resolved / in-progress)
* 🔔 Notifications system
* 🧠 Better AI suggestions
* 📱 Progressive Web App (PWA) support

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Make your changes
4. Submit a PR

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Final Thoughts

This project demonstrates:

* Real-time system design
* Full-stack architecture
* Map-based UI integration
* Scalable backend patterns

If you found this interesting, feel free to ⭐ the repo!
