# Chaty — Social + Chat App

Posts · Reactions · Comments · Photo/Video/File uploads · Realtime chat with file sharing

---

## Firebase Setup (takes ~10 minutes)

### 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it `chaty` → Continue → Create project

---

### 2. Enable Authentication

- In your project: **Build → Authentication → Get started**
- Click **Email/Password** → Enable → Save

---

### 3. Enable Firestore

- **Build → Firestore Database → Create database**
- Choose **Start in test mode** (we'll lock it down later)
- Pick any region → Done

**After creating, go to the Rules tab and paste:**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == uid;
    }
    match /posts/{pid} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    match /posts/{pid}/comments/{cid} {
      allow read, write: if request.auth != null;
    }
    match /chats/{roomId} {
      allow read, write: if request.auth != null &&
        request.auth.uid in resource.data.members;
      allow create: if request.auth != null;
    }
    match /chats/{roomId}/messages/{mid} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

### 4. Enable Storage

- **Build → Storage → Get started**
- Start in test mode → Done

**After creating, go to Storage Rules tab and paste:**

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

### 5. Get your config

- **Project Settings** (gear icon) → **General** → scroll to **Your apps**
- Click **</>** (Web) → Register app → Copy the `firebaseConfig` object

It looks like:
```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456:web:abc123"
};
```

---

### 6. Paste config into index.html

Open `index.html`, find the section near the top that says:

```js
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  ...
```

Replace the whole object with your real config.

---

### 7. Deploy to GitHub Pages

```bash
git init
git add index.html README.md
git commit -m "init chaty"
git remote add origin https://github.com/YOUR_USERNAME/chaty.git
git push -u origin main
```

Then: GitHub repo → **Settings → Pages** → Source: `main` → Save

Your app: `https://YOUR_USERNAME.github.io/chaty`

---

## Features

| Feature | Details |
|---|---|
| Auth | Email + password, no rate limits |
| Feed | Create posts with text, photos, GIFs, videos, files |
| Reactions | ❤️ 🔥 😂 😮 👍 🎉 with live counts |
| Comments | Threaded comments on every post |
| People | Browse and search all registered users |
| Chat | Realtime 1-on-1 messaging |
| File sharing in chat | Images, videos, any file type |
| Lightbox | Click any image to view full size |
| Mobile | Full responsive, slide-panel navigation |

---

## Add users manually (no email needed)

Firebase console → **Authentication → Users → Add user** → fill email + password → Add user.

No email confirmation sent. They can log in immediately.
