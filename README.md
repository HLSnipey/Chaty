# Chaty

A colorful, realtime chat app. One HTML file. Powered by Supabase.

---

## Setup Steps

### 1. Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Open **SQL Editor** and run:

```sql
-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null,
  email text,
  created_at timestamp with time zone default now()
);

-- Messages table
create table messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references profiles(id) on delete cascade not null,
  receiver_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table messages enable row level security;

-- Profiles: anyone logged in can read all profiles
create policy "Read profiles" on profiles
  for select using (auth.role() = 'authenticated');

-- Profiles: users can upsert their own
create policy "Upsert own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Messages: users can read their own conversations
create policy "Read own messages" on messages
  for select using (
    auth.uid() = sender_id or auth.uid() = receiver_id
  );

-- Messages: users can send messages
create policy "Send messages" on messages
  for insert with check (auth.uid() = sender_id);

-- Realtime: enable for messages table
-- Go to Database > Replication and enable messages table
```

3. Go to **Project Settings → API** and copy:
   - `Project URL`
   - `anon public` key

### 2. Configure index.html

Open `index.html` and replace lines near the top:

```js
const SUPABASE_URL = 'YOUR_SUPABASE_URL';       // paste your URL
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // paste your anon key
```

### 3. Enable Realtime

In Supabase dashboard:
- Go to **Database → Replication**
- Toggle ON the `messages` table

### 4. Deploy to GitHub Pages

```bash
git init
git add index.html README.md
git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/chaty.git
git push -u origin main
```

Then in GitHub repo → **Settings → Pages** → Source: `main` branch → Save.

Your app will be live at: `https://YOUR_USERNAME.github.io/chaty`

---

## Features

- Login / Sign Up with email + password
- See all registered users with avatars
- Search users by name
- One-on-one chat with realtime messages (Supabase Realtime)
- Sent messages appear on right (gradient), received on left
- Colorful modern dark UI
