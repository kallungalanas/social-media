const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Store waiting users and active chat pairs
// Use socket.id as keys for proper socket lookup
const waitingUsers = [];
const activeChats = new Map();

// Generate random user ID (for display only)
function generateUserId() {
    return uuidv4().substring(0, 8);
}

// Find a match for a user
function findMatch(socketId) {
    // Find someone else waiting (excluding the current user)
    const matchIndex = waitingUsers.findIndex(id => id !== socketId);
    
    if (matchIndex !== -1) {
        // Remove from waiting list
        const matchedSocketId = waitingUsers[matchIndex];
        waitingUsers.splice(matchIndex, 1);
        return matchedSocketId;
    }
    return null;
}

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);
    
    // Assign a unique user ID for display
    const displayUserId = generateUserId();
    socket.displayUserId = displayUserId;
    
    // Send welcome message
    socket.emit('system_message', {
        type: 'welcome',
        message: 'Welcome to Stranger Chat!',
        userId: displayUserId
    });
    
    // User wants to find a stranger
    socket.on('find_stranger', () => {
        console.log(`User ${socket.id} (${displayUserId}) is looking for a stranger`);
        
        // Check if user is already in a chat
        if (activeChats.has(socket.id)) {
            socket.emit('system_message', {
                type: 'error',
                message: 'You are already in a chat!'
            });
            return;
        }
        
        // Add to waiting list using socket.id
        waitingUsers.push(socket.id);
        socket.emit('system_message', {
            type: 'waiting',
            message: 'Looking for a stranger...'
        });
        
        // Try to find a match using socket.id
        const matchedSocketId = findMatch(socket.id);
        
        if (matchedSocketId) {
            // Create chat pair using socket.id as keys
            activeChats.set(socket.id, matchedSocketId);
            activeChats.set(matchedSocketId, socket.id);
            
            // Get the matched socket using socket.id
            const matchedSocket = io.sockets.sockets.get(matchedSocketId);
            
            if (matchedSocket) {
                // Notify both users with partner's display ID
                const partnerDisplayId = matchedSocket.displayUserId;
                socket.emit('chat_started', { partnerId: partnerDisplayId });
                matchedSocket.emit('chat_started', { partnerId: displayUserId });
                
                console.log(`Chat started between ${socket.id} (${displayUserId}) and ${matchedSocketId} (${partnerDisplayId})`);
            } else {
                // Matched user disconnected, remove from waiting
                const index = waitingUsers.indexOf(socket.id);
                if (index !== -1) {
                    waitingUsers.splice(index, 1);
                }
                socket.emit('system_message', {
                    type: 'error',
                    message: 'Stranger disconnected. Looking for a new one...'
                });
            }
        }
    });
    
    // Handle sending messages
    socket.on('send_message', (data) => {
        const partnerSocketId = activeChats.get(socket.id);
        
        if (partnerSocketId) {
            const partnerSocket = io.sockets.sockets.get(partnerSocketId);
            if (partnerSocket) {
                partnerSocket.emit('receive_message', {
                    senderId: displayUserId,
                    message: data.message,
                    timestamp: new Date().toISOString()
                });
            }
        }
    });
    
    // Handle typing indicator
    socket.on('typing', () => {
        const partnerSocketId = activeChats.get(socket.id);
        if (partnerSocketId) {
            const partnerSocket = io.sockets.sockets.get(partnerSocketId);
            if (partnerSocket) {
                partnerSocket.emit('partner_typing');
            }
        }
    });
    
    // Handle stop typing
    socket.on('stop_typing', () => {
        const partnerSocketId = activeChats.get(socket.id);
        if (partnerSocketId) {
            const partnerSocket = io.sockets.sockets.get(partnerSocketId);
            if (partnerSocket) {
                partnerSocket.emit('partner_stop_typing');
            }
        }
    });
    
    // User wants to end chat
    socket.on('end_chat', () => {
        endChat(socket.id, socket);
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} (${displayUserId}) disconnected`);
        endChat(socket.id, socket);
        
        // Remove from waiting list if they were waiting
        const index = waitingUsers.indexOf(socket.id);
        if (index !== -1) {
            waitingUsers.splice(index, 1);
        }
    });
});

// End chat function
function endChat(socketId, socket) {
    const partnerSocketId = activeChats.get(socketId);
    
    if (partnerSocketId) {
        const partnerSocket = io.sockets.sockets.get(partnerSocketId);
        
        // Remove from active chats
        activeChats.delete(socketId);
        activeChats.delete(partnerSocketId);
        
        // Notify both users
        if (partnerSocket) {
            partnerSocket.emit('chat_ended', {
                message: 'Stranger has left the chat'
            });
        }
        
        socket.emit('chat_ended', {
            message: 'You have left the chat'
        });
        
        console.log(`Chat ended between ${socketId} and ${partnerSocketId}`);
    }
}

// Start server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

