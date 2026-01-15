# Deployment Guide

Your MERN stack application is ready for deployment. The project is split into `client` (Frontend) and `server` (Backend).

## 1. Prerequisites

- **GitHub Account**: Push your code to a GitHub repository.
- **Render Account**: For deploying the backend (Node.js).
- **Vercel Account**: For deploying the frontend (Vite React).
- **MongoDB Atlas**: Ensure you have a MongoDB connection string that allows access from anywhere (`0.0.0.0/0`) or specific IPs.
- **Cloudinary**: Ensure you have your Cloud Name, API Key, and API Secret.

## 2. Prepare the Code

I have updated the critical Admin files to use a dynamic `API_URL`. However, you should perform a global Find & Replace in your `client/src` folder to ensure all files point to the configuration:

1.  **Search**: `http://localhost:5000/api`
2.  **Replace**: Be careful.
    - If efficient, ensure `import API_URL from "../config";` (or `../../config`) is at the top of the file.
    - Replace the string with `${API_URL}`.

**Alternative (Simpler for Production)**:
If you don't want to edit all files, you can just Find & Replace `http://localhost:5000` with your **Production Backend URL** (e.g., `https://my-saree-app-api.onrender.com`) right before deploying.

## 3. Deploy Backend (Render)

1.  Log in to [Render](https://render.com).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  **Root Directory**: `server`
5.  **Build Command**: `npm install`
6.  **Start Command**: `node server.js`
7.  **Environment Variables**:
    Add the following keys from your `server/.env`:
    - `MONGO_URI`: `your_mongodb_connection_string`
    - `JWT_SECRET`: `your_secret`
    - `CLOUDINARY_CLOUD_NAME`: `...`
    - `CLOUDINARY_API_KEY`: `...`
    - `CLOUDINARY_API_SECRET`: `...`
    - `EMAIL_USER`: `...`
    - `EMAIL_PASS`: `...`
    - `ADMIN_EMAIL`: `...`
8.  Click **Deploy**.
9.  Once deployed, copy the **Service URL** (e.g., `https://saree-api.onrender.com`).

## 4. Deploy Frontend (Vercel)

1.  Log in to [Vercel](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Root Directory**: Click "Edit" and select `client`.
5.  **Build Command**: `npm run build` (Default)
6.  **Output Directory**: `dist` (Default)
7.  **Environment Variables**:
    - `VITE_API_URL`: Paste your Render Backend URL here (e.g., `https://saree-api.onrender.com/api`).
8.  Click **Deploy**.

## 5. Verify

1.  Open your Vercel URL.
2.  Check the Network tab to ensure requests are going to `onrender.com` and not `localhost`.
3.  Test login, registration, and image uploads.

## Note on Images

Your application handles image uploads using **Cloudinary**, so your images will persist correctly even on server restarts. Great job!

## Troubleshooting

- **CORS Error**: If you see CORS errors in the browser console, you may need to update `server/server.js` to explicitly allow your Vercel domain:
  ```javascript
  ```

## 6. Using a Custom Domain (www.yourname.com)

Yes! You can easily connect your own domain to your website.

### **Frontend (Vercel)**
This is what your users will type to see your website.

1.  Go to your Project Settings in **Vercel**.
2.  Click on **Domains** in the left sidebar.
3.  Enter your domain (e.g., `www.yourname.com`) and click **Add**.
4.  Vercel will give you DNS records (usually an **A Record** or **CNAME Record**).
5.  Log in to where you bought your domain (GoDaddy, Namecheap, BigRock, etc.).
6.  Go to **DNS Management** and add the records Vercel showed you.
    - *Example*: Host: `www`, Points to: `cname.vercel-dns.com`
7.  Wait a few minutes (up to 24 hours), and your site will be live at `www.yourname.com`!

### **Backend (Render) - Optional**
You can also map your API to a subdomain like `api.yourname.com`, but it is **not required**. Your frontend at `www.yourname.com` can talk to `saree-api.onrender.com` without issues.

If you *want* a custom API domain:
1.  Go to your Service in **Render**.
2.  Go to **Settings** > **Custom Domains**.
3.  Add `api.yourname.com`.
4.  Add the DNS `CNAME` record provided by Render to your domain provider.
5.  **Important**: If you do this, remember to update `VITE_API_URL` in Vercel to `https://api.yourname.com/api`.
