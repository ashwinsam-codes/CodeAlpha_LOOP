# LOOP — Modern Minimalist Social Media Platform

A clean, modern, and fully functional social media platform inspired by the minimalist aesthetics of contemporary social networks. Designed with a pure monochrome palette (crisp white background, rich black typography, and subtle grey accents) focusing on natural, realistic photography and seamless interactions.

---

## 🌟 Key Features

1. **Authentication & Security**
   - User registration and login powered by **JSON Web Tokens (JWT)** and **bcryptjs** password hashing.
   - 1-click test logins for instant exploration (pre-configured with realistic accounts).
   - Session persistence via secure local storage.

2. **Clean Modern Design (Threads / X Minimalist Aesthetic)**
   - **Monochrome UI**: Crisp white background (`#ffffff`), dark black text (`#09090b`), and subtle grey borders (`#e2e8f0`).
   - **Three-Column Desktop Layout**:
     - **Left Navigation Sidebar**: Brand logo, Home feed, Explore, Profile, and quick "Create Post" button.
     - **Center Main Viewport**: Feed stream, inline post publisher, and rich interaction area.
     - **Right Sidebar**: Instant live user search, "Suggested for you" creator recommendations, and community tags.
   - **Responsive Design**: Auto-adapts to tablets and mobile devices with a sleek bottom navigation bar.

3. **Authentic Realistic Photography**
   - Strictly realistic, natural photographs from Unsplash (no cartoon avatars, 3D illustrations, or synthetic graphics).
   - Real portraits for user avatars.
   - High-quality natural photos for posts (coffee, architecture, nature hikes, artisan bread, urban life, desk setups).
   - Built-in realistic photo preset picker + direct local file upload + image URL support.

4. **Rich Social Interactions**
   - **Home Feed**: Real-time sorted posts with creator avatars, timestamps, and captions.
   - **Likes & Unlikes**: Instant optimistic toggle with dynamic heart animation and count tracking.
   - **Comments**: Full discussion drawer with author avatars, comment deletion permissions, and new comment publisher.
   - **User Profiles**: View full profiles with banner, avatar, bio, follower count, following count, and dedicated post history.
   - **Follow / Unfollow**: Mutual follow system updating following/follower counters live.
   - **Edit Profile**: Update full name, bio, and choose or upload a new profile picture.
   - **Instant Search**: Debounced live search dropdown querying creators by username or name.

---

## 📁 Project Structure

```text
loop/
├── backend/
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── models/
│   │   ├── Post.js             # Post & nested Comment Mongoose schema
│   │   └── User.js             # User Mongoose schema (followers, following, bio)
│   ├── routes/
│   │   ├── auth.js             # Register, login, and /me endpoints
│   │   ├── posts.js            # Post CRUD, like toggle, comment CRUD
│   │   └── users.js            # User search, suggestions, profiles, follow toggle
│   ├── .env                    # Environment variables (PORT, MONGODB_URI, JWT_SECRET)
│   ├── package.json            # Backend scripts and dependencies
│   ├── seed.js                 # Database seeder with realistic test data & photos
│   └── server.js               # Express server entry point & static file handler
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CommentItem.jsx       # Individual comment item with delete capability
│   │   │   ├── CreatePost.jsx        # Post publisher with presets & file upload
│   │   │   ├── EditProfileModal.jsx  # Edit name, bio, and profile photo
│   │   │   ├── NavbarMobile.jsx      # Bottom navigation bar for mobile devices
│   │   │   ├── PostCard.jsx          # Post card with like, comment, share, & media
│   │   │   ├── RightSidebar.jsx      # Search bar, suggested users, and info widget
│   │   │   ├── Sidebar.jsx           # Left navigation bar with user quick card
│   │   │   └── UserCard.jsx          # Reusable user recommendation item
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # React Context managing auth state & sessions
│   │   ├── pages/
│   │   │   ├── Explore.jsx           # Discovery page with live search & creators
│   │   │   ├── Home.jsx              # Main home feed stream
│   │   │   ├── Login.jsx             # Minimalist login with 1-click test accounts
│   │   │   ├── Profile.jsx           # User profile, follower counts, and posts
│   │   │   └── Register.jsx          # Account registration with photo picker
│   │   ├── services/
│   │   │   └── api.js                # Axios instance with JWT interceptors
│   │   ├── utils/
│   │   │   └── photoPresets.js       # Curated realistic photography collection
│   │   ├── App.jsx                   # Main layout coordinator
│   │   ├── App.css                   # Custom responsive modern stylesheet
│   │   ├── index.css                 # Design tokens and CSS reset
│   │   └── main.jsx                  # React application entry point
│   ├── index.html                    # Root HTML template with Inter typography
│   ├── package.json                  # Frontend dependencies (React, Lucide, Axios)
│   └── vite.config.js                # Vite build and proxy configuration
├── package.json                      # Root convenience scripts
└── README.md                         # Documentation and setup guide
```

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Lucide React (minimalist iconography) |
| **Styling** | Clean Modular CSS (Custom CSS design system, Inter typography) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |

---

## 🚀 Quick Start Guide

### Prerequisites
1. **Node.js**: v18.0.0 or higher
2. **MongoDB**: Local MongoDB instance running at `mongodb://127.0.0.1:27017` (or a MongoDB Atlas connection URI).

---

### Step 1: Clone or Navigate to the Project

```bash
cd "C:\Users\ELCOT\.gemini\antigravity\scratch\loop"
```

---

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

---

### Step 3: Configure Environment Variables

The backend already includes a pre-configured `.env` file in the `backend/` directory:

```env
PORT=5050
MONGODB_URI=mongodb://127.0.0.1:27017/loop
JWT_SECRET=loop_secret_super_key_jwt_2026_modern_social
```

*(If you are using MongoDB Atlas, replace `MONGODB_URI` with your connection string).*

---

### Step 4: Seed the Database with Realistic Test Accounts & Posts

Run the automated seeder to populate the database with realistic photography, active user accounts, mutual follow relationships, and discussions:

```bash
cd backend
npm run seed
```

**Pre-seeded Test Accounts** (Password for all accounts: `password123`):
- `sarah_j` — Sarah Jenkins (`sarah@example.com`)
- `marcus_c` — Marcus Chen (`marcus@example.com`)
- `elena_r` — Elena Rostova (`elena@example.com`)
- `david_m` — David Miller (`david@example.com`)
- `maya_p` — Maya Patel (`maya@example.com`)
- `alex_r` — Alex Rivera (`alex@example.com`)

---

### Step 5: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

### Step 6: Run the Application

You can run the application in two ways:

#### Option A: Development Mode (Hot Reloading)

In Terminal 1 (Backend):
```bash
cd backend
npm run dev
# Running on http://localhost:5050
```

In Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
# Running on http://localhost:3000
```
Open **`http://localhost:3000`** in your browser.

#### Option B: Unified Production Server (Single Port)

Build the React frontend and let Express serve both the API and the user interface on a single port:

```bash
cd frontend
npm run build

cd ../backend
node server.js
```
Open **`http://localhost:5050`** in your browser.

---

## 🧪 Testing Checklist

- [x] **Sign In / Sign Up**: Use the 1-click test buttons on the login page or create a brand new account.
- [x] **Home Feed**: Scroll through posts featuring authentic, realistic photographs.
- [x] **Like Post**: Click the heart button; observe real-time count increment and red heart fill.
- [x] **Comments**: Click the comment icon, view existing remarks, and post a new comment.
- [x] **Create Post**: Type a thought, choose a realistic photo preset or upload a picture, and post.
- [x] **Search Users**: Type "marcus" or "elena" in the right sidebar search bar to see live results.
- [x] **View Profile**: Click any avatar or username to view their profile, follower count, and posts.
- [x] **Follow / Unfollow**: Follow any creator from the right sidebar or directly from their profile page.
- [x] **Edit Profile**: Open your own profile, click "Edit Profile", update your bio or select a new photo.
