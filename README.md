# Modern Electronics E-Commerce Store

This is a premium, full-stack electronics e-commerce application featuring an ultra-modern dark theme, glassmorphism UI cards, micro-animations, dynamic products catalog browsing, a shopping cart, a secure checkout wizard, and a fully functional admin dashboard.

The application is configured for a **unified deployment** where the Express server hosts and serves the React frontend statically, eliminating CORS issues and simplifying online deployment.

---

## Setup Instructions (Local Running)

### Prerequisites
- **Node.js** (v16.0.0 or higher)
- **MongoDB** (A local database running on port `27017` OR a MongoDB Atlas cloud URI)

---

### Step 1: Install Dependencies
From the root directory (`d:/yaya/yaya/`), run the following command to install dependencies for both the frontend and backend:
```bash
npm run setup
```

---

### Step 2: Configure Environment Variables
Create a `.env` file inside the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/electronics-store
JWT_SECRET=mycustomsupersecurejwtsecretkey987654321
```

---

### Step 3: Run the Application Locally
You can run the frontend and backend development servers separately:

1. **Start Backend Server** (runs on port 5000):
   ```bash
   npm run server
   ```
2. **Start Frontend Client** (runs on port 5174, with API calls proxied to port 5000):
   ```bash
   npm run client
   ```

---

## 🚀 One-Step Deployment Guide (Online Hosting)

Because the project is configured for a unified deployment, you only need to host the backend! The Express server will compile and serve the React website automatically.

### Step 1: Create a MongoDB Cloud Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free database.
2. Copy your connection string (e.g. `mongodb+srv://<username>:<password>@cluster0.mongodb.net/store`).

### Step 2: Push Your Project to GitHub
Initialize git and push the files to your GitHub account:
```bash
git init
git add .
git commit -m "Initial commit: unified e-commerce site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

### Step 3: Deploy on Render.com
1. Sign in to [Render.com](https://render.com) using your GitHub account.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Root Directory**: *(Leave empty)*
   - **Build Command**: `npm run setup && npm run build`
   - **Start Command**: `npm start`
5. Go to the **Environment** tab and add the following variables:
   - `MONGO_URI` = *(Your MongoDB Atlas connection string)*
   - `JWT_SECRET` = *(Any strong secure key)*
6. Click **Deploy Web Service**.

Once the build is complete, Render will provide a URL. Opening this URL will load your fully working e-commerce storefront with the database active!
