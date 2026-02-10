# Stranger Chat - Anonymous Chat Application

A real-time anonymous chat application built with Node.js, Express, and Socket.io.

## 🚀 Quick Deployment (Free)

### Option 1: Render.com (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git create remote add origin https://github.com/YOUR_USERNAME/stranger-chat
   git push -u origin main
   ```

2. **Deploy to Render**
   - Go to [render.com](https://render.com) and sign up
   - Connect your GitHub account
   - Click "New +" → "Web Service"
   - Select your repository
   - Configure:
     - **Build Command:** `npm install`
     - **Start Command:** `node server.js`
     - **Instance Type:** Free
   - Click "Create Web Service"

3. **Your app will be available at:** `https://your-app-name.onrender.com`

---

### Option 2: Railway.app

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Click "Deploy Now"
5. Your app will be available at: `https://your-project-name.railway.app`

---

### Option 3: Cyclic.sh

1. Go to [cyclic.sh](https://cyclic.sh) and sign up
2. Connect your GitHub account
3. Click "Deploy Now"
4. Select your repository
5. Your app will be available at: `https://your-app-name.cyclic.sh`

---

## 🖥️ Local Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Start Development Server
```bash
npm start
```

The app will be available at `http://localhost:3000`

### Start with Network Access
```bash
chmod +x start-local.sh
./start-local.sh
```

This will show your local IP address for network testing.

---

## 🎯 Features

- **100% Anonymous** - No registration required
- **Real-time Chat** - Instant messaging with Socket.io
- **Random Matching** - Connect with random strangers
- **Typing Indicators** - See when your partner is typing
- **Responsive Design** - Works on desktop and mobile
- **WebSocket Support** - Full bidirectional communication

---

## 📁 Project Structure

```
stranger-chat/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # Styling
│   └── client.js       # Client-side JavaScript
├── server.js           # Express + Socket.io server
├── package.json        # Dependencies
├── Procfile            # Deployment config
└── README.md           # Documentation
```

---

## 🔧 Tech Stack

- **Backend:** Node.js, Express
- **Real-time:** Socket.io
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Deployment:** Render.com / Railway / Cyclic

---

## 🌐 API Reference

### Socket Events

**Client → Server:**
- `find_stranger` - Start looking for a chat partner
- `send_message` - Send a message to partner
- `typing` - User started typing
- `stop_typing` - User stopped typing
- `end_chat` - End current chat
- `disconnect` - User disconnected

**Server → Client:**
- `system_message` - System notifications
- `chat_started` - Chat connection established
- `receive_message` - Incoming message
- `partner_typing` - Partner is typing
- `partner_stop_typing` - Partner stopped typing
- `chat_ended` - Chat session ended

---

## 📝 License

MIT License - Feel free to use and modify!

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

**Made with ❤️ for anonymous conversations**

