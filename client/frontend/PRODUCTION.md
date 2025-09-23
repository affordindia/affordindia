# Production Deployment Guide

## 🚀 **Production-Ready Configuration**

### **1. Environment Variables**
Update `.env` for your production environment:

```bash
# Production API URL (replace with your deployed backend)
VITE_API_BASE_URL=https://your-backend-domain.com/api

# Firebase Configuration (keep these values for your project)
VITE_FIREBASE_API_KEY=AIzaSyAWs4SbO_0noOgRTWDX9hwwIbTe1aGgwJw
VITE_FIREBASE_AUTH_DOMAIN=affordindia-a602c.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=affordindia-a602c
VITE_FIREBASE_STORAGE_BUCKET=affordindia-a602c.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=737953463509
VITE_FIREBASE_APP_ID=1:737953463509:web:138c2c1e58b04f4b20b65c
VITE_FIREBASE_MEASUREMENT_ID=G-XY9TS5K7K9
```

### **2. Firebase Console Configuration**

#### **A. Add Production Domain**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `affordindia-a602c`
3. Go to **Authentication > Settings > Authorized Domains**
4. Add your production domain: `your-domain.com`

#### **B. Update API Key Restrictions**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find API key: `AIzaSyAWs4SbO_0noOgRTWDX9hwwIbTe1aGgwJw`
3. Add HTTP referrers:
   - `your-domain.com/*`
   - `https://your-domain.com/*`

### **3. Build for Production**

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### **4. Security Checklist**

✅ **Environment Variables**: All sensitive config in `.env`
✅ **Firebase Rules**: Proper security rules for Firestore/Storage
✅ **API Validation**: Backend validates all requests
✅ **HTTPS**: Use HTTPS in production
✅ **CORS**: Configure CORS for your domain
✅ **Error Handling**: No sensitive data in error messages

### **5. Performance Optimizations**

✅ **Code Splitting**: Vite handles automatically
✅ **Tree Shaking**: Unused code removed
✅ **Image Optimization**: Compress images in `assets/`
✅ **Bundle Analysis**: Run `npm run build -- --report`

### **6. Deployment Platforms**

#### **Frontend (Static Hosting)**
- **Vercel**: `npm i -g vercel && vercel`
- **Netlify**: Drag & drop `dist/` folder
- **Firebase Hosting**: `firebase deploy`

#### **Backend (Node.js)**
- **Railway**: Connect GitHub repo
- **Render**: Deploy from GitHub
- **DigitalOcean**: App Platform

### **7. Monitoring & Analytics**

- **Firebase Analytics**: Already configured
- **Error Tracking**: Add Sentry for production errors
- **Performance**: Use Firebase Performance Monitoring

### **8. Production Environment Variables**

Create `.env.production`:
```bash
VITE_API_BASE_URL=https://your-backend.com/api
VITE_FIREBASE_API_KEY=AIzaSyAWs4SbO_0noOgRTWDX9hwwIbTe1aGgwJw
VITE_FIREBASE_AUTH_DOMAIN=affordindia-a602c.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=affordindia-a602c
VITE_FIREBASE_STORAGE_BUCKET=affordindia-a602c.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=737953463509
VITE_FIREBASE_APP_ID=1:737953463509:web:138c2c1e58b04f4b20b65c
VITE_FIREBASE_MEASUREMENT_ID=G-XY9TS5K7K9
```

---

## 🛡️ **Security Notes**

- Firebase client config is **safe to expose** (it's public by design)
- Real security is in Firebase rules and backend validation
- Never expose server keys or admin SDK credentials
- Use HTTPS in production for all communication
