# Stranger Chat - Anonymous Chat System

A real-time anonymous chat system that connects strangers randomly, similar to Chatroulette.

## Features

- 🎲 **Random Matching** - Connect with random strangers worldwide
- 🔒 **100% Anonymous** - No registration required, no personal data collected
- 💬 **Real-time Messaging** - Instant message delivery with typing indicators
- 🎨 **Modern UI** - Beautiful dark theme with smooth animations
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🔄 **Easy Navigation** - Find new strangers instantly or end chats

## Tech Stack

- **Backend**: Node.js + Express
- **Real-time Communication**: Socket.io
- **Frontend**: Vanilla HTML/CSS/JavaScript

## Installation

1. Make sure you have Node.js installed (version 14 or higher)

2. Navigate to the project directory:
```bash
cd /home/kallungal_anas/webprojects/socialmedia
```

3. Install dependencies:
```bash
npm install
```

4. Start the server:
```bash
npm start
```

5. Open your browser and visit:
```
http://localhost:3000
```

## How to Use

1. Click "Start Chatting" to find a random stranger
2. Wait while the system connects you with someone
3. Once connected, start chatting!
4. Use "Next" to find a new stranger
5. Use "End" to leave the current chat

## Project Structure

```
stranger-chat/
├── package.json          # Project dependencies
├── server.js             # Node.js server with Socket.io
├── README.md             # This file
└── public/
    ├── index.html        # Main HTML file
    ├── styles.css        # Styling
    ├── client.js         # Frontend JavaScript
    └── socket.io.js      # Socket.io client library (auto-generated)
```

## Key Features Explained

### Random Stranger Matching
- Users are placed in a waiting queue
- When two users are both waiting, they're paired together
- Each user gets a unique anonymous ID

### Real-time Communication
- Instant message delivery using WebSocket
- Typing indicators show when partner is typing
- Connection status updates

### Chat Controls
- **Next Stranger**: End current chat and find a new one
- **End Chat**: Leave the current conversation
- Messages are encrypted during transit

## Development

To run in development mode with auto-restart:
```bash
npm run dev
```

## Security Notes

- This is a basic implementation for educational purposes
- In production, consider adding:
  - Message moderation
  - Rate limiting
  - Report functionality
  - SSL/TLS encryption
  - User authentication options

## Making Your Chat Accessible on Local Network

### Quick Start for Local Network

1. **Start the server with automatic IP detection:**
```bash
chmod +x start-local.sh
./start-local.sh
```

This will display your local IP address and a URL you can share with others on your network.

2. **Or start the server manually:**
```bash
npm start
```

3. **Find your local IP address:**
```bash
hostname -I
```

### Access URLs

- **On your computer:** http://localhost:3000
- **Other devices on your network:** http://YOUR_IP_ADDRESS:3000

Example: If your IP is `192.168.1.100`, users should visit:
```
http://192.168.1.100:3000
```

### Requirements for Local Network Access

- All devices must be on the **same WiFi/network**
- Make sure port 3000 is not blocked by firewall
- Users need a modern web browser (Chrome, Firefox, Safari, Edge)

### Firewall Setup (if needed)

**Linux (ufw):**
```bash
sudo ufw allow 3000
```

**Windows:**
- Go to Windows Firewall > Advanced Settings > Inbound Rules
- Add a new rule allowing port 3000

## License

MIT License - Feel free to use and modify!

